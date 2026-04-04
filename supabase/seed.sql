-- HeatPumpClarity Seed Data
-- Realistic NYS Clean Heat incentive rates and sample data

-- ============================================================
-- Utility Rules: 6 utilities × 8 categories
-- ============================================================

-- Con Edison
INSERT INTO utility_rules (utility, category, category_label, base_incentive, dac_incentive, incentive_unit) VALUES
  ('con_edison', 'cat_2',  'Air Source Heat Pump (Ducted) — New Construction',            1000, 1500, 'per_ton'),
  ('con_edison', 'cat_2a', 'Air Source Heat Pump (Ducted) — Retrofit, Full Displacement',  1200, 1800, 'per_ton'),
  ('con_edison', 'cat_2b', 'Air Source Heat Pump (Ducted) — Retrofit, Partial Displacement', 800, 1200, 'per_ton'),
  ('con_edison', 'cat_3',  'Air Source Heat Pump (Ductless/Mini-Split)',                    500,  750, 'per_unit'),
  ('con_edison', 'cat_4',  'Ground Source Heat Pump',                                      1500, 2000, 'per_ton'),
  ('con_edison', 'cat_5',  'Heat Pump Water Heater — New Construction',                    500,  700, 'per_unit'),
  ('con_edison', 'cat_5a', 'Heat Pump Water Heater — Replacing Electric',                  500,  700, 'per_unit'),
  ('con_edison', 'cat_5b', 'Heat Pump Water Heater — Replacing Fossil Fuel',               700, 1000, 'per_unit');

-- National Grid
INSERT INTO utility_rules (utility, category, category_label, base_incentive, dac_incentive, incentive_unit) VALUES
  ('national_grid', 'cat_2',  'Air Source Heat Pump (Ducted) — New Construction',            950, 1425, 'per_ton'),
  ('national_grid', 'cat_2a', 'Air Source Heat Pump (Ducted) — Retrofit, Full Displacement', 1150, 1725, 'per_ton'),
  ('national_grid', 'cat_2b', 'Air Source Heat Pump (Ducted) — Retrofit, Partial Displacement', 750, 1125, 'per_ton'),
  ('national_grid', 'cat_3',  'Air Source Heat Pump (Ductless/Mini-Split)',                   475,  712, 'per_unit'),
  ('national_grid', 'cat_4',  'Ground Source Heat Pump',                                     1450, 1950, 'per_ton'),
  ('national_grid', 'cat_5',  'Heat Pump Water Heater — New Construction',                   475,  675, 'per_unit'),
  ('national_grid', 'cat_5a', 'Heat Pump Water Heater — Replacing Electric',                 475,  675, 'per_unit'),
  ('national_grid', 'cat_5b', 'Heat Pump Water Heater — Replacing Fossil Fuel',              675,  975, 'per_unit');

-- Central Hudson
INSERT INTO utility_rules (utility, category, category_label, base_incentive, dac_incentive, incentive_unit) VALUES
  ('central_hudson', 'cat_2',  'Air Source Heat Pump (Ducted) — New Construction',            1000, 1500, 'per_ton'),
  ('central_hudson', 'cat_2a', 'Air Source Heat Pump (Ducted) — Retrofit, Full Displacement', 1200, 1800, 'per_ton'),
  ('central_hudson', 'cat_2b', 'Air Source Heat Pump (Ducted) — Retrofit, Partial Displacement', 800, 1200, 'per_ton'),
  ('central_hudson', 'cat_3',  'Air Source Heat Pump (Ductless/Mini-Split)',                   500,  750, 'per_unit'),
  ('central_hudson', 'cat_4',  'Ground Source Heat Pump',                                     1500, 2000, 'per_ton'),
  ('central_hudson', 'cat_5',  'Heat Pump Water Heater — New Construction',                   500,  700, 'per_unit'),
  ('central_hudson', 'cat_5a', 'Heat Pump Water Heater — Replacing Electric',                 500,  700, 'per_unit'),
  ('central_hudson', 'cat_5b', 'Heat Pump Water Heater — Replacing Fossil Fuel',              700, 1000, 'per_unit');

