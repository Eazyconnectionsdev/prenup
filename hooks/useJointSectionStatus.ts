"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const hasData = (value: unknown) =>
  !!value && typeof value === "object" && Object.keys(value as object).length > 0;

export function useJointSectionStatus() {
  const user = useSelector((state: RootState) => state.auth.user);
  const cases = useSelector((state: RootState) => state.cases);

  const myId: string | null = user?._id ? String(user._id) : null;
  const ownerId = cases.owner?._id ? String(cases.owner._id) : null;
  const isOwner = !!myId && ownerId === myId;

  const status = cases.status?.jointInformation;
  const submittedById = status?.submittedBy ? String(status.submittedBy) : null;
  const disapprovedById = cases.approval?.disapprovedBy ? String(cases.approval.disapprovedBy) : null;

  const locked = !!status?.locked;
  // Older cases may have `submitted` set by the first joint form only
  const reviewPending =
    !locked &&
    !!status?.submitted &&
    hasData((cases.jointInformation as Record<string, unknown>)?.jointLiabilitiesAndDebts);

  // Owner edits first; after a disapproval the disapproving partner edits next
  const isMyTurn = submittedById === null ? isOwner : submittedById === myId;
  const canEdit = !locked && !reviewPending && isMyTurn;

  return {
    // false until the case has been fetched into redux
    ready: !!cases.caseId && !cases.isLoading,
    myId,
    isOwner,
    locked,
    reviewPending,
    canEdit,
    iAmWaitingForReview: reviewPending && submittedById === myId,
    isMyTurnToApprove: reviewPending && submittedById !== null && submittedById !== myId,
    isWaitingOnPartner: !locked && !reviewPending && !isMyTurn,
    partnerDisapproved: !!disapprovedById && disapprovedById !== myId,
    iDisapproved: canEdit && !!disapprovedById && disapprovedById === myId,
  };
}
