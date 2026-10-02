export interface SecurePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: () => void;
  serviceTitle?: string;
}
