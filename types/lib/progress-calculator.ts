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
