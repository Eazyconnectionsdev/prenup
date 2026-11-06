"use client";

import React, { useEffect, useState } from "react";
import { Eye, Loader2, RefreshCw, ShieldCheck, X } from "lucide-react";
import {
  auditActionLabel,
  auditRoleLabel,
  auditUser,
  fetchCaseAuditLog,
  type AuditScope,
} from "@/lib/api/audit";
import type { AuditLogEntry } from "@/types/audit";

/** One pill colour per module, so a long trail stays scannable. */
const MODULE_TONES: Record<string, string> = {
  Case: "bg-slate-100 text-slate-700 border-slate-200",
  Auth: "bg-violet-50 text-violet-700 border-violet-200",
  Invitation: "bg-amber-50 text-amber-700 border-amber-200",
  Payment: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Form: "bg-sky-50 text-sky-700 border-sky-200",
  CaseManager: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Agreement: "bg-rose-50 text-rose-700 border-rose-200",
  S3: "bg-cyan-50 text-cyan-700 border-cyan-200",
  Notification: "bg-teal-50 text-teal-700 border-teal-200",
};

function ModulePill({ module }: { module?: string }) {
  const tone =
    MODULE_TONES[module ?? ""] ??
    "bg-slate-100 text-slate-700 border-slate-200";
  return (
    <span
      className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${tone}`}
    >
      {module || "Case"}
    </span>
  );
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function ChangedFields({
  changedFields,
}: {
  changedFields?: Record<string, { old: unknown; new: unknown }> | null;
}) {
  const rows = Object.entries(changedFields ?? {});
  if (rows.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className="w-full text-left text-[11px]">
        <thead>
          <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <th className="px-2.5 py-1.5">Field</th>
            <th className="px-2.5 py-1.5">Before</th>
            <th className="px-2.5 py-1.5">After</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map(([field, change]) => (
            <tr key={field}>
              <td className="px-2.5 py-1.5 font-semibold text-slate-800">
                {field}
              </td>
              <td className="px-2.5 py-1.5 font-mono text-slate-500">
                {formatValue(change?.old)}
              </td>
              <td className="px-2.5 py-1.5 font-mono text-slate-800">
                {formatValue(change?.new)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * The case's audit trail, straight from the backend's audit-log module.
 *
 * It shows what the trail actually holds and nothing more: an empty trail
 * says so rather than standing in placeholder events, because an audit log
 * that invents rows is worse than one that is short.
 */
export default function CaseAuditLog({
  caseId,
  scope,
}: {
  caseId?: string;
  scope: AuditScope;
}) {
  const [logs, setLogs] = useState<AuditLogEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [selected, setSelected] = useState<AuditLogEntry | null>(null);

  useEffect(() => {
    if (!caseId) return;

    let cancelled = false;
    void (async () => {
      const result = await fetchCaseAuditLog(caseId, scope);
      if (cancelled) return;
      if (result.success) {
        setLogs(result.data);
        setError(null);
      } else {
        setError(result.error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [caseId, scope, reloadKey]);

  const loading = Boolean(caseId) && logs === null && !error;

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-xs">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold tracking-tight text-slate-900">
              <ShieldCheck className="h-4 w-4 text-sky-600" />
              <span>Case Audit Log</span>
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Chronological record of every recorded action on this case —
              registration, invitations, payments, forms, reviews, approvals,
              documents and legal advice.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="rounded-md bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">
              {logs?.length ?? 0} events
            </span>
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 transition-colors hover:bg-slate-100"
              title="Reload the audit trail"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 px-6 py-10 text-xs font-medium text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin text-sky-600" />
            Loading the audit trail…
          </div>
        ) : error ? (
          <div className="px-6 py-8 text-center">
            <p className="text-xs text-rose-700">{error}</p>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setReloadKey((key) => key + 1);
              }}
              className="mt-2 text-xs font-semibold text-sky-700 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : (logs?.length ?? 0) === 0 ? (
          <p className="px-6 py-10 text-center text-xs text-slate-500">
            Nothing recorded on this case yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  <th className="p-3.5 pl-6">Date &amp; time</th>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Module</th>
                  <th className="p-3.5">Event</th>
                  <th className="p-3.5">Stage</th>
                  <th className="p-3.5">Details</th>
                  <th className="p-3.5 pr-6 text-center">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(logs ?? []).map((entry) => {
                  const user = auditUser(entry);
                  return (
                    <tr
                      key={entry._id}
                      className="transition-colors hover:bg-slate-50/80"
                    >
                      <td className="whitespace-nowrap p-3.5 pl-6 font-mono text-slate-600">
                        {entry.createdAt
                          ? new Date(entry.createdAt).toLocaleString()
                          : "—"}
                      </td>
                      <td className="p-3.5 font-semibold text-slate-900">
                        {user.name}
                      </td>
                      <td className="p-3.5">
                        <span className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                          {auditRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <ModulePill module={entry.module} />
                      </td>
                      <td className="p-3.5 font-semibold text-slate-800">
                        {auditActionLabel(entry.action)}
                      </td>
                      <td className="p-3.5 text-slate-600">
                        {entry.stage || "—"}
                      </td>
                      <td className="max-w-md truncate p-3.5 text-slate-600">
                        {entry.notes || "—"}
                      </td>
                      <td className="p-3.5 pr-6 text-center">
                        <button
                          type="button"
                          onClick={() => setSelected(entry)}
                          className="cursor-pointer rounded-lg border border-slate-200 bg-white p-1.5 text-slate-700 transition-colors hover:bg-slate-100"
                          title="View event details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-6 backdrop-blur-xs">
          <div className="max-h-[85vh] w-full max-w-[560px] space-y-4 overflow-y-auto rounded-2xl border border-slate-300 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h4 className="text-sm font-bold text-slate-900">
                Event details
              </h4>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <dl className="space-y-2.5 text-xs">
              {(
                [
                  [
                    "Timestamp",
                    selected.createdAt
                      ? new Date(selected.createdAt).toLocaleString()
                      : "—",
                  ],
                  ["User", auditUser(selected).name],
                  ["Email", auditUser(selected).email ?? "—"],
                  ["Role", auditRoleLabel(auditUser(selected).role)],
                  ["Module", selected.module || "—"],
                  ["Event", auditActionLabel(selected.action)],
                  ["Stage", selected.stage || "—"],
                  [
                    "Entity",
                    selected.entityType
                      ? `${selected.entityType}${
                          selected.entityId ? ` · ${selected.entityId}` : ""
                        }`
                      : "—",
                  ],
                  ["IP address", selected.ipAddress || "—"],
                ] as [string, string][]
              ).map(([label, value]) => (
                <div key={label} className="flex gap-2">
                  <dt className="w-24 shrink-0 font-semibold text-slate-500">
                    {label}
                  </dt>
                  <dd className="min-w-0 flex-1 break-words text-slate-800">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            {selected.notes && (
              <div>
                <p className="mb-1 text-xs font-semibold text-slate-500">
                  Notes
                </p>
                <p className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-2.5 font-mono text-[11px] text-slate-700">
                  {selected.notes}
                </p>
              </div>
            )}

            {selected.changedFields &&
              Object.keys(selected.changedFields).length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-semibold text-slate-500">
                    What changed
                  </p>
                  <ChangedFields changedFields={selected.changedFields} />
                </div>
              )}

            <div className="flex justify-end border-t border-slate-200 pt-2">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="cursor-pointer rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
