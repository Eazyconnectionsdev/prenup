export type StepId =
  | "invite"
  | "questionnaire"
  | "partner_questionnaire"
  | "joint_questionnaire"
  | "final_review";

export interface StepConfig {
  id: StepId;
  title: string;
  description: string;
  cta: string;
  completedLabel: string;
  icon: React.ReactNode;
}

