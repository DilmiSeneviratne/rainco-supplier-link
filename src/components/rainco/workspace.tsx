import { createContext, useContext, useState, type ReactNode } from "react";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import {
  Building2,
  ChevronDown,
  ClipboardCheck,
  FileCheck2,
  FileText,
  Layers,
  Layers3,
  LayoutDashboard,
  ListOrdered,
  LogIn,
  LogOut,
  Mail,
  ShieldCheck,
  Star,
  UserCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type BusinessType = "Individual" | "Corporate" | "Government";
export type DocumentRow = { code: string; name: string };
export type SupplierTypeRow = { id: string; code: string; name: string; isActive: boolean };
export type DepartmentRow = { id: string; code: string; name: string; isActive: boolean };
export type CriteriaType = "Category" | "Performance";
export type SubCriteriaRow = {
  id: string;
  code: string;
  indication: string;
  description: string;
  criteriaValue: string;
};
export type CriteriaMasterRow = {
  id: string;
  criteriaType: CriteriaType;
  code: string;
  name: string;
  subCriterias: SubCriteriaRow[];
};
export type RatingConditionRow = {
  id: string;
  condition: string;
  marks: number;
};
export type RatingMasterRow = {
  id: string;
  supplierType: string;
  code: string;
  name: string;
  selectedCriteriaIds: string[];
  subCriteriaWeights: Record<string, number>;
  subCriteriaRatings: Record<string, RatingConditionRow[]>;
  approvalStatus?: "Pending Approval" | "Approved" | "Rejected";
};
export type SystemUserRow = {
  id: string;
  username: string;
  password?: string;
  fullName: string;
  email: string;
  department: string;
  isActive: boolean;
};
export const businessTypes: BusinessType[] = ["Individual", "Corporate", "Government"];

const initialSupplierTypes: SupplierTypeRow[] = [
  { id: "ST-1", code: "LOCAL", name: "Local", isActive: true },
  { id: "ST-2", code: "FOREIGN", name: "Foreign", isActive: true },
];

const initialDepartments: DepartmentRow[] = [
  { id: "DEP-1", code: "PROC", name: "Procurement", isActive: true },
  { id: "DEP-2", code: "FIN", name: "Finance & Accounts", isActive: true },
  { id: "DEP-3", code: "GOV", name: "Corporate Governance", isActive: true },
  { id: "DEP-4", code: "QA", name: "Quality Assurance", isActive: true },
  { id: "DEP-5", code: "LEGAL", name: "Legal & Compliance", isActive: true },
  { id: "DEP-6", code: "OPS", name: "Supply Chain Operations", isActive: true },
];

const initialCriterias: CriteriaMasterRow[] = [
  {
    id: "CRI-1",
    criteriaType: "Performance",
    code: "MCR-001",
    name: "Cost",
    subCriterias: [
      {
        id: "SUB-1",
        code: "SUB-001",
        indication: "Competitive Price",
        description: "Price variance against benchmark market price",
        criteriaValue: "Percentage",
      },
      {
        id: "SUB-2",
        code: "SUB-002",
        indication: "Credit Period",
        description: "Agreed supplier payment credit period in days",
        criteriaValue: "Range",
      },
    ],
  },
  {
    id: "CRI-2",
    criteriaType: "Performance",
    code: "MCR-002",
    name: "Quality",
    subCriterias: [
      {
        id: "SUB-3",
        code: "SUB-003",
        indication: "Damage %- Incoming Inspection",
        description: "Incoming goods inspection damage percentage",
        criteriaValue: "Percentage",
      },
      {
        id: "SUB-4",
        code: "SUB-004",
        indication: "RM Stores Return Rate %- During the Process",
        description: "Raw material stores return rate percentage during production process",
        criteriaValue: "Percentage",
      },
      {
        id: "SUB-5",
        code: "SUB-005",
        indication: "Corrective Actions",
        description: "Responsiveness and completion of corrective action requests",
        criteriaValue: "Quantity",
      },
    ],
  },
  {
    id: "CRI-3",
    criteriaType: "Category",
    code: "MCR-003",
    name: "Supply",
    subCriterias: [
      {
        id: "SUB-6",
        code: "SUB-006",
        indication: "Supply on time (ETD Delay)",
        description: "Estimated time of departure delay in days",
        criteriaValue: "Range",
      },
      {
        id: "SUB-7",
        code: "SUB-007",
        indication: "Ontime quantity (PO vs Delivery)",
        description: "Purchase order vs actual delivered quantity variance",
        criteriaValue: "Percentage",
      },
      {
        id: "SUB-8",
        code: "SUB-008",
        indication: "Ordering to delivery lead time",
        description: "Standard ordering to delivery lead time adherence",
        criteriaValue: "Text",
      },
      {
        id: "SUB-9",
        code: "SUB-009",
        indication: "Flexiblity to availability",
        description: "Supplier flexibility to urgent stock availability requirements",
        criteriaValue: "Percentage",
      },
      {
        id: "SUB-10",
        code: "SUB-010",
        indication: "MOQ",
        description: "Minimum order quantity compliance level",
        criteriaValue: "Text",
      },
    ],
  },
];

const initialRatingMasters: RatingMasterRow[] = [
  {
    id: "RAT-1",
    supplierType: "Foreign",
    code: "RAT-001",
    name: "Performance Scorecard",
    selectedCriteriaIds: ["CRI-1", "CRI-2", "CRI-3"],
    approvalStatus: "Approved",
    subCriteriaWeights: {
      "SUB-1": 10,
      "SUB-2": 10,
      "SUB-3": 10,
      "SUB-4": 10,
      "SUB-5": 10,
      "SUB-6": 10,
      "SUB-7": 10,
      "SUB-8": 10,
      "SUB-9": 10,
      "SUB-10": 10,
    },
    subCriteriaRatings: {
      "SUB-1": [
        { id: "RC-1", condition: "≤2%", marks: 10 },
        { id: "RC-2", condition: "≤5%", marks: 8 },
        { id: "RC-3", condition: "≤10%", marks: 6 },
        { id: "RC-4", condition: "≤15%", marks: 4 },
      ],
      "SUB-2": [
        { id: "RC-5", condition: "120 days", marks: 10 },
        { id: "RC-6", condition: "90 days", marks: 8 },
        { id: "RC-7", condition: "60 days", marks: 6 },
      ],
      "SUB-3": [
        { id: "RC-8", condition: "≤0.5%", marks: 10 },
        { id: "RC-9", condition: "≤1%", marks: 8 },
        { id: "RC-10", condition: "≤1.5%", marks: 6 },
        { id: "RC-11", condition: "≤3%", marks: 2 },
      ],
      "SUB-4": [
        { id: "RC-12", condition: "≤0.5%", marks: 10 },
        { id: "RC-13", condition: "≤1%", marks: 8 },
        { id: "RC-14", condition: "≤2%", marks: 6 },
      ],
      "SUB-5": [
        { id: "RC-15", condition: "0", marks: 10 },
        { id: "RC-16", condition: "1", marks: 8 },
        { id: "RC-17", condition: "2", marks: 4 },
      ],
      "SUB-6": [
        { id: "RC-18", condition: "0 days", marks: 10 },
        { id: "RC-19", condition: "1-2 days", marks: 8 },
        { id: "RC-20", condition: "3-4 days", marks: 6 },
        { id: "RC-21", condition: "5 days", marks: 4 },
        { id: "RC-22", condition: "6 days", marks: 2 },
      ],
      "SUB-7": [
        { id: "RC-23", condition: "≤2%", marks: 10 },
        { id: "RC-24", condition: "≤5%", marks: 8 },
        { id: "RC-25", condition: "≤10%", marks: 6 },
      ],
      "SUB-8": [
        { id: "RC-26", condition: "L", marks: 10 },
        { id: "RC-27", condition: "L+5", marks: 8 },
        { id: "RC-28", condition: "L+10", marks: 6 },
        { id: "RC-29", condition: "L+15", marks: 4 },
      ],
      "SUB-9": [
        { id: "RC-30", condition: "≥90%", marks: 10 },
        { id: "RC-31", condition: "≥80%", marks: 6 },
        { id: "RC-32", condition: "≥60%", marks: 2 },
        { id: "RC-33", condition: "<60%", marks: 0 },
      ],
      "SUB-10": [
        { id: "RC-34", condition: "M", marks: 10 },
        { id: "RC-35", condition: "M+10%", marks: 6 },
      ],
    },
  },
];

const initialSystemUsers: SystemUserRow[] = [
  {
    id: "USR-1",
    username: "sunil.j",
    password: "password123",
    fullName: "Sunil Jayawardena",
    email: "sunil.j@rainco.example",
    department: "Procurement",
    isActive: true,
  },
  {
    id: "USR-2",
    username: "nadeeka.p",
    password: "password123",
    fullName: "Nadeeka Perera",
    email: "nadeeka.p@rainco.example",
    department: "Finance & Accounts",
    isActive: true,
  },
  {
    id: "USR-3",
    username: "anura.d",
    password: "password123",
    fullName: "Anura Dissanayake",
    email: "anura.d@rainco.example",
    department: "Corporate Governance",
    isActive: true,
  },
  {
    id: "USR-4",
    username: "dilmi.s",
    password: "password123",
    fullName: "Dilmi Seneviratne",
    email: "dilmi.s@rainco.example",
    department: "Procurement",
    isActive: true,
  },
];

const initialUserPermissions: Record<string, string[]> = {
  "USR-1": [
    "Supplier Checklist",
    "Supplier Types",
    "Departments",
    "Criterias",
    "Ratings",
    "Approval Stages",
    "Approval Template",
    "Approval Queue",
    "Evaluation Sheet",
    "Suppliers",
  ],
  "USR-2": ["Supplier Checklist", "Approval Queue", "Evaluation Sheet", "Suppliers"],
  "USR-3": [
    "Supplier Checklist",
    "Supplier Types",
    "Departments",
    "Criterias",
    "Ratings",
    "Users",
    "User Permissions",
    "Suppliers",
    "Approval Stages",
    "Approval Template",
    "Approval Queue",
    "Evaluation Sheet",
  ],
  "USR-4": [
    "Supplier Checklist",
    "Supplier Types",
    "Departments",
    "Criterias",
    "Ratings",
    "Suppliers",
    "Approval Stages",
    "Approval Template",
    "Approval Queue",
    "Evaluation Sheet",
  ],
};
const initialDocuments: Record<BusinessType, DocumentRow[]> = {
  Corporate: [
    { code: "COR-001", name: "Certificate of Incorporation" },
    { code: "COR-002", name: "VAT Registration Certificate" },
    { code: "COR-003", name: "Bank Confirmation Letter" },
    { code: "COR-004", name: "Audited Financial Statements" },
  ],
  Individual: [
    { code: "IND-001", name: "National Identity Card" },
    { code: "IND-002", name: "Bank Confirmation Letter" },
  ],
  Government: [
    { code: "GOV-001", name: "Government Establishment Certificate" },
    { code: "GOV-002", name: "Authorized Signatory Letter" },
  ],
};

export type AuthorizerRow = {
  id: string;
  name: string;
  department: string;
  role: string;
};

export type ApprovalStage = {
  id: string;
  name: string;
  description: string;
  approvalsRequired: number;
  rejectionsRequired: number;
  isActive: boolean;
  authorizers: AuthorizerRow[];
};

export type ApprovalTemplate = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  authorizedSections: string[];
  stageIds: string[];
};

