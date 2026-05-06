-- HeatPumpClarity — Complete Database Schema
-- Generated from migrations 001, 002, and 003.
-- Source of truth for the schema. Keep this file up-to-date whenever
-- a schema change is made. See docs/SUPABASE_DEV_SETUP.md for workflow.
--
-- To bootstrap a new Supabase project (dev or production):
--   1. Open the project's SQL Editor in the Supabase dashboard
--   2. Paste this entire file and click Run
--   3. Then run supabase/seed.sql to populate sample data (optional)

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLES
-- ─────────────────────────────────────────────────────────────────────────────

-- Users (Supabase auth handles core auth, this extends it)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT DEFAULT 'homeowner' CHECK (role IN ('homeowner', 'contractor', 'admin')),
  full_name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contractors (extends users where role = 'contractor')
CREATE TABLE contractors (
  id UUID PRIMARY KEY REFERENCES users(id),
  company_name TEXT NOT NULL,
  license_number TEXT,
  address TEXT,
  city TEXT,
  state TEXT DEFAULT 'NY',
  zip TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Homeowners
CREATE TABLE homeowners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT DEFAULT 'NY',
  zip TEXT,
  utility TEXT,
  home_type TEXT, -- single_family, multi_family_2_4, condo
  is_dac BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id), -- nullable; anonymous submissions stay NULL
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contractor_id UUID REFERENCES contractors(id),
  homeowner_id UUID REFERENCES homeowners(id),
  address TEXT NOT NULL,
  city TEXT,
  state TEXT DEFAULT 'NY',
  zip TEXT,
  utility TEXT NOT NULL,
  category TEXT NOT NULL, -- cat_2, cat_2a, cat_2b, cat_3, cat_4, cat_5, cat_5a, cat_5b
  category_label TEXT,    -- plain English name per Program Manual Section 2.1.2
  home_type TEXT,
  is_new_construction BOOLEAN DEFAULT FALSE,
  is_dac BOOLEAN DEFAULT FALSE,
  estimated_incentive DECIMAL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'in_progress', 'complete', 'denied')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Documents
CREATE TABLE project_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL, -- customer_agreement, equipment_specs, ahri_cert, permit, pre_photo, post_photo, invoice, manual_j, etc.
  doc_label TEXT NOT NULL,
  file_url TEXT,   -- Supabase storage URL
  file_name TEXT,
  status TEXT DEFAULT 'missing' CHECK (status IN ('missing', 'uploaded', 'approved', 'rejected')),
  required BOOLEAN DEFAULT TRUE,
  notes TEXT,
  uploaded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Utility Rules (incentive rates per utility × category × building type)
-- All amounts are flat dollars per project (not per ton or per unit).
-- Source: NYS Clean Heat Heat Pump Program Manual, Version 2, March 5 2026.
CREATE TABLE utility_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  utility TEXT NOT NULL,
  category TEXT NOT NULL,
  category_label TEXT NOT NULL,
  base_incentive DECIMAL NOT NULL,  -- flat dollars, non-DAC
  dac_incentive DECIMAL,            -- flat dollars, DAC-eligible
  building_type TEXT,               -- 'single_family' | 'apartment_or_small_sf' | 'whole_building'
  construction TEXT,                -- 'retrofit' | 'new_construction' | NULL (applies to both)
  retail_only BOOLEAN DEFAULT FALSE, -- true for National Grid cat_5a (midstream retail channel)
  min_efficiency TEXT,
  notes TEXT,
  active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Incentive Rates (reserved for future detailed breakdown; not currently populated)
CREATE TABLE incentive_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  utility TEXT NOT NULL,
  category TEXT NOT NULL,
  tier TEXT,
  amount DECIMAL NOT NULL,
  unit TEXT DEFAULT 'per_ton',
  conditions JSONB,
  effective_date DATE,
  expiration_date DATE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Eligibility Checks (leads from wizard)
