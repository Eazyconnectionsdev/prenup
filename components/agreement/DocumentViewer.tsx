"use client";

import { Minus, Plus, Maximize2, Copy } from "lucide-react";
import PdfPreview from "./PdfPreview";
import { formatVersionDate } from "@/lib/utils";
import type { VersionDetail } from "@/types/types-agreement";

interface DocumentViewerProps {
  versionDetail: VersionDetail | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  showingPdf: boolean;
  zoomLevel: number;
  currentPage: number;
  totalPages: number | null;
  viewerRef: React.RefObject<HTMLDivElement | null>;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleFullscreen: () => void;
  downloadError: string | null;
  onPageInfoChange: (info: { current: number; total: number | null }) => void;
}

export function DocumentViewer({
  versionDetail,
  isLoading,
  error,
  onRetry,
  showingPdf,
  zoomLevel,
  currentPage,
  totalPages,
  viewerRef,
  onZoomIn,
  onZoomOut,
  onToggleFullscreen,
  downloadError,
  onPageInfoChange,
}: DocumentViewerProps) {
  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-center gap-3 px-5 py-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-[14px] font-semibold">
            Version {versionDetail?.version ?? "—"}
          </span>
          {versionDetail?.isLatestAgreed && (
            <span className="text-[14px] font-semibold text-primary">Latest Agreed Version</span>
          )}
          {versionDetail?.statusLabel && (
            <span className="rounded-md bg-[color-mix(in_oklab,var(--chart-2)_15%,white)] px-2 py-0.5 text-[11px] font-semibold text-[var(--chart-2)]">
              {versionDetail.statusLabel}
            </span>
          )}
        </div>
      </div>

      <div className="-mt-2 px-5 pb-3 text-[11.5px] text-muted-foreground">
        {versionDetail
          ? `Uploaded by ${versionDetail.uploadedByName} (${versionDetail.uploadedByRole}) on ${formatVersionDate(versionDetail.uploadedAt)}`
          : "Select a version to preview it here."}
      </div>


      <div className="flex items-center gap-3 border-y border-border px-5 py-2.5">
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <span className="rounded-md border border-border px-2.5 py-1 text-foreground">
            {currentPage}
          </span>
          <span>/ {totalPages ?? "—"}</span>
        </div>

        <div className="mx-auto flex items-center gap-4 text-muted-foreground">
          <button onClick={onZoomOut} aria-label="Zoom out">
            <Minus className="h-4 w-4" />
          </button>
          <span className="text-[12px] text-foreground">
            {Math.round(zoomLevel * 100) - 20}%
          </span>
          <button onClick={onZoomIn} aria-label="Zoom in">
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <button onClick={onToggleFullscreen} aria-label="Toggle fullscreen">
          <Maximize2 className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      <div
        ref={viewerRef}
        className="h-[500px] overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {isLoading ? (
          <p className="py-16 text-center text-[13px] text-muted-foreground">Loading preview…</p>
        ) : showingPdf ? (
          <PdfPreview
            fileUrl={versionDetail!.pdfUrl!}
            zoomLevel={zoomLevel}
            onPageInfoChange={onPageInfoChange}
          />
        ) : (
          <p className="py-16 text-center text-[13px] text-muted-foreground">
            No document to preview yet.
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-border px-5 py-3 text-[11.5px] text-muted-foreground">
        <span>
          File: <span className="text-foreground">{versionDetail?.fileName ?? "—"}</span>
        </span>
        <span>
          Size: <span className="text-foreground">{versionDetail?.fileSizeLabel ?? "—"}</span>
        </span>
        <span>
          Pages: <span className="text-foreground">{totalPages ?? "—"}</span>
        </span>
        <span className="ml-auto flex items-center gap-2">
          Document Hash:{" "}
          <span className="text-foreground">{versionDetail?.checksum?.slice(0, 12) ?? "—"}</span>
          <Copy className="h-3.5 w-3.5 cursor-pointer" />
        </span>
      </div>
    </section>
  );
}