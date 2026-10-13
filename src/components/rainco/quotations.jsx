import { useState } from "react";
import { Filter, Paperclip, Save, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccessNotice, PageHeading, useWorkspace } from "./workspace";
import { Field } from "./registration";
const taxCodes = ["VAT-18", "SVAT-0", "EXEMPT", "NBT-2"];
const statusFilters = ["All", "Pending", "Completed", "Canceled"];
function normalizeStatus(status) {
  if (status === "Awaiting Response" || status === "Pending") return "Pending";
  if (status === "Updated" || status === "Completed") return "Completed";
  if (status === "Canceled" || status === "Cancelled") return "Canceled";
  return status;
}
function calculateLineTotalExclTax(item) {
  const qty = Number(item.quotedQuantity) || 0;
  const price = Number(item.unitPrice) || 0;
  const discountPct = Math.min(Math.max(Number(item.discount) || 0, 0), 100);
  return qty * price * (1 - discountPct / 100);
}
function getStatusBadgeClass(status, isSupplierDeactivated) {
  if (isSupplierDeactivated) return "bg-red-100 text-red-800";
  const normalized = normalizeStatus(status);
  if (normalized === "Completed") return "bg-emerald-100 text-emerald-800";
  if (normalized === "Canceled") return "bg-red-100 text-red-800";
  return "pending";
}
function QuotationsListTable({
  quotations,
  isSupplierDeactivated,
  supplierStatus,
  onOpenQuotation,
}) {
  return (
    <div className="master-table table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            <th>Quotation No.</th>
            <th>Issued Date</th>
            <th>Required Date</th>
            <th>Status</th>
            <th className="w-32 text-right" />
          </tr>
        </thead>
        <tbody>
          {quotations.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-6 text-muted-foreground text-xs">
                No purchase quotations match the selected filter.
              </td>
            </tr>
          ) : (
            quotations.map((quotation) => {
              const normalizedStatus = normalizeStatus(quotation.status);
              const isReadOnlyRecord =
                normalizedStatus === "Completed" || normalizedStatus === "Canceled";
              return (
                <tr key={quotation.id}>
                  <td className="text-primary font-mono font-medium">{quotation.id}</td>
                  <td className="font-mono text-xs">{quotation.issuedDate}</td>
                  <td className="font-mono text-xs text-muted-foreground">
                    {quotation.requiredDate}
                  </td>
                  <td>
                    <span
                      className={`badge ${getStatusBadgeClass(quotation.status, isSupplierDeactivated)}`}
                    >
                      {isSupplierDeactivated ? `Blocked (${supplierStatus})` : normalizedStatus}
                    </span>
                  </td>
                  <td className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isSupplierDeactivated}
                      onClick={() => onOpenQuotation(quotation)}
                    >
                      {isSupplierDeactivated ? "Deactivated" : isReadOnlyRecord ? "View" : "Update"}
                    </Button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
function QuotationEditModal({
  quotation,
  supplierName,
  supplierCurrency,
  modalError,
  onClose,
  onItemChange,
  onUploadAttachments,
  onRemoveAttachment,
  onSave,
}) {
  const normalizedStatus = normalizeStatus(quotation.status);
  const isReadOnly = normalizedStatus === "Completed" || normalizedStatus === "Canceled";
  const netValue = quotation.items.reduce((sum, item) => sum + calculateLineTotalExclTax(item), 0);
  return (
    <div className="modal-backdrop">
      <div
        className="modal !max-w-6xl"
        role="dialog"
        aria-modal="true"
        aria-label={`Quotation ${quotation.id}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <h2 className="!mb-0">{quotation.id}</h2>
            <span className={`badge ${getStatusBadgeClass(quotation.status, false)}`}>
              {normalizedStatus}
            </span>
          </div>
          <Button variant="ghost" size="icon" aria-label="Close quotation" onClick={onClose}>
            <X />
          </Button>
        </div>

        {isReadOnly && (
          <div className="notice mb-4" role="status">
            This quotation is marked as <strong>{normalizedStatus}</strong> and cannot be updated.
          </div>
        )}

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
                <th className="text-right">Line Total excluding tax</th>
                <th>Tax Code</th>
              </tr>
            </thead>
            <tbody>
              {quotation.items.map((item) => {
                const lineTotalExclTax = calculateLineTotalExclTax(item);
                return (
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
                        disabled={isReadOnly}
                        className="grid-input font-mono text-xs min-w-34 disabled:bg-muted/50 disabled:cursor-not-allowed"
                        value={item.quotedDate}
                        onChange={(e) => onItemChange(item.itemNo, "quotedDate", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min={1}
                        aria-label={`${item.itemNo} quoted quantity`}
                        disabled={isReadOnly}
                        className="grid-input font-mono tabular-nums w-24 disabled:bg-muted/50 disabled:cursor-not-allowed"
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
                        disabled={isReadOnly}
                        className="grid-input font-mono tabular-nums w-28 disabled:bg-muted/50 disabled:cursor-not-allowed"
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
                        disabled={isReadOnly}
                        className="grid-input font-mono tabular-nums w-20 disabled:bg-muted/50 disabled:cursor-not-allowed"
                        value={item.discount}
                        onChange={(e) =>
                          onItemChange(item.itemNo, "discount", Number(e.target.value))
                        }
                      />
                    </td>
                    <td className="text-right font-mono tabular-nums font-semibold text-foreground">
                      {lineTotalExclTax.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td>
                      <select
                        aria-label={`${item.itemNo} tax code`}
                        disabled={isReadOnly}
                        className="grid-input font-mono text-xs min-w-28 disabled:bg-muted/50 disabled:cursor-not-allowed"
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
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Net Value summary below the grid */}
        <div className="mt-3 flex items-center justify-end gap-4 px-4 py-3 rounded border border-border bg-muted/40">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Net Value (Excluding Tax)
          </span>
          <span className="text-lg font-bold font-mono tabular-nums text-primary">
            {supplierCurrency ? `${supplierCurrency} ` : ""}
            {netValue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <div className="mt-5 pt-4 border-t border-border space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Paperclip size={14} className="text-primary" />
              Attachments
            </h3>
            {!isReadOnly && (
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
            )}
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
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => onRemoveAttachment(fileName)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      title={`Remove ${fileName}`}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
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
            {isReadOnly ? "Close" : "Cancel"}
          </Button>
          {!isReadOnly && (
            <Button onClick={onSave}>
              <Save />
              Update quotation
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
export function Quotations() {
  const { role, supplier, quotations, setQuotations } = useWorkspace();
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeQuotation, setActiveQuotation] = useState(null);
  const [modalError, setModalError] = useState("");
  const [savedNotice, setSavedNotice] = useState("");
  if (role !== "supplier") return <AccessNotice audience="supplier" />;
  const handleOpenQuotation = (quotation) => {
    setActiveQuotation({
      ...quotation,
      items: quotation.items.map((item) => ({ ...item })),
      attachments: [...quotation.attachments],
    });
    setModalError("");
  };
  const handleUploadAttachments = (files) => {
    if (!activeQuotation || !files || files.length === 0) return;
    const normalized = normalizeStatus(activeQuotation.status);
    if (normalized === "Completed" || normalized === "Canceled") return;
    const uploadedNames = Array.from(files).map((f) => f.name);
    setActiveQuotation({
      ...activeQuotation,
      attachments: [
        ...activeQuotation.attachments,
        ...uploadedNames.filter((name) => !activeQuotation.attachments.includes(name)),
      ],
    });
  };
  const handleRemoveAttachment = (fileName) => {
    if (!activeQuotation) return;
    const normalized = normalizeStatus(activeQuotation.status);
    if (normalized === "Completed" || normalized === "Canceled") return;
    setActiveQuotation({
      ...activeQuotation,
      attachments: activeQuotation.attachments.filter((f) => f !== fileName),
    });
  };
  const handleDraftItemChange = (itemNo, field, value) => {
    if (!activeQuotation) return;
    const normalized = normalizeStatus(activeQuotation.status);
    if (normalized === "Completed" || normalized === "Canceled") return;
    setActiveQuotation({
      ...activeQuotation,
      items: activeQuotation.items.map((item) =>
        item.itemNo === itemNo ? { ...item, [field]: value } : item,
      ),
    });
  };
  const handleUpdateQuotation = () => {
    if (!activeQuotation) return;
    const normalized = normalizeStatus(activeQuotation.status);
    if (normalized === "Completed" || normalized === "Canceled") {
      setModalError(`Completed and canceled quotations cannot be updated.`);
      return;
    }
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
    const updated = {
      ...activeQuotation,
      status: "Completed",
    };
    setQuotations((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
    setSavedNotice(`Quotation ${updated.id} completed and updated in this preview session.`);
    setActiveQuotation(null);
    setModalError("");
  };
  const isSupplierDeactivated = Boolean(
    supplier.transactionBlocked ||
    supplier.status === "Inactive" ||
    supplier.status === "Blacklisted",
  );
  const filteredQuotations = (quotations ?? []).filter((quotation) => {
    if (statusFilter === "All") return true;
    return normalizeStatus(quotation.status) === statusFilter;
  });
  const statusCounts = {
    All: (quotations ?? []).length,
    Pending: (quotations ?? []).filter((q) => normalizeStatus(q.status) === "Pending").length,
    Completed: (quotations ?? []).filter((q) => normalizeStatus(q.status) === "Completed").length,
    Canceled: (quotations ?? []).filter((q) => normalizeStatus(q.status) === "Canceled").length,
  };
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

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-muted-foreground" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Filter by Status:
          </span>
          <div
            className="inline-flex rounded-md border border-border bg-card p-1 gap-1"
            role="group"
            aria-label="Filter quotations by status"
          >
            {statusFilters.map((filterOption) => {
              const isActive = statusFilter === filterOption;
              return (
                <button
                  key={filterOption}
                  type="button"
                  onClick={() => setStatusFilter(filterOption)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {filterOption} ({statusCounts[filterOption]})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <QuotationsListTable
        quotations={filteredQuotations}
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
          supplierCurrency={supplier.currency}
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
