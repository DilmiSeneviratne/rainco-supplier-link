import { useState } from "react";
import { Eye, EyeOff, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "./registration";
import { AccessNotice, PageHeading, useWorkspace, type SystemUserRow } from "./workspace";

function getNextUserId(users: SystemUserRow[]): string {
  const maxNum = users.reduce((max, u) => {
    const match = u.id.match(/\d+/);
    return Math.max(max, match ? parseInt(match[0], 10) : 0);
  }, 0);
  return `USR-${maxNum + 1}`;
}

export function UsersPage() {
  const { role, departments, systemUsers, saveSystemUser, deleteSystemUser } = useWorkspace();
  const activeDepartments = departments.filter((d) => d.isActive);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState(activeDepartments[0]?.name ?? "Procurement");
  const [isActive, setIsActive] = useState(true);
  const [notice, setNotice] = useState<{ text: string; isError?: boolean } | null>(null);

  if (role !== "rainco") return <AccessNotice audience="rainco" />;

  const handleEdit = (u: SystemUserRow) => {
    setEditingId(u.id);
    setUsername(u.username);
    setPassword(u.password ?? "");
    setFullName(u.fullName);
    setEmail(u.email);
    setDepartment(u.department);
    setIsActive(u.isActive);
    setNotice(null);
  };

  const handleSave = () => {
    if (!username.trim() || !password.trim() || !fullName.trim() || !email.trim()) {
      setNotice({
        text: "Please complete Username, Password, Full Name, and Email.",
        isError: true,
      });
      return;
    }

    const idToSave = editingId ?? getNextUserId(systemUsers);
    saveSystemUser({
      id: idToSave,
      username: username.trim(),
      password: password.trim(),
      fullName: fullName.trim(),
      email: email.trim(),
      department,
      isActive,
    });

    setEditingId(null);
    setUsername("");
    setPassword("");
    setShowPassword(false);
    setFullName("");
    setEmail("");
    setDepartment(activeDepartments[0]?.name ?? "Procurement");
    setIsActive(true);
    setNotice({
      text: `User "${fullName.trim()}" saved successfully.`,
    });
  };

  const handleDelete = (id: string) => {
    deleteSystemUser(id);
    if (editingId === id) {
      setEditingId(null);
      setUsername("");
      setPassword("");
      setShowPassword(false);
      setFullName("");
      setEmail("");
      setIsActive(true);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeading eyebrow="ADMINISTRATION" title="Users" />

      <div className="rounded-lg border border-border bg-card p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">
            {editingId ? `Edit User (${editingId})` : "Create User"}
          </h2>
        </div>

        {notice && (
          <div className={`notice ${notice.isError ? "error" : "success"}`} role="status">
            {notice.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Field label="Username" required>
            <input
              type="text"
              placeholder="e.g. kamal.w"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Field>

          <Field label="Password" required>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-9"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </Field>

          <Field label="Full Name" required>
            <input
              type="text"
              placeholder="e.g. Kamal Wickramasinghe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </Field>

          <Field label="Email" required>
            <input
              type="email"
              placeholder="e.g. kamal.w@rainco.example"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <Field label="Department" required>
            <select value={department} onChange={(e) => setDepartment(e.target.value)}>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
              {!departments.some((d) => d.name === department) && department && (
                <option value={department}>{department}</option>
              )}
            </select>
          </Field>

          <div className="flex items-center pb-2.5">
            <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
              <span className="font-medium">Active Status</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-border">
          <Button size="sm" onClick={handleSave}>
            <Save />
            Save User
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">All Users</h2>
          <span className="text-xs font-mono text-muted-foreground">
            Total Users: {systemUsers.length}
          </span>
        </div>

        <div className="overflow-x-auto rounded border border-border">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-20">User ID</th>
                <th>Username</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Department</th>
                <th className="w-24 text-center">Status</th>
                <th className="w-28 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {systemUsers.map((u) => (
                <tr key={u.id} className={editingId === u.id ? "bg-primary/5" : ""}>
                  <td className="font-mono text-xs text-primary font-medium">{u.id}</td>
                  <td className="font-mono text-xs">{u.username}</td>
                  <td className="font-medium text-foreground">{u.fullName}</td>
                  <td className="text-muted-foreground">{u.email}</td>
                  <td>{u.department}</td>
                  <td className="text-center">
                    <span
                      className={`badge text-[9px] ${
                        u.isActive
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(u)}
                        className="h-6 text-[11px] px-2.5"
                      >
                        Edit
                      </Button>
                      <button
                        type="button"
                        onClick={() => handleDelete(u.id)}
                        className="p-1 hover:text-destructive text-muted-foreground transition-colors"
                        title="Delete user"
                      >
                        <Trash2 size={13} />
                      </button>
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

const systemTabs = [
  "Supplier Checklist",
  "Supplier Types",
  "Departments",
  "Criterias",
  "Ratings",
  "Users",
  "User Permissions",
  "Suppliers",
  "Approval Stages",
  "Approval Template",
  "Approval Queue",
  "Evaluation Sheet",
  "Evaluation Result Report",
  "Evaluation Chart",
];

export function UserPermissionsPage() {
  const { role, systemUsers, userPermissions, updateUserPermissions } = useWorkspace();
  const [selectedUserId, setSelectedUserId] = useState<string>(systemUsers[0]?.id ?? "USR-1");
  const [savedNotice, setSavedNotice] = useState("");

  if (role !== "rainco") return <AccessNotice audience="rainco" />;

  const selectedUser = systemUsers.find((u) => u.id === selectedUserId) ?? systemUsers[0];
  const activeUserId = selectedUser?.id ?? selectedUserId;
  const allowedTabs = userPermissions[activeUserId] ?? [];

  const handleToggleTab = (tabName: string) => {
    const exists = allowedTabs.includes(tabName);
    const updated = exists ? allowedTabs.filter((t) => t !== tabName) : [...allowedTabs, tabName];
    updateUserPermissions(activeUserId, updated);
    setSavedNotice("");
  };

  return (
    <div className="space-y-6">
      <PageHeading eyebrow="ADMINISTRATION" title="User Permissions" />

      <div className="rounded-lg border border-border bg-card p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-border">
          <div className="w-full sm:w-80">
            <Field label="Select User">
              <select
                value={activeUserId}
                onChange={(e) => {
                  setSelectedUserId(e.target.value);
                  setSavedNotice("");
                }}
              >
                {systemUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.fullName} ({u.username})
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Button
            size="sm"
            onClick={() =>
              setSavedNotice(
                `Tab access permissions for "${selectedUser?.fullName ?? activeUserId}" saved.`,
              )
            }
          >
            <Save />
            Save Permissions
          </Button>
        </div>

        {savedNotice && (
          <div className="notice success" role="status">
            {savedNotice}
          </div>
        )}

        <div className="overflow-x-auto rounded border border-border">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tab</th>
                <th className="w-32 text-center">Access</th>
              </tr>
            </thead>
            <tbody>
              {systemTabs.map((tabName) => {
                const hasAccess = allowedTabs.includes(tabName);
                return (
                  <tr key={tabName}>
                    <td className="font-medium text-foreground">{tabName}</td>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        aria-label={`${tabName} access`}
                        checked={hasAccess}
                        onChange={() => handleToggleTab(tabName)}
                        className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

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
