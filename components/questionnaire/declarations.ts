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
  tooltip?: string;
}[] = [
  {
    id: "confirm_personal_effects",
    name: "confirmPersonalEffects",
    title: "Personal Possessions",
    description:
      "Do you agree that each person's clothing, jewellery, personal belongings, and other personal possessions should remain their own separate property unless you both agree otherwise?",
    tooltip:
      "Personal possessions typically include clothing, jewellery, watches, mobile phones, and other items acquired for personal use.",
  },
  {
    id: "confirm_household_division",
    name: "confirmHouseholdDivision",
    title: "Division of Household Items",
    description:
      "Do you agree that household items and shared possessions (excluding separately owned property) should be dealt with fairly and reasonably, or otherwise in accordance with the terms of this agreement?",
    tooltip:
      "Household items generally include shared furniture, appliances, electronics, and other jointly used possessions.",
  },
  {
    id: "acknowledge_court_children",
    name: "acknowledgeCourtChildren",
    title: "Children's Welfare",
    description:
      "We understand that no agreement can restrict the power of a court to make decisions that are in the best interests of any children.",
    tooltip:
      "UK courts always retain the power to make decisions in the best interests of a child, regardless of any agreement between the parties.",
  },
  {
    id: "confirm_cost_sharing",
    name: "confirmCostSharing",
    title: "Agreement Costs",
    description:
      "Do you agree that the costs associated with preparing this agreement will normally be shared equally unless otherwise agreed between you?",
    tooltip:
      "Parties may agree to share costs equally or in another manner agreed between them.",
  },
  {
    id: "confirm_undue_influence",
    name: "confirmUndueInfluence",
    title: "Undue Influence",
    description:
      "Do you understand that one person contributing more towards the costs of preparing this agreement does not, by itself, indicate pressure, coercion, or undue influence?",
    tooltip:
      "One party contributing more financially towards the agreement does not automatically mean the agreement was entered into under pressure or coercion.",
  },
  {
    id: "confirm_ila",
    name: "confirmIla",
    title: "Independent Legal Advice",
    description:
      "We understand that each party is strongly encouraged to obtain independent legal advice before signing any agreement and that failure to do so may affect its enforceability.",
    tooltip:
      "Each party is strongly encouraged to obtain independent legal advice before signing, and failure to do so may affect enforceability.",
  },
  {
    id: "confirm_platform_disclaimer",
    name: "confirmPlatformDisclaimer",
    title: "Platform Disclaimer",
    description:
      "We understand that Let's Prenup assists in preparing an initial draft of our agreement and does not provide legal advice. We acknowledge that independent legal advice should be obtained before signing any agreement.",
    tooltip:
      "Let's Prenup assists in preparing an initial draft of your agreement but does not provide legal advice or representation. Independent legal advice should be obtained before signing any agreement.",
  },
  {
    id: "confirm_accuracy",
    name: "confirmAccuracy",
    title: "Final Confirmation",
    description:
      "I confirm that I have read and understood the declarations above and that the information provided throughout this section is true, complete, and accurate to the best of my knowledge.",
    tooltip:
      "By proceeding, you confirm that you have read and understood the declarations above and that the information you have provided throughout this section is true, complete, and accurate to the best of your knowledge.",
  },
];
