import type { LawyerCase, LawyerPersona } from "@/types/lawyer";

export interface DashboardViewProps {
  cases: LawyerCase[];
  activePersona: LawyerPersona;
  onSelectCase: (caseId: string) => void;
  statusFilter: string;
  onFilterChange: (filter: string) => void;
  onCardClick: (filter: string) => void;
}
