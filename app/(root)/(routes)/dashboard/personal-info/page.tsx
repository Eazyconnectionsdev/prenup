"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useQuestionnaire } from "@/components/questionnaire/useQuestionnaire";
import { FormShell, LoadingState, SubmitBar } from "@/components/questionnaire/QuestionnaireUI";
import {
  PersonalInfoFields,
  calculateAge,
  initialPersonalInfo,
} from "@/components/questionnaire/sections/PersonalInfoFields";
import type { personalInfoFormData } from "@/types/questionnaire/personal-info";

export default function PersonalInfoForm() {
  const [formData, setFormData] = useState<personalInfoFormData>(initialPersonalInfo);

  const { isLoading, isSaving, save, stepInfo } = useQuestionnaire({
    step: "personal-info",
    onLoad: (section) =>
      setFormData((prev) => ({ ...prev, ...section.personalInformation })),
  });

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const age = calculateAge(formData.dateOfBirth);
    if (age !== null && age < 18) {
      toast.error("Parties must be at least 18 years of age.");
      return;
    }

    await save({
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth,
      languageFluency: formData.languageFluency,
      nationality: formData.nationality,
      domicileStatus: formData.domicileStatus,
      currentProfession: formData.currentProfession,
      street1: formData.street1,
      city: formData.city,
      county: formData.county,
      postcode: formData.postcode,
      marriageDate: formData.marriageDate,
    });
  };

  if (isLoading) return <LoadingState />;

  return (
    <FormShell
      title="Personal Information"
      stepLabel={`Step ${stepInfo.number} of ${stepInfo.total}`}
      description="Complete this section using your own personal and financial information only. Your partner will complete a separate questionnaire using their own information."
    >
      <form onSubmit={handleSubmit} noValidate>
        <PersonalInfoFields data={formData} onChange={setFormData} />
        <SubmitBar isSaving={isSaving} label={`Save & continue`} />
      </form>
    </FormShell>
  );
}
