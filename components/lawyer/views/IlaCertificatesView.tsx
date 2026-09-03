"use client";

import React, { useMemo, useState } from 'react';
import { Eye, ShieldAlert } from 'lucide-react';
import { LawyerCase, LawyerPersona } from '../../../types/lawyer-portal';

interface IlaCertificatesViewProps {
  cases: LawyerCase[];
  activePersona: LawyerPersona;
  onSelectCase: (caseId: string) => void;
}

export const IlaCertificatesView: React.FC<IlaCertificatesViewProps> = ({
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

  // Filter and compile certs
  const allCerts = useMemo(() => {
    const list: { caseId: string; clientName: string; lawyerName: string; firmName: string; issueDate: string; s3Path: string; party: string }[] = [];
    
    cases.forEach((c) => {
      // Security filter
      const isAssigned = activePersona === 'L1' ? c.p1Lawyer === activeLawyer : activePersona === 'L2' ? c.p2Lawyer === activeLawyer : (c.p1Lawyer === activeLawyer || c.p2Lawyer === activeLawyer);
      if (!isAssigned) return;

      // Dropdown filter
      if (selectedCaseId !== 'ALL' && c.id !== selectedCaseId) return;

      // Enforce Constraint 9
      if (c.ilaP1Cert && (activePersona === 'L1' || activePersona === 'L3')) {
        list.push({
          caseId: c.id,
          clientName: c.p1Name,
          lawyerName: c.ilaP1Cert.lawyerName,
          firmName: c.ilaP1Cert.firmName,
          issueDate: c.ilaP1Cert.issueDate,
          s3Path: c.ilaP1Cert.signedPdfPath,
          party: 'Client 1 (P1)',
        });
      }

      if (c.ilaP2Cert && (activePersona === 'L2' || activePersona === 'L3')) {
        list.push({
          caseId: c.id,
          clientName: c.p2Name,
          lawyerName: c.ilaP2Cert.lawyerName,
          firmName: c.ilaP2Cert.firmName,
          issueDate: c.ilaP2Cert.issueDate,
          s3Path: c.ilaP2Cert.signedPdfPath,
          party: 'Client 2 (P2)',
        });
      }
    });

    return list;
  }, [cases, activePersona, activeLawyer, selectedCaseId]);

  return (
    <div className="flex flex-col gap-6 max-w-[1280px]">
      {/* Alert informing about constraint */}
      <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-center gap-3 text-xs text-emerald-800">
        <ShieldAlert className="w-5 h-5 text-emerald-600 shrink-0" />
        <div>
          <p className="font-bold">ILA Certificates Access Restricted (Constraint #9)</p>
          <p className="text-slate-600 mt-0.5">Attorneys can only view their own client's signed certificate. Opposing ILA documents are locked.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold font-sans text-slate-900 tracking-tight">
              Independent Legal Advice (ILA) Certificates ({allCerts.length} Found)
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
              <th className="p-4">Party</th>
              <th className="p-4">Client Name</th>
              <th className="p-4">Certifying Attorney</th>
              <th className="p-4">Law Firm</th>
              <th className="p-4">Date Issued</th>
              <th className="p-4 pr-6">Inspect</th>
            </tr>
          </thead>
          <tbody>
            {allCerts.length > 0 ? (
              allCerts.map((cert, idx) => (
                <tr
                  key={idx}
                  onClick={() => onSelectCase(cert.caseId)}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-all cursor-pointer text-slate-700"
                >
                  <td className="p-4 pl-6 font-mono font-bold text-slate-900">{cert.caseId}</td>
                  <td className="p-4 font-bold text-[#0d1527]">{cert.party}</td>
                  <td className="p-4 font-semibold">{cert.clientName}</td>
                  <td className="p-4">{cert.lawyerName}</td>
                  <td className="p-4">{cert.firmName}</td>
                  <td className="p-4 font-mono">{cert.issueDate}</td>
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
                  No ILA certificates found for the selected case.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
