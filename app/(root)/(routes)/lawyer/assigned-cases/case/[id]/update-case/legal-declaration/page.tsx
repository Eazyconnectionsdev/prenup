"use client"

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Axios from "@/lib/ApiConfig";

interface DeclarationsFormData {
  agreementObjectives: string;
  livingSituationFuture: string;
  confirmPersonalEffects: boolean;
  confirmHouseholdDivision: boolean;
  acknowledgeCourtChildren: boolean;
  confirmCostSharing: boolean;
  confirmUndueInfluence: boolean;
  confirmIla: boolean;
  confirmPlatformDisclaimer: boolean;
  confirmAccuracy: boolean;
}

const initialFormData: DeclarationsFormData = {
  agreementObjectives: "",
  livingSituationFuture: "",
  confirmPersonalEffects: false,
  confirmHouseholdDivision: false,
  acknowledgeCourtChildren: false,
  confirmCostSharing: false,
  confirmUndueInfluence: false,
  confirmIla: false,
  confirmPlatformDisclaimer: false,
  confirmAccuracy: false,
}

const firstPersonRegex = /\b(I|me|my|myself|we|us|our)\b/i;

interface ToggleCardProps {
  id: string;
  name: keyof DeclarationsFormData;
  title: string;
  description: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function ToggleCard({ id, name, title, description, checked, onChange }: ToggleCardProps) {
  return (
    <label
      htmlFor={id}
      className={`relative mb-4 flex cursor-pointer items-start gap-4 rounded-[10px] border px-5 py-5 transition ${checked
        ? "border-indigo-600 bg-slate-50"
        : "border-slate-300 bg-slate-50 hover:border-indigo-600 hover:bg-white"
        }`}
    >
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        required
        className="sr-only"
      />
      <span
        className={`mt-0.5 flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-[6px] border-2 transition ${checked ? "border-indigo-600 bg-indigo-600" : "border-slate-300 bg-white"
          }`}
      >
        {checked && (
          <svg
            viewBox="0 0 10 10"
            className="h-[10px] w-[7px]"
            fill="none"
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 5l2.5 3L9 1" />
          </svg>
        )}
      </span>
      <div>
        <div className={`mb-1 text-[0.95rem] font-semibold transition ${checked ? "text-indigo-600" : "text-slate-900"}`}>
          {title}
        </div>
        <div className="text-[0.85rem] text-slate-500">{description}</div>
      </div>
    </label>
  );
}

export default function LegalDeclarationsForm() {
  const [formData, setFormData] = useState<DeclarationsFormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const caseId = useSelector(

    (state: RootState) => state.auth.caseId

  );

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        agreementObjectives: formData.agreementObjectives,
        livingSituationFuture: formData.livingSituationFuture,

        confirmPersonalEffects: formData.confirmPersonalEffects,
        confirmHouseholdDivision: formData.confirmHouseholdDivision,
        acknowledgeCourtChildren: formData.acknowledgeCourtChildren,
        confirmCostSharing: formData.confirmCostSharing,
        confirmUndueInfluence: formData.confirmUndueInfluence,
        confirmIla: formData.confirmIla,
        confirmPlatformDisclaimer: formData.confirmPlatformDisclaimer,
        confirmAccuracy: formData.confirmAccuracy,
      };

      const { data } = await Axios.post(
        `/cases/${caseId}/questionnaire/legal-declaration`,
        payload
      );

      console.log("Success:", data);

