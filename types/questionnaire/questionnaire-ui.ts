import type { Treatment, TreatmentFields, YesNo } from "@/types/forms/form-primitives";
import type React from "react";
import type { ReactNode } from "react";

/* Page layout                                                             */
export interface FormShellProps {
  title: string;
  description: ReactNode;
  stepLabel?: string;
  readOnly?: boolean;
  children: ReactNode;
}

export interface RadioCardProps {
  id: string;
  name: string;
  label: string;
  checked: boolean;
  onChange?: () => void;
  readOnly?: boolean;
}

export interface YesNoToggleProps {
  name: string;
  value: YesNo | "";
  onChange?: (v: YesNo) => void;
  readOnly?: boolean;
}

export interface CheckCardProps {
  id: string;
  name?: string;
  title: string;
  description: string;
  checked: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}

/* Repeating rows                                                          */
export interface MatrixBoxProps {
  title: string;
  children: ReactNode;
  onAdd?: () => void;
  addLabel?: string;
}

/* Value + treatment fields                                                */
export interface ValueWithUnsureProps {
  id: string;
  value: string;
  unknown: boolean;
  onValueChange?: (v: string) => void;
  onUnknownChange?: (v: boolean) => void;
  placeholder: string;
  readOnly?: boolean;
}

export interface TreatmentSelectProps {
  id: string;
  fields: TreatmentFields;
  onChange?: (fields: TreatmentFields) => void;
  label?: string;
  options?: { value: Treatment; label: string }[];
  readOnly?: boolean;
}
