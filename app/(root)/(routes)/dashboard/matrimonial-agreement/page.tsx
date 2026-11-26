"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Baby,
  Briefcase,
  CalendarClock,
  ChevronDown,
  FileSignature,
  Gem,
  Gift,
  HeartHandshake,
  HeartPulse,
  HelpingHand,
  Home,
  Info,
  Landmark,
  PackagePlus,
  Scale,
  TriangleAlert,
  Users,
} from "lucide-react";
import {
  FieldMessage,
  fieldClassesFor,
  FormShellIllustration,
  getBadgeGradient,
  Tooltip,
} from "@/components/questionnaire/QuestionnaireUI";
import { useFormValidation } from "@/hooks/useFormValidation";
import { matrimonialAgreementSchema } from "@/lib/validations/joint";
import { errorsUnder } from "@/lib/validations/formErrors";
import Axios from "@/lib/ApiConfig";
import { AppDispatch, RootState } from "@/store/store";
import { getCasesDetails } from "@/store/asyncThunk/casesThunk";
import { getErrorMessage } from "@/lib/api/http-error";
import { JointStatusBanner } from "@/components/joint/JointStatusBanner";
import { useJointSectionStatus } from "@/hooks/useJointSectionStatus";
import { makeId, removeRow, updateRow } from "@/components/Formprimitives";
import type { Treatment, YesNo } from "@/types/forms/form-primitives";
import type {
  CriticalIllnessSafeguard,
  DeathWillsAlignment,
  FutureAssetsTreatment,
  FutureGiftsTreatment,
  InheritanceEntry,
  InheritanceSelection,
  MatrimonialAgreementFormValues,
  ReviewTriggerType,
  SpecialCircumstanceKey,
  SpousalMaintenanceIntention,
  StandardMilestone,
} from "@/types/dashboard/matrimonial-agreement";

/* ---------------------------------------------------------------------- */
/* Shared styling (kept in step with the other joint information forms)   */
/* ---------------------------------------------------------------------- */

const groupClasses =
  "rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(99,102,241,0.06)] transition-all duration-300";
const labelClasses = "mb-3 block text-[14px] sm:text-[14.5px] font-bold text-slate-900 tracking-tight leading-relaxed";
const helpClasses = "mb-3 text-[13px] text-slate-500 leading-relaxed";
const fieldClasses =
  "w-full rounded-xl border border-slate-200 bg-[#FBFBFE] px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 min-h-[46px]";
const subLabelClasses = "mb-2 block text-[13px] font-semibold text-slate-700";
const nestedLabelClasses = "mb-2 block text-xs font-semibold text-slate-500 uppercase tracking-wider";
const captionClasses = "mt-2 text-xs text-slate-500 leading-relaxed";

function ModuleTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-indigo-700 border border-indigo-100/90 shadow-2xs">
      {children}
    </span>
  );
}

function TrackHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-3 border-b-2 border-indigo-100/80 pb-3">
      <span className="h-5 w-1.5 rounded-full bg-indigo-600" />
      <h2 className="text-base font-extrabold uppercase tracking-wider text-indigo-950">
        {children}
      </h2>
    </div>
  );
}

function NestedBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-xl border border-slate-200/90 border-l-4 border-l-indigo-600 bg-slate-50/70 p-5 shadow-xs">
      {children}
    </div>
  );
}

type Choice<T extends string> = { value: T; title: string; desc: string };

function ChoiceCards<T extends string>({
  name,
  value,
  options,
  onChange,
}: {
  name: string;
  value: T;
  options: Choice<T>[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="mt-4 space-y-3">
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <label
            key={option.value}
            className={`flex cursor-pointer items-start gap-3.5 rounded-xl border p-4 transition-all duration-200 ${
              selected
                ? "border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-500/20 shadow-sm"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
            }`}
          >
            <span
              className={`relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                selected ? "border-indigo-600 bg-white" : "border-slate-300 bg-white"
              }`}
            >
              {selected && <span className="h-2 w-2 rounded-full bg-indigo-600" />}
            </span>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selected}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <div>
              <div className="text-[14px] font-bold text-slate-900">{option.title}</div>
              <div className="mt-0.5 text-[12.5px] text-slate-500 leading-relaxed">{option.desc}</div>
            </div>
          </label>
        );
      })}
    </div>
  );
}

