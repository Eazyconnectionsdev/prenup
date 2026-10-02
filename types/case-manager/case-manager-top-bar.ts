import type { NavView } from "@/types/case-manager";

export interface TopBarProps {
  currentView: NavView;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenScorecard: () => void;
  onOpenAccountModal: () => void;
  onViewChange?: (view: NavView) => void;
}
