/**
 * The case stages the backend builds in `getCaseStages` and hands back on
 * GET /cases/:id (as `stages`) and GET /cases/:id/stages. Only the fields the
 * client dashboard reads are typed here -- the staff views take the rest
 * straight off the response.
 */

export type StageStatus = "Pending" | "In Progress" | "Completed";

export interface CaseStage {
  id: string;
  name: string;
  status: StageStatus | string;
}

export interface CaseStages {
  caseId?: string;
  caseNumber?: string | null;
  stageA?: CaseStage;
  stage1?: CaseStage;
  stage2?: CaseStage;
  stage3?: CaseStage;
  stage4?: CaseStage;
}

/** The four numbered stages, in order, skipping any the backend left out. */
export function orderedStages(stages?: CaseStages | null): CaseStage[] {
  if (!stages) return [];
  return [stages.stage1, stages.stage2, stages.stage3, stages.stage4].filter(
    (stage): stage is CaseStage => Boolean(stage),
  );
}
