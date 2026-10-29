"use client";

import { useEffect, useState } from "react";
import Axios from "@/lib/ApiConfig";
import type { Props } from "@/types/case-detail/tabs/audit-tab";

export default function AuditTab({
  caseData,
}: Props) {
  const caseId = caseData?._id;
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!caseId) return;

    const loadAuditLogs = async () => {
      try {
        setLoading(true);
        const { data } = await Axios.get(`/lawyer/${caseId}/audit-log`);
        if (Array.isArray(data)) {
          setLogs(data);
        } else if (data?.items && Array.isArray(data.items)) {
          setLogs(data.items);
        }
      } catch (err) {
        console.error("Failed to load audit logs", err);
      } finally {
        setLoading(false);
      }
    };

    loadAuditLogs();
  }, [caseId]);

  const defaultEvents = [
    {
      label: "Case Created",
      date: caseData?.createdAt,
    },
    {
      label: "Case Updated",
      date: caseData?.updatedAt,
    },
    {
      label: "Workflow Status",
      date: caseData?.workflowStatus,
    },
  ];

  return (
    <div className="space-y-4">
      {loading && (
        <div className="text-sm text-slate-500">Loading audit logs...</div>
      )}

      {logs.length > 0 ? (
        logs.map((log, index) => (
          <div
            key={log._id || log.id || index}
            className="border rounded-xl p-4 bg-white"
          >
            <div className="font-semibold text-slate-900">
              {log.action || log.event || "Audit Event"}
            </div>
            {log.notes && (
              <div className="text-sm text-slate-600 mt-1">{log.notes}</div>
            )}
            <div className="text-xs text-slate-400 mt-2">
              {log.createdAt ? new Date(log.createdAt).toLocaleString() : "-"}
            </div>
          </div>
        ))
      ) : (
        defaultEvents.map((event) => (
          <div
            key={event.label}
            className="border rounded-xl p-4 bg-white"
          >
            <div className="font-semibold">{event.label}</div>
            <div className="text-sm text-slate-500">
              {event.date ? new Date(event.date).toLocaleString() : "-"}
            </div>
          </div>
        ))
      )}
    </div>
  );
}