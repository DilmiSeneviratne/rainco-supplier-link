import { Fragment, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Layers3,
  Save,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "./registration";
import { AccessNotice, PageHeading, useWorkspace } from "./workspace";

const permissionTreeGroups = [
  {
    id: "masters",
    label: "Masters",
    icon: Layers3,
    tabs: ["Supplier Checklist", "Supplier Types", "Employee Master", "Tutorials", "Conditions"],
  },
  {
    id: "administration",
    label: "Administration",
    icon: ShieldCheck,
    tabs: ["Users", "User Permissions", "Suppliers"],
  },
  {
    id: "approvals",
    label: "Approvals",
    icon: UserCheck,
    tabs: ["Approval Stages", "Approval Template", "Approval Queue"],
  },
  {
    id: "evaluation",
    label: "Evaluation",
    icon: ClipboardCheck,
    tabs: ["Evaluation Sheet", "Evaluation Result Report", "Evaluation Chart"],
  },
];

const actionKeys = [
  { key: "view", label: "View" },
  { key: "create", label: "Create" },
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete" },
];

const allSystemTabs = permissionTreeGroups.flatMap((g) => g.tabs);

function normalizeUserPermEntry(rawEntry) {
  // Support both legacy string[] (allowed tab names) and structured object map
  if (Array.isArray(rawEntry)) {
    const map = {};
    for (const tabName of allSystemTabs) {
      const enabled =
        rawEntry.includes(tabName) || (tabName === "Tutorials" && rawEntry.includes("Criterias"));
      map[tabName] = {
        access: enabled,
        view: enabled,
        create: enabled,
        edit: enabled,
        delete: enabled,
      };
    }
    return map;
  }
  if (rawEntry && typeof rawEntry === "object") {
    const map = {};
    for (const tabName of allSystemTabs) {
      const t = rawEntry[tabName] || (tabName === "Tutorials" ? rawEntry["Criterias"] : null);
      map[tabName] = {
        access: Boolean(t?.access),
        view: Boolean(t?.view),
        create: Boolean(t?.create),
        edit: Boolean(t?.edit),
        delete: Boolean(t?.delete),
      };
    }
    return map;
  }
  const empty = {};
  for (const tabName of allSystemTabs) {
    empty[tabName] = {
      access: false,
      view: false,
      create: false,
      edit: false,
      delete: false,
    };
  }
  return empty;
}

export function UserPermissionsPage() {
  const { role, systemUsers, userPermissions, updateUserPermissions } = useWorkspace();
  const [selectedUserId, setSelectedUserId] = useState(systemUsers[0]?.id ?? "USR-1");
  const [expandedGroups, setExpandedGroups] = useState({
    masters: true,
    administration: true,
    approvals: true,
    evaluation: true,
  });
  const [savedNotice, setSavedNotice] = useState("");

  if (role !== "rainco") return <AccessNotice audience="rainco" />;

  const selectedUser = systemUsers.find((u) => u.id === selectedUserId) ?? systemUsers[0];
  const activeUserId = selectedUser?.id ?? selectedUserId;
  const permMap = normalizeUserPermEntry(userPermissions[activeUserId]);

  const toggleGroupExpand = (groupId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleToggleTabAccess = (tabName) => {
    const current = permMap[tabName];
    const nextAccess = !current.access;
    const updated = {
      ...permMap,
      [tabName]: {
        access: nextAccess,
        view: nextAccess,
        create: nextAccess,
        edit: nextAccess,
        delete: nextAccess,
      },
    };
    updateUserPermissions(activeUserId, updated);
    setSavedNotice("");
  };

  const handleToggleTabAction = (tabName, actionKey) => {
    const current = permMap[tabName];
    const nextVal = !current[actionKey];
    const nextTabPerm = {
      ...current,
      [actionKey]: nextVal,
    };
    // If any action is granted, ensure tab access & view are enabled; if all actions are unchecked, keep tab state synced
    const anyActionChecked = actionKeys.some((a) => nextTabPerm[a.key]);
    nextTabPerm.access = anyActionChecked;
    const updated = {
      ...permMap,
      [tabName]: nextTabPerm,
    };
    updateUserPermissions(activeUserId, updated);
    setSavedNotice("");
  };

  const handleToggleGroupAccess = (groupTabs) => {
    const allEnabled = groupTabs.every((t) => permMap[t]?.access);
    const nextState = !allEnabled;
    const updated = { ...permMap };
    for (const tabName of groupTabs) {
      updated[tabName] = {
        access: nextState,
        view: nextState,
        create: nextState,
        edit: nextState,
        delete: nextState,
      };
    }
    updateUserPermissions(activeUserId, updated);
    setSavedNotice("");
  };

  const handleToggleGroupAction = (groupTabs, actionKey) => {
    const allChecked = groupTabs.every((t) => permMap[t]?.[actionKey]);
    const nextState = !allChecked;
    const updated = { ...permMap };
    for (const tabName of groupTabs) {
      const nextTabPerm = {
        ...updated[tabName],
        [actionKey]: nextState,
      };
      nextTabPerm.access = actionKeys.some((a) => nextTabPerm[a.key]);
      updated[tabName] = nextTabPerm;
    }
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
                `Tab and button permissions for "${selectedUser?.fullName ?? activeUserId}" saved.`,
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
                <th>Navigation Tree (Module / Tab)</th>
                <th className="w-28 text-center">Tab Access</th>
                <th className="w-24 text-center">View</th>
                <th className="w-24 text-center">Create</th>
                <th className="w-24 text-center">Edit</th>
                <th className="w-24 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {permissionTreeGroups.map((group) => {
                const GroupIcon = group.icon;
                const isExpanded = Boolean(expandedGroups[group.id]);
                const allGroupAccess = group.tabs.every((t) => permMap[t]?.access);
                const someGroupAccess =
                  group.tabs.some((t) => permMap[t]?.access) && !allGroupAccess;

                return (
                  <Fragment key={group.id}>
                    {/* Parent Module Tree Row */}
                    <tr className="bg-muted/40 font-semibold">
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleGroupExpand(group.id)}
                            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={`Toggle ${group.label}`}
                          >
                            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </button>
                          <GroupIcon size={14} className="text-primary shrink-0" />
                          <button
                            type="button"
                            onClick={() => toggleGroupExpand(group.id)}
                            className="text-left font-semibold text-foreground hover:text-primary transition-colors"
                          >
                            {group.label}
                          </button>
                          <span className="text-[10px] font-mono text-muted-foreground ml-1">
                            ({group.tabs.length})
                          </span>
                        </div>
                      </td>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          aria-label={`${group.label} all tab access`}
                          checked={allGroupAccess}
                          ref={(el) => {
                            if (el) el.indeterminate = someGroupAccess;
                          }}
                          onChange={() => handleToggleGroupAccess(group.tabs)}
                          className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                        />
                      </td>
                      {actionKeys.map((act) => {
                        const allAct = group.tabs.every((t) => permMap[t]?.[act.key]);
                        const someAct = group.tabs.some((t) => permMap[t]?.[act.key]) && !allAct;
                        return (
                          <td key={act.key} className="text-center">
                            <input
                              type="checkbox"
                              aria-label={`${group.label} all ${act.label}`}
                              checked={allAct}
                              ref={(el) => {
                                if (el) el.indeterminate = someAct;
                              }}
                              onChange={() => handleToggleGroupAction(group.tabs, act.key)}
                              className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                            />
                          </td>
                        );
                      })}
                    </tr>

                    {/* Child Tab Rows */}
                    {isExpanded &&
                      group.tabs.map((tabName, idx) => {
                        const tabPerm = permMap[tabName];
                        const isLast = idx === group.tabs.length - 1;
                        return (
                          <tr key={tabName}>
                            <td>
                              <div className="flex items-center pl-7">
                                <span className="text-muted-foreground/50 font-mono mr-2.5 select-none">
                                  {isLast ? "└─" : "├─"}
                                </span>
                                <span className="font-medium text-foreground">{tabName}</span>
                              </div>
                            </td>
                            <td className="text-center">
                              <input
                                type="checkbox"
                                aria-label={`${tabName} tab access`}
                                checked={tabPerm.access}
                                onChange={() => handleToggleTabAccess(tabName)}
                                className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                              />
                            </td>
                            {actionKeys.map((act) => (
                              <td key={act.key} className="text-center">
                                <input
                                  type="checkbox"
                                  aria-label={`${tabName} ${act.label} button access`}
                                  checked={tabPerm[act.key]}
                                  onChange={() => handleToggleTabAction(tabName, act.key)}
                                  className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                                />
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
