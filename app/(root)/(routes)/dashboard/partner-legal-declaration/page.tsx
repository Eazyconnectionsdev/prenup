"use client";

import React, { useState, useEffect } from "react";
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
};

interface ToggleCardViewProps {
  id: string;
  title: string;
  description: string;
  checked: boolean;
}

function ToggleCardView({ id, title, description, checked }: ToggleCardViewProps) {
  return (
    <div
      id={id}
      className={`relative mb-4 flex items-start gap-4 rounded-[10px] border px-5 py-5 ${
        checked ? "border-indigo-600 bg-slate-50" : "border-slate-300 bg-slate-50"
      }`}
    >
      <span
        className={`mt-0.5 flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-[6px] border-2 ${
          checked ? "border-indigo-600 bg-indigo-600" : "border-slate-300 bg-white"
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
        <div
          className={`mb-1 text-[0.95rem] font-semibold ${checked ? "text-indigo-600" : "text-slate-900"}`}
        >
          {title}
        </div>
        <div className="text-[0.85rem] text-slate-500">{description}</div>
      </div>
    </div>
  );
}

export default function PartnerLegalDeclarationsView() {
  const [formData, setFormData] = useState<DeclarationsFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(true);

  const user = useSelector((state: RootState) => state.auth.user);
  const caseId = useSelector((state: RootState) => state.auth.caseId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: {
            data: { legalDeclaration },
          },
        } = await Axios.get(
          `/cases/${caseId}/section/${user.endUserType === "user1" ? "partnerInformation" : "myInformation"}`,
        );

        if (legalDeclaration) {
          setFormData({ ...legalDeclaration });
        }
      } catch (error) {
        console.error("Error fetching partner legal declarations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (caseId) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [caseId, user?.endUserType]);

  const declarations: Omit<ToggleCardViewProps, "checked">[] = [
    {
      id: "confirm_personal_effects",
      title: "Personal Possessions",
      description:
        "Do you agree that each person's clothing, jewellery, personal belongings, and other personal possessions should remain their own separate property unless you both agree otherwise?",
    },
    {
      id: "confirm_household_division",
      title: "Division of Household Items",
      description:
        "Do you agree that household items and shared possessions (excluding separately owned property) should be dealt with fairly and reasonably, or otherwise in accordance with the terms of this agreement?",
    },
    {
      id: "acknowledge_court_children",
      title: "Children's Welfare",
      description:
        "We understand that no agreement can restrict the power of a court to make decisions that are in the best interests of any children.",
    },
    {
      id: "confirm_cost_sharing",
      title: "Agreement Costs",
      description:
        "Do you agree that the costs associated with preparing this agreement will normally be shared equally unless otherwise agreed between you?",
    },
    {
      id: "confirm_undue_influence",
      title: "Undue Influence",
      description:
        "Do you understand that one person contributing more towards the costs of preparing this agreement does not, by itself, indicate pressure, coercion, or undue influence?",
    },
    {
      id: "confirm_ila",
      title: "Independent Legal Advice",
      description:
        "We understand that each party is strongly encouraged to obtain independent legal advice before signing any agreement and that failure to do so may affect its enforceability.",
    },
    {
      id: "confirm_platform_disclaimer",
      title: "Platform Disclaimer",
      description:
        "We understand that Let's Prenup assists in preparing an initial draft of our agreement and does not provide legal advice. We acknowledge that independent legal advice should be obtained before signing any agreement.",
    },
    {
      id: "confirm_accuracy",
      title: "Final Confirmation",
      description:
        "I confirm that I have read and understood the declarations above and that the information provided throughout this section is true, complete, and accurate to the best of my knowledge.",
    },
  ];

  const declarationKeys: (keyof DeclarationsFormData)[] = [
    "confirmPersonalEffects",
    "confirmHouseholdDivision",
    "acknowledgeCourtChildren",
    "confirmCostSharing",
    "confirmUndueInfluence",
    "confirmIla",
    "confirmPlatformDisclaimer",
    "confirmAccuracy",
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-sm font-medium text-slate-500">Loading your information...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-5 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl bg-white p-12 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08),0_8px_10px_-6px_rgba(15,23,42,0.08)]">
          <h2 className="mb-2 text-[1.45rem] font-extrabold tracking-tight text-slate-900">
            Legal Declarations
          </h2>
          <p className="mb-10 text-[0.95rem] text-slate-500">
            This is a read-only view of the legal declarations your partner has provided.
          </p>

          <div>
            {/* Objectives */}
            <div className="mb-7">
              <label className="mb-2 block text-[0.925rem] font-semibold text-slate-800">
                Please provide a brief overview of what you are both aiming to
                achieve with this agreement and your primary reasons for putting
                it in place.
              </label>
              <textarea
                name="agreementObjectives"
                rows={4}
                value={formData.agreementObjectives}
                disabled
                className="w-full resize-none rounded-[10px] border border-slate-300 bg-slate-50 px-4 py-3 text-[0.95rem] text-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>

            {/* Living situation */}
            <div className="mb-7">
              <label className="mb-2 block text-[0.925rem] font-semibold text-slate-800">
                Please provide a summary of your current living arrangements and
                any significant future plans (e.g., upcoming property purchases,
                relocating abroad, or major career changes).
              </label>
              <textarea
                name="livingSituationFuture"
                rows={4}
                value={formData.livingSituationFuture}
                disabled
                className="w-full resize-none rounded-[10px] border border-slate-300 bg-slate-50 px-4 py-3 text-[0.95rem] text-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>

            {/* Declarations */}
            <div className="mb-6 mt-12 border-b-2 border-slate-100 pb-2.5 text-[1.25rem] font-bold tracking-tight text-slate-900">
              Declarations of Understanding
            </div>

            {declarations.map((d, i) => (
              <ToggleCardView
                key={d.id}
                id={d.id}
                title={d.title}
                description={d.description}
                checked={formData[declarationKeys[i]] as boolean}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}