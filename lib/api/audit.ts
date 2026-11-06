import Axios from "@/lib/ApiConfig";
import { getErrorMessage } from "./http-error";
import type { ApiResult } from "@/types/agreement";
import type { AuditLogEntry, AuditLogUser } from "@/types/audit";

/**
 * Which route serves the audit trail depends on who is asking: each staff
 * area has its own, and they are role-guarded separately.
 */
export type AuditScope = "admin" | "case-manager" | "lawyer";

const SCOPE_PATHS: Record<AuditScope, (caseId: string) => string> = {
  admin: (caseId) => `/audit-logs/case/${caseId}`,
  "case-manager": (caseId) => `/case-manager/${caseId}/audit-log`,
  lawyer: (caseId) => `/lawyer/${caseId}/audit-log`,
};

export async function fetchCaseAuditLog(
  caseId: string,
  scope: AuditScope,
): Promise<ApiResult<AuditLogEntry[]>> {
  try {
    const { data } = await Axios.get(SCOPE_PATHS[scope](caseId));
    // The routes have returned bare arrays and {items:[...]} at different
    // times; accept either rather than showing an empty trail.
    const rows: AuditLogEntry[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.items)
        ? data.items
        : [];
    return { success: true, data: rows };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to load the audit trail."),
    };
  }
}

/** "FORM_SUBMITTED" -> "Form submitted" */
export function auditActionLabel(action?: string): string {
  if (!action) return "Activity";
  const words = action.replace(/_/g, " ").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function auditUser(entry: AuditLogEntry): {
  name: string;
  email: string | null;
  role: string | null;
} {
  const user = entry.userId;
  if (!user || typeof user === "string") {
    return { name: "System", email: null, role: entry.userRole ?? null };
  }
  const named = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  return {
    name: named || user.email || "System",
    email: user.email ?? null,
    role: entry.userRole ?? user.role ?? null,
  };
}

/** The role as the trail should read it: PRIMARY/SECONDARY stay as given. */
export function auditRoleLabel(role?: string | null): string {
  if (!role) return "System";
  const map: Record<string, string> = {
    PRIMARY: "Applicant 1",
    SECONDARY: "Applicant 2",
    case_manager: "Case Manager",
    end_user: "Applicant",
    superadmin: "Super Admin",
    admin: "Admin",
    lawyer: "Lawyer",
    staff: "Staff",
  };
  return map[role] ?? auditActionLabel(role);
}

export type { AuditLogEntry, AuditLogUser };
