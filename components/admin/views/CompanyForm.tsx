"use client";

import React, { useState } from "react";
import Axios from "@/lib/ApiConfig";
import { AlertCircle, Building2, Check, Plus, RefreshCw } from "lucide-react";
import {
  CreatedBy,
  DocumentList,
  DocumentsEditor,
  Field,
  SectionHeading,
  StoredDocumentRecord,
  apiError,
  createdByLabel,
  formatDate,
  inputCls,
  uploadPendingDocuments,
  usePendingDocuments,
  validatePendingDocuments,
} from "./AdminFormKit";

// ─── Options (keep in sync with src/cases/schemas/company.schema.ts in the API) ──

export const COMPANY_TYPES = [
  "Limited company",
  "LLP",
  "Partnership",
  "Sole practitioner",
  "Alternative business structure (ABS)",
  "Other",
] as const;

export const COMPANY_STATUSES = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
] as const;

export const DOCUMENT_CATEGORIES = [
  "Regulatory certificate",
  "Professional indemnity insurance",
  "Company registration",
  "Terms of business",
  "Fee schedule",
  "Compliance / AML policy",
  "Contract / agreement",
  "Identification",
  "Other",
] as const;

// Suggestions only: both fields accept free text.
const REGULATORY_BODIES = [
  "Solicitors Regulation Authority (SRA)",
  "Law Society of Scotland",
  "Law Society of Northern Ireland",
  "Bar Standards Board",
  "CILEx Regulation",
];

const COUNTRIES = [
  "United Kingdom",
  "Ireland",
  "United States",
  "Canada",
  "Australia",
  "New Zealand",
  "India",
  "Pakistan",
  "United Arab Emirates",
];

// ─── Types ────────────────────────────────────────────────────────────────────

export type CompanyDocumentRecord = StoredDocumentRecord;

export interface CompanyRecord {
  _id: string;
  name: string;
  companyNumber?: string;
  companyType?: string;
  regulatoryBody?: string;
  regulatoryNumber?: string;
  vatNumber?: string;
  website?: string;
  description?: string;
  status?: string;
  contactFirstName?: string;
  contactLastName?: string;
  email?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  county?: string;
  postcode?: string;
  country?: string;
  /** One-line address kept for records created before the structured fields existed. */
  address?: string;
  notes?: string;
  verified?: boolean;
  documents?: CompanyDocumentRecord[];
  createdBy?: CreatedBy;
  createdAt?: string;
  updatedAt?: string;
}

interface CompanyFormValues {
  name: string;
  companyNumber: string;
  companyType: string;
  regulatoryBody: string;
  regulatoryNumber: string;
  vatNumber: string;
  website: string;
  description: string;
  status: string;
  contactFirstName: string;
  contactLastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
  notes: string;
}

const EMPTY_VALUES: CompanyFormValues = {
  name: "",
  companyNumber: "",
  companyType: "",
  regulatoryBody: "",
  regulatoryNumber: "",
  vatNumber: "",
  website: "",
  description: "",
  status: "active",
  contactFirstName: "",
  contactLastName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  county: "",
  postcode: "",
  country: "United Kingdom",
  notes: "",
};

function valuesFromRecord(c: CompanyRecord): CompanyFormValues {
  const v = { ...EMPTY_VALUES };
  for (const key of Object.keys(v) as (keyof CompanyFormValues)[]) {
    v[key] = (c[key] as string | undefined) ?? EMPTY_VALUES[key];
  }
  // Older records only have the one-line address; start from it so nothing is lost.
  if (!v.addressLine1 && c.address) v.addressLine1 = c.address;
  return v;
}

// ─── Saved documents (browse cards) ───────────────────────────────────────────

export function CompanyDocumentList({
  companyId,
  documents,
  onDeleted,
}: {
  companyId: string;
  documents: CompanyDocumentRecord[];
  onDeleted?: () => void;
}) {
  return <DocumentList basePath={`/admin/companies/${companyId}`} documents={documents} onDeleted={onDeleted} />;
}

// ─── Create / edit form ───────────────────────────────────────────────────────

