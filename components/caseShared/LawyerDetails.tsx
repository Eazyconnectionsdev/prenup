"use client";

import React from "react";
import { Scale } from "lucide-react";
import { caseLawyers } from "@/lib/caseStages";

/** The two acting lawyers (one per applicant), shown on CM and lawyer case pages. */

const fullName = (o: any) =>
  o && typeof o === "object"
    ? [o.firstName, o.middleName, o.lastName].filter(Boolean).join(" ").trim() || o.name || ""
    : "";

const idOf = (v: any) => (v && typeof v === "object" ? String(v._id ?? "") : v ? String(v) : "");

/** Is this populated lawyer profile the signed-in user? */
export function isMe(lawyer: any, me: any): boolean {
  if (!lawyer || typeof lawyer !== "object" || !me) return false;
  const uid = String(me._id || me.id || "");
  return Boolean(
    (uid && (idOf(lawyer.user) === uid || idOf(lawyer.userId) === uid)) ||
      (me.lawyerProfile && idOf(me.lawyerProfile) === idOf(lawyer))
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <strong className="text-slate-500">{label}:</strong>{" "}
      <span className="text-slate-800">{value || "—"}</span>
    </div>
  );
}

function LawyerCard({
  title,
  client,
  lawyer,
  selected,
  you,
}: {
  title: string;
  client: string;
  lawyer: any;
  selected: boolean;
  you: boolean;
}) {
  const assigned = lawyer && typeof lawyer === "object";
  return (
    <div
      className={`p-5 rounded-xl bg-white border flex flex-col gap-2 text-xs shadow-xs ${
        you ? "border-emerald-300 ring-1 ring-emerald-100" : "border-slate-300"
      }`}
    >
      <div className="font-bold uppercase text-[11px] text-slate-700 border-b pb-2 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5">
          <Scale className="w-3.5 h-3.5 text-slate-500" /> {title}
        </span>
        {you && (
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            YOU
          </span>
        )}
      </div>
      <div className="text-[11px] text-slate-500">Acting for {client}</div>
      {assigned ? (
        <>
          <div>
            <strong className="text-slate-500">Name:</strong>{" "}
            <span className="font-semibold text-slate-900">{fullName(lawyer) || "—"}</span>
          </div>
          <Field label="Job Title" value={lawyer.jobTitle} />
          <Field label="Firm" value={lawyer.company?.name} />
          <Field
            label="Email"
            value={lawyer.workEmail || lawyer.directEmail || lawyer.publicEmail}
          />
          <Field
            label="Phone"
            value={lawyer.workPhone || lawyer.directPhone || lawyer.mobilePhone || lawyer.publicPhone}
          />
          <Field
            label="Registration"
            value={
              [lawyer.regulatoryBody, lawyer.registrationNumber || lawyer.barNumber]
                .filter(Boolean)
                .join(" · ") || null
            }
          />
        </>
      ) : (
        <div className="text-slate-500 italic">
          {selected ? "Lawyer selected by the applicant; not assigned yet." : "No lawyer assigned yet."}
        </div>
      )}
    </div>
  );
}

export default function LawyerDetails({ caseData, me }: { caseData: any; me?: any }) {
  const p1 = fullName(caseData?.owner) || "Partner 1";
  const p2 = fullName(caseData?.invitedUser) || caseData?.invitedEmail || "Partner 2";
  // The solicitor each partner chose (older cases: the one a CM assigned).
  const lawyers = caseLawyers(caseData);
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Assigned Lawyers</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LawyerCard
          title="Partner 1's Lawyer"
          client={p1}
          lawyer={lawyers.p1}
          selected={Boolean(caseData?.preQuestionnaireUser1?.selectedLawyer)}
          you={isMe(lawyers.p1, me)}
        />
        <LawyerCard
          title="Partner 2's Lawyer"
          client={p2}
          lawyer={lawyers.p2}
          selected={Boolean(caseData?.preQuestionnaireUser2?.selectedLawyer)}
          you={isMe(lawyers.p2, me)}
        />
      </div>
    </div>
  );
}
