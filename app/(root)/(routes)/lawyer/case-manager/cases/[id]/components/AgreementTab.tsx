"use client";

export default function AgreementTab() {
  const agreements = [
    {
      version: "v1.0",
      type: "Initial Draft",
    },
    {
      version: "v1.1",
      type: "Revision",
    },
    {
      version: "v2.0",
      type: "Current Draft",
    },
  ];

  return (
    <div className="space-y-4">
      {agreements.map((item) => (
        <div
          key={item.version}
          className="border rounded-xl p-4 flex justify-between"
        >
          <div>
            <div className="font-semibold">
              {item.version}
            </div>

            <div className="text-sm text-slate-500">
              {item.type}
            </div>
          </div>

          <button className="px-4 py-2 rounded-lg bg-slate-900 text-white">
            Download
          </button>
        </div>
      ))}
    </div>
  );
}