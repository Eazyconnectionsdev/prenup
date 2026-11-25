"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import {
  fetchAssignments,
  matchesLawyerStage,
  PENDING_STAGES,
  type LawyerAssignment,
} from "@/lib/lawyerStages";

// Lawyer dashboard. Total Assigned = Total Pending + Completed Assignments;
// Total Pending = Review + ILA & Sign-off + Final Confirmation pending.
const LawyerPage = () => {
  const router = useRouter();
  const [rows, setRows] = useState<LawyerAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setRows(await fetchAssignments("active"));
      } catch (err) {
        console.error("Failed to fetch assignments", err);
        setError("Couldn't load your cases right now.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const count = useMemo(
    () => (filter: string) => rows.filter((r) => matchesLawyerStage(r, filter)).length,
    [rows]
  );

  const open = (filter: string) =>
    router.push(
      filter === "ALL" ? "/lawyer/assigned-cases" : `/lawyer/assigned-cases?stage=${filter}`
    );

  const tiles = [
    { filter: "ALL", title: "Total Assigned Cases", hint: "All assigned cases, excluding archived cases", dark: true },
    { filter: "PENDING", title: "Total Pending Cases", hint: "Cases awaiting your action" },
    { filter: "COMPLETED", title: "Completed Assignments", hint: "Your work on the case is completed" },
  ];

  return (
    <div className="p-8">
      <div className="flex flex-col gap-6 max-w-[1280px]">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Lawyer Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Your assignments. Click any count to open those cases.
          </p>
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tiles.map((t) => (
            <button
              type="button"
              key={t.filter}
              onClick={() => open(t.filter)}
              className={`text-left rounded-xl p-6 flex flex-col justify-between min-h-[120px] shadow-xs cursor-pointer transition-all border ${
                t.dark
                  ? "bg-[#131e36] border-[#1b2a47] hover:border-slate-500"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  t.dark ? "text-slate-300" : "text-slate-400"
                }`}
              >
                {t.title}
              </span>
              <span className={`text-3xl font-bold tracking-tight leading-none ${t.dark ? "text-white" : "text-slate-800"}`}>
                {loading ? "…" : count(t.filter)}
              </span>
              <span className={`text-[11px] ${t.dark ? "text-slate-400" : "text-slate-500"}`}>{t.hint}</span>
            </button>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">
            Pending cases by stage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PENDING_STAGES.map((s) => (
              <button
                type="button"
                key={s.value}
                onClick={() => open(s.value)}
                className="p-4 rounded-xl bg-slate-50/70 hover:bg-slate-100 border border-slate-100 flex items-center justify-between gap-3 cursor-pointer group text-left"
              >
                <span className="text-sm font-bold text-slate-800">{s.label}</span>
                <span className="flex items-center gap-1.5">
                  <span className="text-lg font-extrabold text-slate-900">{loading ? "…" : count(s.value)}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerPage;
