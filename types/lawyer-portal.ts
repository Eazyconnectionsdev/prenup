export type NavView =
  | 'dashboard'
  | 'assigned_cases'
  | 'versions'
  | 'notes'
  | 'appendices'
  | 'ila'
  | 'completed'
  | 'profile'
  | 'settings';

export type CaseTabId =
  | 'overview'
  | 'client_details'
  | 'versions'
  | 'notes'
  | 'appendices'
  | 'ila'
  | 'timeline'
  | 'emails';

export type LawyerPersona = 'L1' | 'L2' | 'L3'; // L1 = Partner 1 Lawyer, L2 = Partner 2 Lawyer, L3 = Opposing Third-Party Counsel

export type CaseStatus =
  | 'FORMS_LOCKED'
  | 'LAWYER_REVIEW'
  | 'AWAITING_COUNTERPARTY_LAWYER_APPROVAL'
  | 'CLIENT_APPROVAL_PENDING'
  | 'CLIENT_PARTIALLY_APPROVED'
  | 'RETURNED_TO_LAWYERS'
  | 'CLIENT_APPROVED' // Ready for ILA
  | 'ILA_P1_COMPLETE'
  | 'ILA_P2_COMPLETE'
  | 'READY_FOR_SIGNING'
  | 'CLOSED'
  | 'ARCHIVED';

export interface AgreementVersion {
  version: string;
  uploadedBy: string;
  uploadedDate: string;
  published: 'YES' | 'NO' | 'Pending';
  description: string;
  s3Path: string;
  fileSize: string;
}

export interface SummaryNote {
  version: string;
  notes: string;
  createdBy: string;
  createdDate: string;
  visibleTo: 'L1' | 'L2' | 'BOTH'; // L1 Notes only visible to L1, L2 only visible to L2 in V1.1
}

export interface Appendix {
  id: string;
  title: string;
  description: string;
  fileName: string;
  uploadedBy: string;
  createdDate: string;
  s3Path: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  module: string;
  ipAddress: string;
  timestamp: string;
  before: string;
  after: string;
}

export interface LawyerCase {
  id: string; // CASE_ID e.g. LP-2026-001
  service: string; // SERVICE e.g. Premier Bespoke
  status: CaseStatus; // STATUS
  p1Name: string; // CLIENT 1
  p2Name: string; // CLIENT 2
  p1Firm: string; // FIRM 1
  p2Firm: string; // FIRM 2
  p1Lawyer: string; // LAWYER 1
  p2Lawyer: string; // LAWYER 2
  currentVersion: string; // CURRENT_VERSION (lawyer-facing)
  publishedVersion: string; // PUBLISHED_VERSION (client-facing)
  lastActivity: string; // LAST_ACTIVITY
  daysInStatus: number; // DAYS_IN_STATUS
  certificateExpiryDate?: string; // For Expiring Certificates metric (< 30 days)
  
  // Client forms (Read-only data)
  p1Forms: ClientFormsData;
  p2Forms: ClientFormsData;
  
  // Versions
  versions: AgreementVersion[];
  
  // Notes
  notes: SummaryNote[];
  
  // Appendices
  appendices: {
    A: Appendix[]; // Property Documents
    B: Appendix[]; // Bank Statements
    C: Appendix[]; // Trust Documentation
  };

  // ILA certificates details
  ilaP1Cert?: IlaCertDetails;
  ilaP2Cert?: IlaCertDetails;

  // Simulated Email logs
  emails: EmailLog[];

  // 2-Stage Lawyer Actions Workflow State (Persisted across sessions)
  workflowState?: LawyerActionsWorkflowState;
}

export interface LawyerActionsWorkflowState {
  clientConfirmationP1?: { fileName: string; fileUrl: string; submittedAt: string } | null;
  clientConfirmationP2?: { fileName: string; fileUrl: string; submittedAt: string } | null;
  lawyerSignoffP1?: { status: 'COMPLETE' | 'PENDING'; ilaFile?: string; signedAt?: string } | null;
  lawyerSignoffP2?: { status: 'COMPLETE' | 'PENDING'; ilaFile?: string; signedAt?: string } | null;
}

export interface ClientFormsData {
  personalInfo: {
    fullName: string;
    dob: string;
    profession: string;
    nationality: string;
    address: string;
    phone: string;
    email: string;
  };
  familyInfo: {
    maritalStatus: string;
    childrenCount: number;
    childrenDetails: string;
  };
  assets: {
    realEstateValue: string;
    bankBalances: string;
    investmentsValue: string;
    businessInterests: string;
    pensionValue: string;
  };
  income: {
    annualSalary: string;
    dividends: string;
    otherIncome: string;
  };
  liabilities: {
    mortgages: string;
    loans: string;
    creditCards: string;
  };
  jointInfo: {
    coOwnedAssets: string;
    jointDebts: string;
  };
  questionnaireResponses: {
    objectives: string;
    futureLivingPlans: string;
  };
  financialDisclosure: {
    status: 'COMPLETE' | 'PENDING' | 'LOCKED';
    lastUpdated: string;
  };
}

export interface IlaCertDetails {
  lawyerName: string;
  firmName: string;
  barNumber: string;
  issueDate: string;
  signedPdfPath: string;
}

export interface EmailLog {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  sentAt: string;
}
