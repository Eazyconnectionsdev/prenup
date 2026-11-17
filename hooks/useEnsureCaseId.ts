"use client";

import { useDispatch, useSelector } from "react-redux";
import { startCase } from "@/store/asyncThunk/casesThunk";
import { getFreshProfile } from "@/store/asyncThunk/authThunk";
import type { AppDispatch, RootState } from "@/store/store";

/**
 * The client's case id, starting the case first if they haven't got one yet.
 *
 * An account alone used to have no case until the agreement was chosen, which
 * meant the first questionnaire and the partner invitation had nowhere to be
 * saved. Both now start the matter on demand; `POST /cases` is idempotent on
 * the server, so calling this repeatedly always returns the same case.
 */
export function useEnsureCaseId() {
  const dispatch = useDispatch<AppDispatch>();
  const caseId = useSelector(
    (state: RootState) => state.auth.caseId || state.auth.user?.inviteCaseId,
  );

  return async (): Promise<string> => {
    if (caseId) return String(caseId);
    const started = await dispatch(startCase()).unwrap();
    await dispatch(getFreshProfile());
    return started._id;
  };
}
