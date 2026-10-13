import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "./registration";
import { AccessNotice, PageHeading, useWorkspace } from "./workspace";
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
function parseConditionFields(r) {
  if (
    r.fromVal !== undefined ||
    r.toVal !== undefined ||
    r.operator !== undefined ||
    r.textVal !== undefined
  ) {
    return {
      fromVal: r.fromVal ?? "",
      operator: r.operator ?? "=",
      toVal: r.toVal ?? "",
      textVal: r.textVal ?? r.condition ?? "",
    };
  }
  const condStr = (r.condition ?? "").trim();
  if (!condStr) return { fromVal: "", operator: "=", toVal: "", textVal: "" };

  if (condStr.includes(" to ")) {
    const parts = condStr.split(" to ");
    return {
      fromVal: parts[0]?.trim() ?? "",
      operator: "Between",
      toVal: parts[1]?.trim() ?? "",
      textVal: condStr,
    };
  }
  if (condStr.includes(" - ") && !condStr.startsWith("-")) {
    const parts = condStr.split(" - ");
    return {
      fromVal: parts[0]?.trim() ?? "",
      operator: "-",
      toVal: parts[1]?.trim() ?? "",
      textVal: condStr,
    };
  }
  const rangeMatch = condStr.match(/^(.+?)\s+([><]=?|!=|=)\s+(.+)$/);
  if (rangeMatch) {
    return {
      fromVal: rangeMatch[1].trim(),
      operator: rangeMatch[2].trim(),
      toVal: rangeMatch[3].trim(),
      textVal: condStr,
    };
  }
  if (condStr.startsWith("≤") || condStr.startsWith("<=")) {
    const clean = condStr.replace(/^(≤|<=)\s*/, "");
    return { fromVal: "", operator: "<=", toVal: clean, textVal: condStr };
  }
  if (condStr.startsWith("≥") || condStr.startsWith(">=")) {
    const clean = condStr.replace(/^(≥|>=)\s*/, "");
    return { fromVal: clean, operator: ">=", toVal: "", textVal: condStr };
  }
  const opPrefix = condStr.match(/^([><]=?|!=|=)\s*(.+)$/);
  if (opPrefix) {
    return { fromVal: "", operator: opPrefix[1], toVal: opPrefix[2].trim(), textVal: condStr };
  }
  return { fromVal: condStr, operator: "=", toVal: "", textVal: condStr };
}

function formatConditionLabel(r, mode = "range") {
  if (mode === "text") {
    const text = (r.textVal ?? r.condition ?? "").trim();
    const op = (r.operator ?? "=").trim();
    if (op === "=") return text;
    return `${op} "${text}"`;
  }
  const from = (r.fromVal ?? "").trim();
  const op = (r.operator ?? "=").trim();
  const to = (r.toVal ?? "").trim();
  if (from && to) {
    if (op === "Between") return `${from} to ${to}`;
    if (op === "-") return `${from} - ${to}`;
    return `${from} ${op} ${to}`;
  }
  if (from && !to) {
    if (op === "=") return from;
    return `${op} ${from}`;
  }
  if (!from && to) {
    return `${op} ${to}`;
  }
  return r.condition || "";
}

export function getSubConditionMode(mainCriteria, sub) {
  const val = (sub?.criteriaValue || "").toLowerCase();
  if (val === "text") return "text";
  if (val === "yes/no/uncertain" || val === "yes/no" || val === "yes / no / uncertain")
    return "decision";
  if (["decimal", "number", "percentage", "date", "range"].includes(val)) return "range";

  const mainType = (mainCriteria?.criteriaType || "Criteria").toLowerCase();
  if (mainType === "desirability") return "decision";
  if (mainType === "feasibility") return "decision";
  return "range";
}

function renderValueField(criteriaValue, value, onChange, placeholder) {
  if (criteriaValue === "Date") {
    return (
      <input
        type="date"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="grid-input font-mono text-xs w-full"
      />
    );
  }
  if (criteriaValue === "Decimal") {
    return (
      <input
        type="number"
        step="any"
        placeholder={placeholder || "0.00"}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="grid-input font-mono tabular-nums text-xs w-full"
      />
    );
  }
  if (criteriaValue === "Number") {
    return (
      <input
        type="number"
        step="1"
        placeholder={placeholder || "0"}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9-]/g, ""))}
        className="grid-input font-mono tabular-nums text-xs w-full"
      />
    );
  }
  if (criteriaValue === "Percentage") {
    return (
      <input
        type="text"
        placeholder={placeholder || "e.g. 10%"}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="grid-input font-mono tabular-nums text-xs w-full"
      />
    );
  }
  return (
    <input
      type="text"
      placeholder={placeholder || ""}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="grid-input text-xs w-full"
    />
  );
}

