"use client";

import CaseAuditLog from "@/components/audit/CaseAuditLog";
import type { Props } from "@/types/case-detail/tabs/audit-tab";

export default function AuditTab({ caseData }: Props) {
  return <CaseAuditLog caseId={caseData?._id} scope="lawyer" />;
}