CREATE TABLE eligibility_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  utility TEXT,
  home_type TEXT,
  project_type TEXT,
  equipment_type TEXT,
  is_new_construction BOOLEAN,
  is_dac BOOLEAN,
  estimated_category TEXT,
  estimated_incentive DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Manual Updates (CMS for admin announcements)
CREATE TABLE manual_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT, -- eligibility_wizard, estimate_page, contractor_referral
  email TEXT,
  phone TEXT,
  name TEXT,
  utility TEXT,
  interest TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────────────────────────────────────

CREATE INDEX idx_projects_contractor ON projects(contractor_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_project_documents_project ON project_documents(project_id);
CREATE INDEX idx_utility_rules_utility_category ON utility_rules(utility, category);
CREATE INDEX idx_incentive_rates_utility_category ON incentive_rates(utility, category);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
CREATE INDEX idx_eligibility_checks_created ON eligibility_checks(created_at DESC);
CREATE INDEX homeowners_user_id_idx ON homeowners(user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- FUNCTIONS AND TRIGGERS
-- ─────────────────────────────────────────────────────────────────────────────

-- Auto-update updated_at on projects
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

-- Helper: is the calling user an admin? Used in RLS policies.
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ─────────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors        ENABLE ROW LEVEL SECURITY;
ALTER TABLE homeowners         ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects           ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_documents  ENABLE ROW LEVEL SECURITY;
ALTER TABLE utility_rules      ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_updates     ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads              ENABLE ROW LEVEL SECURITY;

-- users
CREATE POLICY users_select_own   ON users FOR SELECT USING (id = auth.uid());
CREATE POLICY users_select_admin ON users FOR SELECT USING (is_admin());
CREATE POLICY users_update_own   ON users FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND role = (SELECT role FROM users WHERE id = auth.uid()));
CREATE POLICY users_update_admin ON users FOR UPDATE USING (is_admin());
-- No INSERT policy — only service_role can insert (triggered after auth.signUp)

-- contractors
CREATE POLICY contractors_select_own    ON contractors FOR SELECT USING (id = auth.uid());
CREATE POLICY contractors_select_admin  ON contractors FOR SELECT USING (is_admin());
CREATE POLICY contractors_update_own    ON contractors FOR UPDATE USING (id = auth.uid());
CREATE POLICY contractors_update_admin  ON contractors FOR UPDATE USING (is_admin());
CREATE POLICY contractors_insert_own    ON contractors FOR INSERT WITH CHECK (id = auth.uid());

-- homeowners
CREATE POLICY homeowners_select_own ON homeowners
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY homeowners_select_contractor ON homeowners
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.homeowner_id = homeowners.id
        AND projects.contractor_id = auth.uid()
    )
  );
CREATE POLICY homeowners_select_admin ON homeowners FOR SELECT USING (is_admin());
CREATE POLICY homeowners_insert_anon  ON homeowners FOR INSERT WITH CHECK (true); -- eligibility wizard, no auth required
CREATE POLICY homeowners_update_own   ON homeowners FOR UPDATE USING (user_id = auth.uid());

-- projects
CREATE POLICY projects_select_contractor ON projects FOR SELECT USING (contractor_id = auth.uid());
CREATE POLICY projects_insert_contractor ON projects FOR INSERT WITH CHECK (contractor_id = auth.uid());
CREATE POLICY projects_update_contractor ON projects FOR UPDATE USING (contractor_id = auth.uid());
CREATE POLICY projects_select_homeowner  ON projects
  FOR SELECT USING (homeowner_id IN (SELECT id FROM homeowners WHERE user_id = auth.uid()));
CREATE POLICY projects_select_admin ON projects FOR SELECT USING (is_admin());
CREATE POLICY projects_update_admin ON projects FOR UPDATE USING (is_admin());
CREATE POLICY projects_delete_admin ON projects FOR DELETE USING (is_admin());

-- project_documents
CREATE POLICY docs_select_contractor ON project_documents
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_documents.project_id AND projects.contractor_id = auth.uid()
  ));
CREATE POLICY docs_insert_contractor ON project_documents
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_documents.project_id AND projects.contractor_id = auth.uid()
  ));
