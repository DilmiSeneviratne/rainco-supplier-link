import { useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Layers,
  ListOrdered,
  Plus,
  Save,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AccessNotice,
  PageHeading,
  useWorkspace,
  type ApprovalStage,
  type ApprovalTemplate,
  type AuthorizerRow,
} from "./workspace";
import { Field } from "./registration";

const availableDepartments = [
  "Procurement",
  "Finance & Accounts",
  "Corporate Governance",
  "Quality Assurance",
  "Legal & Compliance",
  "Supply Chain Operations",
];

const standardSections = [
  {
    id: "SEC-1",
    name: "Company Profile & Legal Entity",
    description: "Company registration number, business type, legal trade name",
  },
  {
    id: "SEC-2",
    name: "Authorized Contact Persons",
    description: "Procurement leads, management contacts, identification (NIC/Passport)",
  },
  {
    id: "SEC-3",
    name: "Operating & Registered Addresses",
    description: "Head office, factory warehouse location, delivery postal codes",
  },
  {
    id: "SEC-4",
    name: "Mandatory Business Documents",
    description: "Certificate of Incorporation, VAT Certificate, Form 20",
  },
  {
    id: "SEC-5",
    name: "Banking Details & Currency",
    description: "Bank confirmation letters, settlement currency, account validation",
  },
  {
    id: "SEC-6",
    name: "Commercial Terms & Quotation Limits",
    description: "Credit period terms, minimum order quantities, supply capacity",
  },
  {
    id: "SEC-7",
    name: "Quality Certifications & Compliance",
    description: "ISO 9001/14001 certificates, environmental standards compliance",
  },
  {
    id: "SEC-8",
    name: "Tax Registration & Fiscal Standing",
    description: "TIN certificate, tax clearance reports, withholding tax status",
  },
];

export function ApprovalStagesPage() {
  const { role } = useWorkspace();
  if (role !== "rainco") return <AccessNotice audience="rainco" />;

  return (
    <>
      <PageHeading eyebrow="RAINCO PROCUREMENT" title="Approval Stages" />
      <ApprovalStagesTab />
    </>
  );
}

export function ApprovalTemplatePage() {
  const { role } = useWorkspace();
  if (role !== "rainco") return <AccessNotice audience="rainco" />;

  return (
    <>
      <PageHeading eyebrow="RAINCO PROCUREMENT" title="Approval Template" />
      <ApprovalTemplateTab />
    </>
  );
}

export function SupplierApprovalQueuePage() {
  const { role } = useWorkspace();
  if (role !== "rainco") return <AccessNotice audience="rainco" />;

  return (
    <>
      <PageHeading eyebrow="RAINCO PROCUREMENT" title="Approval Queue" />
      <SupplierApprovalQueueTab />
    </>
  );
}

const defaultAuthorizersList = [
  { name: "Sunil Jayawardena", department: "Procurement", role: "Category Lead" },
  { name: "Malik Fernando", department: "Procurement", role: "Sourcing Executive" },
  { name: "Nadeeka Perera", department: "Finance & Accounts", role: "Senior Accountant" },
  { name: "Kamal Wickramasinghe", department: "Finance & Accounts", role: "Treasury Manager" },
  { name: "Anura Dissanayake", department: "Corporate Governance", role: "Head of Procurement" },
  { name: "Dilmi Seneviratne", department: "Procurement", role: "Supply Chain Manager" },
  { name: "Ruwan Silva", department: "Quality Assurance", role: "QA Inspector" },
  { name: "Chaminda Bandara", department: "Legal & Compliance", role: "Compliance Officer" },
];

function getNextStageId(stages: ApprovalStage[]): string {
  const maxNum = stages.reduce((max, s) => {
    const match = s.id.match(/\d+/);
    return Math.max(max, match ? parseInt(match[0], 10) : 0);
  }, 0);
  return `STAGE-${maxNum + 1}`;
}

function createBlankStage(nextId: string): ApprovalStage {
  const firstAuth = defaultAuthorizersList[0] ?? {
    name: "Sunil Jayawardena",
    department: "Procurement",
    role: "Category Lead",
  };
  return {
    id: nextId,
    name: "",
    description: "",
    approvalsRequired: 1,
    rejectionsRequired: 1,
    isActive: true,
    authorizers: [
      {
        id: "AUTH-1",
        name: firstAuth.name,
        department: firstAuth.department,
        role: firstAuth.role,
      },
    ],
  };
}

