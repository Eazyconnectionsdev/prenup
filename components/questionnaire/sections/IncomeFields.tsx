"use client";

import React, { useState, useRef, useEffect } from "react";
import { Briefcase, ChevronDown, Home, Info, Plus, Trash2, TrendingUp, X } from "lucide-react";
import { FieldMessage, fieldClassesFor } from "../QuestionnaireUI";
import type { Treatment, TreatmentFields, YesNo } from "@/types/forms/form-primitives";
import type { IncomeData, IncomeRow, Props, RowsKey } from "@/types/questionnaire/income-fields";

export const initialIncome: IncomeData = {
  grossAnnualIncome: "",
  salaryTreatment: {
    treatment: "" as Treatment,
    contributionText: "",
    percentageValue: "",
    customText: "",
  },
  hasPrimaryBonus: "No",
  primaryIncomeRows: [],
  hasAlternativeIncome: "No",
  altIncomeRows: [],
};

const emptyTreatment: TreatmentFields = {
  treatment: "" as Treatment,
  contributionText: "",
  percentageValue: "",
  customText: "",
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

const makeId = (prefix = "row") => `${prefix}_${Math.random().toString(36).substring(2, 9)}`;

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

const ALL_TREATMENT_OPTIONS: { value: Treatment; label: string }[] = [
  { value: "KeepSeparate", label: "Keep it Separate" },
  { value: "ShareEqually", label: "Share Equally (50/50)" },
  { value: "Contribution", label: "Split by Contribution" },
  { value: "Percentage", label: "Share by Percentage" },
  { value: "Custom", label: "Custom Arrangement" },
];

/* ---------------------------------------------------------------------- */
/* Info Tooltip Icon Component (crisp indigo circle with Info icon)       */
/* ---------------------------------------------------------------------- */
function InfoTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!show) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [show]);

  return (
    <span ref={containerRef} className="relative inline-flex items-center align-middle ml-1.5 select-none">
      <button
        type="button"
        aria-label="Info"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShow((prev) => !prev);
        }}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="group inline-flex items-center justify-center rounded-full text-[#6366F1] hover:text-[#4338CA] hover:bg-indigo-50 active:scale-95 p-1 transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#6366F1]/30"
      >
        <Info className="h-[17px] w-[17px] stroke-[2.2] transition-transform duration-150 group-hover:scale-110" />
      </button>

      {show && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-50 w-72 sm:w-80 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-[#0B0F19] p-4 text-left shadow-[0_20px_50px_-10px_rgba(15,23,42,0.7),0_0_0_1px_rgba(99,102,241,0.25)] border border-indigo-500/25 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header row with glowing badge and close button */}
          <span className="mb-2.5 flex items-center justify-between border-b border-slate-800/90 pb-2">
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-300">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 ring-1 ring-indigo-400/30">
                <Info className="h-3 w-3 stroke-[2.4]" />
              </span>
              Guidance Note
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShow(false);
              }}
              className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
              aria-label="Close tooltip"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>

          {/* Content */}
          <span className="block text-[12.5px] font-normal leading-relaxed text-slate-200 antialiased normal-case tracking-normal">
            {text}
          </span>

          {/* Bottom pointer arrow */}
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-[6px] border-transparent border-t-slate-950" />
        </span>
      )}
    </span>
  );
}

