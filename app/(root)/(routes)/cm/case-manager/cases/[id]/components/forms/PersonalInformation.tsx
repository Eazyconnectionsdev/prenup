"use client";

import React from "react";

interface Props {
  data: any;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
}

function calculateAge(dobValue: string): number | null {
  if (!dobValue) return null;

  const dob = new Date(dobValue);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();

  const monthDiff = today.getMonth() - dob.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < dob.getDate())
  ) {
    age--;
  }

  return age;
}

function daysUntil(dateValue: string): number | null {
  if (!dateValue) return null;

  const target = new Date(dateValue);
  const today = new Date();

  const diffTime = target.getTime() - today.getTime();

  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default function PersonalInformation({
  data = {},
  isEditing,
  onChange,
}: Props) {
  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100 disabled:text-slate-600";

  const age = calculateAge(data?.dateOfBirth);
  const isUnderage = age !== null && age < 18;

  const diffDays = daysUntil(data?.marriageDate);
  const showTimelineWarning =
    diffDays !== null && diffDays >= 0 && diffDays < 28;

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Personal Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Complete this section using your own personal and financial
          information only. Your partner will complete a separate
          questionnaire using their own information.
        </p>
      </div>

      {/* Full Legal Name */}
      <div>
        <label className="block font-medium mb-2">
          Full Legal Name
        </label>

        <div className="grid md:grid-cols-3 gap-4">
          <input
            value={data?.firstName || ""}
            disabled={!isEditing}
            onChange={(e) =>
              onChange("firstName", e.target.value)
            }
            placeholder="First Name"
            className={inputClass}
          />

          <input
            value={data?.middleName || ""}
            disabled={!isEditing}
            onChange={(e) =>
              onChange("middleName", e.target.value)
            }
            placeholder="Middle Name(s)"
            className={inputClass}
          />

          <input
            value={data?.lastName || ""}
            disabled={!isEditing}
            onChange={(e) =>
              onChange("lastName", e.target.value)
            }
            placeholder="Last Name"
            className={inputClass}
          />
        </div>
      </div>

      {/* DOB & English */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-2">
            Date of Birth
          </label>

          <input
            type="date"
            value={data?.dateOfBirth || ""}
            disabled={!isEditing}
            onChange={(e) =>
              onChange("dateOfBirth", e.target.value)
            }
            className={inputClass}
          />

          {isUnderage && (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              Parties must be of legal age to execute a matrimonial
              agreement.
            </div>
          )}
        </div>

        <div>
          <label className="block font-medium mb-2">
            English Language Proficiency
          </label>

          <select
            value={data?.languageFluency || ""}
            disabled={!isEditing}
            onChange={(e) =>
              onChange("languageFluency", e.target.value)
            }
            className={inputClass}
          >
            <option value="">Select Option</option>
            <option value="Yes">
              Yes, fully fluent in English
            </option>
            <option value="No">
              No, language assistance needed
            </option>
          </select>
        </div>
      </div>

      {/* Nationality & Domicile */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-2">
            Nationality
          </label>

          <select
            value={data?.nationality || ""}
            disabled={!isEditing}
            onChange={(e) =>
              onChange("nationality", e.target.value)
            }
            className={inputClass}
          >
            <option value="">Select Country</option>
            <option value="GB">United Kingdom</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
            <option value="IE">Ireland</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-2">
            Domicile & Residency
          </label>

          <input
            value={data?.domicileStatus || ""}
            disabled={!isEditing}
            onChange={(e) =>
              onChange("domicileStatus", e.target.value)
            }
            placeholder="Country of domicile and current country of residence."
            className={inputClass}
          />
        </div>
      </div>

      {/* Profession */}
      <div>
        <label className="block font-medium mb-2">
          Current Profession / Occupation
        </label>

        <input
          value={data?.currentProfession || ""}
          disabled={!isEditing}
          onChange={(e) =>
            onChange("currentProfession", e.target.value)
          }
          placeholder="Primary Job Title"
          className={inputClass}
        />
      </div>

      {/* Address */}
      <div>
        <label className="block font-medium mb-2">
          Current Home Address
        </label>

        <div className="space-y-4">
          <input
            value={data?.street1 || ""}
            disabled={!isEditing}
            onChange={(e) =>
              onChange("street1", e.target.value)
            }
            placeholder="Street Address Line 1"
            className={inputClass}
          />

          <div className="grid md:grid-cols-3 gap-4">
            <input
              value={data?.city || ""}
              disabled={!isEditing}
              onChange={(e) =>
                onChange("city", e.target.value)
              }
              placeholder="City"
              className={inputClass}
            />

            <input
              value={data?.county || ""}
              disabled={!isEditing}
              onChange={(e) =>
                onChange("county", e.target.value)
              }
              placeholder="County"
              className={inputClass}
            />

            <input
              value={data?.postcode || ""}
              disabled={!isEditing}
              onChange={(e) =>
                onChange("postcode", e.target.value)
              }
              placeholder="Postcode"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Wedding Date */}
      <div>
        <label className="block font-medium mb-2">
          Planned Wedding Date
        </label>

        <input
          type="date"
          value={data?.marriageDate || ""}
          disabled={!isEditing}
          onChange={(e) =>
            onChange("marriageDate", e.target.value)
          }
          className={inputClass}
        />

        {showTimelineWarning && (
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
            <strong>⚠ Timeline Guidance:</strong> Prenuptial
            agreements are generally strongest when completed well
            before the wedding. If your wedding is less than 28 days
            away, your solicitor will discuss any potential
            implications with you.
          </div>
        )}
      </div>
    </div>
  );
}