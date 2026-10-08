import { createFileRoute } from "@tanstack/react-router";
import { Quotations } from "@/components/rainco/business-pages";
import { pageMeta } from "@/components/rainco/workspace";
export const Route = createFileRoute("/quotations")({
    head: () => pageMeta("Purchase Quotations", "Review and update purchase quotation requests from Rainco."),
    component: Quotations,
});
