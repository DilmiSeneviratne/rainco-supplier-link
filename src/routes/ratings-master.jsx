import { createFileRoute } from "@tanstack/react-router";
import { RatingsMaster } from "@/components/rainco/checklist";
import { pageMeta } from "@/components/rainco/workspace";
export const Route = createFileRoute("/ratings-master")({
    head: () => pageMeta("Conditions", "Configure Rainco supplier evaluation conditions."),
    component: RatingsMaster,
});
