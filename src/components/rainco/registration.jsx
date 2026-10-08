import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { z } from "zod";
import { ArrowRight, CheckCircle2, LockKeyhole, MapPin, Paperclip, Plus, Save, Trash2, Users, X, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccessNotice, useWorkspace } from "./workspace";
import { addressFields, contactFields, ContactPersonModal, DocumentOverviewSection, Field, RegistrationBanner, RegistrationHeaderForm, } from "./registration-components";
export { Field };
const initialHeader = {
    Name: "Northwind Traders Ltd",
    Email: "ops@northwind.example",
    "Phone No": "+94 77 204 8813",
    "Type of Business": "Corporate",
    Currency: "LKR",
    "Business Registration No": "PV-00827412",
    Username: "northwind_ops",
    Password: "",
    Remark: "Referred by Rainco procurement team for industrial supply.",
};
const text = z.string().trim().min(1).max(200);
const registrationSchema = z.object({
    Name: text,
    Email: z.string().email().max(255),
    "Phone No": z.string().regex(/^[+\d\s()-]{7,25}$/),
    "Type of Business": z.enum(["Individual", "Corporate", "Government"]),
    Currency: z.enum(["LKR", "USD", "EUR", "GBP"]),
    "Business Registration No": text,
    Username: z.string().regex(/^[a-zA-Z0-9_.-]{3,50}$/),
    Password: z.string().min(8).max(128),
    Remark: z.string().max(1000),
});
export function Registration() {
    const { role, documents, registerSupplier } = useWorkspace();
    const router = useRouter();
    const [header, setHeader] = useState(initialHeader);
    const [tab, setTab] = useState("Contact Persons");
    const [contacts, setContacts] = useState([
        {
            "First name": "Rukshan",
            "Last name": "Perera",
            NIC: "871234567V",
            Mobile: "+94 77 204 8813",
            Email: "r.perera@northwind.example",
            Title: "Mr",
            Position: "Procurement Lead",
            Address: "No. 12, Temple Road, Colombo",
        },
        {
            "First name": "Dilani",
            "Last name": "Fernando",
            NIC: "903311204X",
            Mobile: "+94 71 998 2210",
            Email: "d.fernando@northwind.example",
            Title: "Ms",
            Position: "Accounts Officer",
            Address: "Lot 7, Kandy Road, Peradeniya",
        },
    ]);
    const [address, setAddress] = useState({
        Address: "Head Office",
        "House no": "12",
        Building: "Northwind House",
        Street: "Temple Road",
        City: "Colombo",
        Country: "Sri Lanka",
        State: "Western Province",
        Zipcode: "00300",
    });
    const [uploads, setUploads] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [editing, setEditing] = useState(null);
    const [contactDraft, setContactDraft] = useState({});
    const type = header["Type of Business"];
    const requiredDocs = documents[type];
    const uploaded = requiredDocs.filter((doc) => uploads[doc.code]).length;
    function saveContact() {
        const valid = z
            .object({
            "First name": text,
            "Last name": text,
            NIC: text,
            Mobile: z.string().regex(/^[+\d\s()-]{7,25}$/),
            Email: z.string().email(),
            Title: text,
            Position: text,
            Address: text,
        })
            .safeParse(contactDraft);
        if (!valid.success) {
            setMessage("Please complete all contact fields and enter a valid email and mobile number.");
            return;
        }
        setContacts(editing === -1
            ? [...contacts, contactDraft]
            : contacts.map((c, i) => (i === editing ? contactDraft : c)));
        setEditing(null);
        setMessage("");
    }
    function submit() {
        const valid = registrationSchema.safeParse(header);
        if (!valid.success) {
            setMessage(valid.error.issues.map((i) => `${i.path.join("")}: ${i.message}`).join(" · "));
            return;
        }
        if (!contacts.length || addressFields.some((f) => !address[f]?.trim())) {
            setMessage("Complete contact persons and all address details before submitting.");
            return;
        }
        if (uploaded !== requiredDocs.length) {
            setTab("Attachments");
            setMessage("Upload every required document for your selected business type.");
            return;
        }
        setSubmitted(true);
        registerSupplier({
            name: header.Name,
            email: header.Email,
            phone: header["Phone No"],
            businessType: header["Type of Business"],
            currency: header.Currency,
            registrationNo: header["Business Registration No"],
            username: header.Username,
            password: header.Password || "password123",
            remark: header.Remark,
            contactsCount: contacts.length,
            documentsAttached: uploaded,
            totalDocumentsRequired: requiredDocs.length,
        });
        setMessage("Registration submitted successfully! Redirecting to login page...");
        setTimeout(() => {
            router.navigate({ to: "/login" });
        }, 600);
    }
    if (role !== "supplier")
        return <AccessNotice audience="supplier"/>;
    return (<>
      <RegistrationBanner submitted={submitted} uploaded={uploaded} totalRequired={requiredDocs.length}/>

      <div className="invitation-note">
        <CheckCircle2 size={13}/> Secure email invitation verified · Complete company profile,
        contacts, and attachments{" "}
        <span className="ml-auto">
          Required fields <span className="text-primary">*</span>
        </span>
      </div>

      <RegistrationHeaderForm header={header} setHeader={setHeader} setSubmitted={setSubmitted} showPassword={showPassword} setShowPassword={setShowPassword}/>

      <section className="child-section">
        <div className="child-tabs" role="tablist" aria-label="Registration details">
          {[
            { name: "Contact Persons", icon: Users, count: contacts.length },
            { name: "Address Details", icon: MapPin, count: 1 },
            { name: "Attachments", icon: Paperclip, count: requiredDocs.length },
        ].map((t) => (<Button key={t.name} variant="tab" role="tab" aria-selected={tab === t.name} data-active={tab === t.name} onClick={() => setTab(t.name)}>
              <t.icon />
              {t.name}
              <span className="tab-count">{t.count}</span>
            </Button>))}
        </div>

        <div className="child-body" role="tabpanel">
          {tab === "Contact Persons" && (<>
              <div className="table-toolbar">
                <div>
                  <strong>Contact persons</strong>
                </div>
                <Button size="sm" onClick={() => {
                setEditing(-1);
                setContactDraft(Object.fromEntries(contactFields.map((f) => [f, ""])));
            }}>
                  <Plus />
                  Add contact person
                </Button>
              </div>
              <div className="table-scroll">
                <table className="data-table contact-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      {contactFields.map((f) => (<th key={f}>{f}</th>))}
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact, i) => (<tr key={i}>
                        <td className="row-number">{String(i + 1).padStart(2, "0")}</td>
                        {contactFields.map((f) => (<td key={f}>{contact[f]}</td>))}
                        <td>
                          <div className="flex">
                            <Button variant="ghost" size="sm" onClick={() => {
                    setEditing(i);
                    setContactDraft({ ...contact });
                }}>
                              Edit
                            </Button>
                            <Button title="Remove contact" aria-label={`Remove contact ${i + 1}`} variant="ghost" size="icon" onClick={() => setContacts(contacts.filter((_, j) => j !== i))}>
                              <Trash2 size={13}/>
                            </Button>
                          </div>
                        </td>
                      </tr>))}
                  </tbody>
                </table>
              </div>
            </>)}

          {tab === "Address Details" && (<>
              <div className="table-toolbar">
                <strong>Registered business address</strong>
                <span className="badge">Primary address</span>
              </div>
              <div className="field-grid !p-0">
                {addressFields.map((f) => (<Field key={f} label={f} required>
                    <input maxLength={200} value={address[f]} onChange={(e) => setAddress({ ...address, [f]: e.target.value })}/>
                  </Field>))}
              </div>
            </>)}

          {tab === "Attachments" && (<>
              <div className="table-toolbar">
                <div>
                  <strong>Required documents</strong>
                </div>
                <span className="text-[10px] text-muted-foreground">PDF, JPG, PNG · Max 10 MB</span>
              </div>
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Document Code</th>
                      <th>Document Name</th>
                      <th>Attachment</th>
                      <th>Status</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {requiredDocs.map((doc) => (<tr key={doc.code}>
                        <td className="text-primary">{doc.code}</td>
                        <td>{doc.name}</td>
                        <td>
                          <input className="upload-input" type="file" aria-label={`Upload ${doc.name}`} accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file)
                        return;
                    if (file.size > 10 * 1024 * 1024 ||
                        !["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
                        setMessage("Choose a PDF, JPG or PNG file no larger than 10 MB.");
                        e.target.value = "";
                        return;
                    }
                    setUploads({ ...uploads, [doc.code]: file.name });
                    setMessage("");
                }}/>
                          {uploads[doc.code] && (<small className="block mt-1 text-muted-foreground">
                              {uploads[doc.code]}
                            </small>)}
                        </td>
                        <td>
                          <span className={`badge ${uploads[doc.code] ? "" : "pending"}`}>
                            {uploads[doc.code] ? "Attached" : "Required"}
                          </span>
                        </td>
                        <td>
                          {uploads[doc.code] && (<Button variant="ghost" size="icon" aria-label={`Remove ${doc.name}`} onClick={() => {
                        const next = { ...uploads };
                        delete next[doc.code];
                        setUploads(next);
                    }}>
                              <X />
                            </Button>)}
                        </td>
                      </tr>))}
                  </tbody>
                </table>
              </div>
            </>)}
        </div>
      </section>

      {tab !== "Attachments" && (<DocumentOverviewSection type={type} uploaded={uploaded} requiredDocs={requiredDocs} uploads={uploads}/>)}

      {message && (<div role="status" className={`notice ${submitted ? "success" : message.startsWith("Draft") ? "" : "error"}`}>
          {message}
        </div>)}

      <div className="action-footer">
        <small>
          <LockKeyhole size={12}/> Email invitation link · Submitting redirects to login page
        </small>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setMessage("Draft retained for this preview session only.")}>
            <Save />
            Save draft
          </Button>
          <Button size="sm" onClick={submit} disabled={submitted}>
            {submitted ? <CheckCircle2 /> : <ArrowRight />}
            {submitted ? "Redirecting to login..." : "Submit registration"}
          </Button>
        </div>
      </div>

      {editing !== null && (<ContactPersonModal editing={editing} setEditing={setEditing} contactDraft={contactDraft} setContactDraft={setContactDraft} message={message} onSave={saveContact}/>)}
    </>);
}
