"use client";

import React, { useState } from 'react';
import { Shield, CheckCircle, Info, Terminal, Play, Code, Check, Sliders, Bell, Globe } from 'lucide-react';
import { RuleEntry, ApiLogEntry } from '@/types/case-manager';

interface RulesApiConsoleViewProps {
  rules: RuleEntry[];
  apiLogs: ApiLogEntry[];
  onTriggerApiEndpoint: (endpoint: string, method: string, mockPayload: any) => void;
}

export const RulesApiConsoleView: React.FC<RulesApiConsoleViewProps> = ({
  rules: initialRules,
  apiLogs,
  onTriggerApiEndpoint,
}) => {
  const [rulesState, setRulesState] = useState<RuleEntry[]>(initialRules);
  const [devApiMode, setDevApiMode] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);
  const latestLog = apiLogs[apiLogs.length - 1];

  // Case Manager Settings Toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slaEscalations, setSlaEscalations] = useState(true);

  // Toggle Rule Status (ACTIVE <-> SUSPENDED)
  const handleToggleRule = (ruleId: string) => {
    setRulesState((prev) =>
      prev.map((r) => {
        if (r.id === ruleId) {
          const nextStatus = r.status === 'ACTIVE' || r.status === 'ENFORCED' ? 'SUSPENDED' : 'ACTIVE';
          const payload = {
            timestamp: new Date().toLocaleTimeString(),
            status: 200,
            endpoint: `/api/cm/rules/${ruleId}/toggle`,
            method: 'PATCH',
            action: `RULE_STATUS_CHANGED`,
            ruleId,
            ruleName: r.name,
            newStatus: nextStatus,
            result: `Rule ${ruleId} (${r.name}) state changed to ${nextStatus}. Backend sentinel updated.`,
          };
          onTriggerApiEndpoint(`/api/cm/rules/${ruleId}/toggle`, 'PATCH', payload);
          return { ...r, status: nextStatus };
        }
        return r;
      })
    );
  };

  const handleTestCall = (ep: string, method: string, actionTitle: string, ruleName: string) => {
    const payload = {
      timestamp: new Date().toLocaleTimeString(),
      status: 200,
      endpoint: ep,
      method: method,
      action: actionTitle,
      ruleEvaluated: ruleName,
      result: 'Workflow executed successfully. Operational ledger updated in real-time.',
    };
    onTriggerApiEndpoint(ep, method, payload);
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1280px]">
      
      {/* Top Banner: Operational Settings Header */}
      <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3 text-slate-900">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-sans text-slate-900 tracking-tight">
              System Rules &amp; Operational Settings
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Manage legal compliance rules, SLA threshold alerts, and portal configurations.
            </p>
          </div>
        </div>

        {/* Developer API Debug Mode Toggle Switch */}
        <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-700">Developer API Debug Mode:</span>
          <button
            onClick={() => setDevApiMode(!devApiMode)}
            className={`w-11 h-6 rounded-full transition-all relative cursor-pointer ${
              devApiMode ? 'bg-slate-900' : 'bg-slate-300'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                devApiMode ? 'left-5.5' : 'left-0.5'
              }`}
            />
          </button>
          <span className="text-[11px] font-bold text-slate-500 min-w-[32px]">
            {devApiMode ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>

      {/* Case Manager Notification & Operational Preferences */}
      <div className="grid grid-cols-2 gap-5">
        <div className="p-5 bg-white border border-slate-300 rounded-xl shadow-xs flex flex-col gap-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Bell className="w-4 h-4 text-slate-800" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              SLA &amp; Notification Alerts
            </h3>
          </div>
          
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-700 font-semibold">Email Alerts on 14-Day SLA Expiry</span>
            <button
              onClick={() => setEmailAlerts(!emailAlerts)}
              className={`w-9 h-5 rounded-full transition-all relative cursor-pointer ${
                emailAlerts ? 'bg-slate-900' : 'bg-slate-300'
              }`}
            >
              <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${emailAlerts ? 'left-4.5' : 'left-0.5'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-700 font-semibold">Auto-Escalate Critical Matters (Rule 5)</span>
            <button
              onClick={() => setSlaEscalations(!slaEscalations)}
              className={`w-9 h-5 rounded-full transition-all relative cursor-pointer ${
                slaEscalations ? 'bg-slate-900' : 'bg-slate-300'
              }`}
            >
              <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${slaEscalations ? 'left-4.5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-300 rounded-xl shadow-xs flex flex-col gap-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Globe className="w-4 h-4 text-slate-800" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              Legal Jurisdiction &amp; Compliance Standards
            </h3>
          </div>
          
          <div className="text-xs text-slate-600 flex flex-col gap-1.5 pt-1">
            <div><strong>Primary Jurisdiction:</strong> Ontario &amp; British Columbia (Canada)</div>
            <div><strong>Independent Counsel Requirement:</strong> Mandatory Dual Law Firm Verification</div>
            <div><strong>Contract Versioning:</strong> v2.1 Standards Compliant</div>
          </div>
        </div>
      </div>

      {/* Legal Rules Compliance Registry */}
      <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-slate-900" />
            <div>
              <h2 className="text-base font-bold font-sans text-slate-900 tracking-tight">
                Automated Legal Rules Registry ({rulesState.filter(r => r.status !== 'SUSPENDED').length} / {rulesState.length} Active)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Enforces compliance rules governing lawyer assignments, SLA clocks, and questionnaire locking.
              </p>
            </div>
          </div>
          <span className="badge-rose-pill text-xs font-bold px-3 py-1">System Enforced</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {rulesState.map((r) => {
            const isRuleActive = r.status === 'ACTIVE' || r.status === 'ENFORCED';
            return (
              <div
                key={r.id}
                className={`p-5 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                  isRuleActive
                    ? 'bg-white border-slate-300 shadow-xs hover:border-slate-400'
                    : 'bg-slate-50/80 border-slate-200 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                      {r.id}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 tracking-tight">
                      {r.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleToggleRule(r.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      isRuleActive
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                        : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
                    }`}
                  >
                    {isRuleActive ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{r.status}</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-slate-400" />
                        <span>SUSPENDED</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                  {r.description}
                </p>

                <div className="text-[11px] font-medium text-slate-500 pt-2 border-t border-slate-100">
                  Trigger Condition: <strong className="text-slate-800 font-bold">{r.trigger}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DEVELOPER API DEBUG MODE (ONLY SHOWN IF DEV TOGGLE IS TURNED ON) */}
      {devApiMode && (
        <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-xs flex flex-col gap-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-slate-900" />
              <div>
                <h2 className="text-base font-bold font-sans text-slate-900 tracking-tight">
                  Developer REST API Terminal &amp; Endpoint Console
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Advanced developer mode: test REST API endpoints and inspect JSON payload logs.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowRawJson(!showRawJson)}
              className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-lg border border-slate-300 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Code className="w-3.5 h-3.5" />
              <span>{showRawJson ? 'Show Operations View' : 'Show Technical Raw JSON'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 flex-wrap border-t border-b border-slate-100 py-4">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Test Endpoints:</span>
            <button
              onClick={() => handleTestCall('/api/cm/cases', 'GET', 'Sync Active Matters List', 'RULE_ALL_CASES')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 text-xs px-3.5 py-2 rounded-lg font-bold font-sans flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sync All Matters (GET /api/cm/cases)</span>
            </button>
            <button
              onClick={() => handleTestCall('/api/cm/cases/SR12345/approve', 'POST', 'Case Approval & Conflict Check', 'RULE_1_CONFLICT_ENGINE')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 text-xs px-3.5 py-2 rounded-lg font-bold font-sans flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-emerald-600" />
              <span>Approve Case SR12345 (POST /api/cm/cases/approve)</span>
            </button>
            <button
              onClick={() => handleTestCall('/api/cm/cases/SR12347/escalate', 'POST', 'Escalate Matter Priority', 'RULE_5_ESCALATION')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 text-xs px-3.5 py-2 rounded-lg font-bold font-sans flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-rose-600" />
              <span>Escalate Case SR12347 (POST /api/cm/cases/escalate)</span>
            </button>
          </div>

          {latestLog ? (
            showRawJson ? (
              <div className="bg-[#0d1527] border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-400 shadow-inner overflow-x-auto min-h-[160px]">
                <div className="text-rose-400 font-bold mb-2">
                  // [{latestLog.method}] {latestLog.endpoint} (Status 200 OK — {latestLog.timestamp})
                </div>
                <pre className="text-slate-300 text-[11px] leading-relaxed">
                  {JSON.stringify(latestLog.payload, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-slate-900 text-white flex flex-col gap-3 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold font-mono px-2.5 py-0.5 rounded border border-emerald-500/40">
                      200 OK SUCCESS
                    </span>
                    <span className="font-mono text-xs text-slate-300">
                      [{latestLog.method}] {latestLog.endpoint}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{latestLog.timestamp}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Operation Action</span>
                    <span className="font-bold text-white text-sm">{latestLog.payload.action || 'API Event'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Rules Evaluated</span>
                    <span className="font-bold text-emerald-400 text-sm">{latestLog.payload.ruleName || latestLog.payload.ruleEvaluated || 'Enforced'}</span>
                  </div>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 text-xs text-slate-200">
                  <strong>System Outcome:</strong> {latestLog.payload.result || 'Transaction completed successfully.'}
                </div>
              </div>
            )
          ) : (
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 italic">
              Click any test endpoint button above to trigger live REST API logs.
            </div>
          )}
        </div>
      )}

    </div>
  );
};