-- NYSEG
INSERT INTO utility_rules (utility, category, category_label, base_incentive, dac_incentive, incentive_unit) VALUES
  ('nyseg', 'cat_2',  'Air Source Heat Pump (Ducted) — New Construction',             950, 1425, 'per_ton'),
  ('nyseg', 'cat_2a', 'Air Source Heat Pump (Ducted) — Retrofit, Full Displacement',  1100, 1650, 'per_ton'),
  ('nyseg', 'cat_2b', 'Air Source Heat Pump (Ducted) — Retrofit, Partial Displacement', 750, 1125, 'per_ton'),
  ('nyseg', 'cat_3',  'Air Source Heat Pump (Ductless/Mini-Split)',                    475,  712, 'per_unit'),
  ('nyseg', 'cat_4',  'Ground Source Heat Pump',                                      1400, 1900, 'per_ton'),
  ('nyseg', 'cat_5',  'Heat Pump Water Heater — New Construction',                    475,  675, 'per_unit'),
  ('nyseg', 'cat_5a', 'Heat Pump Water Heater — Replacing Electric',                  475,  675, 'per_unit'),
  ('nyseg', 'cat_5b', 'Heat Pump Water Heater — Replacing Fossil Fuel',               650,  950, 'per_unit');

-- RG&E
INSERT INTO utility_rules (utility, category, category_label, base_incentive, dac_incentive, incentive_unit) VALUES
  ('rge', 'cat_2',  'Air Source Heat Pump (Ducted) — New Construction',             950, 1425, 'per_ton'),
  ('rge', 'cat_2a', 'Air Source Heat Pump (Ducted) — Retrofit, Full Displacement',  1100, 1650, 'per_ton'),
  ('rge', 'cat_2b', 'Air Source Heat Pump (Ducted) — Retrofit, Partial Displacement', 750, 1125, 'per_ton'),
  ('rge', 'cat_3',  'Air Source Heat Pump (Ductless/Mini-Split)',                    475,  712, 'per_unit'),
  ('rge', 'cat_4',  'Ground Source Heat Pump',                                      1400, 1900, 'per_ton'),
  ('rge', 'cat_5',  'Heat Pump Water Heater — New Construction',                    475,  675, 'per_unit'),
  ('rge', 'cat_5a', 'Heat Pump Water Heater — Replacing Electric',                  475,  675, 'per_unit'),
  ('rge', 'cat_5b', 'Heat Pump Water Heater — Replacing Fossil Fuel',               650,  950, 'per_unit');

-- Orange & Rockland
INSERT INTO utility_rules (utility, category, category_label, base_incentive, dac_incentive, incentive_unit) VALUES
  ('orange_rockland', 'cat_2',  'Air Source Heat Pump (Ducted) — New Construction',            1000, 1500, 'per_ton'),
  ('orange_rockland', 'cat_2a', 'Air Source Heat Pump (Ducted) — Retrofit, Full Displacement', 1200, 1800, 'per_ton'),
  ('orange_rockland', 'cat_2b', 'Air Source Heat Pump (Ducted) — Retrofit, Partial Displacement', 800, 1200, 'per_ton'),
  ('orange_rockland', 'cat_3',  'Air Source Heat Pump (Ductless/Mini-Split)',                   500,  750, 'per_unit'),
  ('orange_rockland', 'cat_4',  'Ground Source Heat Pump',                                     1500, 2000, 'per_ton'),
  ('orange_rockland', 'cat_5',  'Heat Pump Water Heater — New Construction',                   500,  700, 'per_unit'),
  ('orange_rockland', 'cat_5a', 'Heat Pump Water Heater — Replacing Electric',                 500,  700, 'per_unit'),
  ('orange_rockland', 'cat_5b', 'Heat Pump Water Heater — Replacing Fossil Fuel',              700, 1000, 'per_unit');

-- ============================================================
-- Sample Homeowners
-- ============================================================
INSERT INTO homeowners (id, full_name, email, phone, address, city, zip, utility, home_type, is_dac) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Maria Rodriguez', 'maria.r@email.com', '(518) 555-0142', '45 Oak Street', 'Albany', '12205', 'national_grid', 'single_family', false),
  ('a0000000-0000-0000-0000-000000000002', 'James Chen', 'james.chen@email.com', '(914) 555-0198', '128 Maple Avenue', 'White Plains', '10601', 'con_edison', 'condo', true),
  ('a0000000-0000-0000-0000-000000000003', 'Sarah Thompson', 'sarah.t@email.com', '(845) 555-0267', '72 River Road', 'Poughkeepsie', '12601', 'central_hudson', 'single_family', false),
  ('a0000000-0000-0000-0000-000000000004', 'Robert Williams', 'rwilliams@email.com', '(607) 555-0334', '310 Elm Street', 'Ithaca', '14850', 'nyseg', 'single_family', true);

