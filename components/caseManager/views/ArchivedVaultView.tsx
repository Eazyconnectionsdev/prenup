"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Archive, Eye, Filter, RotateCcw, Search } from "lucide-react";
import Axios from "@/lib/ApiConfig";
import {
  toStageFacts,
  lifecycleOf,
  serviceLabel,
  inDateRange,
  formatDate,
  SERVICE_TYPES,
  DATE_RANGES,
} from "@/lib/caseStages";

/**
 * Archived Cases, for both portals.
 *  - Case manager: every completed / archived case on the platform, whoever
 *    handled it, with a Case Manager filter.
 *  - Lawyer: only the archived assignments allocated to that lawyer, with the
 *    applicant they acted for.
 * Completed cases are listed as "Recently Completed" until they are archived
 * automatically 30 days after completion.
 */
interface ArchivedRow {
  id: string;
  caseNumber: string;
  applicantName: string;
  applicantEmail: string;
  partnerName: string;
  agreementType: string | null;
  completionStatus: "Recently Completed" | "Archived";
  completedAt: string | null;
  archivedAt: string | null;
  caseManagerId: string;
  caseManagerName: string;
}

const name = (u: any) =>
  u && typeof u === "object"
    ? [u.firstName, u.middleName, u.lastName].filter(Boolean).join(" ").trim() || u.email || ""
    : "";

