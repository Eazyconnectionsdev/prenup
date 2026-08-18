"use client";

import React from 'react';
import { Search, Shield } from 'lucide-react';
import { NavView, LawyerPersona } from '../../types/lawyer-portal';

interface TopBarProps {
  currentView: NavView;
  searchQuery: string;
  onSearchChange: (query: string) => void;
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

  const showSearch = currentView !== 'dashboard' && currentView !== 'profile' && currentView !== 'settings';

  return (
    <header className="h-[76px] bg-[#f7f4ee] flex items-center justify-between px-8 pt-4 pb-2 border-b border-slate-200">
      {/* Title */}
      <div className="flex flex-col">
        <h1 className="text-xl font-bold font-sans text-slate-900 tracking-tight leading-tight">
          {VIEW_TITLES[currentView]}
        </h1>
        <span className="text-[10px] text-slate-500 font-mono">
          MODULE: LAWYER_PORTAL_V1.1
        </span>
      </div>

      {/* Top Actions: Search (Except on Dashboard) + Persona Toggler + Interactive User Account Details */}
      <div className="flex items-center gap-4">
        {/* Search box - hidden on dashboard, profile, and settings */}
        {showSearch && (
          <div className="relative w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search cases, clients, versions..."
              className="w-full bg-white border border-slate-200 rounded-full pl-9 pr-4 py-2 text-xs font-sans text-slate-800 placeholder-slate-400 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200/50 shadow-xs transition-all"
            />
          </div>
        )}

        {/* Persona Switcher Toggler (Dynamic RBAC Test) */}
        <div className="flex items-center bg-slate-200/80 border border-slate-300 rounded-full p-0.5 gap-1 shadow-inner">
          <div className="flex items-center px-2 text-[10px] font-bold text-slate-500 gap-1 font-sans uppercase">
            <Shield className="w-3 h-3 text-slate-600" />
            <span>Role:</span>
          </div>
          {(['L1', 'L2', 'L3'] as LawyerPersona[]).map((p) => {
            const isSelected = activePersona === p;
            const pLabel = p === 'L1' ? 'L1' : p === 'L2' ? 'L2' : 'L3';
            return (
              <button
                key={p}
                onClick={() => onPersonaChange(p)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold font-mono transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0d1527] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-300/60'
                }`}
                title={`Switch environment simulation to lawyer persona ${p}`}
              >
                {pLabel}
              </button>
            );
          })}
        </div>

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
