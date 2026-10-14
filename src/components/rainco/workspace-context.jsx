import { createContext, useContext, useState } from "react";
import { ThemeProvider } from "@mui/material";
import { raincoMuiTheme } from "./workspace-theme";
import {
  initialCriterias,
  initialDepartments,
  initialDocuments,
  initialEmployees,
  initialEvaluations,
  initialProcesses,
  initialRatingMasters,
  initialStages,
  initialSupplier,
  initialSuppliersList,
  initialSupplierTypes,
  initialSystemUsers,
  initialTemplate,
  initialTemplates,
  initialUserPermissions,
} from "./workspace-data";
export const initialQuotations = [
  {
    id: "PQ-2026-0042",
    issuedDate: "06 Oct 2026",
    requiredDate: "2026-10-15",
    status: "Pending",
    attachments: [],
    items: [
      {
        itemNo: "ITM-1001",
        itemName: "Polyester fabric · Navy",
        requiredDate: "2026-10-15",
        requiredQuantity: 500,
        uom: "m",
        lastPurchasePrice: 1220,
        quotedDate: "2026-10-14",
        quotedQuantity: 500,
        unitPrice: 1250,
        discount: 0,
        taxCode: "VAT-18",
      },
      {
        itemNo: "ITM-1002",
        itemName: "Waterproof canopy coating resin",
        requiredDate: "2026-10-15",
        requiredQuantity: 120,
        uom: "kg",
        lastPurchasePrice: 3350,
        quotedDate: "2026-10-15",
        quotedQuantity: 120,
        unitPrice: 3400,
        discount: 5,
        taxCode: "VAT-18",
      },
    ],
  },
  {
    id: "PQ-2026-0048",
    issuedDate: "08 Oct 2026",
    requiredDate: "2026-10-22",
    status: "Pending",
    attachments: [],
    items: [
      {
        itemNo: "ITM-2014",
        itemName: "Fiberglass umbrella ribs · 24 inch",
        requiredDate: "2026-10-22",
        requiredQuantity: 2000,
        uom: "pcs",
        lastPurchasePrice: 180,
        quotedDate: "2026-10-20",
        quotedQuantity: 2000,
        unitPrice: 185,
        discount: 2,
        taxCode: "SVAT-0",
      },
    ],
  },
  {
    id: "PQ-2026-0039",
    issuedDate: "28 Sep 2026",
    requiredDate: "2026-10-05",
    status: "Completed",
    attachments: ["Price_Schedule_PQ_0039.pdf"],
    items: [
      {
        itemNo: "ITM-3005",
        itemName: "Anodized aluminum center shaft · 14mm",
        requiredDate: "2026-10-05",
        requiredQuantity: 1500,
        uom: "pcs",
        lastPurchasePrice: 310,
        quotedDate: "2026-10-04",
        quotedQuantity: 1500,
        unitPrice: 305,
        discount: 3,
        taxCode: "VAT-18",
      },
    ],
  },
  {
    id: "PQ-2026-0031",
    issuedDate: "19 Sep 2026",
    requiredDate: "2026-09-29",
    status: "Canceled",
    attachments: [],
    items: [
      {
        itemNo: "ITM-4012",
        itemName: "Wooden curved umbrella handles · Matte finish",
        requiredDate: "2026-09-29",
        requiredQuantity: 800,
        uom: "pcs",
        lastPurchasePrice: 245,
        quotedDate: "2026-09-27",
        quotedQuantity: 800,
        unitPrice: 250,
        discount: 0,
        taxCode: "EXEMPT",
      },
    ],
  },
];
const globalForWorkspace = globalThis;
const WorkspaceContext =
  globalForWorkspace.__RAINCO_WORKSPACE_CONTEXT__ ??
  (globalForWorkspace.__RAINCO_WORKSPACE_CONTEXT__ = createContext(null));
