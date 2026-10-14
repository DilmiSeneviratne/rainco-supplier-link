import { createFileRoute } from "@tanstack/react-router";
import { Registration } from "@/components/rainco/registration";
import { pageMeta } from "@/components/rainco/workspace";
export const Route = createFileRoute("/register")({
  head: () =>
    pageMeta(
      "Supplier Registration (Email Link)",
      "Rainco email invitation link: supplier registration with company profile, contacts, addresses, and document attachments.",
    ),
  component: Registration,
});
