"use client";

import React from 'react';
import { Search } from 'lucide-react';
import { NavView } from '@/types/case-manager';
import { useRouter } from 'next/navigation';

interface TopBarProps {
  currentView: NavView;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenScorecard: () => void;
  onOpenAccountModal: () => void;
  onViewChange?: (view: NavView) => void;
}

const VIEW_TITLES: Record<NavView, string> = {
  dashboard: 'Dashboard Ledger',
  cases: 'Cases Master List',
  archived: 'Archived Vault Ledger',
  reports: 'Operational Intelligence Reports',
};

export const CaseManagerTopBar: React.FC<TopBarProps> = ({
  currentView,
  searchQuery,
  onSearchChange,
  onOpenScorecard,
  onOpenAccountModal,
  onViewChange,
}) => {
  const router = useRouter();

  const handleNavigate = (view: NavView) => {
    if (onViewChange) {
      onViewChange(view);
    }
    router.push(`/cm/${view}`);
  };

  return (
    <header className="h-[76px] bg-[#f7f4ee] flex items-center justify-between px-8 pt-4 pb-2">
      {/* Title */}
      <h1
        onClick={() => handleNavigate(currentView)}
        className="text-2xl font-bold font-sans text-slate-900 tracking-tight cursor-pointer"
      >
        {VIEW_TITLES[currentView]}
      </h1>
    </header>
  );
};
