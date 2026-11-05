"use client";

import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Lock, Plus } from "lucide-react";
import Axios from "@/lib/ApiConfig";
import {
  apiError,
  Badge,
  CaseLink,
  Column,
  DataTable,
  ErrorBox,
  fetchAllRows,
  fieldCls,
  FilterBar,
  FilterField,
  Filters,
  fmtDate,
  fmtDateTime,
  Modal,
  Note,
  ReportOptions,
  ReportTabs,
  StatTile,
  useReport,
} from "./ReportKit";

const REPORTS = [
  { key: "logins", label: "Admin & CM Login History", endpoint: "security/logins" },
  { key: "access", label: "User Access History", endpoint: "security/access" },
  { key: "activity", label: "Staff Activity / Audit Log", endpoint: "security/activity" },
  { key: "assignments", label: "Case Assignment History", endpoint: "security/assignments" },
  { key: "status", label: "Case Status Change History", endpoint: "security/status-changes" },
  { key: "unauthorized", label: "Unauthorized Access Attempts", endpoint: "security/unauthorized" },
  { key: "gdpr", label: "GDPR Data Requests", endpoint: "security/gdpr" },
  { key: "sensitive", label: "Sensitive Information Access", endpoint: "security/sensitive-access" },
];

const DEFAULTS: Filters = {
  range: "last_30_days",
  role: "all",
  user: "all",
  userQuery: "",
  activityType: "all",
  caseId: "",
  page: "1",
  pageSize: "25",
};

const ROLES = [
  { value: "all", label: "All roles" },
  { value: "admin", label: "Admin" },
  { value: "case_manager", label: "Case Manager" },
  { value: "lawyer", label: "Lawyer" },
  { value: "end_user", label: "Applicant" },
];

const ACTIVITY_TYPES = [
  { value: "all", label: "All activity" },
  { value: "LOGIN", label: "Login" },
  { value: "CASE_UPDATE", label: "Case Update" },
  { value: "ASSIGNMENT", label: "Assignment" },
  { value: "STATUS_CHANGE", label: "Status Change" },
  { value: "DOCUMENT_ACCESS", label: "Document Access" },
  { value: "ACCOUNT_CHANGE", label: "Account Change" },
];

const GDPR_TYPES = [
  { value: "DATA_ACCESS", label: "Data Access" },
  { value: "DATA_EXPORT", label: "Data Export" },
  { value: "DELETION", label: "Deletion" },
  { value: "ANONYMIZATION", label: "Anonymization" },
];
const GDPR_STATUSES = [
  { value: "RECEIVED", label: "Received" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "REJECTED", label: "Rejected" },
];

const roleTone = (role: string) =>
  role === "Admin" ? "violet" : role === "Case Manager" ? "blue" : role === "Lawyer" ? "amber" : role === "System" ? "slate" : "green";
const RoleBadge = ({ role }: { role: string }) => (role && role !== "—" ? <Badge tone={roleTone(role) as any}>{role}</Badge> : <>—</>);
const at: Column<any> = { key: "at", label: "Date / Time", render: (r) => <span className="whitespace-nowrap">{fmtDateTime(r.at)}</span>, csv: (r) => r.at };
const ip: Column<any> = { key: "ipAddress", label: "IP Address", className: "font-mono text-[11px]" };
const caseCol: Column<any> = { key: "caseNumber", label: "Case ID", render: (r) => <CaseLink id={r.caseId} label={r.caseNumber} /> };
const person = (nameKey: string, emailKey?: string): Column<any> => ({
  key: nameKey,
  label: "User",
  render: (r) => (
    <div>
      <div className="font-semibold text-slate-800">{r[nameKey]}</div>
      {emailKey && r[emailKey] && r[emailKey] !== "—" && <div className="text-[11px] text-slate-400">{r[emailKey]}</div>}
    </div>
  ),
  csv: (r) => r[nameKey],
});

