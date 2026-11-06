// One set of rules for the Case Manager dashboard counts and the Cases page
// stage filter, so a tile's number always equals the rows it opens.
//
// Real workflow, as the backend moves a case:
//   NOT_PAID -> (payment) DRAFT -> (both partners approve) COUPLE_SUBMITTED
//   -> (CM approves) CM_APPROVED            (CM returns -> DRAFT + cmReturnReason)
//   -> (CM assigns lawyers) LAWYERS_ASSIGNED   (pre-lawyer questionnaires filled here)
//   -> (both questionnaires submitted) PRE_LAWYER_COMPLETED
//   -> (lawyer review done / both client confirmations) LAWYER_REVIEW_COMPLETED
//   -> (ILA requested) LAWYER_ILA_PENDING
//   -> (both lawyers signed off) LAWYER_CLIENT_CONFIRMATION
//   -> (both final confirmations, case completed) COMPLETED + readyForArchive
//   -> (archived) ARCHIVED
// PRE_LAWYER_PENDING and LAWYER_REVIEW exist in the enum but nothing sets them;
// they are still accepted below so older cases are not lost.

export interface CaseStageFacts {
  workflowStage: string;
  isPaid: boolean;
  partnerJoined: boolean;
  user1Approved: boolean;
  user2Approved: boolean;
  mutualApproved: boolean;
  returnedToDraft: boolean;
  caseManagerId: string;
  p1QuestionnaireDone: boolean;
  p2QuestionnaireDone: boolean;
  p1Confirmed: boolean;
  p2Confirmed: boolean;
  p1IlaDone: boolean;
  p2IlaDone: boolean;
  p1LawyerSigned: boolean;
  p2LawyerSigned: boolean;
  readyForArchive: boolean;
}

const idOf = (ref: any): string =>
  ref && typeof ref === "object"
    ? String(ref._id || ref.id || "")
    : typeof ref === "string"
    ? ref
    : "";

/** Pull the stage-related facts out of a raw case from the API. */
export function toStageFacts(item: any): CaseStageFacts {
  const rawPayment = String(item.paymentStatus || "").toUpperCase();
  const approval = item.approval || {};
  const user1Approved = Boolean(approval.user1Approved);
  const user2Approved = Boolean(approval.user2Approved);
  return {
    workflowStage: item.workflowStatus || "DRAFT",
    // A refund does not clear paymentCompleted, so refunded wins.
    isPaid:
      rawPayment !== "REFUNDED" &&
      rawPayment !== "PARTIALLY_REFUNDED" &&
      Boolean(item.paymentCompleted || rawPayment === "COMPLETED"),
    partnerJoined: Boolean(item.invitedUser),
    user1Approved,
    user2Approved,
    mutualApproved:
      approval.mutualApprovalAndSnapshot === "COMPLETED" ||
      (user1Approved && user2Approved),
    returnedToDraft: Boolean(item.cmReturnReason),
    caseManagerId: idOf(item.assignedCaseManager),
    p1QuestionnaireDone: Boolean(item.preQuestionnaireUser1?.submitted),
    p2QuestionnaireDone: Boolean(item.preQuestionnaireUser2?.submitted),
    p1Confirmed: Boolean(item.p1Confirmed),
    p2Confirmed: Boolean(item.p2Confirmed),
    p1IlaDone: Boolean(item.p1ILACompleted),
    p2IlaDone: Boolean(item.p2ILACompleted),
    p1LawyerSigned: Boolean(item.p1LawyerSigned),
    p2LawyerSigned: Boolean(item.p2LawyerSigned),
    readyForArchive: Boolean(item.readyForArchive),
  };
}

const at = (c: CaseStageFacts, ...stages: string[]) =>
  stages.includes(c.workflowStage);

const questionnairesDone = (c: CaseStageFacts) =>
  c.p1QuestionnaireDone && c.p2QuestionnaireDone;

/** Lawyers assigned, both questionnaires in, lawyer review not finished yet. */
const inLawyerReview = (c: CaseStageFacts) =>
  (at(c, "LAWYERS_ASSIGNED") && questionnairesDone(c)) ||
  at(c, "PRE_LAWYER_COMPLETED", "LAWYER_REVIEW");

