export type YesNo = "Yes" | "No";

export type Treatment =
  | ""
  | "KeepSeparate"
  | "ShareEqually"
  | "Contribution"
  | "Percentage"
  | "Custom";

export interface TreatmentFields {
  treatment: Treatment;
  contributionText: string;
  percentageValue: string;
  customText: string;
}

/* Row types per asset category                                            */
export interface RealEstateRow extends TreatmentFields {
  id: string;
  addressLine1: string;
  addressLine2: string;
  postcode: string;
  propertyType: string;
  value: string;
  valueUnknown: boolean;
  mortgageBalance: string;
  earlyPenalty: string;
  ownershipShare: string;
  ownershipMode: string;
  coOwnerDetails: string;
  thirdPartyInterest: string;
  thirdPartyDetail: string;
}

export interface SavingsRow extends TreatmentFields {
  id: string;
  institution: string;
  accountType: string;
  balance: string;
}

export interface PensionRow extends TreatmentFields {
  id: string;
  provider: string;
  value: string;
  valueUnknown: boolean;
}

export interface BusinessRow extends TreatmentFields {
  id: string;
  name: string;
  entityType: string;
  turnover: string;
  netProfit: string;
  ownershipPercent: string;
  valueOfStake: string;
  valueUnknown: boolean;
  justification: string;
}

export interface ChattelRow extends TreatmentFields {
  id: string;
  description: string;
  category: string;
  value: string;
  valueUnknown: boolean;
}

export interface IPRow extends TreatmentFields {
  id: string;
  name: string;
  ipType: string;
  value: string;
  valueUnknown: boolean;
  registrationNumber: string;
  description: string;
}

export interface OtherAssetRow extends TreatmentFields {
  id: string;
  description: string;
  value: string;
  valueUnknown: boolean;
}

export interface YesNoToggleProps {
  name: string;
  value: YesNo;
  onChange: (v: YesNo) => void;
}

export interface ValueWithUnsureProps {
  id: string;
  value: string;
  unknown: boolean;
  onValueChange: (v: string) => void;
  onUnknownChange: (v: boolean) => void;
  placeholder: string;
}

export interface TreatmentSelectProps {
  id: string;
  fields: TreatmentFields;
  onChange: (fields: TreatmentFields) => void;
  label?: string;
  options?: { value: Treatment; label: string }[];
}