export type StageApprovalStatus = {
  stageId: string;
  stageName: string;
  description: string;
  approvalsRequired: number;
  rejectionsRequired: number;
  status: "Pending" | "Approved" | "Rejected";
  approvedBy: string[];
  rejectedBy: string[];
  remarks: string[];
  updatedAt?: string;
};

export type ApprovalProcessType = "Supplier Registration" | "Ratings" | "Supplier Evaluation";

export type EvaluationSubCriteriaEntry = {
  mainId: string;
  mainCode: string;
  mainName: string;
  criteriaType?: CriteriaType;
  subId: string;
  subCode: string;
  subIndication: string;
  criteriaValue: string;
  condition: string;
  score: number;
  marks: number;
};

export type SupplierEvaluationRecord = {
  id: string;
  supplierName: string;
  ratingId: string;
  ratingCode: string;
  ratingName: string;
  fromDate: string;
  toDate: string;
  totalScore: number;
  totalMarks: number;
  percentage: number;
  feasibilityScore: number;
  desirabilityScore: number;
  remark: string;
  submittedDate: string;
  approvalStatus: "Pending Approval" | "Approved" | "Rejected";
  subCriteriaEntries?: EvaluationSubCriteriaEntry[];
};

export type SupplierApprovalProcess = {
  id: string;
  processType: ApprovalProcessType;
  targetId?: string;
  supplierName: string;
  supplierEmail: string;
  registrationDate: string;
  templateId: string;
  templateName: string;
  currentStageIndex: number;
  overallStatus: "Pending Approval" | "Approved" | "Rejected";
  stages: StageApprovalStatus[];
};

export type SupplierMasterStatus = "Active" | "Pending Approval" | "Inactive" | "Blacklisted";

export type RegisteredSupplier = {
  name: string;
  email: string;
  phone: string;
  businessType: BusinessType;
  currency: string;
  registrationNo: string;
  username: string;
  password?: string;
  remark?: string;
  contactsCount: number;
  documentsAttached: number;
  totalDocumentsRequired: number;
  registrationDate: string;
  sapPartnerId: string;
  status: SupplierMasterStatus;
  transactionBlocked?: boolean;
  statusUpdatedBy?: string;
  statusUpdatedAt?: string;
  assignedRatingCode?: string;
  assignedRatingName?: string;
  evaluationScore?: number;
  evaluationMarks?: number;
  evaluationPercentage?: number;
  feasibilityScore?: number;
  desirabilityScore?: number;
  evaluationPeriod?: string;
};

const initialSupplier: RegisteredSupplier = {
  name: "LEABON",
  email: "export@leabon.example",
  phone: "+86 571 8821 3010",
  businessType: "Corporate",
  currency: "USD",
  registrationNo: "CN-33010041",
  username: "leabon_ops",
  password: "password123",
  remark: "Evaluated under Performance Scorecard (30-Apr-2023).",
  contactsCount: 2,
  documentsAttached: 4,
  totalDocumentsRequired: 4,
  registrationDate: "30 Apr 2023",
  sapPartnerId: "V-10001",
  status: "Active",
  assignedRatingCode: "RAT-001",
  assignedRatingName: "Performance Scorecard",
  evaluationScore: 100,
  evaluationMarks: 74,
  evaluationPercentage: 74,
  feasibilityScore: 68,
  desirabilityScore: 80,
  evaluationPeriod: "2023-01-01 to 2023-04-30",
};

const initialSuppliersList: RegisteredSupplier[] = [
  initialSupplier,
  {
    name: "ISO",
    email: "sales@iso-supply.example",
    phone: "+86 512 6749 2210",
    businessType: "Corporate",
    currency: "USD",
    registrationNo: "CN-32050082",
    username: "iso_vendor",
    contactsCount: 2,
    documentsAttached: 4,
    totalDocumentsRequired: 4,
    registrationDate: "30 Apr 2023",
    sapPartnerId: "V-10002",
    status: "Active",
    assignedRatingCode: "RAT-001",
    assignedRatingName: "Performance Scorecard",
    evaluationScore: 100,
    evaluationMarks: 62,
    evaluationPercentage: 62,
    feasibilityScore: 56,
    desirabilityScore: 68,
    evaluationPeriod: "2023-01-01 to 2023-04-30",
  },
  {
    name: "SUZHOU Q",
    email: "export@suzhouq.example",
    phone: "+86 512 6291 4401",
    businessType: "Corporate",
    currency: "USD",
    registrationNo: "CN-32050199",
    username: "suzhou_q",
    contactsCount: 3,
    documentsAttached: 4,
    totalDocumentsRequired: 4,
    registrationDate: "30 Apr 2023",
    sapPartnerId: "V-10003",
    status: "Active",
    assignedRatingCode: "RAT-001",
    assignedRatingName: "Performance Scorecard",
    evaluationScore: 100,
    evaluationMarks: 80,
    evaluationPercentage: 80,
    feasibilityScore: 76,
    desirabilityScore: 84,
    evaluationPeriod: "2023-01-01 to 2023-04-30",
  },
  {
    name: "HENGSHI",
    email: "info@hengshi.example",
    phone: "+86 575 8519 7732",
    businessType: "Corporate",
    currency: "USD",
    registrationNo: "CN-33060215",
    username: "hengshi",
    contactsCount: 2,
    documentsAttached: 4,
    totalDocumentsRequired: 4,
    registrationDate: "30 Apr 2023",
    sapPartnerId: "V-10004",
    status: "Active",
    assignedRatingCode: "RAT-001",
    assignedRatingName: "Performance Scorecard",
    evaluationScore: 100,
    evaluationMarks: 88,
    evaluationPercentage: 88,
    feasibilityScore: 88,
    desirabilityScore: 88,
    evaluationPeriod: "2023-01-01 to 2023-04-30",
  },
  {
    name: "PVC",
    email: "orders@pvc-materials.example",
    phone: "+86 755 2940 1180",
    businessType: "Corporate",
    currency: "USD",
    registrationNo: "CN-44030812",
    username: "pvc_supplier",
    contactsCount: 2,
    documentsAttached: 4,
    totalDocumentsRequired: 4,
    registrationDate: "30 Apr 2023",
    sapPartnerId: "V-10005",
    status: "Active",
    assignedRatingCode: "RAT-001",
    assignedRatingName: "Performance Scorecard",
    evaluationScore: 100,
    evaluationMarks: 70,
    evaluationPercentage: 70,
    feasibilityScore: 64,
    desirabilityScore: 76,
    evaluationPeriod: "2023-01-01 to 2023-04-30",
  },
  {
    name: "ZHOUFENG",
    email: "contact@zhoufeng.example",
    phone: "+86 579 8554 9021",
    businessType: "Corporate",
    currency: "USD",
    registrationNo: "CN-33078204",
    username: "zhoufeng",
    contactsCount: 2,
    documentsAttached: 4,
    totalDocumentsRequired: 4,
    registrationDate: "30 Apr 2023",
    sapPartnerId: "V-10006",
    status: "Active",
    assignedRatingCode: "RAT-001",
    assignedRatingName: "Performance Scorecard",
    evaluationScore: 100,
    evaluationMarks: 70,
    evaluationPercentage: 70,
    feasibilityScore: 56,
    desirabilityScore: 84,
    evaluationPeriod: "2023-01-01 to 2023-04-30",
  },
  {
    name: "FUJIAN CHANGLE",
    email: "export@fujianchangle.example",
    phone: "+86 591 2881 6609",
    businessType: "Corporate",
    currency: "USD",
    registrationNo: "CN-35018266",
    username: "fujian_changle",
    contactsCount: 3,
    documentsAttached: 4,
    totalDocumentsRequired: 4,
    registrationDate: "30 Apr 2023",
    sapPartnerId: "V-10007",
    status: "Active",
    assignedRatingCode: "RAT-001",
    assignedRatingName: "Performance Scorecard",
    evaluationScore: 100,
    evaluationMarks: 80,
    evaluationPercentage: 80,
    feasibilityScore: 72,
    desirabilityScore: 88,
    evaluationPeriod: "2023-01-01 to 2023-04-30",
  },
];

