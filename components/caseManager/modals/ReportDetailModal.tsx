"use client";

import React from 'react';
import { X, Lock, ShieldCheck, FileSpreadsheet } from 'lucide-react';
import { ReportRowData } from '@/types/case-manager';

interface ReportDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  row: ReportRowData | null;
  reportTitle: string;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  isOpen,
  onClose,
  row,
  reportTitle,
}) => {
  if (!isOpen || !row) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white border border-slate-300 rounded-xl shadow-2xl max-w-[640px] w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold tracking-tight">Record Inspection (Read-Only)</h3>
              <p className="text-[11px] text-slate-400 font-mono">{reportTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Read-Only Guarantee Banner */}
        <div className="bg-emerald-950/90 border-b border-emerald-800/50 px-6 py-2 flex items-center justify-between text-xs text-emerald-300">
          <span className="flex items-center gap-1.5 font-bold">
            <Lock className="w-3.5 h-3.5 text-emerald-400" /> Section 21 Enterprise Governance: Read-Only Audit Ledger
          </span>
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest bg-emerald-900/80 px-2 py-0.5 rounded">Immutable</span>
        </div>

        {/* Body Content Key-Value Fields */}
        <div className="p-6 max-h-[460px] overflow-y-auto grid grid-cols-2 gap-4">
          {Object.entries(row).map(([key, value]) => {
            if (key === 'id' || key === 'caseId') {
              return (
                <div key={key} className="col-span-2 bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Record Key Identifier
                    </span>
                    <span className="text-sm font-mono font-bold text-slate-900">{String(value)}</span>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
              );
            }

            const formattedKey = key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, (str) => str.toUpperCase());

            return (
              <div key={key} className="bg-slate-50/70 border border-slate-200 p-3 rounded-lg flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {formattedKey}
                </span>
                <span className="text-xs font-semibold text-slate-900 break-words">
                  {value !== null && value !== undefined && value !== '' ? String(value) : '—'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-sans italic">
            No edits permitted. All report records are read-only.
          </span>
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-1.5 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer shadow-xs"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
};
