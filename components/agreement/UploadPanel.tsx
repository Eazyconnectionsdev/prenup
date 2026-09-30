"use client";

import { UploadCloud, FileText } from "lucide-react";

interface UploadPanelProps {
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

export function UploadPanel({
  selectedFile,
  isDragging,
  fileError,
  amendmentSummaryText,
  isUploading,
  canUpload,
  fileInputRef,
  onDragOver,
  onDragLeave,
  onFileSelect,
  onRemoveFile,
  onAmendmentChange,
  onCancel,
  onUpload,
}: UploadPanelProps) {
  return (
    <section className="rounded-xl border border-border bg-card px-5 py-4">
      <h2 className="text-[15px] font-semibold">Upload New Version (Check-In)</h2>
      <p className="mt-1 text-[12px] text-muted-foreground">
        Upload a new version of the agreement.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept=".docx"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
          e.target.value = "";
        }}
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          onDragOver();
        }}
        onDragLeave={onDragLeave}
        onDrop={(e) => {
          e.preventDefault();
          onDragLeave();
          const file = e.dataTransfer.files?.[0];
          if (file) onFileSelect(file);
        }}
        className={`mt-4 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors ${
          isDragging ? "border-primary bg-accent/70" : "border-primary/35 bg-accent/40"
        }`}
      >
        {selectedFile ? (
          <>
            <FileText className="mx-auto h-8 w-8 text-primary" strokeWidth={1.6} />
            <p className="mt-2 text-[12.5px] font-medium text-foreground">{selectedFile.name}</p>
            <p className="text-[11px] text-muted-foreground">
              {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
            </p>
            <button
              onClick={onRemoveFile}
              className="mt-2 text-[11.5px] font-semibold text-destructive hover:underline"
            >
              Remove
            </button>
          </>
        ) : (
          <>
            <UploadCloud className="mx-auto h-8 w-8 text-primary" strokeWidth={1.6} />
            <p className="mt-2 text-[12.5px] text-muted-foreground">Drag &amp; drop file here</p>
            <p className="text-[12px] text-muted-foreground">or</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 rounded-lg border border-primary/40 bg-card px-3 py-1.5 text-[12.5px] font-semibold text-primary hover:bg-accent"
            >
              Choose File
            </button>
          </>
        )}
        <p className="mt-3 text-[11px] text-muted-foreground">DOCX only. Max size 50 MB</p>
      </div>

      <div className="mt-4">
        <div className="text-[11.5px] font-semibold tracking-wide text-muted-foreground">
          AMENDMENT SUMMARY <span className="text-destructive">*</span>
        </div>
        <p className="mt-1 text-[11.5px] text-muted-foreground">
          One change per line — this becomes the bullet list shown in version history.
        </p>
        <textarea
          value={amendmentSummaryText}
          onChange={(e) => onAmendmentChange(e.target.value)}
          rows={4}
          placeholder={"Amended Clause 45 (Property division)\nUpdated Clause 56 (Spousal Maintenance)"}
          className="mt-2 w-full rounded-lg border border-input px-3 py-2 text-[12.5px] outline-none focus:border-ring"
        />
      </div>

      <div className="mt-4 grid grid-cols-[1fr_1.6fr] gap-3">
        <button
          onClick={onCancel}
          className="rounded-lg border border-primary/40 px-3 py-2.5 text-[13px] font-semibold text-primary hover:bg-accent"
        >
          Cancel
        </button>
        <button
          onClick={onUpload}
          disabled={!selectedFile || isUploading || !canUpload}
          className="rounded-lg bg-primary px-3 py-2.5 text-[13px] font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isUploading ? "Uploading…" : "Upload & Create"}
        </button>
      </div>

      {!canUpload && (
        <p className="mt-2 text-[11px] text-muted-foreground">
          You need to check out this document before uploading a new version.
        </p>
      )}
    </section>
  );
}