import type { AgreementOption } from "@/types/onboarding";

export interface AgreementServiceItem {
  key: 'prenup' | 'postnup' | 'cohabitation';
  title: string;
  badge?: string;
  serviceTag: string;
  subtitle: string;
  subOptionCountText?: string;
}

export interface AgreementCardProps {
  serviceKey?: 'prenup' | 'postnup' | 'cohabitation';
  title?: string;
  badge?: string;
  serviceTag?: string;
  subtitle?: string;
  subOptionCountText?: string;
  isSelected?: boolean;
  onSelect?: (id?: string) => void;
  // Legacy or alternative prop styles
  service?: AgreementServiceItem;
  selectedId?: string;
  option?: AgreementOption;
}
