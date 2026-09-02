"use client";

import React, { useState, useMemo } from "react";
import {
  NavView,
  CaseItem,
  FilterState,
  AuditLog,
  RuleEntry,
  ApiLogEntry,
  ToastItem,
} from "@/types/case-manager";
import { CaseManagerSidebar } from "@/components/caseManager/CaseManagerSidebar";
import { CaseManagerTopBar } from "@/components/caseManager/CaseManagerTopBar";
import { DashboardLedgerView } from "@/components/caseManager/views/DashboardLedgerView";
import { CasesMasterView } from "@/components/caseManager/views/CasesMasterView";
import { ArchivedVaultView } from "@/components/caseManager/views/ArchivedVaultView";
import { ReportsView } from "@/components/caseManager/views/ReportsView";
import { CaseSlideDrawer } from "@/components/caseManager/drawer/CaseSlideDrawer";
import { ScorecardModal } from "@/components/caseManager/modals/ScorecardModal";
import { CaseManagerAccountModal } from "@/components/caseManager/modals/CaseManagerAccountModal";
import { ToastContainer } from "@/components/caseManager/ui/ToastContainer";


const MOCK_CASES: CaseItem[] = [
  // ── Existing cases (unchanged, just tagged with caseType) ──────────────

  {
    id: "SR12345",
    p1: "Arthur Vance",
    p2: "Sophia Lin",
    p1Email: "arthur.vance@example.com",
    p2Email: "sophia.lin@example.com",
    p1Phone: "+1 (416) 555-0192",
    p2Phone: "+1 (416) 555-0198",
    service: "Premier Bespoke",
    caseType: "CONTRACT",
    owner: "CASE MANAGER",
    actionLabel: "Awaiting Review",
    backendState: "CM_REVIEW",
    cmView: "Awaiting Review",
    createdDate: "2026-08-01",
    lastActivity: "2026-08-05",
    daysInStatus: 3,
    paymentStatus: "Paid",
    health: "AWAITING_REVIEW",
    priority: "HIGH",
    version: "v1.2",
    p1Firm: "",
    p1Lawyer: "",
    p2Firm: "",
    p2Lawyer: "",
  },
  {
    id: "SR12346",
    p1: "Marcus Thorne",
    p2: "Emma Ross",
    p1Email: "marcus.t@example.com",
    p2Email: "emma.r@example.com",
    p1Phone: "+1 (416) 555-0210",
    p2Phone: "+1 (416) 555-0211",
    service: "Standard Digital",
    caseType: "CONTRACT",
    owner: "CASE MANAGER",
    actionLabel: "Assign Lawyers",
    backendState: "CM_REVIEW",
    cmView: "Awaiting Review",
    createdDate: "2026-07-28",
    lastActivity: "2026-08-04",
    daysInStatus: 5,
    paymentStatus: "Paid",
    health: "AWAITING_REVIEW",
    priority: "CRITICAL",
    version: "v1.1",
    p1Firm: "",
    p1Lawyer: "",
    p2Firm: "",
    p2Lawyer: "",
  },
  {
    id: "SR12347",
    p1: "David Miller",
    p2: "Sarah Conner",
    p1Email: "david.m@example.com",
    p2Email: "sarah.c@example.com",
    p1Phone: "+1 (416) 555-0301",
    p2Phone: "+1 (416) 555-0302",
    service: "Premier Bespoke",
    caseType: "CONTRACT",
    owner: "LAWYER",
    actionLabel: "Returned To Lawyers",
    backendState: "RETURNED_TO_LAWYERS",
    cmView: "Returned To Lawyers",
    createdDate: "2026-07-25",
    lastActivity: "2026-08-03",
    daysInStatus: 8,
    paymentStatus: "Paid",
    health: "STUCK_7",
    priority: "MEDIUM",
    version: "v1.0",
    p1Firm: "Blake Cassels",
    p1Lawyer: "Robert Miller, Esq.",
    p2Firm: "Osler Hoskin",
    p2Lawyer: "Clara Conner, Esq.",
  },
  {
    id: "SR12348",
    p1: "Oliver Wright",
    p2: "Isabella Drake",
    p1Email: "oliver.w@example.com",
    p2Email: "isabella.d@example.com",
    p1Phone: "+1 (416) 555-0400",
    p2Phone: "+1 (416) 555-0401",
    service: "Express Tier",
    caseType: "CONTRACT",
    owner: "CLIENT",
    actionLabel: "Ready For Signature",
    backendState: "READY_FOR_SIGNING",
    cmView: "Ready For Signature",
    createdDate: "2026-07-20",
    lastActivity: "2026-08-02",
    daysInStatus: 12,
    paymentStatus: "Paid",
    health: "AWAITING_CLIENT",
    priority: "HIGH",
    version: "v2.0",
    p1Firm: "Goodmans LLP",
    p1Lawyer: "Edward Wright, Esq.",
    p2Firm: "Borden Ladner",
    p2Lawyer: "Rachel Drake, Esq.",
  },
  {
    id: "SR12349",
    p1: "Lucas Vance",
    p2: "Harper Lee",
    p1Email: "lucas.v@example.com",
    p2Email: "harper.l@example.com",
    p1Phone: "+1 (416) 555-0500",
    p2Phone: "+1 (416) 555-0501",
    service: "Premier Bespoke",
    caseType: "CONTRACT",
    owner: "CLIENT",
    actionLabel: "Wedding < 21 Days",
    backendState: "CLIENT_APPROVAL_PENDING",
    cmView: "Awaiting Client",
    createdDate: "2026-08-03",
    lastActivity: "2026-08-05",
    daysInStatus: 2,
    paymentStatus: "Paid",
    health: "ESCALATED",
    priority: "CRITICAL",
    version: "v1.0",
    p1Firm: "Stikeman Elliott LLP",
    p1Lawyer: "Jennifer Vance, Esq.",
    p2Firm: "Torys LLP",
    p2Lawyer: "Mark Sterling, Esq.",
  },
  {
    id: "SR12350",
    p1: "Alexander Vance",
    p2: "Sophia Sterling",
    p1Email: "alex.v@example.com",
    p2Email: "sophia.s@example.com",
    p1Phone: "+1 (416) 555-0600",
    p2Phone: "+1 (416) 555-0601",
    service: "Standard Digital",
    caseType: "CONTRACT",
    owner: "LAWYER",
    actionLabel: "Lawyer Certificate Expiring",
    backendState: "LAWYER_REVIEW",
    cmView: "Legal Review",
    createdDate: "2026-07-30",
    lastActivity: "2026-08-04",
    daysInStatus: 6,
    paymentStatus: "Pending",
    health: "AWAITING_LAWYER",
    priority: "HIGH",
    version: "v1.1",
    p1Firm: "Bennett Jones",
    p1Lawyer: "Arthur Vance, Esq.",
    p2Firm: "Torys LLP",
    p2Lawyer: "Mark Sterling, Esq.",
  },
  {
    id: "SR12351",
    p1: "Bruce Wayne",
    p2: "Selina Kyle",
    p1Email: "bruce.w@example.com",
    p2Email: "selina.k@example.com",
    p1Phone: "+1 (416) 555-0700",
    p2Phone: "+1 (416) 555-0701",
    service: "Premier Bespoke",
    caseType: "CONTRACT",
    owner: "LAWYER",
    actionLabel: "Matter Stuck > 14 Days",
    backendState: "LAWYER_REVIEW",
    cmView: "Legal Review",
    createdDate: "2026-07-15",
    lastActivity: "2026-08-01",
    daysInStatus: 15,
    paymentStatus: "Paid",
    health: "STUCK_14",
    priority: "CRITICAL",
    version: "v1.0",
    p1Firm: "Wayne Legal PC",
    p1Lawyer: "Alfred Pennyworth, Esq.",
    p2Firm: "Kyle & Associates",
    p2Lawyer: "Harvey Dent, Esq.",
  },
  {
    id: "SR12352",
    p1: "Clark Kent",
    p2: "Lois Lane",
    p1Email: "clark.k@example.com",
    p2Email: "lois.l@example.com",
    p1Phone: "+1 (416) 555-0800",
    p2Phone: "+1 (416) 555-0801",
    service: "Express Tier",
    caseType: "CONTRACT",
    owner: "CLIENT",
    actionLabel: "Client Complaint",
    backendState: "CLIENT_APPROVAL_PENDING",
    cmView: "Awaiting Client",
    createdDate: "2026-08-01",
    lastActivity: "2026-08-05",
    daysInStatus: 4,
    paymentStatus: "Paid",
    health: "ESCALATED",
    priority: "HIGH",
    version: "v1.2",
    p1Firm: "Daily Legal LLP",
    p1Lawyer: "Perry White, Esq.",
    p2Firm: "Metropolis Law",
    p2Lawyer: "Jimmy Olsen, Esq.",
  },
  {
    id: "SR12353",
    p1: "Barry Allen",
    p2: "Iris West",
    p1Email: "barry.a@example.com",
    p2Email: "iris.w@example.com",
    p1Phone: "+1 (416) 555-0900",
    p2Phone: "+1 (416) 555-0901",
    service: "Standard Digital",
    caseType: "CONTRACT",
    owner: "CASE MANAGER",
    actionLabel: "Conflict Assignment Failure",
    backendState: "CM_REVIEW",
    cmView: "Awaiting Review",
    createdDate: "2026-08-04",
    lastActivity: "2026-08-05",
    daysInStatus: 1,
    paymentStatus: "Refunded",
    health: "ESCALATED",
    priority: "MEDIUM",
    version: "v1.0",
    p1Firm: "Central Legal",
    p1Lawyer: "Henry Allen, Esq.",
    p2Firm: "West & Co.",
    p2Lawyer: "Joe West, Esq.",
  },
  {
    id: "SR12354",
    p1: "Arthur Curry",
    p2: "Mera Ocean",
    p1Email: "arthur.c@example.com",
    p2Email: "mera.o@example.com",
    p1Phone: "+1 (416) 555-1000",
    p2Phone: "+1 (416) 555-1001",
    service: "Premier Bespoke",
    caseType: "CONTRACT",
    owner: "SYSTEM",
    actionLabel: "Executed",
    backendState: "CLOSED",
    cmView: "Executed",
    createdDate: "2026-07-10",
    lastActivity: "2026-07-28",
    daysInStatus: 25,
    paymentStatus: "Paid",
    health: "ALL",
    priority: "LOW",
    version: "v2.0",
    p1Firm: "Atlantis Legal",
    p1Lawyer: "Vulko Counsel",
    p2Firm: "Xebel Law",
    p2Lawyer: "Nereus Counsel",
  },
  {
    id: "SR12355",
    p1: "Victor Stone",
    p2: "Raven Roth",
    p1Email: "victor.s@example.com",
    p2Email: "raven.r@example.com",
    p1Phone: "+1 (416) 555-1100",
    p2Phone: "+1 (416) 555-1101",
    service: "Bespoke Prenup",
    caseType: "PRENUP",
    owner: "SYSTEM",
    actionLabel: "Archived",
    backendState: "ARCHIVED",
    cmView: "Archived",
    createdDate: "2026-06-01",
    lastActivity: "2026-07-01",
    daysInStatus: 60,
    paymentStatus: "Paid",
    health: "ALL",
    priority: "LOW",
    version: "v2.0",
    p1Firm: "STAR Legal",
    p1Lawyer: "Silas Stone, Esq.",
    p2Firm: "Azarath Law",
    p2Lawyer: "Trigon Counsel",
  },

  // ── New cases added to populate every box in the redesigned dashboard ──

  // Stage 1 — Contracts: "Partner Filling"
  {
    id: "SR12356",
    p1: "Peter Parker",
    p2: "MJ Watson",
    p1Email: "peter.p@example.com",
    p2Email: "mj.w@example.com",
    p1Phone: "+1 (416) 555-1200",
    p2Phone: "+1 (416) 555-1201",
    service: "Premier Bespoke",
    caseType: "CONTRACT",
    owner: "CLIENT",
    actionLabel: "Partner Filling",
    backendState: "CLIENT_FILLING",
    cmView: "Partner Filling",
    createdDate: "2026-08-10",
    lastActivity: "2026-08-12",
    daysInStatus: 2,
    paymentStatus: "Paid",
    health: "AWAITING_CLIENT",
    priority: "MEDIUM",
    version: "v1.0",
    p1Firm: "",
    p1Lawyer: "",
    p2Firm: "",
    p2Lawyer: "",
  },

  // Stage 1 — Prenup: "Partner Not Invited"
  {
    id: "SR12357",
    p1: "Tony Stark",
    p2: "Pepper Potts",
    p1Email: "tony.s@example.com",
    p2Email: "pepper.p@example.com",
    p1Phone: "+1 (416) 555-1300",
    p2Phone: "+1 (416) 555-1301",
    service: "Bespoke Prenup",
    caseType: "PRENUP",
    owner: "CLIENT",
    actionLabel: "Partner Not Invited",
    backendState: "PARTNER_NOT_INVITED",
    cmView: "Partner Not Invited",
    createdDate: "2026-08-11",
    lastActivity: "2026-08-11",
    daysInStatus: 1,
    paymentStatus: "Paid",
    health: "AWAITING_CLIENT",
    priority: "MEDIUM",
    version: "v1.0",
    p1Firm: "",
    p1Lawyer: "",
    p2Firm: "",
    p2Lawyer: "",
  },

  // Stage 1 — PostNup: "Partners Are Filling"
  {
    id: "SR12358",
    p1: "Steve Rogers",
    p2: "Sharon Carter",
    p1Email: "steve.r@example.com",
    p2Email: "sharon.c@example.com",
    p1Phone: "+1 (416) 555-1400",
    p2Phone: "+1 (416) 555-1401",
    service: "Standard PostNup",
    caseType: "POSTNUP",
    owner: "CLIENT",
    actionLabel: "Partners Are Filling",
    backendState: "CLIENT_FILLING",
    cmView: "Partners Are Filling",
    createdDate: "2026-08-09",
    lastActivity: "2026-08-12",
    daysInStatus: 3,
    paymentStatus: "Paid",
    health: "AWAITING_CLIENT",
    priority: "MEDIUM",
    version: "v1.0",
    p1Firm: "",
    p1Lawyer: "",
    p2Firm: "",
    p2Lawyer: "",
  },

  // Stage 2 — PostNup: "Not Approved"
  {
    id: "SR12359",
    p1: "Natasha Romanoff",
    p2: "Bucky Barnes",
    p1Email: "natasha.r@example.com",
    p2Email: "bucky.b@example.com",
    p1Phone: "+1 (416) 555-1500",
    p2Phone: "+1 (416) 555-1501",
    service: "Standard PostNup",
    caseType: "POSTNUP",
    owner: "CASE MANAGER",
    actionLabel: "Not Approved",
    backendState: "NOT_APPROVED",
    cmView: "Not Approved",
    createdDate: "2026-08-06",
    lastActivity: "2026-08-11",
    daysInStatus: 5,
    paymentStatus: "Paid",
    health: "AWAITING_REVIEW",
    priority: "HIGH",
    version: "v1.0",
    p1Firm: "",
    p1Lawyer: "",
    p2Firm: "",
    p2Lawyer: "",
  },

  // Stage 2 — Cobhab: "Not Assigned"
  {
    id: "SR12360",
    p1: "Wanda Maximoff",
    p2: "Vision",
    p1Email: "wanda.m@example.com",
    p2Email: "vision@example.com",
    p1Phone: "+1 (416) 555-1600",
    p2Phone: "+1 (416) 555-1601",
    service: "Standard Cohab",
    caseType: "COHAB",
    owner: "CASE MANAGER",
    actionLabel: "Not Assigned",
    backendState: "NOT_ASSIGNED",
    cmView: "Not Assigned",
    createdDate: "2026-08-07",
    lastActivity: "2026-08-10",
    daysInStatus: 3,
    paymentStatus: "Paid",
    health: "AWAITING_REVIEW",
    priority: "MEDIUM",
    version: "v1.0",
    p1Firm: "",
    p1Lawyer: "",
    p2Firm: "",
    p2Lawyer: "",
  },

  // Stage 3 — PostNup Partner 1 sub-statuses
  {
    id: "SR12361",
    p1: "Sam Wilson",
    p2: "Leila Wilson",
    p1Email: "sam.w@example.com",
    p2Email: "leila.w@example.com",
    p1Phone: "+1 (416) 555-1700",
    p2Phone: "+1 (416) 555-1701",
    service: "Standard PostNup",
    caseType: "POSTNUP",
    owner: "LAWYER",
    actionLabel: "P1 Pre Lawyer Questionnaire Pending",
    backendState: "P1_PRE_LAWYER_QUESTIONNAIRE_PENDING",
    cmView: "Legal Review",
    createdDate: "2026-08-05",
    lastActivity: "2026-08-10",
    daysInStatus: 5,
    paymentStatus: "Paid",
    health: "AWAITING_LAWYER",
    priority: "MEDIUM",
    version: "v1.0",
    p1Firm: "",
    p1Lawyer: "",
    p2Firm: "",
    p2Lawyer: "",
  },
  {
    id: "SR12362",
    p1: "Scott Lang",
    p2: "Hope Van Dyne",
    p1Email: "scott.l@example.com",
    p2Email: "hope.v@example.com",
    p1Phone: "+1 (416) 555-1800",
    p2Phone: "+1 (416) 555-1801",
    service: "Standard PostNup",
    caseType: "POSTNUP",
    owner: "LAWYER",
    actionLabel: "P1 Lawyer - Clients Approval Waiting",
    backendState: "P1_CLIENT_APPROVAL_WAITING",
    cmView: "Legal Review",
    createdDate: "2026-08-04",
    lastActivity: "2026-08-09",
    daysInStatus: 6,
    paymentStatus: "Paid",
    health: "AWAITING_CLIENT",
    priority: "MEDIUM",
    version: "v1.0",
    p1Firm: "Pym Legal Group",
    p1Lawyer: "Hank Pym, Esq.",
    p2Firm: "",
    p2Lawyer: "",
  },
  {
    id: "SR12363",
    p1: "Carol Danvers",
    p2: "Maria Rambeau",
    p1Email: "carol.d@example.com",
    p2Email: "maria.r@example.com",
    p1Phone: "+1 (416) 555-1900",
    p2Phone: "+1 (416) 555-1901",
    service: "Standard PostNup",
    caseType: "POSTNUP",
    owner: "LAWYER",
    actionLabel: "P1 Lawyer - Lawyer Approval Waiting",
    backendState: "P1_LAWYER_APPROVAL_WAITING",
    cmView: "Legal Review",
    createdDate: "2026-08-03",
    lastActivity: "2026-08-08",
    daysInStatus: 7,
    paymentStatus: "Paid",
    health: "AWAITING_LAWYER",
    priority: "MEDIUM",
    version: "v1.0",
    p1Firm: "Danvers & Rambeau LLP",
    p1Lawyer: "Fury Legal, Esq.",
    p2Firm: "",
    p2Lawyer: "",
  },
  {
    id: "SR12364",
    p1: "Stephen Strange",
    p2: "Christine Palmer",
    p1Email: "stephen.s@example.com",
    p2Email: "christine.p@example.com",
    p1Phone: "+1 (416) 555-2000",
    p2Phone: "+1 (416) 555-2001",
    service: "Standard PostNup",
    caseType: "POSTNUP",
    owner: "CASE MANAGER",
    actionLabel: "P1 Awaiting ILA",
    backendState: "P1_AWAITING_ILA",
    cmView: "Awaiting ILA",
    createdDate: "2026-08-02",
    lastActivity: "2026-08-07",
    daysInStatus: 5,
    paymentStatus: "Paid",
    health: "AWAITING_REVIEW",
    priority: "LOW",
    version: "v1.0",
    p1Firm: "Sanctum Legal",
    p1Lawyer: "Wong, Esq.",
    p2Firm: "",
    p2Lawyer: "",
  },

  // Stage 3 — Cobhab Partner 2 sub-statuses
  {
    id: "SR12365",
    p1: "T'Challa",
    p2: "Nakia",
    p1Email: "tchalla@example.com",
    p2Email: "nakia@example.com",
    p1Phone: "+1 (416) 555-2100",
    p2Phone: "+1 (416) 555-2101",
    service: "Standard Cohab",
    caseType: "COHAB",
    owner: "LAWYER",
    actionLabel: "P2 Pre Lawyer Questionnaire Pending",
    backendState: "P2_PRE_LAWYER_QUESTIONNAIRE_PENDING",
    cmView: "Legal Review",
    createdDate: "2026-08-05",
    lastActivity: "2026-08-10",
    daysInStatus: 5,
    paymentStatus: "Paid",
    health: "AWAITING_LAWYER",
    priority: "MEDIUM",
    version: "v1.0",
    p1Firm: "",
    p1Lawyer: "",
    p2Firm: "",
    p2Lawyer: "",
  },
  {
    id: "SR12366",
    p1: "Peter Quill",
    p2: "Gamora",
    p1Email: "peter.q@example.com",
    p2Email: "gamora@example.com",
    p1Phone: "+1 (416) 555-2200",
    p2Phone: "+1 (416) 555-2201",
    service: "Standard Cohab",
    caseType: "COHAB",
    owner: "LAWYER",
    actionLabel: "P2 Lawyer - Clients Approval Waiting",
    backendState: "P2_CLIENT_APPROVAL_WAITING",
    cmView: "Legal Review",
    createdDate: "2026-08-04",
    lastActivity: "2026-08-09",
    daysInStatus: 6,
    paymentStatus: "Paid",
    health: "AWAITING_CLIENT",
    priority: "MEDIUM",
    version: "v1.0",
    p1Firm: "",
    p1Lawyer: "",
    p2Firm: "Zen Whoberi Legal",
    p2Lawyer: "Mantis, Esq.",
  },
  {
    id: "SR12367",
    p1: "Matt Murdock",
    p2: "Karen Page",
    p1Email: "matt.m@example.com",
    p2Email: "karen.p@example.com",
    p1Phone: "+1 (416) 555-2300",
    p2Phone: "+1 (416) 555-2301",
    service: "Standard Cohab",
    caseType: "COHAB",
    owner: "LAWYER",
    actionLabel: "P2 Lawyer - Lawyer Approval Waiting",
    backendState: "P2_LAWYER_APPROVAL_WAITING",
    cmView: "Legal Review",
    createdDate: "2026-08-03",
    lastActivity: "2026-08-08",
    daysInStatus: 7,
    paymentStatus: "Paid",
    health: "AWAITING_LAWYER",
    priority: "MEDIUM",
    version: "v1.0",
    p1Firm: "",
    p1Lawyer: "",
    p2Firm: "Nelson & Murdock",
    p2Lawyer: "Foggy Nelson, Esq.",
  },
  {
    id: "SR12368",
    p1: "Jessica Jones",
    p2: "Luke Cage",
    p1Email: "jessica.j@example.com",
    p2Email: "luke.c@example.com",
    p1Phone: "+1 (416) 555-2400",
    p2Phone: "+1 (416) 555-2401",
    service: "Standard Cohab",
    caseType: "COHAB",
    owner: "CASE MANAGER",
    actionLabel: "P2 Awaiting ILA",
    backendState: "P2_AWAITING_ILA",
    cmView: "Awaiting ILA",
    createdDate: "2026-08-02",
    lastActivity: "2026-08-07",
    daysInStatus: 5,
    paymentStatus: "Paid",
    health: "AWAITING_REVIEW",
    priority: "LOW",
    version: "v1.0",
    p1Firm: "",
    p1Lawyer: "",
    p2Firm: "Alias Investigations Legal",
    p2Lawyer: "Jeri Hogarth, Esq.",
  },
];


