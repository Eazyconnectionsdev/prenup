"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Axios from "@/lib/ApiConfig";
import { AppDispatch, RootState } from "@/store/store";
import { getCasesDetails } from "@/store/asyncThunk/casesThunk";
import { getErrorMessage } from "@/lib/api/http-error";
import { JointStatusBanner } from "@/components/joint/JointStatusBanner";
import type { MatrimonialAgreementFormValues } from "@/types/dashboard/matrimonial-agreement";

const defaultValues: MatrimonialAgreementFormValues = {
  agreementObjectives: "",
  separatePropertyIntention: "RingFenceAll",
  futureAcquisitionsTreatment: "Separate",
  spousalMaintenanceIntention: "CleanBreak",
  childProvisionsIntention: "",
  reviewTriggerEvents: ["child_birth", "financial_change"],
  reviewIntervalYears: "5",
  governingLawConfirmed: true,
  separateLegalAdviceUnderstood: true,
  specialArrangements: "",
};

const triggerOptions = [
  { id: "child_birth", label: "Birth or adoption of a child" },
  { id: "health_change", label: "Significant illness, disability, or incapacity of either partner" },
  { id: "financial_change", label: "Substantial change in financial circumstances (e.g., business sale or major inheritance)" },
  { id: "property_purchase", label: "Purchase or sale of the primary matrimonial home" },
  { id: "relocation", label: "Relocation outside the United Kingdom" },
];

