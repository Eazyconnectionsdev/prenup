"use client";

import React, { useEffect, useMemo, useState } from "react";
import Axios from "@/lib/ApiConfig";
import { AlertCircle, Building2, Check, Plus, RefreshCw, ShieldCheck, User, X } from "lucide-react";
import {
  CreatedBy,
  DocumentList,
  DocumentsEditor,
  Field,
  SectionHeading,
  StoredDocumentRecord,
  apiError,
  createdByLabel,
  fileProblem,
  formatDate,
  inputCls,
  uploadPendingDocuments,
  usePendingDocuments,
  validatePendingDocuments,
} from "./AdminFormKit";

// ─── Options (keep in sync with src/cases/schemas/lawyer.schema.ts in the API) ──

export const LAWYER_STATUSES = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
] as const;

export const PRACTISING_STATUSES = ["Practising", "Non-practising", "Suspended", "Retired"] as const;

export const LAWYER_DOCUMENT_CATEGORIES = [
  "Practising certificate",
  "Professional indemnity insurance",
  "Qualification / certificate",
  "Identification",
  "CV / résumé",
  "Contract / agreement",
  "Compliance / training",
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

const JURISDICTIONS = [
  "England and Wales",
  "Scotland",
  "Northern Ireland",
  "Ireland",
  "United Kingdom",
  "United States",
  "Canada",
  "Australia",
];

const PHOTO_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LawyerAccount {
  _id?: string;
  email: string;
  active: boolean;
  emailVerified?: boolean;
  lastLoginAt?: string | null;
}

export interface LawyerRecord {
  _id: string;
  name: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  photoKey?: string;
  avatarUrl?: string;
  company?: { _id: string; name: string } | string | null;
  officeBranch?: string;
  jobTitle?: string;
  /** available / unavailable / archived (the form's Active / Inactive maps onto available / unavailable). */
  status?: string;
  regulatoryBody?: string;
  registrationNumber?: string;
  barNumber?: string;
  practisingStatus?: string;
  jurisdiction?: string;
  qualifications?: string;
  priceText?: string;
  workEmail?: string;
  directEmail?: string;
  publicEmail?: string;
  workPhone?: string;
  directPhone?: string;
  mobilePhone?: string;
  invitationStatus?: string;
  invitationSentAt?: string;
  documents?: StoredDocumentRecord[];
  internalNotes?: string;
  /** Older free-text notes, shown until the lawyer is next saved. */
  notes?: string;
  verified?: boolean;
  createdById?: CreatedBy;
  createdAt?: string;
  updatedAt?: string;
  account?: LawyerAccount | null;
}

export interface CompanyOption {
  id: string;
  name: string;
  /** Company registration number, shown next to the name. */
  reference?: string;
  inactive?: boolean;
}

interface LawyerFormValues {
  firstName: string;
  middleName: string;
  lastName: string;
  company: string;
  officeBranch: string;
  jobTitle: string;
  lawyerStatus: string;
  regulatoryBody: string;
  registrationNumber: string;
  practisingStatus: string;
  jurisdiction: string;
  qualifications: string;
  priceText: string;
  workEmail: string;
  workPhone: string;
  mobilePhone: string;
  accountStatus: string;
  sendWelcomeEmail: boolean;
  password: string;
  internalNotes: string;
}

const EMPTY_VALUES: LawyerFormValues = {
  firstName: "",
  middleName: "",
  lastName: "",
  company: "",
  officeBranch: "",
  jobTitle: "",
  lawyerStatus: "active",
  regulatoryBody: "",
  registrationNumber: "",
  practisingStatus: "",
  jurisdiction: "",
  qualifications: "",
  priceText: "",
  workEmail: "",
  workPhone: "",
  mobilePhone: "",
  accountStatus: "active",
  sendWelcomeEmail: false,
  password: "",
  internalNotes: "",
};

function companyIdOf(l: LawyerRecord): string {
  return typeof l.company === "object" && l.company ? l.company._id : (l.company as string) || "";
}

/** Older records only have a single "name" and the older field names; start from them so nothing is lost. */
function valuesFromRecord(l: LawyerRecord): LawyerFormValues {
  let { firstName, lastName } = l;
  if (!firstName && !lastName && l.name) {
    const parts = l.name.trim().split(/\s+/);
    firstName = parts.shift() ?? "";
    lastName = parts.join(" ");
  }
  return {
    firstName: firstName ?? "",
    middleName: l.middleName ?? "",
    lastName: lastName ?? "",
    company: companyIdOf(l),
    officeBranch: l.officeBranch ?? "",
    jobTitle: l.jobTitle ?? "",
    lawyerStatus: l.status === "available" ? "active" : "inactive",
    regulatoryBody: l.regulatoryBody ?? "",
    registrationNumber: l.registrationNumber ?? l.barNumber ?? "",
    practisingStatus: l.practisingStatus ?? "",
    jurisdiction: l.jurisdiction ?? "",
    qualifications: l.qualifications ?? "",
    priceText: l.priceText ?? "",
    workEmail: l.workEmail ?? l.directEmail ?? l.publicEmail ?? l.account?.email ?? "",
    workPhone: l.workPhone ?? l.directPhone ?? "",
    mobilePhone: l.mobilePhone ?? "",
    accountStatus: l.account ? (l.account.active ? "active" : "inactive") : "active",
    sendWelcomeEmail: false,
    password: "",
    internalNotes: l.internalNotes ?? l.notes ?? "",
  };
}

/** Invitation status is automatic: accepted once the lawyer has signed in, otherwise sent / not sent. */
export function invitationInfo(l: LawyerRecord): { label: string; tone: "emerald" | "amber" | "slate" } {
  if (l.account?.lastLoginAt) return { label: `Accepted ${formatDate(l.account.lastLoginAt)} (first sign-in)`, tone: "emerald" };
  if (l.invitationStatus === "sent") return { label: `Sent ${formatDate(l.invitationSentAt)}`, tone: "amber" };
  return { label: "Not sent", tone: "slate" };
}

// ─── Photo ────────────────────────────────────────────────────────────────────

function initialsOf(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "?"
  );
}

