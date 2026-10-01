import type { NavView } from "@/types/case-manager";

export interface SidebarProps {
  currentView: NavView;
  onViewChange: (view: NavView) => void;
  casesCount: number;
  archivedCount: number;
  onOpenAccountModal: () => void;
}
