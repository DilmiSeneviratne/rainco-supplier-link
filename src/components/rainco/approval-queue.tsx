import { useState } from "react";
import { Check, CheckCircle2, Layers, ShieldCheck, X, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AccessNotice,
  PageHeading,
  useWorkspace,
  type ApprovalProcessType,
  type BusinessType,
  type CriteriaMasterRow,
  type DocumentRow,
  type RatingMasterRow,
  type RegisteredSupplier,
  type StageApprovalStatus,
  type SupplierApprovalProcess,
  type SupplierEvaluationRecord,
} from "./workspace";

function SupplierRegistrationReviewCard({
  activeProcess,
  suppliersList,
  documents,
}: {
  activeProcess: SupplierApprovalProcess;
  suppliersList: RegisteredSupplier[];
  documents: Record<BusinessType, DocumentRow[]>;
}) {
  const matchedSupplier =
    suppliersList.find(
      (s) => s.registrationNo === activeProcess.targetId || s.name === activeProcess.supplierName,
    ) ?? suppliersList[0];

  if (!matchedSupplier) {
    return <p className="text-muted-foreground">No registration details found for this supplier.</p>;
  }

  const requiredDocs = documents[matchedSupplier.businessType] ?? [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-3.5 rounded border border-border bg-card">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
            Supplier Name
          </span>
          <strong className="text-foreground font-medium">{matchedSupplier.name}</strong>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
            SAP BP ID / Reg. No
          </span>
          <span className="font-mono text-primary font-medium">
            {matchedSupplier.sapPartnerId} · {matchedSupplier.registrationNo}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
            Business Type &amp; Currency
          </span>
          <span className="text-foreground">
            {matchedSupplier.businessType} ({matchedSupplier.currency})
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
            Email Address
          </span>
          <span className="text-foreground">{matchedSupplier.email}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
            Phone Number
          </span>
          <span className="font-mono text-foreground">{matchedSupplier.phone}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
            Contacts &amp; Portal Username
          </span>
          <span className="font-mono text-foreground">
            {matchedSupplier.contactsCount} Contacts · @{matchedSupplier.username}
          </span>
        </div>
        {matchedSupplier.remark && (
          <div className="sm:col-span-2 md:col-span-3 pt-2 border-t border-border">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
              Registration Remarks
            </span>
            <span className="text-muted-foreground">{matchedSupplier.remark}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-foreground">
            Submitted Checklist Documents ({matchedSupplier.documentsAttached} /{" "}
            {matchedSupplier.totalDocumentsRequired})
          </span>
          <span className="badge text-[10px]">{matchedSupplier.businessType} Checklist</span>
        </div>
        <div className="overflow-x-auto rounded border border-border bg-card">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-28">Doc Code</th>
                <th>Document Name</th>
                <th className="w-32 text-center">Verification</th>
              </tr>
            </thead>
            <tbody>
              {requiredDocs.map((doc) => (
                <tr key={doc.code}>
                  <td className="font-mono text-xs text-primary">{doc.code}</td>
                  <td className="font-medium text-foreground">{doc.name}</td>
                  <td className="text-center">
                    <span className="badge bg-emerald-100 text-emerald-800 text-[10px]">
                      Attached
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function RatingsMasterReviewCard({
  activeProcess,
  ratingMasters,
  criterias,
}: {
  activeProcess: SupplierApprovalProcess;
  ratingMasters: RatingMasterRow[];
  criterias: CriteriaMasterRow[];
}) {
  const matchedRating =
    ratingMasters.find((r) => r.id === activeProcess.targetId) ??
    ratingMasters.find((r) => activeProcess.supplierName.includes(r.code)) ??
    ratingMasters[0];

  if (!matchedRating) {
    return <p className="text-muted-foreground">No rating configuration details found.</p>;
  }

  const chosenCriterias = criterias.filter((c) =>
    (matchedRating.selectedCriteriaIds ?? []).includes(c.id),
  );
  const totalWeight = Object.values(matchedRating.subCriteriaWeights ?? {}).reduce(
    (sum, w) => sum + (Number(w) || 0),
    0,
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 rounded border border-border bg-card">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
            Rate Code
          </span>
          <strong className="font-mono text-primary">{matchedRating.code}</strong>
        </div>
        <div className="sm:col-span-2">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
            Rate Name
          </span>
          <strong className="text-foreground">{matchedRating.name}</strong>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
            Supplier Type &amp; Weightage
          </span>
          <span className="font-mono text-foreground">
            {matchedRating.supplierType} · {totalWeight}%
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        <span className="font-semibold text-foreground block">
          Configured Criterias, Sub-Criteria Weightages &amp; Condition Marks
        </span>
        {chosenCriterias.map((main) => (
          <div key={main.id} className="rounded border border-border bg-card overflow-hidden">
            <div className="px-3 py-2 bg-muted/40 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-primary font-semibold">{main.code}</span>
                <strong className="text-foreground">{main.name}</strong>
                <span className="badge text-[9px]">{main.criteriaType}</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="w-24">Sub Code</th>
                    <th>Sub Criteria</th>
                    <th className="w-24">Data Type</th>
                    <th className="w-28 text-right">Weightage</th>
                    <th>Configured Conditions &amp; Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {main.subCriterias.map((sub) => {
                    const weight = matchedRating.subCriteriaWeights?.[sub.id] ?? 0;
                    const conds = matchedRating.subCriteriaRatings?.[sub.id] ?? [];
                    return (
                      <tr key={sub.id}>
                        <td className="font-mono text-xs text-primary">{sub.code}</td>
                        <td className="font-medium text-foreground">{sub.indication}</td>
                        <td>
                          <span className="badge text-[9px]">{sub.criteriaValue}</span>
                        </td>
                        <td className="text-right font-mono font-semibold text-primary">
                          {weight}%
                        </td>
                        <td>
                          <div className="flex flex-wrap gap-1.5">
                            {conds.map((c) => (
                              <span
                                key={c.id}
                                className="px-2 py-0.5 rounded border border-border bg-muted/40 font-mono text-[11px]"
                              >
                                {c.condition}: <strong className="text-primary">{c.marks}m</strong>
                              </span>
                            ))}
                            {conds.length === 0 && <span className="text-muted-foreground">—</span>}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SupplierEvaluationReviewCard({
  activeProcess,
  evaluations,
}: {
  activeProcess: SupplierApprovalProcess;
  evaluations: SupplierEvaluationRecord[];
}) {
  const matchedEval =
    evaluations.find((ev) => ev.id === activeProcess.targetId) ?? evaluations[0];

  if (!matchedEval) {
    return <p className="text-muted-foreground">No supplier evaluation sheet details found.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-3.5 rounded border border-border bg-card">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
            Supplier
          </span>
          <strong className="text-foreground">{matchedEval.supplierName}</strong>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
            Selected Rating
          </span>
          <span className="font-mono text-primary font-semibold">{matchedEval.ratingCode}</span>{" "}
          <span className="text-foreground">· {matchedEval.ratingName}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
            Evaluation Period
          </span>
          <span className="font-mono text-foreground">
            {matchedEval.fromDate} to {matchedEval.toDate}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
            Total Marks / Score
          </span>
          <strong className="font-mono text-primary">
            {matchedEval.totalMarks} / {matchedEval.totalScore} ({matchedEval.percentage}%)
          </strong>
        </div>
        {matchedEval.remark && (
          <div className="sm:col-span-2 md:col-span-4 pt-2 border-t border-border">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
              Evaluation Remarks
            </span>
            <span className="text-muted-foreground">{matchedEval.remark}</span>
          </div>
        )}
      </div>

      {matchedEval.subCriteriaEntries && matchedEval.subCriteriaEntries.length > 0 && (
        <div className="overflow-x-auto rounded border border-border bg-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Main Criteria</th>
                <th>Sub Criteria</th>
                <th>Data Type</th>
                <th>Selected Condition</th>
                <th className="text-right">Score</th>
                <th className="text-right">Marks</th>
              </tr>
            </thead>
            <tbody>
              {matchedEval.subCriteriaEntries.map((entry) => (
                <tr key={`${entry.mainId}-${entry.subId}`}>
                  <td>
                    <span className="font-mono text-primary font-medium">{entry.mainCode}</span> ·{" "}
                    {entry.mainName}
                  </td>
                  <td className="font-medium text-foreground">
                    <span className="font-mono text-xs text-primary">{entry.subCode}</span> ·{" "}
                    {entry.subIndication}
                  </td>
                  <td>
                    <span className="badge text-[9px]">{entry.criteriaValue}</span>
                  </td>
                  <td className="font-mono text-xs">{entry.condition}</td>
                  <td className="text-right font-mono tabular-nums">{entry.score}</td>
                  <td className="text-right font-mono tabular-nums font-semibold text-primary">
                    {entry.marks}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border bg-muted/40 font-semibold">
                <td colSpan={4} className="text-foreground">
                  Total Evaluation Marks
                </td>
                <td className="text-right font-mono tabular-nums">{matchedEval.totalScore}</td>
                <td className="text-right font-mono tabular-nums text-primary font-bold">
                  {matchedEval.totalMarks} ({matchedEval.percentage}%)
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}

function ApprovalStageExecutionCard({
  stage,
  idx,
  overallStatus,
  onApprove,
  onReject,
}: {
  stage: StageApprovalStatus;
  idx: number;
  overallStatus: "Pending Approval" | "Approved" | "Rejected";
  onApprove: (stageId: string) => void;
  onReject: (stageId: string) => void;
}) {
  const isApproved = stage.status === "Approved";
  const isRejected = stage.status === "Rejected";
  const isPending = stage.status === "Pending";

  return (
    <div
      className={`p-4 rounded-lg border text-xs transition-colors ${
        isApproved
          ? "border-emerald-300 bg-emerald-50/40"
          : isRejected
            ? "border-red-300 bg-red-50/40"
            : "border-border bg-card"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className={`w-6 h-6 rounded-full grid place-items-center font-bold text-xs shrink-0 ${
              isApproved
                ? "bg-emerald-600 text-white"
                : isRejected
                  ? "bg-red-600 text-white"
                  : "bg-muted text-muted-foreground border border-border"
            }`}
          >
            {isApproved ? <Check size={13} /> : isRejected ? <X size={13} /> : idx + 1}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <strong className="text-sm font-medium text-foreground">{stage.stageName}</strong>
              <span className="font-mono text-[10px] text-muted-foreground">{stage.stageId}</span>
            </div>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <span
            className={`badge ${
              isApproved
                ? "bg-emerald-100 text-emerald-800"
                : isRejected
                  ? "bg-red-100 text-red-800"
                  : "pending"
            }`}
          >
            {stage.status}
          </span>
          <span className="block font-mono text-[10px] text-muted-foreground mt-1 tabular-nums">
            Approvals: {stage.approvedBy.length} / {stage.approvalsRequired}
          </span>
        </div>
      </div>

      {stage.approvedBy.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-emerald-200/60 text-[11px] text-emerald-900 flex items-center justify-between">
          <span>
            <strong>Approved By:</strong> {stage.approvedBy.join(", ")}
          </span>
          {stage.updatedAt && (
            <span className="text-muted-foreground font-mono">{stage.updatedAt}</span>
          )}
        </div>
      )}

      {stage.remarks.length > 0 && (
        <div className="mt-1 text-[11px] text-muted-foreground italic">
          &quot;{stage.remarks.join("; ")}&quot;
        </div>
      )}

      {isPending && overallStatus !== "Rejected" && (
        <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-end gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onReject(stage.stageId)}
            className="h-7 text-xs text-destructive hover:bg-destructive/10"
          >
            <XCircle size={12} className="mr-1" />
            <span>Reject Stage</span>
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => onApprove(stage.stageId)}
            className="h-7 text-xs bg-emerald-700 hover:bg-emerald-800 text-white"
          >
            <CheckCircle2 size={12} className="mr-1" />
            <span>Approve Stage</span>
          </Button>
        </div>
      )}
    </div>
  );
}

export function SupplierApprovalQueueTab() {
  const {
    approvalProcesses,
    approveStage,
    rejectStage,
    suppliersList,
    documents,
    ratingMasters,
    criterias,
    evaluations,
  } = useWorkspace();
  const [filterType, setFilterType] = useState<ApprovalProcessType>("Supplier Registration");
  const [selectedProcessId, setSelectedProcessId] = useState<string>(
    approvalProcesses[0]?.id ?? "",
  );
  const [authorizerName, setAuthorizerName] = useState("Sunil Jayawardena");
  const [remarkText, setRemarkText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showDetails, setShowDetails] = useState(true);

  const filteredProcesses = approvalProcesses.filter((p) => p.processType === filterType);

  const activeProcess =
    filteredProcesses.find((p) => p.id === selectedProcessId) || filteredProcesses[0];

  const handleApprove = (stageId: string) => {
    if (!activeProcess) return;
    if (!authorizerName.trim()) {
      setFeedback("Please specify authorizer name.");
      return;
    }
    approveStage(activeProcess.id, stageId, authorizerName, remarkText || "Approved after review");
    setRemarkText("");
    setFeedback(`Stage approved successfully by ${authorizerName}.`);
  };

  const handleReject = (stageId: string) => {
    if (!activeProcess) return;
    if (!authorizerName.trim()) {
      setFeedback("Please specify authorizer name.");
      return;
    }
    rejectStage(
      activeProcess.id,
      stageId,
      authorizerName,
      remarkText || "Rejected due to non-compliance",
    );
    setRemarkText("");
    setFeedback(`Stage rejected by ${authorizerName}.`);
  };

  const filterTabs: Array<{
    key: ApprovalProcessType;
    label: string;
  }> = [
    { key: "Supplier Registration", label: "Supplier Registration" },
    { key: "Ratings", label: "Ratings" },
    { key: "Supplier Evaluation", label: "Supplier Evaluation" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Multi-Stage Approval Queue (Supplier Registration, Ratings &amp; Evaluation)
            </h2>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            Active Processes: {filteredProcesses.length}
          </span>
        </div>

        <div className="child-tabs">
          {filterTabs.map((tab) => {
            const count = approvalProcesses.filter((p) => p.processType === tab.key).length;
            return (
              <button
                key={tab.key}
                type="button"
                className="tab-button"
                data-active={filterType === tab.key}
                onClick={() => {
                  setFilterType(tab.key);
                  setFeedback("");
                }}
              >
                <span>{tab.label}</span>
                <span className="tab-count ml-1.5">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            Items Pending / In Review
          </h3>

          {filteredProcesses.map((proc) => {
            const isSelected = proc.id === activeProcess?.id;
            return (
              <button
                key={proc.id}
                type="button"
                onClick={() => {
                  setSelectedProcessId(proc.id);
                  setFeedback("");
                }}
                className={`w-full text-left p-4 rounded-lg border text-xs transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 text-foreground shadow-sm"
                    : "border-border bg-card hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-primary">{proc.id}</span>
                    <span className="badge text-[9px]">{proc.processType}</span>
                  </div>
                  <span
                    className={`badge text-[10px] ${
                      proc.overallStatus === "Approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : proc.overallStatus === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "pending"
                    }`}
                  >
                    {proc.overallStatus}
                  </span>
                </div>
                <strong className="block text-sm font-medium text-foreground">
                  {proc.supplierName}
                </strong>
                <span className="text-[11px] text-muted-foreground block mt-0.5">
                  {proc.supplierEmail}
                </span>

                <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-border">
                  <span>
                    {proc.stages.filter((s) => s.status === "Approved").length} of{" "}
                    {proc.stages.length} Stages Approved
                  </span>
                  <span className="text-muted-foreground font-mono">{proc.registrationDate}</span>
                </div>
              </button>
            );
          })}

          {filteredProcesses.length === 0 && (
            <div className="p-6 text-center text-xs text-muted-foreground border border-dashed rounded-lg">
              No approval processes found for this category.
            </div>
          )}
        </div>

        {activeProcess ? (
          <div className="lg:col-span-8 space-y-5">
            <div className="rounded-lg border border-border bg-card p-6 space-y-5">
              <div className="flex items-start justify-between pb-4 border-b border-border">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-primary">{activeProcess.id}</span>
                    <span className="badge text-[10px]">{activeProcess.processType}</span>
                  </div>
                  <h2 className="text-base font-bold text-foreground">
                    {activeProcess.supplierName}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activeProcess.supplierEmail}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Workflow Template:{" "}
                    <span className="text-foreground">{activeProcess.templateName}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`badge text-xs px-2.5 py-1 ${
                      activeProcess.overallStatus === "Approved"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : activeProcess.overallStatus === "Rejected"
                          ? "bg-red-100 text-red-800 border-red-300"
                          : "pending"
                    }`}
                  >
                    {activeProcess.overallStatus}
                  </span>
                  <small className="block text-[10px] text-muted-foreground mt-1">
                    Submitted: {activeProcess.registrationDate}
                  </small>
                </div>
              </div>

              {feedback && (
                <div className="p-3 rounded bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs">
                  {feedback}
                </div>
              )}

              <div className="rounded-lg border border-border bg-muted/20 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Layers size={14} className="text-primary" />
                    <strong className="text-xs font-semibold text-foreground">
                      {activeProcess.processType} Details to Review
                    </strong>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setShowDetails((prev) => !prev)}
                    className="h-6 text-[11px] px-2.5"
                  >
                    {showDetails ? "Hide Details" : "View Details"}
                  </Button>
                </div>

                {showDetails && (
                  <div className="p-4 space-y-4 text-xs">
                    {activeProcess.processType === "Supplier Registration" && (
                      <SupplierRegistrationReviewCard
                        activeProcess={activeProcess}
                        suppliersList={suppliersList}
                        documents={documents}
                      />
                    )}
                    {activeProcess.processType === "Ratings" && (
                      <RatingsMasterReviewCard
                        activeProcess={activeProcess}
                        ratingMasters={ratingMasters}
                        criterias={criterias}
                      />
                    )}
                    {activeProcess.processType === "Supplier Evaluation" && (
                      <SupplierEvaluationReviewCard
                        activeProcess={activeProcess}
                        evaluations={evaluations}
                      />
                    )}
                  </div>
                )}
              </div>

              <div className="p-4 rounded-lg bg-muted/40 border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-primary" />
                    <span>Authorizer Action Panel</span>
                  </strong>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                      Authorizer User
                    </label>
                    <input
                      type="text"
                      value={authorizerName}
                      onChange={(e) => setAuthorizerName(e.target.value)}
                      placeholder="e.g. Sunil Jayawardena"
                      className="w-full bg-background border border-input rounded px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                      Evaluation Remark / Sign-Off Note
                    </label>
                    <input
                      type="text"
                      value={remarkText}
                      onChange={(e) => setRemarkText(e.target.value)}
                      placeholder="e.g. VAT certificate verified with Inland Revenue"
                      className="w-full bg-background border border-input rounded px-2.5 py-1.5 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-foreground">
                  Sequential Approval Stages ({activeProcess.stages.length} Stages)
                </h3>

                <div className="space-y-3">
                  {activeProcess.stages.map((stage, idx) => (
                    <ApprovalStageExecutionCard
                      key={stage.stageId}
                      stage={stage}
                      idx={idx}
                      overallStatus={activeProcess.overallStatus}
                      onApprove={handleApprove}
                      onReject={handleReject}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center text-xs text-muted-foreground border border-dashed rounded-lg">
            No supplier selected in approval queue.
          </div>
        )}
      </div>
    </div>
  );
}

export function SupplierApprovalQueuePage() {
  const { role } = useWorkspace();
  if (role !== "rainco") return <AccessNotice audience="rainco" />;

  return (
    <>
      <PageHeading eyebrow="RAINCO PROCUREMENT" title="Approval Queue" />
      <SupplierApprovalQueueTab />
    </>
  );
}
