"use client";

import React from "react";
import { BadgeCheck, Globe, Home, Phone, UserRound } from "lucide-react";
import { FieldLabel, Notice, SectionCard, inputClasses } from "../QuestionnaireUI";
import { COUNTRIES, DEFAULT_COUNTRY } from "@/lib/countries";
import {
  CEREMONY_ACK_TEXT,
  ceremonyTimingStatus,
} from "@/lib/ceremonyTiming";
import type { personalInfoFormData } from "@/types/questionnaire/personal-info";
import type { Props } from "@/types/questionnaire/personal-info-fields";

export const initialPersonalInfo: personalInfoFormData = {
  firstName: "",
  middleName: "",
  lastName: "",
  dateOfBirth: "",
  nationality: "",
  currentProfession: "",
  marriageDate: "",
  ceremonyTimingAcknowledged: false,
  email: "",
  mobilePhone: "",
  languageFluency: "",
  requiredLanguage: "",
  ukDomiciled: "",
  domicileStatus: "",
  street1: "",
  street2: "",
  city: "",
  postcode: "",
  country: DEFAULT_COUNTRY,
};

/* ---------------------------------------------------------------------- */
/* Wording shared by the couple's form, the partner view and staff views   */
/* ---------------------------------------------------------------------- */

export const LANGUAGE_OPTIONS = [
  { value: "Yes", label: "Yes, I am fully fluent in English" },
  { value: "No", label: "No, I require language assistance" },
];

export const LANGUAGE_NOTE =
  "Your solicitor will be notified. Additional charges will apply for arranging an interpreter or translation.";

export const LANGUAGE_TOOLTIP =
  "If English is not your first language, your solicitor may recommend independent translation assistance before signing any legal documents.";

export const DOMICILE_QUESTION = "Are you currently living and domiciled in the UK?";
export const DOMICILE_DETAIL_LABEL = "Please state your country of current residence and domicile";
export const DOMICILE_DETAIL_PLACEHOLDER = "e.g., Living in UK, domiciled in India";
export const DOMICILE_TOOLTIP =
  "Your domicile and country of residence may affect which courts have jurisdiction over your agreement. For example, you may live abroad while remaining domiciled in England or Wales.";

export const PROFESSION_PLACEHOLDER = "e.g., Software Engineer, Teacher, Homemaker, Retired, Student";
export const PROFESSION_TOOLTIP =
  "Solicitors require your current occupation or employment status (including if you are a homemaker, student, or retired) for identity checks and to assess future earning capacity.";

/**
 * Brings answers saved by an older version of the form into the current shape:
 * address line 2 used to be stored as `county`, the address country was not
 * stored at all, and domicile was a single free-text box.
 */
export function normalizePersonalInfo(
  saved: Partial<personalInfoFormData> | undefined | null,
): personalInfoFormData {
  const s = (saved ?? {}) as Partial<personalInfoFormData>;
  const merged = { ...initialPersonalInfo, ...s };
  return {
    ...merged,
    street2: s.street2 ?? s.county ?? "",
    country: s.country || DEFAULT_COUNTRY,
    ceremonyTimingAcknowledged: s.ceremonyTimingAcknowledged === true,
    // An older free-text domicile answer is kept as the detail; the Yes/No is
    // left for the person to choose rather than guessed from the text.
    ukDomiciled: s.ukDomiciled ?? "",
  };
}

/* ---------------------------------------------------------------------- */
/* Read-only view (the partner's answers)                                  */
/* ---------------------------------------------------------------------- */

