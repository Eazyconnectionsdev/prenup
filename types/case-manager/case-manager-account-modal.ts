export interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'warning') => void;
}
