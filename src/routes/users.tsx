import { createFileRoute } from "@tanstack/react-router";
import { UsersPage } from "@/components/rainco/administration";
import { pageMeta } from "@/components/rainco/workspace";

export const Route = createFileRoute("/users")({
  head: () => pageMeta("Users", "Manage Rainco procurement users and roles."),
  component: UsersPage,
});