export function CompanyForm({
  mode,
  company,
  onSaved,
  onDone,
  onCancel,
  onAddLawyerForCompany,
}: {
  mode: "create" | "edit";
  /** Required in edit mode. */
  company?: CompanyRecord;
  /** Called whenever the company or its documents changed (use it to refresh the list). */
  onSaved: () => void | Promise<void>;
  /** Edit mode only: called when everything saved, including every document upload. */
  onDone?: () => void;
  onCancel?: () => void;
  onAddLawyerForCompany?: (companyId: string, companyName: string) => void;
}) {
  const [values, setValues] = useState<CompanyFormValues>(() =>
    company ? valuesFromRecord(company) : EMPTY_VALUES,
  );
  const pending = usePendingDocuments();
  const [existingDocs, setExistingDocs] = useState<CompanyDocumentRecord[]>(company?.documents ?? []);
  const [record, setRecord] = useState<CompanyRecord | undefined>(company);
  // Set once the company exists, so a retry after a failed document upload edits it instead of creating a duplicate.
  const [savedId, setSavedId] = useState<string | null>(company?._id ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdCompany, setCreatedCompany] = useState<{ id: string; name: string } | null>(null);

  const isEdit = mode === "edit";
  const set =
    (key: keyof CompanyFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));

  const reloadSaved = async (id: string) => {
    const res = await Axios.get(`/admin/companies/${id}`);
    setRecord(res.data);
    setExistingDocs(res.data.documents ?? []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { started, invalid } = validatePendingDocuments(pending.rows);
    if (invalid) {
      pending.setRows((current) => current.map((r) => started.find((c) => c.key === r.key) ?? r));
      setError("Complete or remove the highlighted documents before saving.");
      return;
    }

    setSaving(true);
    try {
      const res = savedId
        ? await Axios.patch(`/admin/companies/${savedId}`, values)
        : await Axios.post("/admin/companies", values);
      const id: string = res.data._id;
      setSavedId(id);

      const failed = await uploadPendingDocuments(`/admin/companies/${id}`, started);
      await reloadSaved(id).catch(() => undefined);
      // Uploaded rows are now in the saved list; keep only the ones that still need a retry.
      pending.setRows((current) =>
        current.filter((r) => failed.has(r.key)).map((r) => ({ ...r, error: failed.get(r.key) })),
      );
      await onSaved(); // the list is up to date before the form closes

      if (failed.size > 0) {
        setError(
          `The company was saved, but ${failed.size} document${failed.size > 1 ? "s" : ""} could not be uploaded. Fix the highlighted rows and save again to retry.`,
        );
        return;
      }

      if (isEdit) {
        onDone?.();
        return;
      }
      setCreatedCompany({ id, name: res.data.name });
      setValues(EMPTY_VALUES);
      setSavedId(null);
      setRecord(undefined);
      setExistingDocs([]);
    } catch (err) {
      setError(apiError(err, `Failed to ${savedId ? "update" : "create"} company.`));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {createdCompany && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-emerald-900">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="font-bold text-sm text-emerald-950">
                Company &quot;{createdCompany.name}&quot; registered successfully!
              </p>
              <p className="text-emerald-700 text-xs mt-0.5">
                You can now add lawyers and link them directly to this law firm.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {onAddLawyerForCompany && (
              <button
                type="button"
                onClick={() => {
                  onAddLawyerForCompany(createdCompany.id, createdCompany.name);
                  setCreatedCompany(null);
                }}
                className="px-3.5 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Lawyer to {createdCompany.name}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setCreatedCompany(null)}
              className="px-3 py-2 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-medium rounded-lg transition-colors cursor-pointer"
            >
              Add Another Firm
            </button>
          </div>
        </div>
      )}

      <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-2xs">
        <div className="mb-4 pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-violet-600" />
            <span>{isEdit ? `Edit ${company?.name ?? "Law Firm"}` : "Add New Law Firm / Company"}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isEdit
              ? "Update the firm's details and documents. Fields marked * are required."
              : "Register a company into the directory. After saving, you will be able to select it when adding lawyers. Fields marked * are required."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* A. Company details */}
          <section className="space-y-4">
            <SectionHeading letter="A" title="Company details" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Company / law firm name" required>
                <input required value={values.name} onChange={set("name")} placeholder="e.g. Blake, Cassels & Graydon LLP" className={inputCls} />
              </Field>
              <Field label="Company registration number">
                <input value={values.companyNumber} onChange={set("companyNumber")} placeholder="e.g. OC123456" className={inputCls} />
              </Field>
              <Field label="Company type" required>
                <select required value={values.companyType} onChange={set("companyType")} className={inputCls}>
                  <option value="">Select a type…</option>
                  {COMPANY_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="Company status" required>
                <select required value={values.status} onChange={set("status")} className={inputCls}>
                  {COMPANY_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="SRA / regulatory body">
                <input list="company-regulatory-bodies" value={values.regulatoryBody} onChange={set("regulatoryBody")} placeholder="e.g. Solicitors Regulation Authority (SRA)" className={inputCls} />
                <datalist id="company-regulatory-bodies">
                  {REGULATORY_BODIES.map((b) => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </Field>
              <Field label="SRA / regulatory registration number">
                <input value={values.regulatoryNumber} onChange={set("regulatoryNumber")} placeholder="e.g. 654321" className={inputCls} />
              </Field>
              <Field label="VAT registration number">
                <input value={values.vatNumber} onChange={set("vatNumber")} placeholder="e.g. GB123456789" className={inputCls} />
              </Field>
              <Field label="Company website">
                <input value={values.website} onChange={set("website")} placeholder="https://www.example.com" className={inputCls} />
              </Field>
              <Field label="Company description" className="md:col-span-2">
                <textarea rows={3} value={values.description} onChange={set("description")} placeholder="A short description of the firm and its services…" className={inputCls} />
              </Field>
            </div>
          </section>

          {/* B. Contact details */}
          <section className="space-y-4">
            <SectionHeading letter="B" title="Contact details" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Main contact person's first name">
                <input value={values.contactFirstName} onChange={set("contactFirstName")} className={inputCls} />
              </Field>
              <Field label="Main contact person's last name">
                <input value={values.contactLastName} onChange={set("contactLastName")} className={inputCls} />
              </Field>
              <Field label="Main contact email" required>
                <input required type="email" value={values.email} onChange={set("email")} placeholder="contact@example.com" className={inputCls} />
              </Field>
              <Field label="Main contact phone number" required hint="Include the country code, e.g. +44 20 7946 0958" hintId="company-phone-hint">
                <input required type="tel" value={values.phone} onChange={set("phone")} placeholder="+44 20 7946 0958" aria-describedby="company-phone-hint" className={inputCls} />
              </Field>
            </div>
          </section>

          {/* C. Registered address */}
          <section className="space-y-4">
            <SectionHeading letter="C" title="Registered address" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Address line 1" required>
                <input required value={values.addressLine1} onChange={set("addressLine1")} className={inputCls} />
              </Field>
              <Field label="Address line 2">
                <input value={values.addressLine2} onChange={set("addressLine2")} className={inputCls} />
              </Field>
              <Field label="Town / City" required>
                <input required value={values.city} onChange={set("city")} className={inputCls} />
              </Field>
              <Field label="County">
                <input value={values.county} onChange={set("county")} className={inputCls} />
              </Field>
              <Field label="Postcode" required>
                <input required value={values.postcode} onChange={set("postcode")} className={inputCls} />
              </Field>
              <Field label="Country" required>
                <input required list="company-countries" value={values.country} onChange={set("country")} className={inputCls} />
                <datalist id="company-countries">
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </Field>
            </div>
          </section>

          {/* D. Documents */}
          <section className="space-y-3">
            <SectionHeading letter="D" title="Documents" />
            <DocumentsEditor
              basePath={savedId ? `/admin/companies/${savedId}` : null}
              existing={existingDocs}
              pending={pending}
              categories={DOCUMENT_CATEGORIES}
              onDeleted={() => {
                if (savedId) reloadSaved(savedId).catch(() => undefined);
                onSaved();
              }}
            />
          </section>

          {/* E. Internal administration */}
          <section className="space-y-4">
            <SectionHeading letter="E" title="Internal administration" />
            <Field label="Internal notes">
              <textarea rows={3} value={values.notes} onChange={set("notes")} placeholder="Internal admin notes about this law firm (not shown to clients)…" className={inputCls} />
            </Field>
            {record?.createdAt ? (
              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <dt className="text-slate-400 font-semibold uppercase text-[10px]">Created by</dt>
                  <dd className="font-medium text-slate-700">{createdByLabel(record.createdBy)}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-semibold uppercase text-[10px]">Created date</dt>
                  <dd className="font-medium text-slate-700">{formatDate(record.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-semibold uppercase text-[10px]">Last updated</dt>
                  <dd className="font-medium text-slate-700">{formatDate(record.updatedAt)}</dd>
                </div>
              </dl>
            ) : (
              <p className="text-[11px] text-slate-400">
                Created by, created date and last updated date are recorded automatically when you save.
              </p>
            )}
          </section>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700" role="alert">
              <AlertCircle className="w-4 h-4 shrink-0 mt-px" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={saving}
                className="px-5 py-2.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                {isEdit ? "Cancel" : "Close"}
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>{saving ? "Saving…" : isEdit || savedId ? "Save Changes" : "Save Company"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
