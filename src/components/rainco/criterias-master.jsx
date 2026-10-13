import { useState } from "react";
import { Plus, Save, Trash2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "./registration";
import { AccessNotice, PageHeading, useWorkspace } from "./workspace";

export const TUTORIAL_TYPES = ["Criteria", "Desirability", "Feasibility"];

export const criteriaTutorialValueTypes = ["Decimal", "Number", "Date", "Percentage"];

export const decisionTutorialValueTypes = [
  "Yes/No/Uncertain",
  ...criteriaTutorialValueTypes,
  "Text",
];

export const feasibilityTutorialValueTypes = [
  "Yes/No/Uncertain",
  "Decimal",
  "Number",
  "Percentage",
  "Date",
  "Text",
];

export const tutorialValueTypes = [...criteriaTutorialValueTypes, "Yes/No/Uncertain", "Text"];

export const criteriaValueTypes = tutorialValueTypes;

function getNextTutorialId(list) {
  const maxNum = list.reduce((max, c) => {
    const match = c.id.match(/\d+/);
    return Math.max(max, match ? parseInt(match[0], 10) : 0);
  }, 0);
  return `TUT-${maxNum + 1}`;
}

function getNextMainTutorialCode(list) {
  const maxNum = list.reduce((max, c) => {
    const match = c.code.match(/\d+/);
    return Math.max(max, match ? parseInt(match[0], 10) : 0);
  }, 0);
  return `TUT-${String(maxNum + 1).padStart(3, "0")}`;
}

function getNextSubTutorialCode(existingRows) {
  const maxNum = existingRows.reduce((max, r) => {
    const m = r.code?.match(/\d+/);
    return Math.max(max, m ? parseInt(m[0], 10) : 0);
  }, 0);
  return `SUB-${String(maxNum + 1).padStart(3, "0")}`;
}

function createBlankSubTutorial(index, currentType = "Criteria", existingRows = []) {
  const typeLower = currentType?.toLowerCase();
  const isDesirability = typeLower === "desirability";
  const isFeasibility = typeLower === "feasibility";
  const code =
    existingRows.length > 0
      ? getNextSubTutorialCode(existingRows)
      : `SUB-${String(index).padStart(3, "0")}`;
  return {
    id: `SUB-${Date.now()}-${index}`,
    code,
    indication: "",
    description: "",
    criteriaValue: isDesirability || isFeasibility ? "Yes/No/Uncertain" : "Decimal",
  };
}

function SubTutorialsEditorGrid({
  subTutorials,
  tutorialType,
  onAddRow,
  onChangeRow,
  onRemoveRow,
}) {
  const typeLower = (tutorialType || "").toLowerCase();
  let allowedValueTypes;
  if (typeLower === "criteria") {
    allowedValueTypes = criteriaTutorialValueTypes;
  } else if (typeLower === "feasibility") {
    allowedValueTypes = feasibilityTutorialValueTypes;
  } else {
    allowedValueTypes = decisionTutorialValueTypes;
  }

  return (
    <div className="pt-4 border-t border-border space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold text-foreground">Sub Tutorials</h3>
        </div>
        <Button size="sm" variant="outline" onClick={onAddRow} className="text-xs h-7 gap-1">
          <Plus size={12} />
          Add Sub Tutorial
        </Button>
      </div>

      <div className="overflow-x-auto rounded border border-border">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-36">
                <span className="inline-flex items-center gap-1">
                  Code
                  <Lock
                    size={10}
                    className="text-muted-foreground"
                    title="Non-editable auto code"
                  />
                </span>
              </th>
              <th className="w-48">Indication</th>
              <th>Description</th>
              <th className="w-44">Tutorial Value</th>
              <th className="w-16 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {subTutorials.map((row) => (
              <tr key={row.id}>
                <td>
                  <input
                    type="text"
                    value={row.code}
                    readOnly
                    tabIndex={-1}
                    title="Sub tutorial code is auto-generated and not editable"
                    className="grid-input font-mono text-xs bg-muted/40 cursor-not-allowed select-none text-muted-foreground font-semibold"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="e.g. Technical readiness / Inspection rate"
                    value={row.indication}
                    onChange={(e) => onChangeRow(row.id, "indication", e.target.value)}
                    className="grid-input text-xs"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Enter description"
                    value={row.description}
                    onChange={(e) => onChangeRow(row.id, "description", e.target.value)}
                    className="grid-input text-xs"
                  />
                </td>
                <td>
                  <select
                    value={
                      allowedValueTypes.includes(row.criteriaValue)
                        ? row.criteriaValue
                        : allowedValueTypes[0]
                    }
                    onChange={(e) => onChangeRow(row.id, "criteriaValue", e.target.value)}
                    className="grid-input text-xs font-medium"
                  >
                    {allowedValueTypes.map((typeOption) => (
                      <option key={typeOption} value={typeOption}>
                        {typeOption}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="text-center">
                  <button
                    type="button"
                    onClick={() => onRemoveRow(row.id)}
                    className="p-1 hover:text-destructive text-muted-foreground transition-colors"
                    title="Remove sub tutorial row"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
            {subTutorials.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-xs text-muted-foreground py-4">
                  No sub tutorials added. Click &quot;Add Sub Tutorial&quot; to add a row.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TutorialsListCard({ tutorials, editingId, onEdit }) {
  const getTypeBadgeClass = (type) => {
    const lower = (type || "").toLowerCase();
    if (lower === "criteria") return "bg-primary/10 text-primary border-primary/20";
    if (lower === "desirability")
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
    if (lower === "feasibility")
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    return "badge";
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">All Tutorials</h2>
        <span className="text-xs font-mono text-muted-foreground">
          Total Tutorials: {tutorials.length}
        </span>
      </div>

      <div className="overflow-x-auto rounded border border-border">
        <table className="data-table">
          <thead>
            <tr>
              <th>Main Tutorial Code</th>
              <th>Tutorial Type</th>
              <th>Main Tutorial Name</th>
              <th>Sub Tutorials</th>
              <th className="w-20 text-center">Active</th>
              <th className="w-20 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tutorials.map((row) => {
              const rawType = row.criteriaType || "Criteria";
              const displayType =
                rawType === "Category"
                  ? "Criteria"
                  : rawType === "Performance"
                    ? "Criteria"
                    : rawType;

              return (
                <tr key={row.id} className={editingId === row.id ? "bg-primary/5" : ""}>
                  <td className="text-primary font-mono font-medium">{row.code}</td>
                  <td>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${getTypeBadgeClass(displayType)}`}
                    >
                      {displayType}
                    </span>
                  </td>
                  <td className="font-medium text-foreground">{row.name}</td>
                  <td className="text-xs text-muted-foreground">
                    {(row.subCriterias || [])
                      .map((s) => `${s.code}: ${s.indication} (${s.criteriaValue})`)
                      .join(", ")}
                  </td>
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={row.isActive !== false}
                      readOnly
                      className="w-4 h-4 rounded text-primary accent-primary cursor-default"
                      title={row.isActive !== false ? "Active" : "Inactive"}
                    />
                  </td>
                  <td className="text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(row)}
                      className="h-6 text-[11px] px-2.5"
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              );
            })}
            {tutorials.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-xs text-muted-foreground py-6">
                  No tutorials configured.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TutorialsMaster() {
  const { role, criterias, tutorials = criterias, saveCriteria } = useWorkspace();
  const activeList = tutorials ?? criterias ?? [];
  const [editingId, setEditingId] = useState(null);
  const [criteriaType, setCriteriaType] = useState("Criteria");
  const [mainCode, setMainCode] = useState("");
  const [mainName, setMainName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [subTutorials, setSubTutorials] = useState(() => [createBlankSubTutorial(1, "Criteria")]);
  const [notice, setNotice] = useState(null);

  if (role !== "rainco") return <AccessNotice audience="rainco" />;

  const displayedMainCode = editingId ? mainCode : getNextMainTutorialCode(activeList);

  const handleTutorialTypeChange = (newType) => {
    setCriteriaType(newType);
    const isDecision = newType?.toLowerCase() === "desirability";
    const allowed = isDecision ? decisionTutorialValueTypes : criteriaTutorialValueTypes;

    // Auto-adapt existing sub tutorial rows to allowed tutorial values
    setSubTutorials((prev) =>
      prev.map((row) => ({
        ...row,
        criteriaValue: allowed.includes(row.criteriaValue) ? row.criteriaValue : allowed[0],
      })),
    );
  };

  const handleAddSubTutorialRow = () => {
    const nextIdx = subTutorials.length + 1;
    setSubTutorials((prev) => [...prev, createBlankSubTutorial(nextIdx, criteriaType, prev)]);
  };

  const handleSubTutorialChange = (id, field, value) => {
    // Prevent manual edits to code
    if (field === "code") return;
    setSubTutorials((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const handleRemoveSubTutorialRow = (id) => {
    setSubTutorials((prev) => prev.filter((row) => row.id !== id));
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setIsActive(row.isActive !== false);
    let normalizedType = row.criteriaType || "Criteria";
    if (normalizedType === "Category" || normalizedType === "Performance") {
      normalizedType = "Criteria";
    }
    setCriteriaType(normalizedType);
    setMainCode(row.code);
    setMainName(row.name);

    const isDecision = normalizedType?.toLowerCase() === "desirability";
    const allowed = isDecision ? decisionTutorialValueTypes : criteriaTutorialValueTypes;
    setSubTutorials(
      row.subCriterias && row.subCriterias.length > 0
        ? row.subCriterias.map((s, idx) => ({
            ...s,
            code: s.code || `SUB-${String(idx + 1).padStart(3, "0")}`,
            criteriaValue: allowed.includes(s.criteriaValue) ? s.criteriaValue : allowed[0],
          }))
        : [createBlankSubTutorial(1, normalizedType)],
    );
    setNotice(null);
  };

  const handleSave = () => {
    const trimmedName = mainName.trim();
    if (!trimmedName) {
      setNotice({
        text: "Please enter the Main Tutorial Name.",
        isError: true,
      });
      return;
    }
    if (subTutorials.length === 0) {
      setNotice({
        text: "Please add at least one sub tutorial row to the grid.",
        isError: true,
      });
      return;
    }
    const hasIncompleteSub = subTutorials.some(
      (s) => !s.code?.trim() || !s.indication?.trim() || !s.description?.trim(),
    );
    if (hasIncompleteSub) {
      setNotice({
        text: "Please complete Indication and Description for all sub tutorial rows.",
        isError: true,
      });
      return;
    }

    const idToSave = editingId ?? getNextTutorialId(activeList);
    const codeToSave = editingId ? mainCode : getNextMainTutorialCode(activeList);

    const isDecision = criteriaType?.toLowerCase() === "desirability";
    const allowed = isDecision ? decisionTutorialValueTypes : criteriaTutorialValueTypes;

    saveCriteria({
      id: idToSave,
      criteriaType,
      code: codeToSave,
      name: trimmedName,
      isActive,
      subCriterias: subTutorials.map((s) => ({
        ...s,
        code: s.code.trim(),
        indication: s.indication.trim(),
        description: s.description.trim(),
        criteriaValue: allowed.includes(s.criteriaValue) ? s.criteriaValue : allowed[0],
      })),
    });

    setEditingId(null);
    setCriteriaType("Criteria");
    setMainCode("");
    setMainName("");
    setIsActive(true);
    setSubTutorials([createBlankSubTutorial(1, "Criteria")]);
    setNotice({
      text: `Tutorial "${trimmedName}" (${codeToSave}) saved successfully with type "${criteriaType}".`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeading eyebrow="MASTER DATA" title="Tutorials" />

      <div className="rounded-lg border border-border bg-card p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">
            {editingId ? `Edit Tutorial (${displayedMainCode})` : "Create Tutorial"}
          </h2>
        </div>

        {notice && (
          <div className={`notice ${notice.isError ? "error" : "success"}`} role="status">
            {notice.text}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-end">
          <div className="w-full md:w-36 flex-shrink-0">
            <Field label="Tutorial Type" required>
              <select
                value={criteriaType}
                onChange={(e) => handleTutorialTypeChange(e.target.value)}
              >
                <option value="Criteria">Criteria</option>
                <option value="Desirability">Desirability</option>
                <option value="Feasibility">Feasibility</option>
              </select>
            </Field>
          </div>

          <div className="w-full md:w-24 flex-shrink-0">
            <Field label="Tutorial Code">
              <input
                type="text"
                value={displayedMainCode}
                readOnly
                className="bg-muted/50 font-mono text-primary font-medium cursor-not-allowed select-none text-center text-xs h-9"
              />
            </Field>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Field label="Main Tutorial Name" required>
              <input
                type="text"
                placeholder={
                  criteriaType === "Desirability"
                    ? "e.g. Supplier Strategic Fit & Innovation"
                    : criteriaType === "Feasibility"
                      ? "e.g. Technical & Production Feasibility"
                      : "e.g. Product Quality, Delivery Performance"
                }
                value={mainName}
                onChange={(e) => setMainName(e.target.value)}
              />
            </Field>
          </div>

          <div className="flex items-center pb-2.5 flex-shrink-0">
            <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer accent-primary"
              />
              <span className="font-medium">Active</span>
            </label>
          </div>
        </div>

        <SubTutorialsEditorGrid
          subTutorials={subTutorials}
          tutorialType={criteriaType}
          onAddRow={handleAddSubTutorialRow}
          onChangeRow={handleSubTutorialChange}
          onRemoveRow={handleRemoveSubTutorialRow}
        />

        <div className="flex justify-end pt-2 border-t border-border">
          <Button size="sm" onClick={handleSave}>
            <Save size={14} />
            Save Tutorial
          </Button>
        </div>
      </div>

      <TutorialsListCard tutorials={activeList} editingId={editingId} onEdit={handleEdit} />
    </div>
  );
}

export { TutorialsMaster as CriteriasMaster };
