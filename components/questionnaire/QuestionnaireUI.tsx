"use client";

import React, { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import type { Treatment, TreatmentFields, YesNo } from "@/types/forms/form-primitives";
import type { CheckCardProps, FormShellProps, MatrixBoxProps, RadioCardProps, TreatmentSelectProps, ValueWithUnsureProps, YesNoToggleProps } from "@/types/questionnaire/questionnaire-ui";

// Types and row helpers are shared with the CM/lawyer forms
export {
  emptyTreatment,
  makeId,
  makeToggleHandler,
  updateRow,
  removeRow,
} from "@/components/Formprimitives";

/* ---------------------------------------------------------------------- */
/* Styles                                                                  */
/* ---------------------------------------------------------------------- */

export const inputClasses =
  "w-full rounded-[10px] border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-[0.925rem] text-slate-900 transition placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10 disabled:cursor-not-allowed disabled:opacity-70";

export const textareaClasses = `${inputClasses} min-h-[70px] resize-y disabled:resize-none`;

/* ---------------------------------------------------------------------- */
/* Page layout                                                             */
/* ---------------------------------------------------------------------- */

export function FormShell({ title, description, stepLabel, readOnly, children }: FormShellProps) {
  return (
    <div className="min-h-full bg-slate-100 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-4xl rounded-2xl border border-[#E7E7F2] bg-white p-6 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08)] sm:p-10">
        <div className="mb-8 border-b border-slate-100 pb-6">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {stepLabel && (
              <span className="rounded-full bg-[#EDE9FE] px-2.5 py-0.5 text-xs font-semibold text-[#6D28D9]">
                {stepLabel}
              </span>
            )}
            {readOnly && (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                Read-only
              </span>
            )}
          </div>
          <h2 className="text-[1.45rem] font-extrabold tracking-tight text-slate-900">{title}</h2>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-slate-500">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center gap-2 text-sm font-medium text-slate-500">
      <Loader2 className="h-4 w-4 animate-spin" />
      Loading your information...
    </div>
  );
}

export function SubmitBar({ isSaving, label = "Save & Continue" }: { isSaving: boolean; label?: string }) {
  return (
    <div className="mt-10 flex justify-end border-t border-slate-100 pt-6">
      <button
        type="submit"
        disabled={isSaving}
        className="inline-flex items-center gap-2 rounded-[10px] bg-indigo-600 px-8 py-3 font-semibold text-white shadow-[0_4px_12px_rgba(79,70,229,0.25)] transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSaving ? "Saving..." : label}
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Headings & labels                                                       */
/* ---------------------------------------------------------------------- */

export function Tooltip({ text }: { text: string }) {
  return (
    <span
      title={text}
      className="inline-flex h-4.5 w-4.5 cursor-help items-center justify-center rounded-full bg-indigo-100 text-[0.75rem] font-bold text-indigo-600"
    >
      ⓘ
    </span>
  );
}

// Large section divider ("Prior Marital History", "Declarations"...)
export function SectionTitle({ children, first }: { children: ReactNode; first?: boolean }) {
  return (
    <div
      className={`mb-6 border-b-2 border-slate-100 pb-2.5 text-[1.2rem] font-bold tracking-tight text-slate-900 ${first ? "" : "mt-12"}`}
    >
      {children}
    </div>
  );
}

// Sub-section header with optional help tooltip
export function PartHeader({ children, tooltip }: { children: ReactNode; tooltip?: string }) {
  return (
    <div className="mb-4 mt-10 flex items-center gap-2 text-[1.1rem] font-bold text-slate-800 first:mt-0">
      {children}
      {tooltip && <Tooltip text={tooltip} />}
    </div>
  );
}

export function FieldLabel({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-[0.925rem] font-semibold text-slate-800">
      {children}
    </label>
  );
}

export function Notice({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "warning" | "error" }) {
  const toneClasses = {
    info: "border-indigo-200 bg-indigo-50 text-indigo-800",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
    error: "border-red-200 bg-red-50 text-red-600",
  }[tone];
  return <div className={`mt-3 rounded-[10px] border px-4 py-3 text-sm ${toneClasses}`}>{children}</div>;
}

/* ---------------------------------------------------------------------- */
/* Choice controls (all support readOnly for the partner views)            */
/* ---------------------------------------------------------------------- */

function RadioDot({ checked, size = "md" }: { checked: boolean; size?: "sm" | "md" }) {
  const outer = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const inner = size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2";
  return (
    <span
      className={`relative ${outer} shrink-0 rounded-full border-2 transition ${
        checked ? "border-indigo-600 bg-indigo-600" : "border-slate-300 bg-white"
      }`}
    >
      {checked && (
        <span
          className={`absolute left-1/2 top-1/2 ${inner} -translate-x-1/2 -translate-y-1/2 rounded-full bg-white`}
        />
      )}
    </span>
  );
}

function choiceCardClasses(checked: boolean, readOnly?: boolean) {
  const base = "relative flex items-center gap-3 rounded-[10px] border px-4 py-3 transition";
  if (checked) return `${base} border-indigo-600 bg-indigo-50/40`;
  if (readOnly) return `${base} border-slate-200 bg-slate-50 opacity-70`;
  return `${base} cursor-pointer border-slate-300 bg-slate-50 hover:border-indigo-600 hover:bg-white`;
}

export function RadioCard({ id, name, label, checked, onChange, readOnly }: RadioCardProps) {
  return (
    <label htmlFor={id} className={choiceCardClasses(checked, readOnly)}>
      <input
        type="radio"
        id={id}
        name={name}
        checked={checked}
        onChange={() => onChange?.()}
        disabled={readOnly}
        className="sr-only"
      />
      <RadioDot checked={checked} />
      <span className={`text-[0.925rem] font-semibold ${checked ? "text-indigo-700" : "text-slate-900"}`}>
        {label}
      </span>
    </label>
  );
}

export function YesNoToggle({ name, value, onChange, readOnly }: YesNoToggleProps) {
  return (
    <div className="mb-3 grid grid-cols-2 gap-3">
      {(["Yes", "No"] as YesNo[]).map((opt) => (
        <RadioCard
          key={opt}
          id={`${name}_${opt}`}
          name={name}
          label={opt}
          checked={value === opt}
          onChange={() => onChange?.(opt)}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
}

export function CheckCard({ id, name, title, description, checked, onChange, readOnly }: CheckCardProps) {
  return (
    <label
      htmlFor={id}
      className={`relative mb-3 flex items-start gap-4 rounded-[10px] border px-5 py-4 transition ${
        checked
          ? "border-indigo-600 bg-indigo-50/40"
          : readOnly
            ? "border-slate-200 bg-slate-50"
            : "cursor-pointer border-slate-300 bg-slate-50 hover:border-indigo-600 hover:bg-white"
      }`}
    >
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={readOnly}
        className="sr-only"
      />
      <span
        className={`mt-0.5 flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-[6px] border-2 transition ${
          checked ? "border-indigo-600 bg-indigo-600" : "border-slate-300 bg-white"
        }`}
      >
        {checked && (
          <svg
            viewBox="0 0 10 10"
            className="h-2.5 w-2.5"
            fill="none"
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 5l2.5 3L9 1" />
          </svg>
        )}
      </span>
      <div>
        <div className={`mb-1 text-[0.95rem] font-semibold ${checked ? "text-indigo-700" : "text-slate-900"}`}>
          {title}
        </div>
        <div className="text-[0.85rem] leading-relaxed text-slate-500">{description}</div>
      </div>
    </label>
  );
}

/* ---------------------------------------------------------------------- */
/* Repeating rows                                                          */
/* ---------------------------------------------------------------------- */
// Container for a list of rows; the add button is hidden in read-only views
export function MatrixBox({ title, children, onAdd, addLabel }: MatrixBoxProps) {
  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
      <div className="mb-4 text-[0.8rem] font-bold uppercase tracking-wide text-slate-500">{title}</div>
      {children}
      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="flex w-full items-center justify-center gap-2 rounded-[10px] border-2 border-dashed border-indigo-400 bg-white/60 px-5 py-3 text-[0.9rem] font-semibold text-indigo-600 transition hover:border-solid hover:border-indigo-600 hover:bg-indigo-50"
        >
          + {addLabel}
        </button>
      )}
    </div>
  );
}

export function RowItem({ children, onDelete }: { children: ReactNode; onDelete?: () => void }) {
  return (
    <div className="relative mb-4 rounded-[10px] border border-slate-200 bg-white p-5 pt-10 shadow-[0_2px_8px_rgba(0,0,0,0.03)] sm:p-6 sm:pt-10">
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          aria-label="Remove item"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-500"
        >
          ✕
        </button>
      )}
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Value + treatment fields                                                */
/* ---------------------------------------------------------------------- */

export function ValueWithUnsure({
  id,
  value,
  unknown,
  onValueChange,
  onUnknownChange,
  placeholder,
  readOnly,
}: ValueWithUnsureProps) {
  return (
    <div>
      <input
        type="number"
        id={id}
        value={unknown ? "" : value}
        onChange={(e) => onValueChange?.(e.target.value)}
        disabled={readOnly || unknown}
        required={!unknown}
        placeholder={unknown ? "Value unknown" : placeholder}
        className={inputClasses}
      />
      <label className="mt-1.5 flex cursor-pointer items-center gap-1.5 text-[0.8rem] text-slate-500">
        <input
          type="checkbox"
          checked={unknown}
          onChange={(e) => onUnknownChange?.(e.target.checked)}
          disabled={readOnly}
          className="h-3.5 w-3.5 accent-indigo-600"
        />
        I am unsure of the current value.
      </label>
      {!readOnly && (
        <small className="mt-1 block pl-5 text-[0.75rem] leading-tight text-slate-400">
          Please provide an estimated value where possible. You can update this later.
        </small>
      )}
    </div>
  );
}

export const allTreatmentOptions: { value: Treatment; label: string }[] = [
  { value: "KeepSeparate", label: "Keep it Separate" },
  { value: "ShareEqually", label: "Share Equally (50/50)" },
  { value: "Contribution", label: "Split by Contribution" },
  { value: "Percentage", label: "Share by Percentage" },
  { value: "Custom", label: "Custom Arrangement" },
];

function TreatmentDetail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-3 rounded-r-[10px] border-l-4 border-indigo-600 bg-slate-50 p-4">
      <label className="mb-1.5 block text-[0.875rem] font-semibold text-slate-800">{label}</label>
      {children}
    </div>
  );
}

export function TreatmentSelect({
  id,
  fields,
  onChange,
  label = "How should this be shared?",
  options = allTreatmentOptions,
  readOnly,
}: TreatmentSelectProps) {
  const update = (patch: Partial<TreatmentFields>) => onChange?.({ ...fields, ...patch });

  return (
    <div className="mt-3">
      <select
        id={`treatment_${id}`}
        value={fields.treatment}
        onChange={(e) => update({ treatment: e.target.value as Treatment })}
        disabled={readOnly}
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
        <TreatmentDetail label="Define contribution (e.g., salary, initial deposit):">
          <input
            type="text"
            value={fields.contributionText}
            onChange={(e) => update({ contributionText: e.target.value })}
            disabled={readOnly}
            placeholder="Explain your contribution logic"
            className={inputClasses}
          />
        </TreatmentDetail>
      )}
      {fields.treatment === "Percentage" && (
        <TreatmentDetail label="Specify percentage (e.g., 60/40):">
          <input
            type="number"
            min={0}
            max={100}
            value={fields.percentageValue}
            onChange={(e) => update({ percentageValue: e.target.value })}
            disabled={readOnly}
            placeholder="Percentage (%)"
            className={inputClasses}
          />
        </TreatmentDetail>
      )}
      {fields.treatment === "Custom" && (
        <TreatmentDetail label="Custom arrangement details:">
          <textarea
            value={fields.customText}
            onChange={(e) => update({ customText: e.target.value })}
            disabled={readOnly}
            placeholder="Create your own arrangement..."
            className={textareaClasses}
          />
        </TreatmentDetail>
      )}
    </div>
  );
}
