"use client";

import { SlidersHorizontal } from "lucide-react";
import { formatVersionDate } from "@/lib/utils";
import type { VersionEntry } from "@/types/types-agreement";

interface VersionListProps {
  versions: VersionEntry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  error: string | null;
  onRetry: () => void;
  compareMode: boolean;
  selectedForCompare: string[];
  onToggleCompareSelect: (id: string) => void;
  onCompareClick: () => void;
  isComparing: boolean;
}

export function VersionList({
  versions,
  selectedId,
  onSelect,
  error,
  onRetry,
  compareMode,
  selectedForCompare,
  onToggleCompareSelect,
  onCompareClick,
  isComparing,
}: VersionListProps) {
  return (
    <section className="flex flex-col rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="text-[15px] font-semibold">All Versions</h2>
        <div className="flex items-center gap-2">
          {compareMode && (
            <button
              onClick={onCompareClick}
              disabled={selectedForCompare.length !== 2 || isComparing}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[12px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isComparing ? "Comparing..." : "Compare"}
            </button>
          )}

          {!compareMode && (
            <button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-[12px] font-medium text-muted-foreground hover:bg-secondary">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filter
            </button>
          )}
        </div>
      </div>

      {!error && versions.length === 0 && (
        <p className="px-5 pb-4 text-[12.5px] text-muted-foreground">
          No versions yet.
        </p>
      )}

      <ol className="relative flex-1 space-y-2.5 px-5 pb-4">
        <span
          className="absolute left-[26px] top-2 bottom-4 w-px bg-border"
          aria-hidden
        />
        {versions.map((ver) => {
          const isChecked = selectedForCompare.includes(ver.id);
          const checkboxDisabled =
            !isChecked && selectedForCompare.length === 2;
          const isActive = compareMode ? isChecked : ver.id === selectedId;

          return (
            <li key={ver.id} className="relative pl-7">
              {ver.isLatest ? (
                <span className="absolute left-[-1px] top-4 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-primary bg-card">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
              ) : (
                <span className="absolute left-[2px] top-[18px] h-2 w-2 rounded-full bg-muted-foreground/40" />
              )}

              <div
                className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 transition-colors ${
                  isActive
                    ? "border-primary/50 bg-accent/60"
                    : "border-transparent hover:bg-secondary"
                }`}
              >
                {compareMode && (
                  <input
                    type="checkbox"
                    checked={isChecked}
                    disabled={checkboxDisabled}
                    onChange={() => onToggleCompareSelect(ver.id)}
                    className="h-4 w-4 shrink-0 rounded border-border accent-primary disabled:opacity-40"
                  />
                )}

                <button
                  onClick={() =>
                    compareMode
                      ? onToggleCompareSelect(ver.id)
                      : onSelect(ver.id)
                  }
                  className="flex-1 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-accent px-1.5 py-0.5 text-[11px] font-bold text-accent-foreground">
                      {ver.version}
                    </span>
                    <span className="text-[13px] font-semibold text-primary">
                      {ver.roleTag ?? `Version ${ver.version}`}
                    </span>
                    {ver.roleTag && (
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[9px] font-bold text-secondary-foreground">
                        {ver.roleTag}
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 text-[11.5px] text-muted-foreground">
                    By: {ver.by}
                  </div>
                  <div className="text-[11.5px] text-muted-foreground">
                    {formatVersionDate(ver.date)}
                  </div>
                </button>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="flex items-center justify-between border-t border-border px-5 py-4">
        <span className="text-[13px] text-muted-foreground">
          Show archived versions
        </span>
        <span className="relative h-5 w-9 rounded-full bg-border">
          <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-card shadow" />
        </span>
      </div>
    </section>
  );
}
