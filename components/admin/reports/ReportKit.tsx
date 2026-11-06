"use client";

// Building blocks shared by the admin Reports, Finance and Security &
// Compliance sections: data fetching, filters, tables, CSV export.

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Axios from "@/lib/ApiConfig";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { AlertCircle, ChevronLeft, ChevronRight, Download, RefreshCw, RotateCcw, Search } from "lucide-react";

// Server message from an API error, or the fallback.
export function apiError(e: unknown, fallback: string): string {
  const data = (e as any)?.response?.data;
  const msg = data?.message;
  if (Array.isArray(msg) && msg.length) return String(msg[0]);
  if (typeof msg === "string" && msg) return msg;
  return getErrorMessage(e, fallback);
}

// ── Filters ──

export type Filters = Record<string, string>;

export const DATE_RANGES = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "last_7_days", label: "Last 7 Days" },
  { value: "last_30_days", label: "Last 30 Days" },
  { value: "last_90_days", label: "Last 90 Days" },
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "this_year", label: "This Year" },
  { value: "custom", label: "Custom Range" },
];

export const SERVICE_TYPES = [
  { value: "all", label: "All services" },
  { value: "PRENUPTIAL", label: "Prenuptial" },
  { value: "POSTNUPTIAL", label: "Postnuptial" },
  { value: "COHABITATION", label: "Cohabitation" },
  { value: "UNDECIDED", label: "Not yet chosen" },
];

export type Option = { value: string; label: string };

export type ReportOptions = {
  caseManagers: { id: string; name: string; email: string; active: boolean }[];
  firms: { id: string; name: string }[];
  staff: { id: string; name: string; email: string; role: string }[];
  statuses: Option[];
  serviceTypes: Option[];
};

const toParams = (f: Filters) => {
  const p = new URLSearchParams();
  Object.entries(f).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    if (k !== "range" && v === "all") return;
    if ((k === "from" || k === "to") && f.range !== "custom") return;
    p.set(k, v);
  });
  return p;
};

// Fetches a report; refetches when the filters change.
export function useReport<T = any>(endpoint: string | null, filters: Filters) {
  // Data is kept with the endpoint it came from, so switching reports never
  // renders one report's data with another report's layout.
  const [result, setResult] = useState<{ endpoint: string; data: T } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const seq = useRef(0);
  const query = endpoint ? `${endpoint}?${toParams(filters).toString()}` : null;

  const load = useCallback(async () => {
    if (!query) return;
    const id = ++seq.current;
    setLoading(true);
    setError(null);
    try {
      const res = await Axios.get<T>(`/admin/reports/${query}`);
      if (id === seq.current) setResult({ endpoint: endpoint as string, data: res.data });
    } catch (e) {
      if (id === seq.current) setError(apiError(e, "Could not load this report"));
    } finally {
      if (id === seq.current) setLoading(false);
    }
  }, [query, endpoint]);

  useEffect(() => {
    // Custom range waits until both ends are chosen.
    if (filters.range === "custom" && (!filters.from || !filters.to)) return;
    void load();
  }, [load, filters.range, filters.from, filters.to]);

  const data = result && result.endpoint === endpoint ? result.data : null;
  return { data, loading, error, reload: load };
}

export function useReportOptions() {
  const [options, setOptions] = useState<ReportOptions | null>(null);
  useEffect(() => {
    Axios.get<ReportOptions>("/admin/reports/options")
      .then((r) => setOptions(r.data))
      .catch(() => setOptions(null));
  }, []);
  return options;
}

// ── Formatting ──

export const fmtDateTime = (v?: string | Date | null) =>
  v
    ? new Date(v).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/London",
      })
    : "—";

export const fmtDate = (v?: string | Date | null) =>
  v
    ? new Date(v).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "Europe/London" })
    : "—";

export const fmtDays = (v?: number | null) => (v === null || v === undefined ? "—" : `${v} ${v === 1 ? "day" : "days"}`);

export const CaseLink: React.FC<{ id?: string | null; label?: string | null }> = ({ id, label }) =>
  id ? (
    <Link href={`/admin/cases/${id}`} className="font-semibold text-violet-700 hover:underline whitespace-nowrap">
      {label || id}
    </Link>
  ) : (
    <span className="text-slate-400">—</span>
  );

const TONES: Record<string, string> = {
  green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  red: "bg-red-50 text-red-700 border-red-200",
  amber: "bg-amber-50 text-amber-800 border-amber-200",
  blue: "bg-sky-50 text-sky-700 border-sky-200",
  slate: "bg-slate-100 text-slate-600 border-slate-200",
  violet: "bg-violet-50 text-violet-700 border-violet-200",
};

