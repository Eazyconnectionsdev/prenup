"use client";

import React from "react";

interface Props {
  data: any;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
}

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
      "Do you agree that household items and shared possessions should be dealt with fairly and reasonably?",
  },
  {
    field: "acknowledgeCourtChildren",
    title: "Children's Welfare",
    description:
      "We understand that no agreement can restrict the power of a court to make decisions that are in the best interests of children.",
  },
  {
    field: "confirmCostSharing",
    title: "Agreement Costs",
    description:
      "Do you agree that preparation costs should normally be shared equally?",
  },
  {
    field: "confirmUndueInfluence",
    title: "Undue Influence",
    description:
      "We understand that one party paying more towards agreement costs does not automatically indicate pressure or coercion.",
  },
  {
    field: "confirmIla",
    title: "Independent Legal Advice",
    description:
      "Each party is encouraged to obtain independent legal advice before signing.",
  },
  {
    field: "confirmPlatformDisclaimer",
    title: "Platform Disclaimer",
    description:
      "We understand the platform only assists with drafting and does not provide legal advice.",
  },
  {
    field: "confirmAccuracy",
    title: "Final Confirmation",
    description:
      "I confirm the information provided is true and accurate to the best of my knowledge.",
  },
];

export default function LegalDeclarations({
data = {},
isEditing,
onChange,
}: Props) {
  const textareaClass =
    "w-full rounded-lg border border-slate-300 px-4 py-3 text-sm";

  return (
    <div className="space-y-8">

      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Legal Declarations
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Review and confirm your understanding of the following declarations.
        </p>
      </div>

      {/* Objectives */}

      <div>
        <label className="block mb-2 font-semibold text-slate-800">
          Agreement Objectives
        </label>

        <textarea
          rows={5}
          value={data?.agreementObjectives || ""}
          disabled={!isEditing}
          onChange={(e) =>
            onChange(
              "agreementObjectives",
              e.target.value
            )
          }
          className={textareaClass}
          placeholder="Describe the purpose of the agreement..."
        />
      </div>

      {/* Living Arrangements */}

      <div>
        <label className="block mb-2 font-semibold text-slate-800">
          Living Arrangements & Future Plans
        </label>

        <textarea
          rows={5}
          value={data?.livingSituationFuture || ""}
          disabled={!isEditing}
          onChange={(e) =>
            onChange(
              "livingSituationFuture",
              e.target.value
            )
          }
          className={textareaClass}
          placeholder="Current living situation and future plans..."
        />
      </div>

      {/* Declaration Cards */}

      <div>

        <h3 className="text-lg font-bold mb-4">
          Declarations of Understanding
        </h3>

        <div className="space-y-4">

          {declarations.map((item) => {
            const checked = !!data?.[item.field];

            return (
              <label
                key={item.field}
                className={`
                  block border rounded-xl p-4 cursor-pointer transition
                  ${
                    checked
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-slate-300 bg-white"
                  }
                `}
              >
                <div className="flex items-start gap-4">

                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={!isEditing}
                    onChange={(e) =>
                      onChange(
                        item.field,
                        e.target.checked
                      )
                    }
                    className="mt-1 h-5 w-5"
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

                </div>
              </label>
            );
          })}

        </div>
      </div>

    </div>
  );
}