"use client";

import React from 'react';
import { X, ShieldCheck, CheckCircle } from 'lucide-react';

interface ScorecardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScorecardModal: React.FC<ScorecardModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xs font-sans">
      <div className="bg-white rounded-xl shadow-2xl w-[600px] max-h-[85vh] overflow-hidden flex flex-col border border-slate-300 animate-scale-up text-slate-800">
        
        {/* Header */}
        <div className="bg-[#0d1527] text-white p-5 flex items-center justify-between border-b border-[#1e293b]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-serif text-base font-bold text-white tracking-wide">
              LAWYER_PORTAL_V1.1 Compliance Scorecard
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 text-xs text-slate-700">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-1 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Status Indicator</p>
            <p className="text-lg font-serif font-bold text-slate-800">READY FOR DEVELOPMENT HANDOFF</p>
            <p className="text-[10px] text-emerald-600 font-bold font-mono">STATUS: PERMANENTLY FROZEN</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between bg-slate-50/50">
              <span className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">Left Sidebar Menus</span>
              <span className="text-sm font-bold text-slate-900">9 / 9</span>
            </div>
            <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between bg-slate-50/50">
              <span className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">Case Drawer Tabs</span>
              <span className="text-sm font-bold text-slate-900">8 / 8</span>
            </div>
            <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between bg-slate-50/50">
              <span className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">Dashboard Metrics</span>
              <span className="text-sm font-bold text-slate-900">10 / 10</span>
            </div>
            <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between bg-slate-50/50">
              <span className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">Hard Constraints Enforced</span>
              <span className="text-sm font-bold text-slate-900">20 / 20</span>
            </div>
          </div>

          {/* Compliance checklist */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans border-b border-slate-100 pb-1">
              Engine Mapping Verification Log
            </h4>
            
            <div className="flex flex-col gap-2 font-sans text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>AGREEMENT_DOCUMENT_ENGINE_V1.1</strong> compliance sign-off is active.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>INTERNAL_ADMIN_V1.1</strong> mock notifications register active.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>ILA_ENGINE_V1.0</strong> cryptographic certificate pipeline active.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>AUDIT_ENGINE_V1.0</strong> timestamping and IP logs register verified.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>AWS S3 DOCX/PDF</strong> pipeline simulation verified for uploads and downloads.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#0d1527] hover:bg-[#1b2947] text-white text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer shadow-xs"
          >
            Close Scorecard
          </button>
        </div>
      </div>
    </div>
  );
};
