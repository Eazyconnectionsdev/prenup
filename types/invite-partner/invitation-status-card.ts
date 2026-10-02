import type { PartnerData } from "@/types/invite-partner";

export interface InvitationStatusCardProps {
  partnerData: PartnerData;
  onResend: () => void;
  onEdit: () => void;
}
