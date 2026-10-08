import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccessNotice, PageHeading, useWorkspace, } from "./workspace";
import { Field } from "./registration";
const authorizedAreasList = [
    { id: "AREA-REG", name: "Supplier Registration" },
    { id: "AREA-RAT", name: "Ratings" },
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
function AuthorizedAreasSelector({ selectedSections, onToggleArea, onSelectAll, onClearAll, }) {
    return (<div className="space-y-3">
      <div className="flex items-center justify-end text-xs text-muted-foreground pb-2">
        <div className="flex gap-2">
          <button type="button" onClick={onSelectAll} className="text-primary hover:underline text-[11px]">
            Select all
          </button>
          <span>·</span>
          <button type="button" onClick={onClearAll} className="text-muted-foreground hover:underline text-[11px]">
            Clear all
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 py-1">
        {authorizedAreasList.map((area) => {
            const isChecked = selectedSections.includes(area.name);
            return (<label key={area.id} className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer select-none py-1">
              <input type="checkbox" checked={isChecked} onChange={() => onToggleArea(area.name)} className="w-4 h-4 rounded text-primary focus:ring-primary shrink-0"/>
              <span className="font-medium">{area.name}</span>
            </label>);
        })}
      </div>
    </div>);
}
function TemplateStagesSelectionGrid({ stages, selectedStageIds, onToggleStage, }) {
    return (<div className="space-y-3">
      <div className="flex items-center justify-end text-xs text-muted-foreground pb-2">
        <span className="text-[11px]">
          {selectedStageIds.length} of {stages.length} stages included
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
            const isIncluded = selectedStageIds.includes(stg.id);
            const orderIndex = selectedStageIds.indexOf(stg.id);
            return (<tr key={stg.id} className={isIncluded ? "bg-primary/[0.03]" : "opacity-60"}>
                  <td className="text-center">
                    <input type="checkbox" checked={isIncluded} onChange={() => onToggleStage(stg.id)} className="w-4 h-4 rounded text-primary focus:ring-primary"/>
                  </td>
                  <td className="text-center font-mono text-xs">
                    {isIncluded ? (<span className="inline-block w-5 h-5 rounded-full bg-primary/10 text-primary font-bold leading-5">
                        {orderIndex + 1}
                      </span>) : ("—")}
                  </td>
                  <td className="font-mono text-[10px] text-primary">{stg.id}</td>
                  <td className="font-medium text-foreground">{stg.name}</td>
                  <td className="text-xs text-muted-foreground max-w-xs truncate">
                    {stg.description}
                  </td>
                  <td className="font-mono tabular-nums text-xs">{stg.approvalsRequired}</td>
                  <td>
                    <div className="text-[11px] text-muted-foreground">
                      {stg.authorizers.map((a) => a.name).join(", ") || "None"}
                    </div>
                  </td>
                </tr>);
        })}
            {stages.length === 0 && (<tr>
                <td colSpan={7} className="text-center text-xs text-muted-foreground py-6">
                  No stages available. Please configure stages in Approval Stages first.
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>);
}
function AllApprovalTemplatesTable({ templates, stages, editingTemplateId, onEdit, }) {
    return (<div className="rounded-lg border border-border bg-card p-6 space-y-4">
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
            return (<tr key={tmpl.id} className={editingTemplateId === tmpl.id ? "bg-primary/5" : ""}>
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
                    <span className={`badge text-[9px] ${tmpl.isActive
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-muted text-muted-foreground"}`}>
                      {tmpl.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="text-center">
                    <Button size="sm" variant="outline" onClick={() => onEdit(tmpl)} className="h-6 text-[11px] px-2.5">
                      Edit
                    </Button>
                  </td>
                </tr>);
        })}
            {templates.length === 0 && (<tr>
                <td colSpan={6} className="text-center text-xs text-muted-foreground py-6">
                  No templates configured yet.
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>);
}
export function ApprovalTemplateTab() {
    const { templates, stages, saveTemplate } = useWorkspace();
    const [editingTemplateId, setEditingTemplateId] = useState(null);
    const [childTab, setChildTab] = useState("areas");
    const [form, setForm] = useState(() => createBlankTemplate(getNextTemplateId(templates)));
    const [notice, setNotice] = useState("");
    const handleEdit = (tmpl) => {
        setEditingTemplateId(tmpl.id);
        setForm({
            ...tmpl,
            authorizedSections: tmpl.authorizedSections && tmpl.authorizedSections.length > 0
                ? tmpl.authorizedSections
                : ["Supplier Registration", "Supplier Evaluation"],
        });
        setNotice(`Loaded template "${tmpl.name}" for editing.`);
    };
    const handleToggleArea = (areaName) => {
        const current = form.authorizedSections ?? [];
        const exists = current.includes(areaName);
        setForm({
            ...form,
            authorizedSections: exists ? current.filter((a) => a !== areaName) : [...current, areaName],
        });
    };
    const handleToggleStage = (stageId) => {
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
            setNotice("Please select at least one authorized area to approve in the Authorized Areas tab.");
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
    return (<div className="space-y-6">
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

        {notice && (<div className={`p-3 rounded text-xs ${notice.includes("successfully")
                ? "bg-emerald-50 border border-emerald-300 text-emerald-800"
                : "bg-amber-50 border border-amber-300 text-amber-800"}`}>
            {notice}
          </div>)}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Template Name" required>
            <input type="text" placeholder="e.g. Standard Supplier Onboarding Template" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full"/>
          </Field>

          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer select-none">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 rounded text-primary focus:ring-primary"/>
              <span className="font-medium">Active Status (Default Template)</span>
            </label>
          </div>

          <div className="md:col-span-2">
            <Field label="Template Description" required>
              <textarea placeholder="Describe the workflow purpose and criteria..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full h-16 resize-none"/>
            </Field>
          </div>
        </div>

        <div className="pt-2">
          <div className="child-tabs mb-4">
            <button type="button" className="tab-button" data-active={childTab === "areas"} onClick={() => setChildTab("areas")}>
              <span>Authorized Areas to Approve</span>
              <span className="tab-count ml-1.5">{form.authorizedSections?.length ?? 0}</span>
            </button>
            <button type="button" className="tab-button" data-active={childTab === "stages"} onClick={() => setChildTab("stages")}>
              <span>Stages</span>
              <span className="tab-count ml-1.5">{form.stageIds.length}</span>
            </button>
          </div>

          {childTab === "areas" && (<AuthorizedAreasSelector selectedSections={form.authorizedSections ?? []} onToggleArea={handleToggleArea} onSelectAll={() => setForm({
                ...form,
                authorizedSections: authorizedAreasList.map((a) => a.name),
            })} onClearAll={() => setForm({
                ...form,
                authorizedSections: [],
            })}/>)}

          {childTab === "stages" && (<TemplateStagesSelectionGrid stages={stages} selectedStageIds={form.stageIds} onToggleStage={handleToggleStage}/>)}

          <div className="flex justify-end pt-4 border-t border-border mt-4">
            <Button size="sm" onClick={handleSave} className="text-xs gap-1.5">
              <Save size={13}/>
              Save Approval Template
            </Button>
          </div>
        </div>
      </div>

      <AllApprovalTemplatesTable templates={templates} stages={stages} editingTemplateId={editingTemplateId} onEdit={handleEdit}/>
    </div>);
}
export function ApprovalTemplatePage() {
    const { role } = useWorkspace();
    if (role !== "rainco")
        return <AccessNotice audience="rainco"/>;
    return (<>
      <PageHeading eyebrow="RAINCO PROCUREMENT" title="Approval Template"/>
      <ApprovalTemplateTab />
    </>);
}
