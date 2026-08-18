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
    // 1. Assigned Cases: All active assignments
    const totalAssigned = assignedCases.filter(c => c.status !== 'CLOSED' && c.status !== 'ARCHIVED').length;
    
    // 2. Pending Review: FORMS_LOCKED, LAWYER_REVIEW
    const pendingReview = assignedCases.filter(c => c.status === 'FORMS_LOCKED' || c.status === 'LAWYER_REVIEW').length;
    
    // 3. Waiting For Counterparty: AWAITING_COUNTERPARTY_LAWYER_APPROVAL
    const waitingCounterparty = assignedCases.filter(c => c.status === 'AWAITING_COUNTERPARTY_LAWYER_APPROVAL').length;
    
    // 4. Waiting For Client Approval: CLIENT_APPROVAL_PENDING
    const waitingClient = assignedCases.filter(c => c.status === 'CLIENT_APPROVAL_PENDING').length;
    
    // 5. Partially Approved: CLIENT_PARTIALLY_APPROVED
    const partiallyApproved = assignedCases.filter(c => c.status === 'CLIENT_PARTIALLY_APPROVED').length;
    
    // 6. Returned To Lawyers: RETURNED_TO_LAWYERS
    const returnedLawyers = assignedCases.filter(c => c.status === 'RETURNED_TO_LAWYERS').length;
    
    // 7. Ready For ILA: CLIENT_APPROVED
    const readyIla = assignedCases.filter(c => c.status === 'CLIENT_APPROVED').length;
    
    // 8. Ready For Signing: READY_FOR_SIGNING
    const readySigning = assignedCases.filter(c => c.status === 'READY_FOR_SIGNING').length;
    
    // 9. Completed Cases: CLOSED, ARCHIVED
    const completed = assignedCases.filter(c => c.status === 'CLOSED' || c.status === 'ARCHIVED').length;
    
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
      { label: 'Pending Review', value: pendingReview, key: 'PENDING_REVIEW', desc: 'FORMS_LOCKED, LAWYER_REVIEW' },
      { label: 'Waiting for Counterparty', value: waitingCounterparty, key: 'AWAITING_COUNTERPARTY_LAWYER_APPROVAL', desc: 'Awaiting opposing lawyer' },
      { label: 'Waiting for Client', value: waitingClient, key: 'CLIENT_APPROVAL_PENDING', desc: 'CLIENT_APPROVAL_PENDING' },
      { label: 'Partially Approved', value: partiallyApproved, key: 'CLIENT_PARTIALLY_APPROVED', desc: 'CLIENT_PARTIALLY_APPROVED' },
      { label: 'Returned to Lawyers', value: returnedLawyers, key: 'RETURNED_TO_LAWYERS', desc: 'RETURNED_TO_LAWYERS' },
      { label: 'Ready for ILA', value: readyIla, key: 'CLIENT_APPROVED', desc: 'CLIENT_APPROVED' },
      { label: 'Ready for Signing', value: readySigning, key: 'READY_FOR_SIGNING', desc: 'READY_FOR_SIGNING' },
      { label: 'Completed Cases', value: completed, key: 'COMPLETED', desc: 'CLOSED, ARCHIVED' },
      { label: 'Expiring Certificates', value: expiringCerts, key: 'EXPIRING', desc: 'Expiry < 30 days' },
    ];
  }, [assignedCases]);

  // Filter cases visible in list based on statusFilter selection
  const filteredCasesList = useMemo(() => {
    return assignedCases.filter((c) => {
      if (statusFilter === 'ALL') return c.status !== 'CLOSED' && c.status !== 'ARCHIVED';
      if (statusFilter === 'PENDING_REVIEW') return c.status === 'FORMS_LOCKED' || c.status === 'LAWYER_REVIEW';
      if (statusFilter === 'COMPLETED') return c.status === 'CLOSED' || c.status === 'ARCHIVED';
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
      case 'FORMS_LOCKED':
        return 'border border-amber-300 text-amber-800 bg-amber-50';
      case 'LAWYER_REVIEW':
        return 'border border-blue-300 text-blue-800 bg-blue-50';
      case 'AWAITING_COUNTERPARTY_LAWYER_APPROVAL':
        return 'border border-indigo-300 text-indigo-800 bg-indigo-50';
      case 'CLIENT_APPROVAL_PENDING':
        return 'border border-purple-300 text-purple-800 bg-purple-50';
      case 'CLIENT_PARTIALLY_APPROVED':
        return 'border border-pink-300 text-pink-800 bg-pink-50';
      case 'RETURNED_TO_LAWYERS':
        return 'border border-red-300 text-red-800 bg-red-50';
      case 'CLIENT_APPROVED':
        return 'border border-emerald-300 text-emerald-800 bg-emerald-50';
      case 'ILA_P1_COMPLETE':
      case 'ILA_P2_COMPLETE':
        return 'border border-teal-300 text-teal-800 bg-teal-50';
      case 'READY_FOR_SIGNING':
        return 'border border-green-300 text-green-800 bg-green-50 animate-pulse';
      case 'CLOSED':
        return 'border border-slate-300 text-slate-700 bg-slate-100';
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
