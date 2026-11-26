"use client";

import React from "react";
import { BadgeCheck } from "lucide-react";
import { COUNTRIES } from "@/lib/countries";
import {
  CEREMONY_ACK_TEXT,
  CEREMONY_STATUS_LABELS,
  CEREMONY_STATUS_PRIORITY,
  ceremonyTimingStatus,
  daysUntilCeremony,
  type CeremonyTimingStatus,
} from "@/lib/ceremonyTiming";
import {
  DOMICILE_DETAIL_LABEL,
  DOMICILE_DETAIL_PLACEHOLDER,
  DOMICILE_QUESTION,
  LANGUAGE_NOTE,
  LANGUAGE_OPTIONS,
  PROFESSION_PLACEHOLDER,
  normalizePersonalInfo,
} from "@/components/questionnaire/sections/PersonalInfoFields";
import type { Props } from "@/types/case-detail/forms/personal-information";

function calculateAge(dobValue: string): number | null {
  if (!dobValue) return null;
  const dob = new Date(dobValue);
  if (Number.isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

const STATUS_STYLES: Record<CeremonyTimingStatus, string> = {
  STANDARD: "border-emerald-200 bg-emerald-50 text-emerald-800",
  TIGHT_TIMELINE_ACK: "border-amber-200 bg-amber-50 text-amber-900",
  UNDER_28_DAYS_BLOCKED: "border-rose-200 bg-rose-50 text-rose-800",
};

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-2 block font-medium">{children}</label>;
}

/**
 * Staff view of a partner's Personal Information. Read only unless CM editing
 * is on. Staff may save a date inside the 28-day window (the couple cannot);
 * the timing status is recalculated by the server on save.
 */
export default function PersonalInformation({ data = {}, isEditing, onChange }: Props) {
  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100 disabled:text-slate-600";

  const d = normalizePersonalInfo(data);

  const age = calculateAge(d.dateOfBirth);
  const isUnderage = age !== null && age < 18;

  const days = daysUntilCeremony(d.marriageDate);
  // The live calculation, since the stored status was correct only on the day it was saved.
  const timing = ceremonyTimingStatus(d.marriageDate);

  const text = (field: string, placeholder?: string, type = "text") => (
    <input
      type={type}
      value={String((d as unknown as Record<string, unknown>)[field] ?? "")}
      disabled={!isEditing}
      onChange={(e) => onChange(field, e.target.value)}
      placeholder={placeholder}
      className={inputClass}
    />
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
        <p className="mt-1 text-sm text-slate-500">
          This partner&apos;s own personal details, completed independently.
        </p>
      </div>

      {/* Ceremony timing — drives case priority */}
      {timing && (
        <div className={`rounded-xl border p-4 text-sm ${STATUS_STYLES[timing]}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold">
              {CEREMONY_STATUS_LABELS[timing]}
              {days !== null && days >= 0 && ` · ${days} day${days === 1 ? "" : "s"} until ceremony`}
              {days !== null && days < 0 && " · ceremony date has passed"}
            </span>
            <span className="rounded-full bg-white/70 px-2.5 py-0.5 text-xs font-bold ring-1 ring-black/10">
              Priority: {CEREMONY_STATUS_PRIORITY[timing]}
            </span>
          </div>
          {timing === "TIGHT_TIMELINE_ACK" && (
            <p className="mt-2 text-xs leading-relaxed">
              {d.ceremonyTimingAcknowledged ? "Acknowledged: " : "Not yet acknowledged: "}
              {CEREMONY_ACK_TEXT}
            </p>
          )}
          {timing === "UNDER_28_DAYS_BLOCKED" && (
            <p className="mt-2 text-xs leading-relaxed">
              The couple cannot save this date through the online process. Contact them to discuss
              alternative arrangements, such as a postnuptial agreement.
            </p>
          )}
        </div>
      )}

      {/* Full Legal Name */}
      <div>
        <Label>Full Legal Name</Label>
        <div className="grid gap-4 md:grid-cols-3">
          {text("firstName", "First Name")}
          {text("middleName", "Middle Name(s)")}
          {text("lastName", "Last Name")}
        </div>
      </div>

      {/* DOB & Nationality */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Date of Birth</Label>
          {text("dateOfBirth", undefined, "date")}
          {isUnderage && (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              Parties must be of legal age to execute a matrimonial agreement.
            </div>
          )}
        </div>
        <div>
          <Label>Nationality</Label>
          <select
            value={d.nationality}
            disabled={!isEditing}
            onChange={(e) => onChange("nationality", e.target.value)}
            className={inputClass}
          >
            <option value="">Select Country</option>
            {COUNTRIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Wedding date & profession */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Planned Wedding / Civil Partnership Date</Label>
          {text("marriageDate", undefined, "date")}
        </div>
        <div>
          <Label>Current Profession / Occupation</Label>
          {text("currentProfession", PROFESSION_PLACEHOLDER)}
        </div>
      </div>

      {/* Contact */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 flex items-center gap-2 font-medium">
            Email Address
            {d.email && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                <BadgeCheck className="h-3.5 w-3.5" /> Verified
              </span>
            )}
          </label>
          {/* The account email: never edited from here. */}
          <input type="email" value={d.email} disabled readOnly className={inputClass} />
        </div>
        <div>
          <Label>Mobile Telephone Number</Label>
          {text("mobilePhone", "Mobile number", "tel")}
        </div>
      </div>

      {/* Language & Domicile */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>English Language Proficiency</Label>
          <select
            value={d.languageFluency}
            disabled={!isEditing}
            onChange={(e) => {
              onChange("languageFluency", e.target.value);
              if (e.target.value !== "No") onChange("requiredLanguage", "");
            }}
            className={inputClass}
          >
            <option value="">Select Option</option>
            {LANGUAGE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {d.languageFluency === "No" && (
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <label className="mb-1.5 block text-sm font-semibold text-amber-900">
                Language required
              </label>
              {text("requiredLanguage", "e.g., Tamil, Hindi, Polish, French")}
              <p className="mt-2 text-xs text-amber-900">
                <strong>Note:</strong> {LANGUAGE_NOTE}
              </p>
            </div>
          )}
        </div>

        <div>
          <Label>{DOMICILE_QUESTION}</Label>
          <select
            value={d.ukDomiciled}
            disabled={!isEditing}
            onChange={(e) => {
              onChange("ukDomiciled", e.target.value);
              if (e.target.value !== "No") onChange("domicileStatus", "");
            }}
            className={inputClass}
          >
            <option value="">Select Option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          {(d.ukDomiciled === "No" || (!d.ukDomiciled && d.domicileStatus)) && (
            <div className="mt-3">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                {DOMICILE_DETAIL_LABEL}
              </label>
              {text("domicileStatus", DOMICILE_DETAIL_PLACEHOLDER)}
            </div>
          )}
        </div>
      </div>

      {/* Address */}
      <div>
        <Label>Current Home Address</Label>
        <div className="space-y-4">
          {text("street1", "Address line 1")}
          <input
            value={d.street2}
            disabled={!isEditing}
            onChange={(e) => {
              onChange("street2", e.target.value);
              // Older answers kept address line 2 in `county`.
              if (data?.county !== undefined) onChange("county", undefined);
            }}
            placeholder="Address line 2 (optional)"
            className={inputClass}
          />
          <div className="grid gap-4 md:grid-cols-3">
            {text("city", "Town or city")}
            {text("postcode", "Postcode")}
            <select
              value={d.country}
              disabled={!isEditing}
              onChange={(e) => onChange("country", e.target.value)}
              className={inputClass}
            >
              {COUNTRIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
