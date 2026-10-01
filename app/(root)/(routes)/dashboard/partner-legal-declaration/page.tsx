"use client";

import { useState } from "react";
import { useQuestionnaire } from "@/components/questionnaire/useQuestionnaire";
import {
  CheckCard,
  FieldLabel,
  FormShell,
  LoadingState,
  SectionTitle,
  textareaClasses,
} from "@/components/questionnaire/QuestionnaireUI";
import {
  DECLARATIONS,
  initialDeclarations,
} from "@/components/questionnaire/declarations";
import type { DeclarationsFormData } from "@/types/questionnaire/declarations";

export default function PartnerLegalDeclarationsView() {
  const [formData, setFormData] = useState<DeclarationsFormData>(initialDeclarations);

  const { isLoading } = useQuestionnaire({
    step: "legal-declaration",
    source: "partner",
    onLoad: (section) => {
      if (section.legalDeclaration) {
        setFormData({ ...initialDeclarations, ...section.legalDeclaration });
      }
    },
  });

  if (isLoading) return <LoadingState />;

  return (
    <FormShell
      readOnly
      title="Partner's Legal Declarations"
      description="A read-only view of the legal declarations your partner has provided."
    >
      <div className="mb-7">
        <FieldLabel>
          A brief overview of what you are both aiming to achieve with this agreement and the
          primary reasons for putting it in place.
        </FieldLabel>
        <textarea rows={4} value={formData.agreementObjectives} disabled className={textareaClasses} />
      </div>

      <div className="mb-7">
        <FieldLabel>
          A summary of current living arrangements and any significant future plans (e.g., upcoming
          property purchases, relocating abroad, or major career changes).
        </FieldLabel>
        <textarea rows={4} value={formData.livingSituationFuture} disabled className={textareaClasses} />
      </div>

      <SectionTitle>Declarations of Understanding</SectionTitle>

      {DECLARATIONS.map((d) => (
        <CheckCard
          key={d.id}
          id={d.id}
          title={d.title}
          description={d.description}
          checked={Boolean(formData[d.name])}
          readOnly
        />
      ))}
    </FormShell>
  );
}
