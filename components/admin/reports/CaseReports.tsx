"use client";

import React, { useMemo, useState } from "react";
import {
  Badge,
  CaseLink,
  Column,
  DataTable,
  ErrorBox,
  fetchAllRows,
  FilterBar,
  FilterField,
  Filters,
  fmtDate,
  fmtDays,
  Note,
  PercentBar,
  ReportOptions,
  ReportTabs,
  SERVICE_TYPES,
  StatTile,
  useReport,
} from "./ReportKit";

const REPORTS = [
  { key: "status", label: "Total Cases", endpoint: "cases/status-summary" },
  { key: "progress", label: "Case Status & Progress", endpoint: "cases/status-summary" },
  { key: "cm", label: "Case Manager Workload", endpoint: "cases/case-manager-workload" },
  { key: "firm", label: "Law Firm Workload", endpoint: "cases/firm-workload" },
  { key: "lawyer", label: "Lawyer Workload", endpoint: "cases/lawyer-workload" },
  { key: "funnel", label: "Conversion Funnel", endpoint: "cases/funnel" },
  { key: "time", label: "Processing Time", endpoint: "cases/processing-time" },
  { key: "overdue", label: "Pending / Overdue", endpoint: "cases/pending-overdue" },
];

const DEFAULTS: Filters = { range: "all", service: "all", status: "all", caseManager: "all", firm: "all", page: "1", pageSize: "25" };

const TERMINAL = ["COMPLETED", "ARCHIVED", "CANCELLED"];

export const CaseReports: React.FC<{ options: ReportOptions | null }> = ({ options }) => {
  const [active, setActive] = useState("status");
  const [filters, setFilters] = useState<Filters>(DEFAULTS);
  const report = REPORTS.find((r) => r.key === active)!;
  const { data, loading, error, reload } = useReport<any>(report.endpoint, filters);

  const fields: FilterField[] = useMemo(() => {
    const f: FilterField[] = [
      { key: "range", label: "Registered", type: "range" },
      { key: "service", label: "Service Type", type: "select", options: SERVICE_TYPES },
      {
        key: "status",
        label: "Case Status",
        type: "select",
        options: [{ value: "all", label: "All statuses" }, ...(options?.statuses ?? [])],
      },
      {
        key: "caseManager",
        label: "Case Manager",
        type: "select",
        options: [
          { value: "all", label: "All case managers" },
          { value: "unassigned", label: "Unassigned" },
          ...(options?.caseManagers ?? []).map((c) => ({ value: c.id, label: c.name || c.email })),
        ],
      },
      {
        key: "firm",
        label: "Company / Law Firm",
        type: "select",
        options: [{ value: "all", label: "All firms" }, ...(options?.firms ?? []).map((c) => ({ value: c.id, label: c.name }))],
      },
    ];
    if (active === "overdue") {
      f.push({
        key: "overdue",
        label: "Overdue Status",
        type: "select",
        options: [
          { value: "all", label: "All pending" },
          { value: "overdue", label: "Overdue only" },
          { value: "on_track", label: "On track only" },
        ],
      });
      f.push({ key: "caseId", label: "Case ID", type: "text", placeholder: "CASE-2026-…" });
    }
    return f;
  }, [options, active]);

  const changeReport = (k: string) => {
    setActive(k);
    setFilters((f) => ({ ...f, page: "1" }));
  };

  return (
    <div className="space-y-4">
      <ReportTabs items={REPORTS} active={active} onChange={changeReport} />
      <FilterBar fields={fields} filters={filters} onChange={setFilters} onReset={() => setFilters(DEFAULTS)} onRefresh={reload} loading={loading} />
      {error && <ErrorBox message={error} onRetry={reload} />}
      {data && !error && (
        <>
          {(active === "status" || active === "progress") && <StatusReport data={data} withProgress={active === "progress"} loading={loading} />}
          {active === "cm" && <CmWorkload data={data} loading={loading} />}
          {active === "firm" && <FirmWorkload data={data} loading={loading} />}
          {active === "lawyer" && <LawyerWorkload data={data} loading={loading} />}
          {active === "funnel" && <Funnel data={data} loading={loading} />}
          {active === "time" && <ProcessingTime data={data} loading={loading} />}
          {active === "overdue" && (
            <Overdue data={data} loading={loading} filters={filters} onPage={(p) => setFilters({ ...filters, page: String(p) })} />
          )}
        </>
      )}
    </div>
  );
};

// ── 1 & 2 ──

