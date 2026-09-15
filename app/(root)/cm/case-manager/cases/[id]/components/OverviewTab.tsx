"use client";

interface Props {
  caseData: any;
}

export default function OverviewTab({
  caseData,
}: Props) {
  const p1 = caseData?.owner
    ? `${caseData.owner.firstName || ""} ${caseData.owner.lastName || ""}`.trim()
    : "Unknown";

  const p2 = caseData?.invitedUser
    ? `${caseData.invitedUser.firstName || ""} ${caseData.invitedUser.lastName || ""}`.trim()
    : "Not Invited";

  const assignedCm = caseData?.assignedCaseManager
    ? `${caseData.assignedCaseManager.firstName || ""} ${caseData.assignedCaseManager.lastName || ""}`.trim()
    : "Unassigned";

  return (
    <div className="flex flex-col gap-6">

      {/* Top Summary Cards */}

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-300 flex flex-col gap-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">
            CASE ID & SERVICE
          </span>

          <span className="font-mono text-xs font-bold text-slate-900">
            {caseData._id}
          </span>

          <span className="text-xs text-slate-600 font-semibold">
            Prenuptial Agreement
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-300 flex flex-col gap-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">
            STATUS & OWNER ROLE
          </span>

          <span className="text-xs font-bold text-slate-900">
            {caseData.workflowStatus}
          </span>

          <span className="text-xs text-slate-600 font-semibold">
            Owner: {caseData.owner?.role}
          </span>

          <span className="text-xs text-slate-600 font-semibold">
            Case Manager: {assignedCm}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-300 flex flex-col gap-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">
            HEALTH & PRIORITY
          </span>

          <span className="text-xs font-bold text-emerald-700">
            HEALTH: GOOD
          </span>

          <span className="text-xs font-bold text-rose-700">
            PRIORITY: {caseData.priority}
          </span>
        </div>
      </div>

      {/* Party Information */}

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-300 flex flex-col gap-2 text-xs shadow-xs">
          <div className="font-bold uppercase text-[10px] text-slate-500 border-b pb-1">
            Party 1 Details
          </div>

          <div>
            <strong>Name:</strong> {p1}
          </div>

          <div>
            <strong>Email:</strong>{" "}
            {caseData.owner?.email}
          </div>

          <div>
            <strong>Phone:</strong>{" "}
            {caseData.owner?.phone || "-"}
          </div>

          <div>
            <strong>Account Role:</strong>{" "}
            {caseData.owner?.role}
          </div>

          <div>
            <strong>Email Verified:</strong>{" "}
            {caseData.owner?.emailVerified
              ? "Yes"
              : "No"}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-300 flex flex-col gap-2 text-xs shadow-xs">
          <div className="font-bold uppercase text-[10px] text-slate-500 border-b pb-1">
            Party 2 Details
          </div>

          <div>
            <strong>Name:</strong> {p2}
          </div>

          <div>
            <strong>Email:</strong>{" "}
            {caseData.invitedUser?.email ||
              caseData.invitedEmail ||
              "-"}
          </div>

          <div>
            <strong>Phone:</strong>{" "}
            {caseData.invitedUser?.phone || "-"}
          </div>

          <div>
            <strong>Account Role:</strong>{" "}
            {caseData.invitedUser?.role ||
              "-"}
          </div>

          <div>
            <strong>Partner Invited:</strong>{" "}
            {caseData.partnerInvited
              ? "Yes"
              : "No"}
          </div>
        </div>
      </div>

      {/* Case Workflow */}

      <div className="bg-white border border-slate-300 rounded-xl p-5">
        <h4 className="font-bold text-xs uppercase mb-4">
          Workflow Progress
        </h4>

        <div className="grid grid-cols-3 gap-4 text-xs">

          <StatusItem
            title="Payment Completed"
            value={caseData.paymentCompleted}
          />

          <StatusItem
            title="CM Approved"
            value={caseData.cmApproved}
          />

          <StatusItem
            title="Partner Invited"
            value={caseData.partnerInvited}
          />

          <StatusItem
            title="P1 Confirmed"
            value={caseData.p1Confirmed}
          />

          <StatusItem
            title="P2 Confirmed"
            value={caseData.p2Confirmed}
          />

          <StatusItem
            title="Execution Pack"
            value={caseData.executionPackGenerated}
          />
        </div>
      </div>
    </div>
  );
}

function StatusItem({
  title,
  value,
}: {
  title: string;
  value: boolean;
}) {
  return (
    <div className="border rounded-lg p-3 bg-slate-50">
      <div className="text-slate-500 text-[10px] uppercase font-bold">
        {title}
      </div>

      <div
        className={`mt-1 font-bold ${
          value
            ? "text-emerald-700"
            : "text-amber-700"
        }`}
      >
        {value ? "Completed" : "Pending"}
      </div>
    </div>
  );
}