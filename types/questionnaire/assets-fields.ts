import type { TreatmentFields, YesNo } from "@/types/forms/form-primitives";
import type React from "react";

/* Row types                                                               */
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

export interface IPRow extends TreatmentFields {
  id: string;
  name: string;
  ipType: string;
  value: string;
  valueUnknown: boolean;
  registrationNumber: string;
  description: string;
}

export interface ChattelRow extends TreatmentFields {
  id: string;
  description: string;
  category: string;
  value: string;
  valueUnknown: boolean;
}

export interface OtherAssetRow extends TreatmentFields {
  id: string;
  description: string;
  value: string;
  valueUnknown: boolean;
}

export interface AssetsData {
  hasRealEstate: YesNo;
  realEstate: RealEstateRow[];
  hasSavings: YesNo;
  savings: SavingsRow[];
  hasPensions: YesNo;
  pensions: PensionRow[];
  hasBusinesses: YesNo;
  businesses: BusinessRow[];
  hasIP: YesNo;
  ipAssets: IPRow[];
  hasChattels: YesNo;
  chattels: ChattelRow[];
  hasOtherAssets: YesNo;
  otherAssets: OtherAssetRow[];
}

export type ListKey =
  | "realEstate"
  | "savings"
  | "pensions"
  | "businesses"
  | "ipAssets"
  | "chattels"
  | "otherAssets";

export type FlagKey =
  | "hasRealEstate"
  | "hasSavings"
  | "hasPensions"
  | "hasBusinesses"
  | "hasIP"
  | "hasChattels"
  | "hasOtherAssets";

export type RowOf<K extends ListKey> = AssetsData[K][number];

/* Select options                                                          */
export type Option = { value: string; label: string };

/* Component                                                               */
export interface Props {
  data: AssetsData;
  onChange?: React.Dispatch<React.SetStateAction<AssetsData>>;
  readOnly?: boolean;
}
