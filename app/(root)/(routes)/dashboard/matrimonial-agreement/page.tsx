"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Baby,
  Briefcase,
  CalendarClock,
  FileSignature,
  Gem,
  Gift,
  HeartHandshake,
  HeartPulse,
  HelpingHand,
  Home,
  Landmark,
  PackagePlus,
  Scale,
  Users,
} from "lucide-react";
import { FormShellIllustration, getBadgeGradient, Tooltip } from "@/components/questionnaire/QuestionnaireUI";
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
    title: "Keep them with whoever acquires them",
    desc: "They must remain entirely the separate property or sole liability of the person who acquires them.",
  },
  {
    value: "FamilyUseJoint",
    title: "Family-use assets joint, everything else separate",
    desc: "Assets acquired specifically for family use (for example, a family home) will be treated as joint marital assets, while all other assets and liabilities remain separate.",
  },
  {
    value: "PooledEqually",
    title: "Pool and share everything equally",
    desc: "They will be pooled automatically and shared equally (50/50) as joint marital assets/debts.",
  },
  {
    value: "Custom",
    title: "Other",
    desc: "We want to write a custom rule for future assets and debts.",
  },
];

const futureGiftsOptions: Choice<FutureGiftsTreatment>[] = [
  {
    value: "SeparateToRecipient",
    title: "Separate property of the recipient",
    desc: "The gift will be considered a separate asset entirely for the person who receives it.",
  },
  {
    value: "JointEqually",
    title: "Joint marital asset",
    desc: "The gift will be treated as a joint marital asset shared equally between both of us.",
  },
  {
    value: "Custom",
    title: "Other",
    desc: "We want to write a custom rule for future gifts.",
  },
];

const inheritanceOptions: Choice<InheritanceSelection>[] = [
  {
    value: "NoneExpected",
    title: "No inheritance to record",
    desc: "Neither of us expects an inheritance / Any future inheritance stays separate automatically.",
  },
  {
    value: "LogDetails",
    title: "Record our inheritance details",
    desc: "Yes, we want to log our inheritance details and define their rules now.",
  },
];

const spousalMaintenanceOptions: Choice<SpousalMaintenanceIntention>[] = [
  {
    value: "MutualWaiver",
    title: "Mutual waiver — clean break",
    desc: "We both completely waive the right to claim spousal maintenance from each other, ensuring an immediate financial clean break.",
  },
  {
    value: "CareerSacrificeOnly",
    title: "Payable only where a career was sacrificed",
    desc: "Spousal maintenance will be payable, but only to support a partner who sacrificed their career to raise our mutual children.",
  },
  {
    value: "Custom",
    title: "Other",
    desc: "We want to draft a custom framework for potential spousal support.",
  },
];

const criticalIllnessOptions: Choice<CriticalIllnessSafeguard>[] = [
  {
    value: "TermsFixed",
    title: "No — the terms stay fixed",
    desc: "The terms of this agreement must remain fixed regardless of subsequent health changes.",
  },
  {
    value: "Voidable",
    title: "Yes — the agreement becomes voidable",
    desc: "This agreement will become voidable, allowing the courts or the parties to renegotiate a fair distribution based on the new health and care needs.",
  },
  {
    value: "Custom",
    title: "Other",
    desc: "We want to define a specific custom safeguard for illness.",
  },
];

const deathWillsOptions: Choice<DeathWillsAlignment>[] = [
  {
    value: "MirrorDivorce",
    title: "Yes — our Wills will mirror this agreement",
    desc: "Our intentions for asset splitting upon death will mirror our intentions for divorce.",
  },
  {
    value: "ProvideDifferently",
    title: "No — we will provide for each other differently",
    desc: "We intend to provide for each other differently in our Wills if we are happily married when one of us passes away.",
  },
  {
    value: "Unsure",
    title: "Other / Unsure at this stage",
    desc: "We have not yet decided how our Wills should relate to this agreement.",
  },
];

