"use client";

import React, { useMemo, useState } from 'react';
import { LawyerCase, LawyerPersona, CaseStatus } from '../../../types/lawyer-portal';

interface DashboardViewProps {
  cases: LawyerCase[];
  activePersona: LawyerPersona;
  onSelectCase: (caseId: string) => void;
  statusFilter: string;
  onFilterChange: (filter: string) => void;
  onCardClick: (filter: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  cases,
  activePersona,
  onSelectCase,
  statusFilter,
  onFilterChange,
  onCardClick,
}) => {
  const [isOnboardedExpanded, setIsOnboardedExpanded] = useState(false);
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
      {/* Metrics Section: 4 metrics grid matching SS */}
      <div className="flex flex-col gap-4">
        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans">
          LAWYER DASHBOARD STATUS
        </h2>
        
        <div className="grid grid-cols-4 gap-5">
          {/* Card 1: TOTAL CASES */}
          <div 
            onClick={() => onCardClick('ALL')}
            className="bg-[#131e36] border border-[#1b2a47] rounded-xl p-6 flex flex-col justify-between h-[112px] shadow-xs cursor-pointer hover:bg-[#1b2947] hover:border-slate-500 transition-all"
          >
            <span className="text-[10px] font-bold font-sans uppercase tracking-wider text-slate-300">
              TOTAL CASES
            </span>
            <div className="text-3xl font-bold font-sans text-white tracking-tight leading-none">
              {assignedCases.length}
            </div>
          </div>

          {/* Card 2: ONBOARDING PENDING */}
          <div 
            onClick={() => onCardClick('ONBOARDING_PENDING')}
            className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between h-[112px] shadow-xs cursor-pointer hover:border-slate-300 hover:shadow-sm transition-all"
          >
            <span className="text-[10px] font-bold font-sans uppercase tracking-wider text-slate-400">
              ONBOARDING PENDING
            </span>
            <div className="text-3xl font-bold font-sans text-slate-800 tracking-tight leading-none">
              {assignedCases.filter(c => c.status === 'FORMS_LOCKED').length}
            </div>
          </div>

          {/* Card 3: ONBOARDED */}
          <div 
            onClick={() => setIsOnboardedExpanded(!isOnboardedExpanded)}
            className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between h-[112px] shadow-xs cursor-pointer hover:border-slate-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between text-[10px] font-bold font-sans uppercase tracking-wider text-slate-400">
              <span>ONBOARDED</span>
              <span className="text-slate-400 text-xs">
                {isOnboardedExpanded ? '▲' : '▼'}
              </span>
            </div>
            <div className="text-3xl font-bold font-sans text-slate-800 tracking-tight leading-none">
              {assignedCases.filter(c => c.status !== 'FORMS_LOCKED' && c.status !== 'CLOSED' && c.status !== 'ARCHIVED').length}
            </div>
          </div>

          {/* Card 4: COMPLETED */}
          <div 
            onClick={() => onCardClick('COMPLETED')}
            className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between h-[112px] shadow-xs cursor-pointer hover:border-slate-300 hover:shadow-sm transition-all"
          >
            <span className="text-[10px] font-bold font-sans uppercase tracking-wider text-slate-400">
              COMPLETED
            </span>
            <div className="text-3xl font-bold font-sans text-slate-800 tracking-tight leading-none">
              {assignedCases.filter(c => c.status === 'CLOSED' || c.status === 'ARCHIVED').length}
            </div>
          </div>
        </div>

        {isOnboardedExpanded && (
          <div className="flex justify-center gap-5 mt-4 transition-all duration-300 ease-in-out">
            {/* Sub-Card 1: Review Pending */}
            <div 
              onClick={() => onCardClick('REVIEW_PENDING')}
              className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between h-[104px] flex-1 max-w-[305px] w-full shadow-2xs hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
            >
              <span className="text-[10px] font-bold font-sans uppercase tracking-wider text-slate-400 leading-snug">
                Review Pending
              </span>
              <div className="text-2xl font-bold font-sans text-slate-800 tracking-tight leading-none">
                {assignedCases.filter(c => c.status === 'LAWYER_REVIEW').length}
              </div>
            </div>

            {/* Sub-Card 2: Clean Master Upload Pending */}
            <div 
              onClick={() => onCardClick('CLEAN_MASTER_UPLOAD_PENDING')}
              className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between h-[104px] flex-1 max-w-[305px] w-full shadow-2xs hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
            >
              <span className="text-[10px] font-bold font-sans uppercase tracking-wider text-slate-400 leading-snug">
                Clean Master Upload Pending
              </span>
              <div className="text-2xl font-bold font-sans text-slate-800 tracking-tight leading-none">
                {assignedCases.filter(c => c.status === 'AWAITING_COUNTERPARTY_LAWYER_APPROVAL').length}
              </div>
            </div>

            {/* Sub-Card 3: Sign-Off & ILA Pending */}
            <div 
              onClick={() => onCardClick('SIGN_OFF_ILA_PENDING')}
              className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between h-[104px] flex-1 max-w-[305px] w-full shadow-2xs hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
            >
              <span className="text-[10px] font-bold font-sans uppercase tracking-wider text-slate-400 leading-snug">
                Sign-Off & ILA Pending
              </span>
              <div className="text-2xl font-bold font-sans text-slate-800 tracking-tight leading-none">
                {assignedCases.filter(c => c.status === 'READY_FOR_SIGNING' || c.status === 'CLIENT_APPROVED' || c.status === 'ILA_P1_COMPLETE' || c.status === 'ILA_P2_COMPLETE').length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
