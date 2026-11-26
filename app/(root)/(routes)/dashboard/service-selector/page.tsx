"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { CircleAlert, TriangleAlert } from "lucide-react";
import type { AppDispatch, RootState } from "@/store/store";
import {
  completeOnboarding,
  getCasesDetails,
  getOnboarding,
} from "@/store/asyncThunk/casesThunk";
import { useEnsureCaseId } from "@/hooks/useEnsureCaseId";
import { setAgreementType } from "@/store/slices/casesSlice";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { isCasePaid, paymentHref } from "@/lib/casePayment";
import {
  agreementTypeLabel,
  fromAgreementType,
  toAgreementType,
  type ServiceId,
} from "@/lib/agreementTypes";
import {
  CEREMONY_BLOCK_DAYS,
  CEREMONY_CHECKOUT_TOOLTIP,
  ceremonyTimingStatus,
  daysUntilCeremony,
  todayInLondonIso,
} from "@/lib/ceremonyTiming";
import {
  formatPounds,
  LEGAL_ADVICE_FEE_GBP,
  SERVICE_FEE_GBP,
} from "@/lib/servicePricing";
import { Tooltip } from "@/components/questionnaire/QuestionnaireUI";
import { CONTACT_TEAM_EMAIL } from "@/components/questionnaire/CeremonyBlockedModal";

export type { ServiceId };

export type ServiceSelection = {
  service: ServiceId;
  situation: string;
};

type Situation = { id: string; title: string; description: string };

type Service = {
  id: ServiceId;
  title: string;
  short: string;
  heading: string;
  subheading: string;
  question: string | null;
  situations: Situation[] | null;
  // Asks for the planned ceremony date and holds checkout back when it is too
  // close (see lib/ceremonyTiming.ts for the thresholds).
  asksCeremonyDate: boolean;
  accent: string;
};

// The services a couple can pick for now: only the prenup is on offer. The
// others stay configured below so they can be switched back on, and so a case
// already saved with one of them still shows it.
const ENABLED_SERVICES: ServiceId[] = ["prenup"];

const SERVICES: Service[] = [
  {
    id: "prenup",
    title: "Prenuptial Agreement",
    short: "For couples planning to get married or enter a civil partnership.",
    heading: "Prenuptial Agreement",
    subheading: "Tell us a little more about your situation.",
    question: "What are you planning to do?",
    asksCeremonyDate: true,
    accent: "from-amber-400 to-orange-500",
    situations: [
      {
        id: "marriage",
        title: "Get married",
        description: "I am planning to get married.",
      },
      {
        id: "civil-partnership",
        title: "Enter a civil partnership",
        description: "I am planning to enter a civil partnership.",
      },
    ],
  },
  {
    id: "postnup",
    title: "Postnuptial Agreement",
    short: "For couples who are already married or in a civil partnership.",
    heading: "Postnuptial Agreement",
    subheading: "Tell us a little more about your situation.",
    question: "Which best describes you?",
    asksCeremonyDate: false,
    accent: "from-rose-400 to-pink-600",
    situations: [
      {
        id: "married",
        title: "We are married",
        description: "We are already legally married.",
      },
      {
        id: "civil-partnership",
        title: "We are in a civil partnership",
        description: "We are in a registered civil partnership.",
      },
    ],
  },
  {
    id: "cohabitation",
    title: "Cohabitation Agreement",
    short:
      "For couples who live together or plan to live together without marrying.",
    heading: "Cohabitation Agreement",
    subheading: "Tell us a little more about your living arrangements.",
    question: "Which best describes your situation?",
    asksCeremonyDate: false,
    accent: "from-emerald-400 to-teal-600",
    // Both are the same agreement (see toAgreementType); the first id is the
    // one fromAgreementType reads a saved cohabitation case back as.
    situations: [
      {
        id: "living-together",
        title: "We currently live together",
        description: "We already share a home.",
      },
      {
        id: "planning-to-live-together",
        title: "We are planning to live together",
        description: "We intend to share a home.",
      },
    ],
  },
];

const CONFIRMATIONS = [
  { id: "residency", label: "I reside in England or Wales." },
];

const AGREEMENT_INCLUDES = [
  "Guided online questionnaires",
  "Professionally prepared agreement",
  "Financial disclosure process",
  "Final document for review and signing",
];

