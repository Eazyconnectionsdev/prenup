"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  data: any;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
}

const TREATMENTS = [
  "KeepSeparate",
  "ShareEqually",
  "Contribution",
  "Percentage",
  "Custom",
];

export default function JointIncome({
  data,
  isEditing,
  onChange,
}: Props) {
  const inputClass =
    "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm";

  const addIncome = () => {
    onChange("sharedIncomeRows", [
      ...(data?.sharedIncomeRows || []),
      {
        id: Date.now().toString(),
        description: "",
        source: "",
        annualIncome: "",
        treatment: "ShareEqually",
        contributionText: "",
        percentageValue: "",
        customText: "",
      },
    ]);
  };

  const removeIncome = (id: string) => {
    onChange(
      "sharedIncomeRows",
      (data?.sharedIncomeRows || []).filter(
        (row: any) => row.id !== id
      )
    );
  };

  const updateIncome = (
    id: string,
    field: string,
    value: any
  ) => {
    onChange(
      "sharedIncomeRows",
      (data?.sharedIncomeRows || []).map(
        (row: any) =>
          row.id === id
            ? {
                ...row,
                value,
              }
            : row
      )
    );
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div>
        <h2 className="text-xl font-bold">
          Joint Income & Revenue
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Income earned jointly by both partners.
        </p>
      </div>

      {/* TOGGLE */}

      <div className="border rounded-xl p-5">

        <div className="flex items-center justify-between">

          <h3 className="font-semibold">
            Shared Income Sources
          </h3>

          <select
            className={inputClass}
            disabled={!isEditing}
            value={data?.hasSharedIncome || "No"}
            onChange={(e) =>
              onChange(
                "hasSharedIncome",
                e.target.value
              )
            }
          >
            <option value="Yes">
              Yes
            </option>

            <option value="No">
              No
            </option>
          </select>
        </div>

        {data?.hasSharedIncome === "Yes" && (
          <>
            <div className="space-y-4 mt-6">

              {(data?.sharedIncomeRows || []).map(
                (row: any) => (
                  <div
                    key={row.id}
                    className="border rounded-lg p-4"
                  >
                    <div className="grid md:grid-cols-3 gap-3">

                      <input
                        className={inputClass}
                        disabled={!isEditing}
                        value={row.description}
                        placeholder="Description"
                        onChange={(e) =>
                          updateIncome(
                            row.id,
                            "description",
                            e.target.value
                          )
                        }
                      />

                      <input
                        className={inputClass}
                        disabled={!isEditing}
                        value={row.source}
                        placeholder="Source"
                        onChange={(e) =>
                          updateIncome(
                            row.id,
                            "source",
                            e.target.value
                          )
                        }
                      />

                      <input
                        type="number"
                        className={inputClass}
                        disabled={!isEditing}
                        value={row.annualIncome}
                        placeholder="Annual Income (£)"
                        onChange={(e) =>
                          updateIncome(
                            row.id,
                            "annualIncome",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* TREATMENT */}

                    <div className="mt-4">

                      <label className="block mb-2 text-sm font-medium">
                        Treatment
                      </label>

                      <select
                        value={
                          row.treatment || ""
                        }
                        disabled={!isEditing}
                        className={inputClass}
                        onChange={(e) =>
                          updateIncome(
                            row.id,
                            "treatment",
                            e.target.value
                          )
                        }
                      >
                        {TREATMENTS.map(
                          (option) => (
                            <option
                              key={option}
                              value={option}
                            >
                              {option}
                            </option>
                          )
                        )}
                      </select>

                      {row.treatment ===
                        "Contribution" && (
                        <textarea
                          rows={3}
                          className={`${inputClass} mt-3`}
                          placeholder="Contribution Details"
                          disabled={!isEditing}
                          value={
                            row.contributionText ||
                            ""
                          }
                          onChange={(e) =>
                            updateIncome(
                              row.id,
                              "contributionText",
                              e.target.value
                            )
                          }
                        />
                      )}

                      {row.treatment ===
                        "Percentage" && (
                        <input
                          type="number"
                          className={`${inputClass} mt-3`}
                          placeholder="Percentage"
                          disabled={!isEditing}
                          value={
                            row.percentageValue ||
                            ""
                          }
                          onChange={(e) =>
                            updateIncome(
                              row.id,
                              "percentageValue",
                              e.target.value
                            )
                          }
                        />
                      )}

                      {row.treatment ===
                        "Custom" && (
                        <textarea
                          rows={3}
                          className={`${inputClass} mt-3`}
                          placeholder="Custom Arrangement"
                          disabled={!isEditing}
                          value={
                            row.customText || ""
                          }
                          onChange={(e) =>
                            updateIncome(
                              row.id,
                              "customText",
                              e.target.value
                            )
                          }
                        />
                      )}
                    </div>

                    {isEditing && (
                      <button
                        type="button"
                        onClick={() =>
                          removeIncome(row.id)
                        }
                        className="mt-4 flex items-center gap-2 text-red-600"
                      >
                        <Trash2 size={14} />
                        Remove Income
                      </button>
                    )}
                  </div>
                )
              )}

            </div>

            {isEditing && (
              <button
                type="button"
                onClick={addIncome}
                className="mt-5 bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus size={14} />
                Add Shared Income
              </button>
            )}
          </>
        )}
      </div>

    </div>
  );
}