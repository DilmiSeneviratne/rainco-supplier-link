import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "./registration";
import { AccessNotice, PageHeading, useWorkspace, } from "./workspace";
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
function getNextRatingMasterId(list) {
    const maxNum = list.reduce((max, r) => {
        const match = r.id.match(/\d+/);
        return Math.max(max, match ? parseInt(match[0], 10) : 0);
    }, 0);
    return `RAT-${maxNum + 1}`;
}
function getNextRateCode(list) {
    const maxNum = list.reduce((max, r) => {
        const match = r.code.match(/\d+/);
        return Math.max(max, match ? parseInt(match[0], 10) : 0);
    }, 0);
    return `RAT-${String(maxNum + 1).padStart(3, "0")}`;
}
function getDefaultConditionForType(criteriaValue) {
    if (criteriaValue === "Yes/No")
        return "Yes";
    if (criteriaValue === "Delivery")
        return "0 (Same date)";
    return "";
}
function createInitialSubCriteriaRatings(criterias) {
    const map = {};
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
function createInitialSubCriteriaWeights(criterias) {
    const map = {};
    criterias.forEach((main) => {
        main.subCriterias.forEach((sub) => {
            map[sub.id] = 0;
        });
    });
    return map;
}
function SubCriteriaConditionsPanel({ sub, isSubOpen, subWeight, conditionRows, onToggleSubExpand, onWeightChange, onAddConditionRow, onConditionChange, onRemoveConditionRow, }) {
    return (<div className="rounded border border-border bg-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 bg-muted/20 border-b border-border">
        <button type="button" onClick={() => onToggleSubExpand(sub.id)} className="flex items-center gap-2 text-left">
          {isSubOpen ? (<ChevronDown size={14} className="text-muted-foreground"/>) : (<ChevronRight size={14} className="text-muted-foreground"/>)}
          <span className="font-mono text-xs text-primary font-medium">{sub.code}</span>
          <span className="text-xs font-medium text-foreground">{sub.indication}</span>
          <span className="badge text-[9px] ml-1">{sub.criteriaValue}</span>
        </button>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Weightage (%):</span>
            <input type="number" min={0} max={100} placeholder="0" value={subWeight} onChange={(e) => onWeightChange(sub.id, Number(e.target.value) || 0)} className="grid-input font-mono tabular-nums text-xs w-20 h-7 px-2"/>
          </label>

          <Button size="sm" variant="outline" onClick={() => onAddConditionRow(sub.id, sub.criteriaValue)} className="h-6 text-[11px] px-2.5 gap-1">
            <Plus size={11}/>
            Add Condition
          </Button>
        </div>
      </div>

      {isSubOpen && (<div className="p-3">
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
                {conditionRows.map((condRow) => (<tr key={condRow.id}>
                    <td>
                      {sub.criteriaValue === "Yes/No" ? (<select value={condRow.condition === "No" ? "No" : "Yes"} onChange={(e) => onConditionChange(sub.id, condRow.id, "condition", e.target.value)} className="grid-input text-xs">
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>) : sub.criteriaValue === "Price" ? (<input type="number" step="0.01" placeholder="e.g. 125.50" value={condRow.condition} onChange={(e) => onConditionChange(sub.id, condRow.id, "condition", e.target.value)} className="grid-input font-mono tabular-nums text-xs"/>) : sub.criteriaValue === "Quantity" ? (<input type="number" step="1" placeholder="e.g. 1000" value={condRow.condition} onChange={(e) => {
                        const intVal = e.target.value.replace(/[^0-9-]/g, "");
                        onConditionChange(sub.id, condRow.id, "condition", intVal);
                    }} className="grid-input font-mono tabular-nums text-xs"/>) : sub.criteriaValue === "Delivery" ? (<div className="flex items-center gap-2">
                          <select value={deliveryConditionOptions.includes(condRow.condition)
                        ? condRow.condition
                        : "__custom__"} onChange={(e) => {
                        if (e.target.value !== "__custom__") {
                            onConditionChange(sub.id, condRow.id, "condition", e.target.value);
                        }
                        else {
                            onConditionChange(sub.id, condRow.id, "condition", "");
                        }
                    }} className="grid-input text-xs w-48">
                            {deliveryConditionOptions.map((opt) => (<option key={opt} value={opt}>
                                {opt}
                              </option>))}
                            <option value="__custom__">Custom offset (e.g. +7 days, -2 days)</option>
                          </select>
                          {!deliveryConditionOptions.includes(condRow.condition) && (<input type="text" placeholder="e.g. +5 days, 0, -5 late" value={condRow.condition} onChange={(e) => onConditionChange(sub.id, condRow.id, "condition", e.target.value)} className="grid-input font-mono text-xs flex-1"/>)}
                        </div>) : (<input type="text" placeholder="e.g. Credit period for 120 days" value={condRow.condition} onChange={(e) => onConditionChange(sub.id, condRow.id, "condition", e.target.value)} className="grid-input text-xs"/>)}
                    </td>
                    <td>
                      <input type="number" min={0} placeholder="e.g. 20" value={condRow.marks} onChange={(e) => onConditionChange(sub.id, condRow.id, "marks", Number(e.target.value) || 0)} className="grid-input font-mono tabular-nums text-xs"/>
                    </td>
                    <td className="text-center">
                      <button type="button" onClick={() => onRemoveConditionRow(sub.id, condRow.id)} className="p-1 hover:text-destructive text-muted-foreground transition-colors" title="Remove condition row">
                        <Trash2 size={13}/>
                      </button>
                    </td>
                  </tr>))}
                {conditionRows.length === 0 && (<tr>
                    <td colSpan={3} className="text-center text-xs text-muted-foreground py-3">
                      No rating conditions added. Click &quot;Add Condition&quot; to add a row.
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>)}
    </div>);
}
function AllRatingsTableCard({ ratingMasters, criterias, editingId, onEdit, onDelete, }) {
    return (<div className="rounded-lg border border-border bg-card p-6 space-y-4">
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
            const rowWeightage = Object.values(row.subCriteriaWeights ?? {}).reduce((sum, w) => sum + (Number(w) || 0), 0);
            const chosenCriterias = criterias
                .filter((c) => (row.selectedCriteriaIds ?? []).includes(c.id))
                .map((c) => `${c.code}: ${c.name}`)
                .join(", ");
            const status = row.approvalStatus ?? "Approved";
            return (<tr key={row.id} className={editingId === row.id ? "bg-primary/5" : ""}>
                  <td className="text-primary font-mono font-medium">{row.code}</td>
                  <td>
                    <span className="badge text-[10px]">{row.supplierType}</span>
                  </td>
                  <td className="font-medium text-foreground">{row.name}</td>
                  <td className="text-xs text-muted-foreground">{chosenCriterias || "—"}</td>
                  <td className="font-mono text-xs font-semibold text-primary">{rowWeightage}%</td>
                  <td className="text-center">
                    <span className={`badge text-[10px] ${status === "Approved"
                    ? "bg-emerald-100 text-emerald-800"
                    : status === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : "pending"}`}>
                      {status}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Button size="sm" variant="outline" onClick={() => onEdit(row)} className="h-6 text-[11px] px-2.5">
                        Edit
                      </Button>
                      <button type="button" onClick={() => onDelete(row.id)} className="p-1 hover:text-destructive text-muted-foreground transition-colors" title="Delete rating">
                        <Trash2 size={13}/>
                      </button>
                    </div>
                  </td>
                </tr>);
        })}
            {ratingMasters.length === 0 && (<tr>
                <td colSpan={7} className="text-center text-xs text-muted-foreground py-6">
                  No ratings configured.
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>);
}
export function RatingsMaster() {
    const { role, supplierTypes, criterias, ratingMasters, saveRatingMaster, deleteRatingMaster } = useWorkspace();
    const activeSupplierTypes = supplierTypes.filter((t) => t.isActive);
    const [editingId, setEditingId] = useState(null);
    const [supplierType, setSupplierType] = useState(activeSupplierTypes[0]?.name ?? "Local");
    const [rateCode, setRateCode] = useState("");
    const [rateName, setRateName] = useState("");
    const [selectedCriteriaIds, setSelectedCriteriaIds] = useState([]);
    const [subCriteriaWeights, setSubCriteriaWeights] = useState(() => createInitialSubCriteriaWeights(criterias));
    const [subCriteriaRatings, setSubCriteriaRatings] = useState(() => createInitialSubCriteriaRatings(criterias));
    const [expandedMainIds, setExpandedMainIds] = useState(() => {
        const initial = {};
        criterias.forEach((c) => {
            initial[c.id] = true;
        });
        return initial;
    });
    const [expandedSubIds, setExpandedSubIds] = useState(() => {
        const initial = {};
        criterias.forEach((c) => {
            c.subCriterias.forEach((s) => {
                initial[s.id] = true;
            });
        });
        return initial;
    });
    const [notice, setNotice] = useState(null);
    if (role !== "rainco")
        return <AccessNotice audience="rainco"/>;
    const displayedRateCode = editingId ? rateCode : getNextRateCode(ratingMasters);
    const toggleMainExpand = (mainId) => {
        setExpandedMainIds((prev) => ({
            ...prev,
            [mainId]: !(prev[mainId] ?? true),
        }));
    };
    const toggleSubExpand = (subId) => {
        setExpandedSubIds((prev) => ({
            ...prev,
            [subId]: !(prev[subId] ?? true),
        }));
    };
    const handleAddConditionRow = (subId, criteriaValue) => {
        const currentRows = subCriteriaRatings[subId] ?? [];
        const newRow = {
            id: `RC-${Date.now()}-${currentRows.length + 1}`,
            condition: getDefaultConditionForType(criteriaValue),
            marks: 0,
        };
        setSubCriteriaRatings((prev) => ({
            ...prev,
            [subId]: [...currentRows, newRow],
        }));
    };
    const handleConditionChange = (subId, rowId, field, value) => {
        const currentRows = subCriteriaRatings[subId] ?? [];
        setSubCriteriaRatings((prev) => ({
            ...prev,
            [subId]: currentRows.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)),
        }));
    };
    const handleRemoveConditionRow = (subId, rowId) => {
        const currentRows = subCriteriaRatings[subId] ?? [];
        setSubCriteriaRatings((prev) => ({
            ...prev,
            [subId]: currentRows.filter((row) => row.id !== rowId),
        }));
    };
    const toggleCriteriaSelection = (criteriaId) => {
        setSelectedCriteriaIds((prev) => prev.includes(criteriaId) ? prev.filter((id) => id !== criteriaId) : [...prev, criteriaId]);
    };
    const handleWeightChange = (subId, weight) => {
        setSubCriteriaWeights((prev) => ({
            ...prev,
            [subId]: Math.max(0, weight),
        }));
    };
    const handleEdit = (row) => {
        setEditingId(row.id);
        setSupplierType(row.supplierType);
        setRateCode(row.code);
        setRateName(row.name);
        setSelectedCriteriaIds(row.selectedCriteriaIds ? [...row.selectedCriteriaIds] : criterias.map((c) => c.id));
        setSubCriteriaWeights({ ...(row.subCriteriaWeights ?? {}) });
        const clonedMap = {};
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
        const allowedSubIds = new Set();
        const cleanedWeights = {};
        activeCriterias.forEach((main) => {
            main.subCriterias.forEach((sub) => {
                allowedSubIds.add(sub.id);
                cleanedWeights[sub.id] = Number(subCriteriaWeights[sub.id]) || 0;
            });
        });
        const cleanedRatings = {};
        Object.entries(subCriteriaRatings).forEach(([subId, rows]) => {
            if (!allowedSubIds.has(subId))
                return;
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
    const handleDelete = (id) => {
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
    const totalAssignedWeightage = selectedMainCriterias.reduce((sum, main) => sum +
        main.subCriterias.reduce((subSum, sub) => subSum + (Number(subCriteriaWeights[sub.id]) || 0), 0), 0);
    return (<div className="space-y-6">
      <PageHeading eyebrow="MASTER DATA" title="Ratings"/>

      <div className="rounded-lg border border-border bg-card p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">
            {editingId ? `Edit Rating (${displayedRateCode})` : "Create Rating"}
          </h2>
        </div>

        {notice && (<div className={`notice ${notice.isError ? "error" : "success"}`} role="status">
            {notice.text}
          </div>)}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Field label="Supplier Type" required>
            <select value={supplierType} onChange={(e) => setSupplierType(e.target.value)}>
              {(activeSupplierTypes.length > 0
            ? activeSupplierTypes.map((t) => t.name)
            : ["Local", "Foreign"]).map((typeName) => (<option key={typeName} value={typeName}>
                  {typeName}
                </option>))}
              {!activeSupplierTypes.some((t) => t.name === supplierType) &&
            supplierType !== "Local" &&
            supplierType !== "Foreign" &&
            supplierType && <option value={supplierType}>{supplierType}</option>}
            </select>
          </Field>

          <Field label="Rate Code">
            <input type="text" value={displayedRateCode} readOnly className="bg-muted/50 font-mono text-primary font-medium"/>
          </Field>

          <Field label="Rate Name" required>
            <input type="text" placeholder="e.g. Standard Local Supplier Rating" value={rateName} onChange={(e) => setRateName(e.target.value)}/>
          </Field>
        </div>

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
            return (<div key={mainCriteria.id} className={`rounded-lg border overflow-hidden transition-colors ${isSelected
                    ? "border-primary/40 bg-muted/15"
                    : "border-border bg-muted/5 opacity-75"}`}>
                  <div className="w-full flex items-center justify-between px-4 py-3 bg-muted/40">
                    <div className="flex items-center gap-2.5">
                      <input type="checkbox" checked={isSelected} onChange={() => toggleCriteriaSelection(mainCriteria.id)} className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"/>
                      <button type="button" onClick={() => toggleMainExpand(mainCriteria.id)} className="flex items-center gap-2.5 text-left">
                        {isSelected ? (isMainOpen ? (<ChevronDown size={15} className="text-primary shrink-0"/>) : (<ChevronRight size={15} className="text-primary shrink-0"/>)) : (<ChevronRight size={15} className="text-muted-foreground shrink-0"/>)}
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

                  {isSelected && isMainOpen && (<div className="p-4 pl-6 space-y-3 border-t border-border">
                      {mainCriteria.subCriterias.map((sub) => (<SubCriteriaConditionsPanel key={sub.id} sub={sub} isSubOpen={expandedSubIds[sub.id] ?? true} subWeight={subCriteriaWeights[sub.id] ?? 0} conditionRows={subCriteriaRatings[sub.id] ?? []} onToggleSubExpand={toggleSubExpand} onWeightChange={handleWeightChange} onAddConditionRow={handleAddConditionRow} onConditionChange={handleConditionChange} onRemoveConditionRow={handleRemoveConditionRow}/>))}
                    </div>)}
                </div>);
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

      <AllRatingsTableCard ratingMasters={ratingMasters} criterias={criterias} editingId={editingId} onEdit={handleEdit} onDelete={handleDelete}/>
    </div>);
}
