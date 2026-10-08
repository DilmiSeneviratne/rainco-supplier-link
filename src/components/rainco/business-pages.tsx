import { useState } from "react";
import { z } from "zod";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Download,
  FileText,
  Layers,
  ListOrdered,
  Mail,
  Paperclip,
  Printer,
  Save,
  Send,
  Star,
  Trash2,
  Upload,
  UserCheck,
  X,
} from "lucide-react";
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { AccessNotice, PageHeading, useWorkspace } from "./workspace";
import { Field } from "./registration";

const evaluationCriteriaRows = [
  {
    criteria: "Cost — Competitive Price",
    indication: "≤10%",
    score: 10,
    marks: 6,
  },
  {
    criteria: "Cost — Credit Period",
    indication: "120 days",
    score: 10,
    marks: 10,
  },
  {
    criteria: "Quality — Damage %- Incoming Inspection",
    indication: "≤1.5%",
    score: 10,
    marks: 6,
  },
  {
    criteria: "Quality — RM Stores Return Rate %- During the Process",
    indication: "≤0.5%",
    score: 10,
    marks: 10,
  },
  {
    criteria: "Quality — Corrective Actions",
    indication: "1",
    score: 10,
    marks: 8,
  },
  {
    criteria: "Supply — Supply on time (ETD Delay)",
    indication: "3-4 days",
    score: 10,
    marks: 6,
  },
  {
    criteria: "Supply — Ontime quantity (PO vs Delivery)",
    indication: "≤2%",
    score: 10,
    marks: 10,
  },
  {
    criteria: "Supply — Ordering to delivery lead time",
    indication: "L+5",
    score: 10,
    marks: 8,
  },
  {
    criteria: "Supply — Flexiblity to availability",
    indication: "<60%",
    score: 10,
    marks: 0,
  },
  {
    criteria: "Supply — MOQ",
    indication: "M",
    score: 10,
    marks: 10,
  },
];

