import type { LawyerPersona } from "@/types/lawyer";

export interface ProfileViewProps {
  activePersona: LawyerPersona;
  onPersonaChange?: (persona: LawyerPersona) => void;
  onLogout?: () => void;
}
