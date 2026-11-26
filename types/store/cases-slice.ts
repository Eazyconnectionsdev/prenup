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

/**
 * The owner's trip through the service selector.
 *
 * `pendingAgreementType` is the service they picked and have not paid for yet.
 * It is deliberately separate from `CaseDetails.agreementType`, which the
 * payment writes: until the fee is paid the case has no service, only a pick,
 * and the owner is free to come back and choose again.
 */
export interface CaseOnboarding {
  completed: boolean;
  completedAt?: string | null;
  residesInUK?: boolean;
  pendingAgreementType: string | null;
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
  partnerInviteDetails?: {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    email?: string;
  } | null;
  paymentCompleted: boolean;
  // PENDING | INITIATED | FAILED | COMPLETED | REFUNDED
  paymentStatus?: string;
  // What was paid and for which service. Card details are never sent back
  // beyond the brand and the last four digits.
  payment?: {
    reference: string | null;
    status: string | null;
    agreementType: string | null;
    amount: number;
    currency: string;
    cardBrand: string | null;
    cardLast4: string | null;
    paidAt: string | null;
  } | null;
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
  // The service the case HAS. Written only when the case is paid for, so it is
  // null for an unpaid case even after the owner has picked one -- the pick
  // itself lives on `onboarding.pendingAgreementType`.
  agreementType: string | null;
  onboarding?: CaseOnboarding | null;
  // Populated with name and email once a case manager is assigned
  assignedCaseManager: string | { _id: string; firstName?: string | null; lastName?: string | null; email?: string } | null;
  createdAt: string;
  updatedAt: string;
  myInformation?: InformationSection;
  partnerInformation?: InformationSection;
  jointInformation?: JointInformationSection;
  stages?: any;
}

export interface CasesState {
  isLoading: boolean;
  // True once a fetch has settled, successfully or not. isLoading alone cannot
  // tell "not asked yet" from "asked and answered", and a screen waiting on the
  // case needs that difference to avoid rendering an empty case as a real one.
  hasLoaded: boolean;
  caseId: string | null;
  caseNumber: string | null;
  title: string;
  owner: userType | null;
  invitedUser : userType | null;
  // Set when the owner sends an invite. Distinct from invitedUser, which only
  // appears once the partner has accepted and registered.
  partnerInvited: boolean;
  invitedEmail: string | null;
  partnerInviteDetails?: {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    email?: string;
  } | null;
  status: CaseStatus;
  preQuestionnaireUser1: PreQuestionnaire | Record<string, never>;
  preQuestionnaireUser2: PreQuestionnaire | Record<string, never>;
  approval: CaseApproval | null;
  fullyLocked: boolean;
  paymentCompleted?: boolean;
  paymentStatus?: string;
  payment?: CaseDetails["payment"];
  workflowStatus: string;
  agreementType: string | null;
  onboarding: CaseOnboarding | null;
  assignedCaseManager: CaseDetails["assignedCaseManager"];
  myInformation: InformationSection;
  partnerInformation: InformationSection;
  jointInformation : JointInformationSection;
  stages?: any;
}
