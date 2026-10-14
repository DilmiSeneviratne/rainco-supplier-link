import { createFileRoute } from "@tanstack/react-router";
import { Ratings } from "@/components/rainco/business-pages";
import { pageMeta } from "@/components/rainco/workspace";
export const Route = createFileRoute("/ratings")({
  head: () => pageMeta("My Evaluation", "Supplier evaluation scores and marks from Rainco."),
  component: Ratings,
});
