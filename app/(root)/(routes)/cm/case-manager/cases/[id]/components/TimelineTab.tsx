"use client";

import React, { useEffect, useState } from "react";
import Axios from "@/lib/ApiConfig";
import { CheckCircle2, Clock, Circle } from "lucide-react";
import type { Props } from "@/types/case-detail/tabs/timeline-tab";

interface StageMilestone {
  no: number;
  name: string;
  criteria: string;
  isComplete: (c: any) => boolean;
  isInProgress: (c: any) => boolean;
}

const MILESTONES: StageMilestone[] = [
  {
    no: 1,
    name: "Payment",
    criteria: "Required payment completed.",
    isComplete: (c) => Boolean(c?.paymentCompleted) || String(c?.paymentStatus).toUpperCase() === "COMPLETED",
    isInProgress: (c) => String(c?.paymentStatus).toUpperCase() === "INITIATED",
  },
  {
    no: 2,
    name: "Partner Invitation",
    criteria: "Partner accepts the invitation and registers.",
    isComplete: (c) => Boolean(c?.invitedUser?._id || c?.invitedUser),
    isInProgress: (c) => Boolean(c?.partnerInvited || c?.invitedEmail),
  },
  {
    no: 3,
    name: "Questionnaires & Disclosures",
    criteria: "Required individual and joint information completed.",
    isComplete: (c) =>
      Boolean(c?.status?.myInformation?.submitted) &&
      Boolean(c?.status?.partnerInformation?.submitted),
    isInProgress: (c) =>
      Boolean(c?.myInformation && Object.keys(c.myInformation).length > 0) ||
      Boolean(c?.status?.myInformation?.submitted),
  },
  {
    no: 4,
    name: "Partner Review & Mutual Approval",
    criteria: "Both applicants approve the same final version; snapshot locked.",
    isComplete: (c) =>
      Boolean(c?.approval?.user1Approved) &&
      Boolean(c?.approval?.user2Approved) &&
      c?.approval?.mutualApprovalAndSnapshot === "COMPLETED",
    isInProgress: (c) =>
      Boolean(c?.approval?.user1Approved) ||
      Boolean(c?.approval?.user2Approved) ||
      c?.workflowStatus === "COUPLE_SUBMITTED",
  },
  {
    no: 5,
    name: "Case Manager Assignment",
    criteria: "Case assigned to a Case Manager.",
    isComplete: (c) => Boolean(c?.assignedCaseManager?._id || c?.assignedCaseManager),
    isInProgress: (c) => c?.workflowStatus === "COUPLE_SUBMITTED" && !c?.assignedCaseManager,
  },
  {
    no: 6,
    name: "Case Manager Review & Approval",
    criteria: "Case Manager approves the case.",
    isComplete: (c) =>
      Boolean(c?.cmApproved) ||
      ["CM_APPROVED", "PRE_LAWYER_PENDING", "PRE_LAWYER_COMPLETED", "LAWYERS_ASSIGNED", "LAWYER_REVIEW"].includes(
        c?.workflowStatus
      ),
    isInProgress: (c) => Boolean(c?.assignedCaseManager) && !c?.cmApproved,
  },
  {
    no: 7,
    name: "Pre-Lawyer Questionnaire",
    criteria: "Required questionnaire completed.",
    isComplete: (c) =>
      Boolean(c?.preQuestionnaireUser1?.submitted) &&
      Boolean(c?.preQuestionnaireUser2?.submitted),
    isInProgress: (c) =>
      Boolean(c?.preQuestionnaireUser1?.submitted) ||
      Boolean(c?.preQuestionnaireUser2?.submitted) ||
      c?.workflowStatus === "PRE_LAWYER_PENDING",
  },
  {
    no: 8,
    name: "Lawyer Assignment",
    criteria: "All required lawyers assigned.",
    isComplete: (c) => Boolean(c?.assignedLawyerP1) && Boolean(c?.assignedLawyerP2),
    isInProgress: (c) =>
      c?.workflowStatus === "LAWYERS_ASSIGNED" && (!c?.assignedLawyerP1 || !c?.assignedLawyerP2),
  },
  {
    no: 9,
    name: "Legal Review",
    criteria: "Lawyer review and agreement preparation completed.",
    isComplete: (c) =>
      Boolean(c?.p1Confirmed) &&
      Boolean(c?.p2Confirmed) &&
      ["LAWYER_REVIEW_COMPLETED", "LAWYER_ILA_PENDING", "COMPLETED"].includes(c?.workflowStatus),
    isInProgress: (c) =>
      ["LAWYERS_ASSIGNED", "LAWYER_REVIEW"].includes(c?.workflowStatus) &&
      (!c?.p1Confirmed || !c?.p2Confirmed),
  },
  {
    no: 10,
    name: "Independent Legal Advice (ILA)",
    criteria: "Required ILA process completed.",
    isComplete: (c) =>
      Boolean(c?.p1ILACompleted) &&
      Boolean(c?.p2ILACompleted) &&
      ["LAWYER_SIGNOFF_COMPLETE", "COMPLETED"].includes(c?.workflowStatus),
    isInProgress: (c) => c?.workflowStatus === "LAWYER_ILA_PENDING",
  },
  {
    no: 11,
    name: "Completion & Execution",
    criteria: "Final agreement execution requirements completed.",
    isComplete: (c) => c?.workflowStatus === "COMPLETED" || Boolean(c?.executionPackGenerated),
    isInProgress: (c) => c?.workflowStatus === "LAWYER_SIGNOFF_COMPLETE",
  },
  {
    no: 12,
    name: "Ready for Archive / Archived",
    criteria: "Case is ready for archiving, then archived.",
    isComplete: (c) => c?.workflowStatus === "ARCHIVED",
    isInProgress: (c) => Boolean(c?.readyForArchive) && c?.workflowStatus !== "ARCHIVED",
  },
];

