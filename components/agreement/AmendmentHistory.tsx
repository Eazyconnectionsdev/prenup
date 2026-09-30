"use client";

import { ChevronDown } from "lucide-react";
import { formatVersionDate } from "@/lib/utils";
import type { VersionEntry } from "@/types/types-agreement";

interface AmendmentHistoryProps {
  versions: VersionEntry[];
}

export function AmendmentHistory({ versions }: AmendmentHistoryProps) {
  return (
    <section className="rounded-xl border border-border bg-card px-5 py-4">
      <h2 className="text-[15px] font-semibold">Amendment Summary (Version History)</h2>

      <div className="mt-4">
        {versions.map((ver, i) => {
          const isLast = i === versions.length - 1;
          return (
            <div key={ver.id} className="relative flex gap-3 pb-5 last:pb-0">
              {!isLast && (
                <span className="absolute left-[6px] top-5 bottom-0 w-px bg-border" aria-hidden />
              )}
              <div className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                {ver.isLatest ? (
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-primary bg-card">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  </span>
                ) : (
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <span className="inline-block rounded-md bg-accent px-1.5 py-0.5 text-[11px] font-bold text-accent-foreground">
                  {ver.version}
                </span>
                <div className="mt-1.5 text-[12px] text-muted-foreground">
                  By {ver.by} on {formatVersionDate(ver.date)}
                </div>
                <p className="mt-1.5 text-[13px] font-medium text-foreground">
                  {ver.amendmentSummary?.length
                    ? ver.amendmentSummary.join(" ")
                    : "No summary provided for this version."}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex justify-center">
        <button className="inline-flex items-center gap-2 rounded-lg border border-primary/40 px-4 py-2 text-[13px] font-semibold text-primary hover:bg-accent">
          View Full History <ChevronDown className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}