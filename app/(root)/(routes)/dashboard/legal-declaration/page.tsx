"use client";

import React, { useState } from "react";
import { FileText } from "lucide-react";
import { useQuestionnaire } from "@/components/questionnaire/useQuestionnaire";
import { useFormValidation } from "@/hooks/useFormValidation";
import { legalDeclarationSchema } from "@/lib/validations/questionnaire";
import {
  FormShell,
  LoadingState,
  SubmitBar,
} from "@/components/questionnaire/QuestionnaireUI";
import { initialDeclarations } from "@/components/questionnaire/declarations";
import { LegalDeclarationFields } from "@/components/questionnaire/sections/LegalDeclarationFields";
import type { DeclarationsFormData } from "@/types/questionnaire/declarations";

export default function LegalDeclarationsForm() {
  const [formData, setFormData] = useState<DeclarationsFormData>(initialDeclarations);

  const { isLoading, isSaving, save, stepInfo } = useQuestionnaire({
    step: "legal-declaration",
    onLoad: (section) => setFormData((prev) => ({ ...prev, ...section.legalDeclaration })),
  });

  const { errors, validate, clearError, summary } =
    useFormValidation(legalDeclarationSchema);

  const handleChange = (patch: Partial<DeclarationsFormData>) => {
    // A message goes as soon as its own field is touched.
    Object.keys(patch).forEach((key) => clearError(key));
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const previous = formData.hasPreviousAgreement === "Yes";
    const international = formData.hasInternationalConnections === "Yes";

    const payload: DeclarationsFormData = {
      agreementObjectives: formData.agreementObjectives,
      livingSituationFuture: formData.livingSituationFuture,
      hasPreviousAgreement: formData.hasPreviousAgreement,
      previousAgreementType: previous ? formData.previousAgreementType : "",
      previousAgreementStatus: previous ? formData.previousAgreementStatus : "",
      previousAgreementSummary: previous ? formData.previousAgreementSummary : "",
      hasInternationalConnections: formData.hasInternationalConnections,
      internationalSummary: international ? formData.internationalSummary : "",
      confirmPersonalEffects: formData.confirmPersonalEffects,
      confirmHouseholdDivision: formData.confirmHouseholdDivision,
      acknowledgeCourtChildren: formData.acknowledgeCourtChildren,
      confirmCostSharing: formData.confirmCostSharing,
      confirmUndueInfluence: formData.confirmUndueInfluence,
      confirmIla: formData.confirmIla,
      confirmFinancialDisclosure: formData.confirmFinancialDisclosure,
      confirmPlatformDisclaimer: formData.confirmPlatformDisclaimer,
      confirmAccuracy: formData.confirmAccuracy,
    };

    // Each declaration is a statement being confirmed, so an unticked box is
    // an unanswered question: nothing is sent until all of them are in.
    if (!validate(payload)) return;

    await save(payload);
  };

  if (isLoading) return <LoadingState />;

  return (
    <FormShell
      title="Legal Declarations"
      stepLabel={`Step ${stepInfo.number} of ${stepInfo.total}`}
      icon={<FileText className="h-5 w-5" />}
      description="Please review the background questions and declarations below. Each person should complete this section independently and answer based on their own knowledge and understanding."
    >
      <form onSubmit={handleSubmit} noValidate>
        <LegalDeclarationFields data={formData} onChange={handleChange} errors={errors} />

        <SubmitBar
          isSaving={isSaving}
          label="Save & continue"
          withArrow
          backHref={stepInfo.prevPath || "/dashboard/personal-info"}
          errorSummary={summary}
        />
      </form>
    </FormShell>
  );
}
