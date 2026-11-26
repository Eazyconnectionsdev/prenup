"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Axios from "@/lib/ApiConfig";
import { ConfirmModal } from "@/components/modals";
import { AppDispatch, RootState } from "@/store/store";
import { getCasesDetails } from "@/store/asyncThunk/casesThunk";
import { updateApproval, updateJointInformationStatus } from "@/store/slices/casesSlice";
import { getErrorMessage } from "@/lib/api/http-error";
import { useJointSectionStatus } from "@/hooks/useJointSectionStatus";
import {
  getSectionProgress,
  isFormFilled,
  JOINT_FINANCIAL_KEYS,
  JOINT_KEYS,
  MATRIMONIAL_KEYS,
  MY_PARTNER_KEYS,
} from "@/lib/progressCalculator";
import {
  FUTURE_ASSETS_LABELS,
  labelFor,
  REVIEW_TRIGGER_LABELS,
  SPOUSAL_MAINTENANCE_LABELS,
} from "@/lib/matrimonialAgreementLabels";
import type { ReviewTimelineItem } from "@/types/store/cases-slice";
import type { SectionProgress } from "@/types/lib/progress-calculator";
import { resolvePartyInformation } from "@/lib/caseSections";
import PartnerMessageThread from "@/components/review/PartnerMessageThread";

/** A party's display name, falling back to their email and then a role. */
const nameOf = (
  party?: { firstName?: string | null; lastName?: string | null; email?: string | null } | null,
  fallback = "Your partner",
) =>
  [party?.firstName, party?.lastName].filter(Boolean).join(" ").trim() ||
  party?.email ||
  fallback;

type FormRow = {
  key: string;
  label: string;
  detail: string;
  href?: string;
};

