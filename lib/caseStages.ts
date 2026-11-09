// One set of rules for the Case Manager dashboard counts and the Cases page
// stage filter, so a tile's number always equals the rows it opens.
//
// Real workflow, as the backend moves a case:
//   NOT_PAID -> (payment) DRAFT -> (both partners approve) COUPLE_SUBMITTED
//   -> (CM approves) CM_APPROVED            (CM returns -> DRAFT + cmReturnReason)
//   -> applicants fill the pre-lawyer questionnaire (PRE_LAWYER_PENDING)
//   -> (both questionnaires submitted) PRE_LAWYER_COMPLETED
//   -> (CM assigns lawyers) LAWYERS_ASSIGNED
//   -> (lawyer review done / both client confirmations) LAWYER_REVIEW_COMPLETED
//   -> (ILA requested) LAWYER_ILA_PENDING
//   -> (both lawyers signed off) LAWYER_CLIENT_CONFIRMATION
//   -> (both final confirmations, case completed) COMPLETED + readyForArchive
//   -> (archived) ARCHIVED
// Approving through /cases/:id/approve jumps straight to LAWYERS_ASSIGNED
// before any questionnaire or lawyer exists, so the pre-lawyer stages below
// go by what actually happened (questionnaires submitted, lawyers assigned)
// rather than by the status name alone.

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
  lawyersAssigned: boolean;
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
    lawyersAssigned: Boolean(item.assignedLawyerP1 && item.assignedLawyerP2),
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

const CLOSED = ["COMPLETED", "ARCHIVED", "CANCELLED"];

// CM approved, up to and including lawyers being assigned.
const PRE_LAWYER_STAGES = [
  "CM_APPROVED",
  "PRE_LAWYER_PENDING",
  "PRE_LAWYER_COMPLETED",
  "LAWYERS_ASSIGNED",
];

const questionnairesDone = (c: CaseStageFacts) =>
  c.p1QuestionnaireDone && c.p2QuestionnaireDone;

type Rule = (c: CaseStageFacts, me: string) => boolean;

/** The Workflow Stage filter options, in workflow order. */
export const STAGE_FILTERS: { value: string; label: string }[] = [
  { value: "NOT_PAID", label: "Not Paid" },
  { value: "PARTNER_NOT_JOINED", label: "Partner Not Joined" },
  { value: "APPLICANT_DRAFTING", label: "Applicant Drafting" },
  { value: "PARTNER_REVIEW", label: "Partner Review" },
  { value: "CM_NOT_ASSIGNED", label: "Case Manager Not Assigned" },
  { value: "MY_ACTIVE_REVIEWS", label: "Case Manager Review — My Active Reviews" },
  { value: "PRE_LAWYER_PENDING", label: "Pre-Lawyer Questionnaire Pending" },
  { value: "LAWYER_ASSIGNMENT_PENDING", label: "Lawyer Assignment Pending" },
  { value: "LEGAL_REVIEW", label: "Legal Review" },
  { value: "LAWYER_ILA_PENDING", label: "Independent Legal Advice (ILA)" },
  { value: "COMPLETED", label: "Completion & Execution" },
  { value: "READY_FOR_ARCHIVE", label: "Ready for Archive" },
  { value: "ARCHIVED", label: "Archived" },
];

const RULES: Record<string, Rule> = {
  // Payment not completed (or refunded).
  NOT_PAID: (c) => !c.isPaid,

  // Before submission and the partner has not accepted the invite / joined.
  PARTNER_NOT_JOINED: (c) => at(c, "NOT_PAID", "DRAFT") && !c.partnerJoined,

  // Paid, partner joined, both still filling forms (nobody has approved yet).
  APPLICANT_DRAFTING: (c) =>
    at(c, "DRAFT") && c.partnerJoined && !c.user1Approved && !c.user2Approved,

  // Paid, partner joined, one side has approved, waiting for the other.
  PARTNER_REVIEW: (c) =>
    at(c, "DRAFT") && c.partnerJoined && (c.user1Approved || c.user2Approved),

  // Open case with no case manager assigned.
  CM_NOT_ASSIGNED: (c) => !at(c, ...CLOSED) && !c.caseManagerId,

  // Submitted by the couple, waiting for the case manager to review/approve
  // (any case manager - the dashboard is not per user).
  MY_ACTIVE_REVIEWS: (c) => at(c, "COUPLE_SUBMITTED"),

  // CM approved; P1 or P2 has not submitted the pre-lawyer questionnaire.
  PRE_LAWYER_PENDING: (c) =>
    at(c, ...PRE_LAWYER_STAGES) && !c.lawyersAssigned && !questionnairesDone(c),

  // Both questionnaires submitted (lawyers chosen); CM has not assigned lawyers.
  LAWYER_ASSIGNMENT_PENDING: (c) =>
    at(c, ...PRE_LAWYER_STAGES) && !c.lawyersAssigned && questionnairesDone(c),

  // Lawyers assigned and reviewing (until the review is completed).
  LEGAL_REVIEW: (c) =>
    (at(c, ...PRE_LAWYER_STAGES) && c.lawyersAssigned) ||
    at(c, "LAWYER_REVIEW", "LAWYER_REVIEW_COMPLETED"),

  // ILA requested; waiting for P1/P2 ILA and lawyer sign-off.
  LAWYER_ILA_PENDING: (c) => at(c, "LAWYER_ILA_PENDING"),

  // Lawyers signed off; final client confirmations / completion in progress.
  COMPLETED: (c) =>
    at(c, "LAWYER_SIGNOFF_COMPLETE", "LAWYER_CLIENT_CONFIRMATION") ||
    (at(c, "COMPLETED") && !c.readyForArchive),

  // Completed and flagged ready for archive, not archived yet.
  READY_FOR_ARCHIVE: (c) => c.readyForArchive && !at(c, "ARCHIVED"),

  ARCHIVED: (c) => at(c, "ARCHIVED"),
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
