"use client";

import { useState } from "react";
import { useQuestionnaire } from "@/components/questionnaire/useQuestionnaire";
import { FormShell, LoadingState } from "@/components/questionnaire/QuestionnaireUI";
import {
  PersonalInfoFields,
  initialPersonalInfo,
} from "@/components/questionnaire/sections/PersonalInfoFields";
import type { personalInfoFormData } from "@/types/questionnaire/personal-info";

export default function PartnerPersonalInfoView() {
  const [formData, setFormData] = useState<personalInfoFormData>(initialPersonalInfo);

  const { isLoading } = useQuestionnaire({
    step: "personal-info",
    source: "partner",
    onLoad: (section) => {
      if (section.personalInformation) {
        setFormData({ ...initialPersonalInfo, ...section.personalInformation });
      }
    },
  });

  if (isLoading) return <LoadingState />;

  return (
    <FormShell
      readOnly
      title="Partner's Personal Information"
      description="A read-only view of the personal information your partner has provided."
    >
      <PersonalInfoFields data={formData} readOnly />
    </FormShell>
  );
}
