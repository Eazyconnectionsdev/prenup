import type { ReportColumnDef, ReportRowData } from "@/types/case-manager";

export interface ReusableReportTableProps {
  columns: ReportColumnDef[];
  data: ReportRowData[];
  onViewRow: (row: ReportRowData) => void;
  reportTitle: string;
}
