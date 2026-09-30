"use client"

import React, { useState } from "react";
import {
  YesNo,
  TreatmentFields,
  emptyTreatment,
  makeId,
  inputClasses,
  PartHeader,
  YesNoToggle,
  MatrixBox,
  RowItem,
  TreatmentSelect,
  Treatment,
  makeToggleHandler,
  updateRow,
  removeRow,
} from "@/components/Formprimitives";

const sharedTreatmentOptions: { value: Treatment; label: string }[] = [
  { value: "ShareEqually", label: "Share Equally (50/50)" },
  { value: "Contribution", label: "Split by Contribution" },
  { value: "Percentage", label: "Share by Percentage" },
  { value: "Custom", label: "Custom Arrangement" },
];

interface SharedIncomeRow extends TreatmentFields {
  id: string;
  description: string;
  source: string;
  annualIncome: string;
}

function makeSharedIncomeRow(): SharedIncomeRow {
  return { id: makeId("sinc"), description: "", source: "", annualIncome: "", ...emptyTreatment };
}

interface SharedIncomeFormProps {
  onContinue?: () => void;
}

export default function SharedIncomeForm({ onContinue }: SharedIncomeFormProps = {}) {
  const [hasSharedIncome, setHasSharedIncome] = useState<YesNo>("No");
  const [sharedIncomeRows, setSharedIncomeRows] = useState<SharedIncomeRow[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleToggle = makeToggleHandler(setHasSharedIncome, setSharedIncomeRows, makeSharedIncomeRow);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (onContinue) {
      onContinue();
    } else {
      window.alert("Saved. Moving to Section 4c: Shared Liabilities & Outstanding Debts.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-5 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-white p-11 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08)]">
          <h2 className="mb-2 text-[1.45rem] font-extrabold tracking-tight text-slate-900">
            Shared Income & Revenue
          </h2>
          <p className="mb-8 text-[0.95rem] leading-relaxed text-slate-500">
            Please declare any income that you and your partner receive jointly and how you would like that income
            to be treated under your prenuptial agreement.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <PartHeader tooltip="Declare any income that you and your partner receive jointly, such as rental income, business income, dividends, royalties, trust distributions or investment income.">
              Shared Income
            </PartHeader>
            <div className="mb-4">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                Do you and your partner receive any income jointly, such as rental income, business income,
                dividends, trust distributions, royalties or investment income?
              </label>
              <YesNoToggle name="has_shared_income" value={hasSharedIncome} onChange={handleToggle} />
            </div>

            {hasSharedIncome === "Yes" && (
              <MatrixBox
                title="Shared Income Sources"
                onAdd={() => setSharedIncomeRows((prev) => [...prev, makeSharedIncomeRow()])}
                addLabel="Add Shared Income Source"
              >
                {sharedIncomeRows.map((row) => (
                  <RowItem key={row.id} onDelete={() => removeRow(setSharedIncomeRows, row.id)}>
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                      <input
                        type="text"
                        placeholder="Income Description (e.g. Rental Income, Dividends, Business Income)"
                        value={row.description}
                        onChange={(e) => updateRow(setSharedIncomeRows, row.id, { description: e.target.value })}
                        required
                        className={inputClasses}
                      />
                      <input
                        type="text"
                        placeholder="Income Source (e.g. Company X, ABC Property Management, XYZ Trust)"
                        value={row.source}
                        onChange={(e) => updateRow(setSharedIncomeRows, row.id, { source: e.target.value })}
                        required
                        className={inputClasses}
                      />
                      <input
                        type="number"
                        placeholder="Annual Income (£)"
                        value={row.annualIncome}
                        onChange={(e) => updateRow(setSharedIncomeRows, row.id, { annualIncome: e.target.value })}
                        required
                        className={inputClasses}
                      />
                    </div>
                    <TreatmentSelect
                      id={row.id}
                      fields={row}
                      onChange={(f) => updateRow(setSharedIncomeRows, row.id, f)}
                      options={sharedTreatmentOptions}
                    />
                  </RowItem>
                ))}
              </MatrixBox>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                className="mt-8 rounded-[10px] bg-indigo-600 px-10 py-3.5 font-semibold text-white shadow-[0_4px_12px_rgba(79,70,229,0.2)] transition hover:bg-indigo-700"
              >
                Next: Shared Liabilities & Outstanding Debts
              </button>
            </div>
          </form>

          {submitted && <p className="mt-4 text-right text-sm text-emerald-600">Saved. Ready for Section 4c.</p>}
        </div>
      </div>
    </div>
  );
}