import type { CaseItem } from "@/types/case-manager";

export interface FormsDisclosuresTabProps {
  caseObj: CaseItem;
  isCmEditing: boolean;
  setIsCmEditing: (v: boolean) => void;
  onSave: () => void;
}
