"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Axios from "@/lib/ApiConfig";
import {
  toStageFacts,
  countByStageFilter,
  lifecycleOf,
  ACTIVE_STAGES,
  type CaseStageFacts,
} from "@/lib/caseStages";
import { Briefcase, CreditCard, ChevronRight, Archive } from "lucide-react";

const ALL_FILTERS = ["NOT_PAID", "ACTIVE", ...ACTIVE_STAGES.map((s) => s.value)];

// The four columns of Active Cases, in workflow order. Every active case is in
// exactly one stage, so the column totals add up to the Active Cases count.
const COLUMNS: {
  title: string;
  description: string;
  stages: string[];
  accent: string;
  hover: string;
  count: string;
}[] = [
  {
    title: "Applicant Drafting",
    description: "Paid cases where applicants are completing forms and approving.",
    stages: ["PARTNER_NOT_JOINED", "APPLICANT_DRAFTING", "PARTNER_REVIEW"],
    accent: "border-amber-400",
    hover: "group-hover:text-amber-600",
    count: "text-amber-500",
  },
  {
    title: "Case Manager Review",
    description: "Submitted cases with the case manager, up to lawyer assignment.",
    stages: ["CM_NOT_ASSIGNED", "CM_REVIEW", "PRE_LAWYER_PENDING", "LAWYER_ASSIGNMENT_PENDING"],
    accent: "border-blue-500",
    hover: "group-hover:text-blue-600",
    count: "text-blue-600",
  },
  {
    title: "Legal Review",
    description: "Cases with lawyers assigned, through independent legal advice.",
    stages: ["LEGAL_REVIEW", "LAWYER_ILA_PENDING"],
    accent: "border-purple-500",
    hover: "group-hover:text-purple-600",
    count: "text-purple-600",
  },
  {
    title: "Completed",
    description: "Signed off by both lawyers; final confirmations and execution.",
    stages: ["COMPLETION_EXECUTION"],
    accent: "border-emerald-500",
    hover: "group-hover:text-emerald-600",
    count: "text-emerald-600",
  },
];

export const DashboardLedgerView: React.FC = () => {
  const router = useRouter();

  const [cases, setCases] = useState<CaseStageFacts[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Counts come from the same case list and the same rules as the Active
    // Cases page, so clicking a tile always shows exactly that many cases.
    (async () => {
      try {
        setLoading(true);
        const { data } = await Axios.get("/case-manager/cases");
        setCases((Array.isArray(data) ? data : []).map(toStageFacts));
      } catch (error) {
        console.error("Dashboard fetch error", error);
        setCases([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const counts = useMemo(() => countByStageFilter(cases, ALL_FILTERS), [cases]);
  const recentlyCompleted = useMemo(
    () => cases.filter((c) => lifecycleOf(c) === "COMPLETED").length,
    [cases]
  );

  const openStage = (filter: string) =>
    router.push(`/cm/cases?status=${encodeURIComponent(filter)}`);

  if (loading) {
    return <div className="p-8 text-slate-500 font-sans text-sm">Loading dashboard...</div>;
  }

  const stage = (value: string) => ACTIVE_STAGES.find((s) => s.value === value)!;

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Case Manager Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Not Paid → Active Cases → Archived. Click any count to open those cases.
          </p>
        </div>
        <div className="text-xs font-mono text-slate-400">
          {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
        </div>
      </div>

      {/* Top summary: Active Cases and Not Paid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => openStage("ACTIVE")}
          className="text-left bg-white border border-slate-200/90 rounded-2xl p-5 flex items-center gap-4 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Active Cases
            </span>
            <span className="text-2xl font-extrabold text-slate-900 leading-none">
              {counts.ACTIVE}
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">
              Paid, from drafting to completion &amp; execution
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => openStage("NOT_PAID")}
          className="text-left bg-white border border-slate-200/90 rounded-2xl p-5 flex items-center gap-4 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Not Paid
            </span>
            <span className="text-2xl font-extrabold text-slate-900 leading-none">
              {counts.NOT_PAID}
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">
              Payment not completed (or refunded)
            </span>
          </div>
        </button>
      </div>

      {/* Active Cases by stage */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {COLUMNS.map((col) => {
          const total = col.stages.reduce((n, s) => n + (counts[s] ?? 0), 0);
          return (
            <div
              key={col.title}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4"
            >
              <div className={`pb-3 border-b-2 ${col.accent} flex items-center justify-between`}>
                <h3 className="font-bold text-sm text-slate-900">{col.title}</h3>
                <span className="min-w-6 h-6 px-1.5 rounded-full bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center">
                  {total}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed -mt-2">{col.description}</p>

              <div className="space-y-2.5 pt-1">
                {col.stages.map((value) => {
                  const s = stage(value);
                  const n = counts[value] ?? 0;
                  return (
                    <button
                      type="button"
                      key={value}
                      onClick={() => openStage(value)}
                      className="w-full text-left p-3 rounded-xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-100 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                    >
                      <div>
                        <h4 className={`text-xs font-bold text-slate-900 transition-colors ${col.hover}`}>
                          {s.label}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">{s.hint}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-xs font-extrabold ${n > 0 ? col.count : "text-slate-400"}`}>
                          {n}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  );
                })}

                {col.title === "Completed" && (
                  <button
                    type="button"
                    onClick={() => router.push("/cm/archived?status=RECENTLY_COMPLETED")}
                    className="w-full text-left p-3 rounded-xl border border-dashed border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Archive className="w-3.5 h-3.5 text-slate-400" /> Recently Completed
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Moves to Archived 30 days after completion
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-xs font-extrabold text-slate-500">{recentlyCompleted}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardLedgerView;
