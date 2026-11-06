"use client";

import { useEffect, useState } from "react";
import { FileText, Loader2, RefreshCw } from "lucide-react";
import {
  fetchAllVersions,
  fetchVersionDetail,
  generateUserAgreement,
} from "@/lib/api/agreement";
import { agreementTypeLabel } from "@/lib/agreementTypes";
import type { VersionDetail, VersionEntry } from "@/types/agreement";

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="h-3.5 w-3.5"
    >
      <path d="M12 4v11" />
      <path d="M7 11l5 5 5-5" />
      <path d="M5 20h14" />
    </svg>
  );
}

/** "v1.0" to "Version 1 Finalised". Anything else is shown as it came. */
function versionLabel(version?: string | null): string {
  if (!version) return "";
  const major = /^v?(\d+)/i.exec(version.trim())?.[1];
  return major ? `Version ${major} Finalised` : version;
}

/** Which file of a version a row hands over. */
type FileKind = "pdf" | "docx";

type Row = {
  kind: FileKind;
  title: string;
  cta: string;
};

/**
 * The generated agreement, as the partners see it once both have confirmed
 * the joint information. It shows whichever version is current -- first the
 * one built from their own answers, later the case manager's and the
 * lawyers' -- and hands over that version's two files: the agreement itself
 * as a PDF, and the Word document the same version was built from, which
 * carries the couple's financial disclosure.
 */
export default function AgreementDocumentCard({
  caseId,
  agreementType,
}: {
  caseId: string | null;
  /** Names the first row, e.g. "Prenuptial Agreement (Marriage)". */
  agreementType?: string | null;
}) {
  const [versions, setVersions] = useState<VersionEntry[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(caseId));
  const [reloadKey, setReloadKey] = useState(0);
  const [detail, setDetail] = useState<VersionDetail | null>(null);
  const [downloading, setDownloading] = useState<FileKind | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  useEffect(() => {
    if (!caseId) return;

    let cancelled = false;
    void (async () => {
      const result = await fetchAllVersions(caseId);
      if (cancelled) return;
      if (result.success) {
        setVersions(result.data ?? []);
        setLoadError(null);
      } else {
        setLoadError(result.error);
      }
      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [caseId, reloadKey]);

  // Retry / refresh: the effect above owns the request, so this only asks
  // for another run.
  const reload = () => {
    setIsLoading(true);
    setLoadError(null);
    setDetail(null);
    setReloadKey((key) => key + 1);
  };

  // The list arrives newest first, so the first entry stands in whenever no
  // version is flagged as current.
  const current = versions?.find((v) => v.isLatest) ?? versions?.[0] ?? null;

  // Only offered when the list came back empty: the agreement is generated on
  // confirmation, so this is the way back from a call that never landed.
  const handleGenerate = async () => {
    if (!caseId) return;
    setIsGenerating(true);
    setGenerateError(null);
    const result = await generateUserAgreement(caseId);
    setIsGenerating(false);
    if (result.success) reload();
    else setGenerateError(result.error);
  };

  // The file URLs only come with the version's detail, so the first download
  // of either row fetches it and both rows use it from then on.
  const handleDownload = async (kind: FileKind) => {
    if (!caseId || !current) return;
    setDownloadError(null);

    let version = detail;
    if (!version || version.id !== current.id) {
      setDownloading(kind);
      const result = await fetchVersionDetail(caseId, current.id);
      setDownloading(null);
      if (!result.success) {
        setDownloadError(result.error);
        return;
      }
      version = result.data;
      setDetail(version);
    }

    const url = kind === "pdf" ? version.pdfUrl : version.fileUrl;
    if (!url) {
      setDownloadError(
        kind === "pdf"
          ? "This version has no PDF to download yet."
          : "This version has no Word file to download yet.",
      );
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const rows: Row[] = [
    {
      kind: "pdf",
      title:
        agreementTypeLabel(agreementType) ??
        current?.title ??
        "Prenuptial Agreement",
      cta: "Download PDF",
    },
    {
      kind: "docx",
      title: "Financial Disclosure Schedule",
      cta: "Download DOCX",
    },
  ];

  return (
    <section
      aria-label="Your draft agreement"
      className="w-full rounded-2xl border border-[#EDEDF5] bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-bold tracking-tight text-[#1E1B3C]">
          Your Draft Agreement
        </h3>
        {!current && !isLoading && !loadError && (
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
            Generating
          </span>
        )}
      </div>

      {isLoading && !versions ? (
        <div className="mt-4 animate-pulse space-y-2 rounded-xl border border-[#EDEDF5] p-3">
          <div className="h-4 w-40 rounded bg-[#EDEDF5]" />
          <div className="h-3 w-56 rounded bg-[#F4F4F9]" />
        </div>
      ) : loadError ? (
        <div className="mt-4 rounded-xl border border-[#FDE2E2] bg-[#FEF6F6] p-3">
          <p className="text-xs text-[#B42318]">{loadError}</p>
          <button
            type="button"
            onClick={reload}
            className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-[#6D28D9] hover:underline"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            Try again
          </button>
        </div>
      ) : current ? (
        <>
          <div className="mt-4 flex flex-col gap-3">
            {rows.map((row) => (
              <div
                key={row.kind}
                className="flex items-center justify-between gap-3 rounded-xl bg-[#F8F7FF] p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#EDE9FE] text-[#5B3FD9]"
                  >
                    <FileText className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-[#1E1B3C]">
                      {row.title}
                    </div>
                    <div className="truncate text-xs text-[#8A8AA0]">
                      {versionLabel(current.version)}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => void handleDownload(row.kind)}
                  disabled={downloading !== null}
                  className="flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-[#5B3FD9] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#4C33B8] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {downloading === row.kind ? (
                    <Loader2
                      className="h-3.5 w-3.5 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <DownloadIcon />
                  )}
                  {row.cta}
                </button>
              </div>
            ))}
          </div>

          {downloadError && (
            <p className="mt-2 text-xs text-[#B42318]">{downloadError}</p>
          )}

          {versions && versions.length > 1 && (
            <p className="mt-3 text-xs text-[#8A8AA0]">
              {versions.length} versions on file — this is the most recent.
            </p>
          )}
        </>
      ) : (
        <div className="mt-4 rounded-xl border border-[#EDEDF5] p-3">
          <p className="text-sm text-gray-500">
            Your agreement is being prepared. It will appear here shortly.
          </p>
          <div className="mt-3 flex items-center gap-4">
            <button
              type="button"
              onClick={reload}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#6D28D9] hover:underline"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => void handleGenerate()}
              disabled={isGenerating}
              className="flex items-center gap-1.5 rounded-lg border border-[#DDD6FE] px-3 py-1.5 text-xs font-semibold text-[#6D28D9] hover:bg-[#FAF9FF] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGenerating && (
                <Loader2
                  className="h-3.5 w-3.5 animate-spin"
                  aria-hidden="true"
                />
              )}
              Generate now
            </button>
          </div>
          {generateError && (
            <p className="mt-2 text-xs text-[#B42318]">{generateError}</p>
          )}
        </div>
      )}
    </section>
  );
}
