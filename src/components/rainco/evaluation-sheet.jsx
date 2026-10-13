import { useState } from "react";
import { ChevronDown, ChevronRight, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccessNotice, PageHeading, useWorkspace } from "./workspace";
import { Field } from "./registration";
function EvaluationHeaderFilters({
  suppliersList,
  ratingMasters,
  selectedSupplier,
  selectedRatingId,
  fromDate,
  toDate,
  onSupplierChange,
  onRatingChange,
  onFromDateChange,
  onToDateChange,
}) {
  return (
    <div className="form-section mb-6 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Field label="Supplier" required>
          <select value={selectedSupplier} onChange={(e) => onSupplierChange(e.target.value)}>
            {suppliersList.map((s) => (
              <option key={s.registrationNo} value={s.name}>
                {s.name} ({s.sapPartnerId})
              </option>
            ))}
          </select>
        </Field>

        <Field label="Condition" required>
          <select value={selectedRatingId} onChange={(e) => onRatingChange(e.target.value)}>
            <option value="">-- Select Condition --</option>
            {ratingMasters
              .filter((r) => r.isActive !== false || r.id === selectedRatingId)
              .map((r) => (
                <option key={r.id} value={r.id}>
                  {r.code} · {r.name} ({r.supplierType}){r.isActive === false ? " · Inactive" : ""}
                </option>
              ))}
          </select>
        </Field>

        <Field label="From Date" required>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => onFromDateChange(e.target.value)}
            className="font-mono"
          />
        </Field>

        <Field label="To Date" required>
          <input
            type="date"
            value={toDate}
            onChange={(e) => onToDateChange(e.target.value)}
            className="font-mono"
          />
        </Field>
      </div>
    </div>
  );
}
function EvaluationCriteriaTreeCard({
  selectedRating,
  activeMainCriterias,
  expandedMainIds,
  selectedConditionBySub,
  totalScore,
  totalMarks,
  getSubScore,
  getSubMarks,
  onToggleExpandMain,
  onConditionSelect,
  onMarksInput,
}) {
  return (
    <div className="form-section mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold text-foreground">
            Evaluation Tutorials Tree ({selectedRating.code} · {selectedRating.name})
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Loaded tutorials, scores, and condition marks configured for the selected condition.
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
          No tutorials are assigned to this condition in Masters → Conditions.
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
                <div className="w-full flex items-center justify-between px-3.5 py-2.5 bg-muted/50 text-left">
                  <button
                    type="button"
                    onClick={() => onToggleExpandMain(mainCriteria.id)}
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
                            const conditions = selectedRating.subCriteriaRatings?.[sub.id] ?? [];
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
                                          onConditionSelect(
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
                                    onChange={(e) => onMarksInput(sub.id, Number(e.target.value))}
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
  );
}
function SubmittedEvaluationsTable({ evaluations }) {
  return (
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
              <th>Condition</th>
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
                  <span className="font-mono text-primary">{ev.ratingCode}</span> · {ev.ratingName}
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
  const buildSupplierInitialState = (supplierName, ratingId) => {
    const ratingObj = ratingMasters.find((r) => r.id === ratingId) ?? ratingMasters[0];
    const existingEval = evaluations.find((ev) => ev.supplierName === supplierName);
    const condMap = {};
    const marksMap = {};
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
  const [expandedMainIds, setExpandedMainIds] = useState({});
  const [selectedConditionBySub, setSelectedConditionBySub] = useState(initialEvalState.condMap);
  const [customMarksBySub, setCustomMarksBySub] = useState(initialEvalState.marksMap);
  const [message, setMessage] = useState("");
  const [remark, setRemark] = useState(initialEvalState.rem);
  if (role !== "rainco") return <AccessNotice audience="rainco" />;
  const selectedRating = ratingMasters.find((r) => r.id === selectedRatingId) ?? null;
  const activeMainCriterias = selectedRating
    ? criterias.filter((c) => (selectedRating.selectedCriteriaIds ?? []).includes(c.id))
    : [];
  const getSubScore = (subId) => {
    if (!selectedRating) return 0;
    const weight = Number(selectedRating.subCriteriaWeights?.[subId] ?? 0);
    if (weight > 0) return weight;
    const conds = selectedRating.subCriteriaRatings?.[subId] ?? [];
    return conds.length > 0 ? Math.max(...conds.map((c) => Number(c.marks) || 0)) : 0;
  };
  const getSubMarks = (subId) => {
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
  const feasibilityMainCriterias = activeMainCriterias.filter(
    (m) => m.criteriaType?.toLowerCase() === "feasibility" || m.criteriaType === "Category",
  );
  const desirabilityMainCriterias = activeMainCriterias.filter(
    (m) => m.criteriaType?.toLowerCase() === "desirability" || m.criteriaType === "Performance",
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
  const toggleExpandMain = (mainId) => {
    setExpandedMainIds((prev) => ({
      ...prev,
      [mainId]: !(prev[mainId] ?? true),
    }));
  };
  const handleRatingSelectChange = (newRatingId) => {
    setSelectedRatingId(newRatingId);
    const nextState = buildSupplierInitialState(selectedSupplier, newRatingId);
    setSelectedConditionBySub(nextState.condMap);
    setCustomMarksBySub(nextState.marksMap);
    setMessage("");
  };
  const handleSupplierChange = (newSupplier) => {
    setSelectedSupplier(newSupplier);
    const nextState = buildSupplierInitialState(newSupplier, selectedRatingId);
    setSelectedConditionBySub(nextState.condMap);
    setCustomMarksBySub(nextState.marksMap);
    setFromDate(nextState.from);
    setToDate(nextState.to);
    setRemark(nextState.rem);
    setMessage("");
  };
  const handleConditionSelect = (subId, condId, marks) => {
    setSelectedConditionBySub((prev) => ({ ...prev, [subId]: condId }));
    setCustomMarksBySub((prev) => ({ ...prev, [subId]: marks }));
  };
  const handleMarksInput = (subId, val) => {
    setCustomMarksBySub((prev) => ({ ...prev, [subId]: Math.max(0, val) }));
  };
  return (
    <>
      <PageHeading eyebrow="RAINCO PROCUREMENT" title="Evaluation Sheet" />

      <EvaluationHeaderFilters
        suppliersList={suppliersList}
        ratingMasters={ratingMasters}
        selectedSupplier={selectedSupplier}
        selectedRatingId={selectedRatingId}
        fromDate={fromDate}
        toDate={toDate}
        onSupplierChange={handleSupplierChange}
        onRatingChange={handleRatingSelectChange}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
      />

      {!selectedRating ? (
        <div className="master-table p-8 text-center text-xs text-muted-foreground">
          Select a <strong>Condition</strong> above to load the evaluation tutorials tree, scores,
          and marks for <strong>{selectedSupplier}</strong>.
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
            <span className="badge ml-auto">{selectedRating.supplierType} Condition</span>
          </div>

          <EvaluationCriteriaTreeCard
            selectedRating={selectedRating}
            activeMainCriterias={activeMainCriterias}
            expandedMainIds={expandedMainIds}
            selectedConditionBySub={selectedConditionBySub}
            totalScore={totalScore}
            totalMarks={totalMarks}
            getSubScore={getSubScore}
            getSubMarks={getSubMarks}
            onToggleExpandMain={toggleExpandMain}
            onConditionSelect={handleConditionSelect}
            onMarksInput={handleMarksInput}
          />
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
              setMessage("Please select a Condition before saving the evaluation.");
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

      <SubmittedEvaluationsTable evaluations={evaluations} />
    </>
  );
}
