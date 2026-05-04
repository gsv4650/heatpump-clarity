// Mock data for the MVP — ready to be replaced with Supabase queries

export interface Project {
  id: string;
  contractorId: string;
  homeownerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  utility: string;
  utilityLabel: string;
  category: string;
  categoryLabel: string;
  homeType: string;
  isNewConstruction: boolean;
  isDac: boolean;
  estimatedIncentive: number;
  status: "draft" | "submitted" | "approved" | "in_progress" | "complete" | "denied";
  notes: string;
  createdAt: string;
  updatedAt: string;
  documents: ProjectDocument[];
}

export interface ProjectDocument {
  id: string;
  projectId: string;
  docType: string;
  docLabel: string;
  fileUrl: string | null;
  fileName: string | null;
  status: "missing" | "uploaded" | "approved" | "rejected";
  required: boolean;
  notes: string | null;
  uploadedAt: string | null;
}

export interface ManualUpdate {
  id: string;
  title: string;
  description: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  source: string;
  email: string;
  phone: string | null;
  name: string | null;
  utility: string;
  interest: string;
  notes: string | null;
  createdAt: string;
}

function makeDoc(
  projectId: string,
  docType: string,
  label: string,
  status: ProjectDocument["status"],
  required = true
): ProjectDocument {
  return {
    id: `doc-${projectId}-${docType}`,
    projectId,
    docType,
    docLabel: label,
    fileUrl: status !== "missing" ? `/uploads/${projectId}/${docType}.pdf` : null,
    fileName: status !== "missing" ? `${docType}.pdf` : null,
    status,
    required,
    notes: status === "rejected" ? "Image quality too low, please re-upload" : null,
    uploadedAt: status !== "missing" ? "2026-03-15T10:30:00Z" : null,
  };
}

