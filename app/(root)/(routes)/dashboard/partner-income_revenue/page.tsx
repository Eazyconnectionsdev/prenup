"use client";

import OwnForm from "../income_revenue/page";
import { EditingPartnerProvider } from "@/components/questionnaire/EditingPartnerContext";
import { useJointSectionStatus } from "@/hooks/useJointSectionStatus";
import { useState } from "react";
import { Banknote } from "lucide-react";
import { useQuestionnaire } from "@/components/questionnaire/useQuestionnaire";
import { FormShell, LoadingState } from "@/components/questionnaire/QuestionnaireUI";
import {
  IncomeFields,
  initialIncome,
  toIncome,
} from "@/components/questionnaire/sections/IncomeFields";
import type { IncomeData } from "@/types/questionnaire/income-fields";

function PartnerIncomeRevenueView() {
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
      icon={<Banknote className="h-5 w-5" />}
      description="A read-only view of the income and revenue your partner has declared."
    >
      <IncomeFields data={data} readOnly />
    </FormShell>
  );
}

// The partner who sent the case back for changes edits their partner's answers
// in the real form; everyone else sees the read-only view.
export default function PartnerPage() {
  const { iDisapproved } = useJointSectionStatus();
  if (iDisapproved) {
    return (
      <EditingPartnerProvider>
        <OwnForm />
      </EditingPartnerProvider>
    );
  }
  return <PartnerIncomeRevenueView />;
}
