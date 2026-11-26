"use client";

import React, { useState } from "react";
import { UsersRound } from "lucide-react";
import { useQuestionnaire } from "@/components/questionnaire/useQuestionnaire";
import { useFormValidation } from "@/hooks/useFormValidation";
import { familySchema } from "@/lib/validations/questionnaire";
import {
  FormShell,
  LoadingState,
  SubmitBar,
} from "@/components/questionnaire/QuestionnaireUI";
import {
  FAMILY_DESCRIPTION,
  FAMILY_FOOTNOTE,
  initialFamilyData,
  normalizeFamily,
} from "@/components/questionnaire/family";
import { FamilyFields } from "@/components/questionnaire/sections/FamilyFields";
import type { FamilyFormData } from "@/types/questionnaire/family";

export default function FamilyDependentsForm() {
  const [formData, setFormData] = useState<FamilyFormData>(initialFamilyData);

  const { isLoading, isSaving, save, stepInfo } = useQuestionnaire({
    step: "family",
    onLoad: (section) => setFormData(normalizeFamily(section.familyAndDependents)),
  });

  const { errors, validate, clearError, summary } = useFormValidation(familySchema);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Follow-up answers behind a "No" are dropped so they cannot contradict it.
    const payload: FamilyFormData = {
      hasPriorRelationship: formData.hasPriorRelationship,
      priorRelationships:
        formData.hasPriorRelationship === "Yes" ? formData.priorRelationships : [],
      hasLivingChildren: formData.hasLivingChildren,
      children: formData.hasLivingChildren === "Yes" ? formData.children : [],
      futureParentalIntentions: formData.futureParentalIntentions,
      hasFamilyPets: formData.hasFamilyPets,
      petsDetails: formData.hasFamilyPets === "Yes" ? formData.petsDetails : "",
      hasOtherDependants: formData.hasOtherDependants,
      dependantsDetails: formData.hasOtherDependants === "Yes" ? formData.dependantsDetails : "",
    };

    if (!validate(payload)) return;

    await save(payload);
  };

  if (isLoading) return <LoadingState />;

  return (
    <FormShell
      title="Family & Dependents"
      stepLabel={`Step ${stepInfo.number} of ${stepInfo.total}`}
      icon={<UsersRound className="h-5 w-5" />}
      description={FAMILY_DESCRIPTION}
    >
      <form onSubmit={handleSubmit} noValidate>
        <FamilyFields
          data={formData}
          onChange={setFormData}
          errors={errors}
          clearError={clearError}
        />

        <p className="mt-6 text-[12px] leading-relaxed text-slate-500">{FAMILY_FOOTNOTE}</p>

        <SubmitBar
          isSaving={isSaving}
          label="Save & continue"
          withArrow
          backHref={stepInfo.prevPath || "/dashboard/legal-declaration"}
          errorSummary={summary}
        />
      </form>
    </FormShell>
  );
}