CREATE POLICY docs_update_contractor ON project_documents
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_documents.project_id AND projects.contractor_id = auth.uid()
  ));
CREATE POLICY docs_select_homeowner ON project_documents
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM projects
    JOIN homeowners ON homeowners.id = projects.homeowner_id
    WHERE projects.id = project_documents.project_id AND homeowners.user_id = auth.uid()
  ));
CREATE POLICY docs_select_admin ON project_documents FOR SELECT USING (is_admin());
CREATE POLICY docs_update_admin ON project_documents FOR UPDATE USING (is_admin());
CREATE POLICY docs_delete_admin ON project_documents FOR DELETE USING (is_admin());

-- utility_rules — public read, admin write
CREATE POLICY utility_rules_select_public ON utility_rules FOR SELECT USING (true);
CREATE POLICY utility_rules_insert_admin  ON utility_rules FOR INSERT WITH CHECK (is_admin());
CREATE POLICY utility_rules_update_admin  ON utility_rules FOR UPDATE USING (is_admin());
CREATE POLICY utility_rules_delete_admin  ON utility_rules FOR DELETE USING (is_admin());

-- manual_updates — published entries are public, admin sees all
CREATE POLICY updates_select_published ON manual_updates FOR SELECT USING (published = true);
CREATE POLICY updates_select_admin     ON manual_updates FOR SELECT USING (is_admin());
CREATE POLICY updates_insert_admin     ON manual_updates FOR INSERT WITH CHECK (is_admin());
CREATE POLICY updates_update_admin     ON manual_updates FOR UPDATE USING (is_admin());
CREATE POLICY updates_delete_admin     ON manual_updates FOR DELETE USING (is_admin());

-- leads — anyone can submit (anon key), only admin can read/manage
CREATE POLICY leads_insert_anon   ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY leads_select_admin  ON leads FOR SELECT USING (is_admin());
CREATE POLICY leads_update_admin  ON leads FOR UPDATE USING (is_admin());
CREATE POLICY leads_delete_admin  ON leads FOR DELETE USING (is_admin());

-- ─────────────────────────────────────────────────────────────────────────────
-- UTILITY RULES DATA
-- All amounts are flat dollars per project per NYS Clean Heat Program Manual
-- Version 2, March 5 2026, Tables 3-15.
-- ─────────────────────────────────────────────────────────────────────────────

-- CON EDISON — No cat_2, no cat_5, no cat_5b.
INSERT INTO utility_rules (utility, category, category_label, building_type, construction, base_incentive, dac_incentive, retail_only) VALUES
('con_edison', 'cat_2a', 'ccASHP Full Load with Integrated Controls',  'single_family',         'retrofit', 2500,  4500,  false),
('con_edison', 'cat_2a', 'ccASHP Full Load with Integrated Controls',  'apartment_or_small_sf', 'retrofit', 1000,  2000,  false),
('con_edison', 'cat_2b', 'ccASHP Full Load with Decommissioning',      'single_family',         'retrofit', 8000,  10000, false),
('con_edison', 'cat_2b', 'ccASHP Full Load with Decommissioning',      'apartment_or_small_sf', 'retrofit', 4000,  5000,  false),
('con_edison', 'cat_3',  'GSHP Residential Full Load Heating',         'whole_building',        NULL,       30000, 40000, false),
('con_edison', 'cat_4',  'Partial-to-Full Load (ASHP)',                'single_family',         NULL,       4000,  4000,  false),
('con_edison', 'cat_4',  'Partial-to-Full Load (ASHP)',                'apartment_or_small_sf', NULL,       1500,  1500,  false),
('con_edison', 'cat_5a', 'Midstream HPWH',                            'single_family',         NULL,       1000,  1000,  false),
('con_edison', 'cat_5a', 'Midstream HPWH',                            'apartment_or_small_sf', NULL,       1000,  1000,  false);

