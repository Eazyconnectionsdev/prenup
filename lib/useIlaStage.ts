"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { getCasesDetails } from "@/store/asyncThunk/casesThunk";
import { getIlaGate, pickPreQuestionnaire } from "@/lib/ila";

/**
 * Shared by the four independent-legal-advice pages: makes sure the case is
 * loaded, then hands back the gate and whichever party's slot the page shows.
 */
export function useIlaStage() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const cases = useSelector((state: RootState) => state.cases);

  const caseId = cases.caseId ?? user?.inviteCaseId ?? null;

  useEffect(() => {
    if (!cases.caseId && user?.inviteCaseId) {
      dispatch(getCasesDetails(user.inviteCaseId));
    }
  }, [dispatch, cases.caseId, user?.inviteCaseId]);

  const gate = getIlaGate(cases.approval);

  return {
    caseId,
    user,
    isLoading: cases.isLoading,
    gate,
    reload: () => {
      if (caseId) dispatch(getCasesDetails(caseId));
    },
    mine: pickPreQuestionnaire(
      user?.endUserType,
      cases.preQuestionnaireUser1,
      cases.preQuestionnaireUser2,
      "mine",
    ),
    partner: pickPreQuestionnaire(
      user?.endUserType,
      cases.preQuestionnaireUser1,
      cases.preQuestionnaireUser2,
      "partner",
    ),
  };
}
