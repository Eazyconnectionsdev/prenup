import type { AgreementOption } from "@/types/onboarding";

export interface Step2PaymentProps {
  selectedOption?: AgreementOption | null;
  onBack: () => void;
  onPaymentSuccess: () => void;
  onChooseService?: () => void;
  isPaid?: boolean;
  // True while a return from Stripe Checkout is being confirmed
  isVerifying?: boolean;
}