-- NATIONAL GRID — No cat_2a.
INSERT INTO utility_rules (utility, category, category_label, building_type, construction, base_incentive, dac_incentive, retail_only) VALUES
('national_grid', 'cat_2',  'ccASHP Full Load Heating',               'single_family',         'retrofit',         6000,  8000,  false),
('national_grid', 'cat_2',  'ccASHP Full Load Heating',               'apartment_or_small_sf', 'retrofit',         3000,  4000,  false),
('national_grid', 'cat_2b', 'ccASHP Full Load with Decommissioning',  'single_family',         'retrofit',         10000, 12000, false),
('national_grid', 'cat_2b', 'ccASHP Full Load with Decommissioning',  'apartment_or_small_sf', 'retrofit',         5000,  6000,  false),
('national_grid', 'cat_3',  'GSHP Residential Full Load Heating',     'single_family',         'retrofit',         20000, 25000, false),
('national_grid', 'cat_3',  'GSHP Residential Full Load Heating',     'single_family',         'new_construction', 14000, 19000, false),
('national_grid', 'cat_3',  'GSHP Residential Full Load Heating',     'apartment_or_small_sf', 'retrofit',         10000, 12500, false),
('national_grid', 'cat_3',  'GSHP Residential Full Load Heating',     'apartment_or_small_sf', 'new_construction', 7000,  9500,  false),
('national_grid', 'cat_4',  'Partial-to-Full Load (ASHP)',            'single_family',         NULL,               4000,  4000,  false),
('national_grid', 'cat_4',  'Partial-to-Full Load (ASHP)',            'apartment_or_small_sf', NULL,               2000,  2000,  false),
('national_grid', 'cat_5',  'Downstream Domestic Water Heating',      'single_family',         NULL,               1250,  1250,  false),
('national_grid', 'cat_5',  'Downstream Domestic Water Heating',      'apartment_or_small_sf', NULL,               1250,  1250,  false),
('national_grid', 'cat_5a', 'Midstream HPWH',                        'single_family',         NULL,               1250,  1250,  true),
('national_grid', 'cat_5a', 'Midstream HPWH',                        'apartment_or_small_sf', NULL,               1250,  1250,  true),
('national_grid', 'cat_5b', 'GSHP Desuperheater',                    'single_family',         NULL,               100,   100,   false),
('national_grid', 'cat_5b', 'GSHP Desuperheater',                    'apartment_or_small_sf', NULL,               100,   100,   false);

-- NYSEG — No cat_2a.
INSERT INTO utility_rules (utility, category, category_label, building_type, construction, base_incentive, dac_incentive, retail_only) VALUES
('nyseg', 'cat_2',  'ccASHP Full Load Heating',               'single_family',         'retrofit',         6000,  7000,  false),
('nyseg', 'cat_2',  'ccASHP Full Load Heating',               'apartment_or_small_sf', 'retrofit',         3000,  4000,  false),
('nyseg', 'cat_2b', 'ccASHP Full Load with Decommissioning',  'single_family',         'retrofit',         10000, 11000, false),
('nyseg', 'cat_2b', 'ccASHP Full Load with Decommissioning',  'apartment_or_small_sf', 'retrofit',         5000,  6000,  false),
('nyseg', 'cat_3',  'GSHP Residential Full Load Heating',     'single_family',         'retrofit',         17000, 18000, false),
('nyseg', 'cat_3',  'GSHP Residential Full Load Heating',     'single_family',         'new_construction', 10000, 11000, false),
('nyseg', 'cat_3',  'GSHP Residential Full Load Heating',     'apartment_or_small_sf', 'retrofit',         7000,  8000,  false),
('nyseg', 'cat_3',  'GSHP Residential Full Load Heating',     'apartment_or_small_sf', 'new_construction', 5000,  6000,  false),
('nyseg', 'cat_4',  'Partial-to-Full Load (ASHP)',            'single_family',         NULL,               3000,  3000,  false),
('nyseg', 'cat_4',  'Partial-to-Full Load (ASHP)',            'apartment_or_small_sf', NULL,               1000,  1000,  false),
('nyseg', 'cat_5',  'Downstream Domestic Water Heating',      'single_family',         NULL,               1250,  1250,  false),
('nyseg', 'cat_5',  'Downstream Domestic Water Heating',      'apartment_or_small_sf', NULL,               1250,  1250,  false),
('nyseg', 'cat_5a', 'Midstream HPWH',                        'single_family',         NULL,               1250,  1250,  false),
('nyseg', 'cat_5a', 'Midstream HPWH',                        'apartment_or_small_sf', NULL,               1250,  1250,  false),
('nyseg', 'cat_5b', 'GSHP Desuperheater',                    'single_family',         NULL,               100,   100,   false),
('nyseg', 'cat_5b', 'GSHP Desuperheater',                    'apartment_or_small_sf', NULL,               100,   100,   false);

