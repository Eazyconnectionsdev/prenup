import type { FilterState } from "@/types/case-manager";

export interface CasesMasterViewProps {
  filters: FilterState;
  onFilterChange: (
    key: keyof FilterState,
    val: string
  ) => void;
  onResetFilters: () => void;
  onSelectCase: (caseId: string) => void;
}

export interface RowCase {
  id: string;
  p1: string;
  p2: string;
  cmView: string;
  owner: string;
  priority: string;
  daysInStatus: number;
}
