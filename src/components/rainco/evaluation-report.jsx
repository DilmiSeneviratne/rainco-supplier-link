import { useState } from "react";
import { Download, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccessNotice, PageHeading, useWorkspace, } from "./workspace";
import { Field } from "./registration";
function EvaluationReportFiltersBar({ filterSupplier, authorizedUser, suppliersList, systemUsers, onFilterChange, onAuthorizedUserChange, onGenerateReport, }) {
    return (<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
      <Field label="Filter by Supplier">
        <select value={filterSupplier} onChange={(e) => onFilterChange(e.target.value)}>
          <option value="ALL">All Suppliers</option>
          {suppliersList.map((s) => (<option key={s.sapPartnerId} value={s.name}>
              {s.sapPartnerId} · {s.name}
            </option>))}
        </select>
      </Field>

      <Field label="Authorised User">
        <select value={authorizedUser} onChange={(e) => onAuthorizedUserChange(e.target.value)}>
          {systemUsers
            .filter((u) => u.isActive)
            .map((u) => (<option key={u.id} value={u.fullName}>
                {u.fullName} ({u.department})
              </option>))}
        </select>
      </Field>

      <div>
        <Button type="button" size="sm" onClick={onGenerateReport} className="w-full sm:w-auto gap-1.5">
          <FileText size={14}/>
          Generate Report
        </Button>
      </div>
    </div>);
}
function EvaluationReportResultsTable({ reportRows, onStatusAction, }) {
    return (<div className="overflow-x-auto rounded border border-border">
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
          {reportRows.map((row) => (<tr key={row.supplierCode + row.supplierName}>
              <td className="font-mono text-xs text-primary font-semibold">{row.supplierCode}</td>
              <td className="font-medium text-foreground">{row.supplierName}</td>
              <td className="font-mono tabular-nums text-xs text-foreground">
                {row.evaluationResults}
              </td>
              <td className="text-right font-mono tabular-nums text-xs font-bold text-primary">
                {row.rating}
              </td>
              <td className="text-center">
                <span className={`badge text-[10px] ${row.status === "Active"
                ? "bg-emerald-100 text-emerald-800"
                : row.status === "Inactive"
                    ? "bg-amber-100 text-amber-800"
                    : row.status === "Blacklisted"
                        ? "bg-red-100 text-red-800"
                        : "pending"}`}>
                  {row.status}
                </span>
              </td>
              <td className="text-right">
                <div className="inline-flex items-center justify-end gap-1.5">
                  <Button type="button" size="sm" variant={row.status === "Active" ? "default" : "outline"} disabled={row.status === "Active"} onClick={() => onStatusAction(row.supplierName, row.supplierCode, "Active")} className="h-6 text-[11px] px-2">
                    Activate
                  </Button>
                  <Button type="button" size="sm" variant="outline" disabled={row.status === "Inactive"} onClick={() => onStatusAction(row.supplierName, row.supplierCode, "Inactive")} className="h-6 text-[11px] px-2 border-amber-500/40 text-amber-700 hover:bg-amber-500/10">
                    Make Inactive
                  </Button>
                  <Button type="button" size="sm" variant="outline" disabled={row.status === "Blacklisted"} onClick={() => onStatusAction(row.supplierName, row.supplierCode, "Blacklisted")} className="h-6 text-[11px] px-2 border-destructive/40 text-destructive hover:bg-destructive/10">
                    Blacklist
                  </Button>
                </div>
              </td>
            </tr>))}
          {reportRows.length === 0 && (<tr>
              <td colSpan={6} className="text-center text-xs text-muted-foreground py-6">
                No matching supplier evaluation records found.
              </td>
            </tr>)}
        </tbody>
      </table>
    </div>);
}
export function SupplierEvaluationReportSection({ standalone = false }) {
    const { suppliersList, evaluations, systemUsers, updateSupplierMasterStatus } = useWorkspace();
    const [filterSupplier, setFilterSupplier] = useState("ALL");
    const [authorizedUser, setAuthorizedUser] = useState(systemUsers[0]?.fullName ?? "Sunil Jayawardena");
    const [reportGenerated, setReportGenerated] = useState(true);
    const [actionNotice, setActionNotice] = useState(null);
    const reportRows = suppliersList
        .filter((s) => (filterSupplier === "ALL" ? true : s.name === filterSupplier))
        .map((s) => {
        const latestEval = evaluations.find((ev) => ev.supplierName === s.name);
        return {
            supplierCode: s.sapPartnerId,
            supplierName: s.name,
            evaluationResults: s.evaluationMarks !== undefined && s.evaluationScore !== undefined
                ? `${s.evaluationMarks} / ${s.evaluationScore}`
                : "Not Evaluated",
            feasibilityScore: s.feasibilityScore !== undefined
                ? `${s.feasibilityScore}%`
                : latestEval
                    ? `${latestEval.feasibilityScore}%`
                    : "—",
            desirabilityScore: s.desirabilityScore !== undefined
                ? `${s.desirabilityScore}%`
                : latestEval
                    ? `${latestEval.desirabilityScore}%`
                    : "—",
            rating: s.evaluationPercentage !== undefined ? `${s.evaluationPercentage}%` : "—",
            status: s.status,
            transactionBlocked: Boolean(s.transactionBlocked) || s.status === "Inactive" || s.status === "Blacklisted",
        };
    });
    const handleStatusAction = (supplierName, supplierCode, newStatus) => {
        updateSupplierMasterStatus(supplierName, newStatus, authorizedUser);
        if (newStatus === "Active") {
            setActionNotice({
                tone: "success",
                text: `Supplier Master Data for ${supplierCode} · ${supplierName} activated by ${authorizedUser}. All transaction levels (Purchase Quotations, Purchase Orders, GRN, and AP Invoicing) are enabled.`,
            });
        }
        else if (newStatus === "Inactive") {
            setActionNotice({
                tone: "error",
                text: `Supplier Master Data for ${supplierCode} · ${supplierName} marked as Inactive by ${authorizedUser}. Supplier has been automatically deactivated from all transaction levels (Purchase Quotations, Purchase Orders, GRN, and AP Invoicing).`,
            });
        }
        else {
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
            ...reportRows.map((r) => [
                `"${r.supplierCode}"`,
                `"${r.supplierName}"`,
                `"${r.evaluationResults}"`,
                `"${r.rating}"`,
                `"${r.status}"`,
            ].join(",")),
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
    return (<div className={`rounded-lg border border-border bg-card p-6 space-y-5 ${standalone ? "" : "mt-6"}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-primary"/>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Supplier Evaluation Result Report
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" size="sm" variant="outline" onClick={() => window.print()} className="h-7 text-xs gap-1.5">
            <Printer size={13}/>
            Print
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={handleExportCsv} className="h-7 text-xs gap-1.5">
            <Download size={13}/>
            Export CSV
          </Button>
        </div>
      </div>

      <EvaluationReportFiltersBar filterSupplier={filterSupplier} authorizedUser={authorizedUser} suppliersList={suppliersList} systemUsers={systemUsers} onFilterChange={setFilterSupplier} onAuthorizedUserChange={setAuthorizedUser} onGenerateReport={() => setReportGenerated(true)}/>

      {actionNotice && (<div className={`notice ${actionNotice.tone === "error" ? "error" : "success"}`} role="status">
          {actionNotice.text}
        </div>)}

      {reportGenerated && (<EvaluationReportResultsTable reportRows={reportRows} onStatusAction={handleStatusAction}/>)}
    </div>);
}
export function EvaluationReport() {
    const { role } = useWorkspace();
    if (role !== "rainco")
        return <AccessNotice audience="rainco"/>;
    return (<>
      <PageHeading eyebrow="RAINCO PROCUREMENT" title="Supplier Evaluation Result Report"/>
      <SupplierEvaluationReportSection standalone/>
    </>);
}
