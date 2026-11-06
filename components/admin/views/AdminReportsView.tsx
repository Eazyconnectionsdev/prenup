"use client";

import React, { useState } from "react";
import { BarChart3, PoundSterling, ShieldCheck } from "lucide-react";
import { CaseReports } from "@/components/admin/reports/CaseReports";
import { FinanceReports } from "@/components/admin/reports/FinanceReports";
import { SecurityReports } from "@/components/admin/reports/SecurityReports";
import { useReportOptions } from "@/components/admin/reports/ReportKit";

const SECTIONS = [
  { key: "reports", label: "Reports", icon: BarChart3, hint: "Case volumes, workload, conversion, processing time and overdue cases" },
  { key: "finance", label: "Finance", icon: PoundSterling, hint: "Revenue, payments, failures, refunds and transactions (GBP)" },
  { key: "security", label: "Security & Compliance", icon: ShieldCheck, hint: "Logins, access, audit trail, assignments, GDPR requests" },
] as const;

type SectionKey = (typeof SECTIONS)[number]["key"];

/**
 * Admin Reports: three sections of live reports from the backend
 * (/admin/reports/...), each with its own filters and CSV export.
 */
export const AdminReportsView: React.FC = () => {
  const [section, setSection] = useState<SectionKey>("reports");
  const options = useReportOptions();
  const current = SECTIONS.find((s) => s.key === section)!;

  return (
    <div className="space-y-6 max-w-[1340px]">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold font-serif text-slate-900 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-violet-600" />
          Reports
        </h1>
        <p className="text-xs text-slate-500 mt-1">{current.hint}. Dates are UK time.</p>
      </div>

      <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl w-fit" role="tablist">
        {SECTIONS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            role="tab"
            aria-selected={section === key}
            onClick={() => setSection(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              section === key ? "bg-white text-violet-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {section === "reports" && <CaseReports options={options} />}
      {section === "finance" && <FinanceReports />}
      {section === "security" && <SecurityReports options={options} />}
    </div>
  );
};
