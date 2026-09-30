import Axios from "@/lib/ApiConfig";
import { getErrorMessage } from "./http-error";
import type {
  ApiResult,
  VersionEntry,
  VersionDetail,
  LockStatus,
  CheckOutResult,
  CheckInResult,
  DiffParagraph,
} from "@/types/types-agreement";

export async function fetchCaseDetails(
  caseId: string,
){
  try {
     const { data } = await Axios.get(`/cases/${caseId}`);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to load version history."),
    };
  }
}

export async function fetchAllVersions(
  caseId: string,
): Promise<ApiResult<VersionEntry[]>> {
  try {
    const { data } = await Axios.get<VersionEntry[]>(
      `/agreement/${caseId}/document/all-versions`,
    );
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to load version history."),
    };
  }
}

export async function fetchVersionDetail(
  caseId: string,
  versionId: string,
): Promise<ApiResult<VersionDetail>> {
  try {
    const { data } = await Axios.get<VersionDetail>(
      `/agreement/${caseId}/document/${versionId}/detail`,
    );
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to load this version."),
    };
  }
}

export async function fetchLockStatus(
  caseId: string,
): Promise<ApiResult<LockStatus>> {
  try {
    const { data } = await Axios.get<LockStatus>(
      `/agreement/${caseId}/document/lawyer/lock-status`,
    );
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to load check-out status."),
    };
  }
}

export async function checkOutDocument(
  caseId: string,
): Promise<ApiResult<CheckOutResult>> {
  try {
    const { data } = await Axios.post<CheckOutResult>(
      `/agreement/${caseId}/document/lawyer/checkout`,
    );
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to check out the document."),
    };
  }
}

/**
 * ASSUMPTION: the original component had a "Check In" button in the lock
 * panel with no onClick and no matching endpoint anywhere in the file.
 * "Check in with a new version" already exists as checkInDocument() below.
 * This releases the lock WITHOUT uploading a file (e.g. "never mind,
 * I'm done reviewing, let someone else check it out"). I've guessed a
 * REST-ish path — confirm/adjust it against your actual backend route.
 */
export async function releaseCheckout(
  caseId: string,
): Promise<ApiResult<{ success: boolean }>> {
  try {
    const { data } = await Axios.post<{ success: boolean }>(
      `/agreement/${caseId}/document/lawyer/checkin-release`,
    );
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to check in the document."),
    };
  }
}

export async function checkInDocument(
  caseId: string,
  file: File,
  amendmentSummary: string[],
): Promise<ApiResult<CheckInResult>> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("amendmentSummary", JSON.stringify(amendmentSummary));

    const { data } = await Axios.post<CheckInResult>(
      `/agreement/${caseId}/document/lawyer/checkin`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to upload the new version."),
    };
  }
}


export async function downloadVersionFile(
  fileUrl: string,
  fileName: string,
): Promise<ApiResult<void>> {
  try {

    console.log(":fileUrl", fileUrl)
    console.log(":fileName", fileName)

    const res = await fetch(fileUrl);
    if (!res.ok) {
      throw new Error(`Download failed (status ${res.status}).`);
    }
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = fileName || "document.docx";
    a.click();
    URL.revokeObjectURL(objectUrl);
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to download the file."),
    };
  }
}

export async function compareDocumentVersions(
  caseId: string,
  versionA: string,
  versionB: string,
): Promise<ApiResult<DiffParagraph[]>> {
  try {
    const { data } = await Axios.get<DiffParagraph[]>(
      `/agreement/${caseId}/document/compare`,
      { params: { versionA, versionB } },
    );
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to compare versions."),
    };
  }
}