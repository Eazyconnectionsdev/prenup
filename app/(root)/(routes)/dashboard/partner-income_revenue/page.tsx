"use client";
import React, { useState, useEffect, ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Axios from "@/lib/ApiConfig";

type YesNo = "Yes" | "No";

type Treatment =
  | ""
  | "KeepSeparate"
  | "ShareEqually"
  | "Contribution"
  | "Percentage"
  | "Custom";

interface TreatmentFields {
  treatment: Treatment;
  contributionText: string;
  percentageValue: string;
  customText: string;
}

const emptyTreatment: TreatmentFields = {
  treatment: "",
  contributionText: "",
  percentageValue: "",
  customText: "",
};

/* ---------------------------------------------------------------------- */
/* Row types                                                                */
/* ---------------------------------------------------------------------- */

interface IncomeRow extends TreatmentFields {
  id: string;
  description: string;
  amount: string;
}

/* ---------------------------------------------------------------------- */
/* Shared styling helpers                                                  */
/* ---------------------------------------------------------------------- */

const inputClasses =
  "w-full rounded-[10px] border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-[0.925rem] text-slate-900 disabled:cursor-not-allowed disabled:opacity-70";

const textareaClasses = inputClasses + " min-h-[70px] resize-none";

/* ---------------------------------------------------------------------- */
/* Reusable read-only field components                                     */
/* ---------------------------------------------------------------------- */

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

function PartHeader({ children, tooltip }: { children: ReactNode; tooltip?: string }) {
  return (
    <div className="mb-4 mt-8 flex items-center gap-2 text-[1.15rem] font-bold text-slate-800">
      {children}
      {tooltip && <Tooltip text={tooltip} />}
    </div>
  );
}

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
  options,
}: {
  id: string;
  fields: TreatmentFields;
  label?: string;
  options: { value: Treatment; label: string }[];
}) {
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
          <textarea value={fields.customText} disabled className={textareaClasses} />
        </div>
      )}
    </div>
  );
}

const allTreatmentOptions: { value: Treatment; label: string }[] = [
  { value: "KeepSeparate", label: "Keep it Separate" },
  { value: "ShareEqually", label: "Share Equally (50/50)" },
  { value: "Contribution", label: "Split by Contribution" },
  { value: "Percentage", label: "Share by Percentage" },
  { value: "Custom", label: "Custom Arrangement" },
];

/* ---------------------------------------------------------------------- */
/* Main component                                                          */
/* ---------------------------------------------------------------------- */

export default function PartnerIncomeRevenueView() {
  const user = useSelector((state: RootState) => state.auth.user);
  const caseId = useSelector((state: RootState) => state.auth.caseId);

  const [grossAnnualIncome, setGrossAnnualIncome] = useState("");
  const [salaryTreatment, setSalaryTreatment] = useState<TreatmentFields>(emptyTreatment);

  const [hasPrimaryBonus, setHasPrimaryBonus] = useState<YesNo>("No");
  const [primaryIncomeRows, setPrimaryIncomeRows] = useState<IncomeRow[]>([]);

  const [hasAlternativeIncome, setHasAlternativeIncome] = useState<YesNo>("No");
  const [altIncomeRows, setAltIncomeRows] = useState<IncomeRow[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { data },
        } = await Axios.get(
          `/cases/${caseId}/section/${user.endUserType === "user1" ? "partnerInformation" : "myInformation"}`
        );

        const income = data?.incomeAndRevenue;
        if (!income) return;

        setGrossAnnualIncome(income.grossAnnualIncome ?? "");
        setSalaryTreatment(income.salaryTreatment ?? emptyTreatment);

        setHasPrimaryBonus(income.hasPrimaryBonus ?? "No");
        setPrimaryIncomeRows(
          Array.isArray(income.primaryIncomeRows) ? income.primaryIncomeRows : []
        );

        setHasAlternativeIncome(income.hasAlternativeIncome ?? "No");
        setAltIncomeRows(
          Array.isArray(income.altIncomeRows) ? income.altIncomeRows : []
        );
      } catch (error) {
        console.error("Error fetching income & revenue:", error);
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

  const renderIncomeSection = (
    title: string,
    rows: IncomeRow[],
    descriptionPlaceholder: string,
    amountPlaceholder: string,
  ) => (
    <MatrixBoxView title={title}>
      {rows.map((row) => (
        <RowItemView key={row.id}>
          <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <input type="text" placeholder={descriptionPlaceholder} value={row.description} disabled className={inputClasses} />
            <input type="number" placeholder={amountPlaceholder} value={row.amount} disabled className={inputClasses} />
          </div>
          <TreatmentSelectView id={row.id} fields={row} options={allTreatmentOptions} />
        </RowItemView>
      ))}
    </MatrixBoxView>
  );

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
            Partner's Income & Revenue
          </h2>
          <p className="mb-8 text-[0.95rem] leading-relaxed text-slate-500">
            This is a read-only view of the income and revenue your partner has declared.
          </p>

          <div>
            {/* EMPLOYMENT INCOME */}
            <PartHeader tooltip="Annual salary or wages before tax. Excludes bonuses, commissions, dividends, rental income or other income sources, which are shown separately below.">
              Employment Income
            </PartHeader>
            <div className="mb-6">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                Current annual gross employment income (before tax)
              </label>
              <input
                type="number"
                placeholder="£ Amount in GBP"
                value={grossAnnualIncome}
                disabled
                className={inputClasses}
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                How employment income should be treated under this agreement
              </label>
              <TreatmentSelectView
                id="salary"
                fields={salaryTreatment}
                options={[
                  { value: "KeepSeparate", label: "Keep it Separate" },
                  { value: "ShareEqually", label: "Share Equally (50/50)" },
                  { value: "Percentage", label: "Share by Percentage" },
                  { value: "Custom", label: "Custom Arrangement" },
                ]}
              />
            </div>

            {/* BONUSES & INCENTIVES */}
            <PartHeader tooltip="Variable performance items like bonuses, regular overtime commissions, or corporate incentives.">
              Bonuses & Employment Incentives
            </PartHeader>
            <div className="mb-4">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                Do they regularly receive bonuses, commissions, share options, share awards (RSUs), profit-sharing payments, or other employment incentives (apart from base salary)?
              </label>
              <YesNoToggleView value={hasPrimaryBonus} />
            </div>
            {hasPrimaryBonus === "Yes" &&
              renderIncomeSection(
                "Bonus & Incentive Income",
                primaryIncomeRows,
                "Description (e.g. Annual Bonus)",
                "Estimated Annual Amount (£)",
              )}

            {/* ALTERNATIVE INCOME STREAMS */}
            <PartHeader tooltip="Recurring revenue paid to them individually from investments, trust dividends, or property yields.">
              Alternative Income Streams
            </PartHeader>
            <div className="mb-4">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                Do they personally receive income from sources other than employment, such as rental property income, dividend payments, trust distributions, business income, royalties, maintenance payments (spousal or child), pension income, or other investment income?
              </label>
              <YesNoToggleView value={hasAlternativeIncome} />
            </div>
            {hasAlternativeIncome === "Yes" &&
              renderIncomeSection(
                "Alternative Income Sources",
                altIncomeRows,
                "Source Name (e.g. Dividend, Rental Yield)",
                "Annual Income (£)",
              )}
          </div>
        </div>
      </div>
    </div>
  );
}