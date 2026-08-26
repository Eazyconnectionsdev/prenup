"use client";

import React from 'react';
import { Search, Shield } from 'lucide-react';
import { NavView, LawyerPersona } from '../../types/lawyer-portal';

interface TopBarProps {
  currentView: NavView;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenScorecard: () => void;
  activePersona: LawyerPersona;
  onPersonaChange: (persona: LawyerPersona) => void;
  onOpenProfile: () => void;
}

const VIEW_TITLES: Record<NavView, string> = {
  dashboard: 'Lawyer Dashboard',
  assigned_cases: 'Assigned Matters Master List',
  versions: 'Agreement Versions Index',
  notes: 'Confidential Summary Notes',
  appendices: 'Disclosure Appendices Vault',
  ila: 'Independent Legal Advice (ILA) Register',
  completed: 'Completed Cases Registry',
  profile: 'Lawyer Profile Information',
  settings: 'Portal Configuration Settings',
};

export const LawyerTopBar: React.FC<TopBarProps> = ({
  currentView,
  searchQuery,
  onSearchChange,
  onOpenScorecard,
  activePersona,
  onPersonaChange,
  onOpenProfile,
}) => {
  const getPersonaDetails = (persona: LawyerPersona) => {
    switch (persona) {
      case 'L1':
        return { name: 'Robert Miller, Esq.', firm: 'Blake Cassels', role: 'L1 Lawyer (P1)' };
      case 'L2':
        return { name: 'Mark Sterling, Esq.', firm: 'Torys LLP', role: 'L2 Lawyer (P2)' };
      case 'L3':
      default:
        return { name: 'Clara Conner, Esq.', firm: 'Osler Hoskin', role: 'Opposing Counsel' };
    }
  };

  const lawyer = getPersonaDetails(activePersona);

  return (
    <header className="h-[76px] bg-white flex items-center justify-between px-8 pt-4 pb-2 border-b border-slate-200">
      {/* Title */}
      <div className="flex flex-col">
        <h1 className="text-xl font-bold font-sans text-slate-900 tracking-tight leading-tight">
          {VIEW_TITLES[currentView]}
        </h1>
        <span className="text-[10px] text-slate-500 font-mono">
          MODULE: LAWYER_PORTAL_V1.1
        </span>
      </div>

      {/* Top Actions: Interactive User Account Details */}
      <div className="flex items-center gap-4">
        {/* User profile details */}
        <div
          onClick={onOpenProfile}
          className="flex items-center gap-3 bg-white border border-slate-200 rounded-full px-3 py-1.5 shadow-xs cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-all"
        >
          <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-[11px] font-sans flex items-center justify-center">
            {activePersona}
          </div>
          <div className="flex flex-col text-left pr-1 min-w-[100px]">
            <span className="text-xs font-bold font-sans text-slate-900 leading-tight truncate max-w-[110px]">
              {lawyer.name}
            </span>
            <span className="text-[10px] font-sans text-slate-500 leading-tight truncate">
              {lawyer.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
