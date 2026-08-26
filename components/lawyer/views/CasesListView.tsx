"use client";

import React, { useMemo, useState } from 'react';
import { Eye, RotateCcw, Filter } from 'lucide-react';
import { LawyerCase, LawyerPersona, CaseStatus } from '../../../types/lawyer-portal';

interface CasesListViewProps {
  cases: LawyerCase[];
  activePersona: LawyerPersona;
  onSelectCase: (caseId: string) => void;
  searchQuery: string;
  statusFilter: string;
  onFilterChange: (filter: string) => void;
}

export const CasesListView: React.FC<CasesListViewProps> = ({
  cases,
  activePersona,
  onSelectCase,
  searchQuery,
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
      if (activePersona === 'L1') {
        return c.p1Lawyer === activeLawyer;
      } else if (activePersona === 'L2') {
        return c.p2Lawyer === activeLawyer;
      } else {
        return c.p1Lawyer === activeLawyer || c.p2Lawyer === activeLawyer;
      }
    });
  }, [cases, activePersona, activeLawyer]);

  // Apply search query and status filter
  const filteredCases = useMemo(() => {
    return assignedCases.filter((c) => {
      // Exclude completed cases from active list unless COMPLETED or ALL is selected
      const isCompleted = c.status === 'CLOSED' || c.status === 'ARCHIVED';
      if (statusFilter !== 'COMPLETED' && statusFilter !== 'ALL' && isCompleted) return false;

      // Status filter
      if (statusFilter !== 'ALL') {
        if (statusFilter === 'ONBOARDING_PENDING' && c.status !== 'FORMS_LOCKED') return false;
        if (statusFilter === 'ONBOARDED' && 
            c.status !== 'LAWYER_REVIEW' && 
            c.status !== 'AWAITING_COUNTERPARTY_LAWYER_APPROVAL' && 
            c.status !== 'READY_FOR_SIGNING' && 
            c.status !== 'CLIENT_APPROVED' && 
            c.status !== 'ILA_P1_COMPLETE' && 
            c.status !== 'ILA_P2_COMPLETE' && 
            c.status !== 'CLIENT_APPROVAL_PENDING') return false;
        if (statusFilter === 'REVIEW_PENDING' && c.status !== 'LAWYER_REVIEW') return false;
        if (statusFilter === 'CLEAN_MASTER_UPLOAD_PENDING' && c.status !== 'AWAITING_COUNTERPARTY_LAWYER_APPROVAL') return false;
        if (statusFilter === 'SIGN_OFF_ILA_PENDING' && c.status !== 'READY_FOR_SIGNING' && c.status !== 'CLIENT_APPROVED' && c.status !== 'ILA_P1_COMPLETE' && c.status !== 'ILA_P2_COMPLETE') return false;
        if (statusFilter === 'COMPLETED' && !isCompleted) return false;
      }

      // Search query
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
  }, [assignedCases, statusFilter, searchQuery]);

  const handleResetFilters = () => {
    onFilterChange('ALL');
  };

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
      default:
        return 'border border-slate-200 text-slate-600 bg-slate-50';
    }
  };

  const formatStatus = (status: CaseStatus) => {
    switch (status) {
      case 'FORMS_LOCKED':
        return 'ONBOARDING PENDING';
      case 'LAWYER_REVIEW':
        return 'REVIEW PENDING';
      case 'AWAITING_COUNTERPARTY_LAWYER_APPROVAL':
        return 'CLEAN MASTER UPLOAD PENDING';
      case 'READY_FOR_SIGNING':
        return 'SIGN-OFF & ILA PENDING';
      case 'CLOSED':
        return 'COMPLETED';
      case 'CLIENT_APPROVAL_PENDING':
        return 'ONBOARDED';
      default:
        return status.replace(/_/g, ' ');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1280px]">
      {/* Filter Bar */}
      <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-bold font-sans text-slate-900 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-slate-700" />
            <span>Workflow Filters:</span>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold font-sans text-slate-400">
              State Routing status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => onFilterChange(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-sans outline-none focus:border-slate-400 cursor-pointer min-w-[180px]"
            >
              <option value="ALL">Total Cases</option>
              <option value="ONBOARDING_PENDING">Onboarding Pending</option>
              <option value="ONBOARDED">Onboarded</option>
              <option value="REVIEW_PENDING">Review Pending</option>
              <option value="CLEAN_MASTER_UPLOAD_PENDING">Clean Master Upload Pending</option>
              <option value="SIGN_OFF_ILA_PENDING">Sign-Off & ILA Pending</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleResetFilters}
          className="bg-slate-100 border border-slate-300 text-slate-800 hover:bg-slate-200 text-xs px-3.5 py-1.5 rounded-lg font-bold font-sans flex items-center gap-2 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Cases Table */}
      <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-base font-bold font-sans text-slate-900 tracking-tight">
            Assigned Active Matters ({filteredCases.length} Found)
          </h3>
        </div>

        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="bg-slate-100 text-slate-600 uppercase tracking-wider text-[10px] font-bold border-b border-slate-300">
              <th className="p-4 pl-6">Case Code</th>
              <th className="p-4">Client/Matter Name</th>
              <th className="p-4">Opposing Client</th>
              <th className="p-4">Action Status</th>
              <th className="p-4">Days in status</th>
              <th className="p-4">Last Activity</th>
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
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getStatusBadgeStyle(c.status)}`}>
                        {formatStatus(c.status)}
                      </span>
                    </td>
                    <td className="p-4">{c.daysInStatus} Days</td>
                    <td className="p-4">{c.lastActivity}</td>
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
                  No assigned matters found matching filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
