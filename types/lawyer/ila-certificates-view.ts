import type { LawyerCase, LawyerPersona } from "@/types/lawyer";

export interface IlaCertificatesViewProps {
  cases: LawyerCase[];
  activePersona: LawyerPersona;
  onSelectCase: (caseId: string) => void;
}
