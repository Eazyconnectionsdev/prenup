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
  // 3 REVIEW_PENDING (Review Pending)
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
    currentVersion: 'v1.0',
    publishedVersion: 'v1.0',
    lastActivity: '2026-08-20',
    daysInStatus: 3,
    p1Forms: P1_FORM_MOCK,
    p2Forms: P2_FORM_MOCK,
    versions: [
      { version: 'v1.0', uploadedBy: 'System', uploadedDate: '2026-08-01 10:00 AM', published: 'YES', description: 'Initial questionnaire generation', s3Path: 's3://prenup-bucket/cases/LP-001/v1.0.pdf', fileSize: '1.2 MB' },
    ],
    notes: [],
    appendices: { A: [], B: [], C: [] },
    emails: []
  },
  {
    id: 'LP-2026-002',
    service: 'Bespoke Prenup',
    status: 'LAWYER_REVIEW',
    p1Name: 'Oliver Queen',
    p2Name: 'Felicity Smoak',
    p1Firm: 'Blake Cassels LLP',
    p2Firm: 'Torys LLP',
    p1Lawyer: 'Robert Miller, Esq.',
    p2Lawyer: 'Mark Sterling, Esq.',
    currentVersion: 'v1.1',
    publishedVersion: 'v1.0',
    lastActivity: '2026-08-18',
    daysInStatus: 2,
    p1Forms: P1_FORM_MOCK,
    p2Forms: P2_FORM_MOCK,
    versions: [],
    notes: [],
    appendices: { A: [], B: [], C: [] },
    emails: []
  },
  {
    id: 'LP-2026-003',
    service: 'Standard Digital',
    status: 'LAWYER_REVIEW',
    p1Name: 'Barry Allen',
    p2Name: 'Iris West',
    p1Firm: 'Blake Cassels LLP',
    p2Firm: 'Torys LLP',
    p1Lawyer: 'Robert Miller, Esq.',
    p2Lawyer: 'Mark Sterling, Esq.',
    currentVersion: 'v1.0',
    publishedVersion: 'v1.0',
    lastActivity: '2026-08-20',
    daysInStatus: 1,
    p1Forms: P1_FORM_MOCK,
    p2Forms: P2_FORM_MOCK,
    versions: [],
    notes: [],
    appendices: { A: [], B: [], C: [] },
    emails: []
  },

  // 2 AWAITING_COUNTERPARTY_LAWYER_APPROVAL (Clean Master Upload Pending)
  {
    id: 'LP-2026-004',
    service: 'Express Tier',
    status: 'AWAITING_COUNTERPARTY_LAWYER_APPROVAL',
    p1Name: 'Peter Parker',
    p2Name: 'Mary Jane',
    p1Firm: 'Blake Cassels LLP',
    p2Firm: 'Torys LLP',
    p1Lawyer: 'Robert Miller, Esq.',
    p2Lawyer: 'Mark Sterling, Esq.',
    currentVersion: 'v1.2',
    publishedVersion: 'v1.1',
    lastActivity: '2026-08-15',
    daysInStatus: 4,
    p1Forms: P1_FORM_MOCK,
    p2Forms: P2_FORM_MOCK,
    versions: [],
    notes: [],
    appendices: { A: [], B: [], C: [] },
    emails: []
  },
  {
    id: 'LP-2026-005',
    service: 'Bespoke Prenup',
    status: 'AWAITING_COUNTERPARTY_LAWYER_APPROVAL',
    p1Name: 'Tony Stark',
    p2Name: 'Pepper Potts',
    p1Firm: 'Blake Cassels LLP',
    p2Firm: 'Torys LLP',
    p1Lawyer: 'Robert Miller, Esq.',
    p2Lawyer: 'Mark Sterling, Esq.',
    currentVersion: 'v1.3',
    publishedVersion: 'v1.1',
    lastActivity: '2026-08-14',
    daysInStatus: 5,
    p1Forms: P1_FORM_MOCK,
    p2Forms: P2_FORM_MOCK,
    versions: [],
    notes: [],
    appendices: { A: [], B: [], C: [] },
    emails: []
  },

  // 2 READY_FOR_SIGNING (Sign-Off & ILA Pending)
  {
    id: 'LP-2026-006',
    service: 'Premier Bespoke',
    status: 'READY_FOR_SIGNING',
    p1Name: 'Clark Kent',
    p2Name: 'Lois Lane',
    p1Firm: 'Blake Cassels LLP',
    p2Firm: 'Torys LLP',
    p1Lawyer: 'Robert Miller, Esq.',
    p2Lawyer: 'Mark Sterling, Esq.',
    currentVersion: 'v1.5',
    publishedVersion: 'v1.5',
    lastActivity: '2026-08-14',
    daysInStatus: 4,
    p1Forms: P1_FORM_MOCK,
    p2Forms: P2_FORM_MOCK,
    versions: [],
    notes: [],
    appendices: { A: [], B: [], C: [] },
    emails: []
  },
  {
    id: 'LP-2026-007',
    service: 'Standard Digital',
    status: 'READY_FOR_SIGNING',
    p1Name: 'Hal Jordan',
    p2Name: 'Carol Ferris',
    p1Firm: 'Blake Cassels LLP',
    p2Firm: 'Torys LLP',
    p1Lawyer: 'Robert Miller, Esq.',
    p2Lawyer: 'Mark Sterling, Esq.',
    currentVersion: 'v1.2',
    publishedVersion: 'v1.2',
    lastActivity: '2026-08-19',
    daysInStatus: 1,
    p1Forms: P1_FORM_MOCK,
    p2Forms: P2_FORM_MOCK,
    versions: [],
    notes: [],
    appendices: { A: [], B: [], C: [] },
    emails: []
  },

  // 7 FORMS_LOCKED (Onboarding Pending)
  {
    id: 'LP-2026-008',
    service: 'Express Tier',
    status: 'FORMS_LOCKED',
    p1Name: 'Bruce Wayne',
    p2Name: 'Selina Kyle',
    p1Firm: 'Blake Cassels LLP',
    p2Firm: 'Torys LLP',
    p1Lawyer: 'Robert Miller, Esq.',
    p2Lawyer: 'Mark Sterling, Esq.',
    currentVersion: 'v1.0',
    publishedVersion: 'v1.0',
    lastActivity: '2026-08-20',
    daysInStatus: 2,
    p1Forms: P1_FORM_MOCK,
    p2Forms: P2_FORM_MOCK,
    versions: [],
    notes: [],
    appendices: { A: [], B: [], C: [] },
    emails: []
  },
  {
    id: 'LP-2026-009',
    service: 'Express Tier',
    status: 'FORMS_LOCKED',
    p1Name: 'Reed Richards',
    p2Name: 'Sue Storm',
    p1Firm: 'Blake Cassels LLP',
    p2Firm: 'Torys LLP',
    p1Lawyer: 'Robert Miller, Esq.',
    p2Lawyer: 'Mark Sterling, Esq.',
    currentVersion: 'v1.0',
    publishedVersion: 'v1.0',
    lastActivity: '2026-08-20',
    daysInStatus: 2,
    p1Forms: P1_FORM_MOCK,
    p2Forms: P2_FORM_MOCK,
    versions: [],
    notes: [],
    appendices: { A: [], B: [], C: [] },
    emails: []
  },
  {
    id: 'LP-2026-010',
    service: 'Express Tier',
    status: 'FORMS_LOCKED',
    p1Name: 'Steve Rogers',
    p2Name: 'Peggy Carter',
    p1Firm: 'Blake Cassels LLP',
    p2Firm: 'Torys LLP',
    p1Lawyer: 'Robert Miller, Esq.',
    p2Lawyer: 'Mark Sterling, Esq.',
    currentVersion: 'v1.0',
    publishedVersion: 'v1.0',
    lastActivity: '2026-08-20',
    daysInStatus: 2,
    p1Forms: P1_FORM_MOCK,
    p2Forms: P2_FORM_MOCK,
    versions: [],
    notes: [],
    appendices: { A: [], B: [], C: [] },
    emails: []
  },
  {
    id: 'LP-2026-011',
    service: 'Express Tier',
    status: 'FORMS_LOCKED',
    p1Name: 'Wally West',
    p2Name: 'Linda Park',
    p1Firm: 'Blake Cassels LLP',
    p2Firm: 'Torys LLP',
    p1Lawyer: 'Robert Miller, Esq.',
    p2Lawyer: 'Mark Sterling, Esq.',
    currentVersion: 'v1.0',
    publishedVersion: 'v1.0',
    lastActivity: '2026-08-20',
    daysInStatus: 2,
    p1Forms: P1_FORM_MOCK,
    p2Forms: P2_FORM_MOCK,
    versions: [],
    notes: [],
    appendices: { A: [], B: [], C: [] },
    emails: []
  },
  {
    id: 'LP-2026-012',
    service: 'Express Tier',
    status: 'FORMS_LOCKED',
    p1Name: 'Arthur Curry',
    p2Name: 'Mera Ocean',
    p1Firm: 'Blake Cassels LLP',
    p2Firm: 'Torys LLP',
    p1Lawyer: 'Robert Miller, Esq.',
    p2Lawyer: 'Mark Sterling, Esq.',
    currentVersion: 'v1.0',
    publishedVersion: 'v1.0',
    lastActivity: '2026-08-20',
    daysInStatus: 2,
    p1Forms: P1_FORM_MOCK,
    p2Forms: P2_FORM_MOCK,
    versions: [],
    notes: [],
    appendices: { A: [], B: [], C: [] },
    emails: []
  },
  {
    id: 'LP-2026-013',
    service: 'Express Tier',
    status: 'FORMS_LOCKED',
    p1Name: 'Ray Palmer',
    p2Name: 'Jean Loring',
    p1Firm: 'Blake Cassels LLP',
    p2Firm: 'Torys LLP',
    p1Lawyer: 'Robert Miller, Esq.',
    p2Lawyer: 'Mark Sterling, Esq.',
    currentVersion: 'v1.0',
    publishedVersion: 'v1.0',
    lastActivity: '2026-08-20',
    daysInStatus: 2,
    p1Forms: P1_FORM_MOCK,
    p2Forms: P2_FORM_MOCK,
    versions: [],
    notes: [],
    appendices: { A: [], B: [], C: [] },
    emails: []
  },
  {
    id: 'LP-2026-014',
    service: 'Express Tier',
    status: 'FORMS_LOCKED',
    p1Name: 'Carter Hall',
    p2Name: 'Shiera Sanders',
    p1Firm: 'Blake Cassels LLP',
    p2Firm: 'Torys LLP',
    p1Lawyer: 'Robert Miller, Esq.',
    p2Lawyer: 'Mark Sterling, Esq.',
    currentVersion: 'v1.0',
    publishedVersion: 'v1.0',
    lastActivity: '2026-08-20',
    daysInStatus: 2,
    p1Forms: P1_FORM_MOCK,
    p2Forms: P2_FORM_MOCK,
    versions: [],
    notes: [],
    appendices: { A: [], B: [], C: [] },
    emails: []
  },

  // 6 CLOSED (Completed)
  {
    id: 'LP-2026-015',
    service: 'Express Tier',
    status: 'CLOSED',
    p1Name: 'Logan Howlett',
    p2Name: 'Jean Grey',
    p1Firm: 'Blake Cassels LLP',
    p2Firm: 'Torys LLP',
    p1Lawyer: 'Robert Miller, Esq.',
    p2Lawyer: 'Mark Sterling, Esq.',
    currentVersion: 'v2.0',
    publishedVersion: 'v2.0',
    lastActivity: '2026-08-10',
    daysInStatus: 10,
    p1Forms: P1_FORM_MOCK,
    p2Forms: P2_FORM_MOCK,
    versions: [],
    notes: [],
    appendices: { A: [], B: [], C: [] },
    emails: []
  },
  {
    id: 'LP-2026-016',
    service: 'Express Tier',
    status: 'CLOSED',
    p1Name: 'Scott Summers',
    p2Name: 'Emma Frost',
    p1Firm: 'Blake Cassels LLP',
    p2Firm: 'Torys LLP',
    p1Lawyer: 'Robert Miller, Esq.',
    p2Lawyer: 'Mark Sterling, Esq.',
    currentVersion: 'v2.0',
    publishedVersion: 'v2.0',
    lastActivity: '2026-08-11',
    daysInStatus: 9,
    p1Forms: P1_FORM_MOCK,
    p2Forms: P2_FORM_MOCK,
    versions: [],
    notes: [],
    appendices: { A: [], B: [], C: [] },
    emails: []
  },
  {
    id: 'LP-2026-017',
    service: 'Express Tier',
    status: 'CLOSED',
    p1Name: 'Remy LeBeau',
    p2Name: 'Anna Marie',
    p1Firm: 'Blake Cassels LLP',
    p2Firm: 'Torys LLP',
    p1Lawyer: 'Robert Miller, Esq.',
    p2Lawyer: 'Mark Sterling, Esq.',
    currentVersion: 'v2.0',
    publishedVersion: 'v2.0',
    lastActivity: '2026-08-12',
    daysInStatus: 8,
    p1Forms: P1_FORM_MOCK,
    p2Forms: P2_FORM_MOCK,
    versions: [],
    notes: [],
    appendices: { A: [], B: [], C: [] },
    emails: []
  },
  {
    id: 'LP-2026-018',
    service: 'Express Tier',
    status: 'CLOSED',
    p1Name: 'Hank Pym',
    p2Name: 'Janet Van Dyne',
    p1Firm: 'Blake Cassels LLP',
    p2Firm: 'Torys LLP',
    p1Lawyer: 'Robert Miller, Esq.',
    p2Lawyer: 'Mark Sterling, Esq.',
    currentVersion: 'v2.0',
    publishedVersion: 'v2.0',
    lastActivity: '2026-08-13',
    daysInStatus: 7,
    p1Forms: P1_FORM_MOCK,
    p2Forms: P2_FORM_MOCK,
    versions: [],
    notes: [],
    appendices: { A: [], B: [], C: [] },
    emails: []
  },
  {
    id: 'LP-2026-019',
    service: 'Express Tier',
    status: 'CLOSED',
    p1Name: 'Bruce Banner',
    p2Name: 'Betty Ross',
    p1Firm: 'Blake Cassels LLP',
    p2Firm: 'Torys LLP',
    p1Lawyer: 'Robert Miller, Esq.',
    p2Lawyer: 'Mark Sterling, Esq.',
    currentVersion: 'v2.0',
    publishedVersion: 'v2.0',
    lastActivity: '2026-08-14',
    daysInStatus: 6,
    p1Forms: P1_FORM_MOCK,
    p2Forms: P2_FORM_MOCK,
    versions: [],
    notes: [],
    appendices: { A: [], B: [], C: [] },
    emails: []
  },
  {
    id: 'LP-2026-020',
    service: 'Express Tier',
    status: 'CLOSED',
    p1Name: 'Matt Murdock',
    p2Name: 'Elektra Natchios',
    p1Firm: 'Blake Cassels LLP',
    p2Firm: 'Torys LLP',
    p1Lawyer: 'Robert Miller, Esq.',
    p2Lawyer: 'Mark Sterling, Esq.',
    currentVersion: 'v2.0',
    publishedVersion: 'v2.0',
    lastActivity: '2026-08-15',
    daysInStatus: 5,
    p1Forms: P1_FORM_MOCK,
    p2Forms: P2_FORM_MOCK,
    versions: [],
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

  const handleViewChange = (view: NavView) => {
    setCurrentView(view);
    setIsDrawerOpen(false);
    setSelectedCaseId(null);
  };

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

  const handleCardClick = (filter: string) => {
    setStatusFilter(filter);
    handleViewChange('assigned_cases');
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
  const isCaseOpen = isDrawerOpen && !!selectedCaseObj;

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 flex font-sans">
      {/* Left Sidebar */}
      <LawyerSidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        assignedCount={assignedCount}
        completedCount={completedCount}
        activePersona={activePersona}
        onOpenProfile={() => handleViewChange('profile')}
      />

      {/* Main Area */}
      <div className="ml-[250px] flex-1 flex flex-col min-w-0">
        {!isCaseOpen && (
          <LawyerTopBar
            currentView={currentView}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenScorecard={() => setIsScorecardOpen(true)}
            activePersona={activePersona}
            onPersonaChange={handlePersonaChange}
            onOpenProfile={() => handleViewChange('profile')}
          />
        )}

        {/* Content View Routing */}
        <main className={isCaseOpen ? "flex-1 flex flex-col min-w-0" : "p-8 flex-1"}>
          {isDrawerOpen && selectedCaseObj ? (
            <LawyerCaseDrawer
              isOpen={isDrawerOpen}
              onClose={() => {
                setIsDrawerOpen(false);
                setSelectedCaseId(null);
              }}
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
              isInline={true}
            />
          ) : (
            <>
              {currentView === 'dashboard' && (
                <DashboardView
                  cases={cases}
                  activePersona={activePersona}
                  onSelectCase={handleOpenDrawer}
                  statusFilter={statusFilter}
                  onFilterChange={setStatusFilter}
                  onCardClick={handleCardClick}
                />
              )}

              {currentView === 'assigned_cases' && (
                <CasesListView
                  cases={cases}
                  activePersona={activePersona}
                  onSelectCase={handleOpenDrawer}
                  searchQuery={searchQuery}
                  statusFilter={statusFilter}
                  onFilterChange={setStatusFilter}
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
            </>
          )}
        </main>
      </div>

      {/* Scorecard Modal */}
      <ScorecardModal
        isOpen={isScorecardOpen}
        onClose={() => setIsScorecardOpen(false)}
      />
    </div>
  );
};
