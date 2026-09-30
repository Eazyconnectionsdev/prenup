"use client"
import React, { useState, ReactNode } from "react";
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

function makeId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

/* ---------------------------------------------------------------------- */
/* Row types                                                                */
/* ---------------------------------------------------------------------- */

interface IncomeRow extends TreatmentFields {
  id: string;
  description: string;
  amount: string;
}

function makeIncomeRow(): IncomeRow {
  return { id: makeId("row"), description: "", amount: "", ...emptyTreatment };
}

/* ---------------------------------------------------------------------- */
/* Shared styling helpers                                                  */
/* ---------------------------------------------------------------------- */

const inputClasses =
  "w-full rounded-[10px] border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-[0.925rem] text-slate-900 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10";

const textareaClasses = inputClasses + " min-h-[70px] resize-y";

/* ---------------------------------------------------------------------- */
/* Reusable field components                                               */
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

interface YesNoToggleProps {
  name: string;
  value: YesNo;
  onChange: (v: YesNo) => void;
}

function YesNoToggle({ name, value, onChange }: YesNoToggleProps) {
  return (
    <div className="mb-3 grid grid-cols-2 gap-3">
      {(["Yes", "No"] as YesNo[]).map((opt) => {
        const checked = value === opt;
        return (
          <label
            key={opt}
            className={`relative flex cursor-pointer items-center gap-3 rounded-[10px] border px-4 py-3 transition ${checked ? "border-indigo-600 bg-slate-50" : "border-slate-300 bg-slate-50 hover:border-indigo-600 hover:bg-white"
              }`}
          >
            <input
              type="radio"
              name={name}
              value={opt}
              checked={checked}
              onChange={() => onChange(opt)}
              className="sr-only"
            />
            <span
              className={`relative h-4 w-4 flex-shrink-0 rounded-full border-2 ${checked ? "border-indigo-600 bg-indigo-600" : "border-slate-300 bg-white"
                }`}
            >
              {checked && (
                <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
              )}
            </span>
            <span className={`text-[0.9rem] font-semibold ${checked ? "text-indigo-600" : "text-slate-900"}`}>{opt}</span>
          </label>
        );
      })}
    </div>
  );
}

function MatrixBox({ title, children, onAdd, addLabel }: { title: string; children: ReactNode; onAdd: () => void; addLabel: string }) {
  return (
    <div className="mb-6 rounded-2xl border border-slate-300 bg-slate-50 p-6">
      <div className="mb-4 text-[0.85rem] font-bold uppercase tracking-wide text-slate-500">{title}</div>
      {children}
      <button
        type="button"
        onClick={onAdd}
        className="flex w-full items-center justify-center gap-2 rounded-[10px] border-2 border-dashed border-indigo-600 bg-transparent px-5 py-3 text-[0.9rem] font-semibold text-indigo-600 transition hover:border-solid hover:bg-indigo-100"
      >
        + {addLabel}
      </button>
    </div>
  );
}

function RowItem({ children, onDelete }: { children: ReactNode; onDelete: () => void }) {
  return (
    <div className="relative mb-5 rounded-[10px] border border-slate-300 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
      <button
        type="button"
        onClick={onDelete}
        aria-label="Remove item"
        className="absolute right-4 top-4 text-[1.1rem] text-slate-500 transition hover:text-red-500"
      >
        ✕
      </button>
      {children}
    </div>
  );
}

interface TreatmentSelectProps {
  id: string;
  fields: TreatmentFields;
  onChange: (fields: TreatmentFields) => void;
  label?: string;
  options?: { value: Treatment; label: string }[];
}

const allTreatmentOptions: { value: Treatment; label: string }[] = [
  { value: "KeepSeparate", label: "Keep it Separate" },
  { value: "ShareEqually", label: "Share Equally (50/50)" },
  { value: "Contribution", label: "Split by Contribution" },
  { value: "Percentage", label: "Share by Percentage" },
  { value: "Custom", label: "Custom Arrangement" },
];

