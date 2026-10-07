import { createFileRoute } from "@tanstack/react-router";
import { ApprovalStagesPage } from "@/components/rainco/approval-management";
import { pageMeta } from "@/components/rainco/workspace";

export const Route = createFileRoute("/approval-stages")({
  head: () =>
    pageMeta(
      "Approval Stages",
      "Configure Rainco supplier onboarding approval stages, required approvals, and authorizer department matrices.",
    ),
  component: ApprovalStagesPage,
});
