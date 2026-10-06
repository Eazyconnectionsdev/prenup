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
  treatment: Treatment;
  contributionText: string;
  percentageValue: string;
  customText: string;
}
