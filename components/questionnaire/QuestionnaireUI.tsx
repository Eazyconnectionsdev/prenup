"use client";

import React, { useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronDown, Info, Loader2, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Treatment, TreatmentFields, YesNo } from "@/types/forms/form-primitives";
import type {
  CheckCardProps,
  FormShellProps,
  MatrixBoxProps,
  RadioCardProps,
  TreatmentSelectProps,
  ValueWithUnsureProps,
  YesNoToggleProps,
} from "@/types/questionnaire/questionnaire-ui";

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
  "w-full rounded-xl border border-slate-200 bg-[#FBFBFE] px-4 py-3 text-[13.5px] font-medium text-slate-900 transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 outline-none disabled:cursor-not-allowed disabled:opacity-70 min-h-[46px]";

export const textareaClasses =
  "w-full rounded-xl border border-slate-200 bg-[#FBFBFE] px-4 py-3 text-[13.5px] font-medium text-slate-900 transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 outline-none disabled:cursor-not-allowed disabled:opacity-70 min-h-[90px] resize-y";

// Same textarea, sitting inside a tinted card so it needs to stay white
export const cardTextareaClasses = cn(textareaClasses, "bg-white");

/* ---------------------------------------------------------------------- */
/* Decorative 3D-styled Illustration                                      */
/* ---------------------------------------------------------------------- */

