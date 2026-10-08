import { createFileRoute } from "@tanstack/react-router";
import { CriteriasMaster } from "@/components/rainco/checklist";
import { pageMeta } from "@/components/rainco/workspace";
export const Route = createFileRoute("/criterias")({
    head: () => pageMeta("Criterias", "Configure Rainco supplier evaluation criterias."),
    component: CriteriasMaster,
});
