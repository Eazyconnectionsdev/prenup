"use client";

import { User, Mail, Phone, ShieldCheck } from "lucide-react";

interface Props {
  caseData: any;
}

export default function OverviewTab({ caseData }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <Card title="Case ID" value={caseData._id} />
        <Card title="Status" value={caseData.workflowStatus} />
        <Card
          title="Case Locked"
          value={caseData.fullyLocked ? "Yes" : "No"}
        />
        <Card
          title="Case Manager"
          value={caseData.assignedCaseManager || "Unassigned"}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <InfoPanel
          title="Owner Information"
          icon={<User className="w-4 h-4" />}
        >
          <p>
            {caseData.owner?.firstName}{" "}
            {caseData.owner?.lastName}
          </p>

          <p className="flex items-center gap-2">
            <Mail size={14} />
            {caseData.owner?.email}
          </p>

          <p className="flex items-center gap-2">
            <Phone size={14} />
            {caseData.owner?.phone}
          </p>
        </InfoPanel>

        <InfoPanel
          title="Submission Status"
          icon={<ShieldCheck className="w-4 h-4" />}
        >
          <StatusRow
            title="My Information"
            value={caseData.status?.myInformation?.submitted}
          />

          <StatusRow
            title="Joint Information"
            value={caseData.status?.jointInformation?.submitted}
          />

          <StatusRow
            title="Independent Legal Advice"
            value={
              caseData.status?.independentLegalAdvice
                ?.submitted
            }
          />
        </InfoPanel>
      </div>
    </div>
  );
}

function StatusRow({
  title,
  value,
}: {
  title: string;
  value: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span>{title}</span>

      <span
        className={`font-medium ${
          value
            ? "text-green-600"
            : "text-amber-600"
        }`}
      >
        {value ? "Submitted" : "Pending"}
      </span>
    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: any;
}) {
  return (
    <div className="border rounded-xl p-4">
      <div className="text-xs text-slate-500">
        {title}
      </div>

      <div className="font-semibold mt-1">
        {value || "-"}
      </div>
    </div>
  );
}

function InfoPanel({
  title,
  children,
  icon,
}: any) {
  return (
    <div className="border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3 font-semibold">
        {icon}
        {title}
      </div>

      <div className="space-y-2 text-sm">
        {children}
      </div>
    </div>
  );
}