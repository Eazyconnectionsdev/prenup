// The lawyer portal's view of its assignments. Rows come from
// GET /lawyer/assignments (scope=active|archived); the backend decides each
// row's `stage` for the side the lawyer acts for, so the dashboard counts and
// the Active Cases list always use the same numbers.

import Axios from "@/lib/ApiConfig";

export type LawyerStage =
  | "REVIEW_PENDING"
  | "ILA_SIGNOFF_PENDING"
  | "FINAL_CONFIRMATION_PENDING"
  | "COMPLETED";

export interface LawyerAssignment {
  _id: string;
  caseNumber: string;
  side: "P1" | "P2";
  stage: LawyerStage;
  workflowStatus: string;
  agreementType: string | null;
  priority: string;
  applicantName: string;
  applicantEmail: string;
  partnerName: string;
  dateAssigned: string | null;
  stageEnteredAt: string | null;
  daysInStage: number | null;
  completedAt: string | null;
  archivedAt: string | null;
}

/** Pending stages, in order (the Workflow Stage filter). */
export const PENDING_STAGES: { value: LawyerStage; label: string }[] = [
  { value: "REVIEW_PENDING", label: "Review Pending" },
  { value: "ILA_SIGNOFF_PENDING", label: "ILA & Sign-off Pending" },
  { value: "FINAL_CONFIRMATION_PENDING", label: "Final Confirmation Pending" },
];

export const STAGE_LABEL: Record<LawyerStage, string> = {
  REVIEW_PENDING: "Review Pending",
  ILA_SIGNOFF_PENDING: "ILA & Sign-off Pending",
  FINAL_CONFIRMATION_PENDING: "Final Confirmation Pending",
  COMPLETED: "Completed",
};

/** Does a row match a Workflow Stage filter (ALL, PENDING, COMPLETED or a stage)? */
export function matchesLawyerStage(a: LawyerAssignment, filter: string): boolean {
  if (!filter || filter === "ALL") return true;
  if (filter === "PENDING") return a.stage !== "COMPLETED";
  return a.stage === filter;
}

export async function fetchAssignments(
  scope: "active" | "archived" = "active"
): Promise<LawyerAssignment[]> {
  const { data } = await Axios.get("/lawyer/assignments", { params: { scope } });
  return Array.isArray(data) ? data : [];
}