-- ============================================================
-- Sample Projects
-- ============================================================
INSERT INTO projects (id, homeowner_id, address, city, zip, utility, category, category_label, home_type, is_new_construction, is_dac, estimated_incentive, status, notes, created_at, updated_at) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
   '45 Oak Street', 'Albany', '12205', 'national_grid', 'cat_2a',
   'Air Source Heat Pump (Ducted) — Retrofit, Full Displacement',
   'single_family', false, false, 4600, 'draft',
   'Customer interested in full displacement of oil furnace',
   '2026-03-01 09:00:00+00', '2026-03-10 14:30:00+00'),

  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002',
   '128 Maple Avenue', 'White Plains', '10601', 'con_edison', 'cat_3',
   'Air Source Heat Pump (Ductless/Mini-Split)',
   'condo', false, true, 2250, 'in_progress',
   'Installing 3 ductless mini-split units. DAC eligible.',
   '2026-02-15 11:00:00+00', '2026-03-20 16:45:00+00'),

  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003',
   '72 River Road', 'Poughkeepsie', '12601', 'central_hudson', 'cat_4',
   'Ground Source Heat Pump',
   'single_family', false, false, 7500, 'complete',
   '5-ton GSHP installation complete. All documents verified.',
   '2026-01-10 08:00:00+00', '2026-03-25 12:00:00+00'),

  ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004',
   '310 Elm Street', 'Ithaca', '14850', 'nyseg', 'cat_5b',
   'Heat Pump Water Heater — Replacing Fossil Fuel',
   'single_family', false, true, 950, 'denied',
   'Denied — equipment does not meet minimum efficiency requirements (UEF < 3.3).',
   '2026-02-20 13:00:00+00', '2026-03-18 09:30:00+00');

-- ============================================================
-- Sample Project Documents (proj 1: 2/8 uploaded, proj 2: 6/7, proj 3: all approved, proj 4: mixed)
-- ============================================================

-- Project 1: Draft — 2 of 8 docs uploaded
INSERT INTO project_documents (project_id, doc_type, doc_label, status, required) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'customer_agreement', 'Customer Agreement', 'uploaded', true),
  ('b0000000-0000-0000-0000-000000000001', 'equipment_specs', 'Equipment Specs', 'uploaded', true),
  ('b0000000-0000-0000-0000-000000000001', 'ahri_cert', 'AHRI Certificate', 'missing', true),
  ('b0000000-0000-0000-0000-000000000001', 'permit', 'Permit', 'missing', true),
  ('b0000000-0000-0000-0000-000000000001', 'pre_photo', 'Pre-Installation Photo', 'missing', true),
  ('b0000000-0000-0000-0000-000000000001', 'post_photo', 'Post-Installation Photo', 'missing', true),
  ('b0000000-0000-0000-0000-000000000001', 'invoice', 'Invoice', 'missing', true),
  ('b0000000-0000-0000-0000-000000000001', 'manual_j', 'Manual J Load Calculation', 'missing', true);

-- Project 2: In Progress — 6 of 7 docs
INSERT INTO project_documents (project_id, doc_type, doc_label, status, required) VALUES
  ('b0000000-0000-0000-0000-000000000002', 'customer_agreement', 'Customer Agreement', 'approved', true),
  ('b0000000-0000-0000-0000-000000000002', 'equipment_specs', 'Equipment Specs', 'approved', true),
  ('b0000000-0000-0000-0000-000000000002', 'ahri_cert', 'AHRI Certificate', 'approved', true),
  ('b0000000-0000-0000-0000-000000000002', 'permit', 'Permit', 'uploaded', true),
  ('b0000000-0000-0000-0000-000000000002', 'pre_photo', 'Pre-Installation Photo', 'uploaded', true),
  ('b0000000-0000-0000-0000-000000000002', 'post_photo', 'Post-Installation Photo', 'uploaded', true),
  ('b0000000-0000-0000-0000-000000000002', 'invoice', 'Invoice', 'missing', true);

