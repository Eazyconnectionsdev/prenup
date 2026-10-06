import type { CaseItem } from "@/types/case-manager";

export interface ArchivedVaultViewProps {
  archivedCases: CaseItem[];
  onSelectCase: (caseId: string) => void;
}
