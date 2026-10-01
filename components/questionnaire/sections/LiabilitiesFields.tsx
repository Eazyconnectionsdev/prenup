"use client";

import React from "react";
import {
  FieldLabel,
  MatrixBox,
  Notice,
  PartHeader,
  RowItem,
  TreatmentSelect,
  YesNoToggle,
  emptyTreatment,
  inputClasses,
  makeId,
} from "../QuestionnaireUI";
import type { TreatmentFields, YesNo } from "@/types/forms/form-primitives";
import type { DebtRow, LiabilitiesData, MaintenanceRow, Props } from "@/types/questionnaire/liabilities-fields";

export const initialLiabilities: LiabilitiesData = {
  hasDebts: "No",
  debts: [],
  hasMaintenance: "No",
  maintenance: [],
};

// Maps the API section into form state (same defaults the forms always used)
export function toLiabilities(raw: any): LiabilitiesData {
  if (!raw) return initialLiabilities;
  return {
    hasDebts: raw.hasDebts ?? "No",
    debts: Array.isArray(raw.debts) ? raw.debts : [],
    hasMaintenance: raw.hasMaintenance ?? "No",
    maintenance: Array.isArray(raw.maintenance) ? raw.maintenance : [],
  };
}

const makeDebtRow = (): DebtRow => ({
  id: makeId("debt"),
  lenderName: "",
  debtType: "",
  outstandingBalance: "",
  ...emptyTreatment,
});

const makeMaintenanceRow = (): MaintenanceRow => ({
  id: makeId("maint"),
  dependentLink: "",
  monthlyPayment: "",
  projectedEndDate: "",
  ...emptyTreatment,
});

const DEBT_TYPES = [
  { value: "Credit Card", label: "Credit Card Balance" },
  { value: "Personal Loan", label: "Personal Loan" },
  { value: "Student Loan", label: "Student Loan" },
  { value: "Overdraft", label: "Overdraft" },
  { value: "Car Finance", label: "Car Finance / Vehicle Loan" },
  { value: "Tax Liability", label: "Tax Liability" },
  { value: "Other", label: "Other Liability" },
];

const DEPENDENT_LINKS = [
  { value: "Child Support", label: "Child Support Commitment" },
  { value: "Spousal Maintenance", label: "Former Spouse Maintenance" },
  { value: "Other Dependent", label: "Other Dependent Liability" },
];

