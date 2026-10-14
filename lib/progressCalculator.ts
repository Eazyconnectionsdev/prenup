import type {
  CaseData,
  ProgressResult,
  SectionProgress,
} from "@/types/lib/progress-calculator";

const hasData = (obj: unknown): boolean => {
  if (!obj || typeof obj !== 'object') return false;
  return Object.keys(obj).length > 0;
};

// A form counts as done once it has been saved with something in it
export const isFormFilled = hasData;

export const MY_PARTNER_KEYS = [
  'personalInformation',
  'legalDeclaration',
  'familyAndDependents',
  'individualAssets',
  'incomeAndRevenue',
  'liabilitiesAndDebts',
];

// The three joint financial forms, which the Final Review shows as one section
export const JOINT_FINANCIAL_KEYS = [
  'jointAssets',
  'jointIncomeAndRevenue',
  'jointLiabilitiesAndDebts',
];

export const MATRIMONIAL_KEYS = ['matrimonialAgreement'];

export const JOINT_KEYS = [...JOINT_FINANCIAL_KEYS, ...MATRIMONIAL_KEYS];

// How many of a section's forms have actually been filled in. Nothing is
// treated as complete until its data is really there.
export const getSectionProgress = (
  section: Record<string, any> | undefined,
  keys: string[],
): SectionProgress => {
  const completed = keys.filter((key) => hasData(section?.[key])).length;
  return { completed, total: keys.length, isComplete: completed === keys.length };
};

export const calculateOverallProgress = (caseData: CaseData): ProgressResult => {
  const myInfoResults = MY_PARTNER_KEYS.map((key) =>
    hasData(caseData?.myInformation?.[key])
  );
  const partnerInfoResults = MY_PARTNER_KEYS.map((key) =>
    hasData(caseData?.partnerInformation?.[key])
  );
  const jointInfoResults = JOINT_KEYS.map((key) =>
    hasData(caseData?.jointInformation?.[key])
  );
  const all = [...myInfoResults, ...partnerInfoResults, ...jointInfoResults];
  const completed = all.filter(Boolean).length;
  const total = all.length;
  return {
    completed,
    total,
    percentage: Math.round((completed / total) * 100),
  };
};
