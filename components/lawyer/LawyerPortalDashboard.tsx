"use client";

import React, { useState, useMemo } from 'react';
import { LawyerCase, NavView, LawyerPersona, AgreementVersion, SummaryNote, Appendix, CaseStatus } from '../../types/lawyer-portal';
import { LawyerSidebar } from './LawyerSidebar';
import { LawyerTopBar } from './LawyerTopBar';
import { DashboardView } from './views/DashboardView';
import { CasesListView } from './views/CasesListView';
import { CompletedCasesView } from './views/CompletedCasesView';
import { ProfileView } from './views/ProfileView';
import { SettingsView } from './views/SettingsView';
import { AgreementVersionsView } from './views/AgreementVersionsView';
import { SummaryNotesView } from './views/SummaryNotesView';
import { AppendicesView } from './views/AppendicesView';
import { IlaCertificatesView } from './views/IlaCertificatesView';
import { LawyerCaseDrawer } from './drawer/LawyerCaseDrawer';
import { ScorecardModal } from './modals/ScorecardModal';

// Static client form templates
const P1_FORM_MOCK = {
  personalInfo: {
    fullName: 'Arthur Vance',
    dob: '1988-04-12',
    profession: 'Senior Software Architect',
    nationality: 'Canada',
    address: '140 King St W, Suite 2400, Toronto, ON',
    phone: '+1 (416) 555-0192',
    email: 'arthur.vance@example.com',
  },
  familyInfo: {
    maritalStatus: 'Single',
    childrenCount: 0,
    childrenDetails: 'None',
  },
  assets: {
    realEstateValue: '$1,850,000 (Condo Equity)',
    bankBalances: '$320,000 (Savings)',
    investmentsValue: '$480,000 (Brokerage Portfolios)',
    businessInterests: '$650,000 (TechCorp holdings 40%)',
    pensionValue: '$250,000 (Sun Life Pension)',
  },
  income: {
    annualSalary: '$240,000',
    dividends: '$30,000',
    otherIncome: 'None',
  },
  liabilities: {
    mortgages: '$80,000',
    loans: 'None',
    creditCards: '$10,000',
  },
  jointInfo: {
    coOwnedAssets: 'None',
    jointDebts: 'None',
  },
  questionnaireResponses: {
    objectives: 'To clarify pre-marital holdings, protect corporate holdings, and outline clear spousal spousal expectations.',
    futureLivingPlans: 'Plan to reside in Toronto. Acquire co-owned property in 2027.',
  },
  financialDisclosure: {
    status: 'COMPLETE' as const,
    lastUpdated: '2026-08-01',
  },
};

const P2_FORM_MOCK = {
  personalInfo: {
    fullName: 'Sophia Lin',
    dob: '1991-09-25',
    profession: 'Financial Risk Manager',
    nationality: 'Canada',
    address: '88 Queens Quay E, Suite 1205, Toronto, ON',
    phone: '+1 (416) 555-0198',
    email: 'sophia.lin@example.com',
  },
  familyInfo: {
    maritalStatus: 'Single',
    childrenCount: 0,
    childrenDetails: 'None',
  },
  assets: {
    realEstateValue: '$950,000 (Condo Equity)',
    bankBalances: '$180,000 (Savings)',
    investmentsValue: '$220,000 (TFSA Index)',
    businessInterests: 'None',
    pensionValue: '$100,000 (Corporate RRSP)',
  },
  income: {
    annualSalary: '$135,000',
    dividends: 'None',
    otherIncome: 'None',
  },
  liabilities: {
    mortgages: '$40,000',
    loans: 'None',
    creditCards: '$5,000',
  },
  jointInfo: {
    coOwnedAssets: 'None',
    jointDebts: 'None',
  },
  questionnaireResponses: {
    objectives: 'Ensure complete disclosure, spousal spousal limits, and separate pre-marriage asset lock.',
    futureLivingPlans: 'Acquire joint marital home. Keep investments separate.',
  },
  financialDisclosure: {
    status: 'COMPLETE' as const,
    lastUpdated: '2026-08-01',
  },
};

