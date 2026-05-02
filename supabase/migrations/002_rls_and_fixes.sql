-- HeatPumpClarity Migration 002
-- Adds: user_id to homeowners, RLS on all tables, updated_at trigger

-- ─── updated_at trigger ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── Link homeowners to auth users (nullable — anonymous submissions stay NULL) ─
ALTER TABLE homeowners ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS homeowners_user_id_idx ON homeowners(user_id);

-- ─── Enable RLS on every table ────────────────────────────────────────────────
ALTER TABLE users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors        ENABLE ROW LEVEL SECURITY;
ALTER TABLE homeowners         ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects           ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_documents  ENABLE ROW LEVEL SECURITY;
ALTER TABLE utility_rules      ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_updates     ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads              ENABLE ROW LEVEL SECURITY;

-- ─── Helper: is the calling user an admin? ────────────────────────────────────
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ─── users ────────────────────────────────────────────────────────────────────
-- Any authenticated user can read their own row
CREATE POLICY users_select_own ON users
  FOR SELECT USING (id = auth.uid());

-- Admins can read all users
CREATE POLICY users_select_admin ON users
  FOR SELECT USING (is_admin());

-- Users can update their own non-role fields
CREATE POLICY users_update_own ON users
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND role = (SELECT role FROM users WHERE id = auth.uid()));

-- Admins can update any user (including role changes)
CREATE POLICY users_update_admin ON users
  FOR UPDATE USING (is_admin());

-- Insert only via service_role (triggered after auth.signUp in server action)
-- No INSERT policy = only service_role can insert

-- ─── contractors ──────────────────────────────────────────────────────────────
CREATE POLICY contractors_select_own ON contractors
  FOR SELECT USING (id = auth.uid());

CREATE POLICY contractors_select_admin ON contractors
  FOR SELECT USING (is_admin());

CREATE POLICY contractors_update_own ON contractors
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY contractors_update_admin ON contractors
  FOR UPDATE USING (is_admin());

CREATE POLICY contractors_insert_own ON contractors
  FOR INSERT WITH CHECK (id = auth.uid());

-- ─── homeowners ───────────────────────────────────────────────────────────────
-- Authenticated homeowners see their own row (linked by user_id)
CREATE POLICY homeowners_select_own ON homeowners
  FOR SELECT USING (user_id = auth.uid());

-- Contractors see homeowners linked to their projects
CREATE POLICY homeowners_select_contractor ON homeowners
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.homeowner_id = homeowners.id
        AND projects.contractor_id = auth.uid()
    )
  );

-- Admins see all
CREATE POLICY homeowners_select_admin ON homeowners
  FOR SELECT USING (is_admin());

-- Anonymous INSERT allowed (eligibility wizard — no account needed)
CREATE POLICY homeowners_insert_anon ON homeowners
  FOR INSERT WITH CHECK (true);

-- Authenticated homeowner can update their own row
CREATE POLICY homeowners_update_own ON homeowners
  FOR UPDATE USING (user_id = auth.uid());

-- ─── projects ─────────────────────────────────────────────────────────────────
-- Contractors see and manage their own projects
CREATE POLICY projects_select_contractor ON projects
  FOR SELECT USING (contractor_id = auth.uid());

CREATE POLICY projects_insert_contractor ON projects
  FOR INSERT WITH CHECK (contractor_id = auth.uid());

CREATE POLICY projects_update_contractor ON projects
  FOR UPDATE USING (contractor_id = auth.uid());

-- Homeowners can view their own projects (read-only)
CREATE POLICY projects_select_homeowner ON projects
  FOR SELECT USING (
    homeowner_id IN (
      SELECT id FROM homeowners WHERE user_id = auth.uid()
    )
  );

-- Admins can do everything
CREATE POLICY projects_select_admin ON projects
  FOR SELECT USING (is_admin());

CREATE POLICY projects_update_admin ON projects
  FOR UPDATE USING (is_admin());

CREATE POLICY projects_delete_admin ON projects
  FOR DELETE USING (is_admin());

-- ─── project_documents ────────────────────────────────────────────────────────
-- Contractors manage documents on their own projects
CREATE POLICY docs_select_contractor ON project_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_documents.project_id
        AND projects.contractor_id = auth.uid()
    )
  );

CREATE POLICY docs_insert_contractor ON project_documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_documents.project_id
        AND projects.contractor_id = auth.uid()
    )
  );

CREATE POLICY docs_update_contractor ON project_documents
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_documents.project_id
        AND projects.contractor_id = auth.uid()
    )
  );

-- Homeowners can view documents on their projects (read-only)
CREATE POLICY docs_select_homeowner ON project_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      JOIN homeowners ON homeowners.id = projects.homeowner_id
      WHERE projects.id = project_documents.project_id
        AND homeowners.user_id = auth.uid()
    )
  );

-- Admins can do everything
CREATE POLICY docs_select_admin ON project_documents
  FOR SELECT USING (is_admin());

CREATE POLICY docs_update_admin ON project_documents
  FOR UPDATE USING (is_admin());

CREATE POLICY docs_delete_admin ON project_documents
  FOR DELETE USING (is_admin());

-- ─── utility_rules ────────────────────────────────────────────────────────────
-- Public read (eligibility wizard works without auth)
CREATE POLICY utility_rules_select_public ON utility_rules
  FOR SELECT USING (true);

-- Admin write
CREATE POLICY utility_rules_insert_admin ON utility_rules
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY utility_rules_update_admin ON utility_rules
  FOR UPDATE USING (is_admin());

CREATE POLICY utility_rules_delete_admin ON utility_rules
  FOR DELETE USING (is_admin());

-- ─── manual_updates ───────────────────────────────────────────────────────────
-- Public can read published updates
CREATE POLICY updates_select_published ON manual_updates
  FOR SELECT USING (published = true);

-- Admins see all (including unpublished)
CREATE POLICY updates_select_admin ON manual_updates
  FOR SELECT USING (is_admin());

CREATE POLICY updates_insert_admin ON manual_updates
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY updates_update_admin ON manual_updates
  FOR UPDATE USING (is_admin());

CREATE POLICY updates_delete_admin ON manual_updates
  FOR DELETE USING (is_admin());

-- ─── leads ────────────────────────────────────────────────────────────────────
-- Anyone can submit a lead (anon key from estimate page)
CREATE POLICY leads_insert_anon ON leads
  FOR INSERT WITH CHECK (true);

-- Only admins can read/manage leads
CREATE POLICY leads_select_admin ON leads
  FOR SELECT USING (is_admin());

CREATE POLICY leads_update_admin ON leads
  FOR UPDATE USING (is_admin());

CREATE POLICY leads_delete_admin ON leads
  FOR DELETE USING (is_admin());