function YesNoCards({
  name,
  value,
  onChange,
}: {
  name: string;
  value: YesNo;
  onChange: (value: YesNo) => void;
}) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-3 sm:gap-4">
      {(["Yes", "No"] as YesNo[]).map((option) => {
        const selected = value === option;
        return (
          <label
            key={option}
            className={`relative flex min-h-[46px] cursor-pointer items-center justify-start gap-3 rounded-xl border px-4 py-3 text-sm transition-all duration-200 select-none ${
              selected
                ? "border-indigo-600 bg-indigo-50/30 text-indigo-950 ring-2 ring-indigo-500/20 shadow-sm font-bold"
                : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50/60 font-semibold"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={selected}
              onChange={() => onChange(option)}
              className="sr-only"
            />
            <span
              className={`relative flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                selected ? "border-indigo-600 bg-white" : "border-slate-300 bg-white"
              }`}
            >
              {selected && <span className="h-2 w-2 rounded-full bg-indigo-600" />}
            </span>
            <span>{option}</span>
          </label>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Question options                                                        */
/* ---------------------------------------------------------------------- */

const futureAssetsOptions: Choice<FutureAssetsTreatment>[] = [
  {
    value: "SeparateToAcquirer",
    title: "Keep separate",
    desc: "Each person keeps assets acquired in their own name, subject to the agreement and applicable law.",
  },
  {
    value: "FamilyUseJoint",
    title: "Family assets shared",
    desc: "Assets acquired for family use, such as a family home, are intended to be shared; other assets remain separate.",
  },
  {
    value: "PooledEqually",
    title: "Share assets equally",
    desc: "Assets acquired during the marriage are intended to be shared equally.",
  },
  {
    value: "Custom",
    title: "Other",
    desc: "We would like to describe a different arrangement.",
  },
];

const futureGiftsOptions: Choice<FutureGiftsTreatment>[] = [
  {
    value: "SeparateToRecipient",
    title: "Keep the gift separate for the person receiving it.",
    desc: "The gift remains the separate property of the person who receives it.",
  },
  {
    value: "JointEqually",
    title: "Treat the gift as shared between us.",
    desc: "The gift is treated as a shared asset between both of us.",
  },
  {
    value: "Custom",
    title: "Other",
    desc: "We would like to describe a different arrangement.",
  },
];

const inheritanceOptions: Choice<InheritanceSelection>[] = [
  {
    value: "NoneExpected",
    title: "No inheritance to record.",
    desc: "Neither of us expects, or is currently receiving, an inheritance we wish to record.",
  },
  {
    value: "LogDetails",
    title: "Yes, we would like to provide details.",
    desc: "Record each expected, pending or received inheritance below.",
  },
];

const spousalMaintenanceOptions: Choice<SpousalMaintenanceIntention>[] = [
  {
    value: "MutualWaiver",
    title: "No ongoing maintenance intended \u2013 clean break",
    desc: "We intend that neither person should pay ongoing spousal maintenance to the other.",
  },
  {
    value: "CareerSacrificeOnly",
    title: "Maintenance may be appropriate in certain circumstances",
    desc: "For example, where one person has reduced their working hours or given up their career to care for children or family.",
  },
  {
    value: "Custom",
    title: "Other",
    desc: "We would like to describe a different arrangement.",
  },
];

const criticalIllnessOptions: Choice<CriticalIllnessSafeguard>[] = [
  {
    value: "ReviewAgreement",
    title: "Yes \u2013 review the agreement",
    desc: "We would like to review our financial arrangements if either of us experiences a serious illness or disability.",
  },
  {
    value: "NoSpecificReview",
    title: "No specific review arrangement",
    desc: "We do not wish to set a specific review arrangement for this situation.",
  },
  {
    value: "Custom",
    title: "Other",
    desc: "We would like to describe a different arrangement.",
  },
];

const deathWillsOptions: Choice<DeathWillsAlignment>[] = [
  {
    value: "FollowWills",
    title: "Follow our Wills and estate plans",
    desc: "We intend for our existing or future Wills and estate plans to guide how our assets are distributed.",
  },
  {
    value: "ReviewOnDeath",
    title: "Review our arrangements if either of us dies",
    desc: "We would like our financial arrangements and estate plans to be reviewed if either of us dies.",
  },
  {
    value: "Custom",
    title: "Other",
    desc: "We would like to describe a different arrangement.",
  },
];

const reviewTriggerOptions: Choice<ReviewTriggerType>[] = [
  {
    value: "Never",
    title: "Never",
    desc: "We do not wish to specify any particular review milestones.",
  },
  {
    value: "Standard",
    title: "Standard Life Milestones",
    desc: "We would like the agreement to be reviewed at certain major life milestones.",
  },
  {
    value: "Custom",
    title: "Custom Schedule",
    desc: "We would like to define our own specific review milestones.",
  },
];

const milestoneOptions: { value: StandardMilestone; label: string }[] = [
  { value: "child_birth", label: "Upon the birth or adoption of a child." },
  {
    value: "career_change",
    label: "Following a significant change in health, disability or ability to work.",
  },
  { value: "financial_change", label: "Upon a significant change in financial circumstances." },
  { value: "5_year", label: "On our 5th wedding anniversary." },
  { value: "10_year", label: "On our 10th wedding anniversary." },
];

const inheritanceTreatmentOptions: { value: Treatment; label: string }[] = [
  { value: "KeepSeparate", label: "Keep Separate" },
  { value: "ShareEqually", label: "Share Equally (50/50)" },
  { value: "Contribution", label: "Split by Contribution" },
  { value: "Percentage", label: "Share by Percentage" },
  { value: "Custom", label: "Custom Arrangement" },
];

const currencyOptions = [
  { value: "GBP", label: "GBP (£)" },
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "AUD", label: "AUD ($)" },
  { value: "CAD", label: "CAD ($)" },
];

/* ---------------------------------------------------------------------- */
/* Guidance notes                                                          */
/* ---------------------------------------------------------------------- */

const FUTURE_ASSETS_TOOLTIP = `Please consider how you would like assets and debts acquired by either of you during your marriage to be treated if you separate or divorce.

This may include property, savings, investments, business interests, vehicles and loans. For example, you may wish to keep assets acquired in each person's own name separate, share assets used by the family, or share assets equally.

Choose the option that best reflects your intentions. If you have a different arrangement in mind, select Other and briefly describe it.

Your answers will help your solicitors understand your intentions and prepare suitable terms for the agreement. The legal treatment of assets and debts may depend on the circumstances and applicable law.`;

const FUTURE_GIFTS_TOOLTIP = `Please consider how you would like significant gifts received by either of you from family members, friends or other third parties during your marriage to be treated if you separate or divorce.

Gifts may include money, property, jewellery, vehicles, investments or other valuable items.

For example, you may wish for a gift to remain the separate property of the person receiving it, to be treated as a shared asset, or to follow another arrangement.

Choose the option that best reflects your intentions. If you have a different arrangement in mind, select Other and briefly describe it.

Your answers will help your solicitors understand your intentions and prepare suitable terms for the agreement.`;

const INHERITANCE_AMOUNT_TOOLTIP =
  "Enter the inheritance amount in the currency in which it is expected to be received or has been received. If the inheritance is in a foreign currency, select that currency and provide an approximate equivalent value in GBP (\u00a3), if known. If the inheritance amount is not yet known, you can leave these fields blank.";

const INHERITANCE_BASIS_TOOLTIP =
  "You may mention an estimated valuation, the date of the valuation, the exchange rate used, or any supporting information such as a will, probate papers or a family trust document.";

const SPOUSAL_MAINTENANCE_TOOLTIP = `Spousal maintenance is ongoing financial support that one person may be required to pay to their former spouse or civil partner following separation or divorce.

Consider whether you would prefer a clean financial break, whether ongoing financial support may be appropriate in certain circumstances, or whether you have another arrangement in mind.

For example, one person may reduce their working hours or give up their career to care for children or support the family.

Choose the option that best reflects your intentions. Your solicitors can advise on how these intentions may be reflected in the agreement.`;

const CRITICAL_ILLNESS_TOOLTIP = `During a marriage, circumstances may change because of serious illness, disability or a significant loss of earning capacity.

For example, one person may become unable to work, require long-term care or need additional financial support.

Consider whether you would like these circumstances to trigger a review of your financial arrangements.

A review does not automatically change or cancel the agreement. Any proposed changes should be discussed with independent solicitors and properly documented.`;

const DEATH_WILLS_TOOLTIP = `A prenuptial agreement primarily deals with financial arrangements if your marriage ends through separation or divorce. It does not replace a Will or determine how your estate will automatically be distributed when you die.

Consider whether you have Wills in place and whether you would like your estate plans to be reviewed following marriage or a significant change in circumstances.

For example, you may wish to provide for your spouse, children from a previous relationship, or other family members.

Your solicitors can advise on how your intentions should be reflected in your agreement and whether your Wills need to be updated.`;

const complexityGates: {
  key: SpecialCircumstanceKey;
  tag: string;
  question: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    key: "pregnancyOrAdoption",
    tag: "Pregnancy",
    question: "Is either of you currently pregnant, or actively pursuing adoption?",
    icon: Baby,
  },
  {
    key: "sharedBusiness",
    tag: "Shared Commerce",
    question: "Do you jointly own, operate or manage a business?",
    icon: Briefcase,
  },
  {
    key: "financialReliance",
    tag: "Financial Reliance",
    question:
      "Is either of you financially dependent on the other, unable to work, or on extended sick leave?",
    icon: HelpingHand,
  },
  {
    key: "coOwnedRealEstate",
    tag: "Co-Owned Real Estate",
    question:
      "Is your family home or another property jointly owned with someone outside your relationship?",
    icon: Home,
  },
  {
    key: "highValueAssets",
    tag: "High-Value Threshold",
    question: "Do your combined worldwide net assets have an estimated value of \u00a33 million or more?",
    icon: Gem,
  },
  {
    key: "priorDependents",
    tag: "Prior Dependants",
    question:
      "Does a child from either of your current or previous relationships live with you, either full-time or part-time?",
    icon: Users,
  },
];

/* ---------------------------------------------------------------------- */
/* Defaults                                                                */
/* ---------------------------------------------------------------------- */

function makeInheritanceEntry(): InheritanceEntry {
  return {
    id: makeId("inh"),
    recipientPartner: "",
    inheritanceStatus: "",
    composition: "",
    originalAmount: "",
    originalCurrency: "GBP",
    gbpEquivalent: "",
    basisOfEstimate: "",
    treatment: "",
    contributionText: "",
    percentageValue: "",
    customText: "",
  };
}

const defaultValues: MatrimonialAgreementFormValues = {
  futureAssetsTreatment: "SeparateToAcquirer",
  customFutureAssets: "",
  futureGiftsTreatment: "SeparateToRecipient",
  customFutureGifts: "",
  inheritanceSelection: "NoneExpected",
  inheritanceEntries: [],
  spousalMaintenanceIntention: "MutualWaiver",
  customSpousalMaintenance: "",
  criticalIllnessSafeguard: "ReviewAgreement",
  customHealthSafeguards: "",
  deathWillsAlignment: "FollowWills",
  customDeathWills: "",
  reviewTriggerType: "Standard",
  standardMilestones: ["child_birth", "career_change", "financial_change", "5_year", "10_year"],
  customReviewTriggers: "",
  specialCircumstances: {
    pregnancyOrAdoption: "No",
    sharedBusiness: "No",
    financialReliance: "No",
    coOwnedRealEstate: "No",
    highValueAssets: "No",
    priorDependents: "No",
  },
  specialCircumstancesOverview: "",
};

// Saved rows come back without the client-side id that React uses as a key
function hydrateEntries(entries: unknown): InheritanceEntry[] {
  if (!Array.isArray(entries)) return [];
  return entries.map((entry) => ({
    ...makeInheritanceEntry(),
    ...(entry as Partial<InheritanceEntry>),
    id: (entry as Partial<InheritanceEntry>)?.id || makeId("inh"),
  }));
}

export default function MatrimonialAgreementPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const cases = useSelector((state: RootState) => state.cases);
  const caseId = cases.caseId || user?.inviteCaseId;

  // The joint section is read-only while the partner holds the pen or once
  // both partners have approved
  const { canEdit } = useJointSectionStatus();

  const [formData, setFormData] = useState<MatrimonialAgreementFormValues>(defaultValues);

  // The inheritance register is stored against "Partner 1" (the case owner)
  // and "Partner 2" (the invited partner), but shown with their names.
  const fullNameOf = (info: unknown) => {
    const p = (info as { personalInformation?: { firstName?: string; lastName?: string } })
      ?.personalInformation;
    return [p?.firstName, p?.lastName].filter(Boolean).join(" ").trim();
  };
  const recipientOptions = [
    { value: "Partner 1", label: fullNameOf(cases.myInformation) || "Partner 1" },
    { value: "Partner 2", label: fullNameOf(cases.partnerInformation) || "Partner 2" },
  ];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mainEl = document.querySelector("main");
    if (mainEl) mainEl.scrollTop = 0;
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, []);

  // Load existing answers
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!caseId) {
        setIsLoading(false);
        return;
      }

      const apply = (existing: Partial<MatrimonialAgreementFormValues> | undefined) => {
        if (!existing || !isMounted) return;
        setFormData({
          ...defaultValues,
          ...existing,
          inheritanceEntries: hydrateEntries(existing.inheritanceEntries),
          standardMilestones: Array.isArray(existing.standardMilestones)
            ? existing.standardMilestones
            : defaultValues.standardMilestones,
          specialCircumstances: {
            ...defaultValues.specialCircumstances,
            ...(existing.specialCircumstances ?? {}),
          },
        });
      };

      try {
        const { data } = await Axios.get(`/cases/${caseId}/section/jointInformation`);
        apply(
          data?.data?.matrimonialAgreement ||
            (cases.jointInformation as any)?.matrimonialAgreement,
        );
      } catch {
        // Fall back to whatever the case already holds in the store
        apply((cases.jointInformation as any)?.matrimonialAgreement);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [caseId, cases.jointInformation]);

  const { errors, validate, clearError, summary } =
    useFormValidation(matrimonialAgreementSchema);

  const setField = <K extends keyof MatrimonialAgreementFormValues>(
    key: K,
    value: MatrimonialAgreementFormValues[K],
  ) => {
    clearError(key as string);
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  /** One inheritance row's own messages, keyed by its field names. */
  const entryIssues = (id: string) =>
    errorsUnder(
      errors,
      `inheritanceEntries.${formData.inheritanceEntries.findIndex((r) => r.id === id)}`,
    );

  const setEntries: React.Dispatch<React.SetStateAction<InheritanceEntry[]>> = (update) =>
    setFormData((prev) => ({
      ...prev,
      inheritanceEntries:
        typeof update === "function" ? update(prev.inheritanceEntries) : update,
    }));

  const handleInheritanceSelection = (value: InheritanceSelection) => {
    setFormData((prev) => ({
      ...prev,
      inheritanceSelection: value,
      inheritanceEntries:
        value === "LogDetails"
          ? prev.inheritanceEntries.length === 0
            ? [makeInheritanceEntry()]
            : prev.inheritanceEntries
          : [],
    }));
  };

  const handleMilestone = (milestone: StandardMilestone, checked: boolean) => {
    clearError("standardMilestones");
    setFormData((prev) => ({
      ...prev,
      standardMilestones: checked
        ? [...prev.standardMilestones, milestone]
        : prev.standardMilestones.filter((item) => item !== milestone),
    }));
  };

  const handleGate = (key: SpecialCircumstanceKey, value: YesNo) => {
    setFormData((prev) => ({
      ...prev,
      specialCircumstances: { ...prev.specialCircumstances, [key]: value },
    }));
  };

  const hasSpecialCircumstances = Object.values(formData.specialCircumstances).some(
    (value) => value === "Yes",
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseId) {
      toast.error("Case ID not found. Please refresh.");
      return;
    }

    const payload = {
      ...formData,
      // Answers to the questions that are no longer on screen are dropped so
      // they can't contradict the saved choice
      customFutureAssets:
        formData.futureAssetsTreatment === "Custom" ? formData.customFutureAssets : "",
      customFutureGifts:
        formData.futureGiftsTreatment === "Custom" ? formData.customFutureGifts : "",
      customSpousalMaintenance:
        formData.spousalMaintenanceIntention === "Custom"
          ? formData.customSpousalMaintenance
          : "",
      customHealthSafeguards:
        formData.criticalIllnessSafeguard === "Custom" ? formData.customHealthSafeguards : "",
      customDeathWills:
        formData.deathWillsAlignment === "Custom" ? formData.customDeathWills : "",
      // A GBP amount is its own estimated value; only another currency needs
      // the approximate GBP equivalent entered separately.
      inheritanceEntries: formData.inheritanceEntries.map((entry) =>
        entry.originalCurrency === "GBP"
          ? { ...entry, gbpEquivalent: entry.originalAmount }
          : entry,
      ),
      standardMilestones:
        formData.reviewTriggerType === "Standard" ? formData.standardMilestones : [],
      customReviewTriggers:
        formData.reviewTriggerType === "Custom" ? formData.customReviewTriggers : "",
      specialCircumstancesOverview: hasSpecialCircumstances
        ? formData.specialCircumstancesOverview
        : "",
    };

    // Checked on what will actually be sent, so a "Custom" box that was filled
    // in and then switched away from is not asked for again.
    if (!validate(payload)) return;

    setIsSubmitting(true);
    try {
      await Axios.post(`/cases/${caseId}/questionnaire/matrimonial-agreement`, payload);
      await dispatch(getCasesDetails(caseId));
      toast.success("Saved. Review everything, then send the approval request to your partner.");
      router.push("/dashboard/final-review-confirmation");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to save matrimonial agreement intentions."));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-slate-500">Loading your information...</p>
      </div>
    );
  }

  const formBody = (
    <div className="space-y-8">
      {/* ============================================================== */}
      {/* OUR MATRIMONIAL AGREEMENT                                       */}
      {/* ============================================================== */}
      <div>
        <TrackHeader>Our Matrimonial Agreement</TrackHeader>

        <div className="space-y-8">
          {/* 1. Future acquired assets & debts */}
          <div className={groupClasses}>
            <div className="flex items-center gap-3.5 mb-3.5">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${getBadgeGradient(
                  0
                )} text-white shadow-md ring-1 ring-white/20 ring-inset [&>svg]:h-5.5 [&>svg]:w-5.5 [&>svg]:stroke-[2.2] [&>svg]:text-white [&>svg]:drop-shadow-xs`}
              >
                <PackagePlus />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-[17px] font-bold text-slate-900 tracking-tight">
                  Future Acquired Assets &amp; Debts
                </h2>
                <Tooltip text={FUTURE_ASSETS_TOOLTIP} />
              </div>
            </div>
            <label className={labelClasses}>
              1. How would you like assets and debts acquired during your marriage to be treated if
              you separate?
            </label>
            <ChoiceCards
              name="futureAssetsTreatment"
              value={formData.futureAssetsTreatment}
              options={futureAssetsOptions}
              onChange={(value) => setField("futureAssetsTreatment", value)}
            />
            {formData.futureAssetsTreatment === "Custom" && (
              <NestedBlock>
                <label className={nestedLabelClasses}>
                  Describe your arrangement:
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.customFutureAssets}
                  onChange={(e) => setField("customFutureAssets", e.target.value)}
                  placeholder="Describe how you would like assets and debts acquired during the marriage to be treated..."
                  className={fieldClassesFor(fieldClasses, errors.customFutureAssets)}
                />
                <FieldMessage error={errors.customFutureAssets} path="customFutureAssets" />
                <div className={captionClasses}>
                  Describe how future assets should be managed (e.g., keeping individual investments
                  separate but sharing any assets bought for family use).
                </div>
              </NestedBlock>
            )}
          </div>

          {/* 2. Future gifts */}
          <div className={groupClasses}>
            <div className="flex items-center gap-3.5 mb-3.5">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${getBadgeGradient(
                  1
                )} text-white shadow-md ring-1 ring-white/20 ring-inset [&>svg]:h-5.5 [&>svg]:w-5.5 [&>svg]:stroke-[2.2] [&>svg]:text-white [&>svg]:drop-shadow-xs`}
              >
                <Gift />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-[17px] font-bold text-slate-900 tracking-tight">
                  Future Gifts Treatment
                </h2>
                <Tooltip text={FUTURE_GIFTS_TOOLTIP} />
              </div>
            </div>
            <label className={labelClasses}>
              2. How would you like significant gifts received by either of you during your marriage
              to be treated if you separate?
            </label>
            <ChoiceCards
              name="futureGiftsTreatment"
              value={formData.futureGiftsTreatment}
              options={futureGiftsOptions}
              onChange={(value) => setField("futureGiftsTreatment", value)}
            />
            {formData.futureGiftsTreatment === "Custom" && (
              <NestedBlock>
                <label className={nestedLabelClasses}>Describe your arrangement:</label>
                <textarea
                  rows={3}
                  required
                  value={formData.customFutureGifts}
                  onChange={(e) => setField("customFutureGifts", e.target.value)}
                  placeholder="Describe how you would like significant gifts to be treated if you separate..."
                  className={fieldClassesFor(fieldClasses, errors.customFutureGifts)}
                />
                <FieldMessage error={errors.customFutureGifts} path="customFutureGifts" />
              </NestedBlock>
            )}
          </div>

          {/* 3. Future inheritances */}
          <div className={groupClasses}>
            <div className="flex items-center gap-3.5 mb-3.5">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${getBadgeGradient(
                  2
                )} text-white shadow-md ring-1 ring-white/20 ring-inset [&>svg]:h-5.5 [&>svg]:w-5.5 [&>svg]:stroke-[2.2] [&>svg]:text-white [&>svg]:drop-shadow-xs`}
              >
                <Landmark />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-[17px] font-bold text-slate-900 tracking-tight">
                  Future Inheritances
                </h2>
                <Tooltip text="Inheritances are often treated separately by the courts, but circumstances may affect how they are considered in practice." />
              </div>
            </div>
            <label className={labelClasses}>
              3. Do either of you expect to receive, or are you currently receiving, an
              inheritance?
            </label>
            <ChoiceCards
              name="inheritanceSelection"
              value={formData.inheritanceSelection}
              options={inheritanceOptions}
              onChange={handleInheritanceSelection}
            />

            {formData.inheritanceSelection === "LogDetails" && (
              <div className="mt-4 rounded-xl border border-[#E7E7F2] bg-white/70 p-4">
                <div className="mb-3 text-xs font-bold uppercase tracking-wider text-[#9494AA]">
                  Inheritance Register
                </div>

                <FieldMessage
                  error={errors.inheritanceEntries}
                  path="inheritanceEntries"
                  className="mb-3"
                />

                {formData.inheritanceEntries.map((row) => (
                  <div
                    key={row.id}
                    className={`relative mb-3 rounded-lg border bg-white p-4 ${
                      Object.keys(entryIssues(row.id)).length > 0
                        ? "border-rose-300 ring-1 ring-rose-200"
                        : "border-[#E7E7F2]"
                    }`}
                  >
                    <button
                      type="button"
                      aria-label="Remove inheritance entry"
                      onClick={() => {
                        // Removing a row renumbers the ones after it, so this
                        // list's messages go and the next submit re-states them.
                        clearError("inheritanceEntries");
                        removeRow(setEntries, row.id);
                      }}
                      className="absolute right-3 top-3 text-sm text-slate-400 transition hover:text-red-500"
                    >
                      ✕
                    </button>

                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 pr-6 sm:grid-cols-2">
                      <div>
                        <label className={subLabelClasses}>
                          Recipient Partner <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          value={row.recipientPartner}
                          onChange={(e) =>
                            updateRow(setEntries, row.id, {
                              recipientPartner: e.target
                                .value as InheritanceEntry["recipientPartner"],
                            })
                          }
                          className={fieldClasses}
                        >
                          <option value="">Select recipient</option>
                          {recipientOptions.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className={subLabelClasses}>
                          Inheritance Status <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          value={row.inheritanceStatus}
                          onChange={(e) =>
                            updateRow(setEntries, row.id, {
                              inheritanceStatus: e.target
                                .value as InheritanceEntry["inheritanceStatus"],
                            })
                          }
                          className={fieldClasses}
                        >
                          <option value="">Select status</option>
                          <option value="FutureExpectation">Expected</option>
                          <option value="PendingProbate">Pending (in probate or settlement)</option>
                          <option value="Received">Received</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-3.5">
                      <label className={subLabelClasses}>
                        Inheritance Description <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={row.composition}
                        onChange={(e) =>
                          updateRow(setEntries, row.id, { composition: e.target.value })
                        }
                        placeholder="e.g., Family property, cash inheritance, shares or investments"
                        className={fieldClasses}
                      />
                    </div>

                    {row.inheritanceStatus === "FutureExpectation" && (
                      <div className="mb-3.5 rounded-lg border border-amber-200 bg-amber-50/70 px-3.5 py-2.5 text-[12px] leading-relaxed text-amber-900">
                        As this inheritance is only expected, any amount and value you enter are
                        estimates.
                      </div>
                    )}
                    {row.inheritanceStatus === "Received" && (
                      <div className="mb-3.5 rounded-lg border border-indigo-100 bg-indigo-50/60 px-3.5 py-2.5 text-[12px] leading-relaxed text-indigo-900">
                        As this inheritance has been received, you can enter the actual amount or its
                        current estimated value.
                      </div>
                    )}

                    <div
                      className={`mb-3.5 grid grid-cols-1 gap-3.5 ${
                        row.originalCurrency === "GBP" ? "sm:grid-cols-2" : "sm:grid-cols-3"
                      }`}
                    >
                      <div>
                        <label className={`${subLabelClasses} flex items-center`}>
                          Inheritance Amount
                          <span className="ml-1 font-normal text-slate-400">(optional)</span>
                          <Tooltip text={INHERITANCE_AMOUNT_TOOLTIP} />
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={row.originalAmount}
                          onChange={(e) =>
                            updateRow(setEntries, row.id, {
                              originalAmount: e.target.value,
                              ...(row.originalCurrency === "GBP"
                                ? { gbpEquivalent: e.target.value }
                                : {}),
                            })
                          }
                          placeholder={
                            row.inheritanceStatus === "FutureExpectation"
                              ? "Estimated amount"
                              : "Amount"
                          }
                          className={fieldClasses}
                        />
                      </div>
                      <div>
                        <label className={subLabelClasses}>
                          Currency
                          {row.originalAmount && <span className="ml-1 text-red-500">*</span>}
                        </label>
                        <select
                          value={row.originalCurrency}
                          onChange={(e) => {
                            const currency = e.target.value;
                            updateRow(setEntries, row.id, {
                              originalCurrency: currency,
                              // GBP copies the amount across; another currency
                              // needs its own approximate GBP value entered.
                              gbpEquivalent: currency === "GBP" ? row.originalAmount : "",
                            });
                          }}
                          className={fieldClasses}
                        >
                          {currencyOptions.map((currency) => (
                            <option key={currency.value} value={currency.value}>
                              {currency.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      {row.originalCurrency !== "GBP" && (
                        <div>
                          <label className={subLabelClasses}>
                            Estimated Value (&pound;)
                            <span className="ml-1 font-normal text-slate-400">(recommended)</span>
                          </label>
                          <input
                            type="number"
                            min={0}
                            value={row.gbpEquivalent}
                            onChange={(e) =>
                              updateRow(setEntries, row.id, { gbpEquivalent: e.target.value })
                            }
                            placeholder="Approximate £ equivalent"
                            className={fieldClasses}
                          />
                        </div>
                      )}
                    </div>
                    {row.originalCurrency !== "GBP" && (
                      <p className="-mt-2 mb-3.5 text-[11.5px] leading-relaxed text-slate-500">
                        Please enter an approximate GBP equivalent yourself. We do not convert
                        amounts using a live exchange rate.
                      </p>
                    )}

                    <div className="mb-3.5">
                      <label className={`${subLabelClasses} flex items-center`}>
                        Basis of Estimate
                        <span className="ml-1 font-normal text-slate-400">(optional)</span>
                        <Tooltip text={INHERITANCE_BASIS_TOOLTIP} />
                      </label>
                      <textarea
                        rows={2}
                        value={row.basisOfEstimate}
                        onChange={(e) =>
                          updateRow(setEntries, row.id, { basisOfEstimate: e.target.value })
                        }
                        placeholder="e.g., estimated valuation, valuation date, exchange rate or supporting information"
                        className={fieldClasses}
                      />
                    </div>

                    <div>
                      <label className={subLabelClasses}>
                        Future Matrimonial Treatment <span className="text-red-500">*</span>
                      </label>
                      <div className="relative w-full">
                        <select
                          required
                          value={row.treatment}
                          onChange={(e) =>
                            updateRow(setEntries, row.id, { treatment: e.target.value as Treatment })
                          }
                          title="This records your current intentions. Your independent solicitors will discuss whether the proposed arrangements are appropriate and legally workable."
                          className={`${fieldClasses} appearance-none pr-16 cursor-pointer`}
                        >
                          <option value="">How should this inheritance be treated?</option>
                          {inheritanceTreatmentOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-9 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                          <Tooltip text="This records your current intentions. Your independent solicitors will discuss whether the proposed arrangements are appropriate and legally workable." />
                        </div>
                      </div>

                      {row.treatment === "Contribution" && (
                        <NestedBlock>
                          <label className={nestedLabelClasses}>Contribution Formula</label>
                          <input
                            type="text"
                            required
                            value={row.contributionText}
                            onChange={(e) =>
                              updateRow(setEntries, row.id, { contributionText: e.target.value })
                            }
                            placeholder="Explain contribution arrangement"
                            className={fieldClasses}
                          />
                        </NestedBlock>
                      )}

                      {row.treatment === "Percentage" && (
                        <NestedBlock>
                          <label className={nestedLabelClasses}>Percentage Split</label>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            required
                            value={row.percentageValue}
                            onChange={(e) =>
                              updateRow(setEntries, row.id, { percentageValue: e.target.value })
                            }
                            placeholder="Percentage (%)"
                            className={fieldClasses}
                          />
                        </NestedBlock>
                      )}

                      {row.treatment === "Custom" && (
                        <NestedBlock>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <label className={nestedLabelClasses}>Custom Arrangement</label>
                            <Tooltip text="Describe any bespoke arrangements you would like your independent solicitors to consider when preparing the draft agreement." />
                          </div>
                          <textarea
                            rows={2}
                            required
                            value={row.customText}
                            onChange={(e) =>
                              updateRow(setEntries, row.id, { customText: e.target.value })
                            }
                            placeholder="Describe your custom inheritance arrangement."
                            className={fieldClasses}
                          />
                        </NestedBlock>
                      )}
                    </div>

                    {/* The row's fields are written out one by one here, so
                        what it is still missing is listed once, at its foot. */}
                    {Object.keys(entryIssues(row.id)).length > 0 && (
                      <div
                        role="alert"
                        data-error-path={`inheritanceEntries.${formData.inheritanceEntries.findIndex(
                          (r) => r.id === row.id,
                        )}`}
                        className="mt-3 rounded-lg border border-rose-200 bg-rose-50/70 px-3.5 py-2.5"
                      >
                        <ul className="space-y-1 text-[11.5px] font-medium leading-snug text-rose-700">
                          {Object.entries(entryIssues(row.id)).map(([field, message]) => (
                            <li key={field}>{message}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    clearError("inheritanceEntries");
                    setEntries((prev) => [...prev, makeInheritanceEntry()]);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#6D28D9] bg-white px-4 py-2.5 text-sm font-semibold text-[#6D28D9] transition hover:border-solid hover:bg-[#EDE9FE]/40"
                >
                  + Add Inheritance Entry
                </button>
              </div>
            )}
          </div>

          {/* 4. Spousal maintenance */}
          <div className={groupClasses}>
            <div className="flex items-center gap-3.5 mb-3.5">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${getBadgeGradient(
                  3
                )} text-white shadow-md ring-1 ring-white/20 ring-inset [&>svg]:h-5.5 [&>svg]:w-5.5 [&>svg]:stroke-[2.2] [&>svg]:text-white [&>svg]:drop-shadow-xs`}
              >
                <Scale />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-[17px] font-bold text-slate-900 tracking-tight">
                  Spousal Maintenance Waiver
                </h2>
                <Tooltip text={SPOUSAL_MAINTENANCE_TOOLTIP} />
              </div>
            </div>
            <label className={labelClasses}>
              4. What is your intended approach to spousal maintenance if you separate?
            </label>
            <ChoiceCards
              name="spousalMaintenanceIntention"
              value={formData.spousalMaintenanceIntention}
              options={spousalMaintenanceOptions}
              onChange={(value) => setField("spousalMaintenanceIntention", value)}
            />
            {formData.spousalMaintenanceIntention === "Custom" && (
              <NestedBlock>
                <label className={nestedLabelClasses}>
                  Describe your arrangement:
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.customSpousalMaintenance}
                  onChange={(e) => setField("customSpousalMaintenance", e.target.value)}
                  placeholder="Describe your intended approach to spousal maintenance if you separate..."
                  className={fieldClassesFor(fieldClasses, errors.customSpousalMaintenance)}
                />
                <FieldMessage error={errors.customSpousalMaintenance} path="customSpousalMaintenance" />
              </NestedBlock>
            )}
          </div>

          {/* 5. Critical illness safeguards */}
          <div className={groupClasses}>
            <div className="flex items-center gap-3.5 mb-3.5">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${getBadgeGradient(
                  4
                )} text-white shadow-md ring-1 ring-white/20 ring-inset [&>svg]:h-5.5 [&>svg]:w-5.5 [&>svg]:stroke-[2.2] [&>svg]:text-white [&>svg]:drop-shadow-xs`}
              >
                <HeartPulse />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-[17px] font-bold text-slate-900 tracking-tight">
                  Critical Illness Safeguards
                </h2>
                <Tooltip text={CRITICAL_ILLNESS_TOOLTIP} />
              </div>
            </div>
            <label className={labelClasses}>
              5. Should a serious illness or disability affecting either of you be considered when
              reviewing your agreement?
            </label>
            <ChoiceCards
              name="criticalIllnessSafeguard"
              value={formData.criticalIllnessSafeguard}
              options={criticalIllnessOptions}
              onChange={(value) => setField("criticalIllnessSafeguard", value)}
            />
            {formData.criticalIllnessSafeguard === "Custom" && (
              <NestedBlock>
                <label className={nestedLabelClasses}>
                  What specific arrangement would you like considered?
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.customHealthSafeguards}
                  onChange={(e) => setField("customHealthSafeguards", e.target.value)}
                  placeholder="Describe how you would like your financial arrangements to be reviewed or adjusted if either of you experiences a serious illness or disability. For example, you may wish to consider additional financial support, changes to how certain assets are treated, or a review of your existing arrangements."
                  className={fieldClassesFor(fieldClasses, errors.customHealthSafeguards)}
                />
                <FieldMessage error={errors.customHealthSafeguards} path="customHealthSafeguards" />
              </NestedBlock>
            )}
          </div>

          {/* 6. Death & Wills alignment */}
          <div className={groupClasses}>
            <div className="flex items-center gap-3.5 mb-3.5">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${getBadgeGradient(
                  5
                )} text-white shadow-md ring-1 ring-white/20 ring-inset [&>svg]:h-5.5 [&>svg]:w-5.5 [&>svg]:stroke-[2.2] [&>svg]:text-white [&>svg]:drop-shadow-xs`}
              >
                <FileSignature />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-[17px] font-bold text-slate-900 tracking-tight">
                  Death &amp; Wills Alignment
                </h2>
                <Tooltip text={DEATH_WILLS_TOOLTIP} />
              </div>
            </div>
            <label className={labelClasses}>
              6. How would you like your financial arrangements to be considered if either of you
              dies during the marriage?
            </label>
            <ChoiceCards
              name="deathWillsAlignment"
              value={formData.deathWillsAlignment}
              options={deathWillsOptions}
              onChange={(value) => setField("deathWillsAlignment", value)}
            />
            {formData.deathWillsAlignment === "Custom" && (
              <NestedBlock>
                <label className={nestedLabelClasses}>Describe your arrangement:</label>
                <textarea
                  rows={3}
                  required
                  value={formData.customDeathWills}
                  onChange={(e) => setField("customDeathWills", e.target.value)}
                  placeholder="Describe how you would like your financial arrangements to be considered if either of you dies during the marriage..."
                  className={fieldClassesFor(fieldClasses, errors.customDeathWills)}
                />
                <FieldMessage error={errors.customDeathWills} path="customDeathWills" />
              </NestedBlock>
            )}
          </div>

          {/* 7. Review triggers */}
          <div className={groupClasses}>
            <div className="flex items-center gap-3.5 mb-3.5">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${getBadgeGradient(
                  6
                )} text-white shadow-md ring-1 ring-white/20 ring-inset [&>svg]:h-5.5 [&>svg]:w-5.5 [&>svg]:stroke-[2.2] [&>svg]:text-white [&>svg]:drop-shadow-xs`}
              >
                <CalendarClock />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-[17px] font-bold text-slate-900 tracking-tight">
                  Agreement Review Triggers
                </h2>
                <Tooltip text="Regular reviews can help ensure that your agreement remains appropriate following significant life events." />
              </div>
            </div>
            <label className={labelClasses}>
              7. When should this agreement be reviewed?
            </label>
            <p className={helpClasses}>
              A nuptial agreement is legally stronger if reviewed during major life changes.
            </p>
            <ChoiceCards
              name="reviewTriggerType"
              value={formData.reviewTriggerType}
              options={reviewTriggerOptions}
              onChange={(value) => setField("reviewTriggerType", value)}
            />

            {formData.reviewTriggerType === "Standard" && (
              <NestedBlock>
                <p className="mb-3 text-xs font-semibold text-[#1E1B3C]">
                  Specify which milestones apply:
                </p>
                <div className="space-y-2">
                  {milestoneOptions.map((milestone) => (
                    <label
                      key={milestone.value}
                      className="flex cursor-pointer items-center gap-2.5 text-sm text-[#1E1B3C]"
                    >
                      <input
                        type="checkbox"
                        checked={formData.standardMilestones.includes(milestone.value)}
                        onChange={(e) => handleMilestone(milestone.value, e.target.checked)}
                        className="rounded text-[#6D28D9] focus:ring-[#6D28D9]"
                      />
                      <span>{milestone.label}</span>
                    </label>
                  ))}
                </div>
                <FieldMessage
                  error={errors.standardMilestones}
                  path="standardMilestones"
                  className="mt-2"
                />
              </NestedBlock>
            )}

            {formData.reviewTriggerType === "Custom" && (
              <NestedBlock>
                <label className={nestedLabelClasses}>Our Review Milestones</label>
                <textarea
                  rows={3}
                  required
                  value={formData.customReviewTriggers}
                  onChange={(e) => setField("customReviewTriggers", e.target.value)}
                  placeholder="e.g. Every 3 years, if either of us relocates permanently outside the UK, or following a significant inheritance..."
                  className={fieldClassesFor(fieldClasses, errors.customReviewTriggers)}
                />
                <FieldMessage error={errors.customReviewTriggers} path="customReviewTriggers" />
              </NestedBlock>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SPECIAL CIRCUMSTANCES & CASE COMPLEXITY                         */}
      {/* ============================================================== */}
      <div className="border-t border-[#EDEDF5] pt-8">
        <TrackHeader>Special Circumstances &amp; Case Complexity</TrackHeader>

        <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-[#C7D2FE] bg-[#EEF2FF] p-4 text-[13px] leading-relaxed text-[#3730A3]">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#4F46E5]" aria-hidden="true" />
          <p>
            <strong>Why we ask these questions:</strong> Your answers help identify circumstances
            that may require additional legal consideration when preparing your prenuptial
            agreement. Please answer each question accurately so your legal team can assess your
            circumstances appropriately.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {complexityGates.map((gate, idx) => {
            const Icon = gate.icon;
            return (
              <div key={gate.key} className={groupClasses}>
                <div className="flex items-center gap-3.5 mb-3.5">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${getBadgeGradient(
                      idx
                    )} text-white shadow-md ring-1 ring-white/20 ring-inset [&>svg]:h-5.5 [&>svg]:w-5.5 [&>svg]:stroke-[2.2] [&>svg]:text-white [&>svg]:drop-shadow-xs`}
                  >
                    <Icon />
                  </div>
                  <h3 className="text-base sm:text-[17px] font-bold text-slate-900 tracking-tight">
                    {gate.tag}
                  </h3>
                </div>
                <label className="mb-3 block text-[13.5px] sm:text-[14px] font-bold text-slate-900 leading-relaxed">
                  {gate.question}
                </label>
                <YesNoCards
                  name={gate.key}
                  value={formData.specialCircumstances[gate.key]}
                  onChange={(value) => handleGate(gate.key, value)}
                />
              </div>
            );
          })}
        </div>

        {hasSpecialCircumstances && (
          <div className="mt-6 rounded-r-xl border border-[#FBD5D5] border-l-4 border-l-red-500 bg-red-50/40 p-5 md:p-6">
            <span className="mb-3 inline-block rounded-full bg-red-100 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-red-700">
              Additional context
            </span>
            <label
              htmlFor="specialCircumstancesOverview"
              className="block text-sm font-bold text-red-700"
            >
              Additional Information for Your Legal Team
            </label>
            <p className="mt-1 text-[12.5px] leading-relaxed text-slate-600">
              Please provide any additional information about the circumstances you have identified
              above. This will help your legal team understand your situation and determine whether
              further information or legal consideration is required.
            </p>
            <textarea
              id="specialCircumstancesOverview"
              rows={4}
              value={formData.specialCircumstancesOverview}
              onChange={(e) => setField("specialCircumstancesOverview", e.target.value)}
              placeholder="Please provide any relevant details about your circumstances..."
              className={fieldClassesFor(
                `mt-3 ${fieldClasses}`,
                errors.specialCircumstancesOverview,
              )}
            />
            <FieldMessage
              error={errors.specialCircumstancesOverview}
              path="specialCircumstancesOverview"
            />
          </div>
        )}
      </div>
    </div>
  );

  const backButton = (
    <button
      type="button"
      onClick={() => router.push("/dashboard/joint-liabilities-debts")}
      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900"
    >
      ← Back
    </button>
  );

  return (
    <div className="min-h-full bg-[#F8FAFC] px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        {/* Top Header Row matching Income & Revenue */}
        <div className="mb-7 flex items-start justify-between gap-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1 text-[11.5px] font-semibold text-indigo-700 border border-indigo-100/90 shadow-2xs">
                Step 4 of 4
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F89AA8] via-[#E28691] to-[#C0374F] text-white shadow-md shadow-slate-900/10 ring-1 ring-white/30 ring-inset">
                <HeartHandshake className="h-5.5 w-5.5 text-white stroke-[2.2] drop-shadow-xs" />
              </div>
              <h1 className="text-2xl sm:text-[27px] font-bold tracking-tight text-slate-900">
                Matrimonial Agreement &amp; Intentions
              </h1>
            </div>

            <p className="mt-2 pl-[58px] max-w-2xl text-[13.5px] leading-relaxed text-[#64748B]">
              Please define your joint intentions and agreed approach regarding future assets, gifts
              and inheritances, ongoing maintenance, and regular agreement review under English law.
            </p>
          </div>

          <FormShellIllustration />
        </div>

        <JointStatusBanner isReviewPage={false} />

        {canEdit ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {formBody}

            {/* Bottom Submit Bar matching other forms and Picture 3 */}
            <div className="mt-8 flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200/80">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="text-[13.5px] font-semibold text-[#5B4DF5] transition hover:text-[#4338CA] text-left cursor-pointer"
              >
                Save and exit
              </button>

              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                {summary && (
                  <p
                    role="alert"
                    className="flex items-center gap-2 text-[12.5px] font-semibold text-rose-600 sm:mr-1"
                  >
                    <TriangleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {summary}
                  </p>
                )}
                {backButton}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-[42px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-[#5B4DF5] hover:from-indigo-700 hover:to-[#4E3EEA] px-7 text-[13.5px] font-semibold text-white shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-[#5B4DF5]/30 disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? "Saving..." : "Save & Continue to Final Review →"}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="mt-6 space-y-6">
            <fieldset disabled className="m-0 border-0 p-0 space-y-6">
              {formBody}
            </fieldset>

            <div className="mt-8 flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200/80">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="text-[13.5px] font-semibold text-[#5B4DF5] transition hover:text-[#4338CA] text-left cursor-pointer"
              >
                Save and exit
              </button>

              <div className="flex items-center gap-3">
                {backButton}
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/final-review-confirmation")}
                  className="inline-flex h-[42px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-[#5B4DF5] hover:from-indigo-700 hover:to-[#4E3EEA] px-7 text-[13.5px] font-semibold text-white shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-[#5B4DF5]/30 cursor-pointer"
                >
                  Continue to Final Review →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