export function PersonalInfoFields({ data, readOnly }: Props) {
  // Shared props for every read-only input bound to a field of `data`
  const bind = (name: keyof personalInfoFormData) => ({
    value: String(data[name] ?? ""),
    disabled: true,
    readOnly: true,
    className: inputClasses,
  });

  const timing = ceremonyTimingStatus(data.marriageDate);

  return (
    <div className="space-y-6">
      {/* Card 1: Personal details */}
      <SectionCard
        title="Personal details"
        subtitle="Full legal name and basic information."
        icon={<UserRound className="h-5.5 w-5.5 text-white stroke-[2.2]" />}
        colorIndex={0}
      >
        <div className="space-y-5">
          <div>
            <FieldLabel className="mb-2 block text-[13.5px] font-bold text-slate-900">
              Full legal name
            </FieldLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[2fr_1.5fr_2fr]">
              <input type="text" placeholder="First name" {...bind("firstName")} />
              <input type="text" placeholder="Middle name(s)" {...bind("middleName")} />
              <input type="text" placeholder="Last name" {...bind("lastName")} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel className="mb-2 block text-[13.5px] font-bold text-slate-900">
                Date of birth
              </FieldLabel>
              <input type="date" {...bind("dateOfBirth")} />
            </div>
            <div>
              <FieldLabel className="mb-2 block text-[13.5px] font-bold text-slate-900">
                Nationality
              </FieldLabel>
              <select {...bind("nationality")}>
                <option value="">Not answered</option>
                {COUNTRIES.map((n) => (
                  <option key={n.value} value={n.value}>
                    {n.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel className="mb-2 block text-[13.5px] font-bold text-slate-900">
                Planned wedding / civil partnership date
              </FieldLabel>
              <input type="date" {...bind("marriageDate")} />
              {!readOnly && timing === "UNDER_28_DAYS_BLOCKED" && (
                <Notice tone="error">This date is within 28 days of the ceremony.</Notice>
              )}
              {timing === "TIGHT_TIMELINE_ACK" && data.ceremonyTimingAcknowledged && (
                <Notice tone="warning">
                  <strong>Timing acknowledged:</strong> {CEREMONY_ACK_TEXT}
                </Notice>
              )}
            </div>
            <div>
              <FieldLabel className="mb-2 block text-[13.5px] font-bold text-slate-900">
                Current profession / occupation
              </FieldLabel>
              <input type="text" placeholder={PROFESSION_PLACEHOLDER} {...bind("currentProfession")} />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Card 2: Contact details */}
      <SectionCard
        title="Contact details"
        icon={<Phone className="h-5.5 w-5.5 text-white stroke-[2.2]" />}
        colorIndex={3}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel className="mb-2 flex items-center gap-2 text-[13.5px] font-bold text-slate-900">
              Email address
              {data.email && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                  <BadgeCheck className="h-3.5 w-3.5" /> Verified
                </span>
              )}
            </FieldLabel>
            <input type="email" {...bind("email")} />
          </div>
          <div>
            <FieldLabel className="mb-2 block text-[13.5px] font-bold text-slate-900">
              Mobile telephone number
            </FieldLabel>
            <input type="tel" {...bind("mobilePhone")} />
          </div>
        </div>
      </SectionCard>

      {/* Card 3: Language and residency */}
      <SectionCard
        title="Language and residency"
        icon={<Globe className="h-5.5 w-5.5 text-white stroke-[2.2]" />}
        colorIndex={1}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel className="mb-2 block text-[13.5px] font-bold text-slate-900">
              English language proficiency
            </FieldLabel>
            <select {...bind("languageFluency")}>
              <option value="">Not answered</option>
              {LANGUAGE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {data.languageFluency === "No" && (
              <div className="mt-3">
                <FieldLabel className="mb-2 block text-[13px] font-bold text-slate-900">
                  Language required
                </FieldLabel>
                <input type="text" {...bind("requiredLanguage")} />
              </div>
            )}
          </div>

          <div>
            <FieldLabel className="mb-2 block text-[13.5px] font-bold text-slate-900">
              {DOMICILE_QUESTION}
            </FieldLabel>
            <select {...bind("ukDomiciled")}>
              <option value="">Not answered</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            {(data.ukDomiciled === "No" || (!data.ukDomiciled && data.domicileStatus)) && (
              <div className="mt-3">
                <FieldLabel className="mb-2 block text-[13px] font-bold text-slate-900">
                  {DOMICILE_DETAIL_LABEL}
                </FieldLabel>
                <input type="text" {...bind("domicileStatus")} />
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      {/* Card 4: Home address */}
      <SectionCard
        title="Home address"
        icon={<Home className="h-5.5 w-5.5 text-white stroke-[2.2]" />}
        colorIndex={2}
      >
        <div className="space-y-4">
          <div>
            <FieldLabel className="mb-2 block text-[13.5px] font-bold text-slate-900">
              Address line 1
            </FieldLabel>
            <input type="text" {...bind("street1")} />
          </div>
          <div>
            <FieldLabel className="mb-2 block text-[13.5px] font-bold text-slate-900">
              Address line 2
            </FieldLabel>
            <input type="text" {...bind("street2")} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <FieldLabel className="mb-2 block text-[13.5px] font-bold text-slate-900">
                Town or city
              </FieldLabel>
              <input type="text" {...bind("city")} />
            </div>
            <div>
              <FieldLabel className="mb-2 block text-[13.5px] font-bold text-slate-900">
                Postcode
              </FieldLabel>
              <input type="text" {...bind("postcode")} />
            </div>
            <div>
              <FieldLabel className="mb-2 block text-[13.5px] font-bold text-slate-900">
                Country
              </FieldLabel>
              <select {...bind("country")}>
                {COUNTRIES.map((n) => (
                  <option key={n.value} value={n.value}>
                    {n.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
