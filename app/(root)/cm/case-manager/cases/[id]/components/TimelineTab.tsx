"use client";

interface Props {
  caseData: any;
}

export default function TimelineTab({
  caseData,
}: Props) {
  const items = [
    {
      title: "Case Created",
      date: caseData.createdAt,
    },
    {
      title: "Joint Information Submitted",
      date:
        caseData.status?.jointInformation
          ?.submittedAt,
    },
    {
      title: "My Information Submitted",
      date:
        caseData.status?.myInformation
          ?.submittedAt,
    },
    {
      title: "ILA Submitted",
      date:
        caseData.status
          ?.independentLegalAdvice
          ?.submittedAt,
    },
    {
      title: "Last Updated",
      date: caseData.updatedAt,
    },
  ];

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.title}
          className="border rounded-xl p-4"
        >
          <div className="font-semibold">
            {item.title}
          </div>

          <div className="text-sm text-slate-500">
            {item.date
              ? new Date(
                  item.date
                ).toLocaleString()
              : "-"}
          </div>
        </div>
      ))}
    </div>
  );
}