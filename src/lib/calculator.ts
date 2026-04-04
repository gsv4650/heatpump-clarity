export type HomeType = "single_family" | "multi_family_2_4" | "condo";
export type ProjectType = "new_construction" | "retrofit_full" | "retrofit_partial";
export type EquipmentType = "ashp_ducted" | "ashp_ductless" | "gshp" | "hpwh";
export type WaterHeaterReplace = "electric" | "fossil_fuel";
export type CategoryCode = "cat_2" | "cat_2a" | "cat_2b" | "cat_3" | "cat_4" | "cat_5" | "cat_5a" | "cat_5b";

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
  cat_2: "Air Source Heat Pump (Ducted) — New Construction",
  cat_2a: "Air Source Heat Pump (Ducted) — Retrofit, Full Displacement",
  cat_2b: "Air Source Heat Pump (Ducted) — Retrofit, Partial Displacement",
  cat_3: "Air Source Heat Pump (Ductless/Mini-Split)",
  cat_4: "Ground Source Heat Pump",
  cat_5: "Heat Pump Water Heater — New Construction",
  cat_5a: "Heat Pump Water Heater — Replacing Electric",
  cat_5b: "Heat Pump Water Heater — Replacing Fossil Fuel",
};

export const CATEGORY_SHORT: Record<CategoryCode, string> = {
  cat_2: "Category 2",
  cat_2a: "Category 2a",
  cat_2b: "Category 2b",
  cat_3: "Category 3",
  cat_4: "Category 4",
  cat_5: "Category 5",
  cat_5a: "Category 5a",
  cat_5b: "Category 5b",
};

export interface IncentiveRate {
  utility: Utility;
  category: CategoryCode;
  baseIncentive: number;
  dacIncentive: number;
  unit: "per_ton" | "per_unit" | "flat";
  minEfficiency?: string;
}