const MOCK_INITIAL_CASES: LawyerCase[] = [
  {
    id: 'LP-2026-001',
    service: 'Premier Bespoke',
    status: 'LAWYER_REVIEW',
    p1Name: 'Arthur Vance',
    p2Name: 'Sophia Lin',
    p1Firm: 'Blake Cassels LLP',
    p2Firm: 'Torys LLP',
    p1Lawyer: 'Robert Miller, Esq.',
    p2Lawyer: 'Mark Sterling, Esq.',
    currentVersion: 'v1.4',
    publishedVersion: 'v1.2',
    lastActivity: '2026-08-16',
    daysInStatus: 3,
    p1Forms: P1_FORM_MOCK,
    p2Forms: P2_FORM_MOCK,
    versions: [
      { version: 'v1.0', uploadedBy: 'System', uploadedDate: '2026-08-01 10:00 AM', published: 'YES', description: 'Initial questionnaire generation', s3Path: 's3://prenup-bucket/cases/LP-001/v1.0.pdf', fileSize: '1.2 MB' },
      { version: 'v1.1', uploadedBy: 'Robert Miller, Esq.', uploadedDate: '2026-08-03 02:30 PM', published: 'NO', description: 'Initial amendments on property treatment', s3Path: 's3://prenup-bucket/cases/LP-001/v1.1.pdf', fileSize: '1.3 MB' },
      { version: 'v1.2', uploadedBy: 'Mark Sterling, Esq.', uploadedDate: '2026-08-06 11:15 AM', published: 'YES', description: 'Added bank account schedules', s3Path: 's3://prenup-bucket/cases/LP-001/v1.2.pdf', fileSize: '1.3 MB' },
      { version: 'v1.3', uploadedBy: 'Robert Miller, Esq.', uploadedDate: '2026-08-10 04:00 PM', published: 'NO', description: 'Amended spousal support waivers', s3Path: 's3://prenup-bucket/cases/LP-001/v1.3.pdf', fileSize: '1.4 MB' },
      { version: 'v1.4', uploadedBy: 'Mark Sterling, Esq.', uploadedDate: '2026-08-15 09:45 AM', published: 'NO', description: 'Clean master pre-review changes', s3Path: 's3://prenup-bucket/cases/LP-001/v1.4.pdf', fileSize: '1.4 MB' },
    ],
    notes: [
      { version: 'v1.1', notes: 'Robert: Arthur requests keeping the 40% corporate equity separate from matrimonial claims.', createdBy: 'Robert Miller, Esq.', createdDate: '2026-08-03 02:40 PM', visibleTo: 'L1' },
      { version: 'v1.2', notes: 'Mark: Sophia wants reciprocal waiver of bank balances outside joint account listings.', createdBy: 'Mark Sterling, Esq.', createdDate: '2026-08-06 11:30 AM', visibleTo: 'L2' },
    ],
    appendices: {
      A: [
        { id: 'app-a-1', title: 'Arthur Vance Condo Registry Deed', description: 'Title deed for Toronto condominium holding', fileName: 'deed_condo_arthur.pdf', uploadedBy: 'Robert Miller, Esq.', createdDate: '2026-08-03 03:00 PM', s3Path: 's3://prenup-bucket/cases/LP-001/deed_condo_arthur.pdf' }
      ],
      B: [
        { id: 'app-b-1', title: 'Sophia Lin BMO Savings statements', description: 'Savings statements showing $180k balance', fileName: 'bmo_savings_sophia.pdf', uploadedBy: 'Mark Sterling, Esq.', createdDate: '2026-08-06 11:45 AM', s3Path: 's3://prenup-bucket/cases/LP-001/bmo_savings_sophia.pdf' }
      ],
      C: []
    },
    emails: [
      { id: 'email-1', sender: 'system@letsprenup.com', recipient: 'robert.miller@blakes.com', subject: 'New Case Assignment: LP-2026-001', body: 'You have been assigned as L1 counsel for Arthur Vance. Please review questionnaire forms.', sentAt: '2026-08-01 10:05 AM' }
    ]
  },
  {
    id: 'LP-2026-002',
    service: 'Express Tier',
    status: 'CLIENT_APPROVAL_PENDING',
    p1Name: 'David Miller',
    p2Name: 'Sarah Conner',
    p1Firm: 'Blake Cassels LLP',
    p2Firm: 'Torys LLP',
    p1Lawyer: 'Robert Miller, Esq.',
    p2Lawyer: 'Mark Sterling, Esq.',
    currentVersion: 'v1.5',
    publishedVersion: 'v1.5',
    lastActivity: '2026-08-10',
    daysInStatus: 8,
    p1Forms: P1_FORM_MOCK,
    p2Forms: P2_FORM_MOCK,
    versions: [
      { version: 'v1.5', uploadedBy: 'Mark Sterling, Esq.', uploadedDate: '2026-08-10 10:00 AM', published: 'YES', description: 'Clean master version uploaded', s3Path: 's3://prenup-bucket/cases/LP-002/v1.5.pdf', fileSize: '1.4 MB' }
    ],
    notes: [],
    appendices: { A: [], B: [], C: [] },
    emails: []
  },
  {
    id: 'LP-2026-003',
    service: 'Standard Digital',
    status: 'CLOSED',
    p1Name: 'Bruce Wayne',
    p2Name: 'Selina Kyle',
    p1Firm: 'Blake Cassels LLP',
    p2Firm: 'Torys LLP',
    p1Lawyer: 'Robert Miller, Esq.',
    p2Lawyer: 'Mark Sterling, Esq.',
    currentVersion: 'v2.0',
    publishedVersion: 'v2.0',
    lastActivity: '2026-07-28',
    daysInStatus: 25,
    p1Forms: P1_FORM_MOCK,
    p2Forms: P2_FORM_MOCK,
    versions: [
      { version: 'v2.0', uploadedBy: 'System', uploadedDate: '2026-07-28 04:00 PM', published: 'YES', description: 'Executed Clean Pack', s3Path: 's3://prenup-bucket/cases/LP-003/v2.0.pdf', fileSize: '2.1 MB' }
    ],
    notes: [],
    appendices: { A: [], B: [], C: [] },
    emails: []
  },
  {
    id: 'LP-2026-004',
    service: 'Bespoke Prenup',
    status: 'READY_FOR_SIGNING',
    p1Name: 'Clark Kent',
    p2Name: 'Lois Lane',
    p1Firm: 'Osler Hoskin LLP',
    p2Firm: 'Torys LLP',
    p1Lawyer: 'Clara Conner, Esq.',
    p2Lawyer: 'Mark Sterling, Esq.',
    currentVersion: 'v1.5',
    publishedVersion: 'v1.5',
    lastActivity: '2026-08-14',
    daysInStatus: 4,
    p1Forms: P1_FORM_MOCK,
    p2Forms: P2_FORM_MOCK,
    versions: [
      { version: 'v1.5', uploadedBy: 'Mark Sterling, Esq.', uploadedDate: '2026-08-14 02:00 PM', published: 'YES', description: 'Clean master version uploaded', s3Path: 's3://prenup-bucket/cases/LP-004/v1.5.pdf', fileSize: '1.4 MB' }
    ],
    notes: [],
    appendices: { A: [], B: [], C: [] },
    emails: []
  },
  {
    id: 'LP-2026-005',
    service: 'Premier Bespoke',
    status: 'LAWYER_REVIEW',
    p1Name: 'Arthur Curry',
    p2Name: 'Mera Ocean',
    p1Firm: 'Osler Hoskin LLP',
    p2Firm: 'Blake Cassels LLP',
    p1Lawyer: 'Clara Conner, Esq.',
    p2Lawyer: 'Robert Miller, Esq.',
    currentVersion: 'v1.1',
    publishedVersion: 'v1.0',
    lastActivity: '2026-08-18',
    daysInStatus: 1,
    certificateExpiryDate: '2026-09-05', // 18 Days from now (Expiring Cert < 30 days)
    p1Forms: P1_FORM_MOCK,
    p2Forms: P2_FORM_MOCK,
    versions: [
      { version: 'v1.0', uploadedBy: 'System', uploadedDate: '2026-08-18 09:00 AM', published: 'YES', description: 'System questionnaire generation', s3Path: 's3://prenup-bucket/cases/LP-005/v1.0.pdf', fileSize: '1.2 MB' },
      { version: 'v1.1', uploadedBy: 'Robert Miller, Esq.', uploadedDate: '2026-08-18 11:30 AM', published: 'NO', description: 'Amended offshore property clauses', s3Path: 's3://prenup-bucket/cases/LP-005/v1.1.pdf', fileSize: '1.3 MB' }
    ],
    notes: [],
    appendices: { A: [], B: [], C: [] },
    emails: []
  }
];

