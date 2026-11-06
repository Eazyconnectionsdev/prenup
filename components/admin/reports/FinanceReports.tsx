"use client";

import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
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
  fmtDateTime,
  Modal,
  Note,
  PercentBar,
  ReportTabs,
  SERVICE_TYPES,
  StatTile,
  useReport,
} from "./ReportKit";

const REPORTS = [
  { key: "revenue", label: "Total Revenue", view: "summary" },
  { key: "received", label: "Payments Received", view: "summary" },
  { key: "pending", label: "Pending Payments", view: "pending" },
  { key: "failed", label: "Failed Payments", view: "failed" },
  { key: "refunds", label: "Refunds", view: "refunds" },
  { key: "net", label: "Net Revenue", view: "summary" },
  { key: "byService", label: "Revenue by Service", view: "summary" },
  { key: "history", label: "Transaction History", view: "history" },
];

const DEFAULTS: Filters = {
  range: "all",
  service: "all",
  paymentStatus: "all",
  transactionType: "all",
  refundType: "all",
  caseId: "",
  page: "1",
  pageSize: "25",
};

const statusTone = (r: any) =>
  r.statusLabel === "Successful"
    ? "green"
    : r.statusLabel === "Failed"
      ? "red"
      : r.statusLabel === "Pending"
        ? "amber"
        : r.statusLabel === "Cancelled"
          ? "slate"
          : "violet";

