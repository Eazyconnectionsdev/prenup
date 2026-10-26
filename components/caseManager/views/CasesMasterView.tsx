"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Eye, RotateCcw, Filter, Search } from "lucide-react";
import Axios from "@/lib/ApiConfig";
import type { FilterState } from "@/types/case-manager";

interface CasesMasterViewProps {
  filters?: FilterState;
  onFilterChange?: (key: keyof FilterState, val: string) => void;
  onResetFilters?: () => void;
  onSelectCase?: (caseId: string) => void;
}

interface RowCase {
  id: string;
  caseNumber: string;
  p1: string;
  p2: string;
  p1Email: string;
  p2Email: string;
  agreementType: string;
  paymentStatus: string;
  workflowStage: string;
  caseManager: string;
  caseManagerId: string;
  priority: string;
}

export const CasesMasterView: React.FC<CasesMasterViewProps> = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentUser = useSelector((state: RootState) => state.auth?.user);
  const currentUserId = currentUser?._id || currentUser?.id || "";
  const currentUserName = [currentUser?.firstName, currentUser?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim()
    .toLowerCase();

  const [rawCases, setRawCases] = useState<RowCase[]>([]);
  const [loading, setLoading] = useState(false);

  // 7 Filters from spreadsheet
  const [stageFilter, setStageFilter] = useState("ALL");
  const [planFilter, setPlanFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [cmFilter, setCmFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const urlStatus = searchParams.get("status");

  useEffect(() => {
    if (urlStatus && urlStatus !== "ALL") {
      setStageFilter(urlStatus);
    }
  }, [urlStatus]);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        const response = await Axios.get("/case-manager/cases");

        const formatted: RowCase[] = (response.data || []).map((item: any) => {
          const p1 = item.owner
            ? `${item.owner.firstName ?? ""} ${item.owner.lastName ?? ""}`.trim()
            : "Unknown";

          const p2 = item.invitedUser
            ? `${item.invitedUser.firstName ?? ""} ${item.invitedUser.lastName ?? ""}`.trim()
            : item.invitedEmail ? item.invitedEmail : "Not Invited";

          const assignedCm = item.assignedCaseManager;
          const cm = assignedCm && typeof assignedCm === "object"
            ? `${assignedCm.firstName ?? ""} ${assignedCm.lastName ?? ""}`.trim()
            : typeof assignedCm === "string" && assignedCm
            ? assignedCm
            : "Unassigned";

          const cmId = assignedCm && typeof assignedCm === "object"
            ? (assignedCm._id || assignedCm.id || "")
            : typeof assignedCm === "string"
            ? assignedCm
            : "";

          const isPaid =
            item.paymentCompleted ||
            String(item.paymentStatus).toUpperCase() === "COMPLETED";

          return {
            id: item._id,
            caseNumber: item.caseNumber || item._id,
            p1: p1 || "Unknown",
            p2: p2 || "Not Invited",
            p1Email: item.owner?.email || "",
            p2Email: item.invitedUser?.email || item.invitedEmail || "",
            agreementType: item.agreementType || "prenup-marriage",
            paymentStatus: isPaid ? "Completed" : item.paymentStatus || "Pending",
            workflowStage: item.workflowStatus || "DRAFT",
            caseManager: cm || "Unassigned",
            caseManagerId: cmId,
            priority: (item.priority || "MEDIUM").toUpperCase(),
          };
        });

        setRawCases(formatted);
      } catch (error) {
        console.error("Failed to fetch cases", error);
        setRawCases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const handleResetFilters = () => {
    setStageFilter("ALL");
    setPlanFilter("ALL");
    setPaymentFilter("ALL");
    setCmFilter("ALL");
    setPriorityFilter("ALL");
    setSearchQuery("");
  };

  const handleCaseClick = (caseId: string) => {
    router.push(`/cm/case-manager/cases/${caseId}`);
  };

  // Filter application
  const filteredCases = useMemo(() => {
    return rawCases.filter((c) => {
      // 1. Stage filter
      if (stageFilter !== "ALL") {
        if (stageFilter === "NOT_PAID" && c.paymentStatus === "Completed") return false;
        if (stageFilter === "PARTNER_NOT_JOINED" && c.p2 !== "Not Invited" && !c.p2.includes("@")) return false;
        if (stageFilter === "CM_NOT_ASSIGNED" && c.caseManager !== "Unassigned") return false;
        if (!["NOT_PAID", "PARTNER_NOT_JOINED", "CM_NOT_ASSIGNED"].includes(stageFilter)) {
          if (!c.workflowStage.toLowerCase().includes(stageFilter.toLowerCase().replace(/_/g, " "))) {
            // fuzzy match
          }
        }
      }

      // 2. Plan filter
      if (planFilter !== "ALL" && c.agreementType !== planFilter) {
        return false;
      }

      // 3. Payment Status filter
      if (paymentFilter !== "ALL") {
        if (c.paymentStatus.toUpperCase() !== paymentFilter.toUpperCase()) {
          return false;
        }
      }

      // 4. Case Manager filter
      if (cmFilter !== "ALL") {
        const isUnassigned =
          !c.caseManagerId ||
          c.caseManager === "Unassigned" ||
          !c.caseManager.trim();

        const isMe =
          !isUnassigned &&
          Boolean(
            (currentUserId && c.caseManagerId && String(c.caseManagerId) === String(currentUserId)) ||
            (currentUserName && c.caseManager.toLowerCase() === currentUserName)
          );

        if (cmFilter === "UNASSIGNED") {
          if (!isUnassigned) return false;
        } else if (cmFilter === "ASSIGNED_TO_ME") {
          if (!isMe) return false;
        } else if (cmFilter === "ASSIGNED_TO_OTHER") {
          if (isUnassigned || isMe) return false;
        } else if (cmFilter === "ASSIGNED") {
          if (isUnassigned) return false;
        }
      }

      // 5. Priority filter
      if (priorityFilter !== "ALL") {
        if (c.priority !== priorityFilter.toUpperCase()) return false;
      }

      // 6. Search query (Case ID, Primary Applicant, Partner, Email)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          c.caseNumber.toLowerCase().includes(q) ||
          c.p1.toLowerCase().includes(q) ||
          c.p2.toLowerCase().includes(q) ||
          c.p1Email.toLowerCase().includes(q) ||
          c.p2Email.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [rawCases, stageFilter, planFilter, paymentFilter, cmFilter, priorityFilter, searchQuery, currentUserId, currentUserName]);

  if (loading) {
    return <div className="p-6 text-slate-500">Loading cases...</div>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1280px]">
      {/* 7 Filters Bar */}
      <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
            <Filter className="w-4 h-4 text-sky-600" />
            <span>Case Master Filters (7 Filters)</span>
          </div>

          <button
            type="button"
            onClick={handleResetFilters}
            className="bg-slate-100 border border-slate-300 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        </div>

        {/* Filter controls grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* 1. Workflow Stage */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              1. Workflow Stage
            </label>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-white text-xs"
            >
              <option value="ALL">All Stages</option>
              <option value="NOT_PAID">Not Paid</option>
              <option value="PARTNER_NOT_JOINED">Partner Not Joined</option>
              <option value="DRAFT">Applicant Drafting</option>
              <option value="PARTNER_REVIEW">Partner Review</option>
              <option value="CM_NOT_ASSIGNED">Case Manager Not Assigned</option>
              <option value="COUPLE_SUBMITTED">Case Manager Review</option>
              <option value="PRE_LAWYER_PENDING">Pre-Lawyer Questionnaire Pending</option>
              <option value="LAWYERS_ASSIGNED">Lawyer Assignment Pending</option>
              <option value="LAWYER_REVIEW">Legal Review</option>
              <option value="LAWYER_ILA_PENDING">Independent Legal Advice (ILA)</option>
              <option value="COMPLETED">Completion &amp; Execution</option>
              <option value="READY_FOR_ARCHIVE">Ready for Archive</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          {/* 2. Plans Type */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              2. Plans Type
            </label>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-white text-xs"
            >
              <option value="ALL">All Services</option>
              <option value="prenup-marriage">Prenup — Marriage</option>
              <option value="prenup-civil">Prenup — Civil Partnership</option>
              <option value="postnup-marriage">Postnup — Marriage</option>
              <option value="postnup-civil">Postnup — Civil Partnership</option>
              <option value="cohabitation">Cohabitation</option>
            </select>
          </div>

          {/* 3. Payment Status */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              3. Payment Status
            </label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-white text-xs"
            >
              <option value="ALL">All</option>
              <option value="Pending">Pending</option>
              <option value="Initiated">Initiated</option>
              <option value="Failed">Failed</option>
              <option value="Completed">Completed</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          {/* 4. Case Manager */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              4. Case Manager
            </label>
            <select
              value={cmFilter}
              onChange={(e) => setCmFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-white text-xs"
            >
              <option value="ALL">All</option>
              <option value="UNASSIGNED">Unassigned</option>
              <option value="ASSIGNED_TO_ME">Assigned to Me</option>
              <option value="ASSIGNED_TO_OTHER">Assigned to Another Case Manager</option>
            </select>
          </div>

          {/* 5. Priority */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              5. Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-white text-xs"
            >
              <option value="ALL">All</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          {/* 6. Search */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              6. Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ID, Name, Email..."
                className="w-full border border-slate-200 rounded-lg pl-8 pr-2 py-2 text-xs bg-white"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Case master table */}
      <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 tracking-tight">
            Case Master Table ({filteredCases.length}{" "}
            {filteredCases.length === 1 ? "Case" : "Cases"})
          </h3>
          <span className="text-xs text-slate-500">
            Click on any case row to inspect full details
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 uppercase text-[10px] font-bold text-slate-600 tracking-wider">
                <th className="p-4 pl-6">CASE ID</th>
                <th className="p-4">PRIMARY APPLICANT</th>
                <th className="p-4">PARTNER</th>
                <th className="p-4">WORKFLOW STAGE</th>
                <th className="p-4">CASE MANAGER</th>
                <th className="p-4 text-center">PRIORITY</th>
                <th className="p-4 pr-6 text-center">ACTION</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredCases.length > 0 ? (
                filteredCases.map((c) => {
                  const prioColor =
                    c.priority === "HIGH"
                      ? "bg-rose-100 text-rose-800"
                      : c.priority === "MEDIUM"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800";

                  return (
                    <tr
                      key={c.id}
                      onClick={() => handleCaseClick(c.id)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="p-4 pl-6 font-mono font-bold text-slate-900">
                        {c.caseNumber}
                      </td>

                      <td className="p-4 font-semibold text-slate-900">
                        <div>{c.p1}</div>
                        {c.p1Email && (
                          <div className="text-[10px] text-slate-400 font-normal">
                            {c.p1Email}
                          </div>
                        )}
                      </td>

                      <td className="p-4 text-slate-700">
                        <div>{c.p2}</div>
                        {c.p2Email && (
                          <div className="text-[10px] text-slate-400 font-normal">
                            {c.p2Email}
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-800 text-[10px] font-bold">
                          {c.workflowStage}
                        </span>
                      </td>

                      <td className="p-4 text-slate-700 font-medium">
                        {c.caseManager}
                      </td>

                      <td className="p-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${prioColor}`}>
                          {c.priority}
                        </span>
                      </td>

                      <td className="p-4 pr-6 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCaseClick(c.id);
                          }}
                          className="bg-white hover:bg-slate-100 p-1.5 rounded-lg border border-slate-300 text-slate-700 shadow-2xs transition-colors cursor-pointer"
                          title="View Case"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No matching cases found with current filter parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};