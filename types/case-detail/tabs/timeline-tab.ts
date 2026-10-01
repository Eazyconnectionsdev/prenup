export interface PerformedBy {
  _id?: string;
  email?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  suffix?: string | null;
}

export interface TimelineItem {
  _id?: string;
  caseId?: string;
  action?: string;
  notes?: string;
  performedBy?: PerformedBy | string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Props {
  caseData: any;
}
