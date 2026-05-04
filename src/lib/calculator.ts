export type HomeType = "single_family" | "multi_family_2_4" | "condo";
export type ProjectType = "new_construction" | "retrofit";
export type EquipmentType = "ashp_ducted" | "ashp_ductless" | "gshp" | "hpwh";
export type WaterHeaterReplace = "electric" | "fossil_fuel";
export type CategoryCode = "cat_2" | "cat_2a" | "cat_2b" | "cat_3" | "cat_4" | "cat_5" | "cat_5a" | "cat_5b";

export const INELIGIBLE = "ineligible" as const;
export type EligibilityResult = CategoryCode | typeof INELIGIBLE;

export type Utility =
  | "central_hudson"
  | "con_edison"
  | "national_grid"
  | "nyseg"
  | "rge"
  | "orange_rockland";

export const UTILITY_LABELS: Record<Utility, string> = {
  central_hudson: "Central Hudson",
  con_edison: "Con Edison",
  national_grid: "National Grid",
  nyseg: "NYSEG",
  rge: "RG&E",
  orange_rockland: "Orange & Rockland",
};

export const CATEGORY_LABELS: Record<CategoryCode, string> = {
  cat_2:  "ccASHP: Residential Full Load Heating",
  cat_2a: "ccASHP: Residential Full Load Heating with Integrated Controls",
  cat_2b: "ccASHP: Residential Full Load Heating with Decommissioning",
  cat_3:  "GSHP: Residential Full Load Heating",
  cat_4:  "Partial to Full Load",
  cat_5:  "Downstream Domestic Water Heating",
  cat_5a: "Midstream HPWH",
  cat_5b: "GSHP Desuperheater",
};

export const CATEGORY_SHORT: Record<CategoryCode, string> = {
  cat_2:  "Category 2",
  cat_2a: "Category 2a",
  cat_2b: "Category 2b",
  cat_3:  "Category 3",
  cat_4:  "Category 4",
  cat_5:  "Category 5",
  cat_5a: "Category 5a",
  cat_5b: "Category 5b",
};

export interface IncentiveRate {
  utility:      Utility;
  category:     CategoryCode;
  buildingType: "single_family" | "apartment_or_small_sf" | "whole_building";
  construction: "retrofit" | "new_construction" | null;
  baseIncentive: number;
  dacIncentive:  number;
  retailOnly?:   boolean;
}

