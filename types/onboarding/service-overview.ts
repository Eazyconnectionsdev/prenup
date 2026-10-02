import type { AgreementOption } from "@/types/onboarding";

export interface ServiceOverviewProps {
  selectedOption: AgreementOption;
  resideChecked: boolean;
  understandChecked: boolean;
  onResideChange: (checked: boolean) => void;
  onUnderstandChange: (checked: boolean) => void;
  onContinue: () => void;
}
