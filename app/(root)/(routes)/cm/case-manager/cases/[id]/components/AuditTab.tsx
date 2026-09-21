"use client";

interface Props {
  caseData: any;
}

export default function AuditTab({
  caseData,
}: Props) {
  const events = [
    {
      label: "Case Created",
      date: caseData.createdAt,
    },
    {
      label: "Case Updated",
      date: caseData.updatedAt,
    },
    {
      label: "Workflow Status",
      date: caseData.workflowStatus,
    },
  ];

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.label}
          className="border rounded-xl p-4"
        >
          <div className="font-semibold">
            {event.label}
          </div>

          <div className="text-sm text-slate-500">
            {event.date}
          </div>
        </div>
      ))}
    </div>
  );
}