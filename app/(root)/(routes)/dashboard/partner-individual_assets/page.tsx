"use client";

import { useState } from "react";
import { useQuestionnaire } from "@/components/questionnaire/useQuestionnaire";
import { FormShell, LoadingState } from "@/components/questionnaire/QuestionnaireUI";
import {
  AssetsFields,
  initialAssets,
  toAssets,
} from "@/components/questionnaire/sections/AssetsFields";
import type { AssetsData } from "@/types/questionnaire/assets-fields";

export default function PartnerIndividualAssetsView() {
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
      description="A read-only view of the individual assets your partner has declared."
    >
      <AssetsFields data={data} readOnly />
    </FormShell>
  );
}
