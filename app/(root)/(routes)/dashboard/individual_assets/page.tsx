"use client";

import React, { useState } from "react";
import { useQuestionnaire } from "@/components/questionnaire/useQuestionnaire";
import { FormShell, LoadingState, SubmitBar } from "@/components/questionnaire/QuestionnaireUI";
import {
  AssetsFields,
  initialAssets,
  toAssets,
} from "@/components/questionnaire/sections/AssetsFields";
import type { AssetsData } from "@/types/questionnaire/assets-fields";

export default function IndividualAssetsForm() {
  const [data, setData] = useState<AssetsData>(initialAssets);

  const { isLoading, isSaving, save, stepInfo } = useQuestionnaire({
    step: "individual_assets",
    onLoad: (section) => setData(toAssets(section.individualAssets)),
  });

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    await save({
      hasRealEstate: data.hasRealEstate,
      realEstate: data.realEstate,
      hasSavings: data.hasSavings,
      savings: data.savings,
      hasPensions: data.hasPensions,
      pensions: data.pensions,
      hasBusinesses: data.hasBusinesses,
      businesses: data.businesses,
      hasIP: data.hasIP,
      ipAssets: data.ipAssets,
      hasChattels: data.hasChattels,
      chattels: data.chattels,
      hasOtherAssets: data.hasOtherAssets,
      otherAssets: data.otherAssets,
    });
  };

  if (isLoading) return <LoadingState />;

  return (
    <FormShell
      title="Your Individual Assets"
      stepLabel={`Step ${stepInfo.number} of ${stepInfo.total}`}
      description="Please tell us about the assets you personally own or partly own, including any owned with another person such as a parent, family member, business partner or trust."
    >
      <form onSubmit={handleSubmit} noValidate>
        <AssetsFields data={data} onChange={setData} />
        <SubmitBar isSaving={isSaving} label={`Save & continue`} />
      </form>
    </FormShell>
  );
}
