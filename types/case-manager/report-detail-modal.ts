import type { ReportRowData } from "@/types/case-manager";

export interface ReportDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  row: ReportRowData | null;
  reportTitle: string;
}
