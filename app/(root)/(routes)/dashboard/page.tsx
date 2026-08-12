"use client";

import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store";
import { calculateOverallProgress } from "@/lib/progressCalculator";

type StepId = "invite" | "questionnaire" | "disclosure";

interface StepConfig {
  id: StepId;
  title: string;
  description: string;
  cta: string;
  completedLabel: string;
  icon: React.ReactNode;
}

const steps: StepConfig[] = [
  {
    id: "invite",
    title: "Invite your partner",
    description:
      "Your fiancé(e) will receive an email inviting them to create a prenup with you.",
    cta: "Invite fiancé",
    completedLabel: "Invited",
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
    cta: "Select terms",
    completedLabel: "Terms selected",
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
    id: "disclosure",
    title: "Complete your financial disclosure",
    description:
      "List your assets, debts, and income to ensure a fair and valid prenup.",
    cta: "Add finance",
    completedLabel: "Disclosure complete",
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

export default function PrenupDashboard() {
  const router = useRouter();

  const { user } = useSelector((state: RootState) => state.auth);
  const cases = useSelector((state: RootState) => state.cases);

  const progressResult = calculateOverallProgress({
    myInformation: cases.myInformation,
    partnerInformation: cases.partnerInformation,
    jointInformation: cases.jointInformation,
  });

  // Partner is considered invited if the case has an invitedUser id set
  const isPartnerInvited = Boolean(cases?.owner?.invitedUser);

  // Step 2: questionnaire — personalInformation, legalDeclaration, familyAndDependents
  // must exist in BOTH myInformation and partnerInformation
  const isQuestionnaireComplete =
    hasAllKeys(cases?.myInformation, QUESTIONNAIRE_KEYS) &&
    hasAllKeys(cases?.partnerInformation, QUESTIONNAIRE_KEYS);

  // Step 3: disclosure — individualAssets, incomeAndRevenue, liabilitiesAndDebts
  // must exist in BOTH myInformation and partnerInformation
  const isDisclosureComplete =
    hasAllKeys(cases?.myInformation, DISCLOSURE_KEYS) &&
    hasAllKeys(cases?.partnerInformation, DISCLOSURE_KEYS);

  const [completed, setCompleted] = useState<Set<StepId>>(new Set());

  // Merge redux-derived truth with any locally-marked steps
  const effectiveCompleted = useMemo(() => {
    const merged = new Set(completed);
    if (isPartnerInvited) merged.add("invite");
    if (isQuestionnaireComplete) merged.add("questionnaire");
    if (isDisclosureComplete) merged.add("disclosure");
    return merged;
  }, [
    completed,
    isPartnerInvited,
    isQuestionnaireComplete,
    isDisclosureComplete,
  ]);

  const activeIndex = steps.findIndex((s) => !effectiveCompleted.has(s.id));
  const currentIndex = activeIndex === -1 ? steps.length : activeIndex;
  const allStepsDone = effectiveCompleted.size === steps.length;

  const handleStepClick = (step: StepConfig) => {
    if (step.id === "invite") {
      router.push("/dashboard/invite-partner");
      return;
    }

    if (step.id === "disclosure" || step.id === "questionnaire") {
      return;
    }
  };

  return (
    <div className=" h-full bg-[#F6F6FB]">
      <div className="mx-auto max-w-5xl px-8 py-8">
        {/* Welcome row */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-[#1E1B3C]">
              Welcome back, {user.firstName} 👋
            </h1>
            <p className="mt-1 text-sm text-[#6B6B80]">
              {allStepsDone
                ? "Here is the current status of your prenuptial agreement."
                : "Here's your prenup progress. You're doing great!"}
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
            <h2 className="text-base font-semibold text-[#1E1B3C]">
              Hello fiancé
            </h2>
            <p className="mt-1 text-sm text-[#6B6B80]">
              Welcome to your PrenupHQ dashboard. This page will help guide you
              through your prenup journey.
            </p>

            <div className="mt-5 flex flex-col gap-3">
              {steps.map((step, i) => {
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

                    <button
                      disabled={isLocked || isDone}
                      onClick={() => handleStepClick(step)}
                      className={`ml-4 flex-shrink-0 rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                        isDone
                          ? "bg-[#DCFCE7] text-[#16A34A]"
                          : isLocked
                            ? "cursor-not-allowed bg-[#F1F1F6] text-[#B4B4C4]"
                            : "bg-primary text-white hover:bg-primary"
                      }`}
                    >
                      {isDone ? step.completedLabel : step.cta}
                    </button>
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
    </div>
  );
}
