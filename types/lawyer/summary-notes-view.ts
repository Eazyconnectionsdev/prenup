import type { LawyerCase, LawyerPersona } from "@/types/lawyer";

export interface SummaryNotesViewProps {
  cases: LawyerCase[];
  activePersona: LawyerPersona;
  onSelectCase: (caseId: string) => void;
}
