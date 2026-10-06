"use client";

import React from "react";
import { FieldLabel, Notice, inputClasses } from "../QuestionnaireUI";
import type { personalInfoFormData } from "@/types/questionnaire/personal-info";
import type { Props } from "@/types/questionnaire/personal-info-fields";

export const initialPersonalInfo: personalInfoFormData = {
  firstName: "",
  middleName: "",
  lastName: "",
  dateOfBirth: "",
  languageFluency: "",
  nationality: "",
  domicileStatus: "",
  currentProfession: "",
  street1: "",
  city: "",
  county: "",
  postcode: "",
  marriageDate: "",
};

export function calculateAge(dobValue: string): number | null {
  if (!dobValue) return null;
  const dob = new Date(dobValue);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

function daysUntil(dateValue: string): number | null {
  if (!dateValue) return null;
  const diffTime = new Date(dateValue).getTime() - new Date().getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

const NATIONALITIES = [
  { value: "GB", label: "United Kingdom" },
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
  { value: "IE", label: "Ireland" },
];

export function PersonalInfoFields({ data, onChange, readOnly }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange?.((prev) => ({ ...prev, [name]: value }));
  };

  // Shared props for every input bound to a field of `data`
  const bind = (name: keyof personalInfoFormData) => ({
    id: readOnly ? undefined : name,
    name,
    value: data[name] ?? "",
    onChange: handleChange,
    disabled: readOnly,
    className: inputClasses,
  });

  const age = calculateAge(data.dateOfBirth);
  const isUnderage = age !== null && age < 18;

  const diffDays = daysUntil(data.marriageDate);
  const showTimelineWarning = diffDays !== null && diffDays >= 0 && diffDays < 28;

  return (
    <div className="space-y-7">
      <div>
        <FieldLabel>Full legal name</FieldLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[2fr_1.5fr_2fr]">
          <input type="text" placeholder="First name" autoComplete="given-name" {...bind("firstName")} />
          <input
            type="text"
            placeholder="Middle name(s)"
            autoComplete="additional-name"
            {...bind("middleName")}
          />
          <input type="text" placeholder="Last name" autoComplete="family-name" {...bind("lastName")} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="dateOfBirth">Date of birth</FieldLabel>
          <input type="date" {...bind("dateOfBirth")} />
          {!readOnly && isUnderage && (
            <Notice tone="error">Parties must be of legal age to execute a matrimonial agreement.</Notice>
          )}
        </div>

        <div>
          <FieldLabel htmlFor="languageFluency">English language proficiency</FieldLabel>
          <select {...bind("languageFluency")}>
            <option value="">Select option</option>
            <option value="Yes">Yes, fully fluent in English</option>
            <option value="No">No, language assistance needed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="nationality">Nationality</FieldLabel>
          <select {...bind("nationality")}>
            <option value="">Select country</option>
            {NATIONALITIES.map((n) => (
              <option key={n.value} value={n.value}>
                {n.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <FieldLabel htmlFor="domicileStatus">Domicile &amp; residency</FieldLabel>
          <input
            type="text"
            placeholder="Country of domicile and current residence"
            maxLength={100}
            {...bind("domicileStatus")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="currentProfession">Current profession / occupation</FieldLabel>
          <input
            type="text"
            placeholder="Primary job title"
            autoComplete="organization-title"
            {...bind("currentProfession")}
          />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="street1">Current home address</FieldLabel>
        <input
          type="text"
          placeholder="Street address line 1"
          autoComplete="address-line1"
          {...bind("street1")}
          className={`${inputClasses} mb-3.5`}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[2fr_1fr_1fr]">
          <input type="text" placeholder="City" autoComplete="address-level2" {...bind("city")} />
          <input type="text" placeholder="County" autoComplete="address-level1" {...bind("county")} />
          <input type="text" placeholder="Postcode" autoComplete="postal-code" {...bind("postcode")} />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="marriageDate">Planned wedding date</FieldLabel>
        <input type="date" {...bind("marriageDate")} />
        {!readOnly && showTimelineWarning && (
          <Notice tone="warning">
            <strong>Timeline guidance:</strong> Prenuptial agreements are generally strongest when
            completed well before the wedding. If your wedding is less than 28 days away, your
            solicitor will discuss any potential implications with you.
          </Notice>
        )}
      </div>
    </div>
  );
}
