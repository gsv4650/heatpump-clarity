-- HeatPumpClarity Migration 003
-- Corrects utility_rules schema and reseeds with Program Manual data (Version 2, March 5 2026)
-- Source: Tables 3-15, NYS Clean Heat Heat Pump Program Manual

BEGIN;

-- Step 1: Add new columns to utility_rules
ALTER TABLE utility_rules ADD COLUMN IF NOT EXISTS building_type TEXT;
ALTER TABLE utility_rules ADD COLUMN IF NOT EXISTS construction  TEXT;  -- 'retrofit' | 'new_construction' | NULL
ALTER TABLE utility_rules ADD COLUMN IF NOT EXISTS retail_only  BOOLEAN DEFAULT FALSE;

-- Step 2: Drop the old per-ton/per-unit column (no longer used)
ALTER TABLE utility_rules DROP COLUMN IF EXISTS incentive_unit;

-- Step 3: Clear all stale rows
TRUNCATE utility_rules;

-- Step 4: Reseed with correct flat-dollar Program Manual amounts
-- ALL AMOUNTS ARE FLAT DOLLARS PER PROJECT, NOT PER TON.

-- ─────────────────────────────────────────────────────────────────────────────
-- CON EDISON
-- No cat_2, no cat_5, no cat_5b.
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO utility_rules (utility, category, category_label, building_type, construction, base_incentive, dac_incentive, retail_only) VALUES

-- cat_2a: ccASHP Full Load with Integrated Controls (Con Edison only)
('con_edison', 'cat_2a', 'ccASHP Full Load with Integrated Controls',  'single_family',         'retrofit', 2500,  4500,  false),
('con_edison', 'cat_2a', 'ccASHP Full Load with Integrated Controls',  'apartment_or_small_sf', 'retrofit', 1000,  2000,  false),

-- cat_2b: ccASHP Full Load with Decommissioning
('con_edison', 'cat_2b', 'ccASHP Full Load with Decommissioning',      'single_family',         'retrofit', 8000,  10000, false),
('con_edison', 'cat_2b', 'ccASHP Full Load with Decommissioning',      'apartment_or_small_sf', 'retrofit', 4000,  5000,  false),

-- cat_3: GSHP Full Load — whole_building rate only for Con Edison, no construction split
('con_edison', 'cat_3',  'GSHP Residential Full Load Heating',         'whole_building',        NULL,       30000, 40000, false),

-- cat_4: Partial-to-Full Load (ASHP)
('con_edison', 'cat_4',  'Partial-to-Full Load (ASHP)',                'single_family',         NULL,       4000,  4000,  false),
('con_edison', 'cat_4',  'Partial-to-Full Load (ASHP)',                'apartment_or_small_sf', NULL,       1500,  1500,  false),

-- cat_5a: Midstream HPWH — $1,000 customer amount (bonuses are trade-channel, not shown to customer)
('con_edison', 'cat_5a', 'Midstream HPWH',                            'single_family',         NULL,       1000,  1000,  false),
('con_edison', 'cat_5a', 'Midstream HPWH',                            'apartment_or_small_sf', NULL,       1000,  1000,  false);

-- ─────────────────────────────────────────────────────────────────────────────
-- NATIONAL GRID
-- No cat_2a.
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO utility_rules (utility, category, category_label, building_type, construction, base_incentive, dac_incentive, retail_only) VALUES

-- cat_2: ccASHP Full Load Heating
('national_grid', 'cat_2',  'ccASHP Full Load Heating',                'single_family',         'retrofit',         6000,  8000,  false),
('national_grid', 'cat_2',  'ccASHP Full Load Heating',                'apartment_or_small_sf', 'retrofit',         3000,  4000,  false),

-- cat_2b: ccASHP Full Load with Decommissioning
('national_grid', 'cat_2b', 'ccASHP Full Load with Decommissioning',   'single_family',         'retrofit',         10000, 12000, false),
('national_grid', 'cat_2b', 'ccASHP Full Load with Decommissioning',   'apartment_or_small_sf', 'retrofit',         5000,  6000,  false),

-- cat_3: GSHP Full Load — retrofit and new_construction are separate rows
('national_grid', 'cat_3',  'GSHP Residential Full Load Heating',      'single_family',         'retrofit',         20000, 25000, false),
('national_grid', 'cat_3',  'GSHP Residential Full Load Heating',      'single_family',         'new_construction', 14000, 19000, false),
('national_grid', 'cat_3',  'GSHP Residential Full Load Heating',      'apartment_or_small_sf', 'retrofit',         10000, 12500, false),
('national_grid', 'cat_3',  'GSHP Residential Full Load Heating',      'apartment_or_small_sf', 'new_construction', 7000,  9500,  false),

-- cat_4: Partial-to-Full Load (ASHP)
('national_grid', 'cat_4',  'Partial-to-Full Load (ASHP)',             'single_family',         NULL,               4000,  4000,  false),
('national_grid', 'cat_4',  'Partial-to-Full Load (ASHP)',             'apartment_or_small_sf', NULL,               2000,  2000,  false),

-- cat_5: Downstream HPWH — single rate, no DAC split
('national_grid', 'cat_5',  'Downstream Domestic Water Heating',       'single_family',         NULL,               1250,  1250,  false),
('national_grid', 'cat_5',  'Downstream Domestic Water Heating',       'apartment_or_small_sf', NULL,               1250,  1250,  false),

-- cat_5a: Midstream HPWH — RETAIL ONLY for National Grid
('national_grid', 'cat_5a', 'Midstream HPWH',                         'single_family',         NULL,               1250,  1250,  true),
('national_grid', 'cat_5a', 'Midstream HPWH',                         'apartment_or_small_sf', NULL,               1250,  1250,  true),

-- cat_5b: GSHP Desuperheater — $100
('national_grid', 'cat_5b', 'GSHP Desuperheater',                     'single_family',         NULL,               100,   100,   false),
('national_grid', 'cat_5b', 'GSHP Desuperheater',                     'apartment_or_small_sf', NULL,               100,   100,   false);

-- ─────────────────────────────────────────────────────────────────────────────
-- NYSEG
-- No cat_2a.
-- ─────────────────────────────────────────────────────────────────────────────

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

-- ─────────────────────────────────────────────────────────────────────────────
-- RG&E
-- No cat_2a.
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO utility_rules (utility, category, category_label, building_type, construction, base_incentive, dac_incentive, retail_only) VALUES

-- Note: RG&E single_family non-DAC == DAC for cat_2 and cat_2b
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

-- ─────────────────────────────────────────────────────────────────────────────
-- ORANGE & ROCKLAND
-- No cat_2a. No cat_5b.
-- ─────────────────────────────────────────────────────────────────────────────

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
-- No cat_5b for Orange & Rockland.

-- ─────────────────────────────────────────────────────────────────────────────
-- CENTRAL HUDSON
-- No cat_2a. No DAC split — territory-wide 85% cost cap.
-- baseIncentive == dacIncentive (same value in both columns).
-- ─────────────────────────────────────────────────────────────────────────────

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