const initialStages: ApprovalStage[] = [
  {
    id: "STAGE-1",
    name: "Procurement Desk Review",
    description:
      "Verify company registration, authorized contact identity, and business category eligibility.",
    approvalsRequired: 1,
    rejectionsRequired: 1,
    isActive: true,
    authorizers: [
      { id: "AUTH-1", name: "Sunil Jayawardena", department: "Procurement", role: "Category Lead" },
      {
        id: "AUTH-2",
        name: "Malik Fernando",
        department: "Procurement",
        role: "Sourcing Executive",
      },
    ],
  },
  {
    id: "STAGE-2",
    name: "Finance & Tax Verification",
    description:
      "Audit VAT registration certificates, banking confirmation letters, and fiscal compliance.",
    approvalsRequired: 1,
    rejectionsRequired: 1,
    isActive: true,
    authorizers: [
      {
        id: "AUTH-3",
        name: "Nadeeka Perera",
        department: "Finance & Accounts",
        role: "Senior Accountant",
      },
      {
        id: "AUTH-4",
        name: "Kamal Wickramasinghe",
        department: "Finance & Accounts",
        role: "Treasury Manager",
      },
    ],
  },
  {
    id: "STAGE-3",
    name: "Commercial & Compliance Sign-off",
    description:
      "Final executive approval for onboarding and SAP Business One vendor master activation.",
    approvalsRequired: 1,
    rejectionsRequired: 1,
    isActive: true,
    authorizers: [
      {
        id: "AUTH-5",
        name: "Anura Dissanayake",
        department: "Corporate Governance",
        role: "Head of Procurement",
      },
    ],
  },
];

const initialTemplate: ApprovalTemplate = {
  id: "TMPL-1",
  name: "Standard Supplier & Evaluation Approval Template",
  description:
    "Mandatory multi-department verification workflow for Supplier Registration, Ratings, and Supplier Evaluation.",
  isActive: true,
  authorizedSections: ["Supplier Registration", "Ratings", "Supplier Evaluation"],
  stageIds: ["STAGE-1", "STAGE-2", "STAGE-3"],
};

function buildScorecardEntries(
  selections: Array<{
    mainId: string;
    mainCode: string;
    mainName: string;
    criteriaType: CriteriaType;
    subId: string;
    subCode: string;
    subIndication: string;
    criteriaValue: string;
    condition: string;
    marks: number;
  }>,
): EvaluationSubCriteriaEntry[] {
  return selections.map((s) => ({
    ...s,
    score: 10,
  }));
}

