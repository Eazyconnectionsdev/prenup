"use client";

import React, { useState } from "react";
import { useQuestionnaire } from "@/components/questionnaire/useQuestionnaire";
import { FormShell, LoadingState, SubmitBar } from "@/components/questionnaire/QuestionnaireUI";
import {
  LiabilitiesFields,
  initialLiabilities,
  toLiabilities,
} from "@/components/questionnaire/sections/LiabilitiesFields";
import type { LiabilitiesData } from "@/types/questionnaire/liabilities-fields";

export default function LiabilitiesForm() {
  const [data, setData] = useState<LiabilitiesData>(initialLiabilities);

  const { isLoading, isSaving, save, stepInfo } = useQuestionnaire({
    step: "liabilities_debts",
    onLoad: (section) => setData(toLiabilities(section.liabilitiesAndDebts)),
  });

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    await save({
      hasDebts: data.hasDebts,
      debts: data.debts,
      hasMaintenance: data.hasMaintenance,
      maintenance: data.maintenance,
    });
  };

  if (isLoading) return <LoadingState />;

  return (
    <FormShell
      title="Your Personal Liabilities"
      stepLabel={`Step ${stepInfo.number} of ${stepInfo.total}`}
      description="Please tell us about any debts or financial obligations that you are personally responsible for, including debts jointly signed with another person that remain your responsibility."
    >
      <form onSubmit={handleSubmit} noValidate>
        <LiabilitiesFields data={data} onChange={setData} />
        <SubmitBar isSaving={isSaving} label="Save & continue" />
      </form>
    </FormShell>
  );
}
