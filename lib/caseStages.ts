import { isCasePaid } from "@/lib/casePayment";

// One set of rules for the Case Manager dashboard counts, the Active Cases
// stage filter and the Archived Cases page, so a tile's number always equals
// the rows it opens.
//
// Real workflow, as the backend moves a case:
//   NOT_PAID -> (payment) DRAFT -> (both partners approve) COUPLE_SUBMITTED
//   -> (CM approves) LAWYERS_ASSIGNED       (CM returns -> DRAFT + cmReturnReason)
//      the pre-lawyer stage opens: each partner fills the pre-lawyer
//      questionnaire and chooses their own solicitor
//      (preQuestionnaireUserN.selectedLawyer)
//   -> (both questionnaires submitted) PRE_LAWYER_COMPLETED
//   -> (lawyer review done) LAWYER_REVIEW_COMPLETED
//   -> (ILA requested) LAWYER_ILA_PENDING
//   -> (both lawyers signed off) LAWYER_CLIENT_CONFIRMATION
//   -> (both final confirmations, case completed) COMPLETED
//   -> (30 days after completion, automatically) ARCHIVED
// Older cases may sit in CM_APPROVED / PRE_LAWYER_PENDING, or have lawyers a
// case manager assigned (assignedLawyerP1/P2); both are still understood.
//
// Lifecycle buckets: Not Paid -> Active Cases -> Archived.
//   Not Paid     payment not completed (or refunded)
//   Active       paid, still being worked on; every active case is in exactly
//                one active stage below, so the stage counts add up to it
//   Completed    finished, waiting out the 30 days ("Recently Completed");
//                listed on Archived Cases, not on Active Cases
//   Archived     archived
// Set-aside (cancelled) cases are in none of them.

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
  cancelled: boolean;
  completedAt: string | null;
  archivedAt: string | null;
}

const idOf = (ref: any): string =>
  ref && typeof ref === "object"
    ? String(ref._id || ref.id || "")
    : typeof ref === "string"
    ? ref
    : "";

// One definition of "paid", shared with the client dashboard.
export { isCasePaid };

/**
 * The solicitor acting for each partner: the one they chose, falling back to
 * the older case-manager assignment. Same rule as the backend's caseLawyerIds.
 */
export function caseLawyers(item: any): { p1: any; p2: any } {
  return {
    p1: item?.preQuestionnaireUser1?.selectedLawyer || item?.assignedLawyerP1 || null,
    p2: item?.preQuestionnaireUser2?.selectedLawyer || item?.assignedLawyerP2 || null,
  };
}

/** Payment status as shown to staff: a completed payment reads "Successful". */
export function paymentLabel(item: any): string {
  if (isCasePaid(item)) return "Successful";
  const raw = String(item?.paymentStatus || "").toUpperCase();
  if (raw === "PARTIALLY_REFUNDED") return "Partially Refunded";
  if (!raw || raw === "COMPLETED") return "Pending";
  return raw.charAt(0) + raw.slice(1).toLowerCase();
}

/** Pull the stage-related facts out of a raw case from the API. */
export function toStageFacts(item: any): CaseStageFacts {
  const approval = item.approval || {};
  const user1Approved = Boolean(approval.user1Approved);
  const user2Approved = Boolean(approval.user2Approved);
  const workflowStage = item.workflowStatus || "DRAFT";
  return {
    workflowStage,
    isPaid: isCasePaid(item),
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
    lawyersAssigned: (() => {
      const { p1, p2 } = caseLawyers(item);
      return Boolean(p1 && p2);
    })(),
    p1Confirmed: Boolean(item.p1Confirmed),
    p2Confirmed: Boolean(item.p2Confirmed),
    p1IlaDone: Boolean(item.p1ILACompleted),
    p2IlaDone: Boolean(item.p2ILACompleted),
    p1LawyerSigned: Boolean(item.p1LawyerSigned),
    p2LawyerSigned: Boolean(item.p2LawyerSigned),
    readyForArchive: Boolean(item.readyForArchive),
    cancelled: workflowStage === "CANCELLED" || Boolean(item.abandonedAt),
    completedAt: item.completedAt || null,
    archivedAt: item.archivedAt || null,
  };
}

