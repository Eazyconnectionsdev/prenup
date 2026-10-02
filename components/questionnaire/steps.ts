import type { QuestionnaireStepSlug } from "@/types/questionnaire/steps";

export const QUESTIONNAIRE_STEPS = [
  {
    slug: "personal-info",
    apiStep: "personal-information",
    dataKey: "personalInformation",
    title: "Personal information",
  },
  {
    slug: "legal-declaration",
    apiStep: "legal-declaration",
    dataKey: "legalDeclaration",
    title: "Legal declaration",
  },
  {
    slug: "family",
    apiStep: "family-and-dependents",
    dataKey: "familyAndDependents",
    title: "Family and dependents",
  },
  {
    slug: "individual_assets",
    apiStep: "individual-assets",
    dataKey: "individualAssets",
    title: "Individual assets",
  },
  {
    slug: "income_revenue",
    apiStep: "income-and-revenue",
    dataKey: "incomeAndRevenue",
    title: "Income and revenue",
  },
  {
    slug: "liabilities_debts",
    apiStep: "liabilities-and-debts",
    dataKey: "liabilitiesAndDebts",
    title: "Liabilities and debts",
  },
] as const;


export function getStep(slug: QuestionnaireStepSlug) {
  const index = QUESTIONNAIRE_STEPS.findIndex((s) => s.slug === slug);
  const step = QUESTIONNAIRE_STEPS[index];
  const next = QUESTIONNAIRE_STEPS[index + 1];

  return {
    ...step,
    number: index + 1,
    total: QUESTIONNAIRE_STEPS.length,
    // undefined on the last step (no automatic redirect after it)
    nextPath: next ? `/dashboard/${next.slug}` : undefined,
    nextTitle: next ? next.title : undefined,
  };
}
