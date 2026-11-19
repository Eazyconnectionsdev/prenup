"use client";

import React from "react";
import { caseLawyers, isCasePaid } from "@/lib/caseStages";

/**
 * Workflow progress in two parts:
 *   Phase 1 – Applicant Submission & Case Manager Approval (until the CM approves)
 *   Phase 2 – Pre-Lawyer Questionnaire, Lawyer Assignment & Legal Process
 * The case manager sees both; the lawyer sees Phase 2 only.
 */

type Tone = "done" | "progress" | "pending" | "failed" | "none";

interface Cell {
  text: string;
  tone: Tone;
}

interface Row {
  no: number;
  stage: string;
  p1: Cell;
  p2: Cell;
  overall: Cell;
}

const none: Cell = { text: "—", tone: "none" };
const done = (text = "Completed"): Cell => ({ text, tone: "done" });
const progress = (text = "In Progress"): Cell => ({ text, tone: "progress" });
const pending = (text = "Pending"): Cell => ({ text, tone: "pending" });

const AFTER_CM = [
  "CM_APPROVED",
  "PRE_LAWYER_PENDING",
  "PRE_LAWYER_COMPLETED",
  "LAWYERS_ASSIGNED",
  "LAWYER_REVIEW",
  "LAWYER_REVIEW_COMPLETED",
  "LAWYER_ILA_PENDING",
  "LAWYER_SIGNOFF_COMPLETE",
  "LAWYER_CLIENT_CONFIRMATION",
  "COMPLETED",
  "ARCHIVED",
];
const REVIEW_DONE = AFTER_CM.slice(AFTER_CM.indexOf("LAWYER_REVIEW_COMPLETED"));
const FINISHED = ["COMPLETED", "ARCHIVED"];

const overallOf = (a: boolean, b: boolean, started = a || b): Cell =>
  a && b ? done() : started ? progress() : pending();

export function phase1Rows(c: any): Row[] {
  const status = String(c?.workflowStatus || "");
  const raw = String(c?.paymentStatus || "").toUpperCase();
  const paid = isCasePaid(c);

  const invited = Boolean(c?.invitedUser || c?.partnerInvited || c?.invitedEmail);
  const joined = Boolean(c?.invitedUser);

  const p1Forms = Boolean(c?.status?.myInformation?.submitted);
  const p2Forms = Boolean(c?.status?.partnerInformation?.submitted);
  const formsStarted =
    p1Forms || p2Forms || Boolean(c?.myInformation && Object.keys(c.myInformation).length);

  const u1 = Boolean(c?.approval?.user1Approved);
  const u2 = Boolean(c?.approval?.user2Approved);
  const mutual = c?.approval?.mutualApprovalAndSnapshot === "COMPLETED" || (u1 && u2);

  const cmApproved = Boolean(c?.cmApproved) || AFTER_CM.includes(status);
  const cm: Cell = cmApproved
    ? done("Approved")
    : status === "COUPLE_SUBMITTED"
    ? progress("In Review")
    : status === "DRAFT" && c?.cmReturnReason
    ? { text: "Returned for Correction", tone: "failed" }
    : pending();

  return [
    {
      no: 1,
      stage: "Payment",
      p1: none,
      p2: none,
      overall: paid
        ? done("Successful")
        : raw === "FAILED"
        ? { text: "Failed", tone: "failed" }
        : raw === "REFUNDED" || raw === "PARTIALLY_REFUNDED"
        ? { text: raw === "REFUNDED" ? "Refunded" : "Partially Refunded", tone: "failed" }
        : pending(),
    },
    {
      no: 2,
      stage: "Partner Invitation",
      p1: invited ? done("Invitation sent") : pending(),
      p2: joined ? done("Accepted") : pending(),
      overall: joined ? done() : pending(),
    },
    {
      no: 3,
      stage: "Questionnaires & Disclosures",
      p1: p1Forms ? done() : pending(),
      p2: p2Forms ? done() : pending(),
      overall: overallOf(p1Forms, p2Forms, formsStarted),
    },
    {
      no: 4,
      stage: "Mutual Agreement",
      p1: u1 ? done("Approved") : pending(),
      p2: u2 ? done("Approved") : pending(),
      overall: mutual ? done() : pending(),
    },
    { no: 5, stage: "Case Manager Review", p1: none, p2: none, overall: cm },
  ];
}

