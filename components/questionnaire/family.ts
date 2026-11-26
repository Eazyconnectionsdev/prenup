import type {
  ChildRow,
  FamilyFormData,
  LegacyFamilyFields,
  ParentalIntention,
  ParentalRelationship,
  PriorRelationshipRow,
} from "@/types/questionnaire/family";

// Family & dependents fields and wording, shared by the couple's form, the
// partner's read-only view and the case manager / admin / lawyer views.

export const initialFamilyData: FamilyFormData = {
  hasPriorRelationship: "",
  priorRelationships: [],
  hasLivingChildren: "",
  children: [],
  futureParentalIntentions: "",
  hasFamilyPets: "",
  petsDetails: "",
  hasOtherDependants: "",
  dependantsDetails: "",
};

export const FAMILY_DESCRIPTION =
  "Tell us about any previous marriages or civil partnerships, your children, your future family plans, and any family dependants or pets you would like this agreement to cover.";

export const FAMILY_FOOTNOTE =
  "Please answer based on your own circumstances and knowledge. This information helps identify matters for solicitor review; it does not automatically become a term of your prenuptial agreement.";

/* Prior marital history -------------------------------------------------- */

export const PRIOR_QUESTION =
  "Have you previously been married or in a civil partnership before this relationship?";

export const PRIOR_TOOLTIP =
  "Select Yes if you have had a previous marriage or civil partnership, even if it ended some time ago. This includes divorce, dissolution, widowhood, annulment or a separation that has not yet been legally finalised.";

export const PRIOR_YES_NO = [
  { value: "No" as const, label: "No, never married or in a civil partnership" },
  { value: "Yes" as const, label: "Yes" },
];

export const PRIOR_SITUATION_OPTIONS = [
  "Previously divorced",
  "Widowed",
  "Marriage annulled or declared void",
  "Separated – divorce not finalised",
  "Previous civil partnership dissolved",
  "Surviving civil partner",
  "Civil partnership annulled or declared void",
  "Separated – dissolution not finalised",
  "Other / not sure",
];

/** Situations where the earlier marriage or partnership has not legally ended yet. */
export const NOT_FINALISED_SITUATIONS = [
  "Separated – divorce not finalised",
  "Separated – dissolution not finalised",
];

export const YES_NO_NOT_SURE = ["Yes", "No", "Not sure"] as const;

/* Children ---------------------------------------------------------------- */

export const CHILDREN_QUESTION =
  "Do you have any children, including biological, adopted, or stepchildren, from this relationship or a previous relationship?";

export const CHILDREN_TOOLTIP =
  "Add each child separately. For example, include your own child from a previous relationship, your partner's child from a previous relationship, or a child you have together. Financial support and maintenance details are covered in Financial Disclosure.";

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

/* Future plans & pets ----------------------------------------------------- */

export const FUTURE_PLANS_QUESTION =
  "Do you and your partner plan, or think you may decide in the future, to have or adopt children together?";

export const FUTURE_PLANS_TOOLTIP =
  "Select the option that best reflects your current plans. Choose undecided if you have not made a decision or are open to discussing it. You do not need to provide medical or fertility information.";

export const PARENTAL_INTENTION_OPTIONS: {
  value: Exclude<ParentalIntention, "">;
  label: string;
}[] = [
  { value: "Yes", label: "Yes, we plan to have or adopt children together." },
  { value: "No", label: "No, we do not plan to have children together." },
  { value: "Undecided", label: "We are currently undecided about having children." },
];

export const PETS_QUESTION =
  "Do you currently have, or expect to have, any pets whose ownership or care you would like this agreement to cover?";

export const PETS_TOOLTIP =
  "If Yes, briefly describe the pet or pets and any arrangements you would like to record, such as who owns the pet or how you would like its care to be handled if you separate. This records your intentions; it cannot guarantee a future legal outcome.";

export const PETS_DETAIL_LABEL =
  "Briefly describe your pet(s) and any arrangements you would like to include";

/* Other dependants -------------------------------------------------------- */

export const DEPENDANTS_QUESTION =
  "Do you have any other family members or dependants you regularly support or care for?";

export const DEPENDANTS_TOOLTIP =
  "This may include an elderly parent, grandparent, disabled relative or another person who relies on you for regular financial support or care. You can briefly describe the situation. Detailed financial amounts belong in Financial Disclosure.";

export const DEPENDANTS_DETAIL_LABEL = "Briefly describe who you support or care for";

/* Rows & migration -------------------------------------------------------- */

const makeId = (prefix: string) =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

export function makeChildRow(): ChildRow {
  return { id: makeId("child"), fullName: "", dob: "", parentalRelationship: "" };
}

export function makePriorRelationshipRow(situation = ""): PriorRelationshipRow {
  return {
    id: makeId("prior"),
    situation,
    details: "",
    financialObligations: "",
    childrenFromRelationship: "",
  };
}

/**
 * Brings answers saved by the earlier form into the current shape. The old
 * form asked a single three-way question (never married / divorced / widowed)
 * plus a "legally separated" tick box; those become a Yes/No and one
 * previous-relationship entry.
 */
export function normalizeFamily(
  saved: (Partial<FamilyFormData> & LegacyFamilyFields) | undefined | null,
): FamilyFormData {
  const s = saved ?? {};
  const next: FamilyFormData = {
    ...initialFamilyData,
    ...s,
    priorRelationships: Array.isArray(s.priorRelationships)
      ? s.priorRelationships.map((r) => ({ ...makePriorRelationshipRow(), ...r }))
      : [],
    children: Array.isArray(s.children)
      ? s.children.map((c) => ({ ...makeChildRow(), ...c, id: c?.id || makeId("child") }))
      : [],
    petsDetails: s.petsDetails ?? "",
    dependantsDetails: s.dependantsDetails ?? "",
    hasOtherDependants: s.hasOtherDependants ?? "",
  };

  if (!s.hasPriorRelationship && s.priorMarriageStatus) {
    if (s.priorMarriageStatus === "No, never married") {
      next.hasPriorRelationship = "No";
    } else {
      next.hasPriorRelationship = "Yes";
      const situation =
        s.priorMarriageStatus === "Yes, widowed"
          ? "Widowed"
          : s.isLegallySeparated
            ? "Separated – divorce not finalised"
            : "Previously divorced";
      if (next.priorRelationships.length === 0) {
        next.priorRelationships = [makePriorRelationshipRow(situation)];
      }
    }
  }

  // Not part of the current shape.
  delete (next as Partial<FamilyFormData> & LegacyFamilyFields).priorMarriageStatus;
  delete (next as Partial<FamilyFormData> & LegacyFamilyFields).isLegallySeparated;

  return next;
}
