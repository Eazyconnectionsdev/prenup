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

const idOf = (v: unknown): string =>
  v && typeof v === "object" ? String((v as { _id?: unknown })._id ?? "") : String(v ?? "");

/**
 * The user's side on this case as the case itself records it: the owner is
 * Partner 1 ("user1"), the invited partner Partner 2 ("user2"). The label on
 * the profile can lag behind this -- when the invited partner pays first they
 * become Partner 1 -- so this is what the label is corrected from.
 */
export function endUserTypeOnCase(
  c: { owner?: unknown; invitedUser?: unknown } | null | undefined,
  userId: unknown,
): "user1" | "user2" | null {
  const me = idOf(userId);
  if (!c || !me) return null;
  if (idOf(c.owner) === me) return "user1";
  if (idOf(c.invitedUser) === me) return "user2";
  return null;
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
