"use client";

import OwnForm from "../family/page";
import { EditingPartnerProvider } from "@/components/questionnaire/EditingPartnerContext";
import { useJointSectionStatus } from "@/hooks/useJointSectionStatus";
import { useState } from "react";
import { UsersRound } from "lucide-react";
import { useQuestionnaire } from "@/components/questionnaire/useQuestionnaire";
import { FormShell, LoadingState } from "@/components/questionnaire/QuestionnaireUI";
import { initialFamilyData, normalizeFamily } from "@/components/questionnaire/family";
import { FamilyFields } from "@/components/questionnaire/sections/FamilyFields";
import type { FamilyFormData } from "@/types/questionnaire/family";

function PartnerFamilyDependentsView() {
  const [formData, setFormData] = useState<FamilyFormData>(initialFamilyData);

  const { isLoading } = useQuestionnaire({
    step: "family",
    source: "partner",
    onLoad: (section) => setFormData(normalizeFamily(section.familyAndDependents)),
  });

  if (isLoading) return <LoadingState />;

  return (
    <FormShell
      readOnly
      title="Partner's Family & Dependents"
      icon={<UsersRound className="h-5 w-5" />}
      description="A read-only view of the family and dependents information your partner has provided."
    >
      <FamilyFields data={formData} readOnly />
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
  return <PartnerFamilyDependentsView />;
}
