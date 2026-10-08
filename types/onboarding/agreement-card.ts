import type { AgreementOption } from "@/types/onboarding";

export interface AgreementCardProps {
  option: AgreementOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
}