function getDefaultConditionForType(criteriaValue) {
  if (
    criteriaValue === "Yes/No" ||
    criteriaValue === "Yes/No/Uncertain" ||
    criteriaValue === "Yes / No / Uncertain"
  )
    return "Yes";
  if (criteriaValue === "Delivery") return "0 (Same date)";
  if (criteriaValue === "Date") return new Date().toISOString().split("T")[0];
  if (criteriaValue === "Decimal") return "0.00";
  if (criteriaValue === "Number") return "0";
  if (criteriaValue === "Percentage") return "0%";
  return "";
}

function createInitialSubCriteriaRatings(criterias) {
  const map = {};
  criterias.forEach((main) => {
    main.subCriterias.forEach((sub, idx) => {
      const mode = getSubConditionMode(main, sub);
      if (mode === "decision") {
        map[sub.id] = [
          { id: `RC-${sub.id}-yes`, condition: "Yes", marks: 0 },
          { id: `RC-${sub.id}-uncertain`, condition: "Uncertain", marks: 0 },
          { id: `RC-${sub.id}-no`, condition: "No", marks: 0 },
        ];
      } else if (mode === "text") {
        map[sub.id] = [
          {
            id: `RC-${Date.now()}-${sub.id}-${idx}`,
            textVal: "",
            operator: "=",
            condition: "",
            marks: 0,
          },
        ];
      } else {
        map[sub.id] = [
          {
            id: `RC-${Date.now()}-${sub.id}-${idx}`,
            fromVal: "",
            operator: "=",
            toVal: "",
            condition: "",
            marks: 0,
          },
        ];
      }
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

function SubCriteriaConditionsPanel({
  mainCriteria,
  sub,
  isSubOpen,
  subWeight,
  conditionRows,
  onToggleSubExpand,
  onWeightChange,
  onAddConditionRow,
  onConditionChange,
  onRemoveConditionRow,
  onDecisionMarksChange,
}) {
  const mode = getSubConditionMode(mainCriteria, sub);

  const decisionOptions = [
    {
      label: "Yes",
      badgeClass:
        "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300",
    },
    {
      label: "Uncertain",
      badgeClass:
        "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300",
    },
    {
      label: "No",
      badgeClass: "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300",
    },
  ];

  const getModeBadge = () => {
    if (mode === "decision")
      return {
        label: "Yes / Uncertain / No",
        cls: "bg-purple-100 text-purple-800 border-purple-200",
      };
    if (mode === "text")
      return { label: "Text Match", cls: "bg-amber-100 text-amber-800 border-amber-200" };
    return {
      label: `Range (${sub.criteriaValue || "Decimal"})`,
      cls: "bg-blue-100 text-blue-800 border-blue-200",
    };
  };

  const modeBadge = getModeBadge();

  return (
    <div className="rounded border border-border bg-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 bg-muted/20 border-b border-border">
        <button
          type="button"
          onClick={() => onToggleSubExpand(sub.id)}
          className="flex items-center gap-2 text-left"
        >
          {isSubOpen ? (
            <ChevronDown size={14} className="text-muted-foreground" />
          ) : (
            <ChevronRight size={14} className="text-muted-foreground" />
          )}
          <span className="font-mono text-xs text-primary font-medium">{sub.code}</span>
          <span className="text-xs font-medium text-foreground">{sub.indication}</span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${modeBadge.cls}`}
          >
            {modeBadge.label}
          </span>
        </button>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Weightage (%):</span>
            <input
              type="number"
              min={0}
              max={100}
              placeholder="0"
              value={subWeight}
              onChange={(e) => onWeightChange(sub.id, Number(e.target.value) || 0)}
              className="grid-input font-mono tabular-nums text-xs w-20 h-7 px-2"
            />
          </label>

          {mode !== "decision" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAddConditionRow(sub.id, mode)}
              className="h-6 text-[11px] px-2.5 gap-1"
            >
              <Plus size={11} />
              Add Condition
            </Button>
          )}
        </div>
      </div>

      {isSubOpen && (
        <div className="p-3">
          {mode === "decision" ? (
            <div className="overflow-x-auto rounded border border-border">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="w-48">Decision Option</th>
                    <th className="w-36 text-right">Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {decisionOptions.map((opt) => {
                    const match = conditionRows.find((r) => r.condition === opt.label);
                    const marksVal = match ? (match.marks ?? 0) : 0;
                    return (
                      <tr key={opt.label}>
                        <td>
                          <span
                            className={`badge text-xs font-semibold px-2.5 py-0.5 border ${opt.badgeClass}`}
                          >
                            {opt.label}
                          </span>
                        </td>
                        <td className="text-right">
                          <input
                            type="number"
                            min={0}
                            placeholder="0"
                            value={marksVal}
                            onChange={(e) =>
                              onDecisionMarksChange(sub.id, opt.label, e.target.value)
                            }
                            className="grid-input font-mono tabular-nums text-xs text-right w-28 ml-auto"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : mode === "text" ? (
            <div className="overflow-x-auto rounded border border-border">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Expected Text / Pattern</th>
                    <th className="w-36 text-center">Condition</th>
                    <th className="w-28 text-right">Marks</th>
                    <th className="w-14 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {conditionRows.map((condRow) => {
                    const parsed = parseConditionFields(condRow);
                    const textVal =
                      condRow.textVal !== undefined ? condRow.textVal : parsed.textVal;
                    const operator =
                      condRow.operator !== undefined ? condRow.operator : parsed.operator || "=";

                    return (
                      <tr key={condRow.id}>
                        <td>
                          <input
                            type="text"
                            placeholder="e.g. ISO 9001 Certified, Approved, Compliant"
                            value={textVal ?? ""}
                            onChange={(e) =>
                              onConditionChange(sub.id, condRow.id, "textVal", e.target.value)
                            }
                            className="grid-input text-xs w-full"
                          />
                        </td>
                        <td className="text-center">
                          <select
                            value={operator || "="}
                            onChange={(e) =>
                              onConditionChange(sub.id, condRow.id, "operator", e.target.value)
                            }
                            className="grid-input text-xs text-center w-full min-w-[95px] font-medium"
                          >
                            <option value="=">= (Exact)</option>
                            <option value="!=">!= (Not Equal)</option>
                            <option value="Contains">Contains</option>
                            <option value="Starts With">Starts With</option>
                            <option value="Matches">Matches</option>
                          </select>
                        </td>
                        <td className="text-right">
                          <input
                            type="number"
                            min={0}
                            placeholder="0"
                            value={condRow.marks}
                            onChange={(e) =>
                              onConditionChange(
                                sub.id,
                                condRow.id,
                                "marks",
                                Number(e.target.value) || 0,
                              )
                            }
                            className="grid-input font-mono tabular-nums text-xs text-right w-24 ml-auto"
                          />
                        </td>
                        <td className="text-center">
                          <button
                            type="button"
                            onClick={() => onRemoveConditionRow(sub.id, condRow.id)}
                            className="p-1 hover:text-destructive text-muted-foreground transition-colors"
                            title="Remove condition row"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {conditionRows.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center text-xs text-muted-foreground py-3">
                        No text condition rows added. Click &quot;Add Condition&quot; to add a row.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto rounded border border-border">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>From ({sub.criteriaValue})</th>
                    <th className="w-28 text-center">Condition</th>
                    <th>To ({sub.criteriaValue})</th>
                    <th className="w-28 text-right">Marks</th>
                    <th className="w-14 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {conditionRows.map((condRow) => {
                    const parsed = parseConditionFields(condRow);
                    const fromVal =
                      condRow.fromVal !== undefined ? condRow.fromVal : parsed.fromVal;
                    const operator =
                      condRow.operator !== undefined ? condRow.operator : parsed.operator;
                    const toVal = condRow.toVal !== undefined ? condRow.toVal : parsed.toVal;

                    return (
                      <tr key={condRow.id}>
                        <td>
                          {renderValueField(
                            sub.criteriaValue,
                            fromVal,
                            (val) => onConditionChange(sub.id, condRow.id, "fromVal", val),
                            "From",
                          )}
                        </td>
                        <td className="text-center">
                          <select
                            value={operator || "="}
                            onChange={(e) =>
                              onConditionChange(sub.id, condRow.id, "operator", e.target.value)
                            }
                            className="grid-input font-mono font-bold text-xs text-center w-full min-w-[75px]"
                          >
                            <option value="=">=</option>
                            <option value=">">&gt;</option>
                            <option value="<">&lt;</option>
                            <option value=">=">&gt;=</option>
                            <option value="<=">&lt;=</option>
                            <option value="Between">Between</option>
                            <option value="-">-</option>
                            <option value="!=">!=</option>
                            {!["=", ">", "<", ">=", "<=", "Between", "-", "!="].includes(
                              operator,
                            ) &&
                              operator && <option value={operator}>{operator}</option>}
                          </select>
                        </td>
                        <td>
                          {renderValueField(
                            sub.criteriaValue,
                            toVal,
                            (val) => onConditionChange(sub.id, condRow.id, "toVal", val),
                            "To",
                          )}
                        </td>
                        <td className="text-right">
                          <input
                            type="number"
                            min={0}
                            placeholder="0"
                            value={condRow.marks}
                            onChange={(e) =>
                              onConditionChange(
                                sub.id,
                                condRow.id,
                                "marks",
                                Number(e.target.value) || 0,
                              )
                            }
                            className="grid-input font-mono tabular-nums text-xs text-right w-24 ml-auto"
                          />
                        </td>
                        <td className="text-center">
                          <button
                            type="button"
                            onClick={() => onRemoveConditionRow(sub.id, condRow.id)}
                            className="p-1 hover:text-destructive text-muted-foreground transition-colors"
                            title="Remove condition row"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {conditionRows.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-xs text-muted-foreground py-3">
                        No condition rows added. Click &quot;Add Condition&quot; to add a range.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
function AllRatingsTableCard({ ratingMasters, criterias, editingId, onEdit }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">All Conditions</h2>
        <span className="text-xs font-mono text-muted-foreground">
          Total Conditions: {ratingMasters.length}
        </span>
      </div>

      <div className="overflow-x-auto rounded border border-border">
        <table className="data-table">
          <thead>
            <tr>
              <th>Condition Code</th>
              <th>Supplier Type</th>
              <th>Condition Name</th>
              <th>Selected Tutorials</th>
              <th>Total Weightage</th>
              <th className="w-20 text-center">Active</th>
              <th className="w-36 text-center">Approval Status</th>
              <th className="w-20 text-center">Actions</th>
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
                  <td className="font-mono text-xs font-semibold text-primary">{rowWeightage}%</td>
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
            {ratingMasters.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-xs text-muted-foreground py-6">
                  No conditions configured.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export function RatingsMaster() {
  const { role, supplierTypes, criterias, ratingMasters, saveRatingMaster } = useWorkspace();
  const activeSupplierTypes = supplierTypes.filter((t) => t.isActive);
  const [editingId, setEditingId] = useState(null);
  const [supplierType, setSupplierType] = useState(activeSupplierTypes[0]?.name ?? "Local");
  const [rateCode, setRateCode] = useState("");
  const [rateName, setRateName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedCriteriaIds, setSelectedCriteriaIds] = useState([]);
  const [subCriteriaWeights, setSubCriteriaWeights] = useState(() =>
    createInitialSubCriteriaWeights(criterias),
  );
  const [subCriteriaRatings, setSubCriteriaRatings] = useState(() =>
    createInitialSubCriteriaRatings(criterias),
  );
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
  if (role !== "rainco") return <AccessNotice audience="rainco" />;
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
  const handleAddConditionRow = (subId, mode = "range") => {
    const currentRows = subCriteriaRatings[subId] ?? [];
    const newRow =
      mode === "text"
        ? {
            id: `RC-${Date.now()}-${currentRows.length + 1}`,
            textVal: "",
            operator: "=",
            condition: "",
            marks: 0,
          }
        : {
            id: `RC-${Date.now()}-${currentRows.length + 1}`,
            fromVal: "",
            operator: "=",
            toVal: "",
            condition: "",
            marks: 0,
          };
    setSubCriteriaRatings((prev) => ({
      ...prev,
      [subId]: [...currentRows, newRow],
    }));
  };
  const handleDecisionMarksChange = (subId, optionName, marksVal) => {
    const currentRows = subCriteriaRatings[subId] ?? [];
    const decisionOptions = ["Yes", "Uncertain", "No"];
    const numericMarks = Number(marksVal) || 0;
    const updated = decisionOptions.map((opt) => {
      const found = currentRows.find((r) => r.condition === opt);
      return {
        id: found?.id ?? `RC-${subId}-${opt.toLowerCase()}`,
        condition: opt,
        marks: opt === optionName ? numericMarks : (found?.marks ?? 0),
      };
    });
    setSubCriteriaRatings((prev) => ({
      ...prev,
      [subId]: updated,
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
    setSelectedCriteriaIds((prev) =>
      prev.includes(criteriaId) ? prev.filter((id) => id !== criteriaId) : [...prev, criteriaId],
    );
  };
  const handleWeightChange = (subId, weight) => {
    setSubCriteriaWeights((prev) => ({
      ...prev,
      [subId]: Math.max(0, weight),
    }));
  };
  const handleEdit = (row) => {
    setEditingId(row.id);
    setIsActive(row.isActive !== false);
    setSupplierType(row.supplierType);
    setRateCode(row.code);
    setRateName(row.name);
    setSelectedCriteriaIds(
      row.selectedCriteriaIds ? [...row.selectedCriteriaIds] : criterias.map((c) => c.id),
    );
    setSubCriteriaWeights({ ...(row.subCriteriaWeights ?? {}) });
    const clonedMap = {};
    criterias.forEach((main) => {
      main.subCriterias.forEach((sub) => {
        const list = row.subCriteriaRatings?.[sub.id] ?? [];
        const mode = getSubConditionMode(main, sub);
        if (mode === "decision") {
          clonedMap[sub.id] = ["Yes", "Uncertain", "No"].map((opt) => {
            const match = list.find((item) => item.condition === opt);
            return {
              id: match?.id ?? `RC-${sub.id}-${opt.toLowerCase()}`,
              condition: opt,
              marks: match?.marks ?? 0,
            };
          });
        } else if (mode === "text") {
          clonedMap[sub.id] =
            list.length > 0
              ? list.map((item) => {
                  const parsed = parseConditionFields(item);
                  return {
                    ...item,
                    textVal: item.textVal ?? parsed.textVal,
                    operator: item.operator ?? parsed.operator ?? "=",
                    marks: item.marks ?? 0,
                  };
                })
              : [
                  {
                    id: `RC-${Date.now()}-${sub.id}-1`,
                    textVal: "",
                    operator: "=",
                    condition: "",
                    marks: 0,
                  },
                ];
        } else {
          clonedMap[sub.id] =
            list.length > 0
              ? list.map((item) => {
                  const parsed = parseConditionFields(item);
                  return {
                    ...item,
                    fromVal: item.fromVal !== undefined ? item.fromVal : parsed.fromVal,
                    operator: item.operator !== undefined ? item.operator : parsed.operator,
                    toVal: item.toVal !== undefined ? item.toVal : parsed.toVal,
                    marks: item.marks ?? 0,
                  };
                })
              : [
                  {
                    id: `RC-${Date.now()}-${sub.id}-1`,
                    fromVal: "",
                    operator: "=",
                    toVal: "",
                    condition: "",
                    marks: 0,
                  },
                ];
        }
      });
    });
    setSubCriteriaRatings(clonedMap);
    setNotice(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleSave = () => {
    const trimmedName = rateName.trim();
    if (!trimmedName) {
      setNotice({
        text: "Please enter the Condition Name.",
        isError: true,
      });
      return;
    }
    if (selectedCriteriaIds.length === 0) {
      setNotice({
        text: "Please select at least one Main Tutorial for this condition.",
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
      if (!allowedSubIds.has(subId)) return;
      const parentMain = criterias.find((m) => m.subCriterias.some((s) => s.id === subId));
      const sub = parentMain?.subCriterias.find((s) => s.id === subId);
      const mode = getSubConditionMode(parentMain, sub);

      if (mode === "decision") {
        cleanedRatings[subId] = ["Yes", "Uncertain", "No"].map((opt) => {
          const match = rows.find((r) => r.condition === opt);
          return {
            id: match?.id ?? `RC-${subId}-${opt.toLowerCase()}`,
            condition: opt,
            marks: Number(match?.marks) || 0,
          };
        });
      } else if (mode === "text") {
        cleanedRatings[subId] = rows
          .map((r) => {
            const formatted = formatConditionLabel(r, "text");
            return {
              id: r.id,
              textVal: r.textVal ?? "",
              operator: r.operator ?? "=",
              condition: formatted || r.condition || "",
              marks: Number(r.marks) || 0,
            };
          })
          .filter((r) => (r.condition && r.condition.trim() !== "") || r.marks > 0);
      } else {
        cleanedRatings[subId] = rows
          .map((r) => {
            const formatted = formatConditionLabel(r, "range");
            return {
              id: r.id,
              fromVal: r.fromVal ?? "",
              operator: r.operator ?? "=",
              toVal: r.toVal ?? "",
              condition: formatted || r.condition || "",
              marks: Number(r.marks) || 0,
            };
          })
          .filter((r) => (r.condition && r.condition.trim() !== "") || r.marks > 0);
      }
    });
    const idToSave = editingId ?? getNextRatingMasterId(ratingMasters);
    const codeToSave = editingId ? rateCode : getNextRateCode(ratingMasters);
    saveRatingMaster({
      id: idToSave,
      supplierType,
      code: codeToSave,
      name: trimmedName,
      isActive,
      selectedCriteriaIds: [...selectedCriteriaIds],
      subCriteriaWeights: cleanedWeights,
      subCriteriaRatings: cleanedRatings,
    });
    setEditingId(null);
    setSupplierType(activeSupplierTypes[0]?.name ?? "Local");
    setRateCode("");
    setRateName("");
    setIsActive(true);
    setSelectedCriteriaIds([]);
    setSubCriteriaWeights(createInitialSubCriteriaWeights(criterias));
    setSubCriteriaRatings(createInitialSubCriteriaRatings(criterias));
    setNotice({
      text: `Condition "${trimmedName}" (${codeToSave}) saved and sent to the Approval Queue for verification.`,
    });
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
      <PageHeading eyebrow="MASTER DATA" title="Conditions" />

      <div className="rounded-lg border border-border bg-card p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">
            {editingId ? `Edit Condition (${displayedRateCode})` : "Create Condition"}
          </h2>
        </div>

        {notice && (
          <div className={`notice ${notice.isError ? "error" : "success"}`} role="status">
            {notice.text}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-end">
          <div className="w-full md:w-44 flex-shrink-0">
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
          </div>

          <div className="w-full md:w-32 flex-shrink-0">
            <Field label="Condition Code">
              <input
                type="text"
                value={displayedRateCode}
                readOnly
                className="bg-muted/50 font-mono text-primary font-medium cursor-not-allowed select-none text-center text-xs h-9"
              />
            </Field>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Field label="Condition Name" required>
              <input
                type="text"
                placeholder="e.g. Standard Local Supplier Condition"
                value={rateName}
                onChange={(e) => setRateName(e.target.value)}
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

        <div className="pt-4 border-t border-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold text-foreground">
                Select Tutorials &amp; Configure Sub Tutorials Tree
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Check the Main Tutorials to include in this condition.
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
                      {mainCriteria.subCriterias.length} Sub Tutorial
                      {mainCriteria.subCriterias.length === 1 ? "" : "s"}
                    </span>
                  </div>

                  {isSelected && isMainOpen && (
                    <div className="p-4 pl-6 space-y-3 border-t border-border">
                      {mainCriteria.subCriterias.map((sub) => (
                        <SubCriteriaConditionsPanel
                          key={sub.id}
                          mainCriteria={mainCriteria}
                          sub={sub}
                          isSubOpen={expandedSubIds[sub.id] ?? true}
                          subWeight={subCriteriaWeights[sub.id] ?? 0}
                          conditionRows={subCriteriaRatings[sub.id] ?? []}
                          onToggleSubExpand={toggleSubExpand}
                          onWeightChange={handleWeightChange}
                          onAddConditionRow={handleAddConditionRow}
                          onConditionChange={handleConditionChange}
                          onRemoveConditionRow={handleRemoveConditionRow}
                          onDecisionMarksChange={handleDecisionMarksChange}
                        />
                      ))}
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
            Save Condition
          </Button>
        </div>
      </div>

      <AllRatingsTableCard
        ratingMasters={ratingMasters}
        criterias={criterias}
        editingId={editingId}
        onEdit={handleEdit}
      />
    </div>
  );
}
