// utils/progressCalculator.ts

interface CaseData {
  myInformation: Record<string, any>;
  partnerInformation: Record<string, any>;
  jointInformation: Record<string, any>;
}

// Just checks: does this object exist and have at least one key with a value?
const hasData = (obj: unknown): boolean => {
  if (!obj || typeof obj !== 'object') return false;
  return Object.keys(obj).length > 0;
};

export interface ProgressResult {
  completed: number;
  total: number;
  percentage: number;
}

const MY_PARTNER_KEYS = [
  'personalInformation',
  'legalDeclaration',
  'familyAndDependents',
  'individualAssets',
  'incomeAndRevenue',
  'liabilitiesAndDebts',
];

const JOINT_KEYS = [
  'jointAssets',
  'jointIncomeAndRevenue',
  'jointLiabilitiesAndDebts',
];

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
  const total = all.length; // 15

  return {
    completed,
    total,
    percentage: Math.round((completed / total) * 100),
  };
};