import { createContext, useContext, useState, type ReactNode } from "react";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import {
  Building2,
  ChevronDown,
  CircleHelp,
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
  Umbrella,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type BusinessType = "Individual" | "Corporate" | "Government";
export type DocumentRow = { code: string; name: string };
export const businessTypes: BusinessType[] = ["Individual", "Corporate", "Government"];
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

export type SupplierApprovalProcess = {
  id: string;
  supplierName: string;
  supplierEmail: string;
  registrationDate: string;
  templateId: string;
  templateName: string;
  currentStageIndex: number;
  overallStatus: "Pending Approval" | "Approved" | "Rejected";
  stages: StageApprovalStatus[];
};

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
  status: "Active" | "Pending Approval";
};

const initialSupplier: RegisteredSupplier = {
  name: "Northwind Traders Ltd",
  email: "ops@northwind.example",
  phone: "+94 77 204 8813",
  businessType: "Corporate",
  currency: "LKR",
  registrationNo: "PV-00827412",
  username: "northwind_ops",
  password: "password123",
  remark: "Referred by Rainco procurement team for industrial fabric supply.",
  contactsCount: 2,
  documentsAttached: 4,
  totalDocumentsRequired: 4,
  registrationDate: "06 Oct 2026",
  sapPartnerId: "V-10048",
  status: "Pending Approval",
};

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
  name: "Standard Supplier Onboarding Template",
  description:
    "Mandatory multi-department verification workflow for all newly registered corporate and industrial suppliers.",
  isActive: true,
  authorizedSections: ["Supplier Registration", "Supplier Evaluation", "Supplier Checklist"],
  stageIds: ["STAGE-1", "STAGE-2", "STAGE-3"],
};

const initialProcesses: SupplierApprovalProcess[] = [
  {
    id: "PROC-001",
    supplierName: "Northwind Traders Ltd",
    supplierEmail: "ops@northwind.example",
    registrationDate: "06 Oct 2026",
    templateId: "TMPL-1",
    templateName: "Standard Supplier Onboarding Template",
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
        updatedAt: "06 Oct 2026, 09:30 AM",
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
];

type WorkspaceContextValue = {
  role: "supplier" | "rainco";
  setRole: (role: "supplier" | "rainco") => void;
  documents: Record<BusinessType, DocumentRow[]>;
  setDocuments: (documents: Record<BusinessType, DocumentRow[]>) => void;
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
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error("Workspace provider required");
  return context;
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<"supplier" | "rainco">("supplier");
  const [documents, setDocuments] = useState(initialDocuments);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [supplier, setSupplier] = useState<RegisteredSupplier>(initialSupplier);
  const [lastRegistrationNotice, setLastRegistrationNotice] = useState<string | null>(null);

  const [stages, setStages] = useState<ApprovalStage[]>(initialStages);
  const [templates, setTemplates] = useState<ApprovalTemplate[]>([initialTemplate]);
  const [approvalProcesses, setApprovalProcesses] =
    useState<SupplierApprovalProcess[]>(initialProcesses);

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
          // Also update the registered supplier status to Active
          setSupplier((s) => (s.name === proc.supplierName ? { ...s, status: "Active" } : s));
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
    setSupplier((prev) => ({
      ...prev,
      ...data,
      status: "Pending Approval",
      registrationDate: "Today (Just Registered)",
    }));
    setLastRegistrationNotice(
      `Registration submitted for ${supplierName}! Your application has entered the Rainco Approval Process.`,
    );

    // Build approval workflow for this newly registered supplier based on active template
    const activeTemplate = templates.find((t) => t.isActive) || templates[0] || initialTemplate;
    const templateStages = activeTemplate.stageIds
      .map((sid) => stages.find((s) => s.id === sid))
      .filter((s): s is ApprovalStage => Boolean(s));

    const newProcess: SupplierApprovalProcess = {
      id: `PROC-${Date.now().toString().slice(-4)}`,
      supplierName,
      supplierEmail,
      registrationDate: "Today",
      templateId: activeTemplate.id,
      templateName: activeTemplate.name,
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

    setApprovalProcesses((prev) => [newProcess, ...prev]);
  };

  const activeSupplierApprovalProcess =
    approvalProcesses.find((p) => p.supplierName === supplier.name) || approvalProcesses[0];

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
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

const portalNav = [
  { to: "/" as const, label: "Supplier Dashboard", icon: LayoutDashboard },
  { to: "/quotations" as const, label: "Purchase Quotations", icon: FileText },
  { to: "/ratings" as const, label: "My Ratings", icon: Star },
];

const evaluationNav = [
  { to: "/checklist" as const, label: "Supplier Checklist", icon: FileCheck2 },
  { to: "/approval-stages" as const, label: "Approval Stages", icon: Layers },
  { to: "/approval-template" as const, label: "Approval Template", icon: ListOrdered },
  { to: "/approval-queue" as const, label: "Approval Queue", icon: UserCheck },
  { to: "/evaluation" as const, label: "Supplier Evaluation", icon: ClipboardCheck },
];

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const { role, setRole, isLoggedIn, supplier, logout } = useWorkspace();
  const router = useRouter();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const getBreadcrumbLabel = () => {
    if (pathname === "/") return "Supplier Dashboard";
    if (pathname === "/login") return "Supplier Sign-In";
    if (pathname === "/register") return "Supplier Registration (Email Link)";
    if (pathname === "/approval-stages") return "Approval Stages";
    if (pathname === "/approval-template") return "Approval Template";
    if (pathname === "/approval-queue") return "Approval Queue";
    if (pathname === "/checklist") return "Supplier Checklist";
    if (pathname === "/evaluation") return "Supplier Evaluation";
    if (pathname === "/invitations") return "Supplier Invitations";
    const found = [...portalNav, ...evaluationNav].find((item) => item.to === pathname);
    return found?.label ?? "Overview";
  };

  return (
    <div className="workspace">
      <aside className="sidebar">
        <Link to="/" className="brand">
          <div className="brand-mark">
            <Umbrella size={22} />
          </div>
          <div>
            <strong>
              rainco<span className="brand-period">.</span>
            </strong>
            <small>Procurement Suite</small>
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
              {evaluationNav.map((item) => (
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
        </div>
        <div className="sidebar-bottom">
          <div className="integration">
            <div className="flex items-center justify-between">
              <strong>SAP Business One</strong>
              <span className="status-dot" />
            </div>
            <small>
              BP Master Sync · {role === "supplier" ? supplier.sapPartnerId : "V-10048"}
            </small>
            <div className="integration-line">
              <Building2 size={14} /> Partner ID #
              {role === "supplier" ? supplier.sapPartnerId : "V-10048"}
            </div>
          </div>
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
            <span className="preview-label">
              <span className="status-dot" />
              Interactive wireframe
            </span>
            <CircleHelp size={18} className="text-muted-foreground" />
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
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
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
