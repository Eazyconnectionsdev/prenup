"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  data: any;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
}

const treatmentOptions = [
  "KeepSeparate",
  "ShareEqually",
  "Contribution",
  "Percentage",
  "Custom",
];

export default function IncomeRevenue({
  data,
  isEditing,
  onChange,
}: Props) {
  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm";

  const updateRow = (
    field: string,
    id: string,
    key: string,
    value: string
  ) => {
    onChange(
      field,
      (data[field] || []).map((row: any) =>
        row.id === id
          ? {
              ...row,
              value,
            }
          : row
      )
    );
  };

  const addRow = (
    field: string,
    row: any
  ) => {
    onChange(field, [...(data[field] || []), row]);
  };

  const removeRow = (
    field: string,
    id: string
  ) => {
    onChange(
      field,
      (data[field] || []).filter(
        (row: any) => row.id !== id
      )
    );
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Income & Revenue
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Tell us about salary, bonuses,
          dividends, business earnings and
          any other personal income.
        </p>
      </div>

      {/* GROSS ANNUAL INCOME */}

      <div>
        <label className="block mb-2 font-semibold">
          Gross Annual Income (£)
        </label>

        <input
          type="number"
          value={data?.grossAnnualIncome || ""}
          disabled={!isEditing}
          className={inputClass}
          onChange={(e) =>
            onChange(
              "grossAnnualIncome",
              e.target.value
            )
          }
        />
      </div>

      {/* SALARY TREATMENT */}

      <div className="border rounded-xl p-5">

        <h3 className="font-semibold mb-4">
          Salary Treatment
        </h3>

        <select
          value={
            data?.salaryTreatment?.treatment || ""
          }
          disabled={!isEditing}
          className={inputClass}
          onChange={(e) =>
            onChange("salaryTreatment", {
              ...(data?.salaryTreatment || {}),
              treatment: e.target.value,
            })
          }
        >
          <option value="">
            Select treatment
          </option>

          {treatmentOptions.map((option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}
        </select>

        {data?.salaryTreatment?.treatment ===
          "Percentage" && (
          <div className="mt-3">
            <input
              type="number"
              placeholder="Percentage"
              className={inputClass}
              disabled={!isEditing}
              value={
                data?.salaryTreatment
                  ?.percentageValue || ""
              }
              onChange={(e) =>
                onChange("salaryTreatment", {
                  ...data?.salaryTreatment,
                  percentageValue:
                    e.target.value,
                })
              }
            />
          </div>
        )}

        {data?.salaryTreatment?.treatment ===
          "Contribution" && (
          <div className="mt-3">
            <textarea
              rows={3}
              placeholder="Contribution details"
              className={inputClass}
              disabled={!isEditing}
              value={
                data?.salaryTreatment
                  ?.contributionText || ""
              }
              onChange={(e) =>
                onChange("salaryTreatment", {
                  ...data?.salaryTreatment,
                  contributionText:
                    e.target.value,
                })
              }
            />
          </div>
        )}

        {data?.salaryTreatment?.treatment ===
          "Custom" && (
          <div className="mt-3">
            <textarea
              rows={3}
              placeholder="Custom arrangement"
              className={inputClass}
              disabled={!isEditing}
              value={
                data?.salaryTreatment
                  ?.customText || ""
              }
              onChange={(e) =>
                onChange("salaryTreatment", {
                  ...data?.salaryTreatment,
                  customText:
                    e.target.value,
                })
              }
            />
          </div>
        )}

      </div>

      {/* BONUSES */}

      <div className="border rounded-xl p-5">

        <div className="flex justify-between items-center">

          <h3 className="font-semibold">
            Bonuses & Incentives
          </h3>

          <select
            value={
              data?.hasPrimaryBonus || "No"
            }
            disabled={!isEditing}
            className={inputClass}
            onChange={(e) =>
              onChange(
                "hasPrimaryBonus",
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

        {data?.hasPrimaryBonus === "Yes" && (
          <div className="mt-5 space-y-4">

            {(data?.primaryIncomeRows || []).map(
              (row: any) => (
                <div
                  key={row.id}
                  className="border rounded-lg p-4"
                >
                  <div className="grid md:grid-cols-2 gap-3">

                    <input
                      className={inputClass}
                      value={
                        row.description
                      }
                      disabled={!isEditing}
                      placeholder="Description"
                      onChange={(e) =>
                        updateRow(
                          "primaryIncomeRows",
                          row.id,
                          "description",
                          e.target.value
                        )
                      }
                    />

                    <input
                      type="number"
                      className={inputClass}
                      value={row.amount}
                      disabled={!isEditing}
                      placeholder="Amount"
                      onChange={(e) =>
                        updateRow(
                          "primaryIncomeRows",
                          row.id,
                          "amount",
                          e.target.value
                        )
                      }
                    />

                  </div>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={() =>
                        removeRow(
                          "primaryIncomeRows",
                          row.id
                        )
                      }
                      className="mt-3 text-red-600 flex gap-2"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  )}
                </div>
              )
            )}

            {isEditing && (
              <button
                type="button"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                onClick={() =>
                  addRow(
                    "primaryIncomeRows",
                    {
                      id: Date.now().toString(),
                      description: "",
                      amount: "",
                      treatment:
                        "KeepSeparate",
                    }
                  )
                }
              >
                <Plus size={14} />
                Add Bonus
              </button>
            )}

          </div>
        )}

      </div>

      {/* ALTERNATIVE INCOME */}

      <div className="border rounded-xl p-5">

        <div className="flex justify-between items-center">

          <h3 className="font-semibold">
            Alternative Income Sources
          </h3>

          <select
            value={
              data?.hasAlternativeIncome ||
              "No"
            }
            disabled={!isEditing}
            className={inputClass}
            onChange={(e) =>
              onChange(
                "hasAlternativeIncome",
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

        {data?.hasAlternativeIncome ===
          "Yes" && (
          <div className="mt-5 space-y-4">

            {(data?.altIncomeRows || []).map(
              (row: any) => (
                <div
                  key={row.id}
                  className="border rounded-lg p-4"
                >
                  <div className="grid md:grid-cols-2 gap-3">

                    <input
                      className={inputClass}
                      value={
                        row.description
                      }
                      disabled={!isEditing}
                      placeholder="Source"
                      onChange={(e) =>
                        updateRow(
                          "altIncomeRows",
                          row.id,
                          "description",
                          e.target.value
                        )
                      }
                    />

                    <input
                      type="number"
                      className={inputClass}
                      value={row.amount}
                      disabled={!isEditing}
                      placeholder="Annual Income"
                      onChange={(e) =>
                        updateRow(
                          "altIncomeRows",
                          row.id,
                          "amount",
                          e.target.value
                        )
                      }
                    />

                  </div>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={() =>
                        removeRow(
                          "altIncomeRows",
                          row.id
                        )
                      }
                      className="mt-3 text-red-600 flex gap-2"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  )}
                </div>
              )
            )}

            {isEditing && (
              <button
                type="button"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                onClick={() =>
                  addRow(
                    "altIncomeRows",
                    {
                      id: Date.now().toString(),
                      description: "",
                      amount: "",
                      treatment:
                        "KeepSeparate",
                    }
                  )
                }
              >
                <Plus size={14} />
                Add Income Source
              </button>
            )}

          </div>
        )}

      </div>

    </div>
  );
}