export const LawyerPortalDashboard: React.FC = () => {
  const [activePersona, setActivePersona] = useState<LawyerPersona>('L1');
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Cases database state
  const [cases, setCases] = useState<LawyerCase[]>(MOCK_INITIAL_CASES);
  
  // Modals / Drawer state
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScorecardOpen, setIsScorecardOpen] = useState(false);

  // Helper info for active lawyer name based on persona
  const getLawyerName = (persona: LawyerPersona) => {
    if (persona === 'L1') return 'Robert Miller, Esq.';
    if (persona === 'L2') return 'Mark Sterling, Esq.';
    return 'Clara Conner, Esq.';
  };

  const activeLawyer = getLawyerName(activePersona);

  // Counts for sidebar navigation list badges
  const assignedCount = useMemo(() => {
    return cases.filter((c) => {
      const isCompleted = c.status === 'CLOSED' || c.status === 'ARCHIVED';
      if (isCompleted) return false;
      if (activePersona === 'L1') return c.p1Lawyer === activeLawyer;
      if (activePersona === 'L2') return c.p2Lawyer === activeLawyer;
      return c.p1Lawyer === activeLawyer || c.p2Lawyer === activeLawyer;
    }).length;
  }, [cases, activePersona, activeLawyer]);

  const completedCount = useMemo(() => {
    return cases.filter((c) => {
      const isCompleted = c.status === 'CLOSED' || c.status === 'ARCHIVED';
      if (!isCompleted) return false;
      if (activePersona === 'L1') return c.p1Lawyer === activeLawyer;
      if (activePersona === 'L2') return c.p2Lawyer === activeLawyer;
      return c.p1Lawyer === activeLawyer || c.p2Lawyer === activeLawyer;
    }).length;
  }, [cases, activePersona, activeLawyer]);

  // Selected Case Object selector
  const selectedCaseObj = useMemo(() => {
    return cases.find((c) => c.id === selectedCaseId) || null;
  }, [cases, selectedCaseId]);

  const handleOpenDrawer = (caseId: string) => {
    setSelectedCaseId(caseId);
    setIsDrawerOpen(true);
  };

  const handlePersonaChange = (persona: LawyerPersona) => {
    setActivePersona(persona);
    setStatusFilter('ALL');
  };

  // Callback handlers for Case drawer actions
  const handleUploadVersion = (caseId: string, versionNum: string, desc: string) => {
    setCases((prevCases) =>
      prevCases.map((c) => {
        if (c.id !== caseId) return c;
        const newVer: AgreementVersion = {
          version: versionNum,
          uploadedBy: activeLawyer,
          uploadedDate: new Date().toLocaleString(),
          published: 'NO',
          description: desc,
          s3Path: `s3://prenup-bucket/cases/${caseId}/${versionNum}.pdf`,
          fileSize: '1.4 MB'
        };
        return {
          ...c,
          currentVersion: versionNum,
          lastActivity: new Date().toISOString().split('T')[0],
          versions: [...c.versions, newVer]
        };
      })
    );
  };

  const handleUploadCleanMaster = (caseId: string) => {
    setCases((prevCases) =>
      prevCases.map((c) => {
        if (c.id !== caseId) return c;
        const cleanVerNum = 'v1.5 CLEAN MASTER';
        const cleanVer: AgreementVersion = {
          version: cleanVerNum,
          uploadedBy: activeLawyer,
          uploadedDate: new Date().toLocaleString(),
          published: 'Pending',
          description: 'Clean master document finalized for Client sign-offs',
          s3Path: `s3://prenup-bucket/cases/${caseId}/clean_master.pdf`,
          fileSize: '1.6 MB'
        };
        return {
          ...c,
          status: 'AWAITING_COUNTERPARTY_LAWYER_APPROVAL' as const,
          currentVersion: cleanVerNum,
          lastActivity: new Date().toISOString().split('T')[0],
          versions: [...c.versions, cleanVer]
        };
      })
    );
  };

  const handleApproveCleanMaster = (caseId: string) => {
    setCases((prevCases) =>
      prevCases.map((c) => {
        if (c.id !== caseId) return c;
        // Update versions published status of Clean Master to YES
        const updatedVersions = c.versions.map((v) => {
          if (v.version.includes('CLEAN MASTER')) {
            return { ...v, published: 'YES' as const };
          }
          return v;
        });
        return {
          ...c,
          status: 'CLIENT_APPROVAL_PENDING' as const,
          publishedVersion: 'v1.5',
          lastActivity: new Date().toISOString().split('T')[0],
          versions: updatedVersions
        };
      })
    );
  };

  const handleClientApprove = (caseId: string, party: 'p1' | 'p2') => {
    setCases((prevCases) =>
      prevCases.map((c) => {
        if (c.id !== caseId) return c;
        let nextStatus: CaseStatus = c.status;
        if (c.status === 'CLIENT_APPROVAL_PENDING') {
          nextStatus = 'CLIENT_PARTIALLY_APPROVED';
        } else if (c.status === 'CLIENT_PARTIALLY_APPROVED') {
          nextStatus = 'CLIENT_APPROVED'; // Both approved -> Ready for ILA
        }
        return {
          ...c,
          status: nextStatus,
          lastActivity: new Date().toISOString().split('T')[0],
        };
      })
    );
  };

  const handleIssueIla = (caseId: string, party: 'p1' | 'p2') => {
    setCases((prevCases) =>
      prevCases.map((c) => {
        if (c.id !== caseId) return c;
        const certObj = {
          lawyerName: activeLawyer,
          firmName: activePersona === 'L1' ? c.p1Firm : c.p2Firm,
          barNumber: activePersona === 'L1' ? 'LSO-48192' : 'LSO-64109',
          issueDate: new Date().toLocaleDateString(),
          signedPdfPath: `s3://prenup-bucket/cases/${caseId}/ila_${party}.pdf`
        };

        let nextStatus: CaseStatus = c.status;
        let p1Cert = c.ilaP1Cert;
        let p2Cert = c.ilaP2Cert;

        if (party === 'p1') {
          p1Cert = certObj;
          nextStatus = c.ilaP2Cert ? 'READY_FOR_SIGNING' : 'ILA_P1_COMPLETE';
        } else {
          p2Cert = certObj;
          nextStatus = c.ilaP1Cert ? 'READY_FOR_SIGNING' : 'ILA_P2_COMPLETE';
        }

        return {
          ...c,
          status: nextStatus,
          ilaP1Cert: p1Cert,
          ilaP2Cert: p2Cert,
          lastActivity: new Date().toISOString().split('T')[0],
        };
      })
    );
  };

  const handleSignAgreement = (caseId: string) => {
    setCases((prevCases) =>
      prevCases.map((c) => {
        if (c.id !== caseId) return c;
        return {
          ...c,
          status: 'CLOSED' as const,
          lastActivity: new Date().toISOString().split('T')[0],
        };
      })
    );
  };

  const handleSaveNote = (caseId: string, notes: string) => {
    setCases((prevCases) =>
      prevCases.map((c) => {
        if (c.id !== caseId) return c;
        const newNote: SummaryNote = {
          version: c.currentVersion,
          notes,
          createdBy: activeLawyer,
          createdDate: new Date().toLocaleString(),
          visibleTo: (activePersona === 'L3' ? 'L1' : activePersona) as 'L1' | 'L2' | 'BOTH'
        };
        return {
          ...c,
          notes: [...c.notes, newNote]
        };
      })
    );
  };

  const handleUploadAppendix = (caseId: string, section: 'A' | 'B' | 'C', title: string, desc: string, fileName: string) => {
    setCases((prevCases) =>
      prevCases.map((c) => {
        if (c.id !== caseId) return c;
        const newApp: Appendix = {
          id: `app-${section.toLowerCase()}-${Date.now()}`,
          title,
          description: desc,
          fileName,
          uploadedBy: activeLawyer,
          createdDate: new Date().toLocaleString(),
          s3Path: `s3://prenup-bucket/cases/${caseId}/${fileName}`
        };
        const updatedSection = [...c.appendices[section], newApp];
        return {
          ...c,
          appendices: {
            ...c.appendices,
            [section]: updatedSection
          }
        };
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-slate-800 flex font-sans">
      {/* Left Sidebar */}
      <LawyerSidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        assignedCount={assignedCount}
        completedCount={completedCount}
        activePersona={activePersona}
        onOpenProfile={() => setCurrentView('profile')}
      />

      {/* Main Area */}
      <div className="ml-[250px] flex-1 flex flex-col min-w-0">
        <LawyerTopBar
          currentView={currentView}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenScorecard={() => setIsScorecardOpen(true)}
          activePersona={activePersona}
          onPersonaChange={handlePersonaChange}
          onOpenProfile={() => setCurrentView('profile')}
        />

        {/* Content View Routing */}
        <main className="p-8 flex-1">
          {currentView === 'dashboard' && (
            <DashboardView
              cases={cases}
              activePersona={activePersona}
              onSelectCase={handleOpenDrawer}
              statusFilter={statusFilter}
              onFilterChange={setStatusFilter}
            />
          )}

          {currentView === 'assigned_cases' && (
            <CasesListView
              cases={cases}
              activePersona={activePersona}
              onSelectCase={handleOpenDrawer}
              searchQuery={searchQuery}
            />
          )}

          {currentView === 'completed' && (
            <CompletedCasesView
              cases={cases}
              activePersona={activePersona}
              onSelectCase={handleOpenDrawer}
              searchQuery={searchQuery}
            />
          )}

          {currentView === 'profile' && (
            <ProfileView activePersona={activePersona} />
          )}

          {currentView === 'settings' && (
            <SettingsView />
          )}

          {currentView === 'versions' && (
            <AgreementVersionsView
              cases={cases}
              activePersona={activePersona}
              onSelectCase={handleOpenDrawer}
            />
          )}

          {currentView === 'notes' && (
            <SummaryNotesView
              cases={cases}
              activePersona={activePersona}
              onSelectCase={handleOpenDrawer}
            />
          )}

          {currentView === 'appendices' && (
            <AppendicesView
              cases={cases}
              activePersona={activePersona}
              onSelectCase={handleOpenDrawer}
            />
          )}

          {currentView === 'ila' && (
            <IlaCertificatesView
              cases={cases}
              activePersona={activePersona}
              onSelectCase={handleOpenDrawer}
            />
          )}
        </main>
      </div>

      {/* Detail Slide Drawer */}
      <LawyerCaseDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        caseObj={selectedCaseObj}
        activePersona={activePersona}
        onUploadVersion={handleUploadVersion}
        onUploadCleanMaster={handleUploadCleanMaster}
        onApproveCleanMaster={handleApproveCleanMaster}
        onClientApprove={handleClientApprove}
        onIssueIla={handleIssueIla}
        onSignAgreement={handleSignAgreement}
        onSaveNote={handleSaveNote}
        onUploadAppendix={handleUploadAppendix}
      />

      {/* Scorecard Modal */}
      <ScorecardModal
        isOpen={isScorecardOpen}
        onClose={() => setIsScorecardOpen(false)}
      />
    </div>
  );
};