// Realistic NYS Clean Heat incentive data
export const INCENTIVE_RATES: IncentiveRate[] = [
  // Con Edison
  { utility: "con_edison", category: "cat_2", baseIncentive: 1000, dacIncentive: 1500, unit: "per_ton" },
  { utility: "con_edison", category: "cat_2a", baseIncentive: 1200, dacIncentive: 1800, unit: "per_ton" },
  { utility: "con_edison", category: "cat_2b", baseIncentive: 800, dacIncentive: 1200, unit: "per_ton" },
  { utility: "con_edison", category: "cat_3", baseIncentive: 500, dacIncentive: 750, unit: "per_unit" },
  { utility: "con_edison", category: "cat_4", baseIncentive: 1500, dacIncentive: 2000, unit: "per_ton" },
  { utility: "con_edison", category: "cat_5", baseIncentive: 500, dacIncentive: 700, unit: "per_unit" },
  { utility: "con_edison", category: "cat_5a", baseIncentive: 500, dacIncentive: 700, unit: "per_unit" },
  { utility: "con_edison", category: "cat_5b", baseIncentive: 700, dacIncentive: 1000, unit: "per_unit" },

  // National Grid
  { utility: "national_grid", category: "cat_2", baseIncentive: 950, dacIncentive: 1425, unit: "per_ton" },
  { utility: "national_grid", category: "cat_2a", baseIncentive: 1150, dacIncentive: 1725, unit: "per_ton" },
  { utility: "national_grid", category: "cat_2b", baseIncentive: 750, dacIncentive: 1125, unit: "per_ton" },
  { utility: "national_grid", category: "cat_3", baseIncentive: 475, dacIncentive: 712, unit: "per_unit" },
  { utility: "national_grid", category: "cat_4", baseIncentive: 1450, dacIncentive: 1950, unit: "per_ton" },
  { utility: "national_grid", category: "cat_5", baseIncentive: 475, dacIncentive: 675, unit: "per_unit" },
  { utility: "national_grid", category: "cat_5a", baseIncentive: 475, dacIncentive: 675, unit: "per_unit" },
  { utility: "national_grid", category: "cat_5b", baseIncentive: 675, dacIncentive: 975, unit: "per_unit" },

  // Central Hudson
  { utility: "central_hudson", category: "cat_2", baseIncentive: 1000, dacIncentive: 1500, unit: "per_ton" },
  { utility: "central_hudson", category: "cat_2a", baseIncentive: 1200, dacIncentive: 1800, unit: "per_ton" },
  { utility: "central_hudson", category: "cat_2b", baseIncentive: 800, dacIncentive: 1200, unit: "per_ton" },
  { utility: "central_hudson", category: "cat_3", baseIncentive: 500, dacIncentive: 750, unit: "per_unit" },
  { utility: "central_hudson", category: "cat_4", baseIncentive: 1500, dacIncentive: 2000, unit: "per_ton" },
  { utility: "central_hudson", category: "cat_5", baseIncentive: 500, dacIncentive: 700, unit: "per_unit" },
  { utility: "central_hudson", category: "cat_5a", baseIncentive: 500, dacIncentive: 700, unit: "per_unit" },
  { utility: "central_hudson", category: "cat_5b", baseIncentive: 700, dacIncentive: 1000, unit: "per_unit" },

  // NYSEG
  { utility: "nyseg", category: "cat_2", baseIncentive: 950, dacIncentive: 1425, unit: "per_ton" },
  { utility: "nyseg", category: "cat_2a", baseIncentive: 1100, dacIncentive: 1650, unit: "per_ton" },
  { utility: "nyseg", category: "cat_2b", baseIncentive: 750, dacIncentive: 1125, unit: "per_ton" },
  { utility: "nyseg", category: "cat_3", baseIncentive: 475, dacIncentive: 712, unit: "per_unit" },
  { utility: "nyseg", category: "cat_4", baseIncentive: 1400, dacIncentive: 1900, unit: "per_ton" },
  { utility: "nyseg", category: "cat_5", baseIncentive: 475, dacIncentive: 675, unit: "per_unit" },
  { utility: "nyseg", category: "cat_5a", baseIncentive: 475, dacIncentive: 675, unit: "per_unit" },
  { utility: "nyseg", category: "cat_5b", baseIncentive: 650, dacIncentive: 950, unit: "per_unit" },

  // RG&E
  { utility: "rge", category: "cat_2", baseIncentive: 950, dacIncentive: 1425, unit: "per_ton" },
  { utility: "rge", category: "cat_2a", baseIncentive: 1100, dacIncentive: 1650, unit: "per_ton" },
  { utility: "rge", category: "cat_2b", baseIncentive: 750, dacIncentive: 1125, unit: "per_ton" },
  { utility: "rge", category: "cat_3", baseIncentive: 475, dacIncentive: 712, unit: "per_unit" },
  { utility: "rge", category: "cat_4", baseIncentive: 1400, dacIncentive: 1900, unit: "per_ton" },
  { utility: "rge", category: "cat_5", baseIncentive: 475, dacIncentive: 675, unit: "per_unit" },
  { utility: "rge", category: "cat_5a", baseIncentive: 475, dacIncentive: 675, unit: "per_unit" },
  { utility: "rge", category: "cat_5b", baseIncentive: 650, dacIncentive: 950, unit: "per_unit" },

  // Orange & Rockland
  { utility: "orange_rockland", category: "cat_2", baseIncentive: 1000, dacIncentive: 1500, unit: "per_ton" },
  { utility: "orange_rockland", category: "cat_2a", baseIncentive: 1200, dacIncentive: 1800, unit: "per_ton" },
  { utility: "orange_rockland", category: "cat_2b", baseIncentive: 800, dacIncentive: 1200, unit: "per_ton" },
  { utility: "orange_rockland", category: "cat_3", baseIncentive: 500, dacIncentive: 750, unit: "per_unit" },
  { utility: "orange_rockland", category: "cat_4", baseIncentive: 1500, dacIncentive: 2000, unit: "per_ton" },
  { utility: "orange_rockland", category: "cat_5", baseIncentive: 500, dacIncentive: 700, unit: "per_unit" },
  { utility: "orange_rockland", category: "cat_5a", baseIncentive: 500, dacIncentive: 700, unit: "per_unit" },
  { utility: "orange_rockland", category: "cat_5b", baseIncentive: 700, dacIncentive: 1000, unit: "per_unit" },
];