// ALL AMOUNTS ARE FLAT DOLLARS PER PROJECT.
// Source: NYS Clean Heat Heat Pump Program Manual, Version 2, March 5 2026, Tables 3-15.
// Do not scale, round, or extrapolate. Update only from published Manual revisions.
export const INCENTIVE_RATES: IncentiveRate[] = [

  // ── CON EDISON ───────────────────────────────────────────────────────────────
  // No cat_2, no cat_5, no cat_5b.

  { utility: "con_edison",  category: "cat_2a", buildingType: "single_family",         construction: "retrofit", baseIncentive:  2500, dacIncentive:  4500 },
  { utility: "con_edison",  category: "cat_2a", buildingType: "apartment_or_small_sf", construction: "retrofit", baseIncentive:  1000, dacIncentive:  2000 },

  { utility: "con_edison",  category: "cat_2b", buildingType: "single_family",         construction: "retrofit", baseIncentive:  8000, dacIncentive: 10000 },
  { utility: "con_edison",  category: "cat_2b", buildingType: "apartment_or_small_sf", construction: "retrofit", baseIncentive:  4000, dacIncentive:  5000 },

  // Con Edison cat_3: whole_building rate only. coversAllUnits check enforced in determineCategory().
  { utility: "con_edison",  category: "cat_3",  buildingType: "whole_building",        construction: null,       baseIncentive: 30000, dacIncentive: 40000 },

  // cat_4: not surfaced in wizard v1, rates kept for admin panel
  { utility: "con_edison",  category: "cat_4",  buildingType: "single_family",         construction: null,       baseIncentive:  4000, dacIncentive:  4000 },
  { utility: "con_edison",  category: "cat_4",  buildingType: "apartment_or_small_sf", construction: null,       baseIncentive:  1500, dacIncentive:  1500 },

  // cat_5a: $50 distributor + $50 installer bonuses are trade-channel payments, not shown to customer
  { utility: "con_edison",  category: "cat_5a", buildingType: "single_family",         construction: null,       baseIncentive:  1000, dacIncentive:  1000 },
  { utility: "con_edison",  category: "cat_5a", buildingType: "apartment_or_small_sf", construction: null,       baseIncentive:  1000, dacIncentive:  1000 },

  // ── NATIONAL GRID ────────────────────────────────────────────────────────────
  // No cat_2a.

  { utility: "national_grid", category: "cat_2",  buildingType: "single_family",         construction: "retrofit",         baseIncentive:  6000, dacIncentive:  8000 },
  { utility: "national_grid", category: "cat_2",  buildingType: "apartment_or_small_sf", construction: "retrofit",         baseIncentive:  3000, dacIncentive:  4000 },

  { utility: "national_grid", category: "cat_2b", buildingType: "single_family",         construction: "retrofit",         baseIncentive: 10000, dacIncentive: 12000 },
  { utility: "national_grid", category: "cat_2b", buildingType: "apartment_or_small_sf", construction: "retrofit",         baseIncentive:  5000, dacIncentive:  6000 },

  { utility: "national_grid", category: "cat_3",  buildingType: "single_family",         construction: "retrofit",         baseIncentive: 20000, dacIncentive: 25000 },
  { utility: "national_grid", category: "cat_3",  buildingType: "single_family",         construction: "new_construction", baseIncentive: 14000, dacIncentive: 19000 },
  { utility: "national_grid", category: "cat_3",  buildingType: "apartment_or_small_sf", construction: "retrofit",         baseIncentive: 10000, dacIncentive: 12500 },
  { utility: "national_grid", category: "cat_3",  buildingType: "apartment_or_small_sf", construction: "new_construction", baseIncentive:  7000, dacIncentive:  9500 },

  // cat_4: not surfaced in wizard v1
  { utility: "national_grid", category: "cat_4",  buildingType: "single_family",         construction: null,               baseIncentive:  4000, dacIncentive:  4000 },
  { utility: "national_grid", category: "cat_4",  buildingType: "apartment_or_small_sf", construction: null,               baseIncentive:  2000, dacIncentive:  2000 },

  { utility: "national_grid", category: "cat_5",  buildingType: "single_family",         construction: null,               baseIncentive:  1250, dacIncentive:  1250 },
  { utility: "national_grid", category: "cat_5",  buildingType: "apartment_or_small_sf", construction: null,               baseIncentive:  1250, dacIncentive:  1250 },

  // cat_5a: RETAIL ONLY for National Grid
  { utility: "national_grid", category: "cat_5a", buildingType: "single_family",         construction: null,               baseIncentive:  1250, dacIncentive:  1250, retailOnly: true },
  { utility: "national_grid", category: "cat_5a", buildingType: "apartment_or_small_sf", construction: null,               baseIncentive:  1250, dacIncentive:  1250, retailOnly: true },

  { utility: "national_grid", category: "cat_5b", buildingType: "single_family",         construction: null,               baseIncentive:   100, dacIncentive:   100 },
  { utility: "national_grid", category: "cat_5b", buildingType: "apartment_or_small_sf", construction: null,               baseIncentive:   100, dacIncentive:   100 },

  // ── NYSEG ────────────────────────────────────────────────────────────────────
  // No cat_2a.

  { utility: "nyseg", category: "cat_2",  buildingType: "single_family",         construction: "retrofit",         baseIncentive:  6000, dacIncentive:  7000 },
  { utility: "nyseg", category: "cat_2",  buildingType: "apartment_or_small_sf", construction: "retrofit",         baseIncentive:  3000, dacIncentive:  4000 },

  { utility: "nyseg", category: "cat_2b", buildingType: "single_family",         construction: "retrofit",         baseIncentive: 10000, dacIncentive: 11000 },
  { utility: "nyseg", category: "cat_2b", buildingType: "apartment_or_small_sf", construction: "retrofit",         baseIncentive:  5000, dacIncentive:  6000 },

  { utility: "nyseg", category: "cat_3",  buildingType: "single_family",         construction: "retrofit",         baseIncentive: 17000, dacIncentive: 18000 },
  { utility: "nyseg", category: "cat_3",  buildingType: "single_family",         construction: "new_construction", baseIncentive: 10000, dacIncentive: 11000 },
  { utility: "nyseg", category: "cat_3",  buildingType: "apartment_or_small_sf", construction: "retrofit",         baseIncentive:  7000, dacIncentive:  8000 },
  { utility: "nyseg", category: "cat_3",  buildingType: "apartment_or_small_sf", construction: "new_construction", baseIncentive:  5000, dacIncentive:  6000 },

  { utility: "nyseg", category: "cat_4",  buildingType: "single_family",         construction: null,               baseIncentive:  3000, dacIncentive:  3000 },
  { utility: "nyseg", category: "cat_4",  buildingType: "apartment_or_small_sf", construction: null,               baseIncentive:  1000, dacIncentive:  1000 },

  { utility: "nyseg", category: "cat_5",  buildingType: "single_family",         construction: null,               baseIncentive:  1250, dacIncentive:  1250 },
  { utility: "nyseg", category: "cat_5",  buildingType: "apartment_or_small_sf", construction: null,               baseIncentive:  1250, dacIncentive:  1250 },

  { utility: "nyseg", category: "cat_5a", buildingType: "single_family",         construction: null,               baseIncentive:  1250, dacIncentive:  1250 },
  { utility: "nyseg", category: "cat_5a", buildingType: "apartment_or_small_sf", construction: null,               baseIncentive:  1250, dacIncentive:  1250 },

  { utility: "nyseg", category: "cat_5b", buildingType: "single_family",         construction: null,               baseIncentive:   100, dacIncentive:   100 },
  { utility: "nyseg", category: "cat_5b", buildingType: "apartment_or_small_sf", construction: null,               baseIncentive:   100, dacIncentive:   100 },

  // ── RG&E ─────────────────────────────────────────────────────────────────────
  // No cat_2a. single_family non-DAC == DAC for cat_2 and cat_2b.

  { utility: "rge", category: "cat_2",  buildingType: "single_family",         construction: "retrofit",         baseIncentive:  6000, dacIncentive:  6000 },
  { utility: "rge", category: "cat_2",  buildingType: "apartment_or_small_sf", construction: "retrofit",         baseIncentive:  3000, dacIncentive:  4000 },

  { utility: "rge", category: "cat_2b", buildingType: "single_family",         construction: "retrofit",         baseIncentive: 10000, dacIncentive: 10000 },
  { utility: "rge", category: "cat_2b", buildingType: "apartment_or_small_sf", construction: "retrofit",         baseIncentive:  5000, dacIncentive:  6000 },

  { utility: "rge", category: "cat_3",  buildingType: "single_family",         construction: "retrofit",         baseIncentive: 17000, dacIncentive: 18000 },
  { utility: "rge", category: "cat_3",  buildingType: "single_family",         construction: "new_construction", baseIncentive: 10000, dacIncentive: 11000 },
  { utility: "rge", category: "cat_3",  buildingType: "apartment_or_small_sf", construction: "retrofit",         baseIncentive:  7000, dacIncentive:  8000 },
  { utility: "rge", category: "cat_3",  buildingType: "apartment_or_small_sf", construction: "new_construction", baseIncentive:  5000, dacIncentive:  6000 },

  { utility: "rge", category: "cat_4",  buildingType: "single_family",         construction: null,               baseIncentive:  3000, dacIncentive:  3000 },
  { utility: "rge", category: "cat_4",  buildingType: "apartment_or_small_sf", construction: null,               baseIncentive:  1000, dacIncentive:  1000 },

  { utility: "rge", category: "cat_5",  buildingType: "single_family",         construction: null,               baseIncentive:  1250, dacIncentive:  1250 },
  { utility: "rge", category: "cat_5",  buildingType: "apartment_or_small_sf", construction: null,               baseIncentive:  1250, dacIncentive:  1250 },

  { utility: "rge", category: "cat_5a", buildingType: "single_family",         construction: null,               baseIncentive:  1250, dacIncentive:  1250 },
  { utility: "rge", category: "cat_5a", buildingType: "apartment_or_small_sf", construction: null,               baseIncentive:  1250, dacIncentive:  1250 },

  { utility: "rge", category: "cat_5b", buildingType: "single_family",         construction: null,               baseIncentive:   100, dacIncentive:   100 },
  { utility: "rge", category: "cat_5b", buildingType: "apartment_or_small_sf", construction: null,               baseIncentive:   100, dacIncentive:   100 },

  // ── ORANGE & ROCKLAND ────────────────────────────────────────────────────────
  // No cat_2a. No cat_5b.

  { utility: "orange_rockland", category: "cat_2",  buildingType: "single_family",         construction: "retrofit",         baseIncentive:  5000, dacIncentive:  6000 },
  { utility: "orange_rockland", category: "cat_2",  buildingType: "apartment_or_small_sf", construction: "retrofit",         baseIncentive:  3000, dacIncentive:  4000 },

  { utility: "orange_rockland", category: "cat_2b", buildingType: "single_family",         construction: "retrofit",         baseIncentive:  9000, dacIncentive: 10000 },
  { utility: "orange_rockland", category: "cat_2b", buildingType: "apartment_or_small_sf", construction: "retrofit",         baseIncentive:  5500, dacIncentive:  6500 },

  { utility: "orange_rockland", category: "cat_3",  buildingType: "single_family",         construction: "retrofit",         baseIncentive: 14000, dacIncentive: 15000 },
  { utility: "orange_rockland", category: "cat_3",  buildingType: "single_family",         construction: "new_construction", baseIncentive:  7000, dacIncentive:  8000 },
  { utility: "orange_rockland", category: "cat_3",  buildingType: "apartment_or_small_sf", construction: "retrofit",         baseIncentive:  6000, dacIncentive:  7000 },
  { utility: "orange_rockland", category: "cat_3",  buildingType: "apartment_or_small_sf", construction: "new_construction", baseIncentive:  3500, dacIncentive:  4500 },

  { utility: "orange_rockland", category: "cat_4",  buildingType: "single_family",         construction: null,               baseIncentive:  3000, dacIncentive:  3000 },
  { utility: "orange_rockland", category: "cat_4",  buildingType: "apartment_or_small_sf", construction: null,               baseIncentive:  1000, dacIncentive:  1000 },

  { utility: "orange_rockland", category: "cat_5",  buildingType: "single_family",         construction: null,               baseIncentive:  1250, dacIncentive:  1250 },
  { utility: "orange_rockland", category: "cat_5",  buildingType: "apartment_or_small_sf", construction: null,               baseIncentive:  1250, dacIncentive:  1250 },

  { utility: "orange_rockland", category: "cat_5a", buildingType: "single_family",         construction: null,               baseIncentive:  1250, dacIncentive:  1250 },
  { utility: "orange_rockland", category: "cat_5a", buildingType: "apartment_or_small_sf", construction: null,               baseIncentive:  1250, dacIncentive:  1250 },
  // No cat_5b for Orange & Rockland.

  // ── CENTRAL HUDSON ───────────────────────────────────────────────────────────
  // No cat_2a. No DAC split — baseIncentive == dacIncentive throughout.

  { utility: "central_hudson", category: "cat_2",  buildingType: "single_family",         construction: "retrofit",         baseIncentive:  5000, dacIncentive:  5000 },
  { utility: "central_hudson", category: "cat_2",  buildingType: "apartment_or_small_sf", construction: "retrofit",         baseIncentive:  3000, dacIncentive:  3000 },

  { utility: "central_hudson", category: "cat_2b", buildingType: "single_family",         construction: "retrofit",         baseIncentive:  8000, dacIncentive:  8000 },
  { utility: "central_hudson", category: "cat_2b", buildingType: "apartment_or_small_sf", construction: "retrofit",         baseIncentive:  5000, dacIncentive:  5000 },

  { utility: "central_hudson", category: "cat_3",  buildingType: "single_family",         construction: "retrofit",         baseIncentive: 18000, dacIncentive: 18000 },
  { utility: "central_hudson", category: "cat_3",  buildingType: "single_family",         construction: "new_construction", baseIncentive:  8000, dacIncentive:  8000 },
  { utility: "central_hudson", category: "cat_3",  buildingType: "apartment_or_small_sf", construction: "retrofit",         baseIncentive:  8000, dacIncentive:  8000 },
  { utility: "central_hudson", category: "cat_3",  buildingType: "apartment_or_small_sf", construction: "new_construction", baseIncentive:  4000, dacIncentive:  4000 },

  { utility: "central_hudson", category: "cat_4",  buildingType: "single_family",         construction: null,               baseIncentive:  3000, dacIncentive:  3000 },
  { utility: "central_hudson", category: "cat_4",  buildingType: "apartment_or_small_sf", construction: null,               baseIncentive:  1000, dacIncentive:  1000 },

  { utility: "central_hudson", category: "cat_5",  buildingType: "single_family",         construction: null,               baseIncentive:  1250, dacIncentive:  1250 },
  { utility: "central_hudson", category: "cat_5",  buildingType: "apartment_or_small_sf", construction: null,               baseIncentive:  1250, dacIncentive:  1250 },

  { utility: "central_hudson", category: "cat_5a", buildingType: "single_family",         construction: null,               baseIncentive:  1250, dacIncentive:  1250 },
  { utility: "central_hudson", category: "cat_5a", buildingType: "apartment_or_small_sf", construction: null,               baseIncentive:  1250, dacIncentive:  1250 },

  { utility: "central_hudson", category: "cat_5b", buildingType: "single_family",         construction: null,               baseIncentive:   100, dacIncentive:   100 },
  { utility: "central_hudson", category: "cat_5b", buildingType: "apartment_or_small_sf", construction: null,               baseIncentive:   100, dacIncentive:   100 },
];

