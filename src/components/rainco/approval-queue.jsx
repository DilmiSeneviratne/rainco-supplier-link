import { useState } from "react";
import { Check, CheckCircle2, Layers, Plus, ShieldCheck, Trash2, UserCheck, X, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccessNotice, PageHeading, useWorkspace } from "./workspace";
function SupplierRegistrationReviewCard({ activeProcess, suppliersList, documents }) {
  const matchedSupplier =
    suppliersList.find(
      (s) => s.registrationNo === activeProcess.targetId || s.name === activeProcess.supplierName,
    ) ?? suppliersList[0];
  if (!matchedSupplier) {
    return (
      <p className="text-muted-foreground">No registration details found for this supplier.</p>
    );
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
function RatingsMasterReviewCard({ activeProcess, ratingMasters, criterias }) {
  const matchedRating =
    ratingMasters.find((r) => r.id === activeProcess.targetId) ??
    ratingMasters.find((r) => activeProcess.supplierName.includes(r.code)) ??
    ratingMasters[0];
  if (!matchedRating) {
    return <p className="text-muted-foreground">No condition configuration details found.</p>;
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
            Condition Code
          </span>
          <strong className="font-mono text-primary">{matchedRating.code}</strong>
        </div>
        <div className="sm:col-span-2">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
            Condition Name
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
          Configured Tutorials, Sub-Tutorial Weightages &amp; Condition Marks
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
function SupplierEvaluationReviewCard({ activeProcess, evaluations }) {
  const matchedEval = evaluations.find((ev) => ev.id === activeProcess.targetId) ?? evaluations[0];
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
function ApprovalWorkflowGrid({
  activeProcess,
  isReadOnly,
  systemUsers = [],
  authorizerName,
  onApprove,
  onReject,
  onSuccessNotice,
}) {
  const [isAddingRow, setIsAddingRow] = useState(false);
  const [newStageId, setNewStageId] = useState("");
  const [newUser, setNewUser] = useState(authorizerName || "Sunil Jayawardena");
  const [newRemark, setNewRemark] = useState("");
  const [newStatus, setNewStatus] = useState("Approved");

  const stages = activeProcess?.stages ?? [];
  const firstPendingStage = stages.find((s) => s.status === "Pending") || stages[0];

  const handleOpenAddRow = () => {
    setNewStageId(firstPendingStage?.stageId || stages[0]?.stageId || "");
    setNewUser(authorizerName || "Sunil Jayawardena");
    setNewRemark("");
    setNewStatus("Approved");
    setIsAddingRow(true);
  };

  const handleQuickAction = (stageId, status) => {
    setNewStageId(stageId);
    setNewUser(authorizerName || "Sunil Jayawardena");
    setNewRemark("");
    setNewStatus(status);
    setIsAddingRow(true);
  };

  const handleSaveRow = () => {
    if (!newStageId) return;
    const finalUser = newUser.trim() || authorizerName || "Sunil Jayawardena";
    const finalRemark =
      newRemark.trim() ||
      (newStatus === "Approved" ? "Approved after verification" : "Rejected after review");
    const targetStage = stages.find((s) => s.stageId === newStageId);

    if (newStatus === "Approved") {
      onApprove(newStageId, finalUser, finalRemark);
    } else {
      onReject(newStageId, finalUser, finalRemark);
    }

    onSuccessNotice?.(
      `Recorded ${newStatus.toLowerCase()} for "${targetStage?.stageName || newStageId}" by ${finalUser}.`,
    );
    setIsAddingRow(false);
    setNewRemark("");
  };

  // Build rows showing previous approvals/rejections and pending stages
  const rows = [];
  stages.forEach((stage, idx) => {
    const stageLabel = `Stage ${idx + 1}: ${stage.stageName}`;
    let hasRecords = false;

    if (stage.approvedBy && stage.approvedBy.length > 0) {
      stage.approvedBy.forEach((user, uIdx) => {
        hasRecords = true;
        rows.push({
          id: `${stage.stageId}-approved-${uIdx}`,
          stageId: stage.stageId,
          stageName: stage.stageName,
          stageLabel,
          authorizedUser: user,
          remark:
            stage.remarks?.[uIdx] ||
            stage.remarks?.[0] ||
            "Approved after verification and compliance check.",
          status: "Approved",
          updatedAt: stage.updatedAt,
          isPending: false,
        });
      });
    }

    if (stage.rejectedBy && stage.rejectedBy.length > 0) {
      stage.rejectedBy.forEach((user, uIdx) => {
        hasRecords = true;
        rows.push({
          id: `${stage.stageId}-rejected-${uIdx}`,
          stageId: stage.stageId,
          stageName: stage.stageName,
          stageLabel,
          authorizedUser: user,
          remark:
            stage.remarks?.[uIdx] ||
            stage.remarks?.[0] ||
            "Rejected due to document non-compliance.",
          status: "Rejected",
          updatedAt: stage.updatedAt,
          isPending: false,
        });
      });
    }

    if (!hasRecords && stage.status === "Approved") {
      rows.push({
        id: `${stage.stageId}-approved-fb`,
        stageId: stage.stageId,
        stageName: stage.stageName,
        stageLabel,
        authorizedUser: "Sunil Jayawardena",
        remark: stage.remarks?.[0] || "Approved after review",
        status: "Approved",
        updatedAt: stage.updatedAt,
        isPending: false,
      });
      hasRecords = true;
    } else if (!hasRecords && stage.status === "Rejected") {
      rows.push({
        id: `${stage.stageId}-rejected-fb`,
        stageId: stage.stageId,
        stageName: stage.stageName,
        stageLabel,
        authorizedUser: "Review Officer",
        remark: stage.remarks?.[0] || "Rejected",
        status: "Rejected",
        updatedAt: stage.updatedAt,
        isPending: false,
      });
      hasRecords = true;
    }

    if (stage.status === "Pending") {
      rows.push({
        id: `${stage.stageId}-pending`,
        stageId: stage.stageId,
        stageName: stage.stageName,
        stageLabel,
        authorizedUser: "—",
        remark: "—",
        status: "Pending",
        updatedAt: "—",
        isPending: true,
      });
    }
  });

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden space-y-0">
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-muted/40 border-b border-border">
        <h3 className="text-xs font-semibold text-foreground">Approval Stages</h3>

        {!isReadOnly && activeProcess.overallStatus !== "Rejected" && (
          <Button
            type="button"
            size="sm"
            onClick={handleOpenAddRow}
            className="h-7 text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus size={13} />
            <span>Add Row</span>
          </Button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-56">Stage</th>
              <th className="w-48">Authorized User</th>
              <th>Remark</th>
              <th className="w-28 text-center">Status</th>
              {!isReadOnly && <th className="w-36 text-center">Action</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="font-medium text-foreground">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-primary font-semibold">
                      {row.stageId}
                    </span>
                    <span>{row.stageLabel.replace(/^[A-Za-z0-9\s-]+:\s*/, "")}</span>
                  </div>
                </td>
                <td>
                  {row.isPending ? (
                    <span className="text-muted-foreground text-xs">—</span>
                  ) : (
                    <span className="font-medium text-foreground text-xs">{row.authorizedUser}</span>
                  )}
                </td>
                <td className="text-xs">
                  {row.isPending ? (
                    <span className="text-muted-foreground text-xs">—</span>
                  ) : (
                    <span className="text-foreground">{row.remark}</span>
                  )}
                </td>
                <td className="text-center">
                  <span
                    className={`badge text-[10px] ${
                      row.status === "Approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : row.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "pending"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                {!isReadOnly && (
                  <td className="text-center">
                    {row.isPending ? (
                      <div className="flex items-center gap-1.5 justify-center">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuickAction(row.stageId, "Approved")}
                          className="h-6 text-[11px] text-emerald-700 border-emerald-300 hover:bg-emerald-50 px-2 gap-1"
                        >
                          <CheckCircle2 size={11} /> Approve
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuickAction(row.stageId, "Rejected")}
                          className="h-6 text-[11px] text-destructive border-destructive/30 hover:bg-destructive/10 px-2 gap-1"
                        >
                          <XCircle size={11} /> Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>
                )}
              </tr>
            ))}

            {isAddingRow && (
              <tr className="bg-primary/5 border-t-2 border-b-2 border-primary/30">
                <td>
                  <select
                    value={newStageId}
                    onChange={(e) => setNewStageId(e.target.value)}
                    className="grid-input text-xs font-medium w-full"
                  >
                    {stages.map((stg, i) => (
                      <option key={stg.stageId} value={stg.stageId}>
                        Stage {i + 1}: {stg.stageName} ({stg.status})
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    list="approver-users-datalist"
                    value={newUser}
                    onChange={(e) => setNewUser(e.target.value)}
                    placeholder="Authorized User"
                    className="grid-input text-xs w-full"
                  />
                  <datalist id="approver-users-datalist">
                    {systemUsers.map((u) => (
                      <option key={u.id} value={u.name} />
                    ))}
                  </datalist>
                </td>
                <td>
                  <input
                    type="text"
                    value={newRemark}
                    onChange={(e) => setNewRemark(e.target.value)}
                    placeholder="Remark"
                    className="grid-input text-xs w-full"
                    autoFocus
                  />
                </td>
                <td className="text-center">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="grid-input text-xs font-semibold text-center w-full"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
                <td className="text-center">
                  <div className="flex items-center gap-1 justify-center">
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleSaveRow}
                      className="h-7 text-xs bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 gap-1"
                    >
                      <Check size={12} /> Save
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setIsAddingRow(false)}
                      className="h-7 text-xs px-2"
                      title="Cancel"
                    >
                      <X size={12} />
                    </Button>
                  </div>
                </td>
              </tr>
            )}

            {rows.length === 0 && !isAddingRow && (
              <tr>
                <td
                  colSpan={isReadOnly ? 4 : 5}
                  className="text-center text-xs text-muted-foreground py-6"
                >
                  No approval records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export function ApprovalsWorkflowView({ statusMode = "pending" }) {
  const {
    approvalProcesses,
    approveStage,
    rejectStage,
    suppliersList,
    documents,
    ratingMasters,
    criterias,
    evaluations,
    systemUsers = [],
  } = useWorkspace();
  const [filterType, setFilterType] = useState(
    statusMode === "pending" ? "Supplier Registration" : "All",
  );
  const [selectedProcessId, setSelectedProcessId] = useState("");
  const [authorizerName, setAuthorizerName] = useState("Sunil Jayawardena");
  const [remarkText, setRemarkText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showDetails, setShowDetails] = useState(true);

  const isMatchingProcessType = (pType, filter) => {
    if (filter === "All") return true;
    if (filter === "Conditions") return pType === "Conditions" || pType === "Ratings";
    return pType === filter;
  };

  const isMatchingStatus = (overallStatus, mode) => {
    if (mode === "pending") {
      return (
        overallStatus === "Pending Approval" ||
        (overallStatus !== "Approved" && overallStatus !== "Rejected")
      );
    }
    if (mode === "responded") {
      return overallStatus === "Approved";
    }
    if (mode === "rejected") {
      return overallStatus === "Rejected";
    }
    return true;
  };

  const processesForCurrentStatus = approvalProcesses.filter((p) =>
    isMatchingStatus(p.overallStatus, statusMode),
  );

  const effectiveFilterType =
    statusMode === "pending" && (filterType === "All" || !filterType)
      ? "Supplier Registration"
      : filterType;

  const filteredProcesses = processesForCurrentStatus.filter((p) =>
    isMatchingProcessType(p.processType, effectiveFilterType),
  );

  const isReadOnly = statusMode !== "pending";

  const activeProcess =
    filteredProcesses.find((p) => p.id === selectedProcessId) || filteredProcesses[0];

  const handleApprove = (stageId, user = authorizerName, remark = remarkText) => {
    if (!activeProcess || isReadOnly) return;
    const authorizer = (user || authorizerName || "Sunil Jayawardena").trim();
    approveStage(activeProcess.id, stageId, authorizer, remark || "Approved after review");
    setRemarkText("");
    setFeedback(`Stage approved successfully by ${authorizer}.`);
  };

  const handleReject = (stageId, user = authorizerName, remark = remarkText) => {
    if (!activeProcess || isReadOnly) return;
    const authorizer = (user || authorizerName || "Sunil Jayawardena").trim();
    rejectStage(activeProcess.id, stageId, authorizer, remark || "Rejected due to non-compliance");
    setRemarkText("");
    setFeedback(`Stage rejected by ${authorizer}.`);
  };

  const filterTabs =
    statusMode === "pending"
      ? [
          { key: "Supplier Registration", label: "Supplier Registration" },
          { key: "Conditions", label: "Conditions" },
          { key: "Supplier Evaluation", label: "Supplier Evaluation" },
        ]
      : [
          { key: "All", label: "All Categories" },
          { key: "Supplier Registration", label: "Supplier Registration" },
          { key: "Conditions", label: "Conditions" },
          { key: "Supplier Evaluation", label: "Supplier Evaluation" },
        ];

  const currentTabLabel =
    statusMode === "pending" ? "Pending" : statusMode === "responded" ? "Responded" : "Rejected";

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              {statusMode === "pending"
                ? "Pending Approvals"
                : statusMode === "responded"
                  ? "Responded Approvals (Viewing Only)"
                  : "Rejected Approvals (Viewing Only)"}
            </h2>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {currentTabLabel} Records: {filteredProcesses.length}
          </span>
        </div>

        <div className="child-tabs">
          {filterTabs.map((tab) => {
            const count = processesForCurrentStatus.filter((p) =>
              isMatchingProcessType(p.processType, tab.key),
            ).length;
            return (
              <button
                key={tab.key}
                type="button"
                className="tab-button"
                data-active={effectiveFilterType === tab.key}
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
            {statusMode === "pending"
              ? "Items Pending Review"
              : statusMode === "responded"
                ? "Responded / Approved Items (View Only)"
                : "Rejected Items (View Only)"}
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
              {`No ${currentTabLabel.toLowerCase()} approvals found for this category.`}
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

              {/* Read-Only Status Banner */}
              {isReadOnly && (
                <div
                  className={`p-3.5 rounded-lg border text-xs flex items-center justify-between gap-3 ${
                    statusMode === "responded"
                      ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                      : "bg-red-50/70 border-red-200 text-red-900"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} />
                    <span>
                      <strong>Viewing Only:</strong>{" "}
                      {statusMode === "responded"
                        ? "This approval workflow has been responded to and approved. Action buttons are disabled for viewing."
                        : "This approval workflow was rejected during verification. Action buttons are disabled for viewing."}
                    </span>
                  </div>
                  <span
                    className={`badge text-[10px] font-semibold shrink-0 ${
                      statusMode === "responded"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-red-100 text-red-800 border border-red-300"
                    }`}
                  >
                    {statusMode === "responded" ? "Responded (Read-Only)" : "Rejected (Read-Only)"}
                  </span>
                </div>
              )}

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
                      {activeProcess.processType} Details
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
                    {(activeProcess.processType === "Ratings" ||
                      activeProcess.processType === "Conditions") && (
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

              <ApprovalWorkflowGrid
                activeProcess={activeProcess}
                isReadOnly={isReadOnly}
                systemUsers={systemUsers}
                authorizerName={authorizerName}
                onApprove={handleApprove}
                onReject={handleReject}
                onSuccessNotice={(msg) => setFeedback(msg)}
              />
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center text-xs text-muted-foreground border border-dashed rounded-lg">
            No supplier selected.
          </div>
        )}
      </div>
    </div>
  );
}

export function SupplierApprovalQueueTab() {
  return <ApprovalsWorkflowView statusMode="pending" />;
}

export function SupplierApprovalQueuePage() {
  const { role } = useWorkspace();
  if (role !== "rainco") return <AccessNotice audience="rainco" />;
  return (
    <>
      <PageHeading eyebrow="RAINCO PROCUREMENT" title="Pending Approvals" />
      <SupplierApprovalQueueTab />
    </>
  );
}

export function RespondedApprovalsTab() {
  return <ApprovalsWorkflowView statusMode="responded" />;
}

export function RespondedApprovalsPage() {
  const { role } = useWorkspace();
  if (role !== "rainco") return <AccessNotice audience="rainco" />;
  return (
    <>
      <PageHeading eyebrow="RAINCO PROCUREMENT" title="Responded Approvals" />
      <RespondedApprovalsTab />
    </>
  );
}

export function RejectedApprovalsTab() {
  return <ApprovalsWorkflowView statusMode="rejected" />;
}

export function RejectedApprovalsPage() {
  const { role } = useWorkspace();
  if (role !== "rainco") return <AccessNotice audience="rainco" />;
  return (
    <>
      <PageHeading eyebrow="RAINCO PROCUREMENT" title="Rejected Approvals" />
      <RejectedApprovalsTab />
    </>
  );
}
