import type { CaseStageFacts } from "@/lib/caseStages";

export interface LawyerFilterState {
  status: string;
  priority: string;
  search: string;
}

// One row of the lawyer's assigned-cases table, mapped from a Case document as
// GET /lawyer/cases returns it (owner / invitedUser populated).
export interface LawyerRowCase {
  id: string;
  caseNumber: string;
  p1Name: string;
  p2Name: string;
  service: string;
  status: string;
  priority: string;
  daysInStatus: number;
  lastActivity: string;
  facts: CaseStageFacts;
}
