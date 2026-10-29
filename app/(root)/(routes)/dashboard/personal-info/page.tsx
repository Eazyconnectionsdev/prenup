"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { UserRound, Globe, Home, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useQuestionnaire } from "@/components/questionnaire/useQuestionnaire";
import { LoadingState, Tooltip } from "@/components/questionnaire/QuestionnaireUI";
import {
  calculateAge,
  initialPersonalInfo,
} from "@/components/questionnaire/sections/PersonalInfoFields";
import type { personalInfoFormData } from "@/types/questionnaire/personal-info";

const fieldClasses =
  "w-full rounded-xl border border-slate-200 bg-[#FBFBFE] px-4 py-3 text-[13.5px] font-medium text-slate-900 transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 disabled:cursor-not-allowed disabled:opacity-60 min-h-[46px]";

const NATIONALITIES = [
  { value: "GB", label: "United Kingdom" },
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
  { value: "IE", label: "Ireland" },
];

function Field({
  label,
  htmlFor,
  required,
  error,
  hint,
  tooltip,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  tooltip?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 flex items-center text-[13.5px] font-bold text-slate-900 leading-none"
      >
        <span>
          {label}
          {required && <span className="ml-1 text-red-500 font-bold">*</span>}
        </span>
        {tooltip && <Tooltip text={tooltip} />}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-[11px] font-medium text-red-500">{error}</p>
      ) : (
        hint && <p className="mt-1.5 text-[11px] text-slate-500">{hint}</p>
      )}
    </div>
  );
}

