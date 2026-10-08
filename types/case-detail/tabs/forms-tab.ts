export interface Props {
  caseData: any;
  isCmEditing: boolean;
  setIsCmEditing: (value: boolean) => void;
}

export type ActiveParty = "user1" | "user2" | "joint";

export type ActiveSection =
  | "personal"
  | "legal"
  | "family"
  | "assets"
  | "income"
  | "liabilities";

export type ActiveJointSection =
  | "assets"
  | "income"
  | "liabilities";
