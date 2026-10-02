import type { LawyerActionsWorkflowState, LawyerCase, LawyerPersona } from "@/types/lawyer";

export interface CaseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  caseObj: LawyerCase | null;
  activePersona: LawyerPersona;
  onUploadVersion: (caseId: string, versionNum: string, desc: string) => void;
  onUploadCleanMaster: (caseId: string) => void;
  onApproveCleanMaster: (caseId: string) => void;
  onClientApprove: (caseId: string, party: 'p1' | 'p2') => void;
  onIssueIla: (caseId: string, party: 'p1' | 'p2') => void;
  onSignAgreement: (caseId: string) => void;
  onSaveNote: (caseId: string, notes: string) => void;
  onUploadAppendix: (caseId: string, section: 'A' | 'B' | 'C', title: string, desc: string, fileName: string) => void;
  onUpdateWorkflowState?: (caseId: string, workflowStateUpdate: Partial<LawyerActionsWorkflowState>) => void;
  isInline?: boolean;
}
