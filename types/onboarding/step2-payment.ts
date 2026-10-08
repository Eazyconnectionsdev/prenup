import type { AgreementOption } from "@/types/onboarding";

export interface Step2PaymentProps {
  selectedOption: AgreementOption;
  onBack: () => void;
  onPaymentSuccess: () => void;
}
