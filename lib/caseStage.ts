import type { CaseApproval } from "@/types/store/cases-slice";

/**
 * The case workflow, in the order the backend moves through it
 * (CaseWorkflowStatus in case.schema.ts). CANCELLED and ARCHIVED are
 * end states rather than steps, so they are left out of the ordering.
 */
const WORKFLOW_ORDER = [
  "NOT_PAID",
  "DRAFT",
  "COUPLE_SUBMITTED",
  "CM_APPROVED",
  "PRE_LAWYER_PENDING",
  "PRE_LAWYER_COMPLETED",
  "LAWYERS_ASSIGNED",
  "LAWYER_CLIENT_CONFIRMATION",
  "LAWYER_REVIEW",
  "LAWYER_REVIEW_COMPLETED",
  "LAWYER_ILA_PENDING",
  "LAWYER_SIGNOFF_COMPLETE",
  "COMPLETED",
] as const;

const CM_APPROVED_INDEX = WORKFLOW_ORDER.indexOf("CM_APPROVED");

/**
 * Has the case manager signed the case off?
 *
 * Two things record this and they can disagree: `approval.caseManagerApproved`
 * (what the couple's own screens go by) and the case reaching CM_APPROVED or
 * beyond. Cases approved before both were written together only carry the
 * workflow status, so either one counts.
 */
export function isCaseManagerApproved(
  approval: CaseApproval | null | undefined,
  workflowStatus?: string | null,
): boolean {
  if (approval?.caseManagerApproved) return true;
  if (!workflowStatus) return false;

  const index = WORKFLOW_ORDER.indexOf(workflowStatus as never);
  return index >= CM_APPROVED_INDEX;
}
