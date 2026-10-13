import { Users } from "lucide-react";
import { AccessNotice, PageHeading, useWorkspace } from "./workspace";

export function EmployeeMaster() {
  const { role, employees } = useWorkspace();

  if (role !== "rainco") return <AccessNotice audience="rainco" />;

  const list = employees ?? [];

  return (
    <div className="space-y-6">
      <PageHeading eyebrow="MASTER DATA" title="Employee Master" />

      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-primary" />
            <h2 className="text-sm font-semibold text-foreground">All Employees</h2>
          </div>

          <span className="text-xs font-mono text-muted-foreground">
            Total Employees: {list.length}
          </span>
        </div>

        <div className="overflow-x-auto rounded border border-border">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-14">#</th>
                <th>Employee Code</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Contact No.</th>
                <th className="w-24 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {list.map((emp, idx) => (
                <tr key={emp.id}>
                  <td className="row-number">{String(idx + 1).padStart(2, "0")}</td>
                  <td className="text-primary font-mono font-medium">{emp.sapUserCode}</td>
                  <td className="font-medium text-foreground">{emp.fullName}</td>
                  <td className="text-muted-foreground">{emp.email}</td>
                  <td>{emp.department}</td>
                  <td className="text-muted-foreground">{emp.designation ?? "—"}</td>
                  <td className="font-mono text-xs">{emp.phone ?? "—"}</td>
                  <td className="text-center">
                    <span
                      className={`badge text-[9px] ${
                        emp.isActive
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {emp.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-xs text-muted-foreground py-6">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
