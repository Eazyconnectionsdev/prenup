"use client";

import React from 'react';
import { Eye, RotateCcw, Filter } from 'lucide-react';
import { CaseItem, FilterState } from '@/types/case-manager';

interface CasesMasterViewProps {
  cases: CaseItem[];
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, val: string) => void;
  onResetFilters: () => void;
  onSelectCase: (caseId: string) => void;
}

export const CasesMasterView: React.FC<CasesMasterViewProps> = ({
  cases,
  filters,
  onFilterChange,
  onResetFilters,
  onSelectCase,
}) => {
  return (
    <div className="flex flex-col gap-6 max-w-[1280px]">
      {/* Filter Bar (Section 18 Specification) */}
      <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-bold font-sans text-slate-900 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-slate-700" />
            <span>Section 18 Filter Groups:</span>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold font-sans text-slate-400">
              Backend Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-sans outline-none focus:border-slate-400 cursor-pointer min-w-[160px]"
            >
              <option value="ALL">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="CM_REVIEW">Awaiting Review</option>
              <option value="LAWYER_REVIEW">Legal Review</option>
              <option value="CLIENT_APPROVAL_PENDING">Awaiting Client</option>
              <option value="RETURNED_TO_LAWYERS">Returned To Lawyers</option>
              <option value="CLIENT_APPROVED">Awaiting ILA</option>
              <option value="READY_FOR_SIGNING">Ready For Signature</option>
              <option value="CLOSED">Executed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Case Health Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold font-sans text-slate-400">
              Case Health
            </label>
            <select
              value={filters.health}
              onChange={(e) => onFilterChange('health', e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-sans outline-none focus:border-slate-400 cursor-pointer min-w-[150px]"
            >
              <option value="ALL">All Health States</option>
              <option value="ESCALATED">Escalated</option>
              <option value="STUCK_7">Stuck &gt; 7 Days</option>
              <option value="STUCK_14">Stuck &gt; 14 Days</option>
              <option value="AWAITING_REVIEW">Awaiting Review</option>
              <option value="AWAITING_CLIENT">Awaiting Client</option>
              <option value="AWAITING_LAWYER">Awaiting Lawyer</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold font-sans text-slate-400">
              Payment Status
            </label>
            <select
              value={filters.payment}
              onChange={(e) => onFilterChange('payment', e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-sans outline-none focus:border-slate-400 cursor-pointer min-w-[130px]"
            >
              <option value="ALL">All Payments</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
              <option value="Chargeback">Chargeback</option>
            </select>
          </div>
        </div>

        <button
          onClick={onResetFilters}
          className="bg-slate-100 border border-slate-300 text-slate-800 hover:bg-slate-200 text-xs px-3.5 py-1.5 rounded-lg font-bold font-sans flex items-center gap-2 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Cases Master Table */}
      <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-base font-bold font-sans text-slate-900 tracking-tight">
            Master Cases Ledger ({cases.length} {cases.length === 1 ? 'Matter' : 'Matters'} Found)
          </h3>
        </div>

        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="bg-slate-100 text-slate-600 uppercase tracking-wider text-[10px] font-bold border-b border-slate-300">
              <th className="p-4 pl-6">Case Code</th>
              <th className="p-4">Couple Names</th>
              <th className="p-4">Action Status</th>
              <th className="p-4">Owner Role</th>
              <th className="p-4">Days in Status</th>
              <th className="p-4">Priority</th>
              <th className="p-4 pr-6">Inspect</th>
            </tr>
          </thead>
          <tbody>
            {cases.length > 0 ? (
              cases.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => onSelectCase(c.id)}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-all cursor-pointer text-slate-700"
                >
                  <td className="p-4 pl-6 font-mono font-bold text-slate-900">
                    {c.id}
                  </td>
                  <td className="p-4 font-semibold text-slate-900">
                    {c.p1} &amp; {c.p2}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="badge-rose-pill">{c.cmView}</span>
                      {c.actionLabel && c.actionLabel !== c.cmView && (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded leading-tight">
                          {c.actionLabel}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="badge-owner-pill">OWNER: {c.owner || 'CASE MANAGER'}</span>
                  </td>
                  <td className="p-4">{c.daysInStatus} Days</td>
                  <td className="p-4">
                    <span className={c.priority === 'CRITICAL' ? 'badge-priority-critical' : 'badge-priority-pill'}>
                      {c.priority || 'HIGH'}
                    </span>
                  </td>
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
                  No cases found matching the selected filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