/** Lawyer review finished; ILA and lawyer sign-off in progress. */
const inIlaAndSignoff = (c: CaseStageFacts) =>
  at(c, "LAWYER_REVIEW_COMPLETED", "LAWYER_ILA_PENDING", "LAWYER_SIGNOFF_COMPLETE");

type Rule = (c: CaseStageFacts, me: string) => boolean;

const RULES: Record<string, Rule> = {
  // ── Top cards / column groups ──
  NOT_PAID: (c) => !c.isPaid,
  DRAFT: (c) => at(c, "DRAFT"),
  CM_REVIEW: (c) =>
    at(c, "COUPLE_SUBMITTED", "CM_APPROVED") || RULES.PRE_LAWYER_PENDING(c, ""),
  LEGAL_REVIEW: (c) =>
    inLawyerReview(c) || inIlaAndSignoff(c) || at(c, "LAWYER_CLIENT_CONFIRMATION"),
  COMPLETED: (c) => at(c, "COMPLETED"),

  // ── 1. Applicant Drafting (these three split DRAFT exactly) ──
  PARTNER_NOT_JOINED: (c) => at(c, "DRAFT") && !c.partnerJoined,
  APPLICANT_DRAFTING: (c) =>
    at(c, "DRAFT") && c.partnerJoined && !c.user1Approved && !c.user2Approved,
  PARTNER_REVIEW: (c) =>
    at(c, "DRAFT") && c.partnerJoined && (c.user1Approved || c.user2Approved),
  RETURNED_TO_DRAFT: (c) => at(c, "DRAFT") && c.returnedToDraft,

  // ── 2. Case Manager Review ──
  CM_NOT_ASSIGNED: (c) => at(c, "COUPLE_SUBMITTED") && !c.caseManagerId,
  MY_ACTIVE_REVIEWS: (c, me) =>
    at(c, "COUPLE_SUBMITTED") && Boolean(me) && c.caseManagerId === me,
  LAWYER_ASSIGNMENT_PENDING: (c) => at(c, "CM_APPROVED"),
  PRE_LAWYER_PENDING: (c) =>
    at(c, "LAWYERS_ASSIGNED", "PRE_LAWYER_PENDING") && !questionnairesDone(c),

  // ── 3. Legal Review ──
  P1_CONFIRMATION_PENDING: (c) => inLawyerReview(c) && !c.p1Confirmed,
  P2_CONFIRMATION_PENDING: (c) => inLawyerReview(c) && !c.p2Confirmed,
  P1_LAWYER_APPROVAL_PENDING: (c) =>
    inIlaAndSignoff(c) && (!c.p1IlaDone || !c.p1LawyerSigned),
  P2_LAWYER_APPROVAL_PENDING: (c) =>
    inIlaAndSignoff(c) && (!c.p2IlaDone || !c.p2LawyerSigned),
  FINAL_CONFIRMATION_PENDING: (c) => at(c, "LAWYER_CLIENT_CONFIRMATION"),

  // ── 4. Completed ──
  // executionPackGenerated is never set by the backend; the pack is produced
  // when the case is completed, so Completed status is the signal.
  EXECUTION_PACK_GENERATED: (c) => at(c, "COMPLETED"),
  READY_FOR_ARCHIVE: (c) => c.readyForArchive && !at(c, "ARCHIVED"),
};

/**
 * Does a case match a stage filter value? "ALL" matches everything; any value
 * without a rule is treated as a plain workflowStatus.
 */
export function matchesStageFilter(
  c: CaseStageFacts,
  filter: string,
  currentUserId = ""
): boolean {
  if (!filter || filter === "ALL") return true;
  const rule = RULES[filter];
  return rule ? rule(c, String(currentUserId || "")) : c.workflowStage === filter;
}

/** Count cases matching each filter value. */
export function countByStageFilter(
  cases: CaseStageFacts[],
  filters: string[],
  currentUserId = ""
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const f of filters) {
    out[f] = cases.filter((c) => matchesStageFilter(c, f, currentUserId)).length;
  }
  return out;
}
