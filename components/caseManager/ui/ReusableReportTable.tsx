"use client";

import React from 'react';
import { Eye, FileText } from 'lucide-react';
import { ReportColumnDef, ReportRowData } from '@/types/case-manager';

interface ReusableReportTableProps {
  columns: ReportColumnDef[];
  data: ReportRowData[];
  onViewRow: (row: ReportRowData) => void;
  reportTitle: string;
}

export const ReusableReportTable: React.FC<ReusableReportTableProps> = ({
  columns,
  data,
  onViewRow,
  reportTitle,
}) => {
  const renderCellContent = (col: ReportColumnDef, row: ReportRowData) => {
    const val = row[col.key];

    if (val === undefined || val === null || val === '') {
      return <span className="text-slate-400 italic text-[11px]">—</span>;
    }

    if (col.badgeType === 'status') {
      let badgeStyle = 'bg-slate-100 border-slate-300 text-slate-700';
      const strVal = String(val).toUpperCase();
      if (strVal.includes('CLOSED') || strVal.includes('EXECUTED') || strVal.includes('APPROVED')) {
        badgeStyle = 'bg-emerald-50 border-emerald-300 text-emerald-700';
      } else if (strVal.includes('REVIEW') || strVal.includes('PENDING')) {
        badgeStyle = 'bg-amber-50 border-amber-300 text-amber-800';
      } else if (strVal.includes('ESCALATED') || strVal.includes('CRITICAL') || strVal.includes('STUCK')) {
        badgeStyle = 'bg-rose-50 border-rose-300 text-rose-700';
      }

      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${badgeStyle}`}>
          {val}
        </span>
      );
    }

    if (col.badgeType === 'priority') {
      const strVal = String(val).toUpperCase();
      let badgeStyle = 'bg-slate-100 border-slate-300 text-slate-700';
      if (strVal === 'CRITICAL') {
        badgeStyle = 'bg-rose-100 border-rose-300 text-rose-800 font-bold';
      } else if (strVal === 'HIGH') {
        badgeStyle = 'bg-amber-100 border-amber-300 text-amber-800 font-bold';
      }
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] border uppercase tracking-wider ${badgeStyle}`}>
          {val}
        </span>
      );
    }

    if (col.badgeType === 'owner') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 border border-slate-300 text-slate-700 uppercase tracking-wider">
          OWNER: {val}
        </span>
      );
    }

    if (col.badgeType === 'sla') {
      const strVal = String(val).toUpperCase();
      const isOk = strVal.includes('PASSED') || strVal.includes('OPTIMAL') || strVal.includes('COMPLIANT') || strVal.includes('100%');
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${
            isOk
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-rose-50 border-rose-300 text-rose-800'
          }`}
        >
          {val}
        </span>
      );
    }

    // Default typography
    if (col.key.toLowerCase().includes('id') || col.key.toLowerCase().includes('code') || col.key.toLowerCase().includes('hash')) {
      return <span className="font-mono font-bold text-slate-900">{val}</span>;
    }

    return <span className="text-slate-800 font-medium">{val}</span>;
  };

  return (
    <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-xs flex flex-col">
      {/* Table Subheader */}
      <div className="px-6 py-3.5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-700" />
          <h3 className="text-xs font-bold font-sans text-slate-900 uppercase tracking-wider">
            {reportTitle}
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-slate-500 font-mono">
          {data.length} {data.length === 1 ? 'Record' : 'Records'} Generated
        </span>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-sans border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600 uppercase tracking-wider text-[10px] font-bold border-b border-slate-300">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`p-3.5 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                >
                  {col.label}
                </th>
              ))}
              <th className="p-3.5 text-right pr-6 min-w-[80px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, idx) => (
                <tr
                  key={row.id || row.caseId || idx}
                  className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`p-3.5 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                    >
                      {renderCellContent(col, row)}
                    </td>
                  ))}
                  <td className="p-3.5 text-right pr-6">
                    <button
                      onClick={() => onViewRow(row)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md border border-slate-300 font-bold text-[11px] inline-flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Inspect record details (Read-Only)"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="p-12 text-center text-slate-400 text-xs italic"
                >
                  No matching report records found for the selected filter parameters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-sans">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          <span>Enterprise Read-Only Mode &bull; Non-Modifiable Audit Ledger</span>
        </span>
        <span>Generated via endpoint `/cm/reports`</span>
      </div>
    </div>
  );
};
