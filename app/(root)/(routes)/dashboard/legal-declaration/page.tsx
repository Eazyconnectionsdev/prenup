"use client";

import React, { useState } from "react";
import { FileText, ShieldCheck } from "lucide-react";
import { useQuestionnaire } from "@/components/questionnaire/useQuestionnaire";
import {
  cardTextareaClasses,
  CheckCard,
  FormShell,
  LoadingState,
  NumberedQuestion,
  SectionTitle,
  SubmitBar,
} from "@/components/questionnaire/QuestionnaireUI";
import {
  DECLARATIONS,
  initialDeclarations,
} from "@/components/questionnaire/declarations";
import type { DeclarationsFormData } from "@/types/questionnaire/declarations";

const firstPersonRegex = /\b(I|me|my|myself|we|us|our)\b/i;

function ThirdPersonTip() {
  return (
    <p className="mt-2 text-[0.85rem] font-medium text-amber-700">
      Tip: try rephrasing this in the third person using your names to keep it court-ready.
    </p>
  );
}

export default function LegalDeclarationsForm() {
  const [formData, setFormData] = useState<DeclarationsFormData>(initialDeclarations);

  const { isLoading, isSaving, save, stepInfo } = useQuestionnaire({
    step: "legal-declaration",
    onLoad: (section) => setFormData((prev) => ({ ...prev, ...section.legalDeclaration })),
  });

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    await save({
      agreementObjectives: formData.agreementObjectives,
      livingSituationFuture: formData.livingSituationFuture,
      confirmPersonalEffects: formData.confirmPersonalEffects,
      confirmHouseholdDivision: formData.confirmHouseholdDivision,
      acknowledgeCourtChildren: formData.acknowledgeCourtChildren,
      confirmCostSharing: formData.confirmCostSharing,
      confirmUndueInfluence: formData.confirmUndueInfluence,
      confirmIla: formData.confirmIla,
      confirmPlatformDisclaimer: formData.confirmPlatformDisclaimer,
      confirmAccuracy: formData.confirmAccuracy,
    });
  };

  if (isLoading) return <LoadingState />;

  return (
    <FormShell
      title="Legal Declarations"
      stepLabel={`Step ${stepInfo.number} of ${stepInfo.total}`}
      icon={<FileText className="h-5 w-5" />}
      description="Please review and confirm your understanding of the following foundational principles for your agreement."
    >
      <form onSubmit={handleSubmit} noValidate>
        <NumberedQuestion
          number={1}
          htmlFor="agreementObjectives"
          question="Please provide a brief overview of what you are both aiming to achieve with this agreement and your primary reasons for putting it in place."
        >
          <textarea
            id="agreementObjectives"
            name="agreementObjectives"
            rows={4}
            maxLength={1500}
            placeholder="Describe what you both aim to achieve with this agreement..."
            value={formData.agreementObjectives}
            onChange={handleTextChange}
            className={cardTextareaClasses}
          />
          {firstPersonRegex.test(formData.agreementObjectives) && <ThirdPersonTip />}
        </NumberedQuestion>

        <NumberedQuestion
          number={2}
          htmlFor="livingSituationFuture"
          question="Please provide a summary of your current living arrangements and any significant future plans (e.g., upcoming property purchases, relocating abroad, or major career changes)."
        >
          <textarea
            id="livingSituationFuture"
            name="livingSituationFuture"
            rows={4}
            maxLength={1500}
            placeholder="Summarise your current living arrangements and any future plans..."
            value={formData.livingSituationFuture}
            onChange={handleTextChange}
            className={cardTextareaClasses}
          />
          {firstPersonRegex.test(formData.livingSituationFuture) && <ThirdPersonTip />}
        </NumberedQuestion>

        <SectionTitle icon={<ShieldCheck className="h-5 w-5" />}>
          Declarations of Understanding
        </SectionTitle>

        {DECLARATIONS.map((d) => (
          <CheckCard
            key={d.id}
            id={d.id}
            name={d.name}
            title={d.title}
            description={d.description}
            checked={formData[d.name] as boolean}
            onChange={handleCheckboxChange}
          />
        ))}

        <SubmitBar isSaving={isSaving} label={`Save & continue`} withArrow />
      </form>
    </FormShell>
  );
}
