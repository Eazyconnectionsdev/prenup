"use client";

import React from "react";
import { initialDeclarations } from "@/components/questionnaire/declarations";
import { LegalDeclarationFields } from "@/components/questionnaire/sections/LegalDeclarationFields";
import type { DeclarationsFormData } from "@/types/questionnaire/declarations";
import type { Props } from "@/types/case-detail/forms/legal-declarations";

/**
 * Staff view of a partner's Legal Declarations. It renders the same questions
 * and wording the couple answered, read only unless CM editing is on.
 */
export default function LegalDeclarations({ data = {}, isEditing, onChange }: Props) {
  const value: DeclarationsFormData = { ...initialDeclarations, ...(data ?? {}) };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Legal Declarations</h2>
        <p className="mt-1 text-sm text-slate-500">
          Background questions and declarations of understanding, completed independently by this
          partner.
        </p>
      </div>

      <LegalDeclarationFields
        data={value}
        readOnly={!isEditing}
        onChange={(patch) =>
          Object.entries(patch).forEach(([field, v]) => onChange(field, v))
        }
      />
    </div>
  );
}
