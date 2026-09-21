"use client";

import { GitCompareArrows, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { SummaryStrip } from "./SummaryStrip";
import { VersionList } from "./VersionList";
import { DocumentViewer } from "./DocumentViewer";
import { AmendmentHistory } from "./AmendmentHistory";
import { UploadPanel } from "./UploadPanel";
import { LockPanel } from "./LockPanel";
import { DiffViewer } from "./DiffViewer";

import {
  fetchAllVersions,
  fetchVersionDetail,
  fetchLockStatus,
  checkOutDocument,
  releaseCheckout,
  checkInDocument,
  downloadVersionFile,
  compareDocumentVersions,
  fetchCaseDetails,
} from "@/lib/api/agreement";

import type {
  CaseDetails,
  VersionEntry,
  VersionDetail,
  LockStatus,
  DiffParagraph,
} from "@/types/types-agreement";
import { Modal } from "../Modal";
import { useParams } from "next/navigation";

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;
const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export default function AgreementPage() {
  const params = useParams()
  const CASE_ID = typeof params.id === "string" ? params.id : "";
  const [caseDetails, setCaseDetails] = useState<CaseDetails | any>(null);
  const [caseError, setCaseError] = useState<string | null>(null);

  console.log("caseDetails", caseDetails)

  const [allAgreements, setAllAgreements] = useState<VersionEntry[]>([]);
  const [versionsError, setVersionsError] = useState<string | null>(null);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
    null,
  );
  const [versionDetail, setVersionDetail] = useState<VersionDetail | null>(
    null,
  );
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [versionDetailError, setVersionDetailError] = useState<string | null>(
    null,
  );

  const [zoomLevel, setZoomLevel] = useState(1.2);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

  const [lockStatus, setLockStatus] = useState<LockStatus | null>(null);
  const [lockStatusError, setLockStatusError] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkOutError, setCheckOutError] = useState<string | null>(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [checkInError, setCheckInError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [amendmentSummaryText, setAmendmentSummaryText] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // --- Compare ---
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [diff, setDiff] = useState<DiffParagraph[] | null>(null);
  const [compareError, setCompareError] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const compareResultRef = useRef<HTMLDivElement>(null);

  const currentVersion = allAgreements.find((v) => v.isLatest);
  const showingPdf = !!versionDetail?.pdfUrl;

  const loadAllVersions = useCallback(async () => {
    const result = await fetchAllVersions(CASE_ID);
    if (result.success) {
      setAllAgreements(result.data);
      setVersionsError(null);
    } else {
      setVersionsError(result.error);
    }
  }, []);

  useEffect(() => {
    if (diff || compareError) {
      compareResultRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [diff, compareError]);

  const loadVersionDetail = useCallback(async (versionId: string) => {
    setIsDetailLoading(true);
    setCurrentPage(1);
    setTotalPages(null);
    setVersionDetailError(null);

    const result = await fetchVersionDetail(CASE_ID, versionId);
    if (result.success) {
      setVersionDetail(result.data);
    } else {
      setVersionDetail(null);
      setVersionDetailError(result.error);
    }
    setIsDetailLoading(false);
  }, []);

  const refreshLockStatus = useCallback(async () => {
    const result = await fetchLockStatus(CASE_ID);
    if (result.success) {
      setLockStatus(result.data);
      setLockStatusError(null);
    } else {
      setLockStatusError(result.error);
    }
  }, []);

  const handleCheckOut = async () => {
    setIsCheckingOut(true);
    setCheckOutError(null);

    const checkOutResult = await checkOutDocument(CASE_ID);

    if (checkOutResult.success) {
      await refreshLockStatus();

      const { url, fileName } = checkOutResult.data;
      const downloadResult = await downloadVersionFile(url, fileName);
      if (!downloadResult.success) {
        setDownloadError(downloadResult.error);
      }
    } else {
      setCheckOutError(checkOutResult.error);
    }

    setIsCheckingOut(false);
  };

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    setCheckInError(null);

    const result = await releaseCheckout(CASE_ID);
    if (result.success) {
      await refreshLockStatus();
    } else {
      setCheckInError(result.error);
    }
    setIsCheckingIn(false);
  };


  const getCaseDetail = async () => {
    const result = await fetchCaseDetails(CASE_ID);
    if(result.success){
      setCaseDetails(result.data)
    }
  };

  const handleFileSelect = (file: File) => {
    setFileError(null);
    const isDocx =
      file.type === DOCX_MIME || file.name.toLowerCase().endsWith(".docx");
    if (!isDocx) {
      setFileError("Only .docx files are supported.");
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileError("File exceeds the 50 MB size limit.");
      return;
    }
    setSelectedFile(file);
  };

  const handleUploadAndCreate = async () => {
    if (!selectedFile) return;

    const lines = amendmentSummaryText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    if (!lines.length) {
      setFileError("Amendment summary is required.");
      return;
    }

    setIsUploading(true);
    setFileError(null);

    const result = await checkInDocument(CASE_ID, selectedFile, lines);
    if (result.success) {
      setSelectedFile(null);
      setAmendmentSummaryText("");
      await Promise.all([loadAllVersions(), refreshLockStatus()]);
    } else {
      setFileError(result.error);
    }
    setIsUploading(false);
  };

  const resetUploadForm = () => {
    setSelectedFile(null);
    setAmendmentSummaryText("");
    setFileError(null);
  };

  const toggleFullscreen = () => {
    if (!viewerRef.current) return;
    if (!document.fullscreenElement) viewerRef.current.requestFullscreen();
    else document.exitFullscreen();
  };

  const zoomOut = () =>
    setZoomLevel((z) => Math.max(0.4, +(z - 0.1).toFixed(2)));
  const zoomIn = () => setZoomLevel((z) => Math.min(3, +(z + 0.1).toFixed(2)));

  const toggleCompareMode = () => {
    setCompareMode((prev) => !prev);
    setSelectedForCompare([]);
    setDiff(null);
    setCompareError(null);
  };

  const toggleVersionForCompare = (id: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(id)) return prev.filter((v) => v !== id);
      if (prev.length === 2) return prev;
      return [...prev, id];
    });
  };

  const handleCompare = async () => {
    if (selectedForCompare.length !== 2) return;
    setIsComparing(true);
    setCompareError(null);
    setDiff(null);
    setIsCompareModalOpen(true);

    const result = await compareDocumentVersions(
      CASE_ID,
      selectedForCompare[0],
      selectedForCompare[1],
    );

    if (result.success) setDiff(result.data);
    else setCompareError(result.error);

    setIsComparing(false);
  };

  const closeCompareModal = () => setIsCompareModalOpen(false);

  function parseVersion(v: string): [number, number] {
    const [maj, min] = v.split(".").map(Number);
    return [maj || 0, min || 0];
  }

  function isOlderVersion(a: string, b: string) {
    const [aMaj, aMin] = parseVersion(a);
    const [bMaj, bMin] = parseVersion(b);
    return aMaj !== bMaj ? aMaj < bMaj : aMin < bMin;
  }

  useEffect(() => {
    loadAllVersions();
    refreshLockStatus();
    getCaseDetail()
  }, [loadAllVersions, refreshLockStatus]);

  useEffect(() => {
    if (allAgreements.length && !selectedVersionId) {
      const latest = allAgreements.find((v) => v.isLatest) ?? allAgreements[0];
      setSelectedVersionId(latest.id);
    }
  }, [allAgreements, selectedVersionId]);

  useEffect(() => {
    if (selectedVersionId) loadVersionDetail(selectedVersionId);
  }, [selectedVersionId, loadVersionDetail]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <main className="px-6 py-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-[30px] font-bold tracking-tight">
                Agreement
              </h1>
              <p className="mt-1 text-[13px] text-muted-foreground">
                View all versions, compare documents and manage check-in /
                check-out.
              </p>
            </div>
            <button
              onClick={toggleCompareMode}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {compareMode ? (
                <X className="h-4 w-4" />
              ) : (
                <GitCompareArrows className="h-4 w-4" />
              )}
              {compareMode ? "Cancel Compare" : "Compare Documents"}
            </button>
          </div>

          <SummaryStrip
            caseDetails={caseDetails}
            currentVersion={currentVersion}
            error={caseError}
          />

          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[260px_minmax(0,1fr)_290px]">
            <VersionList
              versions={allAgreements}
              selectedId={selectedVersionId}
              onSelect={setSelectedVersionId}
              error={versionsError}
              onRetry={loadAllVersions}
              compareMode={compareMode}
              selectedForCompare={selectedForCompare}
              onToggleCompareSelect={toggleVersionForCompare}
              onCompareClick={handleCompare}
              isComparing={isComparing}
            />

            <div className="space-y-5">
              <DocumentViewer
                versionDetail={versionDetail}
                isLoading={isDetailLoading}
                error={versionDetailError}
                onRetry={() =>
                  selectedVersionId && loadVersionDetail(selectedVersionId)
                }
                showingPdf={showingPdf}
                zoomLevel={zoomLevel}
                currentPage={currentPage}
                totalPages={totalPages}
                viewerRef={viewerRef}
                onZoomIn={zoomIn}
                onZoomOut={zoomOut}
                onToggleFullscreen={toggleFullscreen}
                downloadError={downloadError}
                onPageInfoChange={(info: any) => {
                  setCurrentPage(info.current);
                  setTotalPages(info.total);
                }}
              />

              <AmendmentHistory versions={allAgreements} />
            </div>

            <div className="space-y-5">
              <UploadPanel
                selectedFile={selectedFile}
                isDragging={isDragging}
                fileError={fileError}
                amendmentSummaryText={amendmentSummaryText}
                isUploading={isUploading}
                canUpload={!!lockStatus?.isLockedByCurrentUser}
                fileInputRef={fileInputRef}
                onDragOver={() => setIsDragging(true)}
                onDragLeave={() => setIsDragging(false)}
                onFileSelect={handleFileSelect}
                onRemoveFile={() => setSelectedFile(null)}
                onAmendmentChange={setAmendmentSummaryText}
                onCancel={resetUploadForm}
                onUpload={handleUploadAndCreate}
              />

              <LockPanel
                lockStatus={lockStatus}
                lockStatusError={lockStatusError}
                onRetryLockStatus={refreshLockStatus}
                isCheckingOut={isCheckingOut}
                checkOutError={checkOutError}
                onCheckOut={handleCheckOut}
                isCheckingIn={isCheckingIn}
                checkInError={checkInError}
                onCheckIn={handleCheckIn}
              />
            </div>
          </div>

          <Modal
            isOpen={isCompareModalOpen}
            onClose={closeCompareModal}
            title="Comparison Result"
          >
            {isComparing && (
              <p className="text-[13px] text-muted-foreground">
                Comparing versions…
              </p>
            )}

            {!isComparing &&
              diff &&
              (() => {
                const vA = allAgreements.find(
                  (v) => v.id === selectedForCompare[0],
                );
                const vB = allAgreements.find(
                  (v) => v.id === selectedForCompare[1],
                );
                const [leftVer, rightVer] =
                  vA && vB && isOlderVersion(vB.version, vA.version)
                    ? [vB, vA]
                    : [vA, vB];

                return (
                  <DiffViewer
                    diff={diff}
                    leftLabel={
                      leftVer ? `Version ${leftVer.version}` : "Older Version"
                    }
                    rightLabel={
                      rightVer ? `Version ${rightVer.version}` : "Newer Version"
                    }
                  />
                );
              })()}
          </Modal>
        </main>
      </div>
    </div>
  );
}
