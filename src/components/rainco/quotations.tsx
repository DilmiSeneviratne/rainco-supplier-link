import { useState } from "react";
import { Paperclip, Save, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccessNotice, PageHeading, useWorkspace } from "./workspace";
import { Field } from "./registration";

export type QuotationLineItem = {
  itemNo: string;
  itemName: string;
  requiredDate: string;
  requiredQuantity: number;
  uom: string;
  lastPurchasePrice: number;
  quotedDate: string;
  quotedQuantity: number;
  unitPrice: number;
  discount: number;
  taxCode: string;
};

export type PurchaseQuotation = {
  id: string;
  issuedDate: string;
  requiredDate: string;
  status: "Awaiting Response" | "Updated";
  items: QuotationLineItem[];
  attachments: string[];
};

const taxCodes = ["VAT-18", "SVAT-0", "EXEMPT", "NBT-2"];

const initialQuotations: PurchaseQuotation[] = [
  {
    id: "PQ-2026-0042",
    issuedDate: "06 Oct 2026",
    requiredDate: "2026-10-15",
    status: "Awaiting Response",
    attachments: [],
    items: [
      {
        itemNo: "ITM-1001",
        itemName: "Polyester fabric · Navy",
        requiredDate: "2026-10-15",
        requiredQuantity: 500,
        uom: "m",
        lastPurchasePrice: 1220,
        quotedDate: "2026-10-14",
        quotedQuantity: 500,
        unitPrice: 1250,
        discount: 0,
        taxCode: "VAT-18",
      },
      {
        itemNo: "ITM-1002",
        itemName: "Waterproof canopy coating resin",
        requiredDate: "2026-10-15",
        requiredQuantity: 120,
        uom: "kg",
        lastPurchasePrice: 3350,
        quotedDate: "2026-10-15",
        quotedQuantity: 120,
        unitPrice: 3400,
        discount: 5,
        taxCode: "VAT-18",
      },
    ],
  },
  {
    id: "PQ-2026-0048",
    issuedDate: "08 Oct 2026",
    requiredDate: "2026-10-22",
    status: "Awaiting Response",
    attachments: [],
    items: [
      {
        itemNo: "ITM-2014",
        itemName: "Fiberglass umbrella ribs · 24 inch",
        requiredDate: "2026-10-22",
        requiredQuantity: 2000,
        uom: "pcs",
        lastPurchasePrice: 180,
        quotedDate: "2026-10-20",
        quotedQuantity: 2000,
        unitPrice: 185,
        discount: 2,
        taxCode: "SVAT-0",
      },
    ],
  },
];

