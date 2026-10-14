export interface CaseData {
  myInformation: Record<string, any>;
  partnerInformation: Record<string, any>;
  jointInformation: Record<string, any>;
}

export interface ProgressResult {
  completed: number;
  total: number;
  percentage: number;
}

// How far one of the Final Review sections has got
export interface SectionProgress {
  completed: number;
  total: number;
  isComplete: boolean;
}
