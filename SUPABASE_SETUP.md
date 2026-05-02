# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to https://supabase.com and sign in or create an account.
2. Click "New project" and fill in:
   - Organization
   - Project name (e.g., "heatpump-clarity")
   - Database password (save this securely)
   - Region (choose one close to your users, e.g., US East)
3. Wait for the project to be provisioned (~2 minutes).

## 2. Run Migrations

Open the SQL Editor in your Supabase dashboard (Database > SQL Editor).

Run the migrations in order:

**Migration 1 — Base schema:**
Copy and paste the contents of `supabase/migrations/001_schema.sql` and click Run.

**Migration 2 — RLS policies and fixes:**
Copy and paste the contents of `supabase/migrations/002_rls_and_fixes.sql` and click Run.

## 3. Run seed.sql

Copy and paste the contents of `supabase/seed.sql` into the SQL Editor and run it.
This populates the utility_rules and incentive_rates tables with NYS Clean Heat data.

## 4. Create Storage Bucket

1. Go to Storage in your Supabase dashboard.
2. Click "Create a new bucket".
3. Name it exactly: `project-documents`
4. Set visibility to **Private** (not public).
5. Click Save.

Add storage policies (Storage > Policies > project-documents bucket):

**Allow contractors to upload their project files:**
```sql
CREATE POLICY "Contractors can upload project documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-documents'
  AND EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role IN ('contractor', 'admin')
  )
);
```

**Allow contractors to read their own project files:**
```sql
CREATE POLICY "Contractors can read project documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'project-documents'
  AND EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role IN ('contractor', 'admin')
  )
);
```

**Allow contractors to update their project files:**
```sql
CREATE POLICY "Contractors can update project documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'project-documents'
  AND EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role IN ('contractor', 'admin')
  )
);
```

## 5. Set Environment Variables

Create a `.env.local` file in the project root (copy from `.env.example`):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Find these values in your Supabase project under:
- Settings > API > Project URL
- Settings > API > Project API keys > `anon` (public)
- Settings > API > Project API keys > `service_role` (secret — never expose this client-side)

## 6. Create Your First Admin

After signing up through the app (/auth/signup), promote your account to admin via the SQL Editor:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

You can then access the /admin panel with full privileges.

## 7. Test RLS Policies

Open the SQL Editor and run these queries to verify your RLS setup:

**Test: anon users cannot read projects**
```sql
SET ROLE anon;
SELECT * FROM projects;
-- Should return 0 rows (RLS blocks anon access)
RESET ROLE;
```

**Test: authenticated user can only see their own projects**
```sql
-- As authenticated user (replace with real UUID)
SET LOCAL role TO authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "YOUR-USER-UUID", "role": "authenticated"}';
SELECT * FROM projects;
-- Should only return projects where contractor_id = YOUR-USER-UUID
RESET ROLE;
```

**Test: leads table is insert-only for anon**
```sql
SET ROLE anon;
INSERT INTO leads (email, source) VALUES ('test@test.com', 'test');
-- Should succeed (anon can insert leads)
SELECT * FROM leads;
-- Should return 0 rows (anon cannot read leads)
RESET ROLE;
```

**Test: only admins can read all leads**
```sql
-- As authenticated admin user
SELECT * FROM leads;
-- Should return all rows when your role = 'admin'
```

**Test: manual_updates — only published rows visible to non-admins**
```sql
SELECT * FROM manual_updates WHERE published = true;
-- Should work for all authenticated users
SELECT * FROM manual_updates WHERE published = false;
-- Should return 0 rows for non-admin users
```
