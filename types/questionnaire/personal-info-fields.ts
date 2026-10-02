import type { personalInfoFormData } from "@/types/questionnaire/personal-info";
import type React from "react";

export interface Props {
  data: personalInfoFormData;
  onChange?: React.Dispatch<React.SetStateAction<personalInfoFormData>>;
  readOnly?: boolean;
}
