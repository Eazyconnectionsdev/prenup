"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import type { AppDispatch, RootState } from "@/store/store";
import {
  completeOnboarding,
  getCasesDetails,
  getOnboarding,
} from "@/store/asyncThunk/casesThunk";
import { setAgreementType } from "@/store/slices/casesSlice";
import { getErrorMessage } from "@/lib/getErrorMessage";
import {
  agreementTypeLabel,
  fromAgreementType,
  toAgreementType,
  type ServiceId,
} from "@/lib/agreementTypes";

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
  accent: string;
};

const SERVICES: Service[] = [
  {
    id: "prenup",
    title: "Prenuptial Agreement",
    short: "For couples planning to get married or enter a civil partnership.",
    heading: "Prenuptial Agreement",
    subheading: "Tell us a little more about your situation.",
    question: "What are you planning to do?",
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
    accent: "from-rose-400 to-pink-600",
    situations: [
      {
        id: "married",
        title: "We are married",
        description: "We are already legally married.",
      },
      {
        id: "civil-partnership",
        title: "We are civil partners",
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
    question: null,
    accent: "from-emerald-400 to-teal-600",
    situations: null,
  },
];

const CONFIRMATIONS = [
  { id: "residency", label: "I reside in England or Wales." },
];

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

export default function ServiceSelector({
  onContinue,
  defaultService = "prenup",
}: {
  onContinue?: (selection: ServiceSelection) => void;
  defaultService?: ServiceId;
} = {}) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.auth.user);
  const cases = useSelector((state: RootState) => state.cases);
  const caseId: string | undefined = cases.caseId || user?.inviteCaseId;

  const isCaseOwner =
    user?.endUserType === "user1" ||
    Boolean(
      user?._id &&
      cases.owner?._id &&
      String(cases.owner._id) === String(user._id),
    );

  const [choice, setChoice] = useState<ServiceSelection | null>(null);
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});
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

  const existingType = savedType ?? cases.agreementType;
  const existingChoice = fromAgreementType(existingType);

  const serviceId: ServiceId = choice?.service ?? existingChoice?.service ?? defaultService;
  const situation: string = choice?.situation ?? existingChoice?.situation ?? "";

  const service = useMemo(
    () => SERVICES.find((s) => s.id === serviceId)!,
    [serviceId],
  );
  
  const allConfirmed = CONFIRMATIONS.every((c) => confirmed[c.id]);

  const requiresSituation = Boolean(service.situations?.length);

  const isReadOnly = !isCaseOwner || Boolean(savedType);
  const chosenLabel = agreementTypeLabel(existingType);
  const canContinue =
    (!requiresSituation || Boolean(situation)) && allConfirmed && !isSaving;

  const selectService = (id: ServiceId) => {
    if (id === serviceId || isReadOnly) return;
    setChoice({ service: id, situation: "" });
  };

  const selectSituation = (id: string) => {
    if (isReadOnly) return;
    setChoice({ service: serviceId, situation: id });
  };

  const handleContinue = async () => {
    const agreementType = toAgreementType(serviceId, situation);
    if (!agreementType) {
      toast.error("Please choose an option to continue.");
      return;
    }
    if (!caseId) {
      toast.error("We couldn't find your case. Please sign in again.");
      return;
    }

    setIsSaving(true);
    try {
      await dispatch(
        completeOnboarding({
          caseId,
          agreementType,
          residesInUK: Boolean(confirmed.residency),
          understandsService: Boolean(confirmed.final),
        }),
      ).unwrap();

      dispatch(setAgreementType(agreementType));
      setSavedType(agreementType);
      await dispatch(getCasesDetails(caseId));
      toast.success("Your service selection has been saved.");

      if (onContinue) {
        onContinue({ service: serviceId, situation });
      } else {
        router.push("/dashboard");
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      <div className="relative mx-auto max-w-5xl px-4 py-6 sm:px-20 lg:py-8">
        <div className="mb-6 text-center lg:mb-8">
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {isReadOnly
              ? "Your selected service"
              : "Which agreement is right for you?"}
          </h1>
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
                  ? "Your selection has been submitted, so it can no longer be changed here."
                  : "It was chosen by the partner who started the case."}
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-6">
          <div
            role="radiogroup"
            aria-label="Service"
            className="flex flex-col gap-2.5"
          >
            {SERVICES.map((s) => {
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

          <div
            key={service.id}
            className="animate-[fadeIn_.35s_ease-out] rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60 sm:p-6 lg:p-7"
          >
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
                <p className="mt-0.5 text-sm text-slate-500">{service.subheading}</p>
              </div>
            </div>

            {service.question !== null && (
              <div className="my-6 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            )}

            {/* Situation */}
            {requiresSituation && (
              <fieldset>
                <legend className="mb-3 text-sm font-semibold text-slate-900">
                  {service.question}
                </legend>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {service?.situations?.map((opt) => {
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

            {/* Confirmations — only asked when the selection can still be made */}
            <fieldset className={`mt-6 ${isReadOnly ? "hidden" : ""}`}>
              <legend className="mb-3 text-sm font-semibold text-slate-900">
                Please confirm the following
              </legend>
              <div className="space-y-2.5">
                {CONFIRMATIONS?.map((c) => {
                  const checked = !!confirmed[c.id];
                  return (
                    <label
                      key={c.id}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3.5 py-2.5 transition-colors ${
                        checked
                          ? "border-violet-200 bg-violet-50/50"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) =>
                          setConfirmed((p) => ({
                            ...p,
                            [c.id]: e.target.checked,
                          }))
                        }
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
                      <span className="text-[13px] text-slate-700">{c.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* CTA */}
            {isReadOnly ? (
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-300"
              >
                Back to dashboard
                <ArrowRight />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  disabled={!canContinue}
                  onClick={handleContinue}
                  className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-violet-300/50 transition-all hover:shadow-xl hover:shadow-violet-300/70 hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-300 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none"
                >
                  {isSaving ? "Saving..." : "Continue"}
                  {!isSaving && <ArrowRight />}
                </button>
                {!canContinue && (
                  <p className="mt-2.5 text-center text-[11px] text-slate-400">
                    {isSaving
                      ? "Saving your selection..."
                      : requiresSituation && !situation
                        ? "Choose an option above to continue."
                        : CONFIRMATIONS.length > 1
                          ? "Tick the confirmations above to continue."
                          : "Tick the confirmation above to continue."}
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