-- RG&E — No cat_2a. single_family non-DAC == DAC for cat_2 and cat_2b.
INSERT INTO utility_rules (utility, category, category_label, building_type, construction, base_incentive, dac_incentive, retail_only) VALUES
('rge', 'cat_2',  'ccASHP Full Load Heating',               'single_family',         'retrofit',         6000,  6000,  false),
('rge', 'cat_2',  'ccASHP Full Load Heating',               'apartment_or_small_sf', 'retrofit',         3000,  4000,  false),
('rge', 'cat_2b', 'ccASHP Full Load with Decommissioning',  'single_family',         'retrofit',         10000, 10000, false),
('rge', 'cat_2b', 'ccASHP Full Load with Decommissioning',  'apartment_or_small_sf', 'retrofit',         5000,  6000,  false),
('rge', 'cat_3',  'GSHP Residential Full Load Heating',     'single_family',         'retrofit',         17000, 18000, false),
('rge', 'cat_3',  'GSHP Residential Full Load Heating',     'single_family',         'new_construction', 10000, 11000, false),
('rge', 'cat_3',  'GSHP Residential Full Load Heating',     'apartment_or_small_sf', 'retrofit',         7000,  8000,  false),
('rge', 'cat_3',  'GSHP Residential Full Load Heating',     'apartment_or_small_sf', 'new_construction', 5000,  6000,  false),
('rge', 'cat_4',  'Partial-to-Full Load (ASHP)',            'single_family',         NULL,               3000,  3000,  false),
('rge', 'cat_4',  'Partial-to-Full Load (ASHP)',            'apartment_or_small_sf', NULL,               1000,  1000,  false),
('rge', 'cat_5',  'Downstream Domestic Water Heating',      'single_family',         NULL,               1250,  1250,  false),
('rge', 'cat_5',  'Downstream Domestic Water Heating',      'apartment_or_small_sf', NULL,               1250,  1250,  false),
('rge', 'cat_5a', 'Midstream HPWH',                        'single_family',         NULL,               1250,  1250,  false),
('rge', 'cat_5a', 'Midstream HPWH',                        'apartment_or_small_sf', NULL,               1250,  1250,  false),
('rge', 'cat_5b', 'GSHP Desuperheater',                    'single_family',         NULL,               100,   100,   false),
('rge', 'cat_5b', 'GSHP Desuperheater',                    'apartment_or_small_sf', NULL,               100,   100,   false);

