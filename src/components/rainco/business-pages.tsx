import { useState } from "react";
import { z } from "zod";
import { Check, Layers, ListOrdered, Mail, Save, Send, Star, UserCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccessNotice, PageHeading, useWorkspace } from "./workspace";
import { Field } from "./registration";

const criteria = [
  "Product quality",
  "Delivery performance",
  "Pricing competitiveness",
  "Responsiveness",
  "Documentation compliance",
];
export function Ratings() {
  const { role } = useWorkspace();
  if (role !== "supplier") return <AccessNotice audience="supplier" />;
  return (
    <>
      <PageHeading
        eyebrow="SUPPLIER PORTAL"
        title="My Ratings"
        description="Northwind Traders Ltd · Latest published evaluation"
      />
      <div className="score-strip">
        <div className="big-score">
          86<small>/100</small>
        </div>
        <div>
          <h2>Good performance</h2>
          <p>Evaluation period: July – September 2026</p>
        </div>
        <span className="badge ml-auto">Published</span>
      </div>
      <div className="master-table">
        <table className="data-table">
          <thead>
            <tr>
              <th>Evaluation criterion</th>
              <th>Rating</th>
              <th>Rainco remarks</th>
            </tr>
          </thead>
          <tbody>
            {criteria.map((c, i) => (
              <tr key={c}>
                <td>{c}</td>
                <td>{[90, 85, 80, 90, 85][i]} / 100</td>
                <td>
                  {
                    [
                      "Consistent quality across deliveries",
                      "Most orders delivered on schedule",
                      "Competitive pricing with room to improve",
                      "Prompt communication",
                      "Complete and current documents",
                    ][i]
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
export function Evaluation() {
  const { role } = useWorkspace();
  const [scores, setScores] = useState([90, 85, 80, 90, 85]);
  const [message, setMessage] = useState("");
  const [remark, setRemark] = useState(
    "Consistent supplier performance during this evaluation period.",
  );
  if (role !== "rainco") return <AccessNotice audience="rainco" />;
  return (
    <>
      <PageHeading
        eyebrow="RAINCO PROCUREMENT"
        title="Supplier Evaluation"
        description="Evaluate supplier performance against the selected criteria."
      />
      <div className="master-controls">
        <Field label="Supplier">
          <select>
            <option>Northwind Traders Ltd</option>
          </select>
        </Field>
        <Field label="Evaluation period">
          <select>
            <option>July – September 2026</option>
            <option>October – December 2026</option>
          </select>
        </Field>
      </div>
      <div className="master-table">
        <table className="data-table">
          <thead>
            <tr>
              <th>Evaluation criterion</th>
              <th>Score / 100</th>
            </tr>
          </thead>
          <tbody>
            {criteria.map((c, i) => (
              <tr key={c}>
                <td>{c}</td>
                <td>
                  <input
                    aria-label={`${c} score`}
                    className="grid-input max-w-24"
                    type="number"
                    min={0}
                    max={100}
                    value={scores[i]}
                    onChange={(e) =>
                      setScores(scores.map((s, j) => (j === i ? Number(e.target.value) : s)))
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="score-strip">
        <div className="big-score">
          {Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)}
          <small>/100</small>
        </div>
        <p>Overall rating · Equal-weight sample criteria</p>
      </div>
      <Field label="Evaluation remarks">
        <textarea maxLength={1000} value={remark} onChange={(e) => setRemark(e.target.value)} />
      </Field>
      <div className="action-footer">
        <small>Sample criteria; final scoring rules to be confirmed.</small>
        <Button
          onClick={() =>
            setMessage(
              scores.every((s) => Number.isFinite(s) && s >= 0 && s <= 100)
                ? "Evaluation saved in this preview. No rating has been published to a supplier."
                : "Each score must be between 0 and 100.",
            )
          }
        >
          <Save />
          Save evaluation
        </Button>
      </div>
      {message && (
        <div className="notice" role="status">
          {message}
        </div>
      )}
    </>
  );
}
export function Quotations() {
  const { role } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState("1250");
  const [days, setDays] = useState("14");
  const [remark, setRemark] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  if (role !== "supplier") return <AccessNotice audience="supplier" />;
  return (
    <>
      <PageHeading
        eyebrow="SUPPLIER PORTAL"
        title="Purchase Quotations"
        description="Purchase quotation requests from Rainco."
      />
      <div className="master-table table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>Quotation No.</th>
              <th>Issue date</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Due date</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-primary">PQ-2026-0042</td>
              <td>06 Oct 2026</td>
              <td>Polyester fabric · Navy</td>
              <td>500 m</td>
              <td>15 Oct 2026</td>
              <td>
                <span className={`badge ${submitted ? "" : "pending"}`}>
                  {submitted ? "Response submitted" : "Awaiting response"}
                </span>
              </td>
              <td>
                <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
                  Update quotation
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {submitted && (
        <div className="notice success" role="status">
          Quotation response retained in the preview: LKR {Number(price).toLocaleString()} / m ·
          Delivery in {days} days. No response sent to SAP.
        </div>
      )}
      {open && (
        <div className="modal-backdrop">
          <div className="modal" role="dialog" aria-modal="true" aria-label="Update quotation">
            <div className="flex justify-between">
              <h2>Update quotation</h2>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close quotation"
                onClick={() => setOpen(false)}
              >
                <X />
              </Button>
            </div>
            <p className="mb-6 text-xs text-muted-foreground">
              PQ-2026-0042 · Polyester fabric · 500 m
            </p>
            <Field label="Unit price (LKR)" required>
              <input
                type="number"
                min="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Field>
            <Field label="Delivery lead time (days)" required>
              <input
                type="number"
                min="1"
                max="365"
                value={days}
                onChange={(e) => setDays(e.target.value)}
              />
            </Field>
            <Field label="Remark">
              <textarea
                maxLength={1000}
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </Field>
            <p className="mt-3 text-sm">Total: LKR {(Number(price) * 500).toLocaleString()}</p>
            {message && <div className="notice error">{message}</div>}
            <div className="modal-actions">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const valid = z
                    .object({
                      price: z.coerce.number().positive().max(100000000),
                      days: z.coerce.number().int().min(1).max(365),
                      remark: z.string().max(1000),
                    })
                    .safeParse({ price, days, remark });
                  if (!valid.success) {
                    setMessage(
                      "Enter a positive price and a delivery time between 1 and 365 days.",
                    );
                    return;
                  }
                  setSubmitted(true);
                  setOpen(false);
                  setMessage("");
                }}
              >
                <Send />
                Submit response
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
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
      <PageHeading
        eyebrow="RAINCO PROCUREMENT"
        title="Supplier Invitations"
        description="Supplier invitation links are automatically generated and sent via email."
      />
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
        {sent && (
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
        )}
      </div>
    </>
  );
}