function DateRangeFilter({
  label,
  range,
  from,
  to,
  onChange,
}: {
  label: string;
  range: string;
  from: string;
  to: string;
  onChange: (next: { range?: string; from?: string; to?: string }) => void;
}) {
  return (
    <div>
      <label className="text-[11px] font-bold text-slate-600 block mb-1">{label}</label>
      <select
        value={range}
        onChange={(e) => onChange({ range: e.target.value })}
        className="w-full border border-slate-200 rounded-lg p-2 bg-white text-xs"
      >
        {DATE_RANGES.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
      {range === "CUSTOM" && (
        <div className="flex gap-1.5 mt-1.5">
          <input
            type="date"
            value={from}
            onChange={(e) => onChange({ from: e.target.value })}
            className="w-1/2 border border-slate-200 rounded-lg p-1.5 text-[11px]"
            aria-label={`${label} from`}
          />
          <input
            type="date"
            value={to}
            onChange={(e) => onChange({ to: e.target.value })}
            className="w-1/2 border border-slate-200 rounded-lg p-1.5 text-[11px]"
            aria-label={`${label} to`}
          />
        </div>
      )}
    </div>
  );
}

interface Range {
  range: string;
  from: string;
  to: string;
}
const ALL_RANGE: Range = { range: "ALL", from: "", to: "" };

export const ArchivedVaultView: React.FC<{ portal?: "cm" | "lawyer" }> = ({ portal = "cm" }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isCm = portal === "cm";

  const [rows, setRows] = useState<ArchivedRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [service, setService] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [completed, setCompleted] = useState<Range>(ALL_RANGE);
  const [archived, setArchived] = useState<Range>(ALL_RANGE);
  const [cmFilter, setCmFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const s = searchParams.get("status");
    if (s === "RECENTLY_COMPLETED" || s === "ARCHIVED") setStatus(s);
  }, [searchParams]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        if (isCm) {
          const { data } = await Axios.get("/case-manager/cases");
          const list: any[] = Array.isArray(data) ? data : [];
          setRows(
            list
              .filter((item) => {
                const life = lifecycleOf(toStageFacts(item));
                return life === "COMPLETED" || life === "ARCHIVED";
              })
              .map((item) => {
                const cm = item.assignedCaseManager;
                return {
                  id: item._id,
                  caseNumber: item.caseNumber || item._id,
                  applicantName: name(item.owner) || "Unknown",
                  applicantEmail: item.owner?.email || "",
                  partnerName: name(item.invitedUser) || item.invitedEmail || "—",
                  agreementType: item.agreementType || null,
                  completionStatus:
                    item.workflowStatus === "ARCHIVED" ? "Archived" : "Recently Completed",
                  completedAt: item.completedAt || null,
                  archivedAt: item.archivedAt || null,
                  caseManagerId: cm && typeof cm === "object" ? String(cm._id) : cm ? String(cm) : "",
                  caseManagerName: name(cm) || "Unassigned",
                };
              })
          );
        } else {
          const { data } = await Axios.get("/lawyer/assignments", {
            params: { scope: "archived" },
          });
          const list: any[] = Array.isArray(data) ? data : [];
          setRows(
            list.map((a) => ({
              id: a._id,
              caseNumber: a.caseNumber,
              applicantName: a.applicantName || "Unknown",
              applicantEmail: a.applicantEmail || "",
              partnerName: a.partnerName || "—",
              agreementType: a.agreementType,
              completionStatus:
                a.workflowStatus === "ARCHIVED" ? "Archived" : "Recently Completed",
              completedAt: a.completedAt,
              archivedAt: a.archivedAt,
              caseManagerId: "",
              caseManagerName: "",
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load archived cases", err);
        setError("Couldn't load archived cases right now.");
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [isCm]);

  const caseManagers = useMemo(() => {
    const m = new Map<string, string>();
    rows.forEach((r) => r.caseManagerId && m.set(r.caseManagerId, r.caseManagerName));
    return [...m.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [rows]);

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        if (service !== "ALL" && (r.agreementType || "prenup-marriage") !== service) return false;
        if (status === "RECENTLY_COMPLETED" && r.completionStatus !== "Recently Completed") return false;
        if (status === "ARCHIVED" && r.completionStatus !== "Archived") return false;
        if (!inDateRange(r.completedAt, completed.range, completed.from, completed.to)) return false;
        if (!inDateRange(r.archivedAt, archived.range, archived.from, archived.to)) return false;
        if (isCm && cmFilter !== "ALL") {
          if (cmFilter === "UNASSIGNED" ? r.caseManagerId : r.caseManagerId !== cmFilter) return false;
        }
        const q = search.trim().toLowerCase();
        if (q) {
          const hay = `${r.caseNumber} ${r.applicantName} ${r.applicantEmail}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      }),
    [rows, service, status, completed, archived, cmFilter, search, isCm]
  );

  const reset = () => {
    setService("ALL");
    setStatus("ALL");
    setCompleted(ALL_RANGE);
    setArchived(ALL_RANGE);
    setCmFilter("ALL");
    setSearch("");
  };

  const open = (id: string) =>
    router.push(isCm ? `/cm/case-manager/cases/${id}` : `/lawyer/assigned-cases/case/${id}`);

  return (
    <div className={`flex flex-col gap-6 max-w-[1280px] ${isCm ? "" : "p-8"}`}>
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs flex items-center gap-4">
        <div className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-700">
          <Archive className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Archived Cases</h2>
          <p className="text-xs text-slate-500">
            {isCm
              ? "Every completed and archived case on the platform, whichever case manager handled it."
              : "Archived assignments allocated to you."}{" "}
            Completed cases are archived automatically 30 days after completion.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
            <Filter className="w-4 h-4 text-sky-600" />
            <span>Filters</span>
          </div>
          <button
            type="button"
            onClick={reset}
            className="bg-slate-100 border border-slate-300 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${isCm ? "lg:grid-cols-6" : "lg:grid-cols-5"} gap-3 text-xs`}>
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Service Type</label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-white text-xs"
            >
              <option value="ALL">All Services</option>
              {SERVICE_TYPES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Completion Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-white text-xs"
            >
              <option value="ALL">All</option>
              <option value="RECENTLY_COMPLETED">Recently Completed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <DateRangeFilter
            label="Date Completed"
            {...completed}
            onChange={(n) => setCompleted((p) => ({ ...p, ...n }))}
          />
          <DateRangeFilter
            label="Date Archived"
            {...archived}
            onChange={(n) => setArchived((p) => ({ ...p, ...n }))}
          />

          {isCm && (
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Case Manager</label>
              <select
                value={cmFilter}
                onChange={(e) => setCmFilter(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-white text-xs"
              >
                <option value="ALL">All</option>
                {caseManagers.map(([id, n]) => (
                  <option key={id} value={id}>
                    {n}
                  </option>
                ))}
                <option value="UNASSIGNED">Unassigned</option>
              </select>
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Search</label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Case ID, applicant name or email"
                className="w-full border border-slate-200 rounded-lg pl-8 pr-2 py-2 text-xs bg-white"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-bold text-sm text-slate-900 tracking-tight">
            Archived Cases ({filtered.length} {filtered.length === 1 ? "Case" : "Cases"})
          </h3>
        </div>

        {loading ? (
          <div className="p-6 text-slate-500 text-sm">Loading archived cases...</div>
        ) : error ? (
          <div className="p-6 text-red-500 text-sm">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 uppercase text-[10px] font-bold text-slate-600 tracking-wider">
                  <th className="p-4 pl-6">Case ID</th>
                  <th className="p-4">Applicant Name</th>
                  <th className="p-4">Partner Name</th>
                  <th className="p-4">Service Type</th>
                  <th className="p-4">Completion Status</th>
                  <th className="p-4">Date Completed</th>
                  <th className="p-4">Date Archived</th>
                  {isCm && <th className="p-4">Case Manager</th>}
                  <th className="p-4 pr-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length ? (
                  filtered.map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => open(r.id)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors text-slate-700"
                    >
                      <td className="p-4 pl-6 font-mono font-bold text-slate-900">{r.caseNumber}</td>
                      <td className="p-4 font-semibold text-slate-900">
                        <div>{r.applicantName}</div>
                        {r.applicantEmail && (
                          <div className="text-[10px] text-slate-400 font-normal">{r.applicantEmail}</div>
                        )}
                      </td>
                      <td className="p-4">{r.partnerName}</td>
                      <td className="p-4">{serviceLabel(r.agreementType)}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                            r.completionStatus === "Archived"
                              ? "bg-slate-100 border-slate-200 text-slate-700"
                              : "bg-emerald-50 border-emerald-200 text-emerald-700"
                          }`}
                        >
                          {r.completionStatus}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-slate-500">{formatDate(r.completedAt)}</td>
                      <td className="p-4 font-mono text-slate-500">{formatDate(r.archivedAt)}</td>
                      {isCm && <td className="p-4">{r.caseManagerName}</td>}
                      <td className="p-4 pr-6 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            open(r.id);
                          }}
                          className="bg-white hover:bg-slate-100 p-1.5 rounded-lg border border-slate-300 text-slate-700 shadow-2xs transition-colors cursor-pointer"
                          title="View Record"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isCm ? 9 : 8} className="p-8 text-center text-slate-400">
                      No archived cases match these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivedVaultView;
