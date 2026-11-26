"use client";

import React from "react";
import { FAMILY_FOOTNOTE, normalizeFamily } from "@/components/questionnaire/family";
import { FamilyFields } from "@/components/questionnaire/sections/FamilyFields";
import type { FamilyFormData } from "@/types/questionnaire/family";
import type { Props } from "@/types/case-detail/forms/family-dependents";

/**
 * Staff view of a partner's Family & Dependents answers. It renders the same
 * questions the couple answered, read only unless CM editing is on. Answers
 * saved by the earlier version of the form are shown in the current shape.
 */
export default function FamilyDependents({ data = {}, isEditing, onChange }: Props) {
  const value = normalizeFamily(data);

  const handleChange = (updater: (prev: FamilyFormData) => FamilyFormData) => {
    const next = updater(value);
    (Object.keys(next) as (keyof FamilyFormData)[]).forEach((field) => {
      if (next[field] !== value[field] || data?.[field] === undefined) {
        onChange(field, next[field]);
      }
    });
    // The first edit moves an older answer onto the current fields, so the
    // earlier ones are dropped rather than left to contradict them.
    if (data?.priorMarriageStatus !== undefined) onChange("priorMarriageStatus", undefined);
    if (data?.isLegallySeparated !== undefined) onChange("isLegallySeparated", undefined);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Family &amp; Dependents</h2>
        <p className="mt-1 text-sm text-slate-500">{FAMILY_FOOTNOTE}</p>
      </div>

      <FamilyFields data={value} readOnly={!isEditing} onChange={handleChange} />
    </div>
  );
}
