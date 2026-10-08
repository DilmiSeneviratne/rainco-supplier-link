import { useState } from "react";
import { Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "./registration";
import { AccessNotice, PageHeading, useWorkspace, } from "./workspace";
function getNextSupplierTypeId(list) {
    const maxNum = list.reduce((max, t) => {
        const match = t.id.match(/\d+/);
        return Math.max(max, match ? parseInt(match[0], 10) : 0);
    }, 0);
    return `ST-${maxNum + 1}`;
}
function SupplierTypeFormCard({ editingId, code, name, isActive, notice, onCodeChange, onNameChange, onActiveChange, onSave, }) {
    return (<div className="rounded-lg border border-border bg-card p-6 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">
          {editingId ? `Edit Supplier Type (${editingId})` : "Create Supplier Type"}
        </h2>
      </div>

      {notice && (<div className={`notice ${notice.isError ? "error" : "success"}`} role="status">
          {notice.text}
        </div>)}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <Field label="Supplier Type Code" required>
          <input type="text" placeholder="e.g. FOREIGN, LOCAL" value={code} maxLength={30} onChange={(e) => onCodeChange(e.target.value)}/>
        </Field>

        <Field label="Supplier Type Name" required>
          <input type="text" placeholder="e.g. Foreign, Local" value={name} maxLength={100} onChange={(e) => onNameChange(e.target.value)}/>
        </Field>

        <div className="flex items-center pb-2.5">
          <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer select-none">
            <input type="checkbox" checked={isActive} onChange={(e) => onActiveChange(e.target.checked)} className="w-4 h-4 rounded text-primary focus:ring-primary"/>
            <span className="font-medium">Active Status</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-2 border-t border-border">
        <Button size="sm" onClick={onSave}>
          <Save />
          Save Supplier Type
        </Button>
      </div>
    </div>);
}
function SupplierTypesListCard({ supplierTypes, editingId, onEdit, onDelete, }) {
    return (<div className="rounded-lg border border-border bg-card p-6 space-y-4">
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
            {supplierTypes.map((row, idx) => (<tr key={row.id} className={editingId === row.id ? "bg-primary/5" : ""}>
                <td className="row-number">{String(idx + 1).padStart(2, "0")}</td>
                <td className="text-primary font-mono font-medium">{row.code}</td>
                <td className="font-medium text-foreground">{row.name}</td>
                <td className="text-center">
                  <span className={`badge text-[9px] ${row.isActive
                ? "bg-emerald-100 text-emerald-800"
                : "bg-muted text-muted-foreground"}`}>
                    {row.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Button size="sm" variant="outline" onClick={() => onEdit(row)} className="h-6 text-[11px] px-2.5">
                      Edit
                    </Button>
                    <button type="button" onClick={() => onDelete(row.id)} className="p-1 hover:text-destructive text-muted-foreground transition-colors" title="Delete supplier type">
                      <Trash2 size={13}/>
                    </button>
                  </div>
                </td>
              </tr>))}
            {supplierTypes.length === 0 && (<tr>
                <td colSpan={5} className="text-center text-xs text-muted-foreground py-6">
                  No supplier types configured.
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>);
}
export function SupplierTypes() {
    const { role, supplierTypes, saveSupplierType, deleteSupplierType } = useWorkspace();
    const [editingId, setEditingId] = useState(null);
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [notice, setNotice] = useState(null);
    if (role !== "rainco")
        return <AccessNotice audience="rainco"/>;
    const handleEdit = (row) => {
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
        const duplicate = supplierTypes.some((t) => t.id !== editingId &&
            (t.code.toLowerCase() === trimmedCode.toLowerCase() ||
                t.name.toLowerCase() === trimmedName.toLowerCase()));
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
    const handleDelete = (id) => {
        deleteSupplierType(id);
        if (editingId === id) {
            setEditingId(null);
            setCode("");
            setName("");
            setIsActive(true);
        }
    };
    return (<div className="space-y-6">
      <PageHeading eyebrow="MASTER DATA" title="Supplier Types"/>
      <SupplierTypeFormCard editingId={editingId} code={code} name={name} isActive={isActive} notice={notice} onCodeChange={setCode} onNameChange={setName} onActiveChange={setIsActive} onSave={handleSave}/>
      <SupplierTypesListCard supplierTypes={supplierTypes} editingId={editingId} onEdit={handleEdit} onDelete={handleDelete}/>
    </div>);
}
