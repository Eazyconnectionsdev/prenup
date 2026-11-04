"use client";

import OwnForm from "../individual_assets/page";
import { EditingPartnerProvider } from "@/components/questionnaire/EditingPartnerContext";
import { useJointSectionStatus } from "@/hooks/useJointSectionStatus";
import { useState } from "react";
import { Landmark } from "lucide-react";
import { useQuestionnaire } from "@/components/questionnaire/useQuestionnaire";
import { FormShell, LoadingState } from "@/components/questionnaire/QuestionnaireUI";
import {
  AssetsFields,
  initialAssets,
  toAssets,
} from "@/components/questionnaire/sections/AssetsFields";
import type { AssetsData } from "@/types/questionnaire/assets-fields";

function PartnerIndividualAssetsView() {
  const [data, setData] = useState<AssetsData>(initialAssets);

  const { isLoading } = useQuestionnaire({
    step: "individual_assets",
    source: "partner",
    onLoad: (section) => setData(toAssets(section.individualAssets)),
  });

  if (isLoading) return <LoadingState />;

  return (
    <FormShell
      readOnly
      title="Partner's Individual Assets"
      icon={<Landmark className="h-5 w-5" />}
      description="A read-only view of the individual assets your partner has declared."
    >
      <AssetsFields data={data} readOnly />
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
  return <PartnerIndividualAssetsView />;
}
