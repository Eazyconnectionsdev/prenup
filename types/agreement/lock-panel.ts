import type { LockStatus } from "@/types/agreement";

export interface LockPanelProps {
  lockStatus: LockStatus | null;
  lockStatusError: string | null;
  onRetryLockStatus: () => void;
  isCheckingOut: boolean;
  checkOutError: string | null;
  onCheckOut: () => void;
  isCheckingIn: boolean;
  checkInError: string | null;
  onCheckIn: () => void;
}
