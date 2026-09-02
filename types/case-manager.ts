export type NavView = 'dashboard' | 'cases' | 'archived' | 'reports';

export type DrawerTabId =
  | 'overview'
  | 'forms'
  | 'agreement'
  | 'lawyers'
  | 'timeline'
  | 'emails'
  | 'audit'
  | 'notes';

// Section 7: Case Status Mapping (Backend State <-> CM View)
export type BackendState =
  | 'DRAFT'
  | 'CM_REVIEW'
  | 'LAWYER_REVIEW'
  | 'CLEAN_MASTER_UPLOADED'
  | 'AWAITING_COUNTERPARTY_LAWYER_APPROVAL'
  | 'CLIENT_APPROVAL_PENDING'
  | 'CLIENT_PARTIALLY_APPROVED'
  | 'CLIENT_APPROVED'
  | 'RETURNED_TO_LAWYERS'
  | 'ILA_P1_COMPLETE'
  | 'ILA_P2_COMPLETE'
  | 'READY_FOR_SIGNING'
  | 'CLOSED'
  | 'ARCHIVED'
  | 'CANCELLED';

export interface CaseItem {
  id: string;
  p1: string;
  p2: string;
  p1Email: string;
  p2Email: string;
  p1Phone: string;
  p2Phone: string;
  service: string;
  owner: 'CASE MANAGER' | 'LAWYER' | 'CLIENT' | 'SYSTEM';
  actionLabel: string;
  backendState: string;
  cmView: string;
  createdDate: string;
  lastActivity: string;
  caseType : string;
  daysInStatus: number;
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded' | 'Chargeback';
  health: 'ALL' | 'ESCALATED' | 'STUCK_7' | 'STUCK_14' | 'AWAITING_REVIEW' | 'AWAITING_CLIENT' | 'AWAITING_LAWYER';
  priority: 'HIGH' | 'CRITICAL' | 'MEDIUM' | 'LOW';
  version: 'v1.0' | 'v1.1' | 'v1.2' | 'v1.3' | 'v1.4' | 'v1.5' | 'v2.0';
  p1Firm: string;
  p1Lawyer: string;
  p2Firm: string;
  p2Lawyer: string;
}

export interface AuditLog {
  actor: string;
  action: string;
  module: string;
  ipAddress: string;
  timestamp: string;
  before: string;
  after: string;
}

export interface RuleEntry {
  id: string;
  name: string;
  trigger: string;
  description: string;
  status: 'ACTIVE' | 'ENFORCED' | 'SUSPENDED';
}

export type ReportType =
  | 'CASES'
  | 'LAWYER_ASSIGNMENT'
  | 'AWAITING_REVIEW'
  | 'AWAITING_CLIENT'
  | 'AWAITING_SIGNATURE'
  | 'ESCALATION'
  | 'STUCK_CASES'
  | 'CAPACITY'
  | 'EXECUTION';

export interface ReportFilterState {
  reportType: ReportType;
  dateRange: string;
  status: string;
  lawFirm: string;
  lawyer: string;
  priority: string;
}

export interface ReportColumnDef {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  badgeType?: 'status' | 'priority' | 'owner' | 'sla' | 'firm' | 'date';
}

export type ReportRowData = Record<string, any>;

export interface ReportItem {
  id: string;
  title: string;
  metric: string;
  subtitle: string;
  status: string;
  csvFileName: string;
}

export interface FilterState {
  status: string;
  health: string;
  payment: string;
  dateRange: string;
  searchQuery: string;
}

export interface ApiLogEntry {
  id: string;
  timestamp: string;
  endpoint: string;
  method: string;
  payload: any;
}

export interface LawyerOption {
  name: string;
  email: string;
  phone: string;
  barId: string;
  title: string;
}

export interface LawFirmOption {
  firmName: string;
  city: string;
  lawyers: LawyerOption[];
}


export interface ToastItem {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'warning';
}

export interface ToastContainerProps {
  toasts: ToastItem[];
  onRemoveToast: (id: string) => void;
}