export function phase2Rows(c: any): Row[] {
  const status = String(c?.workflowStatus || "");
  const finished = FINISHED.includes(status);

  const q1 = Boolean(c?.preQuestionnaireUser1?.submitted);
  const q2 = Boolean(c?.preQuestionnaireUser2?.submitted);

  // Each partner chooses their own solicitor; older cases had a CM assign them.
  const lawyers = caseLawyers(c);
  const a1 = Boolean(lawyers.p1);
  const a2 = Boolean(lawyers.p2);
  const sel1 = a1;
  const sel2 = a2;

  const reviewDone = Boolean(c?.lawyerReviewCompleted) || REVIEW_DONE.includes(status);
  // Each lawyer completes their own review (p1/p2LawyerApproved).
  const review = (assigned: boolean, mine: boolean): Cell =>
    reviewDone || mine ? done() : assigned ? progress() : pending();

  const ila = (p: "p1" | "p2"): Cell => {
    const ilaDone = Boolean(c?.[`${p}ILACompleted`]);
    const signed = Boolean(c?.[`${p}LawyerSigned`]);
    if ((ilaDone && signed) || finished) return done();
    if (ilaDone || signed) return progress(ilaDone ? "Sign-off pending" : "ILA pending");
    return pending();
  };
  const ila1 = ila("p1");
  const ila2 = ila("p2");

  const f1 = Boolean(c?.finalP1Confirmed) || finished;
  const f2 = Boolean(c?.finalP2Confirmed) || finished;

  return [
    {
      no: 6,
      stage: "Pre-Lawyer Questionnaire",
      p1: q1 ? done() : pending(),
      p2: q2 ? done() : pending(),
      overall: overallOf(q1, q2),
    },
    {
      no: 7,
      stage: "Lawyer Selection & Assignment",
      p1: sel1 ? done("Lawyer selected") : pending(),
      p2: sel2 ? done("Lawyer selected") : pending(),
      overall: overallOf(a1, a2, sel1 || sel2),
    },
    {
      no: 8,
      stage: "Lawyer Review",
      p1: review(a1, Boolean(c?.p1LawyerApproved)),
      p2: review(a2, Boolean(c?.p2LawyerApproved)),
      overall: reviewDone ? done() : a1 || a2 ? progress() : pending(),
    },
    {
      no: 9,
      stage: "Independent Legal Advice (ILA)",
      p1: ila1,
      p2: ila2,
      overall:
        ila1.tone === "done" && ila2.tone === "done"
          ? done()
          : ila1.tone !== "pending" || ila2.tone !== "pending" || status === "LAWYER_ILA_PENDING"
          ? progress()
          : pending(),
    },
    {
      no: 10,
      stage: "Final Confirmation & Execution",
      p1: f1 ? done() : pending(),
      p2: f2 ? done() : pending(),
      overall: finished
        ? done()
        : f1 || f2 || status === "LAWYER_CLIENT_CONFIRMATION"
        ? progress()
        : pending(),
    },
  ];
}

const TONE: Record<Tone, string> = {
  done: "bg-emerald-100 text-emerald-800",
  progress: "bg-amber-100 text-amber-800",
  pending: "bg-[#FFEDD5] text-[#C2410C]",
  failed: "bg-rose-100 text-rose-800",
  none: "text-slate-400",
};

function Badge({ cell }: { cell: Cell }) {
  if (cell.tone === "none") return <span className="text-slate-400">—</span>;
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${TONE[cell.tone]}`}>
      {cell.text}
    </span>
  );
}

function PhaseTable({
  title,
  rows,
  p1Label,
  p2Label,
  overallInMiddle = false,
}: {
  title: string;
  rows: Row[];
  p1Label: string;
  p2Label: string;
  /** Phase 1 reads Partner 1 | Overall | Partner 2, as in the spec sheet. */
  overallInMiddle?: boolean;
}) {
  const completed = rows.filter((r) => r.overall.tone === "done").length;
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3 gap-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">{title}</h3>
        <span className="text-[11px] text-slate-400 font-medium shrink-0">
          {completed} / {rows.length} completed
        </span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all"
          style={{ width: `${(completed / rows.length) * 100}%` }}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <th className="py-2 pr-3 text-left w-10">No.</th>
              <th className="py-2 pr-3 text-left">Workflow Stage</th>
              <th className="py-2 px-3 text-center">{p1Label}</th>
              {overallInMiddle && <th className="py-2 px-3 text-center">Overall Status</th>}
              <th className="py-2 px-3 text-center">{p2Label}</th>
              {!overallInMiddle && <th className="py-2 pl-3 text-center">Overall Status</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.no}>
                <td className="py-2.5 pr-3 font-mono text-slate-400">{r.no}</td>
                <td className="py-2.5 pr-3 font-semibold text-slate-800">{r.stage}</td>
                <td className="py-2.5 px-3 text-center"><Badge cell={r.p1} /></td>
                {overallInMiddle && <td className="py-2.5 px-3 text-center"><Badge cell={r.overall} /></td>}
                <td className="py-2.5 px-3 text-center"><Badge cell={r.p2} /></td>
                {!overallInMiddle && <td className="py-2.5 pl-3 text-center"><Badge cell={r.overall} /></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const firstName = (u: any, fallback: string) =>
  (u && typeof u === "object" && (u.firstName || u.email)) || fallback;

export default function WorkflowProgress({
  caseData,
  phases = [1, 2],
}: {
  caseData: any;
  phases?: (1 | 2)[];
}) {
  const p1 = firstName(caseData?.owner, "Partner 1");
  const p2 = firstName(caseData?.invitedUser, "Partner 2");
  return (
    <div className="flex flex-col gap-4">
      {phases.includes(1) && (
        <PhaseTable
          title="Phase 1 – Applicant Submission & Case Manager Approval"
          rows={phase1Rows(caseData)}
          p1Label={p1}
          p2Label={p2}
          overallInMiddle
        />
      )}
      {phases.includes(2) && (
        <PhaseTable
          title="Phase 2 – Pre-Lawyer Questionnaire, Lawyer Assignment & Legal Process"
          rows={phase2Rows(caseData)}
          p1Label={`${p1} (Partner 1)`}
          p2Label={`${p2} (Partner 2)`}
        />
      )}
    </div>
  );
}
