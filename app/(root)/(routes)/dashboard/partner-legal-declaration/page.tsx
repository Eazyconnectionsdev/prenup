"use client";

import OwnForm from "../legal-declaration/page";
import { EditingPartnerProvider } from "@/components/questionnaire/EditingPartnerContext";
import { useJointSectionStatus } from "@/hooks/useJointSectionStatus";
import { useState } from "react";
import { FileText } from "lucide-react";
import { useQuestionnaire } from "@/components/questionnaire/useQuestionnaire";
import { FormShell, LoadingState } from "@/components/questionnaire/QuestionnaireUI";
import { initialDeclarations } from "@/components/questionnaire/declarations";
import { LegalDeclarationFields } from "@/components/questionnaire/sections/LegalDeclarationFields";
import type { DeclarationsFormData } from "@/types/questionnaire/declarations";

function PartnerLegalDeclarationsView() {
  const [formData, setFormData] = useState<DeclarationsFormData>(initialDeclarations);

  const { isLoading } = useQuestionnaire({
    step: "legal-declaration",
    source: "partner",
    onLoad: (section) => {
      if (section.legalDeclaration) {
        setFormData({ ...initialDeclarations, ...section.legalDeclaration });
      }
    },
  });

  if (isLoading) return <LoadingState />;

  return (
    <FormShell
      readOnly
      title="Partner's Legal Declarations"
      icon={<FileText className="h-5 w-5" />}
      description="A read-only view of the legal declarations your partner has provided."
    >
      <LegalDeclarationFields data={formData} readOnly />
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
  return <PartnerLegalDeclarationsView />;
}
