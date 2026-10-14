import { createFileRoute } from "@tanstack/react-router";
import { SuppliersPage } from "@/components/rainco/administration";
import { pageMeta } from "@/components/rainco/workspace";
export const Route = createFileRoute("/suppliers")({
  head: () => pageMeta("Suppliers", "View registered suppliers in the Rainco portal."),
  component: SuppliersPage,
});
