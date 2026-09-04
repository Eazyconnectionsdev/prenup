"use client";

import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  FileText,
  Filter,
  RefreshCw,
  Search,
  CheckCircle2,
  ShieldAlert,
  Clock,
  Layers,
  Building2,
  UserCheck
} from 'lucide-react';
import {
  CaseItem,
  ReportType,
  ReportFilterState,
  ReportColumnDef,
  ReportRowData
} from '@/types/case-manager';
import { ReusableReportTable } from '../ui/ReusableReportTable';
import { ReportDetailModal } from '../modals/ReportDetailModal';

interface ReportsViewProps {
  cases: CaseItem[];
  onLogApiCall?: (endpoint: string, method: string, payload: any) => void;
}

// 9 REPORT TYPE COLUMN DEFINITIONS
const REPORT_COLUMNS: Record<ReportType, ReportColumnDef[]> = {
  CASES: [
    { key: 'caseId', label: 'Case Code' },
    { key: 'couple', label: 'Couple Names' },
    { key: 'service', label: 'Service Tier' },
    { key: 'status', label: 'Current Status', badgeType: 'status' },
    { key: 'owner', label: 'Owner Role', badgeType: 'owner' },
    { key: 'firm', label: 'Primary Law Firm' },
    { key: 'createdDate', label: 'Created Date' },
    { key: 'priority', label: 'Priority', badgeType: 'priority' },
  ],
  LAWYER_ASSIGNMENT: [
    { key: 'caseId', label: 'Case Code' },
    { key: 'p1Details', label: 'P1 Client & Counsel' },
    { key: 'p2Details', label: 'P2 Client & Counsel' },
    { key: 'conflictCheck', label: 'Conflict Engine', badgeType: 'sla' },
    { key: 'assignmentDate', label: 'Assignment Date' },
    { key: 'status', label: 'Assignment Status', badgeType: 'status' },
  ],
  AWAITING_REVIEW: [
    { key: 'caseId', label: 'Case Code' },
    { key: 'couple', label: 'Couple Names' },
    { key: 'service', label: 'Service Tier' },
    { key: 'intakeDate', label: 'Intake Date' },
    { key: 'daysInReview', label: 'Days in CM Review' },
    { key: 'assignedCM', label: 'Assigned CM' },
    { key: 'slaTarget', label: 'SLA Status', badgeType: 'sla' },
  ],
  AWAITING_CLIENT: [
    { key: 'caseId', label: 'Case Code' },
    { key: 'couple', label: 'Couple Names' },
    { key: 'pendingParty', label: 'Pending Action Party' },
    { key: 'questionnaireStatus', label: 'Questionnaire State' },
    { key: 'daysPending', label: 'Days Pending' },
    { key: 'lastReminder', label: 'Last Reminder Date' },
    { key: 'priority', label: 'Priority', badgeType: 'priority' },
  ],
  AWAITING_SIGNATURE: [
    { key: 'caseId', label: 'Case Code' },
    { key: 'couple', label: 'Couple Names' },
    { key: 'version', label: 'Agreement Version' },
    { key: 'p1Ila', label: 'P1 ILA Certificate', badgeType: 'sla' },
    { key: 'p2Ila', label: 'P2 ILA Certificate', badgeType: 'sla' },
    { key: 'readyDate', label: 'Ready Date' },
    { key: 'status', label: 'Execution Status', badgeType: 'status' },
  ],
  ESCALATION: [
    { key: 'caseId', label: 'Case Code' },
    { key: 'couple', label: 'Couple Names' },
    { key: 'escalationReason', label: 'Escalation Trigger' },
    { key: 'daysActive', label: 'Days Escalated' },
    { key: 'priority', label: 'Severity', badgeType: 'priority' },
    { key: 'assignedOwner', label: 'Assigned Owner', badgeType: 'owner' },
    { key: 'weddingUrgency', label: 'Wedding Urgency', badgeType: 'sla' },
  ],
  STUCK_CASES: [
    { key: 'caseId', label: 'Case Code' },
    { key: 'couple', label: 'Couple Names' },
    { key: 'stuckStage', label: 'Stuck Stage' },
    { key: 'daysStuck', label: 'Days Exceeded' },
    { key: 'slaThreshold', label: 'SLA Limit' },
    { key: 'riskRating', label: 'Risk Rating', badgeType: 'priority' },
    { key: 'owner', label: 'Current Owner', badgeType: 'owner' },
  ],
  CAPACITY: [
    { key: 'firmName', label: 'Law Firm / Counsel' },
    { key: 'activeMatters', label: 'Active Matters' },
    { key: 'completedMatters', label: 'Completed Cases' },
    { key: 'avgTurnaround', label: 'Avg Turnaround' },
    { key: 'slaCompliance', label: 'SLA Rate', badgeType: 'sla' },
    { key: 'availability', label: 'Availability', badgeType: 'status' },
  ],
  EXECUTION: [
    { key: 'caseId', label: 'Case Code' },
    { key: 'couple', label: 'Couple Names' },
    { key: 'executedDate', label: 'Execution Date' },
    { key: 'p1Firm', label: 'P1 Counsel Firm' },
    { key: 'p2Firm', label: 'P2 Counsel Firm' },
    { key: 'vaultHash', label: 'Vault Storage Hash' },
    { key: 'bindingStatus', label: 'Legal Status', badgeType: 'sla' },
  ],
};