function QuotationsListTable({
  quotations,
  isSupplierDeactivated,
  supplierStatus,
  onOpenQuotation,
}: {
  quotations: PurchaseQuotation[];
  isSupplierDeactivated: boolean;
  supplierStatus: string;
  onOpenQuotation: (quotation: PurchaseQuotation) => void;
}) {
  return (
    <div className="master-table table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            <th>Quotation No.</th>
            <th>Issued Date</th>
            <th>Status</th>
            <th className="w-28 text-right" />
          </tr>
        </thead>
        <tbody>
          {quotations.map((quotation) => (
            <tr key={quotation.id}>
              <td className="text-primary font-mono font-medium">{quotation.id}</td>
              <td>{quotation.issuedDate}</td>
              <td>
                <span
                  className={`badge ${
                    isSupplierDeactivated
                      ? "bg-red-100 text-red-800"
                      : quotation.status === "Updated"
                        ? ""
                        : "pending"
                  }`}
                >
                  {isSupplierDeactivated ? `Blocked (${supplierStatus})` : quotation.status}
                </span>
              </td>
              <td className="text-right">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isSupplierDeactivated}
                  onClick={() => onOpenQuotation(quotation)}
                >
                  {isSupplierDeactivated ? "Deactivated" : "View"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function QuotationEditModal({
  quotation,
  supplierName,
  modalError,
  onClose,
  onItemChange,
  onUploadAttachments,
  onRemoveAttachment,
  onSave,
}: {
  quotation: PurchaseQuotation;
  supplierName: string;
  modalError: string;
  onClose: () => void;
  onItemChange: <K extends keyof QuotationLineItem>(
    itemNo: string,
    field: K,
    value: QuotationLineItem[K],
  ) => void;
  onUploadAttachments: (files: FileList | null) => void;
  onRemoveAttachment: (fileName: string) => void;
  onSave: () => void;
}) {
  return (
    <div className="modal-backdrop">
      <div
        className="modal !max-w-5xl"
        role="dialog"
        aria-modal="true"
        aria-label={`Quotation ${quotation.id}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <h2 className="!mb-0">{quotation.id}</h2>
            <span className={`badge ${quotation.status === "Updated" ? "" : "pending"}`}>
              {quotation.status}
            </span>
          </div>
          <Button variant="ghost" size="icon" aria-label="Close quotation" onClick={onClose}>
            <X />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <Field label="Vendor Name">
            <input type="text" value={supplierName} readOnly className="bg-muted/50" />
          </Field>
          <Field label="Required Date">
            <input
              type="date"
              value={quotation.requiredDate}
              readOnly
              className="bg-muted/50 font-mono"
            />
          </Field>
        </div>

        <div className="overflow-x-auto rounded border border-border">
          <table className="data-table">
            <thead>
              <tr>
                <th>Item No</th>
                <th>Item Name</th>
                <th>Required Date</th>
                <th className="text-right">Required Quantity</th>
                <th>UOM</th>
                <th className="text-right">Last Purchase Price</th>
                <th>Quoted Date</th>
                <th>Quoted Quantity</th>
                <th>Unit Price</th>
                <th>Discount (%)</th>
                <th>Tax Code</th>
              </tr>
            </thead>
            <tbody>
              {quotation.items.map((item) => (
                <tr key={item.itemNo}>
                  <td className="font-mono text-xs text-primary font-medium">{item.itemNo}</td>
                  <td className="font-medium text-foreground">{item.itemName}</td>
                  <td className="font-mono text-xs text-muted-foreground">{item.requiredDate}</td>
                  <td className="text-right font-mono tabular-nums">{item.requiredQuantity}</td>
                  <td className="font-mono text-xs">{item.uom}</td>
                  <td className="text-right font-mono tabular-nums text-muted-foreground">
                    {item.lastPurchasePrice.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td>
                    <input
                      type="date"
                      aria-label={`${item.itemNo} quoted date`}
                      className="grid-input font-mono text-xs min-w-34"
                      value={item.quotedDate}
                      onChange={(e) => onItemChange(item.itemNo, "quotedDate", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      aria-label={`${item.itemNo} quoted quantity`}
                      className="grid-input font-mono tabular-nums w-24"
                      value={item.quotedQuantity}
                      onChange={(e) =>
                        onItemChange(item.itemNo, "quotedQuantity", Number(e.target.value))
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min={0.01}
                      step="0.01"
                      aria-label={`${item.itemNo} unit price`}
                      className="grid-input font-mono tabular-nums w-28"
                      value={item.unitPrice}
                      onChange={(e) =>
                        onItemChange(item.itemNo, "unitPrice", Number(e.target.value))
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step="0.1"
                      aria-label={`${item.itemNo} discount`}
                      className="grid-input font-mono tabular-nums w-20"
                      value={item.discount}
                      onChange={(e) =>
                        onItemChange(item.itemNo, "discount", Number(e.target.value))
                      }
                    />
                  </td>
                  <td>
                    <select
                      aria-label={`${item.itemNo} tax code`}
                      className="grid-input font-mono text-xs min-w-28"
                      value={item.taxCode}
                      onChange={(e) => onItemChange(item.itemNo, "taxCode", e.target.value)}
                    >
                      {taxCodes.map((code) => (
                        <option key={code} value={code}>
                          {code}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 pt-4 border-t border-border space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Paperclip size={14} className="text-primary" />
              Attachments
            </h3>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-border bg-card hover:bg-muted text-xs font-medium text-foreground cursor-pointer transition-colors">
              <Upload size={13} className="text-primary" />
              <span>Upload Attachment</span>
              <input
                type="file"
                multiple
                aria-label="Upload quotation attachment"
                className="hidden"
                onChange={(e) => {
                  onUploadAttachments(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          </div>

          {quotation.attachments.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {quotation.attachments.map((fileName) => (
                <div
                  key={fileName}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-border bg-muted/40 text-xs"
                >
                  <Paperclip size={12} className="text-primary shrink-0" />
                  <span className="font-mono text-foreground truncate max-w-60">{fileName}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveAttachment(fileName)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    title={`Remove ${fileName}`}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No attachments uploaded.</p>
          )}
        </div>

        {modalError && <div className="notice error">{modalError}</div>}

        <div className="modal-actions">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            <Save />
            Update quotation
          </Button>
        </div>
      </div>
    </div>
  );
}

export function Quotations() {
  const { role, supplier } = useWorkspace();
  const [quotations, setQuotations] = useState<PurchaseQuotation[]>(initialQuotations);
  const [activeQuotation, setActiveQuotation] = useState<PurchaseQuotation | null>(null);
  const [modalError, setModalError] = useState("");
  const [savedNotice, setSavedNotice] = useState("");

  if (role !== "supplier") return <AccessNotice audience="supplier" />;

  const handleOpenQuotation = (quotation: PurchaseQuotation) => {
    setActiveQuotation({
      ...quotation,
      items: quotation.items.map((item) => ({ ...item })),
      attachments: [...quotation.attachments],
    });
    setModalError("");
  };

  const handleUploadAttachments = (files: FileList | null) => {
    if (!activeQuotation || !files || files.length === 0) return;
    const uploadedNames = Array.from(files).map((f) => f.name);
    setActiveQuotation({
      ...activeQuotation,
      attachments: [
        ...activeQuotation.attachments,
        ...uploadedNames.filter((name) => !activeQuotation.attachments.includes(name)),
      ],
    });
  };

  const handleRemoveAttachment = (fileName: string) => {
    if (!activeQuotation) return;
    setActiveQuotation({
      ...activeQuotation,
      attachments: activeQuotation.attachments.filter((f) => f !== fileName),
    });
  };

  const handleDraftItemChange = <K extends keyof QuotationLineItem>(
    itemNo: string,
    field: K,
    value: QuotationLineItem[K],
  ) => {
    if (!activeQuotation) return;
    setActiveQuotation({
      ...activeQuotation,
      items: activeQuotation.items.map((item) =>
        item.itemNo === itemNo ? { ...item, [field]: value } : item,
      ),
    });
  };

  const handleUpdateQuotation = () => {
    if (!activeQuotation) return;

    const hasInvalid = activeQuotation.items.some(
      (item) =>
        !item.quotedDate ||
        item.quotedQuantity <= 0 ||
        item.unitPrice <= 0 ||
        item.discount < 0 ||
        item.discount > 100 ||
        !item.taxCode.trim(),
    );

    if (hasInvalid) {
      setModalError(
        "Please enter valid Quoted Date, Quoted Quantity (> 0), Unit Price (> 0), Discount (0–100%), and Tax Code for all items.",
      );
      return;
    }

    const updated: PurchaseQuotation = {
      ...activeQuotation,
      status: "Updated",
    };

    setQuotations((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
    setSavedNotice(`Quotation ${updated.id} updated successfully in this preview session.`);
    setActiveQuotation(null);
    setModalError("");
  };

  const isSupplierDeactivated = Boolean(
    supplier.transactionBlocked ||
      supplier.status === "Inactive" ||
      supplier.status === "Blacklisted",
  );

  return (
    <>
      <PageHeading eyebrow="SUPPLIER PORTAL" title="Purchase Quotations" />

      {isSupplierDeactivated && (
        <div className="notice error mb-5" role="alert">
          <strong>Supplier Account {supplier.status}:</strong> Your Supplier Master Data has been
          marked as <strong>{supplier.status}</strong> based on the Supplier Evaluation Result
          Report. Your account is deactivated across all transaction levels (Purchase Quotations,
          Purchase Orders, GRN, and AP Invoicing).
        </div>
      )}

      <QuotationsListTable
        quotations={quotations}
        isSupplierDeactivated={isSupplierDeactivated}
        supplierStatus={supplier.status}
        onOpenQuotation={handleOpenQuotation}
      />

      {savedNotice && (
        <div className="notice success" role="status">
          {savedNotice}
        </div>
      )}

      {activeQuotation && (
        <QuotationEditModal
          quotation={activeQuotation}
          supplierName={supplier.name}
          modalError={modalError}
          onClose={() => setActiveQuotation(null)}
          onItemChange={handleDraftItemChange}
          onUploadAttachments={handleUploadAttachments}
          onRemoveAttachment={handleRemoveAttachment}
          onSave={handleUpdateQuotation}
        />
      )}
    </>
  );
}
