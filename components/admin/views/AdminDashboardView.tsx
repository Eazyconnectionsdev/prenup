"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Axios from "@/lib/ApiConfig";
import {
  Briefcase,
  Users,
  Building2,
  CheckCircle2,
  Clock,
  Layers,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  Scale,
} from "lucide-react";

interface AdminKpis {
  totalCases: number;
  activeCases: number;
  completedCases: number;
  totalUsers: number;
  totalLawyers: number;
  totalCompanies: number;
}

interface StageSummaryItem {
  _id: string; // workflow status
  count: number;
}

const STAGE_LABELS: Record<string, { label: string; group: string; color: string }> = {
  DRAFT: { label: "Draft / Partner Filling", group: "Intake", color: "border-amber-400/80 bg-amber-50/50 text-amber-700" },
  PARTNER_NOT_INVITED: { label: "Partner Not Invited", group: "Intake", color: "border-slate-300 bg-slate-50 text-slate-700" },
  PARTNER_FILLING: { label: "Partner Filling", group: "Intake", color: "border-amber-400/80 bg-amber-50/50 text-amber-700" },
  RETURNED_TO_DRAFT: { label: "Returned To Draft", group: "Review", color: "border-rose-400 bg-rose-50/50 text-rose-700" },
  COUPLE_SUBMITTED: { label: "Awaiting CM Review", group: "Review", color: "border-blue-400 bg-blue-50/50 text-blue-700" },
  AWAITING_CM_REVIEW: { label: "Awaiting CM Review", group: "Review", color: "border-blue-400 bg-blue-50/50 text-blue-700" },
  PRE_LAWYER_PENDING: { label: "Pre-Lawyer Pending", group: "Legal", color: "border-indigo-400 bg-indigo-50/50 text-indigo-700" },
  LAWYER_REVIEW: { label: "Lawyer Review", group: "Legal", color: "border-purple-400 bg-purple-50/50 text-purple-700" },
  LAWYER_ILA_PENDING: { label: "ILA Pending", group: "Legal", color: "border-violet-400 bg-violet-50/50 text-violet-700" },
  NEGOTIATION: { label: "Negotiation", group: "Negotiation", color: "border-cyan-400 bg-cyan-50/50 text-cyan-700" },
  EXECUTION_PACK_GENERATED: { label: "Execution Pack Ready", group: "Completion", color: "border-emerald-400 bg-emerald-50/50 text-emerald-700" },
  COMPLETED: { label: "Completed", group: "Completion", color: "border-emerald-500 bg-emerald-50 text-emerald-800" },
  READY_FOR_ARCHIVE: { label: "Ready For Archive", group: "Archive", color: "border-slate-400 bg-slate-100 text-slate-800" },
  ARCHIVED: { label: "Archived", group: "Archive", color: "border-slate-300 bg-slate-50 text-slate-500" },
};