const initialEvaluations: SupplierEvaluationRecord[] = [
  {
    id: "EVAL-001",
    supplierName: "LEABON",
    ratingId: "RAT-1",
    ratingCode: "RAT-001",
    ratingName: "Performance Scorecard",
    fromDate: "2023-01-01",
    toDate: "2023-04-30",
    totalScore: 100,
    totalMarks: 74,
    percentage: 74,
    feasibilityScore: 68,
    desirabilityScore: 80,
    remark: "Performance Scorecard (Date Modified: 30-Apr-2023) — Total Performance Score: 74%.",
    submittedDate: "30 Apr 2023",
    approvalStatus: "Approved",
    subCriteriaEntries: buildScorecardEntries([
      {
        mainId: "CRI-1",
        mainCode: "MCR-001",
        mainName: "Cost",
        criteriaType: "Performance",
        subId: "SUB-1",
        subCode: "SUB-001",
        subIndication: "Competitive Price",
        criteriaValue: "Percentage",
        condition: "≤10%",
        marks: 6,
      },
      {
        mainId: "CRI-1",
        mainCode: "MCR-001",
        mainName: "Cost",
        criteriaType: "Performance",
        subId: "SUB-2",
        subCode: "SUB-002",
        subIndication: "Credit Period",
        criteriaValue: "Range",
        condition: "120 days",
        marks: 10,
      },
      {
        mainId: "CRI-2",
        mainCode: "MCR-002",
        mainName: "Quality",
        criteriaType: "Performance",
        subId: "SUB-3",
        subCode: "SUB-003",
        subIndication: "Damage %- Incoming Inspection",
        criteriaValue: "Percentage",
        condition: "≤1.5%",
        marks: 6,
      },
      {
        mainId: "CRI-2",
        mainCode: "MCR-002",
        mainName: "Quality",
        criteriaType: "Performance",
        subId: "SUB-4",
        subCode: "SUB-004",
        subIndication: "RM Stores Return Rate %- During the Process",
        criteriaValue: "Percentage",
        condition: "≤0.5%",
        marks: 10,
      },
      {
        mainId: "CRI-2",
        mainCode: "MCR-002",
        mainName: "Quality",
        criteriaType: "Performance",
        subId: "SUB-5",
        subCode: "SUB-005",
        subIndication: "Corrective Actions",
        criteriaValue: "Quantity",
        condition: "1",
        marks: 8,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-6",
        subCode: "SUB-006",
        subIndication: "Supply on time (ETD Delay)",
        criteriaValue: "Range",
        condition: "3-4 days",
        marks: 6,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-7",
        subCode: "SUB-007",
        subIndication: "Ontime quantity (PO vs Delivery)",
        criteriaValue: "Percentage",
        condition: "≤2%",
        marks: 10,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-8",
        subCode: "SUB-008",
        subIndication: "Ordering to delivery lead time",
        criteriaValue: "Text",
        condition: "L+5",
        marks: 8,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-9",
        subCode: "SUB-009",
        subIndication: "Flexiblity to availability",
        criteriaValue: "Percentage",
        condition: "<60%",
        marks: 0,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-10",
        subCode: "SUB-010",
        subIndication: "MOQ",
        criteriaValue: "Text",
        condition: "M",
        marks: 10,
      },
    ]),
  },
  {
    id: "EVAL-002",
    supplierName: "ISO",
    ratingId: "RAT-1",
    ratingCode: "RAT-001",
    ratingName: "Performance Scorecard",
    fromDate: "2023-01-01",
    toDate: "2023-04-30",
    totalScore: 100,
    totalMarks: 62,
    percentage: 62,
    feasibilityScore: 56,
    desirabilityScore: 68,
    remark: "Performance Scorecard (Date Modified: 30-Apr-2023) — Total Performance Score: 62%.",
    submittedDate: "30 Apr 2023",
    approvalStatus: "Approved",
    subCriteriaEntries: buildScorecardEntries([
      {
        mainId: "CRI-1",
        mainCode: "MCR-001",
        mainName: "Cost",
        criteriaType: "Performance",
        subId: "SUB-1",
        subCode: "SUB-001",
        subIndication: "Competitive Price",
        criteriaValue: "Percentage",
        condition: "≤10%",
        marks: 6,
      },
      {
        mainId: "CRI-1",
        mainCode: "MCR-001",
        mainName: "Cost",
        criteriaType: "Performance",
        subId: "SUB-2",
        subCode: "SUB-002",
        subIndication: "Credit Period",
        criteriaValue: "Range",
        condition: "120 days",
        marks: 10,
      },
      {
        mainId: "CRI-2",
        mainCode: "MCR-002",
        mainName: "Quality",
        criteriaType: "Performance",
        subId: "SUB-3",
        subCode: "SUB-003",
        subIndication: "Damage %- Incoming Inspection",
        criteriaValue: "Percentage",
        condition: "≤3%",
        marks: 2,
      },
      {
        mainId: "CRI-2",
        mainCode: "MCR-002",
        mainName: "Quality",
        criteriaType: "Performance",
        subId: "SUB-4",
        subCode: "SUB-004",
        subIndication: "RM Stores Return Rate %- During the Process",
        criteriaValue: "Percentage",
        condition: "≤1%",
        marks: 8,
      },
      {
        mainId: "CRI-2",
        mainCode: "MCR-002",
        mainName: "Quality",
        criteriaType: "Performance",
        subId: "SUB-5",
        subCode: "SUB-005",
        subIndication: "Corrective Actions",
        criteriaValue: "Quantity",
        condition: "1",
        marks: 8,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-6",
        subCode: "SUB-006",
        subIndication: "Supply on time (ETD Delay)",
        criteriaValue: "Range",
        condition: "6 days",
        marks: 2,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-7",
        subCode: "SUB-007",
        subIndication: "Ontime quantity (PO vs Delivery)",
        criteriaValue: "Percentage",
        condition: "≤2%",
        marks: 10,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-8",
        subCode: "SUB-008",
        subIndication: "Ordering to delivery lead time",
        criteriaValue: "Text",
        condition: "L+15",
        marks: 4,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-9",
        subCode: "SUB-009",
        subIndication: "Flexiblity to availability",
        criteriaValue: "Percentage",
        condition: "≥60%",
        marks: 2,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-10",
        subCode: "SUB-010",
        subIndication: "MOQ",
        criteriaValue: "Text",
        condition: "M",
        marks: 10,
      },
    ]),
  },
  {
    id: "EVAL-003",
    supplierName: "SUZHOU Q",
    ratingId: "RAT-1",
    ratingCode: "RAT-001",
    ratingName: "Performance Scorecard",
    fromDate: "2023-01-01",
    toDate: "2023-04-30",
    totalScore: 100,
    totalMarks: 80,
    percentage: 80,
    feasibilityScore: 76,
    desirabilityScore: 84,
    remark: "Performance Scorecard (Date Modified: 30-Apr-2023) — Total Performance Score: 80%.",
    submittedDate: "30 Apr 2023",
    approvalStatus: "Approved",
    subCriteriaEntries: buildScorecardEntries([
      {
        mainId: "CRI-1",
        mainCode: "MCR-001",
        mainName: "Cost",
        criteriaType: "Performance",
        subId: "SUB-1",
        subCode: "SUB-001",
        subIndication: "Competitive Price",
        criteriaValue: "Percentage",
        condition: "≤5%",
        marks: 8,
      },
      {
        mainId: "CRI-1",
        mainCode: "MCR-001",
        mainName: "Cost",
        criteriaType: "Performance",
        subId: "SUB-2",
        subCode: "SUB-002",
        subIndication: "Credit Period",
        criteriaValue: "Range",
        condition: "120 days",
        marks: 10,
      },
      {
        mainId: "CRI-2",
        mainCode: "MCR-002",
        mainName: "Quality",
        criteriaType: "Performance",
        subId: "SUB-3",
        subCode: "SUB-003",
        subIndication: "Damage %- Incoming Inspection",
        criteriaValue: "Percentage",
        condition: "≤1.5%",
        marks: 6,
      },
      {
        mainId: "CRI-2",
        mainCode: "MCR-002",
        mainName: "Quality",
        criteriaType: "Performance",
        subId: "SUB-4",
        subCode: "SUB-004",
        subIndication: "RM Stores Return Rate %- During the Process",
        criteriaValue: "Percentage",
        condition: "≤0.5%",
        marks: 10,
      },
      {
        mainId: "CRI-2",
        mainCode: "MCR-002",
        mainName: "Quality",
        criteriaType: "Performance",
        subId: "SUB-5",
        subCode: "SUB-005",
        subIndication: "Corrective Actions",
        criteriaValue: "Quantity",
        condition: "1",
        marks: 8,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-6",
        subCode: "SUB-006",
        subIndication: "Supply on time (ETD Delay)",
        criteriaValue: "Range",
        condition: "1-2 days",
        marks: 8,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-7",
        subCode: "SUB-007",
        subIndication: "Ontime quantity (PO vs Delivery)",
        criteriaValue: "Percentage",
        condition: "≤2%",
        marks: 10,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-8",
        subCode: "SUB-008",
        subIndication: "Ordering to delivery lead time",
        criteriaValue: "Text",
        condition: "L",
        marks: 10,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-9",
        subCode: "SUB-009",
        subIndication: "Flexiblity to availability",
        criteriaValue: "Percentage",
        condition: "<60%",
        marks: 0,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-10",
        subCode: "SUB-010",
        subIndication: "MOQ",
        criteriaValue: "Text",
        condition: "M",
        marks: 10,
      },
    ]),
  },
  {
    id: "EVAL-004",
    supplierName: "HENGSHI",
    ratingId: "RAT-1",
    ratingCode: "RAT-001",
    ratingName: "Performance Scorecard",
    fromDate: "2023-01-01",
    toDate: "2023-04-30",
    totalScore: 100,
    totalMarks: 88,
    percentage: 88,
    feasibilityScore: 88,
    desirabilityScore: 88,
    remark: "Performance Scorecard (Date Modified: 30-Apr-2023) — Total Performance Score: 88%.",
    submittedDate: "30 Apr 2023",
    approvalStatus: "Approved",
    subCriteriaEntries: buildScorecardEntries([
      {
        mainId: "CRI-1",
        mainCode: "MCR-001",
        mainName: "Cost",
        criteriaType: "Performance",
        subId: "SUB-1",
        subCode: "SUB-001",
        subIndication: "Competitive Price",
        criteriaValue: "Percentage",
        condition: "≤5%",
        marks: 8,
      },
      {
        mainId: "CRI-1",
        mainCode: "MCR-001",
        mainName: "Cost",
        criteriaType: "Performance",
        subId: "SUB-2",
        subCode: "SUB-002",
        subIndication: "Credit Period",
        criteriaValue: "Range",
        condition: "120 days",
        marks: 10,
      },
      {
        mainId: "CRI-2",
        mainCode: "MCR-002",
        mainName: "Quality",
        criteriaType: "Performance",
        subId: "SUB-3",
        subCode: "SUB-003",
        subIndication: "Damage %- Incoming Inspection",
        criteriaValue: "Percentage",
        condition: "≤1%",
        marks: 8,
      },
      {
        mainId: "CRI-2",
        mainCode: "MCR-002",
        mainName: "Quality",
        criteriaType: "Performance",
        subId: "SUB-4",
        subCode: "SUB-004",
        subIndication: "RM Stores Return Rate %- During the Process",
        criteriaValue: "Percentage",
        condition: "≤0.5%",
        marks: 10,
      },
      {
        mainId: "CRI-2",
        mainCode: "MCR-002",
        mainName: "Quality",
        criteriaType: "Performance",
        subId: "SUB-5",
        subCode: "SUB-005",
        subIndication: "Corrective Actions",
        criteriaValue: "Quantity",
        condition: "1",
        marks: 8,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-6",
        subCode: "SUB-006",
        subIndication: "Supply on time (ETD Delay)",
        criteriaValue: "Range",
        condition: "1-2 days",
        marks: 8,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-7",
        subCode: "SUB-007",
        subIndication: "Ontime quantity (PO vs Delivery)",
        criteriaValue: "Percentage",
        condition: "≤2%",
        marks: 10,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-8",
        subCode: "SUB-008",
        subIndication: "Ordering to delivery lead time",
        criteriaValue: "Text",
        condition: "L",
        marks: 10,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-9",
        subCode: "SUB-009",
        subIndication: "Flexiblity to availability",
        criteriaValue: "Percentage",
        condition: "≥80%",
        marks: 6,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-10",
        subCode: "SUB-010",
        subIndication: "MOQ",
        criteriaValue: "Text",
        condition: "M",
        marks: 10,
      },
    ]),
  },
  {
    id: "EVAL-005",
    supplierName: "PVC",
    ratingId: "RAT-1",
    ratingCode: "RAT-001",
    ratingName: "Performance Scorecard",
    fromDate: "2023-01-01",
    toDate: "2023-04-30",
    totalScore: 100,
    totalMarks: 70,
    percentage: 70,
    feasibilityScore: 64,
    desirabilityScore: 76,
    remark: "Performance Scorecard (Date Modified: 30-Apr-2023) — Total Performance Score: 70%.",
    submittedDate: "30 Apr 2023",
    approvalStatus: "Approved",
    subCriteriaEntries: buildScorecardEntries([
      {
        mainId: "CRI-1",
        mainCode: "MCR-001",
        mainName: "Cost",
        criteriaType: "Performance",
        subId: "SUB-1",
        subCode: "SUB-001",
        subIndication: "Competitive Price",
        criteriaValue: "Percentage",
        condition: "≤15%",
        marks: 4,
      },
      {
        mainId: "CRI-1",
        mainCode: "MCR-001",
        mainName: "Cost",
        criteriaType: "Performance",
        subId: "SUB-2",
        subCode: "SUB-002",
        subIndication: "Credit Period",
        criteriaValue: "Range",
        condition: "90 days",
        marks: 8,
      },
      {
        mainId: "CRI-2",
        mainCode: "MCR-002",
        mainName: "Quality",
        criteriaType: "Performance",
        subId: "SUB-3",
        subCode: "SUB-003",
        subIndication: "Damage %- Incoming Inspection",
        criteriaValue: "Percentage",
        condition: "≤1%",
        marks: 8,
      },
      {
        mainId: "CRI-2",
        mainCode: "MCR-002",
        mainName: "Quality",
        criteriaType: "Performance",
        subId: "SUB-4",
        subCode: "SUB-004",
        subIndication: "RM Stores Return Rate %- During the Process",
        criteriaValue: "Percentage",
        condition: "≤0.5%",
        marks: 10,
      },
      {
        mainId: "CRI-2",
        mainCode: "MCR-002",
        mainName: "Quality",
        criteriaType: "Performance",
        subId: "SUB-5",
        subCode: "SUB-005",
        subIndication: "Corrective Actions",
        criteriaValue: "Quantity",
        condition: "1",
        marks: 8,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-6",
        subCode: "SUB-006",
        subIndication: "Supply on time (ETD Delay)",
        criteriaValue: "Range",
        condition: "3-4 days",
        marks: 6,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-7",
        subCode: "SUB-007",
        subIndication: "Ontime quantity (PO vs Delivery)",
        criteriaValue: "Percentage",
        condition: "≤5%",
        marks: 8,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-8",
        subCode: "SUB-008",
        subIndication: "Ordering to delivery lead time",
        criteriaValue: "Text",
        condition: "L+5",
        marks: 8,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-9",
        subCode: "SUB-009",
        subIndication: "Flexiblity to availability",
        criteriaValue: "Percentage",
        condition: "<60%",
        marks: 0,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-10",
        subCode: "SUB-010",
        subIndication: "MOQ",
        criteriaValue: "Text",
        condition: "M",
        marks: 10,
      },
    ]),
  },
  {
    id: "EVAL-006",
    supplierName: "ZHOUFENG",
    ratingId: "RAT-1",
    ratingCode: "RAT-001",
    ratingName: "Performance Scorecard",
    fromDate: "2023-01-01",
    toDate: "2023-04-30",
    totalScore: 100,
    totalMarks: 70,
    percentage: 70,
    feasibilityScore: 56,
    desirabilityScore: 84,
    remark: "Performance Scorecard (Date Modified: 30-Apr-2023) — Total Performance Score: 70%.",
    submittedDate: "30 Apr 2023",
    approvalStatus: "Approved",
    subCriteriaEntries: buildScorecardEntries([
      {
        mainId: "CRI-1",
        mainCode: "MCR-001",
        mainName: "Cost",
        criteriaType: "Performance",
        subId: "SUB-1",
        subCode: "SUB-001",
        subIndication: "Competitive Price",
        criteriaValue: "Percentage",
        condition: "≤5%",
        marks: 8,
      },
      {
        mainId: "CRI-1",
        mainCode: "MCR-001",
        mainName: "Cost",
        criteriaType: "Performance",
        subId: "SUB-2",
        subCode: "SUB-002",
        subIndication: "Credit Period",
        criteriaValue: "Range",
        condition: "90 days",
        marks: 8,
      },
      {
        mainId: "CRI-2",
        mainCode: "MCR-002",
        mainName: "Quality",
        criteriaType: "Performance",
        subId: "SUB-3",
        subCode: "SUB-003",
        subIndication: "Damage %- Incoming Inspection",
        criteriaValue: "Percentage",
        condition: "≤1%",
        marks: 8,
      },
      {
        mainId: "CRI-2",
        mainCode: "MCR-002",
        mainName: "Quality",
        criteriaType: "Performance",
        subId: "SUB-4",
        subCode: "SUB-004",
        subIndication: "RM Stores Return Rate %- During the Process",
        criteriaValue: "Percentage",
        condition: "≤0.5%",
        marks: 10,
      },
      {
        mainId: "CRI-2",
        mainCode: "MCR-002",
        mainName: "Quality",
        criteriaType: "Performance",
        subId: "SUB-5",
        subCode: "SUB-005",
        subIndication: "Corrective Actions",
        criteriaValue: "Quantity",
        condition: "1",
        marks: 8,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-6",
        subCode: "SUB-006",
        subIndication: "Supply on time (ETD Delay)",
        criteriaValue: "Range",
        condition: "5 days",
        marks: 4,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-7",
        subCode: "SUB-007",
        subIndication: "Ontime quantity (PO vs Delivery)",
        criteriaValue: "Percentage",
        condition: "≤5%",
        marks: 8,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-8",
        subCode: "SUB-008",
        subIndication: "Ordering to delivery lead time",
        criteriaValue: "Text",
        condition: "L+10",
        marks: 6,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-9",
        subCode: "SUB-009",
        subIndication: "Flexiblity to availability",
        criteriaValue: "Percentage",
        condition: "<60%",
        marks: 0,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-10",
        subCode: "SUB-010",
        subIndication: "MOQ",
        criteriaValue: "Text",
        condition: "M",
        marks: 10,
      },
    ]),
  },
  {
    id: "EVAL-007",
    supplierName: "FUJIAN CHANGLE",
    ratingId: "RAT-1",
    ratingCode: "RAT-001",
    ratingName: "Performance Scorecard",
    fromDate: "2023-01-01",
    toDate: "2023-04-30",
    totalScore: 100,
    totalMarks: 80,
    percentage: 80,
    feasibilityScore: 72,
    desirabilityScore: 88,
    remark: "Performance Scorecard (Date Modified: 30-Apr-2023) — Total Performance Score: 80%.",
    submittedDate: "30 Apr 2023",
    approvalStatus: "Approved",
    subCriteriaEntries: buildScorecardEntries([
      {
        mainId: "CRI-1",
        mainCode: "MCR-001",
        mainName: "Cost",
        criteriaType: "Performance",
        subId: "SUB-1",
        subCode: "SUB-001",
        subIndication: "Competitive Price",
        criteriaValue: "Percentage",
        condition: "≤2%",
        marks: 10,
      },
      {
        mainId: "CRI-1",
        mainCode: "MCR-001",
        mainName: "Cost",
        criteriaType: "Performance",
        subId: "SUB-2",
        subCode: "SUB-002",
        subIndication: "Credit Period",
        criteriaValue: "Range",
        condition: "90 days",
        marks: 8,
      },
      {
        mainId: "CRI-2",
        mainCode: "MCR-002",
        mainName: "Quality",
        criteriaType: "Performance",
        subId: "SUB-3",
        subCode: "SUB-003",
        subIndication: "Damage %- Incoming Inspection",
        criteriaValue: "Percentage",
        condition: "≤0.5%",
        marks: 10,
      },
      {
        mainId: "CRI-2",
        mainCode: "MCR-002",
        mainName: "Quality",
        criteriaType: "Performance",
        subId: "SUB-4",
        subCode: "SUB-004",
        subIndication: "RM Stores Return Rate %- During the Process",
        criteriaValue: "Percentage",
        condition: "≤1%",
        marks: 8,
      },
      {
        mainId: "CRI-2",
        mainCode: "MCR-002",
        mainName: "Quality",
        criteriaType: "Performance",
        subId: "SUB-5",
        subCode: "SUB-005",
        subIndication: "Corrective Actions",
        criteriaValue: "Quantity",
        condition: "1",
        marks: 8,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-6",
        subCode: "SUB-006",
        subIndication: "Supply on time (ETD Delay)",
        criteriaValue: "Range",
        condition: "1-2 days",
        marks: 8,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-7",
        subCode: "SUB-007",
        subIndication: "Ontime quantity (PO vs Delivery)",
        criteriaValue: "Percentage",
        condition: "≤5%",
        marks: 8,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-8",
        subCode: "SUB-008",
        subIndication: "Ordering to delivery lead time",
        criteriaValue: "Text",
        condition: "L",
        marks: 10,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-9",
        subCode: "SUB-009",
        subIndication: "Flexiblity to availability",
        criteriaValue: "Percentage",
        condition: "<60%",
        marks: 0,
      },
      {
        mainId: "CRI-3",
        mainCode: "MCR-003",
        mainName: "Supply",
        criteriaType: "Category",
        subId: "SUB-10",
        subCode: "SUB-010",
        subIndication: "MOQ",
        criteriaValue: "Text",
        condition: "M",
        marks: 10,
      },
    ]),
  },
];

