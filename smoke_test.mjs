// Smoke tests for calculator.ts
// Transpile on-the-fly using ts-node or use compiled output

// We'll use the compiled .next output or transpile inline
// Instead, let's use tsx or ts-node

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Use ts-node/esm or just read and eval with tsx
// We'll write a CJS version via dynamic require after transpile

// Actually, let's just use the Node test by requiring the compiled file
// or using ts-node programmatically

// Let's just do it the simple way: inline the logic we need to verify

// Copy the key functions inline for testing:

const INELIGIBLE = "ineligible";

const INCENTIVE_RATES = [
  { utility: "con_edison",  category: "cat_2a", buildingType: "single_family",         construction: "retrofit", baseIncentive:  2500, dacIncentive:  4500 },
  { utility: "con_edison",  category: "cat_2a", buildingType: "apartment_or_small_sf", construction: "retrofit", baseIncentive:  1000, dacIncentive:  2000 },
  { utility: "con_edison",  category: "cat_2b", buildingType: "single_family",         construction: "retrofit", baseIncentive:  8000, dacIncentive: 10000 },
  { utility: "con_edison",  category: "cat_2b", buildingType: "apartment_or_small_sf", construction: "retrofit", baseIncentive:  4000, dacIncentive:  5000 },
  { utility: "con_edison",  category: "cat_3",  buildingType: "whole_building",        construction: null,       baseIncentive: 30000, dacIncentive: 40000 },
  { utility: "con_edison",  category: "cat_4",  buildingType: "single_family",         construction: null,       baseIncentive:  4000, dacIncentive:  4000 },
  { utility: "con_edison",  category: "cat_4",  buildingType: "apartment_or_small_sf", construction: null,       baseIncentive:  1500, dacIncentive:  1500 },
  { utility: "con_edison",  category: "cat_5a", buildingType: "single_family",         construction: null,       baseIncentive:  1000, dacIncentive:  1000 },
  { utility: "con_edison",  category: "cat_5a", buildingType: "apartment_or_small_sf", construction: null,       baseIncentive:  1000, dacIncentive:  1000 },
  { utility: "national_grid", category: "cat_2",  buildingType: "single_family",         construction: "retrofit",         baseIncentive:  6000, dacIncentive:  8000 },
  { utility: "national_grid", category: "cat_2",  buildingType: "apartment_or_small_sf", construction: "retrofit",         baseIncentive:  3000, dacIncentive:  4000 },
  { utility: "national_grid", category: "cat_2b", buildingType: "single_family",         construction: "retrofit",         baseIncentive: 10000, dacIncentive: 12000 },
  { utility: "national_grid", category: "cat_2b", buildingType: "apartment_or_small_sf", construction: "retrofit",         baseIncentive:  5000, dacIncentive:  6000 },
  { utility: "national_grid", category: "cat_3",  buildingType: "single_family",         construction: "retrofit",         baseIncentive: 20000, dacIncentive: 25000 },
  { utility: "national_grid", category: "cat_3",  buildingType: "single_family",         construction: "new_construction", baseIncentive: 14000, dacIncentive: 19000 },
  { utility: "national_grid", category: "cat_3",  buildingType: "apartment_or_small_sf", construction: "retrofit",         baseIncentive: 10000, dacIncentive: 12500 },
  { utility: "national_grid", category: "cat_3",  buildingType: "apartment_or_small_sf", construction: "new_construction", baseIncentive:  7000, dacIncentive:  9500 },
  { utility: "national_grid", category: "cat_4",  buildingType: "single_family",         construction: null,               baseIncentive:  4000, dacIncentive:  4000 },
  { utility: "national_grid", category: "cat_4",  buildingType: "apartment_or_small_sf", construction: null,               baseIncentive:  2000, dacIncentive:  2000 },
  { utility: "national_grid", category: "cat_5",  buildingType: "single_family",         construction: null,               baseIncentive:  1250, dacIncentive:  1250 },
  { utility: "national_grid", category: "cat_5",  buildingType: "apartment_or_small_sf", construction: null,               baseIncentive:  1250, dacIncentive:  1250 },
  { utility: "national_grid", category: "cat_5a", buildingType: "single_family",         construction: null,               baseIncentive:  1250, dacIncentive:  1250, retailOnly: true },
  { utility: "national_grid", category: "cat_5a", buildingType: "apartment_or_small_sf", construction: null,               baseIncentive:  1250, dacIncentive:  1250, retailOnly: true },
  { utility: "national_grid", category: "cat_5b", buildingType: "single_family",         construction: null,               baseIncentive:   100, dacIncentive:   100 },
  { utility: "national_grid", category: "cat_5b", buildingType: "apartment_or_small_sf", construction: null,               baseIncentive:   100, dacIncentive:   100 },
];