export const AdminDashboardView: React.FC = () => {
  const router = useRouter();

  const [kpis, setKpis] = useState<AdminKpis | null>(null);
  const [stages, setStages] = useState<StageSummaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [kpiRes, stagesRes] = await Promise.all([
        Axios.get<AdminKpis>("/admin/dashboard"),
        Axios.get<StageSummaryItem[]>("/admin/dashboard/stages").catch((err) => {
          console.warn("Stages endpoint warning:", err);
          return { data: [] as StageSummaryItem[] };
        }),
      ]);

      setKpis(kpiRes.data);
      setStages(Array.isArray(stagesRes.data) ? stagesRes.data : []);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error("Admin dashboard fetch error:", err);
      setError(
        err?.response?.data?.message ||
          "Failed to load administrative dashboard data. Please verify your connection."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleCardClick = (filter?: string) => {
    if (!filter || filter === "ALL") {
      router.push("/admin/cases");
    } else {
      router.push(`/admin/cases?status=${encodeURIComponent(filter)}`);
    }
  };

  if (loading && !kpis) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500 gap-3">
        <RefreshCw className="w-7 h-7 animate-spin text-violet-600" />
        <span className="text-sm font-medium">Loading administrative dashboard...</span>
      </div>
    );
  }

  if (error && !kpis) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 max-w-xl">
        <div className="flex items-center gap-2 font-bold mb-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span>Error Loading Dashboard</span>
        </div>
        <p className="text-sm mb-4">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1340px]">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold font-serif text-slate-900 tracking-tight">
            System Administration Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time platform overview across cases, legal partners, and user metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-[11px] text-slate-400">
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs cursor-pointer transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-violet-600" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-violet-600" />
          <span>Platform Overview</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Total Cases */}
          <div
            onClick={() => handleCardClick("ALL")}
            className="bg-white border border-slate-200 hover:border-violet-300 rounded-xl p-4 cursor-pointer hover:shadow-md active:scale-[0.98] transition-all flex flex-col justify-between group h-[106px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-violet-600 transition-colors">
                Total Cases
              </span>
              <Briefcase className="w-4 h-4 text-violet-500/70" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {kpis?.totalCases ?? 0}
            </div>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              All registered <ArrowRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
          </div>

          {/* Active Cases */}
          <div
            onClick={() => router.push("/admin/cases")}
            className="bg-white border border-slate-200 hover:border-amber-300 rounded-xl p-4 cursor-pointer hover:shadow-md active:scale-[0.98] transition-all flex flex-col justify-between group h-[106px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-amber-600 transition-colors">
                Active Cases
              </span>
              <Clock className="w-4 h-4 text-amber-500/70" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {kpis?.activeCases ?? 0}
            </div>
            <span className="text-[10px] text-slate-400">In workflow</span>
          </div>

          {/* Completed Cases */}
          <div
            onClick={() => handleCardClick("COMPLETED")}
            className="bg-white border border-slate-200 hover:border-emerald-300 rounded-xl p-4 cursor-pointer hover:shadow-md active:scale-[0.98] transition-all flex flex-col justify-between group h-[106px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-emerald-600 transition-colors">
                Completed
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500/70" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-700">
              {kpis?.completedCases ?? 0}
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">Finalised</span>
          </div>

          {/* Total Users */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between h-[106px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Registered Users
              </span>
              <Users className="w-4 h-4 text-blue-500/70" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {kpis?.totalUsers ?? 0}
            </div>
            <span className="text-[10px] text-slate-400">Clients & accounts</span>
          </div>

          {/* Total Lawyers */}
          <div
            onClick={() => router.push("/admin/admin-settings")}
            className="bg-white border border-slate-200 hover:border-purple-300 rounded-xl p-4 cursor-pointer hover:shadow-md active:scale-[0.98] transition-all flex flex-col justify-between group h-[106px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-purple-600 transition-colors">
                Lawyers
              </span>
              <Scale className="w-4 h-4 text-purple-500/70" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {kpis?.totalLawyers ?? 0}
            </div>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              Manage in settings <ArrowRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
          </div>

          {/* Total Companies */}
          <div
            onClick={() => router.push("/admin/admin-settings")}
            className="bg-white border border-slate-200 hover:border-cyan-300 rounded-xl p-4 cursor-pointer hover:shadow-md active:scale-[0.98] transition-all flex flex-col justify-between group h-[106px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-cyan-600 transition-colors">
                Law Firms
              </span>
              <Building2 className="w-4 h-4 text-cyan-500/70" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {kpis?.totalCompanies ?? 0}
            </div>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              Registered firms <ArrowRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
          </div>
        </div>
      </div>

      {/* Stage Breakdown Section */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-violet-600" />
            <span>Workflow Stages Ledger</span>
          </div>
          <span className="text-[11px] text-slate-400 font-normal">
            Click any stage to inspect matching cases
          </span>
        </div>

        {stages.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-xs">
            No active stage data available yet. Newly registered cases will automatically populate here.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {stages.map((stage) => {
              const meta = STAGE_LABELS[stage._id] || {
                label: stage._id.replace(/_/g, " "),
                group: "Other",
                color: "border-slate-300 bg-slate-50 text-slate-700",
              };

              return (
                <div
                  key={stage._id}
                  onClick={() => handleCardClick(stage._id)}
                  className="bg-white border border-slate-200 hover:border-violet-400 rounded-xl p-3.5 cursor-pointer hover:shadow-md active:scale-[0.98] transition-all flex flex-col justify-between h-[92px] group"
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate group-hover:text-violet-700 transition-colors">
                      {meta.label}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium shrink-0">
                      {stage._id}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mt-1">
                    <div className="text-xl font-extrabold text-slate-800">
                      {stage.count}
                    </div>
                    <span className="text-[10px] text-violet-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      View cases →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Action Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
        <div
          onClick={() => router.push("/admin/cases")}
          className="p-5 bg-white border border-slate-200 rounded-xl hover:border-violet-300 hover:shadow-sm cursor-pointer transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">Cases Master Ledger</div>
              <div className="text-xs text-slate-400">Search, filter, and inspect all platform cases</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </div>

        <div
          onClick={() => router.push("/admin/admin-settings")}
          className="p-5 bg-white border border-slate-200 rounded-xl hover:border-violet-300 hover:shadow-sm cursor-pointer transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">Lawyer & Law Firm Management</div>
              <div className="text-xs text-slate-400">Manage directory, verify lawyers, and configure TopBar</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </div>
  );
};