/** The profile photo (fetched through the authenticated API), an older avatar URL, or initials. */
export function LawyerAvatar({
  lawyerId,
  photoKey,
  avatarUrl,
  name,
  className = "w-10 h-10",
}: {
  lawyerId: string;
  photoKey?: string;
  avatarUrl?: string;
  name: string;
  className?: string;
}) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!photoKey) return;
    let objectUrl: string | null = null;
    let cancelled = false;
    Axios.get(`/admin/lawyers/${lawyerId}/photo`, { responseType: "blob" })
      .then((res) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(res.data);
        setSrc(objectUrl);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [lawyerId, photoKey]);

  const shown = photoKey ? src : avatarUrl && /^https?:\/\//i.test(avatarUrl) ? avatarUrl : null;
  return shown ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={shown} alt={name} className={`${className} rounded-full object-cover border border-slate-200 shrink-0`} />
  ) : (
    <div className={`${className} rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center shrink-0`}>
      {initialsOf(name)}
    </div>
  );
}

// ─── Saved documents (browse cards) ───────────────────────────────────────────

export function LawyerDocumentList({
  lawyerId,
  documents,
  onDeleted,
}: {
  lawyerId: string;
  documents: StoredDocumentRecord[];
  onDeleted?: () => void;
}) {
  return <DocumentList basePath={`/admin/lawyers/${lawyerId}`} documents={documents} onDeleted={onDeleted} />;
}

// ─── Create / edit form ───────────────────────────────────────────────────────

interface SaveNotice {
  tone: "success" | "warning";
  text: string;
}

