/**
 * Every API function in /lib/api returns this shape instead of throwing.
 * The component checks `result.success` — no try/catch needed at call sites.
 */
export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface CaseParty {
  firstName?: string;
  lastName?: string;
}

export interface CaseDetails {
  _id: string;
  owner?: CaseParty;
  invitedUser?: CaseParty;
  [key: string]: unknown;
}

export interface VersionEntry {
  id: string;
  version: string;
  title?: string;
  by: string;
  role?: string;
  roleTag?: string;
  date: string;
  isLatest: boolean;
  amendmentSummary?: string[];
}

export interface VersionDetail {
  id: string;
  version: string;
  title?: string;
  isCurrent: boolean;
  isLatestAgreed?: boolean;
  statusLabel?: string;
  uploadedByName: string;
  uploadedByRole: string;
  pdfUrl: string | null;
  roleTag?: string;
  uploadedAt: string;
  fileUrl: string;
  fileName: string;
  fileSizeLabel: string;
  checksum: string;
  previousVersion?: string | null;
  lock?: {
    isLocked: boolean;
    lockedByName: string | null;
    lockedByRole: string | null;
    lockedAt: string | null;
  };
}

export interface LockStatus {
  isLocked: boolean;
  lockedByName: string | null;
  lockedByRole: string | null;
  lockedAt: string | null;
  isLockedByCurrentUser: boolean;
}

export interface CheckOutResult {
  s3Key: string;
  url: string;
  fileName: string;
  versionId: string;
}

export interface CheckInResult {
  success: boolean;
  fileName: string;
  s3Key: string;
  url: string;
  pdfUrl: string | null;
  majorVersion: number;
  minorVersion: number;
  versionId: string;
}

export interface DiffWordPart {
  value: string;
  added?: boolean;
  removed?: boolean;
}

export interface DiffParagraph {
  status: "unchanged" | "added" | "removed" | "modified";
  original?: string;
  updated?: string;
  words?: DiffWordPart[];
}
