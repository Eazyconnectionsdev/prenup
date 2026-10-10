"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Axios from "@/lib/ApiConfig";
import {
  Search,
  Filter,
  RotateCcw,
  Eye,
  RefreshCw,
  AlertCircle,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  Calendar,
  Clock,
  ShieldAlert,
} from "lucide-react";

interface RawCaseItem {
  _id: string;
  caseNumber?: string;
  workflowStatus?: string;
  priority?: string;
  createdAt?: string;
  updatedAt?: string;
  owner?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  } | string;
  invitedUser?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  } | string;
  assignedCaseManager?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  } | string;
  [key: string]: any;
}

interface FormattedCase {
  id: string;
  caseNumber: string;
  p1: string;
  p2: string;
  workflowStatus: string;
  caseManager: string;
  priority: string;
  createdAt: string;
  raw: RawCaseItem;
}

export const AdminCasesView: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlStatus = searchParams.get("status") || "ALL";

  const [selectedStatus, setSelectedStatus] = useState<string>(urlStatus);
  const [searchQuery, setSearchQuery] = useState("");
  const [cases, setCases] = useState<FormattedCase[]>([]);
  const [totalCases, setTotalCases] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(50);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Case Detail Drawer / Modal
  const [activeCaseModal, setActiveCaseModal] = useState<RawCaseItem | null>(null);
  const [modalLoading, setModalLoading] = useState<boolean>(false);

  // Sync selected status from URL query param when it changes
  useEffect(() => {
    setSelectedStatus(urlStatus);
  }, [urlStatus]);

  const fetchCases = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let responseData: any;

      if (selectedStatus && selectedStatus !== "ALL") {
        const res = await Axios.get(`/admin/dashboard/stages/${encodeURIComponent(selectedStatus)}/cases`);
        responseData = res.data;
      } else {
        const res = await Axios.get(`/admin/cases?page=${page}&limit=${limit}`);
        responseData = res.data;
      }

      // Backend /admin/cases returns { total, docs } while /stages/:status/cases returns an array directly
      let rawDocs: RawCaseItem[] = [];
      let totalCount = 0;

      if (Array.isArray(responseData)) {
        rawDocs = responseData;
        totalCount = responseData.length;
      } else if (responseData && Array.isArray(responseData.docs)) {
        rawDocs = responseData.docs;
        totalCount = responseData.total ?? responseData.docs.length;
      } else if (responseData && Array.isArray(responseData.cases)) {
        rawDocs = responseData.cases;
        totalCount = responseData.total ?? responseData.cases.length;
      }

      const formatted: FormattedCase[] = rawDocs.map((item: RawCaseItem) => {
        // P1 Owner name
        let p1Name = "Unknown";
        if (typeof item.owner === "object" && item.owner !== null) {
          p1Name = `${item.owner.firstName ?? ""} ${item.owner.lastName ?? ""}`.trim() || item.owner.email || "Unknown";
        } else if (typeof item.owner === "string") {
          p1Name = item.owner;
        }

        // P2 Partner name
        let p2Name = "Not Invited";
        if (typeof item.invitedUser === "object" && item.invitedUser !== null) {
          p2Name = `${item.invitedUser.firstName ?? ""} ${item.invitedUser.lastName ?? ""}`.trim() || item.invitedUser.email || "Invited User";
        } else if (typeof item.invitedUser === "string") {
          p2Name = item.invitedUser;
        }

        // Case Manager
        let cmName = "Unassigned";
        if (typeof item.assignedCaseManager === "object" && item.assignedCaseManager !== null) {
          cmName = `${item.assignedCaseManager.firstName ?? ""} ${item.assignedCaseManager.lastName ?? ""}`.trim() || item.assignedCaseManager.email || "Assigned CM";
        } else if (typeof item.assignedCaseManager === "string") {
          cmName = item.assignedCaseManager;
        }

        return {
          id: item._id,
          caseNumber: item.caseNumber || `CASE-${item._id.slice(-6).toUpperCase()}`,
          p1: p1Name,
          p2: p2Name,
          workflowStatus: item.workflowStatus || "DRAFT",
          caseManager: cmName,
          priority: item.priority || "MEDIUM",
          createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—",
          raw: item,
        };
      });

      setCases(formatted);
      setTotalCases(totalCount);
    } catch (err: any) {
      console.error("Admin cases fetch error:", err);
      setError(err?.response?.data?.message || "Failed to load admin cases list.");
      setCases([]);
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, page, limit]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const handleStatusFilterChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
    setPage(1);
    if (newStatus === "ALL") {
      router.push("/admin/cases");
    } else {
      router.push(`/admin/cases?status=${encodeURIComponent(newStatus)}`);
    }
  };

  const handleResetFilters = () => {
    setSelectedStatus("ALL");
    setSearchQuery("");
    setPage(1);
    router.push("/admin/cases");
  };

  const handleOpenCaseDetail = async (caseId: string) => {
    try {
      setModalLoading(true);
      const res = await Axios.get(`/admin/cases/${caseId}`);
      setActiveCaseModal(res.data);
    } catch (err) {
      console.warn("Could not fetch individual case detail, falling back to local item:", err);
      const found = cases.find((c) => c.id === caseId);
      if (found) setActiveCaseModal(found.raw);
    } finally {
      setModalLoading(false);
    }
  };

  const filteredCases = useMemo(() => {
    if (!searchQuery.trim()) return cases;
    const query = searchQuery.toLowerCase();
    return cases.filter(
      (c) =>
        c.caseNumber.toLowerCase().includes(query) ||
        c.p1.toLowerCase().includes(query) ||
        c.p2.toLowerCase().includes(query) ||
        c.workflowStatus.toLowerCase().includes(query) ||
        c.caseManager.toLowerCase().includes(query)
    );
  }, [cases, searchQuery]);

  return (
    <div className="space-y-6 max-w-[1340px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold font-serif text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-violet-600" />
            <span>Master Cases Ledger</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global administrative supervision across all client cases, assigned managers, and workflow stages.
          </p>
        </div>

        <button
          onClick={fetchCases}
          disabled={loading}
          className="self-start md:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs cursor-pointer transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-violet-600" : ""}`} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by case #, partner, or status..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-violet-500 bg-slate-50/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wide">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="border border-slate-200 rounded-lg px-2.5 py-2 text-xs bg-white text-slate-700 focus:outline-none focus:border-violet-500 font-medium"
            >
              <option value="ALL">All Stages</option>
              <option value="DRAFT">Draft / Intake</option>
              <option value="COUPLE_SUBMITTED">Awaiting CM Review</option>
              <option value="RETURNED_TO_DRAFT">Returned to Draft</option>
              <option value="PRE_LAWYER_PENDING">Pre-Lawyer Pending</option>
              <option value="LAWYER_REVIEW">Lawyer Review</option>
              <option value="LAWYER_ILA_PENDING">Lawyer ILA Pending</option>
              <option value="EXECUTION_PACK_GENERATED">Execution Pack Ready</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetFilters}
          className="bg-slate-100 border border-slate-200 hover:bg-slate-200 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchCases}
            className="underline font-semibold hover:text-red-900 ml-4 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Cases Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
            Cases Record ({filteredCases.length}{" "}
            {filteredCases.length === 1 ? "Matter" : "Matters"}
            {totalCases > filteredCases.length && !searchQuery ? ` of ${totalCases}` : ""})
          </h3>
          {selectedStatus !== "ALL" && (
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-700 font-semibold">
              Filtered: {selectedStatus}
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 uppercase text-[10px] tracking-wider text-slate-500 font-semibold">
                <th className="py-3.5 px-4 pl-6">Case Reference</th>
                <th className="py-3.5 px-4">Primary Client (P1)</th>
                <th className="py-3.5 px-4">Partner (P2)</th>
                <th className="py-3.5 px-4">Workflow Status</th>
                <th className="py-3.5 px-4">Case Manager</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Registered</th>
                <th className="py-3.5 px-4 pr-6 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-violet-600" />
                      <span>Loading cases ledger...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCases.length > 0 ? (
                filteredCases.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => handleOpenCaseDetail(c.id)}
                    className="hover:bg-violet-50/30 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 pl-6 font-mono font-bold text-slate-800 text-xs">
                      {c.caseNumber}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {c.p1}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {c.p2}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                        {c.workflowStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {c.caseManager}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          c.priority === "HIGH" || c.priority === "URGENT"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {c.priority}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {c.createdAt}
                    </td>

                    <td className="py-3.5 px-4 pr-6 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenCaseDetail(c.id);
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-violet-100 text-slate-600 hover:text-violet-700 transition-colors cursor-pointer"
                        title="View Case Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No cases match the specified search or stage criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Strip (if all cases view) */}
        {selectedStatus === "ALL" && totalCases > limit && (
          <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {Math.min((page - 1) * limit + 1, totalCases)} to{" "}
              {Math.min(page * limit, totalCases)} of {totalCases} cases
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-semibold px-2">Page {page}</span>
              <button
                disabled={page * limit >= totalCases}
                onClick={() => setPage((p) => p + 1)}
                className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Case Detail Modal */}
      {activeCaseModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2 py-0.5 rounded">
                  Admin Case Inspector
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {activeCaseModal.caseNumber || `CASE-${activeCaseModal._id}`}
                </h3>
              </div>
              <button
                onClick={() => setActiveCaseModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Core Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                  {activeCaseModal.workflowStatus || "DRAFT"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Priority</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                  {activeCaseModal.priority || "MEDIUM"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Primary Owner (P1)</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {typeof activeCaseModal.owner === "object" && activeCaseModal.owner
                    ? `${activeCaseModal.owner.firstName ?? ""} ${activeCaseModal.owner.lastName ?? ""} (${activeCaseModal.owner.email ?? ""})`
                    : String(activeCaseModal.owner || "N/A")}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Invited Partner (P2)</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {typeof activeCaseModal.invitedUser === "object" && activeCaseModal.invitedUser
                    ? `${activeCaseModal.invitedUser.firstName ?? ""} ${activeCaseModal.invitedUser.lastName ?? ""} (${activeCaseModal.invitedUser.email ?? ""})`
                    : String(activeCaseModal.invitedUser || "Not Invited")}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Case Manager</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {typeof activeCaseModal.assignedCaseManager === "object" && activeCaseModal.assignedCaseManager
                    ? `${activeCaseModal.assignedCaseManager.firstName ?? ""} ${activeCaseModal.assignedCaseManager.lastName ?? ""}`
                    : String(activeCaseModal.assignedCaseManager || "Unassigned")}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Created Date</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {activeCaseModal.createdAt ? new Date(activeCaseModal.createdAt).toLocaleString() : "—"}
                </span>
              </div>
            </div>

            {/* Raw metadata preview */}
            <div className="border border-slate-100 rounded-xl p-3 bg-slate-900 text-slate-200 text-[11px] font-mono overflow-x-auto max-h-48">
              <pre>{JSON.stringify(activeCaseModal, null, 2)}</pre>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setActiveCaseModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
