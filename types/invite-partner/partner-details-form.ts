import type { PartnerData } from "@/types/invite-partner";

export interface PartnerDetailsFormProps {
  partnerData: PartnerData;
  onChange: (updated: Partial<PartnerData>) => void;
  onSaveDraft: () => void;
  onSendInvitation: () => void;
}
