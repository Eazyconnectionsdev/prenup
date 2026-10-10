"use client";

import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store";
import { calculateOverallProgress } from "@/lib/progressCalculator";
import type { StepConfig, StepId } from "@/types/dashboard/dashboard-home";

const steps: StepConfig[] = [
  {
    id: "invite",
    title: "Invite your partner",
    description:
      "Your partner will receive an email inviting them to create a prenup with you.",
    cta: "Invite fiancé",
    completedLabel: "View invitation",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-5 w-5"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    ),
  },
  {
    id: "questionnaire",
    title: "Fill out your questionnaire",
    description:
      "Select your prenup terms. We guide you through state-specific processes.",
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
        <path d="M9 3h6l3 3v15H6V3z" />
        <path d="M9 10h6M9 14h6M9 18h3" />
      </svg>
    ),
  },
  {
    id: "partner_questionnaire",
    title: "Partners Questionnaire",
    description: "Your partner prenup terms.",
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
        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    id: "joint_questionnaire",
    title: "Joint Questionnaire",
    description:
      "Select your Joint terms. We guide you through state-specific processes.",
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
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
      </svg>
    ),
  },
  {
    id: "final_review",
    title: "Final Review & Confirmation",
    description: "Your Contract is Almost done!",
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

function ProgressPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#E7E7F2] bg-white px-4 py-2.5">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-[#9494AA]">
        {label}
      </div>
      <div className="mt-0.5 text-sm font-semibold text-[#1E1B3C]">{value}</div>
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

// ─── Popup IDs ───────────────────────────────────────────────────────────────
type PopupId =
  | "p2-joint-initial"
  | "p1-joint-completed"
  | "p2-wait-for-partner"
  | "invite-resend";

export default function PrenupDashboard() {
  const router = useRouter();

  const { user } = useSelector((state: RootState) => state.auth);
  const cases = useSelector((state: RootState) => state.cases);

  // ── Role flags ──────────────────────────────────────────────────────────────
  const isUser1 = user?.endUserType === "user1";
  const isUser2 = user?.endUserType === "user2";

  // ── Invite / join state ─────────────────────────────────────────────────────
  // invitation was sent when cases.owner.invitedUser is truthy
  const isPartnerInvited = Boolean((cases as any)?.owner?.invitedUser);
  // P2 has actually joined when invitedUser has a real _id
  const hasP2Joined = Boolean((cases as any)?.invitedUser?._id);

  // ── Questionnaire completion ─────────────────────────────────────────────────
  const isMyQuestComplete = hasAllKeys(
    cases?.myInformation,
    QUESTIONNAIRE_KEYS,
  );
  const isPartnerQuestComplete = hasAllKeys(
    cases?.partnerInformation,
    QUESTIONNAIRE_KEYS,
  );

  // Full questionnaire (both sides)
  const isQuestionnaireComplete = isMyQuestComplete && isPartnerQuestComplete;

  // ── Disclosure completion ────────────────────────────────────────────────────
  const isDisclosureComplete =
    hasAllKeys(cases?.myInformation, DISCLOSURE_KEYS) &&
    hasAllKeys(cases?.partnerInformation, DISCLOSURE_KEYS);

  // ── Joint completion ─────────────────────────────────────────────────────────
  const isJointComplete =
    Boolean((cases?.jointInformation as any)?.jointAssets) ||
    Boolean((cases?.jointInformation as any)?.jointLiabilitiesAndDebts);

  // ── All 4 sections done ──────────────────────────────────────────────────────
  const areAll4SectionsComplete =
    isQuestionnaireComplete && isDisclosureComplete && isJointComplete;

  // ── Approval / final review states ──────────────────────────────────────────
  const isJointSubmitted = Boolean(
    (cases as any)?.status?.jointInformation?.submitted,
  );
  // P1 "sent for review" = user1 approved OR joint submitted
  const isP1SentForReview =
    Boolean((cases as any)?.approval?.user1Approved) || isJointSubmitted;
  const isMutualApproved = Boolean(
    (cases as any)?.approval?.user1Approved &&
      (cases as any)?.approval?.user2Approved,
  );

  // ── Progress ─────────────────────────────────────────────────────────────────
  const progressResult = calculateOverallProgress({
    myInformation: cases.myInformation,
    partnerInformation: cases.partnerInformation,
    jointInformation: cases.jointInformation,
  });

  // ── Local popup state ────────────────────────────────────────────────────────
  const [activePopup, setActivePopup] = useState<PopupId | null>(null);

  // ── Completed set ─────────────────────────────────────────────────────────
  const [completed] = useState<Set<StepId>>(new Set());

  const effectiveCompleted = useMemo(() => {
    const merged = new Set(completed);
    if (hasP2Joined) merged.add("invite");
    if (isMyQuestComplete) merged.add("questionnaire");
    if (isPartnerQuestComplete) merged.add("partner_questionnaire");
    if (isJointComplete) merged.add("joint_questionnaire");
    if (isMutualApproved) merged.add("final_review");
    return merged;
  }, [
    completed,
    hasP2Joined,
    isMyQuestComplete,
    isPartnerQuestComplete,
    isJointComplete,
    isMutualApproved,
  ]);

  // Visible steps: hide "invite" entirely for P2, and hide it after P2 has completed questionnaire (P2 joined + partner quest done)
  const visibleSteps = useMemo(() => {
    return steps.filter((s) => {
      if (s.id === "invite") {
        // P2 never sees invite step
        if (isUser2) return false;
        // P1: hide invite once P2 has completed their questionnaire
        if (isPartnerQuestComplete) return false;
      }
      return true;
    });
  }, [isUser2, isPartnerQuestComplete]);

  const activeIndex = visibleSteps.findIndex(
    (s) => !effectiveCompleted.has(s.id),
  );
  const currentIndex = activeIndex === -1 ? visibleSteps.length : activeIndex;
  const allStepsDone = visibleSteps.every((s) => effectiveCompleted.has(s.id));

  // ── Step button renderer ───────────────────────────────────────────────────
  function renderStepButton(step: StepConfig) {
    const isDone = effectiveCompleted.has(step.id);

    // ── INVITE ──────────────────────────────────────────────────────────────
    if (step.id === "invite") {
      if (hasP2Joined) {
        // Green disabled "Joined"
        return (
          <button
            disabled
            className="ml-4 flex-shrink-0 cursor-not-allowed rounded-lg bg-[#DCFCE7] px-4 py-2 text-xs font-semibold text-[#16A34A] opacity-80"
          >
            Joined
          </button>
        );
      }
      if (isPartnerInvited) {
        // Green "Resend Invitation"
        return (
          <button
            onClick={() => setActivePopup("invite-resend")}
            className="ml-4 flex-shrink-0 rounded-lg bg-[#16A34A] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#15803D]"
          >
            Resend Invitation
          </button>
        );
      }
      // Default: blue "Invite fiancé"
      return (
        <button
          onClick={() => router.push("/dashboard/invite-partner")}
          className="ml-4 flex-shrink-0 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90"
        >
          Invite fiancé
        </button>
      );
    }

    // ── QUESTIONNAIRE (my own) ─────────────────────────────────────────────
    if (step.id === "questionnaire") {
      if (isDone) {
        // Green "Completed" — still navigates to questionnaire
        return (
          <button
            onClick={() => router.push("/dashboard/personal-info")}
            className="ml-4 flex-shrink-0 rounded-lg bg-[#DCFCE7] px-4 py-2 text-xs font-semibold text-[#16A34A] hover:bg-[#BBF7D0]"
          >
            Completed
          </button>
        );
      }
      // Blue "Select Terms"
      return (
        <button
          onClick={() => router.push("/dashboard/personal-info")}
          className="ml-4 flex-shrink-0 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90"
        >
          Select Terms
        </button>
      );
    }

    // ── PARTNER QUESTIONNAIRE — always grey, always readonly ───────────────
    if (step.id === "partner_questionnaire") {
      return (
        <button
          onClick={() => router.push("/dashboard/partner-personal-info")}
          className="ml-4 flex-shrink-0 rounded-lg bg-[#F1F1F6] px-4 py-2 text-xs font-semibold text-[#9494AA] hover:bg-[#E8E8F0]"
        >
          {isDone ? "Completed" : "Select Terms"}
        </button>
      );
    }

    // ── JOINT QUESTIONNAIRE ────────────────────────────────────────────────
    if (step.id === "joint_questionnaire") {
      if (isDone) {
        // P1 completed → P2 reviewing popup / P2 waiting popup
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
        // P2
        return (
          <button
            onClick={() => setActivePopup("p2-wait-for-partner")}
            className="ml-4 flex-shrink-0 rounded-lg bg-[#DCFCE7] px-4 py-2 text-xs font-semibold text-[#16A34A] hover:bg-[#BBF7D0]"
          >
            Completed
          </button>
        );
      }
      // Not done
      if (isUser2) {
        // P2 initial → Blue "Select Terms" → popup
        return (
          <button
            onClick={() => setActivePopup("p2-joint-initial")}
            className="ml-4 flex-shrink-0 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90"
          >
            Select Terms
          </button>
        );
      }
      // P1 initial → Blue "Select Terms" → navigate
      return (
        <button
          onClick={() => router.push("/dashboard/joint-assets")}
          className="ml-4 flex-shrink-0 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90"
        >
          Select Terms
        </button>
      );
    }

    // ── FINAL REVIEW ───────────────────────────────────────────────────────
    if (step.id === "final_review") {
      // Both approved = done
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

      // "Waiting for Partner Review" state
      // P1: they submitted → waiting for P2
      // P2: P1 sent for review → waiting
      const p1IsWaiting =
        isUser1 && isP1SentForReview && !isMutualApproved;
      const p2IsWaiting =
        isUser2 && isP1SentForReview && !isMutualApproved;

      if (p1IsWaiting || p2IsWaiting) {
        return (
          <button
            onClick={() => router.push("/dashboard/final-review-confirmation")}
            className="ml-4 flex-shrink-0 rounded-lg bg-amber-100 px-4 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-200"
          >
            Waiting for Partner Review
          </button>
        );
      }

      // Determine if button should be enabled
      // P1: enabled when all 4 sections complete (P2 also done their questionnaire)
      // P2: enabled when P1 has sent for review
      const p1CanReview = isUser1 && areAll4SectionsComplete;
      const p2CanReview = isUser2 && isP1SentForReview;
      const canReview = p1CanReview || p2CanReview;

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

      // Disabled blue
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
        {/* Welcome row */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-[#1E1B3C]">
              Welcome , {user.firstName} 👋
            </h1>
            <p className="mt-1 text-sm text-[#6B6B80]">
              {allStepsDone
                ? "Here is the current status of your prenuptial agreement."
                : "Your prenup is taking shape."}
            </p>
          </div>
          <div className="flex gap-3">
            <ProgressPill label="Selected service" value="Prenup (Marriage)" />
            <div className="rounded-xl border border-[#E7E7F2] bg-white px-4 py-2.5">
              <div className="text-[10px] font-semibold uppercase tracking-wide text-[#9494AA]">
                Overall progress
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-sm font-semibold text-[#1E1B3C]">
                  {progressResult?.percentage || 0}%
                </span>
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[#EDEDF5]">
                  <div
                    className="h-full rounded-full bg-[#6D28D9] transition-all duration-500 ease-out"
                    style={{ width: `${progressResult?.percentage || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step section */}
        {!allStepsDone && (
          <div className="mt-8 rounded-2xl border border-[#E7E7F2] bg-white p-6">
            <p className="text-sm text-[#6B6B80]">
              Welcome to your dashboard! This page will help guide you through your prenup journey.
            </p>

            <div className="mt-5 flex flex-col gap-3">
              {visibleSteps.map((step, i) => {
                const isDone = effectiveCompleted.has(step.id);
                const isActive = i === currentIndex;
                const isLocked = i > currentIndex;

                return (
                  <div
                    key={step.id}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3.5 transition-colors ${
                      isActive
                        ? "border-[#DDD6FE] bg-[#FAF9FF]"
                        : "border-[#EDEDF5] bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                          isDone
                            ? "bg-[#DCFCE7] text-[#16A34A]"
                            : isLocked
                              ? "bg-[#F1F1F6] text-[#B4B4C4]"
                              : "bg-[#EDE9FE] text-[#6D28D9]"
                        }`}
                      >
                        {step.icon}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#1E1B3C]">
                          {step.title}
                        </div>
                        <div className="mt-0.5 max-w-md text-xs text-[#8A8AA0]">
                          {step.description}
                        </div>
                      </div>
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

            {/* Invite resend — show details, no re-invite option */}
            {activePopup === "invite-resend" && (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
                    <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
                  </svg>
                </div>
                <h2 className="mt-4 text-base font-semibold text-[#1E1B3C]">
                  Invitation Already Sent
                </h2>
                <p className="mt-2 text-sm text-[#6B6B80]">
                  An invitation has already been sent to your partner. They will
                  receive an email with a link to join your prenup.
                </p>
                <div className="mt-4 rounded-xl border border-[#E7E7F2] bg-[#F6F6FB] p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-[#9494AA]">
                    Invitation details
                  </div>
                  <div className="mt-2 text-sm text-[#1E1B3C]">
                    Status:{" "}
                    <span className="font-medium text-amber-600">Pending — waiting for partner to join</span>
                  </div>
                </div>
                <div className="mt-5">
                  <button
                    onClick={() => setActivePopup(null)}
                    className="w-full rounded-lg border border-[#E7E7F2] px-4 py-2.5 text-sm font-semibold text-[#6B6B80] hover:bg-[#F6F6FB]"
                  >
                    Close
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
