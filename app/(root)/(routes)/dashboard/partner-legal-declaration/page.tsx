"use client";

import { useState } from "react";
import { FileText, ShieldCheck } from "lucide-react";
import { useQuestionnaire } from "@/components/questionnaire/useQuestionnaire";
import {
  cardTextareaClasses,
  CheckCard,
  FormShell,
  LoadingState,
  NumberedQuestion,
  SectionTitle,
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
      icon={<FileText className="h-5 w-5" />}
      description="A read-only view of the legal declarations your partner has provided."
    >
      <NumberedQuestion
        number={1}
        question="A brief overview of what you are both aiming to achieve with this agreement and the primary reasons for putting it in place."
      >
        <textarea
          rows={4}
          value={formData.agreementObjectives}
          disabled
          className={cardTextareaClasses}
        />
      </NumberedQuestion>

      <NumberedQuestion
        number={2}
        question="A summary of current living arrangements and any significant future plans (e.g., upcoming property purchases, relocating abroad, or major career changes)."
      >
        <textarea
          rows={4}
          value={formData.livingSituationFuture}
          disabled
          className={cardTextareaClasses}
        />
      </NumberedQuestion>

      <SectionTitle icon={<ShieldCheck className="h-5 w-5" />}>
        Declarations of Understanding
      </SectionTitle>

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