export const FinanceReports: React.FC = () => {
  const [active, setActive] = useState("revenue");
  const [filters, setFilters] = useState<Filters>(DEFAULTS);
  const [refunding, setRefunding] = useState<any | null>(null);
  const report = REPORTS.find((r) => r.key === active)!;
  const isSummary = report.view === "summary";
  const params = isSummary ? filters : { ...filters, view: report.view };
  const { data, loading, error, reload } = useReport<any>(isSummary ? "finance/summary" : "finance/transactions", params);

  const fields: FilterField[] = useMemo(() => {
    const f: FilterField[] = [
      { key: "range", label: "Date Range", type: "range" },
      { key: "service", label: "Service Type", type: "select", options: SERVICE_TYPES },
    ];
    if (report.view === "history") {
      f.push({
        key: "paymentStatus",
        label: "Payment Status",
        type: "select",
        options: [
          { value: "all", label: "All" },
          { value: "SUCCESSFUL", label: "Successful" },
          { value: "PENDING", label: "Pending" },
          { value: "FAILED", label: "Failed" },
          { value: "REFUNDED", label: "Refunded" },
          { value: "PARTIALLY_REFUNDED", label: "Partially Refunded" },
          { value: "CANCELLED", label: "Cancelled / expired" },
        ],
      });
      f.push({
        key: "transactionType",
        label: "Transaction Type",
        type: "select",
        options: [
          { value: "all", label: "All" },
          { value: "PAYMENT", label: "Payment" },
          { value: "REFUND", label: "Refund" },
        ],
      });
    }
    if (report.view === "refunds") {
      f.push({
        key: "refundType",
        label: "Refund Type",
        type: "select",
        options: [
          { value: "all", label: "Full and partial" },
          { value: "FULL", label: "Full refunds" },
          { value: "PARTIAL", label: "Partial refunds" },
        ],
      });
    }
    f.push({ key: "caseId", label: "Case ID", type: "text", placeholder: "Case or transaction ID" });
    return f;
  }, [report.view]);

  const onPage = (p: number) => setFilters({ ...filters, page: String(p) });
  const exportAll = () => fetchAllRows("finance/transactions", { ...filters, view: report.view });

  const txCommon = {
    rows: data?.rows ?? [],
    loading,
    total: data?.total,
    page: data?.page,
    pageSize: data?.pageSize,
    onPage,
    exportAll,
  };

  return (
    <div className="space-y-4">
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

      {data && !error && isSummary && data.totalRevenue && <Summary active={active} data={data} />}

      {data && !error && report.view === "pending" && (
        <DataTable title="Pending Payments" exportName="pending-payments" columns={pendingCols} {...txCommon} empty="No checkouts are waiting for payment." />
      )}
      {data && !error && report.view === "failed" && (
        <DataTable title="Failed Payments" exportName="failed-payments" columns={failedCols} {...txCommon} empty="No failed payments for these filters." />
      )}
      {data && !error && report.view === "refunds" && (
        <DataTable title="Refunds" exportName="refunds" columns={refundCols} {...txCommon} empty="No refunds for these filters." />
      )}
      {data && !error && report.view === "history" && (
        <>
          <DataTable
            title="Transaction History"
            exportName="transaction-history"
            columns={[
              ...historyCols,
              {
                key: "actions",
                label: "",
                csv: () => "",
                render: (r: any) =>
                  r.refundable ? (
                    <button
                      onClick={() => setRefunding(r)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      Refund
                    </button>
                  ) : null,
              },
            ]}
            {...txCommon}
          />
          <Note>Use Refund on a successful payment to refund all or part of it. Stripe refunds go back to the customer&apos;s card; refunds of payments taken outside Stripe are only recorded here and must be paid manually.</Note>
        </>
      )}

      {refunding && (
        <RefundDialog
          payment={refunding}
          onClose={() => setRefunding(null)}
          onDone={() => {
            setRefunding(null);
            void reload();
          }}
        />
      )}
    </div>
  );
};

// ── Summary-based reports (1, 2, 6, 7) ──

const Summary: React.FC<{ active: string; data: any }> = ({ active, data }) => {
  if (active === "revenue") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatTile label="Total Revenue" value={data.totalRevenue.display} hint={`${data.totalRevenue.payments} successful payments`} />
          <StatTile label="Paid Cases" value={data.totalRevenue.paidCases} />
          <StatTile label="Refunded" value={data.refunds.display} tone={data.refunds.amount ? "bad" : "default"} hint={`${data.refunds.count} refunds`} />
          <StatTile label="Net Revenue" value={data.netRevenue.display} tone="good" />
        </div>
        <ServiceTable rows={data.byService} title="Total Revenue by Service" />
        <Note>Total revenue is every successful payment in the period, including payments later refunded.</Note>
      </div>
    );
  }
  if (active === "received") {
    return (
      <DataTable
        title="Payments Received"
        exportName="payments-received"
        rows={(data.paymentsReceived as any[]).map((r) => ({ ...r, id: r.category }))}
        columns={[
          { key: "category", label: "Category", render: (r: any) => <span className="font-semibold text-slate-800">{r.category}</span> },
          { key: "count", label: "Count", align: "right" },
          { key: "display", label: "Amount", align: "right", csv: (r: any) => (r.amount / 100).toFixed(2) },
        ]}
      />
    );
  }
  if (active === "net") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <StatTile label="Successful Payments" value={data.totalRevenue.display} />
          <StatTile label="Less Refunds" value={`− ${data.refunds.display}`} tone={data.refunds.amount ? "bad" : "default"} hint={`${data.refunds.full} full · ${data.refunds.partial} partial`} />
          <StatTile label="Net Revenue" value={data.netRevenue.display} tone="good" />
        </div>
        <ServiceTable rows={data.byService} title="Net Revenue by Service" net />
        <Note>{data.netRevenue.note}</Note>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <ServiceTable rows={data.byService} title="Revenue by Service" />
      <DataTable
        title="Revenue by Agreement Type"
        exportName="revenue-by-agreement-type"
        rows={(data.byAgreementType as any[]).map((r) => ({ ...r, id: r.service }))}
        columns={[
          { key: "label", label: "Agreement", render: (r: any) => <span className="font-semibold text-slate-800">{r.label}</span> },
          { key: "paidCases", label: "Paid Cases", align: "right" },
          { key: "revenue", label: "Revenue", align: "right", render: (r: any) => r.revenue.display, csv: (r: any) => (r.revenue.amount / 100).toFixed(2) },
          { key: "percent", label: "% of Revenue", render: (r: any) => <PercentBar value={r.percent} />, csv: (r: any) => r.percent },
        ]}
      />
    </div>
  );
};