const StatusReport: React.FC<{ data: any; withProgress: boolean; loading: boolean }> = ({ data, withProgress, loading }) => {
  const rows = (data.rows as any[]).map((r) => ({ ...r, id: r.status }));
  const cols: Column<any>[] = [
    { key: "label", label: "Status", render: (r) => <span className="font-semibold text-slate-800">{r.label}</span> },
    { key: "count", label: "Total Cases", align: "right" },
  ];
  if (withProgress) {
    cols.push({ key: "percent", label: "% of Cases", render: (r) => <PercentBar value={r.percent} />, csv: (r) => r.percent });
  }
  const done = rows.filter((r) => ["COMPLETED", "ARCHIVED"].includes(r.status)).reduce((s, r) => s + r.count, 0);
  const cancelled = rows.find((r) => r.status === "CANCELLED")?.count ?? 0;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile label="Total Cases" value={data.total} />
        <StatTile label="In Progress" value={data.active} />
        <StatTile label="Completed" value={done} tone="good" hint={data.total ? `${Math.round((done / data.total) * 1000) / 10}% of cases` : undefined} />
        <StatTile label="Cancelled" value={cancelled} tone={cancelled ? "bad" : "default"} />
      </div>
      <DataTable
        title={withProgress ? "Case Status & Progress" : "Total Cases by Status"}
        columns={cols}
        rows={rows}
        loading={loading}
        exportName={withProgress ? "case-status-progress" : "total-cases"}
        footer={
          <tfoot>
            <tr className="bg-slate-50 border-t border-slate-200 font-bold text-slate-800">
              <td className="py-2.5 px-4">Total</td>
              <td className="py-2.5 px-4 text-right tabular-nums">{data.total}</td>
              {withProgress && <td className="py-2.5 px-4">100%</td>}
            </tr>
          </tfoot>
        }
      />
    </div>
  );
};

// ── 3, 4, 5 ──

const CmWorkload: React.FC<{ data: any; loading: boolean }> = ({ data, loading }) => (
  <div className="space-y-3">
    {data.unassignedInProgress > 0 && (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
        {data.unassignedInProgress} submitted {data.unassignedInProgress === 1 ? "case has" : "cases have"} no case manager yet.
      </div>
    )}
    <DataTable
      title="Case Manager Workload"
      rows={data.rows}
      loading={loading}
      exportName="case-manager-workload"
      columns={[
        {
          key: "name",
          label: "Case Manager",
          render: (r: any) => (
            <div>
              <div className="font-semibold text-slate-800">{r.name || r.email}</div>
              <div className="text-[11px] text-slate-400">{r.email}</div>
            </div>
          ),
        },
        { key: "active", label: "Account", render: (r: any) => (r.active ? <Badge tone="green">Active</Badge> : <Badge>Inactive</Badge>), csv: (r: any) => (r.active ? "Active" : "Inactive") },
        { key: "assigned", label: "Assigned Cases", align: "right" },
        { key: "inProgress", label: "In Progress", align: "right" },
        { key: "completed", label: "Completed", align: "right" },
        { key: "cancelled", label: "Cancelled", align: "right" },
      ]}
    />
    <Note>Completed = case completed or archived. In progress = every other assigned case that is not cancelled.</Note>
  </div>
);

const FirmWorkload: React.FC<{ data: any; loading: boolean }> = ({ data, loading }) => (
  <div className="space-y-3">
    <DataTable
      title="Company / Law Firm Workload"
      rows={data.rows}
      loading={loading}
      exportName="law-firm-workload"
      columns={[
        { key: "name", label: "Company / Law Firm", render: (r: any) => <span className="font-semibold text-slate-800">{r.name}</span> },
        { key: "assigned", label: "Assigned Cases", align: "right" },
        { key: "completed", label: "Completed", align: "right" },
        { key: "pending", label: "Pending", align: "right" },
        { key: "cancelled", label: "Cancelled", align: "right" },
      ]}
    />
    <Note>A case counts once per firm, even when both applicants&apos; solicitors are from the same firm. Completed = lawyer sign-off done or case completed.</Note>
  </div>
);

const LawyerWorkload: React.FC<{ data: any; loading: boolean }> = ({ data, loading }) => (
  <div className="space-y-3">
    <DataTable
      title="Individual Lawyer Workload"
      rows={data.rows}
      loading={loading}
      exportName="lawyer-workload"
      columns={[
        { key: "name", label: "Lawyer", render: (r: any) => <span className="font-semibold text-slate-800">{r.name}</span> },
        { key: "firm", label: "Company / Law Firm" },
        { key: "assigned", label: "Assigned", align: "right" },
        { key: "completed", label: "Completed", align: "right" },
        { key: "pending", label: "Pending", align: "right" },
        { key: "cancelled", label: "Cancelled", align: "right" },
      ]}
    />
    <Note>Each case side counts separately. Completed = the lawyer has signed off their client&apos;s side, or the case is complete.</Note>
  </div>
);

// ── 6 ──

