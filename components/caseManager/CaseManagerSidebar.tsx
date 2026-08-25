"use client";

import React from 'react';
import { NavView } from '@/types/case-manager';

interface SidebarProps {
  currentView: NavView;
  onViewChange: (view: NavView) => void;
  casesCount: number;
  archivedCount: number;
  onOpenAccountModal: () => void;
}

export const CaseManagerSidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  casesCount = 10,
  archivedCount = 1,
  onOpenAccountModal,
}) => {
  const navItems: { id: NavView; label: string; count?: number }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'cases', label: 'Cases', count: casesCount },
    { id: 'archived', label: 'Archived', count: archivedCount },
    { id: 'reports', label: 'Reports' },
  ];

  return (
    <aside className="w-[240px] bg-[#0d1527] border-r border-[#1e293b] fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between p-5 text-slate-200">
      <div>
        {/* Logo & Header */}
        <div className="flex items-center gap-3 mb-8 pt-2">
          <div className="w-9 h-9 rounded-full border border-rose-400 bg-[#0a101f] text-rose-300 font-serif font-bold text-sm flex items-center justify-center shadow-xs">
            LP
          </div>
          <div className="flex flex-col">
            <h1 className="font-serif text-lg font-bold text-white tracking-wide leading-none">
              LetsPrenup
            </h1>
            <span className="text-[9px] uppercase tracking-wider text-rose-300 font-bold mt-1">
              CASE MANAGER PORTAL V1.0
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
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

      {/* Footer User Profile Account Details - INTERACTIVE */}
      <div
        onClick={onOpenAccountModal}
        className="pt-4 border-t border-slate-800/80 flex items-center gap-3 cursor-pointer hover:bg-slate-800/50 p-2 rounded-xl transition-all"
        title="Click to view interactive Account Profile"
      >
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-rose-950 border border-rose-400/50 text-rose-200 font-bold text-xs flex items-center justify-center shadow-xs font-sans">
            SJ
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0d1527] absolute bottom-0 right-0" />
        </div>

        <div className="flex flex-col min-w-0">
          <div className="text-xs font-bold text-white truncate font-sans">
            Sarah Jenkins
          </div>
          <div className="text-[10px] text-slate-400 font-sans truncate">
            Operational Coordinator
          </div>
          <div className="text-[9px] text-rose-300/90 font-mono font-semibold uppercase mt-0.5">
            Role: CASE_MANAGER
          </div>
        </div>
      </div>
    </aside>
  );
};
