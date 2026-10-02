import type { VersionDetail } from "@/types/agreement";

export interface DocumentViewerProps {
  versionDetail: VersionDetail | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  showingPdf: boolean;
  zoomLevel: number;
  currentPage: number;
  totalPages: number | null;
  viewerRef: React.RefObject<HTMLDivElement | null>;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleFullscreen: () => void;
  downloadError: string | null;
  onPageInfoChange: (info: { current: number; total: number | null }) => void;
}
