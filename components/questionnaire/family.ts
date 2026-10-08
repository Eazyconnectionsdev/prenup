import type { FamilyFormData, ParentalIntention, ParentalRelationship, PriorMarriageStatus } from "@/types/questionnaire/family";

// Family & dependents fields, shared by the editable form and the partner's read-only view
export const initialFamilyData: FamilyFormData = {
  priorMarriageStatus: "",
  isLegallySeparated: false,
  hasLivingChildren: "",
  futureParentalIntentions: "",
  hasFamilyPets: "",
};

export const PRIOR_MARRIAGE_OPTIONS: { id: string; value: Exclude<PriorMarriageStatus, ""> }[] = [
  { id: "pm_never", value: "No, never married" },
  { id: "pm_divorced", value: "Yes, previously divorced" },
  { id: "pm_widowed", value: "Yes, widowed" },
];

export const PARENTAL_RELATIONSHIP_OPTIONS: {
  value: Exclude<ParentalRelationship, "">;
  label: string;
}[] = [
  { value: "My child from a prior relationship", label: "My child from a previous relationship" },
  {
    value: "My partner's child from a prior relationship",
    label: "My partner's child from a previous relationship",
  },
  {
    value: "Our mutual child (born or adopted within our relationship)",
    label: "Our child together (born or adopted during our relationship)",
  },
];

export const PARENTAL_INTENTION_OPTIONS: {
  value: Exclude<ParentalIntention, "">;
  label: string;
}[] = [
  { value: "Yes", label: "Yes, we plan to have or adopt children together." },
  { value: "No", label: "No, we do not plan to have children together." },
  { value: "Undecided", label: "We are currently undecided about having children." },
];
