import type { CaseItem } from "@/types/case-manager";

export interface ReportsViewProps {
  cases: CaseItem[];
  onLogApiCall?: (endpoint: string, method: string, payload: any) => void;
}
