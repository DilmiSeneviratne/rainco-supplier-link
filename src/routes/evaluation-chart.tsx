import { createFileRoute } from "@tanstack/react-router";
import { EvaluationChartPage } from "@/components/rainco/business-pages";
import { pageMeta } from "@/components/rainco/workspace";

export const Route = createFileRoute("/evaluation-chart")({
  head: () =>
    pageMeta(
      "Evaluation Chart",
      "Rainco supplier evaluation chart plotting desirability score against feasibility score.",
    ),
  component: EvaluationChartPage,
});
