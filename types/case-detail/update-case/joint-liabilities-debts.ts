import type { TreatmentFields } from "@/types/forms/form-primitives";

export interface SharedDebtRow extends TreatmentFields {
  id: string;
  lenderName: string;
  liabilityType: string;
  outstandingBalance: string;
}

export interface SharedLiabilitiesFormProps {
  onContinue?: () => void;
}