const isEnabled = (id: ServiceId) => ENABLED_SERVICES.includes(id);

// While its year is being typed a date input reports values such as
// 0002-06-14, which would read as long past and flash the "too close" panel.
function isCompleteDate(value: string): boolean {
  const match = /^(\d{4})-\d{2}-\d{2}$/.exec(value);
  return Boolean(match) && Number(match![1]) >= 1900;
}

function ServiceIcon({ id }: { id: ServiceId }) {
  const common = "h-5 w-5 text-white";
  if (id === "prenup")
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className={common}
      >
        <circle cx="9" cy="14" r="5.5" />
        <circle cx="15" cy="14" r="5.5" />
        <path d="M7.5 5.5 9 3h6l1.5 2.5L12 8.5z" strokeLinejoin="round" />
      </svg>
    );
  if (id === "postnup")
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className={common}
      >
        <path
          d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"
          strokeLinejoin="round"
        />
        <path d="M14 3v5h5" strokeLinejoin="round" />
        <path
          d="M12 17.5s-3-1.8-3-3.8a1.6 1.6 0 0 1 3-.8 1.6 1.6 0 0 1 3 .8c0 2-3 3.8-3 3.8z"
          fill="currentColor"
          stroke="none"
        />
      </svg>
    );
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={common}
    >
      <path d="M3 11 12 4l9 7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v10h14V10" strokeLinejoin="round" />
      <path d="M10 20v-5h4v5" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      className={className}
    >
      <path
        d="m5 10.5 3.2 3L15 6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      className="h-4 w-4 transition-transform group-hover:translate-x-1"
    >
      <path
        d="M4 10h12m-5-5 5 5-5 5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StepNumber({ n }: { n: number }) {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
      {n}
    </span>
  );
}

function TickBox({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3.5 py-2.5 transition-colors ${
        checked
          ? "border-violet-200 bg-violet-50/50"
          : "border-slate-200 bg-white hover:bg-slate-50"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border-2 transition-all peer-focus-visible:ring-4 peer-focus-visible:ring-violet-200 ${
          checked
            ? "border-violet-600 bg-violet-600 text-white"
            : "border-slate-300 bg-white text-transparent"
        }`}
      >
        <CheckIcon className="h-2.5 w-2.5" />
      </span>
      <span className="text-[13px] text-slate-700">{children}</span>
    </label>
  );
}

// What the couple is buying, shown beside the questions when only one service
// is on offer (and so there is no list of services to choose from).
function AgreementSummary({ service }: { service: Service }) {
  return (
    <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60 sm:p-6">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${service.accent} shadow-md`}
        >
          <ServiceIcon id={service.id} />
        </span>
        <h2 className="text-lg font-bold leading-snug text-slate-900">
          {service.title}
        </h2>
      </div>

      <p className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
        {formatPounds(SERVICE_FEE_GBP[service.id])}
      </p>
      <p className="mt-0.5 text-xs text-slate-500">
        One-time payment per couple
      </p>

      <div className="my-5 h-px bg-slate-100" />

      <p className="text-sm font-semibold text-slate-900">
        Your agreement includes:
      </p>
      <ul className="mt-3 space-y-2.5">
        {AGREEMENT_INCLUDES.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-[13px] text-slate-700"
          >
            <span className="mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700">
              <CheckIcon className="h-2.5 w-2.5" />
            </span>
            {item}
          </li>
        ))}
      </ul>

      <p className="mt-5 rounded-xl bg-slate-50 px-3.5 py-3 text-xs leading-relaxed text-slate-600">
        Independent legal advice is arranged separately at{" "}
        <span className="font-semibold text-slate-900">
          {formatPounds(LEGAL_ADVICE_FEE_GBP)} per person
        </span>
        , payable directly to each lawyer.
      </p>
    </aside>
  );
}