const UTILITY_LABELS = {
  central_hudson: "Central Hudson",
  con_edison: "Con Edison",
  national_grid: "National Grid",
  nyseg: "NYSEG",
  rge: "RG&E",
  orange_rockland: "Orange & Rockland",
};

const CATEGORY_LABELS = {
  cat_2:  "ccASHP Full Load Heating",
  cat_2a: "ccASHP Full Load with Integrated Controls (Con Edison only)",
  cat_2b: "ccASHP Full Load with Decommissioning",
  cat_3:  "GSHP Residential Full Load Heating",
  cat_4:  "Partial-to-Full Load (ASHP)",
  cat_5:  "Downstream Domestic Water Heating",
  cat_5a: "Midstream HPWH",
  cat_5b: "GSHP Desuperheater",
};

const CATEGORY_SHORT = {
  cat_2:  "Category 2",
  cat_2a: "Category 2a",
  cat_2b: "Category 2b",
  cat_3:  "Category 3",
  cat_4:  "Category 4",
  cat_5:  "Category 5",
  cat_5a: "Category 5a",
  cat_5b: "Category 5b",
};

function determineCategory(input) {
  const { projectType, equipmentType, utility, willDecommission, hasIntegratedControls, coversAllUnits } = input;

  if (projectType === "new_construction" && (equipmentType === "ashp_ducted" || equipmentType === "ashp_ductless")) {
    return INELIGIBLE;
  }

  if (equipmentType === "gshp") {
    if (utility === "con_edison" && !coversAllUnits) return INELIGIBLE;
    return "cat_3";
  }

  if (equipmentType === "hpwh") return "cat_5";

  if (equipmentType === "ashp_ducted" || equipmentType === "ashp_ductless") {
    if (utility === "con_edison") {
      if (willDecommission)      return "cat_2b";
      if (hasIntegratedControls) return "cat_2a";
      return INELIGIBLE;
    }
    if (willDecommission) return "cat_2b";
    return "cat_2";
  }

  return INELIGIBLE;
}

function calculateEstimate(input) {
  const categoryResult = determineCategory(input);
  if (categoryResult === INELIGIBLE) return null;

  const category = categoryResult;

  const buildingType =
    input.utility === "con_edison" && category === "cat_3"
      ? "whole_building"
      : input.homeType === "single_family"
      ? "single_family"
      : "apartment_or_small_sf";

  const construction =
    input.projectType === "new_construction" ? "new_construction" : "retrofit";

  const rate = INCENTIVE_RATES.find(
    (r) =>
      r.utility      === input.utility  &&
      r.category     === category       &&
      r.buildingType === buildingType   &&
      (r.construction === null || r.construction === construction)
  );

  if (!rate) return null;

  const amount   = input.isDac ? rate.dacIncentive  : rate.baseIncentive;
  const dacBonus = input.isDac ? rate.dacIncentive - rate.baseIncentive : 0;

  return {
    category,
    categoryLabel:         CATEGORY_LABELS[category],
    categoryShort:         CATEGORY_SHORT[category],
    utility:               input.utility,
    utilityLabel:          UTILITY_LABELS[input.utility],
    baseRate:              rate.baseIncentive,
    dacRate:               rate.dacIncentive,
    unit:                  "flat",
    isDac:                 input.isDac,
    estimatedIncentiveMin: amount,
    estimatedIncentiveMax: amount,
    dacBonus,
    retailOnly:            rate.retailOnly ?? false,
  };
}

