"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  ChartNoAxesCombined,
  Check,
  Send,
  UserRoundCheck,
  UserRoundPlus,
} from "lucide-react";
import { FaUserPlus } from "react-icons/fa6";
import { LuChartNoAxesCombined } from "react-icons/lu";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store";
import { calculateOverallProgress } from "@/lib/progressCalculator";
import type { StepConfig, StepId } from "@/types/dashboard/dashboard-home";
import { useJointSectionStatus } from "@/hooks/useJointSectionStatus";
import Axios from "@/lib/ApiConfig";
import { ServiceStatus } from "@/components/ServiceStatus";
import PendingPartnerInvite from "@/components/dashboard/PendingPartnerInvite";
import StatCard, {
  statCardActionClasses,
  statCardBadgeClasses,
  statCardCaptionClasses,
} from "@/components/dashboard/StatCard";

const steps: StepConfig[] = [
  {
    id: "stage_1",
    stageNumber: "1",
    title: "Stage 1: Registration and Payment",
    description:
      "Applicant registered, partner invited & package payment completed.",
    cta: "View Status",
    completedLabel: "Completed",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-5 w-5"
      >
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    id: "stage_2",
    stageNumber: "2",
    title: "Stage 2: Application — Primary Applicant",
    description:
      "Personal info, declarations, assets, debts, joint finances & matrimonial agreement (10 sections).",
    cta: "Fill Application",
    completedLabel: "Completed",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-5 w-5"
      >
        <path d="M9 3h6l3 3v15H6V3z" />
        <path d="M9 10h6M9 14h6M9 18h3" />
      </svg>
    ),
  },
  {
    id: "stage_3",
    stageNumber: "3",
    title: "Stage 3: Application — Secondary Applicant",
    description:
      "Partner personal info, declarations, assets, income & liabilities (6 sections).",
    cta: "Partner Application",
    completedLabel: "Completed",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-5 w-5"
      >
        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    id: "stage_4",
    stageNumber: "4",
    title: "Stage 4: Partner Review Stage",
    description:
      "Multi-turn package review, approvals & mutual snapshot.",
    cta: "Review & Confirm",
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

// Each step gets its own tile colour, keyed by id
const STEP_TILES: Record<string, string> = {
  stage_1: "from-[#FBBF24] to-[#F59E0B]",
  stage_2: "from-[#34D399] to-[#059669]",
  stage_3: "from-[#FB7185] to-[#E11D48]",
  stage_4: "from-[#60A5FA] to-[#2563EB]",
  questionnaire: "from-[#FBBF24] to-[#F59E0B]",
  partner_questionnaire: "from-[#FB7185] to-[#E11D48]",
  joint_questionnaire: "from-[#34D399] to-[#059669]",
  final_review: "from-[#60A5FA] to-[#2563EB]",
};


const legalAdvisers = [
  {
    name: "David Miller, QC",
    role: "Senior Family Solicitor · Apex Legal LLP",
    tag: "SRA regulated #451270",
    initials: "DM",
  },
  {
    name: "Sarah Jenkins",
    role: "Partner · Vangard Family Law",
    tag: "SRA regulated #203491",
    initials: "SJ",
  },
];

const caseDocuments = [
  {
    name: "Master Draft Agreement",
    meta: "v1.2 · Updated 21 Jul 2026",
    status: "download" as const,
  },
  {
    name: "Schedule of Assets (Combined)",
    meta: "v1.0 · Updated 20 Jul 2026",
    status: "download" as const,
  },
  {
    name: "Legal Advice Certificate (P1)",
    meta: "Pending solicitor review",
    status: "locked" as const,
  },
];

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="h-3.5 w-3.5"
    >
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 018 0v3" />
    </svg>
  );
}

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

// The step count sits inside a ring that fills by the same percentage, so
// the figure beside it never stands alone.
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
  // The stroke straddles the radius, so the ring has to sit half of it
  // inside the box or it clips against its own viewBox.
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

