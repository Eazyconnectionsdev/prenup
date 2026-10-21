export type StepId =
  | "stage_1"
  | "stage_2"
  | "stage_3"
  | "stage_4"
  | "questionnaire"
  | "partner_questionnaire"
  | "joint_questionnaire"
  | "final_review";

export interface StepConfig {
  id: StepId;
  stageNumber?: string;
  title: string;
  description: string;
  cta: string;
  completedLabel: string;
  icon: React.ReactNode;
}

