// Legal declaration fields, shared by the editable form and the partner's read-only view
export interface DeclarationsFormData {
  // Background questions
  agreementObjectives: string;
  livingSituationFuture: string;

  // "Yes" | "No" — a previous prenup/postnup/separation agreement or financial order
  hasPreviousAgreement: string;
  previousAgreementType: string;
  previousAgreementStatus: string;
  previousAgreementSummary: string;

  // "Yes" | "No" — overseas property, accounts, non-UK citizenship/residency, relocation plans
  hasInternationalConnections: string;
  internationalSummary: string;

  // Declarations of understanding
  confirmPersonalEffects: boolean;
  confirmHouseholdDivision: boolean;
  acknowledgeCourtChildren: boolean;
  confirmCostSharing: boolean;
  confirmUndueInfluence: boolean;
  confirmIla: boolean;
  confirmFinancialDisclosure: boolean;
  confirmPlatformDisclaimer: boolean;
  confirmAccuracy: boolean;
}

export type DeclarationKey = {
  [K in keyof DeclarationsFormData]: DeclarationsFormData[K] extends boolean ? K : never;
}[keyof DeclarationsFormData];
