"use client";

import React, { useState, useEffect } from 'react';
import {
  X, Lock, Download, FileText, Upload, CheckCircle2, AlertTriangle, ShieldCheck,
  Clock, Mail, MessageSquare, Plus, FileCode, Check, Eye, Edit, Trash2
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
  isInline?: boolean;
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
  isInline = false,
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

  // Local state for interactive editing of Appendices
  const [localAppendices, setLocalAppendices] = useState<{ A: Appendix[]; B: Appendix[]; C: Appendix[] }>({ A: [], B: [], C: [] });
  const [isAddingAppendix, setIsAddingAppendix] = useState(false);
  const [editingAppendix, setEditingAppendix] = useState<{ slot: 'A' | 'B' | 'C'; appendix: Appendix } | null>(null);
  const [appendixFormSlot, setAppendixFormSlot] = useState<'A' | 'B' | 'C'>('A');
  const [appendixFormTitle, setAppendixFormTitle] = useState('');
  const [appendixFormDesc, setAppendixFormDesc] = useState('');
  const [appendixFormFileName, setAppendixFormFileName] = useState('');

  // Local state for interactive editing of ILA Certificates
  const [localIlaP1Cert, setLocalIlaP1Cert] = useState<IlaCertDetails | undefined>(undefined);
  const [localIlaP2Cert, setLocalIlaP2Cert] = useState<IlaCertDetails | undefined>(undefined);
  const [isEditingIlaP1, setIsEditingIlaP1] = useState(false);
  const [isEditingIlaP2, setIsEditingIlaP2] = useState(false);
  const [ilaFormLawyerName, setIlaFormLawyerName] = useState('');
  const [ilaFormFirmName, setIlaFormFirmName] = useState('');
  const [ilaFormBarNumber, setIlaFormBarNumber] = useState('');
  const [ilaFormIssueDate, setIlaFormIssueDate] = useState('');
  
  // Execution Pack modal state
  const [showExecutionPackModal, setShowExecutionPackModal] = useState(false);
  const [rbacError, setRbacError] = useState<string | null>(null);

  // Interactive Versions Tab States
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [checkedOutBy, setCheckedOutBy] = useState('');
  const [checkedOutOn, setCheckedOutOn] = useState('');
  const [activeVersionId, setActiveVersionId] = useState('v3.5');
  const [amendmentInput, setAmendmentInput] = useState('');
  const [compareFrom, setCompareFrom] = useState('v3.0');
  const [compareTo, setCompareTo] = useState('v3.5');
  const [isComparing, setIsComparing] = useState(false);
  const [interactiveVersions, setInteractiveVersions] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen && caseObj) {
      setActiveTab('overview');
      setRbacError(null);
      
      // Initialize mock versions database
      setInteractiveVersions([
        { ver: 'v3.5', title: 'Approved Clean Master draft', by: 'Robert Miller, Esq.', date: '2026-08-18 10:30 AM', badge: 'L1' },
        { ver: 'v3.4', title: 'Revised financial disclosure schedules added', by: 'Mark Sterling, Esq.', date: '2026-08-16 03:50 PM', badge: 'L2' },
        { ver: 'v3.3', title: 'Updated spouse waiver clauses', by: 'Robert Miller, Esq.', date: '2026-08-15 11:00 AM', badge: 'L1' },
        { ver: 'v3.2', title: 'Adjusted real estate schedules and values', by: 'Mark Sterling, Esq.', date: '2026-08-12 11:30 AM', badge: 'L2' },
        { ver: 'v3.1', title: 'Minor draft adjustments on property treatment', by: 'Robert Miller, Esq.', date: '2026-08-10 09:30 AM', badge: 'L1' },
        { ver: 'v3.0', title: 'Initial questionnaire outputs generated', by: 'System Engine', date: '2026-08-08 09:15 AM', badge: 'CM' },
      ]);
      setActiveVersionId('v3.5');
      setIsCheckedOut(false);
      setIsComparing(false);
      setAmendmentInput('');

      // Populate local state from caseObj
      setLocalAppendices({
        A: caseObj.appendices?.A ? [...caseObj.appendices.A] : [],
        B: caseObj.appendices?.B ? [...caseObj.appendices.B] : [],
        C: caseObj.appendices?.C ? [...caseObj.appendices.C] : [],
      });
      setLocalIlaP1Cert(caseObj.ilaP1Cert);
      setLocalIlaP2Cert(caseObj.ilaP2Cert);

      // Reset editing states
      setIsAddingAppendix(false);
      setEditingAppendix(null);
      setIsEditingIlaP1(false);
      setIsEditingIlaP2(false);
    }
  }, [isOpen, caseObj?.id]);

  const handleSaveAppendixLocal = () => {
    if (!appendixFormTitle.trim() || !appendixFormFileName.trim()) {
      alert('Please fill in Title and File Name.');
      return;
    }

    if (editingAppendix) {
      const { slot, appendix } = editingAppendix;
      const updatedSlots = { ...localAppendices };
      
      // Delete from old slot
      updatedSlots[slot] = updatedSlots[slot].filter(a => a.id !== appendix.id);
      
      // Add/update to selected slot
      const updatedAppendix = {
        ...appendix,
        title: appendixFormTitle.trim(),
        description: appendixFormDesc.trim(),
        fileName: appendixFormFileName.trim(),
      };
      
      updatedSlots[appendixFormSlot].push(updatedAppendix);
      setLocalAppendices(updatedSlots);
      setEditingAppendix(null);
    } else {
      const newAppendix: Appendix = {
        id: `APP-${Date.now()}`,
        title: appendixFormTitle.trim(),
        description: appendixFormDesc.trim(),
        fileName: appendixFormFileName.trim(),
        uploadedBy: activePersona === 'L1' ? 'Robert Miller, Esq.' : 'Mark Sterling, Esq.',
        createdDate: '2026-08-26',
        s3Path: `s3://lets-prenup/disclosures/${appendixFormFileName.trim()}`,
      };
      
      const updatedSlots = { ...localAppendices };
      updatedSlots[appendixFormSlot].push(newAppendix);
      setLocalAppendices(updatedSlots);
      setIsAddingAppendix(false);
    }
  };

  const handleSaveIlaCert = (party: 'p1' | 'p2') => {
    if (!ilaFormLawyerName.trim() || !ilaFormFirmName.trim() || !ilaFormBarNumber.trim()) {
      alert('Please fill in all attorney details.');
      return;
    }

    const certDetails: IlaCertDetails = {
      lawyerName: ilaFormLawyerName.trim(),
      firmName: ilaFormFirmName.trim(),
      barNumber: ilaFormBarNumber.trim(),
      issueDate: ilaFormIssueDate.trim() || new Date().toISOString().split('T')[0],
      signedPdfPath: `s3://lets-prenup/certificates/ILA_${party.toUpperCase()}_SIGNED.pdf`,
    };

    if (party === 'p1') {
      setLocalIlaP1Cert(certDetails);
      setIsEditingIlaP1(false);
    } else {
      setLocalIlaP2Cert(certDetails);
      setIsEditingIlaP2(false);
    }
  };

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

  const panelContent = (
    <>
      <div className={isInline 
        ? "w-full bg-[#f7f4ee] flex flex-col min-h-screen text-slate-800 font-sans relative overflow-hidden"
        : "relative w-[780px] h-full bg-[#f7f4ee] shadow-2xl flex flex-col z-10 border-l border-slate-300 animate-slide-in text-slate-800 font-sans"
      }>
        
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
            { id: 'client_details', label: '2. Forms & disclosures - (read only)' },
            { id: 'versions', label: '3. Agreement Versions' },
            { id: 'notes', label: '4. Lawyer Action' },
            { id: 'timeline', label: '5. Timeline' },
            { id: 'emails', label: '6. audit log' },
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
                <h3 className="text-xs font-extrabold text-slate-600 uppercase tracking-wider font-sans border-b border-slate-200 pb-2">
                  Matter Metadata Indicators
                </h3>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">Case Code ID</span>
                    <span className="font-mono font-extrabold text-slate-900 text-sm">{caseObj.id}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">Service Plan</span>
                    <span className="font-bold text-slate-900 text-xs">{caseObj.service}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">Primary status</span>
                    <span className="font-bold text-slate-900 text-xs uppercase">{caseObj.status.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">Days in State</span>
                    <span className="font-mono font-extrabold text-slate-900 text-xs">{caseObj.daysInStatus} Days</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">Lawyer-facing (Current Version)</span>
                    <span className="font-mono font-bold text-slate-900 text-xs">{caseObj.currentVersion}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">Client-facing (Published Version)</span>
                    <span className="font-mono font-bold text-slate-900 text-xs">{caseObj.publishedVersion}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">Last Activity Logged</span>
                    <span className="text-slate-800 font-bold text-xs">{caseObj.lastActivity}</span>
                  </div>
                </div>
              </div>

              {/* Roster Information */}
              <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs flex flex-col gap-4">
                <h3 className="text-xs font-extrabold text-slate-600 uppercase tracking-wider font-sans border-b border-slate-200 pb-2">
                  Counsel and Roster directory
                </h3>

                <div className="grid grid-cols-2 gap-6 text-xs">
                  <div className="flex flex-col gap-2">
                    <h4 className="font-extrabold text-emerald-800 uppercase text-[11px] tracking-wider">Client 1 &amp; Counsel</h4>
                    <p className="text-slate-900 font-bold text-xs">{caseObj.p1Name}</p>
                    <p className="text-slate-600 font-extrabold text-[10px] mt-1 tracking-wide">FIRM / LAWYER</p>
                    <p className="text-slate-800 font-semibold text-xs">{caseObj.p1Firm || 'Unassigned'}</p>
                    <p className="text-slate-700 italic font-semibold text-xs">{caseObj.p1Lawyer || 'Unassigned'}</p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <h4 className="font-extrabold text-emerald-800 uppercase text-[11px] tracking-wider">Client 2 &amp; Counsel</h4>
                    <p className="text-slate-900 font-bold text-xs">{caseObj.p2Name}</p>
                    <p className="text-slate-600 font-extrabold text-[10px] mt-1 tracking-wide">FIRM / LAWYER</p>
                    <p className="text-slate-800 font-semibold text-xs">{caseObj.p2Firm || 'Unassigned'}</p>
                    <p className="text-slate-700 italic font-semibold text-xs">{caseObj.p2Lawyer || 'Unassigned'}</p>
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

              {/* Version Flow Engine Transition Pipeline */}
              <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs flex flex-col gap-4">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans border-b border-slate-100 pb-2">
                  Version Flow Engine Transition Pipeline
                </span>
                <div className="flex flex-wrap gap-2 text-[10px] font-sans">
                  <span className={`px-2.5 py-1 rounded-md border font-sans font-bold transition-all ${
                    caseObj.status === 'FORMS_LOCKED' || caseObj.status === 'LAWYER_REVIEW'
                      ? 'bg-slate-900 border-slate-950 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    v1.0-v1.3 draft
                  </span>
                  <span className={`px-2.5 py-1 rounded-md border font-sans font-bold transition-all ${
                    caseObj.status === 'AWAITING_COUNTERPARTY_LAWYER_APPROVAL'
                      ? 'bg-slate-900 border-slate-950 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    v1.4 Clean Master
                  </span>
                  <span className={`px-2.5 py-1 rounded-md border font-sans font-bold transition-all ${
                    caseObj.status === 'CLIENT_APPROVAL_PENDING'
                      ? 'bg-slate-900 border-slate-950 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    Negotiation
                  </span>
                  <span className={`px-2.5 py-1 rounded-md border font-sans font-bold transition-all ${
                    caseObj.status === 'READY_FOR_SIGNING'
                      ? 'bg-slate-900 border-slate-950 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    Sign-Off Pending
                  </span>
                  <span className={`px-2.5 py-1 rounded-md border font-sans font-bold transition-all ${
                    caseObj.status === 'ILA_P1_COMPLETE' || caseObj.status === 'ILA_P2_COMPLETE'
                      ? 'bg-slate-900 border-slate-950 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    ILA Issued
                  </span>
                  <span className={`px-2.5 py-1 rounded-md border font-sans font-bold transition-all ${
                    caseObj.status === 'CLOSED'
                      ? 'bg-slate-900 border-slate-950 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    Completed
                  </span>
                </div>
              </div>
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
            isComparing ? (
              <div className="flex flex-col gap-4 font-sans text-slate-800 bg-[#0f172a] p-6 rounded-xl border border-slate-700 min-h-[820px] text-white animate-fade-in justify-between">
                <div>
                  {/* Title bar */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold tracking-tight">Agreement Side-by-Side Comparison</span>
                    </div>
                  </div>

                  {/* Two sheets side-by-side */}
                  <div className="grid grid-cols-2 gap-6 mt-4">
                    {/* Left panel: compareFrom */}
                    <div className="flex flex-col gap-2">
                      <div className="bg-slate-800/80 px-4 py-2 rounded-lg border border-slate-700 text-xs font-bold flex justify-between">
                        <span>Version {compareFrom}</span>
                        <span className="text-slate-400">ORIGINAL BASE DRAFT</span>
                      </div>
                      <div className="bg-white p-8 border border-slate-300 flex flex-col gap-4 shadow-sm text-slate-850 h-[580px] rounded-lg overflow-y-auto">
                        <h2 className="text-center font-serif text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
                          PRNUPTIAL AGREEMENT
                        </h2>
                        <p className="text-xs text-slate-600 leading-relaxed font-sans mt-2">
                          This Agreement is made on this 15th day of August, 2026.
                        </p>
                        <p className="text-xs font-bold text-slate-800 font-sans uppercase">BETWEEN</p>
                        <p className="text-xs text-slate-600 leading-none pl-4 font-sans">David Miller (referred to as "Party 1")</p>
                        <p className="text-xs font-bold text-slate-800 font-sans uppercase">AND</p>
                        <p className="text-xs text-slate-600 leading-none pl-4 font-sans">Sarah Conner (referred to as "Party 2")</p>

                        <div className="flex flex-col gap-2 mt-3 font-sans text-xs">
                          <p className="font-bold text-slate-800">1. DEFINITIONS</p>
                          <p className="text-slate-600 leading-relaxed pl-4">
                            1.1 "Agreement" means this Prenuptial Agreement.
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 mt-2 font-sans text-xs">
                          <p className="font-bold text-slate-800">2. FINANCIAL DISCLOSURE</p>
                          <p className="text-slate-600 leading-relaxed pl-4">
                            2.1 Each party has provided full and frank disclosure of their financial circumstances.
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 mt-2 font-sans text-xs">
                          <p className="font-bold text-slate-800">3. DIVISION OF PROPERTY</p>
                          <p className="text-slate-600 leading-relaxed pl-4">
                            3.1 In the event of separation, premarital assets listed in Appendix A shall remain the property of the acquiring party.
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 mt-2 font-sans text-xs">
                          <p className="font-bold text-slate-800">4. MAINTENANCE</p>
                          <p className="text-slate-600 leading-relaxed pl-4">
                            4.1 Except as otherwise provided, each party waives support.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right panel: compareTo */}
                    <div className="flex flex-col gap-2">
                      <div className="bg-slate-800/80 px-4 py-2 rounded-lg border border-slate-700 text-xs font-bold flex justify-between">
                        <span>Version {compareTo}</span>
                        <span className="text-emerald-400 font-bold">REVISED WITH AMENDMENTS</span>
                      </div>
                      <div className="bg-white p-8 border border-slate-300 flex flex-col gap-4 shadow-sm text-slate-850 h-[580px] rounded-lg overflow-y-auto">
                        <h2 className="text-center font-serif text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
                          PRENUPTIAL AGREEMENT
                        </h2>
                        <p className="text-xs text-slate-600 leading-relaxed font-sans mt-2">
                          This Agreement is made on this 15th day of August, 2026.
                        </p>
                        <p className="text-xs font-bold text-slate-800 font-sans uppercase">BETWEEN</p>
                        <p className="text-xs text-slate-600 leading-none pl-4 font-sans">David Miller (referred to as "Party 1")</p>
                        <p className="text-xs font-bold text-slate-800 font-sans uppercase">AND</p>
                        <p className="text-xs text-slate-600 leading-none pl-4 font-sans">Sarah Conner (referred to as "Party 2")</p>

                        <div className="flex flex-col gap-2 mt-3 font-sans text-xs">
                          <p className="font-bold text-slate-800">1. DEFINITIONS</p>
                          <p className="text-slate-600 leading-relaxed pl-4">
                            1.1 "Agreement" means this Prenuptial Agreement <span className="bg-emerald-100 text-emerald-950 font-medium px-1 rounded border-b border-emerald-400 font-sans">including all schedules and annexures</span>.
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 mt-2 font-sans text-xs">
                          <p className="font-bold text-slate-800">2. FINANCIAL DISCLOSURE</p>
                          <p className="text-slate-600 leading-relaxed pl-4">
                            2.1 Each party has provided full and frank disclosure <span className="bg-emerald-100 text-emerald-950 font-medium px-1 rounded border-b border-emerald-400 font-sans">and verified bank statements</span> of their financial circumstances.
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 mt-2 font-sans text-xs">
                          <p className="font-bold text-slate-800">3. DIVISION OF PROPERTY</p>
                          <p className="text-slate-600 leading-relaxed pl-4">
                            3.1 In the event of separation, premarital assets listed in Appendix A shall remain the sole property of the <span className="bg-emerald-100 text-emerald-950 font-medium px-1 rounded border-b border-emerald-400 font-sans">respective acquiring party</span>.
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 mt-2 font-sans text-xs">
                          <p className="font-bold text-slate-800">4. MAINTENANCE</p>
                          <p className="text-slate-600 leading-relaxed pl-4">
                            4.1 Except as otherwise provided <span className="bg-emerald-100 text-emerald-950 font-medium px-1 rounded border-b border-emerald-400 font-sans">in Clause 96</span>, each party waives support.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Done Comparing button footer at the bottom right */}
                <div className="flex justify-end pt-3 border-t border-slate-800">
                  <button 
                    onClick={() => setIsComparing(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-6 py-2 rounded-lg border border-slate-600 transition-all cursor-pointer shadow-md"
                  >
                    Done Comparing
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6 font-sans text-slate-800 p-0 animate-fade-in">
                
                {/* Case Metadata Indicators bar */}
                <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-xs grid grid-cols-5 gap-4 text-xs font-sans">
                  <div>
                    <span className="text-slate-500 font-extrabold uppercase text-[10px] block mb-0.5 tracking-wider">Case ID</span>
                    <span className="font-mono font-extrabold text-slate-950 text-sm">{caseObj.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-extrabold uppercase text-[10px] block mb-0.5 tracking-wider">Parties</span>
                    <span className="font-bold text-slate-950 text-xs">{caseObj.p1Name} (P1) &amp; {caseObj.p2Name} (P2)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-extrabold uppercase text-[10px] block mb-0.5 tracking-wider">Current Status</span>
                    <span className="bg-[#dbeafe] text-[#1e40af] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {caseObj.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-extrabold uppercase text-[10px] block mb-0.5 tracking-wider">Current Version</span>
                    <span className="font-mono font-extrabold text-slate-950 text-sm">{activeVersionId}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-extrabold uppercase text-[10px] block mb-0.5 tracking-wider">Last Updated</span>
                    <span className="text-slate-950 font-bold text-xs">{caseObj.lastActivity}</span>
                  </div>
                </div>

                {/* Three Column Core Layout */}
                <div className="grid grid-cols-12 gap-6">
                  
                  {/* Column 1: All Versions Timeline (Col Span 3) */}
                  <div className="col-span-3 bg-white border border-slate-300 rounded-xl p-4 shadow-xs flex flex-col justify-between h-[820px] overflow-hidden">
                    <div className="flex flex-col gap-4 overflow-y-auto">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="text-xs font-extrabold text-slate-800 tracking-wider uppercase">ALL VERSIONS</span>
                        <button className="bg-slate-50 border border-slate-200 text-slate-700 px-2 py-1 rounded text-[10px] font-bold hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-1">
                          <span>Filter</span>
                        </button>
                      </div>

                      <div className="flex flex-col gap-3">
                        {interactiveVersions.map((item, idx) => (
                          <div 
                            key={idx}
                            onClick={() => setActiveVersionId(item.ver)}
                            className={`p-3 border rounded-xl flex flex-col gap-2 transition-all cursor-pointer ${
                              item.ver === activeVersionId 
                                ? 'bg-slate-50 border-slate-400 shadow-sm' 
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs font-extrabold text-slate-950">
                                {item.ver} 
                                <span className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-[9px] font-extrabold ml-2">
                                  {item.badge}
                                </span>
                              </span>
                            </div>
                            <p className="text-xs font-bold text-slate-900 leading-snug">{item.title}</p>
                            <p className="text-[10px] text-slate-700 font-bold">{item.by}</p>
                            <p className="text-[10px] text-slate-600 font-semibold">{item.date}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Center - PDF Viewer (Col Span 6) */}
                  <div className="col-span-6 flex flex-col h-[820px] pr-1">
                    
                    {/* PDF Viewer */}
                    <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-xs flex flex-col h-full">
                      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">Version {activeVersionId} - Latest Agreed Version (Clean Master)</span>
                        <div className="flex items-center gap-2">
                          <button className="bg-white border border-slate-300 text-slate-600 px-2 py-1 rounded text-[10px] font-bold hover:bg-slate-50 transition-all cursor-pointer">
                            ↓
                          </button>
                          <button className="bg-white border border-slate-300 text-slate-600 px-2 py-1 rounded text-[10px] font-bold hover:bg-slate-50 transition-all cursor-pointer">
                            ⛶
                          </button>
                        </div>
                      </div>
                      <div className="px-4 py-2 border-b border-slate-100 text-[9px] text-slate-400">
                        Uploaded on 2026-08-18 10:30 AM
                      </div>
 
                      {/* PDF Document Frame mock */}
                      <div className="bg-slate-100 p-6 flex justify-center h-[710px] overflow-y-auto">
                        {(() => {
                          const isBase = activeVersionId === 'v3.0';
                          return (
                            <div className="bg-white p-12 border border-slate-300 flex flex-col gap-6 shadow-sm text-slate-800 w-[550px] min-h-[900px] h-fit">
                              <h2 className="text-center font-serif text-base font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-3">
                                PRENUPTIAL AGREEMENT
                              </h2>
                              <p className="text-xs text-slate-650 leading-relaxed font-sans mt-2">
                                This Agreement is made and entered into on this 18th day of August, 2026, by and between:
                              </p>
                              
                              <div className="flex flex-col gap-2 font-sans text-xs">
                                <p className="font-bold text-slate-800 uppercase">PARTIES:</p>
                                <div className="pl-4 flex flex-col gap-1 text-slate-650">
                                  <p><strong>First Spouse:</strong> {caseObj.p1Name} (referred to herein as "Party 1")</p>
                                  <p><strong>Second Spouse:</strong> {caseObj.p2Name} (referred to herein as "Party 2")</p>
                                </div>
                              </div>

                              <div className="flex flex-col gap-3 font-sans text-xs border-t border-slate-100 pt-4">
                                <p className="font-bold text-slate-850 uppercase">RECITALS:</p>
                                <p className="text-slate-650 leading-relaxed pl-4">
                                  <strong>A. Intended Marriage.</strong> The parties intend to enter into marriage on or about September 12, 2026, and make this Agreement in contemplation of the marriage.
                                </p>
                                <p className="text-slate-650 leading-relaxed pl-4">
                                  <strong>B. Definition of Rights.</strong> The parties desire to define and fix their respective rights, duties, and obligations with respect to all property, assets, debts, and estates during the marriage and in the event of a dissolution.
                                </p>
                                <p className="text-slate-650 leading-relaxed pl-4">
                                  <strong>C. Full Disclosure.</strong> Each party has provided full, frank, and complete disclosure of all assets, liabilities, and income to the other party, as set forth in schedules attached hereto.
                                </p>
                              </div>

                              <div className="flex flex-col gap-3 mt-2 font-sans text-xs border-t border-slate-100 pt-4">
                                <p className="font-bold text-slate-850">SECTION 1: DEFINITIONS</p>
                                <p className="text-slate-650 leading-relaxed pl-4">
                                  1.1 <strong>"Agreement"</strong> means this Prenuptial Agreement, including all associated schedules, disclosures, and appendices{isBase ? '.' : ' including all schedules and annexures.'}
                                </p>
                                <p className="text-slate-650 leading-relaxed pl-4">
                                  1.2 <strong>"Separate Property"</strong> refers to assets, properties, interests, and business holdings owned by either party prior to the marriage as disclosed in Appendix A.
                                </p>
                              </div>

                              <div className="flex flex-col gap-3 mt-2 font-sans text-xs border-t border-slate-100 pt-4">
                                <p className="font-bold text-slate-850">SECTION 2: SEPARATE PROPERTY RETENTION</p>
                                <p className="text-slate-650 leading-relaxed pl-4">
                                  2.1 <strong>Ownership.</strong> Each party shall retain sole ownership, management, and control of their Separate Property, and may transfer, lease, or dispose of it without consent.
                                </p>
                                <p className="text-slate-650 leading-relaxed pl-4">
                                  2.2 <strong>Exclusion of Appreciation.</strong> Any increase in the value, interest, rents, profits, or appreciation of a party's Separate Property during the marriage shall remain separate property.
                                </p>
                              </div>

                              <div className="flex flex-col gap-3 mt-2 font-sans text-xs border-t border-slate-100 pt-4">
                                <p className="font-bold text-slate-850">SECTION 3: JOINT AND COMMUNITY PROPERTY</p>
                                <p className="text-slate-650 leading-relaxed pl-4">
                                  3.1 <strong>Creation.</strong> Any assets acquired during the marriage that are titled jointly or purchased with joint funds shall be considered Joint Property. No community property estate shall otherwise be created.
                                </p>
                              </div>

                              <div className="flex flex-col gap-3 mt-2 font-sans text-xs border-t border-slate-100 pt-4">
                                <p className="font-bold text-slate-850">SECTION 4: MAINTENANCE AND SUPPORT</p>
                                <p className="text-slate-650 leading-relaxed pl-4">
                                  4.1 <strong>Mutual Waiver.</strong> Except as otherwise provided herein, each party hereby waives, releases, and relinquishes any and all rights to spousal support, maintenance, or alimony from the other in the event of separation or dissolution.
                                </p>
                              </div>

                              <div className="flex flex-col gap-3 mt-2 font-sans text-xs border-t border-slate-100 pt-4 pb-8">
                                <p className="font-bold text-slate-850">SECTION 5: NOTARIZATION & SIGNATURES</p>
                                <div className="flex justify-between mt-6 pt-4 border-t border-dashed border-slate-200">
                                  <div className="flex flex-col gap-1 w-[45%]">
                                    <span className="h-10 border-b border-slate-300"></span>
                                    <span className="font-bold text-slate-700">{caseObj.p1Name} (Party 1)</span>
                                  </div>
                                  <div className="flex flex-col gap-1 w-[45%]">
                                    <span className="h-10 border-b border-slate-300"></span>
                                    <span className="font-bold text-slate-700">{caseObj.p2Name} (Party 2)</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
 
                      {/* PDF Footer details */}
                      <div className="bg-slate-50 border-t border-slate-200 px-4 py-2.5 flex items-center justify-between text-[8px] text-slate-500 font-mono">
                        <span>Page 1 of 24 (Version {activeVersionId}) | Size: 1.2 MB | 100% | Fit</span>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Right Sidebar Controls (Col Span 3) */}
                  <div className="col-span-3 flex flex-col gap-6 h-[820px] overflow-y-auto pr-1">
                    
                    {/* Check-In / Check-Out */}
                    {isCheckedOut ? (
                      <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-xs flex flex-col gap-3">
                        <span className="text-[10px] font-bold text-slate-900 tracking-wider uppercase">CHECK-IN / CHECK-OUT</span>
                        <div className="text-[9px] text-slate-600 font-sans flex flex-col gap-1 border border-slate-100 rounded-lg p-2.5 bg-slate-50/50">
                          <p><strong>Checked Out By:</strong> {checkedOutBy}</p>
                          <p><strong>Checked Out On:</strong> {checkedOutOn}</p>
                        </div>
                        <button 
                          onClick={() => setIsCheckedOut(false)}
                          className="w-full bg-[#991b1b] hover:bg-[#7f1d1d] text-white text-xs font-bold py-2 rounded-lg border border-red-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs mt-2"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Check in Draft</span>
                        </button>
                      </div>
                    ) : (
                      <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-xs flex flex-col gap-3">
                        <span className="text-[10px] font-bold text-slate-900 tracking-wider uppercase">CHECK-IN / CHECK-OUT</span>
                        <p className="text-[9px] text-slate-400 leading-normal">
                          Document is checked in. Check out the document to lock modifications and check in new draft version.
                        </p>
                        <button 
                          onClick={() => {
                            setIsCheckedOut(true);
                            setCheckedOutBy('Robert Miller, Esq.');
                            setCheckedOutOn('8/23/2026, 10:45:00 PM');
                          }}
                          className="w-full bg-[#1e4620] hover:bg-[#163a18] text-white text-xs font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <span>✓ Check Out for Revisions</span>
                        </button>
                        <div className="text-[8px] text-slate-400 font-mono">
                          Downloaded version: Prenuptial_Agreement_{activeVersionId}.pdf
                        </div>
                      </div>
                    )}

                    {/* Upload new version check-in */}
                    {isCheckedOut ? (
                      <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-xs flex flex-col gap-3">
                        <span className="text-[10px] font-bold text-slate-900 tracking-wider uppercase">UPLOAD NEW VERSION (CHECK-IN)</span>
                        
                        {/* Drag & drop mock */}
                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 text-slate-400 gap-2 cursor-pointer hover:border-slate-300 hover:bg-slate-100/50 transition-all">
                          <Upload className="w-5 h-5 text-slate-400" />
                          <div className="text-[9px] font-semibold text-center">
                            <p>Drag &amp; drop file here</p>
                            <p className="my-0.5">or</p>
                          </div>
                          <span className="bg-white border border-slate-300 text-slate-700 px-3 py-1 rounded text-[8px] font-bold shadow-xs">
                            Choose File
                          </span>
                        </div>

                        <div className="flex flex-col gap-1.5 mt-1 text-xs font-sans">
                          <label className="text-[9px] text-slate-500 font-bold uppercase">New Version Number</label>
                          <input 
                            type="text" 
                            value={(() => {
                              if (!interactiveVersions.length) return 'v1.0';
                              const latest = interactiveVersions[0].ver;
                              const num = parseFloat(latest.replace('v', ''));
                              return `v${(num + 0.1).toFixed(1)}`;
                            })()} 
                            disabled
                            className="bg-slate-100 border border-slate-200 text-xs px-2.5 py-1.5 rounded-lg font-mono outline-none text-slate-500 cursor-not-allowed" 
                          />
                        </div>

                        <div className="flex flex-col gap-1.5 text-xs font-sans">
                          <label className="text-[9px] text-slate-500 font-bold uppercase">Amendment Summary *</label>
                          <textarea 
                            rows={3}
                            value={amendmentInput}
                            onChange={(e) => setAmendmentInput(e.target.value)}
                            placeholder="Describe the changes made in this version..."
                            className="bg-white border border-slate-200 text-xs px-2.5 py-1.5 rounded-lg font-sans outline-none focus:border-slate-400 text-slate-700 leading-normal resize-none"
                          />
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <button 
                            onClick={() => {
                              setIsCheckedOut(false);
                              setAmendmentInput('');
                            }}
                            className="flex-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold py-1.5 rounded-lg transition-all cursor-pointer font-sans"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => {
                              if (!amendmentInput.trim()) {
                                alert('Please provide an amendment summary.');
                                return;
                              }
                              const nextVer = (() => {
                                if (!interactiveVersions.length) return 'v1.0';
                                const latest = interactiveVersions[0].ver;
                                const num = parseFloat(latest.replace('v', ''));
                                return `v${(num + 0.1).toFixed(1)}`;
                              })();
                              const newVerObj = {
                                ver: nextVer,
                                title: amendmentInput,
                                by: activePersona === 'L1' ? 'Robert Miller, Esq.' : 'Mark Sterling, Esq.',
                                date: '2026-08-20 10:30 AM',
                                badge: activePersona
                              };
                              setInteractiveVersions([newVerObj, ...interactiveVersions]);
                              setActiveVersionId(nextVer);
                              setIsCheckedOut(false);
                              setAmendmentInput('');
                            }}
                            className="flex-1 bg-[#1e3a8a] text-white hover:bg-[#172554] text-xs font-bold py-1.5 rounded-lg transition-all cursor-pointer font-sans"
                          >
                            Upload &amp; Create
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-xs flex flex-col gap-3 opacity-60">
                        <span className="text-[10px] font-bold text-slate-900 tracking-wider uppercase">UPLOAD NEW VERSION (CHECK-IN)</span>
                        <p className="text-[9px] text-slate-500 leading-normal font-sans">
                          Please click the checkout button above to enable draft version uploads.
                        </p>
                      </div>
                    )}

                    {/* Compare Documents */}
                    <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-xs flex flex-col gap-3">
                      <span className="text-[10px] font-bold text-slate-900 tracking-wider uppercase">COMPARE DOCUMENTS</span>
                      <div className="flex flex-col gap-2 mt-1">
                        <div className="flex flex-col gap-1">
                          <label className="text-[8px] text-slate-400 font-bold uppercase">From Version</label>
                          <select 
                            value={compareFrom}
                            onChange={(e) => setCompareFrom(e.target.value)}
                            className="bg-white border border-slate-200 text-xs px-2 py-1.5 rounded-lg font-sans outline-none text-slate-700 cursor-pointer"
                          >
                            {interactiveVersions.map((v) => (
                              <option key={v.ver} value={v.ver}>{v.ver}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[8px] text-slate-400 font-bold uppercase">To Version</label>
                          <select 
                            value={compareTo}
                            onChange={(e) => setCompareTo(e.target.value)}
                            className="bg-white border border-slate-200 text-xs px-2 py-1.5 rounded-lg font-sans outline-none text-slate-700 cursor-pointer"
                          >
                            {interactiveVersions.map((v) => (
                              <option key={v.ver} value={v.ver}>{v.ver}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <button 
                        onClick={() => setIsComparing(true)}
                        className="bg-[#1e3a8a] text-white hover:bg-[#172554] text-xs font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2 shadow-xs"
                      >
                        <span>Compare Versions</span>
                      </button>
                    </div>
                  </div>

              </div>
            </div>
        )
      )}
                    {/* T4: Lawyer Action (Notes, Appendices, ILA) */}
          {activeTab === 'notes' && (
            <div className="flex flex-col gap-6">
              
              {/* Card 1: Confidential Summary Notes */}
              <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-xs font-extrabold text-slate-600 uppercase tracking-wider font-sans">
                    CONFIDENTIAL SUMMARY NOTES (CONSTRAINT #10: L1 ONLY SEES L1, L2 ONLY SEES L2)
                  </h3>
                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
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
                    <p className="text-xs text-slate-500 font-sans italic text-center py-4">
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
                      className="bg-white border border-slate-350 text-xs p-3 rounded-xl font-sans outline-none focus:border-slate-400 resize-none h-[80px]"
                    />
                    <button
                      onClick={handleSaveNoteClick}
                      className="bg-[#0d1527] hover:bg-[#1b2947] text-white text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer self-end flex items-center gap-1 shadow-xs"
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

              {/* Card 2: Appendices & Disclosures */}
              <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-xs font-extrabold text-slate-600 uppercase tracking-wider font-sans">
                    APPENDICES & DISCLOSURES
                  </h3>
                  {!isAddingAppendix && !editingAppendix && activePersona !== 'L3' && (
                    <button
                      onClick={() => {
                        setAppendixFormSlot('A');
                        setAppendixFormTitle('');
                        setAppendixFormDesc('');
                        setAppendixFormFileName('');
                        setIsAddingAppendix(true);
                        setEditingAppendix(null);
                      }}
                      className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold text-[10px] uppercase px-2 py-0.5 rounded transition-all cursor-pointer"
                    >
                      + Add Appendix
                    </button>
                  )}
                </div>

                {/* Add / Edit Appendix Form */}
                {(isAddingAppendix || editingAppendix) && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3 mb-2 text-xs">
                    <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider border-b border-slate-200 pb-1">
                      {editingAppendix ? 'Edit Appendix details' : 'Upload Appendix Document'}
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-slate-400 font-bold uppercase text-[9px]">Appendix Section Slot</label>
                        <select
                          value={appendixFormSlot}
                          onChange={(e) => setAppendixFormSlot(e.target.value as any)}
                          className="bg-white border border-slate-300 px-2 py-1 rounded text-xs outline-none cursor-pointer"
                        >
                          <option value="A">Appendix A: Property Documents</option>
                          <option value="B">Appendix B: Bank Statements</option>
                          <option value="C">Appendix C: Trust Documentation</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-slate-400 font-bold uppercase text-[9px]">Document File Name</label>
                        <input
                          type="text"
                          value={appendixFormFileName}
                          onChange={(e) => setAppendixFormFileName(e.target.value)}
                          placeholder="e.g. deed_toronto_property.pdf"
                          className="bg-white border border-slate-300 px-2 py-1 rounded text-xs outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1 col-span-2">
                        <label className="text-slate-400 font-bold uppercase text-[9px]">Document Title</label>
                        <input
                          type="text"
                          value={appendixFormTitle}
                          onChange={(e) => setAppendixFormTitle(e.target.value)}
                          placeholder="e.g. Registered Title Deed for King St Condo"
                          className="bg-white border border-slate-300 px-2 py-1 rounded text-xs outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1 col-span-2">
                        <label className="text-slate-400 font-bold uppercase text-[9px]">Brief Description</label>
                        <input
                          type="text"
                          value={appendixFormDesc}
                          onChange={(e) => setAppendixFormDesc(e.target.value)}
                          placeholder="e.g. Shows full ownership split and registry timestamp..."
                          className="bg-white border border-slate-300 px-2 py-1 rounded text-xs outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 justify-end">
                      <button
                        onClick={() => {
                          setIsAddingAppendix(false);
                          setEditingAppendix(null);
                        }}
                        className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-[10px] font-bold px-3 py-1 rounded transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveAppendixLocal}
                        className="bg-[#1e3a8a] text-white hover:bg-[#172554] text-[10px] font-bold px-3 py-1 rounded transition-all cursor-pointer"
                      >
                        Save Appendix
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-5">
                  {/* Appendix A */}
                  <div className="flex flex-col gap-2.5">
                    <h4 className="text-xs font-bold text-slate-800 uppercase font-sans border-l-4 border-emerald-500 pl-2">
                      APPENDIX A: PROPERTY DOCUMENTS
                    </h4>
                    <div className="flex flex-col gap-2">
                      {localAppendices.A.length > 0 ? (
                        localAppendices.A.map((app) => (
                          <div key={app.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex items-center justify-between text-xs group">
                            <div>
                              <p className="font-bold text-slate-800">{app.title}</p>
                              <p className="text-slate-500 text-[10px] mt-0.5">{app.description}</p>
                              <p className="text-[9px] text-slate-400 font-mono mt-1">{app.fileName} | Uploaded by: {app.uploadedBy} on {app.createdDate}</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {activePersona !== 'L3' && (
                                <>
                                  <button
                                    onClick={() => {
                                      setAppendixFormSlot('A');
                                      setAppendixFormTitle(app.title);
                                      setAppendixFormDesc(app.description);
                                      setAppendixFormFileName(app.fileName);
                                      setEditingAppendix({ slot: 'A', appendix: app });
                                      setIsAddingAppendix(false);
                                    }}
                                    className="bg-white border border-slate-350 text-slate-650 hover:bg-slate-50 p-1 rounded transition-all cursor-pointer"
                                    title="Edit Appendix"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm('Are you sure you want to delete this appendix?')) {
                                        setLocalAppendices({
                                          ...localAppendices,
                                          A: localAppendices.A.filter(a => a.id !== app.id)
                                        });
                                      }
                                    }}
                                    className="bg-white border border-slate-350 text-red-650 hover:bg-red-50 p-1 rounded transition-all cursor-pointer"
                                    title="Delete Appendix"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => alert(`Downloading appendix document from S3 path: ${app.s3Path}`)}
                                className="bg-white border border-slate-350 text-slate-700 hover:bg-slate-50 p-1.5 rounded transition-all cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </div>
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
                      APPENDIX B: BANK STATEMENTS
                    </h4>
                    <div className="flex flex-col gap-2">
                      {localAppendices.B.length > 0 ? (
                        localAppendices.B.map((app) => (
                          <div key={app.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex items-center justify-between text-xs group">
                            <div>
                              <p className="font-bold text-slate-800">{app.title}</p>
                              <p className="text-slate-500 text-[10px] mt-0.5">{app.description}</p>
                              <p className="text-[9px] text-slate-400 font-mono mt-1">{app.fileName} | Uploaded by: {app.uploadedBy} on {app.createdDate}</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {activePersona !== 'L3' && (
                                <>
                                  <button
                                    onClick={() => {
                                      setAppendixFormSlot('B');
                                      setAppendixFormTitle(app.title);
                                      setAppendixFormDesc(app.description);
                                      setAppendixFormFileName(app.fileName);
                                      setEditingAppendix({ slot: 'B', appendix: app });
                                      setIsAddingAppendix(false);
                                    }}
                                    className="bg-white border border-slate-350 text-slate-650 hover:bg-slate-50 p-1 rounded transition-all cursor-pointer"
                                    title="Edit Appendix"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm('Are you sure you want to delete this appendix?')) {
                                        setLocalAppendices({
                                          ...localAppendices,
                                          B: localAppendices.B.filter(a => a.id !== app.id)
                                        });
                                      }
                                    }}
                                    className="bg-white border border-slate-350 text-red-655 hover:bg-red-50 p-1 rounded transition-all cursor-pointer"
                                    title="Delete Appendix"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => alert(`Downloading appendix document from S3 path: ${app.s3Path}`)}
                                className="bg-white border border-slate-350 text-slate-700 hover:bg-slate-50 p-1.5 rounded transition-all cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </div>
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
                      APPENDIX C: TRUST DOCUMENTATION
                    </h4>
                    <div className="flex flex-col gap-2">
                      {localAppendices.C.length > 0 ? (
                        localAppendices.C.map((app) => (
                          <div key={app.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex items-center justify-between text-xs group">
                            <div>
                              <p className="font-bold text-slate-800">{app.title}</p>
                              <p className="text-slate-500 text-[10px] mt-0.5">{app.description}</p>
                              <p className="text-[9px] text-slate-400 font-mono mt-1">{app.fileName} | Uploaded by: {app.uploadedBy} on {app.createdDate}</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {activePersona !== 'L3' && (
                                <>
                                  <button
                                    onClick={() => {
                                      setAppendixFormSlot('C');
                                      setAppendixFormTitle(app.title);
                                      setAppendixFormDesc(app.description);
                                      setAppendixFormFileName(app.fileName);
                                      setEditingAppendix({ slot: 'C', appendix: app });
                                      setIsAddingAppendix(false);
                                    }}
                                    className="bg-white border border-slate-350 text-slate-650 hover:bg-slate-50 p-1 rounded transition-all cursor-pointer"
                                    title="Edit Appendix"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm('Are you sure you want to delete this appendix?')) {
                                        setLocalAppendices({
                                          ...localAppendices,
                                          C: localAppendices.C.filter(a => a.id !== app.id)
                                        });
                                      }
                                    }}
                                    className="bg-white border border-slate-350 text-red-660 hover:bg-red-50 p-1 rounded transition-all cursor-pointer"
                                    title="Delete Appendix"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => alert(`Downloading appendix document from S3 path: ${app.s3Path}`)}
                                className="bg-white border border-slate-350 text-slate-700 hover:bg-slate-50 p-1.5 rounded transition-all cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic">No trust documentation uploaded in this slot.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: ILA Certificates */}
              <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs flex flex-col gap-4">
                <h3 className="text-xs font-extrabold text-slate-600 uppercase tracking-wider font-sans border-b border-slate-200 pb-2">
                  ILA CERTIFICATES
                </h3>
                
                {/* Client 1 ILA Certificate */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 uppercase font-sans">
                      CLIENT 1 ILA STATUS ({caseObj.p1Name?.toUpperCase()})
                    </h4>
                    {canSeeOpposingIla('p1') && (activePersona === 'L1') && !localIlaP1Cert && !isEditingIlaP1 && (
                      <button
                        onClick={() => {
                          setIlaFormLawyerName('Robert Miller, Esq.');
                          setIlaFormFirmName('Miller & Partners, LLP');
                          setIlaFormBarNumber('BAR-2026-9921');
                          setIlaFormIssueDate('2026-08-26');
                          setIsEditingIlaP1(true);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold text-[9px] uppercase px-2 py-0.5 rounded transition-all cursor-pointer"
                      >
                        + Issue Certificate
                      </button>
                    )}
                  </div>
                  
                  {canSeeOpposingIla('p1') ? (
                    isEditingIlaP1 ? (
                      <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 flex flex-col gap-3 mt-1 text-xs">
                        <h5 className="font-bold text-slate-800 text-[10px] uppercase">Client 1 ILA Details</h5>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-slate-400 font-bold text-[9px] uppercase">Issuing Attorney</label>
                            <input
                              type="text"
                              value={ilaFormLawyerName}
                              onChange={(e) => setIlaFormLawyerName(e.target.value)}
                              className="bg-white border border-slate-350 px-2 py-1 rounded text-xs outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-slate-400 font-bold text-[9px] uppercase">Legal Firm</label>
                            <input
                              type="text"
                              value={ilaFormFirmName}
                              onChange={(e) => setIlaFormFirmName(e.target.value)}
                              className="bg-white border border-slate-350 px-2 py-1 rounded text-xs outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-slate-400 font-bold text-[9px] uppercase">Bar Registration ID</label>
                            <input
                              type="text"
                              value={ilaFormBarNumber}
                              onChange={(e) => setIlaFormBarNumber(e.target.value)}
                              className="bg-white border border-slate-350 px-2 py-1 rounded text-xs outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-slate-400 font-bold text-[9px] uppercase">Issue Date</label>
                            <input
                              type="text"
                              value={ilaFormIssueDate}
                              onChange={(e) => setIlaFormIssueDate(e.target.value)}
                              className="bg-white border border-slate-350 px-2 py-1 rounded text-xs outline-none"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 justify-end">
                          <button
                            onClick={() => setIsEditingIlaP1(false)}
                            className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveIlaCert('p1')}
                            className="bg-[#1e3a8a] text-white hover:bg-[#172554] px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer"
                          >
                            Save Cert
                          </button>
                        </div>
                      </div>
                    ) : localIlaP1Cert ? (
                      <div className="flex flex-col gap-3 text-xs text-slate-700 bg-emerald-50/20 border border-emerald-200 p-4 rounded-xl mt-1 relative group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-emerald-800 font-bold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>ILA Certificate Issued &amp; Verified</span>
                          </div>
                          {activePersona === 'L1' && (
                            <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => {
                                  setIlaFormLawyerName(localIlaP1Cert.lawyerName);
                                  setIlaFormFirmName(localIlaP1Cert.firmName);
                                  setIlaFormBarNumber(localIlaP1Cert.barNumber);
                                  setIlaFormIssueDate(localIlaP1Cert.issueDate);
                                  setIsEditingIlaP1(true);
                                }}
                                className="bg-white border border-slate-200 text-slate-650 hover:bg-slate-50 p-0.5 rounded cursor-pointer"
                                title="Edit Certificate"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete/revoke this certificate?')) {
                                    setLocalIlaP1Cert(undefined);
                                  }
                                }}
                                className="bg-white border border-slate-200 text-red-600 hover:bg-red-50 p-0.5 rounded cursor-pointer"
                                title="Delete Certificate"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-1 text-slate-650">
                          <div>
                            <span className="text-slate-400 text-[9px] uppercase font-bold">Issuing Attorney</span>
                            <p className="text-slate-800 font-semibold">{localIlaP1Cert.lawyerName}</p>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[9px] uppercase font-bold">Legal Firm</span>
                            <p className="text-slate-800 font-semibold">{localIlaP1Cert.firmName}</p>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[9px] uppercase font-bold">Bar registration id</span>
                            <p className="text-slate-800 font-mono font-semibold">{localIlaP1Cert.barNumber}</p>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[9px] uppercase font-bold">Issue date</span>
                            <p className="text-slate-800 font-semibold">{localIlaP1Cert.issueDate}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 font-bold italic mt-1 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                        No ILA Certificate issued yet for Client 1
                      </p>
                    )
                  ) : (
                    <p className="text-xs text-red-700 mt-1 bg-red-50 border border-red-200 p-3 rounded-lg font-sans italic">
                      Access Prohibited: Lawyer for Client 2 cannot view Client 1's private ILA documents
                    </p>
                  )}
                </div>

                {/* Client 2 ILA Certificate */}
                <div className="flex flex-col gap-2 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-855 uppercase font-sans">
                      CLIENT 2 ILA STATUS ({caseObj.p2Name?.toUpperCase()})
                    </h4>
                    {canSeeOpposingIla('p2') && (activePersona === 'L2') && !localIlaP2Cert && !isEditingIlaP2 && (
                      <button
                        onClick={() => {
                          setIlaFormLawyerName('Mark Sterling, Esq.');
                          setIlaFormFirmName('Sterling Legal Group');
                          setIlaFormBarNumber('BAR-2026-8812');
                          setIlaFormIssueDate('2026-08-26');
                          setIsEditingIlaP2(true);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold text-[9px] uppercase px-2 py-0.5 rounded transition-all cursor-pointer"
                      >
                        + Issue Certificate
                      </button>
                    )}
                  </div>
                  
                  {canSeeOpposingIla('p2') ? (
                    isEditingIlaP2 ? (
                      <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 flex flex-col gap-3 mt-1 text-xs">
                        <h5 className="font-bold text-slate-800 text-[10px] uppercase">Client 2 ILA Details</h5>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-slate-400 font-bold text-[9px] uppercase">Issuing Attorney</label>
                            <input
                              type="text"
                              value={ilaFormLawyerName}
                              onChange={(e) => setIlaFormLawyerName(e.target.value)}
                              className="bg-white border border-slate-350 px-2 py-1 rounded text-xs outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-slate-400 font-bold text-[9px] uppercase">Legal Firm</label>
                            <input
                              type="text"
                              value={ilaFormFirmName}
                              onChange={(e) => setIlaFormFirmName(e.target.value)}
                              className="bg-white border border-slate-350 px-2 py-1 rounded text-xs outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-slate-400 font-bold text-[9px] uppercase">Bar Registration ID</label>
                            <input
                              type="text"
                              value={ilaFormBarNumber}
                              onChange={(e) => setIlaFormBarNumber(e.target.value)}
                              className="bg-white border border-slate-350 px-2 py-1 rounded text-xs outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-slate-400 font-bold text-[9px] uppercase">Issue Date</label>
                            <input
                              type="text"
                              value={ilaFormIssueDate}
                              onChange={(e) => setIlaFormIssueDate(e.target.value)}
                              className="bg-white border border-slate-350 px-2 py-1 rounded text-xs outline-none"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 justify-end">
                          <button
                            onClick={() => setIsEditingIlaP2(false)}
                            className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveIlaCert('p2')}
                            className="bg-[#1e3a8a] text-white hover:bg-[#172554] px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer"
                          >
                            Save Cert
                          </button>
                        </div>
                      </div>
                    ) : localIlaP2Cert ? (
                      <div className="flex flex-col gap-3 text-xs text-slate-700 bg-emerald-50/20 border border-emerald-200 p-4 rounded-xl mt-1 relative group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-emerald-800 font-bold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>ILA Certificate Issued &amp; Verified</span>
                          </div>
                          {activePersona === 'L2' && (
                            <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => {
                                  setIlaFormLawyerName(localIlaP2Cert.lawyerName);
                                  setIlaFormFirmName(localIlaP2Cert.firmName);
                                  setIlaFormBarNumber(localIlaP2Cert.barNumber);
                                  setIlaFormIssueDate(localIlaP2Cert.issueDate);
                                  setIsEditingIlaP2(true);
                                }}
                                className="bg-white border border-slate-200 text-slate-650 hover:bg-slate-50 p-0.5 rounded cursor-pointer"
                                title="Edit Certificate"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete/revoke this certificate?')) {
                                    setLocalIlaP2Cert(undefined);
                                  }
                                }}
                                className="bg-white border border-slate-200 text-red-600 hover:bg-red-50 p-0.5 rounded cursor-pointer"
                                title="Delete Certificate"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-1 text-slate-650">
                          <div>
                            <span className="text-slate-400 text-[9px] uppercase font-bold">Issuing Attorney</span>
                            <p className="text-slate-800 font-semibold">{localIlaP2Cert.lawyerName}</p>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[9px] uppercase font-bold">Legal Firm</span>
                            <p className="text-slate-800 font-semibold">{localIlaP2Cert.firmName}</p>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[9px] uppercase font-bold">Bar registration id</span>
                            <p className="text-slate-800 font-mono font-semibold">{localIlaP2Cert.barNumber}</p>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[9px] uppercase font-bold">Issue date</span>
                            <p className="text-slate-800 font-semibold">{localIlaP2Cert.issueDate}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 font-bold italic mt-1 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                        No ILA Certificate issued yet for Client 2
                      </p>
                    )
                  ) : (
                    <p className="text-xs text-red-750 mt-1 bg-red-50 border border-red-200 p-3 rounded-lg font-sans italic font-bold">
                      Access Prohibited: Lawyer for Client 1 cannot view Client 2's private ILA documents
                    </p>
                  )}
                </div>
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
    </>
  );

  if (isInline) {
    return panelContent;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      {panelContent}
    </div>
  );
};
