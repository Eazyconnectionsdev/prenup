import type { DeclarationKey, DeclarationsFormData } from "@/types/questionnaire/declarations";

// Legal declaration fields and wording, shared by the couple's form, the
// partner's read-only view and the case manager / admin / lawyer views.
export const initialDeclarations: DeclarationsFormData = {
  agreementObjectives: "",
  livingSituationFuture: "",
  hasPreviousAgreement: "",
  previousAgreementType: "",
  previousAgreementStatus: "",
  previousAgreementSummary: "",
  hasInternationalConnections: "",
  internationalSummary: "",
  confirmPersonalEffects: false,
  confirmHouseholdDivision: false,
  acknowledgeCourtChildren: false,
  confirmCostSharing: false,
  confirmUndueInfluence: false,
  confirmIla: false,
  confirmFinancialDisclosure: false,
  confirmPlatformDisclaimer: false,
  confirmAccuracy: false,
};

/* ---------------------------------------------------------------------- */
/* Background questions                                                    */
/* ---------------------------------------------------------------------- */

export const BACKGROUND_INTRO =
  "These questions help identify matters that may need to be considered by your solicitor. They are not, by themselves, terms of your agreement.";

export const OBJECTIVES_QUESTION =
  "Please briefly describe what you hope to achieve with this agreement and your main reasons for putting it in place.";

export const OBJECTIVES_TOOLTIP = `What should I include in my answer?

Briefly explain why you want a prenuptial agreement and what you hope it will achieve.

You may wish to mention:
• Whether you want to protect assets or property you owned before the marriage.
• Whether you want to protect a business, investments, inheritance or family wealth.
• How you would like to deal with assets, debts and financial responsibilities during the marriage.
• Whether you want to make arrangements for financial matters if the marriage ends.
• Whether you want to provide financial clarity, avoid misunderstandings or reduce the possibility of future disputes.
• Any particular concerns or circumstances that have led you to consider an agreement.

Example:
"I would like to enter into a prenuptial agreement to protect the property and savings I have accumulated before marriage. I also have an interest in a family business that I would like to keep separate. I want us to be clear about our financial arrangements and responsibilities during the marriage, and to agree in advance how certain assets would be treated if we separated in the future. My main aim is to provide financial clarity and avoid potential disagreements."

There is no need to use legal language. Please answer in your own words and include the reasons that are relevant to your circumstances.`;

export const OBJECTIVES_HINT =
  "You can provide a short summary. Detailed financial information belongs in the Financial Disclosure section.";

export const LIVING_QUESTION =
  "Please provide a summary of your current living arrangements and any significant future plans (e.g., upcoming property purchases, relocating abroad, or major career changes).";

export const LIVING_TOOLTIP = `Describe your current living situation and any important changes you expect in the future.

You may wish to include:
• Where you currently live and whether you live alone, with your partner, or with family.
• Whether you currently own or rent your home.
• Any plans to purchase, sell or jointly own a property.
• Plans to relocate to another city or country.
• Any significant career changes, such as starting a business, changing jobs or retiring.
• Any other major changes that could affect your financial or family circumstances.

Example:
"I currently rent a property and live with my partner. We are planning to purchase a house together within the next two years. I am also considering starting my own business, which may change my financial circumstances. We may consider relocating abroad in the future depending on our work commitments."

Please provide a brief summary in your own words. You can provide detailed information about property ownership, values, income and other finances in the Financial Disclosure section.`;

export const PREVIOUS_AGREEMENT_QUESTION =
  "Have you previously entered into a prenuptial, postnuptial, or separation agreement, or a financial order from a prior relationship?";

export const PREVIOUS_AGREEMENT_TOOLTIP =
  "Include any previous prenuptial or postnuptial agreement, separation agreement, financial consent order or other formal financial arrangement arising from a previous relationship. This helps your solicitor identify existing arrangements or obligations that may need to be considered. If you are unsure of the legal status of an arrangement, say so rather than guessing.";

export const PREVIOUS_AGREEMENT_TYPES = [
  "Prenuptial agreement",
  "Postnuptial agreement",
  "Separation agreement",
  "Financial consent order",
  "Other financial arrangement",
];

export const PREVIOUS_AGREEMENT_STATUSES = [
  "Yes, still applies",
  "No / superseded",
  "Not sure",
];

export const INTERNATIONAL_QUESTION =
  "Do you or your partner have overseas property, foreign business interests or accounts, non-UK citizenship/residency, or plans to relocate internationally?";

