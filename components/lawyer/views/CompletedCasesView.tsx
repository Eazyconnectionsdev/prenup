"use client";

import React, { useMemo } from 'react';
import { Eye } from 'lucide-react';
import { LawyerCase, LawyerPersona, CaseStatus } from '../../../types/lawyer-portal';

interface CompletedCasesViewProps {
  cases: LawyerCase[];
  activePersona: LawyerPersona;
  onSelectCase: (caseId: string) => void;
  searchQuery: string;
}

export const CompletedCasesView: React.FC<CompletedCasesViewProps> = ({
  cases,
  activePersona,
  onSelectCase,
  searchQuery,
}) => {
  // Helper to determine active lawyer name based on persona
  const getLawyerName = (persona: LawyerPersona) => {
    if (persona === 'L1') return 'Robert Miller, Esq.';
    if (persona === 'L2') return 'Mark Sterling, Esq.';
    return 'Clara Conner, Esq.';
  };

  const activeLawyer = getLawyerName(activePersona);

  // Filter completed cases assigned to this lawyer
  const completedCases = useMemo(() => {
    return cases.filter((c) => {
      const isCompleted = c.status === 'CLOSED' || c.status === 'ARCHIVED';
      if (!isCompleted) return false;

      if (activePersona === 'L1') {
        return c.p1Lawyer === activeLawyer;
      } else if (activePersona === 'L2') {
        return c.p2Lawyer === activeLawyer;
      } else {
        return c.p1Lawyer === activeLawyer || c.p2Lawyer === activeLawyer;
      }
    });
  }, [cases, activePersona, activeLawyer]);

  // Apply search query
  const filteredCases = useMemo(() => {
    return completedCases.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.id.toLowerCase().includes(q) ||
          c.p1Name.toLowerCase().includes(q) ||
          c.p2Name.toLowerCase().includes(q) ||
          c.service.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [completedCases, searchQuery]);

  return (
    <div className="flex flex-col gap-6 max-w-[1280px]">
      <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-base font-bold font-sans text-slate-900 tracking-tight">
            Completed Matters Archive ({filteredCases.length} Found)
          </h3>
        </div>

        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="bg-slate-100 text-slate-600 uppercase tracking-wider text-[10px] font-bold border-b border-slate-300">
              <th className="p-4 pl-6">Case Code</th>
              <th className="p-4">My Client</th>
              <th className="p-4">Opposing Client</th>
              <th className="p-4">Status</th>
              <th className="p-4">Execution Date</th>
              <th className="p-4">Published Version</th>
              <th className="p-4 pr-6">Inspect</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.length > 0 ? (
              filteredCases.map((c) => {
                const myClient = activePersona === 'L1' ? c.p1Name : c.p2Name;
                const opposingClient = activePersona === 'L1' ? c.p2Name : c.p1Name;
                return (
                  <tr
                    key={c.id}
                    onClick={() => onSelectCase(c.id)}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-all cursor-pointer text-slate-700"
                  >
                    <td className="p-4 pl-6 font-mono font-bold text-slate-900">
                      {c.id}
                    </td>
                    <td className="p-4 font-semibold text-slate-900">
                      {myClient}
                    </td>
                    <td className="p-4">
                      {opposingClient}
                    </td>
                    <td className="p-4">
                      <span className="border border-slate-300 text-slate-700 bg-slate-100 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4">{c.lastActivity}</td>
                    <td className="p-4 font-mono font-bold">{c.publishedVersion}</td>
                    <td className="p-4 pr-6">
                      <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-lg border border-slate-300 transition-all cursor-pointer">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400 text-xs font-sans italic">
                  No completed matters found. Completed cases show CLOSED or ARCHIVED states.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
