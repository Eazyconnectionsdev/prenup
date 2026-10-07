import type { PartnerData } from "@/types/invite-partner";

export interface InvitationStatusCardProps {
  partnerData: PartnerData;
  onResend: () => void | Promise<void>;
  onEdit: () => void;
  // Show the green "sent" banner (only right after the first invite).
  showSuccess?: boolean;
}
