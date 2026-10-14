import { createFileRoute } from "@tanstack/react-router";
import { SupplierTypes } from "@/components/rainco/checklist";
import { pageMeta } from "@/components/rainco/workspace";
export const Route = createFileRoute("/supplier-types")({
  head: () =>
    pageMeta("Supplier Types", "Configure Rainco supplier types such as Foreign and Local."),
  component: SupplierTypes,
});
