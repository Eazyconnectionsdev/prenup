"use client";

import React, { useState } from "react";
import { useQuestionnaire } from "@/components/questionnaire/useQuestionnaire";
import { FormShell, LoadingState, SubmitBar } from "@/components/questionnaire/QuestionnaireUI";
import {
  IncomeFields,
  initialIncome,
  toIncome,
} from "@/components/questionnaire/sections/IncomeFields";
import type { IncomeData } from "@/types/questionnaire/income-fields";

export default function IncomeRevenueForm() {
  const [data, setData] = useState<IncomeData>(initialIncome);

  const { isLoading, isSaving, save, stepInfo } = useQuestionnaire({
    step: "income_revenue",
    onLoad: (section) => setData(toIncome(section.incomeAndRevenue)),
  });

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    await save({
      grossAnnualIncome: data.grossAnnualIncome,
      salaryTreatment: data.salaryTreatment,
      hasPrimaryBonus: data.hasPrimaryBonus,
      primaryIncomeRows: data.primaryIncomeRows,
      hasAlternativeIncome: data.hasAlternativeIncome,
      altIncomeRows: data.altIncomeRows,
    });
  };

  if (isLoading) return <LoadingState />;

  return (
    <FormShell
      title="Your Income & Revenue"
      stepLabel={`Step ${stepInfo.number} of ${stepInfo.total}`}
      description="Please tell us about all income you personally receive, including employment income, bonuses, investments, rental income and any other regular income sources."
    >
      <form onSubmit={handleSubmit} noValidate>
        <IncomeFields data={data} onChange={setData} />
        <SubmitBar isSaving={isSaving} label={`Save & continue`} />
      </form>
    </FormShell>
  );
}
