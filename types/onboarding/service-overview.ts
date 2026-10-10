import type { AgreementOption } from "@/types/onboarding";

export interface ServiceOverviewProps {
  selectedOption: AgreementOption;
  selectedService: 'prenup' | 'postnup' | 'cohabitation' | 'guided';
  selectedId: string;
  onSelectSubOption: (id: string) => void;
  resideChecked: boolean;
  onResideChange: (checked: boolean) => void;
  onContinue: () => void;
  isSubmitting?: boolean;
  understandChecked?: boolean;
  onUnderstandChange?: (checked: boolean) => void;
}
