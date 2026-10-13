import { useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccessNotice, PageHeading, useWorkspace } from "./workspace";
import { Field } from "./registration";

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
function getNextStageId(stages) {
  const maxNum = stages.reduce((max, s) => {
    const match = s.id.match(/\d+/);
    return Math.max(max, match ? parseInt(match[0], 10) : 0);
  }, 0);
  return `STAGE-${maxNum + 1}`;
}
function createBlankStage(nextId) {
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
function AuthorizersEditorGrid({
  authorizers,
  userList = defaultAuthorizersList,
  onAddRow,
  onSelectAuthorizer,
  onRemoveRow,
  onSave,
}) {
  return (
    <div className="pt-4 border-t border-border space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold text-foreground">Authorizers & Departments Grid</h3>
        </div>
        <Button size="sm" variant="outline" onClick={onAddRow} className="text-xs h-7 gap-1">
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
              <th className="w-64">Department</th>
              <th className="w-16 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {authorizers.map((auth, idx) => (
              <tr key={auth.id}>
                <td className="text-center font-mono text-[10px] text-muted-foreground">
                  {idx + 1}
                </td>
                <td>
                  <select
                    value={auth.name}
                    onChange={(e) => onSelectAuthorizer(auth.id, e.target.value)}
                    className="grid-input"
                  >
                    {userList.map((item) => (
                      <option key={item.name} value={item.name}>
                        {item.name} ({item.department})
                      </option>
                    ))}
                    {!userList.some((item) => item.name === auth.name) && auth.name && (
                      <option value={auth.name}>{auth.name}</option>
                    )}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    value={auth.department || ""}
                    readOnly
                    className="grid-input bg-muted/40 text-muted-foreground font-medium cursor-not-allowed select-none text-xs"
                    placeholder="Department"
                  />
                </td>
                <td className="text-center">
                  <button
                    type="button"
                    onClick={() => onRemoveRow(auth.id)}
                    className="p-1 hover:text-destructive text-muted-foreground transition-colors"
                    title="Remove row"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
            {authorizers.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-xs text-muted-foreground py-5">
                  No authorizers added. Click &quot;Add Authorizer Row&quot; above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end pt-2">
        <Button size="sm" onClick={onSave} className="text-xs gap-1.5">
          <Save size={13} />
          Save Approval Stage
        </Button>
      </div>
    </div>
  );
}
function AllApprovalStagesTable({ stages, editingStageId, onEdit }) {
  return (
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
              <th className="w-20 text-center">Active</th>
              <th className="w-20 text-center">Actions</th>
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
                    {stg.authorizers.map((a) => `${a.name} (${a.department})`).join(", ") || "None"}
                  </div>
                </td>
                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={stg.isActive !== false}
                    readOnly
                    className="w-4 h-4 rounded text-primary accent-primary cursor-default"
                    title={stg.isActive !== false ? "Active" : "Inactive"}
                  />
                </td>
                <td className="text-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(stg)}
                    className="h-6 text-[11px] px-2.5"
                  >
                    Edit
                  </Button>
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
  );
}
export function ApprovalStagesTab() {
  const { stages, saveStage, employees, systemUsers } = useWorkspace();
  const [editingStageId, setEditingStageId] = useState(null);
  const [form, setForm] = useState(() => createBlankStage(getNextStageId(stages)));
  const [notice, setNotice] = useState("");

  const userList = (
    employees && employees.length > 0
      ? employees.map((emp) => ({
          name: emp.fullName,
          department: emp.department,
          role: emp.designation || "Staff",
        }))
      : defaultAuthorizersList
  ).concat(
    (systemUsers || [])
      .filter(
        (su) =>
          !(employees || defaultAuthorizersList).some(
            (e) => (e.fullName || e.name) === su.fullName,
          ),
      )
      .map((su) => ({
        name: su.fullName,
        department: su.department,
        role: "System User",
      })),
  );

  defaultAuthorizersList.forEach((da) => {
    if (!userList.some((u) => u.name === da.name)) {
      userList.push(da);
    }
  });

  const handleEdit = (stage) => {
    setEditingStageId(stage.id);
    setForm({
      ...stage,
      isActive: stage.isActive ?? true,
    });
    setNotice(`Loaded stage "${stage.name}" for editing.`);
  };
  const handleAddAuthorizerRow = () => {
    const nextAuth =
      userList.find((da) => !form.authorizers.some((existing) => existing.name === da.name)) ??
      userList[0] ??
      defaultAuthorizersList[0];
    const newAuth = {
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
  const handleAuthorizerSelect = (id, authorizerName) => {
    const matched = userList.find((a) => a.name === authorizerName);
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
  const handleRemoveAuthorizer = (id) => {
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
  return (
    <div className="space-y-6">
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
              <span className="font-medium">Active</span>
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

        <AuthorizersEditorGrid
          authorizers={form.authorizers}
          userList={userList}
          onAddRow={handleAddAuthorizerRow}
          onSelectAuthorizer={handleAuthorizerSelect}
          onRemoveRow={handleRemoveAuthorizer}
          onSave={handleSave}
        />
      </div>

      <AllApprovalStagesTable stages={stages} editingStageId={editingStageId} onEdit={handleEdit} />
    </div>
  );
}
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
