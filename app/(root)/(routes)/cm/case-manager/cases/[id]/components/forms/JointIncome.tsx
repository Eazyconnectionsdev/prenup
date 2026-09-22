"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  data: any;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
}

type YesNo = "Yes" | "No";

type Treatment =
  | ""
  | "KeepSeparate"
  | "ShareEqually"
  | "Contribution"
  | "Percentage"
  | "Custom";

interface IncomeRow {
  id: string;
  description: string;
  source: string;
  annualIncome: string;
  treatment: Treatment;
  contributionText: string;
  percentageValue: string;
  customText: string;
}

const TREATMENTS: {
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

const inputClasses =
  "w-full rounded-[10px] border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-[0.925rem] text-slate-900 disabled:cursor-not-allowed disabled:opacity-70";

const textareaClasses =
  inputClasses + " min-h-[70px] resize-none";

function Tooltip({ text }: { text: string }) {
  return (
    <span
      title={text}
      className="inline-flex h-[18px] w-[18px] cursor-help items-center justify-center rounded-full bg-indigo-100 text-[0.75rem] font-bold text-indigo-600"
    >
      ⓘ
    </span>
  );
}

function PartHeader({
  children,
  tooltip,
}: {
  children: React.ReactNode;
  tooltip?: string;
}) {
  return (
    <div className="mb-4 mt-8 flex items-center gap-2 text-[1.15rem] font-bold text-slate-800">
      {children}

      {tooltip && <Tooltip text={tooltip} />}
    </div>
  );
}

function YesNoToggle({
  value,
  isEditing,
  onChange,
}: {
  value: YesNo;
  isEditing: boolean;
  onChange: (value: YesNo) => void;
}) {
  return (
    <div className="mb-3 grid grid-cols-2 gap-3">
      {(["Yes", "No"] as YesNo[]).map((option) => {
        const checked = value === option;

        return (
          <button
            key={option}
            type="button"
            disabled={!isEditing}
            onClick={() => onChange(option)}
            className={`relative flex items-center gap-3 rounded-[10px] border px-4 py-3 text-left transition ${
              checked
                ? "border-indigo-600 bg-slate-50"
                : "border-slate-300 bg-slate-50"
            } ${
              !isEditing
                ? "cursor-not-allowed opacity-70"
                : "cursor-pointer"
            }`}
          >
            <span
              className={`relative h-4 w-4 flex-shrink-0 rounded-full border-2 ${
                checked
                  ? "border-indigo-600 bg-indigo-600"
                  : "border-slate-300 bg-white"
              }`}
            >
              {checked && (
                <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
              )}
            </span>

            <span
              className={`text-[0.9rem] font-semibold ${
                checked
                  ? "text-indigo-600"
                  : "text-slate-900"
              }`}
            >
              {option}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function MatrixBox({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 rounded-2xl border border-slate-300 bg-slate-50 p-6">
      <div className="mb-4 text-[0.85rem] font-bold uppercase tracking-wide text-slate-500">
        {title}
      </div>

      {children}
    </div>
  );
}

function RowItem({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative mb-5 rounded-[10px] border border-slate-300 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
      {children}
    </div>
  );
}

function TreatmentSelect({
  row,
  isEditing,
  onChange,
}: {
  row: IncomeRow;
  isEditing: boolean;
  onChange: (
    field: keyof IncomeRow,
    value: any
  ) => void;
}) {
  return (
    <div className="mt-3">
      <label
        htmlFor={`treatment_${row.id}`}
        className="mb-2 block text-[0.95rem] font-semibold text-slate-800"
      >
        How should this be shared?
      </label>

      <select
        id={`treatment_${row.id}`}
        value={row.treatment || ""}
        disabled={!isEditing}
        className={inputClasses}
        onChange={(e) =>
          onChange("treatment", e.target.value as Treatment)
        }
      >
        <option value="">
          How should this be shared?
        </option>

        {TREATMENTS.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {row.treatment === "Contribution" && (
        <div className="mt-3 rounded-r-[10px] border-l-4 border-indigo-600 bg-slate-50 p-4">
          <label className="mb-1.5 block text-[0.9rem] font-semibold text-slate-800">
            Define contribution (e.g., salary, initial deposit):
          </label>

          <input
            type="text"
            value={row.contributionText || ""}
            disabled={!isEditing}
            className={inputClasses}
            placeholder="Contribution details"
            onChange={(e) =>
              onChange(
                "contributionText",
                e.target.value
              )
            }
          />
        </div>
      )}

      {row.treatment === "Percentage" && (
        <div className="mt-3 rounded-r-[10px] border-l-4 border-indigo-600 bg-slate-50 p-4">
          <label className="mb-1.5 block text-[0.9rem] font-semibold text-slate-800">
            Specify percentage (e.g., 60/40):
          </label>

          <input
            type="text"
            value={row.percentageValue || ""}
            disabled={!isEditing}
            className={inputClasses}
            placeholder="e.g. 60/40"
            onChange={(e) =>
              onChange(
                "percentageValue",
                e.target.value
              )
            }
          />
        </div>
      )}

      {row.treatment === "Custom" && (
        <div className="mt-3 rounded-r-[10px] border-l-4 border-indigo-600 bg-slate-50 p-4">
          <label className="mb-1.5 block text-[0.9rem] font-semibold text-slate-800">
            Custom Arrangement Details:
          </label>

          <textarea
            value={row.customText || ""}
            disabled={!isEditing}
            className={textareaClasses}
            placeholder="Describe the custom arrangement"
            onChange={(e) =>
              onChange(
                "customText",
                e.target.value
              )
            }
          />
        </div>
      )}
    </div>
  );
}

export default function JointIncome({
  data,
  isEditing,
  onChange,
}: Props) {
  const sharedIncomeRows: IncomeRow[] =
    Array.isArray(data?.sharedIncomeRows)
      ? data.sharedIncomeRows
      : [];

  const hasSharedIncome: YesNo =
    data?.hasSharedIncome === "Yes"
      ? "Yes"
      : "No";

  const addIncome = () => {
    const newIncome: IncomeRow = {
      id: Date.now().toString(),
      description: "",
      source: "",
      annualIncome: "",
      treatment: "ShareEqually",
      contributionText: "",
      percentageValue: "",
      customText: "",
    };

    onChange("sharedIncomeRows", [
      ...sharedIncomeRows,
      newIncome,
    ]);
  };

  const removeIncome = (id: string) => {
    onChange(
      "sharedIncomeRows",
      sharedIncomeRows.filter(
        (row) => row.id !== id
      )
    );
  };

  const updateIncome = (
    id: string,
    field: keyof IncomeRow,
    value: any
  ) => {
    const updatedRows = sharedIncomeRows.map(
      (row) =>
        row.id === id
          ? {
              ...row,
              [field]: value,
            }
          : row
    );

    onChange(
      "sharedIncomeRows",
      updatedRows
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 px-5 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-white p-11 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08)]">

          {/* HEADER */}

          <h2 className="mb-2 text-[1.45rem] font-extrabold tracking-tight text-slate-900">
            Joint Income & Revenue
          </h2>

          <p className="mb-8 text-[0.95rem] leading-relaxed text-slate-500">
            Income earned jointly by both partners.
          </p>

          {/* SHARED INCOME */}

          <PartHeader
            tooltip="Income or revenue that is jointly received, earned, or owned by both partners."
          >
            Shared Income Sources
          </PartHeader>

          <div className="mb-6">
            <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
              Do they have any income or revenue that is jointly received by both partners?
            </label>

            <YesNoToggle
              value={hasSharedIncome}
              isEditing={isEditing}
              onChange={(value) =>
                onChange(
                  "hasSharedIncome",
                  value
                )
              }
            />
          </div>

          {hasSharedIncome === "Yes" && (
            <MatrixBox title="Shared Income & Revenue">

              {sharedIncomeRows.map(
                (row) => (
                  <RowItem key={row.id}>

                    {/* DESCRIPTION / SOURCE / AMOUNT */}

                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">

                      <div>
                        <label className="mb-2 block text-[0.9rem] font-semibold text-slate-800">
                          Description
                        </label>

                        <input
                          type="text"
                          value={
                            row.description || ""
                          }
                          disabled={!isEditing}
                          placeholder="Description"
                          className={inputClasses}
                          onChange={(e) =>
                            updateIncome(
                              row.id,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-[0.9rem] font-semibold text-slate-800">
                          Source
                        </label>

                        <input
                          type="text"
                          value={
                            row.source || ""
                          }
                          disabled={!isEditing}
                          placeholder="Source"
                          className={inputClasses}
                          onChange={(e) =>
                            updateIncome(
                              row.id,
                              "source",
                              e.target.value
                            )
                          }
                        />
                      </div>

                    </div>

                    <div className="mb-3.5">
                      <label className="mb-2 block text-[0.9rem] font-semibold text-slate-800">
                        Annual Income
                      </label>

                      <input
                        type="number"
                        value={
                          row.annualIncome || ""
                        }
                        disabled={!isEditing}
                        placeholder="Annual Income (£)"
                        className={inputClasses}
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

                    <TreatmentSelect
                      row={row}
                      isEditing={isEditing}
                      onChange={(
                        field,
                        value
                      ) =>
                        updateIncome(
                          row.id,
                          field,
                          value
                        )
                      }
                    />

                    {/* REMOVE */}

                    {isEditing && (
                      <button
                        type="button"
                        onClick={() =>
                          removeIncome(row.id)
                        }
                        className="mt-5 flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={15} />
                        Remove Income
                      </button>
                    )}

                  </RowItem>
                )
              )}

              {/* EMPTY STATE */}

              {sharedIncomeRows.length ===
                0 && (
                <div className="rounded-[10px] border border-dashed border-slate-300 bg-white px-5 py-8 text-center">
                  <p className="text-sm text-slate-500">
                    No shared income sources
                    have been added yet.
                  </p>
                </div>
              )}

              {/* ADD */}

              {isEditing && (
                <button
                  type="button"
                  onClick={addIncome}
                  className="mt-2 flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  <Plus size={15} />
                  Add Shared Income
                </button>
              )}

            </MatrixBox>
          )}
        </div>
      </div>
    </div>
  );
}