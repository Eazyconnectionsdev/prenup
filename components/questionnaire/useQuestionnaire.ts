"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Axios from "@/lib/ApiConfig";
import { getErrorMessage } from "@/lib/api/http-error";
import { AppDispatch, RootState } from "@/store/store";
import { getCasesDetails } from "@/store/asyncThunk/casesThunk";
import { getStep } from "./steps";
import type { QuestionnaireStepSlug } from "@/types/questionnaire/steps";
import type { Options } from "@/types/questionnaire/use-questionnaire";

export function useQuestionnaire({ step, source = "own", onLoad }: Options) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const caseId = useSelector((state: RootState) => state.auth.caseId);

  const stepInfo = getStep(step);
  const isUser1 = user?.endUserType === "user1";
  const ownSection = isUser1 ? "myInformation" : "partnerInformation";
  const otherSection = isUser1 ? "partnerInformation" : "myInformation";
  const sectionName = source === "own" ? ownSection : otherSection;

  const [isLoading, setIsLoading] = useState(Boolean(caseId && user?.endUserType));
  const [isSaving, setIsSaving] = useState(false);

  const handleLoaded = useEffectEvent((section: Record<string, any>) =>
    onLoad(section),
  );

  useEffect(() => {
    if (!caseId || !user?.endUserType) return;
    let cancelled = false;

    Axios.get(`/cases/${caseId}/section/${sectionName}`)
      .then(({ data }) => {
        if (!cancelled) handleLoaded(data?.data ?? {});
      })
      .catch((error) => {
        if (!cancelled) {
          toast.error(getErrorMessage(error, "Couldn't load the saved answers."));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [caseId, sectionName, user?.endUserType]);

  // Saves the step, refreshes the sidebar status and moves to the next form
  const save = async (payload: unknown) => {
    if (!caseId) {
      toast.error("We couldn't find your case. Please sign in again.");
      return;
    }

    const apiStep = isUser1 ? stepInfo.apiStep : `partner-${stepInfo.apiStep}`;

    try {
      setIsSaving(true);
      await Axios.post(`/cases/${caseId}/questionnaire/${apiStep}`, payload);
      toast.success(`${stepInfo.title} saved.`);
      dispatch(getCasesDetails(caseId));
      // The last step has no next form, so stay on the page
      if (stepInfo.nextPath) router.push(stepInfo.nextPath);
    } catch (error) {
      toast.error(
        getErrorMessage(error, `Couldn't save ${stepInfo.title.toLowerCase()}.`),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return { isLoading, isSaving, save, stepInfo };
}
