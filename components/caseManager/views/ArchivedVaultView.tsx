"use client";

import React from 'react';
import { Eye, Archive, ShieldCheck } from 'lucide-react';
import { CaseItem } from '@/types/case-manager';

interface ArchivedVaultViewProps {
  archivedCases: CaseItem[];
  onSelectCase: (caseId: string) => void;
}

export const ArchivedVaultView: React.FC<ArchivedVaultViewProps> = ({
  archivedCases,
  onSelectCase,
}) => {
  return (
    <div className="flex flex-col gap-6 max-w-[1280px]">
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-700">
            <Archive className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold font-sans text-slate-900 tracking-tight">
              Archived Vault Ledger
            </h2>
            <p className="text-xs font-sans text-slate-500">
              Executed prenuptial agreements archived under legal retention guidelines.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold font-sans text-slate-800 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>1 Executed Contract Archived</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="bg-slate-100/70 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <th className="p-4 pl-6">Case Code</th>
              <th className="p-4">Couple Names</th>
              <th className="p-4">Service Tier</th>
              <th className="p-4">Execution Date</th>
              <th className="p-4">Status Tag</th>
              <th className="p-4 pr-6">Inspect</th>
            </tr>
          </thead>
          <tbody>
            {archivedCases.map((c) => (
              <tr
                key={c.id}
                onClick={() => onSelectCase(c.id)}
                className="border-b border-slate-100 hover:bg-slate-50/80 transition-all cursor-pointer text-slate-700"
              >
                <td className="p-4 pl-6 font-mono font-bold text-slate-900">
                  {c.id}
                </td>
                <td className="p-4 font-semibold text-slate-900">
                  {c.p1} & {c.p2}
                </td>
                <td className="p-4">{c.service}</td>
                <td className="p-4 font-mono text-slate-500">2026-06-15</td>
                <td className="p-4">
                  <span className="badge-rose-pill">ARCHIVED VAULT</span>
                </td>
                <td className="p-4 pr-6">
                  <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-lg border border-slate-200 transition-all">
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