const Funnel: React.FC<{ data: any; loading: boolean }> = ({ data, loading }) => (
  <div className="space-y-3">
    <DataTable
      title="Conversion Funnel"
      rows={(data.steps as any[]).map((s) => ({ ...s, id: s.key }))}
      loading={loading}
      exportName="conversion-funnel"
      columns={[
        { key: "label", label: "Stage", render: (r: any) => <span className="font-semibold text-slate-800">{r.label}</span> },
        { key: "count", label: "Cases", align: "right" },
        { key: "percentOfRegistered", label: "% of Registered", render: (r: any) => <PercentBar value={r.percentOfRegistered} />, csv: (r: any) => r.percentOfRegistered },
        { key: "percentOfPrevious", label: "% from Previous Stage", align: "right", render: (r: any) => `${r.percentOfPrevious}%`, csv: (r: any) => r.percentOfPrevious },
        { key: "dropOff", label: "Drop-off", align: "right" },
      ]}
    />
    <Note>Each stage counts cases that reached it, so later stages are always a subset of earlier ones. Cases set aside because the owner joined their partner&apos;s case are excluded.</Note>
  </div>
);

// ── 7 ──

const ProcessingTime: React.FC<{ data: any; loading: boolean }> = ({ data, loading }) => (
  <div className="space-y-3">
    <DataTable
      title="Case Processing Time"
      rows={(data.rows as any[]).map((r) => ({ ...r, id: r.label }))}
      loading={loading}
      exportName="case-processing-time"
      columns={[
        { key: "label", label: "Stage", render: (r: any) => <span className={r.total ? "font-bold text-slate-900" : "font-semibold text-slate-800"}>{r.label}</span> },
        { key: "averageDays", label: "Average Time", align: "right", render: (r: any) => fmtDays(r.averageDays), csv: (r: any) => r.averageDays },
        { key: "medianDays", label: "Median", align: "right", render: (r: any) => fmtDays(r.medianDays), csv: (r: any) => r.medianDays },
        { key: "minDays", label: "Fastest", align: "right", render: (r: any) => fmtDays(r.minDays), csv: (r: any) => r.minDays },
        { key: "maxDays", label: "Slowest", align: "right", render: (r: any) => fmtDays(r.maxDays), csv: (r: any) => r.maxDays },
        { key: "cases", label: "Cases Measured", align: "right" },
      ]}
    />
    <Note>
      Times use the date each case entered a stage. Cases from before stage history was recorded only count where the case already stored
      that date, so earlier stages can have fewer measured cases.
    </Note>
  </div>
);

// ── 8 ──

const Overdue: React.FC<{ data: any; loading: boolean; filters: Filters; onPage: (p: number) => void }> = ({ data, loading, filters, onPage }) => {
  const cols: Column<any>[] = [
    { key: "caseNumber", label: "Case ID", render: (r) => <CaseLink id={r.caseId} label={r.caseNumber} /> },
    { key: "currentStage", label: "Current Stage" },
    { key: "currentStatus", label: "Current Status" },
    { key: "assignedCaseManager", label: "Assigned CM" },
    { key: "applicant1Solicitor", label: "Applicant 1 Solicitor" },
    { key: "applicant2Solicitor", label: "Applicant 2 Solicitor" },
    { key: "responsibleParty", label: "Current Responsible Party", className: "min-w-[180px]" },
    {
      key: "daysInStage",
      label: "Days in Current Stage",
      align: "right",
      render: (r) => (
        <span title={`Entered ${fmtDate(r.enteredStageAt)} · limit ${r.slaDays} days`}>
          {r.daysInStage} <span className="text-slate-400">/ {r.slaDays}</span>
        </span>
      ),
      csv: (r) => r.daysInStage,
    },
    {
      key: "overdueStatus",
      label: "Overdue Status",
      render: (r) => (r.overdue ? <Badge tone="red">Overdue +{r.daysOverdue}d</Badge> : <Badge tone="green">On Track</Badge>),
      csv: (r) => r.overdueStatus,
    },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <StatTile label="Pending Cases" value={data.summary.pending} />
        <StatTile label="Overdue" value={data.summary.overdue} tone={data.summary.overdue ? "bad" : "default"} />
        <StatTile label="On Track" value={data.summary.onTrack} tone="good" />
      </div>
      <DataTable
        title="Pending / Overdue Cases"
        columns={cols}
        rows={data.rows}
        loading={loading}
        total={data.total}
        page={data.page}
        pageSize={data.pageSize}
        onPage={onPage}
        exportName="pending-overdue-cases"
        exportAll={() => fetchAllRows("cases/pending-overdue", filters)}
      />
      <Note>
        Overdue limits per status (days):{" "}
        {Object.entries(data.slaDays as Record<string, number>)
          .filter(([s]) => !TERMINAL.includes(s))
          .map(([s, d]) => `${s.replace(/_/g, " ").toLowerCase()} ${d}`)
          .join(" · ")}
        . Each can be changed with the backend setting REPORT_SLA_&lt;STATUS&gt;.
      </Note>
    </div>
  );
};
