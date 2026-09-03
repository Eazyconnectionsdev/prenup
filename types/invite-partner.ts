export type RelationshipStatus = 'Fiancé' | 'Fiancée' | 'Partner';

export type InvitationStateStatus = 'DRAFT' | 'INVITATION_SENT' 

export interface PartnerData {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  relationshipStatus: RelationshipStatus;
  targetWeddingDate: string;
  personalMessage: string;
  status: InvitationStateStatus;
  sentTimestamp?: string;
  
}

export interface TimelineEvent {
  id: string;
  title: string;
  timestamp: string;
  completed: boolean;
}


