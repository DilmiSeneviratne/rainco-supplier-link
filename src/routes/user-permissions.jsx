import { createFileRoute } from "@tanstack/react-router";
import { UserPermissionsPage } from "@/components/rainco/administration";
import { pageMeta } from "@/components/rainco/workspace";
export const Route = createFileRoute("/user-permissions")({
  head: () => pageMeta("User Permissions", "Configure role permissions across Rainco modules."),
  component: UserPermissionsPage,
});
