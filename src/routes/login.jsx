import { createFileRoute } from "@tanstack/react-router";
import { Login } from "@/components/rainco/login";
import { pageMeta } from "@/components/rainco/workspace";
export const Route = createFileRoute("/login")({
    head: () => pageMeta("Supplier Portal Sign-In", "Sign in to the Rainco Supplier Portal with your registered credentials."),
    component: Login,
});