export default function MatrimonialAgreementPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const cases = useSelector((state: RootState) => state.cases);
  const caseId = cases.caseId || user?.inviteCaseId;

  const [formData, setFormData] = useState<MatrimonialAgreementFormValues>(defaultValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load existing data
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      if (!caseId) {
        setIsLoading(false);
        return;
      }
      try {
        const { data } = await Axios.get(`/cases/${caseId}/section/jointInformation`);
        const existing =
          data?.data?.matrimonialAgreement ||
          (cases.jointInformation as any)?.matrimonialAgreement;

        if (existing && isMounted) {
          setFormData({
            agreementObjectives: existing.agreementObjectives ?? "",
            separatePropertyIntention: existing.separatePropertyIntention ?? "RingFenceAll",
            futureAcquisitionsTreatment: existing.futureAcquisitionsTreatment ?? "Separate",
            spousalMaintenanceIntention: existing.spousalMaintenanceIntention ?? "CleanBreak",
            childProvisionsIntention: existing.childProvisionsIntention ?? "",
            reviewTriggerEvents: Array.isArray(existing.reviewTriggerEvents)
              ? existing.reviewTriggerEvents
              : ["child_birth", "financial_change"],
            reviewIntervalYears: existing.reviewIntervalYears ?? "5",
            governingLawConfirmed: existing.governingLawConfirmed ?? true,
            separateLegalAdviceUnderstood: existing.separateLegalAdviceUnderstood ?? true,
            specialArrangements: existing.specialArrangements ?? "",
          });
        }
      } catch (err) {
        // Fallback to cases store if endpoint is pending
        const existing = (cases.jointInformation as any)?.matrimonialAgreement;
        if (existing && isMounted) {
          setFormData((prev) => ({ ...prev, ...existing }));
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [caseId, cases.jointInformation]);

  const handleToggleTrigger = (id: string) => {
    setFormData((prev) => {
      const exists = prev.reviewTriggerEvents.includes(id);
      return {
        ...prev,
        reviewTriggerEvents: exists
          ? prev.reviewTriggerEvents.filter((item) => item !== id)
          : [...prev.reviewTriggerEvents, id],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseId) {
      toast.error("Case ID not found. Please refresh.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Post to questionnaire endpoint for matrimonial agreement
      await Axios.post(`/cases/${caseId}/questionnaire/matrimonial-agreement`, formData);
      await dispatch(getCasesDetails(caseId));
      toast.success("Matrimonial agreement intentions saved.");
      router.push("/dashboard/final-review-confirmation");
    } catch (error) {
      // If endpoint is not created on backend, also save via generic step
      try {
        await Axios.post(`/cases/${caseId}/section/jointInformation`, {
          matrimonialAgreement: formData,
        });
        await dispatch(getCasesDetails(caseId));
        toast.success("Matrimonial agreement intentions saved.");
        router.push("/dashboard/final-review-confirmation");
      } catch (innerErr) {
        toast.error(getErrorMessage(error, "Failed to save matrimonial agreement intentions."));
      }
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

  return (
    <div className="min-h-screen bg-[#F8F9FC] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-[#E7E7F2] bg-white p-6 md:p-10 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06)]">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-[#EDE9FE] px-3 py-1 text-xs font-semibold text-[#6D28D9]">
              Section 3 • Joint Information
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#1E1B3C] md:text-3xl">
            Matrimonial Agreement & Intentions
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#6B6B80] md:text-base">
            Please define your joint intentions and agreed approach regarding property division,
            future acquisitions, ongoing maintenance, and regular agreement review under English law.
          </p>

          <div className="mt-6">
            <JointStatusBanner isReviewPage={false} />
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            {/* 1. Core Objectives */}
            <div className="rounded-xl border border-[#EDEDF5] bg-[#FAF9FF] p-5 md:p-6">
              <label className="block text-sm font-bold text-[#1E1B3C]">
                1. Primary Agreement Objectives
              </label>
              <p className="mt-1 text-xs text-[#6B6B80]">
                Summarize what you both aim to achieve with this agreement and your main reasons for putting it in place.
              </p>
              <textarea
                rows={3}
                value={formData.agreementObjectives}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, agreementObjectives: e.target.value }))
                }
                placeholder="e.g. Provide financial certainty, protect separate pre-marital property, ensure fair arrangements for children, and prevent costly disputes in the future."
                className="mt-3 w-full rounded-lg border border-[#D1D1DC] bg-white p-3 text-sm text-[#1E1B3C] focus:border-[#6D28D9] focus:outline-none"
              />
            </div>

            {/* 2. Separate Property Intentions */}
            <div className="rounded-xl border border-[#EDEDF5] bg-[#FAF9FF] p-5 md:p-6">
              <label className="block text-sm font-bold text-[#1E1B3C]">
                2. Separate Property Intentions
              </label>
              <p className="mt-1 text-xs text-[#6B6B80]">
                How should pre-marital assets (properties, savings, investments) brought into the marriage be treated?
              </p>
              <div className="mt-3 space-y-2.5">
                {[
                  {
                    value: "RingFenceAll",
                    title: "Ring-fence all separate property",
                    desc: "Each party retains full ownership of their pre-acquired individual assets with no claims by the other.",
                  },
                  {
                    value: "TransitionOverTime",
                    title: "Gradual sharing over time",
                    desc: "A proportion of individual assets becomes matrimonial property after key anniversaries.",
                  },
                  {
                    value: "ShareUponSeparation",
                    title: "Share jointly accumulated assets only",
                    desc: "Pre-existing assets remain separate; only growth or joint acquisitions are shared.",
                  },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition ${
                      formData.separatePropertyIntention === option.value
                        ? "border-[#6D28D9] bg-[#EDE9FE]/40"
                        : "border-[#E7E7F2] bg-white hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="separatePropertyIntention"
                      value={option.value}
                      checked={formData.separatePropertyIntention === option.value}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, separatePropertyIntention: e.target.value }))
                      }
                      className="mt-1 text-[#6D28D9] focus:ring-[#6D28D9]"
                    />
                    <div>
                      <div className="text-sm font-semibold text-[#1E1B3C]">{option.title}</div>
                      <div className="text-xs text-[#6B6B80]">{option.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 3. Future Acquisitions & Inheritances */}
            <div className="rounded-xl border border-[#EDEDF5] bg-[#FAF9FF] p-5 md:p-6">
              <label className="block text-sm font-bold text-[#1E1B3C]">
                3. Future Gifts, Inheritances & Windfalls
              </label>
              <p className="mt-1 text-xs text-[#6B6B80]">
                How should gifts, inheritances, or unexpected capital windfalls received during the marriage be handled?
              </p>
              <div className="mt-3 space-y-2.5">
                {[
                  {
                    value: "Separate",
                    title: "Sole property of recipient",
                    desc: "All inheritances and gifts from family remain strictly separate individual property.",
                  },
                  {
                    value: "SharedIfFamilyHome",
                    title: "Separate unless invested into family home",
                    desc: "Kept separate unless intentionally commingled into primary joint family assets.",
                  },
                  {
                    value: "Joint",
                    title: "Treated as joint matrimonial property",
                    desc: "Shared equally between spouses.",
                  },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition ${
                      formData.futureAcquisitionsTreatment === option.value
                        ? "border-[#6D28D9] bg-[#EDE9FE]/40"
                        : "border-[#E7E7F2] bg-white hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="futureAcquisitionsTreatment"
                      value={option.value}
                      checked={formData.futureAcquisitionsTreatment === option.value}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, futureAcquisitionsTreatment: e.target.value }))
                      }
                      className="mt-1 text-[#6D28D9] focus:ring-[#6D28D9]"
                    />
                    <div>
                      <div className="text-sm font-semibold text-[#1E1B3C]">{option.title}</div>
                      <div className="text-xs text-[#6B6B80]">{option.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 4. Spousal Maintenance Intentions */}
            <div className="rounded-xl border border-[#EDEDF5] bg-[#FAF9FF] p-5 md:p-6">
              <label className="block text-sm font-bold text-[#1E1B3C]">
                4. Spousal Maintenance Intentions
              </label>
              <p className="mt-1 text-xs text-[#6B6B80]">
                In the event of a divorce or legal separation, what are your intentions regarding ongoing spousal maintenance?
              </p>
              <div className="mt-3 space-y-2.5">
                {[
                  {
                    value: "CleanBreak",
                    title: "Clean break waiver",
                    desc: "Both parties waive all claims for ongoing spousal maintenance or financial support.",
                  },
                  {
                    value: "TransitionalSupport",
                    title: "Transitional support for limited period",
                    desc: "Temporary rehabilitative support for a fixed duration (e.g., up to 2 years) to allow adjustment.",
                  },
                  {
                    value: "NeedsBased",
                    title: "Determined according to future needs",
                    desc: "Evaluated in accordance with court principles based on reasonable housing and living needs.",
                  },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition ${
                      formData.spousalMaintenanceIntention === option.value
                        ? "border-[#6D28D9] bg-[#EDE9FE]/40"
                        : "border-[#E7E7F2] bg-white hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="spousalMaintenanceIntention"
                      value={option.value}
                      checked={formData.spousalMaintenanceIntention === option.value}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, spousalMaintenanceIntention: e.target.value }))
                      }
                      className="mt-1 text-[#6D28D9] focus:ring-[#6D28D9]"
                    />
                    <div>
                      <div className="text-sm font-semibold text-[#1E1B3C]">{option.title}</div>
                      <div className="text-xs text-[#6B6B80]">{option.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 5. Provisions for Children */}
            <div className="rounded-xl border border-[#EDEDF5] bg-[#FAF9FF] p-5 md:p-6">
              <label className="block text-sm font-bold text-[#1E1B3C]">
                5. Provisions for Current or Future Children
              </label>
              <p className="mt-1 text-xs text-[#6B6B80]">
                English courts always prioritize the welfare of children. Outline your intentions for child accommodation, education, and maintenance.
              </p>
              <textarea
                rows={3}
                value={formData.childProvisionsIntention}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, childProvisionsIntention: e.target.value }))
                }
                placeholder="e.g. Both parties will share responsibility for children's reasonable housing, school fees, and living costs in proportion to their respective incomes."
                className="mt-3 w-full rounded-lg border border-[#D1D1DC] bg-white p-3 text-sm text-[#1E1B3C] focus:border-[#6D28D9] focus:outline-none"
              />
            </div>

            {/* 6. Review Triggers & Interval */}
            <div className="rounded-xl border border-[#EDEDF5] bg-[#FAF9FF] p-5 md:p-6">
              <label className="block text-sm font-bold text-[#1E1B3C]">
                6. Agreement Review Triggers & Interval
              </label>
              <p className="mt-1 text-xs text-[#6B6B80]">
                Prenuptial agreements carry greater legal weight when reviewed periodically or following life-changing milestones.
              </p>

              <div className="mt-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#9494AA]">
                  Periodic Review Interval:
                </span>
                <div className="mt-2 flex flex-wrap gap-3">
                  {["3", "5", "10"].map((years) => (
                    <button
                      key={years}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, reviewIntervalYears: years }))}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                        formData.reviewIntervalYears === years
                          ? "bg-[#6D28D9] text-white shadow-sm"
                          : "border border-[#D1D1DC] bg-white text-[#1E1B3C] hover:bg-slate-50"
                      }`}
                    >
                      Every {years} Years
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#9494AA]">
                  Trigger Events for Formal Review:
                </span>
                <div className="mt-2 space-y-2">
                  {triggerOptions.map((opt) => {
                    const checked = formData.reviewTriggerEvents.includes(opt.id);
                    return (
                      <label
                        key={opt.id}
                        onClick={() => handleToggleTrigger(opt.id)}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                          checked
                            ? "border-[#6D28D9] bg-[#EDE9FE]/30"
                            : "border-[#E7E7F2] bg-white hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          readOnly
                          className="rounded text-[#6D28D9] focus:ring-[#6D28D9]"
                        />
                        <span className="text-sm font-medium text-[#1E1B3C]">{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 7. Legal Declarations & Special Clauses */}
            <div className="rounded-xl border border-[#EDEDF5] bg-[#FAF9FF] p-5 md:p-6 space-y-4">
              <label className="block text-sm font-bold text-[#1E1B3C]">
                7. Legal Declarations & Special Arrangements
              </label>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.governingLawConfirmed}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, governingLawConfirmed: e.target.checked }))
                  }
                  className="mt-1 rounded text-[#6D28D9] focus:ring-[#6D28D9]"
                />
                <span className="text-xs leading-relaxed text-[#1E1B3C]">
                  We agree and confirm that this agreement will be governed by and interpreted under the laws of England and Wales.
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.separateLegalAdviceUnderstood}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      separateLegalAdviceUnderstood: e.target.checked,
                    }))
                  }
                  className="mt-1 rounded text-[#6D28D9] focus:ring-[#6D28D9]"
                />
                <span className="text-xs leading-relaxed text-[#1E1B3C]">
                  We understand that both of us must obtain separate Independent Legal Advice (ILA) from qualified solicitors before executing the agreement.
                </span>
              </label>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-[#1E1B3C]">
                  Any special clauses or customized terms? (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.specialArrangements}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, specialArrangements: e.target.value }))
                  }
                  placeholder="Optional: Mention any unique assets, family heirlooms, pet custody arrangements, or business protections."
                  className="mt-1.5 w-full rounded-lg border border-[#D1D1DC] bg-white p-3 text-sm text-[#1E1B3C] focus:border-[#6D28D9] focus:outline-none"
                />
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="flex flex-col-reverse items-center justify-between gap-4 pt-4 sm:flex-row">
              <button
                type="button"
                onClick={() => router.push("/dashboard/joint-liabilities-debts")}
                className="w-full rounded-xl border border-[#D1D1DC] bg-white px-6 py-3.5 text-sm font-semibold text-[#6B6B80] transition hover:bg-slate-50 sm:w-auto"
              >
                ← Back to Joint Liabilities
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[#6D28D9] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#6D28D9]/25 transition hover:bg-[#5B21B6] disabled:opacity-60 sm:w-auto"
              >
                {isSubmitting ? "Saving..." : "Save & Continue to Final Review →"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

