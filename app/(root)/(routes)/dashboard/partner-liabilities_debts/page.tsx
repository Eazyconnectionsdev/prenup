"use client";

import OwnForm from "../liabilities_debts/page";
import { EditingPartnerProvider } from "@/components/questionnaire/EditingPartnerContext";
import { useJointSectionStatus } from "@/hooks/useJointSectionStatus";
import { useState } from "react";
import { Wallet } from "lucide-react";
import { useQuestionnaire } from "@/components/questionnaire/useQuestionnaire";
import { FormShell, LoadingState } from "@/components/questionnaire/QuestionnaireUI";
import {
  LiabilitiesFields,
  initialLiabilities,
  toLiabilities,
} from "@/components/questionnaire/sections/LiabilitiesFields";
import type { LiabilitiesData } from "@/types/questionnaire/liabilities-fields";

function PartnerLiabilitiesView() {
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
      icon={<Wallet className="h-5 w-5" />}
      description="A read-only view of the debts and financial obligations your partner has declared."
    >
      <LiabilitiesFields data={data} readOnly />
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
  return <PartnerLiabilitiesView />;
}
