"use client";

import React, { useState } from "react";
import { Landmark } from "lucide-react";
import { useQuestionnaire } from "@/components/questionnaire/useQuestionnaire";
import { useFormValidation } from "@/hooks/useFormValidation";
import { individualAssetsSchema } from "@/lib/validations/questionnaire";
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

  const { errors, validate, clearError, summary } =
    useFormValidation(individualAssetsSchema);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
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
    };

    // Rows the person added themselves have to be filled in before this can
    // be sent -- an empty row is noise in the agreement, not an answer.
    if (!validate(payload)) return;

    await save(payload);
  };

  if (isLoading) return <LoadingState />;

  return (
    <FormShell
      title="Your Individual Assets"
      stepLabel={`Step ${stepInfo.number} of ${stepInfo.total}`}
      icon={<Landmark className="h-5 w-5" />}
      description="Please tell us about the assets you personally own or partly own, including any owned with another person such as a parent, family member, business partner or trust."
    >
      <form onSubmit={handleSubmit} noValidate>
        <AssetsFields
          data={data}
          onChange={setData}
          errors={errors}
          onClearError={clearError}
        />
        <SubmitBar
          isSaving={isSaving}
          label={`Save & continue`}
          withArrow
          backHref={stepInfo.prevPath}
          errorSummary={summary}
        />
      </form>
    </FormShell>
  );
}
