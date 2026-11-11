import type { TreatmentFields, YesNo } from "@/types/forms/form-primitives";
import type React from "react";

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

export interface LiabilitiesData {
  hasDebts: YesNo;
  debts: DebtRow[];
  hasMaintenance: YesNo;
  maintenance: MaintenanceRow[];
}

export interface Props {
  data: LiabilitiesData;
  onChange?: React.Dispatch<React.SetStateAction<LiabilitiesData>>;
  readOnly?: boolean;
  /** Validation messages keyed by their dotted path, e.g. `debts.0.lenderName`. */
  errors?: Record<string, string>;
  /** Called with a field's path as it is edited, to clear that message. */
  onClearError?: (path: string) => void;
}