const COLUMNS: Record<string, Column<any>[]> = {
  logins: [
    { key: "userName", label: "User Name", render: (r) => <span className="font-semibold text-slate-800">{r.userName}</span> },
    { key: "email", label: "Email" },
    { key: "role", label: "Role", render: (r) => <RoleBadge role={r.role} />, csv: (r) => r.role },
    at,
    ip,
    { key: "result", label: "Login Status", render: (r) => <Badge tone={r.result === "Successful" ? "green" : "red"}>{r.result}</Badge>, csv: (r) => r.result },
    { key: "failureReason", label: "Failure Reason", render: (r) => r.failureReason || "—" },
  ],
  access: [
    person("userName", "email"),
    { key: "email", label: "Email" },
    { key: "role", label: "Role", render: (r) => <RoleBadge role={r.role} />, csv: (r) => r.role },
    caseCol,
    at,
    { key: "accessType", label: "Access Type", render: (r) => <Badge tone="slate">{r.accessType}</Badge>, csv: (r) => r.accessType },
    ip,
  ],
  activity: [
    { key: "staffName", label: "Staff Name", render: (r) => <span className="font-semibold text-slate-800">{r.staffName}</span> },
    { key: "role", label: "Role", render: (r) => <RoleBadge role={r.role} />, csv: (r) => r.role },
    { key: "activity", label: "Activity", className: "min-w-[160px]" },
    { key: "activityType", label: "Type", render: (r) => <Badge tone="slate">{r.activityType}</Badge>, csv: (r) => r.activityType },
    caseCol,
    { key: "previousValue", label: "Previous Value", className: "min-w-[150px]", render: (r) => r.previousValue || "—" },
    { key: "newValue", label: "New Value", className: "min-w-[150px]", render: (r) => r.newValue || "—" },
    at,
  ],
  assignments: [
    caseCol,
    { key: "assignment", label: "Assignment" },
    { key: "previous", label: "Previous" },
    { key: "new", label: "New", render: (r) => <span className="font-semibold text-slate-800">{r.new}</span> },
    {
      key: "performedBy",
      label: "Performed By",
      render: (r) => (
        <div className="flex items-center gap-1.5">
          {r.performedBy} <RoleBadge role={r.performedByRole} />
        </div>
      ),
      csv: (r) => `${r.performedBy} (${r.performedByRole})`,
    },
    { key: "reason", label: "Reason" },
    at,
  ],
  status: [
    caseCol,
    { key: "field", label: "Field" },
    { key: "previousStatus", label: "Previous Status" },
    { key: "newStatus", label: "New Status", render: (r) => <span className="font-semibold text-slate-800">{r.newStatus}</span> },
    { key: "changedBy", label: "Changed By" },
    { key: "role", label: "Role", render: (r) => <RoleBadge role={r.role} />, csv: (r) => r.role },
    at,
    { key: "comments", label: "Comments / Reason", className: "min-w-[180px]" },
  ],
  unauthorized: [
    { key: "userName", label: "User", render: (r) => <span className="font-semibold text-slate-800">{r.userName}</span> },
    { key: "email", label: "Email" },
    ip,
    at,
    { key: "attemptType", label: "Attempt Type", render: (r) => <Badge tone="amber">{r.attemptType}</Badge>, csv: (r) => r.attemptType },
    { key: "target", label: "Target", className: "font-mono text-[11px] break-all min-w-[180px]" },
    { key: "result", label: "Result", render: (r) => <Badge tone="red">{r.result}</Badge>, csv: (r) => r.result },
    { key: "details", label: "Details", className: "min-w-[220px]" },
  ],
  sensitive: [
    { key: "staffName", label: "Staff Name", render: (r) => <span className="font-semibold text-slate-800">{r.staffName}</span> },
    { key: "role", label: "Role", render: (r) => <RoleBadge role={r.role} />, csv: (r) => r.role },
    caseCol,
    { key: "applicant", label: "Applicant" },
    { key: "informationType", label: "Information Type" },
    { key: "action", label: "Action", render: (r) => <Badge tone={r.action === "Viewed" ? "slate" : r.action === "Downloaded" ? "amber" : "blue"}>{r.action}</Badge>, csv: (r) => r.action },
    at,
    ip,
  ],
};

