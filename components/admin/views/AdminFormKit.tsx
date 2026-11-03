"use client";

import React, { useRef, useState } from "react";
import Axios from "@/lib/ApiConfig";
import {
  AlertCircle,
  Download,
  Paperclip,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";

// Shared pieces of the admin company and lawyer forms: field layout, the
// multi-document uploader, and the document list.

// ─── Constants ────────────────────────────────────────────────────────────────

export const ALLOWED_FILE_EXTENSIONS = [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg"];
export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const UPLOAD_TIMEOUT_MS = 120_000;

export const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StoredDocumentRecord {
  _id: string;
  title: string;
  category: string;
  fileName: string;
  fileSize?: number;
  issueDate?: string;
  expiryDate?: string;
  notes?: string;
  createdAt?: string;
}

/** The populated "created by" user the API returns (a bare id string if it could not be resolved). */
export type CreatedBy = { firstName?: string; lastName?: string; email?: string } | string | null | undefined;

export interface PendingDocument {
  key: number;
  title: string;
  category: string;
  file: File | null;
  issueDate: string;
  expiryDate: string;
  notes: string;
  error?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function apiError(err: any, fallback: string): string {
  const message = err?.response?.data?.message;
  return Array.isArray(message) ? message.join(". ") : message || fallback;
}

export function formatBytes(bytes?: number): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDate(value?: string): string {
  return value ? new Date(value).toLocaleDateString() : "—";
}

export function createdByLabel(createdBy: CreatedBy): string {
  if (!createdBy || typeof createdBy === "string") return "—";
  const name = [createdBy.firstName, createdBy.lastName].filter(Boolean).join(" ");
  return name || createdBy.email || "—";
}

export function fileProblem(file: File, allowed: string[] = ALLOWED_FILE_EXTENSIONS, maxBytes = MAX_FILE_BYTES): string | null {
  const dot = file.name.lastIndexOf(".");
  const ext = dot >= 0 ? file.name.slice(dot).toLowerCase() : "";
  if (!allowed.includes(ext)) {
    return allowed === ALLOWED_FILE_EXTENSIONS
      ? "Unsupported file type. Upload a PDF, Word document, PNG or JPG."
      : "Unsupported image type. Upload a PNG, JPG or WebP.";
  }
  if (file.size > maxBytes) return `File is larger than ${Math.round(maxBytes / (1024 * 1024))} MB.`;
  return null;
}

/** Fetches a file through the authenticated API and saves it; the files are not public. */
async function downloadStoredDocument(basePath: string, doc: StoredDocumentRecord) {
  const res = await Axios.get(`${basePath}/documents/${doc._id}/download`, {
    responseType: "blob",
    timeout: UPLOAD_TIMEOUT_MS,
  });
  const url = URL.createObjectURL(res.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = doc.fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// ─── Layout pieces ────────────────────────────────────────────────────────────

export function Field({
  label,
  required,
  hint,
  hintId,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  /** Give the input `aria-describedby={hintId}` so screen readers announce the hint after its label. */
  hintId?: string;
  className?: string;
  children: React.ReactNode;
}) {
  // The hint stays outside the <label> so it is not read as part of the field's name.
  return (
    <div className={className}>
      <label className="block">
        <span className="text-[11px] font-bold text-slate-700 block mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
        {children}
      </label>
      {hint && (
        <span id={hintId} className="block text-[10px] text-slate-400 mt-1">
          {hint}
        </span>
      )}
    </div>
  );
}

export function SectionHeading({ letter, title }: { letter: string; title: string }) {
  return (
    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide pb-2 border-b border-slate-100">
      <span className="text-violet-600">{letter}.</span> {title}
    </h4>
  );
}

// ─── Saved documents ──────────────────────────────────────────────────────────

export function DocumentList({
  basePath,
  documents,
  onDeleted,
}: {
  /** e.g. /admin/companies/<id>; documents live under `${basePath}/documents`. */
  basePath: string;
  documents: StoredDocumentRecord[];
  /** When provided, each row shows a delete button. */
  onDeleted?: () => void;
}) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const handleDownload = async (doc: StoredDocumentRecord) => {
    try {
      setBusyId(doc._id);
      setError(null);
      await downloadStoredDocument(basePath, doc);
    } catch (err) {
      setError(apiError(err, "Could not download the document."));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (doc: StoredDocumentRecord) => {
    if (!window.confirm(`Delete "${doc.title}"? This cannot be undone.`)) return;
    try {
      setBusyId(doc._id);
      setError(null);
      await Axios.delete(`${basePath}/documents/${doc._id}`);
      onDeleted?.();
    } catch (err) {
      setError(apiError(err, "Could not delete the document."));
    } finally {
      setBusyId(null);
    }
  };

  if (documents.length === 0) {
    return <p className="text-xs text-slate-400 italic px-1">No documents uploaded.</p>;
  }

  return (
    <div className="space-y-2">
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
        </p>
      )}
      <ul className="space-y-1.5">
        {documents.map((doc) => {
          const expired = !!doc.expiryDate && new Date(doc.expiryDate) < startOfToday;
          return (
            <li
              key={doc._id}
              className="flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"
            >
              <Paperclip className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-800 break-words">{doc.title}</span>
                  <span className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                    {doc.category}
                  </span>
                  {expired && (
                    <span className="text-[10px] bg-red-50 border border-red-200 text-red-700 px-2 py-0.5 rounded-full font-semibold">
                      Expired
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 break-words">
                  {doc.fileName} · {formatBytes(doc.fileSize)}
                  {doc.issueDate && <> · Issued {formatDate(doc.issueDate)}</>}
                  {doc.expiryDate && <> · Expires {formatDate(doc.expiryDate)}</>}
                </div>
                {doc.notes && <div className="text-[11px] text-slate-600 mt-0.5 break-words">{doc.notes}</div>}
              </div>
              <button
                type="button"
                disabled={busyId === doc._id}
                onClick={() => handleDownload(doc)}
                className="text-slate-400 hover:text-violet-600 transition-colors p-1 cursor-pointer disabled:opacity-50"
                title="Download"
              >
                {busyId === doc._id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              </button>
              {onDeleted && (
                <button
                  type="button"
                  disabled={busyId === doc._id}
                  onClick={() => handleDelete(doc)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-1 cursor-pointer disabled:opacity-50"
                  title="Delete document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── Documents still to upload ────────────────────────────────────────────────

export function usePendingDocuments() {
  const [rows, setRows] = useState<PendingDocument[]>([]);
  const nextKey = useRef(1);
  return {
    rows,
    setRows,
    add: () =>
      setRows((r) => [
        ...r,
        { key: nextKey.current++, title: "", category: "", file: null, issueDate: "", expiryDate: "", notes: "" },
      ]),
    update: (key: number, patch: Partial<PendingDocument>) =>
      setRows((r) => r.map((x) => (x.key === key ? { ...x, ...patch } : x))),
    remove: (key: number) => setRows((r) => r.filter((x) => x.key !== key)),
  };
}

export type PendingDocuments = ReturnType<typeof usePendingDocuments>;

/**
 * A row only counts once the admin started filling it in; blank rows are
 * ignored. Returns the started rows with a per-row problem, if any.
 */
export function validatePendingDocuments(rows: PendingDocument[]) {
  const started = rows.filter(
    (r) => r.title.trim() || r.category || r.file || r.issueDate || r.expiryDate || r.notes.trim(),
  );
  let invalid = false;
  const checked = started.map((r) => {
    const problem = !r.title.trim()
      ? "Document title is required."
      : !r.category
        ? "Document category is required."
        : !r.file
          ? "Choose a file to upload."
          : r.issueDate && r.expiryDate && r.expiryDate < r.issueDate
            ? "Expiry date cannot be before the issue date."
            : undefined;
    if (problem) invalid = true;
    return { ...r, error: problem };
  });
  return { started: checked, invalid };
}

/** Uploads the rows one by one; resolves to the error message of each row that failed, by key. */
export async function uploadPendingDocuments(basePath: string, rows: PendingDocument[]) {
  const failed = new Map<number, string>();
  for (const row of rows) {
    const form = new FormData();
    form.append("title", row.title.trim());
    form.append("category", row.category);
    if (row.issueDate) form.append("issueDate", row.issueDate);
    if (row.expiryDate) form.append("expiryDate", row.expiryDate);
    if (row.notes.trim()) form.append("notes", row.notes.trim());
    form.append("file", row.file as File);
    try {
      await Axios.post(`${basePath}/documents`, form, { timeout: UPLOAD_TIMEOUT_MS });
    } catch (err) {
      failed.set(row.key, apiError(err, "Upload failed."));
    }
  }
  return failed;
}

/** Section "Documents" body: saved documents, the rows being added, and the add button. */
export function DocumentsEditor({
  basePath,
  existing,
  pending,
  categories,
  onDeleted,
}: {
  /** Null until the record has been saved once. */
  basePath: string | null;
  existing: StoredDocumentRecord[];
  pending: PendingDocuments;
  categories: readonly string[];
  onDeleted: () => void;
}) {
  const rows = pending.rows;
  return (
    <div className="space-y-3">
      {existing.length > 0 && basePath && (
        <DocumentList basePath={basePath} documents={existing} onDeleted={onDeleted} />
      )}
      {existing.length === 0 && rows.length === 0 && (
        <p className="text-xs text-slate-400 italic px-1">No documents added yet.</p>
      )}

      {rows.map((row) => (
        <div
          key={row.key}
          className={`rounded-xl border p-4 space-y-3 ${row.error ? "border-red-300 bg-red-50/40" : "border-slate-200 bg-slate-50/50"}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Document title" required>
              <input
                value={row.title}
                onChange={(e) => pending.update(row.key, { title: e.target.value, error: undefined })}
                placeholder="e.g. Professional indemnity insurance 2026"
                className={inputCls}
              />
            </Field>
            <Field label="Document category" required>
              <select
                value={row.category}
                onChange={(e) => pending.update(row.key, { category: e.target.value, error: undefined })}
                className={inputCls}
              >
                <option value="">Select a category…</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field
              label="Upload file"
              required
              hint="PDF, Word, PNG or JPG, up to 10 MB"
              hintId={`doc-file-hint-${row.key}`}
            >
              <input
                type="file"
                accept={ALLOWED_FILE_EXTENSIONS.join(",")}
                aria-describedby={`doc-file-hint-${row.key}`}
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  const problem = file ? fileProblem(file) : null;
                  if (problem) e.target.value = "";
                  pending.update(row.key, { file: problem ? null : file, error: problem ?? undefined });
                }}
                className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-violet-700 hover:file:bg-violet-100"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Issue date">
                <input
                  type="date"
                  value={row.issueDate}
                  onChange={(e) => pending.update(row.key, { issueDate: e.target.value, error: undefined })}
                  className={inputCls}
                />
              </Field>
              <Field label="Expiry date">
                <input
                  type="date"
                  value={row.expiryDate}
                  onChange={(e) => pending.update(row.key, { expiryDate: e.target.value, error: undefined })}
                  className={inputCls}
                />
              </Field>
            </div>
            <Field label="Document notes" className="md:col-span-2">
              <textarea
                rows={2}
                value={row.notes}
                onChange={(e) => pending.update(row.key, { notes: e.target.value })}
                className={inputCls}
              />
            </Field>
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-red-600 flex items-center gap-1.5">
              {row.error && (
                <>
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {row.error}
                </>
              )}
            </p>
            <button
              type="button"
              onClick={() => pending.remove(row.key)}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-600 cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" /> Remove
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={pending.add}
        className="flex items-center gap-1.5 text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 px-3 py-2 rounded-lg transition-colors cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>{rows.length + existing.length > 0 ? "Add another document" : "Add a document"}</span>
      </button>
    </div>
  );
}
