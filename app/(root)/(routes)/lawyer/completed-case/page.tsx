"use client";

import React, { useMemo, useState } from 'react';
import { Eye } from 'lucide-react';
import { LawyerCase, LawyerPersona } from '@/types/lawyer-portal';

interface CompletedCasesViewProps {
  cases: LawyerCase[];
  activePersona: LawyerPersona;
  onSelectCase: (caseId: string) => void;
  searchQuery: string;
}

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


const CompletedCasesView: React.FC<CompletedCasesViewProps> = ({
  activePersona,
  onSelectCase,
  searchQuery,
}) => {

  const [cases, setCases] = useState<LawyerCase[]>(MOCK_INITIAL_CASES);

  const getLawyerName = (persona: LawyerPersona) => {
    if (persona === 'L1') return 'Robert Miller, Esq.';
    if (persona === 'L2') return 'Mark Sterling, Esq.';
    return 'Clara Conner, Esq.';
  };

  const activeLawyer = getLawyerName(activePersona);

  const completedCases = useMemo(() => {
    return cases?.filter((c) => {
      const isCompleted = c.status === 'CLOSED' || c.status === 'ARCHIVED';
      if (!isCompleted) return false;

      if (activePersona === 'L1') {
        return c.p1Lawyer === activeLawyer;
      } else if (activePersona === 'L2') {
        return c.p2Lawyer === activeLawyer;
      } else {
        return c.p1Lawyer === activeLawyer || c.p2Lawyer === activeLawyer;
      }
    });
  }, [cases, activePersona, activeLawyer]);

  const filteredCases = useMemo(() => {
    return completedCases?.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.id.toLowerCase().includes(q) ||
          c.p1Name.toLowerCase().includes(q) ||
          c.p2Name.toLowerCase().includes(q) ||
          c.service.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [completedCases, searchQuery]);

  return (
    <div className="flex flex-col gap-6 max-w-[1280px] p-8">
      <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-base font-bold font-sans text-slate-900 tracking-tight">
            Completed Matters Archive ({filteredCases?.length} Found)
          </h3>
        </div>

        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="bg-slate-100 text-slate-600 uppercase tracking-wider text-[10px] font-bold border-b border-slate-300">
              <th className="p-4 pl-6">Case Code</th>
              <th className="p-4">My Client</th>
              <th className="p-4">Opposing Client</th>
              <th className="p-4">Status</th>
              <th className="p-4">Execution Date</th>
              <th className="p-4">Published Version</th>
              <th className="p-4 pr-6">Inspect</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases?.length > 0 ? (
              filteredCases.map((c) => {
                const myClient = activePersona === 'L1' ? c.p1Name : c.p2Name;
                const opposingClient = activePersona === 'L1' ? c.p2Name : c.p1Name;
                return (
                  <tr
                    key={c.id}
                    onClick={() => onSelectCase(c.id)}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-all cursor-pointer text-slate-700"
                  >
                    <td className="p-4 pl-6 font-mono font-bold text-slate-900">
                      {c.id}
                    </td>
                    <td className="p-4 font-semibold text-slate-900">
                      {myClient}
                    </td>
                    <td className="p-4">
                      {opposingClient}
                    </td>
                    <td className="p-4">
                      <span className="border border-slate-300 text-slate-700 bg-slate-100 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                        {c.status === 'CLOSED' || c.status === 'ARCHIVED' ? 'COMPLETED' : c.status}
                      </span>
                    </td>
                    <td className="p-4">{c.lastActivity}</td>
                    <td className="p-4 font-mono font-bold">{c.publishedVersion}</td>
                    <td className="p-4 pr-6">
                      <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-lg border border-slate-300 transition-all cursor-pointer">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400 text-xs font-sans italic">
                  No completed matters found. Completed cases show CLOSED or ARCHIVED states.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default CompletedCasesView