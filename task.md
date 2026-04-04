# Build HeatPumpClarity — NYS Clean Heat SaaS Portal

## Overview
Build a simple, easy-to-use SaaS for homeowners and contractors navigating the NYS Clean Heat program. Homeowners check eligibility and get incentive estimates. Contractors manage projects and document checklists. Admin edits incentive tables.

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase for auth + database + storage
- Server actions where useful
- Responsive design (mobile-first)
- shadcn/ui components for consistent UI

## Color Scheme
- Clean, light professional theme (not dark)
- Primary: Blue (#2563eb)
- Secondary: Green (#16a34a) for money/savings
- Background: White/light gray (#f8fafc)
- Warm, trustworthy, accessible for non-technical users 40+

## Important Business Rules
- Focus on residential 1-4 unit projects
- Support utility-specific logic for: Central Hudson, Con Edison, National Grid, NYSEG, RG&E, Orange & Rockland
- Include NYS Clean Heat categories:
  - Category 2: Air Source Heat Pump (Ducted) — New Construction
  - Category 2a: Air Source Heat Pump (Ducted) — Retrofit, Full Displacement
  - Category 2b: Air Source Heat Pump (Ducted) — Retrofit, Partial Displacement
  - Category 3: Air Source Heat Pump (Ductless/Mini-Split)
  - Category 4: Ground Source Heat Pump
  - Category 5: Heat Pump Water Heater — New Construction
  - Category 5a: Heat Pump Water Heater — Replacing Electric
  - Category 5b: Heat Pump Water Heater — Replacing Fossil Fuel
- Show plain-English explanations, not utility jargon
- Add prominent disclaimers that incentives change and final eligibility depends on program rules
- DAC (Disadvantaged Community) toggle for enhanced incentives

## Pages

### 1. `/` — Home Page
- Headline: "Find Out What Heat Pump Incentives You Qualify For"
- Subheadline: "Navigate NYS Clean Heat incentives the easy way — plain English, no jargon."
- CTA for homeowners: "Check My Eligibility" → /eligibility
- CTA for contractors: "Contractor Dashboard" → /contractor
- Benefits section (3-4 cards):
  - "See Your Savings" — instant estimate based on your utility and project
  - "Plain English" — no confusing program codes or utility jargon
  - "Document Checklist" — know exactly what paperwork you need
  - "Always Current" — incentive tables updated as programs change
- Utility coverage section: logos/names of all 6 supported utilities
- Disclaimer banner: "Incentive amounts shown are estimates. Final eligibility and amounts depend on current program rules and utility requirements."

### 2. `/eligibility` — Step Wizard
Multi-step form (one question per step, progress indicator at top):

**Step 1: Home Type**
- Single Family
- 2-4 Unit Multi-Family
- Condo/Co-op

**Step 2: Your Utility**
- Dropdown: Central Hudson, Con Edison, National Grid, NYSEG, RG&E, Orange & Rockland
- Helper text: "Select the utility company on your electric bill"

**Step 3: Project Type**
- New Construction or Existing Home (Retrofit)?
- If Retrofit: Full displacement of fossil fuel or Partial?
- Helper text explaining each option in plain English

**Step 4: Equipment Type**
- Air Source Heat Pump (Ducted)
- Air Source Heat Pump (Ductless/Mini-Split)
- Ground Source Heat Pump
- Heat Pump Water Heater
- Helper text: "Not sure? Most homes use ducted or ductless air source heat pumps."

**Step 5: Additional Details**
- If water heater: Replacing electric or fossil fuel?
- Approximate home size (sq ft) — optional
- DAC (Disadvantaged Community) toggle with explanation: "Check if your address is in a NYS Disadvantaged Community. This may qualify you for enhanced incentives."
- Link to DAC lookup tool

**Step 6: Results**
→ Redirect to /estimate with params

### 3. `/estimate` — Incentive Estimate
- Summary card showing:
  - Your utility
  - Project category (with plain English name)
  - Category code (small, secondary)
  - Estimated incentive range (based on utility + category)
  - DAC bonus if applicable
  - Total estimated savings
- "How to claim" next steps:
  1. Find a participating contractor
  2. Get a proposal
  3. Contractor submits application to NYSERDA
  4. Installation
  5. Post-installation verification
  6. Incentive paid to contractor (passed to you as discount)
- Required documents checklist (based on category)
- CTA: "Find a Contractor" or "Share This Estimate" (email/print)
- Prominent disclaimer banner

### 4. `/contractor` — Contractor Dashboard
- Login/signup (Supabase Auth — email + password)
- After login:
  - Welcome header with company name
  - Stats: Active Projects | Completed | Pending Documents
  - Project list (table/cards):
    - Customer name
    - Address
    - Category
    - Document readiness score (percentage bar)
    - Status badge (Draft, Submitted, Approved, Complete)
    - Last updated
  - "New Project" button
  - Quick filters: All | Active | Needs Docs | Completed

### 5. `/project/[id]` — Project Detail
- Customer info card (name, address, email, phone)
- Project category + utility
- Incentive estimate for this project
- Document checklist with status:
  - [ ] Customer Agreement ✅/⬜
  - [ ] Equipment Specs ✅/⬜
  - [ ] AHRI Certificate ✅/⬜
  - [ ] Permit ✅/⬜
  - [ ] Pre-Installation Photo ✅/⬜
  - [ ] Post-Installation Photo ✅/⬜
  - [ ] Invoice ✅/⬜
  - [ ] Manual J Load Calculation ✅/⬜
  - (varies by category)
- Upload zone for each document
- Warnings/alerts banner (e.g., "Missing 3 required documents", "Permit expires in 14 days")
- Next action prompt: "Upload remaining documents to submit application"
- Activity log/timeline

### 6. `/admin` — Admin Panel
- Protected route (admin role check)
- Tabs:
  - **Incentive Rates**: Table editor for incentive amounts by utility × category
    - Columns: Utility | Category | Base Rate | DAC Rate | Unit | Last Updated
    - Inline edit or modal edit
    - "Publish Changes" button
  - **Rules & Text**: Edit rule descriptions, eligibility text, helper text
    - Key-value editor (rule_key → display text)
  - **Manual Updates**: CMS-style update log
    - Date | Title | Description | Published (yes/no)
    - These show as a "Recent Updates" banner on the site
  - **Leads**: View homeowner eligibility checks (email, utility, category, date)

## Database Schema (Supabase/PostgreSQL)

```sql
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
```

## Seed Data

### Utility Rules (sample — use realistic NYS Clean Heat numbers)
Insert at least 3 utilities × 4 categories with realistic incentive amounts:

**Con Edison examples:**
- Cat 2 (ASHP Ducted, New): $1,000/ton base, $1,500/ton DAC
- Cat 2a (ASHP Ducted, Retrofit Full): $1,200/ton base, $1,800/ton DAC
- Cat 3 (Ductless): $500/unit base, $750/unit DAC
- Cat 4 (GSHP): $1,500/ton base, $2,000/ton DAC
- Cat 5b (HPWH replacing fossil): $700/unit base, $1,000/unit DAC

**National Grid examples:** Similar but with slight variations

**Central Hudson examples:** Similar

### Sample Projects (3-4)
- Draft project with 2/8 docs uploaded
- In-progress project with 6/8 docs
- Complete project with all docs
- Denied project with warnings

### Sample Manual Updates
- "March 2026: NYSERDA updated Category 2a incentive rates for Con Edison territory"
- "February 2026: DAC bonus amounts increased for ground source installations"

## UX Rules
- Every screen should feel simple and guided
- Use checklists, cards, step indicators, and warning banners
- Avoid overwhelming forms — one question per step in the wizard
- Add helper text beside every important field
- Green for completed/success, amber for warnings, red for errors
- Progress bars for document readiness
- Mobile-friendly — contractors use this on job sites
- Large touch targets for mobile

## Development Steps
1. Scaffold Next.js app: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias`
2. Install shadcn/ui: `npx shadcn@latest init` (use default style, slate, CSS variables)
3. Install needed shadcn components: button, card, input, select, badge, progress, tabs, accordion, dialog, table, alert
4. Build all pages and components
5. Create Supabase SQL migration file with full schema + seed data (in `supabase/migrations/`)
6. Add utility calculation functions in `src/lib/calculator.ts`
7. Make sure `npm run build` passes

For the MVP, use local state / mock data for the wizard and estimate pages (no Supabase connection required for those). The contractor dashboard and admin panel should have the UI built with placeholder data, ready to connect to Supabase.

Include a `supabase/migrations/001_schema.sql` file with the full schema and a `supabase/seed.sql` with seed data.

Include a `README.md` with local setup instructions.