-- ORANGE & ROCKLAND — No cat_2a. No cat_5b.
INSERT INTO utility_rules (utility, category, category_label, building_type, construction, base_incentive, dac_incentive, retail_only) VALUES
('orange_rockland', 'cat_2',  'ccASHP Full Load Heating',               'single_family',         'retrofit',         5000,  6000,  false),
('orange_rockland', 'cat_2',  'ccASHP Full Load Heating',               'apartment_or_small_sf', 'retrofit',         3000,  4000,  false),
('orange_rockland', 'cat_2b', 'ccASHP Full Load with Decommissioning',  'single_family',         'retrofit',         9000,  10000, false),
('orange_rockland', 'cat_2b', 'ccASHP Full Load with Decommissioning',  'apartment_or_small_sf', 'retrofit',         5500,  6500,  false),
('orange_rockland', 'cat_3',  'GSHP Residential Full Load Heating',     'single_family',         'retrofit',         14000, 15000, false),
('orange_rockland', 'cat_3',  'GSHP Residential Full Load Heating',     'single_family',         'new_construction', 7000,  8000,  false),
('orange_rockland', 'cat_3',  'GSHP Residential Full Load Heating',     'apartment_or_small_sf', 'retrofit',         6000,  7000,  false),
('orange_rockland', 'cat_3',  'GSHP Residential Full Load Heating',     'apartment_or_small_sf', 'new_construction', 3500,  4500,  false),
('orange_rockland', 'cat_4',  'Partial-to-Full Load (ASHP)',            'single_family',         NULL,               3000,  3000,  false),
('orange_rockland', 'cat_4',  'Partial-to-Full Load (ASHP)',            'apartment_or_small_sf', NULL,               1000,  1000,  false),
('orange_rockland', 'cat_5',  'Downstream Domestic Water Heating',      'single_family',         NULL,               1250,  1250,  false),
('orange_rockland', 'cat_5',  'Downstream Domestic Water Heating',      'apartment_or_small_sf', NULL,               1250,  1250,  false),
('orange_rockland', 'cat_5a', 'Midstream HPWH',                        'single_family',         NULL,               1250,  1250,  false),
('orange_rockland', 'cat_5a', 'Midstream HPWH',                        'apartment_or_small_sf', NULL,               1250,  1250,  false);

-- CENTRAL HUDSON — No cat_2a. No DAC split (territory-wide 85% cost cap).
-- baseIncentive == dacIncentive for all Central Hudson rows.
INSERT INTO utility_rules (utility, category, category_label, building_type, construction, base_incentive, dac_incentive, retail_only) VALUES
('central_hudson', 'cat_2',  'ccASHP Full Load Heating',               'single_family',         'retrofit',         5000,  5000,  false),
('central_hudson', 'cat_2',  'ccASHP Full Load Heating',               'apartment_or_small_sf', 'retrofit',         3000,  3000,  false),
('central_hudson', 'cat_2b', 'ccASHP Full Load with Decommissioning',  'single_family',         'retrofit',         8000,  8000,  false),
('central_hudson', 'cat_2b', 'ccASHP Full Load with Decommissioning',  'apartment_or_small_sf', 'retrofit',         5000,  5000,  false),
('central_hudson', 'cat_3',  'GSHP Residential Full Load Heating',     'single_family',         'retrofit',         18000, 18000, false),
('central_hudson', 'cat_3',  'GSHP Residential Full Load Heating',     'single_family',         'new_construction', 8000,  8000,  false),
('central_hudson', 'cat_3',  'GSHP Residential Full Load Heating',     'apartment_or_small_sf', 'retrofit',         8000,  8000,  false),
('central_hudson', 'cat_3',  'GSHP Residential Full Load Heating',     'apartment_or_small_sf', 'new_construction', 4000,  4000,  false),
('central_hudson', 'cat_4',  'Partial-to-Full Load (ASHP)',            'single_family',         NULL,               3000,  3000,  false),
('central_hudson', 'cat_4',  'Partial-to-Full Load (ASHP)',            'apartment_or_small_sf', NULL,               1000,  1000,  false),
('central_hudson', 'cat_5',  'Downstream Domestic Water Heating',      'single_family',         NULL,               1250,  1250,  false),
('central_hudson', 'cat_5',  'Downstream Domestic Water Heating',      'apartment_or_small_sf', NULL,               1250,  1250,  false),
('central_hudson', 'cat_5a', 'Midstream HPWH',                        'single_family',         NULL,               1250,  1250,  false),
('central_hudson', 'cat_5a', 'Midstream HPWH',                        'apartment_or_small_sf', NULL,               1250,  1250,  false),
('central_hudson', 'cat_5b', 'GSHP Desuperheater',                    'single_family',         NULL,               100,   100,   false),
('central_hudson', 'cat_5b', 'GSHP Desuperheater',                    'apartment_or_small_sf', NULL,               100,   100,   false);

COMMIT;
