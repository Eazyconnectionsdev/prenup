"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  data: any;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
}

export default function LiabilitiesDebts({
  data,
  isEditing,
  onChange,
}: Props) {
  const inputClass =
    "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm";

  const updateDebt = (
    id: string,
    field: string,
    value: string
  ) => {
    onChange(
      "debts",
      (data?.debts || []).map((item: any) =>
        item.id === id
          ? {
              ...item,
              value,
            }
          : item
      )
    );
  };

  const removeDebt = (id: string) => {
    onChange(
      "debts",
      data?.debts.filter(
        (item: any) => item.id !== id
      )
    );
  };

  const addDebt = () => {
    onChange("debts", [
      ...(data?.debts || []),
      {
        id: Date.now().toString(),
        lenderName: "",
        debtType: "",
        outstandingBalance: "",
        treatment: "KeepSeparate",
        contributionText: "",
        percentageValue: "",
        customText: "",
      },
    ]);
  };

  const updateMaintenance = (
    id: string,
    field: string,
    value: string
  ) => {
    onChange(
      "maintenance",
      (data?.maintenance || []).map(
        (item: any) =>
          item.id === id
            ? {
                ...item,
                value,
              }
            : item
      )
    );
  };

  const removeMaintenance = (
    id: string
  ) => {
    onChange(
      "maintenance",
      data?.maintenance.filter(
        (item: any) => item.id !== id
      )
    );
  };

  const addMaintenance = () => {
    onChange("maintenance", [
      ...(data?.maintenance || []),
      {
        id: Date.now().toString(),
        dependentLink: "",
        monthlyPayment: "",
        projectedEndDate: "",
        treatment: "KeepSeparate",
      },
    ]);
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div>
        <h2 className="text-xl font-bold">
          Liabilities & Debts
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Provide details of debts,
          loans and maintenance
          obligations.
        </p>
      </div>

      {/* DEBTS */}

      <div className="border rounded-xl p-5">

        <div className="flex justify-between items-center mb-5">

          <h3 className="font-semibold">
            Personal Debts & Loans
          </h3>

          <select
            value={data?.hasDebts || "No"}
            disabled={!isEditing}
            onChange={(e) =>
              onChange(
                "hasDebts",
                e.target.value
              )
            }
            className={inputClass}
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
          <>

            <div className="space-y-4">

              {(data?.debts || []).map(
                (debt: any) => (
                  <div
                    key={debt.id}
                    className="border rounded-lg p-4"
                  >
                    <div className="grid md:grid-cols-3 gap-3">

                      <input
                        className={inputClass}
                        disabled={!isEditing}
                        value={
                          debt.lenderName
                        }
                        placeholder="Lender"
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
                          debt.debtType
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
                          Type
                        </option>

                        <option value="Credit Card">
                          Credit Card
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

                        <option value="Tax Liability">
                          Tax Liability
                        </option>

                        <option value="Other">
                          Other
                        </option>
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

                    {isEditing && (
                      <button
                        type="button"
                        onClick={() =>
                          removeDebt(
                            debt.id
                          )
                        }
                        className="text-red-600 mt-3 flex items-center gap-2"
                      >
                        <Trash2 size={14} />
                        Remove Debt
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
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2"
              >
                <Plus size={14} />
                Add Debt
              </button>
            )}

          </>
        )}
      </div>

      {/* MAINTENANCE */}

      <div className="border rounded-xl p-5">

        <div className="flex justify-between items-center mb-5">

          <h3 className="font-semibold">
            Maintenance & Support
          </h3>

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
            className={inputClass}
          >
            <option value="Yes">
              Yes
            </option>

            <option value="No">
              No
            </option>
          </select>

        </div>

        {data?.hasMaintenance ===
          "Yes" && (
          <>
            <div className="space-y-4">

              {(data?.maintenance || []).map(
                (item: any) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4"
                  >
                    <div className="grid md:grid-cols-3 gap-3">

                      <select
                        className={inputClass}
                        disabled={!isEditing}
                        value={
                          item.dependentLink
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
                          Select
                        </option>

                        <option value="Child Support">
                          Child Support
                        </option>

                        <option value="Spousal Maintenance">
                          Spousal Maintenance
                        </option>

                        <option value="Other">
                          Other
                        </option>
                      </select>

                      <input
                        type="number"
                        className={inputClass}
                        disabled={!isEditing}
                        value={
                          item.monthlyPayment
                        }
                        placeholder="Monthly Payment"
                        onChange={(e) =>
                          updateMaintenance(
                            item.id,
                            "monthlyPayment",
                            e.target.value
                          )
                        }
                      />

                      <input
                        className={inputClass}
                        disabled={!isEditing}
                        value={
                          item.projectedEndDate
                        }
                        placeholder="End Date"
                        onChange={(e) =>
                          updateMaintenance(
                            item.id,
                            "projectedEndDate",
                            e.target.value
                          )
                        }
                      />

                    </div>

                    {isEditing && (
                      <button
                        type="button"
                        onClick={() =>
                          removeMaintenance(
                            item.id
                          )
                        }
                        className="text-red-600 mt-3 flex items-center gap-2"
                      >
                        <Trash2 size={14} />
                        Remove Payment
                      </button>
                    )}
                  </div>
                )
              )}

            </div>

            {isEditing && (
              <button
                type="button"
                onClick={addMaintenance}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2"
              >
                <Plus size={14} />
                Add Payment
              </button>
            )}
          </>
        )}

      </div>

    </div>
  );
}