const fallbackWorkspaceContext = {
  role: "rainco",
  setRole: () => {},
  documents: initialDocuments,
  setDocuments: () => {},
  quotations: initialQuotations,
  setQuotations: () => {},
  supplierTypes: initialSupplierTypes,
  saveSupplierType: () => {},
  deleteSupplierType: () => {},
  departments: initialDepartments,
  saveDepartment: () => {},
  deleteDepartment: () => {},
  employees: initialEmployees,
  criterias: initialCriterias,
  saveCriteria: () => {},
  deleteCriteria: () => {},
  tutorials: initialCriterias,
  saveTutorial: () => {},
  deleteTutorial: () => {},
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
  templates: initialTemplates,
  saveTemplate: () => {},
  deleteTemplate: () => {},
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
  currentUser: initialSystemUsers[0],
  setCurrentUser: () => {},
};
export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  return context ?? fallbackWorkspaceContext;
}
export function WorkspaceProvider({ children }) {
  const [role, setRole] = useState("supplier");
  const [documents, setDocuments] = useState(initialDocuments);
  const [quotations, setQuotations] = useState(initialQuotations);
  const [supplierTypes, setSupplierTypes] = useState(initialSupplierTypes);
  const [departments, setDepartments] = useState(initialDepartments);
  const [employees] = useState(initialEmployees);
  const [criterias, setCriterias] = useState(initialCriterias);
  const [ratingMasters, setRatingMasters] = useState(initialRatingMasters);
  const [systemUsers, setSystemUsers] = useState(initialSystemUsers);
  const [userPermissions, setUserPermissions] = useState(initialUserPermissions);
  const [suppliersList, setSuppliersList] = useState(initialSuppliersList);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [supplier, setSupplier] = useState(initialSupplier);
  const [lastRegistrationNotice, setLastRegistrationNotice] = useState(null);
  const [stages, setStages] = useState(initialStages);
  const [templates, setTemplates] = useState(initialTemplates);
  const [currentUser, setCurrentUser] = useState(initialSystemUsers[0]);
  const [approvalProcesses, setApprovalProcesses] = useState(initialProcesses);
  const [evaluations, setEvaluations] = useState(initialEvaluations);
  const createApprovalProcessForSection = (processType, targetId, title, subtitle) => {
    const matchingTemplate =
      templates.find(
        (t) =>
          t.isActive &&
          ((t.authorizedSections ?? []).includes(processType) ||
            (processType === "Conditions" && (t.authorizedSections ?? []).includes("Ratings"))),
      ) ||
      templates.find(
        (t) =>
          (t.authorizedSections ?? []).includes(processType) ||
          (processType === "Conditions" && (t.authorizedSections ?? []).includes("Ratings")),
      ) ||
      templates.find((t) => t.isActive) ||
      templates[0] ||
      initialTemplate;
    const templateStages = matchingTemplate.stageIds
      .map((sid) => stages.find((s) => s.id === sid))
      .filter((s) => Boolean(s));
    const newProcess = {
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
  const saveStage = (stageToSave) => {
    setStages((prev) => {
      const exists = prev.some((s) => s.id === stageToSave.id);
      if (exists) {
        return prev.map((s) => (s.id === stageToSave.id ? stageToSave : s));
      }
      return [...prev, stageToSave];
    });
  };
  const deleteStage = (stageId) => {
    setStages((prev) => prev.filter((s) => s.id !== stageId));
  };
  const saveSupplierType = (typeToSave) => {
    setSupplierTypes((prev) => {
      const exists = prev.some((t) => t.id === typeToSave.id);
      if (exists) {
        return prev.map((t) => (t.id === typeToSave.id ? typeToSave : t));
      }
      return [...prev, typeToSave];
    });
  };
  const deleteSupplierType = (id) => {
    setSupplierTypes((prev) => prev.filter((t) => t.id !== id));
  };
  const saveDepartment = (deptToSave) => {
    setDepartments((prev) => {
      const exists = prev.some((d) => d.id === deptToSave.id);
      if (exists) {
        return prev.map((d) => (d.id === deptToSave.id ? deptToSave : d));
      }
      return [...prev, deptToSave];
    });
  };
  const deleteDepartment = (id) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  };
  const saveCriteria = (criteriaToSave) => {
    setCriterias((prev) => {
      const exists = prev.some((c) => c.id === criteriaToSave.id);
      if (exists) {
        return prev.map((c) => (c.id === criteriaToSave.id ? criteriaToSave : c));
      }
      return [...prev, criteriaToSave];
    });
  };
  const deleteCriteria = (id) => {
    setCriterias((prev) => prev.filter((c) => c.id !== id));
  };
  const saveRatingMaster = (ratingToSave) => {
    const withStatus = {
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
      "Conditions",
      withStatus.id,
      `${withStatus.code} · ${withStatus.name}`,
      `${withStatus.supplierType} Supplier Condition · Weightage: ${totalWeight}%`,
    );
  };
  const deleteRatingMaster = (id) => {
    setRatingMasters((prev) => prev.filter((r) => r.id !== id));
    setApprovalProcesses((prev) =>
      prev.filter(
        (p) =>
          !((p.processType === "Ratings" || p.processType === "Conditions") && p.targetId === id),
      ),
    );
  };
  const submitEvaluationForApproval = (evalData) => {
    const newEval = {
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
              criteriaScore: newEval.criteriaScore,
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
            criteriaScore: newEval.criteriaScore,
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
    supplierNameOrId,
    newStatus,
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
  const saveSystemUser = (userToSave) => {
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
        [userToSave.id]: [
          "Supplier Checklist",
          "Pending Approvals",
          "Approved Approvals",
          "Responded Approvals",
          "Rejected Approvals",
          "Approval Queue",
          "Evaluation Sheet",
        ],
      };
    });
  };
  const deleteSystemUser = (id) => {
    setSystemUsers((prev) => prev.filter((u) => u.id !== id));
  };
  const updateUserPermissions = (userId, allowedTabs) => {
    setUserPermissions((prev) => ({
      ...prev,
      [userId]: allowedTabs,
    }));
  };
  const saveTemplate = (templateToSave) => {
    setTemplates((prev) => {
      const exists = prev.some((t) => t.id === templateToSave.id);
      if (exists) {
        return prev.map((t) => (t.id === templateToSave.id ? templateToSave : t));
      }
      return [...prev, templateToSave];
    });
  };
  const deleteTemplate = (id) => {
    setTemplates((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((t) => t.id !== id);
    });
  };
  const approveStage = (processId, stageId, authorizer, remark) => {
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
            status: isComplete ? "Approved" : "Pending",
            updatedAt: nowStr,
          };
        });
        if (proc.processType === "Supplier Registration") {
          setSupplier((s) => (s.name === proc.supplierName ? { ...s, status: "Active" } : s));
          setSuppliersList((list) =>
            list.map((s) => (s.name === proc.supplierName ? { ...s, status: "Active" } : s)),
          );
        } else if (
          (proc.processType === "Ratings" || proc.processType === "Conditions") &&
          proc.targetId
        ) {
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
        return {
          ...proc,
          stages: updatedStages,
          currentStageIndex: nextStageIdx === -1 ? updatedStages.length : nextStageIdx,
          overallStatus: "Approved",
        };
      }),
    );
  };
  const rejectStage = (processId, stageId, authorizer, remark) => {
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
            status: "Rejected",
            updatedAt: nowStr,
          };
        });
        if (
          (proc.processType === "Ratings" || proc.processType === "Conditions") &&
          proc.targetId
        ) {
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
          overallStatus: "Rejected",
        };
      }),
    );
  };
  const registerSupplier = (data) => {
    const supplierName = data.name || "New Supplier";
    const supplierEmail = data.email || "supplier@example.com";
    const updatedSupplier = {
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
  const login = (username, _password, loginRole) => {
    const trimmed = username.trim().toLowerCase();
    const matchedRaincoUser = systemUsers.find(
      (u) => u.username.toLowerCase() === trimmed || u.email.toLowerCase() === trimmed,
    );
    const resolvedRole = loginRole ?? (matchedRaincoUser ? "rainco" : "supplier");
    if (matchedRaincoUser) {
      setCurrentUser(matchedRaincoUser);
    }
    setIsLoggedIn(true);
    setRole(resolvedRole);
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
        quotations,
        setQuotations,
        supplierTypes,
        saveSupplierType,
        deleteSupplierType,
        departments,
        saveDepartment,
        deleteDepartment,
        employees,
        criterias,
        saveCriteria,
        deleteCriteria,
        tutorials: criterias,
        saveTutorial: saveCriteria,
        deleteTutorial: deleteCriteria,
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
        deleteTemplate,
        approvalProcesses,
        activeSupplierApprovalProcess,
        approveStage,
        rejectStage,
        evaluations,
        submitEvaluationForApproval,
        updateSupplierMasterStatus,
        currentUser,
        setCurrentUser,
      }}
    >
      <ThemeProvider theme={raincoMuiTheme}>{children}</ThemeProvider>
    </WorkspaceContext.Provider>
  );
}
