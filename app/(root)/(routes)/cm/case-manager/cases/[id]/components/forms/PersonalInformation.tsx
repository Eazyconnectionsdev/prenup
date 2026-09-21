"use client";

import React from "react";

interface Props {
  data: any;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
}

export default function PersonalInformation({
data = {},
isEditing,
onChange,
}: Props) {
  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm";

  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Personal Information
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Complete this section using your own personal information.
        </p>
      </div>

      {/* Name */}

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
            placeholder="Middle Name"
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

      {/* DOB */}

      <div>
        <label className="block font-medium mb-2">
          Date Of Birth
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
      </div>

      {/* English */}

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
          <option value="">Select</option>
          <option value="Yes">
            Yes, fully fluent
          </option>
          <option value="No">
            Language assistance needed
          </option>
        </select>
      </div>

      {/* Nationality */}

      <div>
        <label className="block font-medium mb-2">
          Nationality
        </label>

        <input
          value={data?.nationality || ""}
          disabled={!isEditing}
          onChange={(e) =>
            onChange("nationality", e.target.value)
          }
          className={inputClass}
        />
      </div>

      {/* Domicile */}

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
          className={inputClass}
        />
      </div>

      {/* Profession */}

      <div>
        <label className="block font-medium mb-2">
          Profession
        </label>

        <input
          value={data?.currentProfession || ""}
          disabled={!isEditing}
          onChange={(e) =>
            onChange("currentProfession", e.target.value)
          }
          className={inputClass}
        />
      </div>

      {/* Address */}

      <div>
        <label className="block font-medium mb-2">
          Address
        </label>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            value={data?.street1 || ""}
            disabled={!isEditing}
            onChange={(e) =>
              onChange("street1", e.target.value)
            }
            placeholder="Street"
            className={inputClass}
          />

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

      {/* Wedding */}

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
      </div>

    </div>
  );
}