export const Badge: React.FC<{ tone?: keyof typeof TONES; children: React.ReactNode }> = ({ tone = "slate", children }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wide whitespace-nowrap ${TONES[tone]}`}>
    {children}
  </span>
);

// Percent bar for tables; the number is always printed beside it.
export const PercentBar: React.FC<{ value: number; tone?: "violet" | "emerald" | "red" }> = ({ value, tone = "violet" }) => {
  const color = tone === "emerald" ? "bg-emerald-500" : tone === "red" ? "bg-red-500" : "bg-violet-500";
  return (
    <div className="flex items-center gap-2 min-w-[140px]">
      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden" aria-hidden>
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }} />
      </div>
      <span className="tabular-nums text-slate-700 font-semibold w-12 text-right">{value}%</span>
    </div>
  );
};

// ── Layout pieces ──

export const StatTile: React.FC<{ label: string; value: React.ReactNode; hint?: React.ReactNode; tone?: "default" | "good" | "bad" }> = ({
  label,
  value,
  hint,
  tone = "default",
}) => (
  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
    <div
      className={`mt-1 text-2xl font-bold tabular-nums ${
        tone === "good" ? "text-emerald-700" : tone === "bad" ? "text-red-700" : "text-slate-900"
      }`}
    >
      {value}
    </div>
    {hint && <div className="mt-1 text-[11px] text-slate-500">{hint}</div>}
  </div>
);

export const ErrorBox: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-xs flex items-center justify-between">
    <div className="flex items-center gap-2">
      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
      {message}
    </div>
    {onRetry && (
      <button onClick={onRetry} className="underline font-semibold hover:text-red-900 ml-4 cursor-pointer">
        Retry
      </button>
    )}
  </div>
);

export const Note: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[11px] text-slate-500 leading-relaxed">{children}</p>
);

// Report picker inside a section.
export const ReportTabs: React.FC<{
  items: { key: string; label: string }[];
  active: string;
  onChange: (k: string) => void;
}> = ({ items, active, onChange }) => (
  <div className="flex flex-wrap gap-2" role="tablist">
    {items.map((it, i) => (
      <button
        key={it.key}
        role="tab"
        aria-selected={active === it.key}
        onClick={() => onChange(it.key)}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
          active === it.key
            ? "bg-violet-600 text-white border-violet-600 shadow-sm"
            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
        }`}
      >
        <span className="opacity-60 mr-1">{i + 1}.</span>
        {it.label}
      </button>
    ))}
  </div>
);

// ── Filter bar ──

export type FilterField =
  | { key: string; label: string; type: "select"; options: Option[] }
  | { key: string; label: string; type: "text"; placeholder?: string }
  | { key: "range"; label: string; type: "range" };

const inputCls =
  "border border-slate-200 rounded-lg px-2.5 py-2 text-xs bg-white text-slate-700 focus:outline-none focus:border-violet-500 font-medium";

