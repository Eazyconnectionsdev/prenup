export interface SectionStatus {
  submitted: boolean;
  submittedBy: string | null;
  submittedAt: string | null;
  locked: boolean;
  lockedBy: string | null;
  lockedAt: string | null;
  unlockedBy: string | null;
  unlockedAt: string | null;
}

// Keyed by section name. Only "myInformation" is guaranteed present early
// on — the rest appear once that section has actually been touched.
export interface CaseStatus {
  myInformation?: SectionStatus;
  partnerInformation?: SectionStatus;
  jointInformation?: SectionStatus;
  independentLegalAdvice?: SectionStatus;
  _id?: string;
}

export interface PreQuestionnaire {
  answers: unknown[];
  selectedLawyer: string | null;
  selectedAt: string | null;
  submitted: boolean;
  submittedBy: string | null;
  submittedAt: string | null;
  locked: boolean;
  lockedBy: string | null;
  lockedAt: string | null;
}

export interface userType {
  _id: string;
  email: string;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  suffix: string | null;
  dateOfBirth: string | null;
  role: string;
  endUserType: "user1" | "user2" | null;
  invitedUser: string | null;
  invitedBy: string | null;
  phone: string | null;
  marketingConsent: boolean;
  acceptedTerms: boolean;
  emailVerified: boolean;
  paymentDone: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewTimelineItem {
  action: string;
  actor?: string | null;
  actorRole: "PRIMARY" | "SECONDARY" | "SYSTEM";
  p1Status: string;
  p2Status: string;
  mutualStatus: string;
  timestamp: string;
  notes?: string | null;
}

export interface CaseApproval {
  user1Approved: boolean;
  user1ApprovedAt: string | null;
  user2Approved: boolean;
  user2ApprovedAt: string | null;
  p1ReviewStatus?: "IN_PROGRESS" | "FINAL_SUBMIT" | "IN_REVIEW" | "APPROVED";
  p2ReviewStatus?: "IN_PROGRESS" | "FINAL_SUBMIT" | "IN_REVIEW" | "APPROVED";
  mutualApprovalAndSnapshot?: "PENDING" | "COMPLETED";
  mutualApprovalCompletedAt?: string | null;
  reviewTimeline?: ReviewTimelineItem[];
  snapshotData?: any;
  lawyerApproved: boolean;
  lawyerApprovedAt: string | null;
  approvedLawyer: string | null;
  caseManagerApproved: boolean;
  caseManagerApprovedAt: string | null;
  approvedBy: string | null;
  disapprovedBy?: string | null;
  disapprovedAt?: string | null;
  disapprovalReason?: string | null;
}

export interface InformationSection {
  personalInformation?: Record<string, unknown>;
  legalDeclaration?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface JointInformationSection {
  JointInformation?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface CaseDetails {
  _id: string;
  caseNumber?: string | null;
  title: string;
  inviteCredentials: unknown;
  owner: userType;
  invitedUser: userType;
  invitedEmail: string | null;
  partnerInvited: boolean;
  inviteToken: string | null;
  inviteTokenExpires: string | null;
  preQuestionnaireUser1: PreQuestionnaire;
  preQuestionnaireUser2: PreQuestionnaire;
  approval: CaseApproval;
  status: CaseStatus;
  fullyLocked: boolean;
  fullyLockedBy: string | null;
  fullyLockedAt: string | null;
  workflowStatus: string;
  // The service picked in onboarding / the service selector
  agreementType: string | null;
  assignedCaseManager: string | null;
  createdAt: string;
  updatedAt: string;
  myInformation?: InformationSection;
  partnerInformation?: InformationSection;
  jointInformation?: JointInformationSection;
  stages?: any;
}

export interface CasesState {
  isLoading: boolean;
  caseId: string | null;
  caseNumber: string | null;
  title: string;
  owner: userType | null;
  invitedUser : userType | null;
  // Set when the owner sends an invite. Distinct from invitedUser, which only
  // appears once the partner has accepted and registered.
  partnerInvited: boolean;
  invitedEmail: string | null;
  status: CaseStatus;
  preQuestionnaireUser1: PreQuestionnaire | Record<string, never>;
  preQuestionnaireUser2: PreQuestionnaire | Record<string, never>;
  approval: CaseApproval | null;
  fullyLocked: boolean;
  paymentCompleted?: boolean;
  workflowStatus: string;
  agreementType: string | null;
  myInformation: InformationSection;
  partnerInformation: InformationSection;
  jointInformation : JointInformationSection;
  stages?: any;
}
