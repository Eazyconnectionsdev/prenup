"use client";

import { formatVersionDate } from "@/lib/utils";
import type { CaseDetails, VersionEntry } from "@/types/types-agreement";

interface SummaryStripProps {
  caseDetails: CaseDetails | null;
  currentVersion: VersionEntry | undefined;
  error: string | null;
}

export function SummaryStrip({ caseDetails, currentVersion, error }: SummaryStripProps) {
  const cells = [
    {
      label: "Case ID",
      value: (
        <span className="font-semibold">
          {typeof caseDetails?._id === "string" ? caseDetails._id.slice(-12) : "—"}
        </span>
      ),
    },
    {
      label: "Parties",
      value: (
        <span className="font-semibold">
          {caseDetails?.owner?.firstName} {caseDetails?.owner?.lastName} (P1)
          &nbsp;&amp;&nbsp;{caseDetails?.invitedUser?.firstName}{" "}
          {caseDetails?.invitedUser?.lastName} (P2)
        </span>
      ),
    },
    {
      label: "Current Status",
      value: (
        <span className="inline-block rounded-md bg-accent px-2 py-1 text-[11px] font-semibold tracking-wide text-accent-foreground">
          LAWYER REVIEW
        </span>
      ),
    },
    {
      label: "Current Version",
      value: <span className="font-semibold">{currentVersion?.version ?? "—"}</span>,
    },
    {
      label: "Latest Agreed Version",
      value: (
        <span className="inline-block rounded-md bg-[color-mix(in_oklab,var(--chart-2)_15%,white)] px-2 py-1 text-[11px] font-semibold text-[var(--chart-2)]">
          {currentVersion?.version ?? "—"} (Clean Master)
        </span>
      ),
    },
    {
      label: "Last Updated",
      value: (
        <span className="font-semibold">
          {currentVersion?.date ? formatVersionDate(currentVersion.date) : "N/A"}
        </span>
      ),
    },
  ];

  return (
    <section className="mt-5 rounded-xl border border-border bg-card">
      <div className="grid grid-cols-2 gap-y-5 px-6 py-4 md:grid-cols-3 xl:grid-cols-6 xl:divide-x xl:divide-border">
        {cells.map((cell, i) => (
          <div key={cell.label} className={i === 0 ? "xl:pr-6" : "xl:px-6"}>
            <div className="text-[11px] text-muted-foreground">{cell.label}</div>
            <div className="mt-1.5 text-[13px]">{cell.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}