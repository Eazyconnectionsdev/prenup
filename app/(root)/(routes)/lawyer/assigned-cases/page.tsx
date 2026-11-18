"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, RotateCcw, Filter, Search } from "lucide-react";
import Axios from "@/lib/ApiConfig";
import { agreementTypeShortLabel } from "@/lib/agreementTypes";
import {
  LAWYER_STAGES,
  matchesStageFilter,
  toStageFacts,
  workflowStatusLabel,
} from "@/lib/caseStages";
import type {
  LawyerFilterState,
  LawyerRowCase,
} from "@/types/lawyer/pages/assigned-cases";

const DEFAULT_FILTERS: LawyerFilterState = {
  status: "ALL",
  priority: "ALL",
  search: "",
};

const STATUS_BADGE: Record<string, string> = {
  LAWYERS_ASSIGNED: "border border-amber-300 text-amber-800 bg-amber-50",
  PRE_LAWYER_PENDING: "border border-amber-300 text-amber-800 bg-amber-50",
  PRE_LAWYER_COMPLETED: "border border-blue-300 text-blue-800 bg-blue-50",
  LAWYER_REVIEW: "border border-blue-300 text-blue-800 bg-blue-50",
  LAWYER_REVIEW_COMPLETED: "border border-indigo-300 text-indigo-800 bg-indigo-50",
  LAWYER_ILA_PENDING: "border border-teal-300 text-teal-800 bg-teal-50",
  LAWYER_SIGNOFF_COMPLETE: "border border-green-300 text-green-800 bg-green-50",
  LAWYER_CLIENT_CONFIRMATION: "border border-purple-300 text-purple-800 bg-purple-50",
  COMPLETED: "border border-emerald-300 text-emerald-800 bg-emerald-50",
  ARCHIVED: "border border-slate-300 text-slate-700 bg-slate-100",
  CANCELLED: "border border-red-300 text-red-800 bg-red-50",
};

const personName = (ref: any, fallback: string) =>
  ref && typeof ref === "object"
    ? `${ref.firstName ?? ""} ${ref.lastName ?? ""}`.trim() || ref.email || fallback
    : fallback;

const daysSince = (date?: string | null) =>
  date
    ? Math.max(
        0,
        Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000),
      )
    : 0;

const formatDate = (date?: string | null) =>
  date ? new Date(date).toISOString().split("T")[0] : "—";

const toRow = (item: any): LawyerRowCase => ({
  id: item._id,
  caseNumber: item.caseNumber || `CASE-${String(item._id).slice(-6).toUpperCase()}`,
  p1Name: personName(item.owner, "Unknown"),
  p2Name: personName(
    item.invitedUser,
    item.invitedEmail || item.partnerInviteDetails?.email || "Not Invited",
  ),
  service: agreementTypeShortLabel(item.agreementType) ?? "—",
  status: item.workflowStatus || "UNKNOWN",
  priority: item.priority || "MEDIUM",
  // The schema keeps no "days in status", so it is read off the last change.
  daysInStatus: daysSince(item.updatedAt),
  lastActivity: formatDate(item.updatedAt || item.createdAt),
  facts: toStageFacts(item),
});

const LawyerCasesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cases, setCases] = useState<LawyerRowCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LawyerFilterState>({
    ...DEFAULT_FILTERS,
    status: searchParams.get("status") || "ALL",
  });

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await Axios.get("/lawyer/cases");
        setCases((Array.isArray(data) ? data : []).map(toRow));
      } catch (err) {
        console.error("Failed to fetch cases", err);
        setError("Couldn't load your cases right now.");
        setCases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const filteredCases = useMemo(
    () =>
      cases.filter((c) => {
        if (!matchesStageFilter(c.facts, filters.status)) return false;
        if (filters.priority !== "ALL" && c.priority !== filters.priority)
          return false;

        const q = filters.search.trim().toLowerCase();
        if (!q) return true;
        return `${c.caseNumber} ${c.id} ${c.p1Name} ${c.p2Name} ${c.service}`
          .toLowerCase()
          .includes(q);
      }),
    [cases, filters],
  );

  const handleFilterChange = (key: keyof LawyerFilterState, val: string) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleCaseClick = (caseId: string) => {
    router.push(`/lawyer/assigned-cases/case/${caseId}`);
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1280px] p-8">
      <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-bold font-sans text-slate-900 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-slate-700" />
            <span>Workflow Filters:</span>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold font-sans text-slate-400">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-sans outline-none focus:border-slate-400 cursor-pointer min-w-[180px]"
            >
              {LAWYER_STAGES.map((stage) => (
                <option key={stage.value} value={stage.value}>
                  {stage.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold font-sans text-slate-400">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-sans outline-none focus:border-slate-400 cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold font-sans text-slate-400">Search</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                placeholder="Case ID, party, service..."
                className="bg-slate-50 border border-slate-300 text-slate-800 pl-8 pr-3 py-1.5 rounded-lg text-xs font-sans outline-none focus:border-slate-400 w-56"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleResetFilters}
          className="bg-slate-100 border border-slate-300 text-slate-800 hover:bg-slate-200 text-xs px-3.5 py-1.5 rounded-lg font-bold font-sans flex items-center gap-2 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-base font-bold font-sans text-slate-900 tracking-tight">
            Assigned Active Matters ({filteredCases.length} Found)
          </h3>
        </div>

        {loading ? (
          <div className="p-6 text-slate-500 text-sm">Loading cases...</div>
        ) : error ? (
          <div className="p-6 text-red-500 text-sm">{error}</div>
        ) : (
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-slate-100 text-slate-600 uppercase tracking-wider text-[10px] font-bold border-b border-slate-300">
                <th className="p-4 pl-6">Case Code</th>
                <th className="p-4">Party 1</th>
                <th className="p-4">Party 2</th>
                <th className="p-4">Service</th>
                <th className="p-4">Action Status</th>
                <th className="p-4">Days in Status</th>
                <th className="p-4">Last Activity</th>
                <th className="p-4 pr-6">Inspect</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.length > 0 ? (
                filteredCases.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => handleCaseClick(c.id)}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-all cursor-pointer text-slate-700"
                  >
                    <td className="p-4 pl-6 font-mono font-bold text-slate-900">{c.caseNumber}</td>
                    <td className="p-4 font-semibold text-slate-900">{c.p1Name}</td>
                    <td className="p-4">{c.p2Name}</td>
                    <td className="p-4">{c.service}</td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          STATUS_BADGE[c.status] ??
                          "border border-slate-200 text-slate-600 bg-slate-50"
                        }`}
                      >
                        {workflowStatusLabel(c.status)}
                      </span>
                    </td>
                    <td className="p-4">{c.daysInStatus} Days</td>
                    <td className="p-4">{c.lastActivity}</td>
                    <td className="p-4 pr-6">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCaseClick(c.id);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-lg border border-slate-300 transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 text-xs font-sans italic">
                    No assigned matters found matching filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LawyerCasesPage;