const reviewTriggerOptions: Choice<ReviewTriggerType>[] = [
  {
    value: "Never",
    title: "Never",
    desc: "This agreement is intended to remain permanent unless overridden later.",
  },
  {
    value: "Standard",
    title: "Standard Life Milestones",
    desc: "Review automatically during major marital timeline updates.",
  },
  {
    value: "Custom",
    title: "Custom Schedule",
    desc: "We want to define our own specific review milestones.",
  },
];

const milestoneOptions: { value: StandardMilestone; label: string }[] = [
  { value: "child_birth", label: "Upon the birth or adoption of a child" },
  { value: "career_change", label: "Upon a significant change in health or career capability" },
  { value: "5_year", label: "On our 5th Wedding Anniversary" },
  { value: "10_year", label: "On our 10th Wedding Anniversary" },
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

const complexityGates: {
  key: SpecialCircumstanceKey;
  tag: string;
  question: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    key: "pregnancyOrAdoption",
    tag: "Pregnancy",
    question:
      "Is either partner currently pregnant, or are you in the active stages of adopting a child?",
    icon: Baby,
  },
  {
    key: "sharedBusiness",
    tag: "Shared Commerce",
    question: "Are you and your partner both involved in owning or running the same company?",
    icon: Briefcase,
  },
  {
    key: "financialReliance",
    tag: "Financial Reliance",
    question:
      "Is one of you currently out of work, on extended sick leave, or relying on the other partner for financial support?",
    icon: HelpingHand,
  },
  {
    key: "coOwnedRealEstate",
    tag: "Co-Owned Real Estate",
    question:
      "Is your primary home (or shared property) co-owned with a third party, like a parent or outside investor?",
    icon: Home,
  },
  {
    key: "highValueAssets",
    tag: "High-Value Threshold",
    question:
      "To the best of your knowledge, do your combined net global assets exceed a total valuation of £3,000,000 (3 million Pounds)?",
    icon: Gem,
  },
  {
    key: "priorDependents",
    tag: "Prior Dependents",
    question:
      "Do you have any children from previous relationships, or from your current relationship, living inside your household?",
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
  criticalIllnessSafeguard: "TermsFixed",
  customHealthSafeguards: "",
  deathWillsAlignment: "MirrorDivorce",
  reviewTriggerType: "Standard",
  standardMilestones: ["child_birth", "career_change", "5_year", "10_year"],
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

  const setField = <K extends keyof MatrimonialAgreementFormValues>(
    key: K,
    value: MatrimonialAgreementFormValues[K],
  ) => setFormData((prev) => ({ ...prev, [key]: value }));

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

    setIsSubmitting(true);
    try {
      await Axios.post(`/cases/${caseId}/questionnaire/matrimonial-agreement`, {
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
        standardMilestones:
          formData.reviewTriggerType === "Standard" ? formData.standardMilestones : [],
        customReviewTriggers:
          formData.reviewTriggerType === "Custom" ? formData.customReviewTriggers : "",
        specialCircumstancesOverview: hasSpecialCircumstances
          ? formData.specialCircumstancesOverview
          : "",
      });
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
                <Tooltip text="This section records how you would like future assets and liabilities acquired during the relationship to be treated if you separate." />
              </div>
            </div>
            <label className={labelClasses}>
              1. How should future assets or debts acquired in either of your sole names after the
              marriage ceremony be treated if you separate?
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
                  Custom Future Asset Allocation Rules:
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.customFutureAssets}
                  onChange={(e) => setField("customFutureAssets", e.target.value)}
                  placeholder="Describe alternative asset routing configurations..."
                  className={fieldClasses}
                />
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
                <Tooltip text="Gifts received from third parties may be treated differently depending on how they are used during the relationship." />
              </div>
            </div>
            <label className={labelClasses}>
              2. If one of you is specifically gifted a significant item or sum of money by a third
              party during the marriage, how should it be treated?
            </label>
            <ChoiceCards
              name="futureGiftsTreatment"
              value={formData.futureGiftsTreatment}
              options={futureGiftsOptions}
              onChange={(value) => setField("futureGiftsTreatment", value)}
            />
            {formData.futureGiftsTreatment === "Custom" && (
              <NestedBlock>
                <label className={nestedLabelClasses}>Custom Rules for Personal Gifts:</label>
                <textarea
                  rows={3}
                  required
                  value={formData.customFutureGifts}
                  onChange={(e) => setField("customFutureGifts", e.target.value)}
                  placeholder="Define exactly how third-party gifts should be treated if you separate..."
                  className={fieldClasses}
                />
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
              3. Do either of you expect to receive a family inheritance, or do you have a pending
              inheritance currently in probate?
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
                  Expected &amp; Pending Inheritance Register
                </div>

                {formData.inheritanceEntries.map((row) => (
                  <div
                    key={row.id}
                    className="relative mb-3 rounded-lg border border-[#E7E7F2] bg-white p-4"
                  >
                    <button
                      type="button"
                      aria-label="Remove inheritance entry"
                      onClick={() => removeRow(setEntries, row.id)}
                      className="absolute right-3 top-3 text-sm text-slate-400 transition hover:text-red-500"
                    >
                      ✕
                    </button>

                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 pr-6 sm:grid-cols-2">
                      <div>
                        <label className={subLabelClasses}>Recipient Partner</label>
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
                          <option value="">Select Recipient</option>
                          <option value="Partner 1">Partner 1</option>
                          <option value="Partner 2">Partner 2</option>
                        </select>
                      </div>

                      <div>
                        <label className={subLabelClasses}>Inheritance Status</label>
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
                          <option value="">Select Status</option>
                          <option value="FutureExpectation">
                            Future Expectation (Anticipated in the future)
                          </option>
                          <option value="PendingProbate">
                            Pending / In Progress (Passed away, currently in probate or settlement)
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-3.5">
                      <label className={subLabelClasses}>Inheritance Composition</label>
                      <input
                        type="text"
                        required
                        value={row.composition}
                        onChange={(e) =>
                          updateRow(setEntries, row.id, { composition: e.target.value })
                        }
                        placeholder="e.g., Family estate, cash, property or real estate portfolio"
                        className={fieldClasses}
                      />
                    </div>

                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                      <div>
                        <label className={subLabelClasses}>Original Amount</label>
                        <input
                          type="number"
                          min={0}
                          required
                          value={row.originalAmount}
                          onChange={(e) =>
                            updateRow(setEntries, row.id, { originalAmount: e.target.value })
                          }
                          placeholder="Value"
                          className={fieldClasses}
                        />
                      </div>
                      <div>
                        <label className={subLabelClasses}>Original Currency</label>
                        <select
                          required
                          value={row.originalCurrency}
                          onChange={(e) =>
                            updateRow(setEntries, row.id, { originalCurrency: e.target.value })
                          }
                          className={fieldClasses}
                        >
                          {currencyOptions.map((currency) => (
                            <option key={currency.value} value={currency.value}>
                              {currency.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={subLabelClasses}>Est. GBP Value</label>
                        <input
                          type="number"
                          min={0}
                          required
                          value={row.gbpEquivalent}
                          onChange={(e) =>
                            updateRow(setEntries, row.id, { gbpEquivalent: e.target.value })
                          }
                          placeholder="£ Equivalent"
                          className={fieldClasses}
                        />
                      </div>
                    </div>

                    <div className="mb-3.5">
                      <label className={subLabelClasses}>Basis of Estimate</label>
                      <textarea
                        rows={2}
                        required
                        value={row.basisOfEstimate}
                        onChange={(e) =>
                          updateRow(setEntries, row.id, { basisOfEstimate: e.target.value })
                        }
                        placeholder="Explain valuations, dates, or family trust sources..."
                        className={fieldClasses}
                      />
                      <div className={captionClasses}>
                        Explain how this estimate was reached (e.g., current valuations of
                        parents&apos; property, family trust documentation, valuation dates, or
                        sources).
                      </div>
                    </div>

                    <div>
                      <label className={subLabelClasses}>Future Matrimonial Treatment</label>
                      <select
                        required
                        value={row.treatment}
                        onChange={(e) =>
                          updateRow(setEntries, row.id, { treatment: e.target.value as Treatment })
                        }
                        className={fieldClasses}
                      >
                        <option value="">How should this inheritance be treated?</option>
                        {inheritanceTreatmentOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>

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
                          <label className={nestedLabelClasses}>Custom Arrangement</label>
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
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => setEntries((prev) => [...prev, makeInheritanceEntry()])}
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
                <Tooltip text="Spousal maintenance refers to ongoing financial support paid by one former partner to another following separation or divorce." />
              </div>
            </div>
            <label className={labelClasses}>
              4. If the marriage dissolves, what is your intention regarding ongoing spousal
              maintenance (financial support paid from one ex-partner to the other)?
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
                  Custom Spousal Support Maintenance Formula:
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.customSpousalMaintenance}
                  onChange={(e) => setField("customSpousalMaintenance", e.target.value)}
                  placeholder="Describe how potential ongoing structural maintenance should be calculated..."
                  className={fieldClasses}
                />
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
                <Tooltip text="Major changes in health or care needs can affect the fairness and enforceability of an agreement over time." />
              </div>
            </div>
            <label className={labelClasses}>
              5. If one partner suffers a permanent, career-ending illness or disability during the
              marriage, should the terms of this separation agreement be modified?
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
                  Specific Safe-Guard / Adjustment Exception Parameters:
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.customHealthSafeguards}
                  onChange={(e) => setField("customHealthSafeguards", e.target.value)}
                  placeholder="Outline structural exceptions or asset readjustments if severe medical conditions arise..."
                  className={fieldClasses}
                />
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
                <Tooltip text="Prenuptial agreements do not govern what happens upon death. You should consider reviewing or updating your Will after marriage or civil partnership." />
              </div>
            </div>
            <label className={labelClasses}>
              6. Do you expect what you leave each other in your Wills to match how your assets are
              split in this agreement?
            </label>
            <p className={helpClasses}>
              This agreement primarily governs what happens in the event of a separation or divorce,
              not death. However, it is strongly advisable that you create or update your Wills once
              married.
            </p>
            <ChoiceCards
              name="deathWillsAlignment"
              value={formData.deathWillsAlignment}
              options={deathWillsOptions}
              onChange={(value) => setField("deathWillsAlignment", value)}
            />
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
              7. When should this agreement be automatically reviewed or updated?
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
              </NestedBlock>
            )}

            {formData.reviewTriggerType === "Custom" && (
              <NestedBlock>
                <label className={nestedLabelClasses}>Our review milestones:</label>
                <textarea
                  rows={3}
                  required
                  value={formData.customReviewTriggers}
                  onChange={(e) => setField("customReviewTriggers", e.target.value)}
                  placeholder="e.g., Every 3 years, or if we relocate outside the UK permanently..."
                  className={fieldClasses}
                />
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

        <div className="mb-6 rounded-lg border border-[#C7D2FE] bg-[#EEF2FF] p-4 text-sm font-medium leading-relaxed text-[#4338CA]">
          <strong>⚠️ Enforceability Assessment Notice:</strong> To guarantee the strict compliance
          standards of UK family courts, our legal review parameters must scan for special
          operational complexities. Please answer the system indicators below.
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
            <span className="mb-3 inline-block rounded-full bg-red-500 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-white">
              Case Complexity Context
            </span>
            <div className="flex items-center gap-2">
              <label className="block text-sm font-bold text-red-600">
                Special Circumstances Overview
              </label>
              <Tooltip text="Please provide any additional information that may assist your case manager and independent solicitors when reviewing your file." />
            </div>
            <textarea
              rows={4}
              value={formData.specialCircumstancesOverview}
              onChange={(e) => setField("specialCircumstancesOverview", e.target.value)}
              placeholder="You have indicated one or more special circumstances above. Please provide a brief overview or summary of these items so your dedicated case manager and independent lawyers can prepare your file correctly..."
              className={`mt-3 ${fieldClasses}`}
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

              <div className="flex items-center gap-3">
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