export const SAMPLE_PROJECTS: Project[] = [
  {
    id: "proj-001",
    contractorId: "ctr-001",
    homeownerId: "ho-001",
    customerName: "Maria Rodriguez",
    customerEmail: "maria.r@email.com",
    customerPhone: "(518) 555-0142",
    address: "45 Oak Street",
    city: "Albany",
    state: "NY",
    zip: "12205",
    utility: "national_grid",
    utilityLabel: "National Grid",
    category: "cat_2b",
    categoryLabel: "ccASHP: Residential Full Load Heating with Decommissioning",
    homeType: "single_family",
    isNewConstruction: false,
    isDac: false,
    estimatedIncentive: 10000,
    status: "draft",
    notes: "Customer interested in full displacement of oil furnace",
    createdAt: "2026-03-01T09:00:00Z",
    updatedAt: "2026-03-10T14:30:00Z",
    documents: [
      makeDoc("proj-001", "customer_agreement", "Customer Agreement", "uploaded"),
      makeDoc("proj-001", "equipment_specs", "Equipment Specs", "uploaded"),
      makeDoc("proj-001", "ahri_cert", "AHRI Certificate", "missing"),
      makeDoc("proj-001", "permit", "Permit", "missing"),
      makeDoc("proj-001", "pre_photo", "Pre-Installation Photo", "missing"),
      makeDoc("proj-001", "post_photo", "Post-Installation Photo", "missing"),
      makeDoc("proj-001", "invoice", "Invoice", "missing"),
      makeDoc("proj-001", "manual_j", "Manual J Load Calculation", "missing"),
    ],
  },
  {
    id: "proj-002",
    contractorId: "ctr-001",
    homeownerId: "ho-002",
    customerName: "James Chen",
    customerEmail: "james.chen@email.com",
    customerPhone: "(914) 555-0198",
    address: "128 Maple Avenue",
    city: "White Plains",
    state: "NY",
    zip: "10601",
    utility: "con_edison",
    utilityLabel: "Con Edison",
    category: "cat_2a",
    categoryLabel: "ccASHP: Residential Full Load Heating with Integrated Controls",
    homeType: "condo",
    isNewConstruction: false,
    isDac: true,
    estimatedIncentive: 2000,
    status: "in_progress",
    notes: "Installing 3 ductless mini-split units. DAC eligible.",
    createdAt: "2026-02-15T11:00:00Z",
    updatedAt: "2026-03-20T16:45:00Z",
    documents: [
      makeDoc("proj-002", "customer_agreement", "Customer Agreement", "approved"),
      makeDoc("proj-002", "equipment_specs", "Equipment Specs", "approved"),
      makeDoc("proj-002", "ahri_cert", "AHRI Certificate", "approved"),
      makeDoc("proj-002", "permit", "Permit", "uploaded"),
      makeDoc("proj-002", "pre_photo", "Pre-Installation Photo", "uploaded"),
      makeDoc("proj-002", "post_photo", "Post-Installation Photo", "uploaded"),
      makeDoc("proj-002", "invoice", "Invoice", "missing"),
    ],
  },
  {
    id: "proj-003",
    contractorId: "ctr-001",
    homeownerId: "ho-003",
    customerName: "Sarah Thompson",
    customerEmail: "sarah.t@email.com",
    customerPhone: "(845) 555-0267",
    address: "72 River Road",
    city: "Poughkeepsie",
    state: "NY",
    zip: "12601",
    utility: "central_hudson",
    utilityLabel: "Central Hudson",
    category: "cat_3",
    categoryLabel: "GSHP: Residential Full Load Heating",
    homeType: "single_family",
    isNewConstruction: false,
    isDac: false,
    estimatedIncentive: 18000,
    status: "complete",
    notes: "5-ton GSHP installation complete. All documents verified.",
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-03-25T12:00:00Z",
    documents: [
      makeDoc("proj-003", "customer_agreement", "Customer Agreement", "approved"),
      makeDoc("proj-003", "equipment_specs", "Equipment Specs", "approved"),
      makeDoc("proj-003", "ahri_cert", "AHRI Certificate", "approved"),
      makeDoc("proj-003", "permit", "Permit", "approved"),
      makeDoc("proj-003", "pre_photo", "Pre-Installation Photo", "approved"),
      makeDoc("proj-003", "post_photo", "Post-Installation Photo", "approved"),
      makeDoc("proj-003", "invoice", "Invoice", "approved"),
      makeDoc("proj-003", "manual_j", "Manual J Load Calculation", "approved"),
      makeDoc("proj-003", "loop_design", "Loop Field Design", "approved"),
    ],
  },
  {
    id: "proj-004",
    contractorId: "ctr-001",
    homeownerId: "ho-004",
    customerName: "Robert Williams",
    customerEmail: "rwilliams@email.com",
    customerPhone: "(607) 555-0334",
    address: "310 Elm Street",
    city: "Ithaca",
    state: "NY",
    zip: "14850",
    utility: "nyseg",
    utilityLabel: "NYSEG",
    category: "cat_5",
    categoryLabel: "Downstream Domestic Water Heating",
    homeType: "single_family",
    isNewConstruction: false,
    isDac: true,
    estimatedIncentive: 1250,
    status: "denied",
    notes: "Denied — equipment does not meet minimum efficiency requirements (UEF < 3.3).",
    createdAt: "2026-02-20T13:00:00Z",
    updatedAt: "2026-03-18T09:30:00Z",
    documents: [
      makeDoc("proj-004", "customer_agreement", "Customer Agreement", "approved"),
      makeDoc("proj-004", "equipment_specs", "Equipment Specs", "rejected"),
      makeDoc("proj-004", "ahri_cert", "AHRI Certificate", "uploaded"),
      makeDoc("proj-004", "permit", "Permit", "uploaded"),
      makeDoc("proj-004", "pre_photo", "Pre-Installation Photo", "uploaded"),
      makeDoc("proj-004", "post_photo", "Post-Installation Photo", "missing"),
      makeDoc("proj-004", "invoice", "Invoice", "missing"),
    ],
  },
];

