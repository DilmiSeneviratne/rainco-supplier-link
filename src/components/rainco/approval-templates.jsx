import { useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccessNotice, PageHeading, useWorkspace } from "./workspace";
import { Field } from "./registration";
const authorizedAreasList = [
  { id: "AREA-REG", name: "Supplier Registration" },
  { id: "AREA-RAT", name: "Conditions" },
  { id: "AREA-EVAL", name: "Supplier Evaluation" },
];
function getNextTemplateId(templates) {
  const maxNum = templates.reduce((max, t) => {
    const match = t.id.match(/\d+/);
    return Math.max(max, match ? parseInt(match[0], 10) : 0);
  }, 0);
  return `TMPL-${maxNum + 1}`;
}
function createBlankTemplate(nextId) {
  return {
    id: nextId,
    name: "",
    description: "",
    isActive: true,
    authorizedSections: [],
    stageIds: [],
  };
}
function AuthorizedAreasSelector({
  selectedSections,
  onToggleArea,
  onSelectAll,
  onClearAll,
  templates = [],
  editingTemplateId = null,
}) {
  const getUsedByTemplate = (areaName) => {
    return templates.find(
      (t) =>
        t.id !== editingTemplateId &&
        (t.authorizedSections ?? []).includes(areaName),
    );
  };

  const availableAreas = authorizedAreasList.filter((area) => !getUsedByTemplate(area.name));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end text-xs text-muted-foreground pb-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onSelectAll}
            disabled={availableAreas.length === 0}
            className={`text-[11px] ${
              availableAreas.length === 0
                ? "text-muted-foreground cursor-not-allowed opacity-50"
                : "text-primary hover:underline"
            }`}
          >
            Select all
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={onClearAll}
            className="text-muted-foreground hover:underline text-[11px]"
          >
            Clear all
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 py-1">
        {authorizedAreasList.map((area) => {
          const usedBy = getUsedByTemplate(area.name);
          const isUsedByOther = Boolean(usedBy);
          const isChecked = selectedSections.includes(area.name);

          return (
            <label
              key={area.id}
              className={`flex items-center gap-2.5 text-xs select-none py-2 px-3 rounded border transition-colors ${
                isUsedByOther
                  ? "border-border/60 bg-muted/20 opacity-60 cursor-not-allowed text-muted-foreground"
                  : isChecked
                    ? "border-primary/40 bg-primary/5 text-foreground cursor-pointer font-medium"
                    : "border-border bg-card text-foreground cursor-pointer hover:bg-muted/30"
              }`}
              title={isUsedByOther ? `Assigned to ${usedBy.name} (${usedBy.id})` : undefined}
            >
              <input
                type="checkbox"
                checked={isChecked}
                disabled={isUsedByOther}
                onChange={() => {
                  if (!isUsedByOther) {
                    onToggleArea(area.name);
                  }
                }}
                className="w-4 h-4 rounded text-primary focus:ring-primary shrink-0 accent-primary disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className={isChecked ? "font-semibold" : "font-medium"}>
                {area.name}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
function TemplateStagesSelectionGrid({
  stages,
  selectedStageIds,
  onAddStageRow,
  onSelectStageAt,
  onRemoveStageRow,
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-1">
        <div>
          <h3 className="text-xs font-semibold text-foreground">Configured Approval Stages</h3>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={onAddStageRow}
          disabled={stages.length === 0}
          className="text-xs h-7 gap-1"
        >
          <Plus size={12} />
          Add Stage
        </Button>
      </div>

      <div className="overflow-x-auto rounded border border-border">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-16 text-center">Order</th>
              <th>Select Stage</th>
              <th className="w-24">Stage ID</th>
              <th className="w-32 text-center">Approvals Req.</th>
              <th>Authorizers Assigned</th>
              <th className="w-16 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {selectedStageIds.map((stageId, index) => {
              const matchedStage = stages.find((s) => s.id === stageId);
              return (
                <tr key={`${stageId}-${index}`}>
                  <td className="text-center font-mono text-xs">
                    <span className="inline-block w-6 h-6 rounded-full bg-primary/10 text-primary font-bold leading-6">
                      {index + 1}
                    </span>
                  </td>
                  <td>
                    <select
                      value={stageId}
                      onChange={(e) => onSelectStageAt(index, e.target.value)}
                      className="grid-input"
                    >
                      {stages.map((stg) => (
                        <option key={stg.id} value={stg.id}>
                          {stg.name}
                        </option>
                      ))}
                      {!stages.some((s) => s.id === stageId) && (
                        <option value={stageId}>{stageId}</option>
                      )}
                    </select>
                  </td>
                  <td className="font-mono text-xs text-primary font-medium">
                    {matchedStage?.id || stageId}
                  </td>
                  <td className="text-center font-mono text-xs tabular-nums">
                    {matchedStage?.approvalsRequired ?? "—"}
                  </td>
                  <td>
                    <div className="text-[11px] text-muted-foreground">
                      {(matchedStage?.authorizers || [])
                        .map((a) => `${a.name} (${a.department})`)
                        .join(", ") || "None assigned"}
                    </div>
                  </td>
                  <td className="text-center">
                    <button
                      type="button"
                      onClick={() => onRemoveStageRow(index)}
                      className="p-1 hover:text-destructive text-muted-foreground transition-colors"
                      title="Remove stage row"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {selectedStageIds.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-xs text-muted-foreground py-6">
                  {stages.length === 0
                    ? "No stages available. Please configure stages in Approval Stages first."
                    : 'No stages added to this template. Click "Add Stage" above to add a stage row.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function AllApprovalTemplatesTable({
  templates,
  stages,
  editingTemplateId,
  onEdit,
  onDelete,
}) {
  return (
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
              <th>Authorized Areas</th>
              <th>Description</th>
              <th>Included Stages</th>
              <th className="w-20 text-center">Active</th>
              <th className="w-28 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((tmpl) => {
              const stageNames = tmpl.stageIds
                .map((sid) => stages.find((s) => s.id === sid)?.name ?? sid)
                .join(" → ");
              const assignedAreas = tmpl.authorizedSections ?? [];

              return (
                <tr key={tmpl.id} className={editingTemplateId === tmpl.id ? "bg-primary/5" : ""}>
                  <td className="font-mono text-[10px] text-primary font-medium">{tmpl.id}</td>
                  <td className="font-medium text-foreground">{tmpl.name}</td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {assignedAreas.map((area) => (
                        <span
                          key={area}
                          className="badge text-[10px] bg-primary/10 text-primary border-primary/20 font-semibold"
                        >
                          {area}
                        </span>
                      ))}
                      {assignedAreas.length === 0 && (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </td>
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
                    <input
                      type="checkbox"
                      checked={Boolean(tmpl.isActive)}
                      readOnly
                      className="w-4 h-4 rounded text-primary accent-primary cursor-default"
                      title={tmpl.isActive ? "Active" : "Inactive"}
                    />
                  </td>
                  <td className="text-center">
                    <div className="flex items-center gap-1.5 justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(tmpl)}
                        className="h-6 text-[11px] px-2.5"
                      >
                        Edit
                      </Button>
                      {templates.length > 1 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDelete(tmpl.id, tmpl.name)}
                          className="h-6 text-[11px] px-2 text-destructive hover:bg-destructive/10"
                          title="Delete template"
                        >
                          <Trash2 size={12} />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {templates.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-xs text-muted-foreground py-6">
                  No templates configured yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export function ApprovalTemplateTab() {
  const { templates, stages, saveTemplate, deleteTemplate } = useWorkspace();
  const [editingTemplateId, setEditingTemplateId] = useState(null);
  const [childTab, setChildTab] = useState("areas");
  const [form, setForm] = useState(() => createBlankTemplate(getNextTemplateId(templates)));
  const [notice, setNotice] = useState("");

  const handleEdit = (tmpl) => {
    setEditingTemplateId(tmpl.id);
    setForm({
      ...tmpl,
      authorizedSections: tmpl.authorizedSections ? [...tmpl.authorizedSections] : [],
    });
    setNotice(`Loaded template "${tmpl.name}" (${tmpl.id}) for editing.`);
  };

  const handleToggleArea = (areaName) => {
    const usedBy = templates.find(
      (t) => t.id !== editingTemplateId && (t.authorizedSections ?? []).includes(areaName),
    );
    if (usedBy) {
      setNotice(
        `The area "${areaName}" is already assigned to template "${usedBy.name}" (${usedBy.id}). An area cannot be used across multiple templates.`,
      );
      return;
    }
    const current = form.authorizedSections ?? [];
    const exists = current.includes(areaName);
    setForm({
      ...form,
      authorizedSections: exists ? current.filter((a) => a !== areaName) : [...current, areaName],
    });
  };

  const handleSelectAll = () => {
    const available = authorizedAreasList
      .filter(
        (area) =>
          !templates.some(
            (t) => t.id !== editingTemplateId && (t.authorizedSections ?? []).includes(area.name),
          ),
      )
      .map((a) => a.name);

    if (available.length === 0) {
      setNotice(
        "All authorized areas are already assigned to existing templates. Edit an existing template to modify its assigned areas.",
      );
      return;
    }

    setForm({
      ...form,
      authorizedSections: available,
    });
  };

  const handleAddStageRow = () => {
    const availableStage = stages.find((s) => !form.stageIds.includes(s.id)) ?? stages[0];
    if (!availableStage) return;
    setForm((prev) => ({
      ...prev,
      stageIds: [...prev.stageIds, availableStage.id],
    }));
  };

  const handleSelectStageAt = (index, newStageId) => {
    setForm((prev) => {
      const nextIds = [...prev.stageIds];
      nextIds[index] = newStageId;
      return {
        ...prev,
        stageIds: nextIds,
      };
    });
  };

  const handleRemoveStageRow = (index) => {
    setForm((prev) => ({
      ...prev,
      stageIds: prev.stageIds.filter((_, idx) => idx !== index),
    }));
  };

  const handleDelete = (id, name) => {
    if (editingTemplateId === id) {
      setEditingTemplateId(null);
      setForm(createBlankTemplate(getNextTemplateId(templates)));
    }
    deleteTemplate(id);
    setNotice(`Template "${name}" (${id}) removed. Its assigned areas are now freed up.`);
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

    // Strict validation: an area can only belong to one template
    const conflictingAreas = (form.authorizedSections ?? []).filter((areaName) =>
      templates.some(
        (t) => t.id !== form.id && (t.authorizedSections ?? []).includes(areaName),
      ),
    );

    if (conflictingAreas.length > 0) {
      const conflictDetails = conflictingAreas
        .map((areaName) => {
          const usedBy = templates.find(
            (t) => t.id !== form.id && (t.authorizedSections ?? []).includes(areaName),
          );
          return `"${areaName}" (assigned to ${usedBy?.name || usedBy?.id})`;
        })
        .join("; ");

      setNotice(
        `Cannot save template: The following area(s) are already used in another template: ${conflictDetails}. An area cannot be used across multiple templates.`,
      );
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
              notice.includes("successfully") || notice.includes("removed")
                ? "bg-emerald-50 border border-emerald-300 text-emerald-800"
                : "bg-amber-50 border border-amber-300 text-amber-800"
            }`}
          >
            {notice}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Template Name" required>
            <input
              type="text"
              placeholder="e.g. Conditions & Supplier Evaluation Approval Template"
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

          {childTab === "areas" && (
            <AuthorizedAreasSelector
              selectedSections={form.authorizedSections ?? []}
              onToggleArea={handleToggleArea}
              onSelectAll={handleSelectAll}
              onClearAll={() =>
                setForm({
                  ...form,
                  authorizedSections: [],
                })
              }
              templates={templates}
              editingTemplateId={editingTemplateId}
            />
          )}

          {childTab === "stages" && (
            <TemplateStagesSelectionGrid
              stages={stages}
              selectedStageIds={form.stageIds}
              onAddStageRow={handleAddStageRow}
              onSelectStageAt={handleSelectStageAt}
              onRemoveStageRow={handleRemoveStageRow}
            />
          )}

          <div className="flex justify-end pt-4 border-t border-border mt-4">
            <Button size="sm" onClick={handleSave} className="text-xs gap-1.5">
              <Save size={13} />
              Save Approval Template
            </Button>
          </div>
        </div>
      </div>

      <AllApprovalTemplatesTable
        templates={templates}
        stages={stages}
        editingTemplateId={editingTemplateId}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
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
