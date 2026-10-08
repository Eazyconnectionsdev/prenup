import type { CaseDetails, VersionEntry } from "@/types/agreement";

export interface SummaryStripProps {
  caseDetails: CaseDetails | null;
  currentVersion: VersionEntry | undefined;
  error: string | null;
}
