import { createContext, useContext, useState, type ReactNode } from "react";
import { ThemeProvider } from "@mui/material";
import { raincoMuiTheme } from "./workspace-theme";
import type {
  ApprovalProcessType,
  ApprovalStage,
  ApprovalTemplate,
  CriteriaMasterRow,
  DepartmentRow,
  RatingMasterRow,
  RegisteredSupplier,
  SupplierApprovalProcess,
  SupplierEvaluationRecord,
  SupplierMasterStatus,
  SupplierTypeRow,
  SystemUserRow,
  WorkspaceContextValue,
} from "./workspace-types";
import {
  initialCriterias,
  initialDepartments,
  initialDocuments,
  initialEvaluations,
  initialProcesses,
  initialRatingMasters,
  initialStages,
  initialSupplier,
  initialSuppliersList,
  initialSupplierTypes,
  initialSystemUsers,
  initialTemplate,
  initialUserPermissions,
} from "./workspace-data";

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

  const login = (username: string, _password?: string, loginRole?: "supplier" | "rainco") => {
    const trimmed = username.trim().toLowerCase();
    const matchedRaincoUser = systemUsers.find(
      (u) => u.username.toLowerCase() === trimmed || u.email.toLowerCase() === trimmed,
    );
    const resolvedRole = loginRole ?? (matchedRaincoUser ? "rainco" : "supplier");
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
      <ThemeProvider theme={raincoMuiTheme}>{children}</ThemeProvider>
    </WorkspaceContext.Provider>
  );
}