export const FilterBar: React.FC<{
  fields: FilterField[];
  filters: Filters;
  onChange: (f: Filters) => void;
  onReset: () => void;
  onRefresh?: () => void;
  loading?: boolean;
}> = ({ fields, filters, onChange, onReset, onRefresh, loading }) => {
  const set = (k: string, v: string) => onChange({ ...filters, [k]: v, page: "1" });
  // Text filters apply after a short pause in typing.
  const [draft, setDraft] = useState<Record<string, string>>({});
  useEffect(() => {
    const t = setTimeout(() => {
      const changed = Object.entries(draft).filter(([k, v]) => (filters[k] ?? "") !== v);
      if (changed.length) onChange({ ...filters, ...Object.fromEntries(changed), page: "1" });
    }, 400);
    return () => clearTimeout(t);
  }, [draft]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-end gap-3">
      {fields.map((field) => (
        <label key={field.key} className="flex flex-col gap-1 text-xs">
          <span className="font-semibold text-slate-500 text-[10px] uppercase tracking-wide">{field.label}</span>
          {field.type === "range" ? (
            <div className="flex flex-wrap items-center gap-2">
              <select className={inputCls} value={filters.range || "all"} onChange={(e) => set("range", e.target.value)}>
                {DATE_RANGES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              {filters.range === "custom" && (
                <>
                  <input type="date" aria-label="From" className={inputCls} value={filters.from || ""} onChange={(e) => set("from", e.target.value)} />
                  <span className="text-slate-400">to</span>
                  <input type="date" aria-label="To" className={inputCls} value={filters.to || ""} onChange={(e) => set("to", e.target.value)} />
                </>
              )}
            </div>
          ) : field.type === "select" ? (
            <select className={`${inputCls} max-w-[220px]`} value={filters[field.key] || "all"} onChange={(e) => set(field.key, e.target.value)}>
              {field.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                className={`${inputCls} pl-8 w-48`}
                placeholder={field.placeholder}
                value={draft[field.key] ?? filters[field.key] ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, [field.key]: e.target.value }))}
              />
            </div>
          )}
        </label>
      ))}
      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={() => {
            setDraft({});
            onReset();
          }}
          className="bg-slate-100 border border-slate-200 hover:bg-slate-200 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-violet-600" : ""}`} /> Refresh
          </button>
        )}
      </div>
    </div>
  );
};

// ── Table ──

export type Column<T> = {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  csv?: (row: T) => string | number | null | undefined;
  align?: "left" | "right" | "center";
  className?: string;
};

const csvCell = (v: unknown) => {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function downloadCsv<T>(filename: string, columns: Column<T>[], rows: T[]) {
  const lines = [
    columns.map((c) => csvCell(c.label)).join(","),
    ...rows.map((r) => columns.map((c) => csvCell(c.csv ? c.csv(r) : (r as any)[c.key])).join(",")),
  ];
  const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function DataTable<T>({
  title,
  columns,
  rows,
  loading,
  empty = "No records for these filters.",
  total,
  page,
  pageSize,
  onPage,
  exportName,
  exportAll,
  actions,
  footer,
}: {
  title: string;
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  empty?: string;
  total?: number;
  page?: number;
  pageSize?: number;
  onPage?: (p: number) => void;
  exportName?: string;
  // Loads every matching row for export (paged tables).
  exportAll?: () => Promise<T[]>;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const [exporting, setExporting] = useState(false);
  const pages = total && pageSize ? Math.max(1, Math.ceil(total / pageSize)) : 1;
  const doExport = async () => {
    if (!exportName) return;
    setExporting(true);
    try {
      downloadCsv(exportName, columns, exportAll ? await exportAll() : rows);
    } finally {
      setExporting(false);
    }
  };
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
          {title}
          {total !== undefined && (
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-700 font-semibold normal-case tracking-normal">
              {total.toLocaleString("en-GB")} {total === 1 ? "record" : "records"}
            </span>
          )}
          {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin text-violet-600" />}
        </h3>
        <div className="flex items-center gap-2">
          {actions}
          {exportName && (
            <button
              onClick={doExport}
              disabled={exporting || !rows.length}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" /> {exporting ? "Exporting…" : "Export CSV"}
            </button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 uppercase text-[10px] tracking-wider text-slate-500 font-semibold">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={`py-3 px-4 whitespace-nowrap ${c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : ""}`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {!rows.length ? (
              <tr>
                <td colSpan={columns.length} className="py-10 text-center text-slate-400">
                  {loading ? "Loading…" : empty}
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr key={(r as any).id ?? i} className="hover:bg-slate-50/60 align-top">
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={`py-2.5 px-4 text-slate-700 ${c.align === "right" ? "text-right tabular-nums" : c.align === "center" ? "text-center" : ""} ${c.className ?? ""}`}
                    >
                      {c.render ? c.render(r) : ((r as any)[c.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
          {footer}
        </table>
      </div>
      {onPage && pages > 1 && (
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Page {page} of {pages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={(page ?? 1) <= 1}
              onClick={() => onPage((page ?? 1) - 1)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={(page ?? 1) >= pages}
              onClick={() => onPage((page ?? 1) + 1)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Loads every row of a paged report for CSV export.
export async function fetchAllRows<T>(endpoint: string, filters: Filters): Promise<T[]> {
  const p = toParams({ ...filters, page: "1", pageSize: "10000" });
  const res = await Axios.get(`/admin/reports/${endpoint}?${p.toString()}`);
  return (res.data?.rows ?? []) as T[];
}

// Small modal used by the refund and GDPR forms.
export const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" role="dialog" aria-modal="true" aria-label={title}>
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-sm text-slate-900">{title}</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg leading-none cursor-pointer" aria-label="Close">
          ×
        </button>
      </div>
      <div className="p-5 space-y-4 text-xs">{children}</div>
    </div>
  </div>
);

export const fieldCls = inputCls + " w-full";
