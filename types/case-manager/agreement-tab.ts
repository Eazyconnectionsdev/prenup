export interface InitializeLawyerStageResult {
  success: boolean;
  fileName: string;
  s3Key: string;
  url: string;
  pdfUrl: string | null;
  majorVersion: number;
  minorVersion: number;
  versionId: string;
}

export interface AgreementTabProps {
  caseId: string;
}
