import type { LawyerCase, LawyerPersona } from "@/types/lawyer";

export interface AgreementVersionsViewProps {
  cases: LawyerCase[];
  activePersona: LawyerPersona;
  onSelectCase: (caseId: string) => void;
}