const PRE_LAWYER_STAGES = [
  "CM_APPROVED",
  "PRE_LAWYER_PENDING",
  "PRE_LAWYER_COMPLETED",
  "LAWYERS_ASSIGNED",
];

export type Lifecycle = "NOT_PAID" | "ACTIVE" | "COMPLETED" | "ARCHIVED" | "CANCELLED";

export function lifecycleOf(c: CaseStageFacts): Lifecycle {
  if (c.workflowStage === "ARCHIVED") return "ARCHIVED";
  if (c.cancelled) return "CANCELLED";
  if (c.workflowStage === "COMPLETED") return "COMPLETED";
  if (!c.isPaid) return "NOT_PAID";
  return "ACTIVE";
}

/** The active stages, in workflow order (the Active Cases sub-menu). */
export const ACTIVE_STAGES: { value: string; label: string; hint: string }[] = [
  { value: "PARTNER_NOT_JOINED", label: "Partner Not Joined", hint: "Paid; partner has not joined yet" },
  { value: "APPLICANT_DRAFTING", label: "Applicant Drafting", hint: "Both partners completing forms" },
  { value: "PARTNER_REVIEW", label: "Partner Review", hint: "One partner approved; waiting for the other" },
  { value: "CM_NOT_ASSIGNED", label: "Case Manager Not Assigned", hint: "Submitted; no case manager assigned" },
  { value: "CM_REVIEW", label: "Case Manager Review", hint: "Submitted; with the case manager for review" },
  { value: "PRE_LAWYER_PENDING", label: "Pre-Lawyer Questionnaire Pending", hint: "CM approved; waiting for applicant questionnaires" },
  { value: "LAWYER_ASSIGNMENT_PENDING", label: "Lawyer Assignment Pending", hint: "Questionnaires done; waiting for both partners to choose a solicitor" },
  { value: "LEGAL_REVIEW", label: "Legal Review", hint: "Both solicitors chosen and reviewing" },
  { value: "LAWYER_ILA_PENDING", label: "Independent Legal Advice (ILA)", hint: "Waiting for ILA and lawyer sign-off" },
  { value: "COMPLETION_EXECUTION", label: "Completion & Execution", hint: "Signed off; final confirmations in progress" },
];

/** The one active stage of a paid, open case. */
export function activeStageOf(c: CaseStageFacts): string {
  const s = c.workflowStage;
  // A paid case still marked NOT_PAID is a draft the payment hook missed.
  if (s === "DRAFT" || s === "NOT_PAID") {
    if (!c.partnerJoined) return "PARTNER_NOT_JOINED";
    return c.user1Approved || c.user2Approved ? "PARTNER_REVIEW" : "APPLICANT_DRAFTING";
  }
  if (s === "COUPLE_SUBMITTED") return c.caseManagerId ? "CM_REVIEW" : "CM_NOT_ASSIGNED";
  if (PRE_LAWYER_STAGES.includes(s)) {
    if (!(c.p1QuestionnaireDone && c.p2QuestionnaireDone)) return "PRE_LAWYER_PENDING";
    return c.lawyersAssigned ? "LEGAL_REVIEW" : "LAWYER_ASSIGNMENT_PENDING";
  }
  if (s === "LAWYER_REVIEW" || s === "LAWYER_REVIEW_COMPLETED") return "LEGAL_REVIEW";
  if (s === "LAWYER_ILA_PENDING") return "LAWYER_ILA_PENDING";
  if (s === "LAWYER_SIGNOFF_COMPLETE" || s === "LAWYER_CLIENT_CONFIRMATION") {
    return "COMPLETION_EXECUTION";
  }
  // Unknown status on a paid open case: keep it visible at the start.
  return "APPLICANT_DRAFTING";
}

// Old links (dashboard bookmarks) used these names.
const ALIASES: Record<string, string> = {
  MY_ACTIVE_REVIEWS: "CM_REVIEW",
  COMPLETED: "COMPLETION_EXECUTION",
};

