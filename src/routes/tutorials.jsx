import { createFileRoute } from "@tanstack/react-router";
import { TutorialsMaster } from "@/components/rainco/checklist";
import { pageMeta } from "@/components/rainco/workspace";

export const Route = createFileRoute("/tutorials")({
    head: () => pageMeta("Tutorials", "Configure Rainco master tutorials."),
    component: TutorialsMaster,
});
