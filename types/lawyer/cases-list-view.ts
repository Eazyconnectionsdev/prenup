import type { LawyerCase, LawyerPersona } from "@/types/lawyer";

export interface CasesListViewProps {
  cases: LawyerCase[];
  activePersona: LawyerPersona;
  onSelectCase: (caseId: string) => void;
  searchQuery: string;
  statusFilter: string;
  onFilterChange: (filter: string) => void;
}
