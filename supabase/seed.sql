-- HeatPumpClarity — Dev Seed Data
-- Optional. Run this after schema.sql to populate the dev database
-- with sample data for local development and demo purposes.
-- DO NOT run against production.
--
-- Sourced from src/lib/data.ts sample projects.
-- Dollar amounts and category labels verified against
-- NYS Clean Heat Program Manual Version 2, March 5 2026.

BEGIN;

-- Sample homeowners (no auth.users rows needed — user_id is nullable)
INSERT INTO homeowners (id, full_name, email, phone, address, city, state, zip, utility, home_type, is_dac) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Maria Rodriguez', 'maria.r@example.com',  '(518) 555-0142', '45 Oak Street',     'Albany',       'NY', '12205', 'national_grid',  'single_family', false),
  ('a0000000-0000-0000-0000-000000000002', 'James Chen',      'james.chen@example.com','(914) 555-0198', '128 Maple Avenue',  'White Plains', 'NY', '10601', 'con_edison',     'condo',         true),
  ('a0000000-0000-0000-0000-000000000003', 'Sarah Thompson',  'sarah.t@example.com',  '(845) 555-0267', '72 River Road',     'Poughkeepsie', 'NY', '12601', 'central_hudson', 'single_family', false),
  ('a0000000-0000-0000-0000-000000000004', 'Robert Williams', 'rwilliams@example.com','(607) 555-0334', '310 Elm Street',    'Ithaca',       'NY', '14850', 'nyseg',          'single_family', true);

-- Sample projects (no contractor_id — anonymous/unassigned for demo)
INSERT INTO projects (id, homeowner_id, address, city, state, zip, utility, category, category_label, home_type, is_new_construction, is_dac, estimated_incentive, status, notes, created_at, updated_at) VALUES
  ('b0000000-0000-0000-0000-000000000001',
   'a0000000-0000-0000-0000-000000000001',
   '45 Oak Street', 'Albany', 'NY', '12205',
   'national_grid', 'cat_2b',
   'ccASHP: Residential Full Load Heating with Decommissioning',
   'single_family', false, false, 10000, 'draft',
   'Customer interested in full displacement of oil furnace.',
   '2026-03-01 09:00:00+00', '2026-03-10 14:30:00+00'),

  ('b0000000-0000-0000-0000-000000000002',
   'a0000000-0000-0000-0000-000000000002',
   '128 Maple Avenue', 'White Plains', 'NY', '10601',
   'con_edison', 'cat_2a',
   'ccASHP: Residential Full Load Heating with Integrated Controls',
   'condo', false, true, 2000, 'in_progress',
   'Installing 3 ductless mini-split units. DAC eligible.',
   '2026-02-15 11:00:00+00', '2026-03-20 16:45:00+00'),

  ('b0000000-0000-0000-0000-000000000003',
   'a0000000-0000-0000-0000-000000000003',
   '72 River Road', 'Poughkeepsie', 'NY', '12601',
   'central_hudson', 'cat_3',
   'GSHP: Residential Full Load Heating',
   'single_family', false, false, 18000, 'complete',
   '5-ton GSHP installation complete. All documents verified.',
   '2026-01-10 08:00:00+00', '2026-03-25 12:00:00+00'),

  ('b0000000-0000-0000-0000-000000000004',
   'a0000000-0000-0000-0000-000000000004',
   '310 Elm Street', 'Ithaca', 'NY', '14850',
   'nyseg', 'cat_5',
   'Downstream Domestic Water Heating',
   'single_family', false, true, 1250, 'denied',
   'Denied — equipment does not meet minimum efficiency requirements (UEF < 3.3).',
   '2026-02-20 13:00:00+00', '2026-03-18 09:30:00+00');

-- Sample project documents for proj-001 (draft — mostly missing)
INSERT INTO project_documents (project_id, doc_type, doc_label, status, required) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'customer_agreement', 'Customer Agreement',      'uploaded', true),
  ('b0000000-0000-0000-0000-000000000001', 'equipment_specs',    'Equipment Specs',         'uploaded', true),
  ('b0000000-0000-0000-0000-000000000001', 'ahri_cert',          'AHRI Certificate',        'missing',  true),
  ('b0000000-0000-0000-0000-000000000001', 'permit',             'Permit',                  'missing',  true),
  ('b0000000-0000-0000-0000-000000000001', 'pre_photo',          'Pre-Installation Photo',  'missing',  true),
  ('b0000000-0000-0000-0000-000000000001', 'post_photo',         'Post-Installation Photo', 'missing',  true),
  ('b0000000-0000-0000-0000-000000000001', 'invoice',            'Invoice',                 'missing',  true),
  ('b0000000-0000-0000-0000-000000000001', 'manual_j',           'Manual J Load Calculation','missing', true);