export default function TimelineTab({ caseData }: Props) {
  const caseId = caseData?._id;
  const [historyTimeline, setHistoryTimeline] = useState<any[]>([]);

  useEffect(() => {
    if (!caseId) return;
    const fetchHistory = async () => {
      try {
        const { data } = await Axios.get(`/case-manager/${caseId}/timeline`);
        const records = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
          ? data.items
          : [];
        setHistoryTimeline(records);
      } catch (err) {
        console.error("Failed to load timeline records", err);
      }
    };
    fetchHistory();
  }, [caseId]);

  return (
    <div className="space-y-8">
      {/* 12 Stages Master Progress Ledger */}
      <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <h3 className="font-bold text-sm text-slate-900 tracking-tight">
            12-Stage Workflow Progress
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step progression and completion criteria for the case.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {MILESTONES.map((m) => {
            const completed = m.isComplete(caseData);
            const inProgress = !completed && m.isInProgress(caseData);

            return (
              <div
                key={m.no}
                className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                  completed
                    ? "bg-white"
                    : inProgress
                    ? "bg-amber-50/50"
                    : "bg-slate-50/40"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold text-slate-600 bg-slate-100 border border-slate-300">
                    {m.no}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{m.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{m.criteria}</p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {completed ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Completed
                    </span>
                  ) : inProgress ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      In Progress
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                      <Circle className="w-3 h-3 text-slate-400" />
                      Pending
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audit & Event Log History */}
      {historyTimeline.length > 0 && (
        <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs">
          <h4 className="font-bold text-xs uppercase text-slate-700 tracking-wider mb-4">
            Recent Timeline Activity
          </h4>
          <div className="space-y-3">
            {historyTimeline.map((item, idx) => (
              <div
                key={item._id || idx}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs flex flex-col gap-1"
              >
                <div className="font-semibold text-slate-900">
                  {String(item.action).replace(/_/g, " ")}
                </div>
                {item.notes && <div className="text-slate-600">{item.notes}</div>}
                <div className="text-[11px] text-slate-400 mt-1">
                  {new Date(item.createdAt || item.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}