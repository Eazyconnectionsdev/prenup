export interface Props {
  data: any;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
}

export type YesNo = "Yes" | "No";

export type Treatment =
  | ""
  | "KeepSeparate"
  | "ShareEqually"
  | "Contribution"
  | "Percentage"
  | "Custom";

export interface IncomeRow {
  id: string;
  description: string;
  source: string;
  annualIncome: string;
  treatment: Treatment;
  contributionText: string;
  percentageValue: string;
  customText: string;
}