-- proj-002 (in_progress — most approved)
INSERT INTO project_documents (project_id, doc_type, doc_label, status, required) VALUES
  ('b0000000-0000-0000-0000-000000000002', 'customer_agreement', 'Customer Agreement',      'approved', true),
  ('b0000000-0000-0000-0000-000000000002', 'equipment_specs',    'Equipment Specs',         'approved', true),
  ('b0000000-0000-0000-0000-000000000002', 'ahri_cert',          'AHRI Certificate',        'approved', true),
  ('b0000000-0000-0000-0000-000000000002', 'permit',             'Permit',                  'uploaded', true),
  ('b0000000-0000-0000-0000-000000000002', 'pre_photo',          'Pre-Installation Photo',  'uploaded', true),
  ('b0000000-0000-0000-0000-000000000002', 'post_photo',         'Post-Installation Photo', 'uploaded', true),
  ('b0000000-0000-0000-0000-000000000002', 'invoice',            'Invoice',                 'missing',  true);

-- proj-003 (complete — all approved)
INSERT INTO project_documents (project_id, doc_type, doc_label, status, required) VALUES
  ('b0000000-0000-0000-0000-000000000003', 'customer_agreement', 'Customer Agreement',      'approved', true),
  ('b0000000-0000-0000-0000-000000000003', 'equipment_specs',    'Equipment Specs',         'approved', true),
  ('b0000000-0000-0000-0000-000000000003', 'ahri_cert',          'AHRI Certificate',        'approved', true),
  ('b0000000-0000-0000-0000-000000000003', 'permit',             'Permit',                  'approved', true),
  ('b0000000-0000-0000-0000-000000000003', 'pre_photo',          'Pre-Installation Photo',  'approved', true),
  ('b0000000-0000-0000-0000-000000000003', 'post_photo',         'Post-Installation Photo', 'approved', true),
  ('b0000000-0000-0000-0000-000000000003', 'invoice',            'Invoice',                 'approved', true),
  ('b0000000-0000-0000-0000-000000000003', 'manual_j',           'Manual J Load Calculation','approved',true),
  ('b0000000-0000-0000-0000-000000000003', 'loop_design',        'Loop Field Design',       'approved', true);

-- proj-004 (denied — one rejected doc)
INSERT INTO project_documents (project_id, doc_type, doc_label, status, required, notes) VALUES
  ('b0000000-0000-0000-0000-000000000004', 'customer_agreement', 'Customer Agreement',      'approved', true,  NULL),
  ('b0000000-0000-0000-0000-000000000004', 'equipment_specs',    'Equipment Specs',         'rejected', true,  'Image quality too low, please re-upload'),
  ('b0000000-0000-0000-0000-000000000004', 'ahri_cert',          'AHRI Certificate',        'uploaded', true,  NULL),
  ('b0000000-0000-0000-0000-000000000004', 'permit',             'Permit',                  'uploaded', true,  NULL),
  ('b0000000-0000-0000-0000-000000000004', 'pre_photo',          'Pre-Installation Photo',  'uploaded', true,  NULL),
  ('b0000000-0000-0000-0000-000000000004', 'post_photo',         'Post-Installation Photo', 'missing',  true,  NULL),
  ('b0000000-0000-0000-0000-000000000004', 'invoice',            'Invoice',                 'missing',  true,  NULL);

-- Sample manual updates
INSERT INTO manual_updates (title, description, published, created_at) VALUES
  ('March 2026: Weatherized Tier launches September 1, 2026',
   'NYS Clean Heat will introduce a differentiated incentive tier on September 1, 2026 for space heating projects that meet a minimum weatherization standard, as directed by the May 2025 Non-LMI EE/BE Order. Specific incentive rates for the Weatherized Tier have not yet been published. Source: Program Manual Version 2, March 5, 2026, version history table (page iv) and Section 2.1.5 (page 8).',
   true, '2026-03-05T00:00:00Z'),
  ('January 2026: Orange & Rockland incentive amounts corrected',
   'Program Manual Version 1.1, filed January 23, 2026, corrected a small error in the Orange & Rockland incentive amounts in Section 2.2.7. Contractors working in O&R territory should reference the current incentive table for accurate amounts. Source: Program Manual Version 1.1, version history table (page iv) and Section 2.2.7 (page 14).',
   true, '2026-01-23T00:00:00Z'),
  ('January 2026: New documentation requirements for Category 2 projects',
   'Starting February 1, 2026, all Category 2 (New Construction) projects must include a completed Manual J load calculation with the application. Previously this was optional for new construction.',
   false, '2026-01-20T00:00:00Z');

-- Sample leads
INSERT INTO leads (source, email, name, utility, interest, created_at) VALUES
  ('eligibility_wizard', 'homeowner1@example.com', 'John Doe',    'con_edison',    'cat_2a', '2026-03-28 15:00:00+00'),
  ('eligibility_wizard', 'jane.smith@example.com', 'Jane Smith',  'national_grid', 'cat_3',  '2026-03-27 11:30:00+00'),
  ('estimate_page',      'mikeb@example.com',      'Mike Brown',  'central_hudson','cat_4',  '2026-03-25 09:15:00+00'),
  ('eligibility_wizard', 'lisa.w@example.com',     'Lisa Wang',   'nyseg',         'cat_5',  '2026-03-22 16:45:00+00');

COMMIT;
