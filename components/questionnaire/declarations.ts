import type { DeclarationsFormData } from "@/types/questionnaire/declarations";

// Legal declaration fields, shared by the editable form and the partner's read-only view
export const initialDeclarations: DeclarationsFormData = {
  agreementObjectives: "",
  livingSituationFuture: "",
  confirmPersonalEffects: false,
  confirmHouseholdDivision: false,
  acknowledgeCourtChildren: false,
  confirmCostSharing: false,
  confirmUndueInfluence: false,
  confirmIla: false,
  confirmPlatformDisclaimer: false,
  confirmAccuracy: false,
};

export const DECLARATIONS: {
  id: string;
  name: keyof DeclarationsFormData;
  title: string;
  description: string;
}[] = [
  {
    id: "confirm_personal_effects",
    name: "confirmPersonalEffects",
    title: "Personal Possessions",
    description:
      "Do you agree that each person's clothing, jewellery, personal belongings, and other personal possessions should remain their own separate property unless you both agree otherwise?",
  },
  {
    id: "confirm_household_division",
    name: "confirmHouseholdDivision",
    title: "Division of Household Items",
    description:
      "Do you agree that household items and shared possessions (excluding separately owned property) should be dealt with fairly and reasonably, or otherwise in accordance with the terms of this agreement?",
  },
  {
    id: "acknowledge_court_children",
    name: "acknowledgeCourtChildren",
    title: "Children's Welfare",
    description:
      "We understand that no agreement can restrict the power of a court to make decisions that are in the best interests of any children.",
  },
  {
    id: "confirm_cost_sharing",
    name: "confirmCostSharing",
    title: "Agreement Costs",
    description:
      "Do you agree that the costs associated with preparing this agreement will normally be shared equally unless otherwise agreed between you?",
  },
  {
    id: "confirm_undue_influence",
    name: "confirmUndueInfluence",
    title: "Undue Influence",
    description:
      "Do you understand that one person contributing more towards the costs of preparing this agreement does not, by itself, indicate pressure, coercion, or undue influence?",
  },
  {
    id: "confirm_ila",
    name: "confirmIla",
    title: "Independent Legal Advice",
    description:
      "We understand that each party is strongly encouraged to obtain independent legal advice before signing any agreement and that failure to do so may affect its enforceability.",
  },
  {
    id: "confirm_platform_disclaimer",
    name: "confirmPlatformDisclaimer",
    title: "Platform Disclaimer",
    description:
      "We understand that Let's Prenup assists in preparing an initial draft of our agreement and does not provide legal advice. We acknowledge that independent legal advice should be obtained before signing any agreement.",
  },
  {
    id: "confirm_accuracy",
    name: "confirmAccuracy",
    title: "Final Confirmation",
    description:
      "I confirm that I have read and understood the declarations above and that the information provided throughout this section is true, complete, and accurate to the best of my knowledge.",
  },
];
