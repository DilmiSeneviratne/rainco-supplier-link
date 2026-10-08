import { useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "./registration";
import {
  AccessNotice,
  PageHeading,
  useWorkspace,
  type CriteriaMasterRow,
  type CriteriaType,
  type SubCriteriaRow,
} from "./workspace";

function getNextCriteriaId(list: CriteriaMasterRow[]): string {
  const maxNum = list.reduce((max, c) => {
    const match = c.id.match(/\d+/);
    return Math.max(max, match ? parseInt(match[0], 10) : 0);
  }, 0);
  return `CRI-${maxNum + 1}`;
}

function getNextMainCriteriaCode(list: CriteriaMasterRow[]): string {
  const maxNum = list.reduce((max, c) => {
    const match = c.code.match(/\d+/);
    return Math.max(max, match ? parseInt(match[0], 10) : 0);
  }, 0);
  return `MCR-${String(maxNum + 1).padStart(3, "0")}`;
}

export const criteriaValueTypes = [
  "Quantity",
  "Price",
  "Range",
  "Yes/No",
  "Delivery",
  "Percentage",
  "Text",
];

function createBlankSubCriteria(index: number): SubCriteriaRow {
  return {
    id: `SUB-${Date.now()}-${index}`,
    code: `SUB-${String(index).padStart(3, "0")}`,
    indication: "",
    description: "",
    criteriaValue: "Quantity",
  };
}

function SubCriteriasEditorGrid({
  subCriterias,
  onAddRow,
  onChangeRow,
  onRemoveRow,
}: {
  subCriterias: SubCriteriaRow[];
  onAddRow: () => void;
  onChangeRow: <K extends keyof SubCriteriaRow>(
    id: string,
    field: K,
    value: SubCriteriaRow[K],
  ) => void;
  onRemoveRow: (id: string) => void;
}) {
  return (
    <div className="pt-4 border-t border-border space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-foreground">Sub Criterias</h3>
        <Button size="sm" variant="outline" onClick={onAddRow} className="text-xs h-7 gap-1">
          <Plus size={12} />
          Add Sub Criteria
        </Button>
      </div>

      <div className="overflow-x-auto rounded border border-border">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-36">Code</th>
              <th className="w-48">Indication</th>
              <th>Description</th>
              <th className="w-36">Criteria Value</th>
              <th className="w-16 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {subCriterias.map((row) => (
              <tr key={row.id}>
                <td>
                  <input
                    type="text"
                    placeholder="SUB-001"
                    value={row.code}
                    onChange={(e) => onChangeRow(row.id, "code", e.target.value)}
                    className="grid-input font-mono text-xs"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="e.g. Excellent"
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
                    value={row.criteriaValue}
                    onChange={(e) => onChangeRow(row.id, "criteriaValue", e.target.value)}
                    className="grid-input text-xs"
                  >
                    {criteriaValueTypes.map((typeOption) => (
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
                    title="Remove sub criteria row"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
            {subCriterias.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-xs text-muted-foreground py-4">
                  No sub criterias added. Click &quot;Add Sub Criteria&quot; to add a row.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CriteriasListCard({
  criterias,
  editingId,
  onEdit,
  onDelete,
}: {
  criterias: CriteriaMasterRow[];
  editingId: string | null;
  onEdit: (row: CriteriaMasterRow) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">All Criterias</h2>
        <span className="text-xs font-mono text-muted-foreground">
          Total Criterias: {criterias.length}
        </span>
      </div>

      <div className="overflow-x-auto rounded border border-border">
        <table className="data-table">
          <thead>
            <tr>
              <th>Main Criteria Code</th>
              <th>Criteria Type</th>
              <th>Main Criteria Name</th>
              <th>Sub Criterias</th>
              <th className="w-28 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {criterias.map((row) => (
              <tr key={row.id} className={editingId === row.id ? "bg-primary/5" : ""}>
                <td className="text-primary font-mono font-medium">{row.code}</td>
                <td>
                  <span className="badge text-[10px]">{row.criteriaType}</span>
                </td>
                <td className="font-medium text-foreground">{row.name}</td>
                <td className="text-xs text-muted-foreground">
                  {row.subCriterias
                    .map((s) => `${s.code}: ${s.indication} (${s.criteriaValue})`)
                    .join(", ")}
                </td>
                <td className="text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(row)}
                      className="h-6 text-[11px] px-2.5"
                    >
                      Edit
                    </Button>
                    <button
                      type="button"
                      onClick={() => onDelete(row.id)}
                      className="p-1 hover:text-destructive text-muted-foreground transition-colors"
                      title="Delete criteria"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {criterias.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-xs text-muted-foreground py-6">
                  No criterias configured.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CriteriasMaster() {
  const { role, criterias, saveCriteria, deleteCriteria } = useWorkspace();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [criteriaType, setCriteriaType] = useState<CriteriaType>("Category");
  const [mainCode, setMainCode] = useState<string>("");
  const [mainName, setMainName] = useState<string>("");
  const [subCriterias, setSubCriterias] = useState<SubCriteriaRow[]>(() => [
    createBlankSubCriteria(1),
  ]);
  const [notice, setNotice] = useState<{ text: string; isError?: boolean } | null>(null);

  if (role !== "rainco") return <AccessNotice audience="rainco" />;

  const displayedMainCode = editingId ? mainCode : getNextMainCriteriaCode(criterias);

  const handleAddSubCriteriaRow = () => {
    const nextIdx = subCriterias.length + 1;
    setSubCriterias((prev) => [...prev, createBlankSubCriteria(nextIdx)]);
  };

  const handleSubCriteriaChange = <K extends keyof SubCriteriaRow>(
    id: string,
    field: K,
    value: SubCriteriaRow[K],
  ) => {
    setSubCriterias((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const handleRemoveSubCriteriaRow = (id: string) => {
    setSubCriterias((prev) => prev.filter((row) => row.id !== id));
  };

  const handleEdit = (row: CriteriaMasterRow) => {
    setEditingId(row.id);
    setCriteriaType(row.criteriaType);
    setMainCode(row.code);
    setMainName(row.name);
    setSubCriterias(
      row.subCriterias.length > 0
        ? row.subCriterias.map((s) => ({ ...s }))
        : [createBlankSubCriteria(1)],
    );
    setNotice(null);
  };

  const handleSave = () => {
    const trimmedName = mainName.trim();
    if (!trimmedName) {
      setNotice({
        text: "Please enter the Main Criteria Name.",
        isError: true,
      });
      return;
    }

    if (subCriterias.length === 0) {
      setNotice({
        text: "Please add at least one sub criteria row to the grid.",
        isError: true,
      });
      return;
    }

    const hasIncompleteSub = subCriterias.some(
      (s) => !s.code.trim() || !s.indication.trim() || !s.description.trim(),
    );
    if (hasIncompleteSub) {
      setNotice({
        text: "Please complete Code, Indication, and Description for all sub criteria rows.",
        isError: true,
      });
      return;
    }

    const idToSave = editingId ?? getNextCriteriaId(criterias);
    const codeToSave = editingId ? mainCode : getNextMainCriteriaCode(criterias);

    saveCriteria({
      id: idToSave,
      criteriaType,
      code: codeToSave,
      name: trimmedName,
      subCriterias: subCriterias.map((s) => ({
        ...s,
        code: s.code.trim(),
        indication: s.indication.trim(),
        description: s.description.trim(),
        criteriaValue: s.criteriaValue || "Quantity",
      })),
    });

    setEditingId(null);
    setCriteriaType("Category");
    setMainCode("");
    setMainName("");
    setSubCriterias([createBlankSubCriteria(1)]);
    setNotice({
      text: `Criteria "${trimmedName}" (${codeToSave}) saved successfully.`,
    });
  };

  const handleDelete = (id: string) => {
    deleteCriteria(id);
    if (editingId === id) {
      setEditingId(null);
      setCriteriaType("Category");
      setMainCode("");
      setMainName("");
      setSubCriterias([createBlankSubCriteria(1)]);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeading eyebrow="MASTER DATA" title="Criterias" />

      <div className="rounded-lg border border-border bg-card p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">
            {editingId ? `Edit Criteria (${displayedMainCode})` : "Create Criteria"}
          </h2>
        </div>

        {notice && (
          <div className={`notice ${notice.isError ? "error" : "success"}`} role="status">
            {notice.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Field label="Criteria Type" required>
            <select
              value={criteriaType}
              onChange={(e) => setCriteriaType(e.target.value as CriteriaType)}
            >
              <option value="Category">Category</option>
              <option value="Performance">Performance</option>
            </select>
          </Field>

          <Field label="Main Criteria Code">
            <input
              type="text"
              value={displayedMainCode}
              readOnly
              className="bg-muted/50 font-mono text-primary font-medium"
            />
          </Field>

          <Field label="Main Criteria Name" required>
            <input
              type="text"
              placeholder="e.g. Product Quality, Delivery Performance"
              value={mainName}
              onChange={(e) => setMainName(e.target.value)}
            />
          </Field>
        </div>

        <SubCriteriasEditorGrid
          subCriterias={subCriterias}
          onAddRow={handleAddSubCriteriaRow}
          onChangeRow={handleSubCriteriaChange}
          onRemoveRow={handleRemoveSubCriteriaRow}
        />

        <div className="flex justify-end pt-2 border-t border-border">
          <Button size="sm" onClick={handleSave}>
            <Save />
            Save Criteria
          </Button>
        </div>
      </div>

      <CriteriasListCard
        criterias={criterias}
        editingId={editingId}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
