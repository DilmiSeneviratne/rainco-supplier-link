import { useState } from "react";
import { z } from "zod";
import { Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccessNotice, PageHeading, useWorkspace } from "./workspace";
import { Field } from "./registration";
function InvitationPreviewCard({ name }) {
  return (
    <div className="form-section p-6">
      <div className="flex gap-2 items-center text-primary">
        <Check size={16} />
        <strong className="text-xs">Invitation email preview</strong>
      </div>
      <h2 className="mt-5 text-lg">Welcome to Rainco, {name}</h2>
      <p className="text-xs text-muted-foreground my-4">
        You have been invited to register as a Rainco supplier via email link.
      </p>
      <Button asChild size="sm">
        <a href="/register">Open registration link (/register)</a>
      </Button>
      <p className="text-[10px] text-muted-foreground mt-4">
        Automated invitation link · Once registered, redirects to login
      </p>
    </div>
  );
}
export function Invitations() {
  const { role } = useWorkspace();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  if (role !== "rainco") return <AccessNotice audience="rainco" />;
  return (
    <>
      <PageHeading eyebrow="RAINCO PROCUREMENT" title="Supplier Invitations" />
      <div className="max-w-xl">
        <div className="p-4 rounded-lg border border-border bg-muted/40 mb-5 text-xs text-muted-foreground space-y-2">
          <p className="font-medium text-foreground">Automated Email Workflow Note:</p>
          <p>
            Invitation emails now directly include the secure onboarding link (
            <code>/register</code>). When a supplier opens the link, it launches the registration
            interface, validates their documents, and directs them to login and the supplier portal
            dashboard.
          </p>
          <div className="pt-2">
            <Button asChild size="sm" variant="outline" className="text-xs">
              <a href="/register">Test Email Invitation Link (/register)</a>
            </Button>
          </div>
        </div>

        <Field label="Supplier name" required>
          <input
            maxLength={200}
            value={name}
            placeholder="Company or individual name"
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <div className="mt-5">
          <Field label="Email" required>
            <input
              type="email"
              maxLength={255}
              value={email}
              placeholder="supplier@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
        </div>
        <div className="action-footer">
          <small>Automated email invitation dispatcher</small>
          <Button
            onClick={() => {
              if (
                !z
                  .object({
                    name: z.string().trim().min(1).max(200),
                    email: z.string().email().max(255),
                  })
                  .safeParse({ name, email }).success
              ) {
                setMessage("Enter a supplier name and a valid email address.");
                setSent(false);
                return;
              }
              setMessage(`Invitation email prepared for ${email}. Link: /register`);
              setSent(true);
            }}
          >
            <Mail />
            Prepare invitation email
          </Button>
        </div>
        {message && (
          <div className={`notice ${sent ? "success" : "error"}`} role="status">
            {message}
          </div>
        )}
        {sent && <InvitationPreviewCard name={name} />}
      </div>
    </>
  );
}
