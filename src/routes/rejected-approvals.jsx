import { createFileRoute } from "@tanstack/react-router";
import { RejectedApprovalsPage } from "@/components/rainco/approval-management";
import { pageMeta } from "@/components/rainco/workspace";

export const Route = createFileRoute("/rejected-approvals")({
  head: () =>
    pageMeta(
      "Rejected Approvals",
      "View-only audit records of rejected supplier registrations, conditions, and evaluations.",
    ),
  component: RejectedApprovalsPage,
});
