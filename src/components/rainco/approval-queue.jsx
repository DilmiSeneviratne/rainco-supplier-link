import { useState } from "react";
import {
  Check,
  CheckCircle2,
  Clock,
  Eye,
  Layers,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
export function getStageIndexForUser(user, processStages = [], workspaceStages = []) {
  if (!user || !processStages || processStages.length === 0) return 0;

  // 1. Check if user already approved or rejected a stage in this process
  const actedIdx = processStages.findIndex(
    (stg) => stg.approvedBy?.includes(user.fullName) || stg.rejectedBy?.includes(user.fullName),
  );
  if (actedIdx !== -1) return actedIdx;

  // 2. Check if user is an authorizer on a workspace stage
  const matchingWStage = workspaceStages.find((ws) =>
    ws.authorizers?.some((auth) => auth.name === user.fullName),
  );
  if (matchingWStage) {
    const idx = processStages.findIndex((ps) => ps.stageId === matchingWStage.id);
    if (idx !== -1) return idx;
  }

  // 3. Match department to stage
  if (user.department === "Procurement") {
    const idx = processStages.findIndex(
      (ps) => ps.stageId === "STAGE-1" || ps.stageName?.toLowerCase().includes("procurement"),
    );
    if (idx !== -1) return idx;
  }
  if (user.department === "Finance & Accounts") {
    const idx = processStages.findIndex(
      (ps) => ps.stageId === "STAGE-2" || ps.stageName?.toLowerCase().includes("finance"),
    );
    if (idx !== -1) return idx;
  }
  if (user.department === "Corporate Governance") {
    const idx = processStages.findIndex(
      (ps) =>
        ps.stageId === "STAGE-3" ||
        ps.stageName?.toLowerCase().includes("compliance") ||
        ps.stageName?.toLowerCase().includes("commercial"),
    );
    if (idx !== -1) return idx;
  }

  // 4. Default to current pending stage or 0
  const pendingIdx = processStages.findIndex((s) => s.status === "Pending");
  return pendingIdx !== -1 ? pendingIdx : 0;
}

function ApprovalWorkflowGrid({
  activeProcess,
  isReadOnly,
  systemUsers = [],
  currentUser,
  workspaceStages = [],
  onApprove,
  onReject,
  onSuccessNotice,
}) {
  const [isAddingRow, setIsAddingRow] = useState(false);
  const [newRemark, setNewRemark] = useState("");
  const [newStatus, setNewStatus] = useState("Approved");

  const stages = activeProcess?.stages ?? [];
  const currentApprover = currentUser ||
    systemUsers[0] || {
      id: "USR-1",
      fullName: "Sunil Jayawardena",
      department: "Procurement",
    };

  // Determine which stage is assigned to the logged-in approving user
  const effectiveStageIndex = getStageIndexForUser(currentApprover, stages, workspaceStages);

  const userAssignedStage = stages[effectiveStageIndex] || stages[0];
  const userAssignedStageLabel = userAssignedStage
    ? `Stage ${effectiveStageIndex + 1}: ${userAssignedStage.stageName}`
    : "Approval Stage";

  // Check if current user has already added their approval row
  const hasUserAlreadyAddedRow = userAssignedStage
    ? Boolean(
        userAssignedStage.approvedBy?.includes(currentApprover.fullName) ||
        userAssignedStage.rejectedBy?.includes(currentApprover.fullName),
      )
    : false;

  // Stage-wise order:
  // First stage 1, then stage 2, then stage 3.
  // "if approving user in stage 2 and he is 2 in order so in approving screen it should show stage 1then stage 2 1 things. upto his details it should show in grid"
  // "approving user should not be able to select it should show the logged in user is sunil is logged only the approval histroy before him should be shown"
  const stagesToRender = isReadOnly
    ? stages
    : hasUserAlreadyAddedRow
      ? stages.slice(0, effectiveStageIndex + 1)
      : stages.slice(0, effectiveStageIndex);

  // Check if all previous stages before this user's stage have been approved
  const arePreviousStagesApproved = stages
    .slice(0, effectiveStageIndex)
    .every((s) => s.status === "Approved");

  const isUserStagePending = userAssignedStage?.status === "Pending";

  const canAddRow =
    !isReadOnly &&
    !hasUserAlreadyAddedRow &&
    isUserStagePending &&
    arePreviousStagesApproved &&
    activeProcess?.overallStatus !== "Approved" &&
    activeProcess?.overallStatus !== "Rejected";

  const handleOpenAddRow = () => {
    if (!canAddRow) return;
    setNewRemark("");
    setNewStatus("Approved");
    setIsAddingRow(true);
  };

  const handleSaveRow = () => {
    if (!userAssignedStage) return;
    const finalRemark =
      newRemark.trim() ||
      (newStatus === "Approved" ? "Approved after verification." : "Rejected after review.");

    if (newStatus === "Approved") {
      onApprove(userAssignedStage.stageId, currentApprover.fullName, finalRemark);
    } else {
      onReject(userAssignedStage.stageId, currentApprover.fullName, finalRemark);
    }

    onSuccessNotice?.(
      `Recorded ${newStatus.toLowerCase()} for "${userAssignedStage.stageName}" by ${currentApprover.fullName}.`,
    );
    setIsAddingRow(false);
    setNewRemark("");
  };

  // Build rows showing previous approvals/rejections made by other users, plus pending stages
  // Sliced in stage-wise order up to the approving user's stage
  const rows = [];
  stagesToRender.forEach((stage) => {
    const actualStageIdx = stages.findIndex((s) => s.stageId === stage.stageId);
    const stageNum = actualStageIdx !== -1 ? actualStageIdx + 1 : 1;
    const stageLabel = `Stage ${stageNum}: ${stage.stageName}`;
    let hasRecords = false;

    if (stage.approvedBy && stage.approvedBy.length > 0) {
      stage.approvedBy.forEach((user, uIdx) => {
        hasRecords = true;
        rows.push({
          id: `${stage.stageId}-approved-${uIdx}-${user}`,
          stageId: stage.stageId,
          stageName: stage.stageName,
          stageLabel,
          authorizedUser: user,
          remark:
            stage.remarks?.[uIdx] ||
            stage.remarks?.[0] ||
            "Approved after verification and compliance check.",
          status: "Approved",
          isPending: false,
        });
      });
    }

    if (stage.rejectedBy && stage.rejectedBy.length > 0) {
      stage.rejectedBy.forEach((user, uIdx) => {
        hasRecords = true;
        rows.push({
          id: `${stage.stageId}-rejected-${uIdx}-${user}`,
          stageId: stage.stageId,
          stageName: stage.stageName,
          stageLabel,
          authorizedUser: user,
          remark:
            stage.remarks?.[uIdx] ||
            stage.remarks?.[0] ||
            "Rejected due to document non-compliance.",
          status: "Rejected",
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
        remark: "Pending authorizer sign-off",
        status: "Pending",
        isPending: true,
      });
    }
  });

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden space-y-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-muted/40 border-b border-border">
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-primary" />
          <h3 className="text-xs font-semibold text-foreground">Approval Stages & History</h3>
        </div>

        {!isReadOnly && (
          <div className="flex items-center gap-2">
            {hasUserAlreadyAddedRow ? (
              <span className="text-[11px] px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium inline-flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-emerald-600" />
                <span>Your approval row has been added (1 row limit)</span>
              </span>
            ) : !arePreviousStagesApproved ? (
              <span className="text-[11px] px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium inline-flex items-center gap-1.5">
                <Clock size={12} className="text-amber-600" />
                <span>
                  Stage {effectiveStageIndex + 1} locked · Waiting for Stage {effectiveStageIndex}{" "}
                  approval
                </span>
              </span>
            ) : canAddRow ? (
              <Button
                type="button"
                size="sm"
                onClick={handleOpenAddRow}
                disabled={isAddingRow}
                className="h-7 text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
              >
                <Plus size={13} />
                <span>Add Row</span>
              </Button>
            ) : (
              <span className="text-[11px] text-muted-foreground italic">Workflow completed</span>
            )}
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-52">Stage</th>
              <th className="w-44">Authorized User</th>
              <th className="min-w-[280px]">Remark</th>
              <th className="w-56 text-center">Status</th>
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
                    <span className="text-xs">
                      {row.stageLabel.replace(/^[A-Za-z0-9\s-]+:\s*/, "")}
                    </span>
                  </div>
                </td>
                <td>
                  {row.isPending ? (
                    <span className="text-muted-foreground text-xs">—</span>
                  ) : (
                    <span className="font-medium text-foreground text-xs">
                      {row.authorizedUser}
                    </span>
                  )}
                </td>
                <td className="text-xs">
                  {row.isPending ? (
                    <span className="text-muted-foreground italic text-xs">{row.remark}</span>
                  ) : (
                    <span className="text-foreground">{row.remark}</span>
                  )}
                </td>
                <td className="text-center">
                  <span
                    className={`badge text-[10px] ${
                      row.status === "Approved"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : row.status === "Rejected"
                          ? "bg-red-100 text-red-800 border border-red-200"
                          : "pending"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}

            {isAddingRow && (
              <tr className="bg-primary/5 border-y-2 border-primary/30">
                <td className="align-top py-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-primary font-semibold">
                      {userAssignedStage?.stageId}
                    </span>
                    <span className="font-semibold text-xs text-foreground">
                      {userAssignedStageLabel}
                    </span>
                  </div>
                </td>
                <td className="align-top py-2.5">
                  <div className="font-semibold text-foreground text-xs">
                    {currentApprover.fullName}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {currentApprover.department}
                  </div>
                </td>
                <td className="align-top py-2.5">
                  <textarea
                    rows={2}
                    value={newRemark}
                    onChange={(e) => setNewRemark(e.target.value)}
                    placeholder="Enter approval remark..."
                    className="w-full min-h-[52px] text-xs p-2 rounded border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary resize-y"
                    autoFocus
                  />
                </td>
                <td className="text-center align-top py-2.5">
                  <div className="flex items-center justify-center gap-1.5 flex-wrap sm:flex-nowrap">
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className={`h-8 px-2.5 text-xs font-semibold rounded border cursor-pointer focus:outline-none focus:ring-1 ${
                        newStatus === "Approved"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300 focus:ring-emerald-400"
                          : "bg-red-50 text-red-800 border-red-300 focus:ring-red-400"
                      }`}
                    >
                      <option value="Approved">Approve</option>
                      <option value="Rejected">Reject</option>
                    </select>

                    <Button
                      type="button"
                      size="sm"
                      onClick={handleSaveRow}
                      className={`h-8 text-xs text-white px-3 gap-1 shrink-0 font-medium ${
                        newStatus === "Approved"
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      <Check size={13} /> Save
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsAddingRow(false)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground shrink-0"
                      title="Cancel"
                    >
                      <X size={13} />
                    </Button>
                  </div>
                </td>
              </tr>
            )}

            {rows.length === 0 && !isAddingRow && (
              <tr>
                <td colSpan={4} className="text-center text-xs text-muted-foreground py-6">
                  {effectiveStageIndex === 0
                    ? `No previous approval records before Stage 1 (${currentApprover.fullName}). Click "Add Row" to record your approval.`
                    : `No previous approval records before Stage ${effectiveStageIndex + 1}.`}
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
    currentUser,
    setCurrentUser,
    stages: workspaceStages = [],
  } = useWorkspace();
  const [filterType, setFilterType] = useState("Supplier Registration");
  const [selectedProcessId, setSelectedProcessId] = useState("");
  const [viewingProcessId, setViewingProcessId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [remarkText, setRemarkText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showDetails, setShowDetails] = useState(true);

  const isMatchingProcessType = (pType, filter) => {
    if (filter === "All") return true;
    if (filter === "Conditions") return pType === "Conditions" || pType === "Ratings";
    return pType === filter;
  };

  const isMatchingStatus = (proc, mode) => {
    if (mode === "pending") {
      return (
        proc.overallStatus === "Pending Approval" ||
        (proc.overallStatus !== "Approved" && proc.overallStatus !== "Rejected")
      );
    }
    if (mode === "responded") {
      // Approved Approvals: strictly Approved, never Pending
      return proc.overallStatus === "Approved";
    }
    if (mode === "rejected") {
      // Rejected Approvals: strictly Rejected, never Pending
      return proc.overallStatus === "Rejected";
    }
    return true;
  };

  const getDecisionEntries = (proc) => {
    if (!proc) return [];
    const entries = [];
    const isApproved = proc.overallStatus === "Approved";
    const isRejected = proc.overallStatus === "Rejected";

    (proc.stages || []).forEach((stg) => {
      if (isApproved && stg.approvedBy?.length > 0) {
        stg.approvedBy.forEach((user, idx) => {
          const sysUser = systemUsers.find((u) => u.fullName === user || u.name === user);
          entries.push({
            authorizer: user,
            department: sysUser?.department || sysUser?.role || stg.stageName || "Authorized User",
            stageName: stg.stageName,
            date: stg.updatedAt || proc.registrationDate,
            remark:
              stg.remarks?.[idx] || stg.remarks?.[0] || "Approved after review and verification.",
            status: "Approved",
          });
        });
      } else if (isRejected && stg.rejectedBy?.length > 0) {
        stg.rejectedBy.forEach((user, idx) => {
          const sysUser = systemUsers.find((u) => u.fullName === user || u.name === user);
          entries.push({
            authorizer: user,
            department: sysUser?.department || sysUser?.role || stg.stageName || "Authorized User",
            stageName: stg.stageName,
            date: stg.updatedAt || proc.registrationDate,
            remark: stg.remarks?.[idx] || stg.remarks?.[0] || "Rejected due to non-compliance.",
            status: "Rejected",
          });
        });
      }
    });

    if (entries.length === 0) {
      if (isApproved) {
        entries.push({
          authorizer: "Sunil Jayawardena",
          department: "Procurement",
          stageName: "Procurement Desk Review",
          date: proc.registrationDate,
          remark: "Approved after review and verification.",
          status: "Approved",
        });
      } else if (isRejected) {
        entries.push({
          authorizer: "Nadeeka Perera",
          department: "Finance",
          stageName: "Finance & Tax Verification",
          date: proc.registrationDate,
          remark: "Rejected due to non-compliance.",
          status: "Rejected",
        });
      }
    }

    return entries;
  };

  const getDecisionActorSummary = (proc) => {
    if (!proc) return "—";
    if (proc.overallStatus === "Approved") {
      const names = [
        ...new Set((proc.stages || []).flatMap((s) => s.approvedBy || []).filter(Boolean)),
      ];
      return names.length > 0 ? names.join(", ") : "Sunil Jayawardena";
    }
    if (proc.overallStatus === "Rejected") {
      const names = [
        ...new Set((proc.stages || []).flatMap((s) => s.rejectedBy || []).filter(Boolean)),
      ];
      return names.length > 0 ? names.join(", ") : "Nadeeka Perera";
    }
    return "—";
  };

  const processesForCurrentStatus = approvalProcesses.filter((p) => {
    if (!isMatchingStatus(p, statusMode)) return false;
    if (statusMode === "pending") {
      const currentApprover = currentUser || systemUsers[0];
      const stageIdx = getStageIndexForUser(currentApprover, p.stages, workspaceStages);
      // If the current approver has already added their approval/rejection for their stage,
      // it is no longer pending review by them
      const userStage = p.stages?.[stageIdx];
      const hasUserActed =
        userStage?.approvedBy?.includes(currentApprover.fullName) ||
        userStage?.rejectedBy?.includes(currentApprover.fullName);
      if (hasUserActed) {
        return false;
      }
      // "if not previous user not aprroved then dont show for approval"
      const previousStages = (p.stages || []).slice(0, stageIdx);
      const arePreviousStagesApproved = previousStages.every((s) => s.status === "Approved");
      if (!arePreviousStagesApproved) {
        return false;
      }
    }
    return true;
  });

  const effectiveFilterType =
    filterType === "All" || !filterType ? "Supplier Registration" : filterType;

  const filteredProcesses = processesForCurrentStatus
    .filter((p) => isMatchingProcessType(p.processType, effectiveFilterType))
    .filter((p) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.supplierName?.toLowerCase().includes(q) ||
        p.id?.toLowerCase().includes(q) ||
        p.targetId?.toLowerCase().includes(q) ||
        p.supplierEmail?.toLowerCase().includes(q)
      );
    });

  const isReadOnly = statusMode !== "pending";

  const activeProcess =
    filteredProcesses.find((p) => p.id === selectedProcessId) || filteredProcesses[0];

  const viewingProcess = viewingProcessId
    ? approvalProcesses.find((p) => p.id === viewingProcessId)
    : null;

  const handleApprove = (stageId, user = currentUser?.fullName, remark = remarkText) => {
    if (!activeProcess || isReadOnly) return;
    const authorizer = (user || currentUser?.fullName || "Sunil Jayawardena").trim();
    const targetName = activeProcess.supplierName;
    approveStage(activeProcess.id, stageId, authorizer, remark || "Approved after review");
    setRemarkText("");
    setSelectedProcessId("");
    setFeedback(`Recorded approval for "${targetName}". Moved to Approved Approvals.`);
  };

  const handleReject = (stageId, user = currentUser?.fullName, remark = remarkText) => {
    if (!activeProcess || isReadOnly) return;
    const authorizer = (user || currentUser?.fullName || "Sunil Jayawardena").trim();
    const targetName = activeProcess.supplierName;
    rejectStage(activeProcess.id, stageId, authorizer, remark || "Rejected due to non-compliance");
    setRemarkText("");
    setSelectedProcessId("");
    setFeedback(`Recorded rejection for "${targetName}". Moved to Rejected Approvals.`);
  };

  const filterTabs = [
    { key: "Supplier Registration", label: "Supplier Registration" },
    { key: "Conditions", label: "Conditions" },
    { key: "Supplier Evaluation", label: "Supplier Evaluation" },
  ];

  const currentTabLabel =
    statusMode === "pending" ? "Pending" : statusMode === "responded" ? "Approved" : "Rejected";

  const pageTitle =
    statusMode === "pending"
      ? "Pending Approvals"
      : statusMode === "responded"
        ? "Approved Approvals"
        : "Rejected Approvals";

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">{pageTitle}</h2>
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
                  setViewingProcessId(null);
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

      {feedback && (
        <div className="p-3 rounded bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs">
          {feedback}
        </div>
      )}

      {/* Grid view for Approved & Rejected Approvals */}
      {statusMode !== "pending" ? (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-card border border-border rounded-lg">
            <div className="flex items-center gap-2 w-full sm:max-w-md bg-muted/40 border border-border rounded px-2.5 py-1.5 text-xs">
              <Search size={14} className="text-muted-foreground shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by supplier name, reference ID, email..."
                className="bg-transparent w-full focus:outline-none text-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-[10px] text-muted-foreground hover:text-foreground shrink-0"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              Showing <strong>{filteredProcesses.length}</strong> record
              {filteredProcesses.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="w-28 font-semibold">Process ID</th>
                    <th className="w-32 font-semibold">Ref / Reg No</th>
                    <th className="min-w-[220px] font-semibold">Supplier / Title</th>
                    <th className="w-40 font-semibold">Process Type</th>
                    <th className="w-32 font-semibold">Submitted Date</th>
                    <th className="w-56 font-semibold">
                      {statusMode === "responded" ? "Approved By" : "Rejected By"}
                    </th>
                    <th className="w-24 text-center font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProcesses.map((proc) => {
                    return (
                      <tr key={proc.id} className="hover:bg-muted/30 transition-colors">
                        <td className="font-mono text-xs font-semibold text-primary">{proc.id}</td>
                        <td className="font-mono text-xs text-muted-foreground">
                          {proc.targetId || "—"}
                        </td>
                        <td>
                          <div className="font-semibold text-xs text-foreground">
                            {proc.supplierName}
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate max-w-xs">
                            {proc.supplierEmail}
                          </div>
                        </td>
                        <td>
                          <span className="badge text-[10px]">{proc.processType}</span>
                        </td>
                        <td className="text-xs text-muted-foreground font-mono">
                          {proc.registrationDate}
                        </td>
                        <td>
                          {statusMode === "responded" ? (
                            <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
                              <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                              <span className="truncate">{getDecisionActorSummary(proc)}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-xs text-red-800 font-medium">
                              <XCircle size={13} className="text-red-600 shrink-0" />
                              <span className="truncate">{getDecisionActorSummary(proc)}</span>
                            </div>
                          )}
                        </td>
                        <td className="text-center">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setViewingProcessId(proc.id);
                              setFeedback("");
                            }}
                            className="h-7 text-xs px-2.5 gap-1 hover:bg-primary hover:text-primary-foreground transition-all"
                          >
                            <Eye size={12} />
                            <span>View</span>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredProcesses.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-xs text-muted-foreground">
                        No {statusMode === "responded" ? "approved" : "rejected"} approvals found in{" "}
                        {effectiveFilterType}.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Details Popup Modal */}
          <Dialog
            open={Boolean(viewingProcess)}
            onOpenChange={(open) => {
              if (!open) setViewingProcessId(null);
            }}
          >
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-6 space-y-4">
              {viewingProcess && (
                <>
                  <DialogHeader className="text-left pb-3 border-b border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-primary">
                        {viewingProcess.id}
                      </span>
                      <span className="badge text-[10px]">{viewingProcess.processType}</span>
                      <span className="text-xs text-muted-foreground font-mono">
                        Ref: {viewingProcess.targetId || "—"}
                      </span>
                    </div>
                    <DialogTitle className="text-base font-bold text-foreground">
                      {viewingProcess.supplierName}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                      Submitted on {viewingProcess.registrationDate} ·{" "}
                      {viewingProcess.supplierEmail}
                    </DialogDescription>
                  </DialogHeader>

                  {/* Who Did It: Approved By or Rejected By */}
                  {viewingProcess.overallStatus === "Approved" ? (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-4 space-y-2.5 text-xs">
                      <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                        <CheckCircle2 size={16} className="text-emerald-600" />
                        <span>Approved By</span>
                      </div>
                      <div className="space-y-2">
                        {getDecisionEntries(viewingProcess).map((entry, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded bg-white/95 border border-emerald-200 shadow-xs space-y-1"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <strong className="text-emerald-950 font-semibold">
                                  {entry.authorizer}
                                </strong>
                                <span className="text-[11px] text-muted-foreground">
                                  · {entry.department}
                                </span>
                              </div>
                              <span className="text-[11px] text-muted-foreground font-mono">
                                {entry.date}
                              </span>
                            </div>
                            <div className="text-emerald-900 text-[11px]">
                              <span className="font-medium text-emerald-950">Remark: </span>
                              <span className="italic">{entry.remark}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-red-200 bg-red-50/70 p-4 space-y-2.5 text-xs">
                      <div className="flex items-center gap-2 text-red-900 font-semibold">
                        <XCircle size={16} className="text-red-600" />
                        <span>Rejected By</span>
                      </div>
                      <div className="space-y-2">
                        {getDecisionEntries(viewingProcess).map((entry, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded bg-white/95 border border-red-200 shadow-xs space-y-1"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <strong className="text-red-950 font-semibold">
                                  {entry.authorizer}
                                </strong>
                                <span className="text-[11px] text-muted-foreground">
                                  · {entry.department}
                                </span>
                              </div>
                              <span className="text-[11px] text-muted-foreground font-mono">
                                {entry.date}
                              </span>
                            </div>
                            <div className="text-red-900 text-[11px]">
                              <span className="font-medium text-red-950">Reason / Remark: </span>
                              <span className="italic">{entry.remark}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Details Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                      <Layers size={14} className="text-primary" />
                      <span>{viewingProcess.processType} Details</span>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-4 text-xs">
                      {viewingProcess.processType === "Supplier Registration" && (
                        <SupplierRegistrationReviewCard
                          activeProcess={viewingProcess}
                          suppliersList={suppliersList}
                          documents={documents}
                        />
                      )}
                      {(viewingProcess.processType === "Ratings" ||
                        viewingProcess.processType === "Conditions") && (
                        <RatingsMasterReviewCard
                          activeProcess={viewingProcess}
                          ratingMasters={ratingMasters}
                          criterias={criterias}
                        />
                      )}
                      {viewingProcess.processType === "Supplier Evaluation" && (
                        <SupplierEvaluationReviewCard
                          activeProcess={viewingProcess}
                          evaluations={evaluations}
                        />
                      )}
                    </div>
                  </div>

                  <DialogFooter className="pt-2 border-t border-border">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setViewingProcessId(null)}
                    >
                      Close
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        /* Pending Approvals Review Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
              Items Pending Review
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
              <div className="p-6 text-center text-xs text-muted-foreground border border-dashed rounded-lg space-y-1">
                <div className="font-medium text-foreground">
                  No items pending approval for your assigned stage.
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Items only appear for your approval once previous stage authorizers have approved.
                </div>
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
                  currentUser={currentUser}
                  workspaceStages={workspaceStages}
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
      )}
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

export function ApprovedApprovalsTab() {
  return <ApprovalsWorkflowView statusMode="responded" />;
}

export function ApprovedApprovalsPage() {
  const { role } = useWorkspace();
  if (role !== "rainco") return <AccessNotice audience="rainco" />;
  return (
    <>
      <PageHeading eyebrow="RAINCO PROCUREMENT" title="Approved Approvals" />
      <ApprovedApprovalsTab />
    </>
  );
}

export const RespondedApprovalsTab = ApprovedApprovalsTab;
export const RespondedApprovalsPage = ApprovedApprovalsPage;

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
