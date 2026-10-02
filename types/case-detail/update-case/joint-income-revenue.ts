import type { TreatmentFields } from "@/types/forms/form-primitives";

export interface SharedIncomeRow extends TreatmentFields {
  id: string;
  description: string;
  source: string;
  annualIncome: string;
}

export interface SharedIncomeFormProps {
  onContinue?: () => void;
}
