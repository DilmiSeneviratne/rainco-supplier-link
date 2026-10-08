import { createFileRoute } from "@tanstack/react-router";
import { UserDepartments } from "@/components/rainco/checklist";
import { pageMeta } from "@/components/rainco/workspace";

export const Route = createFileRoute("/departments")({
  head: () => pageMeta("Departments", "Configure Rainco departments."),
  component: UserDepartments,
});
