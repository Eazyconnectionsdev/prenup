"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
  UserRound,
  Globe,
  Home,
  ArrowLeft,
  Loader2,
  TriangleAlert,
  BadgeCheck,
  Phone,
} from "lucide-react";
import type { RootState } from "@/store/store";
import { useEditingPartnerForm } from "@/components/questionnaire/EditingPartnerContext";
import { CeremonyBlockedModal } from "@/components/questionnaire/CeremonyBlockedModal";
import {
  CEREMONY_ACK_TEXT,
  CEREMONY_DATE_TOOLTIP,
  ceremonyTimingStatus,
  daysUntilCeremony,
} from "@/lib/ceremonyTiming";
import { COUNTRIES } from "@/lib/countries";
import { useQuestionnaire } from "@/components/questionnaire/useQuestionnaire";
import { useJointSectionStatus } from "@/hooks/useJointSectionStatus";
import { useFormValidation } from "@/hooks/useFormValidation";
import { personalInfoSchema } from "@/lib/validations/questionnaire";
import {
  fieldClassesFor,
  LoadingState,
  Tooltip,
} from "@/components/questionnaire/QuestionnaireUI";
import {
  DOMICILE_DETAIL_LABEL,
  DOMICILE_DETAIL_PLACEHOLDER,
  DOMICILE_QUESTION,
  DOMICILE_TOOLTIP,
  LANGUAGE_NOTE,
  LANGUAGE_OPTIONS,
  LANGUAGE_TOOLTIP,
  PROFESSION_PLACEHOLDER,
  PROFESSION_TOOLTIP,
  normalizePersonalInfo,
} from "@/components/questionnaire/sections/PersonalInfoFields";
import type { personalInfoFormData } from "@/types/questionnaire/personal-info";

const fieldClasses =
  "w-full rounded-xl border border-slate-200 bg-[#FBFBFE] px-4 py-3 text-[13.5px] font-medium text-slate-900 transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 disabled:cursor-not-allowed disabled:opacity-60 min-h-[46px]";

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

/** A date whose year has been typed in full, not one still being typed. */
function isWholeYear(value: string): boolean {
  return Number(value?.slice(0, 4)) >= 1900;
}

