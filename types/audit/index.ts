/**
 * The audit trail rows the backend's audit-log module returns
 * (GET /audit-logs/case/:caseId, /case-manager/:caseId/audit-log and
 * /lawyer/:caseId/audit-log all hand back the same shape).
 */
export interface AuditLogUser {
  _id?: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  role?: string | null;
}

export interface AuditLogEntry {
  _id: string;
  module: string;
  entityType: string;
  entityId?: string;
  caseId?: string;
  action: string;
  stage?: string | null;
  notes?: string | null;
  changedFields?: Record<string, { old: unknown; new: unknown }> | null;
  /** Populated when the acting user still exists, otherwise just the id. */
  userId?: AuditLogUser | string | null;
  userRole?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
