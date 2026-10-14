import { createFileRoute } from "@tanstack/react-router";
import { RespondedApprovalsPage } from "@/components/rainco/approval-management";
import { pageMeta } from "@/components/rainco/workspace";

export const Route = createFileRoute("/responded-approvals")({
  head: () =>
    pageMeta(
      "Approved Approvals",
      "Audit records of approved supplier registrations, conditions, and evaluations.",
    ),
  component: RespondedApprovalsPage,
});
