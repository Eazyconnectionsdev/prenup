export type PriorMarriageStatus =
  | "No, never married"
  | "Yes, previously divorced"
  | "Yes, widowed"
  | "";

export type YesNo = "Yes" | "No" | "";

export type ParentalIntention = "Yes" | "No" | "Undecided" | "";

export type ParentalRelationship =
  | "My child from a prior relationship"
  | "My partner's child from a prior relationship"
  | "Our mutual child (born or adopted within our relationship)"
  | "";

export interface ChildRow {
  id: string;
  fullName: string;
  dob: string;
  parentalRelationship: ParentalRelationship;
}

export interface FamilyFormData {
  priorMarriageStatus: PriorMarriageStatus;
  isLegallySeparated: boolean;
  hasLivingChildren: YesNo;
  futureParentalIntentions: ParentalIntention;
  hasFamilyPets: YesNo;
}

export interface RadioCardProps {
  id: string;
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}
