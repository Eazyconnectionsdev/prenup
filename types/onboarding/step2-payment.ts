import type { AgreementOption } from "@/types/onboarding";

export interface Step2PaymentProps {
  selectedOption?: AgreementOption | null;
  onBack: () => void;
  onPaymentSuccess: () => void;
  onChooseService?: () => void;
  isPaid?: boolean;
}
