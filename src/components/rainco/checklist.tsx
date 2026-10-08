import { useState } from "react";
import { z } from "zod";
import { Check, ChevronDown, ChevronRight, Plus, Save, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "./registration";
import {
  AccessNotice,
  PageHeading,
  businessTypes,
  useWorkspace,
  type BusinessType,
  type CriteriaMasterRow,
  type CriteriaType,
  type DepartmentRow,
  type RatingConditionRow,
  type RatingMasterRow,
  type SubCriteriaRow,
  type SupplierTypeRow,
} from "./workspace";
export function Checklist() {
  const { role, documents, setDocuments } = useWorkspace();
  const [type, setType] = useState<BusinessType>("Corporate");
  const [adding, setAdding] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  function add() {
    const result = z
      .object({
        code: z
          .string()
          .trim()
          .regex(/^[A-Za-z0-9_-]{1,30}$/),
        name: z.string().trim().min(1).max(150),
      })
      .safeParse({ code, name });
    if (!result.success) {
      setMessage("Enter a document code using letters, numbers or hyphens, and a document name.");
      return;
    }
    if (
      Object.values(documents)
        .flat()
        .some((d) => d.code === code.trim())
    ) {
      setMessage("Document code must be unique.");
      return;
    }
    setDocuments({ ...documents, [type]: [...documents[type], result.data] });
    setAdding(false);
    setMessage("");
  }
  if (role !== "rainco") return <AccessNotice audience="rainco" />;
  return (
    <>
      <PageHeading eyebrow="MASTER DATA" title="Supplier Checklist" />
      <div className="master-controls">
        <Field label="Type of Business">
          <select value={type} onChange={(e) => setType(e.target.value as BusinessType)}>
            {businessTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Button
          size="sm"
          onClick={() => {
            setAdding(true);
            setCode("");
            setName("");
            setMessage("");
          }}
        >
          <Plus />
          Add document
        </Button>
      </div>
      <div className="master-table">
        <div className="section-heading">
          <h2>{type} documents</h2>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Document Code</th>
              <th>Document Name</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {documents[type].map((d, i) => (
              <tr key={d.code}>
                <td className="row-number">{String(i + 1).padStart(2, "0")}</td>
                <td className="text-primary">{d.code}</td>
                <td>{d.name}</td>
                <td className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${d.name}`}
                    onClick={() =>
                      setDocuments({
                        ...documents,
                        [type]: documents[type].filter((r) => r.code !== d.code),
                      })
                    }
                  >
                    <Trash2 />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!documents[type].length && (
          <p className="p-6 text-sm text-muted-foreground">No required documents added.</p>
        )}
      </div>
      <div className="action-footer">
        <small>Registration attachments follow this checklist.</small>
        <Button
          size="sm"
          onClick={() =>
            setMessage(
              "Checklist saved for this preview session. Supplier attachments now reflect these documents.",
            )
          }
        >
          <Save />
          Save checklist
        </Button>
      </div>
      {message && !adding && (
        <div className="notice" role="status">
          {message}
        </div>
      )}
      {adding && (
        <div className="modal-backdrop">
          <div className="modal" role="dialog" aria-modal="true" aria-label="Add required document">
            <div className="flex justify-between">
              <h2>Add required document</h2>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close"
                onClick={() => setAdding(false)}
              >
                <X />
              </Button>
            </div>
            <Field label="Document Code" required>
              <input
                value={code}
                maxLength={30}
                placeholder="COR-005"
                onChange={(e) => setCode(e.target.value)}
              />
            </Field>
            <Field label="Document Name" required>
              <input
                value={name}
                maxLength={150}
                placeholder="Document name"
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            {message && <div className="notice error">{message}</div>}
            <div className="modal-actions">
              <Button variant="outline" onClick={() => setAdding(false)}>
                Cancel
              </Button>
              <Button onClick={add}>
                <Check />
                Add document
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function getNextSupplierTypeId(list: SupplierTypeRow[]): string {
  const maxNum = list.reduce((max, t) => {
    const match = t.id.match(/\d+/);
    return Math.max(max, match ? parseInt(match[0], 10) : 0);
  }, 0);
  return `ST-${maxNum + 1}`;
}

export function SupplierTypes() {
  const { role, supplierTypes, saveSupplierType, deleteSupplierType } = useWorkspace();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [notice, setNotice] = useState<{ text: string; isError?: boolean } | null>(null);

  if (role !== "rainco") return <AccessNotice audience="rainco" />;

  const handleEdit = (row: SupplierTypeRow) => {
    setEditingId(row.id);
    setCode(row.code);
    setName(row.name);
    setIsActive(row.isActive);
    setNotice(null);
  };

  const handleSave = () => {
    const trimmedCode = code.trim().toUpperCase();
    const trimmedName = name.trim();

    if (!trimmedCode || !trimmedName) {
      setNotice({
        text: "Please enter both Supplier Type Code and Supplier Type Name.",
        isError: true,
      });
      return;
    }

    const duplicate = supplierTypes.some(
      (t) =>
        t.id !== editingId &&
        (t.code.toLowerCase() === trimmedCode.toLowerCase() ||
          t.name.toLowerCase() === trimmedName.toLowerCase()),
    );

    if (duplicate) {
      setNotice({
        text: "A supplier type with this code or name already exists.",
        isError: true,
      });
      return;
    }

    const idToSave = editingId ?? getNextSupplierTypeId(supplierTypes);
    saveSupplierType({
      id: idToSave,
      code: trimmedCode,
      name: trimmedName,
      isActive,
    });

    setEditingId(null);
    setCode("");
    setName("");
    setIsActive(true);
    setNotice({
      text: `Supplier type "${trimmedName}" saved successfully.`,
    });
  };

  const handleDelete = (id: string) => {
    deleteSupplierType(id);
    if (editingId === id) {
      setEditingId(null);
      setCode("");
      setName("");
      setIsActive(true);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeading eyebrow="MASTER DATA" title="Supplier Types" />

      <div className="rounded-lg border border-border bg-card p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">
            {editingId ? `Edit Supplier Type (${editingId})` : "Create Supplier Type"}
          </h2>
        </div>

        {notice && (
          <div className={`notice ${notice.isError ? "error" : "success"}`} role="status">
            {notice.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Field label="Supplier Type Code" required>
            <input
              type="text"
              placeholder="e.g. FOREIGN, LOCAL"
              value={code}
              maxLength={30}
              onChange={(e) => setCode(e.target.value)}
            />
          </Field>

          <Field label="Supplier Type Name" required>
            <input
              type="text"
              placeholder="e.g. Foreign, Local"
              value={name}
              maxLength={100}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>

          <div className="flex items-center pb-2.5">
            <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
              <span className="font-medium">Active Status</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-border">
          <Button size="sm" onClick={handleSave}>
            <Save />
            Save Supplier Type
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">All Supplier Types</h2>
          <span className="text-xs font-mono text-muted-foreground">
            Total Types: {supplierTypes.length}
          </span>
        </div>

        <div className="overflow-x-auto rounded border border-border">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-16">#</th>
                <th>Code</th>
                <th>Supplier Type</th>
                <th className="w-24 text-center">Status</th>
                <th className="w-28 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {supplierTypes.map((row, idx) => (
                <tr key={row.id} className={editingId === row.id ? "bg-primary/5" : ""}>
                  <td className="row-number">{String(idx + 1).padStart(2, "0")}</td>
                  <td className="text-primary font-mono font-medium">{row.code}</td>
                  <td className="font-medium text-foreground">{row.name}</td>
                  <td className="text-center">
                    <span
                      className={`badge text-[9px] ${
                        row.isActive
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {row.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(row)}
                        className="h-6 text-[11px] px-2.5"
                      >
                        Edit
                      </Button>
                      <button
                        type="button"
                        onClick={() => handleDelete(row.id)}
                        className="p-1 hover:text-destructive text-muted-foreground transition-colors"
                        title="Delete supplier type"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {supplierTypes.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-xs text-muted-foreground py-6">
                    No supplier types configured.
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

function getNextDepartmentId(list: DepartmentRow[]): string {
  const maxNum = list.reduce((max, d) => {
    const match = d.id.match(/\d+/);
    return Math.max(max, match ? parseInt(match[0], 10) : 0);
  }, 0);
  return `DEP-${maxNum + 1}`;
}

export function UserDepartments() {
  const { role, departments, saveDepartment, deleteDepartment } = useWorkspace();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [notice, setNotice] = useState<{ text: string; isError?: boolean } | null>(null);

  if (role !== "rainco") return <AccessNotice audience="rainco" />;

  const handleEdit = (row: DepartmentRow) => {
    setEditingId(row.id);
    setCode(row.code);
    setName(row.name);
    setIsActive(row.isActive);
    setNotice(null);
  };

  const handleSave = () => {
    const trimmedCode = code.trim().toUpperCase();
    const trimmedName = name.trim();

    if (!trimmedCode || !trimmedName) {
      setNotice({
        text: "Please enter both Department Code and Department Name.",
        isError: true,
      });
      return;
    }

    const duplicate = departments.some(
      (d) =>
        d.id !== editingId &&
        (d.code.toLowerCase() === trimmedCode.toLowerCase() ||
          d.name.toLowerCase() === trimmedName.toLowerCase()),
    );

    if (duplicate) {
      setNotice({
        text: "A department with this code or name already exists.",
        isError: true,
      });
      return;
    }

    const idToSave = editingId ?? getNextDepartmentId(departments);
    saveDepartment({
      id: idToSave,
      code: trimmedCode,
      name: trimmedName,
      isActive,
    });

    setEditingId(null);
    setCode("");
    setName("");
    setIsActive(true);
    setNotice({
      text: `Department "${trimmedName}" saved successfully.`,
    });
  };

  const handleDelete = (id: string) => {
    deleteDepartment(id);
    if (editingId === id) {
      setEditingId(null);
      setCode("");
      setName("");
      setIsActive(true);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeading eyebrow="MASTER DATA" title="Departments" />

      <div className="rounded-lg border border-border bg-card p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">
            {editingId ? `Edit Department (${editingId})` : "Create Department"}
          </h2>
        </div>

        {notice && (
          <div className={`notice ${notice.isError ? "error" : "success"}`} role="status">
            {notice.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Field label="Department Code" required>
            <input
              type="text"
              placeholder="e.g. PROC, FIN, QA"
              value={code}
              maxLength={30}
              onChange={(e) => setCode(e.target.value)}
            />
          </Field>

          <Field label="Department Name" required>
            <input
              type="text"
              placeholder="e.g. Procurement, Finance & Accounts"
              value={name}
              maxLength={100}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>

          <div className="flex items-center pb-2.5">
            <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
              <span className="font-medium">Active Status</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-border">
          <Button size="sm" onClick={handleSave}>
            <Save />
            Save Department
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">All Departments</h2>
          <span className="text-xs font-mono text-muted-foreground">
            Total Departments: {departments.length}
          </span>
        </div>

        <div className="overflow-x-auto rounded border border-border">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-16">#</th>
                <th>Code</th>
                <th>Department Name</th>
                <th className="w-24 text-center">Status</th>
                <th className="w-28 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((row, idx) => (
                <tr key={row.id} className={editingId === row.id ? "bg-primary/5" : ""}>
                  <td className="row-number">{String(idx + 1).padStart(2, "0")}</td>
                  <td className="text-primary font-mono font-medium">{row.code}</td>
                  <td className="font-medium text-foreground">{row.name}</td>
                  <td className="text-center">
                    <span
                      className={`badge text-[9px] ${
                        row.isActive
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {row.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(row)}
                        className="h-6 text-[11px] px-2.5"
                      >
                        Edit
                      </Button>
                      <button
                        type="button"
                        onClick={() => handleDelete(row.id)}
                        className="p-1 hover:text-destructive text-muted-foreground transition-colors"
                        title="Delete department"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {departments.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-xs text-muted-foreground py-6">
                    No departments configured.
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

const criteriaValueTypes = [
  "Quantity",
  "Price",
  "Range",
  "Yes/No",
  "Delivery",
  "Percentage",
  "Text",
];

const deliveryConditionOptions = [
  "+10 days (Early)",
  "+5 days (Early)",
  "+3 days (Early)",
  "+1 day (Early)",
  "0 (Same date)",
  "-1 day (Late)",
  "-3 days (Late)",
  "-5 days (Late)",
  "-10 days (Late)",
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

        {/* Sub Criterias Grid */}
        <div className="pt-4 border-t border-border space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-foreground">Sub Criterias</h3>
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddSubCriteriaRow}
              className="text-xs h-7 gap-1"
            >
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
                        onChange={(e) => handleSubCriteriaChange(row.id, "code", e.target.value)}
                        className="grid-input font-mono text-xs"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="e.g. Excellent"
                        value={row.indication}
                        onChange={(e) =>
                          handleSubCriteriaChange(row.id, "indication", e.target.value)
                        }
                        className="grid-input text-xs"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="Enter description"
                        value={row.description}
                        onChange={(e) =>
                          handleSubCriteriaChange(row.id, "description", e.target.value)
                        }
                        className="grid-input text-xs"
                      />
                    </td>
                    <td>
                      <select
                        value={row.criteriaValue}
                        onChange={(e) =>
                          handleSubCriteriaChange(row.id, "criteriaValue", e.target.value)
                        }
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
                        onClick={() => handleRemoveSubCriteriaRow(row.id)}
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

        <div className="flex justify-end pt-2 border-t border-border">
          <Button size="sm" onClick={handleSave}>
            <Save />
            Save Criteria
          </Button>
        </div>
      </div>

      {/* All Criterias Table */}
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
                        onClick={() => handleEdit(row)}
                        className="h-6 text-[11px] px-2.5"
                      >
                        Edit
                      </Button>
                      <button
                        type="button"
                        onClick={() => handleDelete(row.id)}
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
    </div>
  );
}

function getNextRatingMasterId(list: RatingMasterRow[]): string {
  const maxNum = list.reduce((max, r) => {
    const match = r.id.match(/\d+/);
    return Math.max(max, match ? parseInt(match[0], 10) : 0);
  }, 0);
  return `RAT-${maxNum + 1}`;
}

function getNextRateCode(list: RatingMasterRow[]): string {
  const maxNum = list.reduce((max, r) => {
    const match = r.code.match(/\d+/);
    return Math.max(max, match ? parseInt(match[0], 10) : 0);
  }, 0);
  return `RAT-${String(maxNum + 1).padStart(3, "0")}`;
}

function getDefaultConditionForType(criteriaValue: string): string {
  if (criteriaValue === "Yes/No") return "Yes";
  if (criteriaValue === "Delivery") return "0 (Same date)";
  return "";
}

function createInitialSubCriteriaRatings(
  criterias: CriteriaMasterRow[],
): Record<string, RatingConditionRow[]> {
  const map: Record<string, RatingConditionRow[]> = {};
  criterias.forEach((main) => {
    main.subCriterias.forEach((sub, idx) => {
      map[sub.id] = [
        {
          id: `RC-${Date.now()}-${sub.id}-${idx}`,
          condition: getDefaultConditionForType(sub.criteriaValue),
          marks: 0,
        },
      ];
    });
  });
  return map;
}

function createInitialSubCriteriaWeights(criterias: CriteriaMasterRow[]): Record<string, number> {
  const map: Record<string, number> = {};
  criterias.forEach((main) => {
    main.subCriterias.forEach((sub) => {
      map[sub.id] = 0;
    });
  });
  return map;
}

export function RatingsMaster() {
  const { role, supplierTypes, criterias, ratingMasters, saveRatingMaster, deleteRatingMaster } =
    useWorkspace();
  const activeSupplierTypes = supplierTypes.filter((t) => t.isActive);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [supplierType, setSupplierType] = useState<string>(activeSupplierTypes[0]?.name ?? "Local");
  const [rateCode, setRateCode] = useState<string>("");
  const [rateName, setRateName] = useState<string>("");
  const [selectedCriteriaIds, setSelectedCriteriaIds] = useState<string[]>([]);
  const [subCriteriaWeights, setSubCriteriaWeights] = useState<Record<string, number>>(() =>
    createInitialSubCriteriaWeights(criterias),
  );
  const [subCriteriaRatings, setSubCriteriaRatings] = useState<
    Record<string, RatingConditionRow[]>
  >(() => createInitialSubCriteriaRatings(criterias));
  const [expandedMainIds, setExpandedMainIds] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    criterias.forEach((c) => {
      initial[c.id] = true;
    });
    return initial;
  });
  const [expandedSubIds, setExpandedSubIds] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    criterias.forEach((c) => {
      c.subCriterias.forEach((s) => {
        initial[s.id] = true;
      });
    });
    return initial;
  });
  const [notice, setNotice] = useState<{ text: string; isError?: boolean } | null>(null);

  if (role !== "rainco") return <AccessNotice audience="rainco" />;

  const displayedRateCode = editingId ? rateCode : getNextRateCode(ratingMasters);

  const toggleMainExpand = (mainId: string) => {
    setExpandedMainIds((prev) => ({
      ...prev,
      [mainId]: !(prev[mainId] ?? true),
    }));
  };

  const toggleSubExpand = (subId: string) => {
    setExpandedSubIds((prev) => ({
      ...prev,
      [subId]: !(prev[subId] ?? true),
    }));
  };

  const handleAddConditionRow = (subId: string, criteriaValue: string) => {
    const currentRows = subCriteriaRatings[subId] ?? [];
    const newRow: RatingConditionRow = {
      id: `RC-${Date.now()}-${currentRows.length + 1}`,
      condition: getDefaultConditionForType(criteriaValue),
      marks: 0,
    };
    setSubCriteriaRatings((prev) => ({
      ...prev,
      [subId]: [...currentRows, newRow],
    }));
  };

  const handleConditionChange = <K extends keyof RatingConditionRow>(
    subId: string,
    rowId: string,
    field: K,
    value: RatingConditionRow[K],
  ) => {
    const currentRows = subCriteriaRatings[subId] ?? [];
    setSubCriteriaRatings((prev) => ({
      ...prev,
      [subId]: currentRows.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)),
    }));
  };

  const handleRemoveConditionRow = (subId: string, rowId: string) => {
    const currentRows = subCriteriaRatings[subId] ?? [];
    setSubCriteriaRatings((prev) => ({
      ...prev,
      [subId]: currentRows.filter((row) => row.id !== rowId),
    }));
  };

  const toggleCriteriaSelection = (criteriaId: string) => {
    setSelectedCriteriaIds((prev) =>
      prev.includes(criteriaId) ? prev.filter((id) => id !== criteriaId) : [...prev, criteriaId],
    );
  };

  const handleWeightChange = (subId: string, weight: number) => {
    setSubCriteriaWeights((prev) => ({
      ...prev,
      [subId]: Math.max(0, weight),
    }));
  };

  const handleEdit = (row: RatingMasterRow) => {
    setEditingId(row.id);
    setSupplierType(row.supplierType);
    setRateCode(row.code);
    setRateName(row.name);
    setSelectedCriteriaIds(
      row.selectedCriteriaIds ? [...row.selectedCriteriaIds] : criterias.map((c) => c.id),
    );
    setSubCriteriaWeights({ ...(row.subCriteriaWeights ?? {}) });
    const clonedMap: Record<string, RatingConditionRow[]> = {};
    Object.entries(row.subCriteriaRatings).forEach(([subId, list]) => {
      clonedMap[subId] = list.map((item) => ({ ...item }));
    });
    setSubCriteriaRatings(clonedMap);
    setNotice(null);
  };

  const handleSave = () => {
    const trimmedName = rateName.trim();
    if (!trimmedName) {
      setNotice({
        text: "Please enter the Rate Name.",
        isError: true,
      });
      return;
    }

    if (selectedCriteriaIds.length === 0) {
      setNotice({
        text: "Please select at least one Main Criteria for this rating.",
        isError: true,
      });
      return;
    }

    const activeCriterias = criterias.filter((c) => selectedCriteriaIds.includes(c.id));
    const allowedSubIds = new Set<string>();
    const cleanedWeights: Record<string, number> = {};
    activeCriterias.forEach((main) => {
      main.subCriterias.forEach((sub) => {
        allowedSubIds.add(sub.id);
        cleanedWeights[sub.id] = Number(subCriteriaWeights[sub.id]) || 0;
      });
    });

    const cleanedRatings: Record<string, RatingConditionRow[]> = {};
    Object.entries(subCriteriaRatings).forEach(([subId, rows]) => {
      if (!allowedSubIds.has(subId)) return;
      cleanedRatings[subId] = rows
        .filter((r) => r.condition.trim() !== "")
        .map((r) => ({
          ...r,
          condition: r.condition.trim(),
          marks: Number(r.marks) || 0,
        }));
    });

    const idToSave = editingId ?? getNextRatingMasterId(ratingMasters);
    const codeToSave = editingId ? rateCode : getNextRateCode(ratingMasters);

    saveRatingMaster({
      id: idToSave,
      supplierType,
      code: codeToSave,
      name: trimmedName,
      selectedCriteriaIds: [...selectedCriteriaIds],
      subCriteriaWeights: cleanedWeights,
      subCriteriaRatings: cleanedRatings,
    });

    setEditingId(null);
    setSupplierType(activeSupplierTypes[0]?.name ?? "Local");
    setRateCode("");
    setRateName("");
    setSelectedCriteriaIds([]);
    setSubCriteriaWeights(createInitialSubCriteriaWeights(criterias));
    setSubCriteriaRatings(createInitialSubCriteriaRatings(criterias));
    setNotice({
      text: `Rating "${trimmedName}" (${codeToSave}) saved and sent to the Approval Queue for verification.`,
    });
  };

  const handleDelete = (id: string) => {
    deleteRatingMaster(id);
    if (editingId === id) {
      setEditingId(null);
      setSupplierType(activeSupplierTypes[0]?.name ?? "Local");
      setRateCode("");
      setRateName("");
      setSelectedCriteriaIds([]);
      setSubCriteriaWeights(createInitialSubCriteriaWeights(criterias));
      setSubCriteriaRatings(createInitialSubCriteriaRatings(criterias));
    }
  };

  const selectedMainCriterias = criterias.filter((c) => selectedCriteriaIds.includes(c.id));

  const totalAssignedWeightage = selectedMainCriterias.reduce(
    (sum, main) =>
      sum +
      main.subCriterias.reduce(
        (subSum, sub) => subSum + (Number(subCriteriaWeights[sub.id]) || 0),
        0,
      ),
    0,
  );

  return (
    <div className="space-y-6">
      <PageHeading eyebrow="MASTER DATA" title="Ratings" />

      <div className="rounded-lg border border-border bg-card p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">
            {editingId ? `Edit Rating (${displayedRateCode})` : "Create Rating"}
          </h2>
        </div>

        {notice && (
          <div className={`notice ${notice.isError ? "error" : "success"}`} role="status">
            {notice.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Field label="Supplier Type" required>
            <select value={supplierType} onChange={(e) => setSupplierType(e.target.value)}>
              {(activeSupplierTypes.length > 0
                ? activeSupplierTypes.map((t) => t.name)
                : ["Local", "Foreign"]
              ).map((typeName) => (
                <option key={typeName} value={typeName}>
                  {typeName}
                </option>
              ))}
              {!activeSupplierTypes.some((t) => t.name === supplierType) &&
                supplierType !== "Local" &&
                supplierType !== "Foreign" &&
                supplierType && <option value={supplierType}>{supplierType}</option>}
            </select>
          </Field>

          <Field label="Rate Code">
            <input
              type="text"
              value={displayedRateCode}
              readOnly
              className="bg-muted/50 font-mono text-primary font-medium"
            />
          </Field>

          <Field label="Rate Name" required>
            <input
              type="text"
              placeholder="e.g. Standard Local Supplier Rating"
              value={rateName}
              onChange={(e) => setRateName(e.target.value)}
            />
          </Field>
        </div>

        {/* Main Criterias & Sub Criterias Tree */}
        <div className="pt-4 border-t border-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold text-foreground">
                Select Criterias &amp; Configure Sub Criterias Tree
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Check the Main Criterias to include in this rating.
              </p>
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              Total Assigned Weightage:{" "}
              <strong className="text-primary">{totalAssignedWeightage}%</strong>
            </span>
          </div>

          <div className="space-y-3">
            {criterias.map((mainCriteria) => {
              const isSelected = selectedCriteriaIds.includes(mainCriteria.id);
              const isMainOpen = expandedMainIds[mainCriteria.id] ?? true;
              return (
                <div
                  key={mainCriteria.id}
                  className={`rounded-lg border overflow-hidden transition-colors ${
                    isSelected
                      ? "border-primary/40 bg-muted/15"
                      : "border-border bg-muted/5 opacity-75"
                  }`}
                >
                  {/* Main Criteria Node */}
                  <div className="w-full flex items-center justify-between px-4 py-3 bg-muted/40">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleCriteriaSelection(mainCriteria.id)}
                        className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => toggleMainExpand(mainCriteria.id)}
                        className="flex items-center gap-2.5 text-left"
                      >
                        {isSelected ? (
                          isMainOpen ? (
                            <ChevronDown size={15} className="text-primary shrink-0" />
                          ) : (
                            <ChevronRight size={15} className="text-primary shrink-0" />
                          )
                        ) : (
                          <ChevronRight size={15} className="text-muted-foreground shrink-0" />
                        )}
                        <span className="font-mono text-xs text-primary font-semibold">
                          {mainCriteria.code}
                        </span>
                        <span className="text-xs font-semibold text-foreground">
                          {mainCriteria.name}
                        </span>
                        <span className="badge text-[9px]">{mainCriteria.criteriaType}</span>
                      </button>
                    </div>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {mainCriteria.subCriterias.length} Sub Criteria
                      {mainCriteria.subCriterias.length === 1 ? "" : "s"}
                    </span>
                  </div>

                  {/* Sub Criterias Child Nodes (only shown when Main Criteria is selected) */}
                  {isSelected && isMainOpen && (
                    <div className="p-4 pl-6 space-y-3 border-t border-border">
                      {mainCriteria.subCriterias.map((sub) => {
                        const isSubOpen = expandedSubIds[sub.id] ?? true;
                        const conditionRows = subCriteriaRatings[sub.id] ?? [];
                        const subWeight = subCriteriaWeights[sub.id] ?? 0;

                        return (
                          <div
                            key={sub.id}
                            className="rounded border border-border bg-card overflow-hidden"
                          >
                            {/* Sub Criteria Header */}
                            <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 bg-muted/20 border-b border-border">
                              <button
                                type="button"
                                onClick={() => toggleSubExpand(sub.id)}
                                className="flex items-center gap-2 text-left"
                              >
                                {isSubOpen ? (
                                  <ChevronDown size={14} className="text-muted-foreground" />
                                ) : (
                                  <ChevronRight size={14} className="text-muted-foreground" />
                                )}
                                <span className="font-mono text-xs text-primary font-medium">
                                  {sub.code}
                                </span>
                                <span className="text-xs font-medium text-foreground">
                                  {sub.indication}
                                </span>
                                <span className="badge text-[9px] ml-1">{sub.criteriaValue}</span>
                              </button>

                              <div className="flex items-center gap-3">
                                <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <span className="font-medium text-foreground">
                                    Weightage (%):
                                  </span>
                                  <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    placeholder="0"
                                    value={subWeight}
                                    onChange={(e) =>
                                      handleWeightChange(sub.id, Number(e.target.value) || 0)
                                    }
                                    className="grid-input font-mono tabular-nums text-xs w-20 h-7 px-2"
                                  />
                                </label>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAddConditionRow(sub.id, sub.criteriaValue)}
                                  className="h-6 text-[11px] px-2.5 gap-1"
                                >
                                  <Plus size={11} />
                                  Add Condition
                                </Button>
                              </div>
                            </div>

                            {/* Ratings Conditions & Marks Grid */}
                            {isSubOpen && (
                              <div className="p-3">
                                <div className="overflow-x-auto rounded border border-border">
                                  <table className="data-table">
                                    <thead>
                                      <tr>
                                        <th>Condition ({sub.criteriaValue})</th>
                                        <th className="w-36">Marks</th>
                                        <th className="w-16 text-center">Action</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {conditionRows.map((condRow) => (
                                        <tr key={condRow.id}>
                                          <td>
                                            {sub.criteriaValue === "Yes/No" ? (
                                              <select
                                                value={condRow.condition === "No" ? "No" : "Yes"}
                                                onChange={(e) =>
                                                  handleConditionChange(
                                                    sub.id,
                                                    condRow.id,
                                                    "condition",
                                                    e.target.value,
                                                  )
                                                }
                                                className="grid-input text-xs"
                                              >
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                              </select>
                                            ) : sub.criteriaValue === "Price" ? (
                                              <input
                                                type="number"
                                                step="0.01"
                                                placeholder="e.g. 125.50"
                                                value={condRow.condition}
                                                onChange={(e) =>
                                                  handleConditionChange(
                                                    sub.id,
                                                    condRow.id,
                                                    "condition",
                                                    e.target.value,
                                                  )
                                                }
                                                className="grid-input font-mono tabular-nums text-xs"
                                              />
                                            ) : sub.criteriaValue === "Quantity" ? (
                                              <input
                                                type="number"
                                                step="1"
                                                placeholder="e.g. 1000"
                                                value={condRow.condition}
                                                onChange={(e) => {
                                                  const intVal = e.target.value.replace(
                                                    /[^0-9-]/g,
                                                    "",
                                                  );
                                                  handleConditionChange(
                                                    sub.id,
                                                    condRow.id,
                                                    "condition",
                                                    intVal,
                                                  );
                                                }}
                                                className="grid-input font-mono tabular-nums text-xs"
                                              />
                                            ) : sub.criteriaValue === "Delivery" ? (
                                              <div className="flex items-center gap-2">
                                                <select
                                                  value={
                                                    deliveryConditionOptions.includes(
                                                      condRow.condition,
                                                    )
                                                      ? condRow.condition
                                                      : "__custom__"
                                                  }
                                                  onChange={(e) => {
                                                    if (e.target.value !== "__custom__") {
                                                      handleConditionChange(
                                                        sub.id,
                                                        condRow.id,
                                                        "condition",
                                                        e.target.value,
                                                      );
                                                    } else {
                                                      handleConditionChange(
                                                        sub.id,
                                                        condRow.id,
                                                        "condition",
                                                        "",
                                                      );
                                                    }
                                                  }}
                                                  className="grid-input text-xs w-48"
                                                >
                                                  {deliveryConditionOptions.map((opt) => (
                                                    <option key={opt} value={opt}>
                                                      {opt}
                                                    </option>
                                                  ))}
                                                  <option value="__custom__">
                                                    Custom offset (e.g. +7 days, -2 days)
                                                  </option>
                                                </select>
                                                {!deliveryConditionOptions.includes(
                                                  condRow.condition,
                                                ) && (
                                                  <input
                                                    type="text"
                                                    placeholder="e.g. +5 days, 0, -5 late"
                                                    value={condRow.condition}
                                                    onChange={(e) =>
                                                      handleConditionChange(
                                                        sub.id,
                                                        condRow.id,
                                                        "condition",
                                                        e.target.value,
                                                      )
                                                    }
                                                    className="grid-input font-mono text-xs flex-1"
                                                  />
                                                )}
                                              </div>
                                            ) : (
                                              <input
                                                type="text"
                                                placeholder="e.g. Credit period for 120 days"
                                                value={condRow.condition}
                                                onChange={(e) =>
                                                  handleConditionChange(
                                                    sub.id,
                                                    condRow.id,
                                                    "condition",
                                                    e.target.value,
                                                  )
                                                }
                                                className="grid-input text-xs"
                                              />
                                            )}
                                          </td>
                                          <td>
                                            <input
                                              type="number"
                                              min={0}
                                              placeholder="e.g. 20"
                                              value={condRow.marks}
                                              onChange={(e) =>
                                                handleConditionChange(
                                                  sub.id,
                                                  condRow.id,
                                                  "marks",
                                                  Number(e.target.value) || 0,
                                                )
                                              }
                                              className="grid-input font-mono tabular-nums text-xs"
                                            />
                                          </td>
                                          <td className="text-center">
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleRemoveConditionRow(sub.id, condRow.id)
                                              }
                                              className="p-1 hover:text-destructive text-muted-foreground transition-colors"
                                              title="Remove condition row"
                                            >
                                              <Trash2 size={13} />
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                      {conditionRows.length === 0 && (
                                        <tr>
                                          <td
                                            colSpan={3}
                                            className="text-center text-xs text-muted-foreground py-3"
                                          >
                                            No rating conditions added. Click &quot;Add
                                            Condition&quot; to add a row.
                                          </td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-border">
          <Button size="sm" onClick={handleSave}>
            <Save />
            Save Rating
          </Button>
        </div>
      </div>

      {/* All Ratings Table */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">All Ratings</h2>
          <span className="text-xs font-mono text-muted-foreground">
            Total Ratings: {ratingMasters.length}
          </span>
        </div>

        <div className="overflow-x-auto rounded border border-border">
          <table className="data-table">
            <thead>
              <tr>
                <th>Rate Code</th>
                <th>Supplier Type</th>
                <th>Rate Name</th>
                <th>Selected Criterias</th>
                <th>Total Weightage</th>
                <th className="w-36 text-center">Approval Status</th>
                <th className="w-28 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ratingMasters.map((row) => {
                const rowWeightage = Object.values(row.subCriteriaWeights ?? {}).reduce(
                  (sum, w) => sum + (Number(w) || 0),
                  0,
                );
                const chosenCriterias = criterias
                  .filter((c) => (row.selectedCriteriaIds ?? []).includes(c.id))
                  .map((c) => `${c.code}: ${c.name}`)
                  .join(", ");
                const status = row.approvalStatus ?? "Approved";
                return (
                  <tr key={row.id} className={editingId === row.id ? "bg-primary/5" : ""}>
                    <td className="text-primary font-mono font-medium">{row.code}</td>
                    <td>
                      <span className="badge text-[10px]">{row.supplierType}</span>
                    </td>
                    <td className="font-medium text-foreground">{row.name}</td>
                    <td className="text-xs text-muted-foreground">{chosenCriterias || "—"}</td>
                    <td className="font-mono text-xs font-semibold text-primary">
                      {rowWeightage}%
                    </td>
                    <td className="text-center">
                      <span
                        className={`badge text-[10px] ${
                          status === "Approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "pending"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(row)}
                          className="h-6 text-[11px] px-2.5"
                        >
                          Edit
                        </Button>
                        <button
                          type="button"
                          onClick={() => handleDelete(row.id)}
                          className="p-1 hover:text-destructive text-muted-foreground transition-colors"
                          title="Delete rating"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {ratingMasters.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-xs text-muted-foreground py-6">
                    No ratings configured.
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
