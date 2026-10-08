import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Check, CheckCircle2, Eye, EyeOff, FileText, Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  businessTypes,
  RaincoLogo,
  type BusinessType,
  type DocumentRow,
} from "./workspace";

export const contactFields = [
  "First name",
  "Last name",
  "NIC",
  "Mobile",
  "Email",
  "Title",
  "Position",
  "Address",
];

export const addressFields = [
  "Address",
  "House no",
  "Building",
  "Street",
  "City",
  "Country",
  "State",
  "Zipcode",
];

export function Field({
  label,
  children,
  required = false,
}: {
  label: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="field">
      <span className="field-label">
        {label}
        {required && <span className="required-star">*</span>}
      </span>
      {children}
    </label>
  );
}

export function RegistrationBanner({
  submitted,
  uploaded,
  totalRequired,
}: {
  submitted: boolean;
  uploaded: number;
  totalRequired: number;
}) {
  return (
    <div className="registration-banner">
      <div>
        <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white shadow-sm mb-2.5">
          <RaincoLogo className="h-6 w-auto" />
        </div>
        <div className="banner-eyebrow">
          <Mail size={13} /> EMAIL INVITATION LINK <span> / </span> SUPPLIER ONBOARDING
        </div>
        <h1>Supplier Registration</h1>
        <div className="mt-2.5 text-xs opacity-90 flex items-center gap-2">
          <span>Direct link from invitation email</span>
          <span>·</span>
          <Link to="/login" className="underline hover:opacity-100 font-medium">
            Already have credentials? Log in here
          </Link>
        </div>
      </div>
      <div className="banner-status">
        <small>INVITATION LINK STATUS</small>
        <strong>{submitted ? "Submitted & Redirecting..." : "Active Invitation"}</strong>
        <div className="mt-2 flex items-center gap-2 text-[10px] opacity-80">
          <span className="status-dot" />
          {uploaded} of {totalRequired} documents attached
        </div>
      </div>
    </div>
  );
}

export function RegistrationHeaderForm({
  header,
  setHeader,
  setSubmitted,
  showPassword,
  setShowPassword,
}: {
  header: Record<string, string>;
  setHeader: (header: any) => void;
  setSubmitted: (submitted: boolean) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}) {
  return (
    <section className="form-section">
      <div className="section-heading">
        <h2>Registration Header</h2>
      </div>
      <div className="field-grid">
        {Object.entries(header).map(([key, value]) => (
          <div key={key} className={key === "Remark" ? "field-wide" : ""}>
            <Field label={key} required={key !== "Remark"}>
              {key === "Type of Business" ? (
                <select
                  value={value}
                  onChange={(e) => {
                    setHeader({ ...header, [key]: e.target.value });
                    setSubmitted(false);
                  }}
                >
                  {businessTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              ) : key === "Currency" ? (
                <select
                  value={value}
                  onChange={(e) => setHeader({ ...header, [key]: e.target.value })}
                >
                  {["LKR", "USD", "EUR", "GBP"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              ) : key === "Remark" ? (
                <textarea
                  maxLength={1000}
                  value={value}
                  onChange={(e) => setHeader({ ...header, [key]: e.target.value })}
                />
              ) : key === "Password" ? (
                <div className="password-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    maxLength={128}
                    value={value}
                    onChange={(e) => setHeader({ ...header, [key]: e.target.value })}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              ) : (
                <input
                  type={key === "Email" ? "email" : "text"}
                  maxLength={200}
                  value={value}
                  onChange={(e) => setHeader({ ...header, [key]: e.target.value })}
                />
              )}
            </Field>
          </div>
        ))}
      </div>
    </section>
  );
}

export function DocumentOverviewSection({
  type,
  uploaded,
  requiredDocs,
  uploads,
}: {
  type: BusinessType;
  uploaded: number;
  requiredDocs: DocumentRow[];
  uploads: Record<string, string>;
}) {
  return (
    <section className="document-overview">
      <div className="section-heading">
        <h2>Attachments</h2>
        <span>
          Required for {type}{" "}
          <span className="ml-3 text-primary">
            {uploaded}/{requiredDocs.length}
          </span>
        </span>
      </div>
      <div className="document-cards">
        {requiredDocs.map((doc) => (
          <div key={doc.code} className={`document-card ${uploads[doc.code] ? "" : "pending"}`}>
            <div className="flex justify-between">
              <FileText size={19} />
              {uploads[doc.code] && <Check size={14} />}
            </div>
            <div className="document-code">{doc.code}</div>
            <h3>{doc.name}</h3>
            <small>{uploads[doc.code] || "Awaiting upload"}</small>
            <div className="document-progress" data-complete={Boolean(uploads[doc.code])} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function ContactPersonModal({
  editing,
  setEditing,
  contactDraft,
  setContactDraft,
  message,
  onSave,
}: {
  editing: number;
  setEditing: (index: number | null) => void;
  contactDraft: Record<string, string>;
  setContactDraft: (draft: Record<string, string>) => void;
  message: string;
  onSave: () => void;
}) {
  return (
    <div className="modal-backdrop">
      <div className="modal" role="dialog" aria-modal="true" aria-label="Contact person">
        <div className="flex justify-between">
          <h2>{editing === -1 ? "Add" : "Edit"} contact person</h2>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close contact form"
            onClick={() => setEditing(null)}
          >
            <X />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-x-4">
          {contactFields.map((f) => (
            <Field key={f} label={f} required>
              <input
                type={f === "Email" ? "email" : "text"}
                maxLength={200}
                value={contactDraft[f]}
                onChange={(e) => setContactDraft({ ...contactDraft, [f]: e.target.value })}
              />
            </Field>
          ))}
        </div>
        {message && <div className="notice error">{message}</div>}
        <div className="modal-actions">
          <Button variant="outline" onClick={() => setEditing(null)}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            <Check />
            Save contact
          </Button>
        </div>
      </div>
    </div>
  );
}
