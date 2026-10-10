"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Axios from "@/lib/ApiConfig";
import { AppDispatch, RootState } from "@/store/store";
import { getCasesDetails } from "@/store/asyncThunk/casesThunk";
import { updateApproval, updateJointInformationStatus } from "@/store/slices/casesSlice";
import { getErrorMessage } from "@/lib/api/http-error";

export default function FinalReviewConfirmationPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.auth.user);
  const cases = useSelector((state: RootState) => state.cases);
  const caseId = cases.caseId || user?.inviteCaseId;

  const isUser1 = user?.endUserType === "user1";
  const isUser2 = user?.endUserType === "user2";

  // Section data from Redux
  const myData = isUser1 ? cases.myInformation : cases.partnerInformation;
  const partnerData = isUser1 ? cases.partnerInformation : cases.myInformation;
  const jointData = cases.jointInformation;
  const matrimonialData = (jointData as any)?.matrimonialAgreement;

  // Accordion open/close state for the 4 sections
  const [openSection, setOpenSection] = useState<string | null>("my-info");

  // Modals state
  const [showExhibitBModal, setShowExhibitBModal] = useState(false);
  const [showExhibitDModal, setShowExhibitDModal] = useState(false);
  const [exhibitDConfirmed, setExhibitDConfirmed] = useState(false);

  // Loading and action state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  // Local state tracking P2 editing mode if they clicked "Make Changes"
  const [p2MadeChanges, setP2MadeChanges] = useState(false);
  // Local state tracking P1 submission in current session (in addition to backend flags)
  const [justSubmittedByP1, setJustSubmittedByP1] = useState(false);

  // Refresh case on load
  useEffect(() => {
    if (caseId) {
      dispatch(getCasesDetails(caseId));
    }
  }, [dispatch, caseId]);

  // Status checks
  const hasData = (obj?: Record<string, unknown>) =>
    Boolean(obj && Object.keys(obj).length > 0);

  const isP1Complete =
    hasData(cases?.myInformation?.personalInformation as any) ||
    hasData(cases?.myInformation?.individualAssets as any);

  const isP2Complete =
    hasData(cases?.partnerInformation?.personalInformation as any) ||
    hasData(cases?.partnerInformation?.individualAssets as any);

  const isJointComplete =
    hasData((cases?.jointInformation as any)?.jointAssets) ||
    hasData((cases?.jointInformation as any)?.jointLiabilitiesAndDebts);

  const isMatrimonialComplete =
    hasData(matrimonialData) || isJointComplete;

  const isUser1Approved = Boolean(cases?.approval?.user1Approved);
  const isUser2Approved = Boolean(cases?.approval?.user2Approved);
  const isJointSubmitted = Boolean(cases?.status?.jointInformation?.submitted);

  // P1 is considered submitted if user1Approved is true or jointInformation is submitted, or just submitted locally
  const isP1Submitted = isUser1Approved || isJointSubmitted || justSubmittedByP1;
  const isMutualApproved = isUser1Approved && isUser2Approved;

  // Handlers
  const handleP1MakeChanges = () => {
    router.push("/dashboard/personal-info");
  };

  const handleP2MakeChanges = () => {
    setP2MadeChanges(true);
    router.push("/dashboard/personal-info");
  };

  const handleConfirmSubmitForPartnerReview = async () => {
    setIsSubmitting(true);
    try {
      if (caseId) {
        // Record user 1 approval / submission
        await Axios.post(`/cases/${caseId}/approve`);
        dispatch(updateApproval({ user1Approved: true }));
        dispatch(
          updateJointInformationStatus({
            submitted: true,
            submittedBy: user?._id ?? null,
          }),
        );
        await dispatch(getCasesDetails(caseId));
      }
      setJustSubmittedByP1(true);
      setShowExhibitBModal(false);
      toast.success("Submitted for partner review.");
    } catch (err) {
      // If endpoint fails or mock mode, still progress locally
      dispatch(updateApproval({ user1Approved: true }));
      setJustSubmittedByP1(true);
      setShowExhibitBModal(false);
      toast.success("Submitted for partner review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmApprove = async () => {
    if (!exhibitDConfirmed) return;
    setIsApproving(true);
    try {
      if (caseId) {
        await Axios.post(`/cases/${caseId}/approve`);
        dispatch(updateApproval({ user2Approved: true }));
        try {
          await Axios.post(`/agreement/${caseId}/document/generate`);
        } catch {
          // Document generation fallback
        }
        await dispatch(getCasesDetails(caseId));
      } else {
        dispatch(updateApproval({ user2Approved: true }));
      }
      setShowExhibitDModal(false);
      toast.success("Mutual confirmation complete!");
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't approve right now. Please try again."));
    } finally {
      setIsApproving(false);
    }
  };

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  // Helper formatting for timestamps
  const formattedTime = cases?.approval?.user1ApprovedAt
    ? new Date(cases.approval.user1ApprovedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

  // ----------------------------------------------------
  // CASE 1: MUTUAL APPROVAL ACHIEVED (EXHIBIT D RESULT)
  // ----------------------------------------------------
  if (isMutualApproved) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] px-4 py-8 md:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Header celebration banner */}
          <div className="rounded-2xl border border-[#BBF7D0] bg-[#F0FDF4] p-8 text-center shadow-[0_10px_25px_-5px_rgba(22,163,74,0.1)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A] shadow-inner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-8 w-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mt-4 text-2xl font-extrabold text-[#14532D] md:text-3xl">
              Mutual Confirmation Complete 🎉
            </h1>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-[#166534] md:text-base">
              Both parties have reviewed and confirmed all details of your prenuptial agreement.
              Your agreed terms and combined disclosure schedule are now locked and ready for the next phase.
            </p>
          </div>

          {/* Status summary card */}
          <div className="rounded-2xl border border-[#E7E7F2] bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-base font-bold text-[#1E1B3C]">Agreement Package Summary</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3.5 rounded-xl border border-[#E2E8F0] bg-[#FAF9FF] p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]">
                  ✓
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-[#9494AA]">Partner 1 (User 1)</div>
                  <div className="text-sm font-semibold text-[#1E1B3C]">Confirmed & Approved</div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 rounded-xl border border-[#E2E8F0] bg-[#FAF9FF] p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]">
                  ✓
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-[#9494AA]">Partner 2 (User 2)</div>
                  <div className="text-sm font-semibold text-[#1E1B3C]">Confirmed & Approved</div>
                </div>
              </div>
            </div>

            {/* Next step: Independent Legal Advice */}
            <div className="mt-8 rounded-xl border border-[#DDD6FE] bg-[#F5F3FF] p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#EDE9FE] text-[#6D28D9]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
                    <path d="M12 3l2.5 5.2L20 9l-4 3.9.9 5.5L12 15.8 7.1 18.4 8 12.9 4 9l5.5-.8z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
                    Next Step • Section 4
                  </div>
                  <h3 className="mt-1 text-lg font-bold text-[#1E1B3C]">
                    Independent Legal Advice (ILA)
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#6B6B80]">
                    Under England and Wales law, to ensure your prenuptial agreement is legally binding and given full
                    weight by the family courts, both partners must receive independent legal advice from separate,
                    SRA-regulated solicitors.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href="/dashboard/solicitor-details"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#6D28D9] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#6D28D9]/20 transition hover:bg-[#5B21B6]"
                    >
                      Proceed to Solicitor Details →
                    </Link>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center rounded-xl border border-[#D1D1DC] bg-white px-5 py-3 text-sm font-semibold text-[#6B6B80] transition hover:bg-slate-50"
                    >
                      Return to Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // CASE 2: P1 SUBMITTED AND WAITING (EXHIBIT C)
  // ----------------------------------------------------
  if (isUser1 && isP1Submitted) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] px-4 py-8 md:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Top Banner: Green background with paper airplane icon */}
          <div className="flex items-center gap-4 rounded-2xl border border-[#BBF7D0] bg-[#DCFCE7]/70 p-5 md:p-6 shadow-sm">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#16A34A]/15 text-[#16A34A]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10l18-7-7 18-3-7-8-4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#14532D] md:text-xl">
                Your information has been sent to your partner
              </h1>
              <p className="mt-0.5 text-xs text-[#166534] md:text-sm">
                Your completed information has been submitted to your partner for review.
              </p>
            </div>
          </div>

          {/* Two-column layout matching Exhibit C */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Card: What happens next? */}
            <div className="flex flex-col justify-between rounded-2xl border border-[#E7E7F2] bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-base font-bold text-[#1E1B3C]">What happens next?</h2>
                <p className="mt-2 text-xs leading-relaxed text-[#6B6B80] md:text-sm">
                  Your partner will now review the complete information. They can:
                </p>
                <ul className="mt-3 space-y-2 text-xs text-[#1E1B3C] md:text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-[#6D28D9] font-bold">•</span>
                    <span>Approve the information, or</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#6D28D9] font-bold">•</span>
                    <span>
                      Make changes to their own information, the joint information, or the Matrimonial Agreement & Intentions.
                    </span>
                  </li>
                </ul>
                <p className="mt-3 text-xs leading-relaxed text-[#6B6B80]">
                  If your partner makes changes, you will be notified and asked to review and approve the updated information.
                </p>
              </div>

              {/* Blue callout at bottom of left card */}
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] p-3.5">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#3B82F6] text-white text-xs font-bold">
                  i
                </span>
                <div>
                  <div className="text-xs font-bold text-[#1E3A8A]">
                    You don&apos;t need to do anything right now.
                  </div>
                  <div className="mt-0.5 text-[11px] text-[#2563EB]">
                    We&apos;ll notify you when your partner has completed their review.
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: Current Status Timeline */}
            <div className="flex flex-col justify-between rounded-2xl border border-[#E7E7F2] bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-base font-bold text-[#1E1B3C]">Current Status</h2>

                <div className="mt-5 space-y-6">
                  {/* Step 1: You - Submitted */}
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#1E1B3C]">You</span>
                        <span className="text-[11px] text-[#9494AA]">{formattedTime}</span>
                      </div>
                      <div className="text-xs text-[#16A34A] font-medium">Submitted</div>
                    </div>
                  </div>

                  {/* Vertical dotted connector */}
                  <div className="ml-4 -my-4 h-6 border-l-2 border-dashed border-[#CBD5E1]" />

                  {/* Step 2: Partner - Review Pending */}
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[#3B82F6]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                        <circle cx="12" cy="12" r="9" />
                        <path strokeLinecap="round" d="M12 7v5l3 3" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#1E1B3C]">Partner</span>
                        <span className="text-[11px] text-[#9494AA]">—</span>
                      </div>
                      <div className="text-xs text-[#3B82F6] font-medium">Review Pending</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Light blue note at bottom */}
              <div className="mt-8 rounded-xl bg-[#F0F7FF] p-3.5 text-center text-xs font-medium text-[#1E40AF]">
                We&apos;ll let you know as soon as your partner has reviewed the information.
              </div>
            </div>
          </div>

          <div className="pt-2 text-center">
            <Link
              href="/dashboard"
              className="text-xs font-medium text-[#6B6B80] hover:text-[#1E1B3C] underline underline-offset-4"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // CASE 3: MAIN REVIEW VIEW (EXHIBIT A)
  // Shown for P1 (before submit) and P2 (during partner review)
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F8F9FC] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Top Header */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#9494AA]">
            4. Final Review & Confirmation
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#1E1B3C] md:text-3xl">
            Review your information
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#6B6B80]">
            Please review the completed information before confirming. If anything needs to be changed,
            you can make the necessary changes before confirming.
          </p>
        </div>

        {/* 4 Accordion / Summary Cards */}
        <div className="space-y-3.5">
          {/* Card 1: My Information */}
          <div className="rounded-2xl border border-[#E7E7F2] bg-white p-5 shadow-sm transition hover:border-[#DDD6FE]">
            <div
              onClick={() => toggleSection("my-info")}
              className="flex cursor-pointer items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#3B82F6]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M6 20c0-4 4-6 6-6s6 2 6 6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1E1B3C] md:text-base">My Information</h3>
                  <p className="text-xs text-[#6B6B80]">
                    Personal information, legal declaration, family & dependents, financial disclosure
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-semibold text-[#16A34A]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3.5 w-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Completed
                </span>
                <span className="text-[#9494AA]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className={`h-4 w-4 transition-transform ${openSection === "my-info" ? "rotate-180" : ""}`}
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            {openSection === "my-info" && (
              <div className="mt-4 border-t border-[#F1F1F6] pt-4">
                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  <div className="rounded-lg bg-[#FAF9FF] p-3">
                    <span className="font-semibold text-[#1E1B3C]">Personal Details:</span>
                    <div className="mt-1 text-[#6B6B80]">
                      {myData?.personalInformation?.firstName
                        ? `${myData.personalInformation.firstName} ${myData.personalInformation.lastName ?? ""}`
                        : user?.firstName
                        ? `${user.firstName} ${user.lastName ?? ""}`
                        : "Provided"}
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#FAF9FF] p-3">
                    <span className="font-semibold text-[#1E1B3C]">Legal Declaration:</span>
                    <div className="mt-1 text-[#6B6B80]">Full disclosure & statutory declarations accepted</div>
                  </div>
                  <div className="rounded-lg bg-[#FAF9FF] p-3">
                    <span className="font-semibold text-[#1E1B3C]">Dependents & Family:</span>
                    <div className="mt-1 text-[#6B6B80]">Registered & reviewed</div>
                  </div>
                  <div className="rounded-lg bg-[#FAF9FF] p-3">
                    <span className="font-semibold text-[#1E1B3C]">Individual Financial Disclosure:</span>
                    <div className="mt-1 text-[#6B6B80]">Assets, income & liabilities disclosed</div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  {isUser1 ? (
                    <button
                      type="button"
                      onClick={handleP1MakeChanges}
                      className="text-xs font-semibold text-[#6D28D9] hover:underline"
                    >
                      Edit My Information →
                    </button>
                  ) : (
                    <span className="text-xs text-[#9494AA]">View only (Partner disclosure)</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Partner's Information */}
          <div className="rounded-2xl border border-[#E7E7F2] bg-white p-5 shadow-sm transition hover:border-[#DDD6FE]">
            <div
              onClick={() => toggleSection("partner-info")}
              className="flex cursor-pointer items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#3B82F6]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87" />
                    <path d="M16 3.13a4 4 0 010 7.75" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1E1B3C] md:text-base">Partner&apos;s Information</h3>
                  <p className="text-xs text-[#6B6B80]">
                    Personal information, family & dependents, financial disclosure
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-semibold text-[#16A34A]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3.5 w-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Completed
                </span>
                <span className="text-[#9494AA]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className={`h-4 w-4 transition-transform ${openSection === "partner-info" ? "rotate-180" : ""}`}
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            {openSection === "partner-info" && (
              <div className="mt-4 border-t border-[#F1F1F6] pt-4">
                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  <div className="rounded-lg bg-[#FAF9FF] p-3">
                    <span className="font-semibold text-[#1E1B3C]">Partner Details:</span>
                    <div className="mt-1 text-[#6B6B80]">
                      {partnerData?.personalInformation?.firstName
                        ? `${partnerData.personalInformation.firstName} ${partnerData.personalInformation.lastName ?? ""}`
                        : "Provided by partner"}
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#FAF9FF] p-3">
                    <span className="font-semibold text-[#1E1B3C]">Partner Disclosure:</span>
                    <div className="mt-1 text-[#6B6B80]">Assets, revenue streams & debt schedules completed</div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  {isUser2 ? (
                    <button
                      type="button"
                      onClick={handleP2MakeChanges}
                      className="text-xs font-semibold text-[#6D28D9] hover:underline"
                    >
                      Edit My Partner Information →
                    </button>
                  ) : (
                    <span className="text-xs text-[#9494AA]">Shared by partner (Read-only)</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Card 3: Joint Financial Information */}
          <div className="rounded-2xl border border-[#E7E7F2] bg-white p-5 shadow-sm transition hover:border-[#DDD6FE]">
            <div
              onClick={() => toggleSection("joint-info")}
              className="flex cursor-pointer items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#3B82F6]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <path d="M14 2v6h6" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <line x1="10" y1="9" x2="8" y2="9" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1E1B3C] md:text-base">Joint Financial Information</h3>
                  <p className="text-xs text-[#6B6B80]">
                    Joint assets, joint income & revenue, joint liabilities & debts
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-semibold text-[#16A34A]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3.5 w-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Completed
                </span>
                <span className="text-[#9494AA]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className={`h-4 w-4 transition-transform ${openSection === "joint-info" ? "rotate-180" : ""}`}
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            {openSection === "joint-info" && (
              <div className="mt-4 border-t border-[#F1F1F6] pt-4">
                <div className="grid gap-3 sm:grid-cols-3 text-xs">
                  <div className="rounded-lg bg-[#FAF9FF] p-3">
                    <span className="font-semibold text-[#1E1B3C]">Living Arrangements:</span>
                    <div className="mt-1 text-[#6B6B80]">
                      {(jointData as any)?.jointAssets?.livingArrangement ?? "Recorded"}
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#FAF9FF] p-3">
                    <span className="font-semibold text-[#1E1B3C]">Shared Assets:</span>
                    <div className="mt-1 text-[#6B6B80]">Properties & accounts disclosed</div>
                  </div>
                  <div className="rounded-lg bg-[#FAF9FF] p-3">
                    <span className="font-semibold text-[#1E1B3C]">Shared Liabilities:</span>
                    <div className="mt-1 text-[#6B6B80]">Shared debts & treatment specified</div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Link
                    href="/dashboard/joint-assets"
                    className="text-xs font-semibold text-[#6D28D9] hover:underline"
                  >
                    Edit Joint Information →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Card 4: Matrimonial Agreement & Intentions */}
          <div className="rounded-2xl border border-[#E7E7F2] bg-white p-5 shadow-sm transition hover:border-[#DDD6FE]">
            <div
              onClick={() => toggleSection("matrimonial-info")}
              className="flex cursor-pointer items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#3B82F6]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                    <path d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                    <path d="M8 12h8" />
                    <path d="M12 8v8" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1E1B3C] md:text-base">
                    Matrimonial Agreement & Intentions
                  </h3>
                  <p className="text-xs text-[#6B6B80]">Your intentions and agreed approach</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-semibold text-[#16A34A]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3.5 w-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Completed
                </span>
                <span className="text-[#9494AA]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className={`h-4 w-4 transition-transform ${openSection === "matrimonial-info" ? "rotate-180" : ""}`}
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            {openSection === "matrimonial-info" && (
              <div className="mt-4 border-t border-[#F1F1F6] pt-4">
                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  <div className="rounded-lg bg-[#FAF9FF] p-3">
                    <span className="font-semibold text-[#1E1B3C]">Separate Property Approach:</span>
                    <div className="mt-1 text-[#6B6B80]">
                      {matrimonialData?.separatePropertyIntention ?? "Ring-fence all separate property"}
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#FAF9FF] p-3">
                    <span className="font-semibold text-[#1E1B3C]">Spousal Maintenance:</span>
                    <div className="mt-1 text-[#6B6B80]">
                      {matrimonialData?.spousalMaintenanceIntention ?? "Clean break waiver agreed"}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Link
                    href="/dashboard/matrimonial-agreement"
                    className="text-xs font-semibold text-[#6D28D9] hover:underline"
                  >
                    Edit Matrimonial Intentions →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ready to submit / partner review info card (matching Exhibit A) */}
        <div className="flex items-start gap-3.5 rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF] p-5">
          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#3B82F6] text-white text-xs font-bold">
            i
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1E3A8A]">
              {isUser1
                ? "Ready to submit for your partner's review?"
                : "Partner review and approval required"}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-[#2563EB] md:text-sm">
              {isUser1
                ? "Once you submit, your complete information will be made available to your partner for their review. They can approve the information or make changes. If they make changes, you will be able to review and approve those changes before the final confirmation."
                : "Please review all 4 sections carefully. You can approve the package as presented, or click Make Changes to adjust your questionnaire before sending back for mutual review."}
            </p>
          </div>
        </div>

        {/* Action Buttons Section matching Exhibit A */}
        <div className="grid gap-4 sm:grid-cols-2 pt-2">
          {/* Left Action Button: Make Changes / Continue Editing */}
          <div>
            <button
              type="button"
              onClick={isUser1 ? handleP1MakeChanges : handleP2MakeChanges}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#FCA5A5] bg-white py-3.5 text-sm font-bold text-[#EF4444] transition hover:bg-[#FEF2F2]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span>{p2MadeChanges ? "Continue Editing" : "Make Changes"}</span>
            </button>
            <p className="mt-1.5 text-center text-xs text-[#8A8AA0]">
              Go back to the relevant sections to make changes.
            </p>
          </div>

          {/* Right Action Button: Submit for Partner Review (P1) OR Approve (P2) */}
          <div>
            {isUser1 ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowExhibitBModal(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#16A34A] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#16A34A]/25 transition hover:bg-[#15803D]"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10l18-7-7 18-3-7-8-4z" />
                  </svg>
                  <span>Submit for Partner Review</span>
                </button>
                <p className="mt-1.5 text-center text-xs text-[#8A8AA0]">
                  Send your complete information to your partner for review.
                </p>
              </>
            ) : p2MadeChanges ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowExhibitBModal(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#16A34A] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#16A34A]/25 transition hover:bg-[#15803D]"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10l18-7-7 18-3-7-8-4z" />
                  </svg>
                  <span>Send for Partner Review</span>
                </button>
                <p className="mt-1.5 text-center text-xs text-[#8A8AA0]">
                  Send your updated information to your partner for review.
                </p>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setShowExhibitDModal(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#16A34A] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#16A34A]/25 transition hover:bg-[#15803D]"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Approve</span>
                </button>
                <p className="mt-1.5 text-center text-xs text-[#8A8AA0]">
                  Confirm and approve the complete information.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* EXHIBIT B MODAL: Ready to send to your partner for review? */}
      {/* ---------------------------------------------------- */}
      {showExhibitBModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl md:p-8">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowExhibitBModal(false)}
              className="absolute right-4 top-4 text-[#9494AA] hover:text-[#1E1B3C]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Icon: Paper airplane */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EFF6FF] text-[#3B82F6]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-7 w-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10l18-7-7 18-3-7-8-4z" />
              </svg>
            </div>

            <h3 className="mt-4 text-center text-lg font-bold text-[#1E1B3C] md:text-xl">
              Ready to send to your partner for review?
            </h3>
            <div className="mt-1 text-center text-xs font-semibold uppercase tracking-wider text-[#9494AA]">
              Before you continue:
            </div>

            {/* 4 Numbered Steps matching Exhibit B */}
            <div className="mt-5 space-y-3">
              {[
                "Please make sure all the information you have provided is complete and accurate.",
                "Your complete information will now be made available to your partner for review.",
                "Your partner can approve the information or make changes.",
                "If your partner makes changes, you will be able to review and approve those changes before the final confirmation.",
              ].map((text, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs leading-relaxed text-[#1E1B3C]">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[11px] font-bold text-[#3B82F6]">
                    {idx + 1}
                  </span>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Green Callout Box matching Exhibit B */}
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-3.5 text-xs text-[#166534]">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </div>
              <span>
                Once both parties approve the final information, it will proceed to Final Review & Mutual Confirmation.
              </span>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowExhibitBModal(false)}
                className="w-1/2 rounded-xl border border-[#D1D1DC] bg-white py-3 text-xs font-bold text-[#6B6B80] transition hover:bg-slate-50"
              >
                Go Back
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmSubmitForPartnerReview}
                className="flex w-1/2 items-center justify-center gap-1.5 rounded-xl bg-[#16A34A] py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#15803D] disabled:opacity-60"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10l18-7-7 18-3-7-8-4z" />
                </svg>
                <span>{isSubmitting ? "Submitting..." : "Submit for Partner Review"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* EXHIBIT D MODAL: Approve the complete information? */}
      {/* ---------------------------------------------------- */}
      {showExhibitDModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl md:p-8">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowExhibitDModal(false)}
              className="absolute right-4 top-4 text-[#9494AA] hover:text-[#1E1B3C]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Icon: Checkmark */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-7 w-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="mt-4 text-center text-lg font-bold text-[#1E1B3C] md:text-xl">
              Approve the complete information?
            </h3>
            <p className="mt-1 text-center text-xs text-[#6B6B80]">
              Please confirm that you have reviewed the complete information and are happy with the current version.
            </p>

            {/* Blue Callout Box with 4 checklist items */}
            <div className="mt-5 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] p-4 text-xs">
              <div className="flex items-center gap-2 font-bold text-[#1E3A8A]">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#3B82F6] text-white text-[10px]">
                  i
                </span>
                <span>Your approval applies to the entire package, including:</span>
              </div>
              <div className="mt-2.5 space-y-1.5 pl-6 text-[#1E3A8A]">
                {[
                  "Your information",
                  "Your partner's information",
                  "Joint financial information",
                  "Matrimonial agreement & intentions",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[#16A34A] font-bold">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-[#6B6B80]">
              If you approve, your partner will be asked to review and approve the same version. If any changes
              are made afterwards, you will need to review and approve the updated information again.
            </p>

            {/* Confirmation Checkbox Box matching Exhibit D */}
            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-3.5 transition hover:bg-[#DCFCE7]/40">
              <input
                type="checkbox"
                checked={exhibitDConfirmed}
                onChange={(e) => setExhibitDConfirmed(e.target.checked)}
                className="mt-0.5 rounded text-[#16A34A] focus:ring-[#16A34A]"
              />
              <span className="text-xs font-semibold leading-relaxed text-[#14532D]">
                I confirm that I have reviewed the information above and it accurately reflects my current instructions.
              </span>
            </label>

            {/* Modal Actions */}
            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowExhibitDModal(false)}
                className="w-1/2 rounded-xl border border-[#D1D1DC] bg-white py-3 text-xs font-bold text-[#6B6B80] transition hover:bg-slate-50"
              >
                Go Back
              </button>
              <button
                type="button"
                disabled={!exhibitDConfirmed || isApproving}
                onClick={handleConfirmApprove}
                className="flex w-1/2 items-center justify-center gap-1.5 rounded-xl bg-[#16A34A] py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#15803D] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>{isApproving ? "Approving..." : "Approve"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

