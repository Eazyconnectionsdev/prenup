"use client"

import React, { useState, useEffect, ReactNode } from "react";
import {
  YesNo,
  TreatmentFields,
  inputClasses,
  PartHeader,
  SysBanner,
  Treatment,
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

/* ---------------------------------------------------------------------- */
/* Read-only view components                                               */
/* ---------------------------------------------------------------------- */

function YesNoToggleView({ value }: { value: YesNo }) {
  return (
    <div className="mb-3 grid grid-cols-2 gap-3">
      {(["Yes", "No"] as YesNo[]).map((opt) => {
        const checked = value === opt;
        return (
          <div
            key={opt}
            className={`relative flex items-center gap-3 rounded-[10px] border px-4 py-3 ${
              checked ? "border-indigo-600 bg-slate-50" : "border-slate-300 bg-slate-50"
            }`}
          >
            <span
              className={`relative h-4 w-4 flex-shrink-0 rounded-full border-2 ${
                checked ? "border-indigo-600 bg-indigo-600" : "border-slate-300 bg-white"
              }`}
            >
              {checked && (
                <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
              )}
            </span>
            <span className={`text-[0.9rem] font-semibold ${checked ? "text-indigo-600" : "text-slate-900"}`}>
              {opt}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function MatrixBoxView({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-6 rounded-2xl border border-slate-300 bg-slate-50 p-6">
      <div className="mb-4 text-[0.85rem] font-bold uppercase tracking-wide text-slate-500">{title}</div>
      {children}
    </div>
  );
}

function RowItemView({ children }: { children: ReactNode }) {
  return (
    <div className="relative mb-5 rounded-[10px] border border-slate-300 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
      {children}
    </div>
  );
}

function TreatmentSelectView({
  id,
  fields,
  label = "How should this be shared?",
}: {
  id: string;
  fields: TreatmentFields;
  label?: string;
}) {
  const options: { value: Treatment; label: string }[] = [
    { value: "KeepSeparate", label: "Keep it Separate" },
    { value: "ShareEqually", label: "Share Equally (50/50)" },
    { value: "Contribution", label: "Split by Contribution" },
    { value: "Percentage", label: "Share by Percentage" },
    { value: "Custom", label: "Custom Arrangement" },
  ];

  return (
    <div className="mt-3">
      <select id={`treatment_${id}`} value={fields.treatment} disabled className={inputClasses}>
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {fields.treatment === "Contribution" && (
        <div className="mt-3 rounded-r-[10px] border-l-4 border-indigo-600 bg-slate-50 p-4">
          <label className="mb-1.5 block text-[0.9rem] font-semibold text-slate-800">
            Define contribution (e.g., salary, initial deposit):
          </label>
          <input type="text" value={fields.contributionText} disabled className={inputClasses} />
        </div>
      )}
      {fields.treatment === "Percentage" && (
        <div className="mt-3 rounded-r-[10px] border-l-4 border-indigo-600 bg-slate-50 p-4">
          <label className="mb-1.5 block text-[0.9rem] font-semibold text-slate-800">
            Specify percentage (e.g., 60/40):
          </label>
          <input type="number" value={fields.percentageValue} disabled className={inputClasses} />
        </div>
      )}
      {fields.treatment === "Custom" && (
        <div className="mt-3 rounded-r-[10px] border-l-4 border-indigo-600 bg-slate-50 p-4">
          <label className="mb-1.5 block text-[0.9rem] font-semibold text-slate-800">
            Custom Arrangement Details:
          </label>
          <textarea value={fields.customText} disabled className={inputClasses + " min-h-[70px] resize-none"} />
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Main component                                                          */
/* ---------------------------------------------------------------------- */

export default function PartnerLiabilitiesView() {
  const user = useSelector((state: RootState) => state.auth.user);
  const caseId = useSelector((state: RootState) => state.auth.caseId);

  const [hasDebts, setHasDebts] = useState<YesNo>("No");
  const [debts, setDebts] = useState<DebtRow[]>([]);

  const [hasMaintenance, setHasMaintenance] = useState<YesNo>("No");
  const [maintenance, setMaintenance] = useState<MaintenanceRow[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { data },
        } = await Axios.get(
          `/cases/${caseId}/section/${user.endUserType === "user1" ? "partnerInformation" : "myInformation"}`
        );

        const liabilities = data?.liabilitiesAndDebts;
        if (!liabilities) return;

        setHasDebts(liabilities.hasDebts ?? "No");
        setDebts(Array.isArray(liabilities.debts) ? liabilities.debts : []);

        setHasMaintenance(liabilities.hasMaintenance ?? "No");
        setMaintenance(
          Array.isArray(liabilities.maintenance) ? liabilities.maintenance : []
        );
      } catch (error) {
        console.error("Error fetching liabilities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (caseId) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [caseId, user?.endUserType]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-sm font-medium text-slate-500">Loading your information...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-5 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-white p-11 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08)]">
          <h2 className="mb-2 text-[1.45rem] font-extrabold tracking-tight text-slate-900">
            Partner's Personal Liabilities
          </h2>
          <p className="mb-8 text-[0.95rem] leading-relaxed text-slate-500">
            This is a read-only view of the debts and financial obligations your partner has declared.
          </p>

          <div>
            {/* PERSONAL DEBTS & LOANS */}
            <PartHeader tooltip="Individual loans, outstanding credit cards, or lines of credit held solely in their name.">
              Personal Debts & Loans
            </PartHeader>
            <div className="mb-4">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                Do they currently have any personal debts or financial obligations, such as loans, credit cards, overdrafts or other money owed?
              </label>
              <YesNoToggleView value={hasDebts} />
            </div>
            {hasDebts === "Yes" && (
              <MatrixBoxView title="Their Debts & Financial Obligations">
                {debts.map((row) => (
                  <RowItemView key={row.id}>
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-[1.5fr_1fr_1fr]">
                      <input type="text" placeholder="Lender / Creditor Name" value={row.lenderName} disabled className={inputClasses} />
                      <select value={row.debtType} disabled className={inputClasses}>
                        <option value="">Type of Debt</option>
                        <option value="Credit Card">Credit Card Balance</option>
                        <option value="Personal Loan">Personal Loan</option>
                        <option value="Student Loan">Student Loan</option>
                        <option value="Overdraft">Overdraft</option>
                        <option value="Car Finance">Car Finance / Vehicle Loan</option>
                        <option value="Tax Liability">Tax Liability</option>
                        <option value="Other">Other Liability</option>
                      </select>
                      <input type="number" placeholder="Outstanding Balance (£)" value={row.outstandingBalance} disabled className={inputClasses} />
                    </div>
                    <TreatmentSelectView id={row.id} fields={row} label="How should this be Settled?" />
                  </RowItemView>
                ))}
              </MatrixBoxView>
            )}

            {/* MAINTENANCE & SUPPORT PAYMENTS */}
            <PartHeader tooltip="Payments required by a court order, the Child Maintenance Service (CMS), or a legally binding agreement.">
              Maintenance & Support Payments
            </PartHeader>

            <SysBanner>
              Ongoing child maintenance or spousal maintenance payments reduce available income and are considered
              when preparing a fair and accurate prenuptial agreement.
            </SysBanner>

            <div className="mb-4">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                Are they currently required to make regular child maintenance or spousal maintenance payments?
              </label>
              <YesNoToggleView value={hasMaintenance} />
            </div>
            {hasMaintenance === "Yes" && (
              <MatrixBoxView title="Maintenance & Support Payments">
                {maintenance.map((row) => (
                  <RowItemView key={row.id}>
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-[1.5fr_1fr_1fr]">
                      <select value={row.dependentLink} disabled className={inputClasses}>
                        <option value="">Link to Dependent</option>
                        <option value="Child Support">Child Support Commitment</option>
                        <option value="Spousal Maintenance">Former Spouse Maintenance</option>
                        <option value="Other Dependent">Other Dependent Liability</option>
                      </select>
                      <input type="number" placeholder="Monthly Payment (£)" value={row.monthlyPayment} disabled className={inputClasses} />
                      <input type="text" placeholder="Projected End Date (e.g., Age 18)" value={row.projectedEndDate} disabled className={inputClasses} />
                    </div>
                    <TreatmentSelectView id={row.id} fields={row} label="How should this be Settled?" />
                  </RowItemView>
                ))}
              </MatrixBoxView>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}