// One dash per step, so the row is a count the eye can check as well as a
// bar. The ring and the percentage already say it as a figure.
function StepTrack({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
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

// Object presence check — just needs to exist with at least one key
const hasData = (obj: unknown): boolean => {
  if (!obj || typeof obj !== "object") return false;
  return Object.keys(obj).length > 0;
};

// Checks a set of keys all exist on a given section (myInformation / partnerInformation)
const hasAllKeys = (
  section: Record<string, any> | undefined,
  keys: string[],
): boolean => keys.every((key) => hasData(section?.[key]));

const QUESTIONNAIRE_KEYS = [
  "personalInformation",
  "legalDeclaration",
  "familyAndDependents",
];
const DISCLOSURE_KEYS = [
  "individualAssets",
  "incomeAndRevenue",
  "liabilitiesAndDebts",
];

// What the dashboard needs from GET /cases/:id/invite. The invite page reads
// the rest of it.
type InviteSummary = {
  status?: string;
  invitee?: { email?: string | null };
};

// ─── Popup IDs ───────────────────────────────────────────────────────────────
type PopupId =
  | "p2-joint-initial"
  | "p1-joint-completed"
  | "p2-wait-for-partner";

export default function PrenupDashboard() {
  const router = useRouter();

  const { user } = useSelector((state: RootState) => state.auth);
  const cases = useSelector((state: RootState) => state.cases);

  // ── Role flags ──────────────────────────────────────────────────────────────
  const isUser1 = user?.endUserType === "user1";
  const isUser2 = user?.endUserType === "user2";

  // ── Invite / join state ─────────────────────────────────────────────────────
  // The invite page goes by the invite record, so this card asks for the same
  // one instead of trusting the case's `partnerInvited`: that flag is only
  // ever switched on, and stays on once the invite behind it is gone, which
  // left the card claiming "Invitation sent" with nothing to resend to.
  // undefined means the answer is still on its way.
  const [invite, setInvite] = useState<InviteSummary | null | undefined>(
    undefined,
  );
  const inviteCaseId = user?.inviteCaseId;

  useEffect(() => {
    // Only the case owner may read it, and P2 has nobody to invite.
    if (!inviteCaseId || !isUser1) return;

    let cancelled = false;
    Axios.get(`cases/${inviteCaseId}/invite`)
      .then(({ data }) => {
        if (!cancelled) setInvite(data?.invite ?? null);
      })
      .catch(() => {
        // Leave the case's own fields to answer for it.
      });

    return () => {
      cancelled = true;
    };
  }, [inviteCaseId, isUser1]);

  // Until the record arrives, the address the case saved stands in for it:
  // the same request writes both, so they only disagree once one is cleared.
  const isPartnerInvited =
    invite === undefined ? Boolean(cases?.invitedEmail) : invite !== null;
  // P2 has actually joined when invitedUser has a real _id
  const hasP2Joined = Boolean((cases as any)?.invitedUser?._id);

  const partnerName =
    [cases?.invitedUser?.firstName, cases?.invitedUser?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() || "Your partner";
  const partnerEmail =
    cases?.invitedUser?.email ??
    invite?.invitee?.email ??
    cases?.invitedEmail ??
    "";

  // ── Questionnaire completion ─────────────────────────────────────────────────
  const isMyQuestComplete = hasAllKeys(
    cases?.myInformation,
    QUESTIONNAIRE_KEYS,
  );
  const isPartnerQuestComplete = hasAllKeys(
    cases?.partnerInformation,
    QUESTIONNAIRE_KEYS,
  );

  const isQuestionnaireComplete = isMyQuestComplete && isPartnerQuestComplete;

  const isDisclosureComplete =
    hasAllKeys(cases?.myInformation, DISCLOSURE_KEYS) &&
    hasAllKeys(cases?.partnerInformation, DISCLOSURE_KEYS);

  const isJointComplete =
    Boolean((cases?.jointInformation as any)?.jointAssets) ||
    Boolean((cases?.jointInformation as any)?.jointLiabilitiesAndDebts);

  const areAll4SectionsComplete =
    isQuestionnaireComplete && isDisclosureComplete && isJointComplete;

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

  const isPaymentDone = Boolean(
    cases?.paymentCompleted ||
      (cases as any)?.paymentDone ||
      user?.paymentDone,
  );
  const isStage1Complete = isPaymentDone && hasP2Joined;
  const isStage2Complete =
    isMyQuestComplete &&
    hasAllKeys(cases?.myInformation, DISCLOSURE_KEYS) &&
    isJointComplete;
  const isStage3Complete =
    isPartnerQuestComplete &&
    hasAllKeys(cases?.partnerInformation, DISCLOSURE_KEYS);
  const isStage4Complete = isMutualApproved;

  const [activePopup, setActivePopup] = useState<PopupId | null>(null);
  const [completed] = useState<Set<StepId>>(new Set());

  const effectiveCompleted = useMemo(() => {
    const merged = new Set(completed);
    if (isStage1Complete) merged.add("stage_1");
    if (isStage2Complete) merged.add("stage_2");
    if (isStage3Complete) merged.add("stage_3");
    if (isStage4Complete) merged.add("stage_4");

    // Legacy fallback
    if (isMyQuestComplete) merged.add("questionnaire");
    if (isPartnerQuestComplete) merged.add("partner_questionnaire");
    if (isJointComplete) merged.add("joint_questionnaire");
    if (isMutualApproved) merged.add("final_review");
    return merged;
  }, [
    completed,
    isStage1Complete,
    isStage2Complete,
    isStage3Complete,
    isStage4Complete,
    isMyQuestComplete,
    isPartnerQuestComplete,
    isJointComplete,
    isMutualApproved,
  ]);

  const activeIndex = steps.findIndex((s) => !effectiveCompleted.has(s.id));
  const currentIndex = activeIndex === -1 ? steps.length : activeIndex;
  const allStepsDone = steps.every((s) => effectiveCompleted.has(s.id));

  function renderStepButton(step: StepConfig) {
    const isDone = effectiveCompleted.has(step.id);

    // ── STAGE 1: Registration and Payment ──
    if (step.id === "stage_1") {
      if (isStage1Complete) {
        return (
          <button
            onClick={() => router.push("/dashboard/service-selector")}
            className="ml-4 flex-shrink-0 rounded-lg bg-[#DCFCE7] px-4 py-2 text-xs font-semibold text-[#16A34A] hover:bg-[#BBF7D0]"
          >
            Completed
          </button>
        );
      }
      if (!isPaymentDone) {
        return (
          <button
            onClick={() => router.push("/dashboard/service-selector")}
            className="ml-4 flex-shrink-0 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90"
          >
            Complete Payment
          </button>
        );
      }
      return (
        <button
          onClick={() => router.push("/dashboard/invite-partner")}
          className="ml-4 flex-shrink-0 rounded-lg bg-[#6D28D9] px-4 py-2 text-xs font-semibold text-white hover:bg-[#5B21B6]"
        >
          Invite Partner
        </button>
      );
    }

    // ── STAGE 2: Application — Primary Applicant (10 Sections) ──
    if (step.id === "stage_2" || step.id === "questionnaire") {
      if (isStage2Complete) {
        return (
          <button
            onClick={() => router.push("/dashboard/personal-info")}
            className="ml-4 flex-shrink-0 rounded-lg bg-[#DCFCE7] px-4 py-2 text-xs font-semibold text-[#16A34A] hover:bg-[#BBF7D0]"
          >
            Completed
          </button>
        );
      }
      if (isUser1) {
        return (
          <button
            onClick={() => router.push("/dashboard/personal-info")}
            className="ml-4 flex-shrink-0 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90"
          >
            Fill Application
          </button>
        );
      }
      return (
        <button
          onClick={() => router.push("/dashboard/personal-info")}
          className="ml-4 flex-shrink-0 rounded-lg bg-[#F1F1F6] px-4 py-2 text-xs font-semibold text-[#9494AA] hover:bg-[#E8E8F0]"
        >
          View Details
        </button>
      );
    }

    // ── STAGE 3: Application — Secondary Applicant (6 Sections) ──
    if (step.id === "stage_3" || step.id === "partner_questionnaire") {
      if (isStage3Complete) {
        return (
          <button
            onClick={() => router.push("/dashboard/partner-personal-info")}
            className="ml-4 flex-shrink-0 rounded-lg bg-[#DCFCE7] px-4 py-2 text-xs font-semibold text-[#16A34A] hover:bg-[#BBF7D0]"
          >
            Completed
          </button>
        );
      }
      if (isUser2) {
        return (
          <button
            onClick={() => router.push("/dashboard/partner-personal-info")}
            className="ml-4 flex-shrink-0 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90"
          >
            Fill Application
          </button>
        );
      }
      return (
        <button
          onClick={() => router.push("/dashboard/partner-personal-info")}
          className="ml-4 flex-shrink-0 rounded-lg bg-[#F1F1F6] px-4 py-2 text-xs font-semibold text-[#9494AA] hover:bg-[#E8E8F0]"
        >
          Partner Pending
        </button>
      );
    }

    if (step.id === "joint_questionnaire") {
      if (isDone) {
        if (isUser1) {
          return (
            <button
              onClick={() => setActivePopup("p1-joint-completed")}
              className="ml-4 flex-shrink-0 rounded-lg bg-[#DCFCE7] px-4 py-2 text-xs font-semibold text-[#16A34A] hover:bg-[#BBF7D0]"
            >
              Completed
            </button>
          );
        }
        return (
          <button
            onClick={() => setActivePopup("p2-wait-for-partner")}
            className="ml-4 flex-shrink-0 rounded-lg bg-[#DCFCE7] px-4 py-2 text-xs font-semibold text-[#16A34A] hover:bg-[#BBF7D0]"
          >
            Completed
          </button>
        );
      }
      return (
        <button
          onClick={() => router.push("/dashboard/joint-assets")}
          className="ml-4 flex-shrink-0 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90"
        >
          Select Terms
        </button>
      );
    }

    // ── STAGE 4: Partner Review Stage ──
    if (step.id === "stage_4" || step.id === "final_review") {
      if (isMutualApproved) {
        return (
          <button
            onClick={() => router.push("/dashboard/final-review-confirmation")}
            className="ml-4 flex-shrink-0 rounded-lg bg-[#DCFCE7] px-4 py-2 text-xs font-semibold text-[#16A34A] hover:bg-[#BBF7D0]"
          >
            Completed
          </button>
        );
      }

      if (partnerDisapproved && isWaitingOnPartner) {
        return (
          <button
            onClick={() => router.push("/dashboard/final-review-confirmation")}
            className="ml-4 flex-shrink-0 rounded-lg bg-amber-100 px-4 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-200"
          >
            Partner Making Changes
          </button>
        );
      }

      const p1IsWaiting = iAmWaitingForReview && !isMutualApproved;
      if (p1IsWaiting) {
        return (
          <button
            onClick={() => router.push("/dashboard/final-review-confirmation")}
            className="ml-4 flex-shrink-0 rounded-lg bg-amber-100 px-4 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-200"
          >
            Waiting for Partner Review
          </button>
        );
      }

      const p1CanReview = isUser1 && areAll4SectionsComplete;
      const p2CanReview = isUser2 && isP1SentForReview;
      const canReview = isMyTurnToApprove || p1CanReview || p2CanReview;

      if (canReview) {
        return (
          <button
            onClick={() => router.push("/dashboard/final-review-confirmation")}
            className="ml-4 flex-shrink-0 rounded-lg bg-[#16A34A] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#15803D]"
          >
            Review &amp; Confirm
          </button>
        );
      }

      return (
        <button
          disabled
          className="ml-4 flex-shrink-0 cursor-not-allowed rounded-lg bg-[#93C5FD] px-4 py-2 text-xs font-semibold text-white opacity-80"
        >
          Review &amp; Confirm
        </button>
      );
    }

    return null;
  }

  return (
    <div className=" h-full bg-[#F6F6FB]">
      <div className="mx-auto max-w-5xl px-8 py-8">
        <PendingPartnerInvite />

        <div>
          <h1 className="text-[1.75rem] font-bold tracking-tight text-[#1E1B3C]">
            Welcome , {user.firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-[#6B6B80]">
            {allStepsDone
              ? "Here is the current status of your prenuptial agreement."
              : "Your prenup is taking shape."}
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <StatCard
            label="Overall progress"
            icon={<LuChartNoAxesCombined className="h-5 w-5 text-[#6D4AFF]" />}
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

          <ServiceStatus agreementType={cases?.agreementType} />

          {isUser2 ? (
            <StatCard
              label="Support"
              icon={<BookOpen className="h-5 w-5 text-[#6D4AFF]" />}
              value="Need help?"
              subtitle="Visit our guidance resources."
            />
          ) : hasP2Joined ? (
            <StatCard
              label="Your partner"
              icon={<UserRoundCheck className="h-5 w-5 text-[#6D4AFF]" />}
              value={partnerName}
              subtitle={partnerEmail || "Partner has joined your case"}
              subtitleTooltip={partnerEmail || undefined}
              /* Nothing left to do here, so the slot holds a state, not a
                 button — which also keeps the card's height steady. */
              action={
                <span className={statCardBadgeClasses}>
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  Joined
                </span>
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

        {!allStepsDone && (
          <div className="mt-8 bg-white p-5 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold tracking-tight text-[#1E1B3C]">
              Your Prenup Journey
            </h2>
            <p className="mt-1 text-sm text-[#6B6B80]">
              Welcome to your dashboard! This page will help guide you through your prenup journey.
            </p>

            <div className="mt-5 flex flex-col gap-3">
              {steps.map((step, i) => {
                const isDone = effectiveCompleted.has(step.id);
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
                      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm ${
                        STEP_TILES[step.id]
                      }`}
                    >
                      {step.icon}
                    </div>

                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#EDE9FE] text-sm font-bold text-[#6D28D9]">
                      {i + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-[#1E1B3C]">
                        {step.title}
                      </div>
                      <div className="mt-0.5 max-w-md text-xs text-[#8A8AA0]">
                        {step.description}
                      </div>
                    </div>

                    <div className="hidden w-28 flex-shrink-0 text-right text-xs font-medium text-[#8A8AA0] lg:block">
                      {isDone ? "Completed" : isActive ? "In progress" : "Not started"}
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
            allStepsDone
              ? "mt-6 grid-rows-[1fr] opacity-100"
              : "mt-0 grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Legal advice */}
              <div className="rounded-2xl border border-[#E7E7F2] bg-white p-6">
                <h3 className="text-sm font-semibold text-[#1E1B3C]">
                  Your independent legal advice
                </h3>
                <p className="mt-1 text-xs text-[#8A8AA0]">
                  Under England and Wales law, both partners receive separate
                  advice from independent law firms.
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  {legalAdvisers.map((adviser) => (
                    <div
                      key={adviser.name}
                      className="flex items-center gap-3 rounded-xl border border-[#EDEDF5] p-3"
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#EDE9FE] text-xs font-semibold text-[#5B21B6]">
                        {adviser.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-[#1E1B3C]">
                          {adviser.name}
                        </div>
                        <div className="text-xs text-[#8A8AA0]">
                          {adviser.role}
                        </div>
                        <span className="mt-1 inline-block rounded bg-[#DCFCE7] px-1.5 py-0.5 text-[10px] font-semibold text-[#16A34A]">
                          {adviser.tag}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div className="rounded-2xl border border-[#E7E7F2] bg-white p-6">
                <h3 className="text-sm font-semibold text-[#1E1B3C]">
                  Case documents and drafts
                </h3>
                <p className="mt-1 text-xs text-[#8A8AA0]">
                  Access and download your initial schedules and master
                  agreement files.
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  {caseDocuments.map((doc) => (
                    <div
                      key={doc.name}
                      className="flex items-center justify-between gap-3 rounded-xl border border-[#EDEDF5] p-3"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-[#1E1B3C]">
                          {doc.name}
                        </div>
                        <div className="text-xs text-[#8A8AA0]">{doc.meta}</div>
                      </div>
                      {doc.status === "download" ? (
                        <button className="flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-[#DDD6FE] px-3 py-1.5 text-xs font-semibold text-[#6D28D9] hover:bg-[#FAF9FF]">
                          <DownloadIcon />
                          Download
                        </button>
                      ) : (
                        <span className="flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-[#F1F1F6] px-3 py-1.5 text-xs font-semibold text-[#B4B4C4]">
                          <LockIcon />
                          Locked
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Popups ─────────────────────────────────────────────────────────── */}
      {activePopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setActivePopup(null)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setActivePopup(null)}
              className="absolute right-4 top-4 text-[#9494AA] hover:text-[#1E1B3C]"
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* P2 — Joint initial */}
            {activePopup === "p2-joint-initial" && (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EDE9FE] text-[#6D28D9]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
                    <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" />
                  </svg>
                </div>
                <h2 className="mt-4 text-base font-semibold text-[#1E1B3C]">
                  Joint Questionnaire
                </h2>
                <p className="mt-2 text-sm text-[#6B6B80]">
                  Your partner will submit the completed information for your review.
                </p>
                <p className="mt-1 text-sm text-[#6B6B80]">
                  If you have not completed your{" "}
                  <span className="font-medium text-[#1E1B3C]">Personal Questionnaire</span>,
                  please complete it first.
                </p>
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => {
                      setActivePopup(null);
                      router.push("/dashboard/personal-info");
                    }}
                    className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
                  >
                    Go to My Questionnaire
                  </button>
                  <button
                    onClick={() => setActivePopup(null)}
                    className="rounded-lg border border-[#E7E7F2] px-4 py-2.5 text-sm font-semibold text-[#6B6B80] hover:bg-[#F6F6FB]"
                  >
                    Close
                  </button>
                </div>
              </>
            )}

            {/* P1 — Joint completed (partner to review) */}
            {activePopup === "p1-joint-completed" && (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="mt-4 text-base font-semibold text-[#1E1B3C]">
                  Partner&apos;s Review Pending
                </h2>
                <p className="mt-2 text-sm text-[#6B6B80]">
                  Your partner has completed all the section information.
                  Please review all sections and make your final confirmation.
                </p>
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => {
                      setActivePopup(null);
                      router.push("/dashboard/final-review-confirmation");
                    }}
                    className="flex-1 rounded-lg bg-[#16A34A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#15803D]"
                  >
                    Go to Final Review
                  </button>
                  <button
                    onClick={() => setActivePopup(null)}
                    className="rounded-lg border border-[#E7E7F2] px-4 py-2.5 text-sm font-semibold text-[#6B6B80] hover:bg-[#F6F6FB]"
                  >
                    Close
                  </button>
                </div>
              </>
            )}

            {/* P2 — Wait for partner to confirm */}
            {activePopup === "p2-wait-for-partner" && (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
                    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <h2 className="mt-4 text-base font-semibold text-[#1E1B3C]">
                  Waiting for Your Partner
                </h2>
                <p className="mt-2 text-sm text-[#6B6B80]">
                  Please wait — your partner will review and confirm.
                </p>
                <div className="mt-5">
                  <button
                    onClick={() => setActivePopup(null)}
                    className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
                  >
                    OK, Got it
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
