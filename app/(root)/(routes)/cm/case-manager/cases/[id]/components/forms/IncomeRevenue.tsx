
"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  data: any;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
}

type Treatment =
  | ""
  | "KeepSeparate"
  | "ShareEqually"
  | "Contribution"
  | "Percentage"
  | "Custom";

interface TreatmentFields {
  treatment?: Treatment;
  contributionText?: string;
  percentageValue?: string;
  customText?: string;
}

interface IncomeRow extends TreatmentFields {
  id: string;
  description: string;
  amount: string;
}

const treatmentOptions: {
  value: Treatment;
  label: string;
}[] = [
  {
    value: "KeepSeparate",
    label: "Keep it Separate",
  },
  {
    value: "ShareEqually",
    label: "Share Equally (50/50)",
  },
  {
    value: "Contribution",
    label: "Split by Contribution",
  },
  {
    value: "Percentage",
    label: "Share by Percentage",
  },
  {
    value: "Custom",
    label: "Custom Arrangement",
  },
];

export default function IncomeRevenue({
  data,
  isEditing,
  onChange,
}: Props) {
  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-500";

  const selectClass = inputClass;

  const textareaClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 resize-y focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-500";

  /**
   * Update a specific property of a row.
   *
   * The old CM implementation always saved the value
   * under `row.value`, even when updating description,
   * amount, etc. This version correctly uses `[key]: value`.
   */
  const updateRow = (
    field: string,
    id: string,
    key: string,
    value: any
  ) => {
    onChange(
      field,
      (data?.[field] || []).map((row: IncomeRow) =>
        row.id === id
          ? {
              ...row,
              [key]: value,
            }
          : row
      )
    );
  };

  /**
   * Update treatment object inside a row.
   */
  const updateRowTreatment = (
    field: string,
    id: string,
    treatmentFields: TreatmentFields
  ) => {
    onChange(
      field,
      (data?.[field] || []).map((row: IncomeRow) =>
        row.id === id
          ? {
              ...row,
              ...treatmentFields,
            }
          : row
      )
    );
  };

  /**
   * Add a new row.
   */
  const addRow = (field: string) => {
    const newRow: IncomeRow = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      description: "",
      amount: "",
      treatment: "KeepSeparate",
      contributionText: "",
      percentageValue: "",
      customText: "",
    };

    onChange(field, [...(data?.[field] || []), newRow]);
  };

  /**
   * Remove a row.
   */
  const removeRow = (field: string, id: string) => {
    onChange(
      field,
      (data?.[field] || []).filter(
        (row: IncomeRow) => row.id !== id
      )
    );
  };

  /**
   * Render treatment-specific fields.
   */
  const renderTreatmentFields = (
    fields: TreatmentFields,
    onTreatmentChange: (patch: TreatmentFields) => void
  ) => {
    const treatment = fields?.treatment || "";

    return (
      <>
        <select
          value={treatment}
          disabled={!isEditing}
          className={selectClass}
          onChange={(e) =>
            onTreatmentChange({
              treatment: e.target.value as Treatment,
            })
          }
        >
          <option value="">Select treatment</option>

          {treatmentOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        {treatment === "Percentage" && (
          <div className="mt-3">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Specify percentage
            </label>

            <input
              type="number"
              min={0}
              max={100}
              placeholder="Percentage (%)"
              className={inputClass}
              disabled={!isEditing}
              value={fields?.percentageValue || ""}
              onChange={(e) =>
                onTreatmentChange({
                  percentageValue: e.target.value,
                })
              }
            />
          </div>
        )}

        {treatment === "Contribution" && (
          <div className="mt-3">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Define contribution
            </label>

            <textarea
              rows={3}
              placeholder="Explain the contribution arrangement"
              className={textareaClass}
              disabled={!isEditing}
              value={fields?.contributionText || ""}
              onChange={(e) =>
                onTreatmentChange({
                  contributionText: e.target.value,
                })
              }
            />
          </div>
        )}

        {treatment === "Custom" && (
          <div className="mt-3">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Custom Arrangement Details
            </label>

            <textarea
              rows={3}
              placeholder="Describe the custom arrangement"
              className={textareaClass}
              disabled={!isEditing}
              value={fields?.customText || ""}
              onChange={(e) =>
                onTreatmentChange({
                  customText: e.target.value,
                })
              }
            />
          </div>
        )}
      </>
    );
  };

  /**
   * Render an income row.
   */
  const renderIncomeRows = (
    field: "primaryIncomeRows" | "altIncomeRows",
    rows: IncomeRow[],
    descriptionPlaceholder: string,
    amountPlaceholder: string,
    addButtonLabel: string
  ) => {
    return (
      <div className="mt-5 space-y-4">
        {rows.map((row: IncomeRow) => (
          <div
            key={row.id}
            className="relative rounded-lg border border-slate-200 bg-slate-50 p-4"
          >
            <div className="grid gap-3 md:grid-cols-2">
              {/* Description */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Description
                </label>

                <input
                  type="text"
                  className={inputClass}
                  value={row.description || ""}
                  disabled={!isEditing}
                  placeholder={descriptionPlaceholder}
                  onChange={(e) =>
                    updateRow(
                      field,
                      row.id,
                      "description",
                      e.target.value
                    )
                  }
                />
              </div>

              {/* Amount */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Amount (£)
                </label>

                <input
                  type="number"
                  min={0}
                  className={inputClass}
                  value={row.amount || ""}
                  disabled={!isEditing}
                  placeholder={amountPlaceholder}
                  onChange={(e) =>
                    updateRow(
                      field,
                      row.id,
                      "amount",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            {/* Treatment */}
            <div className="mt-4">
              <label className="mb-2 block text-xs font-medium text-slate-600">
                How should this income be treated?
              </label>

              {renderTreatmentFields(
                row,
                (patch) =>
                  updateRowTreatment(
                    field,
                    row.id,
                    patch
                  )
              )}
            </div>

            {/* Remove */}
            {isEditing && (
              <button
                type="button"
                onClick={() =>
                  removeRow(field, row.id)
                }
                className="mt-4 flex items-center gap-2 text-sm font-medium text-red-600 transition hover:text-red-700"
              >
                <Trash2 size={14} />
                Remove
              </button>
            )}
          </div>
        ))}

        {/* Add */}
        {isEditing && (
          <button
            type="button"
            onClick={() => addRow(field)}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            <Plus size={14} />
            {addButtonLabel}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Income & Revenue
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Tell us about salary, bonuses, dividends,
          business earnings and any other personal
          income.
        </p>
      </div>

      {/* GROSS ANNUAL INCOME */}
      <div>
        <label className="mb-2 block font-semibold text-slate-800">
          Gross Annual Income (£)
        </label>

        <input
          type="number"
          min={0}
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
      <div className="rounded-xl border border-slate-200 p-5">
        <h3 className="mb-4 font-semibold text-slate-900">
          Salary Treatment
        </h3>

        {renderTreatmentFields(
          data?.salaryTreatment || {
            treatment: "",
            contributionText: "",
            percentageValue: "",
            customText: "",
          },
          (patch) =>
            onChange("salaryTreatment", {
              ...(data?.salaryTreatment || {}),
              ...patch,
            })
        )}
      </div>

      {/* BONUSES */}
      <div className="rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-semibold text-slate-900">
            Bonuses & Employment Incentives
          </h3>

          <select
            value={data?.hasPrimaryBonus || "No"}
            disabled={!isEditing}
            className="w-32 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            onChange={(e) =>
              onChange(
                "hasPrimaryBonus",
                e.target.value
              )
            }
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <p className="mt-2 text-sm text-slate-500">
          Include bonuses, commissions, share options,
          share awards, profit-sharing payments or other
          employment incentives.
        </p>

        {data?.hasPrimaryBonus === "Yes" &&
          renderIncomeRows(
            "primaryIncomeRows",
            data?.primaryIncomeRows || [],
            "Description (e.g. Annual Bonus)",
            "Estimated Annual Amount (£)",
            "Add Bonus"
          )}
      </div>

      {/* ALTERNATIVE INCOME */}
      <div className="rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-semibold text-slate-900">
            Alternative Income Sources
          </h3>

          <select
            value={
              data?.hasAlternativeIncome || "No"
            }
            disabled={!isEditing}
            className="w-32 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            onChange={(e) =>
              onChange(
                "hasAlternativeIncome",
                e.target.value
              )
            }
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <p className="mt-2 text-sm text-slate-500">
          Include rental income, dividends, trust
          distributions, business income, royalties,
          maintenance payments, pension income or other
          investment income.
        </p>

        {data?.hasAlternativeIncome === "Yes" &&
          renderIncomeRows(
            "altIncomeRows",
            data?.altIncomeRows || [],
            "Source Name (e.g. Dividend, Rental Yield)",
            "Annual Income (£)",
            "Add Income Source"
          )}
      </div>
    </div>
  );
}