/** 1. APPROVAL STAGES TAB (Simple UI) **/
function ApprovalStagesTab() {
  const { stages, saveStage, deleteStage, departments } = useWorkspace();
  const [editingStageId, setEditingStageId] = useState<string | null>(null);

  const [form, setForm] = useState<ApprovalStage>(() => createBlankStage(getNextStageId(stages)));
  const [notice, setNotice] = useState<string>("");

  const handleEdit = (stage: ApprovalStage) => {
    setEditingStageId(stage.id);
    setForm({
      ...stage,
      isActive: stage.isActive ?? true,
    });
    setNotice(`Loaded stage "${stage.name}" for editing.`);
  };

  const handleAddAuthorizerRow = () => {
    const nextAuth = defaultAuthorizersList.find(
      (da) => !form.authorizers.some((existing) => existing.name === da.name),
    ) ??
      defaultAuthorizersList[0] ?? {
        name: "Sunil Jayawardena",
        department: "Procurement",
        role: "Category Lead",
      };

    const newAuth: AuthorizerRow = {
      id: `AUTH-${Date.now().toString().slice(-4)}`,
      name: nextAuth.name,
      department: nextAuth.department,
      role: nextAuth.role,
    };
    setForm({
      ...form,
      authorizers: [...form.authorizers, newAuth],
    });
  };

  const handleAuthorizerSelect = (id: string, authorizerName: string) => {
    const matched = defaultAuthorizersList.find((a) => a.name === authorizerName);
    setForm({
      ...form,
      authorizers: form.authorizers.map((a) =>
        a.id === id
          ? {
              ...a,
              name: authorizerName,
              department: matched ? matched.department : a.department,
              role: matched ? matched.role : a.role,
            }
          : a,
      ),
    });
  };

  const handleDepartmentChange = (id: string, department: string) => {
    setForm({
      ...form,
      authorizers: form.authorizers.map((a) => (a.id === id ? { ...a, department } : a)),
    });
  };

  const handleRemoveAuthorizer = (id: string) => {
    setForm({
      ...form,
      authorizers: form.authorizers.filter((a) => a.id !== id),
    });
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      setNotice("Please enter a stage name.");
      return;
    }
    if (form.approvalsRequired < 1) {
      setNotice("Number of approvals required must be at least 1.");
      return;
    }
    if (form.rejectionsRequired < 1) {
      setNotice("Number of rejections required must be at least 1.");
      return;
    }
    if (form.authorizers.length === 0) {
      setNotice("Please add at least one authorizer to the grid.");
      return;
    }

    const updatedStages = stages.some((s) => s.id === form.id)
      ? stages.map((s) => (s.id === form.id ? form : s))
      : [...stages, form];

    saveStage(form);
    setEditingStageId(null);
    setForm(createBlankStage(getNextStageId(updatedStages)));
    setNotice(`Approval stage "${form.name}" saved successfully!`);
  };

  const handleDelete = (stageId: string) => {
    const remainingStages = stages.filter((s) => s.id !== stageId);
    deleteStage(stageId);
    if (editingStageId === stageId) {
      setEditingStageId(null);
      setForm(createBlankStage(getNextStageId(remainingStages)));
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Stage Input Form */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              {editingStageId && stages.some((s) => s.id === editingStageId)
                ? `Edit Approval Stage (${editingStageId})`
                : "Create Approval Stage"}
            </h2>
          </div>
        </div>

        {notice && (
          <div
            className={`p-3 rounded text-xs ${
              notice.includes("successfully")
                ? "bg-emerald-50 border border-emerald-300 text-emerald-800"
                : "bg-amber-50 border border-amber-300 text-amber-800"
            }`}
          >
            {notice}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Stage Name" required>
            <input
              type="text"
              placeholder="e.g. Procurement Desk Review"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full"
            />
          </Field>

          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
              <span className="font-medium">Active Status</span>
            </label>
          </div>

          <div className="md:col-span-2">
            <Field label="Stage Description" required>
              <textarea
                placeholder="Brief description of the verification tasks for this stage..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full h-16 resize-none"
              />
            </Field>
          </div>

          <Field label="No. of Approvals Required" required>
            <input
              type="number"
              min={1}
              max={10}
              value={form.approvalsRequired}
              onChange={(e) => setForm({ ...form, approvalsRequired: Number(e.target.value) || 1 })}
              className="w-full font-mono tabular-nums"
            />
          </Field>

          <Field label="No. of Rejections Required" required>
            <input
              type="number"
              min={1}
              max={10}
              value={form.rejectionsRequired}
              onChange={(e) =>
                setForm({ ...form, rejectionsRequired: Number(e.target.value) || 1 })
              }
              className="w-full font-mono tabular-nums"
            />
          </Field>
        </div>

        {/* Authorizers Grid */}
        <div className="pt-4 border-t border-border space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold text-foreground">
                Authorizers & Departments Grid
              </h3>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddAuthorizerRow}
              className="text-xs h-7 gap-1"
            >
              <Plus size={12} />
              Add Authorizer Row
            </Button>
          </div>

          <div className="overflow-x-auto rounded border border-border">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-12 text-center">#</th>
                  <th>Authorizer</th>
                  <th>Department</th>
                  <th className="w-16 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {form.authorizers.map((auth, idx) => (
                  <tr key={auth.id}>
                    <td className="text-center font-mono text-[10px] text-muted-foreground">
                      {idx + 1}
                    </td>
                    <td>
                      <select
                        value={auth.name}
                        onChange={(e) => handleAuthorizerSelect(auth.id, e.target.value)}
                        className="grid-input"
                      >
                        {defaultAuthorizersList.map((item) => (
                          <option key={item.name} value={item.name}>
                            {item.name} ({item.department})
                          </option>
                        ))}
                        {!defaultAuthorizersList.some((item) => item.name === auth.name) &&
                          auth.name && <option value={auth.name}>{auth.name}</option>}
                      </select>
                    </td>
                    <td>
                      <select
                        value={auth.department}
                        onChange={(e) => handleDepartmentChange(auth.id, e.target.value)}
                        className="grid-input"
                      >
                        {(departments.length > 0
                          ? departments.map((d) => d.name)
                          : availableDepartments
                        ).map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                        {!departments.some((d) => d.name === auth.department) &&
                          !availableDepartments.includes(auth.department) &&
                          auth.department && (
                            <option value={auth.department}>{auth.department}</option>
                          )}
                      </select>
                    </td>
                    <td className="text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveAuthorizer(auth.id)}
                        className="p-1 hover:text-destructive text-muted-foreground transition-colors"
                        title="Remove row"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
                {form.authorizers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center text-xs text-muted-foreground py-5">
                      No authorizers added. Click "Add Authorizer Row" above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-2">
            <Button size="sm" onClick={handleSave} className="text-xs gap-1.5">
              <Save size={13} />
              Save Approval Stage
            </Button>
          </div>
        </div>
      </div>

      {/* 2. All Stages Grid with Edit Action */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h2 className="text-sm font-semibold text-foreground">All Approval Stages</h2>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            Total Stages: {stages.length}
          </span>
        </div>

        <div className="overflow-x-auto rounded border border-border">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-24">Stage ID</th>
                <th>Stage Name</th>
                <th>Description</th>
                <th className="w-24 text-center">Approvals</th>
                <th className="w-24 text-center">Rejections</th>
                <th>Authorizers & Departments</th>
                <th className="w-20 text-center">Status</th>
                <th className="w-28 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stages.map((stg) => (
                <tr key={stg.id} className={editingStageId === stg.id ? "bg-primary/5" : ""}>
                  <td className="font-mono text-[10px] text-primary font-medium">{stg.id}</td>
                  <td className="font-medium text-foreground">{stg.name}</td>
                  <td className="text-xs text-muted-foreground max-w-xs truncate">
                    {stg.description}
                  </td>
                  <td className="text-center font-mono text-xs">{stg.approvalsRequired}</td>
                  <td className="text-center font-mono text-xs">{stg.rejectionsRequired}</td>
                  <td>
                    <div className="text-[11px] text-muted-foreground">
                      {stg.authorizers.map((a) => `${a.name} (${a.department})`).join(", ") ||
                        "None"}
                    </div>
                  </td>
                  <td className="text-center">
                    <span
                      className={`badge text-[9px] ${
                        stg.isActive !== false
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {stg.isActive !== false ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(stg)}
                        className="h-6 text-[11px] px-2.5"
                      >
                        Edit
                      </Button>
                      <button
                        type="button"
                        onClick={() => handleDelete(stg.id)}
                        className="p-1 hover:text-destructive text-muted-foreground transition-colors"
                        title="Delete stage"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {stages.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-xs text-muted-foreground py-6">
                    No stages configured.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const authorizedAreasList = [
  { id: "AREA-REG", name: "Supplier Registration" },
  { id: "AREA-RAT", name: "Ratings" },
  { id: "AREA-EVAL", name: "Supplier Evaluation" },
];

function getNextTemplateId(templates: ApprovalTemplate[]): string {
  const maxNum = templates.reduce((max, t) => {
    const match = t.id.match(/\d+/);
    return Math.max(max, match ? parseInt(match[0], 10) : 0);
  }, 0);
  return `TMPL-${maxNum + 1}`;
}

function createBlankTemplate(nextId: string): ApprovalTemplate {
  return {
    id: nextId,
    name: "",
    description: "",
    isActive: true,
    authorizedSections: [],
    stageIds: [],
  };
}

/** 2. APPROVAL TEMPLATE TAB (Simple UI) **/
function ApprovalTemplateTab() {
  const { templates, stages, saveTemplate } = useWorkspace();
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [childTab, setChildTab] = useState<"areas" | "stages">("areas");

  const [form, setForm] = useState<ApprovalTemplate>(() =>
    createBlankTemplate(getNextTemplateId(templates)),
  );
  const [notice, setNotice] = useState<string>("");

  const handleEdit = (tmpl: ApprovalTemplate) => {
    setEditingTemplateId(tmpl.id);
    setForm({
      ...tmpl,
      authorizedSections:
        tmpl.authorizedSections && tmpl.authorizedSections.length > 0
          ? tmpl.authorizedSections
          : ["Supplier Registration", "Supplier Evaluation"],
    });
    setNotice(`Loaded template "${tmpl.name}" for editing.`);
  };

  const handleToggleArea = (areaName: string) => {
    const current = form.authorizedSections ?? [];
    const exists = current.includes(areaName);
    setForm({
      ...form,
      authorizedSections: exists ? current.filter((a) => a !== areaName) : [...current, areaName],
    });
  };

  const handleToggleStage = (stageId: string) => {
    const exists = form.stageIds.includes(stageId);
    setForm({
      ...form,
      stageIds: exists ? form.stageIds.filter((id) => id !== stageId) : [...form.stageIds, stageId],
    });
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      setNotice("Please enter a template name.");
      return;
    }
    if ((form.authorizedSections ?? []).length === 0) {
      setNotice(
        "Please select at least one authorized area to approve in the Authorized Areas tab.",
      );
      return;
    }
    if (form.stageIds.length === 0) {
      setNotice("Please select at least one stage in the Stages tab.");
      return;
    }

    const updatedTemplates = templates.some((t) => t.id === form.id)
      ? templates.map((t) => (t.id === form.id ? form : t))
      : [...templates, form];

    saveTemplate(form);
    setEditingTemplateId(null);
    setForm(createBlankTemplate(getNextTemplateId(updatedTemplates)));
    setNotice(`Approval template "${form.name}" saved successfully!`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Child Tabs */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              {editingTemplateId && templates.some((t) => t.id === editingTemplateId)
                ? `Edit Approval Template (${editingTemplateId})`
                : "Create Approval Template"}
            </h2>
          </div>
        </div>

        {notice && (
          <div
            className={`p-3 rounded text-xs ${
              notice.includes("successfully")
                ? "bg-emerald-50 border border-emerald-300 text-emerald-800"
                : "bg-amber-50 border border-amber-300 text-amber-800"
            }`}
          >
            {notice}
          </div>
        )}

        {/* Header Fields: Name, Description, Active Checkbox */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Template Name" required>
            <input
              type="text"
              placeholder="e.g. Standard Supplier Onboarding Template"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full"
            />
          </Field>

          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
              <span className="font-medium">Active Status (Default Template)</span>
            </label>
          </div>

          <div className="md:col-span-2">
            <Field label="Template Description" required>
              <textarea
                placeholder="Describe the workflow purpose and criteria..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full h-16 resize-none"
              />
            </Field>
          </div>
        </div>

        {/* Child Tabs: Authorized Areas to Approve vs Stages */}
        <div className="pt-2">
          <div className="child-tabs mb-4">
            <button
              type="button"
              className="tab-button"
              data-active={childTab === "areas"}
              onClick={() => setChildTab("areas")}
            >
              <span>Authorized Areas to Approve</span>
              <span className="tab-count ml-1.5">{form.authorizedSections?.length ?? 0}</span>
            </button>
            <button
              type="button"
              className="tab-button"
              data-active={childTab === "stages"}
              onClick={() => setChildTab("stages")}
            >
              <span>Stages</span>
              <span className="tab-count ml-1.5">{form.stageIds.length}</span>
            </button>
          </div>

          {/* Child Tab 1: Authorized Areas to Approve */}
          {childTab === "areas" && (
            <div className="space-y-3">
              <div className="flex items-center justify-end text-xs text-muted-foreground pb-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        authorizedSections: authorizedAreasList.map((a) => a.name),
                      })
                    }
                    className="text-primary hover:underline text-[11px]"
                  >
                    Select all
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        authorizedSections: [],
                      })
                    }
                    className="text-muted-foreground hover:underline text-[11px]"
                  >
                    Clear all
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 py-1">
                {authorizedAreasList.map((area) => {
                  const isChecked = form.authorizedSections?.includes(area.name) ?? false;
                  return (
                    <label
                      key={area.id}
                      className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer select-none py-1"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleArea(area.name)}
                        className="w-4 h-4 rounded text-primary focus:ring-primary shrink-0"
                      />
                      <span className="font-medium">{area.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Child Tab 2: Stages in Grid */}
          {childTab === "stages" && (
            <div className="space-y-3">
              <div className="flex items-center justify-end text-xs text-muted-foreground pb-2">
                <span className="text-[11px]">
                  {form.stageIds.length} of {stages.length} stages included
                </span>
              </div>

              <div className="overflow-x-auto rounded border border-border">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th className="w-16 text-center">Include</th>
                      <th className="w-16 text-center">Order</th>
                      <th>Stage ID</th>
                      <th>Stage Name</th>
                      <th>Description</th>
                      <th>Approvals Required</th>
                      <th>Authorizers Assigned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stages.map((stg) => {
                      const isIncluded = form.stageIds.includes(stg.id);
                      const orderIndex = form.stageIds.indexOf(stg.id);
                      return (
                        <tr
                          key={stg.id}
                          className={isIncluded ? "bg-primary/[0.03]" : "opacity-60"}
                        >
                          <td className="text-center">
                            <input
                              type="checkbox"
                              checked={isIncluded}
                              onChange={() => handleToggleStage(stg.id)}
                              className="w-4 h-4 rounded text-primary focus:ring-primary"
                            />
                          </td>
                          <td className="text-center font-mono text-xs">
                            {isIncluded ? (
                              <span className="inline-block w-5 h-5 rounded-full bg-primary/10 text-primary font-bold leading-5">
                                {orderIndex + 1}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="font-mono text-[10px] text-primary">{stg.id}</td>
                          <td className="font-medium text-foreground">{stg.name}</td>
                          <td className="text-xs text-muted-foreground max-w-xs truncate">
                            {stg.description}
                          </td>
                          <td className="font-mono tabular-nums text-xs">
                            {stg.approvalsRequired}
                          </td>
                          <td>
                            <div className="text-[11px] text-muted-foreground">
                              {stg.authorizers.map((a) => a.name).join(", ") || "None"}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {stages.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center text-xs text-muted-foreground py-6">
                          No stages available. Please configure stages in Approval Stages first.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-border mt-4">
            <Button size="sm" onClick={handleSave} className="text-xs gap-1.5">
              <Save size={13} />
              Save Approval Template
            </Button>
          </div>
        </div>
      </div>

      {/* 2. All Templates Grid with Edit Action */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h2 className="text-sm font-semibold text-foreground">All Approval Templates</h2>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            Total Templates: {templates.length}
          </span>
        </div>

        <div className="overflow-x-auto rounded border border-border">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-24">Template ID</th>
                <th>Template Name</th>
                <th>Description</th>
                <th>Included Stages</th>
                <th className="w-24 text-center">Status</th>
                <th className="w-24 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((tmpl) => {
                const stageNames = tmpl.stageIds
                  .map((sid) => stages.find((s) => s.id === sid)?.name ?? sid)
                  .join(" → ");
                return (
                  <tr key={tmpl.id} className={editingTemplateId === tmpl.id ? "bg-primary/5" : ""}>
                    <td className="font-mono text-[10px] text-primary font-medium">{tmpl.id}</td>
                    <td className="font-medium text-foreground">{tmpl.name}</td>
                    <td className="text-xs text-muted-foreground max-w-xs truncate">
                      {tmpl.description}
                    </td>
                    <td className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground mr-1.5">
                        ({tmpl.stageIds.length} Stages):
                      </span>
                      {stageNames || "None"}
                    </td>
                    <td className="text-center">
                      <span
                        className={`badge text-[9px] ${
                          tmpl.isActive
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {tmpl.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(tmpl)}
                        className="h-6 text-[11px] px-2.5"
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {templates.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-xs text-muted-foreground py-6">
                    No templates configured yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/** 3. SUPPLIER APPROVAL QUEUE TAB **/
function SupplierApprovalQueueTab() {
  const {
    approvalProcesses,
    approveStage,
    rejectStage,
    suppliersList,
    documents,
    ratingMasters,
    criterias,
    evaluations,
  } = useWorkspace();
  const [filterType, setFilterType] = useState<
    "Supplier Registration" | "Ratings" | "Supplier Evaluation"
  >("Supplier Registration");
  const [selectedProcessId, setSelectedProcessId] = useState<string>(
    approvalProcesses[0]?.id ?? "",
  );
  const [authorizerName, setAuthorizerName] = useState("Sunil Jayawardena");
  const [remarkText, setRemarkText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showDetails, setShowDetails] = useState(true);

  const filteredProcesses = approvalProcesses.filter((p) => p.processType === filterType);

  const activeProcess =
    filteredProcesses.find((p) => p.id === selectedProcessId) || filteredProcesses[0];

  const handleApprove = (stageId: string) => {
    if (!activeProcess) return;
    if (!authorizerName.trim()) {
      setFeedback("Please specify authorizer name.");
      return;
    }
    approveStage(activeProcess.id, stageId, authorizerName, remarkText || "Approved after review");
    setRemarkText("");
    setFeedback(`Stage approved successfully by ${authorizerName}.`);
  };

  const handleReject = (stageId: string) => {
    if (!activeProcess) return;
    if (!authorizerName.trim()) {
      setFeedback("Please specify authorizer name.");
      return;
    }
    rejectStage(
      activeProcess.id,
      stageId,
      authorizerName,
      remarkText || "Rejected due to non-compliance",
    );
    setRemarkText("");
    setFeedback(`Stage rejected by ${authorizerName}.`);
  };

  const filterTabs: Array<{
    key: "Supplier Registration" | "Ratings" | "Supplier Evaluation";
    label: string;
  }> = [
    { key: "Supplier Registration", label: "Supplier Registration" },
    { key: "Ratings", label: "Ratings" },
    { key: "Supplier Evaluation", label: "Supplier Evaluation" },
  ];

  return (
    <div className="space-y-6">
      {/* Header Overview & Category Filter Tabs */}
      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Multi-Stage Approval Queue (Supplier Registration, Ratings &amp; Evaluation)
            </h2>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            Active Processes: {filteredProcesses.length}
          </span>
        </div>

        <div className="child-tabs">
          {filterTabs.map((tab) => {
            const count = approvalProcesses.filter((p) => p.processType === tab.key).length;
            return (
              <button
                key={tab.key}
                type="button"
                className="tab-button"
                data-active={filterType === tab.key}
                onClick={() => {
                  setFilterType(tab.key);
                  setFeedback("");
                }}
              >
                <span>{tab.label}</span>
                <span className="tab-count ml-1.5">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Approval Queue List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            Items Pending / In Review
          </h3>

          {filteredProcesses.map((proc) => {
            const isSelected = proc.id === activeProcess?.id;
            return (
              <button
                key={proc.id}
                type="button"
                onClick={() => {
                  setSelectedProcessId(proc.id);
                  setFeedback("");
                }}
                className={`w-full text-left p-4 rounded-lg border text-xs transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 text-foreground shadow-sm"
                    : "border-border bg-card hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-primary">{proc.id}</span>
                    <span className="badge text-[9px]">{proc.processType}</span>
                  </div>
                  <span
                    className={`badge text-[10px] ${
                      proc.overallStatus === "Approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : proc.overallStatus === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "pending"
                    }`}
                  >
                    {proc.overallStatus}
                  </span>
                </div>
                <strong className="block text-sm font-medium text-foreground">
                  {proc.supplierName}
                </strong>
                <span className="text-[11px] text-muted-foreground block mt-0.5">
                  {proc.supplierEmail}
                </span>

                <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-border">
                  <span>
                    {proc.stages.filter((s) => s.status === "Approved").length} of{" "}
                    {proc.stages.length} Stages Approved
                  </span>
                  <span className="text-muted-foreground font-mono">{proc.registrationDate}</span>
                </div>
              </button>
            );
          })}

          {filteredProcesses.length === 0 && (
            <div className="p-6 text-center text-xs text-muted-foreground border border-dashed rounded-lg">
              No approval processes found for this category.
            </div>
          )}
        </div>

        {/* Right: Selected Process Stage-by-Stage Inspector (8 cols) */}
        {activeProcess ? (
          <div className="lg:col-span-8 space-y-5">
            <div className="rounded-lg border border-border bg-card p-6 space-y-5">
              <div className="flex items-start justify-between pb-4 border-b border-border">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-primary">{activeProcess.id}</span>
                    <span className="badge text-[10px]">{activeProcess.processType}</span>
                  </div>
                  <h2 className="text-base font-bold text-foreground">
                    {activeProcess.supplierName}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activeProcess.supplierEmail}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Workflow Template:{" "}
                    <span className="text-foreground">{activeProcess.templateName}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`badge text-xs px-2.5 py-1 ${
                      activeProcess.overallStatus === "Approved"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : activeProcess.overallStatus === "Rejected"
                          ? "bg-red-100 text-red-800 border-red-300"
                          : "pending"
                    }`}
                  >
                    {activeProcess.overallStatus}
                  </span>
                  <small className="block text-[10px] text-muted-foreground mt-1">
                    Submitted: {activeProcess.registrationDate}
                  </small>
                </div>
              </div>

              {feedback && (
                <div className="p-3 rounded bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs">
                  {feedback}
                </div>
              )}

              {/* Submission Details to Review Before Approving */}
              <div className="rounded-lg border border-border bg-muted/20 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Layers size={14} className="text-primary" />
                    <strong className="text-xs font-semibold text-foreground">
                      {activeProcess.processType} Details to Review
                    </strong>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setShowDetails((prev) => !prev)}
                    className="h-6 text-[11px] px-2.5"
                  >
                    {showDetails ? "Hide Details" : "View Details"}
                  </Button>
                </div>

                {showDetails && (
                  <div className="p-4 space-y-4 text-xs">
                    {/* CASE 1: SUPPLIER REGISTRATION DETAILS */}
                    {activeProcess.processType === "Supplier Registration" &&
                      (() => {
                        const matchedSupplier =
                          suppliersList.find(
                            (s) =>
                              s.registrationNo === activeProcess.targetId ||
                              s.name === activeProcess.supplierName,
                          ) ?? suppliersList[0];

                        if (!matchedSupplier) {
                          return (
                            <p className="text-muted-foreground">
                              No registration details found for this supplier.
                            </p>
                          );
                        }

                        const requiredDocs = documents[matchedSupplier.businessType] ?? [];

                        return (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-3.5 rounded border border-border bg-card">
                              <div>
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                                  Supplier Name
                                </span>
                                <strong className="text-foreground font-medium">
                                  {matchedSupplier.name}
                                </strong>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                                  SAP BP ID / Reg. No
                                </span>
                                <span className="font-mono text-primary font-medium">
                                  {matchedSupplier.sapPartnerId} · {matchedSupplier.registrationNo}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                                  Business Type &amp; Currency
                                </span>
                                <span className="text-foreground">
                                  {matchedSupplier.businessType} ({matchedSupplier.currency})
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                                  Email Address
                                </span>
                                <span className="text-foreground">{matchedSupplier.email}</span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                                  Phone Number
                                </span>
                                <span className="font-mono text-foreground">
                                  {matchedSupplier.phone}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                                  Contacts &amp; Portal Username
                                </span>
                                <span className="font-mono text-foreground">
                                  {matchedSupplier.contactsCount} Contacts · @
                                  {matchedSupplier.username}
                                </span>
                              </div>
                              {matchedSupplier.remark && (
                                <div className="sm:col-span-2 md:col-span-3 pt-2 border-t border-border">
                                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                                    Registration Remarks
                                  </span>
                                  <span className="text-muted-foreground">
                                    {matchedSupplier.remark}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Attached Checklist Documents */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-foreground">
                                  Submitted Checklist Documents ({matchedSupplier.documentsAttached}{" "}
                                  / {matchedSupplier.totalDocumentsRequired})
                                </span>
                                <span className="badge text-[10px]">
                                  {matchedSupplier.businessType} Checklist
                                </span>
                              </div>
                              <div className="overflow-x-auto rounded border border-border bg-card">
                                <table className="data-table">
                                  <thead>
                                    <tr>
                                      <th className="w-28">Doc Code</th>
                                      <th>Document Name</th>
                                      <th className="w-32 text-center">Verification</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {requiredDocs.map((doc) => (
                                      <tr key={doc.code}>
                                        <td className="font-mono text-xs text-primary">
                                          {doc.code}
                                        </td>
                                        <td className="font-medium text-foreground">{doc.name}</td>
                                        <td className="text-center">
                                          <span className="badge bg-emerald-100 text-emerald-800 text-[10px]">
                                            Attached
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                    {/* CASE 2: RATINGS MASTER DETAILS */}
                    {activeProcess.processType === "Ratings" &&
                      (() => {
                        const matchedRating =
                          ratingMasters.find((r) => r.id === activeProcess.targetId) ??
                          ratingMasters.find((r) => activeProcess.supplierName.includes(r.code)) ??
                          ratingMasters[0];

                        if (!matchedRating) {
                          return (
                            <p className="text-muted-foreground">
                              No rating configuration details found.
                            </p>
                          );
                        }

                        const chosenCriterias = criterias.filter((c) =>
                          (matchedRating.selectedCriteriaIds ?? []).includes(c.id),
                        );
                        const totalWeight = Object.values(
                          matchedRating.subCriteriaWeights ?? {},
                        ).reduce((sum, w) => sum + (Number(w) || 0), 0);

                        return (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 rounded border border-border bg-card">
                              <div>
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                                  Rate Code
                                </span>
                                <strong className="font-mono text-primary">
                                  {matchedRating.code}
                                </strong>
                              </div>
                              <div className="sm:col-span-2">
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                                  Rate Name
                                </span>
                                <strong className="text-foreground">{matchedRating.name}</strong>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                                  Supplier Type &amp; Weightage
                                </span>
                                <span className="font-mono text-foreground">
                                  {matchedRating.supplierType} · {totalWeight}%
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2.5">
                              <span className="font-semibold text-foreground block">
                                Configured Criterias, Sub-Criteria Weightages &amp; Condition Marks
                              </span>
                              {chosenCriterias.map((main) => (
                                <div
                                  key={main.id}
                                  className="rounded border border-border bg-card overflow-hidden"
                                >
                                  <div className="px-3 py-2 bg-muted/40 border-b border-border flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono text-primary font-semibold">
                                        {main.code}
                                      </span>
                                      <strong className="text-foreground">{main.name}</strong>
                                      <span className="badge text-[9px]">{main.criteriaType}</span>
                                    </div>
                                  </div>
                                  <div className="overflow-x-auto">
                                    <table className="data-table">
                                      <thead>
                                        <tr>
                                          <th className="w-24">Sub Code</th>
                                          <th>Sub Criteria</th>
                                          <th className="w-24">Data Type</th>
                                          <th className="w-28 text-right">Weightage</th>
                                          <th>Configured Conditions &amp; Marks</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {main.subCriterias.map((sub) => {
                                          const weight =
                                            matchedRating.subCriteriaWeights?.[sub.id] ?? 0;
                                          const conds =
                                            matchedRating.subCriteriaRatings?.[sub.id] ?? [];
                                          return (
                                            <tr key={sub.id}>
                                              <td className="font-mono text-xs text-primary">
                                                {sub.code}
                                              </td>
                                              <td className="font-medium text-foreground">
                                                {sub.indication}
                                              </td>
                                              <td>
                                                <span className="badge text-[9px]">
                                                  {sub.criteriaValue}
                                                </span>
                                              </td>
                                              <td className="text-right font-mono font-semibold text-primary">
                                                {weight}%
                                              </td>
                                              <td>
                                                <div className="flex flex-wrap gap-1.5">
                                                  {conds.map((c) => (
                                                    <span
                                                      key={c.id}
                                                      className="px-2 py-0.5 rounded border border-border bg-muted/40 font-mono text-[11px]"
                                                    >
                                                      {c.condition}:{" "}
                                                      <strong className="text-primary">
                                                        {c.marks}m
                                                      </strong>
                                                    </span>
                                                  ))}
                                                  {conds.length === 0 && (
                                                    <span className="text-muted-foreground">—</span>
                                                  )}
                                                </div>
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}

                    {/* CASE 3: SUPPLIER EVALUATION DETAILS */}
                    {activeProcess.processType === "Supplier Evaluation" &&
                      (() => {
                        const matchedEval =
                          evaluations.find((ev) => ev.id === activeProcess.targetId) ??
                          evaluations[0];

                        if (!matchedEval) {
                          return (
                            <p className="text-muted-foreground">
                              No supplier evaluation sheet details found.
                            </p>
                          );
                        }

                        return (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-3.5 rounded border border-border bg-card">
                              <div>
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                                  Supplier
                                </span>
                                <strong className="text-foreground">
                                  {matchedEval.supplierName}
                                </strong>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                                  Selected Rating
                                </span>
                                <span className="font-mono text-primary font-semibold">
                                  {matchedEval.ratingCode}
                                </span>{" "}
                                <span className="text-foreground">· {matchedEval.ratingName}</span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                                  Evaluation Period
                                </span>
                                <span className="font-mono text-foreground">
                                  {matchedEval.fromDate} to {matchedEval.toDate}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                                  Total Marks / Score
                                </span>
                                <strong className="font-mono text-primary">
                                  {matchedEval.totalMarks} / {matchedEval.totalScore} (
                                  {matchedEval.percentage}%)
                                </strong>
                              </div>
                              {matchedEval.remark && (
                                <div className="sm:col-span-2 md:col-span-4 pt-2 border-t border-border">
                                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                                    Evaluation Remarks
                                  </span>
                                  <span className="text-muted-foreground">
                                    {matchedEval.remark}
                                  </span>
                                </div>
                              )}
                            </div>

                            {matchedEval.subCriteriaEntries &&
                              matchedEval.subCriteriaEntries.length > 0 && (
                                <div className="overflow-x-auto rounded border border-border bg-card">
                                  <table className="data-table">
                                    <thead>
                                      <tr>
                                        <th>Main Criteria</th>
                                        <th>Sub Criteria</th>
                                        <th>Data Type</th>
                                        <th>Selected Condition</th>
                                        <th className="text-right">Score</th>
                                        <th className="text-right">Marks</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {matchedEval.subCriteriaEntries.map((entry) => (
                                        <tr key={`${entry.mainId}-${entry.subId}`}>
                                          <td>
                                            <span className="font-mono text-primary font-medium">
                                              {entry.mainCode}
                                            </span>{" "}
                                            · {entry.mainName}
                                          </td>
                                          <td className="font-medium text-foreground">
                                            <span className="font-mono text-xs text-primary">
                                              {entry.subCode}
                                            </span>{" "}
                                            · {entry.subIndication}
                                          </td>
                                          <td>
                                            <span className="badge text-[9px]">
                                              {entry.criteriaValue}
                                            </span>
                                          </td>
                                          <td className="font-mono text-xs">{entry.condition}</td>
                                          <td className="text-right font-mono tabular-nums">
                                            {entry.score}
                                          </td>
                                          <td className="text-right font-mono tabular-nums font-semibold text-primary">
                                            {entry.marks}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                    <tfoot>
                                      <tr className="border-t-2 border-border bg-muted/40 font-semibold">
                                        <td colSpan={4} className="text-foreground">
                                          Total Evaluation Marks
                                        </td>
                                        <td className="text-right font-mono tabular-nums">
                                          {matchedEval.totalScore}
                                        </td>
                                        <td className="text-right font-mono tabular-nums text-primary font-bold">
                                          {matchedEval.totalMarks} ({matchedEval.percentage}%)
                                        </td>
                                      </tr>
                                    </tfoot>
                                  </table>
                                </div>
                              )}
                          </div>
                        );
                      })()}
                  </div>
                )}
              </div>

              {/* Authorizer Sign-Off Control Bar */}
              <div className="p-4 rounded-lg bg-muted/40 border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-primary" />
                    <span>Authorizer Action Panel</span>
                  </strong>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                      Authorizer User
                    </label>
                    <input
                      type="text"
                      value={authorizerName}
                      onChange={(e) => setAuthorizerName(e.target.value)}
                      placeholder="e.g. Sunil Jayawardena"
                      className="w-full bg-background border border-input rounded px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                      Evaluation Remark / Sign-Off Note
                    </label>
                    <input
                      type="text"
                      value={remarkText}
                      onChange={(e) => setRemarkText(e.target.value)}
                      placeholder="e.g. VAT certificate verified with Inland Revenue"
                      className="w-full bg-background border border-input rounded px-2.5 py-1.5 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Stages List & Execution Progress */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground">
                  Sequential Approval Stages ({activeProcess.stages.length} Stages)
                </h3>

                <div className="space-y-3">
                  {activeProcess.stages.map((stage, idx) => {
                    const isApproved = stage.status === "Approved";
                    const isRejected = stage.status === "Rejected";
                    const isPending = stage.status === "Pending";

                    return (
                      <div
                        key={stage.stageId}
                        className={`p-4 rounded-lg border text-xs transition-colors ${
                          isApproved
                            ? "border-emerald-300 bg-emerald-50/40"
                            : isRejected
                              ? "border-red-300 bg-red-50/40"
                              : "border-border bg-card"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <span
                              className={`w-6 h-6 rounded-full grid place-items-center font-bold text-xs shrink-0 ${
                                isApproved
                                  ? "bg-emerald-600 text-white"
                                  : isRejected
                                    ? "bg-red-600 text-white"
                                    : "bg-muted text-muted-foreground border border-border"
                              }`}
                            >
                              {isApproved ? (
                                <Check size={13} />
                              ) : isRejected ? (
                                <X size={13} />
                              ) : (
                                idx + 1
                              )}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <strong className="text-sm font-medium text-foreground">
                                  {stage.stageName}
                                </strong>
                                <span className="font-mono text-[10px] text-muted-foreground">
                                  {stage.stageId}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0 text-right">
                            <span
                              className={`badge ${
                                isApproved
                                  ? "bg-emerald-100 text-emerald-800"
                                  : isRejected
                                    ? "bg-red-100 text-red-800"
                                    : "pending"
                              }`}
                            >
                              {stage.status}
                            </span>
                            <span className="block font-mono text-[10px] text-muted-foreground mt-1 tabular-nums">
                              Approvals: {stage.approvedBy.length} / {stage.approvalsRequired}
                            </span>
                          </div>
                        </div>

                        {/* Sign-off Details & Remarks */}
                        {stage.approvedBy.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-emerald-200/60 text-[11px] text-emerald-900 flex items-center justify-between">
                            <span>
                              <strong>Approved By:</strong> {stage.approvedBy.join(", ")}
                            </span>
                            {stage.updatedAt && (
                              <span className="text-muted-foreground font-mono">
                                {stage.updatedAt}
                              </span>
                            )}
                          </div>
                        )}

                        {stage.remarks.length > 0 && (
                          <div className="mt-1 text-[11px] text-muted-foreground italic">
                            "{stage.remarks.join("; ")}"
                          </div>
                        )}

                        {/* Action buttons if Pending */}
                        {isPending && activeProcess.overallStatus !== "Rejected" && (
                          <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-end gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(stage.stageId)}
                              className="h-7 text-xs text-destructive hover:bg-destructive/10"
                            >
                              <XCircle size={12} className="mr-1" />
                              <span>Reject Stage</span>
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleApprove(stage.stageId)}
                              className="h-7 text-xs bg-emerald-700 hover:bg-emerald-800 text-white"
                            >
                              <CheckCircle2 size={12} className="mr-1" />
                              <span>Approve Stage</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center text-xs text-muted-foreground border border-dashed rounded-lg">
            No supplier selected in approval queue.
          </div>
        )}
      </div>
    </div>
  );
}
