import type { LawyerCase, LawyerPersona } from "@/types/lawyer";

export interface CompletedCasesViewProps {
  cases: LawyerCase[];
  activePersona: LawyerPersona;
  onSelectCase: (caseId: string) => void;
  searchQuery: string;
}
