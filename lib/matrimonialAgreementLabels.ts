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
  SeparateToAcquirer: "Separate to whoever acquires them",
  FamilyUseJoint: "Family-use assets joint, the rest separate",
  PooledEqually: "Pooled and shared equally (50/50)",
  Custom: "Custom rule agreed",
};

export const FUTURE_GIFTS_LABELS: Record<FutureGiftsTreatment, string> = {
  SeparateToRecipient: "Separate property of the recipient",
  JointEqually: "Joint marital asset, shared equally",
  Custom: "Custom rule agreed",
};

export const INHERITANCE_SELECTION_LABELS: Record<InheritanceSelection, string> = {
  NoneExpected: "No inheritance recorded — stays separate automatically",
  LogDetails: "Inheritance details recorded",
};

export const INHERITANCE_STATUS_LABELS: Record<Exclude<InheritanceStatus, "">, string> = {
  FutureExpectation: "Future expectation",
  PendingProbate: "Pending / in probate",
};

export const SPOUSAL_MAINTENANCE_LABELS: Record<SpousalMaintenanceIntention, string> = {
  MutualWaiver: "Mutual waiver — clean break",
  CareerSacrificeOnly: "Payable only where a career was sacrificed",
  Custom: "Custom framework agreed",
};

export const CRITICAL_ILLNESS_LABELS: Record<CriticalIllnessSafeguard, string> = {
  TermsFixed: "Terms stay fixed",
  Voidable: "Agreement becomes voidable",
  Custom: "Custom safeguard agreed",
};

export const DEATH_WILLS_LABELS: Record<DeathWillsAlignment, string> = {
  MirrorDivorce: "Wills will mirror this agreement",
  ProvideDifferently: "Wills will provide differently",
  Unsure: "Undecided at this stage",
};

export const REVIEW_TRIGGER_LABELS: Record<ReviewTriggerType, string> = {
  Never: "No scheduled review",
  Standard: "Standard life milestones",
  Custom: "Custom review schedule",
};

export const MILESTONE_LABELS: Record<StandardMilestone, string> = {
  child_birth: "Birth or adoption of a child",
  career_change: "Significant change in health or career capability",
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
