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

export type WorkspaceContextValue = {
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
