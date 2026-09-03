"use client";

import React, { useMemo, useState } from 'react';
import { Eye } from 'lucide-react';
import { LawyerCase, LawyerPersona } from '../../../types/lawyer-portal';

interface AppendicesViewProps {
  cases: LawyerCase[];
  activePersona: LawyerPersona;
  onSelectCase: (caseId: string) => void;
}

export const AppendicesView: React.FC<AppendicesViewProps> = ({
  cases,
  activePersona,
  onSelectCase,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>('ALL');

  const getLawyerName = (persona: LawyerPersona) => {
    if (persona === 'L1') return 'Robert Miller, Esq.';
    if (persona === 'L2') return 'Mark Sterling, Esq.';
    return 'Clara Conner, Esq.';
  };

  const activeLawyer = getLawyerName(activePersona);

  // Get list of unique assigned cases for the dropdown
  const uniqueCases = useMemo(() => {
    return cases.filter((c) => {
      const isAssigned = activePersona === 'L1' ? c.p1Lawyer === activeLawyer : activePersona === 'L2' ? c.p2Lawyer === activeLawyer : (c.p1Lawyer === activeLawyer || c.p2Lawyer === activeLawyer);
      return isAssigned;
    });
  }, [cases, activePersona, activeLawyer]);

  // Filter and compile appendices
  const allAppendices = useMemo(() => {
    const list: { caseId: string; clientNames: string; section: string; title: string; fileName: string; uploadedBy: string; createdDate: string; s3Path: string }[] = [];
    
    cases.forEach((c) => {
      // Security filter
      const isAssigned = activePersona === 'L1' ? c.p1Lawyer === activeLawyer : activePersona === 'L2' ? c.p2Lawyer === activeLawyer : (c.p1Lawyer === activeLawyer || c.p2Lawyer === activeLawyer);
      if (!isAssigned) return;

      // Dropdown filter
      if (selectedCaseId !== 'ALL' && c.id !== selectedCaseId) return;

      // Appendix A
      c.appendices.A.forEach((app) => {
        list.push({ caseId: c.id, clientNames: `${c.p1Name} & ${c.p2Name}`, section: 'A: Property', title: app.title, fileName: app.fileName, uploadedBy: app.uploadedBy, createdDate: app.createdDate, s3Path: app.s3Path });
      });

      // Appendix B
      c.appendices.B.forEach((app) => {
        list.push({ caseId: c.id, clientNames: `${c.p1Name} & ${c.p2Name}`, section: 'B: Bank Statements', title: app.title, fileName: app.fileName, uploadedBy: app.uploadedBy, createdDate: app.createdDate, s3Path: app.s3Path });
      });

      // Appendix C
      c.appendices.C.forEach((app) => {
        list.push({ caseId: c.id, clientNames: `${c.p1Name} & ${c.p2Name}`, section: 'C: Trust', title: app.title, fileName: app.fileName, uploadedBy: app.uploadedBy, createdDate: app.createdDate, s3Path: app.s3Path });
      });
    });

    return list;
  }, [cases, activePersona, activeLawyer, selectedCaseId]);

  return (
    <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-xs max-w-[1280px]">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold font-sans text-slate-900 tracking-tight">
            Financial Disclosure Appendices Index ({allAppendices.length} Found)
          </h3>
          <span className="text-[10px] text-slate-400 font-normal">Click any row to open the case drawer</span>
        </div>

        {/* Case Filter Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-500 uppercase tracking-wide">Filter by Case:</span>
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="bg-white border border-slate-300 text-slate-800 px-3 py-1.5 rounded-lg font-sans outline-none cursor-pointer min-w-[240px]"
          >
            <option value="ALL">All Assigned Cases</option>
            {uniqueCases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} - {c.p1Name} &amp; {c.p2Name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="w-full text-left text-xs font-sans">
        <thead>
          <tr className="bg-slate-100 text-slate-600 uppercase tracking-wider text-[10px] font-bold border-b border-slate-300">
            <th className="p-4 pl-6">Case Code</th>
            <th className="p-4">Matter Name</th>
            <th className="p-4">Appendix Slot</th>
            <th className="p-4">Document Title</th>
            <th className="p-4">File Name</th>
            <th className="p-4">Uploaded By</th>
            <th className="p-4 pr-6">Inspect</th>
          </tr>
        </thead>
        <tbody>
          {allAppendices.length > 0 ? (
            allAppendices.map((app, idx) => (
              <tr
                key={idx}
                onClick={() => onSelectCase(app.caseId)}
                className="border-b border-slate-100 hover:bg-slate-50 transition-all cursor-pointer text-slate-700"
              >
                <td className="p-4 pl-6 font-mono font-bold text-slate-900">{app.caseId}</td>
                <td className="p-4 font-semibold">{app.clientNames}</td>
                <td className="p-4 font-bold text-emerald-800 uppercase tracking-wider text-[9px] bg-slate-50 border border-slate-100 rounded inline-block mt-3">{app.section}</td>
                <td className="p-4 font-semibold">{app.title}</td>
                <td className="p-4 font-mono">{app.fileName}</td>
                <td className="p-4">{app.uploadedBy}</td>
                <td className="p-4 pr-6">
                  <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-lg border border-slate-300 transition-all cursor-pointer">
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="p-8 text-center text-slate-400 text-xs font-sans italic">
                No appendix disclosure documents found for the selected case.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
