import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/rainco/dashboard";
import { pageMeta } from "@/components/rainco/workspace";
export const Route = createFileRoute("/")({
    head: () => pageMeta("Supplier Portal Dashboard", "Rainco supplier dashboard: overview of purchase quotation requests, performance ratings, and compliance records."),
    component: Dashboard,
});
