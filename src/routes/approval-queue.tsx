import { createFileRoute } from "@tanstack/react-router";
import { SupplierApprovalQueuePage } from "@/components/rainco/approval-management";
import { pageMeta } from "@/components/rainco/workspace";

export const Route = createFileRoute("/approval-queue")({
  head: () =>
    pageMeta(
      "Supplier Approval Queue",
      "Monitor registered suppliers progressing through approval workflows and authorizer sign-offs.",
    ),
  component: SupplierApprovalQueuePage,
});
