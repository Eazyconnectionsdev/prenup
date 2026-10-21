"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Banknote, Loader2 } from "lucide-react";
import { useQuestionnaire } from "@/components/questionnaire/useQuestionnaire";
import { LoadingState } from "@/components/questionnaire/QuestionnaireUI";
import {
  IncomeFields,
  initialIncome,
  toIncome,
} from "@/components/questionnaire/sections/IncomeFields";
import type { IncomeData } from "@/types/questionnaire/income-fields";

/* ---------------------------------------------------------------------- */
/* Decorative 3D-styled Illustrated Badge (Matching dashboard aesthetics) */
/* ---------------------------------------------------------------------- */
function IncomeGraphicIllustration() {
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

          {/* £ Badge on sheet with radiant gradient */}
          <circle cx="74" cy="24" r="13" fill="url(#pound-grad)" />
          <text
            x="74"
            y="29"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="13"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            £
          </text>
        </g>

        {/* 3D Stacked Coins on bottom right */}
        <g>
          {/* Coin 1 (bottom) */}
          <ellipse cx="98" cy="78" rx="15" ry="5.5" fill="#6366F1" />
          <rect x="83" y="74" width="30" height="4" fill="#4F46E5" />
          <ellipse cx="98" cy="74" rx="15" ry="5.5" fill="#818CF8" />

          {/* Coin 2 (middle) */}
          <rect x="83" y="67" width="30" height="4" fill="#6366F1" />
          <ellipse cx="98" cy="67" rx="15" ry="5.5" fill="#818CF8" />
          <ellipse cx="98" cy="65" rx="15" ry="5.5" fill="#A5B4FC" />

          {/* Coin 3 (top) */}
          <rect x="83" y="58" width="30" height="4" fill="#4338CA" />
          <ellipse cx="98" cy="58" rx="15" ry="5.5" fill="#6366F1" />
          <ellipse cx="98" cy="56" rx="15" ry="5.5" fill="#818CF8" />
          <text
            x="98"
            y="59"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="8.5"
            fontWeight="bold"
          >
            £
          </text>
        </g>

        <defs>
          <linearGradient
            id="pound-grad"
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
/* IncomeRevenueForm Main Page Component                                  */
/* ---------------------------------------------------------------------- */
export default function IncomeRevenueForm() {
  const router = useRouter();
  const [data, setData] = useState<IncomeData>(initialIncome);

  const { isLoading, isSaving, save, stepInfo } = useQuestionnaire({
    step: "income_revenue",
    onLoad: (section) => setData(toIncome(section.incomeAndRevenue)),
  });

  useEffect(() => {
    const mainEl = document.querySelector("main");
    if (mainEl) mainEl.scrollTop = 0;
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    await save({
      grossAnnualIncome: data.grossAnnualIncome,
      salaryTreatment: data.salaryTreatment,
      hasPrimaryBonus: data.hasPrimaryBonus,
      primaryIncomeRows: data.primaryIncomeRows,
      hasAlternativeIncome: data.hasAlternativeIncome,
      altIncomeRows: data.altIncomeRows,
    });
  };

  const handleSaveAndExit = async () => {
    try {
      await save({
        grossAnnualIncome: data.grossAnnualIncome,
        salaryTreatment: data.salaryTreatment,
        hasPrimaryBonus: data.hasPrimaryBonus,
        primaryIncomeRows: data.primaryIncomeRows,
        hasAlternativeIncome: data.hasAlternativeIncome,
        altIncomeRows: data.altIncomeRows,
      });
      router.push("/dashboard");
    } catch {
      router.push("/dashboard");
    }
  };

  if (isLoading) return <LoadingState />;

  return (
    <div className="min-h-full bg-[#F8FAFC] px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        {/* ============================================================== */}
        {/* Top Header Row                                                 */}
        {/* ============================================================== */}
        <div className="mb-7 flex items-start justify-between gap-6">
          <div>
            {/* Step Badge (above heading) */}
            <div className="mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1 text-[11.5px] font-semibold text-indigo-700 border border-indigo-100/90 shadow-2xs">
                Step {stepInfo.number} of {stepInfo.total}
              </span>
            </div>

            {/* Icon and Heading placed in a straight line */}
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F89AA8] via-[#E28691] to-[#C0374F] text-white shadow-md shadow-slate-900/10 ring-1 ring-white/30 ring-inset">
                <Banknote className="h-5.5 w-5.5 text-white stroke-[2.2] drop-shadow-xs" />
              </div>
              <h1 className="text-2xl sm:text-[27px] font-bold tracking-tight text-slate-900">
                Your Income &amp; Revenue
              </h1>
            </div>

            {/* Description text */}
            <p className="mt-2 pl-[58px] max-w-2xl text-[13.5px] leading-relaxed text-[#64748B]">
              Please tell us about all income you personally receive, including employment income, bonuses, investments, rental income and any other regular income sources.
            </p>
          </div>

          {/* Right decorative 3D £ card & coins graphic */}
          <IncomeGraphicIllustration />
        </div>

        {/* ============================================================== */}
        {/* Form Body                                                      */}
        {/* ============================================================== */}
        <form onSubmit={handleSubmit} noValidate>
          <IncomeFields data={data} onChange={setData} />

          {/* ============================================================ */}
          {/* Bottom Navigation                                           */}
          {/* ============================================================ */}
          <div className="mt-8 flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200/80">
            {/* Left: Save and exit link */}
            <button
              type="button"
              onClick={handleSaveAndExit}
              className="text-[13.5px] font-semibold text-[#5B4DF5] transition hover:text-[#4338CA] text-left cursor-pointer"
            >
              Save and exit
            </button>

            {/* Right: Back & Continue Buttons */}
            <div className="flex items-center gap-3">
              {stepInfo.prevPath && (
                <Link
                  href={stepInfo.prevPath}
                  className="inline-flex h-[42px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 text-[13.5px] font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:border-slate-300"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Link>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex h-[42px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-[#5B4DF5] hover:from-indigo-700 hover:to-[#4E3EEA] px-7 text-[13.5px] font-semibold text-white shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-[#5B4DF5]/30 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSaving ? "Saving..." : "Continue →"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
