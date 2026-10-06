export type SectionKey = "section1" | "section2" | "section3" | "section4";

export type SubgroupKey = "myFinancial" | "partnerFinancial" | "jointFinancial";

export interface LeafProps {
  id: string;
  icon: IconName;
  label: string;
  done?: boolean;
  activeLeaf: string;
  readOnly?: boolean;
  lockReason?: string;
  isPartner?: boolean;
}

export type IconName =
  | "workspace"
  | "person"
  | "personalInfo"
  | "legal"
  | "family"
  | "folder"
  | "assets"
  | "income"
  | "liabilities"
  | "joint"
  | "seal";
