"use client";

import { useState } from "react";
import { useQuestionnaire } from "@/components/questionnaire/useQuestionnaire";
import { FormShell, LoadingState } from "@/components/questionnaire/QuestionnaireUI";
import {
  IncomeFields,
  initialIncome,
  toIncome,
} from "@/components/questionnaire/sections/IncomeFields";
import type { IncomeData } from "@/types/questionnaire/income-fields";

export default function PartnerIncomeRevenueView() {
  const [data, setData] = useState<IncomeData>(initialIncome);

  const { isLoading } = useQuestionnaire({
    step: "income_revenue",
    source: "partner",
    onLoad: (section) => setData(toIncome(section.incomeAndRevenue)),
  });

  if (isLoading) return <LoadingState />;

  return (
    <FormShell
      readOnly
      title="Partner's Income & Revenue"
      description="A read-only view of the income and revenue your partner has declared."
    >
      <IncomeFields data={data} readOnly />
    </FormShell>
  );
}
