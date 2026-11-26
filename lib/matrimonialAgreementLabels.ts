import type {
  CriticalIllnessSafeguard,
  DeathWillsAlignment,
  FutureAssetsTreatment,
  FutureGiftsTreatment,
  InheritanceSelection,
  InheritanceStatus,
  ReviewTriggerType,
  SpousalMaintenanceIntention,
  StandardMilestone,
} from "@/types/dashboard/matrimonial-agreement";
import type { Treatment } from "@/types/forms/form-primitives";

// Short, human-readable versions of the stored matrimonial agreement codes,
// for the review screens and the case manager / lawyer views.

export const FUTURE_ASSETS_LABELS: Record<FutureAssetsTreatment, string> = {
  SeparateToAcquirer: "Keep separate",
  FamilyUseJoint: "Family assets shared",
  PooledEqually: "Share assets equally",
  Custom: "Other arrangement",
};

export const FUTURE_GIFTS_LABELS: Record<FutureGiftsTreatment, string> = {
  SeparateToRecipient: "Kept separate for the person receiving it",
  JointEqually: "Treated as shared",
  Custom: "Other arrangement",
};

export const INHERITANCE_SELECTION_LABELS: Record<InheritanceSelection, string> = {
  NoneExpected: "No inheritance to record",
  LogDetails: "Inheritance details provided",
};

export const INHERITANCE_STATUS_LABELS: Record<Exclude<InheritanceStatus, "">, string> = {
  FutureExpectation: "Expected",
  PendingProbate: "Pending (in probate or settlement)",
  Received: "Received",
};

export const SPOUSAL_MAINTENANCE_LABELS: Record<SpousalMaintenanceIntention, string> = {
  MutualWaiver: "No ongoing maintenance intended – clean break",
  CareerSacrificeOnly: "Maintenance may be appropriate in certain circumstances",
  Custom: "Other arrangement",
};

export const CRITICAL_ILLNESS_LABELS: Record<CriticalIllnessSafeguard, string> = {
  ReviewAgreement: "Yes – review the agreement",
  NoSpecificReview: "No specific review arrangement",
  Custom: "Other arrangement",
  // Older answers
  TermsFixed: "Terms stay fixed (earlier answer)",
  Voidable: "Agreement becomes voidable (earlier answer)",
};

export const DEATH_WILLS_LABELS: Record<DeathWillsAlignment, string> = {
  FollowWills: "Follow our Wills and estate plans",
  ReviewOnDeath: "Review our arrangements if either of us dies",
  Custom: "Other arrangement",
  // Older answers
  MirrorDivorce: "Wills will mirror this agreement (earlier answer)",
  ProvideDifferently: "Wills will provide differently (earlier answer)",
  Unsure: "Undecided at this stage (earlier answer)",
};

export const REVIEW_TRIGGER_LABELS: Record<ReviewTriggerType, string> = {
  Never: "Never – no review milestones",
  Standard: "Standard life milestones",
  Custom: "Custom schedule",
};

export const MILESTONE_LABELS: Record<StandardMilestone, string> = {
  child_birth: "Birth or adoption of a child",
  career_change: "Significant change in health, disability or ability to work",
  financial_change: "Significant change in financial circumstances",
  "5_year": "5th wedding anniversary",
  "10_year": "10th wedding anniversary",
};

export const TREATMENT_LABELS: Record<Exclude<Treatment, "">, string> = {
  KeepSeparate: "Keep separate",
  ShareEqually: "Share equally (50/50)",
  Contribution: "Split by contribution",
  Percentage: "Share by percentage",
  Custom: "Custom arrangement",
};

// Falls back to the raw stored value so older saved answers still read sensibly
export function labelFor<T extends string>(
  labels: Record<T, string>,
  value: unknown,
  fallback = "Recorded",
): string {
  if (typeof value !== "string" || value === "") return fallback;
  return labels[value as T] ?? value;
}
