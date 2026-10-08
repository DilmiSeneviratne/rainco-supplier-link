import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "./registration";
import { AccessNotice, PageHeading, useWorkspace } from "./workspace";
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
    const [selectedUserId, setSelectedUserId] = useState(systemUsers[0]?.id ?? "USR-1");
    const [savedNotice, setSavedNotice] = useState("");
    if (role !== "rainco")
        return <AccessNotice audience="rainco"/>;
    const selectedUser = systemUsers.find((u) => u.id === selectedUserId) ?? systemUsers[0];
    const activeUserId = selectedUser?.id ?? selectedUserId;
    const allowedTabs = userPermissions[activeUserId] ?? [];
    const handleToggleTab = (tabName) => {
        const exists = allowedTabs.includes(tabName);
        const updated = exists ? allowedTabs.filter((t) => t !== tabName) : [...allowedTabs, tabName];
        updateUserPermissions(activeUserId, updated);
        setSavedNotice("");
    };
    return (<div className="space-y-6">
      <PageHeading eyebrow="ADMINISTRATION" title="User Permissions"/>

      <div className="rounded-lg border border-border bg-card p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-border">
          <div className="w-full sm:w-80">
            <Field label="Select User">
              <select value={activeUserId} onChange={(e) => {
            setSelectedUserId(e.target.value);
            setSavedNotice("");
        }}>
                {systemUsers.map((u) => (<option key={u.id} value={u.id}>
                    {u.fullName} ({u.username})
                  </option>))}
              </select>
            </Field>
          </div>
          <Button size="sm" onClick={() => setSavedNotice(`Tab access permissions for "${selectedUser?.fullName ?? activeUserId}" saved.`)}>
            <Save />
            Save Permissions
          </Button>
        </div>

        {savedNotice && (<div className="notice success" role="status">
            {savedNotice}
          </div>)}

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
            return (<tr key={tabName}>
                    <td className="font-medium text-foreground">{tabName}</td>
                    <td className="text-center">
                      <input type="checkbox" aria-label={`${tabName} access`} checked={hasAccess} onChange={() => handleToggleTab(tabName)} className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"/>
                    </td>
                  </tr>);
        })}
            </tbody>
          </table>
        </div>
      </div>
    </div>);
}
