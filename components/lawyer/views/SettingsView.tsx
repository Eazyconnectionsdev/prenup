"use client";

import React, { useState } from 'react';
import { Settings, Shield, Bell, Key } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [notifications, setNotifications] = useState({
    emailOnVersion: true,
    emailOnApproval: true,
    smsOnExecution: false,
    auditDailyDigest: true,
  });

  const [mfaEnabled, setMfaEnabled] = useState(true);

  return (
    <div className="flex flex-col gap-6 max-w-[960px] font-sans">
      <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-xs flex flex-col gap-6">
        {/* Section 1: Notifications */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2.5 flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-emerald-600" />
            <span>Workflow Event Notifications</span>
          </h3>

          <div className="flex flex-col gap-3 text-xs text-slate-700">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.emailOnVersion}
                onChange={(e) => setNotifications(prev => ({ ...prev, emailOnVersion: e.target.checked }))}
                className="w-4 h-4 border-slate-300 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <p className="font-bold text-slate-800">Email alert on new agreement versions</p>
                <p className="text-slate-400 mt-0.5">Notify instantly when opposing counsel uploads an updated draft</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.emailOnApproval}
                onChange={(e) => setNotifications(prev => ({ ...prev, emailOnApproval: e.target.checked }))}
                className="w-4 h-4 border-slate-300 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <p className="font-bold text-slate-800">Email alert on client signature approvals</p>
                <p className="text-slate-400 mt-0.5">Notify when client signs-off on clean masters or schedules</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.smsOnExecution}
                onChange={(e) => setNotifications(prev => ({ ...prev, smsOnExecution: e.target.checked }))}
                className="w-4 h-4 border-slate-300 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <p className="font-bold text-slate-800">SMS alert on final execution completion</p>
                <p className="text-slate-400 mt-0.5">Receive immediate mobile notifications on CLOSED / executed packs</p>
              </div>
            </label>
          </div>
        </div>

        {/* Section 2: Security & Encryption */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2.5 flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Cryptographic &amp; Security Controls</span>
          </h3>

          <div className="flex flex-col gap-3 text-xs text-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Multi-Factor Authentication (MFA)</p>
                <p className="text-slate-400 mt-0.5">Requires secure OTP for signing and approving versions</p>
              </div>
              <button
                onClick={() => setMfaEnabled(!mfaEnabled)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer border ${
                  mfaEnabled
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-slate-50 border-slate-300 text-slate-700'
                }`}
              >
                {mfaEnabled ? 'Enforced & Active' : 'Enable MFA'}
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <div>
                <p className="font-bold text-slate-800">IP-Logged Auditing</p>
                <p className="text-slate-400 mt-0.5">Every action is cryptographically timestamped and IP logged (Locked rule)</p>
              </div>
              <span className="font-mono text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded uppercase font-bold">
                ENFORCED
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
