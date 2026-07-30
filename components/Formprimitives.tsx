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
  "w-full rounded-[10px] border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-[0.925rem] text-slate-900 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10 disabled:cursor-not-allowed disabled:opacity-60";

export const textareaClasses = inputClasses + " min-h-[70px] resize-y";

/* ---------------------------------------------------------------------- */
/* Reusable field components                                               */
/* ---------------------------------------------------------------------- */

export function Tooltip({ text }: { text: string }) {
  return (
    <span
      title={text}
      className="inline-flex h-[18px] w-[18px] cursor-help items-center justify-center rounded-full bg-indigo-100 text-[0.75rem] font-bold text-indigo-600"
    >
      ⓘ
    </span>
  );
}

export function PartHeader({ children, tooltip }: { children: ReactNode; tooltip?: string }) {
  return (
    <div className="mb-4 mt-8 flex items-center gap-2 text-[1.15rem] font-bold text-slate-800">
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
    <div className={`mb-6 rounded-r-[10px] border-l-4 p-4 text-[0.9rem] font-medium ${toneClasses}`}>
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
    <div className="mb-3 grid grid-cols-2 gap-3">
      {(["Yes", "No"] as YesNo[]).map((opt) => {
        const checked = value === opt;
        return (
          <label
            key={opt}
            className={`relative flex cursor-pointer items-center gap-3 rounded-[10px] border px-4 py-3 transition ${
              checked
                ? "border-indigo-600 bg-slate-50"
                : "border-slate-300 bg-slate-50 hover:border-indigo-600 hover:bg-white"
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

export function RowItem({ children, onDelete }: { children: ReactNode; onDelete: () => void }) {
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
      <label className="mt-1.5 flex cursor-pointer items-center gap-1.5 text-[0.8rem] font-normal text-slate-500">
        <input
          type="checkbox"
          checked={unknown}
          onChange={(e) => onUnknownChange(e.target.checked)}
          className="h-3.5 w-3.5"
        />
        I am unsure of the current value.
      </label>
      <small className="mt-1 block pl-5 text-[0.75rem] leading-tight text-slate-500">
        Please provide an estimated value where possible. You may update this information later if additional
        details become available.
      </small>
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