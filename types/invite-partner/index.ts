export type RelationshipStatus = 'Fiancé' | 'Fiancée' | 'Partner';

export type InvitationStateStatus = 'DRAFT' | 'INVITATION_SENT';

export interface PartnerData {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber?: string;
  phone?: string;
  relationshipStatus: RelationshipStatus;
  targetWeddingDate?: string;
  targetDate?: string;
  personalMessage: string;
  status: InvitationStateStatus;
  sentTimestamp?: string;
  // Live tracking from the server (GET /cases/:id/invite)
  inviteStatus?: InviteTrackingStatus;
  openedAt?: string | null;
  acceptedAt?: string | null;
  resendCount?: number;
  registered?: RegisteredPartner | null;
  emailDiffers?: boolean;
  nameDiffers?: boolean;
}

export type InviteTrackingStatus =
  | 'PENDING'
  | 'OPENED'
  | 'ACCEPTED'
  | 'EXPIRED'
  | 'REVOKED';

export interface RegisteredPartner {
  _id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  emailVerified: boolean;
}

export interface TimelineEvent {
  id: string;
  title: string;
  timestamp: string;
  completed: boolean;
}