export const INTERNATIONAL_TOOLTIP =
  "This may include property or land abroad, business interests or bank accounts in another country, citizenship or residence rights outside the UK, a marriage or legal agreement entered into abroad, or plans to move, live or work abroad. Answer based on what you know; do not guess about your partner's circumstances. Your solicitor can consider whether another country's laws may be relevant. Detailed financial information belongs in Financial Disclosure.";

export const INTERNATIONAL_DETAIL_LABEL =
  "Briefly describe the countries, assets, or relocation plans involved";

/* ---------------------------------------------------------------------- */
/* Declarations of understanding                                           */
/* ---------------------------------------------------------------------- */

export const DECLARATIONS_INTRO =
  "Please read each statement and confirm your understanding. These acknowledgements record your understanding; they do not replace independent legal advice.";

export const DECLARATIONS: {
  id: string;
  name: DeclarationKey;
  title: string;
  /** The information the person reads. */
  description: string;
  /** What ticking the box confirms. */
  acknowledgement: string;
}[] = [
  {
    id: "confirm_personal_effects",
    name: "confirmPersonalEffects",
    title: "Personal Possessions",
    description:
      "Personal belongings, such as clothing, footwear, jewellery, personal accessories and items used exclusively by one person, may be treated as that person's separate property. The agreement should make clear how you intend these items to be treated.",
    acknowledgement:
      "I understand that the treatment of personal possessions should be addressed in the terms of the agreement, where relevant.",
  },
  {
    id: "confirm_household_division",
    name: "confirmHouseholdDivision",
    title: "Division of Household Items",
    description:
      "Household contents and shared items may need to be dealt with separately from individually owned property or major assets. Their treatment should be clearly addressed in the agreement where relevant.",
    acknowledgement:
      "I understand that the treatment of household items should be addressed in the terms of the agreement, where relevant.",
  },
  {
    id: "acknowledge_court_children",
    name: "acknowledgeCourtChildren",
    title: "Children's Welfare",
    description:
      "A prenuptial agreement cannot determine or restrict decisions a court may need to make about the welfare, care or financial needs of any children. The court retains its legal powers in relation to children.",
    acknowledgement: "I understand this principle.",
  },
  {
    id: "confirm_cost_sharing",
    name: "confirmCostSharing",
    title: "Agreement & Legal Advice Costs",
    description:
      "The parties can agree how the costs of preparing the agreement will be shared. Each person is generally responsible for their own independent solicitor's fees unless another arrangement is agreed.",
    acknowledgement:
      "I understand how agreement preparation and legal advice costs may be dealt with.",
  },
  {
    id: "confirm_undue_influence",
    name: "confirmUndueInfluence",
    title: "Voluntariness & Absence of Undue Influence",
    description:
      "You should be able to participate in this process freely, without pressure, threats, coercion or undue influence. A difference in who pays the costs does not, by itself, establish whether pressure or undue influence has occurred.",
    acknowledgement:
      "I confirm that I am participating in this process voluntarily and without pressure or coercion.",
  },
  {
    id: "confirm_ila",
    name: "confirmIla",
    title: "Independent Legal Advice",
    description:
      "Each person should obtain independent legal advice from their own solicitor before signing. A solicitor can explain the proposed terms, their legal effect and the possible consequences for that person.",
    acknowledgement:
      "I understand the importance of obtaining independent legal advice from my own solicitor.",
  },
  {
    id: "confirm_financial_disclosure",
    name: "confirmFinancialDisclosure",
    title: "Full & Frank Financial Disclosure",
    description:
      "You should provide complete, accurate and up-to-date information about your financial circumstances, including relevant assets, income, business interests and liabilities in the UK and abroad. You should also disclose any material changes before the agreement is signed.",
    acknowledgement:
      "I understand my responsibility to provide full and accurate financial disclosure.",
  },
  {
    id: "confirm_platform_disclaimer",
    name: "confirmPlatformDisclaimer",
    title: "Platform Scope & Non-Binding Draft",
    description:
      "Let's Prenup provides document-preparation and case-administration tools, not legal advice. Completing this questionnaire or generating a draft does not, by itself, create a legally binding prenuptial agreement. The final document should be reviewed with independent solicitors and properly completed and signed.",
    acknowledgement:
      "I understand the role of the platform and that this step does not finalise an agreement.",
  },
  {
    id: "confirm_accuracy",
    name: "confirmAccuracy",
    title: "Final Confirmation",
    description:
      "I confirm that I have read and understood the declarations above and that the information I have provided in this section is true, complete and accurate to the best of my knowledge and belief.",
    acknowledgement:
      "I confirm that my answers and acknowledgements in this section are accurate and complete.",
  },
];