export const SAMPLE_MANUAL_UPDATES: ManualUpdate[] = [
  {
    id: "upd-001",
    title: "March 2026: Weatherized Tier launches September 1, 2026",
    description:
      "NYS Clean Heat will introduce a differentiated incentive tier on September 1, 2026 for space heating projects that meet a minimum weatherization standard, as directed by the May 2025 Non-LMI EE/BE Order. Specific incentive rates for the Weatherized Tier have not yet been published. Source: Program Manual Version 2, March 5, 2026, version history table (page iv) and Section 2.1.5 (page 8).",
    published: true,
    createdAt: "2026-03-05T00:00:00Z",
    updatedAt: "2026-03-05T00:00:00Z",
  },
  {
    id: "upd-002",
    title: "January 2026: Orange & Rockland incentive amounts corrected",
    description:
      "Program Manual Version 1.1, filed January 23, 2026, corrected a small error in the Orange & Rockland incentive amounts in Section 2.2.7. Contractors working in O&R territory should reference the current incentive table for accurate amounts. Source: Program Manual Version 1.1, version history table (page iv) and Section 2.2.7 (page 14).",
    published: true,
    createdAt: "2026-01-23T00:00:00Z",
    updatedAt: "2026-01-23T00:00:00Z",
  },
  {
    id: "upd-003",
    title: "January 2026: New documentation requirements for Category 2 projects",
    description:
      "Starting February 1, 2026, all Category 2 (New Construction) projects must include a completed Manual J load calculation with the application. Previously this was optional for new construction.",
    published: false,
    createdAt: "2026-01-20T14:00:00Z",
    updatedAt: "2026-01-20T14:00:00Z",
  },
];

export const SAMPLE_LEADS: Lead[] = [
  {
    id: "lead-001",
    source: "eligibility_wizard",
    email: "homeowner1@email.com",
    phone: null,
    name: "John Doe",
    utility: "con_edison",
    interest: "cat_2a",
    notes: null,
    createdAt: "2026-03-28T15:00:00Z",
  },
  {
    id: "lead-002",
    source: "eligibility_wizard",
    email: "jane.smith@email.com",
    phone: "(212) 555-0199",
    name: "Jane Smith",
    utility: "national_grid",
    interest: "cat_3",
    notes: null,
    createdAt: "2026-03-27T11:30:00Z",
  },
  {
    id: "lead-003",
    source: "estimate_page",
    email: "mikeb@email.com",
    phone: null,
    name: "Mike Brown",
    utility: "central_hudson",
    interest: "cat_4",
    notes: "Interested in ground source for 3000 sq ft home",
    createdAt: "2026-03-25T09:15:00Z",
  },
  {
    id: "lead-004",
    source: "eligibility_wizard",
    email: "lisa.w@email.com",
    phone: null,
    name: "Lisa Wang",
    utility: "nyseg",
    interest: "cat_5b",
    notes: null,
    createdAt: "2026-03-22T16:45:00Z",
  },
];

export function getProjectById(id: string): Project | undefined {
  return SAMPLE_PROJECTS.find((p) => p.id === id);
}

export function getProjectsByStatus(status?: string): Project[] {
  if (!status || status === "all") return SAMPLE_PROJECTS;
  if (status === "needs_docs") {
    return SAMPLE_PROJECTS.filter((p) =>
      p.documents.some((d) => d.required && d.status === "missing")
    );
  }
  return SAMPLE_PROJECTS.filter((p) => p.status === status);
}

export function getDocumentReadiness(project: Project): number {
  const required = project.documents.filter((d) => d.required);
  if (required.length === 0) return 100;
  const done = required.filter((d) => d.status !== "missing").length;
  return Math.round((done / required.length) * 100);
}
