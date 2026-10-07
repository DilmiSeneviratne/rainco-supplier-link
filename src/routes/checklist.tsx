import { createFileRoute } from "@tanstack/react-router";
import { Checklist } from "@/components/rainco/checklist";
import { pageMeta } from "@/components/rainco/workspace";
export const Route = createFileRoute("/checklist")({
  head: () => pageMeta("Supplier Checklist", "Required registration documents by business type."),
  component: Checklist,
});
