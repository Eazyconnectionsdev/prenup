/**
 * `myInformation` and `partnerInformation` on the case are ABSOLUTE: they
 * always mean the case owner (user1) and the invited partner (user2), whoever
 * is looking at them.
 *
 * Everything the signed-in user sees as "yours" / "your partner's" is
 * RELATIVE, so the two must be resolved against `endUserType` rather than read
 * straight off the case. Reading them directly is what made user2 see their
 * partner's progress under "Fill out your questionnaire".
 */
export function resolvePartyInformation<T extends Record<string, any>>(
  endUserType: string | null | undefined,
  ownerInformation?: T,
  invitedInformation?: T,
): { mine: T; theirs: T } {
  // Only an explicit "user2" flips the sides. While the profile is still
  // loading, endUserType is undefined and the owner's view is the safe
  // default -- it also matches the schema default of "user1".
  const isInvitedPartner = endUserType === "user2";

  const empty = {} as T;
  return {
    mine: (isInvitedPartner ? invitedInformation : ownerInformation) ?? empty,
    theirs: (isInvitedPartner ? ownerInformation : invitedInformation) ?? empty,
  };
}

/** The section name holding the signed-in user's own answers. */
export function ownSectionName(
  endUserType: string | null | undefined,
): "myInformation" | "partnerInformation" {
  return endUserType === "user2" ? "partnerInformation" : "myInformation";
}

/** The section name holding the other party's answers. */
export function otherSectionName(
  endUserType: string | null | undefined,
): "myInformation" | "partnerInformation" {
  return endUserType === "user2" ? "myInformation" : "partnerInformation";
}