export default function ServiceSelector({
  onContinue,
  defaultService = "prenup",
}: {
  onContinue?: (selection: ServiceSelection) => void;
  defaultService?: ServiceId;
} = {}) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const ensureCaseId = useEnsureCaseId();

  const user = useSelector((state: RootState) => state.auth.user);
  const cases = useSelector((state: RootState) => state.cases);
  const caseId: string | undefined = cases.caseId || user?.inviteCaseId;

  const isPaid = isCasePaid(cases) || Boolean(user?.paymentDone);

  const startedCase =
    user?.endUserType === "user1" ||
    Boolean(
      user?._id &&
      cases.owner?._id &&
      String(cases.owner._id) === String(user._id),
    );
  const isInvitedPartner =
    user?.endUserType === "user2" ||
    Boolean(
      user?._id &&
      (cases as any).invitedUser?._id &&
      String((cases as any).invitedUser._id) === String(user._id),
    );
  // Until the case is paid either partner may choose the service and pay;
  // whoever pays becomes Partner 1. Afterwards only Partner 1 can.
  const isCaseOwner = startedCase || (isInvitedPartner && !isPaid);

  const [choice, setChoice] = useState<ServiceSelection | null>(null);
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});
  const [ceremonyDate, setCeremonyDate] = useState<string>("");
  const [timingAcknowledged, setTimingAcknowledged] = useState<boolean>(false);
  const [savedType, setSavedType] = useState<string | null>(null);
  const [checkedOnboarding, setCheckedOnboarding] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (caseId) dispatch(getCasesDetails(caseId));
  }, [dispatch, caseId]);

  const needsOnboardingCheck = Boolean(caseId) && isCaseOwner;
  const isLoading = needsOnboardingCheck && !checkedOnboarding;

  useEffect(() => {
    if (!caseId || !isCaseOwner) return;
    let active = true;
    dispatch(getOnboarding(caseId))
      .unwrap()
      .then((res) => {
        if (!active) return;
        setSavedType(res.completed ? res.agreementType : null);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setCheckedOnboarding(true);
      });
    return () => {
      active = false;
    };
  }, [dispatch, caseId, isCaseOwner]);

  const isReadOnly = !isCaseOwner || Boolean(savedType);

  const existingType = savedType ?? cases.agreementType;
  const savedChoice = fromAgreementType(existingType);
  // A saved choice is always shown as it is, but while the choice can still
  // be made only a service on offer can be preselected.
  const existingChoice =
    savedChoice && (isReadOnly || isEnabled(savedChoice.service))
      ? savedChoice
      : null;
  const fallbackService = isEnabled(defaultService)
    ? defaultService
    : ENABLED_SERVICES[0];

  const serviceId: ServiceId =
    choice?.service ?? existingChoice?.service ?? fallbackService;
  const situation: string =
    choice?.situation ?? existingChoice?.situation ?? "";

  const service = useMemo(
    () => SERVICES.find((s) => s.id === serviceId)!,
    [serviceId],
  );

  const visibleServices = SERVICES.filter(
    (s) => isEnabled(s.id) || s.id === serviceId,
  );
  const isSingleService = visibleServices.length === 1;

  const allConfirmed = CONFIRMATIONS.every((c) => confirmed[c.id]);
  const requiresSituation = Boolean(service.situations?.length);

  // The ceremony date is only asked while the choice is being made; it decides
  // whether checkout may go ahead.
  const asksDate = service.asksCeremonyDate && !isReadOnly;
  const dateEntered = isCompleteDate(ceremonyDate);
  const timing =
    asksDate && dateEntered ? ceremonyTimingStatus(ceremonyDate) : null;
  const daysLeft = timing ? daysUntilCeremony(ceremonyDate) : null;
  const isBlocked = timing === "UNDER_28_DAYS_BLOCKED";
  const needsAcknowledgement = timing === "TIGHT_TIMELINE_ACK";
  const dateReady =
    !asksDate ||
    (dateEntered &&
      !isBlocked &&
      (!needsAcknowledgement || timingAcknowledged));

  const chosenLabel = agreementTypeLabel(existingType);
  const canContinue =
    (!requiresSituation || Boolean(situation)) &&
    dateReady &&
    allConfirmed &&
    !isSaving;

  const selectService = (id: ServiceId) => {
    if (id === serviceId || isReadOnly || !isEnabled(id)) return;
    setChoice({ service: id, situation: "" });
  };

  const selectSituation = (id: string) => {
    if (isReadOnly) return;
    setChoice({ service: serviceId, situation: id });
  };

  const changeCeremonyDate = (value: string) => {
    setCeremonyDate(value);
    // An acknowledgement only covers the date it was given for.
    setTimingAcknowledged(false);
  };

  const handleContinue = async () => {
    const agreementType = toAgreementType(serviceId, situation);
    if (!agreementType) {
      toast.error("Please choose an option to continue.");
      return;
    }
    if (!dateReady) {
      toast.error(
        isBlocked
          ? `Your ceremony is within ${CEREMONY_BLOCK_DAYS} days. Please contact our team.`
          : "Please enter your ceremony date and confirm the timing to continue.",
      );
      return;
    }
    if (!isCaseOwner) {
      toast.error("Only Partner 1 can change the service once the case is paid for.");
      return;
    }

    setIsSaving(true);
    try {
      const activeCaseId = await ensureCaseId();

      await dispatch(
        completeOnboarding({
          caseId: activeCaseId,
          agreementType,
          residesInUK: Boolean(confirmed.residency),
          understandsService: Boolean(confirmed.final),
        }),
      ).unwrap();

      dispatch(setAgreementType(agreementType));
      setSavedType(agreementType);
      await dispatch(getCasesDetails(activeCaseId));
      toast.success("Your service selection has been saved.");

      if (onContinue) {
        onContinue({ service: serviceId, situation });
      } else if (isPaid) {
        router.push("/dashboard");
      } else {
        router.push(paymentHref(agreementType));
      }
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Unable to save your selection. Please try again.",
        ),
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Loading your service...
      </div>
    );
  }

  const heading = isReadOnly
    ? "Your selected service"
    : isSingleService
      ? `Let's Set Up Your ${service.title}`
      : "Choose Your Agreement";
  const subheading = isReadOnly
    ? null
    : isSingleService
      ? "Tell us a little about your plans so we can prepare the right agreement for you."
      : "Select the agreement that best suits your relationship and circumstances.";

  const disabledHint = isSaving
    ? "Saving your selection..."
    : requiresSituation && !situation
      ? "Choose an option above to continue."
      : asksDate && !dateEntered
        ? "Enter your ceremony date to continue."
        : needsAcknowledgement && !timingAcknowledged
          ? "Tick the acknowledgement above to continue."
          : CONFIRMATIONS.length > 1
            ? "Tick the confirmations above to continue."
            : "Tick the confirmation above to continue.";

  // Questions are numbered in the order they appear.
  let questionNumber = 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      <div className="relative mx-auto max-w-5xl px-4 py-6 sm:px-20 lg:py-8">
        <div className="mb-6 text-center lg:mb-8">
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {heading}
          </h1>
          {subheading && (
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
              {subheading}
            </p>
          )}

          {/* Choosing is step one of two; paying is the second. */}
          {!isReadOnly && !isPaid && (
            <div
              className="mx-auto mt-5 flex max-w-xs items-center gap-3"
              aria-label="Step 1 of 2"
            >
              <span className="h-1.5 flex-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600" />
              <span className="rounded-full border border-violet-200 bg-white px-2.5 py-0.5 text-[11px] font-semibold text-violet-700">
                1 of 2
              </span>
              <span className="h-1.5 flex-1 rounded-full bg-slate-200" />
            </div>
          )}
        </div>

        {isReadOnly && (
          <div className="mx-auto mb-6 flex max-w-2xl items-start gap-2.5 rounded-xl border border-violet-200 bg-violet-50/70 px-4 py-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white">
              <CheckIcon />
            </span>
            <div className="text-[13px] text-slate-700">
              <span className="font-semibold text-slate-900">
                {chosenLabel ?? "Your service"}
              </span>{" "}
              is the service on this case.
              <div className="mt-0.5 text-xs text-slate-500">
                {isCaseOwner
                  ? isPaid
                    ? "Your selection has been submitted, so it can no longer be changed here."
                    : "Your selection has been saved. It can no longer be changed here, and there is still the fee to pay."
                  : "It was chosen by Partner 1, who paid for the case."}
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-6">
          {isSingleService ? (
            <AgreementSummary service={service} />
          ) : (
            <div
              role="radiogroup"
              aria-label="Service"
              className="flex flex-col gap-2.5"
            >
              {visibleServices.map((s) => {
                const active = s.id === serviceId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    disabled={isReadOnly}
                    onClick={() => selectService(s.id)}
                    className={`group relative flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-300 ${
                      active
                        ? "border-violet-500 bg-white shadow-xl shadow-violet-200/60"
                        : isReadOnly
                          ? "border-slate-200 bg-white/60 opacity-60"
                          : "border-slate-200 bg-white/60 hover:-translate-y-0.5 hover:border-violet-300 hover:bg-white hover:shadow-lg hover:shadow-slate-200/70"
                    } ${isReadOnly ? "cursor-default" : ""}`}
                  >
                    {active && (
                      <span className="absolute inset-y-3 left-0 w-[3px] rounded-r-full bg-gradient-to-b from-violet-500 to-indigo-600" />
                    )}
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${s.accent} shadow-md transition-transform duration-200 ${
                        active ? "scale-105" : "group-hover:scale-105"
                      }`}
                    >
                      <ServiceIcon id={s.id} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-sm font-semibold ${active ? "text-violet-700" : "text-slate-900"}`}
                      >
                        {s.title}
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">
                        {s.short}
                      </span>
                    </span>
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                        active
                          ? "border-violet-600 bg-violet-600 text-white"
                          : "border-slate-300 text-transparent"
                      }`}
                    >
                      <CheckIcon />
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <div
            key={service.id}
            className="animate-[fadeIn_.35s_ease-out] rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60 sm:p-6 lg:p-7"
          >
            {/* With a single service the summary beside this card names it. */}
            {!isSingleService && (
              <>
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${service.accent} shadow-lg`}
                  >
                    <ServiceIcon id={service.id} />
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                      {service.heading}
                    </h2>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {service.subheading}
                    </p>
                  </div>
                </div>
                <div className="my-6 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
              </>
            )}

            {/* Situation */}
            {requiresSituation && (
              <fieldset>
                <legend className="mb-3 flex items-center gap-2.5 text-sm font-semibold text-slate-900">
                  <StepNumber n={++questionNumber} />
                  {service.question}
                </legend>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {service.situations?.map((opt) => {
                    const active = situation === opt.id;
                    return (
                      <label
                        key={opt.id}
                        className={`relative flex items-start gap-2.5 rounded-xl border-2 p-3.5 transition-all ${
                          isReadOnly ? "cursor-default" : "cursor-pointer"
                        } ${
                          active
                            ? "border-violet-600 bg-violet-50/70 shadow-md shadow-violet-100"
                            : isReadOnly
                              ? "border-slate-200 opacity-60"
                              : "border-slate-200 hover:border-violet-300 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="situation"
                          value={opt.id}
                          checked={active}
                          disabled={isReadOnly}
                          onChange={() => selectSituation(opt.id)}
                          className="peer sr-only"
                        />
                        <span
                          className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-all peer-focus-visible:ring-4 peer-focus-visible:ring-violet-200 ${
                            active ? "border-violet-600" : "border-slate-300"
                          }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full bg-violet-600 transition-transform ${active ? "scale-100" : "scale-0"}`}
                          />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-slate-900">
                            {opt.title}
                          </span>
                          <span className="mt-0.5 block text-xs text-slate-500">
                            {opt.description}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {/* Ceremony date, checked against the online-checkout thresholds */}
            {asksDate && (
              <div className="mt-6">
                <div className="mb-3 flex items-center gap-2.5">
                  <StepNumber n={++questionNumber} />
                  <label
                    htmlFor="ceremonyDate"
                    className="text-sm font-semibold text-slate-900"
                  >
                    When is your wedding or civil partnership ceremony?
                  </label>
                  <Tooltip text={CEREMONY_CHECKOUT_TOOLTIP} />
                </div>
                <input
                  id="ceremonyDate"
                  type="date"
                  min={todayInLondonIso()}
                  value={ceremonyDate}
                  onChange={(e) => changeCeremonyDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition hover:border-slate-300 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-100 sm:max-w-xs"
                />
                {daysLeft !== null && daysLeft > 0 && !isBlocked && (
                  <p className="mt-1.5 text-[11px] text-slate-500">
                    {daysLeft === 1 ? "1 day" : `${daysLeft} days`} until your
                    ceremony
                  </p>
                )}

                {/* 29-35 days: the couple may go on once they accept the risk */}
                {needsAcknowledgement && (
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-[13px] leading-relaxed text-amber-950">
                    <p className="flex items-center gap-2 font-semibold text-amber-900">
                      <TriangleAlert
                        className="h-4 w-4 shrink-0"
                        aria-hidden="true"
                      />
                      Your ceremony is approaching
                    </p>
                    <p className="mt-2">
                      Your ceremony is relatively close. We recommend starting
                      your prenuptial agreement as soon as possible to allow
                      sufficient time for preparation, review and independent
                      legal advice.
                    </p>
                    <p className="mt-1.5">
                      We cannot guarantee completion before your ceremony.
                    </p>
                    <div className="mt-3">
                      <TickBox
                        checked={timingAcknowledged}
                        onChange={setTimingAcknowledged}
                      >
                        <span className="font-semibold text-slate-900">
                          I understand and would like to continue.
                        </span>
                      </TickBox>
                    </div>
                  </div>
                )}

                {/* 28 days or fewer: no online checkout */}
                {isBlocked && (
                  <div
                    role="alert"
                    className="mt-4 rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-[13px] leading-relaxed text-rose-900"
                  >
                    <p className="flex items-center gap-2 font-semibold">
                      <CircleAlert
                        className="h-4 w-4 shrink-0"
                        aria-hidden="true"
                      />
                      Please contact our team
                    </p>
                    <p className="mt-2">
                      Your wedding or civil partnership ceremony is within{" "}
                      {CEREMONY_BLOCK_DAYS} days. Unfortunately, we cannot
                      accept your prenup order through our standard online
                      process at this stage.
                    </p>
                    <p className="mt-1.5">
                      Please contact our team to discuss your circumstances and
                      whether we can assist.
                    </p>
                    <a
                      href={`mailto:${CONTACT_TEAM_EMAIL}?subject=${encodeURIComponent(
                        `Ceremony within ${CEREMONY_BLOCK_DAYS} days`,
                      )}`}
                      className="mt-3 flex h-10 w-full items-center justify-center rounded-lg border border-rose-200 bg-white text-sm font-semibold text-rose-700 transition hover:bg-rose-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-200"
                    >
                      Contact Our Team
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Confirmations — only asked while the selection can still be
                made, and not once checkout is blocked */}
            {!isReadOnly && !isBlocked && (
              <fieldset className="mt-6">
                <legend className="mb-3 flex items-center gap-2.5 text-sm font-semibold text-slate-900">
                  <StepNumber n={++questionNumber} />
                  Please confirm the following
                </legend>
                <div className="space-y-2.5">
                  {CONFIRMATIONS.map((c) => (
                    <TickBox
                      key={c.id}
                      checked={!!confirmed[c.id]}
                      onChange={(checked) =>
                        setConfirmed((p) => ({ ...p, [c.id]: checked }))
                      }
                    >
                      {c.label}
                    </TickBox>
                  ))}
                </div>
              </fieldset>
            )}

            {/* CTA */}
            {isReadOnly ? (
              isCaseOwner && !isPaid && existingType ? (
                <button
                  type="button"
                  onClick={() => router.push(paymentHref(existingType))}
                  className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-violet-300/50 transition-all hover:shadow-xl hover:shadow-violet-300/70 hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-300"
                >
                  Continue to Payment
                  <ArrowRight />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-300"
                >
                  Back to dashboard
                  <ArrowRight />
                </button>
              )
            ) : isBlocked ? null : (
              <>
                <button
                  type="button"
                  disabled={!canContinue}
                  onClick={handleContinue}
                  className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-violet-300/50 transition-all hover:shadow-xl hover:shadow-violet-300/70 hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-300 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none"
                >
                  {isSaving
                    ? "Saving..."
                    : isPaid
                      ? "Continue"
                      : "Continue to Payment"}
                  {!isSaving && <ArrowRight />}
                </button>
                {!canContinue && (
                  <p className="mt-2.5 text-center text-[11px] text-slate-400">
                    {disabledHint}
                  </p>
                )}
              </>
            )}

            <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-3.5 w-3.5 text-emerald-500"
              >
                <path
                  fillRule="evenodd"
                  d="M10 1.9 3.5 4.3v5c0 4.2 2.8 7.6 6.5 8.8 3.7-1.2 6.5-4.6 6.5-8.8v-5zm3.2 6.3-4 4a.8.8 0 0 1-1.1 0l-2-2a.8.8 0 1 1 1.1-1.1l1.5 1.4 3.4-3.4a.8.8 0 0 1 1.1 1.1z"
                  clipRule="evenodd"
                />
              </svg>
              Your information is kept secure and confidential.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
