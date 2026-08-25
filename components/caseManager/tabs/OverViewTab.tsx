import React from "react";

const OverViewTab = ({caseObj} : any) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-300 flex flex-col gap-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">
            CASE ID &amp; SERVICE
          </span>
          <span className="font-mono text-xs font-bold text-slate-900">
            {caseObj.id}
          </span>
          <span className="text-xs text-slate-600 font-semibold">
            {caseObj.service}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-300 flex flex-col gap-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">
            STATUS &amp; OWNER ROLE
          </span>
          <span className="text-xs font-bold text-slate-900">
            {caseObj.actionLabel || caseObj.cmView}
          </span>
          <span className="text-xs text-slate-600 font-semibold">
            Stage Owner:{" "}
          </span>
          <span className="text-xs text-slate-600 font-semibold">
            Owner: {caseObj.owner}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-300 flex flex-col gap-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">
            HEALTH &amp; PRIORITY
          </span>
          <span className="text-xs font-bold text-slate-900">
            HEALTH: {caseObj.health}
          </span>
          <span className="text-xs font-bold text-rose-700">
            PRIORITY: {caseObj.priority}
          </span>
        </div>
      </div>

      {/* Party Contact Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-300 flex flex-col gap-1.5 shadow-xs text-xs">
          <div className="font-bold text-slate-900 uppercase text-[10px] text-slate-500 border-b pb-1">
            Party 1 Details
          </div>
          <div>
            <strong>Name:</strong> {caseObj.p1}
          </div>
          <div>
            <strong>Email:</strong>{" "}
            {caseObj.p1Email ||
              `${caseObj.p1.toLowerCase().replace(" ", ".")}@example.com`}
          </div>
          <div>
            <strong>Phone:</strong> {caseObj.p1Phone || "+1 (416) 555-0192"}
          </div>
          <div>
            <strong>Assigned Counsel:</strong>{" "}
            {caseObj.p1Lawyer
              ? `${caseObj.p1Lawyer} (${caseObj.p1Firm})`
              : "Unassigned"}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-300 flex flex-col gap-1.5 shadow-xs text-xs">
          <div className="font-bold text-slate-900 uppercase text-[10px] text-slate-500 border-b pb-1">
            Party 2 Details
          </div>
          <div>
            <strong>Name:</strong> {caseObj.p2}
          </div>
          <div>
            <strong>Email:</strong>{" "}
            {caseObj.p2Email ||
              `${caseObj.p2.toLowerCase().replace(" ", ".")}@example.com`}
          </div>
          <div>
            <strong>Phone:</strong> {caseObj.p2Phone || "+1 (416) 555-0198"}
          </div>
          <div>
            <strong>Assigned Counsel:</strong>{" "}
            {caseObj.p2Lawyer
              ? `${caseObj.p2Lawyer} (${caseObj.p2Firm})`
              : "Unassigned"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverViewTab;
