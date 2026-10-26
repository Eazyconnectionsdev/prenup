"use client";

import type { Props } from "@/types/case-detail/tabs/overview-tab";

function formatAgreementType(type?: string | null): string {
  if (!type) return "Prenuptial Agreement";
  const map: Record<string, string> = {
    "prenup-marriage": "Prenup — Marriage",
    "prenup-civil": "Prenup — Civil Partnership",
    "postnup-marriage": "Postnup — Marriage",
    "postnup-civil": "Postnup — Civil Partnership",
    cohabitation: "Cohabitation Agreement",
    "help-choose": "Custom Prenuptial Agreement",
  };
  return map[type] || type.replace(/-/g, " ");
}

export default function OverviewTab({ caseData }: Props) {
  const p1First = caseData?.owner?.firstName || "";
  const p1Middle = caseData?.owner?.middleName ? ` ${caseData.owner.middleName} ` : " ";
  const p1Last = caseData?.owner?.lastName || "";
  const p1 = `${p1First}${p1Middle}${p1Last}`.replace(/\s+/g, " ").trim() || "Unknown";

  const p2First = caseData?.invitedUser?.firstName || "";
  const p2Middle = caseData?.invitedUser?.middleName ? ` ${caseData.invitedUser.middleName} ` : " ";
  const p2Last = caseData?.invitedUser?.lastName || "";
  const p2FullName = `${p2First}${p2Middle}${p2Last}`.replace(/\s+/g, " ").trim();
  const p2 = p2FullName || (caseData?.invitedEmail ? caseData.invitedEmail : "Not Invited");

  const cmName = caseData?.assignedCaseManager
    ? `${caseData.assignedCaseManager.firstName || ""} ${caseData.assignedCaseManager.lastName || ""}`.trim()
    : "";
  const cmId = caseData?.assignedCaseManager?._id
    ? ` (${caseData.assignedCaseManager._id.toString().slice(-6)})`
    : "";
  const assignedCmDisplay = cmName ? `${cmName}${cmId}` : "Unassigned";

  const isPaid =
    Boolean(caseData?.paymentCompleted) ||
    String(caseData?.paymentStatus).toUpperCase() === "COMPLETED";
  const paymentStatusText = isPaid ? "PAID" : "NOT PAID";

  const priorityRaw = String(caseData?.priority || "LOW").toUpperCase();
  const priorityColor =
    priorityRaw === "HIGH" || priorityRaw === "CRITICAL"
      ? "text-red-600 bg-red-50 border-red-200"
      : priorityRaw === "MEDIUM"
      ? "text-amber-600 bg-amber-50 border-amber-200"
      : "text-emerald-600 bg-emerald-50 border-emerald-200";

  const planSelected = formatAgreementType(caseData?.agreementType);

  return (
    <div className="flex flex-col gap-6">

      {/* Top Bar — Primary & Secondary Applicant */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-6">
          {/* Primary Applicant */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
              <span className="text-sky-700 text-[11px] font-bold">P1</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-none">
                Primary Applicant
              </span>
              <span className="text-sm font-bold text-slate-900 leading-snug mt-0.5">
                {p1}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-8 bg-slate-200" />

          {/* Secondary Applicant */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
              <span className="text-purple-700 text-[11px] font-bold">P2</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-none">
                Secondary Applicant
              </span>
              <span className="text-sm font-bold text-slate-900 leading-snug mt-0.5">
                {p2}
              </span>
            </div>
          </div>
        </div>

        {/* Payment badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border ${
            isPaid
              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
              : "bg-amber-100 text-amber-800 border-amber-200"
          }`}
        >
          {paymentStatusText}
        </span>
      </div>

      

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
            <strong className="text-slate-500">Email Verified:</strong>{" "}
            <span className="font-semibold text-slate-800">
              {caseData.owner?.emailVerified ? "Yes" : "No"}
            </span>
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
            <strong className="text-slate-500">Partner Invited:</strong>{" "}
            <span className="font-semibold text-slate-800">
              {caseData.partnerInvited ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Workflow Progress Section ── */}
      <WorkflowSection caseData={caseData} />
    </div>
  );
}

function WorkflowSection({ caseData }: { caseData: any }) {
  const isPaid =
    Boolean(caseData?.paymentCompleted) ||
    String(caseData?.paymentStatus).toUpperCase() === "COMPLETED";

  type WorkflowStatus = "Completed" | "In Progress" | "Pending" | "Not Enabled";
  interface WorkflowItem { no: string; title: string; status: WorkflowStatus; }

  const s01: WorkflowStatus = isPaid ? "Completed" : String(caseData?.paymentStatus).toUpperCase() === "INITIATED" ? "In Progress" : "Pending";
  const s02: WorkflowStatus = caseData?.invitedUser?._id || caseData?.invitedUser ? "Completed" : caseData?.partnerInvited || caseData?.invitedEmail ? "In Progress" : "Pending";
  const myDone = Boolean(caseData?.status?.myInformation?.submitted);
  const partnerDone = Boolean(caseData?.status?.partnerInformation?.submitted);
  const s03: WorkflowStatus = myDone && partnerDone ? "Completed" : myDone || partnerDone ? "In Progress" : "Pending";
  const s04: WorkflowStatus =
    caseData?.approval?.mutualApprovalAndSnapshot === "COMPLETED" || (Boolean(caseData?.approval?.user1Approved) && Boolean(caseData?.approval?.user2Approved))
      ? "Completed" : caseData?.approval?.user1Approved || caseData?.approval?.user2Approved ? "In Progress" : "Pending";
  const s05: WorkflowStatus =
    caseData?.cmApproved || ["CM_APPROVED","PRE_LAWYER_PENDING","PRE_LAWYER_COMPLETED","LAWYERS_ASSIGNED","LAWYER_REVIEW"].includes(caseData?.workflowStatus)
      ? "Completed" : caseData?.assignedCaseManager || caseData?.workflowStatus === "COUPLE_SUBMITTED" ? "In Progress" : "Pending";
  const p1Pre = Boolean(caseData?.preQuestionnaireUser1?.submitted);
  const p2Pre = Boolean(caseData?.preQuestionnaireUser2?.submitted);
  const isPreEnabled = Boolean(caseData?.cmApproved || ["CM_APPROVED","PRE_LAWYER_PENDING","PRE_LAWYER_COMPLETED","LAWYERS_ASSIGNED"].includes(caseData?.workflowStatus));
  const s06: WorkflowStatus = p1Pre && p2Pre ? "Completed" : p1Pre || p2Pre ? "In Progress" : !isPreEnabled ? "Not Enabled" : "Pending";
  const s07: WorkflowStatus = caseData?.assignedLawyerP1 && caseData?.assignedLawyerP2 ? "Completed" : caseData?.workflowStatus === "LAWYERS_ASSIGNED" ? "In Progress" : "Pending";
  const s08: WorkflowStatus = caseData?.p1Confirmed && caseData?.p2Confirmed ? "Completed" : caseData?.workflowStatus === "LAWYER_REVIEW" ? "In Progress" : "Pending";
  const s09: WorkflowStatus = caseData?.p1ILACompleted && caseData?.p2ILACompleted ? "Completed" : caseData?.workflowStatus === "LAWYER_ILA_PENDING" ? "In Progress" : "Pending";
  const s10: WorkflowStatus = caseData?.workflowStatus === "COMPLETED" || caseData?.executionPackGenerated ? "Completed" : caseData?.workflowStatus === "LAWYER_SIGNOFF_COMPLETE" ? "In Progress" : "Pending";

  const items: WorkflowItem[] = [
    { no: "01", title: "Payment", status: s01 },
    { no: "02", title: "Partner Invitation", status: s02 },
    { no: "03", title: "Questionnaires & Disclosures", status: s03 },
    { no: "04", title: "Mutual Approval", status: s04 },
    { no: "05", title: "Case Manager Review", status: s05 },
    { no: "06", title: "Pre-Lawyer Questionnaire", status: s06 },
    { no: "07", title: "Lawyer Assignment", status: s07 },
    { no: "08", title: "Lawyer Review", status: s08 },
    { no: "09", title: "Independent Legal Advice (ILA)", status: s09 },
    { no: "10", title: "Completion & Execution", status: s10 },
  ];

  const completedCount = items.filter((i) => i.status === "Completed").length;

  const getBadge = (status: WorkflowStatus) => {
    switch (status) {
      case "Completed":
        return <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">Completed</span>;
      case "In Progress":
        return <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">In Progress</span>;
      case "Not Enabled":
        return <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500">Not Enabled</span>;
      default:
        return <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-orange-100 text-orange-700">Pending</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Workflow Progress
        </h3>
        <span className="text-[11px] text-slate-400 font-medium">
          {completedCount} / {items.length} completed
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-slate-100 rounded-full mb-5 overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all"
          style={{ width: `${(completedCount / items.length) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => {
          const isCompleted = item.status === "Completed";
          const isInProgress = item.status === "In Progress";
          const isNotEnabled = item.status === "Not Enabled";
          const borderColor = isCompleted ? "border-emerald-200" : isInProgress ? "border-amber-200" : "border-slate-200";
          const bgColor = isCompleted ? "bg-emerald-50/60" : isInProgress ? "bg-amber-50/60" : "bg-slate-50/60";
          const dotColor = isCompleted ? "bg-emerald-500" : isInProgress ? "bg-amber-400" : "bg-slate-300";

          return (
            <div key={item.no} className={`flex flex-col gap-2 rounded-xl border p-3.5 ${borderColor} ${bgColor}`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400 tracking-widest">{item.no}</span>
                <span className={`w-2 h-2 rounded-full ${dotColor}`} />
              </div>
              <p className="text-[12px] font-bold text-slate-800 leading-snug">{item.title}</p>
              <div>{getBadge(item.status)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