const ServiceTable: React.FC<{ rows: any[]; title: string; net?: boolean }> = ({ rows, title, net }) => (
  <DataTable
    title={title}
    exportName={title.toLowerCase().replace(/\s+/g, "-")}
    rows={rows.map((r) => ({ ...r, id: r.service }))}
    columns={[
      { key: "label", label: "Service", render: (r: any) => <span className="font-semibold text-slate-800">{r.label}</span> },
      { key: "paidCases", label: "Paid Cases", align: "right" },
      { key: "revenue", label: "Revenue", align: "right", render: (r: any) => r.revenue.display, csv: (r: any) => (r.revenue.amount / 100).toFixed(2) },
      ...(net
        ? [
            { key: "refunds", label: "Refunds", align: "right" as const, render: (r: any) => r.refunds.display, csv: (r: any) => (r.refunds.amount / 100).toFixed(2) },
            { key: "netRevenue", label: "Net Revenue", align: "right" as const, render: (r: any) => r.netRevenue.display, csv: (r: any) => (r.netRevenue.amount / 100).toFixed(2) },
          ]
        : []),
      { key: "percent", label: "% of Revenue", render: (r: any) => <PercentBar value={r.percent} />, csv: (r: any) => r.percent },
    ]}
  />
);

// ── Transaction-list columns ──

const caseCol: Column<any> = { key: "caseNumber", label: "Case ID", render: (r) => <CaseLink id={r.caseId} label={r.caseNumber} /> };
const customerCol: Column<any> = {
  key: "customerName",
  label: "Customer",
  render: (r) => (
    <div>
      <div className="font-semibold text-slate-800">{r.customerName}</div>
      {r.customerEmail && <div className="text-[11px] text-slate-400">{r.customerEmail}</div>}
    </div>
  ),
  csv: (r) => `${r.customerName}${r.customerEmail ? ` <${r.customerEmail}>` : ""}`,
};
const amountCol: Column<any> = { key: "amountDisplay", label: "Amount", align: "right", csv: (r) => (r.amount / 100).toFixed(2) };
const statusCol: Column<any> = { key: "statusLabel", label: "Status", render: (r) => <Badge tone={statusTone(r) as any}>{r.statusLabel}</Badge>, csv: (r) => r.statusLabel };
const txIdCol: Column<any> = { key: "transactionId", label: "Transaction ID", className: "font-mono text-[11px] whitespace-nowrap" };

const pendingCols: Column<any>[] = [
  caseCol,
  customerCol,
  { key: "service", label: "Service" },
  amountCol,
  statusCol,
  txIdCol,
  { key: "initiatedAt", label: "Payment Initiated", render: (r) => fmtDateTime(r.initiatedAt), csv: (r) => r.initiatedAt },
  { key: "lastUpdated", label: "Last Updated", render: (r) => fmtDateTime(r.lastUpdated), csv: (r) => r.lastUpdated },
];

const failedCols: Column<any>[] = [
  caseCol,
  customerCol,
  { key: "service", label: "Service" },
  amountCol,
  statusCol,
  { key: "failureReason", label: "Failure Reason", className: "min-w-[180px]", render: (r) => r.failureReason || "—" },
  txIdCol,
  { key: "failedAt", label: "Failure Date", render: (r) => fmtDateTime(r.failedAt), csv: (r) => r.failedAt },
  { key: "providerReference", label: "Provider Reference", className: "font-mono text-[11px]", render: (r) => r.providerReference || "—" },
];

const refundCols: Column<any>[] = [
  caseCol,
  customerCol,
  { key: "service", label: "Service" },
  {
    key: "originalTransactionId",
    label: "Original Payment",
    render: (r) => (
      <div>
        <div className="font-mono text-[11px]">{r.originalTransactionId || "—"}</div>
        {r.originalAmountDisplay && <div className="text-[11px] text-slate-400">{r.originalAmountDisplay}</div>}
      </div>
    ),
    csv: (r) => `${r.originalTransactionId || ""}${r.originalAmountDisplay ? ` (${r.originalAmountDisplay})` : ""}`,
  },
  { ...amountCol, label: "Refund Amount" },
  { key: "refundType", label: "Type", render: (r) => (r.refundType ? <Badge tone={r.refundType === "Full" ? "violet" : "blue"}>{r.refundType}</Badge> : "—"), csv: (r) => r.refundType },
  statusCol,
  { key: "refundedAt", label: "Refund Date", render: (r) => fmtDateTime(r.refundedAt || r.date), csv: (r) => r.refundedAt || r.date },
  { key: "refundReason", label: "Reason", render: (r) => r.refundReason || "—" },
  txIdCol,
];