export function FormShellIllustration() {
  return (
    <div className="relative hidden md:flex items-center justify-center shrink-0 select-none">
      {/* Soft Ambient Glow */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-200/40 via-purple-200/30 to-pink-200/20 rounded-3xl blur-xl" />

      <svg
        width="136"
        height="98"
        viewBox="0 0 136 98"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-[0_8px_20px_rgba(99,102,241,0.16)]"
      >
        {/* Soft Sparkle stars */}
        <path
          d="M10 22L11.5 17L16.5 15.5L11.5 14L10 9L8.5 14L3.5 15.5L8.5 17L10 22Z"
          fill="#818CF8"
          opacity="0.9"
        />
        <path
          d="M128 28L129 24L133 23L129 22L128 18L127 22L123 23L127 24L128 28Z"
          fill="#A78BFA"
          opacity="0.85"
        />

        {/* Document Sheet */}
        <g>
          <rect
            x="24"
            y="6"
            width="68"
            height="84"
            rx="12"
            fill="#FFFFFF"
            stroke="#E0E7FF"
            strokeWidth="1.5"
          />
          {/* Header strip */}
          <rect x="32" y="16" width="24" height="4" rx="2" fill="#E2E8F0" />
          <rect x="32" y="24" width="30" height="3" rx="1.5" fill="#EEF2F6" />
          <rect x="32" y="30" width="24" height="3" rx="1.5" fill="#EEF2F6" />
          {/* Divider */}
          <line
            x1="32"
            y1="40"
            x2="84"
            y2="40"
            stroke="#EEF2F6"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
          {/* Content lines */}
          <rect x="32" y="47" width="40" height="3" rx="1.5" fill="#EEF2F6" />
          <rect x="32" y="54" width="46" height="3" rx="1.5" fill="#F1F5F9" />
          <rect x="32" y="61" width="30" height="3" rx="1.5" fill="#F1F5F9" />
          <rect x="32" y="68" width="42" height="3" rx="1.5" fill="#F8FAFC" />

          {/* Badge on sheet with radiant gradient */}
          <circle cx="74" cy="24" r="13" fill="url(#form-shell-grad)" />
          <path
            d="M70 24L73 27L79 21"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* 3D Stacked Accents on bottom right */}
        <g>
          <ellipse cx="98" cy="78" rx="15" ry="5.5" fill="#6366F1" />
          <rect x="83" y="74" width="30" height="4" fill="#4F46E5" />
          <ellipse cx="98" cy="74" rx="15" ry="5.5" fill="#818CF8" />

          <rect x="83" y="67" width="30" height="4" fill="#6366F1" />
          <ellipse cx="98" cy="67" rx="15" ry="5.5" fill="#818CF8" />
          <ellipse cx="98" cy="65" rx="15" ry="5.5" fill="#A5B4FC" />

          <rect x="83" y="58" width="30" height="4" fill="#4338CA" />
          <ellipse cx="98" cy="58" rx="15" ry="5.5" fill="#6366F1" />
          <ellipse cx="98" cy="56" rx="15" ry="5.5" fill="#818CF8" />
        </g>

        <defs>
          <linearGradient
            id="form-shell-grad"
            x1="61"
            y1="11"
            x2="87"
            y2="37"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#818CF8" />
            <stop offset="1" stopColor="#4F46E5" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Page layout                                                             */
/* ---------------------------------------------------------------------- */

export function FormShell({ title, description, stepLabel, readOnly, icon, children }: FormShellProps) {
  useEffect(() => {
    const mainEl = document.querySelector("main");
    if (mainEl) mainEl.scrollTop = 0;
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-full bg-[#F8FAFC] px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        {/* Top Header Row matching Income & Revenue */}
        <div className="mb-7 flex items-start justify-between gap-6">
          <div>
            {stepLabel && (
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1 text-[11.5px] font-semibold text-indigo-700 border border-indigo-100/90 shadow-2xs">
                  {stepLabel}
                </span>
                {readOnly && (
                  <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                    Read-only
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center gap-3.5">
              {icon && (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F89AA8] via-[#E28691] to-[#C0374F] text-white shadow-md shadow-slate-900/10 ring-1 ring-white/30 ring-inset [&>svg]:h-5.5 [&>svg]:w-5.5 [&>svg]:stroke-[2.2] [&>svg]:text-white [&>svg]:drop-shadow-xs">
                  {icon}
                </div>
              )}
              <h1 className="text-2xl sm:text-[27px] font-bold tracking-tight text-slate-900">
                {title}
              </h1>
            </div>

            {description && (
              <p className="mt-2 pl-[58px] max-w-2xl text-[13.5px] leading-relaxed text-[#64748B]">
                {description}
              </p>
            )}
          </div>

          {/* Right decorative 3D graphic badge */}
          <FormShellIllustration />
        </div>

        {/* Content Flow */}
        <div className="space-y-6 [&>form]:space-y-6 [&>form>fieldset]:space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center gap-2 text-sm font-medium text-slate-500">
      <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
      Loading your information...
    </div>
  );
}

const DEFAULT_PREV_ROUTES: Record<string, string> = {
  "/dashboard/personal-info": "/dashboard",
  "/dashboard/legal-declaration": "/dashboard/personal-info",
  "/dashboard/family": "/dashboard/legal-declaration",
  "/dashboard/individual_assets": "/dashboard/family",
  "/dashboard/income_revenue": "/dashboard/individual_assets",
  "/dashboard/liabilities_debts": "/dashboard/income_revenue",
  "/dashboard/joint-assets": "/dashboard/liabilities_debts",
  "/dashboard/joint-income-revenue": "/dashboard/joint-assets",
  "/dashboard/joint-liabilities-debts": "/dashboard/joint-income-revenue",
  "/dashboard/matrimonial-agreement": "/dashboard/joint-liabilities-debts",
};

export function SubmitBar({
  isSaving,
  label = "Continue →",
  withArrow = false,
  backHref,
  backLabel = "Back",
}: {
  isSaving: boolean;
  label?: string;
  withArrow?: boolean;
  backHref?: string;
  backLabel?: string;
}) {
  const pathname = usePathname();

  const effectiveBackHref =
    backHref ??
    (pathname && DEFAULT_PREV_ROUTES[pathname] !== undefined
      ? DEFAULT_PREV_ROUTES[pathname]
      : undefined);

  const displayLabel = label.includes("→") ? label : withArrow ? `${label} →` : label;

  return (
    <div className="mt-8 flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200/80">
      {/* Left: Save and exit link */}
      <button
        type="button"
        onClick={() => {
          if (typeof window !== "undefined") {
            window.location.href = "/dashboard";
          }
        }}
        className="text-[13.5px] font-semibold text-[#5B4DF5] transition hover:text-[#4338CA] text-left cursor-pointer"
      >
        Save and exit
      </button>

      {/* Right: Back & Continue buttons */}
      <div className="flex items-center gap-3">
        {effectiveBackHref && (
          <Link
            href={effectiveBackHref}
            className="inline-flex h-[42px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 text-[13.5px] font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:border-slate-300"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        )}
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex h-[42px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-[#5B4DF5] hover:from-indigo-700 hover:to-[#4E3EEA] px-7 text-[13.5px] font-semibold text-white shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-[#5B4DF5]/30 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSaving ? "Saving..." : displayLabel}
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Headings & labels                                                       */
/* ---------------------------------------------------------------------- */

export function Tooltip({ text }: { text: string }) {
  const [show, setShow] = React.useState(false);
  const containerRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
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
        aria-label="More information"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShow((prev) => !prev);
        }}
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
/* Card Heading Badge Gradients (Green -> Orange -> Blue sequence)        */
/* ---------------------------------------------------------------------- */

export const BADGE_GRADIENTS = {
  green: "from-emerald-400 via-emerald-500 to-teal-600 shadow-[0_8px_20px_rgba(16,185,129,0.30)]",
  orange: "from-amber-400 via-orange-500 to-amber-600 shadow-[0_8px_20px_rgba(245,158,11,0.30)]",
  blue: "from-blue-400 via-blue-500 to-indigo-600 shadow-[0_8px_20px_rgba(37,99,235,0.30)]",
} as const;

export const BADGE_CYCLE = [
  BADGE_GRADIENTS.green,
  BADGE_GRADIENTS.orange,
  BADGE_GRADIENTS.blue,
];

export function getBadgeGradient(index: number): string {
  return BADGE_CYCLE[Math.abs(index) % BADGE_CYCLE.length];
}

// Round badge used for secondary icons
export function IconBadge({ children, size = "md" }: { children: ReactNode; size?: "sm" | "md" }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 ${
        size === "sm" ? "h-8 w-8 [&>svg]:h-4 [&>svg]:w-4" : "h-10 w-10 [&>svg]:h-5 [&>svg]:w-5"
      }`}
    >
      {children}
    </span>
  );
}

// Large section divider ("Declarations of Understanding"...)
export function SectionTitle({
  children,
  first,
  icon,
}: {
  children: ReactNode;
  first?: boolean;
  icon?: ReactNode;
  colorIndex?: number;
}) {
  return (
    <div
      className={`mb-5 flex items-center gap-3.5 border-b border-slate-200/80 pb-4 ${first ? "" : "mt-8"}`}
    >
      {icon && (
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F89AA8] via-[#E28691] to-[#C0374F] text-white shadow-md shadow-slate-900/10 ring-1 ring-white/30 ring-inset [&>svg]:h-5.5 [&>svg]:w-5.5 [&>svg]:stroke-[2.2] [&>svg]:text-white [&>svg]:drop-shadow-xs"
        >
          {icon}
        </div>
      )}
      <span className="text-lg sm:text-[20px] font-bold tracking-tight text-slate-900">{children}</span>
    </div>
  );
}

// A whole section boxed into its own card, with an icon badge on its heading
export function SectionCard({
  title,
  subtitle,
  icon,
  iconGradient,
  colorIndex,
  tooltip,
  children,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  iconGradient?: string;
  colorIndex?: number;
  tooltip?: string;
  children: ReactNode;
}) {
  const gradient =
    iconGradient ??
    (colorIndex !== undefined ? getBadgeGradient(colorIndex) : BADGE_GRADIENTS.green);

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(99,102,241,0.06)] hover:border-slate-300/90 transition-all duration-300">
      <div className={cn("mb-5 flex gap-3.5", subtitle ? "items-start" : "items-center")}>
        {icon && (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-md ring-1 ring-white/20 ring-inset [&>svg]:h-5.5 [&>svg]:w-5.5 [&>svg]:stroke-[2.2] [&>svg]:text-white [&>svg]:drop-shadow-xs`}
          >
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-[17px] font-bold text-slate-900 tracking-tight">
              {title}
            </h2>
            {tooltip && <Tooltip text={tooltip} />}
          </div>
          {subtitle && (
            <p className="mt-0.5 text-[12.5px] sm:text-[13px] text-slate-500 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="[&>*:last-child]:mb-0">{children}</div>
    </div>
  );
}

// A long-form question presented as a numbered card, with its field inside
export function NumberedQuestion({
  number,
  question,
  htmlFor,
  colorIndex,
  tooltip,
  children,
}: {
  number: number;
  question: ReactNode;
  htmlFor?: string;
  colorIndex?: number;
  tooltip?: string;
  children: ReactNode;
}) {
  const badgeGrad = getBadgeGradient(colorIndex !== undefined ? colorIndex : number - 1);
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(99,102,241,0.06)] hover:border-slate-300/90 transition-all duration-300">
      <div className="mb-3.5 flex items-start gap-3">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${badgeGrad} text-white text-[12px] font-bold shadow-xs mt-0.5 ring-1 ring-white/25 ring-inset`}
        >
          {number}
        </span>
        <label
          htmlFor={htmlFor}
          className="text-[14px] sm:text-[14.5px] font-bold leading-relaxed text-slate-900 flex-1 flex items-center justify-between gap-2"
        >
          <span>{question}</span>
          {tooltip && <Tooltip text={tooltip} />}
        </label>
      </div>
      {children}
    </div>
  );
}

// Sub-section header with optional help tooltip
export function PartHeader({ children, tooltip }: { children: ReactNode; tooltip?: string }) {
  return (
    <div className="mb-3 mt-6 flex items-center gap-2 text-[14.5px] font-bold text-slate-900 first:mt-0">
      {children}
      {tooltip && <Tooltip text={tooltip} />}
    </div>
  );
}

export function FieldLabel({ children, htmlFor, className }: { children: ReactNode; htmlFor?: string; className?: string }) {
  return (
    <label htmlFor={htmlFor} className={cn("mb-3 block text-[14px] sm:text-[14.5px] font-bold tracking-tight text-slate-900 leading-relaxed", className)}>
      {children}
    </label>
  );
}

export function Notice({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "warning" | "error" }) {
  const toneClasses = {
    info: "border-indigo-200 bg-indigo-50/70 text-indigo-900",
    warning: "border-amber-200 bg-amber-50/80 text-amber-900",
    error: "border-rose-200 bg-rose-50/80 text-rose-800",
  }[tone];
  return (
    <div className={`mt-3.5 rounded-xl border p-4 text-[13px] leading-relaxed shadow-xs ${toneClasses}`}>
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Choice controls (all support readOnly for the partner views)            */
/* ---------------------------------------------------------------------- */

export function RadioCard({ id, name, label, checked, onChange, readOnly }: RadioCardProps) {
  return (
    <button
      type="button"
      id={id}
      disabled={readOnly}
      onClick={() => onChange?.()}
      className={`group relative flex items-center gap-3.5 rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer ${
        checked
          ? "border-[#6366F1] bg-[#6366F1]/5 ring-2 ring-[#6366F1]/20 shadow-xs"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
      } ${readOnly ? "cursor-not-allowed opacity-75" : ""}`}
    >
      <span
        className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
          checked ? "border-[#6366F1] bg-[#6366F1]" : "border-slate-300 bg-white group-hover:border-slate-400"
        }`}
      >
        {checked && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
      </span>
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

export function YesNoToggle({ name, value, onChange, readOnly }: YesNoToggleProps) {
  return (
    <div className="mb-4 grid grid-cols-2 gap-4">
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

export function CheckCard({ id, name, title, description, tooltip, checked, onChange, readOnly }: CheckCardProps) {
  return (
    <label
      htmlFor={id}
      className={`group relative mb-3 flex items-start gap-3.5 rounded-xl border p-4.5 transition-all duration-200 cursor-pointer ${
        checked
          ? "border-[#6366F1] bg-[#6366F1]/5 ring-2 ring-[#6366F1]/20 shadow-xs"
          : readOnly
            ? "border-slate-200 bg-slate-50 cursor-not-allowed opacity-75"
            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
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
        className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200 ${
          checked ? "border-[#6366F1] bg-[#6366F1]" : "border-slate-300 bg-white group-hover:border-slate-400"
        }`}
      >
        {checked && (
          <svg
            viewBox="0 0 10 10"
            className="h-2.5 w-2.5"
            fill="none"
            stroke="white"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 5l2.5 3L9 1" />
          </svg>
        )}
      </span>
      <div className="flex-1 min-w-0">
        <div className={`text-[13.5px] font-semibold leading-snug flex items-center gap-1.5 ${checked ? "text-[#4338CA]" : "text-slate-900"}`}>
          <span>{title}</span>
          {tooltip && <Tooltip text={tooltip} />}
        </div>
        {description && (
          <div className="mt-1 text-[12.5px] font-normal leading-relaxed text-slate-500">{description}</div>
        )}
      </div>
    </label>
  );
}

/* ---------------------------------------------------------------------- */
/* Repeating rows                                                          */
/* ---------------------------------------------------------------------- */

export function MatrixBox({ title, children, onAdd, addLabel }: MatrixBoxProps) {
  return (
    <div className="mt-5 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 sm:p-6 mb-5">
      <div className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">{title}</div>
      <div className="space-y-4">{children}</div>
      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-300 bg-white px-5 py-3 text-[13.5px] font-semibold text-[#4F46E5] transition-all hover:border-indigo-500 hover:bg-indigo-50/60 shadow-2xs cursor-pointer"
        >
          + {addLabel}
        </button>
      )}
    </div>
  );
}

export function RowItem({ children, onDelete }: { children: ReactNode; onDelete?: () => void }) {
  return (
    <div className="relative rounded-xl border border-slate-200/90 bg-white p-5 pt-8 shadow-xs">
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          aria-label="Remove item"
          className="absolute right-3.5 top-3.5 flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500 cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
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
      <label className="mt-2 flex cursor-pointer items-center gap-2 text-[12.5px] font-medium text-slate-600">
        <input
          type="checkbox"
          checked={unknown}
          onChange={(e) => onUnknownChange?.(e.target.checked)}
          disabled={readOnly}
          className="h-4 w-4 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
        />
        I am unsure of the current value.
      </label>
      {!readOnly && (
        <small className="mt-1 block pl-6 text-[12px] leading-tight text-slate-400">
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
    <div className="mt-3.5">
      <div className="relative">
        <select
          id={`treatment_${id}`}
          value={fields.treatment}
          onChange={(e) => update({ treatment: e.target.value as Treatment })}
          disabled={readOnly}
          required
          className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13.5px] font-medium text-slate-900 shadow-2xs transition-all hover:border-slate-300 focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 outline-none cursor-pointer pr-10"
        >
          <option value="">{label}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          <ChevronDown className="h-4.5 w-4.5" />
        </div>
      </div>

      {fields.treatment === "Contribution" && (
        <div className="mt-3.5 rounded-xl border-l-4 border-[#6366F1] bg-[#F8FAFC] p-4 shadow-xs">
          <label className="mb-1.5 block text-[13px] font-semibold text-slate-800">
            Define contribution (e.g., salary, initial deposit):
          </label>
          <input
            type="text"
            value={fields.contributionText}
            onChange={(e) => update({ contributionText: e.target.value })}
            disabled={readOnly}
            placeholder="Explain your contribution logic"
            className={inputClasses}
          />
        </div>
      )}
      {fields.treatment === "Percentage" && (
        <div className="mt-3.5 rounded-xl border-l-4 border-[#6366F1] bg-[#F8FAFC] p-4 shadow-xs">
          <label className="mb-1.5 block text-[13px] font-semibold text-slate-800">
            Specify percentage (e.g., 60/40):
          </label>
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
        </div>
      )}
      {fields.treatment === "Custom" && (
        <div className="mt-3.5 rounded-xl border-l-4 border-[#6366F1] bg-[#F8FAFC] p-4 shadow-xs">
          <label className="mb-1.5 block text-[13px] font-semibold text-slate-800">
            Custom arrangement details:
          </label>
          <textarea
            value={fields.customText}
            onChange={(e) => update({ customText: e.target.value })}
            disabled={readOnly}
            placeholder="Create your own arrangement..."
            className={textareaClasses}
          />
        </div>
      )}
    </div>
  );
}
