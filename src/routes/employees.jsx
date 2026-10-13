import { createFileRoute } from "@tanstack/react-router";
import { EmployeeMaster } from "@/components/rainco/checklist";
import { pageMeta } from "@/components/rainco/workspace";

export const Route = createFileRoute("/employees")({
    head: () => pageMeta("Employee Master", "View Employee Master directory."),
    component: EmployeeMaster,
});
