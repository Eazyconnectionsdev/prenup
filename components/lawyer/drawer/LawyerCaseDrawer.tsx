"use client";

import React, { useState, useEffect } from 'react';
import {
  X, Lock, Download, FileText, Upload, CheckCircle2, AlertTriangle, ShieldCheck,
  Clock, Mail, MessageSquare, Plus, FileCode, Check, Eye
} from 'lucide-react';
import { LawyerCase, LawyerPersona, CaseTabId, CaseStatus, AgreementVersion, SummaryNote, Appendix } from '../../../types/lawyer-portal';

interface CaseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  caseObj: LawyerCase | null;
  activePersona: LawyerPersona;
  onUploadVersion: (caseId: string, versionNum: string, desc: string) => void;
  onUploadCleanMaster: (caseId: string) => void;
  onApproveCleanMaster: (caseId: string) => void;
  onClientApprove: (caseId: string, party: 'p1' | 'p2') => void;
  onIssueIla: (caseId: string, party: 'p1' | 'p2') => void;
  onSignAgreement: (caseId: string) => void;
  onSaveNote: (caseId: string, notes: string) => void;
  onUploadAppendix: (caseId: string, section: 'A' | 'B' | 'C', title: string, desc: string, fileName: string) => void;
}

export const LawyerCaseDrawer: React.FC<CaseDrawerProps> = ({
  isOpen,
  onClose,
  caseObj,
  activePersona,
  onUploadVersion,
  onUploadCleanMaster,
  onApproveCleanMaster,
  onClientApprove,
  onIssueIla,
  onSignAgreement,
  onSaveNote,
  onUploadAppendix,
}) => {
  const [activeTab, setActiveTab] = useState<CaseTabId>('overview');
  const [noteText, setNoteText] = useState('');
  const [newVersionNum, setNewVersionNum] = useState('');
  const [newVersionDesc, setNewVersionDesc] = useState('');
  
  // Appendix uploads state
  const [appendixType, setAppendixType] = useState<'A' | 'B' | 'C'>('A');
  const [appendixTitle, setAppendixTitle] = useState('');
  const [appendixDesc, setAppendixDesc] = useState('');
  const [appendixFileName, setAppendixFileName] = useState('');
  
  // Execution Pack modal state
  const [showExecutionPackModal, setShowExecutionPackModal] = useState(false);
  const [rbacError, setRbacError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab('overview');
      setRbacError(null);
    }
  }, [isOpen, caseObj]);

  if (!isOpen || !caseObj) return null;

  const getLawyerName = (persona: LawyerPersona) => {
    if (persona === 'L1') return 'Robert Miller, Esq.';
    if (persona === 'L2') return 'Mark Sterling, Esq.';
    return 'Clara Conner, Esq.';
  };

  const activeLawyer = getLawyerName(activePersona);
  const isP1Lawyer = activePersona === 'L1' || (activePersona === 'L3' && caseObj.p1Lawyer === activeLawyer);
  const isP2Lawyer = activePersona === 'L2' || (activePersona === 'L3' && caseObj.p2Lawyer === activeLawyer);

  // Hard constraints check helpers
  const canSeeClientForms = (party: 'p1' | 'p2') => {
    // Constraint 2: Lawyer only sees their client
    if (activePersona === 'L1' && party !== 'p1') return false;
    if (activePersona === 'L2' && party !== 'p2') return false;
    if (activePersona === 'L3') return false; // Opposing neutral cannot see questionnaires
    return true;
  };

  const canSeeOpposingNotes = () => {
    // Constraint 10: Lawyer cannot view opposing notes
    return false; // Under V1.1 L1 sees only L1, L2 sees only L2
  };

  const canSeeOpposingIla = (party: 'p1' | 'p2') => {
    // Constraint 9: Lawyer cannot view opposing ILA
    if (activePersona === 'L1' && party !== 'p1') return false;
    if (activePersona === 'L2' && party !== 'p2') return false;
    return true;
  };

  const handleSaveNoteClick = () => {
    if (!noteText.trim()) return;
    onSaveNote(caseObj.id, noteText.trim());
    setNoteText('');
  };

  const handleUploadVersionClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVersionNum.trim() || !newVersionDesc.trim()) return;
    onUploadVersion(caseObj.id, newVersionNum.trim(), newVersionDesc.trim());
    setNewVersionNum('');
    setNewVersionDesc('');
  };

  const handleUploadAppendixClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appendixTitle.trim() || !appendixDesc.trim() || !appendixFileName.trim()) return;
    onUploadAppendix(caseObj.id, appendixType, appendixTitle.trim(), appendixDesc.trim(), appendixFileName.trim());
    setAppendixTitle('');
    setAppendixDesc('');
    setAppendixFileName('');
  };

  const triggerRbacProhibited = (message: string) => {
    setRbacError(message);
    setTimeout(() => setRbacError(null), 4000);
  };

  const getStatusBadgeStyle = (status: CaseStatus) => {
    switch (status) {
      case 'FORMS_LOCKED':
        return 'border border-amber-300 text-amber-800 bg-amber-50';
      case 'LAWYER_REVIEW':
        return 'border border-blue-300 text-blue-800 bg-blue-50';
      case 'AWAITING_COUNTERPARTY_LAWYER_APPROVAL':
        return 'border border-indigo-300 text-indigo-800 bg-indigo-50';
      case 'CLIENT_APPROVAL_PENDING':
        return 'border border-purple-300 text-purple-800 bg-purple-50';
      case 'CLIENT_PARTIALLY_APPROVED':
        return 'border border-pink-300 text-pink-800 bg-pink-50';
      case 'RETURNED_TO_LAWYERS':
        return 'border border-red-300 text-red-800 bg-red-50';
      case 'CLIENT_APPROVED':
        return 'border border-emerald-300 text-emerald-800 bg-emerald-50';
      case 'ILA_P1_COMPLETE':
      case 'ILA_P2_COMPLETE':
        return 'border border-teal-300 text-teal-800 bg-teal-50';
      case 'READY_FOR_SIGNING':
        return 'border border-green-300 text-green-800 bg-green-50 animate-pulse';
      case 'CLOSED':
        return 'border border-slate-300 text-slate-700 bg-slate-100';
      default:
        return 'border border-slate-200 text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="relative w-[780px] h-full bg-[#f7f4ee] shadow-2xl flex flex-col z-10 border-l border-slate-300 animate-slide-in text-slate-800 font-sans">
        
        {/* RBAC Error Banner */}
        {rbacError && (
          <div className="absolute top-4 left-4 right-4 bg-red-900 text-red-100 border border-red-700 p-3 rounded-lg flex items-center gap-2.5 z-50 shadow-lg animate-bounce">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <div className="text-xs font-bold font-sans">
              RBAC PROHIBITED: {rbacError}
            </div>
          </div>
        )}

        {/* Drawer Header */}
        <div className="bg-[#0d1527] text-white p-6 flex flex-col gap-4 border-b border-[#1e293b]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-base font-bold text-slate-300">{caseObj.id}</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getStatusBadgeStyle(caseObj.status)}`}>
                {caseObj.status.replace(/_/g, ' ')}
              </span>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <h2 className="text-lg font-serif font-bold text-white tracking-wide">
              {caseObj.p1Name} &amp; {caseObj.p2Name}
            </h2>
            <p className="text-[10px] text-emerald-400 font-mono mt-1">
              LAWYER_PORTAL_V1.1 // SERVICE: {caseObj.service.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Case Tabs Navigation */}
        <div className="bg-white border-b border-slate-200 px-4 flex items-center gap-1 overflow-x-auto shrink-0">
          {([
            { id: 'overview', label: '1. Overview' },
            { id: 'client_details', label: '2. Client Details' },
            { id: 'versions', label: '3. Agreement Versions' },
            { id: 'notes', label: '4. Summary Notes' },
            { id: 'appendices', label: '5. Appendices' },
            { id: 'ila', label: '6. ILA Certificate' },
            { id: 'timeline', label: '7. Timeline' },
            { id: 'emails', label: '8. Emails' },
          ] as { id: CaseTabId; label: string }[]).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 px-3 border-b-2 text-xs font-bold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-[#0d1527] text-[#0d1527]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Drawer Body (Scrollable contents) */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          
          {/* T1: Overview Tab */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-6">
              <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs flex flex-col gap-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-sans border-b border-slate-100 pb-2">
                  Matter Metadata Indicators
                </h3>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-400 font-bold uppercase text-[9px]">Case Code ID</span>
                    <span className="font-mono font-bold text-slate-800 text-sm">{caseObj.id}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-400 font-bold uppercase text-[9px]">Service Plan</span>
                    <span className="font-semibold text-slate-800">{caseObj.service}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-400 font-bold uppercase text-[9px]">Primary status</span>
                    <span className="font-semibold text-slate-800 uppercase">{caseObj.status.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-400 font-bold uppercase text-[9px]">Days in State</span>
                    <span className="font-mono font-bold text-slate-800">{caseObj.daysInStatus} Days</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-400 font-bold uppercase text-[9px]">Lawyer-facing (Current Version)</span>
                    <span className="font-mono font-bold text-slate-800">{caseObj.currentVersion}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-400 font-bold uppercase text-[9px]">Client-facing (Published Version)</span>
                    <span className="font-mono font-bold text-slate-800">{caseObj.publishedVersion}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-400 font-bold uppercase text-[9px]">Last Activity Logged</span>
                    <span className="text-slate-700">{caseObj.lastActivity}</span>
                  </div>
                </div>
              </div>

              {/* Roster Information */}
              <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs flex flex-col gap-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-sans border-b border-slate-100 pb-2">
                  Counsel and Roster directory
                </h3>

                <div className="grid grid-cols-2 gap-6 text-xs">
                  <div className="flex flex-col gap-2">
                    <h4 className="font-bold text-emerald-700 uppercase text-[10px]">Client 1 &amp; Counsel</h4>
                    <p className="text-slate-800 font-semibold">{caseObj.p1Name}</p>
                    <p className="text-slate-500 font-bold text-[10px] mt-1">FIRM / LAWYER</p>
                    <p className="text-slate-700">{caseObj.p1Firm || 'Unassigned'}</p>
                    <p className="text-slate-600 italic">{caseObj.p1Lawyer || 'Unassigned'}</p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <h4 className="font-bold text-emerald-700 uppercase text-[10px]">Client 2 &amp; Counsel</h4>
                    <p className="text-slate-800 font-semibold">{caseObj.p2Name}</p>
                    <p className="text-slate-500 font-bold text-[10px] mt-1">FIRM / LAWYER</p>
                    <p className="text-slate-700">{caseObj.p2Firm || 'Unassigned'}</p>
                    <p className="text-slate-600 italic">{caseObj.p2Lawyer || 'Unassigned'}</p>
                  </div>
                </div>
              </div>

              {/* Execution Actions (If ready) */}
              {(caseObj.status === 'READY_FOR_SIGNING' || caseObj.status === 'CLOSED') && (
                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-5 flex flex-col gap-3 shadow-xs">
                  <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider font-sans flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Final Execution Pack Ready</span>
                  </h3>
                  <p className="text-xs text-slate-600">
                    The matter has reached the execution stage. All signatures are complete. The final pack is compiled.
                  </p>
                  <button
                    onClick={() => setShowExecutionPackModal(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg border border-emerald-500 transition-all flex items-center gap-2 self-start cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download final Execution Pack (LP-2026-001_FINAL_PACK.pdf)</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* T2: Client Details Tab */}
          {activeTab === 'client_details' && (
            <div className="flex flex-col gap-6">
              {/* Row: Partner 1 Client forms */}
              <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">
                    Client 1 Questionnaire Responses ({caseObj.p1Name})
                  </h3>
                  <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">READ ONLY</span>
                </div>

                {canSeeClientForms('p1') ? (
                  <div className="flex flex-col gap-4 text-xs text-slate-700">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-400 font-bold text-[9px] uppercase">DOB / Profession</span>
                        <p className="text-slate-800 font-semibold">{caseObj.p1Forms.personalInfo.dob} | {caseObj.p1Forms.personalInfo.profession}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold text-[9px] uppercase">Address</span>
                        <p className="text-slate-800 font-semibold">{caseObj.p1Forms.personalInfo.address}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 border-t border-slate-50 pt-2.5">
                      <div>
                        <span className="text-slate-400 font-bold text-[9px] uppercase">Premarital Assets</span>
                        <p className="text-slate-800 font-semibold">Real Estate: {caseObj.p1Forms.assets.realEstateValue}</p>
                        <p className="text-slate-600">Balances: {caseObj.p1Forms.assets.bankBalances}</p>
                        <p className="text-slate-600">Investments: {caseObj.p1Forms.assets.investmentsValue}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold text-[9px] uppercase">Annual Income</span>
                        <p className="text-slate-800 font-semibold">Salary: {caseObj.p1Forms.income.annualSalary}</p>
                        <p className="text-slate-600">Dividends: {caseObj.p1Forms.income.dividends}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold text-[9px] uppercase">Liabilities</span>
                        <p className="text-slate-800 font-semibold">Mortgages: {caseObj.p1Forms.liabilities.mortgages}</p>
                        <p className="text-slate-600">Credit Cards: {caseObj.p1Forms.liabilities.creditCards}</p>
                      </div>
                    </div>
                    <div className="border-t border-slate-50 pt-2.5">
                      <span className="text-slate-400 font-bold text-[9px] uppercase">Agreement Objectives</span>
                      <p className="text-slate-700 italic mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        "{caseObj.p1Forms.questionnaireResponses.objectives}"
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-center">
                    <Lock className="w-8 h-8 text-red-700" />
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-bold text-red-900 uppercase tracking-wide">Access Prohibited (Constraint #2)</p>
                      <p className="text-[11px] text-red-700">
                        As a lawyer for Client 2, you are prohibited from viewing Client 1's private questionnaires.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Row: Partner 2 Client forms */}
              <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">
                    Client 2 Questionnaire Responses ({caseObj.p2Name})
                  </h3>
                  <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">READ ONLY</span>
                </div>

                {canSeeClientForms('p2') ? (
                  <div className="flex flex-col gap-4 text-xs text-slate-700">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-400 font-bold text-[9px] uppercase">DOB / Profession</span>
                        <p className="text-slate-800 font-semibold">{caseObj.p2Forms.personalInfo.dob} | {caseObj.p2Forms.personalInfo.profession}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold text-[9px] uppercase">Address</span>
                        <p className="text-slate-800 font-semibold">{caseObj.p2Forms.personalInfo.address}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 border-t border-slate-50 pt-2.5">
                      <div>
                        <span className="text-slate-400 font-bold text-[9px] uppercase">Premarital Assets</span>
                        <p className="text-slate-800 font-semibold">Real Estate: {caseObj.p2Forms.assets.realEstateValue}</p>
                        <p className="text-slate-600">Balances: {caseObj.p2Forms.assets.bankBalances}</p>
                        <p className="text-slate-600">Investments: {caseObj.p2Forms.assets.investmentsValue}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold text-[9px] uppercase">Annual Income</span>
                        <p className="text-slate-800 font-semibold">Salary: {caseObj.p2Forms.income.annualSalary}</p>
                        <p className="text-slate-600">Dividends: {caseObj.p2Forms.income.dividends}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold text-[9px] uppercase">Liabilities</span>
                        <p className="text-slate-800 font-semibold">Mortgages: {caseObj.p2Forms.liabilities.mortgages}</p>
                        <p className="text-slate-600">Credit Cards: {caseObj.p2Forms.liabilities.creditCards}</p>
                      </div>
                    </div>
                    <div className="border-t border-slate-50 pt-2.5">
                      <span className="text-slate-400 font-bold text-[9px] uppercase">Agreement Objectives</span>
                      <p className="text-slate-700 italic mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        "{caseObj.p2Forms.questionnaireResponses.objectives}"
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-center">
                    <Lock className="w-8 h-8 text-red-700" />
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-bold text-red-900 uppercase tracking-wide">Access Prohibited (Constraint #2)</p>
                      <p className="text-[11px] text-red-700">
                        As a lawyer for Client 1, you are prohibited from viewing Client 2's private questionnaires.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* T3: Agreement Versions Tab */}
          {activeTab === 'versions' && (
            <div className="flex flex-col gap-6">
              {/* Flow progression */}
              <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-xs">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                  Version Flow Engine Transition Pipeline
                </span>
                
                <div className="flex flex-col gap-2.5 mt-3 text-[10px] font-mono">
                  <div className="flex items-center flex-wrap gap-2.5 leading-none">
                    <span className={`px-2 py-0.5 rounded ${caseObj.status === 'LAWYER_REVIEW' ? 'bg-[#0d1527] text-white' : 'bg-slate-200 text-slate-500'}`}>v1.0-v1.4 drafts</span>
                    <span className="text-slate-400">&gt;</span>
                    <span className={`px-2 py-0.5 rounded ${caseObj.status === 'AWAITING_COUNTERPARTY_LAWYER_APPROVAL' ? 'bg-[#0d1527] text-white animate-pulse' : 'bg-slate-200 text-slate-500'}`}>v1.5 Clean Master</span>
                    <span className="text-slate-400">&gt;</span>
                    <span className={`px-2 py-0.5 rounded ${caseObj.status === 'CLIENT_APPROVAL_PENDING' ? 'bg-[#0d1527] text-white' : 'bg-slate-200 text-slate-500'}`}>Client Approval</span>
                    <span className="text-slate-400">&gt;</span>
                    <span className={`px-2 py-0.5 rounded ${caseObj.status === 'CLIENT_APPROVED' || caseObj.status === 'ILA_P1_COMPLETE' || caseObj.status === 'ILA_P2_COMPLETE' ? 'bg-[#0d1527] text-white' : 'bg-slate-200 text-slate-500'}`}>ILA Signatures</span>
                    <span className="text-slate-400">&gt;</span>
                    <span className={`px-2 py-0.5 rounded ${caseObj.status === 'READY_FOR_SIGNING' ? 'bg-[#0d1527] text-white' : 'bg-slate-200 text-slate-500'}`}>Ready for Signing</span>
                    <span className="text-slate-400">&gt;</span>
                    <span className={`px-2 py-0.5 rounded ${caseObj.status === 'CLOSED' ? 'bg-green-700 text-white font-bold' : 'bg-slate-200 text-slate-500'}`}>Closed</span>
                  </div>
                </div>
              </div>

              {/* Upload clean master & update version actions */}
              <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs flex flex-col gap-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans border-b border-slate-100 pb-2">
                  Agreement Actions Available
                </h3>

                <div className="flex flex-wrap gap-3">
                  {/* Upload new version */}
                  {caseObj.status === 'LAWYER_REVIEW' && (
                    <form onSubmit={handleUploadVersionClick} className="w-full flex flex-col gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Upload New draft Version</span>
                      
                      <div className="flex gap-3">
                        <input
                          type="text"
                          required
                          value={newVersionNum}
                          onChange={(e) => setNewVersionNum(e.target.value)}
                          placeholder="e.g. v1.5"
                          className="bg-white border border-slate-200 text-xs px-3 py-1.5 rounded-lg font-sans outline-none focus:border-slate-400 w-[120px]"
                        />
                        <input
                          type="text"
                          required
                          value={newVersionDesc}
                          onChange={(e) => setNewVersionDesc(e.target.value)}
                          placeholder="Description of amendments..."
                          className="bg-white border border-slate-200 text-xs px-3 py-1.5 rounded-lg font-sans outline-none focus:border-slate-400 flex-1"
                        />
                        <button
                          type="submit"
                          className="bg-[#0d1527] text-white text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-[#1b2947] transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Draft</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Clean Master action */}
                  {caseObj.status === 'LAWYER_REVIEW' && (
                    <div className="w-full flex items-center justify-between p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-xl">
                      <div>
                        <p className="text-xs font-bold text-emerald-900">Declare Agreement Draft Complete</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Upload Clean Master to submit for opposing counsel sign-off</p>
                      </div>
                      <button
                        onClick={() => onUploadCleanMaster(caseObj.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg border border-emerald-500 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <FileCode className="w-3.5 h-3.5" />
                        <span>Upload Clean Master (v1.5)</span>
                      </button>
                    </div>
                  )}

                  {/* Approve opposing Clean Master */}
                  {caseObj.status === 'AWAITING_COUNTERPARTY_LAWYER_APPROVAL' && (
                    <div className="w-full flex items-center justify-between p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl">
                      <div>
                        <p className="text-xs font-bold text-indigo-900">Opposing Clean Master Sign-Off Required</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Verify and approve clean master for Client execution routing</p>
                      </div>
                      <button
                        onClick={() => onApproveCleanMaster(caseObj.id)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg border border-indigo-500 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve Clean Master</span>
                      </button>
                    </div>
                  )}

                  {/* Client approvals buttons */}
                  {caseObj.status === 'CLIENT_APPROVAL_PENDING' && (
                    <div className="w-full flex flex-col gap-3.5 p-3.5 bg-purple-50 border border-purple-200 rounded-xl">
                      <div>
                        <p className="text-xs font-bold text-purple-900">Client Approvals Pending</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Submit approvals on behalf of client for mock walkthrough simulations</p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            if (activePersona === 'L2') {
                              triggerRbacProhibited("Partner 2 Lawyer cannot sign-off for Partner 1's client");
                            } else {
                              onClientApprove(caseObj.id, 'p1');
                            }
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-lg border border-purple-500 transition-all cursor-pointer"
                        >
                          Approve Client 1 ({caseObj.p1Name})
                        </button>
                        <button
                          onClick={() => {
                            if (activePersona === 'L1') {
                              triggerRbacProhibited("Partner 1 Lawyer cannot sign-off for Partner 2's client");
                            } else {
                              onClientApprove(caseObj.id, 'p2');
                            }
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-lg border border-purple-500 transition-all cursor-pointer"
                        >
                          Approve Client 2 ({caseObj.p2Name})
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Client Partially Approved */}
                  {caseObj.status === 'CLIENT_PARTIALLY_APPROVED' && (
                    <div className="w-full flex flex-col gap-3.5 p-3.5 bg-pink-50 border border-pink-200 rounded-xl">
                      <div>
                        <p className="text-xs font-bold text-pink-900">Client Partially Approved</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">One client has signed off. The remaining client approval is required.</p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            if (activePersona === 'L2') {
                              triggerRbacProhibited("Partner 2 Lawyer cannot sign-off for Partner 1's client");
                            } else {
                              onClientApprove(caseObj.id, 'p1');
                            }
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-lg border border-purple-500 transition-all cursor-pointer"
                        >
                          Approve Client 1 ({caseObj.p1Name})
                        </button>
                        <button
                          onClick={() => {
                            if (activePersona === 'L1') {
                              triggerRbacProhibited("Partner 1 Lawyer cannot sign-off for Partner 2's client");
                            } else {
                              onClientApprove(caseObj.id, 'p2');
                            }
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-lg border border-purple-500 transition-all cursor-pointer"
                        >
                          Approve Client 2 ({caseObj.p2Name})
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Issue ILA Certificates */}
                  {(caseObj.status === 'CLIENT_APPROVED' || caseObj.status === 'ILA_P1_COMPLETE' || caseObj.status === 'ILA_P2_COMPLETE') && (
                    <div className="w-full flex flex-col gap-3 p-3.5 bg-teal-50 border border-teal-200 rounded-xl">
                      <div>
                        <p className="text-xs font-bold text-teal-900">Independent Legal Advice (ILA) Certificates</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Certificates must be issued by corresponding attorneys (Constraint #9 check)</p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            if (activePersona === 'L2') {
                              triggerRbacProhibited("L2 Attorney cannot issue ILA Certificate for Client 1");
                            } else {
                              onIssueIla(caseObj.id, 'p1');
                            }
                          }}
                          className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-lg border border-teal-500 transition-all cursor-pointer"
                        >
                          Issue Client 1 ILA ({caseObj.p1Name})
                        </button>
                        <button
                          onClick={() => {
                            if (activePersona === 'L1') {
                              triggerRbacProhibited("L1 Attorney cannot issue ILA Certificate for Client 2");
                            } else {
                              onIssueIla(caseObj.id, 'p2');
                            }
                          }}
                          className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-lg border border-teal-500 transition-all cursor-pointer"
                        >
                          Issue Client 2 ILA ({caseObj.p2Name})
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Sign final agreement */}
                  {caseObj.status === 'READY_FOR_SIGNING' && (
                    <div className="w-full flex items-center justify-between p-3.5 bg-green-50 border border-green-200 rounded-xl">
                      <div>
                        <p className="text-xs font-bold text-green-900">Sign Final Agreement</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Complete witness sign-offs and finalize agreement (CLOSED state)</p>
                      </div>
                      <button
                        onClick={() => onSignAgreement(caseObj.id)}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-lg border border-green-500 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Sign &amp; Finalize Case</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Version list */}
              <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-xs">
                <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                    Agreement Versions list (Constraint #11: Immutable)
                  </span>
                </div>

                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="bg-slate-100 text-slate-500 uppercase tracking-wider text-[9px] font-bold border-b border-slate-200">
                      <th className="p-3 pl-5">Version</th>
                      <th className="p-3">Uploaded By</th>
                      <th className="p-3">Published</th>
                      <th className="p-3">Upload Date</th>
                      <th className="p-3 pr-5">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {caseObj.versions.map((v) => (
                      <tr key={v.version} className="border-b border-slate-100 text-slate-700 hover:bg-slate-50">
                        <td className="p-3 pl-5 font-mono font-bold text-slate-900">{v.version}</td>
                        <td className="p-3 font-semibold">{v.uploadedBy}</td>
                        <td className="p-3">
                          <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                            v.published === 'YES'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : v.published === 'Pending'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {v.published}
                          </span>
                        </td>
                        <td className="p-3 font-mono">{v.uploadedDate}</td>
                        <td className="p-3 pr-5">
                          <button
                            onClick={() => {
                              if (v.published === 'YES' || v.published === 'Pending') {
                                alert(`Previewing agreement PDF path: ${v.s3Path}`);
                              } else {
                                alert(`Downloading copy: ${v.s3Path}`);
                              }
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 border border-slate-300 rounded font-bold text-[10px] transition-all cursor-pointer"
                          >
                            {v.published === 'YES' ? 'Preview' : 'Download'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* T4: Summary Notes Tab */}
          {activeTab === 'notes' && (
            <div className="flex flex-col gap-6">
              <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">
                    Confidential Summary Notes (Constraint #10: L1 only sees L1, L2 only L2)
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                    {activePersona} Workspace
                  </span>
                </div>

                {/* Notes log */}
                <div className="flex flex-col gap-3">
                  {caseObj.notes.filter(n => n.visibleTo === activePersona || n.visibleTo === 'BOTH').length > 0 ? (
                    caseObj.notes
                      .filter(n => n.visibleTo === activePersona || n.visibleTo === 'BOTH')
                      .map((note, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col gap-1.5 text-xs text-slate-700">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                            <span>Author: {note.createdBy}</span>
                            <span>{note.createdDate} | Version: {note.version}</span>
                          </div>
                          <p className="text-slate-800 italic mt-0.5">"{note.notes}"</p>
                        </div>
                      ))
                  ) : (
                    <p className="text-xs text-slate-400 font-sans italic text-center py-4">
                      No confidential notes added yet by {activeLawyer}.
                    </p>
                  )}
                </div>

                {/* Add note form */}
                {activePersona !== 'L3' ? (
                  <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Add private summary notes (visible ONLY to your lawyer profile)..."
                      className="bg-white border border-slate-300 text-xs p-3 rounded-xl font-sans outline-none focus:border-slate-400 resize-none h-[80px]"
                    />
                    <button
                      onClick={handleSaveNoteClick}
                      className="bg-[#0d1527] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#1b2947] transition-all cursor-pointer self-end flex items-center gap-1 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Save Private Note</span>
                    </button>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-2 text-red-800 text-xs">
                    <Lock className="w-4 h-4 shrink-0" />
                    <span>Neutral third party cannot record client summary notes.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* T5: Appendices Tab */}
          {activeTab === 'appendices' && (
            <div className="flex flex-col gap-6">
              {/* Form to upload new appendix */}
              {caseObj.status === 'LAWYER_REVIEW' && (
                <form onSubmit={handleUploadAppendixClick} className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs flex flex-col gap-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans border-b border-slate-100 pb-2">
                    Upload Disclosure Document to Appendices
                  </h3>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-400 font-bold uppercase text-[9px]">Appendix Section Slot</label>
                      <select
                        value={appendixType}
                        onChange={(e) => setAppendixType(e.target.value as any)}
                        className="bg-slate-50 border border-slate-300 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-sans outline-none cursor-pointer"
                      >
                        <option value="A">Appendix A: Property Documents</option>
                        <option value="B">Appendix B: Bank Statements</option>
                        <option value="C">Appendix C: Trust Documentation</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-400 font-bold uppercase text-[9px]">Document File Name</label>
                      <input
                        type="text"
                        required
                        value={appendixFileName}
                        onChange={(e) => setAppendixFileName(e.target.value)}
                        placeholder="e.g. deed_toronto_property.pdf"
                        className="bg-white border border-slate-300 px-3 py-1.5 rounded-lg font-sans outline-none focus:border-slate-400"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 col-span-2">
                      <label className="text-slate-400 font-bold uppercase text-[9px]">Document Title</label>
                      <input
                        type="text"
                        required
                        value={appendixTitle}
                        onChange={(e) => setAppendixTitle(e.target.value)}
                        placeholder="e.g. Registered Title Deed for King St Condo"
                        className="bg-white border border-slate-300 px-3 py-1.5 rounded-lg font-sans outline-none focus:border-slate-400"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 col-span-2">
                      <label className="text-slate-400 font-bold uppercase text-[9px]">Brief Description</label>
                      <input
                        type="text"
                        required
                        value={appendixDesc}
                        onChange={(e) => setAppendixDesc(e.target.value)}
                        placeholder="e.g. Shows full ownership split and registry timestamp..."
                        className="bg-white border border-slate-300 px-3 py-1.5 rounded-lg font-sans outline-none focus:border-slate-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-[#0d1527] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#1b2947] transition-all cursor-pointer self-end flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Appendix (S3 Pipeline)</span>
                  </button>
                </form>
              )}

              {/* Appendices list */}
              <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs flex flex-col gap-5">
                {/* Appendix A */}
                <div className="flex flex-col gap-2.5">
                  <h4 className="text-xs font-bold text-slate-800 uppercase font-sans border-l-4 border-emerald-500 pl-2">
                    Appendix A: Property Documents
                  </h4>
                  <div className="flex flex-col gap-2">
                    {caseObj.appendices.A.length > 0 ? (
                      caseObj.appendices.A.map((app) => (
                        <div key={app.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-slate-800">{app.title}</p>
                            <p className="text-slate-500 text-[10px] mt-0.5">{app.description}</p>
                            <p className="text-[9px] text-slate-400 font-mono mt-1">{app.fileName} | Uploaded by: {app.uploadedBy} on {app.createdDate}</p>
                          </div>
                          <button
                            onClick={() => alert(`Downloading appendix document from S3 path: ${app.s3Path}`)}
                            className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 p-1.5 rounded transition-all cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No property documents uploaded in this slot.</p>
                    )}
                  </div>
                </div>

                {/* Appendix B */}
                <div className="flex flex-col gap-2.5 border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase font-sans border-l-4 border-emerald-500 pl-2">
                    Appendix B: Bank Statements
                  </h4>
                  <div className="flex flex-col gap-2">
                    {caseObj.appendices.B.length > 0 ? (
                      caseObj.appendices.B.map((app) => (
                        <div key={app.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-slate-800">{app.title}</p>
                            <p className="text-slate-500 text-[10px] mt-0.5">{app.description}</p>
                            <p className="text-[9px] text-slate-400 font-mono mt-1">{app.fileName} | Uploaded by: {app.uploadedBy} on {app.createdDate}</p>
                          </div>
                          <button
                            onClick={() => alert(`Downloading appendix document from S3 path: ${app.s3Path}`)}
                            className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 p-1.5 rounded transition-all cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No bank statements uploaded in this slot.</p>
                    )}
                  </div>
                </div>

                {/* Appendix C */}
                <div className="flex flex-col gap-2.5 border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase font-sans border-l-4 border-emerald-500 pl-2">
                    Appendix C: Trust Documentation
                  </h4>
                  <div className="flex flex-col gap-2">
                    {caseObj.appendices.C.length > 0 ? (
                      caseObj.appendices.C.map((app) => (
                        <div key={app.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-slate-800">{app.title}</p>
                            <p className="text-slate-500 text-[10px] mt-0.5">{app.description}</p>
                            <p className="text-[9px] text-slate-400 font-mono mt-1">{app.fileName} | Uploaded by: {app.uploadedBy} on {app.createdDate}</p>
                          </div>
                          <button
                            onClick={() => alert(`Downloading appendix document from S3 path: ${app.s3Path}`)}
                            className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 p-1.5 rounded transition-all cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No trust documentation uploaded in this slot.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* T6: ILA Certificate Tab */}
          {activeTab === 'ila' && (
            <div className="flex flex-col gap-6">
              {/* Client 1 Certificate */}
              <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">
                    ILA Certificate for Client 1 ({caseObj.p1Name})
                  </h3>
                  <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">SECURED</span>
                </div>

                {canSeeOpposingIla('p1') ? (
                  caseObj.ilaP1Cert ? (
                    <div className="flex flex-col gap-4 text-xs text-slate-700 bg-emerald-50/20 border border-emerald-200 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-emerald-800 font-bold">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>ILA Certificate Issued &amp; Verified</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <span className="text-slate-400 text-[9px] uppercase">Issuing Attorney</span>
                          <p className="text-slate-800 font-semibold">{caseObj.ilaP1Cert.lawyerName}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[9px] uppercase">Legal Firm</span>
                          <p className="text-slate-800 font-semibold">{caseObj.ilaP1Cert.firmName}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[9px] uppercase">Bar Registration ID</span>
                          <p className="text-slate-800 font-mono font-semibold">{caseObj.ilaP1Cert.barNumber}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[9px] uppercase">Issue Date</span>
                          <p className="text-slate-800 font-semibold">{caseObj.ilaP1Cert.issueDate}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => alert(`Downloading Certificate PDF: ${caseObj.ilaP1Cert?.signedPdfPath}`)}
                        className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-[10px] font-bold px-3 py-1.5 rounded transition-all mt-2 flex items-center gap-1.5 self-start cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download ILA_P1.pdf</span>
                      </button>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-slate-400 italic text-xs">
                      No ILA Certificate issued yet for Client 1. Must be issued by Robert Miller, Esq. after client approval.
                    </div>
                  )
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-center">
                    <Lock className="w-8 h-8 text-red-700" />
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-bold text-red-900 uppercase tracking-wide">Access Prohibited (Constraint #9)</p>
                      <p className="text-[11px] text-red-700">
                        As the lawyer for Client 2, you are prohibited from viewing Client 1's private ILA Certificate documents.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Client 2 Certificate */}
              <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">
                    ILA Certificate for Client 2 ({caseObj.p2Name})
                  </h3>
                  <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">SECURED</span>
                </div>

                {canSeeOpposingIla('p2') ? (
                  caseObj.ilaP2Cert ? (
                    <div className="flex flex-col gap-4 text-xs text-slate-700 bg-emerald-50/20 border border-emerald-200 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-emerald-800 font-bold">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>ILA Certificate Issued &amp; Verified</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <span className="text-slate-400 text-[9px] uppercase">Issuing Attorney</span>
                          <p className="text-slate-800 font-semibold">{caseObj.ilaP2Cert.lawyerName}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[9px] uppercase">Legal Firm</span>
                          <p className="text-slate-800 font-semibold">{caseObj.ilaP2Cert.firmName}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[9px] uppercase">Bar Registration ID</span>
                          <p className="text-slate-800 font-mono font-semibold">{caseObj.ilaP2Cert.barNumber}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[9px] uppercase">Issue Date</span>
                          <p className="text-slate-800 font-semibold">{caseObj.ilaP2Cert.issueDate}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => alert(`Downloading Certificate PDF: ${caseObj.ilaP2Cert?.signedPdfPath}`)}
                        className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-[10px] font-bold px-3 py-1.5 rounded transition-all mt-2 flex items-center gap-1.5 self-start cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download ILA_P2.pdf</span>
                      </button>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-slate-400 italic text-xs">
                      No ILA Certificate issued yet for Client 2. Must be issued by Mark Sterling, Esq. after client approval.
                    </div>
                  )
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-center">
                    <Lock className="w-8 h-8 text-red-700" />
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-bold text-red-900 uppercase tracking-wide">Access Prohibited (Constraint #9)</p>
                      <p className="text-[11px] text-red-700">
                        As the lawyer for Client 1, you are prohibited from viewing Client 2's private ILA Certificate documents.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* T7: Timeline Tab */}
          {activeTab === 'timeline' && (
            <div className="flex flex-col gap-6">
              <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs flex flex-col gap-4">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans border-b border-slate-100 pb-2">
                  Matter Auditing timeline Trail (Constraints 14, 19, 20)
                </span>

                {/* Audit logs timeline */}
                <div className="flex flex-col gap-5 pl-2 relative border-l-2 border-slate-200 py-2.5">
                  <div className="flex flex-col gap-1 relative pl-6 text-xs">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#0d1527] border-2 border-white absolute left-[-7px] top-1" />
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Actor: System Engine</span>
                      <span>2026-08-01 10:14 AM | IP: 127.0.0.1</span>
                    </div>
                    <p className="font-semibold text-slate-800 uppercase">RULE_1_TRIGGERED: CONFLICT_ENGINE</p>
                    <p className="text-slate-500">Draft parsed. Firm conflicts verified with zero overlaps.</p>
                  </div>

                  <div className="flex flex-col gap-1 relative pl-6 text-xs">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#0d1527] border-2 border-white absolute left-[-7px] top-1" />
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Actor: CM Sentinel</span>
                      <span>2026-08-02 02:22 PM | IP: 127.0.0.1</span>
                    </div>
                    <p className="font-semibold text-slate-800 uppercase">RULE_2_TRIGGERED: QUESTIONNAIRE_FREEZE</p>
                    <p className="text-slate-500">Freezing financial disclosures against further client edit.</p>
                  </div>

                  <div className="flex flex-col gap-1 relative pl-6 text-xs">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#0d1527] border-2 border-white absolute left-[-7px] top-1" />
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Actor: {activeLawyer}</span>
                      <span>2026-08-03 09:00 AM | IP: 192.168.1.104</span>
                    </div>
                    <p className="font-semibold text-slate-800 uppercase">LAWYER_ASSIGNMENT_VERIFIED</p>
                    <p className="text-slate-500">Independent Legal Counsel assignment completed for Case.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* T8: Emails Tab */}
          {activeTab === 'emails' && (
            <div className="flex flex-col gap-6">
              <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs flex flex-col gap-4">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans border-b border-slate-100 pb-2">
                  System Generated Communications logs
                </span>

                <div className="flex flex-col gap-3.5">
                  {caseObj.emails.map((email) => (
                    <div key={email.id} className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                      <div className="bg-slate-100 p-2.5 flex items-center justify-between text-[10px] font-mono text-slate-500 border-b border-slate-200">
                        <div>
                          <span>From: <strong className="text-slate-700">{email.sender}</strong></span>
                          <span className="mx-2">|</span>
                          <span>To: <strong className="text-slate-700">{email.recipient}</strong></span>
                        </div>
                        <span>{email.sentAt}</span>
                      </div>
                      <div className="p-3 bg-white text-slate-700 font-sans">
                        <p className="font-bold text-slate-900 mb-1.5">Subject: {email.subject}</p>
                        <p className="whitespace-pre-line text-slate-600 leading-relaxed font-sans">{email.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Execution Pack Preview Modal */}
      {showExecutionPackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xs font-sans">
          <div className="bg-white rounded-xl shadow-2xl w-[640px] max-h-[90vh] overflow-hidden flex flex-col border border-slate-300 animate-scale-up">
            <div className="bg-[#0d1527] text-white p-5 flex items-center justify-between border-b border-[#1e293b]">
              <div>
                <h3 className="font-serif text-base font-bold text-white tracking-wide">
                  Final Execution Pack Preview
                </h3>
                <p className="text-[10px] text-emerald-400 font-mono mt-0.5">{caseObj.id}_FINAL_PACK.pdf</p>
              </div>
              <button
                onClick={() => setShowExecutionPackModal(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 text-xs text-slate-700">
              <p className="text-slate-500 italic mb-2">
                This document is a compiled final execution pack for signing sign-offs:
              </p>
              
              <div className="flex flex-col gap-2.5">
                {[
                  { section: '1. Cover Page', desc: 'Pre-nuptial Agreement - Vance & Lin' },
                  { section: '2. Signing Instructions', desc: 'Outlines notary requirements and signature locations' },
                  { section: '3. Final Agreement', desc: 'Complete 34-page legal draft' },
                  { section: '4. P1 Financial Schedules', desc: 'Assets: $3,210,000, Liabilities: $90,000' },
                  { section: '5. P2 Financial Schedules', desc: 'Assets: $1,450,000, Liabilities: $50,000' },
                  { section: '6. ILA_P1.pdf', desc: 'Independent Legal Advice Certificate issued by Robert Miller, Esq.' },
                  { section: '7. ILA_P2.pdf', desc: 'Independent Legal Advice Certificate issued by Mark Sterling, Esq.' },
                  { section: '8. Witness Pages', desc: 'Witness and Notary sign-off sections' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between border border-slate-100 bg-slate-50 p-2.5 rounded-lg">
                    <span className="font-bold text-[#0d1527]">{item.section}</span>
                    <span className="text-slate-500 italic">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowExecutionPackModal(false)}
                className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  alert(`Downloading final pack to local disk...`);
                  setShowExecutionPackModal(false);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg border border-emerald-500 transition-all cursor-pointer"
              >
                Download Pack PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