      setSubmitted(true);

    } catch (error) {
      console.error(
        "Error saving legal declarations:",
        error
      );
    }
  };

  const showObjectivesTip = firstPersonRegex.test(formData.agreementObjectives);
  const showLivingTip = firstPersonRegex.test(formData.livingSituationFuture);

  const declarations: Omit<ToggleCardProps, "checked" | "onChange">[] = [
    {
      id: "confirm_personal_effects",
      name: "confirmPersonalEffects",
      title: "Personal Possessions",
      description:
        "Do you agree that each person's clothing, jewellery, personal belongings, and other personal possessions should remain their own separate property unless you both agree otherwise?",
    },
    {
      id: "confirm_household_division",
      name: "confirmHouseholdDivision",
      title: "Division of Household Items",
      description:
        "Do you agree that household items and shared possessions (excluding separately owned property) should be dealt with fairly and reasonably, or otherwise in accordance with the terms of this agreement?",
    },
    {
      id: "acknowledge_court_children",
      name: "acknowledgeCourtChildren",
      title: "Children's Welfare",
      description:
        "We understand that no agreement can restrict the power of a court to make decisions that are in the best interests of any children.",
    },
    {
      id: "confirm_cost_sharing",
      name: "confirmCostSharing",
      title: "Agreement Costs",
      description:
        "Do you agree that the costs associated with preparing this agreement will normally be shared equally unless otherwise agreed between you?",
    },
    {
      id: "confirm_undue_influence",
      name: "confirmUndueInfluence",
      title: "Undue Influence",
      description:
        "Do you understand that one person contributing more towards the costs of preparing this agreement does not, by itself, indicate pressure, coercion, or undue influence?",
    },
    {
      id: "confirm_ila",
      name: "confirmIla",
      title: "Independent Legal Advice",
      description:
        "We understand that each party is strongly encouraged to obtain independent legal advice before signing any agreement and that failure to do so may affect its enforceability.",
    },
    {
      id: "confirm_platform_disclaimer",
      name: "confirmPlatformDisclaimer",
      title: "Platform Disclaimer",
      description:
        "We understand that Let's Prenup assists in preparing an initial draft of our agreement and does not provide legal advice. We acknowledge that independent legal advice should be obtained before signing any agreement.",
    },
    {
      id: "confirm_accuracy",
      name: "confirmAccuracy",
      title: "Final Confirmation",
      description:
        "I confirm that I have read and understood the declarations above and that the information provided throughout this section is true, complete, and accurate to the best of my knowledge.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 px-5 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl bg-white p-12 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08),0_8px_10px_-6px_rgba(15,23,42,0.08)]">
          <h2 className="mb-2 text-[1.45rem] font-extrabold tracking-tight text-slate-900">
            Legal Declarations
          </h2>
          <p className="mb-10 text-[0.95rem] text-slate-500">
            Please review and confirm your understanding of the following
            foundational principles regarding your relationship agreement
            workspace.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Objectives */}
            <div className="mb-7">
              <label className="mb-2 block text-[0.925rem] font-semibold text-slate-800">
                Please provide a brief overview of what you are both aiming to
                achieve with this agreement and your primary reasons for
                putting it in place.
              </label>
              <textarea
                name="agreementObjectives"
                rows={4}
                maxLength={1500}
                placeholder="Describe what you both aim to achieve with this agreement..."
                value={formData.agreementObjectives}
                onChange={handleTextChange}
                required
                className="w-full resize-y rounded-[10px] border border-slate-300 bg-slate-50 px-4 py-3 text-[0.95rem] text-slate-900 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
              />
              {showObjectivesTip && (
                <div className="mt-2 text-[0.85rem] font-medium text-amber-700">
                  ⚠️ Tip: Try rephrasing this section into the third person
                  using your names to keep it court-ready.
                </div>
              )}
            </div>

            {/* Living situation */}
            <div className="mb-7">
              <label className="mb-2 block text-[0.925rem] font-semibold text-slate-800">
                Please provide a summary of your current living arrangements
                and any significant future plans (e.g., upcoming property
                purchases, relocating abroad, or major career changes).
              </label>
              <textarea
                name="livingSituationFuture"
                rows={4}
                maxLength={1500}
                placeholder="Summarize your current living framework and any future plans..."
                value={formData.livingSituationFuture}
                onChange={handleTextChange}
                required
                className="w-full resize-y rounded-[10px] border border-slate-300 bg-slate-50 px-4 py-3 text-[0.95rem] text-slate-900 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
              />
              {showLivingTip && (
                <div className="mt-2 text-[0.85rem] font-medium text-amber-700">
                  ⚠️ Tip: Try rephrasing this section into the third person
                  using your names to keep it court-ready.
                </div>
              )}
            </div>

            {/* Declarations */}
            <div className="mb-6 mt-12 border-b-2 border-slate-100 pb-2.5 text-[1.25rem] font-bold tracking-tight text-slate-900">
              Declarations of Understanding
            </div>

            {declarations.map((d) => (
              <ToggleCard
                key={d.id}
                id={d.id}
                name={d.name}
                title={d.title}
                description={d.description}
                checked={formData[d.name] as boolean}
                onChange={handleCheckboxChange}
              />
            ))}

            <div className="flex justify-end">
              <button
                type="submit"
                className="mt-8 rounded-[10px] bg-indigo-600 px-10 py-4 font-semibold text-white shadow-[0_4px_14px_rgba(79,70,229,0.3)] transition hover:-translate-y-px hover:bg-indigo-700 hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] active:translate-y-px"
              >
                Save & Continue
              </button>
            </div>
          </form>

          {submitted && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              Legal declarations saved successfully.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}