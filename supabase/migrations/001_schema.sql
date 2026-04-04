-- HeatPumpClarity — Full Database Schema
-- NYS Clean Heat SaaS Portal

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
  category_label TEXT, -- plain English name
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
  doc_label TEXT NOT NULL, -- display name
  file_url TEXT, -- Supabase storage URL
  file_name TEXT,
  status TEXT DEFAULT 'missing' CHECK (status IN ('missing', 'uploaded', 'approved', 'rejected')),
  required BOOLEAN DEFAULT TRUE,
  notes TEXT,
  uploaded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Utility Rules (incentive rates per utility × category)
CREATE TABLE utility_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  utility TEXT NOT NULL,
  category TEXT NOT NULL,
  category_label TEXT NOT NULL,
  base_incentive DECIMAL NOT NULL,
  dac_incentive DECIMAL, -- enhanced incentive for DAC
  incentive_unit TEXT DEFAULT 'per_ton', -- per_ton, per_unit, flat
  min_efficiency TEXT, -- e.g., "SEER2 >= 16"
  notes TEXT,
  active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Incentive Rates (detailed breakdown)
CREATE TABLE incentive_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  utility TEXT NOT NULL,
  category TEXT NOT NULL,
  tier TEXT, -- standard, enhanced, dac
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

-- Indexes for common queries
CREATE INDEX idx_projects_contractor ON projects(contractor_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_project_documents_project ON project_documents(project_id);
CREATE INDEX idx_utility_rules_utility_category ON utility_rules(utility, category);
CREATE INDEX idx_incentive_rates_utility_category ON incentive_rates(utility, category);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
CREATE INDEX idx_eligibility_checks_created ON eligibility_checks(created_at DESC);