-- Project 3: Complete — all docs approved
INSERT INTO project_documents (project_id, doc_type, doc_label, status, required) VALUES
  ('b0000000-0000-0000-0000-000000000003', 'customer_agreement', 'Customer Agreement', 'approved', true),
  ('b0000000-0000-0000-0000-000000000003', 'equipment_specs', 'Equipment Specs', 'approved', true),
  ('b0000000-0000-0000-0000-000000000003', 'ahri_cert', 'AHRI Certificate', 'approved', true),
  ('b0000000-0000-0000-0000-000000000003', 'permit', 'Permit', 'approved', true),
  ('b0000000-0000-0000-0000-000000000003', 'pre_photo', 'Pre-Installation Photo', 'approved', true),
  ('b0000000-0000-0000-0000-000000000003', 'post_photo', 'Post-Installation Photo', 'approved', true),
  ('b0000000-0000-0000-0000-000000000003', 'invoice', 'Invoice', 'approved', true),
  ('b0000000-0000-0000-0000-000000000003', 'manual_j', 'Manual J Load Calculation', 'approved', true),
  ('b0000000-0000-0000-0000-000000000003', 'loop_design', 'Loop Field Design', 'approved', true);

-- Project 4: Denied — mixed doc statuses
INSERT INTO project_documents (project_id, doc_type, doc_label, status, required, notes) VALUES
  ('b0000000-0000-0000-0000-000000000004', 'customer_agreement', 'Customer Agreement', 'approved', true, NULL),
  ('b0000000-0000-0000-0000-000000000004', 'equipment_specs', 'Equipment Specs', 'rejected', true, 'Image quality too low, please re-upload'),
  ('b0000000-0000-0000-0000-000000000004', 'ahri_cert', 'AHRI Certificate', 'uploaded', true, NULL),
  ('b0000000-0000-0000-0000-000000000004', 'permit', 'Permit', 'uploaded', true, NULL),
  ('b0000000-0000-0000-0000-000000000004', 'pre_photo', 'Pre-Installation Photo', 'uploaded', true, NULL),
  ('b0000000-0000-0000-0000-000000000004', 'post_photo', 'Post-Installation Photo', 'missing', true, NULL),
  ('b0000000-0000-0000-0000-000000000004', 'invoice', 'Invoice', 'missing', true, NULL);

-- ============================================================
-- Sample Manual Updates
-- ============================================================
INSERT INTO manual_updates (title, description, published, created_at) VALUES
  ('March 2026: NYSERDA updated Category 2a incentive rates for Con Edison territory',
   'Con Edison base incentive for Category 2a (ASHP Ducted, Retrofit Full Displacement) increased from $1,100/ton to $1,200/ton effective March 1, 2026. DAC rate also increased to $1,800/ton.',
   true, '2026-03-01 10:00:00+00'),
  ('February 2026: DAC bonus amounts increased for ground source installations',
   'NYSERDA has increased the DAC bonus for Category 4 (Ground Source Heat Pump) across all utility territories. Enhanced incentives now range from $1,900 to $2,000 per ton for DAC-eligible households.',
   true, '2026-02-15 09:00:00+00'),
  ('January 2026: New documentation requirements for Category 2 projects',
   'Starting February 1, 2026, all Category 2 (New Construction) projects must include a completed Manual J load calculation with the application. Previously this was optional for new construction.',
   false, '2026-01-20 14:00:00+00');

-- ============================================================
-- Sample Leads
-- ============================================================
INSERT INTO leads (source, email, name, utility, interest, created_at) VALUES
  ('eligibility_wizard', 'homeowner1@email.com', 'John Doe', 'con_edison', 'cat_2a', '2026-03-28 15:00:00+00'),
  ('eligibility_wizard', 'jane.smith@email.com', 'Jane Smith', 'national_grid', 'cat_3', '2026-03-27 11:30:00+00'),
  ('estimate_page', 'mikeb@email.com', 'Mike Brown', 'central_hudson', 'cat_4', '2026-03-25 09:15:00+00'),
  ('eligibility_wizard', 'lisa.w@email.com', 'Lisa Wang', 'nyseg', 'cat_5b', '2026-03-22 16:45:00+00');
