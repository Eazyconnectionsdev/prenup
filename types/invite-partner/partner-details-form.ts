import type { PartnerData } from "@/types/invite-partner";

export interface PartnerDetailsFormProps {
  partnerData: PartnerData;
  onChange: (updated: Partial<PartnerData>) => void;
  onSaveDraft?: () => void;
  onSendInvitation: () => void | Promise<void>;
  // Invite already sent: button becomes "Update & Resend".
  isSent?: boolean;
  // Partner already registered: details are read-only.
  locked?: boolean;
}
