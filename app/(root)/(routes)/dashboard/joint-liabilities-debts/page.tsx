"use client"

import React, { useState, useEffect } from "react";
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
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Axios from "@/lib/ApiConfig";

const sharedTreatmentOptions: { value: Treatment; label: string }[] = [
  { value: "ShareEqually", label: "Share Equally (50/50)" },
  { value: "Contribution", label: "Split by Contribution" },
  { value: "Percentage", label: "Share by Percentage" },
  { value: "Custom", label: "Custom Arrangement" },
];

interface SharedDebtRow extends TreatmentFields {
  id: string;
  lenderName: string;
  liabilityType: string;
  outstandingBalance: string;
}

function makeSharedDebtRow(): SharedDebtRow {
  return { id: makeId("sdebt"), lenderName: "", liabilityType: "", outstandingBalance: "", ...emptyTreatment };
}

interface SharedLiabilitiesFormProps {
  onContinue?: () => void;
}

export default function SharedLiabilitiesForm({ onContinue }: SharedLiabilitiesFormProps = {}) {
  const user = useSelector((state: RootState) => state.auth.user);
  const caseId = useSelector((state: RootState) => state.auth.caseId);
  const isOwner = user?.endUserType === "user1";

  const [hasSharedDebts, setHasSharedDebts] = useState<YesNo>("No");
  const [sharedDebts, setSharedDebts] = useState<SharedDebtRow[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isApproving, setIsApproving] = useState(false);
  const [approved, setApproved] = useState(false);
  const [approveError, setApproveError] = useState("");

  const handleToggle = makeToggleHandler(setHasSharedDebts, setSharedDebts, makeSharedDebtRow);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      hasSharedDebts,
      sharedDebts,
    };

    try {
      const { data } = await Axios.post(
        `/cases/${caseId}/questionnaire/joint-liabilities-and-debts`,
        payload
      );

      setSubmitted(true);
      onContinue?.();
    } catch (error) {
      console.error("Error saving shared liabilities:", error);
    }
  };

  const handleApprove = async () => {
    setIsApproving(true);
    setApproveError("");
    try {
      await Axios.post(`/cases/${caseId}/approve-and-generate`);
      setApproved(true);
    } catch (error) {
      console.error("Error approving agreement:", error);
      setApproveError("Something went wrong while approving. Please try again.");
    } finally {
      setIsApproving(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { data },
        } = await Axios.get(`/cases/${caseId}/section/jointInformation`);

        const jointLiabilities = data?.jointLiabilitiesAndDebts;
        if (!jointLiabilities) return;

        setHasSharedDebts(jointLiabilities.hasSharedDebts ?? "No");
        setSharedDebts(
          Array.isArray(jointLiabilities.sharedDebts) ? jointLiabilities.sharedDebts : []
        );
      } catch (error) {
        console.error("Error fetching shared liabilities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (caseId) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [caseId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-sm font-medium text-slate-500">Loading your information...</p>
      </div>
    );
  }

  const formBody = (
    <>
      <PartHeader tooltip="Declare any liabilities that you and your partner hold jointly, including mortgages, loans, credit cards or other shared financial obligations.">
        Shared Financial Obligations
      </PartHeader>
      <div className="mb-4">
        <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
          Do you and your partner jointly hold any liabilities, including mortgages, loans, credit cards,
          finance agreements or other financial obligations?
        </label>
        <YesNoToggle name="has_shared_debts" value={hasSharedDebts} onChange={handleToggle} />
      </div>

      {hasSharedDebts === "Yes" && (
        <MatrixBox
          title="Shared Liabilities Register"
          onAdd={() => setSharedDebts((prev) => [...prev, makeSharedDebtRow()])}
          addLabel="Add Shared Liability"
        >
          {sharedDebts.map((row) => (
            <RowItem key={row.id} onDelete={() => removeRow(setSharedDebts, row.id)}>
              <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-[1.5fr_1fr_1fr]">
                <input
                  type="text"
                  placeholder="Lender / Creditor Name"
                  value={row.lenderName}
                  onChange={(e) => updateRow(setSharedDebts, row.id, { lenderName: e.target.value })}
                  required
                  className={inputClasses}
                />
                <select
                  value={row.liabilityType}
                  onChange={(e) => updateRow(setSharedDebts, row.id, { liabilityType: e.target.value })}
                  required
                  className={inputClasses}
                >
                  <option value="">Type of Liability</option>
                  <option value="Mortgage">Mortgage</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Car Finance">Car Finance</option>
                  <option value="Business Loan">Business Loan</option>
                  <option value="Student Loan">Student Loan</option>
                  <option value="Overdraft">Bank Overdraft</option>
                  <option value="Tax Liability">Tax Liability</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="number"
                  min={1}
                  placeholder="Outstanding Balance (£)"
                  value={row.outstandingBalance}
                  onChange={(e) => updateRow(setSharedDebts, row.id, { outstandingBalance: e.target.value })}
                  required
                  className={inputClasses}
                />
              </div>
              <TreatmentSelect
                id={row.id}
                fields={row}
                onChange={(f) => updateRow(setSharedDebts, row.id, f)}
                label="How should this liability be treated?"
                options={sharedTreatmentOptions}
              />
            </RowItem>
          ))}
        </MatrixBox>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-slate-100 px-5 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-white p-11 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08)]">
          <h2 className="mb-2 text-[1.45rem] font-extrabold tracking-tight text-slate-900">
            Shared Liabilities & Outstanding Debts
          </h2>
          <p className="mb-8 text-[0.95rem] leading-relaxed text-slate-500">
            {isOwner
              ? "Please declare any liabilities, loans or financial obligations that you and your partner hold jointly and specify how they should be treated under your prenuptial agreement."
              : "Your partner has declared the following joint liabilities. Please review and approve to finalize your agreement."}
          </p>

          {isOwner ? (
            <form onSubmit={handleSubmit} noValidate>
              {formBody}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="mt-8 rounded-[10px] bg-indigo-600 px-10 py-3.5 font-semibold text-white shadow-[0_4px_12px_rgba(79,70,229,0.2)] transition hover:bg-indigo-700"
                >
                  Save and send approval
                </button>
              </div>
            </form>
          ) : (
            <div>
              <fieldset disabled className="border-0 p-0 m-0">
                {formBody}
              </fieldset>

              <div className="mt-8 flex flex-col items-end gap-3">
                {approveError && (
                  <p className="text-sm font-medium text-red-500">{approveError}</p>
                )}
                <button
                  type="button"
                  disabled={isApproving || approved}
                  onClick={handleApprove}
                  className={`rounded-[10px] px-10 py-3.5 font-semibold text-white shadow-[0_4px_12px_rgba(79,70,229,0.2)] transition ${
                    approved
                      ? "cursor-not-allowed bg-emerald-600"
                      : "bg-indigo-600 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                  }`}
                >
                  {approved ? "Approved ✓" : isApproving ? "Approving..." : "Approve Agreement"}
                </button>
              </div>
            </div>
          )}

          {submitted && <p className="mt-4 text-right text-sm text-emerald-600">Saved. Ready for the next module.</p>}
        </div>
      </div>
    </div>
  );
}