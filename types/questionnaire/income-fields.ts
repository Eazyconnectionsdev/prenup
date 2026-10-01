import type { TreatmentFields, YesNo } from "@/types/forms/form-primitives";
import type React from "react";

export interface IncomeRow extends TreatmentFields {
  id: string;
  description: string;
  amount: string;
}

export interface IncomeData {
  grossAnnualIncome: string;
  salaryTreatment: TreatmentFields;
  hasPrimaryBonus: YesNo;
  primaryIncomeRows: IncomeRow[];
  hasAlternativeIncome: YesNo;
  altIncomeRows: IncomeRow[];
}

export type RowsKey = "primaryIncomeRows" | "altIncomeRows";

export interface Props {
  data: IncomeData;
  onChange?: React.Dispatch<React.SetStateAction<IncomeData>>;
  readOnly?: boolean;
}
