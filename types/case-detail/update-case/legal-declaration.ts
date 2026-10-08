import type { ChangeEvent } from "react";

export interface DeclarationsFormData {
  agreementObjectives: string;
  livingSituationFuture: string;
  confirmPersonalEffects: boolean;
  confirmHouseholdDivision: boolean;
  acknowledgeCourtChildren: boolean;
  confirmCostSharing: boolean;
  confirmUndueInfluence: boolean;
  confirmIla: boolean;
  confirmPlatformDisclaimer: boolean;
  confirmAccuracy: boolean;
}

export interface ToggleCardProps {
  id: string;
  name: keyof DeclarationsFormData;
  title: string;
  description: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
