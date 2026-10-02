import type { LawyerCase, LawyerPersona } from "@/types/lawyer";

export interface AppendicesViewProps {
  cases: LawyerCase[];
  activePersona: LawyerPersona;
  onSelectCase: (caseId: string) => void;
}
