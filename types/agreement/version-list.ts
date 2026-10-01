import type { VersionEntry } from "@/types/agreement";

export interface VersionListProps {
  versions: VersionEntry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  error: string | null;
  onRetry: () => void;
  compareMode: boolean;
  selectedForCompare: string[];
  onToggleCompareSelect: (id: string) => void;
  onCompareClick: () => void;
  isComparing: boolean;
}