/* ---------------------------------------------------------------------- */
/* Large Pill Choice Component for Yes / No Toggles                       */
/* ---------------------------------------------------------------------- */
function PillChoice({
  label,
  checked,
  onClick,
  disabled,
}: {
  label: "Yes" | "No";
  checked: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group relative flex items-center gap-3.5 rounded-xl px-5 py-3.5 text-left transition-all duration-200 outline-none ${
        checked
          ? "border-2 border-[#6366F1] bg-[#F5F3FF] shadow-xs ring-2 ring-[#6366F1]/10"
          : "border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70"
      } ${disabled ? "cursor-not-allowed opacity-75" : "cursor-pointer"}`}
    >
      {/* Radio Circle */}
      <span
        className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
          checked
            ? "border-2 border-[#6366F1] bg-[#6366F1] scale-105"
            : "border-2 border-slate-300 bg-white group-hover:border-slate-400"
        }`}
      >
        {checked && <span className="h-1.5 w-1.5 rounded-full bg-white shadow-xs" />}
      </span>

      {/* Label */}
      <span
        className={`text-[13.5px] transition-colors ${
          checked ? "font-bold text-[#4338CA]" : "font-semibold text-slate-900 group-hover:text-black"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

/* ---------------------------------------------------------------------- */
/* Treatment Select Field with Dropdown Styling & Chevron Icon            */
/* ---------------------------------------------------------------------- */
function CustomTreatmentSelect({
  id,
  fields,
  onChange,
  options = ALL_TREATMENT_OPTIONS,
  placeholder = "How should this be shared?",
  disabled,
  errors,
  path,
}: {
  id: string;
  fields: TreatmentFields;
  onChange: (patch: Partial<TreatmentFields>) => void;
  options?: { value: Treatment; label: string }[];
  placeholder?: string;
  disabled?: boolean;
  /** Messages for this block, keyed by its own field names. */
  errors?: Record<string, string>;
  /** Where this block sits in the payload, so messages can be scrolled to. */
  path?: string;
}) {
  const errorFor = (field: keyof TreatmentFields) => errors?.[field];
  const pathFor = (field: keyof TreatmentFields) => (path ? `${path}.${field}` : field);
  return (
    <div className="w-full">
      <div className="relative group flex items-center">
        <select
          id={`treatment_${id}`}
          value={fields.treatment}
          onChange={(e) => onChange({ treatment: e.target.value as Treatment })}
          disabled={disabled}
          title="This records your current intentions. Your independent solicitor will discuss whether these arrangements are appropriate and legally workable."
          className={fieldClassesFor(
            `w-full appearance-none rounded-xl border border-slate-200 bg-[#FBFBFE] px-4 py-3 pr-16 text-[13.5px] font-medium leading-relaxed transition-all duration-200 outline-none hover:border-slate-300 hover:bg-white focus:border-[#6366F1] focus:bg-white focus:ring-4 focus:ring-[#6366F1]/10 disabled:cursor-not-allowed disabled:opacity-70 ${
              !fields.treatment ? "text-slate-600" : "text-slate-900 font-semibold"
            }`,
            errorFor("treatment"),
          )}
        >
          <option value="" disabled className="text-slate-600 font-medium">
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-slate-900 font-medium">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-9 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-hover:text-slate-600 transition-colors" />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
          <InfoTooltip text="This records your current intentions. Your independent solicitor will discuss whether these arrangements are appropriate and legally workable." />
        </div>
      </div>
      <FieldMessage error={errorFor("treatment")} path={pathFor("treatment")} />

      {fields.treatment === "Contribution" && (
        <div className="mt-3.5 rounded-xl border-l-4 border-[#6366F1] bg-[#F8FAFC] p-4 shadow-xs">
          <label className="mb-1.5 flex items-center justify-between gap-2 text-[13px] font-semibold text-slate-800">
            <span>Define contribution (e.g., salary, initial deposit):</span>
            <InfoTooltip text="Explain how entitlement should be determined, for example, based on financial contributions or other agreed arrangements." />
          </label>
          <input
            type="text"
            value={fields.contributionText}
            onChange={(e) => onChange({ contributionText: e.target.value })}
            disabled={disabled}
            placeholder="Explain your contribution logic"
            className={fieldClassesFor(
              "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 outline-none transition-all",
              errorFor("contributionText"),
            )}
          />
          <FieldMessage
            error={errorFor("contributionText")}
            path={pathFor("contributionText")}
          />
        </div>
      )}

      {fields.treatment === "Percentage" && (
        <div className="mt-3.5 rounded-xl border-l-4 border-[#6366F1] bg-[#F8FAFC] p-4 shadow-xs">
          <label className="mb-1.5 flex items-center justify-between gap-2 text-[13px] font-semibold text-slate-800">
            <span>Specify percentage (e.g., 60/40):</span>
            <InfoTooltip text="Specify the percentage allocation you would like applied to this income stream (e.g., 60% / 40%)." />
          </label>
          <input
            type="number"
            min={0}
            max={100}
            value={fields.percentageValue}
            onChange={(e) => onChange({ percentageValue: e.target.value })}
            disabled={disabled}
            placeholder="Percentage (%)"
            className={fieldClassesFor(
              "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 outline-none transition-all",
              errorFor("percentageValue"),
            )}
          />
          <FieldMessage
            error={errorFor("percentageValue")}
            path={pathFor("percentageValue")}
          />
        </div>
      )}

      {fields.treatment === "Custom" && (
        <div className="mt-3.5 rounded-xl border-l-4 border-[#6366F1] bg-[#F8FAFC] p-4 shadow-xs">
          <label className="mb-1.5 flex items-center justify-between gap-2 text-[13px] font-semibold text-slate-800">
            <span>Custom arrangement details:</span>
            <InfoTooltip text="Describe any bespoke arrangement you would like considered when preparing your agreement." />
          </label>
          <textarea
            value={fields.customText}
            onChange={(e) => onChange({ customText: e.target.value })}
            disabled={disabled}
            placeholder="Create your own arrangement..."
            rows={3}
            className={fieldClassesFor(
              "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 outline-none resize-y transition-all",
              errorFor("customText"),
            )}
          />
          <FieldMessage error={errorFor("customText")} path={pathFor("customText")} />
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* IncomeFields Main Component                                            */
/* ---------------------------------------------------------------------- */
export function IncomeFields({ data, onChange, readOnly, errors, onClearError }: Props) {
  const ask = (you: string, they: string) => (readOnly ? they : you);
  const set = (patch: Partial<IncomeData>) => onChange?.((prev) => ({ ...prev, ...patch }));

  /* ---- Where a row's fields live in the payload ---- */

  const rowPath = (key: RowsKey, id: string) =>
    `${key}.${data[key].findIndex((r) => r.id === id)}`;
  const fieldPath = (key: RowsKey, id: string, field: string) => `${rowPath(key, id)}.${field}`;
  const errorAt = (key: RowsKey, id: string, field: string) =>
    errors?.[fieldPath(key, id, field)];

  // The messages inside one object, re-keyed relative to it.
  const errorsUnder = (prefix: string) => {
    if (!errors) return undefined;
    const start = `${prefix}.`;
    const scoped: Record<string, string> = {};
    for (const [path, message] of Object.entries(errors)) {
      if (path.startsWith(start)) scoped[path.slice(start.length)] = message;
    }
    return scoped;
  };

  const toggle = (flag: "hasPrimaryBonus" | "hasAlternativeIncome", key: RowsKey) => (value: YesNo) => {
    onClearError?.(flag);
    onClearError?.(key);
    onChange?.((prev) => ({
      ...prev,
      [flag]: value,
      [key]: value === "Yes" ? (prev[key].length ? prev[key] : [makeIncomeRow()]) : [],
    }));
  };

  const updateRow = (key: RowsKey, id: string, patch: Partial<IncomeRow>) => {
    for (const field of Object.keys(patch)) onClearError?.(fieldPath(key, id, field));
    set({ [key]: data[key].map((r) => (r.id === id ? { ...r, ...patch } : r)) });
  };

  // Rows after a removed one shift up, so the list's messages go with it.
  const dropRow = (key: RowsKey, id: string) => {
    onClearError?.(key);
    set({ [key]: data[key].filter((r) => r.id !== id) });
  };

  const renderRows = (
    key: RowsKey,
    title: string,
    addLabel: string,
    descriptionPlaceholder: string,
    amountPlaceholder: string,
  ) => (
    <div
      className={`mt-5 rounded-2xl border p-5 sm:p-6 ${
        errors?.[key] ? "border-rose-300 bg-rose-50/40" : "border-slate-200 bg-slate-50/70"
      }`}
    >
      <div className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
        {title}
      </div>

      <div className="space-y-4">
        {data[key].map((row, idx) => (
          <div
            key={row.id}
            className={`relative rounded-xl border bg-white p-5 shadow-xs ${
              Object.keys(errorsUnder(rowPath(key, row.id)) ?? {}).length > 0
                ? "border-rose-300"
                : "border-slate-200/90"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold text-slate-500">
                Entry #{idx + 1}
              </div>
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => dropRow(key, row.id)}
                  aria-label="Remove item"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500 cursor-pointer"
                  title="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 mb-3.5">
              <div>
                <label className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-600">
                  <span>{key === "altIncomeRows" ? "Source Name" : "Description"}</span>
                  {key === "altIncomeRows" && (
                    <InfoTooltip text="Examples include Rental Income, Dividend Payments, Pension Income, Child Maintenance, Royalty Payments, or Trust Distributions." />
                  )}
                </label>
                <input
                  type="text"
                  placeholder={descriptionPlaceholder}
                  value={row.description}
                  onChange={(e) => updateRow(key, row.id, { description: e.target.value })}
                  disabled={readOnly}
                  className={fieldClassesFor(
                    "w-full rounded-xl border border-slate-200 bg-[#FBFBFE] px-3.5 py-2.5 text-[13px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 outline-none transition-all",
                    errorAt(key, row.id, "description"),
                  )}
                />
                <FieldMessage
                  error={errorAt(key, row.id, "description")}
                  path={fieldPath(key, row.id, "description")}
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-600">
                  <span>Estimated Annual Amount</span>
                  <InfoTooltip text="Please provide your best estimate of the annual amount received from this income source." />
                </label>
                <input
                  type="number"
                  placeholder={amountPlaceholder}
                  value={row.amount}
                  onChange={(e) => updateRow(key, row.id, { amount: e.target.value })}
                  disabled={readOnly}
                  className={fieldClassesFor(
                    "w-full rounded-xl border border-slate-200 bg-[#FBFBFE] px-3.5 py-2.5 text-[13px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 outline-none transition-all",
                    errorAt(key, row.id, "amount"),
                  )}
                />
                <FieldMessage
                  error={errorAt(key, row.id, "amount")}
                  path={fieldPath(key, row.id, "amount")}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                Treatment under agreement
              </label>
              <CustomTreatmentSelect
                id={row.id}
                fields={row}
                onChange={(f) => updateRow(key, row.id, f)}
                disabled={readOnly}
                errors={errorsUnder(rowPath(key, row.id))}
                path={rowPath(key, row.id)}
              />
            </div>
          </div>
        ))}
      </div>

      {!readOnly && (
        <button
          type="button"
          onClick={() => {
            onClearError?.(key);
            set({ [key]: [...data[key], makeIncomeRow()] });
          }}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-300 bg-white/80 px-4 py-3 text-[13.5px] font-semibold text-[#5B4DF5] transition hover:border-[#6366F1] hover:bg-indigo-50/50"
        >
          <Plus className="h-4 w-4" />
          {addLabel}
        </button>
      )}
      <FieldMessage error={errors?.[key]} path={key} className="mt-3" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Card 1: Employment Income                                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(99,102,241,0.06)] hover:border-slate-300/90 transition-all duration-300">
        {/* Card Header with Vibrant Gradient Squircle Badge */}
        <div className="mb-5 flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25 ring-1 ring-white/20 ring-inset [&>svg]:h-5.5 [&>svg]:w-5.5 [&>svg]:stroke-[2.2] [&>svg]:text-white [&>svg]:drop-shadow-xs">
            <Briefcase className="h-5.5 w-5.5 text-white stroke-[2.2]" />
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-[17px] font-bold text-slate-900 tracking-tight">
              Employment Income
            </h2>
            <InfoTooltip text="Include your annual salary or wages before tax. Do not include bonuses, commissions, dividends, rental income, or other income sources." />
          </div>
        </div>

        {/* Field 1: Annual Gross Income */}
        <div className="mb-5">
          <label
            htmlFor="grossAnnualIncome"
            className="mb-2 flex items-center justify-between gap-2 text-[14px] sm:text-[14.5px] font-bold leading-relaxed text-slate-900"
          >
            <span>
              {ask(
                "What is your current annual gross employment income (before tax)?",
                "Current annual gross employment income (before tax)",
              )}
            </span>
            <InfoTooltip text="Please provide your current annual income before tax and deductions. An estimate is acceptable if your income varies throughout the year." />
          </label>
          <input
            id="grossAnnualIncome"
            type="number"
            min={0}
            placeholder="£ Amount in GBP"
            value={data.grossAnnualIncome}
            onChange={(e) => {
              onClearError?.("grossAnnualIncome");
              set({ grossAnnualIncome: e.target.value });
            }}
            disabled={readOnly}
            className={fieldClassesFor(
              "w-full rounded-xl border border-slate-200 bg-[#FBFBFE] px-4 py-3 text-[13.5px] font-medium text-slate-900 placeholder:text-slate-400 transition-all duration-200 outline-none hover:border-slate-300 hover:bg-white focus:border-[#6366F1] focus:bg-white focus:ring-4 focus:ring-[#6366F1]/10 disabled:cursor-not-allowed disabled:opacity-70",
              errors?.grossAnnualIncome,
            )}
          />
          <FieldMessage error={errors?.grossAnnualIncome} path="grossAnnualIncome" />
        </div>

        {/* Field 2: Salary Treatment */}
        <div>
          <label className="mb-2 block text-[14px] sm:text-[14.5px] font-bold leading-relaxed text-slate-900">
            {ask(
              "How would you like your employment income to be treated under this agreement?",
              "How their employment income should be treated under this agreement",
            )}
          </label>
          <CustomTreatmentSelect
            id="salary"
            fields={data.salaryTreatment}
            onChange={(f) => {
              for (const field of Object.keys(f)) {
                onClearError?.(`salaryTreatment.${field}`);
              }
              set({ salaryTreatment: { ...data.salaryTreatment, ...f } });
            }}
            options={SALARY_TREATMENT_OPTIONS}
            placeholder="How should this be shared?"
            disabled={readOnly}
            errors={errorsUnder("salaryTreatment")}
            path="salaryTreatment"
          />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Card 2: Bonuses & Employment Incentives                             */}
      {/* ------------------------------------------------------------------ */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(99,102,241,0.06)] hover:border-slate-300/90 transition-all duration-300">
        {/* Card Header with Warm Amber / Orange Squircle Badge */}
        <div className="mb-4 flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/25 ring-1 ring-white/20 ring-inset [&>svg]:h-5.5 [&>svg]:w-5.5 [&>svg]:stroke-[2.2] [&>svg]:text-white [&>svg]:drop-shadow-xs">
            <TrendingUp className="h-5.5 w-5.5 text-white stroke-[2.2]" />
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-[17px] font-bold text-slate-900 tracking-tight">
              Bonuses &amp; Employment Incentives
            </h2>
            <InfoTooltip text="Include regular bonuses, commissions, overtime payments, RSUs, share options, carried interest, and profit-sharing arrangements." />
          </div>
        </div>

        {/* Question Text */}
        <p className="mb-4 text-[14px] sm:text-[14.5px] font-bold leading-relaxed text-slate-900">
          {ask(
            "Apart from your base salary, do you regularly receive bonuses, commissions, share options, share awards (RSUs), profit-sharing payments, or other employment incentives?",
            "Apart from base salary, do they regularly receive bonuses, commissions, share options, share awards (RSUs), profit-sharing payments, or other employment incentives?",
          )}
        </p>

        {/* Side-by-side Yes / No Choices */}
        <div className="grid grid-cols-2 gap-4">
          <PillChoice
            label="Yes"
            checked={data.hasPrimaryBonus === "Yes"}
            onClick={() => toggle("hasPrimaryBonus", "primaryIncomeRows")("Yes")}
            disabled={readOnly}
          />
          <PillChoice
            label="No"
            checked={data.hasPrimaryBonus === "No"}
            onClick={() => toggle("hasPrimaryBonus", "primaryIncomeRows")("No")}
            disabled={readOnly}
          />
        </div>
        <FieldMessage error={errors?.hasPrimaryBonus} path="hasPrimaryBonus" className="mt-2" />

        {data.hasPrimaryBonus === "Yes" &&
          renderRows(
            "primaryIncomeRows",
            "Bonus & incentive income",
            "Add variable income",
            "Description (e.g. Annual Bonus)",
            "Estimated annual amount (£)",
          )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Card 3: Alternative Income Streams                                  */}
      {/* ------------------------------------------------------------------ */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(99,102,241,0.06)] hover:border-slate-300/90 transition-all duration-300">
        {/* Card Header with Vibrant Blue / Indigo Squircle Badge */}
        <div className="mb-4 flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25 ring-1 ring-white/20 ring-inset [&>svg]:h-5.5 [&>svg]:w-5.5 [&>svg]:stroke-[2.2] [&>svg]:text-white [&>svg]:drop-shadow-xs">
            <Home className="h-5.5 w-5.5 text-white stroke-[2.2]" />
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-[17px] font-bold text-slate-900 tracking-tight">
              Alternative Income Streams
            </h2>
            <InfoTooltip text="Include any recurring income not received through employment, including rental income, dividends, royalties, maintenance payments, pension income, or trust distributions." />
          </div>
        </div>

        {/* Question Text */}
        <p className="mb-4 text-[14px] sm:text-[14.5px] font-bold leading-relaxed text-slate-900">
          {ask(
            "Do you personally receive income from sources other than your employment, such as rental property income, dividends, trust distributions, business income, royalties, maintenance payments, pension income, or other investment income?",
            "Do they personally receive income from sources other than employment, such as rental property income, dividends, trust distributions, business income, royalties, maintenance payments, pension income, or other investment income?",
          )}
        </p>

        {/* Side-by-side Yes / No Choices */}
        <div className="grid grid-cols-2 gap-4">
          <PillChoice
            label="Yes"
            checked={data.hasAlternativeIncome === "Yes"}
            onClick={() => toggle("hasAlternativeIncome", "altIncomeRows")("Yes")}
            disabled={readOnly}
          />
          <PillChoice
            label="No"
            checked={data.hasAlternativeIncome === "No"}
            onClick={() => toggle("hasAlternativeIncome", "altIncomeRows")("No")}
            disabled={readOnly}
          />
        </div>
        <FieldMessage
          error={errors?.hasAlternativeIncome}
          path="hasAlternativeIncome"
          className="mt-2"
        />

        {data.hasAlternativeIncome === "Yes" &&
          renderRows(
            "altIncomeRows",
            "Alternative income sources",
            "Add income source",
            "Source name (e.g. Dividend, Rental Yield)",
            "Annual income (£)",
          )}
      </div>
    </div>
  );
}
