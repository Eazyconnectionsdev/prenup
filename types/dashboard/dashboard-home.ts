export type StepId = "invite" | "questionnaire" | "disclosure";

export interface StepConfig {
  id: StepId;
  title: string;
  description: string;
  cta: string;
  completedLabel: string;
  icon: React.ReactNode;
}
