"use client";

import React, { useMemo } from 'react';
import { LawyerCase, LawyerPersona, CaseStatus } from '../../../types/lawyer-portal';

interface DashboardViewProps {
  cases: LawyerCase[];
  activePersona: LawyerPersona;
  onSelectCase: (caseId: string) => void;
  statusFilter: string;
  onFilterChange: (filter: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  cases,
  activePersona,
  onSelectCase,
  statusFilter,
  onFilterChange,
}) => {
  // Helper to determine active lawyer name based on persona
  const getLawyerName = (persona: LawyerPersona) => {
    if (persona === 'L1') return 'Robert Miller, Esq.';
    if (persona === 'L2') return 'Mark Sterling, Esq.';
    return 'Clara Conner, Esq.';
  };

  const activeLawyer = getLawyerName(activePersona);

  // Filter cases assigned to this lawyer
  const assignedCases = useMemo(() => {
    return cases.filter((c) => {
      // Lawyer only sees their assigned matters (Hard Constraint #1)
      if (activePersona === 'L1') {
        return c.p1Lawyer === activeLawyer;
      } else if (activePersona === 'L2') {
        return c.p2Lawyer === activeLawyer;
      } else {
        return c.p1Lawyer === activeLawyer || c.p2Lawyer === activeLawyer;
      }
    });
  }, [cases, activePersona, activeLawyer]);

  // Compute metrics based on assigned cases
  const metrics = useMemo(() => {
    // 1. Assigned Cases: All active assignments (not completed, cancelled or archived)
    const totalAssigned = assignedCases.filter(c => c.status !== 'COMPLETED' && c.status !== 'ARCHIVED' && c.status !== 'CANCELLED').length;
    
    // 2. Pending Review: LAWYERS_ASSIGNED, LAWYER_REVIEW
    const pendingReview = assignedCases.filter(c => c.status === 'LAWYERS_ASSIGNED' || c.status === 'LAWYER_REVIEW').length;
    
    // 3. Clean Master Uploaded: CLEAN_MASTER_UPLOADED
    const cleanMasterUploaded = assignedCases.filter(c => c.status === 'CLEAN_MASTER_UPLOADED').length;
    
    // 4. Waiting For Counterparty Approval: AWAITING_COUNTERPARTY_APPROVAL
    const waitingCounterparty = assignedCases.filter(c => c.status === 'AWAITING_COUNTERPARTY_APPROVAL').length;
    
    // 5. Sign Off Pending: LAWYER_SIGN_OFF_PENDING
    const signOffPending = assignedCases.filter(c => c.status === 'LAWYER_SIGN_OFF_PENDING').length;
    
    // 6. ILA P1 Complete: ILA_P1_COMPLETE
    const ilaP1Complete = assignedCases.filter(c => c.status === 'ILA_P1_COMPLETE').length;
    
    // 7. ILA P2 Complete: ILA_P2_COMPLETE
    const ilaP2Complete = assignedCases.filter(c => c.status === 'ILA_P2_COMPLETE').length;
    
    // 8. Completed Cases: COMPLETED, ARCHIVED
    const completed = assignedCases.filter(c => c.status === 'COMPLETED' || c.status === 'ARCHIVED').length;
    
    // 9. Cancelled Cases: CANCELLED
    const cancelled = assignedCases.filter(c => c.status === 'CANCELLED').length;
    
    // 10. Expiring Certificates: Certificate expiry < 30 days
    const expiringCerts = assignedCases.filter(c => {
      if (!c.certificateExpiryDate) return false;
      const expiry = new Date(c.certificateExpiryDate);
      const now = new Date();
      const diffTime = expiry.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 && diffDays < 30;
    }).length;

    return [
      { label: 'Assigned Cases', value: totalAssigned, key: 'ALL', desc: 'All active assignments' },
      { label: 'Pending Review', value: pendingReview, key: 'PENDING_REVIEW', desc: 'ASSIGNED, LAWYER_REVIEW' },
      { label: 'Clean Master Uploaded', value: cleanMasterUploaded, key: 'CLEAN_MASTER_UPLOADED', desc: 'Clean master v3.4' },
      { label: 'Waiting for Handshake', value: waitingCounterparty, key: 'AWAITING_COUNTERPARTY_APPROVAL', desc: 'Awaiting handshake' },
      { label: 'Sign Off Pending', value: signOffPending, key: 'LAWYER_SIGN_OFF_PENDING', desc: 'ILA checklist & signatures' },
      { label: 'ILA P1 Complete', value: ilaP1Complete, key: 'ILA_P1_COMPLETE', desc: 'Client 1 ILA issued' },
      { label: 'ILA P2 Complete', value: ilaP2Complete, key: 'ILA_P2_COMPLETE', desc: 'Client 2 ILA issued' },
      { label: 'Completed Cases', value: completed, key: 'COMPLETED', desc: 'COMPLETED, ARCHIVED' },
      { label: 'Cancelled Cases', value: cancelled, key: 'CANCELLED', desc: 'CANCELLED matters' },
      { label: 'Expiring Certificates', value: expiringCerts, key: 'EXPIRING', desc: 'Expiry < 30 days' },
    ];
  }, [assignedCases]);

  // Filter cases visible in list based on statusFilter selection
  const filteredCasesList = useMemo(() => {
    return assignedCases.filter((c) => {
      if (statusFilter === 'ALL') return c.status !== 'COMPLETED' && c.status !== 'ARCHIVED' && c.status !== 'CANCELLED';
      if (statusFilter === 'PENDING_REVIEW') return c.status === 'LAWYERS_ASSIGNED' || c.status === 'LAWYER_REVIEW';
      if (statusFilter === 'COMPLETED') return c.status === 'COMPLETED' || c.status === 'ARCHIVED';
      if (statusFilter === 'EXPIRING') {
        if (!c.certificateExpiryDate) return false;
        const expiry = new Date(c.certificateExpiryDate);
        const now = new Date();
        const diffTime = expiry.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 && diffDays < 30;
      }
      return c.status === statusFilter;
    });
  }, [assignedCases, statusFilter]);

  const getStatusBadgeStyle = (status: CaseStatus) => {
    switch (status) {
      case 'LAWYERS_ASSIGNED':
        return 'border border-amber-300 text-amber-800 bg-amber-50';
      case 'LAWYER_REVIEW':
        return 'border border-blue-300 text-blue-800 bg-blue-50';
      case 'CLEAN_MASTER_UPLOADED':
        return 'border border-indigo-300 text-indigo-800 bg-indigo-50';
      case 'AWAITING_COUNTERPARTY_APPROVAL':
        return 'border border-purple-300 text-purple-800 bg-purple-50 animate-pulse';
      case 'LAWYER_SIGN_OFF_PENDING':
        return 'border border-pink-300 text-pink-800 bg-pink-50';
      case 'ILA_P1_COMPLETE':
      case 'ILA_P2_COMPLETE':
        return 'border border-teal-300 text-teal-800 bg-teal-50';
      case 'COMPLETED':
        return 'border border-slate-300 text-slate-700 bg-slate-100';
      case 'CANCELLED':
        return 'border border-red-300 text-red-800 bg-red-50';
      case 'ARCHIVED':
        return 'border border-slate-200 text-slate-500 bg-slate-50';
      default:
        return 'border border-slate-200 text-slate-600 bg-slate-50';
    }
  };

  const formatStatus = (status: CaseStatus) => {
    return status.replace(/_/g, ' ');
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1280px]">
      {/* Metrics Section: 10 metrics grid */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">
          Dashboard Engine Metrics (LAWYER_PORTAL_V1.1 Specification)
        </h2>
        
        {/* Row 1: Metrics 1-5 */}
        <div className="grid grid-cols-5 gap-3.5">
          {metrics.slice(0, 5).map((m) => {
            const isSelected = statusFilter === m.key;
            return (
              <div
                key={m.key}
                onClick={() => onFilterChange(m.key)}
                className={`border rounded-xl p-4 cursor-pointer hover:shadow-md transition-all flex flex-col justify-between h-[96px] group active:scale-[0.98] ${
                  isSelected
                    ? 'bg-[#1b2947] border-[#1b2947] text-white'
                    : 'bg-white border-slate-300 text-slate-900 hover:border-slate-400'
                }`}
                title={m.desc}
              >
                <span className={`text-[9px] font-bold font-sans uppercase tracking-wider ${
                  isSelected ? 'text-slate-300' : 'text-slate-400 group-hover:text-slate-600'
                }`}>
                  {m.label}
                </span>
                <div className="text-2xl font-bold font-sans tracking-tight leading-none">
                  {m.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Row 2: Metrics 6-10 */}
        <div className="grid grid-cols-5 gap-3.5">
          {metrics.slice(5, 10).map((m) => {
            const isSelected = statusFilter === m.key;
            return (
              <div
                key={m.key}
                onClick={() => onFilterChange(m.key)}
                className={`border rounded-xl p-4 cursor-pointer hover:shadow-md transition-all flex flex-col justify-between h-[96px] group active:scale-[0.98] ${
                  isSelected
                    ? 'bg-[#1b2947] border-[#1b2947] text-white'
                    : 'bg-white border-slate-300 text-slate-900 hover:border-slate-400'
                }`}
                title={m.desc}
              >
                <span className={`text-[9px] font-bold font-sans uppercase tracking-wider ${
                  isSelected ? 'text-slate-300' : 'text-slate-400 group-hover:text-slate-600'
                }`}>
                  {m.label}
                </span>
                <div className="text-2xl font-bold font-sans tracking-tight leading-none">
                  {m.value}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cases queue section */}
      <div className="mt-2">
        <div className="text-[11px] font-bold font-sans uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
          <span>Active Assignments Queue ({filteredCasesList.length} Matters)</span>
          <span className="text-[10px] text-slate-400 font-normal">
            Currently logged in as: <strong className="text-slate-700 font-bold">{activeLawyer}</strong> ({activePersona})
          </span>
        </div>

        {filteredCasesList.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredCasesList.map((c) => {
              // Get the lawyer's client name
              const myClient = activePersona === 'L1' ? c.p1Name : c.p2Name;
              return (
                <div
                  key={c.id}
                  onClick={() => onSelectCase(c.id)}
                  className="bg-white border border-slate-300 rounded-xl p-5 cursor-pointer hover:shadow-md hover:border-slate-400 active:scale-[0.99] transition-all flex flex-col gap-3.5 group shadow-2xs"
                >
                  {/* Header: ID + Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-500 group-hover:text-slate-900 transition-colors">
                      {c.id}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getStatusBadgeStyle(c.status)}`}>
                      {formatStatus(c.status)}
                    </span>
                  </div>

                  {/* Client Info */}
                  <div>
                    <h3 className="text-sm font-semibold font-sans text-slate-900 tracking-tight">
                      {c.p1Name} &amp; {c.p2Name}
                    </h3>
                    <div className="text-[10px] text-slate-500 font-sans mt-1">
                      Your Client: <span className="font-bold text-slate-800">{myClient}</span>
                    </div>
                  </div>

                  {/* Footer: Service and Versions */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <span className="text-[9px] uppercase font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                      {c.service}
                    </span>
                    <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-500">
                      <span>L-Facing: {c.currentVersion}</span>
                      <span className="text-slate-300">|</span>
                      <span>C-Facing: {c.publishedVersion}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-slate-300 rounded-xl p-12 text-center text-slate-400 font-sans italic text-sm shadow-2xs">
            No matters found in this queue mapping. All workflows align with AGREEMENT_DOCUMENT_ENGINE_V1.1.
          </div>
        )}
      </div>
    </div>
  );
};
