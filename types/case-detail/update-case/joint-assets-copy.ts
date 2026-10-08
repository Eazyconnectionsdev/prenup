import type { TreatmentFields } from "@/types/forms/form-primitives";

export type YesNo = "Yes" | "No";

/* Living arrangements                                                     */
export type LivingArrangement =
  | ""
  | "Separate"
  | "Rent"
  | "OneOwner"
  | "Joint"
  | "ThirdParty"
  | "Other";

/* Row types                                                                */
export interface SharedRealEstateRow extends TreatmentFields {
  id: string;
  addressLine1: string;
  addressLine2: string;
  postcode: string;
  propertyType: string;
  value: string;
  valueUnknown: boolean;
  mortgageBalance: string;
  earlyPenalty: string;
  ownershipPercentage: string;
  thirdPartyInterest: string;
  thirdPartyDetail: string;
}

export interface SharedSavingsRow extends TreatmentFields {
  id: string;
  accountHolder: string;
  institution: string;
  accountType: string;
  balance: string;
}

export interface SharedBusinessRow extends TreatmentFields {
  id: string;
  name: string;
  entityType: string;
  turnover: string;
  netProfit: string;
  ownershipPercent: string;
  valueOfStake: string;
  valueUnknown: boolean;
  justification: string;
  directorLoanBalance: string;
}

export interface SharedIPRow extends TreatmentFields {
  id: string;
  name: string;
  ipType: string;
  value: string;
  valueUnknown: boolean;
  registrationNumber: string;
  description: string;
}

export interface SharedChattelRow extends TreatmentFields {
  id: string;
  description: string;
  category: string;
  value: string;
  valueUnknown: boolean;
}

export interface SharedOtherAssetRow extends TreatmentFields {
  id: string;
  description: string;
  value: string;
  valueUnknown: boolean;
}

/* Main component                                                          */
export interface SharedAssetsFormProps {
  onContinue?: () => void;
}
