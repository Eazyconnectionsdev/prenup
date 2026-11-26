"use client";

import React from "react";
import { Award, Clock, ShieldCheck, Activity, FolderCheck } from "lucide-react";
import { Modal } from "./Modal";
import type { ScorecardModalProps } from "@/types/case-manager/scorecard-modal";

export const ScorecardModal: React.FC<ScorecardModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Architecture Scorecard & Performance KPIs"
      description="Operational Coordinator Performance Metrics & Service Level Standards"
      icon={
        <div className="w-10 h-10 rounded-xl border border-slate-300 bg-slate-100 flex items-center justify-center text-slate-800 shadow-xs">
          <Award className="w-5 h-5 text-slate-800" />
        </div>
      }
      footer={
        <button
          onClick={onClose}
          className="bg-slate-900 text-white font-bold font-sans text-xs py-2.5 px-6 rounded-lg shadow-xs hover:bg-slate-800 transition-all cursor-pointer"
        >
          Close Architecture Scorecard
        </button>
      }
    >
      {/* Score Grid with Explanations */}
      <div className="grid grid-cols-2 gap-4 font-sans">
        {/* Metric 1: Avg CM Review Time */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-2 shadow-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-600" /> Avg CM Review Time
            </span>
            <div className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              1.8 Days
            </div>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/60 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-1">
              ⚡ 68% Faster Than Target SLA (5.0 Days Limit)
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-snug border-t border-slate-200/60 pt-2 mt-1">
            <strong>What is this?</strong> The average turnaround time (in days)
            taken by Case Managers to review, verify identity &amp; financial
            disclosures, and assign counsel.
          </p>
        </div>

        {/* Metric 2: Conflict Check Pass Rate */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-2 shadow-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-slate-600" /> Conflict Check
              Pass Rate
            </span>
            <div className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              100%
            </div>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/60 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-1">
              🛡️ Zero Dual-Firm Overlaps (Rule 1)
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-snug border-t border-slate-200/60 pt-2 mt-1">
            <strong>What is this?</strong> Percentage of cases passing automated
            Rule 1 verification ensuring independent legal representation for
            both Party 1 and Party 2.
          </p>
        </div>

        {/* Metric 3: SLA Compliance */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-2 shadow-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
              <Activity className="w-3 h-3 text-slate-600" /> SLA Compliance
              Rate
            </span>
            <div className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              94.2%
            </div>
            <span className="text-[10px] text-slate-700 font-bold bg-slate-200/70 px-2 py-0.5 rounded inline-block mt-1">
              🏆 Top Performance Tier
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-snug border-t border-slate-200/60 pt-2 mt-1">
            Percentage of legal matters completed within strict statutory SLA
            deadlines prior to wedding dates.
          </p>
        </div>

        {/* Metric 4: Active Matters */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-2 shadow-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
              <FolderCheck className="w-3 h-3 text-slate-600" /> Active Matters
            </span>
            <div className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              10 Cases
            </div>
            <span className="text-[10px] text-slate-700 font-bold bg-slate-200/70 px-2 py-0.5 rounded inline-block mt-1">
              📂 Active Workload Portfolio
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-snug border-t border-slate-200/60 pt-2 mt-1">
            Total active prenuptial agreement matters currently managed across
            all processing workflow stages.
          </p>
        </div>
      </div>
    </Modal>
  );
};
