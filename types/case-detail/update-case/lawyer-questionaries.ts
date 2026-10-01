export interface QuestionnaireData {
  complianceParticipation: string;
  compliancePurpose: string;
  complianceFreeWill: string;
  complianceLegalOpportunity: string;
  weddingTimingAssessment: string;

  complianceRadmacherUnderstanding: string;
  complianceCourtDiscretion: string;
  complianceFinancialImpact: string;
  compliancePodeUtilization: string;

  userAge: string;
  partnerAge: string;
  relationshipDuration: string;
  medicalExists: string;
  medicalDetails: string;
  housingNeeds: string;
  incomeNeeds: string;
  pensionNeeds: string;

  complianceDisclosureScope: string;
  complianceDigitalAssets: string;
  complianceDigitalAssetsDetails: string;
  complianceCorporateRestrictions: string;
  complianceCorporateRestrictionsDetails: string;
  complianceWorldwideScope: string;
  complianceDataAccuracy: string;
  finalDeclarationSignature: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
}

/* Main component                                                          */
export interface LawyerQuestionnaireFormProps {
  onContinue?: () => void;
}