const initialProcesses: SupplierApprovalProcess[] = [
  {
    id: "PROC-001",
    processType: "Supplier Registration",
    targetId: "CN-33010041",
    supplierName: "LEABON",
    supplierEmail: "export@leabon.example",
    registrationDate: "30 Apr 2023",
    templateId: "TMPL-1",
    templateName: "Standard Supplier & Evaluation Approval Template",
    currentStageIndex: 1,
    overallStatus: "Pending Approval",
    stages: [
      {
        stageId: "STAGE-1",
        stageName: "Procurement Desk Review",
        description:
          "Verify company registration, authorized contact identity, and business category eligibility.",
        approvalsRequired: 1,
        rejectionsRequired: 1,
        status: "Approved",
        approvedBy: ["Sunil Jayawardena"],
        rejectedBy: [],
        remarks: ["Business partner verified against registered enterprise criteria."],
        updatedAt: "30 Apr 2023, 09:30 AM",
      },
      {
        stageId: "STAGE-2",
        stageName: "Finance & Tax Verification",
        description:
          "Audit VAT registration certificates, banking confirmation letters, and fiscal compliance.",
        approvalsRequired: 1,
        rejectionsRequired: 1,
        status: "Pending",
        approvedBy: [],
        rejectedBy: [],
        remarks: [],
      },
      {
        stageId: "STAGE-3",
        stageName: "Commercial & Compliance Sign-off",
        description:
          "Final executive approval for onboarding and SAP Business One vendor master activation.",
        approvalsRequired: 1,
        rejectionsRequired: 1,
        status: "Pending",
        approvedBy: [],
        rejectedBy: [],
        remarks: [],
      },
    ],
  },
  {
    id: "PROC-002",
    processType: "Ratings",
    targetId: "RAT-1",
    supplierName: "RAT-001 · Performance Scorecard",
    supplierEmail: "Foreign Supplier Rating · Weightage: 100%",
    registrationDate: "30 Apr 2023",
    templateId: "TMPL-1",
    templateName: "Standard Supplier & Evaluation Approval Template",
    currentStageIndex: 2,
    overallStatus: "Approved",
    stages: [
      {
        stageId: "STAGE-1",
        stageName: "Procurement Desk Review",
        description:
          "Verify rating criteria selection, sub-criteria weightages, and condition mark thresholds.",
        approvalsRequired: 1,
        rejectionsRequired: 1,
        status: "Approved",
        approvedBy: ["Sunil Jayawardena"],
        rejectedBy: [],
        remarks: ["Performance Scorecard criteria and condition thresholds verified."],
        updatedAt: "30 Apr 2023, 10:00 AM",
      },
      {
        stageId: "STAGE-2",
        stageName: "Finance & Tax Verification",
        description: "Verify pricing and commercial benchmark condition marks.",
        approvalsRequired: 1,
        rejectionsRequired: 1,
        status: "Approved",
        approvedBy: ["Nadeeka Perera"],
        rejectedBy: [],
        remarks: ["Cost criteria and credit period points verified."],
        updatedAt: "30 Apr 2023, 11:15 AM",
      },
      {
        stageId: "STAGE-3",
        stageName: "Commercial & Compliance Sign-off",
        description: "Final executive approval to activate the rating master for evaluations.",
        approvalsRequired: 1,
        rejectionsRequired: 1,
        status: "Approved",
        approvedBy: ["Anura Dissanayake"],
        rejectedBy: [],
        remarks: ["Approved for supplier performance scorecard evaluation."],
        updatedAt: "30 Apr 2023, 02:00 PM",
      },
    ],
  },
  {
    id: "PROC-003",
    processType: "Supplier Evaluation",
    targetId: "EVAL-001",
    supplierName: "LEABON · RAT-001",
    supplierEmail: "Period: 2023-01-01 to 2023-04-30 · Marks: 74 / 100 (74%)",
    registrationDate: "30 Apr 2023",
    templateId: "TMPL-1",
    templateName: "Standard Supplier & Evaluation Approval Template",
    currentStageIndex: 0,
    overallStatus: "Pending Approval",
    stages: [
      {
        stageId: "STAGE-1",
        stageName: "Procurement Desk Review",
        description: "Review supplier evaluation scores, condition selections, and remarks.",
        approvalsRequired: 1,
        rejectionsRequired: 1,
        status: "Pending",
        approvedBy: [],
        rejectedBy: [],
        remarks: [],
      },
      {
        stageId: "STAGE-2",
        stageName: "Finance & Tax Verification",
        description: "Verify commercial and pricing performance evaluation marks.",
        approvalsRequired: 1,
        rejectionsRequired: 1,
        status: "Pending",
        approvedBy: [],
        rejectedBy: [],
        remarks: [],
      },
      {
        stageId: "STAGE-3",
        stageName: "Commercial & Compliance Sign-off",
        description: "Final sign-off to publish the supplier evaluation sheet.",
        approvalsRequired: 1,
        rejectionsRequired: 1,
        status: "Pending",
        approvedBy: [],
        rejectedBy: [],
        remarks: [],
      },
    ],
  },
];

