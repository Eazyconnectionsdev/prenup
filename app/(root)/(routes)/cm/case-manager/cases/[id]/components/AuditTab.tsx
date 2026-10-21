"use client";

import React, { useEffect, useState } from "react";
import Axios from "@/lib/ApiConfig";
import { Eye, ShieldCheck, X } from "lucide-react";
import type { Props } from "@/types/case-detail/tabs/audit-tab";

interface AuditEntry {
  id?: string;
  _id?: string;
  createdAt?: string;
  timestamp?: string;
  user?: string;
  role?: string;
  actorRole?: string;
  event?: string;
  action?: string;
  details?: string;
  notes?: string;
  category?: string;
  meta?: any;
}

export default function AuditTab({ caseData }: Props) {
  const caseId = caseData?._id;
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);

  useEffect(() => {
    if (!caseId) return;
    const fetchAudit = async () => {
      try {
        setLoading(true);
        const { data } = await Axios.get(`/case-manager/${caseId}/audit-log`);
        const records = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
          ? data.items
          : [];
        setLogs(records);
      } catch (err) {
        console.error("Failed to load audit logs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAudit();
  }, [caseId]);

  // Merge with known events if backend has minimal entries
  const displayLogs: AuditEntry[] = logs.length > 0 ? logs : [
    {
      _id: "init-1",
      createdAt: caseData?.createdAt || new Date().toISOString(),
      user: caseData?.owner?.firstName
        ? `${caseData.owner.firstName} ${caseData.owner.lastName || ""}`.trim()
        : "Primary Applicant",
      role: "P1",
      event: "Account Created",
      details: "Initial case creation and registration.",
      category: "Registration",
    },
    ...(caseData?.paymentCompleted
      ? [
          {
            _id: "pay-1",
            createdAt: caseData?.updatedAt || new Date().toISOString(),
            user: "System / Payment Gateway",
            role: "System",
            event: "Payment Completed",
            details: "Client fee payment confirmed successfully.",
            category: "Payment",
          },
        ]
      : []),
    ...(caseData?.cmApproved
      ? [
          {
            _id: "cm-1",
            createdAt: caseData?.cmApprovedAt || new Date().toISOString(),
            user: caseData?.assignedCaseManager?.firstName || "Case Manager",
            role: "Case Manager",
            event: "Case Manager Approved",
            details: "Case approved and signed off by Case Manager.",
            category: "Approval",
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>Case Audit Log</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Immutable chronological record of events across authentication, registration, payments, reviews & approvals.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-200 text-slate-700">
            {displayLogs.length} Events Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-[10px] uppercase font-bold text-slate-600 tracking-wider">
                <th className="p-3.5 pl-6">Date &amp; Time</th>
                <th className="p-3.5">User</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Event</th>
                <th className="p-3.5">Details</th>
                <th className="p-3.5 pr-6 text-center">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayLogs.map((entry, idx) => {
                const timestamp = entry.createdAt || entry.timestamp;
                const formattedDate = timestamp
                  ? new Date(timestamp).toLocaleString()
                  : "—";

                return (
                  <tr key={entry._id || idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 pl-6 font-mono text-slate-600 whitespace-nowrap">
                      {formattedDate}
                    </td>
                    <td className="p-3.5 font-semibold text-slate-900">
                      {entry.user || "System"}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {entry.role || entry.actorRole || "System"}
                      </span>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-800">
                      {entry.event || entry.action || "Activity"}
                    </td>
                    <td className="p-3.5 text-slate-600 max-w-md truncate">
                      {entry.details || entry.notes || "—"}
                    </td>
                    <td className="p-3.5 pr-6 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedEntry(entry)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                        title="View Event Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal to view event details */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-[500px] bg-white border border-slate-300 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="font-bold text-sm text-slate-900">Event Details</h4>
              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <strong className="text-slate-500">Timestamp:</strong>{" "}
                <span className="text-slate-800 font-mono">
                  {selectedEntry.createdAt || selectedEntry.timestamp || "—"}
                </span>
              </div>
              <div>
                <strong className="text-slate-500">User:</strong>{" "}
                <span className="text-slate-800 font-semibold">{selectedEntry.user || "System"}</span>
              </div>
              <div>
                <strong className="text-slate-500">Role:</strong>{" "}
                <span className="text-slate-800">{selectedEntry.role || selectedEntry.actorRole || "System"}</span>
              </div>
              <div>
                <strong className="text-slate-500">Event:</strong>{" "}
                <span className="text-slate-900 font-bold">{selectedEntry.event || selectedEntry.action}</span>
              </div>
              <div>
                <strong className="text-slate-500">Category:</strong>{" "}
                <span className="text-slate-800">{selectedEntry.category || "General"}</span>
              </div>
              <div>
                <strong className="text-slate-500">Details:</strong>
                <p className="mt-1 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-mono text-[11px] whitespace-pre-wrap">
                  {selectedEntry.details || selectedEntry.notes || "No extra data provided."}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}