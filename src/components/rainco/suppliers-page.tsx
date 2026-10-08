import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AccessNotice, PageHeading, useWorkspace } from "./workspace";

export function SuppliersPage() {
  const { role, suppliersList, systemUsers, updateSupplierMasterStatus } = useWorkspace();
  const [notice, setNotice] = useState<string | null>(null);

  if (role !== "rainco") return <AccessNotice audience="rainco" />;

  const defaultAuthorizer = systemUsers[0]?.fullName ?? "Sunil Jayawardena";

  return (
    <div className="space-y-6">
      <PageHeading eyebrow="ADMINISTRATION" title="Suppliers" />

      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">
            Registered Suppliers (Supplier Master Data)
          </h2>
          <span className="text-xs font-mono text-muted-foreground">
            Total Suppliers: {suppliersList.length}
          </span>
        </div>

        {notice && (
          <div className="notice success" role="status">
            {notice}
          </div>
        )}

        <div className="overflow-x-auto rounded border border-border">
          <table className="data-table">
            <thead>
              <tr>
                <th>SAP BP ID</th>
                <th>Supplier Name</th>
                <th>Business Type</th>
                <th>Registration No</th>
                <th>Currency</th>
                <th className="text-right">Evaluation Results</th>
                <th className="text-right">Rating</th>
                <th className="text-center">Master Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliersList.map((s) => (
                <tr key={s.sapPartnerId + s.name}>
                  <td className="font-mono text-xs text-primary font-medium">{s.sapPartnerId}</td>
                  <td className="font-medium text-foreground">{s.name}</td>
                  <td>{s.businessType}</td>
                  <td className="font-mono text-xs">{s.registrationNo}</td>
                  <td className="font-mono text-xs">{s.currency}</td>
                  <td className="text-right font-mono tabular-nums text-xs">
                    {s.evaluationScore !== undefined && s.evaluationMarks !== undefined ? (
                      <span className="text-foreground">
                        {s.evaluationMarks} / {s.evaluationScore}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="text-right font-mono tabular-nums text-xs">
                    {s.evaluationPercentage !== undefined ? (
                      <span className="font-bold text-primary">{s.evaluationPercentage}%</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="text-center">
                    <span
                      className={`badge text-[10px] ${
                        s.status === "Active"
                          ? "bg-emerald-100 text-emerald-800"
                          : s.status === "Inactive"
                            ? "bg-amber-100 text-amber-800"
                            : s.status === "Blacklisted"
                              ? "bg-red-100 text-red-800"
                              : "pending"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="inline-flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={s.status === "Active"}
                        onClick={() => {
                          updateSupplierMasterStatus(s.name, "Active", defaultAuthorizer);
                          setNotice(`${s.sapPartnerId} · ${s.name} activated.`);
                        }}
                        className="h-6 text-[11px] px-2"
                      >
                        Activate
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={s.status === "Inactive"}
                        onClick={() => {
                          updateSupplierMasterStatus(s.name, "Inactive", defaultAuthorizer);
                          setNotice(
                            `${s.sapPartnerId} · ${s.name} marked Inactive and deactivated from all transaction levels.`,
                          );
                        }}
                        className="h-6 text-[11px] px-2 text-amber-700"
                      >
                        Inactive
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={s.status === "Blacklisted"}
                        onClick={() => {
                          updateSupplierMasterStatus(s.name, "Blacklisted", defaultAuthorizer);
                          setNotice(
                            `${s.sapPartnerId} · ${s.name} Blacklisted and deactivated from all transaction levels.`,
                          );
                        }}
                        className="h-6 text-[11px] px-2 text-destructive"
                      >
                        Blacklist
                      </Button>
                    </div>
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