function StatusBadge({ progress }: { progress: SectionProgress }) {
  if (progress.isComplete) {
    return (
      <span className="flex items-center gap-1 rounded-full bg-[#DCFCE7] px-2.5 py-0.5 text-xs font-semibold text-[#16A34A]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3 w-3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Completed
      </span>
    );
  }

  return (
    <span
      className="flex items-center gap-1 whitespace-nowrap rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-xs font-semibold text-[#B45309]"
      title={`${progress.completed} of ${progress.total} forms completed`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3">
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" d="M12 7v5l3 3" />
      </svg>
      Pending
      <span className="font-medium text-[#92400E]/70">
        {progress.completed}/{progress.total}
      </span>
    </span>
  );
}

function FormRowList({
  section,
  rows,
  columns = "sm:grid-cols-2",
}: {
  section?: Record<string, any>;
  rows: FormRow[];
  columns?: string;
}) {
  return (
    <div className={`grid gap-3 text-xs ${columns}`}>
      {rows.map((row) => {
        const filled = isFormFilled(section?.[row.key]);
        return (
          <div
            key={`${row.key}-${row.label}`}
            className={`rounded-lg p-3 ${filled ? "bg-[#FAF9FF]" : "border border-dashed border-[#FDE68A] bg-[#FFFBEB]"}`}
          >
            <span className="font-semibold text-[#1E1B3C]">{row.label}:</span>
            {filled ? (
              <div className="mt-1 text-[#6B6B80]">{row.detail}</div>
            ) : (
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[#B45309]">
                <span>Not completed yet</span>
                {row.href && (
                  <Link
                    href={row.href}
                    className="font-semibold text-[#6D28D9] hover:underline"
                  >
                    Complete now →
                  </Link>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function FinalReviewConfirmationPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.auth.user);
  const cases = useSelector((state: RootState) => state.cases);
  const caseId = cases.caseId || user?.inviteCaseId;

  const isUser1 = user?.endUserType === "user1";
  const isUser2 = user?.endUserType === "user2";

  const {
    myId,
    isOwner,
    canEdit,
    isMyTurnToApprove,
    iAmWaitingForReview,
    partnerDisapproved,
    isWaitingOnPartner,
    iDisapproved,
  } = useJointSectionStatus();

  const isPartner2 = isUser2 || (!isOwner && !isUser1);
  const isPartner1 = !isPartner2;

  const partner1Steps = [
    "Please ensure that all the information you have provided is complete and accurate.",
    "Your completed information will be shared with your partner for review.",
    "Your partner can approve the information or request changes.",
    "If your partner requests changes, you will be able to review the revised information before confirming the updated version.",
  ];

  const partner2Steps = [
    "Your updated information will be shared with your partner.",
    "Your partner can review the changes you have made.",
    "Your partner can accept the changes or request further changes.",
    "Both partners must approve the same final version before the case proceeds to Case Manager Review.",
  ];

  const { mine: myData, theirs: partnerData } = resolvePartyInformation(
    user?.endUserType,
    cases.myInformation,
    cases.partnerInformation,
  );
  const jointData = cases.jointInformation;
  const matrimonialData = (jointData as any)?.matrimonialAgreement;

  const ownerName = nameOf(cases?.owner, "Primary applicant");
  const invitedName = nameOf(cases?.invitedUser, "Your partner");
  /** The partner on the other side of the request I am sending. */
  const partnerDisplayName = isOwner ? invitedName : ownerName;

  // Rounds that ran before the message was recorded on the timeline left only
  // the latest one behind, on `disapprovalReason`. Shown when the timeline
  // itself carries no messages, so those cases still read their note.
  const latestMessage: ReviewTimelineItem | null = cases?.approval
    ?.disapprovalReason
    ? {
        action: "Sent changes",
        actorRole:
          String(cases.approval.disapprovedBy ?? "") ===
          String(cases.owner?._id ?? "")
            ? "PRIMARY"
            : "SECONDARY",
        p1Status: "",
        p2Status: "",
        mutualStatus: "",
        timestamp: cases.approval.disapprovedAt ?? "",
        notes: cases.approval.disapprovalReason,
      }
    : null;

  const [openSection, setOpenSection] = useState<string | null>("");

  const [showExhibitBModal, setShowExhibitBModal] = useState(false);
  const [showExhibitDModal, setShowExhibitDModal] = useState(false);
  const [exhibitDConfirmed, setExhibitDConfirmed] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isUnlockingChanges, setIsUnlockingChanges] = useState(false);
  const [isNavigatingToEdit, setIsNavigatingToEdit] = useState(false);
  // Refs, not state: these block a second click within the same render.
  const approveInFlight = useRef(false);
  const submitInFlight = useRef(false);

  const [changeMessage, setChangeMessage] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const [p2MadeChanges, setP2MadeChanges] = useState(false);
  const [justSubmittedByP1, setJustSubmittedByP1] = useState(false);

  useEffect(() => {
    if (caseId) {
      dispatch(getCasesDetails(caseId));
    }
  }, [dispatch, caseId]);

  const myProgress = getSectionProgress(myData, MY_PARTNER_KEYS);
  const partnerProgress = getSectionProgress(partnerData, MY_PARTNER_KEYS);
  const jointProgress = getSectionProgress(jointData, JOINT_KEYS);
  const matrimonialProgress = getSectionProgress(jointData, MATRIMONIAL_KEYS);

  const isJointComplete = jointProgress.isComplete;
  const isMatrimonialComplete = matrimonialProgress.isComplete;

  const areAllSectionsComplete =
    myProgress.isComplete &&
    partnerProgress.isComplete &&
    isJointComplete &&
    isMatrimonialComplete;

  const isUser1Approved = Boolean(cases?.approval?.user1Approved);
  const isUser2Approved = Boolean(cases?.approval?.user2Approved);

  const isMutualApproved = isUser1Approved && isUser2Approved;

  const isWaitingForPartnerReview = iAmWaitingForReview || justSubmittedByP1;

  const canSendForReview = canEdit && areAllSectionsComplete && !isWaitingForPartnerReview;
  const canApprove = isMyTurnToApprove && areAllSectionsComplete;
  const hasPartnerJoined = Boolean(cases?.invitedUser?._id);

  // Why the action button is disabled, in the order the user can fix it
  const blockedReason = !areAllSectionsComplete
    ? !myProgress.isComplete
      ? ""
      : !partnerProgress.isComplete
        ? hasPartnerJoined
          ? "Waiting for your partner to complete their information."
          : "Invite your partner so they can complete their information."
        : !isJointComplete
          ? "Complete all joint information and matrimonial agreement forms to continue."
          : "Complete the Matrimonial Agreement & Intentions to continue."
    : !canEdit && !isMyTurnToApprove
      ? "Your partner is editing the information right now."
      : null;

  // "My Information" is always the signed-in partner's own section, so each
  // unfinished form links to where they can fill it in.
  const myName = myData?.personalInformation?.firstName
    ? `${myData.personalInformation.firstName} ${myData.personalInformation.lastName ?? ""}`
    : user?.firstName
      ? `${user.firstName} ${user.lastName ?? ""}`
      : "Provided";

  const myRows: FormRow[] = [
    { key: "personalInformation", label: "Personal Details", detail: myName, href: "/dashboard/personal-info" },
    {
      key: "legalDeclaration",
      label: "Legal Declaration",
      detail: "Full disclosure & statutory declarations accepted",
      href: "/dashboard/legal-declaration",
    },
    {
      key: "familyAndDependents",
      label: "Dependents & Family",
      detail: "Registered & reviewed",
      href: "/dashboard/family",
    },
    {
      key: "individualAssets",
      label: "Individual Assets",
      detail: "Assets disclosed",
      href: "/dashboard/individual_assets",
    },
    {
      key: "incomeAndRevenue",
      label: "Income & Revenue",
      detail: "Income disclosed",
      href: "/dashboard/income_revenue",
    },
    {
      key: "liabilitiesAndDebts",
      label: "Liabilities & Debts",
      detail: "Debts disclosed",
      href: "/dashboard/liabilities_debts",
    },
  ];

  // The other party's forms are read-only, until this partner has sent the
  // case back for changes: then the same forms open on the partner's answers.
  const partnerHref = (slug: string) =>
    iDisapproved ? `/dashboard/partner-${slug}` : undefined;
  const partnerRows: FormRow[] = [
    {
      key: "personalInformation",
      label: "Partner Details",
      detail: partnerData?.personalInformation?.firstName
        ? `${partnerData.personalInformation.firstName} ${partnerData.personalInformation.lastName ?? ""}`
        : "Provided by partner",
      href: partnerHref("personal-info"),
    },
    { key: "legalDeclaration", label: "Legal Declaration", detail: "Declarations accepted", href: partnerHref("legal-declaration") },
    { key: "familyAndDependents", label: "Dependents & Family", detail: "Registered & reviewed", href: partnerHref("family") },
    { key: "individualAssets", label: "Individual Assets", detail: "Assets disclosed", href: partnerHref("individual_assets") },
    { key: "incomeAndRevenue", label: "Income & Revenue", detail: "Revenue streams disclosed", href: partnerHref("income_revenue") },
    { key: "liabilitiesAndDebts", label: "Liabilities & Debts", detail: "Debt schedules disclosed", href: partnerHref("liabilities_debts") },
  ];

  // Joint forms are editable by whoever holds the pen
  const jointRows: FormRow[] = [
    {
      key: "jointAssets",
      label: "Joint Assets",
      detail: (jointData as any)?.jointAssets?.livingArrangement
        ? `Living arrangements: ${(jointData as any).jointAssets.livingArrangement}`
        : "Properties & accounts disclosed",
      href: canEdit ? "/dashboard/joint-assets" : undefined,
    },
    {
      key: "jointIncomeAndRevenue",
      label: "Joint Income & Revenue",
      detail: "Shared income disclosed",
      href: canEdit ? "/dashboard/joint-income-revenue" : undefined,
    },
    {
      key: "jointLiabilitiesAndDebts",
      label: "Joint Liabilities & Debts",
      detail: "Shared debts & treatment specified",
      href: canEdit ? "/dashboard/joint-liabilities-debts" : undefined,
    },
  ];

  // All of these come from the one Matrimonial Agreement form
  const matrimonialRows: FormRow[] = [
    {
      key: "matrimonialAgreement",
      label: "Future Assets & Debts",
      detail: labelFor(FUTURE_ASSETS_LABELS, matrimonialData?.futureAssetsTreatment),
      href: canEdit ? "/dashboard/matrimonial-agreement" : undefined,
    },
    {
      key: "matrimonialAgreement",
      label: "Spousal Maintenance",
      detail: labelFor(SPOUSAL_MAINTENANCE_LABELS, matrimonialData?.spousalMaintenanceIntention),
      href: canEdit ? "/dashboard/matrimonial-agreement" : undefined,
    },
    {
      key: "matrimonialAgreement",
      label: "Agreement Review Triggers",
      detail: labelFor(REVIEW_TRIGGER_LABELS, matrimonialData?.reviewTriggerType),
      href: canEdit ? "/dashboard/matrimonial-agreement" : undefined,
    },
  ];

  // Handlers
  // "Make Changes" while the partner's request is waiting on you hands editing
  // control to you and clears both approvals. The reason is asked for when you
  // send it back, not here.
  const handleReviewerMakeChanges = async () => {
    if (!caseId || isUnlockingChanges) return;
    setIsUnlockingChanges(true);
    setActionError(null);
    try {
      await Axios.post(`/cases/${caseId}/reject`, {});
      dispatch(
        updateJointInformationStatus({ submitted: false, submittedBy: myId ?? null }),
      );
      dispatch(
        updateApproval({
          user1Approved: false,
          user2Approved: false,
          disapprovedBy: myId ?? null,
          disapprovalReason: null,
        } as any),
      );
      await dispatch(getCasesDetails(caseId));
      setP2MadeChanges(true);
      toast.success("Information unlocked. You can now edit or continue editing.");
    } catch (err) {
      setActionError(
        getErrorMessage(err, "Couldn't open the information for changes. Please try again."),
      );
    } finally {
      setIsUnlockingChanges(false);
    }
  };

  const handleP1MakeChanges = () => {
    setIsNavigatingToEdit(true);
    router.push("/dashboard/personal-info");
  };

  const handleP2MakeChanges = () => {
    setIsNavigatingToEdit(true);
    setP2MadeChanges(true);
    router.push("/dashboard/personal-info");
  };

  // Filling in the forms only saves them. This is the explicit "send the
  // approval request", and it is what puts the case in front of the partner.
  const handleConfirmSubmitForPartnerReview = async () => {
    if (submitInFlight.current) return;
    submitInFlight.current = true;
    setIsSubmitting(true);
    setActionError(null);
    try {
      if (!caseId) return;

      if (!matrimonialData || Object.keys(matrimonialData).length === 0) {
        setShowExhibitBModal(false);
        toast.info("Please complete the Matrimonial Agreement form first.");
        router.push("/dashboard/matrimonial-agreement");
        return;
      }

      await Axios.post(
        `/cases/${caseId}/joint-information/submit`,
        { message: changeMessage.trim() },
      );

      dispatch(
        updateJointInformationStatus({
          submitted: true,
          submittedBy: myId ?? null,
        }),
      );
      dispatch(
        updateApproval(
          isOwner
            ? { user1Approved: true, user2Approved: false }
            : { user2Approved: true, user1Approved: false },
        ),
      );
      await dispatch(getCasesDetails(caseId));
      setJustSubmittedByP1(true);
      setChangeMessage("");
      setShowExhibitBModal(false);
      toast.success("Approval request sent to your partner.");
    } catch (err) {
      setShowExhibitBModal(false);
      setActionError(
        getErrorMessage(err, "Couldn't send the approval request right now. Please try again."),
      );
    } finally {
      submitInFlight.current = false;
      setIsSubmitting(false);
    }
  };

  const handleConfirmApprove = async () => {
    if (!exhibitDConfirmed) return;
    // setIsApproving only disables the button on the next render, so a quick
    // double click used to send approve + generate twice. The second generate
    // raced the first for the same version number and came back as a 500.
    if (approveInFlight.current) return;
    approveInFlight.current = true;
    setIsApproving(true);
    try {
      if (caseId) {
        await Axios.post(`/cases/${caseId}/approve`);
        dispatch(updateApproval({ user2Approved: true }));
        // The approval is already saved; a failed draft must not look like a
        // failed approval, but it must not pass silently either.
        try {
          await Axios.post(`/agreement/${caseId}/document/generate`);
          toast.success("Mutual confirmation complete!");
        } catch (error) {
          toast.error(
            getErrorMessage(
              error,
              "Approved, but the agreement document couldn't be generated.",
            ),
          );
        }
        await dispatch(getCasesDetails(caseId));
      } else {
        dispatch(updateApproval({ user2Approved: true }));
        toast.success("Mutual confirmation complete!");
      }
      setShowExhibitDModal(false);
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't approve right now. Please try again."));
    } finally {
      approveInFlight.current = false;
      setIsApproving(false);
    }
  };

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  // Helper formatting for timestamps — when the approval request went out
  const sentAt =
    (cases?.status?.jointInformation as any)?.submittedAt ||
    (isOwner ? cases?.approval?.user1ApprovedAt : cases?.approval?.user2ApprovedAt);

  const formattedTime = sentAt
    ? new Date(sentAt).toLocaleDateString("en-GB", {
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


  if (isMutualApproved) {
    const p1PersonalInfo = (isOwner ? myData : partnerData)?.personalInformation as any;
    const p2PersonalInfo = (isOwner ? partnerData : myData)?.personalInformation as any;

    const p1Name =
      (p1PersonalInfo?.firstName
        ? `${p1PersonalInfo.firstName} ${p1PersonalInfo.lastName ?? ""}`.trim()
        : "") ||
      (cases?.owner?.firstName
        ? `${cases.owner.firstName} ${cases.owner.lastName ?? ""}`.trim()
        : "") ||
      "Partner 1";

    const p2Name =
      (p2PersonalInfo?.firstName
        ? `${p2PersonalInfo.firstName} ${p2PersonalInfo.lastName ?? ""}`.trim()
        : "") ||
      (cases?.invitedUser?.firstName
        ? `${cases.invitedUser.firstName} ${cases.invitedUser.lastName ?? ""}`.trim()
        : "") ||
      (cases?.partnerInviteDetails?.firstName
        ? `${cases.partnerInviteDetails.firstName} ${cases.partnerInviteDetails.lastName ?? ""}`.trim()
        : "") ||
      "Partner 2";

    const submissionDateRaw =
      cases?.approval?.mutualApprovalCompletedAt ||
      cases?.approval?.user2ApprovedAt ||
      cases?.approval?.user1ApprovedAt ||
      cases?.status?.jointInformation?.submittedAt ||
      new Date().toISOString();

    const formattedSubmissionDate = new Date(submissionDateRaw).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return (
      <div className="min-h-screen bg-[#F8F9FC] px-4 py-8 md:px-8">
        {/* Outer Container with enhanced width & comfortable padding */}
        <div className="mx-auto max-w-[720px] rounded-2xl border border-[#EDEDF5] bg-white p-5 shadow-xs md:p-7">
          {/* Top Green Box: Mutual Approval Completed */}
          <div className="rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-6 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mt-3 text-lg font-bold text-[#15803D] md:text-xl">
              Mutual Approval Completed 🎉
            </h1>
            <p className="mx-auto mt-1 max-w-lg text-xs leading-relaxed text-[#374151] md:text-sm">
              Both applicants have reviewed and approved the same version of the agreement and financial disclosures.
            </p>
            <div className="mt-3">
              <span className="inline-block rounded-full bg-[#DCFCE7] px-4 py-1 text-xs font-semibold text-[#16A34A]">
                Successfully Submitted
              </span>
            </div>
          </div>

          {/* Middle Box: Approval Summary */}
          <div className="mt-4 rounded-xl border border-[#EDEDF5] bg-[#FDFDFE] p-5 md:p-6">
            <h2 className="text-sm font-bold text-[#1E1B3C] md:text-base">
              Approval Summary
            </h2>

            <div className="mt-3.5 space-y-3">
              <div className="flex items-center justify-between text-xs md:text-sm">
                <span className="font-semibold text-[#1E1B3C]">{p1Name}</span>
                <span className="rounded-full bg-[#DCFCE7] px-3 py-0.5 text-xs font-semibold text-[#16A34A]">
                  Approved
                </span>
              </div>

              <div className="flex items-center justify-between text-xs md:text-sm">
                <span className="font-semibold text-[#1E1B3C]">{p2Name}</span>
                <span className="rounded-full bg-[#DCFCE7] px-3 py-0.5 text-xs font-semibold text-[#16A34A]">
                  Approved
                </span>
              </div>
            </div>

            <div className="my-4 border-t border-[#EDEDF5]" />

            <div className="space-y-2.5 text-xs md:text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Submission date</span>
                <span className="font-medium text-[#1E1B3C]">
                  {formattedSubmissionDate}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Next stage</span>
                <span className="font-bold text-[#1E1B3C]">
                  Case Manager Review
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Button: Go to Dashboard */}
          <div className="mt-4">
            <Link
              href="/dashboard"
              className="flex w-full items-center justify-center rounded-full bg-[#16A34A] py-3.5 text-sm font-semibold text-white shadow-xs transition hover:bg-[#15803D]"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (partnerDisapproved && isWaitingOnPartner) {
    const reason = cases?.approval?.disapprovalReason;
    return (
      <div className="min-h-screen bg-[#F8F9FC] px-4 py-8 md:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex items-start gap-4 rounded-2xl border border-[#FDE68A] bg-[#FEF9C3]/70 p-5 shadow-sm md:p-6">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#F59E0B]/15 text-[#B45309]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M16.732 3.732a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1E1B3C]">
                Your partner sent the review back
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-[#6B6B80]">
                They did not approve the information and are making changes now. You
                will be asked to review and approve once they resubmit.
              </p>
            </div>
          </div>

          {reason && (
            <div className="rounded-2xl border border-[#E7E7F2] bg-white p-5 shadow-sm md:p-6">
              <h3 className="text-sm font-bold text-[#1E1B3C]">
                What they asked to change
              </h3>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[#6B6B80]">
                {reason}
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-[#E7E7F2] bg-white p-5 shadow-sm md:p-6">
            <p className="text-sm text-[#6B6B80]">
              You cannot edit the joint information while your partner has it. Check
              back shortly, or review the rest of your details in the meantime.
            </p>
            <Link
              href="/dashboard"
              className="mt-4 inline-block rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary/90"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }


  if (isWaitingForPartnerReview && !isMyTurnToApprove) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] px-4 py-8 md:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
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

          <PartnerMessageThread
            timeline={cases?.approval?.reviewTimeline}
            fallback={latestMessage}
            ownerName={ownerName}
            partnerName={invitedName}
            isOwner={isOwner}
          />

          <div className="grid gap-6 md:grid-cols-2">
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

            <div className="flex flex-col justify-between rounded-2xl border border-[#E7E7F2] bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-base font-bold text-[#1E1B3C]">Current Status</h2>

                <div className="mt-5 space-y-4">
                  {cases?.approval?.reviewTimeline && cases.approval.reviewTimeline.length > 0 ? (
                    cases.approval.reviewTimeline.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3.5">
                        <div
                          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${item.action.includes("Completed")
                            ? "bg-[#DCFCE7] text-[#16A34A]"
                            : item.action.includes("Requested")
                              ? "bg-[#FEF3C7] text-[#B45309]"
                              : "bg-[#EDE9FE] text-[#6D28D9]"
                            }`}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            className="h-4 w-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-[#1E1B3C]">
                              {item.action}
                            </span>
                            <span className="text-[11px] text-[#9494AA]">
                              {item.timestamp
                                ? new Date(item.timestamp).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                                : formattedTime}
                            </span>
                          </div>
                          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-[#6B6B80]">
                            <span>
                              P1: <strong className="text-[#1E1B3C]">{item.p1Status}</strong>
                            </span>
                            <span>•</span>
                            <span>
                              P2: <strong className="text-[#1E1B3C]">{item.p2Status}</strong>
                            </span>
                            <span>•</span>
                            <span>
                              Mutual:{" "}
                              <strong
                                className={
                                  item.mutualStatus === "COMPLETED"
                                    ? "text-[#16A34A]"
                                    : "text-amber-600"
                                }
                              >
                                {item.mutualStatus}
                              </strong>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-start gap-3.5">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            className="h-4 w-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-[#1E1B3C]">Primary Applicant</span>
                            <span className="text-[11px] text-[#9494AA]">{formattedTime}</span>
                          </div>
                          <div className="text-xs font-medium text-[#16A34A]">Submitted for Review</div>
                        </div>
                      </div>

                      {/* Vertical connector */}
                      <div className="ml-4 -my-2 h-5 border-l-2 border-dashed border-[#CBD5E1]" />

                      {/* Step 2: Partner - Review Pending */}
                      <div className="flex items-start gap-3.5">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[#3B82F6]">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            className="h-4 w-4"
                          >
                            <circle cx="12" cy="12" r="9" />
                            <path strokeLinecap="round" d="M12 7v5l3 3" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-[#1E1B3C]">Secondary Applicant</span>
                            <span className="text-[11px] text-[#9494AA]">—</span>
                          </div>
                          <div className="text-xs font-medium text-[#3B82F6]">Review Pending</div>
                        </div>
                      </div>
                    </>
                  )}
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

  return (
    <div className="min-h-screen bg-[#F8F9FC] px-4 py-5 md:px-6">
      <div className="mx-auto max-w-[760px] space-y-3.5">
        {/* Top Header */}
        <div>
          <h1 className="text-lg font-bold tracking-tight text-[#1E1B3C] md:text-xl">
            Review &amp; Confirm Your Information
          </h1>
          <p className="mt-1 text-xs leading-relaxed text-[#6B6B80] md:text-[13px]">
            Please carefully review your personal information, financial disclosures and joint agreement preferences before submitting them for mutual approval. You can return to any section to make changes before submitting.
          </p>
        </div>

        {/* Every message the two of you have sent with a round of changes */}
        <PartnerMessageThread
          timeline={cases?.approval?.reviewTimeline}
          fallback={latestMessage}
          ownerName={ownerName}
          partnerName={invitedName}
          isOwner={isOwner}
          highlight={isMyTurnToApprove}
        />

        {/* Main Journey Container Card with White Background matching Dashboard */}
        <div className="rounded-2xl border border-[#EDEDF5] bg-white p-4 sm:p-5 shadow-xs">
          {/* 3 Accordion / Summary Cards */}
          <div className="flex flex-col gap-2.5">
            {/* Card 1: My Questionnaire */}
            <div
              className={`rounded-xl border px-3.5 py-2.5 transition-all duration-200 ${openSection === "my-info"
                ? "border-[#DDD6FE] bg-[#FAF9FF] shadow-xs"
                : "border-[#EDEDF5] bg-white hover:border-[#DDD6FE] hover:shadow-xs"
                }`}
            >
              <div
                onClick={() => toggleSection("my-info")}
                className="flex cursor-pointer items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#FBBF24] to-[#F59E0B] text-white text-sm font-bold shadow-xs">
                    1
                  </div>

                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#EDE9FE] text-[#6D28D9]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M6 20c0-4 4-6 6-6s6 2 6 6" />
                    </svg>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-xs md:text-sm font-semibold text-[#1E1B3C]">My Questionnaire</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <StatusBadge progress={myProgress} />
                  <span className="text-[#9494AA]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className={`h-3.5 w-3.5 transition-transform ${openSection === "my-info" ? "rotate-180" : ""}`}
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </div>

              {openSection === "my-info" && (
                <div className="mt-3.5 border-t border-[#F1F1F6] pt-3.5">
                  <FormRowList section={myData} rows={myRows} />

                  <div className="mt-3.5 flex justify-end">
                    <button
                      type="button"
                      onClick={isUser2 ? handleP2MakeChanges : handleP1MakeChanges}
                      className="text-xs font-semibold text-[#6D28D9] hover:underline"
                    >
                      Edit My Information →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Card 2: Partner Questionnaire */}
            <div
              className={`rounded-xl border px-3.5 py-2.5 transition-all duration-200 ${openSection === "partner-info"
                ? "border-[#DDD6FE] bg-[#FAF9FF] shadow-xs"
                : "border-[#EDEDF5] bg-white hover:border-[#DDD6FE] hover:shadow-xs"
                }`}
            >
              <div
                onClick={() => toggleSection("partner-info")}
                className="flex cursor-pointer items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#FB7185] to-[#E11D48] text-white text-sm font-bold shadow-xs">
                    2
                  </div>

                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#EDE9FE] text-[#6D28D9]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 00-3-3.87" />
                      <path d="M16 3.13a4 4 0 010 7.75" />
                    </svg>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-xs md:text-sm font-semibold text-[#1E1B3C]">Partner Questionnaire</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <StatusBadge progress={partnerProgress} />
                  <span className="text-[#9494AA]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className={`h-3.5 w-3.5 transition-transform ${openSection === "partner-info" ? "rotate-180" : ""}`}
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </div>

              {openSection === "partner-info" && (
                <div className="mt-3.5 border-t border-[#F1F1F6] pt-3.5">
                  <FormRowList section={partnerData} rows={partnerRows} />

                  <div className="mt-3.5 flex justify-end">
                    {iDisapproved ? (
                      <Link
                        href="/dashboard/partner-personal-info"
                        className="text-xs font-semibold text-[#6D28D9] hover:underline"
                      >
                        Edit Partner&apos;s Information →
                      </Link>
                    ) : partnerProgress.isComplete ? (
                      <span className="text-xs text-[#9494AA]">
                        Shared by partner (Read-only)
                      </span>
                    ) : hasPartnerJoined ? (
                      <span className="text-xs text-[#B45309]">
                        Your partner still has{" "}
                        {partnerProgress.total - partnerProgress.completed} form
                        {partnerProgress.total - partnerProgress.completed === 1 ? "" : "s"}{" "}
                        to complete
                      </span>
                    ) : (
                      <Link
                        href="/dashboard/invite-partner"
                        className="text-xs font-semibold text-[#6D28D9] hover:underline"
                      >
                        Invite your partner →
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Card 3: Joint Questionnaire */}
            <div
              className={`rounded-xl border px-3.5 py-2.5 transition-all duration-200 ${openSection === "joint-info"
                ? "border-[#DDD6FE] bg-[#FAF9FF] shadow-xs"
                : "border-[#EDEDF5] bg-white hover:border-[#DDD6FE] hover:shadow-xs"
                }`}
            >
              <div
                onClick={() => toggleSection("joint-info")}
                className="flex cursor-pointer items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#34D399] to-[#059669] text-white text-sm font-bold shadow-xs">
                    3
                  </div>

                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#EDE9FE] text-[#6D28D9]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <path d="M14 2v6h6" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <line x1="10" y1="9" x2="8" y2="9" />
                    </svg>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-xs md:text-sm font-semibold text-[#1E1B3C]">Joint Questionnaire</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <StatusBadge progress={jointProgress} />
                  <span className="text-[#9494AA]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className={`h-3.5 w-3.5 transition-transform ${openSection === "joint-info" ? "rotate-180" : ""}`}
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </div>

              {openSection === "joint-info" && (
                <div className="mt-3.5 space-y-4 border-t border-[#F1F1F6] pt-3.5">
                  <div>
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#8A8AA0]">
                      Joint Financial Details
                    </h4>
                    <FormRowList
                      section={jointData}
                      rows={jointRows}
                      columns="sm:grid-cols-3"
                    />
                  </div>

                  <div className="border-t border-[#F1F1F6] pt-3.5">
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#8A8AA0]">
                      Matrimonial Agreement &amp; Intentions
                    </h4>
                    <FormRowList
                      section={jointData}
                      rows={matrimonialRows}
                      columns="sm:grid-cols-3"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#F1F1F6] pt-3">
                    {canEdit ? (
                      <>
                        <Link
                          href="/dashboard/joint-assets"
                          className="text-xs font-semibold text-[#6D28D9] hover:underline"
                        >
                          Edit Joint Information →
                        </Link>
                        <span className="text-[#D1D5DB]">•</span>
                        <Link
                          href="/dashboard/matrimonial-agreement"
                          className="text-xs font-semibold text-[#6D28D9] hover:underline"
                        >
                          Edit Matrimonial Intentions →
                        </Link>
                      </>
                    ) : (
                      <span className="text-xs text-[#9494AA]">
                        Your partner is editing the joint information (Read-only)
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Divider below the questionnaires */}
            <div className="my-3 border-t border-[#EDEDF5]" />

            {/* Review status section / Blue callout when ready */}
            {canSendForReview ? (
              <div className="flex items-start gap-3 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] p-3 sm:p-3.5 transition-all duration-300">
                <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#3B82F6] text-white text-[11px] font-bold">
                  i
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#1E3A8A] sm:text-[13px]">
                    {p2MadeChanges || iDisapproved
                      ? "Ready to submit your changes for approval?"
                      : "Ready to submit for partner review?"}
                  </h3>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-[#2563EB] sm:text-xs">
                    {p2MadeChanges || iDisapproved
                      ? "You have unlocked the information for changes. Once ready, click 'Send for Approval' to send the revised package to your partner, or click 'Continue Editing' to modify questionnaire sections."
                      : "Your information is complete and ready to be shared with your partner. Once submitted, your partner can review the information and approve it or request changes. If any changes are made, you will be asked to review the updated information before providing your confirmation."}
                  </p>
                </div>
              </div>
            ) : isMyTurnToApprove ? (
              <div className="flex items-start gap-3 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] p-3 sm:p-3.5">
                <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#3B82F6] text-white text-[11px] font-bold">
                  i
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#1E3A8A] sm:text-[13px]">
                    Partner review and approval required
                  </h3>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-[#2563EB] sm:text-xs">
                    Please review all sections carefully. You can approve the package as presented, or edit anything and send it back to your partner with a message.
                  </p>
                </div>
              </div>
            ) : canEdit ? (
              <div className="rounded-xl border border-[#EDEDF5] bg-[#FAF9FF] p-3 sm:p-3.5">
                <h3 className="text-xs font-bold text-[#1E1B3C] sm:text-[13px]">
                  {p2MadeChanges || iDisapproved
                    ? "Complete your changes"
                    : "Complete required information"}
                </h3>
                <p className="mt-0.5 text-[11px] leading-relaxed text-[#6B6B80] sm:text-xs">
                  {blockedReason ||
                    "Once both questionnaires and the joint information are complete, you can review and confirm your information."}
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-[#EDEDF5] bg-[#FAF9FF] p-3 sm:p-3.5">
                <h3 className="text-xs font-bold text-[#1E1B3C] sm:text-[13px]">
                  Waiting for your partner
                </h3>
                <p className="mt-0.5 text-[11px] leading-relaxed text-[#6B6B80] sm:text-xs">
                  {iAmWaitingForReview
                    ? "Waiting for your partner to review and approve."
                    : "Once both questionnaires and the joint information are complete, you can review and confirm your information."}
                </p>
              </div>
            )}

            {actionError && (
              <p className="mt-2 text-xs font-medium text-red-500">{actionError}</p>
            )}

            {/* Action Buttons: Stacked Full-Width Pills matching Screenshot */}
            <div className="mt-3 flex flex-col gap-2 sm:gap-2.5">
              {/* Button 1: Edit Information / Continue Editing / Make Changes */}
              <button
                type="button"
                disabled={isUnlockingChanges || isNavigatingToEdit}
                onClick={
                  isMyTurnToApprove
                    ? handleReviewerMakeChanges
                    : isUser1
                      ? handleP1MakeChanges
                      : handleP2MakeChanges
                }
                className="flex w-full items-center justify-center gap-2 rounded-full border border-[#D1D5DB] bg-white py-2.5 text-xs font-semibold text-[#374151] transition-all duration-200 hover:bg-gray-50 disabled:opacity-60 sm:text-sm"
              >
                {isUnlockingChanges ? (
                  <>
                    <svg className="h-4 w-4 animate-spin text-[#6B7280]" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    <span>Opening for changes...</span>
                  </>
                ) : isNavigatingToEdit ? (
                  <>
                    <svg className="h-4 w-4 animate-spin text-[#6B7280]" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    <span>Opening questionnaires...</span>
                  </>
                ) : p2MadeChanges || iDisapproved ? (
                  "Continue Editing"
                ) : isMyTurnToApprove ? (
                  "Make Changes"
                ) : (
                  "Edit Information"
                )}
              </button>

              {/* Button 2: Send for Partner Review / Send for Approval / Approve */}
              {canApprove ? (
                <button
                  type="button"
                  onClick={() => setShowExhibitDModal(true)}
                  className="flex w-full items-center justify-center rounded-full bg-[#16A34A] py-2.5 text-xs font-semibold text-white shadow-xs transition-all duration-200 hover:bg-[#15803D] sm:text-sm"
                >
                  Approve
                </button>
              ) : canSendForReview ? (
                <button
                  type="button"
                  onClick={() => setShowExhibitBModal(true)}
                  className="flex w-full items-center justify-center rounded-full bg-[#16A34A] py-2.5 text-xs font-semibold text-white shadow-xs transition-all duration-200 hover:bg-[#15803D] sm:text-sm"
                >
                  {p2MadeChanges || iDisapproved
                    ? "Send for Approval"
                    : partnerDisapproved
                      ? "Resend for Partner Review"
                      : "Send for Partner Review"}
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  title={blockedReason ?? undefined}
                  className="flex w-full cursor-not-allowed items-center justify-center rounded-full bg-[#E5E7EB] py-2.5 text-xs font-semibold text-[#9CA3AF] sm:text-sm"
                >
                  {p2MadeChanges || iDisapproved
                    ? "Send for Approval"
                    : "Send for Partner Review"}
                </button>
              )}
            </div>
          </div>
        </div>

      </div>

      <ConfirmModal
        isOpen={showExhibitBModal}
        onClose={() => setShowExhibitBModal(false)}
        onConfirm={handleConfirmSubmitForPartnerReview}
        tone="success"
        size="lg"
        title="Ready to send to your partner for review?"
        cancelLabel="Go Back"
        confirmLabel="Send Approval Request"
        loadingLabel="Sending..."
        isLoading={isSubmitting}
        confirmDisabled={Boolean(
          !canSendForReview || (iDisapproved && !changeMessage.trim()),
        )}
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10l18-7-7 18-3-7-8-4z" />
          </svg>
        }
      >
        <div className="text-xs font-semibold uppercase tracking-wider text-[#9494AA]">
          Before you continue:
        </div>

        <div className="mt-3 space-y-3">
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

        <div className="mt-5">
          <label className="block text-xs font-bold text-[#1E1B3C]">
            {iDisapproved
              ? "Why did you change the information?"
              : "Message for your partner (optional)"}
          </label>
          <textarea
            value={changeMessage}
            onChange={(e) => setChangeMessage(e.target.value)}
            rows={4}
            placeholder={
              iDisapproved
                ? "Let your partner know what you changed or why."
                : "Add anything you'd like your partner to know before they review."
            }
            className="mt-2 w-full rounded-xl border border-[#D1D1DC] p-3 text-sm text-[#1E1B3C] outline-none focus:border-[#6a69ff]"
          />
          <p className="mt-1.5 text-[11px] text-[#8A8AA0]">
            {partnerDisplayName} will see this with the request, and it stays in
            your message history.
          </p>
        </div>
      </ConfirmModal>

      <ConfirmModal
        isOpen={showExhibitDModal}
        onClose={() => setShowExhibitDModal(false)}
        onConfirm={handleConfirmApprove}
        tone="success"
        size="lg"
        title="Approve the complete information?"
        description="Please confirm that you have reviewed the complete information and are happy with the current version."
        cancelLabel="Go Back"
        confirmLabel="Approve"
        loadingLabel="Approving..."
        isLoading={isApproving}
        confirmDisabled={!exhibitDConfirmed}
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        }
      >
        {/* Blue Callout Box with 4 checklist items */}
        <div className="mt-4 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] p-4 text-xs">
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

        {/* Confirmation checkbox: the Approve button stays disabled until ticked */}
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
      </ConfirmModal>
    </div>
  );
}

