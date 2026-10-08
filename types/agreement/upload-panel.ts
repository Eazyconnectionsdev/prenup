export interface UploadPanelProps {
  selectedFile: File | null;
  isDragging: boolean;
  fileError: string | null;
  amendmentSummaryText: string;
  isUploading: boolean;
  canUpload: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onDragOver: () => void;
  onDragLeave: () => void;
  onFileSelect: (f: File) => void;
  onRemoveFile: () => void;
  onAmendmentChange: (v: string) => void;
  onCancel: () => void;
  onUpload: () => void;
}