/** The stage label shown in tables. */
export function stageLabelOf(c: CaseStageFacts): string {
  switch (lifecycleOf(c)) {
    case "NOT_PAID":
      return "Not Paid";
    case "COMPLETED":
      return "Recently Completed";
    case "ARCHIVED":
      return "Archived";
    case "CANCELLED":
      return "Set Aside";
    default: {
      const v = activeStageOf(c);
      return ACTIVE_STAGES.find((x) => x.value === v)?.label ?? v;
    }
  }
}

/**
 * Does a case match an Active Cases filter value?
 *   ALL      everything on Active Cases (Not Paid + Active)
 *   NOT_PAID / ACTIVE, or one active stage.
 */
export function matchesStageFilter(c: CaseStageFacts, filter: string): boolean {
  const f = ALIASES[filter] ?? filter;
  const life = lifecycleOf(c);
  if (!f || f === "ALL") return life === "NOT_PAID" || life === "ACTIVE";
  if (f === "NOT_PAID") return life === "NOT_PAID";
  if (f === "ACTIVE") return life === "ACTIVE";
  if (life !== "ACTIVE") return false;
  return activeStageOf(c) === f;
}

/** Normalise a filter value from the URL (old names, unknown values). */
export function normaliseStageFilter(value: string | null | undefined): string {
  const v = ALIASES[value || ""] ?? (value || "ALL");
  const known = ["ALL", "NOT_PAID", "ACTIVE", ...ACTIVE_STAGES.map((s) => s.value)];
  return known.includes(v) ? v : "ALL";
}

/** Count cases matching each filter value. */
export function countByStageFilter(
  cases: CaseStageFacts[],
  filters: string[]
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const f of filters) {
    out[f] = cases.filter((c) => matchesStageFilter(c, f)).length;
  }
  return out;
}

// ── Archived Cases ──────────────────────────────────────────────────────────

/** Services, as the Service Type filters list them. */
export const SERVICE_TYPES: { value: string; label: string }[] = [
  { value: "prenup-marriage", label: "Prenuptial Agreement – Marriage" },
  { value: "prenup-civil", label: "Prenuptial Agreement – Civil Partnership" },
  { value: "postnup-marriage", label: "Postnuptial Agreement – Marriage" },
  { value: "postnup-civil", label: "Postnuptial Agreement – Civil Partnership" },
  { value: "cohabitation", label: "Cohabitation Agreement" },
];

export function serviceLabel(type?: string | null): string {
  if (!type) return "Prenuptial Agreement – Marriage";
  if (type === "help-choose") return "Prenuptial Agreement (help me choose)";
  return SERVICE_TYPES.find((s) => s.value === type)?.label ?? type.replace(/-/g, " ");
}

export const DATE_RANGES: { value: string; label: string }[] = [
  { value: "ALL", label: "All Time" },
  { value: "TODAY", label: "Today" },
  { value: "7", label: "Last 7 Days" },
  { value: "30", label: "Last 30 Days" },
  { value: "90", label: "Last 90 Days" },
  { value: "CUSTOM", label: "Custom Range" },
];

/** Is `date` inside the chosen range? `from`/`to` are yyyy-mm-dd for CUSTOM. */
export function inDateRange(
  date: string | Date | null | undefined,
  range: string,
  from = "",
  to = ""
): boolean {
  if (!range || range === "ALL") return true;
  if (!date) return false;
  const d = new Date(date);
  if (isNaN(+d)) return false;
  const now = new Date();
  if (range === "TODAY") return d.toDateString() === now.toDateString();
  if (range === "CUSTOM") {
    if (from && d < new Date(`${from}T00:00:00`)) return false;
    if (to && d > new Date(`${to}T23:59:59.999`)) return false;
    return true;
  }
  const days = Number(range);
  if (!Number.isFinite(days)) return true;
  return now.getTime() - d.getTime() <= days * 86_400_000;
}

export function formatDate(date?: string | Date | null): string {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(+d)) return "—";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