function daysUntil(dateValue: string): number | null {
  if (!dateValue) return null;
  const diffTime = new Date(dateValue).getTime() - new Date().getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default function PersonalInfoForm() {
  const [formData, setFormData] = useState<personalInfoFormData>(initialPersonalInfo);

  const { isLoading, isSaving, save, stepInfo } = useQuestionnaire({
    step: "personal-info",
    onLoad: (section) =>
      setFormData((prev) => ({ ...prev, ...section.personalInformation })),
  });

  useEffect(() => {
    const mainEl = document.querySelector("main");
    if (mainEl) mainEl.scrollTop = 0;
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const age = calculateAge(formData.dateOfBirth);
    if (age !== null && age < 18) {
      toast.error("Parties must be at least 18 years of age.");
      return;
    }

    await save({
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth,
      languageFluency: formData.languageFluency,
      nationality: formData.nationality,
      domicileStatus: formData.domicileStatus,
      currentProfession: formData.currentProfession,
      street1: formData.street1,
      city: formData.city,
      county: formData.county,
      postcode: formData.postcode,
      marriageDate: formData.marriageDate,
    });
  };

  if (isLoading) return <LoadingState />;

  const diffDays = daysUntil(formData.marriageDate);
  const showTimelineWarning =
    diffDays !== null && diffDays >= 0 && diffDays < 28;

  return (
    <div className="min-h-full bg-[#F8FAFC] px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        {/* Top Header Row matching Income & Revenue */}
        <div className="mb-7 flex items-start justify-between gap-6">
          <div>
            <div className="mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1 text-[11.5px] font-semibold text-indigo-700 border border-indigo-100/90 shadow-2xs">
                Step {stepInfo?.number || 1} of {stepInfo?.total || 6}
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F89AA8] via-[#E28691] to-[#C0374F] text-white shadow-md shadow-slate-900/10 ring-1 ring-white/30 ring-inset">
                <UserRound className="h-5.5 w-5.5 text-white stroke-[2.2] drop-shadow-xs" />
              </div>
              <h1 className="text-2xl sm:text-[27px] font-bold tracking-tight text-slate-900">
                Personal Information
              </h1>
            </div>

            <p className="mt-2 pl-[58px] max-w-2xl text-[13.5px] leading-relaxed text-[#64748B]">
              Complete this section using your own personal and financial information only. Your partner will complete a separate questionnaire using their own information.
            </p>
          </div>

          {/* Right 3D decorative illustration */}
          <div className="relative hidden md:flex items-center justify-center shrink-0 select-none">
            <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-200/40 via-purple-200/30 to-pink-200/20 rounded-3xl blur-xl" />
            <svg
              width="136"
              height="98"
              viewBox="0 0 136 98"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10 drop-shadow-[0_8px_20px_rgba(99,102,241,0.16)]"
            >
              <path d="M10 22L11.5 17L16.5 15.5L11.5 14L10 9L8.5 14L3.5 15.5L8.5 17L10 22Z" fill="#818CF8" opacity="0.9" />
              <path d="M128 28L129 24L133 23L129 22L128 18L127 22L123 23L127 24L128 28Z" fill="#A78BFA" opacity="0.85" />
              <g>
                <rect x="24" y="6" width="68" height="84" rx="12" fill="#FFFFFF" stroke="#E0E7FF" strokeWidth="1.5" />
                <rect x="32" y="16" width="24" height="4" rx="2" fill="#E2E8F0" />
                <rect x="32" y="24" width="30" height="3" rx="1.5" fill="#EEF2F6" />
                <rect x="32" y="30" width="24" height="3" rx="1.5" fill="#EEF2F6" />
                <line x1="32" y1="40" x2="84" y2="40" stroke="#EEF2F6" strokeWidth="1.5" strokeDasharray="2 2" />
                <rect x="32" y="47" width="40" height="3" rx="1.5" fill="#EEF2F6" />
                <rect x="32" y="54" width="46" height="3" rx="1.5" fill="#F1F5F9" />
                <rect x="32" y="61" width="30" height="3" rx="1.5" fill="#F1F5F9" />
                <circle cx="74" cy="24" r="13" fill="#6366F1" />
                <path d="M70 24L73 27L79 21" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </g>
              <g>
                <ellipse cx="98" cy="78" rx="15" ry="5.5" fill="#6366F1" />
                <rect x="83" y="74" width="30" height="4" fill="#4F46E5" />
                <ellipse cx="98" cy="74" rx="15" ry="5.5" fill="#818CF8" />
                <rect x="83" y="67" width="30" height="4" fill="#6366F1" />
                <ellipse cx="98" cy="67" rx="15" ry="5.5" fill="#818CF8" />
                <ellipse cx="98" cy="65" rx="15" ry="5.5" fill="#A5B4FC" />
              </g>
            </svg>
          </div>
        </div>

        {/* Container Form with 3 Distinct Cards */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-6"
        >
          {/* Card 1: Personal details */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(99,102,241,0.06)] hover:border-slate-300/90 transition-all duration-300">
            <div className="mb-6 flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25 ring-1 ring-white/20 ring-inset [&>svg]:h-5.5 [&>svg]:w-5.5 [&>svg]:stroke-[2.2] [&>svg]:text-white [&>svg]:drop-shadow-xs">
                <UserRound className="h-5.5 w-5.5 text-white stroke-[2.2]" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base sm:text-[17px] font-bold text-slate-900 tracking-tight">
                  Personal details
                </h2>
                <p className="mt-0.5 text-[12.5px] sm:text-[13px] text-slate-500 leading-relaxed">
                  Enter your full legal name and basic information.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Row 1: Legal first name *, Middle name(s) (optional), Legal last name * */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Legal first name" htmlFor="firstName" required>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={fieldClasses}
                    placeholder="First name"
                  />
                </Field>
                <Field label="Middle name(s) (optional)" htmlFor="middleName">
                  <input
                    id="middleName"
                    name="middleName"
                    type="text"
                    autoComplete="additional-name"
                    value={formData.middleName}
                    onChange={handleChange}
                    className={fieldClasses}
                    placeholder="Middle name(s)"
                  />
                </Field>
                <Field label="Legal last name" htmlFor="lastName" required>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={fieldClasses}
                    placeholder="Last name"
                  />
                </Field>
              </div>

              {/* Row 2: Date of birth *, Nationality * */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Date of birth" htmlFor="dateOfBirth" required>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={fieldClasses}
                  />
                </Field>

                <Field label="Nationality" htmlFor="nationality" required>
                  <select
                    id="nationality"
                    name="nationality"
                    required
                    value={formData.nationality}
                    onChange={handleChange}
                    className={fieldClasses}
                  >
                    <option value="">Select country</option>
                    {NATIONALITIES.map((n) => (
                      <option key={n.value} value={n.value}>
                        {n.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* Row 3: Planned wedding date, Current profession / occupation */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="Planned wedding date"
                  htmlFor="marriageDate"
                  tooltip="Prenuptial agreements are generally strongest when completed well in advance of the ceremony. If your wedding or registration is within 28 days, additional legal considerations may apply."
                >
                  <input
                    id="marriageDate"
                    name="marriageDate"
                    type="date"
                    value={formData.marriageDate}
                    onChange={handleChange}
                    className={fieldClasses}
                  />
                  {showTimelineWarning && (
                    <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-800 leading-relaxed">
                      <strong>Timeline guidance:</strong> Prenuptial agreements are
                      generally strongest when completed well before the wedding. If your
                      wedding is less than 28 days away, your solicitor will discuss any
                      potential implications with you.
                    </p>
                  )}
                </Field>

                <Field
                  label="Current profession / occupation"
                  htmlFor="currentProfession"
                  tooltip="Please provide your current occupation, business role, or primary source of income."
                >
                  <input
                    id="currentProfession"
                    name="currentProfession"
                    type="text"
                    value={formData.currentProfession}
                    onChange={handleChange}
                    className={fieldClasses}
                    placeholder="Primary job title"
                    autoComplete="organization-title"
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* Card 2: Language and residency */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(99,102,241,0.06)] hover:border-slate-300/90 transition-all duration-300">
            <div className="mb-6 flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/25 ring-1 ring-white/20 ring-inset [&>svg]:h-5.5 [&>svg]:w-5.5 [&>svg]:stroke-[2.2] [&>svg]:text-white [&>svg]:drop-shadow-xs">
                <Globe className="h-5.5 w-5.5 text-white stroke-[2.2]" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base sm:text-[17px] font-bold text-slate-900 tracking-tight">
                  Language and residency
                </h2>
                <p className="mt-0.5 text-[12.5px] sm:text-[13px] text-slate-500 leading-relaxed">
                  Let us know about your language proficiency and where you live.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Row 1: English language proficiency *, Domicile & residency * */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="English language proficiency"
                  htmlFor="languageFluency"
                  required
                  tooltip="If English is not your first language, your solicitor may recommend independent translation assistance before signing any legal documents."
                >
                  <select
                    id="languageFluency"
                    name="languageFluency"
                    required
                    value={formData.languageFluency}
                    onChange={handleChange}
                    className={fieldClasses}
                  >
                    <option value="">Select option</option>
                    <option value="Yes">Yes, fully fluent in English</option>
                    <option value="No">No, language assistance needed</option>
                  </select>
                </Field>

                <Field
                  label="Domicile & residency"
                  htmlFor="domicileStatus"
                  required
                  tooltip="Your domicile and country of residence may affect which courts have jurisdiction over your agreement. For example, you may live abroad while remaining domiciled in England or Wales."
                >
                  <input
                    id="domicileStatus"
                    name="domicileStatus"
                    type="text"
                    required
                    value={formData.domicileStatus}
                    onChange={handleChange}
                    className={fieldClasses}
                    placeholder="Country of domicile and current residence"
                    maxLength={100}
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* Card 3: Home address */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(99,102,241,0.06)] hover:border-slate-300/90 transition-all duration-300">
            <div className="mb-6 flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25 ring-1 ring-white/20 ring-inset [&>svg]:h-5.5 [&>svg]:w-5.5 [&>svg]:stroke-[2.2] [&>svg]:text-white [&>svg]:drop-shadow-xs">
                <Home className="h-5.5 w-5.5 text-white stroke-[2.2]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-[17px] font-bold text-slate-900 tracking-tight">
                    Home address
                  </h2>
                  <Tooltip text="Please provide your primary residential address. This is required for identification and legal jurisdiction purposes." />
                </div>
                <p className="mt-0.5 text-[12.5px] sm:text-[13px] text-slate-500 leading-relaxed">
                  Enter your current residential address.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Row 1: Address line 1 */}
              <Field label="Address line 1" htmlFor="street1">
                <input
                  id="street1"
                  name="street1"
                  type="text"
                  autoComplete="address-line1"
                  value={formData.street1}
                  onChange={handleChange}
                  className={fieldClasses}
                  placeholder="Street address line 1"
                />
              </Field>

              {/* Row 2: Address line 2 (optional) */}
              <Field label="Address line 2 (optional)" htmlFor="county">
                <input
                  id="county"
                  name="county"
                  type="text"
                  autoComplete="address-line2"
                  value={formData.county}
                  onChange={handleChange}
                  className={fieldClasses}
                  placeholder="Apartment, suite, unit, etc."
                />
              </Field>

              {/* Row 3: Town or city, Postcode, Country * */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Town or city" htmlFor="city">
                  <input
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="address-level2"
                    value={formData.city}
                    onChange={handleChange}
                    className={fieldClasses}
                    placeholder="Town or city"
                  />
                </Field>
                <Field label="Postcode" htmlFor="postcode">
                  <input
                    id="postcode"
                    name="postcode"
                    type="text"
                    autoComplete="postal-code"
                    value={formData.postcode}
                    onChange={handleChange}
                    className={fieldClasses}
                    placeholder="Postcode"
                  />
                </Field>
                <Field label="Country" htmlFor="country" required>
                  <select
                    id="country"
                    name="nationality"
                    value={formData.nationality || "GB"}
                    onChange={handleChange}
                    className={fieldClasses}
                  >
                    {NATIONALITIES.map((n) => (
                      <option key={n.value} value={n.value}>
                        {n.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>
          </div>

          {/* Save & continue bar matching screenshot */}
          <div className="mt-8 flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200/80">
            <Link
              href="/dashboard"
              className="text-[13.5px] font-semibold text-[#5B4DF5] transition hover:text-[#4338CA] text-left cursor-pointer"
            >
              Save and exit
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex h-[42px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 text-[13.5px] font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:border-slate-300"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
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
