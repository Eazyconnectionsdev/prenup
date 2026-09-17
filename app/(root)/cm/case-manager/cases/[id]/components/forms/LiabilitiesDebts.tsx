
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

interface DebtRow extends TreatmentFields {
  id: string;
  lenderName: string;
  debtType: string;
  outstandingBalance: string;
}

interface MaintenanceRow extends TreatmentFields {
  id: string;
  dependentLink: string;
  monthlyPayment: string;
  projectedEndDate: string;
}

const inputClass =
  "w-full rounded-[10px] border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 disabled:bg-slate-100 disabled:text-slate-500";

const textareaClass =
  "w-full min-h-[80px] resize-y rounded-[10px] border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 disabled:bg-slate-100 disabled:text-slate-500";

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

function makeId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

function makeDebtRow(): DebtRow {
  return {
    id: makeId("debt"),
    lenderName: "",
    debtType: "",
    outstandingBalance: "",
    treatment: "KeepSeparate",
    contributionText: "",
    percentageValue: "",
    customText: "",
  };
}

function makeMaintenanceRow(): MaintenanceRow {
  return {
    id: makeId("maint"),
    dependentLink: "",
    monthlyPayment: "",
    projectedEndDate: "",
    treatment: "KeepSeparate",
    contributionText: "",
    percentageValue: "",
    customText: "",
  };
}

/* ---------------------------------------------------------------------- */
/* Treatment component                                                     */
/* ---------------------------------------------------------------------- */

interface TreatmentSelectProps {
  fields: TreatmentFields;
  disabled?: boolean;
  label?: string;
  onChange: (fields: TreatmentFields) => void;
}

