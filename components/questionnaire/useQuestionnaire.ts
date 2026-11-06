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
import { useEditingPartnerForm } from "./EditingPartnerContext";
import { otherSectionName, ownSectionName } from "@/lib/caseSections";
import type { QuestionnaireStepSlug } from "@/types/questionnaire/steps";
import type { Options } from "@/types/questionnaire/use-questionnaire";

export function useQuestionnaire({ step, source = "own", onLoad }: Options) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const caseId = useSelector((state: RootState) => state.auth.caseId);

  const stepInfo = getStep(step);
  // The invited partner's own answers live in `partnerInformation`; the
  // owner's in `myInformation`. Resolved centrally so every screen agrees.
  const isInvitedPartner = user?.endUserType === "user2";

  // The `partner-…` pages show this same form on the other partner's answers
  // for the partner who sent the case back for changes.
  const editingPartner = useEditingPartnerForm() && source === "own";

  const sectionName =
    source === "own" && !editingPartner
      ? ownSectionName(user?.endUserType)
      : otherSectionName(user?.endUserType);

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

    // The `partner-` steps write to `partnerInformation`, which is the invited
    // partner's own section -- so that is the prefix THEY save through.
    // Editing the other partner's answers flips which section is written to.
    const writesPartnerSection = isInvitedPartner !== editingPartner;
    const apiStep = writesPartnerSection
      ? `partner-${stepInfo.apiStep}`
      : stepInfo.apiStep;

    try {
      setIsSaving(true);
      await Axios.post(`/cases/${caseId}/questionnaire/${apiStep}`, payload);
      toast.success(`${stepInfo.title} saved.`);
      dispatch(getCasesDetails(caseId));
      // The last step has no next form, so stay on the page
      if (stepInfo.nextPath) {
        // Stay on the partner's pages while editing their answers
        const isQuestionnairePath = stepInfo.nextPath !== "/dashboard/joint-assets";
        router.push(
          editingPartner && isQuestionnairePath
            ? stepInfo.nextPath.replace("/dashboard/", "/dashboard/partner-")
            : stepInfo.nextPath,
        );
      }
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
