import React, { useState } from "react";
import {
  Lock,
  FileText,
  Eye,
  Download,
  CheckSquare,
  Square,
  GitCompare,
  X,
  Scale,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Axios from "@/lib/ApiConfig";

export interface InitializeLawyerStageResult {
  success: boolean;
  fileName: string;
  s3Key: string;
  url: string;
  pdfUrl: string | null;
  majorVersion: number;
  minorVersion: number;
  versionId: string;
}

const caseId = "6a99454fb23e05b06008526a";

const VERSIONS = ["v1.0", "v1.1", "v1.2", "v1.3", "v1.4", "v1.5", "v2.0"];

interface AgreementTabProps {
  caseId: string;
}

export default function AgreementTab() {
  const [selectedVersions, setSelectedVersions] = useState<any>([]);
  const [showCompare, setShowCompare] = useState<any>(false);

  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitResult, setSubmitResult] =
    useState<InitializeLawyerStageResult | null>(null);

  const toggleVersion = (v: any) => {
    setShowCompare(false);
    setSelectedVersions((prev: any) => {
      if (prev.includes(v)) {
        return prev.filter((x: any) => x !== v);
      }
      if (prev.length >= 2) {
        return [prev[1], v];
      }
      return [...prev, v];
    });
  };

  const canCompare = selectedVersions.length === 2;

  const handleCompare = () => {
    if (!canCompare) return;
    setShowCompare(true);
  };

  const closeCompare = () => setShowCompare(false);

  const handleSubmitToLawyer = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const { data } = await Axios.post(
        `/agreement/${caseId}/document/lawyer/initialize`,
      );
      setSubmitResult(data);
      setShowSubmitConfirm(false);
    } catch (error: any) {
      setSubmitError(
        error?.response?.data?.message ??
          "Failed to submit the document for lawyer review.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs flex items-center gap-2">
        <Lock className="w-4 h-4 text-slate-700" />
        <span>
          Section 11 Guard: AGREEMENT TAB IS READ-ONLY. Case Managers cannot
          edit agreement text (Constraint 3).
        </span>
      </div>

      {/* Submit-to-lawyer handoff — a workflow action, kept separate from
          the read-only version history below rather than mixed into it. */}
      <div className="p-5 rounded-xl bg-white border border-slate-300 flex flex-col gap-3 shadow-xs">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-xs text-slate-900 uppercase">
              Submit for Lawyer Review
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 max-w-md">
              Locks in the current case-manager-approved draft and hands it off
              to the assigned lawyers to begin legal review and markup.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowSubmitConfirm(true)}
            disabled={isSubmitting || !!submitResult}
            className={`text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 transition-all shadow-xs active:scale-95 ${
              submitResult
                ? "bg-emerald-50 text-emerald-700 border border-emerald-300 cursor-default"
                : "bg-slate-900 hover:bg-slate-800 text-white cursor-pointer disabled:opacity-50"
            }`}
          >
            {submitResult ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" /> Submitted
              </>
            ) : (
              <>
                <Scale className="w-3.5 h-3.5" /> Submit to Lawyer
              </>
            )}
          </button>
        </div>

        {submitError && (
          <p className="text-[11px] text-red-600 font-medium">{submitError}</p>
        )}

        {submitResult && (
          <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-medium bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            Lawyer stage baseline created — v{submitResult.majorVersion}.
            {submitResult.minorVersion} is ready for lawyer check-out.
          </div>
        )}
      </div>

      <div className="p-5 rounded-xl bg-white border border-slate-300 flex flex-col gap-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-xs text-slate-900 uppercase">
            Agreement Version History (Section 11)
          </h4>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase">
              {selectedVersions.length}/2 selected
            </span>
            <button
              type="button"
              onClick={handleCompare}
              disabled={!canCompare}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-xs active:scale-95 ${
                canCompare
                  ? "bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              Compare
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {VERSIONS.map((v: any) => {
            const isChecked = selectedVersions.includes(v);
            return (
              <div
                key={v}
                className={`p-3.5 rounded-lg bg-white border text-xs flex items-center justify-between transition-colors ${
                  isChecked
                    ? "border-slate-500 bg-slate-50"
                    : "border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleVersion(v)}
                    aria-label={`Select ${v} for comparison`}
                    className="cursor-pointer"
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-slate-900" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  <FileText className="w-4 h-4 text-slate-700" />
                  <div>
                    <span className="font-bold text-slate-900">
                      Prenuptial Agreement Draft ({v})
                    </span>
                    <span className="text-slate-400 text-[10px] block">
                      Generated by AGREEMENT_DOCUMENT_ENGINE_V1.1
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold px-3 py-1 rounded flex items-center gap-1 cursor-pointer">
                    <Eye className="w-3 h-3" /> Preview PDF
                  </button>
                  <button className="bg-slate-950 text-white text-xs font-bold px-3 py-1 rounded flex items-center gap-1 cursor-pointer">
                    <Download className="w-3 h-3" /> Download PDF
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Compare panel — appears once exactly two versions are picked and Compare is clicked */}
      {showCompare && canCompare && (
        <div className="p-5 rounded-xl bg-white border border-slate-300 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-slate-700" />
              <h4 className="font-bold text-xs text-slate-900 uppercase">
                Comparing {selectedVersions[0]} vs {selectedVersions[1]}
              </h4>
            </div>
            <button
              type="button"
              onClick={closeCompare}
              className="text-slate-400 hover:text-slate-700 cursor-pointer"
              aria-label="Close comparison"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {selectedVersions.map((v: any) => (
              <div
                key={v}
                className="border border-slate-200 rounded-lg p-3.5 flex flex-col gap-2"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <FileText className="w-3.5 h-3.5 text-slate-700" />
                  Prenuptial Agreement Draft ({v})
                </div>
                <div className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded p-2.5 leading-relaxed">
                  Document body / clause diff for {v} renders here.
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation — this action is one-time per case on the backend
          (initializeLawyerStage throws a conflict if called twice), so it's
          worth an explicit confirm rather than a single accidental click. */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-6">
          <div className="w-full max-w-sm rounded-xl bg-white border border-slate-300 shadow-lg p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-slate-700" />
              <h4 className="font-bold text-sm text-slate-900">
                Submit for lawyer review?
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              This locks in the latest case-manager-approved draft as the
              starting point for lawyer review. This can only be done once per
              case — make sure the draft is final before continuing.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowSubmitConfirm(false)}
                disabled={isSubmitting}
                className="text-xs font-bold px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitToLawyer}
                disabled={isSubmitting}
                className="text-xs font-bold px-3.5 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}
                {isSubmitting ? "Submitting…" : "Confirm & Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