type WorkspaceContextValue = {
  role: "supplier" | "rainco";
  setRole: (role: "supplier" | "rainco") => void;
  documents: Record<BusinessType, DocumentRow[]>;
  setDocuments: (documents: Record<BusinessType, DocumentRow[]>) => void;
  supplierTypes: SupplierTypeRow[];
  saveSupplierType: (supplierType: SupplierTypeRow) => void;
  deleteSupplierType: (id: string) => void;
  departments: DepartmentRow[];
  saveDepartment: (department: DepartmentRow) => void;
  deleteDepartment: (id: string) => void;
  criterias: CriteriaMasterRow[];
  saveCriteria: (criteria: CriteriaMasterRow) => void;
  deleteCriteria: (id: string) => void;
  ratingMasters: RatingMasterRow[];
  saveRatingMaster: (rating: RatingMasterRow) => void;
  deleteRatingMaster: (id: string) => void;
  systemUsers: SystemUserRow[];
  saveSystemUser: (user: SystemUserRow) => void;
  deleteSystemUser: (id: string) => void;
  userPermissions: Record<string, string[]>;
  updateUserPermissions: (userId: string, allowedTabs: string[]) => void;
  suppliersList: RegisteredSupplier[];
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  supplier: RegisteredSupplier;
  setSupplier: (s: RegisteredSupplier) => void;
  lastRegistrationNotice: string | null;
  setLastRegistrationNotice: (notice: string | null) => void;
  login: (username: string, password?: string) => boolean;
  logout: () => void;
  registerSupplier: (data: Partial<RegisteredSupplier>) => void;
  // Approval Management
  stages: ApprovalStage[];
  saveStage: (stage: ApprovalStage) => void;
  deleteStage: (stageId: string) => void;
  templates: ApprovalTemplate[];
  saveTemplate: (template: ApprovalTemplate) => void;
  approvalProcesses: SupplierApprovalProcess[];
  activeSupplierApprovalProcess: SupplierApprovalProcess | undefined;
  approveStage: (processId: string, stageId: string, authorizer: string, remark?: string) => void;
  rejectStage: (processId: string, stageId: string, authorizer: string, remark?: string) => void;
  evaluations: SupplierEvaluationRecord[];
  submitEvaluationForApproval: (
    evalData: Omit<SupplierEvaluationRecord, "id" | "submittedDate" | "approvalStatus">,
  ) => SupplierEvaluationRecord;
  updateSupplierMasterStatus: (
    supplierNameOrId: string,
    newStatus: SupplierMasterStatus,
    authorizedBy?: string,
  ) => void;
};

const globalForWorkspace = globalThis as unknown as {
  __RAINCO_WORKSPACE_CONTEXT__?: ReturnType<typeof createContext<WorkspaceContextValue | null>>;
};

const WorkspaceContext =
  globalForWorkspace.__RAINCO_WORKSPACE_CONTEXT__ ??
  (globalForWorkspace.__RAINCO_WORKSPACE_CONTEXT__ = createContext<WorkspaceContextValue | null>(
    null,
  ));