export interface EligibilityInput {
  homeType: HomeType;
  utility: Utility;
  projectType: ProjectType;
  equipmentType: EquipmentType;
  waterHeaterReplace?: WaterHeaterReplace;
  isDac: boolean;
  sqft?: number;
}

export interface IncentiveEstimate {
  category: CategoryCode;
  categoryLabel: string;
  categoryShort: string;
  utility: Utility;
  utilityLabel: string;
  baseRate: number;
  dacRate: number;
  unit: string;
  isDac: boolean;
  estimatedIncentiveMin: number;
  estimatedIncentiveMax: number;
  dacBonus: number;
}

export function determineCategory(input: EligibilityInput): CategoryCode {
  const { projectType, equipmentType, waterHeaterReplace } = input;

  if (equipmentType === "gshp") return "cat_4";

  if (equipmentType === "ashp_ductless") return "cat_3";

  if (equipmentType === "hpwh") {
    if (projectType === "new_construction") return "cat_5";
    if (waterHeaterReplace === "fossil_fuel") return "cat_5b";
    return "cat_5a";
  }

  // ashp_ducted
  if (projectType === "new_construction") return "cat_2";
  if (projectType === "retrofit_full") return "cat_2a";
  return "cat_2b";
}

export function calculateEstimate(input: EligibilityInput): IncentiveEstimate | null {
  const category = determineCategory(input);
  const rate = INCENTIVE_RATES.find(
    (r) => r.utility === input.utility && r.category === category
  );

  if (!rate) return null;

  const appliedRate = input.isDac ? rate.dacIncentive : rate.baseIncentive;

  // Estimate typical system sizes for range calculation
  let minUnits = 1;
  let maxUnits = 1;

  if (rate.unit === "per_ton") {
    // Typical residential: 2-5 tons
    minUnits = 2;
    maxUnits = 5;
    if (input.sqft) {
      // Rough rule: 1 ton per 500-600 sq ft
      const estimated = Math.ceil(input.sqft / 550);
      minUnits = Math.max(2, estimated - 1);
      maxUnits = Math.min(8, estimated + 1);
    }
  } else if (rate.unit === "per_unit") {
    if (input.equipmentType === "ashp_ductless") {
      minUnits = 1;
      maxUnits = 4;
    } else {
      minUnits = 1;
      maxUnits = 1;
    }
  }

  const dacBonus = input.isDac
    ? (rate.dacIncentive - rate.baseIncentive) * minUnits
    : 0;

  return {
    category,
    categoryLabel: CATEGORY_LABELS[category],
    categoryShort: CATEGORY_SHORT[category],
    utility: input.utility,
    utilityLabel: UTILITY_LABELS[input.utility],
    baseRate: rate.baseIncentive,
    dacRate: rate.dacIncentive,
    unit: rate.unit === "per_ton" ? "per ton" : rate.unit === "per_unit" ? "per unit" : "flat",
    isDac: input.isDac,
    estimatedIncentiveMin: appliedRate * minUnits,
    estimatedIncentiveMax: appliedRate * maxUnits,
    dacBonus,
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
    { docType: "customer_agreement", label: "Customer Agreement", required: true },
    { docType: "equipment_specs", label: "Equipment Specs", required: true },
    { docType: "ahri_cert", label: "AHRI Certificate", required: true },
    { docType: "permit", label: "Permit", required: true },
    { docType: "pre_photo", label: "Pre-Installation Photo", required: true },
    { docType: "post_photo", label: "Post-Installation Photo", required: true },
    { docType: "invoice", label: "Invoice", required: true },
  ];

  if (["cat_2", "cat_2a", "cat_2b", "cat_4"].includes(category)) {
    base.push({ docType: "manual_j", label: "Manual J Load Calculation", required: true });
  }

  if (category === "cat_4") {
    base.push({ docType: "loop_design", label: "Loop Field Design", required: true });
    base.push({ docType: "well_log", label: "Well Log / Bore Hole Data", required: false });
  }

  return base;
}