function TreatmentSelect({
  fields,
  disabled = false,
  label = "How should this be settled?",
  onChange,
}: TreatmentSelectProps) {
  const treatment = fields?.treatment || "";

  return (
    <div className="mt-4">
      <select
        value={treatment}
        disabled={disabled}
        className={inputClass}
        onChange={(e) =>
          onChange({
            ...fields,
            treatment: e.target.value as Treatment,
          })
        }
      >
        <option value="">{label}</option>

        {treatmentOptions.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {treatment === "Contribution" && (
        <div className="mt-3 rounded-r-[10px] border-l-4 border-indigo-600 bg-slate-50 p-4">
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            Define contribution
          </label>

          <textarea
            value={fields?.contributionText || ""}
            disabled={disabled}
            placeholder="Explain how the liability will be handled based on contribution."
            className={textareaClass}
            onChange={(e) =>
              onChange({
                ...fields,
                contributionText: e.target.value,
              })
            }
          />
        </div>
      )}

      {treatment === "Percentage" && (
        <div className="mt-3 rounded-r-[10px] border-l-4 border-indigo-600 bg-slate-50 p-4">
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            Specify percentage
          </label>

          <input
            type="number"
            min={0}
            max={100}
            value={fields?.percentageValue || ""}
            disabled={disabled}
            placeholder="Percentage (%)"
            className={inputClass}
            onChange={(e) =>
              onChange({
                ...fields,
                percentageValue: e.target.value,
              })
            }
          />
        </div>
      )}

      {treatment === "Custom" && (
        <div className="mt-3 rounded-r-[10px] border-l-4 border-indigo-600 bg-slate-50 p-4">
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            Custom Arrangement Details
          </label>

          <textarea
            value={fields?.customText || ""}
            disabled={disabled}
            placeholder="Describe the custom settlement arrangement."
            className={textareaClass}
            onChange={(e) =>
              onChange({
                ...fields,
                customText: e.target.value,
              })
            }
          />
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Main Component                                                          */
/* ---------------------------------------------------------------------- */

export default function LiabilitiesDebts({
  data,
  isEditing,
  onChange,
}: Props) {
  /* ------------------------------------------------------------------ */
  /* Debt helpers                                                        */
  /* ------------------------------------------------------------------ */

  const updateDebt = (
    id: string,
    field: keyof DebtRow,
    value: any
  ) => {
    onChange(
      "debts",
      (data?.debts || []).map((item: DebtRow) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const updateDebtTreatment = (
    id: string,
    fields: TreatmentFields
  ) => {
    onChange(
      "debts",
      (data?.debts || []).map((item: DebtRow) =>
        item.id === id
          ? {
              ...item,
              ...fields,
            }
          : item
      )
    );
  };

  const removeDebt = (id: string) => {
    onChange(
      "debts",
      (data?.debts || []).filter(
        (item: DebtRow) => item.id !== id
      )
    );
  };

  const addDebt = () => {
    onChange("debts", [
      ...(data?.debts || []),
      makeDebtRow(),
    ]);
  };

  /* ------------------------------------------------------------------ */
  /* Maintenance helpers                                                */
  /* ------------------------------------------------------------------ */

  const updateMaintenance = (
    id: string,
    field: keyof MaintenanceRow,
    value: any
  ) => {
    onChange(
      "maintenance",
      (data?.maintenance || []).map(
        (item: MaintenanceRow) =>
          item.id === id
            ? {
                ...item,
                [field]: value,
              }
            : item
      )
    );
  };

  const updateMaintenanceTreatment = (
    id: string,
    fields: TreatmentFields
  ) => {
    onChange(
      "maintenance",
      (data?.maintenance || []).map(
        (item: MaintenanceRow) =>
          item.id === id
            ? {
                ...item,
                ...fields,
              }
            : item
      )
    );
  };

  const removeMaintenance = (id: string) => {
    onChange(
      "maintenance",
      (data?.maintenance || []).filter(
        (item: MaintenanceRow) =>
          item.id !== id
      )
    );
  };

  const addMaintenance = () => {
    onChange("maintenance", [
      ...(data?.maintenance || []),
      makeMaintenanceRow(),
    ]);
  };

  /* ------------------------------------------------------------------ */
  /* Render                                                              */
  /* ------------------------------------------------------------------ */

  return (
    <div className="space-y-8">
      {/* ============================================================ */}
      {/* HEADER                                                        */}
      {/* ============================================================ */}

      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Liabilities & Debts
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Provide details of debts, loans and
          maintenance obligations.
        </p>
      </div>

      {/* ============================================================ */}
      {/* PERSONAL DEBTS & LOANS                                        */}
      {/* ============================================================ */}

      <div className="rounded-xl border border-slate-200 p-5">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-slate-900">
              Personal Debts & Loans
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Include loans, credit cards, overdrafts
              and other financial obligations.
            </p>
          </div>

          <select
            value={data?.hasDebts || "No"}
            disabled={!isEditing}
            onChange={(e) =>
              onChange(
                "hasDebts",
                e.target.value
              )
            }
            className="w-32 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm disabled:bg-slate-100"
          >
            <option value="Yes">
              Yes
            </option>

            <option value="No">
              No
            </option>
          </select>
        </div>

        {data?.hasDebts === "Yes" && (
          <div className="space-y-4">
            {(data?.debts || []).map(
              (debt: DebtRow) => (
                <div
                  key={debt.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-5"
                >
                  {/* Debt fields */}
                  <div className="grid gap-3 md:grid-cols-3">
                    {/* Lender */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Lender / Creditor Name
                      </label>

                      <input
                        type="text"
                        className={inputClass}
                        disabled={!isEditing}
                        value={
                          debt.lenderName || ""
                        }
                        placeholder="Lender / Creditor Name"
                        onChange={(e) =>
                          updateDebt(
                            debt.id,
                            "lenderName",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* Debt type */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Type of Debt
                      </label>

                      <select
                        className={inputClass}
                        disabled={!isEditing}
                        value={
                          debt.debtType || ""
                        }
                        onChange={(e) =>
                          updateDebt(
                            debt.id,
                            "debtType",
                            e.target.value
                          )
                        }
                      >
                        <option value="">
                          Type of Debt
                        </option>

                        <option value="Credit Card">
                          Credit Card Balance
                        </option>

                        <option value="Personal Loan">
                          Personal Loan
                        </option>

                        <option value="Student Loan">
                          Student Loan
                        </option>

                        <option value="Mortgage">
                          Mortgage
                        </option>

                        <option value="Overdraft">
                          Overdraft
                        </option>

                        <option value="Car Finance">
                          Car Finance / Vehicle Loan
                        </option>

                        <option value="Tax Liability">
                          Tax Liability
                        </option>

                        <option value="Other">
                          Other Liability
                        </option>
                      </select>
                    </div>

                    {/* Balance */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Outstanding Balance (£)
                      </label>

                      <input
                        type="number"
                        min={0}
                        className={inputClass}
                        disabled={!isEditing}
                        value={
                          debt.outstandingBalance ||
                          ""
                        }
                        placeholder="Outstanding Balance (£)"
                        onChange={(e) =>
                          updateDebt(
                            debt.id,
                            "outstandingBalance",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* Treatment */}
                  <TreatmentSelect
                    fields={debt}
                    disabled={!isEditing}
                    label="How should this be Settled?"
                    onChange={(fields) =>
                      updateDebtTreatment(
                        debt.id,
                        fields
                      )
                    }
                  />

                  {/* Remove */}
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() =>
                        removeDebt(debt.id)
                      }
                      className="mt-4 flex items-center gap-2 text-sm font-medium text-red-600 transition hover:text-red-700"
                    >
                      <Trash2 size={14} />
                      Remove Debt
                    </button>
                  )}
                </div>
              )
            )}

            {/* Add Debt */}
            {isEditing && (
              <button
                type="button"
                onClick={addDebt}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                <Plus size={14} />
                Add Debt
              </button>
            )}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* MAINTENANCE & SUPPORT PAYMENTS                               */}
      {/* ============================================================ */}

      <div className="rounded-xl border border-slate-200 p-5">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-slate-900">
              Maintenance & Support Payments
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Include ongoing child maintenance or
              spousal maintenance commitments.
            </p>
          </div>

          <select
            value={
              data?.hasMaintenance || "No"
            }
            disabled={!isEditing}
            onChange={(e) =>
              onChange(
                "hasMaintenance",
                e.target.value
              )
            }
            className="w-32 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm disabled:bg-slate-100"
          >
            <option value="Yes">
              Yes
            </option>

            <option value="No">
              No
            </option>
          </select>
        </div>

        {data?.hasMaintenance === "Yes" && (
          <div className="space-y-4">
            {(data?.maintenance || []).map(
              (item: MaintenanceRow) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-5"
                >
                  {/* Maintenance fields */}
                  <div className="grid gap-3 md:grid-cols-3">
                    {/* Dependent link */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Link to Dependent
                      </label>

                      <select
                        className={inputClass}
                        disabled={!isEditing}
                        value={
                          item.dependentLink ||
                          ""
                        }
                        onChange={(e) =>
                          updateMaintenance(
                            item.id,
                            "dependentLink",
                            e.target.value
                          )
                        }
                      >
                        <option value="">
                          Link to Dependent
                        </option>

                        <option value="Child Support">
                          Child Support Commitment
                        </option>

                        <option value="Spousal Maintenance">
                          Former Spouse Maintenance
                        </option>

                        <option value="Other Dependent">
                          Other Dependent Liability
                        </option>
                      </select>
                    </div>

                    {/* Monthly payment */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Monthly Payment (£)
                      </label>

                      <input
                        type="number"
                        min={0}
                        className={inputClass}
                        disabled={!isEditing}
                        value={
                          item.monthlyPayment ||
                          ""
                        }
                        placeholder="Monthly Payment (£)"
                        onChange={(e) =>
                          updateMaintenance(
                            item.id,
                            "monthlyPayment",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* End date */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Projected End Date
                      </label>

                      <input
                        type="text"
                        className={inputClass}
                        disabled={!isEditing}
                        value={
                          item.projectedEndDate ||
                          ""
                        }
                        placeholder="e.g. Age 18"
                        onChange={(e) =>
                          updateMaintenance(
                            item.id,
                            "projectedEndDate",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* Treatment */}
                  <TreatmentSelect
                    fields={item}
                    disabled={!isEditing}
                    label="How should this be Settled?"
                    onChange={(fields) =>
                      updateMaintenanceTreatment(
                        item.id,
                        fields
                      )
                    }
                  />

                  {/* Remove */}
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() =>
                        removeMaintenance(
                          item.id
                        )
                      }
                      className="mt-4 flex items-center gap-2 text-sm font-medium text-red-600 transition hover:text-red-700"
                    >
                      <Trash2 size={14} />
                      Remove Payment
                    </button>
                  )}
                </div>
              )
            )}

            {/* Add Maintenance */}
            {isEditing && (
              <button
                type="button"
                onClick={addMaintenance}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                <Plus size={14} />
                Add Maintenance Payment
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

