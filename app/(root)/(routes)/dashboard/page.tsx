"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ChartNoAxesCombined,
  Check,
  Lock,
  Send,
  UserRoundCheck,
  UserRoundPlus,
} from "lucide-react";
import { FaUserPlus } from "react-icons/fa6";
import { LuChartNoAxesCombined } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store/store";
import { getCasesDetails } from "@/store/asyncThunk/casesThunk";
import {
  calculateOverallProgress,
  JOINT_KEYS,
  MY_PARTNER_KEYS,
} from "@/lib/progressCalculator";
import { resolvePartyInformation } from "@/lib/caseSections";
import type { StepConfig, StepId } from "@/types/dashboard/dashboard-home";
import { useJointSectionStatus } from "@/hooks/useJointSectionStatus";
import { isCaseManagerApproved } from "@/lib/caseStage";
import { isCasePaid } from "@/lib/casePayment";
import Axios from "@/lib/ApiConfig";
import { AlertModal } from "@/components/modals";
import type { AlertModalProps, AlertTone } from "@/types/ui/modal";
import { ServiceStatus } from "@/components/ServiceStatus";
import CaseManagerCard from "@/components/dashboard/CaseManagerCard";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import AgreementDocumentCard from "@/components/dashboard/AgreementDocumentCard";
import LegalAdviceJourney from "@/components/dashboard/LegalAdviceJourney";
import {
  journeyButtonBase,
  journeyStatusWidth,
} from "@/components/dashboard/journeyRowStyles";
import LegalTeamCard from "@/components/dashboard/LegalTeamCard";
import StatCard, {
  ApprovedPill,
  statCardActionClasses,
  statCardBadgeClasses,
  statCardCaptionClasses,
} from "@/components/dashboard/StatCard";