export function LawyerForm({
  mode,
  lawyer,
  companies,
  initialCompanyId,
  onSaved,
  onDone,
  onCancel,
  onSwitchToAddCompany,
}: {
  mode: "create" | "edit";
  /** Required in edit mode. */
  lawyer?: LawyerRecord;
  companies: CompanyOption[];
  initialCompanyId?: string;
  /** Called whenever the lawyer or their documents changed (use it to refresh the list). */
  onSaved: () => void | Promise<void>;
  /** Edit mode only: called when everything saved cleanly and nothing needs the admin's attention. */
  onDone?: () => void;
  onCancel?: () => void;
  onSwitchToAddCompany: () => void;
}) {
  const isEdit = mode === "edit";
  const defaultCompany = initialCompanyId || companies[0]?.id || "";
  const [values, setValues] = useState<LawyerFormValues>(() =>
    lawyer ? valuesFromRecord(lawyer) : { ...EMPTY_VALUES, company: defaultCompany },
  );
  const pending = usePendingDocuments();
  const [existingDocs, setExistingDocs] = useState<StoredDocumentRecord[]>(lawyer?.documents ?? []);
  const [record, setRecord] = useState<LawyerRecord | undefined>(lawyer);
  // Set once the lawyer exists, so a retry after a partial failure edits it instead of creating a duplicate.
  const [savedId, setSavedId] = useState<string | null>(lawyer?._id ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<SaveNotice | null>(null);
  const [created, setCreated] = useState<{ name: string; companyName: string; notice: SaveNotice | null } | null>(null);

  // Profile photo: a newly chosen file, or a request to remove the saved one.
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const previewUrl = useMemo(() => (photoFile ? URL.createObjectURL(photoFile) : null), [photoFile]);
  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  const set =
    (key: keyof LawyerFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));

  // A password is needed whenever the lawyer has no login yet.
  const needsPassword = isEdit ? !record?.account : !savedId;
  const loginEmail = values.workEmail.trim().toLowerCase();
  const invitation = record ? invitationInfo(record) : null;
  const companyName = companies.find((c) => c.id === values.company)?.name ?? "the selected company";

  const reloadSaved = async (id: string) => {
    const res = await Axios.get(`/admin/lawyers/${id}`);
    setRecord(res.data);
    setExistingDocs(res.data.documents ?? []);
    return res.data as LawyerRecord;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    const { started, invalid } = validatePendingDocuments(pending.rows);
    if (invalid) {
      pending.setRows((current) => current.map((r) => started.find((c) => c.key === r.key) ?? r));
      setError("Complete or remove the highlighted documents before saving.");
      return;
    }

    setSaving(true);
    try {
      const res = savedId
        ? await Axios.patch(`/admin/lawyers/${savedId}`, values)
        : await Axios.post("/admin/lawyers", values);
      const id: string = res.data.lawyer._id;
      const welcome: { requested: boolean; sent: boolean; error?: string } = res.data.welcomeEmail;
      setSavedId(id);

      const problems: string[] = [];

      // Photo
      if (photoFile) {
        try {
          const form = new FormData();
          form.append("photo", photoFile);
          await Axios.post(`/admin/lawyers/${id}/photo`, form, { timeout: 60_000 });
          setPhotoFile(null);
        } catch (err) {
          problems.push(`the profile photo (${apiError(err, "upload failed")})`);
        }
      } else if (removePhoto) {
        try {
          await Axios.delete(`/admin/lawyers/${id}/photo`);
          setRemovePhoto(false);
          // Drop the key now, or the avatar would ask the API for the photo that was just deleted.
          setRecord((r) => (r ? { ...r, photoKey: undefined } : r));
        } catch (err) {
          problems.push(`removing the profile photo (${apiError(err, "failed")})`);
        }
      }

      // Documents
      const failed = await uploadPendingDocuments(`/admin/lawyers/${id}`, started);
      if (failed.size > 0) problems.push(`${failed.size} document${failed.size > 1 ? "s" : ""}`);
      pending.setRows((current) =>
        current.filter((r) => failed.has(r.key)).map((r) => ({ ...r, error: failed.get(r.key) })),
      );

      await reloadSaved(id).catch(() => undefined);
      setValues((v) => ({ ...v, password: "", sendWelcomeEmail: false }));
      await onSaved(); // the list is up to date before the form closes

      const welcomeNotice: SaveNotice | null = welcome.requested
        ? welcome.sent
          ? { tone: "success", text: `Welcome email sent to ${loginEmail}.` }
          : { tone: "warning", text: `The lawyer was saved, but the welcome email could not be sent. You can tick "Send welcome email" and save again to retry.` }
        : null;

      if (problems.length > 0) {
        setError(`The lawyer was saved, but these could not be saved: ${problems.join("; ")}. Fix them and save again to retry.`);
        setNotice(welcomeNotice);
        return;
      }

      if (isEdit) {
        if (welcomeNotice) {
          setNotice(welcomeNotice); // stay, so the result of the email is seen
          return;
        }
        onDone?.();
        return;
      }

      setCreated({ name: res.data.lawyer.name, companyName, notice: welcomeNotice });
      setValues({ ...EMPTY_VALUES, company: values.company });
      setSavedId(null);
      setRecord(undefined);
      setExistingDocs([]);
      setPhotoFile(null);
      setRemovePhoto(false);
    } catch (err) {
      setError(apiError(err, `Failed to ${savedId ? "update" : "create"} lawyer.`));
    } finally {
      setSaving(false);
    }
  };

  if (!isEdit && companies.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-amber-600">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-amber-950">No Companies / Law Firms Available</h3>
          <p className="text-xs text-amber-800 max-w-md mx-auto mt-1">
            Lawyers must be associated with a registered company. Please add at least one company first before creating lawyer profiles.
          </p>
        </div>
        <button
          type="button"
          onClick={onSwitchToAddCompany}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Company First</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {created && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-emerald-900">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="font-bold text-sm text-emerald-950">
                Lawyer &quot;{created.name}&quot; registered successfully!
              </p>
              <p className="text-emerald-700 text-xs mt-0.5">
                Profile is linked to {created.companyName}.
                {created.notice && <span className={created.notice.tone === "warning" ? " text-amber-700 font-semibold" : ""}> {created.notice.text}</span>}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCreated(null)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Add Another Lawyer
          </button>
        </div>
      )}

      <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-2xs">
        <div className="mb-4 pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <User className="w-4 h-4 text-violet-600" />
            <span>{isEdit ? `Edit ${lawyer?.name ?? "Lawyer"}` : "Add Lawyer"}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isEdit
              ? "Update the lawyer's profile, portal account and documents. Fields marked * are required."
              : "Select the company, fill in the lawyer's details and set up their portal login. Fields marked * are required."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* A. Personal details */}
          <section className="space-y-4">
            <SectionHeading letter="A" title="Personal details" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="First name" required>
                <input required value={values.firstName} onChange={set("firstName")} className={inputCls} />
              </Field>
              <Field label="Middle name">
                <input value={values.middleName} onChange={set("middleName")} className={inputCls} />
              </Field>
              <Field label="Last name" required>
                <input required value={values.lastName} onChange={set("lastName")} className={inputCls} />
              </Field>
            </div>
            <div className="flex items-center gap-4">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="New profile photo" className="w-14 h-14 rounded-full object-cover border border-slate-200 shrink-0" />
              ) : savedId && record && !removePhoto ? (
                <LawyerAvatar lawyerId={savedId} photoKey={record.photoKey} avatarUrl={record.avatarUrl} name={record.name} className="w-14 h-14" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                  <User className="w-6 h-6" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <Field label="Profile photo" hint="PNG, JPG or WebP, up to 5 MB" hintId="lawyer-photo-hint">
                  <input
                    type="file"
                    accept={PHOTO_EXTENSIONS.join(",")}
                    aria-describedby="lawyer-photo-hint"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      const problem = file ? fileProblem(file, PHOTO_EXTENSIONS, MAX_PHOTO_BYTES) : null;
                      if (problem) e.target.value = "";
                      setPhotoError(problem);
                      setPhotoFile(problem ? null : file);
                      if (file && !problem) setRemovePhoto(false);
                    }}
                    className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-violet-700 hover:file:bg-violet-100"
                  />
                </Field>
                {photoError && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {photoError}
                  </p>
                )}
                {(photoFile || (record?.photoKey && !removePhoto)) && (
                  <button
                    type="button"
                    onClick={() => {
                      if (photoFile) setPhotoFile(null);
                      else setRemovePhoto(true);
                    }}
                    className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500 hover:text-red-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" /> {photoFile ? "Discard new photo" : "Remove photo"}
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* B. Company association and role */}
          <section className="space-y-4">
            <SectionHeading letter="B" title="Company association and role" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Field label="Law firm / Company" required>
                  <select required value={values.company} onChange={set("company")} className={inputCls}>
                    <option value="" disabled>-- Select Company / Law Firm --</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                        {c.reference ? ` (Ref: ${c.reference})` : ""}
                        {c.inactive ? " [inactive]" : ""}
                      </option>
                    ))}
                  </select>
                </Field>
                <button
                  type="button"
                  onClick={onSwitchToAddCompany}
                  className="mt-1 text-[11px] text-violet-700 hover:text-violet-900 font-semibold cursor-pointer hover:underline inline-flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Register another company
                </button>
              </div>
              <Field label="Office / Branch">
                <input value={values.officeBranch} onChange={set("officeBranch")} placeholder="e.g. Leeds office" className={inputCls} />
              </Field>
              <Field label="Job title / Position" required>
                <input required value={values.jobTitle} onChange={set("jobTitle")} placeholder="e.g. Senior Partner" className={inputCls} />
              </Field>
              <Field label="Lawyer status" required>
                <select required value={values.lawyerStatus} onChange={set("lawyerStatus")} className={inputCls}>
                  {LAWYER_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </Field>
            </div>
          </section>

          {/* C. Professional details */}
          <section className="space-y-4">
            <SectionHeading letter="C" title="Professional details" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Regulatory body (e.g. SRA)">
                <input list="lawyer-regulatory-bodies" value={values.regulatoryBody} onChange={set("regulatoryBody")} placeholder="e.g. Solicitors Regulation Authority (SRA)" className={inputCls} />
                <datalist id="lawyer-regulatory-bodies">
                  {REGULATORY_BODIES.map((b) => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </Field>
              <Field label="Professional registration number">
                <input value={values.registrationNumber} onChange={set("registrationNumber")} placeholder="e.g. SRA-123456" className={inputCls} />
              </Field>
              <Field label="Practising status">
                <select value={values.practisingStatus} onChange={set("practisingStatus")} className={inputCls}>
                  <option value="">Not specified</option>
                  {PRACTISING_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Jurisdiction / Country of practice">
                <input list="lawyer-jurisdictions" value={values.jurisdiction} onChange={set("jurisdiction")} placeholder="e.g. England and Wales" className={inputCls} />
                <datalist id="lawyer-jurisdictions">
                  {JURISDICTIONS.map((j) => (
                    <option key={j} value={j} />
                  ))}
                </datalist>
              </Field>
              <Field label="Qualification details" className="md:col-span-2">
                <textarea rows={2} value={values.qualifications} onChange={set("qualifications")} placeholder="Degrees, professional qualifications, specialisms…" className={inputCls} />
              </Field>
              <Field
                label="Fee shown to clients"
                hint="Optional. Included in the email clients receive when this lawyer is assigned to their case."
                hintId="lawyer-fee-hint"
                className="md:col-span-2"
              >
                <input value={values.priceText} onChange={set("priceText")} placeholder="e.g. £300 including VAT" aria-describedby="lawyer-fee-hint" className={inputCls} />
              </Field>
            </div>
          </section>

          {/* D. Contact details */}
          <section className="space-y-4">
            <SectionHeading letter="D" title="Contact details" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Work email address" required className="md:col-span-2">
                <input required type="email" value={values.workEmail} onChange={set("workEmail")} placeholder="lawyer@firm.com" className={inputCls} />
              </Field>
              <Field label="Work phone number" hint="Include the country code, e.g. +44 20 7946 0958" hintId="lawyer-work-phone-hint">
                <input type="tel" value={values.workPhone} onChange={set("workPhone")} placeholder="+44 20 7946 0958" aria-describedby="lawyer-work-phone-hint" className={inputCls} />
              </Field>
              <Field label="Mobile number" hint="Include the country code, e.g. +44 7700 900123" hintId="lawyer-mobile-hint">
                <input type="tel" value={values.mobilePhone} onChange={set("mobilePhone")} placeholder="+44 7700 900123" aria-describedby="lawyer-mobile-hint" className={inputCls} />
              </Field>
            </div>
          </section>

          {/* E. Portal account */}
          <section className="space-y-4">
            <SectionHeading letter="E" title="Portal account" />
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-amber-950">Login for the lawyer portal</span>
                <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Pre-verified · No OTP required</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Login email / Username" hint="Automatic: the work email address above." hintId="lawyer-login-hint">
                  <input readOnly tabIndex={-1} value={loginEmail} placeholder="(from the work email)" aria-describedby="lawyer-login-hint" className={`${inputCls} bg-slate-50 text-slate-500`} />
                </Field>
                <Field label="Account status" required hint="Inactive accounts cannot sign in." hintId="lawyer-account-hint">
                  <select required value={values.accountStatus} onChange={set("accountStatus")} aria-describedby="lawyer-account-hint" className={inputCls}>
                    {LAWYER_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </Field>
                <Field
                  label={needsPassword ? "Password" : "New password"}
                  required={needsPassword}
                  hint={
                    needsPassword
                      ? "At least 8 characters. Stored encrypted, never emailed."
                      : "Leave blank to keep the current password. Stored encrypted, never emailed."
                  }
                  hintId="lawyer-password-hint"
                >
                  <input
                    type="password"
                    autoComplete="new-password"
                    required={needsPassword}
                    minLength={8}
                    maxLength={72}
                    value={values.password}
                    onChange={set("password")}
                    placeholder="••••••••"
                    aria-describedby="lawyer-password-hint"
                    className={inputCls}
                  />
                </Field>
                <div>
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">Invitation status</span>
                  <span
                    className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                      invitation?.tone === "emerald"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : invitation?.tone === "amber"
                          ? "bg-amber-100 text-amber-800 border-amber-300"
                          : "bg-white text-slate-600 border-slate-200"
                    }`}
                  >
                    {invitation ? invitation.label : "Not sent"}
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-1">Automatic: updated when a welcome email is sent and when the lawyer first signs in.</span>
                </div>
              </div>
              <label className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={values.sendWelcomeEmail}
                  onChange={(e) => setValues((v) => ({ ...v, sendWelcomeEmail: e.target.checked }))}
                  className="mt-0.5 accent-violet-600"
                />
                <span>
                  <span className="font-bold">Send welcome email</span>
                  <span className="block text-[11px] text-slate-500">
                    Emails the lawyer a sign-in link and a one-time link to choose their own password. The password set here is never included.
                  </span>
                </span>
              </label>
            </div>
          </section>

          {/* F. Documents */}
          <section className="space-y-3">
            <SectionHeading letter="F" title="Documents" />
            <DocumentsEditor
              basePath={savedId ? `/admin/lawyers/${savedId}` : null}
              existing={existingDocs}
              pending={pending}
              categories={LAWYER_DOCUMENT_CATEGORIES}
              onDeleted={() => {
                if (savedId) reloadSaved(savedId).catch(() => undefined);
                onSaved();
              }}
            />
          </section>

          {/* G. Internal administration */}
          <section className="space-y-4">
            <SectionHeading letter="G" title="Internal administration" />
            <Field label="Internal notes">
              <textarea rows={3} value={values.internalNotes} onChange={set("internalNotes")} placeholder="Internal admin notes about this lawyer (not shown to clients)…" className={inputCls} />
            </Field>
            {record?.createdAt ? (
              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <dt className="text-slate-400 font-semibold uppercase text-[10px]">Created by</dt>
                  <dd className="font-medium text-slate-700">{createdByLabel(record.createdById)}</dd>
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

          {notice && (
            <div
              className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-xs ${
                notice.tone === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-300 bg-amber-50 text-amber-800"
              }`}
              role="status"
            >
              {notice.tone === "success" ? <Check className="w-4 h-4 shrink-0 mt-px" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-px" />}
              <span>{notice.text}</span>
            </div>
          )}

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
                {isEdit && !notice ? "Cancel" : "Close"}
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>{saving ? "Saving…" : isEdit || savedId ? "Save Changes" : "Save Lawyer"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
