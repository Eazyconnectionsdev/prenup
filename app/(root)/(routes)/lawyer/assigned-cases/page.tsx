"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, RotateCcw, Filter, Search } from "lucide-react";
import Axios from "@/lib/ApiConfig";
import { CaseStatus } from "@/types/lawyer-portal";

export interface LawyerFilterState {
  status: string;
  priority: string;
  search: string;
}

export interface LawyerRowCase {
  id: string;
  p1Name: string;
  p2Name: string;
  service: string;
  status: string;
  priority: string;
  daysInStatus: number;
  lastActivity: string;
  certificateExpiryDate: string | null;
}

const DEFAULT_FILTERS: LawyerFilterState = {
  status: "ALL",
  priority: "ALL",
  search: "",
};

const isCompleted = (status: string) => status === "CLOSED" || status === "ARCHIVED";

const getStatusBadgeStyle = (status: string) => {
  switch (status) {
    case "FORMS_LOCKED":
      return "border border-amber-300 text-amber-800 bg-amber-50";
    case "LAWYER_REVIEW":
      return "border border-blue-300 text-blue-800 bg-blue-50";
    case "AWAITING_COUNTERPARTY_LAWYER_APPROVAL":
      return "border border-indigo-300 text-indigo-800 bg-indigo-50";
    case "CLIENT_APPROVAL_PENDING":
      return "border border-purple-300 text-purple-800 bg-purple-50";
    case "CLIENT_PARTIALLY_APPROVED":
      return "border border-pink-300 text-pink-800 bg-pink-50";
    case "RETURNED_TO_LAWYERS":
      return "border border-red-300 text-red-800 bg-red-50";
    case "CLIENT_APPROVED":
    case "CM_APPROVED":
      return "border border-emerald-300 text-emerald-800 bg-emerald-50";
    case "ILA_P1_COMPLETE":
    case "ILA_P2_COMPLETE":
      return "border border-teal-300 text-teal-800 bg-teal-50";
    case "READY_FOR_SIGNING":
      return "border border-green-300 text-green-800 bg-green-50 animate-pulse";
    case "CLOSED":
    case "ARCHIVED":
      return "border border-slate-300 text-slate-700 bg-slate-100";
    default:
      return "border border-slate-200 text-slate-600 bg-slate-50";
  }
};

const formatStatus = (status: string) => {
  switch (status) {
    case "FORMS_LOCKED":
      return "ONBOARDING PENDING";
    case "LAWYER_REVIEW":
      return "REVIEW PENDING";
    case "AWAITING_COUNTERPARTY_LAWYER_APPROVAL":
      return "CLEAN MASTER UPLOAD PENDING";
    case "READY_FOR_SIGNING":
      return "SIGN-OFF & ILA PENDING";
    case "CLOSED":
    case "ARCHIVED":
      return "COMPLETED";
    case "CLIENT_APPROVAL_PENDING":
      return "ONBOARDED";
    default:
      return typeof status === "string" ? status.replace(/_/g, " ") : "UNKNOWN";
  }
};

const LawyerCasesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cases, setCases] = useState<LawyerRowCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LawyerFilterState>(DEFAULT_FILTERS);

  const status = searchParams.get("status");

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);

        let response;

        if (status && status !== "ALL") {
          response = await Axios.get(
            `/case-manager/dashboard/stages/${status}/cases`
          );
        } else {
          response = await Axios.get("/case-manager/cases");
        }

        const formattedCases: LawyerRowCase[] = response.data.map((item: any) => ({
          id: item._id,

          p1Name: item.owner
            ? `${item.owner.firstName ?? ""} ${item.owner.lastName ?? ""}`.trim() || "Unknown"
            : "Unknown",

          p2Name: item.invitedUser
            ? `${item.invitedUser.firstName ?? ""} ${item.invitedUser.lastName ?? ""}`.trim() ||
              item.invitedUser.email
            : "Not Invited",

          service: item.service ?? "—",

          // item.status is the nested section-tracking object
          // ({ myInformation, partnerInformation, jointInformation, _id }),
          // NOT a status string — the real status string is workflowStatus.
          status:
            typeof item.workflowStatus === "string"
              ? item.workflowStatus
              : "UNKNOWN",

          priority: item.priority ?? "MEDIUM",

          daysInStatus: item.daysInStatus ?? 0,

          lastActivity: item.lastActivity ?? "—",

          certificateExpiryDate: item.certificateExpiryDate ?? null,
        }));

        setCases(formattedCases);
      } catch (err) {
        console.error("Failed to fetch cases", err);
        setError("Couldn't load your cases right now.");
        setCases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [status]);

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const completed = isCompleted(c.status);

      if (filters.status !== "COMPLETED" && filters.status !== "ALL" && completed) {
        return false;
      }

      if (filters.status !== "ALL") {
        if (filters.status === "ONBOARDING_PENDING" && c.status !== "FORMS_LOCKED") return false;
        if (
          filters.status === "ONBOARDED" &&
          ![
            "LAWYER_REVIEW",
            "AWAITING_COUNTERPARTY_LAWYER_APPROVAL",
            "READY_FOR_SIGNING",
            "CLIENT_APPROVED",
            "ILA_P1_COMPLETE",
            "ILA_P2_COMPLETE",
            "CLIENT_APPROVAL_PENDING",
          ].includes(c.status)
        )
          return false;
        if (filters.status === "REVIEW_PENDING" && c.status !== "LAWYER_REVIEW") return false;
        if (
          filters.status === "CLEAN_MASTER_UPLOAD_PENDING" &&
          c.status !== "AWAITING_COUNTERPARTY_LAWYER_APPROVAL"
        )
          return false;
        if (
          filters.status === "SIGN_OFF_ILA_PENDING" &&
          !["READY_FOR_SIGNING", "CLIENT_APPROVED", "ILA_P1_COMPLETE", "ILA_P2_COMPLETE"].includes(
            c.status,
          )
        )
          return false;
        if (filters.status === "COMPLETED" && !completed) return false;
      }

      if (filters.priority !== "ALL" && c.priority !== filters.priority) {
        return false;
      }

      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const haystack = `${c.id} ${c.p1Name} ${c.p2Name} ${c.service}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [cases, filters]);

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
              <option value="ALL">Total Cases</option>
              <option value="ONBOARDING_PENDING">Onboarding Pending</option>
              <option value="ONBOARDED">Onboarded</option>
              <option value="REVIEW_PENDING">Review Pending</option>
              <option value="CLEAN_MASTER_UPLOAD_PENDING">Clean Master Upload Pending</option>
              <option value="SIGN_OFF_ILA_PENDING">Sign-Off & ILA Pending</option>
              <option value="COMPLETED">Completed</option>
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
                    <td className="p-4 pl-6 font-mono font-bold text-slate-900">{c.id}</td>
                    <td className="p-4 font-semibold text-slate-900">{c.p1Name}</td>
                    <td className="p-4">{c.p2Name}</td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getStatusBadgeStyle(
                          c.status,
                        )}`}
                      >
                        {formatStatus(c.status)}
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
                  <td colSpan={7} className="p-8 text-center text-slate-400 text-xs font-sans italic">
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