export function Ratings() {
  const { role } = useWorkspace();
  if (role !== "supplier") return <AccessNotice audience="supplier" />;
  const totalScore = evaluationCriteriaRows.reduce((acc, r) => acc + r.score, 0);
  const totalMarks = evaluationCriteriaRows.reduce((acc, r) => acc + r.marks, 0);
  const percentage = totalScore > 0 ? Math.round((totalMarks / totalScore) * 100) : 0;
  return (
    <>
      <PageHeading eyebrow="SUPPLIER PORTAL" title="My Evaluation" />
      <div className="score-strip">
        <div className="big-score">
          {percentage}
          <small>%</small>
        </div>
        <div>
          <h2>
            Total Performance Score: {totalMarks} / {totalScore} ({percentage}%)
          </h2>
          <p>Performance Scorecard · Date Modified: 30-Apr-2023</p>
        </div>
        <span className="badge ml-auto">Published</span>
      </div>
      <div className="master-table">
        <table className="data-table">
          <thead>
            <tr>
              <th>Criteria &amp; Indication</th>
              <th>Score (Condition)</th>
              <th>Max Weight</th>
              <th>Points (%)</th>
            </tr>
          </thead>
          <tbody>
            {evaluationCriteriaRows.map((row) => (
              <tr key={row.criteria}>
                <td className="font-medium text-foreground">{row.criteria}</td>
                <td className="font-mono text-xs">{row.indication}</td>
                <td className="font-mono tabular-nums">{row.score}%</td>
                <td className="font-mono tabular-nums text-primary font-semibold">{row.marks}%</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border bg-muted/40 font-semibold">
              <td className="text-foreground" colSpan={2}>
                Total Performance Score
              </td>
              <td className="font-mono tabular-nums text-foreground">{totalScore}%</td>
              <td className="font-mono tabular-nums text-primary font-bold">{totalMarks}%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}
export function Evaluation() {
  const {
    role,
    suppliersList,
    ratingMasters,
    criterias,
    evaluations,
    submitEvaluationForApproval,
  } = useWorkspace();

  const buildSupplierInitialState = (
    supplierName: string,
    ratingId: string,
  ): {
    condMap: Record<string, string>;
    marksMap: Record<string, number>;
    from: string;
    to: string;
    rem: string;
  } => {
    const ratingObj = ratingMasters.find((r) => r.id === ratingId) ?? ratingMasters[0];
    const existingEval = evaluations.find((ev) => ev.supplierName === supplierName);
    const condMap: Record<string, string> = {};
    const marksMap: Record<string, number> = {};

    if (existingEval && existingEval.subCriteriaEntries && ratingObj) {
      existingEval.subCriteriaEntries.forEach((entry) => {
        const conds = ratingObj.subCriteriaRatings?.[entry.subId] ?? [];
        const matched = conds.find((c) => c.condition === entry.condition);
        if (matched) {
          condMap[entry.subId] = matched.id;
        }
        marksMap[entry.subId] = entry.marks;
      });
    }

    return {
      condMap,
      marksMap,
      from: existingEval?.fromDate ?? "2023-01-01",
      to: existingEval?.toDate ?? "2023-04-30",
      rem: existingEval?.remark ?? "Performance Scorecard evaluation (Date Modified: 30-Apr-2023).",
    };
  };

  const defaultSupplierName = suppliersList[0]?.name ?? "LEABON";
  const defaultRatingId = ratingMasters[0]?.id ?? "RAT-1";
  const initialEvalState = buildSupplierInitialState(defaultSupplierName, defaultRatingId);

  const [selectedSupplier, setSelectedSupplier] = useState(defaultSupplierName);
  const [selectedRatingId, setSelectedRatingId] = useState(defaultRatingId);
  const [fromDate, setFromDate] = useState(initialEvalState.from);
  const [toDate, setToDate] = useState(initialEvalState.to);
  const [expandedMainIds, setExpandedMainIds] = useState<Record<string, boolean>>({});
  const [selectedConditionBySub, setSelectedConditionBySub] = useState<Record<string, string>>(
    initialEvalState.condMap,
  );
  const [customMarksBySub, setCustomMarksBySub] = useState<Record<string, number>>(
    initialEvalState.marksMap,
  );
  const [message, setMessage] = useState("");
  const [remark, setRemark] = useState(initialEvalState.rem);

  if (role !== "rainco") return <AccessNotice audience="rainco" />;

  const selectedRating = ratingMasters.find((r) => r.id === selectedRatingId) ?? null;

  const activeMainCriterias = selectedRating
    ? criterias.filter((c) => (selectedRating.selectedCriteriaIds ?? []).includes(c.id))
    : [];

  const getSubScore = (subId: string): number => {
    if (!selectedRating) return 0;
    const weight = Number(selectedRating.subCriteriaWeights?.[subId] ?? 0);
    if (weight > 0) return weight;
    const conds = selectedRating.subCriteriaRatings?.[subId] ?? [];
    return conds.length > 0 ? Math.max(...conds.map((c) => Number(c.marks) || 0)) : 0;
  };

  const getSubMarks = (subId: string): number => {
    if (!selectedRating) return 0;
    if (customMarksBySub[subId] !== undefined) {
      return customMarksBySub[subId];
    }
    const conds = selectedRating.subCriteriaRatings?.[subId] ?? [];
    if (conds.length === 0) return 0;
    const chosenCondId = selectedConditionBySub[subId] ?? conds[0]?.id;
    const found = conds.find((c) => c.id === chosenCondId) ?? conds[0];
    return Number(found?.marks ?? 0);
  };

  const totalScore = activeMainCriterias.reduce(
    (sum, main) => sum + main.subCriterias.reduce((s, sub) => s + getSubScore(sub.id), 0),
    0,
  );

  const totalMarks = activeMainCriterias.reduce(
    (sum, main) => sum + main.subCriterias.reduce((s, sub) => s + getSubMarks(sub.id), 0),
    0,
  );

  const percentage = totalScore > 0 ? Math.round((totalMarks / totalScore) * 100) : 0;

  const feasibilityMainCriterias = activeMainCriterias.filter((m) => m.criteriaType === "Category");
  const desirabilityMainCriterias = activeMainCriterias.filter(
    (m) => m.criteriaType === "Performance",
  );

  const feasibilityTotalScore = feasibilityMainCriterias.reduce(
    (sum, main) => sum + main.subCriterias.reduce((s, sub) => s + getSubScore(sub.id), 0),
    0,
  );
  const feasibilityTotalMarks = feasibilityMainCriterias.reduce(
    (sum, main) => sum + main.subCriterias.reduce((s, sub) => s + getSubMarks(sub.id), 0),
    0,
  );
  const feasibilityScore =
    feasibilityTotalScore > 0
      ? Math.round((feasibilityTotalMarks / feasibilityTotalScore) * 100)
      : percentage;

  const desirabilityTotalScore = desirabilityMainCriterias.reduce(
    (sum, main) => sum + main.subCriterias.reduce((s, sub) => s + getSubScore(sub.id), 0),
    0,
  );
  const desirabilityTotalMarks = desirabilityMainCriterias.reduce(
    (sum, main) => sum + main.subCriterias.reduce((s, sub) => s + getSubMarks(sub.id), 0),
    0,
  );
  const desirabilityScore =
    desirabilityTotalScore > 0
      ? Math.round((desirabilityTotalMarks / desirabilityTotalScore) * 100)
      : percentage;

  const toggleExpandMain = (mainId: string) => {
    setExpandedMainIds((prev) => ({
      ...prev,
      [mainId]: !(prev[mainId] ?? true),
    }));
  };

  const handleRatingSelectChange = (newRatingId: string) => {
    setSelectedRatingId(newRatingId);
    const nextState = buildSupplierInitialState(selectedSupplier, newRatingId);
    setSelectedConditionBySub(nextState.condMap);
    setCustomMarksBySub(nextState.marksMap);
    setMessage("");
  };

  const handleSupplierChange = (newSupplier: string) => {
    setSelectedSupplier(newSupplier);
    const nextState = buildSupplierInitialState(newSupplier, selectedRatingId);
    setSelectedConditionBySub(nextState.condMap);
    setCustomMarksBySub(nextState.marksMap);
    setFromDate(nextState.from);
    setToDate(nextState.to);
    setRemark(nextState.rem);
    setMessage("");
  };

  const handleConditionSelect = (subId: string, condId: string, marks: number) => {
    setSelectedConditionBySub((prev) => ({ ...prev, [subId]: condId }));
    setCustomMarksBySub((prev) => ({ ...prev, [subId]: marks }));
  };

  const handleMarksInput = (subId: string, val: number) => {
    setCustomMarksBySub((prev) => ({ ...prev, [subId]: Math.max(0, val) }));
  };

  return (
    <>
      <PageHeading eyebrow="RAINCO PROCUREMENT" title="Evaluation Sheet" />

      <div className="form-section mb-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Field label="Supplier" required>
            <select value={selectedSupplier} onChange={(e) => handleSupplierChange(e.target.value)}>
              {suppliersList.map((s) => (
                <option key={s.registrationNo} value={s.name}>
                  {s.name} ({s.sapPartnerId})
                </option>
              ))}
            </select>
          </Field>

          <Field label="Rating" required>
            <select
              value={selectedRatingId}
              onChange={(e) => handleRatingSelectChange(e.target.value)}
            >
              <option value="">-- Select Rating --</option>
              {ratingMasters.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.code} · {r.name} ({r.supplierType})
                </option>
              ))}
            </select>
          </Field>

          <Field label="From Date" required>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="font-mono"
            />
          </Field>

          <Field label="To Date" required>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="font-mono"
            />
          </Field>
        </div>
      </div>

      {!selectedRating ? (
        <div className="master-table p-8 text-center text-xs text-muted-foreground">
          Select a <strong>Rating</strong> above to load the evaluation criteria tree, scores, and
          marks for <strong>{selectedSupplier}</strong>.
        </div>
      ) : (
        <>
          <div className="score-strip mb-5">
            <div className="big-score">
              {percentage}
              <small>%</small>
            </div>
            <div>
              <h2>
                Total Marks: {totalMarks} / {totalScore}
              </h2>
              <p>
                {selectedSupplier} · {selectedRating.code} ({selectedRating.name}) · Period:{" "}
                {fromDate || "—"} to {toDate || "—"}
              </p>
            </div>
            <span className="badge ml-auto">{selectedRating.supplierType} Rating</span>
          </div>

          <div className="form-section mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-foreground">
                  Evaluation Criteria Tree ({selectedRating.code} · {selectedRating.name})
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Loaded criterias, scores, and condition marks configured for the selected rating.
                </p>
              </div>
              <div className="inline-flex items-center gap-3 text-xs">
                <span className="px-2.5 py-1 rounded border border-border bg-muted/40 font-mono">
                  Total Score: <strong>{totalScore}</strong>
                </span>
                <span className="px-2.5 py-1 rounded border border-primary/30 bg-primary/10 text-primary font-mono">
                  Total Marks: <strong>{totalMarks}</strong>
                </span>
              </div>
            </div>

            {activeMainCriterias.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4">
                No criterias are assigned to this rating in Masters → Ratings.
              </p>
            ) : (
              <div className="space-y-3">
                {activeMainCriterias.map((mainCriteria) => {
                  const isMainOpen = expandedMainIds[mainCriteria.id] ?? true;
                  const mainScore = mainCriteria.subCriterias.reduce(
                    (s, sub) => s + getSubScore(sub.id),
                    0,
                  );
                  const mainMarks = mainCriteria.subCriterias.reduce(
                    (s, sub) => s + getSubMarks(sub.id),
                    0,
                  );

                  return (
                    <div
                      key={mainCriteria.id}
                      className="rounded-lg border border-border bg-card overflow-hidden"
                    >
                      {/* Main Criteria Node Header */}
                      <div className="w-full flex items-center justify-between px-3.5 py-2.5 bg-muted/50 text-left">
                        <button
                          type="button"
                          onClick={() => toggleExpandMain(mainCriteria.id)}
                          className="flex items-center gap-2 text-left hover:opacity-80 transition-opacity"
                        >
                          {isMainOpen ? (
                            <ChevronDown size={15} className="text-muted-foreground" />
                          ) : (
                            <ChevronRight size={15} className="text-muted-foreground" />
                          )}
                          <span className="font-mono text-xs text-primary font-semibold">
                            {mainCriteria.code}
                          </span>
                          <span className="text-xs font-semibold text-foreground">
                            {mainCriteria.name}
                          </span>
                          <span className="badge">{mainCriteria.criteriaType}</span>
                        </button>

                        <div className="flex items-center gap-4 text-xs font-mono">
                          <span className="text-muted-foreground">
                            Score: <strong className="text-foreground">{mainScore}</strong>
                          </span>
                          <span className="text-primary">
                            Marks: <strong>{mainMarks}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Sub Criterias Table inside Main Criteria */}
                      {isMainOpen && (
                        <div className="p-3 pl-6 border-t border-border bg-background/50">
                          <div className="overflow-x-auto rounded border border-border">
                            <table className="data-table">
                              <thead>
                                <tr>
                                  <th className="w-28">Sub Code</th>
                                  <th>Sub Criteria</th>
                                  <th className="w-28">Data Type</th>
                                  <th>Evaluation Condition</th>
                                  <th className="w-28 text-right">Score</th>
                                  <th className="w-32 text-right">Marks</th>
                                </tr>
                              </thead>
                              <tbody>
                                {mainCriteria.subCriterias.map((sub) => {
                                  const conditions =
                                    selectedRating.subCriteriaRatings?.[sub.id] ?? [];
                                  const chosenCondId =
                                    selectedConditionBySub[sub.id] ?? conditions[0]?.id ?? "";
                                  const score = getSubScore(sub.id);
                                  const marks = getSubMarks(sub.id);

                                  return (
                                    <tr key={sub.id}>
                                      <td className="font-mono text-xs text-primary font-medium">
                                        {sub.code}
                                      </td>
                                      <td className="font-medium text-foreground text-xs">
                                        {sub.indication}
                                      </td>
                                      <td>
                                        <span className="badge">{sub.criteriaValue}</span>
                                      </td>
                                      <td>
                                        {conditions.length > 0 ? (
                                          <select
                                            className="grid-input text-xs font-mono"
                                            value={chosenCondId}
                                            onChange={(e) => {
                                              const cond = conditions.find(
                                                (c) => c.id === e.target.value,
                                              );
                                              if (cond) {
                                                handleConditionSelect(
                                                  sub.id,
                                                  cond.id,
                                                  Number(cond.marks) || 0,
                                                );
                                              }
                                            }}
                                          >
                                            {conditions.map((c) => (
                                              <option key={c.id} value={c.id}>
                                                {c.condition || "Default"} ({c.marks} marks)
                                              </option>
                                            ))}
                                          </select>
                                        ) : (
                                          <span className="text-xs text-muted-foreground">
                                            No conditions configured
                                          </span>
                                        )}
                                      </td>
                                      <td className="text-right font-mono tabular-nums text-xs font-semibold text-foreground">
                                        {score}
                                      </td>
                                      <td className="text-right">
                                        <input
                                          type="number"
                                          min={0}
                                          max={score > 0 ? score : undefined}
                                          aria-label={`${sub.indication} marks`}
                                          className="grid-input font-mono tabular-nums text-right w-24 ml-auto text-primary font-semibold"
                                          value={marks}
                                          onChange={(e) =>
                                            handleMarksInput(sub.id, Number(e.target.value))
                                          }
                                        />
                                      </td>
                                    </tr>
                                  );
                                })}
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
        </>
      )}

      <Field label="Evaluation remarks">
        <textarea maxLength={1000} value={remark} onChange={(e) => setRemark(e.target.value)} />
      </Field>
      <div className="action-footer">
        <small>
          Supplier evaluation for {selectedSupplier} ({fromDate || "—"} to {toDate || "—"})
        </small>
        <Button
          onClick={() => {
            if (!selectedRating) {
              setMessage("Please select a Rating before saving the evaluation.");
              return;
            }
            if (!fromDate || !toDate) {
              setMessage("Please specify both From Date and To Date.");
              return;
            }
            const subCriteriaEntries = activeMainCriterias.flatMap((main) =>
              main.subCriterias.map((sub) => {
                const conds = selectedRating.subCriteriaRatings?.[sub.id] ?? [];
                const chosenCondId = selectedConditionBySub[sub.id] ?? conds[0]?.id ?? "";
                const foundCond = conds.find((c) => c.id === chosenCondId) ?? conds[0];
                return {
                  mainId: main.id,
                  mainCode: main.code,
                  mainName: main.name,
                  criteriaType: main.criteriaType,
                  subId: sub.id,
                  subCode: sub.code,
                  subIndication: sub.indication,
                  criteriaValue: sub.criteriaValue,
                  condition: foundCond?.condition || "Default",
                  score: getSubScore(sub.id),
                  marks: getSubMarks(sub.id),
                };
              }),
            );
            const created = submitEvaluationForApproval({
              supplierName: selectedSupplier,
              ratingId: selectedRating.id,
              ratingCode: selectedRating.code,
              ratingName: selectedRating.name,
              fromDate,
              toDate,
              totalScore,
              totalMarks,
              percentage,
              feasibilityScore,
              desirabilityScore,
              remark,
              subCriteriaEntries,
            });
            setMessage(
              `Evaluation ${created.id} submitted for ${selectedSupplier}. Supplier Master Data rating automatically updated to ${percentage}% (${totalMarks} / ${totalScore}) and sent to the Approval Queue.`,
            );
          }}
        >
          <Save />
          Submit Evaluation for Approval
        </Button>
      </div>
      {message && (
        <div className="notice success" role="status">
          {message}
        </div>
      )}

      {/* Submitted Evaluations & Approval Status Table */}
      <div className="rounded-lg border border-border bg-card p-6 mt-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">
            Submitted Evaluations &amp; Approval Status
          </h2>
          <span className="text-xs font-mono text-muted-foreground">
            Total Evaluations: {evaluations.length}
          </span>
        </div>

        <div className="overflow-x-auto rounded border border-border">
          <table className="data-table">
            <thead>
              <tr>
                <th>Evaluation ID</th>
                <th>Supplier</th>
                <th>Rating</th>
                <th>Period</th>
                <th className="text-right">Feasibility Score</th>
                <th className="text-right">Desirability Score</th>
                <th className="text-right">Marks / Score</th>
                <th className="w-36 text-center">Approval Status</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.map((ev) => (
                <tr key={ev.id}>
                  <td className="font-mono text-xs text-primary font-medium">{ev.id}</td>
                  <td className="font-medium text-foreground">{ev.supplierName}</td>
                  <td className="text-xs">
                    <span className="font-mono text-primary">{ev.ratingCode}</span> ·{" "}
                    {ev.ratingName}
                  </td>
                  <td className="font-mono text-xs text-muted-foreground">
                    {ev.fromDate} to {ev.toDate}
                  </td>
                  <td className="text-right font-mono tabular-nums text-xs text-foreground">
                    {ev.feasibilityScore}%
                  </td>
                  <td className="text-right font-mono tabular-nums text-xs text-foreground">
                    {ev.desirabilityScore}%
                  </td>
                  <td className="text-right font-mono tabular-nums text-xs font-semibold">
                    <span className="text-primary">{ev.totalMarks}</span> / {ev.totalScore} (
                    {ev.percentage}%)
                  </td>
                  <td className="text-center">
                    <span
                      className={`badge text-[10px] ${
                        ev.approvalStatus === "Approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : ev.approvalStatus === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "pending"
                      }`}
                    >
                      {ev.approvalStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {evaluations.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-xs text-muted-foreground py-6">
                    No evaluations submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export function EvaluationChartPage() {
  const { role, suppliersList, evaluations } = useWorkspace();
  const [filterSupplier, setFilterSupplier] = useState("ALL");

  if (role !== "rainco") return <AccessNotice audience="rainco" />;

  const getGradeInfo = (rating: number) => {
    if (rating >= 85) {
      return { grade: "A" as const, gradId: "url(#bubbleGradA)", color: "#16a34a" };
    }
    if (rating >= 70) {
      return { grade: "B" as const, gradId: "url(#bubbleGradB)", color: "#84cc16" };
    }
    if (rating >= 55) {
      return { grade: "C" as const, gradId: "url(#bubbleGradC)", color: "#eab308" };
    }
    if (rating >= 40) {
      return { grade: "D" as const, gradId: "url(#bubbleGradD)", color: "#ef4444" };
    }
    return { grade: "E" as const, gradId: "url(#bubbleGradE)", color: "#1f2937" };
  };

  const chartData = suppliersList
    .filter((s) => (filterSupplier === "ALL" ? true : s.name === filterSupplier))
    .map((s) => {
      const latestEval = evaluations.find((ev) => ev.supplierName === s.name);
      const feasibility =
        s.feasibilityScore ?? latestEval?.feasibilityScore ?? s.evaluationPercentage ?? 0;
      const desirability =
        s.desirabilityScore ?? latestEval?.desirabilityScore ?? s.evaluationPercentage ?? 0;
      const overallRating = s.evaluationPercentage ?? latestEval?.percentage ?? 0;
      const evalResults =
        s.evaluationMarks !== undefined && s.evaluationScore !== undefined
          ? `${s.evaluationMarks} / ${s.evaluationScore}`
          : latestEval
            ? `${latestEval.totalMarks} / ${latestEval.totalScore}`
            : "Not Evaluated";

      const gradeInfo = getGradeInfo(overallRating);
      const shortName =
        s.name.length > 18
          ? s.name.split(" ").slice(0, 2).join(" ").toUpperCase()
          : s.name.toUpperCase();

      return {
        supplierCode: s.sapPartnerId,
        supplierName: s.name,
        shortLabel: shortName,
        feasibilityScore: feasibility,
        desirabilityScore: desirability,
        rating: overallRating,
        bubbleSize: Math.max(35, overallRating),
        grade: gradeInfo.grade,
        gradId: gradeInfo.gradId,
        color: gradeInfo.color,
        evaluationResults: evalResults,
      };
    });

  return (
    <>
      <PageHeading eyebrow="RAINCO PROCUREMENT" title="Evaluation Chart" />

      <div className="rounded-lg border border-border bg-card p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-3 border-b border-border">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Supplier Evaluation Chart</h2>
          </div>
          <div className="w-full sm:w-72">
            <Field label="Filter by Supplier">
              <select value={filterSupplier} onChange={(e) => setFilterSupplier(e.target.value)}>
                <option value="ALL">All Suppliers</option>
                {suppliersList.map((s) => (
                  <option key={s.sapPartnerId} value={s.name}>
                    {s.sapPartnerId} · {s.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        {/* Visual Bubble Diagram Container matching reference design */}
        <div
          className="rounded-lg border border-neutral-700 p-4 pt-6 pb-4 shadow-inner"
          style={{
            background: "radial-gradient(circle at 50% 45%, #4b4b4b 0%, #2b2b2b 100%)",
          }}
        >
          <div className="h-[440px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 28, right: 44, bottom: 38, left: 28 }}>
                <defs>
                  <radialGradient id="bubbleGradA" cx="35%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#bef264" />
                    <stop offset="55%" stopColor="#4d7c0f" />
                    <stop offset="100%" stopColor="#1a2e05" />
                  </radialGradient>
                  <radialGradient id="bubbleGradB" cx="35%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#d9f99d" />
                    <stop offset="55%" stopColor="#65a30d" />
                    <stop offset="100%" stopColor="#365314" />
                  </radialGradient>
                  <radialGradient id="bubbleGradC" cx="35%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="55%" stopColor="#ca8a04" />
                    <stop offset="100%" stopColor="#713f12" />
                  </radialGradient>
                  <radialGradient id="bubbleGradD" cx="35%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#fca5a5" />
                    <stop offset="55%" stopColor="#dc2626" />
                    <stop offset="100%" stopColor="#7f1d1d" />
                  </radialGradient>
                  <radialGradient id="bubbleGradE" cx="35%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#9ca3af" />
                    <stop offset="55%" stopColor="#374151" />
                    <stop offset="100%" stopColor="#111827" />
                  </radialGradient>
                  <filter id="bubbleShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.55" />
                  </filter>
                </defs>

                <CartesianGrid stroke="#6b7280" strokeOpacity={0.45} />

                <XAxis
                  type="number"
                  dataKey="desirabilityScore"
                  name="Desirability Score"
                  domain={[0, 100]}
                  tickCount={8}
                  stroke="#9ca3af"
                  tick={{ fill: "#d1d5db", fontSize: 11 }}
                  label={{
                    value: "DESIRABILITY SCORE",
                    position: "bottom",
                    offset: 14,
                    fill: "#d1d5db",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                  }}
                />

                <YAxis
                  type="number"
                  dataKey="feasibilityScore"
                  name="Feasibility Score"
                  domain={[0, 100]}
                  tickCount={7}
                  stroke="#9ca3af"
                  tick={{ fill: "#d1d5db", fontSize: 11 }}
                  label={{
                    value: "FEASIBILITY SCORE",
                    angle: -90,
                    position: "insideLeft",
                    offset: 4,
                    fill: "#d1d5db",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                  }}
                />

                <ZAxis type="number" dataKey="bubbleSize" range={[2200, 6500]} name="Rating" />

                <Tooltip
                  cursor={{ strokeDasharray: "3 3", stroke: "#9ca3af" }}
                  content={({ active, payload }) => {
                    if (!active || !payload || payload.length === 0) return null;
                    const item = payload[0].payload as (typeof chartData)[number];
                    return (
                      <div className="rounded-md border border-neutral-600 bg-neutral-900/95 text-neutral-100 p-3 shadow-xl text-xs space-y-1">
                        <div className="font-semibold text-white">
                          <span className="font-mono text-lime-400">{item.supplierCode}</span> ·{" "}
                          {item.supplierName}
                        </div>
                        <div className="font-mono text-neutral-300">
                          Desirability Score:{" "}
                          <strong className="text-white">{item.desirabilityScore}%</strong>
                        </div>
                        <div className="font-mono text-neutral-300">
                          Feasibility Score:{" "}
                          <strong className="text-white">{item.feasibilityScore}%</strong>
                        </div>
                        <div className="font-mono text-neutral-300">
                          Evaluation Results:{" "}
                          <strong className="text-white">{item.evaluationResults}</strong>
                        </div>
                        <div className="font-mono text-neutral-300">
                          Overall Rating:{" "}
                          <strong className="text-lime-400">
                            {item.rating}% (Grade {item.grade})
                          </strong>
                        </div>
                      </div>
                    );
                  }}
                />

                <Scatter
                  name="Suppliers"
                  data={chartData}
                  shape={(props: unknown) => {
                    const p = props as {
                      cx?: number;
                      cy?: number;
                      size?: number;
                      payload?: (typeof chartData)[number];
                    };
                    const cx = p.cx ?? 0;
                    const cy = p.cy ?? 0;
                    const payload = p.payload;
                    if (!payload) return <g />;
                    // Calculate radius proportional to rating (28px to 54px)
                    const radius = Math.max(28, Math.min(54, Math.round(payload.rating * 0.56)));
                    return (
                      <g className="cursor-pointer transition-transform hover:scale-105">
                        <circle
                          cx={cx}
                          cy={cy}
                          r={radius}
                          fill={payload.gradId}
                          stroke="rgba(255,255,255,0.28)"
                          strokeWidth={1.2}
                          filter="url(#bubbleShadow)"
                        />
                        <text
                          x={cx}
                          y={cy}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill="#ffffff"
                          fontSize={10}
                          fontWeight={700}
                          style={{
                            textShadow: "0 1px 3px rgba(0,0,0,0.85)",
                            pointerEvents: "none",
                          }}
                        >
                          {payload.shortLabel}
                        </text>
                      </g>
                    );
                  }}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Bottom Grade Legend (A B C D E) matching the reference diagram */}
          <div className="flex items-center justify-center gap-5 pt-2 pb-1 text-xs font-semibold text-neutral-200">
            <span className="inline-flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full inline-block shadow"
                style={{ background: "radial-gradient(circle at 35% 30%, #bef264, #15803d)" }}
              />
              A (&ge;85%)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full inline-block shadow"
                style={{ background: "radial-gradient(circle at 35% 30%, #d9f99d, #65a30d)" }}
              />
              B (70–84%)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full inline-block shadow"
                style={{ background: "radial-gradient(circle at 35% 30%, #fef08a, #ca8a04)" }}
              />
              C (55–69%)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full inline-block shadow"
                style={{ background: "radial-gradient(circle at 35% 30%, #fca5a5, #dc2626)" }}
              />
              D (40–54%)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full inline-block shadow border border-neutral-500"
                style={{ background: "radial-gradient(circle at 35% 30%, #6b7280, #111827)" }}
              />
              E (&lt;40%)
            </span>
          </div>
        </div>

        {/* Summary breakdown table under chart */}
        <div className="overflow-x-auto rounded border border-border">
          <table className="data-table">
            <thead>
              <tr>
                <th>Supplier Code</th>
                <th>Name</th>
                <th className="text-right">Desirability Score</th>
                <th className="text-right">Feasibility Score</th>
                <th className="text-right">Rating</th>
                <th className="text-center">Grade</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((item) => (
                <tr key={item.supplierCode}>
                  <td className="font-mono text-xs text-primary font-semibold">
                    {item.supplierCode}
                  </td>
                  <td className="font-medium text-foreground">{item.supplierName}</td>
                  <td className="text-right font-mono tabular-nums text-xs text-foreground">
                    {item.desirabilityScore}%
                  </td>
                  <td className="text-right font-mono tabular-nums text-xs text-foreground">
                    {item.feasibilityScore}%
                  </td>
                  <td className="text-right font-mono tabular-nums text-xs font-bold text-primary">
                    {item.rating}%
                  </td>
                  <td className="text-center">
                    <span className="badge font-mono font-bold">{item.grade}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function SupplierEvaluationReportSection({ standalone = false }: { standalone?: boolean }) {
  const { suppliersList, evaluations, systemUsers, updateSupplierMasterStatus } = useWorkspace();
  const [filterSupplier, setFilterSupplier] = useState("ALL");
  const [authorizedUser, setAuthorizedUser] = useState(
    systemUsers[0]?.fullName ?? "Sunil Jayawardena",
  );
  const [reportGenerated, setReportGenerated] = useState(true);
  const [actionNotice, setActionNotice] = useState<{
    text: string;
    tone: "success" | "error";
  } | null>(null);

  const reportRows = suppliersList
    .filter((s) => (filterSupplier === "ALL" ? true : s.name === filterSupplier))
    .map((s) => {
      const latestEval = evaluations.find((ev) => ev.supplierName === s.name);
      return {
        supplierCode: s.sapPartnerId,
        supplierName: s.name,
        evaluationResults:
          s.evaluationMarks !== undefined && s.evaluationScore !== undefined
            ? `${s.evaluationMarks} / ${s.evaluationScore}`
            : "Not Evaluated",
        feasibilityScore:
          s.feasibilityScore !== undefined
            ? `${s.feasibilityScore}%`
            : latestEval
              ? `${latestEval.feasibilityScore}%`
              : "—",
        desirabilityScore:
          s.desirabilityScore !== undefined
            ? `${s.desirabilityScore}%`
            : latestEval
              ? `${latestEval.desirabilityScore}%`
              : "—",
        rating: s.evaluationPercentage !== undefined ? `${s.evaluationPercentage}%` : "—",
        status: s.status,
        transactionBlocked:
          s.transactionBlocked || s.status === "Inactive" || s.status === "Blacklisted",
      };
    });

  const handleStatusAction = (
    supplierName: string,
    supplierCode: string,
    newStatus: "Active" | "Inactive" | "Blacklisted",
  ) => {
    updateSupplierMasterStatus(supplierName, newStatus, authorizedUser);
    if (newStatus === "Active") {
      setActionNotice({
        tone: "success",
        text: `Supplier Master Data for ${supplierCode} · ${supplierName} activated by ${authorizedUser}. All transaction levels (Purchase Quotations, Purchase Orders, GRN, and AP Invoicing) are enabled.`,
      });
    } else if (newStatus === "Inactive") {
      setActionNotice({
        tone: "error",
        text: `Supplier Master Data for ${supplierCode} · ${supplierName} marked as Inactive by ${authorizedUser}. Supplier has been automatically deactivated from all transaction levels (Purchase Quotations, Purchase Orders, GRN, and AP Invoicing).`,
      });
    } else {
      setActionNotice({
        tone: "error",
        text: `Supplier Master Data for ${supplierCode} · ${supplierName} Blacklisted by ${authorizedUser}. Supplier has been permanently blocked and deactivated from all transaction levels.`,
      });
    }
  };

  const handleExportCsv = () => {
    const headers = [
      "Supplier Code",
      "Name",
      "Evaluation results",
      "Rating",
      "Supplier Master Status",
    ];
    const csvLines = [
      headers.join(","),
      ...reportRows.map((r) =>
        [
          `"${r.supplierCode}"`,
          `"${r.supplierName}"`,
          `"${r.evaluationResults}"`,
          `"${r.rating}"`,
          `"${r.status}"`,
        ].join(","),
      ),
    ];
    const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "supplier-evaluation-result-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`rounded-lg border border-border bg-card p-6 space-y-5 ${standalone ? "" : "mt-6"}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-primary" />
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Supplier Evaluation Result Report
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => window.print()}
            className="h-7 text-xs gap-1.5"
          >
            <Printer size={13} />
            Print
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleExportCsv}
            className="h-7 text-xs gap-1.5"
          >
            <Download size={13} />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Report Filter & Authorised User Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <Field label="Filter by Supplier">
          <select value={filterSupplier} onChange={(e) => setFilterSupplier(e.target.value)}>
            <option value="ALL">All Suppliers</option>
            {suppliersList.map((s) => (
              <option key={s.sapPartnerId} value={s.name}>
                {s.sapPartnerId} · {s.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Authorised User">
          <select value={authorizedUser} onChange={(e) => setAuthorizedUser(e.target.value)}>
            {systemUsers
              .filter((u) => u.isActive)
              .map((u) => (
                <option key={u.id} value={u.fullName}>
                  {u.fullName} ({u.department})
                </option>
              ))}
          </select>
        </Field>

        <div>
          <Button
            type="button"
            size="sm"
            onClick={() => setReportGenerated(true)}
            className="w-full sm:w-auto gap-1.5"
          >
            <FileText size={14} />
            Generate Report
          </Button>
        </div>
      </div>

      {actionNotice && (
        <div
          className={`notice ${actionNotice.tone === "error" ? "error" : "success"}`}
          role="status"
        >
          {actionNotice.text}
        </div>
      )}

      {reportGenerated && (
        <div className="overflow-x-auto rounded border border-border">
          <table className="data-table">
            <thead>
              <tr>
                <th>Supplier Code</th>
                <th>Name</th>
                <th>Evaluation results</th>
                <th className="text-right">Rating</th>
                <th className="text-center">Master Status</th>
                <th className="text-right">Master Data Action</th>
              </tr>
            </thead>
            <tbody>
              {reportRows.map((row) => (
                <tr key={row.supplierCode + row.supplierName}>
                  <td className="font-mono text-xs text-primary font-semibold">
                    {row.supplierCode}
                  </td>
                  <td className="font-medium text-foreground">{row.supplierName}</td>
                  <td className="font-mono tabular-nums text-xs text-foreground">
                    {row.evaluationResults}
                  </td>
                  <td className="text-right font-mono tabular-nums text-xs font-bold text-primary">
                    {row.rating}
                  </td>
                  <td className="text-center">
                    <span
                      className={`badge text-[10px] ${
                        row.status === "Active"
                          ? "bg-emerald-100 text-emerald-800"
                          : row.status === "Inactive"
                            ? "bg-amber-100 text-amber-800"
                            : row.status === "Blacklisted"
                              ? "bg-red-100 text-red-800"
                              : "pending"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="inline-flex items-center justify-end gap-1.5">
                      <Button
                        type="button"
                        size="sm"
                        variant={row.status === "Active" ? "default" : "outline"}
                        disabled={row.status === "Active"}
                        onClick={() =>
                          handleStatusAction(row.supplierName, row.supplierCode, "Active")
                        }
                        className="h-6 text-[11px] px-2"
                      >
                        Activate
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={row.status === "Inactive"}
                        onClick={() =>
                          handleStatusAction(row.supplierName, row.supplierCode, "Inactive")
                        }
                        className="h-6 text-[11px] px-2 border-amber-500/40 text-amber-700 hover:bg-amber-500/10"
                      >
                        Make Inactive
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={row.status === "Blacklisted"}
                        onClick={() =>
                          handleStatusAction(row.supplierName, row.supplierCode, "Blacklisted")
                        }
                        className="h-6 text-[11px] px-2 border-destructive/40 text-destructive hover:bg-destructive/10"
                      >
                        Blacklist
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {reportRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-xs text-muted-foreground py-6">
                    No matching supplier evaluation records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function EvaluationReport() {
  const { role } = useWorkspace();
  if (role !== "rainco") return <AccessNotice audience="rainco" />;

  return (
    <>
      <PageHeading eyebrow="RAINCO PROCUREMENT" title="Supplier Evaluation Result Report" />
      <SupplierEvaluationReportSection standalone />
    </>
  );
}
type QuotationLineItem = {
  itemNo: string;
  itemName: string;
  requiredDate: string;
  requiredQuantity: number;
  uom: string;
  lastPurchasePrice: number;
  quotedDate: string;
  quotedQuantity: number;
  unitPrice: number;
  discount: number;
  taxCode: string;
};

type PurchaseQuotation = {
  id: string;
  issuedDate: string;
  requiredDate: string;
  status: "Awaiting Response" | "Updated";
  items: QuotationLineItem[];
  attachments: string[];
};

const taxCodes = ["VAT-18", "SVAT-0", "EXEMPT", "NBT-2"];

const initialQuotations: PurchaseQuotation[] = [
  {
    id: "PQ-2026-0042",
    issuedDate: "06 Oct 2026",
    requiredDate: "2026-10-15",
    status: "Awaiting Response",
    attachments: [],
    items: [
      {
        itemNo: "ITM-1001",
        itemName: "Polyester fabric · Navy",
        requiredDate: "2026-10-15",
        requiredQuantity: 500,
        uom: "m",
        lastPurchasePrice: 1220,
        quotedDate: "2026-10-14",
        quotedQuantity: 500,
        unitPrice: 1250,
        discount: 0,
        taxCode: "VAT-18",
      },
      {
        itemNo: "ITM-1002",
        itemName: "Waterproof canopy coating resin",
        requiredDate: "2026-10-15",
        requiredQuantity: 120,
        uom: "kg",
        lastPurchasePrice: 3350,
        quotedDate: "2026-10-15",
        quotedQuantity: 120,
        unitPrice: 3400,
        discount: 5,
        taxCode: "VAT-18",
      },
    ],
  },
  {
    id: "PQ-2026-0048",
    issuedDate: "08 Oct 2026",
    requiredDate: "2026-10-22",
    status: "Awaiting Response",
    attachments: [],
    items: [
      {
        itemNo: "ITM-2014",
        itemName: "Fiberglass umbrella ribs · 24 inch",
        requiredDate: "2026-10-22",
        requiredQuantity: 2000,
        uom: "pcs",
        lastPurchasePrice: 180,
        quotedDate: "2026-10-20",
        quotedQuantity: 2000,
        unitPrice: 185,
        discount: 2,
        taxCode: "SVAT-0",
      },
    ],
  },
];

export function Quotations() {
  const { role, supplier } = useWorkspace();
  const [quotations, setQuotations] = useState<PurchaseQuotation[]>(initialQuotations);
  const [activeQuotation, setActiveQuotation] = useState<PurchaseQuotation | null>(null);
  const [modalError, setModalError] = useState("");
  const [savedNotice, setSavedNotice] = useState("");

  if (role !== "supplier") return <AccessNotice audience="supplier" />;

  const handleOpenQuotation = (quotation: PurchaseQuotation) => {
    setActiveQuotation({
      ...quotation,
      items: quotation.items.map((item) => ({ ...item })),
      attachments: [...quotation.attachments],
    });
    setModalError("");
  };

  const handleUploadAttachments = (files: FileList | null) => {
    if (!activeQuotation || !files || files.length === 0) return;
    const uploadedNames = Array.from(files).map((f) => f.name);
    setActiveQuotation({
      ...activeQuotation,
      attachments: [
        ...activeQuotation.attachments,
        ...uploadedNames.filter((name) => !activeQuotation.attachments.includes(name)),
      ],
    });
  };

  const handleRemoveAttachment = (fileName: string) => {
    if (!activeQuotation) return;
    setActiveQuotation({
      ...activeQuotation,
      attachments: activeQuotation.attachments.filter((f) => f !== fileName),
    });
  };

  const handleDraftItemChange = <K extends keyof QuotationLineItem>(
    itemNo: string,
    field: K,
    value: QuotationLineItem[K],
  ) => {
    if (!activeQuotation) return;
    setActiveQuotation({
      ...activeQuotation,
      items: activeQuotation.items.map((item) =>
        item.itemNo === itemNo ? { ...item, [field]: value } : item,
      ),
    });
  };

  const handleUpdateQuotation = () => {
    if (!activeQuotation) return;

    const hasInvalid = activeQuotation.items.some(
      (item) =>
        !item.quotedDate ||
        item.quotedQuantity <= 0 ||
        item.unitPrice <= 0 ||
        item.discount < 0 ||
        item.discount > 100 ||
        !item.taxCode.trim(),
    );

    if (hasInvalid) {
      setModalError(
        "Please enter valid Quoted Date, Quoted Quantity (> 0), Unit Price (> 0), Discount (0–100%), and Tax Code for all items.",
      );
      return;
    }

    const updated: PurchaseQuotation = {
      ...activeQuotation,
      status: "Updated",
    };

    setQuotations((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
    setSavedNotice(`Quotation ${updated.id} updated successfully in this preview session.`);
    setActiveQuotation(null);
    setModalError("");
  };

  const isSupplierDeactivated =
    supplier.transactionBlocked ||
    supplier.status === "Inactive" ||
    supplier.status === "Blacklisted";

  return (
    <>
      <PageHeading eyebrow="SUPPLIER PORTAL" title="Purchase Quotations" />

      {isSupplierDeactivated && (
        <div className="notice error mb-5" role="alert">
          <strong>Supplier Account {supplier.status}:</strong> Your Supplier Master Data has been
          marked as <strong>{supplier.status}</strong> based on the Supplier Evaluation Result
          Report. Your account is deactivated across all transaction levels (Purchase Quotations,
          Purchase Orders, GRN, and AP Invoicing).
        </div>
      )}

      <div className="master-table table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>Quotation No.</th>
              <th>Issued Date</th>
              <th>Status</th>
              <th className="w-28 text-right" />
            </tr>
          </thead>
          <tbody>
            {quotations.map((quotation) => (
              <tr key={quotation.id}>
                <td className="text-primary font-mono font-medium">{quotation.id}</td>
                <td>{quotation.issuedDate}</td>
                <td>
                  <span
                    className={`badge ${
                      isSupplierDeactivated
                        ? "bg-red-100 text-red-800"
                        : quotation.status === "Updated"
                          ? ""
                          : "pending"
                    }`}
                  >
                    {isSupplierDeactivated ? `Blocked (${supplier.status})` : quotation.status}
                  </span>
                </td>
                <td className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isSupplierDeactivated}
                    onClick={() => handleOpenQuotation(quotation)}
                  >
                    {isSupplierDeactivated ? "Deactivated" : "View"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {savedNotice && (
        <div className="notice success" role="status">
          {savedNotice}
        </div>
      )}

      {activeQuotation && (
        <div className="modal-backdrop">
          <div
            className="modal !max-w-5xl"
            role="dialog"
            aria-modal="true"
            aria-label={`Quotation ${activeQuotation.id}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <h2 className="!mb-0">{activeQuotation.id}</h2>
                <span className={`badge ${activeQuotation.status === "Updated" ? "" : "pending"}`}>
                  {activeQuotation.status}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close quotation"
                onClick={() => setActiveQuotation(null)}
              >
                <X />
              </Button>
            </div>

            {/* Header Level Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <Field label="Vendor Name">
                <input type="text" value={supplier.name} readOnly className="bg-muted/50" />
              </Field>
              <Field label="Required Date">
                <input
                  type="date"
                  value={activeQuotation.requiredDate}
                  readOnly
                  className="bg-muted/50 font-mono"
                />
              </Field>
            </div>

            {/* Items Grid */}
            <div className="overflow-x-auto rounded border border-border">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Item No</th>
                    <th>Item Name</th>
                    <th>Required Date</th>
                    <th className="text-right">Required Quantity</th>
                    <th>UOM</th>
                    <th className="text-right">Last Purchase Price</th>
                    <th>Quoted Date</th>
                    <th>Quoted Quantity</th>
                    <th>Unit Price</th>
                    <th>Discount (%)</th>
                    <th>Tax Code</th>
                  </tr>
                </thead>
                <tbody>
                  {activeQuotation.items.map((item) => (
                    <tr key={item.itemNo}>
                      <td className="font-mono text-xs text-primary font-medium">{item.itemNo}</td>
                      <td className="font-medium text-foreground">{item.itemName}</td>
                      <td className="font-mono text-xs text-muted-foreground">
                        {item.requiredDate}
                      </td>
                      <td className="text-right font-mono tabular-nums">{item.requiredQuantity}</td>
                      <td className="font-mono text-xs">{item.uom}</td>
                      <td className="text-right font-mono tabular-nums text-muted-foreground">
                        {item.lastPurchasePrice.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td>
                        <input
                          type="date"
                          aria-label={`${item.itemNo} quoted date`}
                          className="grid-input font-mono text-xs min-w-34"
                          value={item.quotedDate}
                          onChange={(e) =>
                            handleDraftItemChange(item.itemNo, "quotedDate", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min={1}
                          aria-label={`${item.itemNo} quoted quantity`}
                          className="grid-input font-mono tabular-nums w-24"
                          value={item.quotedQuantity}
                          onChange={(e) =>
                            handleDraftItemChange(
                              item.itemNo,
                              "quotedQuantity",
                              Number(e.target.value),
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min={0.01}
                          step="0.01"
                          aria-label={`${item.itemNo} unit price`}
                          className="grid-input font-mono tabular-nums w-28"
                          value={item.unitPrice}
                          onChange={(e) =>
                            handleDraftItemChange(item.itemNo, "unitPrice", Number(e.target.value))
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          step="0.1"
                          aria-label={`${item.itemNo} discount`}
                          className="grid-input font-mono tabular-nums w-20"
                          value={item.discount}
                          onChange={(e) =>
                            handleDraftItemChange(item.itemNo, "discount", Number(e.target.value))
                          }
                        />
                      </td>
                      <td>
                        <select
                          aria-label={`${item.itemNo} tax code`}
                          className="grid-input font-mono text-xs min-w-28"
                          value={item.taxCode}
                          onChange={(e) =>
                            handleDraftItemChange(item.itemNo, "taxCode", e.target.value)
                          }
                        >
                          {taxCodes.map((code) => (
                            <option key={code} value={code}>
                              {code}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Attachments Upload Section */}
            <div className="mt-5 pt-4 border-t border-border space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Paperclip size={14} className="text-primary" />
                  Attachments
                </h3>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-border bg-card hover:bg-muted text-xs font-medium text-foreground cursor-pointer transition-colors">
                  <Upload size={13} className="text-primary" />
                  <span>Upload Attachment</span>
                  <input
                    type="file"
                    multiple
                    aria-label="Upload quotation attachment"
                    className="hidden"
                    onChange={(e) => {
                      handleUploadAttachments(e.target.files);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>

              {activeQuotation.attachments.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {activeQuotation.attachments.map((fileName) => (
                    <div
                      key={fileName}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-border bg-muted/40 text-xs"
                    >
                      <Paperclip size={12} className="text-primary shrink-0" />
                      <span className="font-mono text-foreground truncate max-w-60">
                        {fileName}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(fileName)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        title={`Remove ${fileName}`}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No attachments uploaded.</p>
              )}
            </div>

            {modalError && <div className="notice error">{modalError}</div>}

            <div className="modal-actions">
              <Button variant="outline" onClick={() => setActiveQuotation(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateQuotation}>
                <Save />
                Update quotation
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export function Invitations() {
  const { role } = useWorkspace();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  if (role !== "rainco") return <AccessNotice audience="rainco" />;
  return (
    <>
      <PageHeading eyebrow="RAINCO PROCUREMENT" title="Supplier Invitations" />
      <div className="max-w-xl">
        <div className="p-4 rounded-lg border border-border bg-muted/40 mb-5 text-xs text-muted-foreground space-y-2">
          <p className="font-medium text-foreground">Automated Email Workflow Note:</p>
          <p>
            Invitation emails now directly include the secure onboarding link (
            <code>/register</code>). When a supplier opens the link, it launches the registration
            interface, validates their documents, and directs them to login and the supplier portal
            dashboard.
          </p>
          <div className="pt-2">
            <Button asChild size="sm" variant="outline" className="text-xs">
              <a href="/register">Test Email Invitation Link (/register)</a>
            </Button>
          </div>
        </div>

        <Field label="Supplier name" required>
          <input
            maxLength={200}
            value={name}
            placeholder="Company or individual name"
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <div className="mt-5">
          <Field label="Email" required>
            <input
              type="email"
              maxLength={255}
              value={email}
              placeholder="supplier@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
        </div>
        <div className="action-footer">
          <small>Automated email invitation dispatcher</small>
          <Button
            onClick={() => {
              if (
                !z
                  .object({
                    name: z.string().trim().min(1).max(200),
                    email: z.string().email().max(255),
                  })
                  .safeParse({ name, email }).success
              ) {
                setMessage("Enter a supplier name and a valid email address.");
                setSent(false);
                return;
              }
              setMessage(`Invitation email prepared for ${email}. Link: /register`);
              setSent(true);
            }}
          >
            <Mail />
            Prepare invitation email
          </Button>
        </div>
        {message && (
          <div className={`notice ${sent ? "success" : "error"}`} role="status">
            {message}
          </div>
        )}
        {sent && (
          <div className="form-section p-6">
            <div className="flex gap-2 items-center text-primary">
              <Check size={16} />
              <strong className="text-xs">Invitation email preview</strong>
            </div>
            <h2 className="mt-5 text-lg">Welcome to Rainco, {name}</h2>
            <p className="text-xs text-muted-foreground my-4">
              You have been invited to register as a Rainco supplier via email link.
            </p>
            <Button asChild size="sm">
              <a href="/register">Open registration link (/register)</a>
            </Button>
            <p className="text-[10px] text-muted-foreground mt-4">
              Automated invitation link · Once registered, redirects to login
            </p>
          </div>
        )}
      </div>
    </>
  );
}