const fallbackWorkspaceContext: WorkspaceContextValue = {
  role: "rainco",
  setRole: () => {},
  documents: initialDocuments,
  setDocuments: () => {},
  supplierTypes: initialSupplierTypes,
  saveSupplierType: () => {},
  deleteSupplierType: () => {},
  departments: initialDepartments,
  saveDepartment: () => {},
  deleteDepartment: () => {},
  criterias: initialCriterias,
  saveCriteria: () => {},
  deleteCriteria: () => {},
  ratingMasters: initialRatingMasters,
  saveRatingMaster: () => {},
  deleteRatingMaster: () => {},
  systemUsers: initialSystemUsers,
  saveSystemUser: () => {},
  deleteSystemUser: () => {},
  userPermissions: initialUserPermissions,
  updateUserPermissions: () => {},
  suppliersList: initialSuppliersList,
  isLoggedIn: true,
  setIsLoggedIn: () => {},
  supplier: initialSupplier,
  setSupplier: () => {},
  lastRegistrationNotice: null,
  setLastRegistrationNotice: () => {},
  login: () => true,
  logout: () => {},
  registerSupplier: () => {},
  stages: initialStages,
  saveStage: () => {},
  deleteStage: () => {},
  templates: [initialTemplate],
  saveTemplate: () => {},
  approvalProcesses: initialProcesses,
  activeSupplierApprovalProcess: initialProcesses[0],
  approveStage: () => {},
  rejectStage: () => {},
  evaluations: initialEvaluations,
  submitEvaluationForApproval: (evalData) => ({
    ...evalData,
    id: "EVAL-001",
    submittedDate: "Today",
    approvalStatus: "Pending Approval",
  }),
  updateSupplierMasterStatus: () => {},
};

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  return context ?? fallbackWorkspaceContext;
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<"supplier" | "rainco">("supplier");
  const [documents, setDocuments] = useState(initialDocuments);
  const [supplierTypes, setSupplierTypes] = useState<SupplierTypeRow[]>(initialSupplierTypes);
  const [departments, setDepartments] = useState<DepartmentRow[]>(initialDepartments);
  const [criterias, setCriterias] = useState<CriteriaMasterRow[]>(initialCriterias);
  const [ratingMasters, setRatingMasters] = useState<RatingMasterRow[]>(initialRatingMasters);
  const [systemUsers, setSystemUsers] = useState<SystemUserRow[]>(initialSystemUsers);
  const [userPermissions, setUserPermissions] =
    useState<Record<string, string[]>>(initialUserPermissions);
  const [suppliersList, setSuppliersList] = useState<RegisteredSupplier[]>(initialSuppliersList);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [supplier, setSupplier] = useState<RegisteredSupplier>(initialSupplier);
  const [lastRegistrationNotice, setLastRegistrationNotice] = useState<string | null>(null);

  const [stages, setStages] = useState<ApprovalStage[]>(initialStages);
  const [templates, setTemplates] = useState<ApprovalTemplate[]>([initialTemplate]);
  const [approvalProcesses, setApprovalProcesses] =
    useState<SupplierApprovalProcess[]>(initialProcesses);
  const [evaluations, setEvaluations] = useState<SupplierEvaluationRecord[]>(initialEvaluations);

  const createApprovalProcessForSection = (
    processType: ApprovalProcessType,
    targetId: string,
    title: string,
    subtitle: string,
  ) => {
    const matchingTemplate =
      templates.find((t) => t.isActive && (t.authorizedSections ?? []).includes(processType)) ||
      templates.find((t) => (t.authorizedSections ?? []).includes(processType)) ||
      templates.find((t) => t.isActive) ||
      templates[0] ||
      initialTemplate;

    const templateStages = matchingTemplate.stageIds
      .map((sid) => stages.find((s) => s.id === sid))
      .filter((s): s is ApprovalStage => Boolean(s));

    const newProcess: SupplierApprovalProcess = {
      id: `PROC-${Date.now().toString().slice(-4)}`,
      processType,
      targetId,
      supplierName: title,
      supplierEmail: subtitle,
      registrationDate: "Today",
      templateId: matchingTemplate.id,
      templateName: matchingTemplate.name,
      currentStageIndex: 0,
      overallStatus: "Pending Approval",
      stages: templateStages.map((stg) => ({
        stageId: stg.id,
        stageName: stg.name,
        description: stg.description,
        approvalsRequired: stg.approvalsRequired,
        rejectionsRequired: stg.rejectionsRequired,
        status: "Pending",
        approvedBy: [],
        rejectedBy: [],
        remarks: [],
      })),
    };

    setApprovalProcesses((prev) => {
      const filtered = prev.filter(
        (p) =>
          !(
            p.processType === processType &&
            p.targetId === targetId &&
            p.overallStatus === "Pending Approval"
          ),
      );
      return [newProcess, ...filtered];
    });
  };

  const saveStage = (stageToSave: ApprovalStage) => {
    setStages((prev) => {
      const exists = prev.some((s) => s.id === stageToSave.id);
      if (exists) {
        return prev.map((s) => (s.id === stageToSave.id ? stageToSave : s));
      }
      return [...prev, stageToSave];
    });
  };

  const deleteStage = (stageId: string) => {
    setStages((prev) => prev.filter((s) => s.id !== stageId));
  };

  const saveSupplierType = (typeToSave: SupplierTypeRow) => {
    setSupplierTypes((prev) => {
      const exists = prev.some((t) => t.id === typeToSave.id);
      if (exists) {
        return prev.map((t) => (t.id === typeToSave.id ? typeToSave : t));
      }
      return [...prev, typeToSave];
    });
  };

  const deleteSupplierType = (id: string) => {
    setSupplierTypes((prev) => prev.filter((t) => t.id !== id));
  };

  const saveDepartment = (deptToSave: DepartmentRow) => {
    setDepartments((prev) => {
      const exists = prev.some((d) => d.id === deptToSave.id);
      if (exists) {
        return prev.map((d) => (d.id === deptToSave.id ? deptToSave : d));
      }
      return [...prev, deptToSave];
    });
  };

  const deleteDepartment = (id: string) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  };

  const saveCriteria = (criteriaToSave: CriteriaMasterRow) => {
    setCriterias((prev) => {
      const exists = prev.some((c) => c.id === criteriaToSave.id);
      if (exists) {
        return prev.map((c) => (c.id === criteriaToSave.id ? criteriaToSave : c));
      }
      return [...prev, criteriaToSave];
    });
  };

  const deleteCriteria = (id: string) => {
    setCriterias((prev) => prev.filter((c) => c.id !== id));
  };

  const saveRatingMaster = (ratingToSave: RatingMasterRow) => {
    const withStatus: RatingMasterRow = {
      ...ratingToSave,
      approvalStatus: "Pending Approval",
    };
    setRatingMasters((prev) => {
      const exists = prev.some((r) => r.id === withStatus.id);
      if (exists) {
        return prev.map((r) => (r.id === withStatus.id ? withStatus : r));
      }
      return [...prev, withStatus];
    });

    const totalWeight = Object.values(withStatus.subCriteriaWeights ?? {}).reduce(
      (sum, w) => sum + (Number(w) || 0),
      0,
    );
    createApprovalProcessForSection(
      "Ratings",
      withStatus.id,
      `${withStatus.code} · ${withStatus.name}`,
      `${withStatus.supplierType} Supplier Rating · Weightage: ${totalWeight}%`,
    );
  };

  const deleteRatingMaster = (id: string) => {
    setRatingMasters((prev) => prev.filter((r) => r.id !== id));
    setApprovalProcesses((prev) =>
      prev.filter((p) => !(p.processType === "Ratings" && p.targetId === id)),
    );
  };

  const submitEvaluationForApproval = (
    evalData: Omit<SupplierEvaluationRecord, "id" | "submittedDate" | "approvalStatus">,
  ): SupplierEvaluationRecord => {
    const newEval: SupplierEvaluationRecord = {
      ...evalData,
      id: `EVAL-${String(evaluations.length + 1).padStart(3, "0")}`,
      submittedDate: "Today",
      approvalStatus: "Pending Approval",
    };
    setEvaluations((prev) => [newEval, ...prev]);

    const periodText = `${newEval.fromDate} to ${newEval.toDate}`;
    setSuppliersList((prev) =>
      prev.map((s) =>
        s.name === newEval.supplierName
          ? {
              ...s,
              assignedRatingCode: newEval.ratingCode,
              assignedRatingName: newEval.ratingName,
              evaluationScore: newEval.totalScore,
              evaluationMarks: newEval.totalMarks,
              evaluationPercentage: newEval.percentage,
              feasibilityScore: newEval.feasibilityScore,
              desirabilityScore: newEval.desirabilityScore,
              evaluationPeriod: periodText,
            }
          : s,
      ),
    );
    setSupplier((prev) =>
      prev.name === newEval.supplierName
        ? {
            ...prev,
            assignedRatingCode: newEval.ratingCode,
            assignedRatingName: newEval.ratingName,
            evaluationScore: newEval.totalScore,
            evaluationMarks: newEval.totalMarks,
            evaluationPercentage: newEval.percentage,
            feasibilityScore: newEval.feasibilityScore,
            desirabilityScore: newEval.desirabilityScore,
            evaluationPeriod: periodText,
          }
        : prev,
    );

    createApprovalProcessForSection(
      "Supplier Evaluation",
      newEval.id,
      `${newEval.supplierName} · ${newEval.ratingCode}`,
      `Period: ${newEval.fromDate} to ${newEval.toDate} · Marks: ${newEval.totalMarks} / ${newEval.totalScore} (${newEval.percentage}%)`,
    );
    return newEval;
  };

  const updateSupplierMasterStatus = (
    supplierNameOrId: string,
    newStatus: SupplierMasterStatus,
    authorizedBy = "Sunil Jayawardena",
  ) => {
    const isDeactivated = newStatus === "Inactive" || newStatus === "Blacklisted";
    const nowStr = new Date().toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    setSuppliersList((prev) =>
      prev.map((s) =>
        s.name === supplierNameOrId || s.sapPartnerId === supplierNameOrId
          ? {
              ...s,
              status: newStatus,
              transactionBlocked: isDeactivated,
              statusUpdatedBy: authorizedBy,
              statusUpdatedAt: nowStr,
            }
          : s,
      ),
    );

    setSupplier((prev) =>
      prev.name === supplierNameOrId || prev.sapPartnerId === supplierNameOrId
        ? {
            ...prev,
            status: newStatus,
            transactionBlocked: isDeactivated,
            statusUpdatedBy: authorizedBy,
            statusUpdatedAt: nowStr,
          }
        : prev,
    );
  };

  const saveSystemUser = (userToSave: SystemUserRow) => {
    setSystemUsers((prev) => {
      const exists = prev.some((u) => u.id === userToSave.id);
      if (exists) {
        return prev.map((u) => (u.id === userToSave.id ? userToSave : u));
      }
      return [...prev, userToSave];
    });
    setUserPermissions((prev) => {
      if (prev[userToSave.id]) return prev;
      return {
        ...prev,
        [userToSave.id]: ["Supplier Checklist", "Approval Queue", "Evaluation Sheet"],
      };
    });
  };

  const deleteSystemUser = (id: string) => {
    setSystemUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const updateUserPermissions = (userId: string, allowedTabs: string[]) => {
    setUserPermissions((prev) => ({
      ...prev,
      [userId]: allowedTabs,
    }));
  };

  const saveTemplate = (templateToSave: ApprovalTemplate) => {
    setTemplates((prev) => {
      let updated = prev;
      if (templateToSave.isActive) {
        // Deactivate others if this is active
        updated = prev.map((t) => (t.id === templateToSave.id ? t : { ...t, isActive: false }));
      }
      const exists = updated.some((t) => t.id === templateToSave.id);
      if (exists) {
        return updated.map((t) => (t.id === templateToSave.id ? templateToSave : t));
      }
      return [...updated, templateToSave];
    });
  };

  const approveStage = (
    processId: string,
    stageId: string,
    authorizer: string,
    remark?: string,
  ) => {
    setApprovalProcesses((prev) =>
      prev.map((proc) => {
        if (proc.id !== processId) return proc;
        const nowStr = new Date().toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        const updatedStages = proc.stages.map((stg) => {
          if (stg.stageId !== stageId) return stg;
          const newApprovedBy = [...stg.approvedBy, authorizer];
          const newRemarks = remark ? [...stg.remarks, remark] : stg.remarks;
          const isComplete = newApprovedBy.length >= stg.approvalsRequired;
          return {
            ...stg,
            approvedBy: newApprovedBy,
            remarks: newRemarks,
            status: isComplete ? ("Approved" as const) : ("Pending" as const),
            updatedAt: nowStr,
          };
        });

        // Determine next stage or if all approved
        const allApproved = updatedStages.every((s) => s.status === "Approved");
        const nextStageIdx = updatedStages.findIndex((s) => s.status === "Pending");

        if (allApproved) {
          if (proc.processType === "Supplier Registration") {
            setSupplier((s) => (s.name === proc.supplierName ? { ...s, status: "Active" } : s));
            setSuppliersList((list) =>
              list.map((s) => (s.name === proc.supplierName ? { ...s, status: "Active" } : s)),
            );
          } else if (proc.processType === "Ratings" && proc.targetId) {
            setRatingMasters((list) =>
              list.map((r) => (r.id === proc.targetId ? { ...r, approvalStatus: "Approved" } : r)),
            );
          } else if (proc.processType === "Supplier Evaluation" && proc.targetId) {
            setEvaluations((list) =>
              list.map((ev) =>
                ev.id === proc.targetId ? { ...ev, approvalStatus: "Approved" } : ev,
              ),
            );
          }
        }

        return {
          ...proc,
          stages: updatedStages,
          currentStageIndex: nextStageIdx === -1 ? updatedStages.length : nextStageIdx,
          overallStatus: allApproved ? ("Approved" as const) : ("Pending Approval" as const),
        };
      }),
    );
  };

  const rejectStage = (processId: string, stageId: string, authorizer: string, remark?: string) => {
    setApprovalProcesses((prev) =>
      prev.map((proc) => {
        if (proc.id !== processId) return proc;
        const nowStr = new Date().toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        const updatedStages = proc.stages.map((stg) => {
          if (stg.stageId !== stageId) return stg;
          return {
            ...stg,
            rejectedBy: [...stg.rejectedBy, authorizer],
            remarks: remark ? [...stg.remarks, remark] : stg.remarks,
            status: "Rejected" as const,
            updatedAt: nowStr,
          };
        });

        if (proc.processType === "Ratings" && proc.targetId) {
          setRatingMasters((list) =>
            list.map((r) => (r.id === proc.targetId ? { ...r, approvalStatus: "Rejected" } : r)),
          );
        } else if (proc.processType === "Supplier Evaluation" && proc.targetId) {
          setEvaluations((list) =>
            list.map((ev) =>
              ev.id === proc.targetId ? { ...ev, approvalStatus: "Rejected" } : ev,
            ),
          );
        }

        return {
          ...proc,
          stages: updatedStages,
          overallStatus: "Rejected" as const,
        };
      }),
    );
  };

  const registerSupplier = (data: Partial<RegisteredSupplier>) => {
    const supplierName = data.name || "New Supplier";
    const supplierEmail = data.email || "supplier@example.com";
    const updatedSupplier: RegisteredSupplier = {
      ...supplier,
      ...data,
      status: "Pending Approval",
      registrationDate: "Today (Just Registered)",
    };
    setSupplier(updatedSupplier);
    setSuppliersList((prev) => {
      const exists = prev.some((s) => s.name === updatedSupplier.name);
      if (exists) {
        return prev.map((s) => (s.name === updatedSupplier.name ? updatedSupplier : s));
      }
      return [updatedSupplier, ...prev];
    });
    setLastRegistrationNotice(
      `Registration submitted for ${supplierName}! Your application has entered the Rainco Approval Process.`,
    );

    createApprovalProcessForSection(
      "Supplier Registration",
      updatedSupplier.registrationNo || supplierName,
      supplierName,
      supplierEmail,
    );
  };

  const activeSupplierApprovalProcess =
    approvalProcesses.find(
      (p) => p.processType === "Supplier Registration" && p.supplierName === supplier.name,
    ) || approvalProcesses[0];

  const login = (username: string, password?: string) => {
    setIsLoggedIn(true);
    setRole("supplier");
    return true;
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <WorkspaceContext.Provider
      value={{
        role,
        setRole,
        documents,
        setDocuments,
        supplierTypes,
        saveSupplierType,
        deleteSupplierType,
        departments,
        saveDepartment,
        deleteDepartment,
        criterias,
        saveCriteria,
        deleteCriteria,
        ratingMasters,
        saveRatingMaster,
        deleteRatingMaster,
        systemUsers,
        saveSystemUser,
        deleteSystemUser,
        userPermissions,
        updateUserPermissions,
        suppliersList,
        isLoggedIn,
        setIsLoggedIn,
        supplier,
        setSupplier,
        lastRegistrationNotice,
        setLastRegistrationNotice,
        login,
        logout,
        registerSupplier,
        stages,
        saveStage,
        deleteStage,
        templates,
        saveTemplate,
        approvalProcesses,
        activeSupplierApprovalProcess,
        approveStage,
        rejectStage,
        evaluations,
        submitEvaluationForApproval,
        updateSupplierMasterStatus,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

const portalNav = [
  { to: "/" as const, label: "Supplier Dashboard", icon: LayoutDashboard },
  { to: "/quotations" as const, label: "Purchase Quotations", icon: FileText },
  { to: "/ratings" as const, label: "My Evaluation", icon: Star },
];

const mastersNav = [
  { to: "/checklist" as const, label: "Supplier Checklist", icon: FileCheck2 },
  { to: "/supplier-types" as const, label: "Supplier Types", icon: Building2 },
  { to: "/departments" as const, label: "Departments", icon: Layers },
  { to: "/criterias" as const, label: "Criterias", icon: ListOrdered },
  { to: "/ratings-master" as const, label: "Ratings", icon: Star },
];

const adminNav = [
  { to: "/users" as const, label: "Users", icon: Users },
  { to: "/user-permissions" as const, label: "User Permissions", icon: ShieldCheck },
  { to: "/suppliers" as const, label: "Suppliers", icon: Building2 },
];

const approvalsNav = [
  { to: "/approval-stages" as const, label: "Approval Stages", icon: Layers },
  { to: "/approval-template" as const, label: "Approval Template", icon: ListOrdered },
  { to: "/approval-queue" as const, label: "Approval Queue", icon: UserCheck },
];

const evaluationNav = [
  { to: "/evaluation" as const, label: "Evaluation Sheet", icon: ClipboardCheck },
  { to: "/evaluation-report" as const, label: "Evaluation Result Report", icon: FileText },
  { to: "/evaluation-chart" as const, label: "Evaluation Chart", icon: Star },
];

export function RaincoLogo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <img
      src="/rainco-logo-trimmed.jpg"
      alt="Rainco"
      className={`${className} object-contain mix-blend-multiply select-none`}
    />
  );
}

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const { role, setRole, isLoggedIn, supplier, logout } = useWorkspace();
  const [mastersOpen, setMastersOpen] = useState(true);
  const [adminOpen, setAdminOpen] = useState(true);
  const [approvalsOpen, setApprovalsOpen] = useState(true);
  const [evaluationOpen, setEvaluationOpen] = useState(true);
  const router = useRouter();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const getBreadcrumbLabel = () => {
    if (pathname === "/") return "Supplier Dashboard";
    if (pathname === "/login") return "Supplier Sign-In";
    if (pathname === "/register") return "Supplier Registration (Email Link)";
    if (pathname === "/approval-stages") return "Approvals / Approval Stages";
    if (pathname === "/approval-template") return "Approvals / Approval Template";
    if (pathname === "/approval-queue") return "Approvals / Approval Queue";
    if (pathname === "/checklist") return "Masters / Supplier Checklist";
    if (pathname === "/supplier-types") return "Masters / Supplier Types";
    if (pathname === "/departments") return "Masters / Departments";
    if (pathname === "/criterias") return "Masters / Criterias";
    if (pathname === "/ratings-master") return "Masters / Ratings";
    if (pathname === "/users") return "Administration / Users";
    if (pathname === "/user-permissions") return "Administration / User Permissions";
    if (pathname === "/suppliers") return "Administration / Suppliers";
    if (pathname === "/evaluation") return "Evaluation / Evaluation Sheet";
    if (pathname === "/evaluation-report") return "Evaluation / Evaluation Result Report";
    if (pathname === "/evaluation-chart") return "Evaluation / Evaluation Chart";
    if (pathname === "/invitations") return "Supplier Invitations";
    const found = [
      ...portalNav,
      ...mastersNav,
      ...adminNav,
      ...approvalsNav,
      ...evaluationNav,
    ].find((item) => item.to === pathname);
    return found?.label ?? "Overview";
  };

  return (
    <div className="workspace">
      <aside className="sidebar">
        <Link to="/" className="brand">
          <div className="flex flex-col">
            <RaincoLogo className="h-9 w-auto" />
            <small className="!mt-1 font-medium tracking-wide uppercase text-[9px]">
              Procurement Suite
            </small>
          </div>
        </Link>
        <div className="sidebar-nav">
          <div className="nav-caption">WORKSPACE</div>
          <Button
            variant="module"
            data-active={role === "supplier"}
            onClick={() => setRole("supplier")}
          >
            <Layers3 />
            Supplier Portal{role === "supplier" && <ChevronDown className="ml-auto" />}
          </Button>
          {role === "supplier" && (
            <div className="subnav">
              {portalNav.map((item) => (
                <Button
                  key={item.to}
                  asChild
                  variant="navigation"
                  data-active={pathname === item.to}
                >
                  <Link to={item.to}>
                    <item.icon />
                    {item.label}
                  </Link>
                </Button>
              ))}
            </div>
          )}
          <Button
            variant="module"
            data-active={role === "rainco"}
            onClick={() => setRole("rainco")}
          >
            <ClipboardCheck />
            Supplier Evaluation{role === "rainco" && <ChevronDown className="ml-auto" />}
          </Button>
          {role === "rainco" && (
            <div className="subnav">
              <Button
                variant="navigation"
                data-active={mastersNav.some((item) => item.to === pathname) && !mastersOpen}
                onClick={() => setMastersOpen((prev) => !prev)}
              >
                <Layers3 />
                Masters
                <ChevronDown
                  className={`ml-auto transition-transform ${mastersOpen ? "" : "-rotate-90"}`}
                />
              </Button>
              {mastersOpen && (
                <div className="pl-3 ml-3 border-l border-border/70 flex flex-col gap-0.5 my-0.5">
                  {mastersNav.map((item) => (
                    <Button
                      key={item.to}
                      asChild
                      variant="navigation"
                      data-active={pathname === item.to}
                    >
                      <Link to={item.to}>
                        <item.icon />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </Button>
                  ))}
                </div>
              )}
              <Button
                variant="navigation"
                data-active={adminNav.some((item) => item.to === pathname) && !adminOpen}
                onClick={() => setAdminOpen((prev) => !prev)}
              >
                <ShieldCheck />
                Administration
                <ChevronDown
                  className={`ml-auto transition-transform ${adminOpen ? "" : "-rotate-90"}`}
                />
              </Button>
              {adminOpen && (
                <div className="pl-3 ml-3 border-l border-border/70 flex flex-col gap-0.5 my-0.5">
                  {adminNav.map((item) => (
                    <Button
                      key={item.to}
                      asChild
                      variant="navigation"
                      data-active={pathname === item.to}
                    >
                      <Link to={item.to}>
                        <item.icon />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </Button>
                  ))}
                </div>
              )}
              <Button
                variant="navigation"
                data-active={approvalsNav.some((item) => item.to === pathname) && !approvalsOpen}
                onClick={() => setApprovalsOpen((prev) => !prev)}
              >
                <UserCheck />
                Approvals
                <ChevronDown
                  className={`ml-auto transition-transform ${approvalsOpen ? "" : "-rotate-90"}`}
                />
              </Button>
              {approvalsOpen && (
                <div className="pl-3 ml-3 border-l border-border/70 flex flex-col gap-0.5 my-0.5">
                  {approvalsNav.map((item) => (
                    <Button
                      key={item.to}
                      asChild
                      variant="navigation"
                      data-active={pathname === item.to}
                    >
                      <Link to={item.to}>
                        <item.icon />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </Button>
                  ))}
                </div>
              )}
              <Button
                variant="navigation"
                data-active={evaluationNav.some((item) => item.to === pathname) && !evaluationOpen}
                onClick={() => setEvaluationOpen((prev) => !prev)}
              >
                <ClipboardCheck />
                Evaluation
                <ChevronDown
                  className={`ml-auto transition-transform ${evaluationOpen ? "" : "-rotate-90"}`}
                />
              </Button>
              {evaluationOpen && (
                <div className="pl-3 ml-3 border-l border-border/70 flex flex-col gap-0.5 my-0.5">
                  {evaluationNav.map((item) => (
                    <Button
                      key={item.to}
                      asChild
                      variant="navigation"
                      data-active={pathname === item.to}
                    >
                      <Link to={item.to}>
                        <item.icon />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="sidebar-bottom">
          <div className="profile">
            <span className="avatar">
              {role === "supplier"
                ? supplier.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "SP"
                : "RC"}
            </span>
            <div className="min-w-0 flex-1">
              <strong className="block truncate">
                {role === "supplier" ? supplier.name : "Rainco Procurement"}
              </strong>
              <small>
                {role === "supplier"
                  ? isLoggedIn
                    ? "Authenticated"
                    : "Logged Out"
                  : "Rainco Admin"}{" "}
                · Preview
              </small>
            </div>
            {role === "supplier" &&
              (isLoggedIn ? (
                <button
                  type="button"
                  title="Sign out to Login screen"
                  onClick={() => {
                    logout();
                    router.navigate({ to: "/login" });
                  }}
                  className="p-1 hover:text-destructive text-muted-foreground transition-colors"
                >
                  <LogOut size={15} />
                </button>
              ) : (
                <Link
                  to="/login"
                  title="Sign in to portal"
                  className="p-1 hover:text-primary text-muted-foreground transition-colors"
                >
                  <LogIn size={15} />
                </Link>
              ))}
            {role === "rainco" && <ShieldCheck size={16} />}
          </div>
        </div>
      </aside>
      <div className="workspace-main">
        <header className="topbar">
          <div className="breadcrumb">
            <span>{role === "supplier" ? "Supplier Portal" : "Supplier Evaluation"}</span>
            <span>/</span>
            <strong>{getBreadcrumbLabel()}</strong>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/register"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border border-border bg-popover/80 hover:bg-muted text-foreground transition-colors"
              title="Test the email link flow"
            >
              <Mail size={12} className="text-primary" />
              <span>Simulate Email Invite Link</span>
            </Link>
            {role === "supplier" &&
              (isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    router.navigate({ to: "/login" });
                  }}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LogOut size={13} />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                >
                  <LogIn size={13} />
                  <span>Login</span>
                </Link>
              ))}
          </div>
        </header>
        <main className="main-content">{children}</main>
        <footer className="workspace-footer">
          <span>© 2026 Rainco. Procurement Suite</span>
          <span>Wireframe · Sample data · Email invitation & login flow</span>
        </footer>
      </div>
    </div>
  );
}
export function AccessNotice({ audience }: { audience: "supplier" | "rainco" }) {
  const { setRole } = useWorkspace();
  return (
    <div className="access-notice">
      <ShieldCheck size={32} />
      <h1>{audience === "supplier" ? "Supplier Portal" : "Supplier Evaluation"}</h1>
      <p>This view is reserved for {audience === "supplier" ? "suppliers" : "Rainco users"}.</p>
      <Button onClick={() => setRole(audience)}>
        Preview as {audience === "supplier" ? "a supplier" : "a Rainco user"}
      </Button>
      <small>Audience simulation only; no secure sign-in is connected.</small>
    </div>
  );
}
export function PageHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
      </div>
      {children}
    </div>
  );
}
export function pageMeta(title: string, description: string) {
  return {
    meta: [
      { title: `${title} | Rainco Procurement` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} | Rainco Procurement` },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