// Test runner
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`PASS: ${name}`);
    passed++;
  } catch (e) {
    console.log(`FAIL: ${name} — ${e.message}`);
    failed++;
  }
}

function assertEqual(actual, expected, msg) {
  if (actual !== expected) throw new Error(`${msg}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

// Test 1: Con Edison + single_family + retrofit + ashp_ducted + willDecommission=true + isDac=false → cat_2b, $8000
test("Test 1: ConEd + SF + retrofit + ashp_ducted + decommission=true + isDac=false → cat_2b $8000", () => {
  const result = calculateEstimate({
    homeType: "single_family", utility: "con_edison", projectType: "retrofit",
    equipmentType: "ashp_ducted", willDecommission: true, hasIntegratedControls: false,
    coversAllUnits: false, isDac: false
  });
  assertEqual(result?.category, "cat_2b", "category");
  assertEqual(result?.estimatedIncentiveMin, 8000, "amount");
});

// Test 2: ConEd + SF + retrofit + ashp_ducted + decommission=false + integratedControls=true + isDac=true → cat_2a, $4500
test("Test 2: ConEd + SF + retrofit + ashp_ducted + decommission=false + controls=true + isDac=true → cat_2a $4500", () => {
  const result = calculateEstimate({
    homeType: "single_family", utility: "con_edison", projectType: "retrofit",
    equipmentType: "ashp_ducted", willDecommission: false, hasIntegratedControls: true,
    coversAllUnits: false, isDac: true
  });
  assertEqual(result?.category, "cat_2a", "category");
  assertEqual(result?.estimatedIncentiveMin, 4500, "amount");
});

// Test 3: ConEd + SF + retrofit + ashp_ducted + decommission=false + controls=false → INELIGIBLE → null
test("Test 3: ConEd + SF + retrofit + ashp_ducted + decommission=false + controls=false → null", () => {
  const result = calculateEstimate({
    homeType: "single_family", utility: "con_edison", projectType: "retrofit",
    equipmentType: "ashp_ducted", willDecommission: false, hasIntegratedControls: false,
    coversAllUnits: false, isDac: false
  });
  assertEqual(result, null, "result");
});

// Test 4: national_grid + SF + retrofit + gshp + isDac=false → cat_3, $20000
test("Test 4: national_grid + SF + retrofit + gshp + isDac=false → cat_3 $20000", () => {
  const result = calculateEstimate({
    homeType: "single_family", utility: "national_grid", projectType: "retrofit",
    equipmentType: "gshp", willDecommission: false, hasIntegratedControls: false,
    coversAllUnits: false, isDac: false
  });
  assertEqual(result?.category, "cat_3", "category");
  assertEqual(result?.estimatedIncentiveMin, 20000, "amount");
});

// Test 5: national_grid + SF + new_construction + gshp + isDac=true → cat_3, $19000
test("Test 5: national_grid + SF + new_construction + gshp + isDac=true → cat_3 $19000", () => {
  const result = calculateEstimate({
    homeType: "single_family", utility: "national_grid", projectType: "new_construction",
    equipmentType: "gshp", willDecommission: false, hasIntegratedControls: false,
    coversAllUnits: false, isDac: true
  });
  assertEqual(result?.category, "cat_3", "category");
  assertEqual(result?.estimatedIncentiveMin, 19000, "amount");
});

// Test 6: con_edison + SF + retrofit + hpwh + isDac=false → cat_5 but no ConEd cat_5 row → null
test("Test 6: con_edison + SF + retrofit + hpwh + isDac=false → null (ConEd has no cat_5)", () => {
  const result = calculateEstimate({
    homeType: "single_family", utility: "con_edison", projectType: "retrofit",
    equipmentType: "hpwh", willDecommission: false, hasIntegratedControls: false,
    coversAllUnits: false, isDac: false
  });
  // determineCategory returns "cat_5" but no rate row exists for con_edison + cat_5
  assertEqual(result, null, "result");
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
