import { createFileRoute } from "@tanstack/react-router";
import { ApprovalTemplatePage } from "@/components/rainco/approval-management";
import { pageMeta } from "@/components/rainco/workspace";
export const Route = createFileRoute("/approval-template")({
  head: () =>
    pageMeta(
      "Approval Template",
      "Configure Rainco approval templates with active status, authorized sections, and stages grid.",
    ),
  component: ApprovalTemplatePage,
});
