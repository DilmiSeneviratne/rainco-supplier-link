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
import { AccessNotice, PageHeading, useWorkspace } from "./workspace";
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
      <PageHeading
        eyebrow="RAINCO PROCUREMENT"
        title="Approval Stages"
        description="Configure stage names, required approval thresholds, and assign authorizers with departments."
      />
      <ApprovalStagesTab />
    </>
  );
}

export function ApprovalTemplatePage() {
  const { role } = useWorkspace();
  if (role !== "rainco") return <AccessNotice audience="rainco" />;

  return (
    <>
      <PageHeading
        eyebrow="RAINCO PROCUREMENT"
        title="Approval Template"
        description="Define approval templates with active status, authorized sections, and sequential stages."
      />
      <ApprovalTemplateTab />
    </>
  );
}

export function SupplierApprovalQueuePage() {
  const { role } = useWorkspace();
  if (role !== "rainco") return <AccessNotice audience="rainco" />;

  return (
    <>
      <PageHeading
        eyebrow="RAINCO PROCUREMENT"
        title="Supplier Approval Queue"
        description="Monitor registered suppliers progressing through multi-stage approval workflows and execute sign-offs."
      />
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

/** 1. APPROVAL STAGES TAB (Simple UI) **/
function ApprovalStagesTab() {
  const { stages, saveStage, deleteStage } = useWorkspace();
  const [editingStageId, setEditingStageId] = useState<string | null>(stages[0]?.id ?? null);

  const [form, setForm] = useState<ApprovalStage>(
    stages[0] ?? {
      id: "STAGE-01",
      name: "",
      description: "",
      approvalsRequired: 1,
      rejectionsRequired: 1,
      isActive: true,
      authorizers: [
        {
          id: "AUTH-1",
          name: defaultAuthorizersList[0].name,
          department: defaultAuthorizersList[0].department,
          role: defaultAuthorizersList[0].role,
        },
      ],
    },
  );
  const [notice, setNotice] = useState<string>("");

  const handleEdit = (stage: ApprovalStage) => {
    setEditingStageId(stage.id);
    setForm({
      ...stage,
      isActive: stage.isActive ?? true,
    });
    setNotice(`Loaded stage "${stage.name}" for editing.`);
  };

  const handleNew = () => {
    const newId = `STAGE-${(stages.length + 1).toString().padStart(2, "0")}`;
    setEditingStageId(newId);
    setForm({
      id: newId,
      name: "",
      description: "",
      approvalsRequired: 1,
      rejectionsRequired: 1,
      isActive: true,
      authorizers: [
        {
          id: `AUTH-${Date.now().toString().slice(-4)}`,
          name: defaultAuthorizersList[0].name,
          department: defaultAuthorizersList[0].department,
          role: defaultAuthorizersList[0].role,
        },
      ],
    });
    setNotice("New stage form ready.");
  };

  const handleAddAuthorizerRow = () => {
    const nextAuth =
      defaultAuthorizersList.find(
        (da) => !form.authorizers.some((existing) => existing.name === da.name),
      ) ?? defaultAuthorizersList[0];

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

    saveStage(form);
    setEditingStageId(form.id);
    setNotice(`Approval stage "${form.name}" saved successfully!`);
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
            <p className="text-xs text-muted-foreground mt-0.5">
              Enter stage name, description, approvals/rejections required, and active status.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleNew} className="text-xs h-8 gap-1">
              <Plus size={13} />
              New Stage
            </Button>
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
              <p className="text-[11px] text-muted-foreground">
                Select authorizers from dropdown to add to this stage
              </p>
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
                        {availableDepartments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
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
            <p className="text-xs text-muted-foreground mt-0.5">
              All configured stages in the system. Click Edit to load and update above.
            </p>
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
                        onClick={() => deleteStage(stg.id)}
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
  {
    id: "AREA-REG",
    name: "Supplier Registration",
    description:
      "Supplier onboarding applications, corporate details, contact persons, and mandatory documents",
  },
  {
    id: "AREA-EVAL",
    name: "Supplier Evaluation",
    description:
      "Supplier performance evaluations, scoring criteria, quality benchmarks, and ratings",
  },
  {
    id: "AREA-CHECK",
    name: "Supplier Checklist",
    description: "Document checklist compliance, statutory certifications, and business licenses",
  },
  {
    id: "AREA-QUOT",
    name: "Purchase Quotations",
    description:
      "Quotation requests, pricing submissions, delivery lead times, and commercial bids",
  },
  {
    id: "AREA-SAP",
    name: "Vendor Master (SAP BP)",
    description: "SAP Business One vendor master activation and business partner code integration",
  },
  {
    id: "AREA-FIN",
    name: "Commercial & Payment Terms",
    description:
      "Credit period, settlement currency, banking confirmations, and payment authorization",
  },
];

/** 2. APPROVAL TEMPLATE TAB (Simple UI) **/
function ApprovalTemplateTab() {
  const { templates, stages, saveTemplate } = useWorkspace();
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(
    templates[0]?.id ?? null,
  );
  const [childTab, setChildTab] = useState<"areas" | "stages">("areas");

  const [form, setForm] = useState<ApprovalTemplate>(
    templates[0] ?? {
      id: "TMPL-1",
      name: "",
      description: "",
      isActive: true,
      authorizedSections: ["Supplier Registration", "Supplier Evaluation", "Supplier Checklist"],
      stageIds: stages.map((s) => s.id),
    },
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

  const handleNew = () => {
    const newId = `TMPL-${(templates.length + 1).toString().padStart(2, "0")}`;
    setEditingTemplateId(newId);
    setForm({
      id: newId,
      name: "",
      description: "",
      isActive: true,
      authorizedSections: ["Supplier Registration", "Supplier Evaluation"],
      stageIds: stages.slice(0, 2).map((s) => s.id),
    });
    setNotice("New template form ready.");
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
    saveTemplate(form);
    setEditingTemplateId(form.id);
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
            <p className="text-xs text-muted-foreground mt-0.5">
              Enter name and description in header, select authorized areas and stages in child
              tabs.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleNew} className="text-xs h-8 gap-1">
              <Plus size={13} />
              New Template
            </Button>
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
              <div className="flex items-center justify-between text-xs text-muted-foreground pb-2">
                <span>
                  Select system areas that this approval template is authorized to approve:
                </span>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {authorizedAreasList.map((area) => {
                  const isChecked = form.authorizedSections?.includes(area.name) ?? false;
                  return (
                    <label
                      key={area.id}
                      className={`p-3.5 rounded-lg border text-xs flex items-start gap-3 cursor-pointer transition-colors ${
                        isChecked
                          ? "border-primary/50 bg-primary/5 text-foreground"
                          : "border-border bg-popover/80 hover:bg-muted/40 text-muted-foreground"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleArea(area.name)}
                        className="mt-0.5 w-4 h-4 rounded text-primary focus:ring-primary shrink-0"
                      />
                      <div>
                        <strong className="block font-medium text-foreground">{area.name}</strong>
                        <span className="text-[11px] text-muted-foreground block mt-0.5">
                          {area.description}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Child Tab 2: Stages in Grid */}
          {childTab === "stages" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground pb-2">
                <span>Select stages to include in this approval template:</span>
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
            <p className="text-xs text-muted-foreground mt-0.5">
              All approval templates configured in the system. Click Edit to load and update above.
            </p>
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
  const { approvalProcesses, approveStage, rejectStage } = useWorkspace();
  const [selectedProcessId, setSelectedProcessId] = useState<string>(
    approvalProcesses[0]?.id ?? "",
  );
  const [authorizerName, setAuthorizerName] = useState("Sunil Jayawardena");
  const [remarkText, setRemarkText] = useState("");
  const [feedback, setFeedback] = useState("");

  const activeProcess =
    approvalProcesses.find((p) => p.id === selectedProcessId) || approvalProcesses[0];

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

  return (
    <div className="space-y-6">
      {/* Header Overview */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Supplier Onboarding Approval Queue
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Every supplier registered to the system progresses through the multi-stage approval
              workflow defined in the active template.
            </p>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            Active Processes: {approvalProcesses.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Supplier Queue List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            Registered Suppliers in Review
          </h3>

          {approvalProcesses.map((proc) => {
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
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[10px] text-primary">{proc.id}</span>
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
                  Template: {proc.templateName}
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
        </div>

        {/* Right: Selected Supplier Stage-by-Stage Inspector (8 cols) */}
        {activeProcess ? (
          <div className="lg:col-span-8 space-y-5">
            <div className="rounded-lg border border-border bg-card p-6 space-y-5">
              <div className="flex items-start justify-between pb-4 border-b border-border">
                <div>
                  <span className="text-xs font-mono text-primary block">{activeProcess.id}</span>
                  <h2 className="text-base font-bold text-foreground">
                    {activeProcess.supplierName}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
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
                    Registered: {activeProcess.registrationDate}
                  </small>
                </div>
              </div>

              {feedback && (
                <div className="p-3 rounded bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs">
                  {feedback}
                </div>
              )}

              {/* Authorizer Sign-Off Control Bar */}
              <div className="p-4 rounded-lg bg-muted/40 border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-primary" />
                    <span>Authorizer Action Panel</span>
                  </strong>
                  <span className="text-[11px] text-muted-foreground">
                    Simulate approval or rejection sign-off
                  </span>
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
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {stage.description}
                              </p>
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
