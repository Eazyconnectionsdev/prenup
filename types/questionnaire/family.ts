// Family & dependents fields, shared by the editable form and the partner's read-only view

export type YesNoBlank = "Yes" | "No" | "";

export type ParentalIntention = "Yes" | "No" | "Undecided" | "";

export type ParentalRelationship =
  | "My child from a prior relationship"
  | "My partner's child from a prior relationship"
  | "Our mutual child (born or adopted within our relationship)"
  | "";

export type YesNoNotSure = "Yes" | "No" | "Not sure" | "";

export interface ChildRow {
  id: string;
  fullName: string;
  dob: string;
  parentalRelationship: ParentalRelationship;
}

/** One previous marriage or civil partnership. */
export interface PriorRelationshipRow {
  id: string;
  situation: string;
  details: string;
  financialObligations: YesNoNotSure;
  childrenFromRelationship: YesNoNotSure;
}

export interface FamilyFormData {
  hasPriorRelationship: YesNoBlank;
  priorRelationships: PriorRelationshipRow[];

  hasLivingChildren: YesNoBlank;
  children: ChildRow[];

  futureParentalIntentions: ParentalIntention;

  hasFamilyPets: YesNoBlank;
  petsDetails: string;

  hasOtherDependants: YesNoBlank;
  dependantsDetails: string;
}

/** Answers saved by the earlier version of the form (read for migration only). */
export interface LegacyFamilyFields {
  priorMarriageStatus?: "No, never married" | "Yes, previously divorced" | "Yes, widowed" | "";
  isLegallySeparated?: boolean;
}
