"use client"

import React, { useState } from "react";
import {
  YesNo,
  TreatmentFields,
  emptyTreatment,
  makeId,
  inputClasses,
  PartHeader,
  SysBanner,
  YesNoToggle,
  MatrixBox,
  RowItem,
  TreatmentSelect,
  makeToggleHandler,
  updateRow,
  removeRow,
} from "@/components/Formprimitives";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Axios from "@/lib/ApiConfig";
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

function makeDebtRow(): DebtRow {
  return { id: makeId("debt"), lenderName: "", debtType: "", outstandingBalance: "", ...emptyTreatment };
}
function makeMaintenanceRow(): MaintenanceRow {
  return { id: makeId("maint"), dependentLink: "", monthlyPayment: "", projectedEndDate: "", ...emptyTreatment };
}

/* ---------------------------------------------------------------------- */
/* Main component                                                          */
/* ---------------------------------------------------------------------- */

interface LiabilitiesFormProps {
  onContinue?: () => void;
}

export default function LiabilitiesForm({ onContinue }: LiabilitiesFormProps = {}) {
  const [hasDebts, setHasDebts] = useState<YesNo>("No");
  const [debts, setDebts] = useState<DebtRow[]>([]);

  const [hasMaintenance, setHasMaintenance] = useState<YesNo>("No");
  const [maintenance, setMaintenance] = useState<MaintenanceRow[]>([]);

  const [submitted, setSubmitted] = useState(false);

  const handleDebtsToggle = makeToggleHandler(setHasDebts, setDebts, makeDebtRow);
  const handleMaintenanceToggle = makeToggleHandler(setHasMaintenance, setMaintenance, makeMaintenanceRow);
  const caseId = useSelector(
    (state: RootState) => state.auth.caseId
  );
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      hasDebts,
      debts,

      hasMaintenance,
      maintenance,
    };

    try {
      const { data } = await Axios.post(
        `/cases/${caseId}/questionnaire/liabilities-and-debts`,
        payload
      );

      console.log("Success:", data);

      setSubmitted(true);

      onContinue?.();

    } catch (error) {
      console.error(
        "Error saving liabilities:",
        error
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-5 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-white p-11 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08)]">
          <h2 className="mb-2 text-[1.45rem] font-extrabold tracking-tight text-slate-900">
            Your Personal Liabilities
          </h2>
          <p className="mb-8 text-[0.95rem] leading-relaxed text-slate-500">
            Please tell us about any debts or financial obligations that you are personally responsible for. Include
            any debts that are jointly signed with another person but remain your responsibility.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* PERSONAL DEBTS & LOANS */}
            <PartHeader tooltip="List individual loans, outstanding credit cards, or lines of credit held solely in your name.">
              Personal Debts & Loans
            </PartHeader>
            <div className="mb-4">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                Do you currently have any personal debts or financial obligations, such as loans, credit cards,
                overdrafts or other money that you owe?
              </label>
              <YesNoToggle name="has_debts" value={hasDebts} onChange={handleDebtsToggle} />
            </div>
            {hasDebts === "Yes" && (
              <MatrixBox
                title="Your Debts & Financial Obligations"
                onAdd={() => setDebts((prev) => [...prev, makeDebtRow()])}
                addLabel="Add Debt"
              >
                {debts.map((row) => (
                  <RowItem key={row.id} onDelete={() => removeRow(setDebts, row.id)}>
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-[1.5fr_1fr_1fr]">
                      <input
                        type="text"
                        placeholder="Lender / Creditor Name"
                        value={row.lenderName}
                        onChange={(e) => updateRow(setDebts, row.id, { lenderName: e.target.value })}
                        required
                        className={inputClasses}
                      />
                      <select
                        value={row.debtType}
                        onChange={(e) => updateRow(setDebts, row.id, { debtType: e.target.value })}
                        required
                        className={inputClasses}
                      >
                        <option value="">Type of Debt</option>
                        <option value="Credit Card">Credit Card Balance</option>
                        <option value="Personal Loan">Personal Loan</option>
                        <option value="Student Loan">Student Loan</option>
                        <option value="Overdraft">Overdraft</option>
                        <option value="Car Finance">Car Finance / Vehicle Loan</option>
                        <option value="Tax Liability">Tax Liability</option>
                        <option value="Other">Other Liability</option>
                      </select>
                      <input
                        type="number"
                        min={1}
                        placeholder="Outstanding Balance (£)"
                        value={row.outstandingBalance}
                        onChange={(e) => updateRow(setDebts, row.id, { outstandingBalance: e.target.value })}
                        required
                        className={inputClasses}
                      />
                    </div>
                    <TreatmentSelect
                      id={row.id}
                      fields={row}
                      onChange={(f) => updateRow(setDebts, row.id, f)}
                      label="How should this be Settled?"
                    />
                  </RowItem>
                ))}
              </MatrixBox>
            )}

            {/* MAINTENANCE & SUPPORT PAYMENTS */}
            <PartHeader tooltip="This includes payments required by a court order, the Child Maintenance Service (CMS), or a legally binding agreement.">
              Maintenance & Support Payments
            </PartHeader>

            <SysBanner>
              Please include any ongoing child maintenance or spousal maintenance payments. These commitments reduce
              your available income and should be considered when preparing a fair and accurate prenuptial
              agreement.
            </SysBanner>

            <div className="mb-4">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                Are you currently required to make regular child maintenance or spousal maintenance payments?
              </label>
              <YesNoToggle name="has_maintenance" value={hasMaintenance} onChange={handleMaintenanceToggle} />
            </div>
            {hasMaintenance === "Yes" && (
              <MatrixBox
                title="Maintenance & Support Payments"
                onAdd={() => setMaintenance((prev) => [...prev, makeMaintenanceRow()])}
                addLabel="Add Maintenance Payment"
              >
                {maintenance.map((row) => (
                  <RowItem key={row.id} onDelete={() => removeRow(setMaintenance, row.id)}>
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-[1.5fr_1fr_1fr]">
                      <select
                        value={row.dependentLink}
                        onChange={(e) => updateRow(setMaintenance, row.id, { dependentLink: e.target.value })}
                        required
                        className={inputClasses}
                      >
                        <option value="">Link to Dependent</option>
                        <option value="Child Support">Child Support Commitment</option>
                        <option value="Spousal Maintenance">Former Spouse Maintenance</option>
                        <option value="Other Dependent">Other Dependent Liability</option>
                      </select>
                      <input
                        type="number"
                        min={1}
                        placeholder="Monthly Payment (£)"
                        value={row.monthlyPayment}
                        onChange={(e) => updateRow(setMaintenance, row.id, { monthlyPayment: e.target.value })}
                        required
                        className={inputClasses}
                      />
                      <input
                        type="text"
                        placeholder="Projected End Date (e.g., Age 18)"
                        value={row.projectedEndDate}
                        onChange={(e) => updateRow(setMaintenance, row.id, { projectedEndDate: e.target.value })}
                        required
                        className={inputClasses}
                      />
                    </div>
                    <TreatmentSelect
                      id={row.id}
                      fields={row}
                      onChange={(f) => updateRow(setMaintenance, row.id, f)}
                      label="How should this be Settled?"
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
                Next: Shared Workspace
              </button>
            </div>
          </form>

          {submitted && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
               Personal liabilities saved successfully.
            </div>
          )}        </div>
      </div>
    </div>
  );
}