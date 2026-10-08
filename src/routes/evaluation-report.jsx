import { createFileRoute } from "@tanstack/react-router";
import { EvaluationReport } from "@/components/rainco/business-pages";
import { pageMeta } from "@/components/rainco/workspace";
export const Route = createFileRoute("/evaluation-report")({
    head: () => pageMeta("Supplier Evaluation Result Report", "Rainco supplier evaluation result report with supplier code, name, evaluation results, and rating."),
    component: EvaluationReport,
});
