"use client";

import React from "react";
import {
  FieldLabel,
  MatrixBox,
  PartHeader,
  RowItem,
  TreatmentSelect,
  YesNoToggle,
  emptyTreatment,
  inputClasses,
  makeId,
} from "../QuestionnaireUI";
import type { Treatment, TreatmentFields, YesNo } from "@/types/forms/form-primitives";
import type { IncomeData, IncomeRow, Props, RowsKey } from "@/types/questionnaire/income-fields";

export const initialIncome: IncomeData = {
  grossAnnualIncome: "",
  salaryTreatment: emptyTreatment,
  hasPrimaryBonus: "No",
  primaryIncomeRows: [],
  hasAlternativeIncome: "No",
  altIncomeRows: [],
};

// Maps the API section into form state (same defaults the forms always used)
export function toIncome(raw: any): IncomeData {
  if (!raw) return initialIncome;
  return {
    grossAnnualIncome: raw.grossAnnualIncome ?? "",
    salaryTreatment: raw.salaryTreatment ?? emptyTreatment,
    hasPrimaryBonus: raw.hasPrimaryBonus ?? "No",
    primaryIncomeRows: Array.isArray(raw.primaryIncomeRows) ? raw.primaryIncomeRows : [],
    hasAlternativeIncome: raw.hasAlternativeIncome ?? "No",
    altIncomeRows: Array.isArray(raw.altIncomeRows) ? raw.altIncomeRows : [],
  };
}

const makeIncomeRow = (): IncomeRow => ({
  id: makeId("row"),
  description: "",
  amount: "",
  ...emptyTreatment,
});

const SALARY_TREATMENT_OPTIONS: { value: Treatment; label: string }[] = [
  { value: "KeepSeparate", label: "Keep it Separate" },
  { value: "ShareEqually", label: "Share Equally (50/50)" },
  { value: "Percentage", label: "Share by Percentage" },
  { value: "Custom", label: "Custom Arrangement" },
];

export function IncomeFields({ data, onChange, readOnly }: Props) {
  const ask = (you: string, they: string) => (readOnly ? they : you);
  const set = (patch: Partial<IncomeData>) => onChange?.((prev) => ({ ...prev, ...patch }));

  // "Yes" adds a first row, "No" clears the list
  const toggle = (flag: "hasPrimaryBonus" | "hasAlternativeIncome", key: RowsKey) => (value: YesNo) =>
    onChange?.((prev) => ({
      ...prev,
      [flag]: value,
      [key]: value === "Yes" ? (prev[key].length ? prev[key] : [makeIncomeRow()]) : [],
    }));

  const updateRow = (key: RowsKey, id: string, patch: Partial<IncomeRow>) =>
    set({ [key]: data[key].map((r) => (r.id === id ? { ...r, ...patch } : r)) });

  const renderRows = (
    key: RowsKey,
    title: string,
    addLabel: string,
    descriptionPlaceholder: string,
    amountPlaceholder: string,
  ) => (
    <MatrixBox
      title={title}
      onAdd={readOnly ? undefined : () => set({ [key]: [...data[key], makeIncomeRow()] })}
      addLabel={addLabel}
    >
      {data[key].map((row) => (
        <RowItem
          key={row.id}
          onDelete={readOnly ? undefined : () => set({ [key]: data[key].filter((r) => r.id !== row.id) })}
        >
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <input
              type="text"
              placeholder={descriptionPlaceholder}
              value={row.description}
              onChange={(e) => updateRow(key, row.id, { description: e.target.value })}
              disabled={readOnly}
              className={inputClasses}
            />
            <input
              type="number"
              placeholder={amountPlaceholder}
              value={row.amount}
              onChange={(e) => updateRow(key, row.id, { amount: e.target.value })}
              disabled={readOnly}
              className={inputClasses}
            />
          </div>
          <TreatmentSelect
            id={row.id}
            fields={row}
            onChange={(f) => updateRow(key, row.id, f)}
            readOnly={readOnly}
          />
        </RowItem>
      ))}
    </MatrixBox>
  );

  return (
    <>
      <PartHeader tooltip="Annual salary or wages before tax. Bonuses, commissions, dividends, rental and other income are collected separately below.">
        Employment Income
      </PartHeader>
      <div className="mb-6">
        <FieldLabel htmlFor="grossAnnualIncome">
          {ask(
            "What is your current annual gross employment income (before tax)?",
            "Current annual gross employment income (before tax)",
          )}
        </FieldLabel>
        <input
          id="grossAnnualIncome"
          type="number"
          min={0}
          placeholder="£ Amount in GBP"
          value={data.grossAnnualIncome}
          onChange={(e) => set({ grossAnnualIncome: e.target.value })}
          disabled={readOnly}
          className={inputClasses}
        />
      </div>

      <div className="mb-6">
        <FieldLabel>
          {ask(
            "How would you like your employment income to be treated under this agreement?",
            "How their employment income should be treated under this agreement",
          )}
        </FieldLabel>
        <TreatmentSelect
          id="salary"
          fields={data.salaryTreatment}
          onChange={(f) => set({ salaryTreatment: f })}
          options={SALARY_TREATMENT_OPTIONS}
          readOnly={readOnly}
        />
      </div>

      <PartHeader tooltip="Variable items like bonuses, regular overtime, commissions, or corporate incentives.">
        Bonuses &amp; Employment Incentives
      </PartHeader>
      <FieldLabel>
        {ask(
          "Apart from your base salary, do you regularly receive bonuses, commissions, share options, share awards (RSUs), profit-sharing payments, or other employment incentives?",
          "Apart from base salary, do they regularly receive bonuses, commissions, share options, share awards (RSUs), profit-sharing payments, or other employment incentives?",
        )}
      </FieldLabel>
      <YesNoToggle
        name="has_primary_bonus"
        value={data.hasPrimaryBonus}
        onChange={toggle("hasPrimaryBonus", "primaryIncomeRows")}
        readOnly={readOnly}
      />
      {data.hasPrimaryBonus === "Yes" &&
        renderRows(
          "primaryIncomeRows",
          "Bonus & incentive income",
          "Add variable income",
          "Description (e.g. Annual Bonus)",
          "Estimated annual amount (£)",
        )}

      <PartHeader tooltip="Recurring income paid individually from investments, trust dividends, or property yields.">
        Alternative Income Streams
      </PartHeader>
      <FieldLabel>
        {ask(
          "Do you personally receive income from sources other than your employment, such as rental property income, dividends, trust distributions, business income, royalties, maintenance payments, pension income, or other investment income?",
          "Do they personally receive income from sources other than employment, such as rental property income, dividends, trust distributions, business income, royalties, maintenance payments, pension income, or other investment income?",
        )}
      </FieldLabel>
      <YesNoToggle
        name="has_alternative_income"
        value={data.hasAlternativeIncome}
        onChange={toggle("hasAlternativeIncome", "altIncomeRows")}
        readOnly={readOnly}
      />
      {data.hasAlternativeIncome === "Yes" &&
        renderRows(
          "altIncomeRows",
          "Alternative income sources",
          "Add income source",
          "Source name (e.g. Dividend, Rental Yield)",
          "Annual income (£)",
        )}
    </>
  );
}
