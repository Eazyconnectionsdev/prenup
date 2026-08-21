"use client";

import React, { useMemo } from "react";
import { CaseItem } from "@/types/case-manager";

interface DashboardViewProps {
  activeCases?: CaseItem[];
  allCases?: CaseItem[];
  onSelectCase: (caseId: string) => void;
  onFilterByStatus: (statusFilter: string) => void;
}

interface StatBox {
  label: string;
  value: number;
  filter: string;
}

interface StageSection {
  title: string;
  boxes: StatBox[];
  subColumns?: { title: string; boxes: StatBox[] }[];
}

export const DashboardLedgerView: React.FC<DashboardViewProps> = ({
  activeCases = [],
  allCases = [],
  onSelectCase,
  onFilterByStatus,
}) => {
  const totalCases = (allCases || []).length;

  const sections: StageSection[] = useMemo(() => {
    const casesList = allCases || [];

    const byType = (type: string) => casesList.filter((c: any) => c.caseType === type);

    const contracts = byType("CONTRACT");
    const prenup = byType("PRENUP");
    const postnup = byType("POSTNUP");
    const cohab = byType("COHAB");

    const countState = (list: CaseItem[], state: string) =>
      list.filter((c) => c.backendState === state).length;

    return [
      {
        title: "STAGE 1 — PARTNER FILLING",
        boxes: [
          {
            label: "Contracts · Partner Filling",
            value: countState(contracts, "CLIENT_FILLING"),
            filter: "CONTRACT:CLIENT_FILLING",
          },
          {
            label: "Prenup · Partner Not Invited",
            value: countState(prenup, "PARTNER_NOT_INVITED"),
            filter: "PRENUP:PARTNER_NOT_INVITED",
          },
          {
            label: "PostNup · Partners Are Filling",
            value: countState(postnup, "CLIENT_FILLING"),
            filter: "POSTNUP:CLIENT_FILLING",
          },
        ],
      },
      {
        title: "STAGE 2 — CM REVIEW",
        boxes: [
          {
            label: "Contracts · CM Review",
            value: countState(contracts, "CM_REVIEW"),
            filter: "CONTRACT:CM_REVIEW",
          },
          {
            label: "PostNup · Not Approved",
            value: countState(postnup, "NOT_APPROVED"),
            filter: "POSTNUP:NOT_APPROVED",
          },
          {
            label: "Cobhab · Not Assigned",
            value: countState(cohab, "NOT_ASSIGNED"),
            filter: "COHAB:NOT_ASSIGNED",
          },
        ],
      },
      {
        title: "STAGE 3 — LEGAL REVIEW",
        boxes: [
          {
            label: "Contracts · Legal Review",
            value: countState(contracts, "LAWYER_REVIEW"),
            filter: "CONTRACT:LAWYER_REVIEW",
          },
          {
            label: "P1 Pre Lawyer Questionnaire Pending",
            value: countState(postnup, "P1_PRE_LAWYER_QUESTIONNAIRE_PENDING"),
            filter: "POSTNUP:P1_PRE_LAWYER_QUESTIONNAIRE_PENDING",
          },
          {
            label: "P1 Lawyer - Clients Approval Waiting",
            value: countState(postnup, "P1_CLIENT_APPROVAL_WAITING"),
            filter: "POSTNUP:P1_CLIENT_APPROVAL_WAITING",
          },
          {
            label: "P1 Lawyer - Lawyer Approval Waiting",
            value: countState(postnup, "P1_LAWYER_APPROVAL_WAITING"),
            filter: "POSTNUP:P1_LAWYER_APPROVAL_WAITING",
          },
          {
            label: "P1 Awaiting ILA",
            value: countState(postnup, "P1_AWAITING_ILA"),
            filter: "POSTNUP:P1_AWAITING_ILA",
          },

          {
            label: "P2 Pre Lawyer Questionnaire Pending",
            value: countState(cohab, "P2_PRE_LAWYER_QUESTIONNAIRE_PENDING"),
            filter: "COHAB:P2_PRE_LAWYER_QUESTIONNAIRE_PENDING",
          },
          {
            label: "P2 Lawyer - Clients Approval Waiting",
            value: countState(cohab, "P2_CLIENT_APPROVAL_WAITING"),
            filter: "COHAB:P2_CLIENT_APPROVAL_WAITING",
          },
          {
            label: "P2 Lawyer - Lawyer Approval Waiting",
            value: countState(cohab, "P2_LAWYER_APPROVAL_WAITING"),
            filter: "COHAB:P2_LAWYER_APPROVAL_WAITING",
          },
          {
            label: "P2 Awaiting ILA",
            value: countState(cohab, "P2_AWAITING_ILA"),
            filter: "COHAB:P2_AWAITING_ILA",
          },
        ],
      },
      {
        title: "STAGE 4 — READY TO SIGN / COMPLETED",
        boxes: [
          {
            label: "Contracts · Ready To Sign / Completed",
            value: countState(contracts, "READY_FOR_SIGNING"),
            filter: "CONTRACT:READY_FOR_SIGNING",
          },
        ],
      },
      {
        title: "STAGE 5 — ARCHIVED",
        boxes: [
          {
            label: "Contracts · CM Can Move To Archived",
            value: countState(contracts, "ARCHIVED"),
            filter: "CONTRACT:ARCHIVED",
          },
        ],
      },
    ];
  }, [allCases]);

  return (
    <div className="flex flex-col gap-6 max-w-[1280px]">
      {/* Total Cases — single box */}
      <div>
        <div className="text-[11px] font-bold font-sans uppercase tracking-wider text-slate-500 mb-3">
          TOTAL CASES
        </div>
        <div
          onClick={() => onFilterByStatus("ALL")}
          className="bg-white border border-slate-300 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-slate-400 active:scale-[0.98] transition-all flex flex-col justify-between h-[96px] w-[220px] group"
          title="Click to view all cases"
        >
          <span className="text-[10px] font-bold font-sans uppercase tracking-wider text-slate-400 group-hover:text-slate-700 transition-colors">
            Total Cases
          </span>
          <div className="text-2xl font-bold font-sans text-slate-900 tracking-tight leading-none">
            {totalCases}
          </div>
        </div>
      </div>

      {/* Stage sections — heading + row of boxes, matching original card style */}
      {sections.map((section) => (
        <div key={section.title}>
          <div className="text-[11px] font-bold font-sans uppercase tracking-wider text-slate-500 mb-3">
            {section.title}
          </div>

          <div className="flex flex-wrap gap-3.5">
            {section.boxes.map((m) => (
              <div
                key={m.filter}
                onClick={() => onFilterByStatus(m.filter)}
                className="bg-white border border-slate-300 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-slate-400 active:scale-[0.98] transition-all flex flex-col justify-between h-[96px] w-[220px] group"
                title={`Click to view ${m.label} cases`}
              >
                <span className="text-[10px] font-bold font-sans uppercase tracking-wider text-slate-400 group-hover:text-slate-700 transition-colors">
                  {m.label}
                </span>
                <div className="text-2xl font-bold font-sans text-slate-900 tracking-tight leading-none">
                  {m.value}
                </div>
              </div>
            ))}
          </div>

          {/* Stage 3 sub-columns: P1 (PostNup) / P2 (Cobhab) side by side */}
        </div>
      ))}

      {/* Action Queue Alerts (Section 5 Specification) — unchanged */}
      <div className="mt-1">
        <div className="text-[11px] font-bold font-sans uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
          <span>
            ACTION QUEUE ALERTS ({(activeCases || []).length} ACTIVE MATTERS) —
            SECTION 5 SPECIFICATION
          </span>
          <span className="text-[10px] text-slate-400 font-normal">
            Click any card to inspect full case details &amp; actions
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {(activeCases || []).map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectCase(c.id)}
              className="bg-white border border-slate-300 rounded-xl p-5 cursor-pointer hover:shadow-md hover:border-slate-400 active:scale-[0.99] transition-all flex flex-col gap-3.5 group shadow-2xs"
            >
              {/* Header: ID + Badge */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-slate-500 group-hover:text-slate-900 transition-colors">
                  {c.id}
                </span>
                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  <span className="badge-rose-pill">{c.cmView}</span>
                  {c.actionLabel && c.actionLabel !== c.cmView && (
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                      {c.actionLabel}
                    </span>
                  )}
                </div>
              </div>

              {/* Middle: Couple Names */}
              <h3 className="text-sm font-semibold font-sans text-slate-900 tracking-tight">
                {c.p1} &amp; {c.p2}
              </h3>

              {/* Footer: Owner Badge + Priority */}
              <div className="flex items-center justify-between pt-1">
                <span className="badge-owner-pill">
                  OWNER: {c.owner || "CASE MANAGER"}
                </span>
                <span
                  className={
                    c.priority === "CRITICAL"
                      ? "badge-priority-critical"
                      : "badge-priority-pill"
                  }
                >
                  {c.priority || "HIGH"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
