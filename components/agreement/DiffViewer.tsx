"use client";

import type { DiffParagraph, DiffWordPart } from "@/types/types-agreement";

interface DiffViewerProps {
  diff: DiffParagraph[];
  leftLabel?: string;
  rightLabel?: string;
}

function renderWords(words: DiffWordPart[], side: "left" | "right") {
  return words
    .filter((w) => (side === "left" ? !w.added : !w.removed))
    .map((w, i) => {
      const highlight = side === "left" ? w.removed : w.added;
      return (
        <span
          key={i}
          className={
            highlight
              ? side === "left"
                ? "rounded-sm bg-red-200/70"
                : "rounded-sm bg-green-200/70"
              : undefined
          }
        >
          {w.value}
        </span>
      );
    });
}

interface DiffRow {
  key: string;
  leftLineNo: number | null;
  rightLineNo: number | null;
  leftSign: "-" | null;
  rightSign: "+" | null;
  leftBg: string;
  rightBg: string;
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
}

function buildRows(diff: DiffParagraph[]): DiffRow[] {
  let leftNo = 0;
  let rightNo = 0;
  const rows: DiffRow[] = [];

  diff.forEach((para, idx) => {
    if (para.status === "unchanged") {
      leftNo += 1;
      rightNo += 1;
      rows.push({
        key: `u-${idx}`,
        leftLineNo: leftNo,
        rightLineNo: rightNo,
        leftSign: null,
        rightSign: null,
        leftBg: "",
        rightBg: "",
        leftContent: para.original,
        rightContent: para.updated ?? para.original,
      });
      return;
    }

    if (para.status === "removed") {
      leftNo += 1;
      rows.push({
        key: `d-${idx}`,
        leftLineNo: leftNo,
        rightLineNo: null,
        leftSign: "-",
        rightSign: null,
        leftBg: "bg-red-50",
        rightBg: "bg-muted/20",
        leftContent: para.original,
        rightContent: null,
      });
      return;
    }

    if (para.status === "added") {
      rightNo += 1;
      rows.push({
        key: `a-${idx}`,
        leftLineNo: null,
        rightLineNo: rightNo,
        leftSign: null,
        rightSign: "+",
        leftBg: "bg-muted/20",
        rightBg: "bg-green-50",
        leftContent: null,
        rightContent: para.updated,
      });
      return;
    }

    leftNo += 1;
    rightNo += 1;
    rows.push({
      key: `m-${idx}`,
      leftLineNo: leftNo,
      rightLineNo: rightNo,
      leftSign: "-",
      rightSign: "+",
      leftBg: "bg-red-50",
      rightBg: "bg-green-50",
      leftContent: renderWords(para.words ?? [], "left"),
      rightContent: renderWords(para.words ?? [], "right"),
    });
  });

  return rows;
}

export function DiffViewer({ diff, leftLabel = "Older Version", rightLabel = "Newer Version" }: DiffViewerProps) {
  if (diff.length === 0) {
    return (
      <p className="p-4 text-[12.5px] text-muted-foreground">
        No differences found between these versions.
      </p>
    );
  }

  const rows = buildRows(diff);

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="grid grid-cols-2 divide-x divide-border border-b border-border bg-muted/40">
        <div className="px-4 py-2 text-[12px] font-semibold text-muted-foreground">{leftLabel}</div>
        <div className="px-4 py-2 text-[12px] font-semibold text-muted-foreground">{rightLabel}</div>
      </div>

      <div className="max-h-[60vh] overflow-auto">
        <div className="grid min-w-[720px] grid-cols-[44px_18px_1fr_44px_18px_1fr] font-mono text-[12.5px] leading-6">
          {rows.map((row) => (
            <div key={row.key} className="contents">
              <div className={`select-none border-r border-border px-2 text-right text-muted-foreground/50 ${row.leftBg}`}>
                {row.leftLineNo ?? ""}
              </div>
              <div className={`select-none text-center font-semibold ${row.leftBg} ${row.leftSign ? "text-red-600" : "text-transparent"}`}>
                {row.leftSign ?? "."}
              </div>
              <div className={`border-r border-border px-2 whitespace-pre-wrap ${row.leftBg}`}>
                {row.leftContent}
              </div>

              <div className={`select-none border-r border-border px-2 text-right text-muted-foreground/50 ${row.rightBg}`}>
                {row.rightLineNo ?? ""}
              </div>
              <div className={`select-none text-center font-semibold ${row.rightBg} ${row.rightSign ? "text-green-600" : "text-transparent"}`}>
                {row.rightSign ?? "."}
              </div>
              <div className={`px-2 whitespace-pre-wrap ${row.rightBg}`}>
                {row.rightContent}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}