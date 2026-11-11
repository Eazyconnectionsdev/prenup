import type { CaseApproval } from "@/types/store/cases-slice";

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


export function isCaseManagerApproved(
  approval: CaseApproval | null | undefined,
  workflowStatus?: string | null,
): boolean {
  if (approval?.caseManagerApproved) return true;
  if (!workflowStatus) return false;

  const index = WORKFLOW_ORDER.indexOf(workflowStatus as never);
  return index >= CM_APPROVED_INDEX;
}
