import type { DiffParagraph } from "@/types/agreement";

export interface DiffViewerProps {
  diff: DiffParagraph[];
  leftLabel?: string;
  rightLabel?: string;
}

export interface DiffRow {
  key: string;
  leftLineNo: number | null;
  rightLineNo: number | null;
  leftSign: "-" | null;
  rightSign: "+" | null;
  leftBg: string;
  rightBg: string;
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
}
