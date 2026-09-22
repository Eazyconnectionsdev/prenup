"use client";

import React from "react";

interface Props {
  data: any;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
}

const firstPersonRegex = /\b(I|me|my|myself|we|us|our)\b/i;

const declarations = [
  {
    field: "confirmPersonalEffects",
    title: "Personal Possessions",
    description:
      "Do you agree that each person's clothing, jewellery, personal belongings, and other personal possessions should remain their own separate property unless you both agree otherwise?",
  },
  {
    field: "confirmHouseholdDivision",
    title: "Division of Household Items",
    description:
      "Do you agree that household items and shared possessions (excluding separately owned property) should be dealt with fairly and reasonably, or otherwise in accordance with the terms of this agreement?",
  },
  {
    field: "acknowledgeCourtChildren",
    title: "Children's Welfare",
    description:
      "We understand that no agreement can restrict the power of a court to make decisions that are in the best interests of any children.",
  },
  {
    field: "confirmCostSharing",
    title: "Agreement Costs",
    description:
      "Do you agree that the costs associated with preparing this agreement will normally be shared equally unless otherwise agreed between you?",
  },
  {
    field: "confirmUndueInfluence",
    title: "Undue Influence",
    description:
      "Do you understand that one person contributing more towards the costs of preparing this agreement does not, by itself, indicate pressure, coercion, or undue influence?",
  },
  {
    field: "confirmIla",
    title: "Independent Legal Advice",
    description:
      "We understand that each party is strongly encouraged to obtain independent legal advice before signing any agreement and that failure to do so may affect its enforceability.",
  },
  {
    field: "confirmPlatformDisclaimer",
    title: "Platform Disclaimer",
    description:
      "We understand that Let's Prenup assists in preparing an initial draft of our agreement and does not provide legal advice. We acknowledge that independent legal advice should be obtained before signing any agreement.",
  },
  {
    field: "confirmAccuracy",
    title: "Final Confirmation",
    description:
      "I confirm that I have read and understood the declarations above and that the information provided throughout this section is true, complete, and accurate to the best of my knowledge.",
  },
];

export default function LegalDeclarations({
  data = {},
  isEditing,
  onChange,
}: Props) {
  const textareaClass =
    "w-full rounded-lg border border-slate-300 px-4 py-3 text-sm disabled:bg-slate-100 disabled:text-slate-600";

  const showObjectivesTip = firstPersonRegex.test(
    data?.agreementObjectives || "",
  );

  const showLivingTip = firstPersonRegex.test(
    data?.livingSituationFuture || "",
  );

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Legal Declarations
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Please review and confirm your understanding of the following
          foundational principles regarding your relationship agreement
          workspace.
        </p>
      </div>

      {/* Agreement Objectives */}

      <div>
        <label className="block mb-2 font-semibold text-slate-800">
          Please provide a brief overview of what you are both aiming to
          achieve with this agreement and your primary reasons for putting it
          in place.
        </label>

        <textarea
          rows={5}
          maxLength={1500}
          value={data?.agreementObjectives || ""}
          disabled={!isEditing}
          onChange={(e) =>
            onChange("agreementObjectives", e.target.value)
          }
          className={textareaClass}
          placeholder="Describe what you both aim to achieve with this agreement..."
        />

        {showObjectivesTip && (
          <div className="mt-2 text-sm font-medium text-amber-700">
            ⚠️ Tip: Try rephrasing this section into the third person using
            your names to keep it court-ready.
          </div>
        )}
      </div>

      {/* Living Situation */}

      <div>
        <label className="block mb-2 font-semibold text-slate-800">
          Please provide a summary of your current living arrangements and any
          significant future plans (e.g., upcoming property purchases,
          relocating abroad, or major career changes).
        </label>

        <textarea
          rows={5}
          maxLength={1500}
          value={data?.livingSituationFuture || ""}
          disabled={!isEditing}
          onChange={(e) =>
            onChange("livingSituationFuture", e.target.value)
          }
          className={textareaClass}
          placeholder="Summarize your current living framework and any future plans..."
        />

        {showLivingTip && (
          <div className="mt-2 text-sm font-medium text-amber-700">
            ⚠️ Tip: Try rephrasing this section into the third person using
            your names to keep it court-ready.
          </div>
        )}
      </div>

      {/* Declarations */}

      <div>
        <h3 className="mb-4 border-b border-slate-200 pb-2 text-lg font-bold text-slate-900">
          Declarations of Understanding
        </h3>

        <div className="space-y-4">
          {declarations.map((item) => {
            const checked = Boolean(data?.[item.field]);

            return (
              <label
                key={item.field}
                className={`
                  flex items-start gap-4 rounded-xl border p-4 transition
                  ${
                    checked
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-slate-300 bg-white"
                  }
                  ${isEditing ? "cursor-pointer" : ""}
                `}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={!isEditing}
                  onChange={(e) =>
                    onChange(item.field, e.target.checked)
                  }
                  className="mt-1 h-5 w-5 shrink-0"
                />

                <div>
                  <h4
                    className={`font-semibold ${
                      checked
                        ? "text-indigo-700"
                        : "text-slate-900"
                    }`}
                  >
                    {item.title}
                  </h4>

                  <p className="mt-1 text-sm text-slate-600">
                    {item.description}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}