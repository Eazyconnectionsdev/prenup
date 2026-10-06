export type YesNo = "Yes" | "No";

export type Treatment =
  | ""
  | "KeepSeparate"
  | "ShareEqually"
  | "Contribution"
  | "Percentage"
  | "Custom";

export interface TreatmentFields {
  treatment: Treatment;
  contributionText: string;
  percentageValue: string;
  customText: string;
}

/* Row types                                                                */
export interface IncomeRow extends TreatmentFields {
  id: string;
  description: string;
  amount: string;
}

export interface YesNoToggleProps {
  name: string;
  value: YesNo;
  onChange: (v: YesNo) => void;
}

export interface TreatmentSelectProps {
  id: string;
  fields: TreatmentFields;
  onChange: (fields: TreatmentFields) => void;
  label?: string;
  options?: { value: Treatment; label: string }[];
}