export interface EligibilityInput {
  homeType:              HomeType;
  utility:               Utility;
  projectType:           ProjectType;
  equipmentType:         EquipmentType;
  willDecommission:      boolean;
  hasIntegratedControls: boolean;
  coversAllUnits:        boolean;
  isDac:                 boolean;
  sqft?:                 number;
  waterHeaterReplace?:   WaterHeaterReplace;
}

export interface IncentiveEstimate {
  category:              CategoryCode;
  categoryLabel:         string;
  categoryShort:         string;
  utility:               Utility;
  utilityLabel:          string;
  baseRate:              number;
  dacRate:               number;
  unit:                  string;
  isDac:                 boolean;
  estimatedIncentiveMin: number;
  estimatedIncentiveMax: number;
  dacBonus:              number;
  retailOnly:            boolean;
}

// Note: `hasIntegratedControls` only affects routing for Con Edison.
// No other utility offers Cat 2a, so the field is captured but unused
// on non-Con Edison branches. This is intentional, not a bug.
export function determineCategory(input: EligibilityInput): EligibilityResult {
  const { projectType, equipmentType, utility, willDecommission, hasIntegratedControls, coversAllUnits } = input;

  if (
    projectType === "new_construction" &&
    (equipmentType === "ashp_ducted" || equipmentType === "ashp_ductless")
  ) {
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

export function calculateEstimate(input: EligibilityInput): IncentiveEstimate | null {
  const categoryResult = determineCategory(input);
  if (categoryResult === INELIGIBLE) return null;

  const category = categoryResult;

  const buildingType: IncentiveRate["buildingType"] =
    input.utility === "con_edison" && category === "cat_3"
      ? "whole_building"
      : input.homeType === "single_family"
      ? "single_family"
      : "apartment_or_small_sf";

  const construction: "retrofit" | "new_construction" =
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

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getDocumentChecklist(category: CategoryCode): { docType: string; label: string; required: boolean }[] {
  const base = [
    { docType: "customer_agreement", label: "Customer Agreement",      required: true  },
    { docType: "equipment_specs",    label: "Equipment Specs",         required: true  },
    { docType: "ahri_cert",          label: "AHRI Certificate",        required: true  },
    { docType: "permit",             label: "Permit",                  required: true  },
    { docType: "pre_photo",          label: "Pre-Installation Photo",  required: true  },
    { docType: "post_photo",         label: "Post-Installation Photo", required: true  },
    { docType: "invoice",            label: "Invoice",                 required: true  },
  ];

  if (["cat_2", "cat_2a", "cat_2b", "cat_4"].includes(category)) {
    base.push({ docType: "manual_j", label: "Manual J Load Calculation", required: true });
  }

  if (category === "cat_3") {
    base.push({ docType: "loop_design", label: "Loop Field Design",         required: true  });
    base.push({ docType: "well_log",    label: "Well Log / Bore Hole Data", required: false });
  }

  return base;
}
