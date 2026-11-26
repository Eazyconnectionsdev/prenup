import type { Treatment, YesNo } from "@/types/forms/form-primitives";

/* ---------------------------------------------------------------------- */
/* Question option codes                                                   */
/* ---------------------------------------------------------------------- */

export type FutureAssetsTreatment =
  | "SeparateToAcquirer"
  | "FamilyUseJoint"
  | "PooledEqually"
  | "Custom";

export type FutureGiftsTreatment =
  | "SeparateToRecipient"
  | "JointEqually"
  | "Custom";

export type InheritanceSelection = "NoneExpected" | "LogDetails";

export type SpousalMaintenanceIntention =
  | "MutualWaiver"
  | "CareerSacrificeOnly"
  | "Custom";

// "TermsFixed" and "Voidable" are older answers; the form no longer offers them.
export type CriticalIllnessSafeguard =
  | "ReviewAgreement"
  | "NoSpecificReview"
  | "Custom"
  | "TermsFixed"
  | "Voidable";

// "MirrorDivorce", "ProvideDifferently" and "Unsure" are older answers; the
// form no longer offers them.
export type DeathWillsAlignment =
  | "FollowWills"
  | "ReviewOnDeath"
  | "Custom"
  | "MirrorDivorce"
  | "ProvideDifferently"
  | "Unsure";

export type ReviewTriggerType = "Never" | "Standard" | "Custom";

export type StandardMilestone =
  | "child_birth"
  | "career_change"
  | "financial_change"
  | "5_year"
  | "10_year";

/* ---------------------------------------------------------------------- */
/* Inheritance register                                                    */
/* ---------------------------------------------------------------------- */

export type InheritanceRecipient = "" | "Partner 1" | "Partner 2";

// "FutureExpectation" = Expected, "PendingProbate" = Pending (in probate or settlement)
export type InheritanceStatus = "" | "FutureExpectation" | "PendingProbate" | "Received";

export interface InheritanceEntry {
  id: string;
  recipientPartner: InheritanceRecipient;
  inheritanceStatus: InheritanceStatus;
  composition: string;
  originalAmount: string;
  originalCurrency: string;
  gbpEquivalent: string;
  basisOfEstimate: string;
  treatment: Treatment;
  contributionText: string;
  percentageValue: string;
  customText: string;
}

/* ---------------------------------------------------------------------- */
/* Special circumstances (case complexity gates)                           */
/* ---------------------------------------------------------------------- */

export interface SpecialCircumstances {
  pregnancyOrAdoption: YesNo;
  sharedBusiness: YesNo;
  financialReliance: YesNo;
  coOwnedRealEstate: YesNo;
  highValueAssets: YesNo;
  priorDependents: YesNo;
}

export type SpecialCircumstanceKey = keyof SpecialCircumstances;

/* ---------------------------------------------------------------------- */
/* The form as a whole                                                     */
/* ---------------------------------------------------------------------- */

export interface MatrimonialAgreementFormValues {
  futureAssetsTreatment: FutureAssetsTreatment;
  customFutureAssets: string;

  futureGiftsTreatment: FutureGiftsTreatment;
  customFutureGifts: string;

  inheritanceSelection: InheritanceSelection;
  inheritanceEntries: InheritanceEntry[];

  spousalMaintenanceIntention: SpousalMaintenanceIntention;
  customSpousalMaintenance: string;

  criticalIllnessSafeguard: CriticalIllnessSafeguard;
  customHealthSafeguards: string;

  deathWillsAlignment: DeathWillsAlignment;
  customDeathWills: string;

  reviewTriggerType: ReviewTriggerType;
  standardMilestones: StandardMilestone[];
  customReviewTriggers: string;

  specialCircumstances: SpecialCircumstances;
  specialCircumstancesOverview: string;
}
