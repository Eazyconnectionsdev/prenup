"use client";

import { useState } from "react";
import { useQuestionnaire } from "@/components/questionnaire/useQuestionnaire";
import { FormShell, LoadingState } from "@/components/questionnaire/QuestionnaireUI";
import {
  LiabilitiesFields,
  initialLiabilities,
  toLiabilities,
} from "@/components/questionnaire/sections/LiabilitiesFields";
import type { LiabilitiesData } from "@/types/questionnaire/liabilities-fields";

export default function PartnerLiabilitiesView() {
  const [data, setData] = useState<LiabilitiesData>(initialLiabilities);

  const { isLoading } = useQuestionnaire({
    step: "liabilities_debts",
    source: "partner",
    onLoad: (section) => setData(toLiabilities(section.liabilitiesAndDebts)),
  });

  if (isLoading) return <LoadingState />;

  return (
    <FormShell
      readOnly
      title="Partner's Personal Liabilities"
      description="A read-only view of the debts and financial obligations your partner has declared."
    >
      <LiabilitiesFields data={data} readOnly />
    </FormShell>
  );
}
