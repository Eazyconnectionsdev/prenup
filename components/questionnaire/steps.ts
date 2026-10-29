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
  const previous = index > 0 ? QUESTIONNAIRE_STEPS[index - 1] : undefined;

  return {
    ...step,
    number: index + 1,
    total: QUESTIONNAIRE_STEPS.length,
    // Links forward across all individual steps and smoothly bridges liabilities_debts to joint-assets
    nextPath: next
      ? `/dashboard/${next.slug}`
      : slug === "liabilities_debts"
        ? "/dashboard/joint-assets"
        : undefined,
    nextTitle: next
      ? next.title
      : slug === "liabilities_debts"
        ? "Joint assets"
        : undefined,
    // Links backward across all steps and personal-info back to dashboard
    prevPath: previous
      ? `/dashboard/${previous.slug}`
      : slug === "personal-info"
        ? "/dashboard"
        : undefined,
    prevTitle: previous
      ? previous.title
      : slug === "personal-info"
        ? "Dashboard"
        : undefined,
  };
}