export function LiabilitiesFields({ data, onChange, readOnly }: Props) {
  const ask = (you: string, they: string) => (readOnly ? they : you);
  const set = (patch: Partial<LiabilitiesData>) => onChange?.((prev) => ({ ...prev, ...patch }));

  // "Yes" adds a first row, "No" clears the list
  const toggle = <K extends "debts" | "maintenance">(
    flag: "hasDebts" | "hasMaintenance",
    key: K,
    makeRow: () => LiabilitiesData[K][number],
  ) => (value: YesNo) =>
    onChange?.((prev) => ({
      ...prev,
      [flag]: value,
      [key]: value === "Yes" ? (prev[key].length ? prev[key] : [makeRow()]) : [],
    }));

  const updateDebt = (id: string, patch: Partial<DebtRow>) =>
    set({ debts: data.debts.map((r) => (r.id === id ? { ...r, ...patch } : r)) });
  const updateMaintenance = (id: string, patch: Partial<MaintenanceRow>) =>
    set({ maintenance: data.maintenance.map((r) => (r.id === id ? { ...r, ...patch } : r)) });

  return (
    <>
      <PartHeader tooltip="Loans, outstanding credit cards, or lines of credit held solely in this person's name.">
        Personal Debts &amp; Loans
      </PartHeader>
      <FieldLabel>
        {ask(
          "Do you currently have any personal debts or financial obligations, such as loans, credit cards, overdrafts or other money that you owe?",
          "Do they currently have any personal debts or financial obligations, such as loans, credit cards, overdrafts or other money owed?",
        )}
      </FieldLabel>
      <YesNoToggle
        name="has_debts"
        value={data.hasDebts}
        onChange={toggle("hasDebts", "debts", makeDebtRow)}
        readOnly={readOnly}
      />
      {data.hasDebts === "Yes" && (
        <MatrixBox
          title="Debts & financial obligations"
          onAdd={readOnly ? undefined : () => set({ debts: [...data.debts, makeDebtRow()] })}
          addLabel="Add debt"
        >
          {data.debts.map((row) => (
            <RowItem
              key={row.id}
              onDelete={readOnly ? undefined : () => set({ debts: data.debts.filter((r) => r.id !== row.id) })}
            >
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-[1.5fr_1fr_1fr]">
                <input
                  type="text"
                  placeholder="Lender / creditor name"
                  value={row.lenderName}
                  onChange={(e) => updateDebt(row.id, { lenderName: e.target.value })}
                  disabled={readOnly}
                  className={inputClasses}
                />
                <select
                  value={row.debtType}
                  onChange={(e) => updateDebt(row.id, { debtType: e.target.value })}
                  disabled={readOnly}
                  className={inputClasses}
                >
                  <option value="">Type of debt</option>
                  {DEBT_TYPES.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  placeholder="Outstanding balance (£)"
                  value={row.outstandingBalance}
                  onChange={(e) => updateDebt(row.id, { outstandingBalance: e.target.value })}
                  disabled={readOnly}
                  className={inputClasses}
                />
              </div>
              <TreatmentSelect
                id={row.id}
                fields={row}
                onChange={(f) => updateDebt(row.id, f)}
                label="How should this be settled?"
                readOnly={readOnly}
              />
            </RowItem>
          ))}
        </MatrixBox>
      )}

      <PartHeader tooltip="Payments required by a court order, the Child Maintenance Service (CMS), or a legally binding agreement.">
        Maintenance &amp; Support Payments
      </PartHeader>
      <Notice>
        Ongoing child maintenance or spousal maintenance payments reduce available income and should
        be considered when preparing a fair and accurate prenuptial agreement.
      </Notice>
      <div className="mt-5">
        <FieldLabel>
          {ask(
            "Are you currently required to make regular child maintenance or spousal maintenance payments?",
            "Are they currently required to make regular child maintenance or spousal maintenance payments?",
          )}
        </FieldLabel>
        <YesNoToggle
          name="has_maintenance"
          value={data.hasMaintenance}
          onChange={toggle("hasMaintenance", "maintenance", makeMaintenanceRow)}
          readOnly={readOnly}
        />
      </div>
      {data.hasMaintenance === "Yes" && (
        <MatrixBox
          title="Maintenance & support payments"
          onAdd={
            readOnly ? undefined : () => set({ maintenance: [...data.maintenance, makeMaintenanceRow()] })
          }
          addLabel="Add maintenance payment"
        >
          {data.maintenance.map((row) => (
            <RowItem
              key={row.id}
              onDelete={
                readOnly
                  ? undefined
                  : () => set({ maintenance: data.maintenance.filter((r) => r.id !== row.id) })
              }
            >
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-[1.5fr_1fr_1fr]">
                <select
                  value={row.dependentLink}
                  onChange={(e) => updateMaintenance(row.id, { dependentLink: e.target.value })}
                  disabled={readOnly}
                  className={inputClasses}
                >
                  <option value="">Link to dependent</option>
                  {DEPENDENT_LINKS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  placeholder="Monthly payment (£)"
                  value={row.monthlyPayment}
                  onChange={(e) => updateMaintenance(row.id, { monthlyPayment: e.target.value })}
                  disabled={readOnly}
                  className={inputClasses}
                />
                <input
                  type="text"
                  placeholder="Projected end date (e.g., age 18)"
                  value={row.projectedEndDate}
                  onChange={(e) => updateMaintenance(row.id, { projectedEndDate: e.target.value })}
                  disabled={readOnly}
                  className={inputClasses}
                />
              </div>
              <TreatmentSelect
                id={row.id}
                fields={row}
                onChange={(f) => updateMaintenance(row.id, f)}
                label="How should this be settled?"
                readOnly={readOnly}
              />
            </RowItem>
          ))}
        </MatrixBox>
      )}
    </>
  );
}