function TreatmentSelect({ id, fields, onChange, label = "How should this be shared?", options = allTreatmentOptions }: TreatmentSelectProps) {
  return (
    <div className="mt-3">
      <select
        id={`treatment_${id}`}
        value={fields.treatment}
        onChange={(e) => onChange({ ...fields, treatment: e.target.value as Treatment })}
        required
        className={inputClasses}
      >
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
          <input
            type="text"
            value={fields.contributionText}
            onChange={(e) => onChange({ ...fields, contributionText: e.target.value })}
            placeholder="Explain your contribution logic"
            className={inputClasses}
          />
        </div>
      )}
      {fields.treatment === "Percentage" && (
        <div className="mt-3 rounded-r-[10px] border-l-4 border-indigo-600 bg-slate-50 p-4">
          <label className="mb-1.5 block text-[0.9rem] font-semibold text-slate-800">
            Specify percentage (e.g., 60/40):
          </label>
          <input
            type="number"
            min={0}
            max={100}
            value={fields.percentageValue}
            onChange={(e) => onChange({ ...fields, percentageValue: e.target.value })}
            placeholder="Percentage (%)"
            className={inputClasses}
          />
        </div>
      )}
      {fields.treatment === "Custom" && (
        <div className="mt-3 rounded-r-[10px] border-l-4 border-indigo-600 bg-slate-50 p-4">
          <label className="mb-1.5 block text-[0.9rem] font-semibold text-slate-800">
            Custom Arrangement Details:
          </label>
          <textarea
            value={fields.customText}
            onChange={(e) => onChange({ ...fields, customText: e.target.value })}
            placeholder="Create your own arrangement..."
            className={textareaClasses}
          />
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Main component                                                          */
/* ---------------------------------------------------------------------- */

export default function IncomeRevenueForm() {
  const [grossAnnualIncome, setGrossAnnualIncome] = useState("");
  const [salaryTreatment, setSalaryTreatment] = useState<TreatmentFields>(emptyTreatment);

  const [hasPrimaryBonus, setHasPrimaryBonus] = useState<YesNo>("No");
  const [primaryIncomeRows, setPrimaryIncomeRows] = useState<IncomeRow[]>([]);

  const [hasAlternativeIncome, setHasAlternativeIncome] = useState<YesNo>("No");
  const [altIncomeRows, setAltIncomeRows] = useState<IncomeRow[]>([]);

  const [submitted, setSubmitted] = useState(false);

  const caseId = useSelector((state: RootState) => state.auth.caseId);
  function makeToggleHandler(
    setEnabled: React.Dispatch<React.SetStateAction<YesNo>>,
    setRows: React.Dispatch<React.SetStateAction<IncomeRow[]>>
  ) {
    return (value: YesNo) => {
      setEnabled(value);
      if (value === "Yes") {
        setRows((prev) => (prev.length === 0 ? [makeIncomeRow()] : prev));
      } else {
        setRows([]);
      }
    };
  }

  const handlePrimaryBonusToggle = makeToggleHandler(setHasPrimaryBonus, setPrimaryIncomeRows);
  const handleAltIncomeToggle = makeToggleHandler(setHasAlternativeIncome, setAltIncomeRows);

  function updateRow(
    setRows: React.Dispatch<React.SetStateAction<IncomeRow[]>>,
    id: string,
    patch: Partial<IncomeRow>
  ) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function removeRow(setRows: React.Dispatch<React.SetStateAction<IncomeRow[]>>, id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      grossAnnualIncome,

      salaryTreatment,

      hasPrimaryBonus,
      primaryIncomeRows,

      hasAlternativeIncome,
      altIncomeRows,
    };

    try {
      const { data } = await Axios.post(
        `/cases/${caseId}/questionnaire/income-and-revenue`,
        payload
      );

      console.log("Success:", data);

      setSubmitted(true);

      // Move to next section if needed
      // onContinue?.();

    } catch (error) {
      console.error("Error saving income & revenue:", error);
    }
  };

  const renderIncomeSection = (
    title: string,
    addLabel: string,
    rows: IncomeRow[],
    setRows: React.Dispatch<React.SetStateAction<IncomeRow[]>>,
    descriptionPlaceholder: string,
    amountPlaceholder: string
  ) => (
    <MatrixBox
      title={title}
      onAdd={() => setRows((prev) => [...prev, makeIncomeRow()])}
      addLabel={addLabel}
    >
      {rows.map((row) => (
        <RowItem key={row.id} onDelete={() => removeRow(setRows, row.id)}>
          <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <input
              type="text"
              placeholder={descriptionPlaceholder}
              value={row.description}
              onChange={(e) => updateRow(setRows, row.id, { description: e.target.value })}
              required
              className={inputClasses}
            />
            <input
              type="number"
              placeholder={amountPlaceholder}
              value={row.amount}
              onChange={(e) => updateRow(setRows, row.id, { amount: e.target.value })}
              required
              className={inputClasses}
            />
          </div>
          <TreatmentSelect id={row.id} fields={row} onChange={(f) => updateRow(setRows, row.id, f)} />
        </RowItem>
      ))}
    </MatrixBox>
  );

  return (
    <div className="min-h-screen bg-slate-100 px-5 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-white p-11 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08)]">
          <h2 className="mb-2 text-[1.45rem] font-extrabold tracking-tight text-slate-900">
            Your Income & Revenue
          </h2>
          <p className="mb-8 text-[0.95rem] leading-relaxed text-slate-500">
            Please tell us about all income you personally receive. This includes employment income, bonuses,
            investments, rental income and any other regular income sources.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* EMPLOYMENT INCOME */}
            <PartHeader tooltip="Include your annual salary or wages before tax. Do not include bonuses, commissions, dividends, rental income or other income sources—they are collected separately below.">
              Employment Income
            </PartHeader>
            <div className="mb-6">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                What is your current annual gross employment income (before tax)?
              </label>
              <input
                type="number"
                min={0}
                placeholder="£ Amount in GBP"
                value={grossAnnualIncome}
                onChange={(e) => setGrossAnnualIncome(e.target.value)}
                required
                className={inputClasses}
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                How would you like your employment income to be treated under this agreement?
              </label>
              <TreatmentSelect
                id="salary"
                fields={salaryTreatment}
                onChange={setSalaryTreatment}
                options={[
                  { value: "KeepSeparate", label: "Keep it Separate" },
                  { value: "ShareEqually", label: "Share Equally (50/50)" },
                  { value: "Percentage", label: "Share by Percentage" },
                  { value: "Custom", label: "Custom Arrangement" },
                ]}
              />
            </div>

            {/* BONUSES & INCENTIVES */}
            <PartHeader tooltip="Declare variable performance items like bonuses, regular overtime commissions, or corporate incentives.">
              Bonuses & Employment Incentives
            </PartHeader>
            <div className="mb-4">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                Apart from your base salary, do you regularly receive bonuses, commissions, share options, share
                awards (RSUs), profit-sharing payments, or other employment incentives?
              </label>
              <YesNoToggle name="has_primary_bonus" value={hasPrimaryBonus} onChange={handlePrimaryBonusToggle} />
            </div>
            {hasPrimaryBonus === "Yes" &&
              renderIncomeSection(
                "Bonus & Incentive Income",
                "Add Variable Revenue Stream",
                primaryIncomeRows,
                setPrimaryIncomeRows,
                "Description (e.g. Annual Bonus)",
                "Estimated Annual Amount (£)"
              )}

            {/* ALTERNATIVE INCOME STREAMS */}
            <PartHeader tooltip="List recurring revenue paid to you individually from investments, trust dividends, or property yields.">
              Alternative Income Streams
            </PartHeader>
            <div className="mb-4">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                Do you personally receive income from sources other than your employment, such as rental property
                income, dividend payments, trust distributions, business income, royalties, maintenance payments
                (spousal or child), pension income, or other investment income?
              </label>
              <YesNoToggle
                name="has_alternative_income"
                value={hasAlternativeIncome}
                onChange={handleAltIncomeToggle}
              />
            </div>
            {hasAlternativeIncome === "Yes" &&
              renderIncomeSection(
                "Alternative Income Sources",
                "Add Income Source",
                altIncomeRows,
                setAltIncomeRows,
                "Source Name (e.g. Dividend, Rental Yield)",
                "Annual Income (£)"
              )}

            <div className="flex justify-end">
              <button
                type="submit"
                className="mt-8 rounded-[10px] bg-indigo-600 px-10 py-3.5 font-semibold text-white shadow-[0_4px_12px_rgba(79,70,229,0.2)] transition hover:bg-indigo-700"
              >
                Next: Personal Liabilities
              </button>
            </div>
          </form>

          {submitted && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              Income & Revenue saved successfully.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}