const REPORT_TITLES: Record<ReportType, string> = {
  CASES: '1. Cases Report (Master Ledger)',
  LAWYER_ASSIGNMENT: '2. Lawyer Assignment Matrix Report',
  AWAITING_REVIEW: '3. Awaiting Review Bottleneck Report',
  AWAITING_CLIENT: '4. Awaiting Client Action Report',
  AWAITING_SIGNATURE: '5. Awaiting Signature & ILA Report',
  ESCALATION: '6. Escalation & Admin Override Report',
  STUCK_CASES: '7. Stuck Cases & SLA Exception Report',
  CAPACITY: '8. Firm Capacity & Workload Allocation Report',
  EXECUTION: '9. Executed Contracts & Vault Audit Report',
};

export const ReportsView: React.FC<ReportsViewProps> = ({ cases, onLogApiCall }) => {
  const [filters, setFilters] = useState<ReportFilterState>({
    reportType: 'CASES',
    dateRange: 'ALL',
    status: 'ALL',
    lawFirm: 'ALL',
    lawyer: 'ALL',
    priority: 'ALL',
  });

  const [activeReportData, setActiveReportData] = useState<{
    reportType: ReportType;
    rows: ReportRowData[];
    generatedAt: string;
  }>({
    reportType: 'CASES',
    rows: [],
    generatedAt: new Date().toLocaleTimeString(),
  });

  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [inspectRow, setInspectRow] = useState<ReportRowData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // LIST OF LAW FIRMS & LAWYERS FOR TOP FILTERS
  const lawFirmsList = useMemo(() => {
    const firms = new Set<string>();
    cases.forEach((c) => {
      if (c.p1Firm) firms.add(c.p1Firm);
      if (c.p2Firm) firms.add(c.p2Firm);
    });
    return Array.from(firms);
  }, [cases]);

  const lawyersList = useMemo(() => {
    const lawyers = new Set<string>();
    cases.forEach((c) => {
      if (c.p1Lawyer) lawyers.add(c.p1Lawyer);
      if (c.p2Lawyer) lawyers.add(c.p2Lawyer);
    });
    return Array.from(lawyers);
  }, [cases]);

  const handleFilterChange = (key: keyof ReportFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      reportType: 'CASES',
      dateRange: 'ALL',
      status: 'ALL',
      lawFirm: 'ALL',
      lawyer: 'ALL',
      priority: 'ALL',
    });
    setIsGenerated(false);
  };

  // GENERATE REPORT DATA BASED ON SELECTED REPORT TYPE AND FILTERS
  const handleGenerateReport = () => {
    const filteredCases = cases.filter((c) => {
      if (filters.status !== 'ALL' && c.backendState !== filters.status) return false;
      if (filters.priority !== 'ALL' && c.priority !== filters.priority) return false;
      if (filters.lawFirm !== 'ALL' && c.p1Firm !== filters.lawFirm && c.p2Firm !== filters.lawFirm) return false;
      if (filters.lawyer !== 'ALL' && c.p1Lawyer !== filters.lawyer && c.p2Lawyer !== filters.lawyer) return false;
      return true;
    });

    let formattedRows: ReportRowData[] = [];

    switch (filters.reportType) {
      case 'CASES':
        formattedRows = filteredCases.map((c) => ({
          caseId: c.id,
          couple: `${c.p1} & ${c.p2}`,
          service: c.service,
          status: c.cmView,
          owner: c.owner,
          firm: `${c.p1Firm} / ${c.p2Firm}`,
          createdDate: c.createdDate,
          priority: c.priority,
        }));
        break;

      case 'LAWYER_ASSIGNMENT':
        formattedRows = filteredCases.map((c) => ({
          caseId: c.id,
          p1Details: `${c.p1} (${c.p1Lawyer} - ${c.p1Firm})`,
          p2Details: `${c.p2} (${c.p2Lawyer} - ${c.p2Firm})`,
          conflictCheck: 'RULE_1 VERIFIED',
          assignmentDate: c.createdDate,
          status: c.backendState === 'CM_REVIEW' ? 'Pending Counsel' : 'Assigned Dual Counsel',
        }));
        break;

      case 'AWAITING_REVIEW':
        formattedRows = filteredCases
          .filter((c) => c.backendState === 'CM_REVIEW' || c.cmView.includes('Review'))
          .map((c) => ({
            caseId: c.id,
            couple: `${c.p1} & ${c.p2}`,
            service: c.service,
            intakeDate: c.createdDate,
            daysInReview: `${c.daysInStatus} Days`,
            assignedCM: 'Sarah Jenkins',
            slaTarget: c.daysInStatus <= 3 ? 'PASSED SLA' : 'SLA DELAYED',
          }));
        break;

      case 'AWAITING_CLIENT':
        formattedRows = filteredCases
          .filter((c) => c.backendState === 'CLIENT_APPROVAL_PENDING' || c.owner === 'CLIENT')
          .map((c) => ({
            caseId: c.id,
            couple: `${c.p1} & ${c.p2}`,
            pendingParty: 'Party 1 & Party 2 Approval',
            questionnaireStatus: 'Locked (Rule 2 Enforced)',
            daysPending: `${c.daysInStatus} Days`,
            lastReminder: c.lastActivity,
            priority: c.priority,
          }));
        break;

      case 'AWAITING_SIGNATURE':
        formattedRows = filteredCases
          .filter((c) => c.backendState === 'READY_FOR_SIGNING' || c.backendState === 'CLIENT_APPROVED' || c.cmView.includes('Signature'))
          .map((c) => ({
            caseId: c.id,
            couple: `${c.p1} & ${c.p2}`,
            version: c.version,
            p1Ila: 'Verified Certificate Attached',
            p2Ila: 'Verified Certificate Attached',
            readyDate: c.lastActivity,
            status: c.cmView,
          }));
        break;

      case 'ESCALATION':
        formattedRows = filteredCases
          .filter((c) => c.health === 'ESCALATED' || c.priority === 'CRITICAL' || c.actionLabel.includes('< 21') || c.actionLabel.includes('Complaint'))
          .map((c) => ({
            caseId: c.id,
            couple: `${c.p1} & ${c.p2}`,
            escalationReason: c.actionLabel || 'Rule 5 Escalation Threshold Triggered',
            daysActive: `${c.daysInStatus} Days`,
            priority: c.priority,
            assignedOwner: c.owner,
            weddingUrgency: c.actionLabel.includes('21 Days') ? 'URGENT < 21 DAYS' : 'STANDARD TIMELINE',
          }));
        break;

      case 'STUCK_CASES':
        formattedRows = filteredCases
          .filter((c) => c.health === 'STUCK_7' || c.health === 'STUCK_14' || c.daysInStatus > 5)
          .map((c) => ({
            caseId: c.id,
            couple: `${c.p1} & ${c.p2}`,
            stuckStage: c.cmView,
            daysStuck: `${c.daysInStatus} Days`,
            slaThreshold: '14 Days Threshold',
            riskRating: c.daysInStatus > 10 ? 'CRITICAL' : 'HIGH',
            owner: c.owner,
          }));
        break;

      case 'CAPACITY':
        {
          const firmStatsMap: Record<string, { active: number; completed: number; avgDays: number }> = {};
          cases.forEach((c) => {
            [c.p1Firm, c.p2Firm].forEach((f) => {
              if (!f) return;
              if (!firmStatsMap[f]) firmStatsMap[f] = { active: 0, completed: 0, avgDays: 4 };
              if (c.backendState === 'CLOSED' || c.backendState === 'ARCHIVED') {
                firmStatsMap[f].completed += 1;
              } else {
                firmStatsMap[f].active += 1;
              }
            });
          });

          formattedRows = Object.entries(firmStatsMap).map(([firmName, stats]) => ({
            firmName,
            activeMatters: stats.active,
            completedMatters: stats.completed,
            avgTurnaround: `${stats.avgDays} Business Days`,
            slaCompliance: '98.5% OPTIMAL',
            availability: stats.active < 4 ? 'AVAILABLE' : 'NEAR CAPACITY',
          }));
        }
        break;

      case 'EXECUTION':
        formattedRows = filteredCases
          .filter((c) => c.backendState === 'CLOSED' || c.backendState === 'ARCHIVED' || c.cmView === 'Executed')
          .map((c) => ({
            caseId: c.id,
            couple: `${c.p1} & ${c.p2}`,
            executedDate: c.lastActivity,
            p1Firm: c.p1Firm,
            p2Firm: c.p2Firm,
            vaultHash: `0x9F82A...${c.id}`,
            bindingStatus: 'BINDING ARCHIVE',
          }));
        break;
    }

    setActiveReportData({
      reportType: filters.reportType,
      rows: formattedRows,
      generatedAt: new Date().toLocaleTimeString(),
    });
    setIsGenerated(true);

    if (onLogApiCall) {
      onLogApiCall('/cm/reports', 'GET', {
        reportType: filters.reportType,
        filters,
        totalRecords: formattedRows.length,
      });
    }
  };

  // EXPORT CSV
  const handleExportCSV = () => {
    if (activeReportData.rows.length === 0) return;

    const cols = REPORT_COLUMNS[activeReportData.reportType];
    const headers = cols.map((c) => `"${c.label}"`).join(',');
    const rowsCsv = activeReportData.rows.map((row) =>
      cols.map((c) => `"${String(row[c.key] || '').replace(/"/g, '""')}"`).join(',')
    );

    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rowsCsv.join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeReportData.reportType.toLowerCase()}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // EXPORT PDF / PRINT
  const handlePrintReport = () => {
    window.print();
  };

  const handleInspectRow = (row: ReportRowData) => {
    setInspectRow(row);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1280px] font-sans">
      {/* Enterprise Header Banner */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-6 shadow-md flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold tracking-tight text-white">
              Operational Reporting Engine &bull; Enterprise SaaS Console
            </h2>
          </div>
          <p className="text-xs text-slate-300 font-medium max-w-[720px] leading-relaxed">
            Read-Only Audit & Operational Intelligence. Select parameters below and click <strong className="text-white">Generate Report</strong> to query the unified reporting endpoint <code className="bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded text-[11px] font-mono">/cm/reports</code>.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 px-3.5 py-2 rounded-lg text-xs font-mono font-semibold text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>ENDPOINT: /cm/reports</span>
        </div>
      </div>

      {/* Enterprise Top Filter Toolbar */}
      <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
            <Filter className="w-4 h-4 text-slate-700" />
            <span>Enterprise Query Filters &amp; Report Selector</span>
          </div>
          <button
            onClick={handleResetFilters}
            className="text-slate-600 hover:text-slate-900 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>

        <div className="grid grid-cols-6 gap-3.5">
          {/* 1. Report Type Dropdown */}
          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              1. Select Report Type <span className="text-rose-500">*</span>
            </label>
            <select
              value={filters.reportType}
              onChange={(e) => handleFilterChange('reportType', e.target.value as ReportType)}
              className="bg-slate-50 border border-slate-300 text-slate-900 font-bold px-3 py-2 rounded-lg text-xs outline-none focus:border-slate-500 cursor-pointer"
            >
              <option value="CASES">Cases Report (Master Ledger)</option>
              <option value="LAWYER_ASSIGNMENT">Lawyer Assignment Report</option>
              <option value="AWAITING_REVIEW">Awaiting Review Report</option>
              <option value="AWAITING_CLIENT">Awaiting Client Report</option>
              <option value="AWAITING_SIGNATURE">Awaiting Signature Report</option>
              <option value="ESCALATION">Escalation Report</option>
              <option value="STUCK_CASES">Stuck Cases Report</option>
              <option value="CAPACITY">Capacity Report</option>
              <option value="EXECUTION">Execution Report</option>
            </select>
          </div>

          {/* 2. Date Range */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              2. Date Range
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 px-3 py-2 rounded-lg text-xs outline-none focus:border-slate-400 cursor-pointer"
            >
              <option value="ALL">All Time</option>
              <option value="7D">Last 7 Days</option>
              <option value="30D">Last 30 Days</option>
              <option value="90D">Last 90 Days</option>
              <option value="YTD">This Year (YTD)</option>
            </select>
          </div>

          {/* 3. Status */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              3. Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 px-3 py-2 rounded-lg text-xs outline-none focus:border-slate-400 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="CM_REVIEW">CM Review</option>
              <option value="LAWYER_REVIEW">Legal Review</option>
              <option value="CLIENT_APPROVAL_PENDING">Awaiting Client</option>
              <option value="RETURNED_TO_LAWYERS">Returned To Lawyers</option>
              <option value="CLIENT_APPROVED">Awaiting ILA</option>
              <option value="READY_FOR_SIGNING">Ready For Signature</option>
              <option value="CLOSED">Executed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          {/* 4. Law Firm */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              4. Law Firm
            </label>
            <select
              value={filters.lawFirm}
              onChange={(e) => handleFilterChange('lawFirm', e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 px-3 py-2 rounded-lg text-xs outline-none focus:border-slate-400 cursor-pointer"
            >
              <option value="ALL">All Law Firms</option>
              {lawFirmsList.map((firm) => (
                <option key={firm} value={firm}>
                  {firm}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Lawyer & Generate Action */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              5. Priority
            </label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 px-3 py-2 rounded-lg text-xs outline-none focus:border-slate-400 cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        {/* Generate Report Button Bar */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 italic">
            Clicking Generate Report will query <code className="font-mono font-bold text-slate-700">GET /cm/reports?reportType={filters.reportType}</code>
          </span>

          <button
            onClick={handleGenerateReport}
            className="bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white text-xs px-5 py-2.5 rounded-lg font-bold font-sans flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Report Results Container */}
      {isGenerated ? (
        <div className="flex flex-col gap-4">
          {/* Top Export Toolbar */}
          <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>{REPORT_TITLES[activeReportData.reportType]}</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Active Report
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                Generated at {activeReportData.generatedAt} &bull; Read-Only Enterprise Output
              </p>
            </div>

            {/* Export & Action Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleExportCSV}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-3.5 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={handlePrintReport}
                className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs px-3.5 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Export PDF / Print</span>
              </button>
            </div>
          </div>

          {/* Reusable Data Table Component */}
          <ReusableReportTable
            columns={REPORT_COLUMNS[activeReportData.reportType]}
            data={activeReportData.rows}
            onViewRow={handleInspectRow}
            reportTitle={REPORT_TITLES[activeReportData.reportType]}
          />
        </div>
      ) : (
        /* Empty State Prompt */
        <div className="bg-white border border-dashed border-slate-300 rounded-xl p-14 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 font-sans">
              No Report Generated Yet
            </h4>
            <p className="text-xs text-slate-500 max-w-[420px] font-sans mt-1">
              Select your desired <strong>Report Type</strong> and query parameters above, then click <strong className="text-slate-900">Generate Report</strong> to fetch the read-only enterprise data table.
            </p>
          </div>
        </div>
      )}

      {/* Read-Only Inspection Modal */}
      <ReportDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        row={inspectRow}
        reportTitle={REPORT_TITLES[activeReportData.reportType]}
      />
    </div>
  );
};
