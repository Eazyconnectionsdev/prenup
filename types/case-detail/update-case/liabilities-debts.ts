import type { TreatmentFields } from "@/types/forms/form-primitives";

export interface DebtRow extends TreatmentFields {
  id: string;
  lenderName: string;
  debtType: string;
  outstandingBalance: string;
}

export interface MaintenanceRow extends TreatmentFields {
  id: string;
  dependentLink: string;
  monthlyPayment: string;
  projectedEndDate: string;
}

/* Main component                                                          */
export interface LiabilitiesFormProps {
  onContinue?: () => void;
}