const historyCols: Column<any>[] = [
  txIdCol,
  caseCol,
  customerCol,
  { key: "service", label: "Service Type" },
  { key: "type", label: "Type", render: (r) => <Badge tone={r.type === "Refund" ? "violet" : "slate"}>{r.type}</Badge>, csv: (r) => r.type },
  {
    ...amountCol,
    render: (r) => (
      <div>
        {r.type === "Refund" ? `− ${r.amountDisplay}` : r.amountDisplay}
        {r.refundedDisplay && <div className="text-[11px] text-slate-400">refunded {r.refundedDisplay}</div>}
      </div>
    ),
  },
  statusCol,
  { key: "providerReference", label: "Provider Reference", className: "font-mono text-[11px]", render: (r) => r.providerReference || "—" },
  { key: "originalTransactionId", label: "Original Payment", className: "font-mono text-[11px]", render: (r) => (r.type === "Refund" ? r.originalTransactionId || "—" : "—") },
  { key: "date", label: "Date & Time", render: (r) => fmtDateTime(r.date), csv: (r) => r.date },
];

// ── Refund ──

const RefundDialog: React.FC<{ payment: any; onClose: () => void; onDone: () => void }> = ({ payment, onClose, onDone }) => {
  const max = payment.refundableAmount / 100;
  const [mode, setMode] = useState<"full" | "partial">("full");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const value = mode === "full" ? max : Number(amount);
  const valid = reason.trim().length >= 3 && value > 0 && value <= max;

  const submit = async () => {
    if (!valid) return;
    setBusy(true);
    try {
      await Axios.post("/admin/payments/refunds", {
        transactionId: payment.transactionId,
        amount: mode === "full" ? undefined : value,
        reason: reason.trim(),
      });
      toast.success("Refund issued");
      onDone();
    } catch (e) {
      toast.error(apiError(e, "Could not issue the refund"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title={`Refund ${payment.transactionId}`} onClose={onClose}>
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
        <div>
          <b>{payment.customerName}</b> · {payment.caseNumber}
        </div>
        <div>
          Paid {payment.amountDisplay}
          {payment.refundedDisplay ? `, already refunded ${payment.refundedDisplay}` : ""} ·{" "}
          {payment.provider === "manual" ? "taken outside Stripe (refund must be paid manually)" : "refunded to the customer's card via Stripe"}
        </div>
      </div>
      <div className="flex gap-4">
        {(["full", "partial"] as const).map((m) => (
          <label key={m} className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
            <input type="radio" checked={mode === m} onChange={() => setMode(m)} />
            {m === "full" ? `Full (£${max.toFixed(2)})` : "Partial"}
          </label>
        ))}
      </div>
      {mode === "partial" && (
        <label className="block space-y-1">
          <span className="font-semibold text-slate-600">Amount (£, up to {max.toFixed(2)})</span>
          <input type="number" min="0.01" step="0.01" max={max} className={fieldCls} value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
      )}
      <label className="block space-y-1">
        <span className="font-semibold text-slate-600">Reason (kept in the refund record)</span>
        <textarea rows={3} className={fieldCls} value={reason} onChange={(e) => setReason(e.target.value)} />
      </label>
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="px-3 py-2 rounded-lg border border-slate-200 font-semibold text-slate-600 cursor-pointer">
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={!valid || busy}
          className="px-3 py-2 rounded-lg bg-red-600 text-white font-semibold disabled:opacity-50 cursor-pointer"
        >
          {busy ? "Refunding…" : `Refund £${(value || 0).toFixed(2)}`}
        </button>
      </div>
    </Modal>
  );
};