export default function CaseManager() {
  const [currentView, setCurrentView] = useState<NavView>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterState, setFilterState] = useState<FilterState>({
    status: "ALL",
    health: "ALL",
    payment: "ALL",
    dateRange: "ALL",
    searchQuery: "",
  });

  const [cases, setCases] = useState<CaseItem[]>(MOCK_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScorecardOpen, setIsScorecardOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [apiLogs, setApiLogs] = useState<ApiLogEntry[]>([]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      actor: "Conflict Engine V1.0",
      action: "RULE_1_TRIGGERED",
      module: "CONFLICT_ENGINE",
      ipAddress: "127.0.0.1",
      timestamp: "2026-08-01 10:14 AM",
      before: "CM_REVIEW",
      after: "LAWYER_REVIEW",
    },
    {
      actor: "Rule 2 Sentinel",
      action: "QUESTIONNAIRE_LOCKED",
      module: "QUESTIONNAIRE",
      ipAddress: "127.0.0.1",
      timestamp: "2026-08-02 14:22 PM",
      before: "EDITABLE",
      after: "FROZEN",
    },
    {
      actor: "Sarah Jenkins",
      action: "LAWYER_ASSIGNED",
      module: "LAWYER_MANAGEMENT",
      ipAddress: "192.168.1.104",
      timestamp: "2026-08-03 09:00 AM",
      before: "UNASSIGNED",
      after: "ASSIGNED",
    },
  ]);

  const showToast = (
    message: string,
    type: "info" | "success" | "warning" = "info",
  ) => {
    const newToast: ToastItem = { id: Date.now().toString(), message, type };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const logApi = (endpoint: string, method: string, mockPayload: any) => {
    const entry: ApiLogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      endpoint,
      method,
      payload: mockPayload,
    };
    setApiLogs((prev) => [...prev, entry]);
  };

  const addAuditLog = (
    action: string,
    actor: string,
    before: string,
    after: string,
  ) => {
    const newLog: AuditLog = {
      actor,
      action,
      module: "CM_PORTAL",
      ipAddress: "192.168.1.104",
      timestamp: new Date().toLocaleString(),
      before,
      after,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleOpenDrawer = (caseId: string) => {
    setSelectedCaseId(caseId);
    setIsDrawerOpen(true);
  };

  const handleFilterChange = (key: keyof FilterState, val: string) => {
    setFilterState((prev) => ({ ...prev, [key]: val }));
  };

  const handleResetFilters = () => {
    setFilterState({
      status: "ALL",
      health: "ALL",
      payment: "ALL",
      dateRange: "ALL",
      searchQuery: "",
    });
  };

  const handleFilterByScorecardStatus = (statusFilter: string) => {

    console.log("statusFilter", statusFilter)

    if (statusFilter === "ARCHIVED") {
      setCurrentView("archived");
    } else if (statusFilter === "ALL") {
      setCurrentView("cases");
      setFilterState((prev) => ({ ...prev, status: "ALL" }));
    } else {
      setCurrentView("cases");
      setFilterState((prev) => ({ ...prev, status: statusFilter }));
    }
  };

  const selectedCaseObj = useMemo(() => {
    return cases.find((c) => c.id === selectedCaseId) || null;
  }, [cases, selectedCaseId]);

  const activeCasesList = useMemo(() => {
    return cases.filter((c) => {
      if (c.backendState === "ARCHIVED") return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.id.toLowerCase().includes(q) ||
          c.p1.toLowerCase().includes(q) ||
          c.p2.toLowerCase().includes(q) ||
          c.service.toLowerCase().includes(q) ||
          c.owner.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [cases, searchQuery]);

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      if (c.backendState === "ARCHIVED") return false;
      if (filterState.status !== "ALL") {
        if (c.backendState !== filterState.status) {
          return false;
        }
      }
      if (filterState.health !== "ALL" && c.health !== filterState.health)
        return false;
      if (
        filterState.payment !== "ALL" &&
        c.paymentStatus !== filterState.payment
      )
        return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          c.id.toLowerCase().includes(q) ||
          c.p1.toLowerCase().includes(q) ||
          c.p2.toLowerCase().includes(q) ||
          c.p1Email.toLowerCase().includes(q) ||
          c.p2Email.toLowerCase().includes(q) ||
          c.p1Phone.toLowerCase().includes(q) ||
          c.p2Phone.toLowerCase().includes(q) ||
          c.p1Firm.toLowerCase().includes(q) ||
          c.p2Firm.toLowerCase().includes(q) ||
          c.service.toLowerCase().includes(q) ||
          c.version.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [cases, filterState, searchQuery]);

  const archivedCases = useMemo(() => {
    return cases.filter((c) => {
      if (c.backendState !== "ARCHIVED") return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.id.toLowerCase().includes(q) ||
          c.p1.toLowerCase().includes(q) ||
          c.p2.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [cases, searchQuery]);


  const handleApproveCase = () => {
    if (!selectedCaseObj) return;
    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedCaseObj.id
          ? {
              ...c,
              backendState: "LAWYER_REVIEW",
              cmView: "Legal Review",
              actionLabel: "Assign Lawyers",
              owner: "LAWYER",
            }
          : c,
      ),
    );
    addAuditLog("CASE_APPROVED", "Sarah Jenkins", "CM_REVIEW", "LAWYER_REVIEW");
    showToast(
      `Case ${selectedCaseObj.id} Approved! Rule 1 Conflict Engine triggered.`,
      "success",
    );
    logApi(`/cm/cases/${selectedCaseObj.id}/approve`, "POST", {
      status: 200,
      action: "CASE_APPROVED",
    });
  };

  const handleReturnToDraft = () => {
    if (!selectedCaseObj) return;
    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedCaseObj.id
          ? {
              ...c,
              backendState: "RETURNED_TO_LAWYERS",
              cmView: "Returned To Lawyers",
              actionLabel: "Returned To Lawyers",
              owner: "LAWYER",
            }
          : c,
      ),
    );
    addAuditLog(
      "CASE_RETURNED",
      "Sarah Jenkins",
      selectedCaseObj.backendState,
      "RETURNED_TO_LAWYERS",
    );
    showToast(
      `Case ${selectedCaseObj.id} returned to counsel for draft amendment.`,
      "warning",
    );
    logApi(`/cm/cases/${selectedCaseObj.id}/return`, "POST", {
      status: 200,
      action: "CASE_RETURNED",
    });
  };

  const handleAssignLawyers = () => {
    if (!selectedCaseObj) return;
    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedCaseObj.id
          ? {
              ...c,
              backendState: "LAWYER_REVIEW",
              owner: "LAWYER",
              actionLabel: "Legal Review",
              cmView: "Legal Review",
            }
          : c,
      ),
    );
    addAuditLog(
      "LAWYER_ASSIGNED",
      "Sarah Jenkins",
      "UNASSIGNED",
      "LAWYER_REVIEW",
    );
    showToast(
      `Independent Legal Counsel assigned to ${selectedCaseObj.id}.`,
      "success",
    );
    logApi(`/cm/cases/${selectedCaseObj.id}/assign`, "POST", {
      status: 200,
      action: "LAWYER_ASSIGNED",
    });
  };

  const handleReplaceLawyer = () => {
    if (!selectedCaseObj) return;
    addAuditLog(
      "LAWYER_REPLACED",
      "Sarah Jenkins",
      "PREVIOUS_LAWYER",
      "NEW_LAWYER",
    );
    showToast(
      `Rule 6: Counsel replaced for ${selectedCaseObj.id}. Conflict check re-run.`,
      "warning",
    );
    logApi(`/cm/cases/${selectedCaseObj.id}/replace-lawyer`, "POST", {
      status: 200,
      action: "LAWYER_REPLACED",
    });
  };

  const handleSendReminder = () => {
    if (!selectedCaseObj) return;
    addAuditLog("REMINDER_SENT", "Sarah Jenkins", "NONE", "EMAIL_SENT");
    showToast(
      `SLA Email reminder sent to ${selectedCaseObj.p1} & ${selectedCaseObj.p2}.`,
      "info",
    );
    logApi(`/cm/cases/${selectedCaseObj.id}/reminder`, "POST", {
      status: 200,
      action: "REMINDER_SENT",
    });
  };

  const handleRegenPdf = () => {
    if (!selectedCaseObj) return;
    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedCaseObj.id ? { ...c, version: "v2.0" } : c,
      ),
    );
    addAuditLog(
      "PDF_REGENERATED",
      "Sarah Jenkins",
      selectedCaseObj.version,
      "v2.0",
    );
    showToast(
      `PDF agreement snapshot regenerated (v2.0) for ${selectedCaseObj.id}!`,
      "info",
    );
    logApi(`/cm/cases/${selectedCaseObj.id}/regenerate-pdf`, "POST", {
      status: 200,
      action: "PDF_REGENERATED",
    });
  };

  const handleEscalateCase = () => {
    if (!selectedCaseObj) return;
    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedCaseObj.id
          ? {
              ...c,
              priority: "CRITICAL",
              health: "ESCALATED",
              actionLabel: "Escalated ⚠️",
            }
          : c,
      ),
    );
    addAuditLog(
      "CASE_ESCALATED",
      "Sarah Jenkins",
      selectedCaseObj.priority,
      "CRITICAL",
    );
    showToast(
      `Rule 5: Case ${selectedCaseObj.id} Escalated to Internal Admin!`,
      "warning",
    );
    logApi(`/cm/cases/${selectedCaseObj.id}/escalate`, "POST", {
      status: 200,
      action: "CASE_ESCALATED",
    });
  };

  const handleArchiveCase = () => {
    if (!selectedCaseObj) return;
    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedCaseObj.id
          ? {
              ...c,
              backendState: "ARCHIVED",
              cmView: "Archived",
              actionLabel: "Archived",
            }
          : c,
      ),
    );
    addAuditLog(
      "CASE_ARCHIVED",
      "Sarah Jenkins",
      selectedCaseObj.backendState,
      "ARCHIVED",
    );
    showToast(`Case ${selectedCaseObj.id} moved to Archived Vault.`, "success");
    logApi(`/cm/cases/${selectedCaseObj.id}/archive`, "POST", {
      status: 200,
      action: "CASE_ARCHIVED",
    });
  };

  const handleSaveNote = (noteText: string) => {
    if (!selectedCaseObj) return;
    addAuditLog("NOTE_ADDED", "Sarah Jenkins", "NONE", "NOTE_CREATED");
    showToast("Confidential CM note saved.", "success");
    logApi(`/cm/cases/${selectedCaseObj.id}/note`, "POST", {
      status: 200,
      action: "NOTE_ADDED",
    });
  };

  const handleRbacProhibited = (actName: string) => {
    showToast(`RBAC PROHIBITED: Cannot perform "${actName}".`, "warning");
  };

  const handleUpdateCase = (updatedCase: CaseItem) => {
    setCases((prev) =>
      prev.map((c) => (c.id === updatedCase.id ? updatedCase : c)),
    );
    showToast(
      `Case ${updatedCase.id} details updated successfully.`,
      "success",
    );
    logApi(`/cm/cases/${updatedCase.id}/update`, "PUT", updatedCase);
  };

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-slate-800 flex font-sans">
      <CaseManagerSidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        casesCount={cases.filter((c) => c.backendState !== "ARCHIVED").length}
        archivedCount={
          cases.filter((c) => c.backendState === "ARCHIVED").length
        }
        onOpenAccountModal={() => setIsAccountModalOpen(true)}
      />


      <div className="ml-[240px] flex-1 flex flex-col min-w-0">
        <CaseManagerTopBar
          currentView={currentView}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenScorecard={() => setIsScorecardOpen(true)}
          onOpenAccountModal={() => setIsAccountModalOpen(true)}
        />

        <main className="p-8 flex-1">
          {currentView === "dashboard" && (
            <DashboardLedgerView
              activeCases={activeCasesList}
              allCases={cases}
              onSelectCase={handleOpenDrawer}
              onFilterByStatus={handleFilterByScorecardStatus}
            />
          )}

          {currentView === "cases" && (
            <CasesMasterView
              cases={filteredCases}
              filters={filterState}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              onSelectCase={handleOpenDrawer}
            />
          )}

          {currentView === "archived" && (
            <ArchivedVaultView
              archivedCases={archivedCases}
              onSelectCase={handleOpenDrawer}
            />
          )}

          {currentView === "reports" && (
            <ReportsView
              cases={cases}
              onLogApiCall={(ep, method, payload) => {
                logApi(ep, method, payload);
                showToast(`Report Endpoint: ${method} ${ep}`, "info");
              }}
            />
          )}
        </main>
      </div>

      {/* Slide Drawer */}
      <CaseSlideDrawer
        caseObj={selectedCaseObj}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        auditLogs={auditLogs}
        onApprove={handleApproveCase}
        onReturnToDraft={handleReturnToDraft}
        onAssignLawyers={handleAssignLawyers}
        onReplaceLawyer={handleReplaceLawyer}
        onSendReminder={handleSendReminder}
        onRegenPdf={handleRegenPdf}
        onEscalate={handleEscalateCase}
        onArchive={handleArchiveCase}
        onSaveNote={handleSaveNote}
        onRbacProhibitedTest={handleRbacProhibited}
        onUpdateCase={handleUpdateCase}
        onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
      />

      {/* Scorecard Modal */}
      <ScorecardModal
        isOpen={isScorecardOpen}
        onClose={() => setIsScorecardOpen(false)}
      />

      {/* Interactive Case Manager Account Profile Modal */}
      <CaseManagerAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onShowToast={showToast}
      />

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
};
