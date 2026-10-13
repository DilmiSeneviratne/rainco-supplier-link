import { useState } from "react";
import { Download, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccessNotice, PageHeading, useWorkspace, } from "./workspace";
import { Field } from "./registration";
function EvaluationReportFiltersBar({ filterSupplier, suppliersList, onFilterChange, onGenerateReport, }) {
    return (<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
      <Field label="Filter by Supplier">
        <select value={filterSupplier} onChange={(e) => onFilterChange(e.target.value)}>
          <option value="ALL">All Suppliers</option>
          {suppliersList.map((s) => (<option key={s.sapPartnerId} value={s.name}>
              {s.sapPartnerId} · {s.name}
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
function EvaluationReportResultsTable({ reportRows }) {
    return (<div className="overflow-x-auto rounded border border-border">
      <table className="data-table">
        <thead>
          <tr>
            <th>Supplier Code</th>
            <th>Name</th>
            <th>Evaluation results</th>
            <th className="text-right">Rating</th>
            <th className="text-center">Master Status</th>
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
            </tr>))}
          {reportRows.length === 0 && (<tr>
              <td colSpan={5} className="text-center text-xs text-muted-foreground py-6">
                No matching supplier evaluation records found.
              </td>
            </tr>)}
        </tbody>
      </table>
    </div>);
}
export function SupplierEvaluationReportSection({ standalone = false }) {
    const { suppliersList, evaluations } = useWorkspace();
    const [filterSupplier, setFilterSupplier] = useState("ALL");
    const [reportGenerated, setReportGenerated] = useState(true);
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

      <EvaluationReportFiltersBar filterSupplier={filterSupplier} suppliersList={suppliersList} onFilterChange={setFilterSupplier} onGenerateReport={() => setReportGenerated(true)}/>

      {reportGenerated && <EvaluationReportResultsTable reportRows={reportRows}/>}
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
