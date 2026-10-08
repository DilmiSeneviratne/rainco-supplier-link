import { Link } from "@tanstack/react-router";
import { Clock, CreditCard, Star, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccessNotice, PageHeading, useWorkspace } from "./workspace";

const pendingPayments = [
  {
    invoiceNo: "INV-2026-0841",
    poReference: "PO-2026-0312",
    invoiceDate: "22 Sep 2026",
    dueDate: "22 Oct 2026",
    amount: 420000,
    status: "Pending Payment",
  },
  {
    invoiceNo: "INV-2026-0894",
    poReference: "PO-2026-0358",
    invoiceDate: "01 Oct 2026",
    dueDate: "31 Oct 2026",
    amount: 315000,
    status: "Pending Payment",
  },
  {
    invoiceNo: "INV-2026-0912",
    poReference: "PO-2026-0375",
    invoiceDate: "05 Oct 2026",
    dueDate: "04 Nov 2026",
    amount: 185000,
    status: "Under Verification",
  },
];

export function Dashboard() {
  const { role, supplier } = useWorkspace();

  if (role !== "supplier") return <AccessNotice audience="supplier" />;

  const totalOutstanding = pendingPayments.reduce((sum, item) => sum + item.amount, 0);
  const isDeactivated =
    supplier.transactionBlocked ||
    supplier.status === "Inactive" ||
    supplier.status === "Blacklisted";

  return (
    <div className="space-y-6">
      <PageHeading eyebrow="SUPPLIER PORTAL" title="Supplier Dashboard" />

      {isDeactivated && (
        <div className="notice error" role="alert">
          <strong>Supplier Master Status: {supplier.status}</strong> — Your account has been
          deactivated from all transaction levels (Purchase Quotations, Purchase Orders, GRN, and AP
          Invoicing) based on the Supplier Evaluation Result Report.
        </div>
      )}

      {/* Summary Cards: Evaluation Rating & Outstanding / Pending Payment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Evaluation Rating Card */}
        <div className="p-6 rounded-lg border border-border bg-card flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Evaluation Rating
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Star size={18} />
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <div className="text-4xl font-bold font-mono tracking-tight text-foreground tabular-nums">
              86%
            </div>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded">
              Total Marks: 86 / 100
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground">
            <span>Evaluation period: July – September 2026</span>
            <Button asChild size="sm" variant="outline" className="h-7 text-xs">
              <Link to="/ratings">View My Evaluation</Link>
            </Button>
          </div>
        </div>

        {/* Outstanding Amount / Pending Payment Card */}
        <div className="p-6 rounded-lg border border-border bg-card flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Outstanding Amount
            </span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Wallet size={18} />
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <div className="text-4xl font-bold font-mono tracking-tight text-foreground tabular-nums">
              {supplier.currency} {totalOutstanding.toLocaleString("en-US")}
            </div>
            <span className="badge pending text-[10px]">
              {pendingPayments.length} Pending Invoices
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} className="text-amber-500" />
              Next payment due: 22 Oct 2026
            </span>
            <span className="font-mono">SAP BP #{supplier.sapPartnerId}</span>
          </div>
        </div>
      </div>

      {/* Pending Payments / Outstanding Invoices Table */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <CreditCard size={16} className="text-primary" />
            <h2 className="text-sm font-semibold text-foreground">
              Outstanding & Pending Payments
            </h2>
          </div>
          <span className="text-xs font-mono text-muted-foreground">Supplier: {supplier.name}</span>
        </div>

        <div className="overflow-x-auto rounded border border-border">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice No.</th>
                <th>PO Reference</th>
                <th>Invoice Date</th>
                <th>Due Date</th>
                <th className="text-right">Outstanding Amount ({supplier.currency})</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {pendingPayments.map((row) => (
                <tr key={row.invoiceNo}>
                  <td className="font-mono text-xs text-primary font-medium">{row.invoiceNo}</td>
                  <td className="font-mono text-xs">{row.poReference}</td>
                  <td className="font-mono text-xs text-muted-foreground">{row.invoiceDate}</td>
                  <td className="font-mono text-xs">{row.dueDate}</td>
                  <td className="text-right font-mono tabular-nums font-medium text-foreground">
                    {row.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="text-center">
                    <span
                      className={`badge text-[10px] ${
                        isDeactivated ? "bg-red-100 text-red-800" : "pending"
                      }`}
                    >
                      {isDeactivated ? `Transaction Hold (${supplier.status})` : row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border bg-muted/40 font-semibold">
                <td colSpan={4} className="text-foreground">
                  Total Pending Payment
                </td>
                <td className="text-right font-mono tabular-nums text-primary font-bold">
                  {supplier.currency}{" "}
                  {totalOutstanding.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