export default function PersonalInfoForm() {
  const [formData, setFormData] = useState<personalInfoFormData>(() =>
    normalizePersonalInfo(null),
  );
  const [blockedOpen, setBlockedOpen] = useState(false);
  const { lockedOut: iAmWaitingForReview } = useJointSectionStatus();
  const user = useSelector((state: RootState) => state.auth.user);
  // While the partner who sent the case back edits the other partner's
  // answers, the signed-in account's own email and phone do not belong here.
  const editingPartner = useEditingPartnerForm();

  const { isLoading, isSaving, save, stepInfo } = useQuestionnaire({
    step: "personal-info",
    onLoad: (section) => {
      const saved = normalizePersonalInfo(section.personalInformation);
      setFormData({
        ...saved,
        email: saved.email || (!editingPartner ? user?.email ?? "" : ""),
        mobilePhone: saved.mobilePhone || (!editingPartner ? user?.phone ?? "" : ""),
      });
    },
  });

  // Pre-filled from the account (read only) when nothing has been saved yet.
  const email = formData.email || (!editingPartner ? (user?.email ?? "") : "");

  useEffect(() => {
    const mainEl = document.querySelector("main");
    if (mainEl) mainEl.scrollTop = 0;
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, []);

  const { errors, validate, clearError, summary } =
    useFormValidation(personalInfoSchema);

  // The field's own classes, tinted when it is the one that failed.
  const fieldCls = (name: keyof personalInfoFormData) =>
    fieldClassesFor(fieldClasses, errors[name]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // The message goes as soon as the field it pointed at is touched, rather
    // than staying red until the next submit.
    clearError(name);
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      // A follow-up answer behind a "No" is dropped when the "No" is.
      if (name === "languageFluency" && value !== "No") next.requiredLanguage = "";
      if (name === "ukDomiciled" && value !== "No") next.domicileStatus = "";
      return next;
    });
  };

  const handleMarriageDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    clearError("marriageDate");
    clearError("ceremonyTimingAcknowledged");
    // A new date needs its own acknowledgement.
    setFormData((prev) => ({ ...prev, marriageDate: value, ceremonyTimingAcknowledged: false }));
    // Typing the year digit by digit passes through dates like 0202-06-01;
    // the pop-up waits for a whole year rather than interrupting the typing.
    if (isWholeYear(value) && ceremonyTimingStatus(value) === "UNDER_28_DAYS_BLOCKED") {
      setBlockedOpen(true);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Inside the 28-day window the details cannot be saved online at all; the
    // pop-up explains why and comes back on every attempt.
    if (ceremonyTimingStatus(formData.marriageDate) === "UNDER_28_DAYS_BLOCKED") {
      setBlockedOpen(true);
      return;
    }

    const payload = {
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth,
      nationality: formData.nationality,
      currentProfession: formData.currentProfession,
      marriageDate: formData.marriageDate,
      ceremonyTimingAcknowledged: formData.ceremonyTimingAcknowledged,
      email,
      mobilePhone: formData.mobilePhone,
      languageFluency: formData.languageFluency,
      requiredLanguage: formData.languageFluency === "No" ? formData.requiredLanguage : "",
      ukDomiciled: formData.ukDomiciled,
      domicileStatus: formData.ukDomiciled === "No" ? formData.domicileStatus : "",
      street1: formData.street1,
      street2: formData.street2,
      city: formData.city,
      postcode: formData.postcode,
      country: formData.country,
    };

    // Nothing is sent until every required answer is in. validate() also takes
    // the person to the first field still outstanding.
    if (!validate(payload)) return;

    await save(payload);
  };

  if (isLoading) return <LoadingState />;

  const daysLeft = daysUntilCeremony(formData.marriageDate);
  const timing = isWholeYear(formData.marriageDate)
    ? ceremonyTimingStatus(formData.marriageDate)
    : null;

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
                <Field label="Legal first name" htmlFor="firstName" error={errors.firstName} required>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={fieldCls("firstName")}
                    placeholder="First name"
                  />
                </Field>
                <Field label="Middle name(s) (optional)" htmlFor="middleName" error={errors.middleName}>
                  <input
                    id="middleName"
                    name="middleName"
                    type="text"
                    autoComplete="additional-name"
                    value={formData.middleName}
                    onChange={handleChange}
                    className={fieldCls("middleName")}
                    placeholder="Middle name(s)"
                  />
                </Field>
                <Field label="Legal last name" htmlFor="lastName" error={errors.lastName} required>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={fieldCls("lastName")}
                    placeholder="Last name"
                  />
                </Field>
              </div>

              {/* Row 2: Date of birth *, Nationality * */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Date of birth" htmlFor="dateOfBirth" error={errors.dateOfBirth} required>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={fieldCls("dateOfBirth")}
                  />
                </Field>

                <Field label="Nationality" htmlFor="nationality" error={errors.nationality} required>
                  <select
                    id="nationality"
                    name="nationality"
                    required
                    value={formData.nationality}
                    onChange={handleChange}
                    className={fieldCls("nationality")}
                  >
                    <option value="">Select country</option>
                    {COUNTRIES.map((n) => (
                      <option key={n.value} value={n.value}>
                        {n.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* Row 3: Planned wedding date *, Current profession / occupation * */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="Planned wedding / civil partnership date"
                  htmlFor="marriageDate"
                  error={errors.marriageDate}
                  required
                  tooltip={CEREMONY_DATE_TOOLTIP}
                >
                  <input
                    id="marriageDate"
                    name="marriageDate"
                    type="date"
                    required
                    value={formData.marriageDate}
                    onChange={handleMarriageDateChange}
                    className={fieldCls("marriageDate")}
                  />
                  {daysLeft !== null && daysLeft >= 0 && !errors.marriageDate && (
                    <p className="mt-1.5 text-[11px] text-slate-500">
                      {daysLeft === 1 ? "1 day" : `${daysLeft} days`} until the ceremony
                    </p>
                  )}
                </Field>

                <Field
                  label="Current profession / occupation"
                  htmlFor="currentProfession"
                  error={errors.currentProfession}
                  required
                  tooltip={PROFESSION_TOOLTIP}
                >
                  <input
                    id="currentProfession"
                    name="currentProfession"
                    type="text"
                    required
                    value={formData.currentProfession}
                    onChange={handleChange}
                    className={fieldCls("currentProfession")}
                    placeholder={PROFESSION_PLACEHOLDER}
                    autoComplete="organization-title"
                  />
                </Field>
              </div>

              {/* 29-35 days: amber warning with a mandatory acknowledgement */}
              {timing === "TIGHT_TIMELINE_ACK" && (
                <div
                  data-error-path="ceremonyTimingAcknowledged"
                  className={`rounded-xl border p-4 text-[12.5px] leading-relaxed ${
                    errors.ceremonyTimingAcknowledged
                      ? "border-rose-300 bg-rose-50/60"
                      : "border-amber-200 bg-amber-50/80"
                  }`}
                >
                  <p className="flex items-start gap-2 font-semibold text-amber-900">
                    <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    Your ceremony is {daysLeft} days away. This is a tight timeline for preparing
                    your agreement.
                  </p>
                  <label
                    htmlFor="ceremonyTimingAcknowledged"
                    className="mt-3 flex cursor-pointer items-start gap-3 text-amber-950"
                  >
                    <input
                      id="ceremonyTimingAcknowledged"
                      type="checkbox"
                      checked={formData.ceremonyTimingAcknowledged}
                      onChange={(e) => {
                        clearError("ceremonyTimingAcknowledged");
                        setFormData((prev) => ({
                          ...prev,
                          ceremonyTimingAcknowledged: e.target.checked,
                        }));
                      }}
                      className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-indigo-600"
                    />
                    <span>
                      {CEREMONY_ACK_TEXT}
                      <span className="ml-1 font-bold text-red-500">*</span>
                    </span>
                  </label>
                  {errors.ceremonyTimingAcknowledged && (
                    <p className="mt-2 text-[11px] font-medium text-red-500">
                      {errors.ceremonyTimingAcknowledged}
                    </p>
                  )}
                </div>
              )}

              {/* 28 days or fewer: blocked; the pop-up explains */}
              {timing === "UNDER_28_DAYS_BLOCKED" && (
                <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-[12.5px] leading-relaxed text-rose-800">
                  <p className="font-semibold">
                    Your planned wedding or civil partnership date is within 28 days.
                  </p>
                  <p className="mt-1">
                    We cannot proceed with our standard online prenup process for this date, so
                    these details cannot be saved.{" "}
                    <button
                      type="button"
                      onClick={() => setBlockedOpen(true)}
                      className="font-semibold underline underline-offset-2 hover:text-rose-950"
                    >
                      What happens next?
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Contact details */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(99,102,241,0.06)] hover:border-slate-300/90 transition-all duration-300">
            <div className="mb-6 flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 via-violet-500 to-purple-600 text-white shadow-md shadow-violet-500/25 ring-1 ring-white/20 ring-inset">
                <Phone className="h-5.5 w-5.5 text-white stroke-[2.2]" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base sm:text-[17px] font-bold text-slate-900 tracking-tight">
                  Contact details
                </h2>
                <p className="mt-0.5 text-[12.5px] sm:text-[13px] text-slate-500 leading-relaxed">
                  How your case manager and solicitor can reach you.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 flex items-center gap-2 text-[13.5px] font-bold text-slate-900 leading-none"
                >
                  Email address
                  {email && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                      <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      Verified
                    </span>
                  )}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  readOnly
                  value={email}
                  className={`${fieldClasses} cursor-not-allowed bg-slate-50 text-slate-600`}
                />
                <p className="mt-1.5 text-[11px] text-slate-500">
                  From your account registration. It cannot be changed here.
                </p>
              </div>

              <Field
                label="Mobile telephone number"
                htmlFor="mobilePhone"
                error={errors.mobilePhone}
                required
              >
                <input
                  id="mobilePhone"
                  name="mobilePhone"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={formData.mobilePhone}
                  onChange={handleChange}
                  className={fieldCls("mobilePhone")}
                  placeholder="e.g., 07700 900123"
                />
              </Field>
            </div>
          </div>

          {/* Card 3: Language and residency */}
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

            <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
              <div>
                <Field
                  label="English language proficiency"
                  htmlFor="languageFluency"
                  error={errors.languageFluency}
                  required
                  tooltip={LANGUAGE_TOOLTIP}
                >
                  <select
                    id="languageFluency"
                    name="languageFluency"
                    required
                    value={formData.languageFluency}
                    onChange={handleChange}
                    className={fieldCls("languageFluency")}
                  >
                    <option value="">Select option</option>
                    {LANGUAGE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </Field>

                {formData.languageFluency === "No" && (
                  <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/80 p-4">
                    <label
                      htmlFor="requiredLanguage"
                      className="mb-2 block text-[13px] font-bold text-amber-900"
                    >
                      Which language do you require?
                      <span className="ml-1 font-bold text-red-500">*</span>
                    </label>
                    <input
                      id="requiredLanguage"
                      name="requiredLanguage"
                      type="text"
                      required
                      maxLength={80}
                      value={formData.requiredLanguage}
                      onChange={handleChange}
                      className={fieldClassesFor(`${fieldClasses} bg-white`, errors.requiredLanguage)}
                      placeholder="e.g., Tamil, Hindi, Polish, French"
                    />
                    {errors.requiredLanguage && (
                      <p className="mt-1.5 text-[11px] font-medium text-red-500">
                        {errors.requiredLanguage}
                      </p>
                    )}
                    <p className="mt-2 text-[12px] leading-relaxed text-amber-900">
                      <strong>Note:</strong> {LANGUAGE_NOTE}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <Field
                  label={DOMICILE_QUESTION}
                  htmlFor="ukDomiciled"
                  error={errors.ukDomiciled}
                  required
                  tooltip={DOMICILE_TOOLTIP}
                >
                  <select
                    id="ukDomiciled"
                    name="ukDomiciled"
                    required
                    value={formData.ukDomiciled}
                    onChange={handleChange}
                    className={fieldCls("ukDomiciled")}
                  >
                    <option value="">Select option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </Field>

                {formData.ukDomiciled === "No" && (
                  <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                    <Field
                      label={DOMICILE_DETAIL_LABEL}
                      htmlFor="domicileStatus"
                      error={errors.domicileStatus}
                      required
                    >
                      <input
                        id="domicileStatus"
                        name="domicileStatus"
                        type="text"
                        required
                        maxLength={160}
                        value={formData.domicileStatus}
                        onChange={handleChange}
                        className={fieldClassesFor(`${fieldClasses} bg-white`, errors.domicileStatus)}
                        placeholder={DOMICILE_DETAIL_PLACEHOLDER}
                      />
                    </Field>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card 4: Home address */}
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
              <Field label="Address line 1" htmlFor="street1" error={errors.street1} required>
                <input
                  id="street1"
                  name="street1"
                  type="text"
                  required
                  autoComplete="address-line1"
                  value={formData.street1}
                  onChange={handleChange}
                  className={fieldCls("street1")}
                  placeholder="Street address line 1"
                />
              </Field>

              <Field label="Address line 2 (optional)" htmlFor="street2" error={errors.street2}>
                <input
                  id="street2"
                  name="street2"
                  type="text"
                  autoComplete="address-line2"
                  value={formData.street2}
                  onChange={handleChange}
                  className={fieldCls("street2")}
                  placeholder="Apartment, suite, unit, etc."
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Town or city" htmlFor="city" error={errors.city} required>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    autoComplete="address-level2"
                    value={formData.city}
                    onChange={handleChange}
                    className={fieldCls("city")}
                    placeholder="Town or city"
                  />
                </Field>
                <Field label="Postcode" htmlFor="postcode" error={errors.postcode} required>
                  <input
                    id="postcode"
                    name="postcode"
                    type="text"
                    required
                    autoComplete="postal-code"
                    value={formData.postcode}
                    onChange={handleChange}
                    className={fieldCls("postcode")}
                    placeholder="Postcode"
                  />
                </Field>
                <Field label="Country" htmlFor="country" error={errors.country} required>
                  <select
                    id="country"
                    name="country"
                    required
                    autoComplete="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={fieldCls("country")}
                  >
                    {COUNTRIES.map((n) => (
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

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              {summary && (
                <p
                  role="alert"
                  className="flex items-center gap-2 text-[12.5px] font-semibold text-rose-600 sm:mr-1"
                >
                  <TriangleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {summary}
                </p>
              )}
              <Link
                href="/dashboard"
                className="inline-flex h-[42px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 text-[13.5px] font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:border-slate-300"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
              <button
                type="submit"
                disabled={isSaving || iAmWaitingForReview}
                className="inline-flex h-[42px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-[#5B4DF5] hover:from-indigo-700 hover:to-[#4E3EEA] px-7 text-[13.5px] font-semibold text-white shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-[#5B4DF5]/30 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSaving ? "Saving..." : "Continue →"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <CeremonyBlockedModal open={blockedOpen} onClose={() => setBlockedOpen(false)} />
    </div>
  );
}
