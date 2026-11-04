"use client";

import OwnForm from "../personal-info/page";
import { EditingPartnerProvider } from "@/components/questionnaire/EditingPartnerContext";
import { useJointSectionStatus } from "@/hooks/useJointSectionStatus";
import { useState } from "react";
import { UserRound } from "lucide-react";
import { useQuestionnaire } from "@/components/questionnaire/useQuestionnaire";
import { FormShell, LoadingState } from "@/components/questionnaire/QuestionnaireUI";
import {
  PersonalInfoFields,
  initialPersonalInfo,
} from "@/components/questionnaire/sections/PersonalInfoFields";
import type { personalInfoFormData } from "@/types/questionnaire/personal-info";

function PartnerPersonalInfoView() {
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
      icon={<UserRound className="h-5 w-5" />}
      description="A read-only view of the personal information your partner has provided."
    >
      <PersonalInfoFields data={formData} readOnly />
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
  return <PartnerPersonalInfoView />;
}
