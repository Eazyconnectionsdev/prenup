import type { AuditLog, CaseItem } from "@/types/case-manager";

export interface CaseSlideDrawerProps {
  caseObj: CaseItem | null;
  isOpen: boolean;
  onClose: () => void;
  auditLogs: AuditLog[];
  onApprove: () => void;
  onReturnToDraft: () => void;
  onAssignLawyers: () => void;
  onReplaceLawyer: () => void;
  onSendReminder: () => void;
  onRegenPdf: () => void;
  onEscalate: () => void;
  onArchive: () => void;
  onSaveNote: (note: string) => void;
  onRbacProhibitedTest: (actionName: string) => void;
  onUpdateCase?: (updatedCase: CaseItem) => void;
  onOpenPaymentModal?: () => void;
}
