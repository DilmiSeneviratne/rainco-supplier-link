import { useState } from "react";
import { Eye, EyeOff, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "./registration";
import { AccessNotice, PageHeading, useWorkspace } from "./workspace";
const sapUsersDirectory = [
    {
        sapUserCode: "SAP-EMP-001",
        fullName: "Sunil Jayawardena",
        email: "sunil.j@rainco.example",
        department: "Procurement",
    },
    {
        sapUserCode: "SAP-EMP-002",
        fullName: "Nadeeka Perera",
        email: "nadeeka.p@rainco.example",
        department: "Finance & Accounts",
    },
    {
        sapUserCode: "SAP-EMP-003",
        fullName: "Anura Dissanayake",
        email: "anura.d@rainco.example",
        department: "Corporate Governance",
    },
    {
        sapUserCode: "SAP-EMP-004",
        fullName: "Dilmi Seneviratne",
        email: "dilmi.s@rainco.example",
        department: "Procurement",
    },
    {
        sapUserCode: "SAP-EMP-005",
        fullName: "Kamal Wickramasinghe",
        email: "kamal.w@rainco.example",
        department: "Finance & Accounts",
    },
    {
        sapUserCode: "SAP-EMP-006",
        fullName: "Malik Fernando",
        email: "malik.f@rainco.example",
        department: "Procurement",
    },
    {
        sapUserCode: "SAP-EMP-007",
        fullName: "oshani.k@rainco.example",
        fullNameDisplay: "Oshani Karunaratne",
        email: "oshani.k@rainco.example",
        department: "Quality Assurance",
    },
    {
        sapUserCode: "SAP-EMP-008",
        fullName: "Roshan Rajapakse",
        email: "roshan.r@rainco.example",
        department: "Supply Chain Operations",
    },
    {
        sapUserCode: "SAP-EMP-009",
        fullName: "Tharindu Bandara",
        email: "tharindu.b@rainco.example",
        department: "Legal & Compliance",
    },
].map((u) => ({
    ...u,
    fullName: u.fullNameDisplay ?? u.fullName,
}));
function getNextUserId(users) {
    const maxNum = users.reduce((max, u) => {
        const match = u.id.match(/\d+/);
        return Math.max(max, match ? parseInt(match[0], 10) : 0);
    }, 0);
    return `USR-${maxNum + 1}`;
}
export function UsersPage() {
    const { role, employees, systemUsers, saveSystemUser } = useWorkspace();
    const [editingId, setEditingId] = useState(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [department, setDepartment] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [notice, setNotice] = useState(null);
    if (role !== "rainco")
        return <AccessNotice audience="rainco"/>;
    const baseEmployees = employees?.length ? employees : sapUsersDirectory;
    // Merge Employee Master directory with any existing system users so all users appear in the Name selector
    const allSapOptions = [
        ...baseEmployees,
        ...systemUsers
            .filter((su) => !baseEmployees.some((sap) => sap.fullName === su.fullName))
            .map((su, idx) => ({
            sapUserCode: `SAP-EMP-10${idx + 1}`,
            fullName: su.fullName,
            email: su.email,
            department: su.department,
        })),
    ];
    const handleSelectSapUser = (selectedName) => {
        setFullName(selectedName);
        const foundSapUser = allSapOptions.find((u) => u.fullName === selectedName);
        if (foundSapUser) {
            setEmail(foundSapUser.email);
            setDepartment(foundSapUser.department);
        }
        else {
            setEmail("");
            setDepartment("");
        }
    };
    const handleEdit = (u) => {
        setEditingId(u.id);
        setFullName(u.fullName);
        setEmail(u.email);
        setDepartment(u.department);
        setUsername(u.username);
        setPassword(u.password ?? "");
        setConfirmPassword(u.password ?? "");
        setIsActive(u.isActive);
        setNotice(null);
    };
    const handleSave = () => {
        if (!fullName.trim() ||
            !email.trim() ||
            !department.trim() ||
            !username.trim() ||
            !password.trim() ||
            !confirmPassword.trim()) {
            setNotice({
                text: "Please select a Name (to populate Email and Department) and enter Username, Password, and Confirm Password.",
                isError: true,
            });
            return;
        }
        if (password !== confirmPassword) {
            setNotice({
                text: "Password and Confirm Password do not match.",
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
            department: department.trim(),
            isActive,
        });
        setEditingId(null);
        setFullName("");
        setEmail("");
        setDepartment("");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setShowPassword(false);
        setShowConfirmPassword(false);
        setIsActive(true);
        setNotice({
            text: `User "${fullName.trim()}" saved successfully.`,
        });
    };
    return (<div className="space-y-6">
      <PageHeading eyebrow="ADMINISTRATION" title="Users"/>

      <div className="rounded-lg border border-border bg-card p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">
            {editingId ? `Edit User (${editingId})` : "Create User"}
          </h2>
        </div>

        {notice && (<div className={`notice ${notice.isError ? "error" : "success"}`} role="status">
            {notice.text}
          </div>)}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Field label="Name" required>
            <select value={fullName} onChange={(e) => handleSelectSapUser(e.target.value)}>
              <option value="">Select User...</option>
              {allSapOptions.map((sapUser) => (<option key={sapUser.sapUserCode} value={sapUser.fullName}>
                  {sapUser.fullName}
                </option>))}
            </select>
          </Field>

          <Field label="Email" required>
            <input type="email" placeholder="Email" value={email} readOnly className="bg-muted/50 cursor-not-allowed"/>
          </Field>

          <Field label="Department" required>
            <input type="text" placeholder="Department" value={department} readOnly className="bg-muted/50 cursor-not-allowed"/>
          </Field>

          <Field label="Username" required>
            <input type="text" placeholder="e.g. kamal.w" value={username} onChange={(e) => setUsername(e.target.value)}/>
          </Field>

          <Field label="Password" required>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} className="pr-9"/>
              <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" title={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff size={15}/> : <Eye size={15}/>}
              </button>
            </div>
          </Field>

          <Field label="Confirm Password" required>
            <div className="relative">
              <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pr-9"/>
              <button type="button" onClick={() => setShowConfirmPassword((prev) => !prev)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" title={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}>
                {showConfirmPassword ? <EyeOff size={15}/> : <Eye size={15}/>}
              </button>
            </div>
          </Field>

          <div className="flex items-center pb-2.5">
            <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer select-none">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4 rounded text-primary focus:ring-primary"/>
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
                <th className="w-24 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {systemUsers.map((u) => (<tr key={u.id} className={editingId === u.id ? "bg-primary/5" : ""}>
                  <td className="font-mono text-xs text-primary font-medium">{u.id}</td>
                  <td className="font-mono text-xs">{u.username}</td>
                  <td className="font-medium text-foreground">{u.fullName}</td>
                  <td className="text-muted-foreground">{u.email}</td>
                  <td>{u.department}</td>
                  <td className="text-center">
                    <span className={`badge text-[9px] ${u.isActive
                ? "bg-emerald-100 text-emerald-800"
                : "bg-muted text-muted-foreground"}`}>
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="flex items-center justify-center">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(u)} className="h-6 text-[11px] px-2.5">
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </div>
    </div>);
}
