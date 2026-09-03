import React, { ReactNode } from "react";

/* ---------------------------------------------------------------------- */
/* Shared types                                                            */
/* ---------------------------------------------------------------------- */

export type YesNo = "Yes" | "No";

export type Treatment =
  | ""
  | "KeepSeparate"
  | "ShareEqually"
  | "Contribution"
  | "Percentage"
  | "Custom";

export interface TreatmentFields {
  treatment: Treatment;
  contributionText: string;
  percentageValue: string;
  customText: string;
}

export const emptyTreatment: TreatmentFields = {
  treatment: "",
  contributionText: "",
  percentageValue: "",
  customText: "",
};

export function makeId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

/* ---------------------------------------------------------------------- */
/* Shared styling helpers                                                  */
/* ---------------------------------------------------------------------- */

export const inputClasses =
  "w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-[0.875rem] text-slate-900 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-600/10 disabled:cursor-not-allowed disabled:opacity-60";

export const textareaClasses = inputClasses + " min-h-[56px] resize-y";

/* ---------------------------------------------------------------------- */
/* Reusable field components                                               */
/* ---------------------------------------------------------------------- */

export function Tooltip({ text }: { text: string }) {
  return (
    <span
      title={text}
      className="inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-indigo-100 text-[0.7rem] font-bold text-indigo-600"
    >
      ⓘ
    </span>
  );
}

export function PartHeader({ children, tooltip }: { children: ReactNode; tooltip?: string }) {
  return (
    <div className="mb-2 mt-4 flex items-center gap-1.5 text-[0.95rem] font-bold text-slate-800">
      {children}
      {tooltip && <Tooltip text={tooltip} />}
    </div>
  );
}

export function SysBanner({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "warning" }) {
  const toneClasses =
    tone === "warning"
      ? "border-amber-500 bg-amber-50 text-amber-900"
      : "border-indigo-600 bg-indigo-50 text-indigo-800";
  return (
    <div className={`mb-3 rounded-r-lg border-l-4 p-2.5 text-[0.825rem] font-medium ${toneClasses}`}>
      {children}
    </div>
  );
}

interface YesNoToggleProps {
  name: string;
  value: YesNo;
  onChange: (v: YesNo) => void;
}

export function YesNoToggle({ name, value, onChange }: YesNoToggleProps) {
  return (
    <div className="mb-2 grid grid-cols-2 gap-2">
      {(["Yes", "No"] as YesNo[]).map((opt) => {
        const checked = value === opt;
        return (
          <label
            key={opt}
            className={`relative flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-1.5 transition ${
              checked
                ? "border-indigo-600 bg-indigo-50/40 text-indigo-700 font-semibold"
                : "border-slate-300 bg-slate-50 hover:border-indigo-500 hover:bg-white text-slate-700"
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
              className={`relative h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 ${
                checked ? "border-indigo-600 bg-indigo-600" : "border-slate-300 bg-white"
              }`}
            >
              {checked && (
                <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
              )}
            </span>
            <span className="text-[0.85rem]">{opt}</span>
          </label>
        );
      })}
    </div>
  );
}

export function MatrixBox({
  title,
  children,
  onAdd,
  addLabel,
}: {
  title: string;
  children: ReactNode;
  onAdd: () => void;
  addLabel: string;
}) {
  return (
    <div className="mb-3.5 rounded-xl border border-slate-200/90 bg-slate-50/80 p-3 sm:p-4">
      <div className="mb-2 text-[0.75rem] font-bold uppercase tracking-wide text-slate-500">{title}</div>
      {children}
      <button
        type="button"
        onClick={onAdd}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-indigo-500/80 bg-white/70 px-3 py-1.5 text-[0.825rem] font-semibold text-indigo-600 transition hover:border-solid hover:bg-indigo-50"
      >
        + {addLabel}
      </button>
    </div>
  );
}

export function RowItem({ children, onDelete }: { children: ReactNode; onDelete: () => void }) {
  return (
    <div className="relative mb-2.5 rounded-lg border border-slate-200/90 bg-white p-3 sm:p-3.5 shadow-xs">
      <button
        type="button"
        onClick={onDelete}
        aria-label="Remove item"
        className="absolute right-2.5 top-2.5 text-[0.95rem] text-slate-400 transition hover:text-red-500"
      >
        ✕
      </button>
      {children}
    </div>
  );
}

export interface ValueWithUnsureProps {
  id: string;
  value: string;
  unknown: boolean;
  onValueChange: (v: string) => void;
  onUnknownChange: (v: boolean) => void;
  placeholder: string;
}

export function ValueWithUnsure({
  id,
  value,
  unknown,
  onValueChange,
  onUnknownChange,
  placeholder,
}: ValueWithUnsureProps) {
  return (
    <div>
      <input
        type="number"
        id={id}
        value={unknown ? "" : value}
        onChange={(e) => onValueChange(e.target.value)}
        disabled={unknown}
        required={!unknown}
        placeholder={unknown ? "Value unknown" : placeholder}
        className={inputClasses}
      />
      <label className="mt-1 flex cursor-pointer items-center gap-1.5 text-[0.75rem] text-slate-500">
        <input
          type="checkbox"
          checked={unknown}
          onChange={(e) => onUnknownChange(e.target.checked)}
          className="h-3 w-3 rounded text-indigo-600"
        />
        <span>I am unsure of current value (estimate)</span>
      </label>
    </div>
  );
}

export interface TreatmentSelectProps {
  id: string;
  fields: TreatmentFields;
  onChange: (fields: TreatmentFields) => void;
  label?: string;
  options?: { value: Treatment; label: string }[];
}

export const allTreatmentOptions: { value: Treatment; label: string }[] = [
  { value: "KeepSeparate", label: "Keep it Separate" },
  { value: "ShareEqually", label: "Share Equally (50/50)" },
  { value: "Contribution", label: "Split by Contribution" },
  { value: "Percentage", label: "Share by Percentage" },
  { value: "Custom", label: "Custom Arrangement" },
];

export function TreatmentSelect({
  id,
  fields,
  onChange,
  label = "How should this be shared?",
  options = allTreatmentOptions,
}: TreatmentSelectProps) {
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
/* Generic row-array state helpers                                         */
/* ---------------------------------------------------------------------- */

export function makeToggleHandler<T>(
  setEnabled: React.Dispatch<React.SetStateAction<YesNo>>,
  setRows: React.Dispatch<React.SetStateAction<T[]>>,
  makeRow: () => T
) {
  return (value: YesNo) => {
    setEnabled(value);
    if (value === "Yes") {
      setRows((prev) => (prev.length === 0 ? [makeRow()] : prev));
    } else {
      setRows([]);
    }
  };
}

export function updateRow<T extends { id: string }>(
  setRows: React.Dispatch<React.SetStateAction<T[]>>,
  id: string,
  patch: Partial<T>
) {
  setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
}

export function removeRow<T extends { id: string }>(
  setRows: React.Dispatch<React.SetStateAction<T[]>>,
  id: string
) {
  setRows((prev) => prev.filter((r) => r.id !== id));
}