const steps: StepConfig[] = [
  {
    id: "questionnaire",
    title: "My Questionnaire",
    description: "Complete your personal details & terms",
    cta: "Select Terms",
    completedLabel: "Completed",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-5 w-5"
      >
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    id: "partner_questionnaire",
    title: "Partner's Questionnaire",
    description: "Your partner completes their details & terms.",
    cta: "Select Terms",
    completedLabel: "Completed",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-5 w-5"
      >
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    id: "joint_questionnaire",
    title: "Joint Questionnaire",
    description:
      "Complete and review your shared financial and agreement information.",
    cta: "Select Terms",
    completedLabel: "Completed",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-5 w-5"
      >
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    id: "final_review",
    title: "Mutual Review & Agreement",
    description: "Review and confirm your agreement.",
    cta: "Review & Submit",
    completedLabel: "Completed",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-5 w-5"
      >
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

// Step one is the only one open before the case is paid for: its CTA is the
// personal questionnaire, the single route the sidebar also leaves unlocked.
const FIRST_STEP_ID = steps[0].id;

const STEP_TILES: Record<StepId, string> = {
  questionnaire: "from-[#FBBF24] to-[#F59E0B]",
  partner_questionnaire: "from-[#FB7185] to-[#E11D48]",
  joint_questionnaire: "from-[#34D399] to-[#059669]",
  final_review: "from-[#60A5FA] to-[#2563EB]",
};

function ProgressDial({
  percent,
  completed,
  total,
}: {
  percent: number;
  completed: number;
  total: number;
}) {
  const size = 44;
  const stroke = 3;
  const center = size / 2;
  const radius = center - stroke / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (circumference * Math.min(Math.max(percent, 0), 100)) / 100;

  return (
    <div className="relative h-11 w-11 flex-shrink-0">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-11 w-11 -rotate-90">
        <circle cx={center} cy={center} r={center} fill="#F6F6FB" />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#EDEDF5"
          strokeWidth={stroke}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#6D4AFF"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - filled}
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-[#6B6B80]">
        {completed} / {total}
      </span>
    </div>
  );
}

function CircularProgress({ percent }: { percent: number }) {
  const size = 48;
  const stroke = 3.5;
  const center = size / 2;
  const radius = center - stroke / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (circumference * Math.min(Math.max(percent, 0), 100)) / 100;

  return (
    <div
      className="relative h-12 w-12 flex-shrink-0"
      title={`${percent}% Complete`}
    >
      <svg viewBox={`0 0 ${size} ${size}`} className="h-12 w-12 -rotate-90">
        <circle cx={center} cy={center} r={center} fill="#F6F6FB" />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#EDEDF5"
          strokeWidth={stroke}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#6D4AFF"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - filled}
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-[#1E1B3C]">
        {percent}%
      </span>
    </div>
  );
}

function StepTrack({ completed, total }: { completed: number; total: number }) {
  if (total <= 0) {
    return <div className="h-1.5 w-full rounded-full bg-[#EDEDF5]" />;
  }

  return (
    <div className="flex w-full items-center gap-1" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            i < completed ? "bg-[#6D4AFF]" : "bg-[#EDEDF5]"
          }`}
        />
      ))}
    </div>
  );
}

const hasData = (obj: unknown): boolean => {
  if (!obj || typeof obj !== "object") return false;
  return Object.keys(obj).length > 0;
};

const hasAllKeys = (
  section: Record<string, any> | undefined,
  keys: string[],
): boolean => keys.every((key) => hasData(section?.[key]));

const QUESTIONNAIRE_KEYS = MY_PARTNER_KEYS;


type StepProgress = "not-started" | "in-progress" | "completed";

const hasAnyKey = (
  section: Record<string, any> | undefined,
  keys: string[],
): boolean => keys.some((key) => hasData(section?.[key]));

/** The status a journey row reports, whoever fills that section in. */
const statusText = (progress: StepProgress) =>
  progress === "completed"
    ? "Completed"
    : progress === "in-progress"
      ? "In Progress"
      : "Not Started";

/** One fixed size for every row action, so the buttons line up. */
const stepButtonBase = journeyButtonBase;
const stepButtonDone = `${stepButtonBase} bg-[#DCFCE7] text-[#16A34A] hover:bg-[#BBF7D0]`;
const stepButtonTodo = `${stepButtonBase} bg-primary text-white hover:bg-primary/90`;
const stepButtonMuted = `${stepButtonBase} bg-[#F1F1F6] text-[#9494AA] hover:bg-[#E8E8F0]`;
const stepButtonReview = `${stepButtonBase} bg-[#16A34A] text-white shadow-sm hover:bg-[#15803D]`;
const stepButtonWaiting = `${stepButtonBase} bg-amber-100 text-amber-700`;
const stepButtonLockedBase = `${stepButtonBase} gap-1.5 bg-[#F1F1F6] text-[#9494AA]`;
/** Dead end: the step stays shut until the case is paid for. */
const stepButtonLocked = `${stepButtonLockedBase} cursor-not-allowed opacity-80`;
/** Clickable: opens the popup that explains why the step is still locked. */
const stepButtonLockedInfo = `${stepButtonLockedBase} hover:bg-[#E8E8F0]`;

type InviteSummary = {
  status?: string;
  invitee?: { email?: string | null };
};

type PopupId =
  | "p1-joint-initial"
  | "p2-joint-initial"
  | "p1-review-locked"
  | "p2-review-waiting"
  | "awaiting-review"
  | "my-quest-complete"
  | "joint-quest-complete";

/**
 * The two "you're done" popups are one-offs per case: the completion flags
 * they watch stay true for good, so without this they would greet the user on
 * every visit to the dashboard.
 */
function celebrationSeen(caseId: string, id: PopupId): boolean {
  try {
    return localStorage.getItem(`prenup_done_${id}_${caseId}`) === "1";
  } catch {
    // No storage (private mode): better silent than on every load.
    return true;
  }
}

function markCelebrationSeen(caseId: string, id: PopupId) {
  try {
    localStorage.setItem(`prenup_done_${id}_${caseId}`, "1");
  } catch {
    // As above.
  }
}

export default function PrenupDashboard() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.auth);
  const cases = useSelector((state: RootState) => state.cases);

  const isUser1 = user?.endUserType === "user1";
  const isUser2 =
    user?.endUserType === "user2" ||
    (Boolean(cases?.owner?._id) &&
      String(user?._id) === String((cases as any)?.invitedUser?._id));

  const [invite, setInvite] = useState<InviteSummary | null | undefined>(
    undefined,
  );
  const inviteCaseId = user?.inviteCaseId;

  useEffect(() => {
    if (inviteCaseId) {
      dispatch(getCasesDetails(inviteCaseId));
    }
  }, [inviteCaseId, dispatch]);


  useEffect(() => {
    if (!inviteCaseId) return;
    const handleFocus = () => {
      dispatch(getCasesDetails(inviteCaseId));
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [inviteCaseId, dispatch]);

  const expectsInvite = Boolean(inviteCaseId) && isUser1;
  const [inviteSettledFor, setInviteSettledFor] = useState<string | null>(null);
  const inviteSettled = !expectsInvite || inviteSettledFor === inviteCaseId;

  useEffect(() => {
    if (!expectsInvite) return;

    let cancelled = false;
    Axios.get(`cases/${inviteCaseId}/invite`)
      .then(({ data }) => {
        if (!cancelled) {
          setInvite(data?.invite ?? null);
          if (data?.invite) {
            dispatch(getCasesDetails(inviteCaseId));
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setInviteSettledFor(inviteCaseId);
      });

    return () => {
      cancelled = true;
    };
  }, [inviteCaseId, expectsInvite, dispatch]);

  const isPartnerInvited =
    Boolean(cases?.partnerInvited) ||
    Boolean(cases?.invitedEmail) ||
    (invite === undefined ? false : invite !== null);
  const hasP2Joined = Boolean((cases as any)?.invitedUser?._id);
  const isPartnerComplete = isUser2 || hasP2Joined || isPartnerInvited;
  const isBothCompleted = Boolean(cases?.agreementType) && isPartnerComplete;

  const ownerName =
    [cases?.owner?.firstName, cases?.owner?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    cases?.owner?.email ||
    "Your partner";

  const inviteName = [
    cases?.partnerInviteDetails?.firstName,
    cases?.partnerInviteDetails?.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  const invitedUserName = [
    cases?.invitedUser?.firstName,
    cases?.invitedUser?.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  const partnerName = isUser2
    ? ownerName
    : invitedUserName || inviteName || cases?.invitedEmail || "Your partner";
  const partnerEmail = isUser2
    ? (cases?.owner?.email ?? "")
    : (cases?.invitedUser?.email ??
      invite?.invitee?.email ??
      cases?.invitedEmail ??
      "");

  const { mine: myQuestData, theirs: partnerQuestData } =
    resolvePartyInformation(
      user?.endUserType,
      cases?.myInformation,
      cases?.partnerInformation,
    );

  const isMyQuestComplete = hasAllKeys(myQuestData, QUESTIONNAIRE_KEYS);
  const isPartnerQuestComplete = hasAllKeys(
    partnerQuestData,
    QUESTIONNAIRE_KEYS,
  );

  const isQuestionnaireComplete = isMyQuestComplete && isPartnerQuestComplete;

  const isJointComplete =
    Boolean((cases?.jointInformation as any)?.jointAssets) ||
    Boolean((cases?.jointInformation as any)?.jointLiabilitiesAndDebts);

  const myQuestProgress: StepProgress = isMyQuestComplete
    ? "completed"
    : hasAnyKey(myQuestData as Record<string, any>, QUESTIONNAIRE_KEYS)
      ? "in-progress"
      : "not-started";

  const partnerQuestProgress: StepProgress = isPartnerQuestComplete
    ? "completed"
    : hasAnyKey(partnerQuestData as Record<string, any>, QUESTIONNAIRE_KEYS)
      ? "in-progress"
      : "not-started";

  const jointProgress: StepProgress = isJointComplete
    ? "completed"
    : hasAnyKey(cases?.jointInformation as Record<string, any>, JOINT_KEYS)
      ? "in-progress"
      : "not-started";

  // The joint questionnaire is the case owner's to fill in, and stays locked
  // until their own questionnaire is complete. The partner only ever reads it,
  // and only once there is something saved to read.
  const jointLocked = !isMyQuestComplete;
  const jointReadable = jointProgress !== "not-started";

  const areAll4SectionsComplete = isQuestionnaireComplete && isJointComplete;

  const isJointSubmitted = Boolean(
    (cases as any)?.status?.jointInformation?.submitted,
  );
  const isP1SentForReview =
    Boolean((cases as any)?.approval?.user1Approved) || isJointSubmitted;
  const {
    isMyTurnToApprove,
    iAmWaitingForReview,
    partnerDisapproved,
    isWaitingOnPartner,
    lockedOut,
    iDisapproved,
  } = useJointSectionStatus();
  const isMutualApproved = Boolean(
    (cases as any)?.approval?.user1Approved &&
    (cases as any)?.approval?.user2Approved,
  );

  const progressResult = calculateOverallProgress({
    myInformation: cases.myInformation,
    partnerInformation: cases.partnerInformation,
    jointInformation: cases.jointInformation,
  });

  const [activePopup, setActivePopup] = useState<PopupId | null>(null);
  const [completed] = useState<Set<StepId>>(new Set());

  const effectiveCompleted = useMemo(() => {
    const merged = new Set(completed);
    if (isMyQuestComplete) merged.add("questionnaire");
    if (isPartnerQuestComplete) merged.add("partner_questionnaire");
    if (isJointComplete) merged.add("joint_questionnaire");
    if (isMutualApproved) merged.add("final_review");
    return merged;
  }, [
    completed,
    isMyQuestComplete,
    isPartnerQuestComplete,
    isJointComplete,
    isMutualApproved,
  ]);

  const activeIndex = steps.findIndex((s) => !effectiveCompleted.has(s.id));
  const currentIndex = activeIndex === -1 ? steps.length : activeIndex;

  const caseManager =
    cases.assignedCaseManager && typeof cases.assignedCaseManager === "object"
      ? cases.assignedCaseManager
      : null;
  const caseManagerName = [caseManager?.firstName, caseManager?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const caseManagerEmail = caseManager?.email ?? "";

  const isAgreementReady = isMutualApproved;
  const caseManagerApproved = isCaseManagerApproved(
    cases?.approval,
    cases?.workflowStatus,
  );
  const isLegalAdviceStage = isAgreementReady && caseManagerApproved;

  const { mine: myPre, theirs: partnerPre } = resolvePartyInformation<
    Record<string, any>
  >(
    user?.endUserType,
    cases?.preQuestionnaireUser1 as Record<string, any>,
    cases?.preQuestionnaireUser2 as Record<string, any>,
  );

  const isPaymentDone = isCasePaid(cases);

  const senderLocked = lockedOut && !isMutualApproved;
  const reviewerOpen = (isMyTurnToApprove || iDisapproved) && !isMutualApproved;

  const STEP_TARGETS: Record<StepId, string> = {
    questionnaire: "/dashboard/personal-info",
    partner_questionnaire: "/dashboard/partner-personal-info",
    joint_questionnaire: "/dashboard/joint-assets",
    final_review: "/dashboard/final-review-confirmation",
  };

  // The agreement is out for review: whoever sent it waits, and whoever
  // received it reviews. Either way, no section can be edited.
  const inReview = senderLocked || reviewerOpen;

  // Once we have both approved, my own sections are read-only for good.
  const readOnly = isMutualApproved;

  /** "Start" / "Continue" / "Edit" for a section I fill in myself. */
  const ownActionLabel = (progress: StepProgress) => {
    if (readOnly) return "View";
    if (progress === "completed") return "Edit";
    return progress === "in-progress" ? "Continue" : "Start";
  };

  /** The review row reports on the agreement, not on a questionnaire. */
  function reviewStatus() {
    if (isMutualApproved) return "Completed";
    if (isUser2) {
      return isP1SentForReview ? "In Progress" : "Waiting for Partner";
    }
    return areAll4SectionsComplete
      ? "Ready to Submit for Partner Review"
      : "Not Ready";
  }

  const STEP_STATUS: Record<StepId, string> = {
    questionnaire: statusText(myQuestProgress),
    partner_questionnaire: statusText(partnerQuestProgress),
    joint_questionnaire: isUser2
      ? jointReadable
        ? statusText(jointProgress)
        : "Waiting for Partner"
      : jointLocked
        ? "Locked"
        : statusText(jointProgress),
    final_review: reviewStatus(),
  };



  /** A button that only explains, in a popup, why its step is still locked. */
  function lockedButton(popup: PopupId) {
    return (
      <button
        onClick={() => setActivePopup(popup)}
        className={stepButtonLockedInfo}
      >
        <Lock className="h-3 w-3" aria-hidden="true" />
        Locked
      </button>
    );
  }

  function renderStepButton(step: StepConfig) {
    const go = () => router.push(STEP_TARGETS[step.id]);

    if (!isPaymentDone && step.id !== FIRST_STEP_ID) {
      return (
        <button
          disabled
          title="Complete your payment to unlock this step"
          className={stepButtonLocked}
        >
          <Lock className="h-3 w-3" aria-hidden="true" />
          Locked
        </button>
      );
    }

    // I sent the agreement over: every row waits on my partner's review.
    if (senderLocked) {
      return (
        <button
          onClick={() => setActivePopup("awaiting-review")}
          className={`${stepButtonWaiting} opacity-80 hover:opacity-100`}
        >
          Partner Reviewing
        </button>
      );
    }

    // My partner sent it to me: every row is mine to read through.
    if (reviewerOpen) {
      const isFinal = step.id === "final_review";
      return (
        <button
          onClick={go}
          className={isFinal ? stepButtonReview : stepButtonTodo}
        >
          {isFinal ? "Review & Confirm" : "Review"}
        </button>
      );
    }

    if (step.id === "questionnaire") {
      return (
        <button
          onClick={go}
          className={isMyQuestComplete ? stepButtonDone : stepButtonTodo}
        >
          {ownActionLabel(myQuestProgress)}
        </button>
      );
    }

    // My partner's questionnaire is theirs to fill in: I can only read it.
    if (step.id === "partner_questionnaire") {
      return (
        <button
          onClick={go}
          className={isPartnerQuestComplete ? stepButtonDone : stepButtonMuted}
        >
          View (Read Only)
        </button>
      );
    }

    if (step.id === "joint_questionnaire") {
      if (isUser2) {
        return jointReadable ? (
          <button
            onClick={go}
            className={isJointComplete ? stepButtonDone : stepButtonMuted}
          >
            View
          </button>
        ) : (
          lockedButton("p2-joint-initial")
        );
      }

      if (jointLocked) return lockedButton("p1-joint-initial");

      return (
        <button
          onClick={go}
          className={isJointComplete ? stepButtonDone : stepButtonTodo}
        >
          {ownActionLabel(jointProgress)}
        </button>
      );
    }

    if (step.id === "final_review") {
      if (isMutualApproved) {
        return (
          <button onClick={go} className={stepButtonDone}>
            Completed
          </button>
        );
      }

      if (partnerDisapproved && isWaitingOnPartner) {
        return (
          <button
            onClick={go}
            className={`${stepButtonWaiting} hover:bg-amber-200`}
          >
            Partner Making Changes
          </button>
        );
      }

      // The partner never submits: they wait until the agreement reaches them.
      if (isUser2) {
        return isP1SentForReview ? (
          <button onClick={go} className={stepButtonReview}>
            Review &amp; Confirm
          </button>
        ) : (
          lockedButton("p2-review-waiting")
        );
      }

      if (!areAll4SectionsComplete) return lockedButton("p1-review-locked");

      return (
        <button onClick={go} className={stepButtonReview}>
          Review &amp; Submit
        </button>
      );
    }

    return null;
  }

  // Only the case owner fills the joint questionnaire in; the partner reads it.
  const celebration: PopupId | null =
    isJointComplete && isUser1
      ? "joint-quest-complete"
      : isMyQuestComplete
        ? "my-quest-complete"
        : null;

  useEffect(() => {
    const caseId = cases?.caseId;
    if (!caseId || !cases?.hasLoaded || !celebration) return;
    if (celebrationSeen(String(caseId), celebration)) return;

    markCelebrationSeen(String(caseId), celebration);
    // localStorage is the external state here: whether this case has already
    // been congratulated is only knowable on the client, after it loads.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActivePopup(celebration);
  }, [cases?.caseId, cases?.hasLoaded, celebration]);

  const popups: Record<
    PopupId,
    {
      tone: AlertTone;
      title: string;
      body: ReactNode;
      action?: AlertModalProps["action"];
    }
  > = {
    "p1-joint-initial": {
      tone: "info",
      title: "Complete My Questionnaire",
      body: "Please complete all sections of My Questionnaire before proceeding to the Joint Questionnaire. Once completed, you\u2019ll be able to continue.",
    },
    "p2-joint-initial": {
      tone: "info",
      title: "Joint Questionnaire",
      body: "Your partner will submit the completed information for your review.",
    },
    "p1-review-locked": {
      tone: "info",
      title: "Questionnaires Pending Completion",
      body: (
        <>
          <p>
            All three sections should be completed before the agreement can be
            submitted for your partner’s review.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 font-medium text-[#1E1B3C]">
            {steps.slice(0, 3).map((section) => (
              <li key={section.id}>{section.title}</li>
            ))}
          </ul>
        </>
      ),
    },
    "p2-review-waiting": {
      tone: "warning",
      title: "Waiting for Your Partner",
      body: (
        <>
          <p>
            Your partner is completing the required sections. Once they submit
            the agreement, you’ll be able to review it, request changes, or
            approve it.
          </p>
          <p className="mt-2">
            <span className="font-medium text-[#1E1B3C]">In the meantime:</span>{" "}
            If you haven’t completed your My Questionnaire section, please
            complete it so you’re ready for the review.
          </p>
        </>
      ),
    },
    "my-quest-complete": {
      tone: "success",
      title: "My Questionnaire Completed!",
      body: (
        <>
          <p>
            You have successfully completed all six sections of your personal
            questionnaire.
          </p>
          <p className="mt-2">
            <span className="font-medium text-[#1E1B3C]">What’s next?</span>{" "}
            {isUser1
              ? "You can now proceed to the Joint Questionnaire."
              : "Your partner completes the Joint Questionnaire, then sends the agreement over for your review."}
          </p>
        </>
      ),
      action: isUser1
        ? {
            label: "Go to Joint Questionnaire",
            onClick: () => router.push(STEP_TARGETS.joint_questionnaire),
          }
        : undefined,
    },
    "joint-quest-complete": {
      tone: "success",
      title: "Joint Questionnaire Completed!",
      body: (
        <>
          <p>You have completed all four sections of the joint questionnaire.</p>
          <p className="mt-2">
            <span className="font-medium text-[#1E1B3C]">What’s next?</span> You
            can now review the agreement and send it to your partner.
          </p>
        </>
      ),
      action: {
        label: "Review & Submit",
        onClick: () => router.push(STEP_TARGETS.final_review),
      },
    },
    "awaiting-review": {
      tone: "warning",
      title: "Awaiting Partner\u2019s Review",
      body: "Your agreement has been sent to your partner for review. They can review and approve it or make changes and send it back to you.",
    },
  };

  const popup = activePopup ? popups[activePopup] : null;

  const isBootstrapping =
    (Boolean(inviteCaseId) && !cases?.hasLoaded) || !inviteSettled;

  if (isBootstrapping) return <DashboardSkeleton />;

  return (
    <div className=" h-full bg-[#F6F6FB]">
      <div className="mx-auto max-w-5xl px-8 py-8">
        <div>
          <h1 className="text-[1.75rem] font-bold tracking-tight text-[#1E1B3C]">
            Welcome , {user.firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-[#6B6B80]">
            {!isAgreementReady
              ? "Your prenup is taking shape."
              : isLegalAdviceStage
                ? "Your case is approved. Next, each of you picks an independent lawyer."
                : caseManagerName
                  ? "Your draft agreement is ready and your case manager is reviewing it."
                  : "Your draft agreement is ready. A case manager will be assigned to you soon."}
          </p>
        </div>

        {!isBothCompleted && (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <StatCard
              label="Progress"
              icon={
                <LuChartNoAxesCombined className="h-5 w-5 text-[#6D4AFF]" />
              }
              value={
                <>
                  {progressResult?.percentage || 0}
                  <span className="text-lg">%</span>
                </>
              }
              valueAside={
                <ProgressDial
                  percent={progressResult?.percentage || 0}
                  completed={progressResult?.completed || 0}
                  total={progressResult?.total || 0}
                />
              }
              subtitle={
                <StepTrack
                  completed={progressResult?.completed || 0}
                  total={progressResult?.total || 0}
                />
              }
              action={
                <span className={statCardCaptionClasses}>steps complete</span>
              }
            />

            <ServiceStatus
              agreementType={cases?.agreementType}
              approved={isLegalAdviceStage}
            />

            {isUser2 || hasP2Joined ? (
              <StatCard
                label="Your partner"
                icon={
                  isLegalAdviceStage ? (
                    <ApprovedPill />
                  ) : (
                    <UserRoundCheck className="h-5 w-5 text-[#6D4AFF]" />
                  )
                }
                value={partnerName}
                subtitle={partnerEmail || "Partner has joined your case"}
                subtitleTooltip={partnerEmail || undefined}
                action={
                  isLegalAdviceStage ? (
                    <span className={statCardCaptionClasses}>Completed</span>
                  ) : (
                    <span className={statCardBadgeClasses}>
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      Joined
                    </span>
                  )
                }
              />
            ) : isPartnerInvited ? (
              <StatCard
                label="Invite partner"
                icon={<Send className="h-5 w-5 text-[#6D4AFF]" />}
                value="Invitation sent"
                subtitle={partnerEmail || "Waiting for them to join"}
                subtitleTooltip={partnerEmail || undefined}
                action={
                  <button
                    onClick={() => router.push("/dashboard/invite-partner")}
                    className={statCardActionClasses}
                    aria-label="Resend the invitation to your partner"
                  >
                    Resend
                  </button>
                }
              />
            ) : (
              <StatCard
                label="Invite partner"
                icon={<FaUserPlus className="h-5 w-5 text-[#6D4AFF]" />}
                value="Invite your partner"
                subtitle="Send them an email to join"
                action={
                  <button
                    onClick={() => router.push("/dashboard/invite-partner")}
                    className={statCardActionClasses}
                    aria-label="Invite your partner"
                  >
                    Invite
                  </button>
                }
              />
            )}
          </div>
        )}

        {!isAgreementReady && (
          <div className="mt-8 bg-white p-5 rounded-2xl shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-[#1E1B3C]">
                  Your Prenup Journey
                </h2>
                <p className="mt-1 text-sm text-[#6B6B80]">
                  Welcome to your dashboard! This page will help guide you
                  through your prenup journey.
                </p>
              </div>

              {isBothCompleted && (
                <div className="flex flex-col items-center gap-3.5 flex-shrink-0 self-start sm:self-center">
                  <span className="text-xs font-semibold text-[#475569]">
                    Progress
                  </span>
                  <CircularProgress percent={progressResult?.percentage || 0} />
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-col gap-3">
              {steps.map((step, i) => {
                const isActive = i === currentIndex;

                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-4 rounded-2xl border px-4 py-4 transition-colors ${
                      isActive
                        ? "border-[#DDD6FE] bg-[#FAF9FF]"
                        : "border-[#EDEDF5] bg-white"
                    }`}
                  >
                    <div
                      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white text-lg font-bold shadow-sm ${
                        STEP_TILES[step.id]
                      }`}
                    >
                      {i + 1}
                    </div>

                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#EDE9FE] text-[#6D28D9]">
                      {step.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-[#1E1B3C]">
                        {step.title}
                      </div>
                      <div className="mt-1.5 max-w-md text-xs font-medium text-[#4B5563]">
                        {step.description}
                      </div>
                    </div>

                    <div
                      className={`hidden ${journeyStatusWidth} flex-shrink-0 text-right text-xs font-medium text-[#8A8AA0] lg:block`}
                    >
                      {inReview ? "In Progress" : STEP_STATUS[step.id]}
                    </div>

                    {renderStepButton(step)}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reveal-on-complete section */}
        <div
          className={`grid transition-all duration-500 ease-out ${
            isAgreementReady
              ? "mt-6 grid-rows-[1fr] opacity-100"
              : "mt-0 grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="grid items-start gap-6 md:grid-cols-2">
              <AgreementDocumentCard
                caseId={cases?.caseId ?? null}
                agreementType={cases?.agreementType}
              />

              {isLegalAdviceStage ? (
                <LegalTeamCard myPre={myPre} partnerPre={partnerPre} />
              ) : (
                <CaseManagerCard
                  name={caseManagerName || undefined}
                  email={caseManagerEmail || undefined}
                  status={caseManagerName ? "assigned" : "pending"}
                />
              )}
            </div>
          </div>
        </div>

        {isLegalAdviceStage && (
          <LegalAdviceJourney myPre={myPre} partnerPre={partnerPre} />
        )}
      </div>

      {/* ── Popups ────────────────────────────────── */}
      <AlertModal
        isOpen={Boolean(popup)}
        onClose={() => setActivePopup(null)}
        tone={popup?.tone}
        title={popup?.title}
        action={popup?.action}
        closeLabel="Got it"
      >
        {popup?.body}
      </AlertModal>
    </div>
  );
}
