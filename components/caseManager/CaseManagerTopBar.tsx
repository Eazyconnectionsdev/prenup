"use client";

import React from 'react';
import { Search } from 'lucide-react';
import { NavView } from '@/types/case-manager';

interface TopBarProps {
  currentView: NavView;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenScorecard: () => void;
  onOpenAccountModal: () => void;
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
}) => {
  return (
    <header className="h-[76px] bg-[#f7f4ee] flex items-center justify-between px-8 pt-4 pb-2">
      {/* Title */}
      <h1 className="text-2xl font-bold font-sans text-slate-900 tracking-tight">
        {VIEW_TITLES[currentView]}
      </h1>
    </header>
  );
};
