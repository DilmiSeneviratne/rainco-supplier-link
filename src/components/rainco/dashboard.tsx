import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck2,
  FileText,
  Mail,
  ShieldCheck,
  Star,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccessNotice, useWorkspace } from "./workspace";

export function Dashboard() {
  const { role, supplier, documents, activeSupplierApprovalProcess } = useWorkspace();

  if (role !== "supplier") return <AccessNotice audience="supplier" />;

  const requiredDocs = documents[supplier.businessType] ?? [];
  const approvalStagesList = activeSupplierApprovalProcess?.stages ?? [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="registration-banner rounded-lg">
        <div>
          <div className="banner-eyebrow">
            <ShieldCheck size={14} /> SUPPLIER PORTAL <span> / </span> OVERVIEW
          </div>
          <h1>{supplier.name}</h1>
          <p className="mt-2 text-xs opacity-90">
            {supplier.businessType} Supplier · Business Reg: {supplier.registrationNo} · Currency:{" "}
            {supplier.currency}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs opacity-95">
            <span className="inline-flex items-center gap-1.5 bg-white/15 px-2.5 py-1 rounded">
              <CheckCircle2 size={13} className="text-emerald-300" />
              <span>
                Approval Status: {activeSupplierApprovalProcess?.overallStatus ?? supplier.status}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/15 px-2.5 py-1 rounded font-mono">
              <Building2 size={13} />
              <span>SAP BP: #{supplier.sapPartnerId}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/15 px-2.5 py-1 rounded">
              <UserCheck size={13} />
              <span>User: {supplier.username}</span>
            </span>
          </div>
        </div>

        <div className="banner-status">
          <small>PERFORMANCE SCORE</small>
          <strong>
            86<span className="text-xs font-normal opacity-80"> / 100</span>
          </strong>
          <div className="mt-2 text-[10px] opacity-80 flex items-center gap-1.5">
            <TrendingUp size={12} className="text-emerald-300" />
            <span>Good performance (Q3)</span>
          </div>
        </div>
      </div>

      {/* Approval Process Workflow Status Tracker */}
      {activeSupplierApprovalProcess && (
        <div className="p-5 rounded-lg border border-border bg-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-foreground">
                  Registration Approval Process
                </h2>
                <span
                  className={`badge text-[10px] ${
                    activeSupplierApprovalProcess.overallStatus === "Approved"
                      ? "bg-emerald-100 text-emerald-800"
                      : activeSupplierApprovalProcess.overallStatus === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : "pending"
                  }`}
                >
                  {activeSupplierApprovalProcess.overallStatus}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Workflow: {activeSupplierApprovalProcess.templateName} · Multi-stage department
                sign-off
              </p>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              {approvalStagesList.filter((s) => s.status === "Approved").length} of{" "}
              {approvalStagesList.length} Stages Approved
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {approvalStagesList.map((stg, i) => {
              const isApproved = stg.status === "Approved";
              const isRejected = stg.status === "Rejected";

              return (
                <div
                  key={stg.stageId}
                  className={`p-3.5 rounded-lg border text-xs transition-all ${
                    isApproved
                      ? "border-emerald-300 bg-emerald-50/50"
                      : isRejected
                        ? "border-red-300 bg-red-50/50"
                        : "border-border bg-muted/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      Stage {i + 1}
                    </span>
                    <span
                      className={`badge text-[9px] ${
                        isApproved
                          ? "bg-emerald-100 text-emerald-800"
                          : isRejected
                            ? "bg-red-100 text-red-800"
                            : "pending"
                      }`}
                    >
                      {stg.status}
                    </span>
                  </div>
                  <strong className="block font-medium text-foreground text-xs">
                    {stg.stageName}
                  </strong>
                  <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                    {stg.description}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-border/60 text-[10px] text-muted-foreground flex items-center justify-between">
                    <span>
                      {isApproved
                        ? `Approved by ${stg.approvedBy[0] ?? "Authorizer"}`
                        : "Awaiting Authorizer Sign-off"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Email Link Simulation Callout */}
      <div className="p-4 rounded-lg border border-border bg-card/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 rounded bg-primary/10 text-primary shrink-0">
            <Mail size={16} />
          </div>
          <div>
            <strong className="block font-medium text-foreground">
              Automated Email Onboarding Flow
            </strong>
            <span className="text-muted-foreground text-[11px]">
              Suppliers receive a direct registration link via email. Test the complete invitation →
              registration → login → dashboard cycle.
            </span>
          </div>
        </div>
        <Button asChild size="sm" variant="outline" className="shrink-0 text-xs gap-1.5">
          <Link to="/register">
            <span>Simulate Email Invite Link</span>
            <ArrowRight size={13} />
          </Link>
        </Button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Purchase Quotations</span>
            <FileText size={16} className="text-primary" />
          </div>
          <div className="mt-3 text-2xl font-bold font-mono tracking-tight text-foreground tabular-nums">
            1 <span className="text-xs font-normal text-muted-foreground">Pending</span>
          </div>
          <div className="mt-2 text-[11px] text-muted-foreground flex items-center gap-1">
            <Clock size={12} className="text-amber-500" />
            <span>PQ-2026-0042 due 15 Oct</span>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Evaluation Rating</span>
            <Star size={16} className="text-amber-500" />
          </div>
          <div className="mt-3 text-2xl font-bold font-mono tracking-tight text-foreground tabular-nums">
            86% <span className="text-xs font-normal text-emerald-600 font-sans">Grade A</span>
          </div>
          <div className="mt-2 text-[11px] text-muted-foreground">
            <span>5 criteria evaluated by Rainco</span>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Document Compliance</span>
            <FileCheck2 size={16} className="text-emerald-600" />
          </div>
          <div className="mt-3 text-2xl font-bold font-mono tracking-tight text-foreground tabular-nums">
            {supplier.documentsAttached} / {supplier.totalDocumentsRequired}{" "}
            <span className="text-xs font-normal text-emerald-600 font-sans">100% Verified</span>
          </div>
          <div className="mt-2 text-[11px] text-muted-foreground">
            <span>{supplier.businessType} checklist satisfied</span>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Primary Contact</span>
            <UserCheck size={16} className="text-primary" />
          </div>
          <div className="mt-3 text-sm font-semibold truncate text-foreground">Rukshan Perera</div>
          <div className="mt-2 text-[11px] text-muted-foreground truncate">{supplier.email}</div>
        </div>
      </div>

      {/* Main Grid: Active RFQs & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Quotation Requests (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Quotations */}
          <div className="rounded-lg border border-border bg-card">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Active Purchase Quotations
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Requests sent by Rainco procurement team requiring unit price and lead time
                </p>
              </div>
              <Button asChild size="sm" variant="outline" className="text-xs">
                <Link to="/quotations">View all</Link>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>RFQ Ref</th>
                    <th>Item Description</th>
                    <th>Quantity</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-mono text-primary font-medium">PQ-2026-0042</td>
                    <td>Polyester fabric · Navy</td>
                    <td className="font-mono tabular-nums">500 m</td>
                    <td className="font-mono tabular-nums text-muted-foreground">15 Oct 2026</td>
                    <td>
                      <span className="badge pending">Awaiting Response</span>
                    </td>
                    <td className="text-right">
                      <Button asChild size="sm" className="h-7 text-xs">
                        <Link to="/quotations">Update Quotation</Link>
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Compliance Checklist Summary */}
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Business Compliance Documents ({supplier.businessType})
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Verified against Rainco supplier onboarding standards
                </p>
              </div>
              <Button asChild size="sm" variant="ghost" className="text-xs">
                <Link to="/checklist">
                  <span>View checklist</span>
                  <ExternalLink size={12} className="ml-1" />
                </Link>
              </Button>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {requiredDocs.map((doc) => (
                <div
                  key={doc.code}
                  className="p-3 rounded border border-border bg-muted/30 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-mono text-[10px] text-primary block">{doc.code}</span>
                    <strong className="font-medium text-foreground block truncate">
                      {doc.name}
                    </strong>
                  </div>
                  <span className="badge text-[10px] shrink-0">
                    <CheckCircle2 size={11} className="mr-1 text-emerald-600 inline" /> Verified
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Performance & Ratings Snapshot */}
        <div className="space-y-6">
          {/* Rating Summary Card */}
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Evaluation Feedback</h2>
              <Button asChild size="sm" variant="ghost" className="text-xs">
                <Link to="/ratings">Details</Link>
              </Button>
            </div>

            <div className="mt-4 p-4 rounded-lg bg-muted/40 border border-border text-center">
              <div className="text-3xl font-bold font-mono tracking-tight text-foreground tabular-nums">
                86<span className="text-sm text-muted-foreground font-normal"> / 100</span>
              </div>
              <strong className="block text-xs font-medium text-emerald-700 mt-1">
                Good Supplier Performance
              </strong>
              <small className="text-[11px] text-muted-foreground block mt-0.5">
                Evaluated by Rainco Procurement (Q3 2026)
              </small>
            </div>

            <div className="mt-4 space-y-3">
              {[
                { criterion: "Product quality", score: 90 },
                { criterion: "Delivery performance", score: 85 },
                { criterion: "Pricing competitiveness", score: 80 },
                { criterion: "Responsiveness", score: 90 },
                { criterion: "Documentation compliance", score: 85 },
              ].map((item) => (
                <div key={item.criterion} className="text-xs">
                  <div className="flex justify-between text-muted-foreground mb-1">
                    <span>{item.criterion}</span>
                    <span className="font-mono tabular-nums text-foreground font-medium">
                      {item.score}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-3 border-t border-border">
              <Button asChild size="sm" variant="outline" className="w-full text-xs">
                <Link to="/ratings">View Full Rating Report</Link>
              </Button>
            </div>
          </div>

          {/* Supplier Registered Profile Box */}
          <div className="rounded-lg border border-border bg-card p-5 text-xs space-y-3">
            <h2 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              Registered Profile Details
            </h2>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex justify-between">
                <span>Business Type:</span>
                <span className="text-foreground font-medium">{supplier.businessType}</span>
              </div>
              <div className="flex justify-between">
                <span>Registration No:</span>
                <span className="font-mono text-foreground">{supplier.registrationNo}</span>
              </div>
              <div className="flex justify-between">
                <span>Account Currency:</span>
                <span className="font-mono text-foreground">{supplier.currency}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone:</span>
                <span className="font-mono text-foreground">{supplier.phone}</span>
              </div>
              <div className="flex justify-between">
                <span>Registered Date:</span>
                <span className="text-foreground">{supplier.registrationDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
