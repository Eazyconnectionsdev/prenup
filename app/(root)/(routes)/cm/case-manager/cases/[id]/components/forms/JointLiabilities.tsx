"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  data: any;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
}

const liabilityTypes = [
  "Mortgage",
  "Personal Loan",
  "Credit Card",
  "Business Loan",
  "Tax Liability",
  "Vehicle Finance",
  "Other",
];

const treatmentOptions = [
  "KeepSeparate",
  "ShareEqually",
  "Contribution",
  "Percentage",
  "Custom",
];

export default function JointLiabilities({
  data,
  isEditing,
  onChange,
}: Props) {
  const inputClass =
    "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm";

  const addDebt = () => {
    onChange("sharedDebts", [
      ...(data?.sharedDebts || []),
      {
        id: Date.now().toString(),
        lenderName: "",
        liabilityType: "",
        outstandingBalance: "",
        treatment: "ShareEqually",
        contributionText: "",
        percentageValue: "",
        customText: "",
      },
    ]);
  };

  const removeDebt = (id: string) => {
    onChange(
      "sharedDebts",
      (data?.sharedDebts || []).filter(
        (row: any) => row.id !== id
      )
    );
  };

  const updateDebt = (
    id: string,
    field: string,
    value: any
  ) => {
    onChange(
      "sharedDebts",
      (data?.sharedDebts || []).map((row: any) =>
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
          Joint Liabilities & Debts
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Debts and liabilities jointly held or
          jointly guaranteed by both partners.
        </p>
      </div>

      {/* ENABLED */}

      <div className="border rounded-xl p-5">

        <div className="flex items-center justify-between">

          <h3 className="font-semibold">
            Shared Debts
          </h3>

          <select
            className={inputClass}
            disabled={!isEditing}
            value={data?.hasSharedDebts || "No"}
            onChange={(e) =>
              onChange(
                "hasSharedDebts",
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

        {data?.hasSharedDebts === "Yes" && (
          <>
            <div className="space-y-4 mt-5">

              {(data?.sharedDebts || []).map(
                (debt: any) => (
                  <div
                    key={debt.id}
                    className="border rounded-lg p-4"
                  >
                    <div className="grid md:grid-cols-3 gap-3">

                      <input
                        className={inputClass}
                        disabled={!isEditing}
                        value={debt.lenderName}
                        placeholder="Lender Name"
                        onChange={(e) =>
                          updateDebt(
                            debt.id,
                            "lenderName",
                            e.target.value
                          )
                        }
                      />

                      <select
                        className={inputClass}
                        disabled={!isEditing}
                        value={
                          debt.liabilityType
                        }
                        onChange={(e) =>
                          updateDebt(
                            debt.id,
                            "liabilityType",
                            e.target.value
                          )
                        }
                      >
                        <option value="">
                          Liability Type
                        </option>

                        {liabilityTypes.map(
                          (type) => (
                            <option
                              key={type}
                              value={type}
                            >
                              {type}
                            </option>
                          )
                        )}
                      </select>

                      <input
                        type="number"
                        className={inputClass}
                        disabled={!isEditing}
                        value={
                          debt.outstandingBalance
                        }
                        placeholder="Outstanding Balance"
                        onChange={(e) =>
                          updateDebt(
                            debt.id,
                            "outstandingBalance",
                            e.target.value
                          )
                        }
                      />

                    </div>

                    {/* TREATMENT */}

                    <div className="mt-4">

                      <label className="block mb-2 font-medium text-sm">
                        Treatment
                      </label>

                      <select
                        className={inputClass}
                        disabled={!isEditing}
                        value={
                          debt.treatment || ""
                        }
                        onChange={(e) =>
                          updateDebt(
                            debt.id,
                            "treatment",
                            e.target.value
                          )
                        }
                      >
                        {treatmentOptions.map(
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

                      {debt.treatment ===
                        "Contribution" && (
                        <textarea
                          rows={3}
                          className={`${inputClass} mt-3`}
                          placeholder="Contribution Details"
                          disabled={!isEditing}
                          value={
                            debt.contributionText ||
                            ""
                          }
                          onChange={(e) =>
                            updateDebt(
                              debt.id,
                              "contributionText",
                              e.target.value
                            )
                          }
                        />
                      )}

                      {debt.treatment ===
                        "Percentage" && (
                        <input
                          type="number"
                          className={`${inputClass} mt-3`}
                          placeholder="Percentage"
                          disabled={!isEditing}
                          value={
                            debt.percentageValue ||
                            ""
                          }
                          onChange={(e) =>
                            updateDebt(
                              debt.id,
                              "percentageValue",
                              e.target.value
                            )
                          }
                        />
                      )}

                      {debt.treatment ===
                        "Custom" && (
                        <textarea
                          rows={3}
                          className={`${inputClass} mt-3`}
                          placeholder="Custom Settlement Arrangement"
                          disabled={!isEditing}
                          value={
                            debt.customText || ""
                          }
                          onChange={(e) =>
                            updateDebt(
                              debt.id,
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
                          removeDebt(debt.id)
                        }
                        className="mt-4 flex items-center gap-2 text-red-600"
                      >
                        <Trash2 size={14} />
                        Remove Liability
                      </button>
                    )}
                  </div>
                )
              )}

            </div>

            {isEditing && (
              <button
                type="button"
                onClick={addDebt}
                className="mt-5 bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus size={14} />
                Add Shared Liability
              </button>
            )}
          </>
        )}
      </div>

    </div>
  );
}