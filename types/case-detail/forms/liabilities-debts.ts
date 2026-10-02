export interface Props {
  data: any;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
}

export type Treatment =
  | ""
  | "KeepSeparate"
  | "ShareEqually"
  | "Contribution"
  | "Percentage"
  | "Custom";

export interface TreatmentFields {
  treatment?: Treatment;
  contributionText?: string;
  percentageValue?: string;
  customText?: string;
}

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

/* Treatment component                                                     */
export interface TreatmentSelectProps {
  fields: TreatmentFields;
  disabled?: boolean;
  label?: string;
  onChange: (fields: TreatmentFields) => void;
}
