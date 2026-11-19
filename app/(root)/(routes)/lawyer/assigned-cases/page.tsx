"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, RotateCcw, Filter, Search } from "lucide-react";
import {
  fetchAssignments,
  matchesLawyerStage,
  PENDING_STAGES,
  STAGE_LABEL,
  type LawyerAssignment,
} from "@/lib/lawyerStages";
import {
  DATE_RANGES,
  SERVICE_TYPES,
  formatDate,
  inDateRange,
  serviceLabel,
} from "@/lib/caseStages";

const STAGE_VALUES = ["ALL", "PENDING", "COMPLETED", ...PENDING_STAGES.map((s) => s.value)];

const STAGE_STYLE: Record<string, string> = {
  REVIEW_PENDING: "border-blue-300 text-blue-800 bg-blue-50",
  ILA_SIGNOFF_PENDING: "border-teal-300 text-teal-800 bg-teal-50",
  FINAL_CONFIRMATION_PENDING: "border-purple-300 text-purple-800 bg-purple-50",
  COMPLETED: "border-slate-300 text-slate-700 bg-slate-100",
};

const PRIORITY_STYLE: Record<string, string> = {
  HIGH: "bg-rose-100 text-rose-800",
  URGENT: "bg-rose-100 text-rose-800",
  MEDIUM: "bg-amber-100 text-amber-800",
  LOW: "bg-emerald-100 text-emerald-800",
};

function LawyerCasesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [rows, setRows] = useState<LawyerAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stage, setStage] = useState("ALL");
  const [service, setService] = useState("ALL");
  const [priority, setPriority] = useState("ALL");
  const [assigned, setAssigned] = useState({ range: "ALL", from: "", to: "" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    const s = searchParams.get("stage") || "ALL";
    setStage(STAGE_VALUES.includes(s) ? s : "ALL");
  }, [searchParams]);

  useEffect(() => {
    (async () => {
      try {
        setRows(await fetchAssignments("active"));
      } catch (err) {
        console.error("Failed to fetch cases", err);
        setError("Couldn't load your cases right now.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const changeStage = (value: string) => {
    setStage(value);
    router.replace(value === "ALL" ? "/lawyer/assigned-cases" : `/lawyer/assigned-cases?stage=${value}`);
  };

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        if (!matchesLawyerStage(r, stage)) return false;
        if (service !== "ALL" && (r.agreementType || "prenup-marriage") !== service) return false;
        if (priority !== "ALL" && r.priority !== priority) return false;
        if (!inDateRange(r.dateAssigned, assigned.range, assigned.from, assigned.to)) return false;
        const q = search.trim().toLowerCase();
        if (q && !`${r.caseNumber} ${r.applicantName} ${r.applicantEmail}`.toLowerCase().includes(q)) {
          return false;
        }
        return true;
      }),
    [rows, stage, service, priority, assigned, search]
  );

  const reset = () => {
    changeStage("ALL");
    setService("ALL");
    setPriority("ALL");
    setAssigned({ range: "ALL", from: "", to: "" });
    setSearch("");
  };

  const open = (id: string) => router.push(`/lawyer/assigned-cases/case/${id}`);

  return (
    <div className="flex flex-col gap-6 max-w-[1280px] p-8">
      <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
            <Filter className="w-4 h-4 text-slate-700" />
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Workflow Stage</label>
            <select
              value={stage}
              onChange={(e) => changeStage(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-white text-xs"
            >
              <option value="ALL">All Stages</option>
              {PENDING_STAGES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
              {/* Reached from the dashboard tiles */}
              {(stage === "PENDING" || stage === "COMPLETED") && (
                <option value={stage}>
                  {stage === "PENDING" ? "All Pending" : "Completed Assignments"}
                </option>
              )}
            </select>
          </div>

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
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-white text-xs"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Date Assigned</label>
            <select
              value={assigned.range}
              onChange={(e) => setAssigned((p) => ({ ...p, range: e.target.value }))}
              className="w-full border border-slate-200 rounded-lg p-2 bg-white text-xs"
            >
              {DATE_RANGES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            {assigned.range === "CUSTOM" && (
              <div className="flex gap-1.5 mt-1.5">
                <input
                  type="date"
                  value={assigned.from}
                  onChange={(e) => setAssigned((p) => ({ ...p, from: e.target.value }))}
                  className="w-1/2 border border-slate-200 rounded-lg p-1.5 text-[11px]"
                  aria-label="Assigned from"
                />
                <input
                  type="date"
                  value={assigned.to}
                  onChange={(e) => setAssigned((p) => ({ ...p, to: e.target.value }))}
                  className="w-1/2 border border-slate-200 rounded-lg p-1.5 text-[11px]"
                  aria-label="Assigned to"
                />
              </div>
            )}
          </div>

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
            Active Cases ({filtered.length} {filtered.length === 1 ? "Case" : "Cases"})
          </h3>
        </div>

        {loading ? (
          <div className="p-6 text-slate-500 text-sm">Loading cases...</div>
        ) : error ? (
          <div className="p-6 text-red-500 text-sm">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-600 uppercase tracking-wider text-[10px] font-bold border-b border-slate-300">
                  <th className="p-4 pl-6">Case ID</th>
                  <th className="p-4">Applicant Name</th>
                  <th className="p-4">Service Type</th>
                  <th className="p-4">Workflow Stage</th>
                  <th className="p-4 text-center">Priority</th>
                  <th className="p-4">Date Assigned</th>
                  <th className="p-4">Days in Current Stage</th>
                  <th className="p-4 pr-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length ? (
                  filtered.map((r) => (
                    <tr
                      key={r._id}
                      onClick={() => open(r._id)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer text-slate-700"
                    >
                      <td className="p-4 pl-6 font-mono font-bold text-slate-900">{r.caseNumber}</td>
                      <td className="p-4 font-semibold text-slate-900">
                        <div>{r.applicantName || "—"}</div>
                        {r.applicantEmail && (
                          <div className="text-[10px] text-slate-400 font-normal">{r.applicantEmail}</div>
                        )}
                        <div className="text-[10px] text-slate-400 font-normal">
                          {r.side === "P1" ? "Partner 1" : "Partner 2"}
                        </div>
                      </td>
                      <td className="p-4">{serviceLabel(r.agreementType)}</td>
                      <td className="p-4">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${STAGE_STYLE[r.stage]}`}
                        >
                          {STAGE_LABEL[r.stage]}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            PRIORITY_STYLE[r.priority] ?? PRIORITY_STYLE.MEDIUM
                          }`}
                        >
                          {r.priority}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-slate-500">{formatDate(r.dateAssigned)}</td>
                      <td className="p-4">
                        {r.daysInStage == null ? "—" : `${r.daysInStage} ${r.daysInStage === 1 ? "day" : "days"}`}
                      </td>
                      <td className="p-4 pr-6 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            open(r._id);
                          }}
                          className="bg-white hover:bg-slate-100 p-1.5 rounded-lg border border-slate-300 text-slate-700 shadow-2xs transition-colors cursor-pointer"
                          title="View Assignment"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400 italic">
                      No assigned cases match these filters.
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
}

export default function LawyerCasesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-500 text-sm">Loading cases...</div>}>
      <LawyerCasesContent />
    </Suspense>
  );
}
