"use client";

import React from "react";
import WorkflowProgress from "./WorkflowProgress";
import LawyerDetails from "./LawyerDetails";

/**
 * A case's Overview, the same on the case manager and lawyer portals:
 * both applicants, both assigned lawyers, and the workflow progress. The case
 * manager sees both workflow phases; the lawyer sees Phase 2 only.
 */
export default function CaseOverview({
  caseData,
  portal,
  me,
}: {
  caseData: any;
  portal: "cm" | "lawyer";
  me?: any;
}) {
  const p1First = caseData?.owner?.firstName || "";
  const p1Middle = caseData?.owner?.middleName ? ` ${caseData.owner.middleName} ` : " ";
  const p1Last = caseData?.owner?.lastName || "";
  const p1 = `${p1First}${p1Middle}${p1Last}`.replace(/\s+/g, " ").trim() || "Unknown";

  const p2First = caseData?.invitedUser?.firstName || "";
  const p2Middle = caseData?.invitedUser?.middleName ? ` ${caseData.invitedUser.middleName} ` : " ";
  const p2Last = caseData?.invitedUser?.lastName || "";
  const p2FullName = `${p2First}${p2Middle}${p2Last}`.replace(/\s+/g, " ").trim();
  const p2 = p2FullName || (caseData?.invitedEmail ? caseData.invitedEmail : "Not Invited");

  return (
    <div className="flex flex-col gap-6">
      {/* Party Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Primary Applicant */}
        <div className="p-5 rounded-xl bg-white border border-slate-300 flex flex-col gap-2.5 text-xs shadow-xs">
          <div className="font-bold uppercase text-[11px] text-slate-700 border-b pb-2 flex items-center justify-between">
            <span>Primary Applicant</span>
            <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
              PARTY 1
            </span>
          </div>

          <div>
            <strong className="text-slate-500">Name:</strong>{" "}
            <span className="font-semibold text-slate-900">{p1}</span>
          </div>

          <div>
            <strong className="text-slate-500">Email:</strong>{" "}
            <span className="text-slate-800">{caseData.owner?.email || "-"}</span>
          </div>

          <div>
            <strong className="text-slate-500">Phone:</strong>{" "}
            <span className="text-slate-800">{caseData.owner?.phone || "-"}</span>
          </div>

          <div>
            <strong className="text-slate-500">Account Role:</strong>{" "}
            <span className="font-semibold text-slate-800">Primary applicant</span>
          </div>

          <div>
            <strong className="text-slate-500">Email Verified:</strong>{" "}
            <span className="font-semibold text-slate-800">
              {caseData.owner?.emailVerified ? "Yes" : "No"}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center gap-4 text-[11px]">
            <div>
              <strong className="text-slate-500">Partner Invited:</strong>{" "}
              <span className="font-semibold text-slate-800">
                {caseData.partnerInvited ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>

        {/* Secondary Applicant */}
        <div className="p-5 rounded-xl bg-white border border-slate-300 flex flex-col gap-2.5 text-xs shadow-xs">
          <div className="font-bold uppercase text-[11px] text-slate-700 border-b pb-2 flex items-center justify-between">
            <span>Secondary Applicant</span>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
              PARTY 2
            </span>
          </div>

          <div>
            <strong className="text-slate-500">Name:</strong>{" "}
            <span className="font-semibold text-slate-900">{p2}</span>
          </div>

          <div>
            <strong className="text-slate-500">Email:</strong>{" "}
            <span className="text-slate-800">
              {caseData.invitedUser?.email || caseData.invitedEmail || "-"}
            </span>
          </div>

          <div>
            <strong className="text-slate-500">Phone:</strong>{" "}
            <span className="text-slate-800">{caseData.invitedUser?.phone || "-"}</span>
          </div>

          <div>
            <strong className="text-slate-500">Account Role:</strong>{" "}
            <span className="font-semibold text-slate-800">Secondary applicant</span>
          </div>

          <div>
            <strong className="text-slate-500">Email Verified:</strong>{" "}
            <span className="font-semibold text-slate-800">
              {caseData.invitedUser?.emailVerified ? "Yes" : "No"}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center gap-4 text-[11px]">
            <div>
              <strong className="text-slate-500">Partner Joined:</strong>{" "}
              <span className="font-semibold text-slate-800">
                {caseData.invitedUser ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <LawyerDetails caseData={caseData} me={me} />

      <WorkflowProgress caseData={caseData} phases={portal === "cm" ? [1, 2] : [2]} />
    </div>
  );
}
