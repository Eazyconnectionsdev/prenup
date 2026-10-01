import type { QuestionnaireStepSlug } from "@/types/questionnaire/steps";

export interface Options {
  step: QuestionnaireStepSlug;
  // "own": the logged-in user's answers (editable)
  // "partner": the other party's answers (read-only view)
  source?: "own" | "partner";
  // Receives the whole section object (`data.data` from the API)
  onLoad: (section: Record<string, any>) => void;
}