export const SecurityReports: React.FC<{ options: ReportOptions | null }> = ({ options }) => {
  const [active, setActive] = useState("logins");
  const [filters, setFilters] = useState<Filters>(DEFAULTS);
  const [gdprEdit, setGdprEdit] = useState<any | "new" | null>(null);
  const report = REPORTS.find((r) => r.key === active)!;
  // "Everyone" on the login report maps to the API's scope=all.
  const apiFilters = active === "logins" && filters.scope === "all_users" ? { ...filters, scope: "all" } : { ...filters, scope: "" };
  const { data, loading, error, reload } = useReport<any>(report.endpoint, apiFilters);

  const fields: FilterField[] = useMemo(() => {
    const staff = options?.staff ?? [];
    const f: FilterField[] = [{ key: "range", label: active === "gdpr" ? "Request Date" : "Date Range", type: "range" }];
    if (active !== "gdpr") {
      f.push({
        key: "role",
        label: "User Role",
        type: "select",
        options:
          active === "status" || active === "assignments" || active === "activity"
            ? [...ROLES, { value: "system", label: "System" }]
            : ROLES,
      });
    }
    f.push({
      key: "user",
      label: active === "gdpr" ? "Assigned To / User" : "Staff User",
      type: "select",
      options: [{ value: "all", label: "All users" }, ...staff.map((s) => ({ value: s.id, label: `${s.name || s.email}` }))],
    });
    f.push({ key: "userQuery", label: "Name / Email", type: "text", placeholder: "Search user" });
    if (active === "activity") f.push({ key: "activityType", label: "Activity Type", type: "select", options: ACTIVITY_TYPES });
    if (active === "logins") {
      f.push({ key: "result", label: "Login Status", type: "select", options: [{ value: "all", label: "All" }, { value: "success", label: "Successful" }, { value: "failed", label: "Failed" }] });
      f.push({ key: "scope", label: "Accounts", type: "select", options: [{ value: "all", label: "Admin & CM" }, { value: "all_users", label: "Everyone" }] });
    }
    if (active === "access") {
      f.push({ key: "accessType", label: "Access Type", type: "select", options: ["all", "Dashboard", "Case Record", "User Profile", "Audit Report"].map((v) => ({ value: v, label: v === "all" ? "All" : v })) });
    }
    if (active === "assignments") {
      f.push({ key: "kind", label: "Assignment", type: "select", options: [{ value: "CASE_MANAGER", label: "Case Manager" }, { value: "LAWYER_P1", label: "Applicant 1 Solicitor" }, { value: "LAWYER_P2", label: "Applicant 2 Solicitor" }, { value: "ALL", label: "All assignments" }] });
    }
    if (active === "status") {
      f.push({ key: "field", label: "Status Type", type: "select", options: [{ value: "workflowStatus", label: "Case status" }, { value: "paymentStatus", label: "Payment status" }, { value: "all", label: "Both" }] });
    }
    if (active === "unauthorized") {
      f.push({ key: "attemptType", label: "Attempt Type", type: "select", options: ["all", "Failed Login", "Restricted Page Access", "Unauthorized Case Access"].map((v) => ({ value: v, label: v === "all" ? "All" : v })) });
    }
    if (active === "sensitive") {
      f.push({ key: "infoType", label: "Information Type", type: "select", options: ["all", "Financial", "Personal", "Legal Docs", "Supporting Docs"].map((v) => ({ value: v, label: v === "all" ? "All" : v })) });
      f.push({ key: "action", label: "Action", type: "select", options: ["all", "Viewed", "Downloaded", "Uploaded"].map((v) => ({ value: v, label: v === "all" ? "All" : v })) });
    }
    if (active === "gdpr") {
      f.push({ key: "gdprType", label: "Request Type", type: "select", options: [{ value: "all", label: "All types" }, ...GDPR_TYPES] });
      f.push({ key: "gdprStatus", label: "Status", type: "select", options: [{ value: "all", label: "All statuses" }, ...GDPR_STATUSES] });
      f.push({ key: "overdue", label: "Due", type: "select", options: [{ value: "all", label: "All" }, { value: "overdue", label: "Overdue only" }] });
    } else {
      f.push({ key: "caseId", label: "Case ID", type: "text", placeholder: "CASE-2026-…" });
    }
    return f;
  }, [options, active]);

  const gdprCols: Column<any>[] = [
    { key: "requestId", label: "Request ID", className: "font-mono text-[11px] whitespace-nowrap" },
    person("userName"),
    { key: "email", label: "Email" },
    { key: "typeLabel", label: "Request Type", render: (r) => <Badge tone={r.type === "DELETION" ? "red" : "slate"}>{r.typeLabel}</Badge>, csv: (r) => r.typeLabel },
    { key: "requestDate", label: "Request Date", render: (r) => fmtDate(r.requestDate), csv: (r) => r.requestDate },
    { key: "assignedTo", label: "Assigned To" },
    {
      key: "statusLabel",
      label: "Status",
      render: (r) => <Badge tone={r.status === "COMPLETED" ? "green" : r.status === "REJECTED" ? "slate" : r.status === "IN_PROGRESS" ? "blue" : "amber"}>{r.statusLabel}</Badge>,
      csv: (r) => r.statusLabel,
    },
    {
      key: "responseDueDate",
      label: "Response Due",
      render: (r) => (
        <div className="whitespace-nowrap">
          {fmtDate(r.responseDueDate)}
          {r.overdue ? (
            <div><Badge tone="red">Overdue</Badge></div>
          ) : r.daysRemaining !== null ? (
            <div className="text-[11px] text-slate-400">{r.daysRemaining} days left</div>
          ) : null}
        </div>
      ),
      csv: (r) => r.responseDueDate,
    },
    { key: "completionDate", label: "Completion Date", render: (r) => fmtDate(r.completionDate), csv: (r) => r.completionDate },
    { key: "notes", label: "Notes", className: "min-w-[180px] max-w-[260px]", render: (r) => <span className="line-clamp-3">{r.notes || "—"}</span> },
    {
      key: "edit",
      label: "",
      csv: () => "",
      render: (r) => (
        <button onClick={() => setGdprEdit(r)} className="px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">
          Manage
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 bg-slate-900 text-slate-200 rounded-xl px-4 py-3 text-[11px] leading-relaxed">
        <Lock className="w-4 h-4 text-violet-300 shrink-0 mt-0.5" />
        <span>
          Audit records are read-only: they cannot be edited or deleted from the application, automatic changes are recorded as
          &ldquo;System&rdquo;, and opening these reports is itself logged. Security logs are kept for 2 years and case history for 7 years.
        </span>
      </div>
      <ReportTabs
        items={REPORTS}
        active={active}
        onChange={(k) => {
          setActive(k);
          setFilters((f) => ({ ...f, page: "1" }));
        }}
      />
      <FilterBar fields={fields} filters={filters} onChange={setFilters} onReset={() => setFilters(DEFAULTS)} onRefresh={reload} loading={loading} />
      {error && <ErrorBox message={error} onRetry={reload} />}

      {active === "gdpr" && data?.summary && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatTile label="Open Requests" value={data.summary.open} />
          <StatTile label="Overdue" value={data.summary.overdue} tone={data.summary.overdue ? "bad" : "default"} />
        </div>
      )}

      {data && !error && data.rows && (
        <DataTable
          title={report.label}
          columns={active === "gdpr" ? gdprCols : COLUMNS[active]}
          rows={data.rows}
          loading={loading}
          total={data.total}
          page={data.page}
          pageSize={data.pageSize}
          onPage={(p) => setFilters({ ...filters, page: String(p) })}
          exportName={report.key === "gdpr" ? "gdpr-requests" : `security-${report.key}`}
          exportAll={() => fetchAllRows(report.endpoint, apiFilters)}
          actions={
            active === "gdpr" ? (
              <button
                onClick={() => setGdprEdit("new")}
                className="px-3 py-1.5 rounded-lg bg-violet-600 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-violet-700"
              >
                <Plus className="w-3.5 h-3.5" /> Log request
              </button>
            ) : undefined
          }
        />
      )}
      {active === "gdpr" && (
        <Note>
          Requests must be answered within one month. A deletion or anonymization request never removes case records automatically:
          case files may have to be kept for legal reasons, so staff decide and record the outcome here.
        </Note>
      )}

      {gdprEdit && (
        <GdprDialog
          request={gdprEdit === "new" ? null : gdprEdit}
          staff={(options?.staff ?? []).filter((s) => s.role !== "lawyer")}
          onClose={() => setGdprEdit(null)}
          onDone={() => {
            setGdprEdit(null);
            void reload();
          }}
        />
      )}
    </div>
  );
};

const GdprDialog: React.FC<{
  request: any | null;
  staff: { id: string; name: string; email: string }[];
  onClose: () => void;
  onDone: () => void;
}> = ({ request, staff, onClose, onDone }) => {
  const isNew = !request;
  const [form, setForm] = useState({
    type: request?.type ?? "DATA_ACCESS",
    email: request?.email ?? "",
    userName: request?.userName ?? "",
    requestDate: new Date().toISOString().slice(0, 10),
    assignedTo: request?.assignedToId ?? "",
    status: request?.status ?? "RECEIVED",
    notes: request?.notes ?? "",
    note: "",
  });
  const [busy, setBusy] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const closing = ["COMPLETED", "REJECTED"].includes(form.status) && form.status !== request?.status;

  const submit = async () => {
    setBusy(true);
    try {
      if (isNew) {
        await Axios.post("/admin/gdpr-requests", {
          type: form.type,
          email: form.email,
          userName: form.userName,
          requestDate: form.requestDate,
          assignedTo: form.assignedTo || undefined,
          notes: form.notes,
        });
        toast.success("GDPR request logged");
      } else {
        await Axios.patch(`/admin/gdpr-requests/${request.id}`, {
          status: form.status,
          assignedTo: form.assignedTo || null,
          notes: form.notes,
          note: form.note || undefined,
        });
        toast.success("GDPR request updated");
      }
      onDone();
    } catch (e) {
      toast.error(apiError(e, "Could not save the request"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title={isNew ? "Log GDPR request" : `GDPR request ${request.requestId}`} onClose={onClose}>
      {isNew ? (
        <>
          <label className="block space-y-1">
            <span className="font-semibold text-slate-600">Request type</span>
            <select className={fieldCls} value={form.type} onChange={(e) => set("type", e.target.value)}>
              {GDPR_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span className="font-semibold text-slate-600">Requester email</span>
            <input className={fieldCls} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </label>
          <label className="block space-y-1">
            <span className="font-semibold text-slate-600">Requester name (if they have no account)</span>
            <input className={fieldCls} value={form.userName} onChange={(e) => set("userName", e.target.value)} />
          </label>
          <label className="block space-y-1">
            <span className="font-semibold text-slate-600">Date received</span>
            <input className={fieldCls} type="date" value={form.requestDate} onChange={(e) => set("requestDate", e.target.value)} />
          </label>
        </>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
          <div>
            <b>{request.typeLabel}</b> from {request.userName} ({request.email})
          </div>
          <div>
            Received {fmtDate(request.requestDate)} · due {fmtDate(request.responseDueDate)}
          </div>
          {request.type === "DELETION" && (
            <div className="text-red-700">Case records are not deleted automatically; record what was done in the notes.</div>
          )}
        </div>
      )}
      <label className="block space-y-1">
        <span className="font-semibold text-slate-600">Assigned to</span>
        <select className={fieldCls} value={form.assignedTo} onChange={(e) => set("assignedTo", e.target.value)}>
          <option value="">Unassigned</option>
          {staff.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name || s.email}
            </option>
          ))}
        </select>
      </label>
      {!isNew && (
        <label className="block space-y-1">
          <span className="font-semibold text-slate-600">Status</span>
          <select className={fieldCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
            {GDPR_STATUSES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
      )}
      <label className="block space-y-1">
        <span className="font-semibold text-slate-600">Notes</span>
        <textarea rows={3} className={fieldCls} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
      </label>
      {!isNew && (
        <label className="block space-y-1">
          <span className="font-semibold text-slate-600">
            Update note{closing ? " (required to close the request)" : ""}
          </span>
          <input className={fieldCls} value={form.note} onChange={(e) => set("note", e.target.value)} />
        </label>
      )}
      {!isNew && request.history?.length > 0 && (
        <div className="border-t border-slate-100 pt-3 space-y-1.5">
          <div className="font-semibold text-slate-600">History</div>
          {request.history.map((h: any, i: number) => (
            <div key={i} className="text-[11px] text-slate-500">
              {fmtDateTime(h.at)} · <b className="text-slate-700">{h.status.replace("_", " ").toLowerCase()}</b> by {h.byName}
              {h.note ? ` — ${h.note}` : ""}
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="px-3 py-2 rounded-lg border border-slate-200 font-semibold text-slate-600 cursor-pointer">
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={busy || (isNew && !form.email) || (closing && !form.note.trim() && !form.notes.trim())}
          className="px-3 py-2 rounded-lg bg-violet-600 text-white font-semibold disabled:opacity-50 cursor-pointer"
        >
          {busy ? "Saving…" : isNew ? "Log request" : "Save"}
        </button>
      </div>
    </Modal>
  );
};
