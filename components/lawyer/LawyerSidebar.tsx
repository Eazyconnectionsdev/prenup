"use client";

import React from 'react';
import { NavView, LawyerPersona } from '../../types/lawyer-portal';

interface SidebarProps {
  currentView: NavView;
  onViewChange: (view: NavView) => void;
  assignedCount: number;
  completedCount: number;
  activePersona: LawyerPersona;
  onOpenProfile: () => void;
}

export const LawyerSidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  assignedCount,
  completedCount,
  activePersona,
  onOpenProfile,
}) => {
  const menuItems: { id: NavView; label: string; count?: number }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'assigned_cases', label: 'Assigned Cases', count: 14 },
    { id: 'completed', label: 'Completed Cases', count: 6 },
    { id: 'settings', label: 'Settings' },
  ];

  // Helper info for active persona
  const getPersonaDetails = (persona: LawyerPersona) => {
    switch (persona) {
      case 'L1':
        return {
          name: 'Robert Miller, Esq.',
          title: 'State Coordinator',
          firm: 'Blake Cassels',
          initials: 'RM',
        };
      case 'L2':
        return {
          name: 'Mark Sterling, Esq.',
          title: 'Managing Partner',
          firm: 'Torys LLP',
          initials: 'MS',
        };
      case 'L3':
      default:
        return {
          name: 'Clara Conner, Esq.',
          title: 'Partner Counsel',
          firm: 'Osler Hoskin',
          initials: 'CC',
        };
    }
  };

  const lawyer = getPersonaDetails(activePersona);

  return (
    <aside className="w-[250px] bg-[#0d1527] border-r border-[#1e293b] fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between p-5 text-slate-200">
      <div>
        {/* Logo & Header */}
        <div className="flex items-center gap-3 mb-8 pt-2">
          <div className="w-9 h-9 rounded-full border border-emerald-400 bg-[#0a101f] text-emerald-300 font-serif font-bold text-sm flex items-center justify-center shadow-xs">
            LP
          </div>
          <div className="flex flex-col">
            <h1 className="font-serif text-lg font-bold text-white tracking-wide leading-none">
              LetsPrenup
            </h1>
            <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold mt-1">
              LAWYER PORTAL V1.1
            </span>
          </div>
        </div>

        {/* Navigation Items (Locked 9 menus) */}
        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all text-left w-full cursor-pointer ${
                  isActive
                    ? 'bg-[#1b2947] text-white shadow-xs border border-slate-700/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#131e36]'
                }`}
              >
                <span>{item.label}</span>
                {item.count !== undefined && (
                  <span className="text-[10px] font-mono font-bold bg-[#131e36] text-slate-300 px-2 py-0.5 rounded-full border border-slate-700/60">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile Box */}
      <div
        onClick={onOpenProfile}
        className="pt-4 border-t border-slate-800/80 flex items-center gap-3 cursor-pointer hover:bg-slate-800/50 p-2 rounded-xl transition-all"
        title="View Profile Details"
      >
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-emerald-950 border border-emerald-400/50 text-emerald-200 font-bold text-xs flex items-center justify-center shadow-xs font-sans">
            {lawyer.initials}
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0d1527] absolute bottom-0 right-0" />
        </div>

        <div className="flex flex-col min-w-0">
          <div className="text-xs font-bold text-white truncate font-sans">
            {lawyer.name}
          </div>
          <div className="text-[10px] text-slate-400 font-sans truncate">
            {lawyer.title}
          </div>
          <div className="text-[9px] text-emerald-400 font-mono font-bold uppercase mt-0.5">
            ROLE : LAWYER
          </div>
        </div>
      </div>
    </aside>
  );
};
