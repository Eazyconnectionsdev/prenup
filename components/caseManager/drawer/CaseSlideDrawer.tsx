"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Lock,
  Download,
  RefreshCw,
  Send,
  UserPlus,
  ArrowLeftRight,
  Archive,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building,
  Check,
  FileText,
  Clock,
  Mail,
  Shield,
  Eye,
  FileCode,
  DollarSign,
  User,
  Users,
  Edit3,
  Save,
  AlertTriangle,
  Briefcase,
  Layers,
  ChevronRight,
  Building2,
  UserCheck,
  Unlock,
  CheckSquare,
  HelpCircle,
  Plus,
  Trash2,
  XCircle,
  Square,
} from "lucide-react";
import {
  CaseItem,
  DrawerTabId,
  AuditLog,
  LawFirmOption,
} from "@/types/case-manager";
import AgreementTab from "../tabs/AgreementTab";
import OverViewTab from "../tabs/OverViewTab";

interface CaseSlideDrawerProps {
  caseObj: CaseItem | null;
  isOpen: boolean;
  onClose: () => void;
  auditLogs: AuditLog[];
  onApprove: () => void;
  onReturnToDraft: () => void;
  onAssignLawyers: () => void;
  onReplaceLawyer: () => void;
  onSendReminder: () => void;
  onRegenPdf: () => void;
  onEscalate: () => void;
  onArchive: () => void;
  onSaveNote: (note: string) => void;
  onRbacProhibitedTest: (actionName: string) => void;
  onUpdateCase?: (updatedCase: CaseItem) => void;
  onOpenPaymentModal?: () => void;
}

// FULL FIRMS & ATTORNEYS ROSTER DIRECTORY
const FIRM_DIRECTORY: LawFirmOption[] = [
  {
    firmName: "Stikeman Elliott LLP",
    city: "Toronto, ON",
    lawyers: [
      {
        name: "Jennifer Vance, Esq.",
        email: "jennifer.vance@stikeman.com",
        phone: "+1 (416) 869-5500",
        barId: "LSO-59281",
        title: "Senior Partner - Family Law",
      },
      {
        name: "Robert Sterling, Esq.",
        email: "robert.sterling@stikeman.com",
        phone: "+1 (416) 869-5512",
        barId: "LSO-60192",
        title: "Partner - Matrimonial Practice",
      },
    ],
  },
  {
    firmName: "Torys LLP",
    city: "Toronto, ON",
    lawyers: [
      {
        name: "Mark Sterling, Esq.",
        email: "mark.sterling@torys.com",
        phone: "+1 (416) 865-0040",
        barId: "LSO-64109",
        title: "Managing Partner - Estates & Prenups",
      },
      {
        name: "Clara Lin, Esq.",
        email: "clara.lin@torys.com",
        phone: "+1 (416) 865-0088",
        barId: "LSO-71029",
        title: "Senior Counsel - Family Wealth",
      },
    ],
  },
  {
    firmName: "Fasken Martineau",
    city: "Toronto, ON",
    lawyers: [
      {
        name: "David Ross, Esq.",
        email: "david.ross@fasken.com",
        phone: "+1 (416) 868-3000",
        barId: "LSO-51204",
        title: "Partner - Family Asset Protection",
      },
      {
        name: "Amanda Cole, Esq.",
        email: "amanda.cole@fasken.com",
        phone: "+1 (416) 868-3015",
        barId: "LSO-68912",
        title: "Associate Counsel",
      },
    ],
  },
  {
    firmName: "McCarthy Tétrault",
    city: "Toronto, ON",
    lawyers: [
      {
        name: "Sarah Lin, Esq.",
        email: "sarah.lin@mccarthy.com",
        phone: "+1 (416) 601-7500",
        barId: "LSO-49102",
        title: "Partner - Private Client Services",
      },
      {
        name: "James Drake, Esq.",
        email: "james.drake@mccarthy.com",
        phone: "+1 (416) 601-7540",
        barId: "LSO-55901",
        title: "Special Counsel",
      },
    ],
  },
  {
    firmName: "Blake Cassels",
    city: "Toronto, ON",
    lawyers: [
      {
        name: "Robert Miller, Esq.",
        email: "robert.miller@blakes.com",
        phone: "+1 (416) 863-2400",
        barId: "LSO-48192",
        title: "Senior Partner",
      },
      {
        name: "Helen Vance, Esq.",
        email: "helen.vance@blakes.com",
        phone: "+1 (416) 863-2420",
        barId: "LSO-63019",
        title: "Partner",
      },
    ],
  },
  {
    firmName: "Osler Hoskin",
    city: "Toronto, ON",
    lawyers: [
      {
        name: "Clara Conner, Esq.",
        email: "clara.conner@osler.com",
        phone: "+1 (416) 862-4200",
        barId: "LSO-57812",
        title: "Partner - Family Contracts",
      },
      {
        name: "Thomas Wayne, Esq.",
        email: "thomas.wayne@osler.com",
        phone: "+1 (416) 862-4290",
        barId: "LSO-41092",
        title: "Senior Counsel",
      },
    ],
  },
  {
    firmName: "Goodmans LLP",
    city: "Toronto, ON",
    lawyers: [
      {
        name: "Edward Wright, Esq.",
        email: "edward.wright@goodmans.com",
        phone: "+1 (416) 979-2211",
        barId: "LSO-50192",
        title: "Partner",
      },
    ],
  },
  {
    firmName: "Borden Ladner Gervais",
    city: "Toronto, ON",
    lawyers: [
      {
        name: "Rachel Drake, Esq.",
        email: "rachel.drake@blg.com",
        phone: "+1 (416) 367-6000",
        barId: "LSO-61920",
        title: "Partner",
      },
    ],
  },
  {
    firmName: "Bennett Jones",
    city: "Toronto, ON",
    lawyers: [
      {
        name: "Arthur Vance, Esq.",
        email: "arthur.vance@bennettjones.com",
        phone: "+1 (416) 863-1200",
        barId: "LSO-53019",
        title: "Managing Partner",
      },
    ],
  },
  {
    firmName: "Wayne Legal PC",
    city: "Toronto, ON",
    lawyers: [
      {
        name: "Alfred Pennyworth, Esq.",
        email: "alfred.p@waynelegal.com",
        phone: "+1 (416) 555-0700",
        barId: "LSO-31092",
        title: "Senior Principal Attorney",
      },
    ],
  },
  {
    firmName: "Daily Legal LLP",
    city: "Toronto, ON",
    lawyers: [
      {
        name: "Perry White, Esq.",
        email: "perry.white@dailylegal.com",
        phone: "+1 (416) 555-0800",
        barId: "LSO-44019",
        title: "Managing Partner",
      },
    ],
  },
];

export const CaseSlideDrawer: React.FC<CaseSlideDrawerProps> = ({
  caseObj,
  isOpen,
  onClose,
  auditLogs,
  onApprove,
  onReturnToDraft,
  onAssignLawyers,
  onReplaceLawyer,
  onSendReminder,
  onRegenPdf,
  onEscalate,
  onArchive,
  onSaveNote,
  onRbacProhibitedTest,
  onUpdateCase,
  onOpenPaymentModal,
}) => {
  const [activeTab, setActiveTab] = useState<DrawerTabId>("overview");
  const [noteInput, setNoteInput] = useState("");
  const [isTicked, setIsTicked] = useState(false);
  const [caseStatus, setCaseStatus] = useState(null);
  const [noteCategory, setNoteCategory] = useState<
    "Internal" | "Escalation" | "Risk" | "Complaint" | "Operational"
  >("Internal");

  const [notesList, setNotesList] = useState<
    { category: string; author: string; text: string; time: string }[]
  >([
    {
      category: "Internal",
      author: "Sarah Jenkins",
      text: "Reviewed submitted client questionnaires. All 9 sections verified.",
      time: "2 Hours Ago",
    },
    {
      category: "Risk",
      author: "System Sentinel",
      text: "Questionnaire submission locked against client edits.",
      time: "1 Day Ago",
    },
  ]);

  const VERSIONS = ['v1.0', 'v1.1', 'v1.2', 'v1.3', 'v1.4', 'v1.5', 'v2.0'];

    const [selectedVersions, setSelectedVersions] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  // FORMS TAB (TAB 2) SUB-STATE & COMPLETE 9 QUESTIONNAIRE SECTIONS
  const [formSubTab, setFormSubTab] = useState<"p1" | "p2" | "joint">("p1");
  const [isCmEditing, setIsCmEditing] = useState<boolean>(false);

  // COMPLETE P1 QUESTIONNAIRE DATA (100% QUESTIONS COVERED)
  const [p1FormData, setP1FormData] = useState({
    // Section 1: Personal Info
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "1988-04-12",
    englishFluency: "Yes",
    nationality: "CA",
    domicile: "Canada (Ontario Resident)",
    profession: "Senior Software Architect",
    street: "140 King St W, Suite 2400",
    city: "Toronto",
    county: "York",
    postcode: "M5H 3Y2",
    weddingDate: "2026-10-15",

    // Section 1a: Legal Declarations & Objectives
    agreementObjectives:
      "To clarify separate pre-marital property holdings, protect individual business equity, and establish a clear financial framework.",
    livingSituationFuture:
      "Currently residing in Toronto. Plan to acquire a joint property in 2027 while maintaining separate investment portfolios.",
    declPersonalEffects: true,
    declHouseholdContents: true,
    declCourtChildren: true,
    declCostSharing: true,
    declUndueInfluence: true,
    declIla: true,
    declPlatformDisclaimer: true,
    declAccuracyFinal: true,

    // Section 3a: Individual Assets
    realEstateAddress: "140 King St W, Suite 2400, Toronto ON",
    realEstateValue: "1850000",
    realEstateMortgage: "80000",
    realEstateTreatment: "KeepSeparate",

    bankAccountDetails: "RBC Checking & TD High-Interest Savings",
    bankAccountBalance: "320000",
    bankAccountUnsure: false,
    bankAccountTreatment: "KeepSeparate",

    investmentsBrokerage: "Questrade TFSA & RRSP Portfolios",
    investmentsValue: "480000",
    investmentsUnsure: false,
    investmentsTreatment: "KeepSeparate",

    pensionProvider: "Sun Life Corporate Pension Plan",
    pensionValue: "250000",
    pensionTreatment: "KeepSeparate",

    businessName: "TechCorp Holdings Inc. (40% Shareholder)",
    businessValue: "650000",
    businessTreatment: "KeepSeparate",

    hasIp: "Yes",
    ipDescription: "SaaS Architecture Patent #US-98210492",
    ipValue: "150000",
    ipTreatment: "KeepSeparate",

    hasChattels: "Yes",
    chattelsDescription: "2024 Tesla Model S & Rolex Collection",
    chattelsValue: "80000",
    chattelsTreatment: "KeepSeparate",

    hasOtherAssets: "No",
    otherAssetsDescription: "",
    otherAssetsValue: "",

    // Section 3b: Income & Revenue
    annualSalary: "240000",
    bonusesCommissions: "45000",
    businessDividends: "30000",
    rentalIncome: "0",
    otherIncome: "0",

    // Section 3c: Liabilities & Debts
    mortgagesDebt: "80000",
    bankLoans: "0",
    creditCardsDebt: "10000",
    studentLoans: "0",
    taxObligations: "0",
  });

  // COMPLETE P2 QUESTIONNAIRE DATA (100% QUESTIONS COVERED)
  const [p2FormData, setP2FormData] = useState({
    // Section 1: Personal Info
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "1991-09-25",
    englishFluency: "Yes",
    nationality: "CA",
    domicile: "Canada (Ontario Resident)",
    profession: "Financial Risk Manager",
    street: "88 Queens Quay E, Suite 1205",
    city: "Toronto",
    county: "York",
    postcode: "M5E 1Z7",
    weddingDate: "2026-10-15",

    // Section 1a: Legal Declarations & Objectives
    agreementObjectives:
      "To ensure mutual financial transparency, protect pre-existing wealth, and outline spousal support expectations.",
    livingSituationFuture:
      "Residing in Toronto. Future plans include joint investments and co-ownership of real estate.",
    declPersonalEffects: true,
    declHouseholdContents: true,
    declCourtChildren: true,
    declCostSharing: true,
    declUndueInfluence: true,
    declIla: true,
    declPlatformDisclaimer: true,
    declAccuracyFinal: true,

    // Section 3a: Individual Assets
    realEstateAddress: "88 Queens Quay E, Suite 1205, Toronto ON",
    realEstateValue: "950000",
    realEstateMortgage: "40000",
    realEstateTreatment: "KeepSeparate",

    bankAccountDetails: "Scotiabank Savings & BMO Checking",
    bankAccountBalance: "180000",
    bankAccountUnsure: false,
    bankAccountTreatment: "KeepSeparate",

    investmentsBrokerage: "Wealthsimple Index Portfolios & RRSP",
    investmentsValue: "450000",
    investmentsUnsure: false,
    investmentsTreatment: "KeepSeparate",

    pensionProvider: "HOOPP Defined Benefit Pension Plan",
    pensionValue: "180000",
    pensionTreatment: "KeepSeparate",

    businessName: "None",
    businessValue: "0",
    businessTreatment: "KeepSeparate",

    hasIp: "No",
    ipDescription: "",
    ipValue: "0",
    ipTreatment: "KeepSeparate",

    hasChattels: "Yes",
    chattelsDescription: "2023 Audi Q5 & Fine Jewelry",
    chattelsValue: "45000",
    chattelsTreatment: "KeepSeparate",

    hasOtherAssets: "No",
    otherAssetsDescription: "",
    otherAssetsValue: "",

    // Section 3b: Income & Revenue
    annualSalary: "175000",
    bonusesCommissions: "25000",
    businessDividends: "0",
    rentalIncome: "0",
    otherIncome: "0",

    // Section 3c: Liabilities & Debts
    mortgagesDebt: "40000",
    bankLoans: "0",
    creditCardsDebt: "10000",
    studentLoans: "0",
    taxObligations: "0",
  });

  // COMPLETE JOINT QUESTIONNAIRE DATA (SECTIONS 4a - 4d)
  const [jointFormData, setJointFormData] = useState({
    // Section 4a: Shared Assets
    sharedRealEstateAddress:
      "Co-owned Property (50/50 Equity Share - $600,000 Estimated Value)",
    sharedRealEstateValue: "600000",
    sharedRealEstateEquitySplit: "50/50 Equal Share",
    sharedBankAccounts: "RBC Joint High-Interest Savings Account",
    sharedBankBalance: "120000",
    sharedInvestments: "Joint Wealthsimple High-Yield Investment Account",
    sharedInvestmentsValue: "50000",

    // Section 4b: Shared Income & Revenue
    sharedRentalIncome: "24000",
    sharedBusinessIncome: "0",
    sharedOtherIncome: "0",

    // Section 4c: Shared Liabilities & Debts
    sharedMortgageDebt: "0",
    sharedCreditLines: "0",
    sharedOtherDebt: "0",

    // Section 4d: Matrimony, Dependants & Support
    priorMarriagesP1: "No Prior Marriages",
    priorMarriagesP2: "No Prior Marriages",
    dependantsCount: "0 Dependants",
    dependantsNamesAges: "N/A",
    spousalSupportObligations:
      "No Pre-existing Spousal or Child Support Orders",
    cmReviewNotes:
      "All submitted questionnaire responses verified complete by CM Sarah Jenkins.",
  });

  // LAWYERS TAB (TAB 4) STATE - DIRECT DROPDOWNS FOR P1 AND P2 LAW FIRM AND LAWYER
  const [selectedP1Firm, setSelectedP1Firm] = useState<string>("");
  const [selectedP1Lawyer, setSelectedP1Lawyer] = useState<string>("");
  const [p1LawyerDetails, setP1LawyerDetails] = useState({
    email: "",
    phone: "",
    barId: "",
    title: "",
  });

  const [selectedP2Firm, setSelectedP2Firm] = useState<string>("");
  const [selectedP2Lawyer, setSelectedP2Lawyer] = useState<string>("");
  const [p2LawyerDetails, setP2LawyerDetails] = useState({
    email: "",
    phone: "",
    barId: "",
    title: "",
  });

  // INITIALIZE / SYNC STATE WHEN CASE OBJECT CHANGES
  useEffect(() => {
    if (caseObj) {
      const p1Parts = caseObj.p1.split(" ");
      setP1FormData((prev) => ({
        ...prev,
        firstName: p1Parts[0] || "",
        lastName: p1Parts.slice(1).join(" ") || "",
      }));

      const p2Parts = caseObj.p2.split(" ");
      setP2FormData((prev) => ({
        ...prev,
        firstName: p2Parts[0] || "",
        lastName: p2Parts.slice(1).join(" ") || "",
      }));

      // SYNC LAWYER ASSIGNMENT STATE
      const p1F = caseObj.p1Firm || "";
      const p1L = caseObj.p1Lawyer || "";
      const p2F = caseObj.p2Firm || "";
      const p2L = caseObj.p2Lawyer || "";

      setSelectedP1Firm(p1F);
      setSelectedP1Lawyer(p1L);
      setSelectedP2Firm(p2F);
      setSelectedP2Lawyer(p2L);

      // Populate P1 Lawyer Details if existing
      if (p1F && p1L) {
        const firmObj = FIRM_DIRECTORY.find((f) => f.firmName === p1F);
        const l = firmObj?.lawyers.find((lawyer) => lawyer.name === p1L);
        if (l) {
          setP1LawyerDetails({
            email: l.email,
            phone: l.phone,
            barId: l.barId,
            title: l.title,
          });
        } else {
          setP1LawyerDetails({
            email: `${p1L.toLowerCase().replace(/[^a-z]/g, "")}@firm.com`,
            phone: "+1 (416) 869-5500",
            barId: "LSO-59281",
            title: "Senior Counsel",
          });
        }
      }

      // Populate P2 Lawyer Details if existing
      if (p2F && p2L) {
        const firmObj = FIRM_DIRECTORY.find((f) => f.firmName === p2F);
        const l = firmObj?.lawyers.find((lawyer) => lawyer.name === p2L);
        if (l) {
          setP2LawyerDetails({
            email: l.email,
            phone: l.phone,
            barId: l.barId,
            title: l.title,
          });
        } else {
          setP2LawyerDetails({
            email: `${p2L.toLowerCase().replace(/[^a-z]/g, "")}@firm.com`,
            phone: "+1 (416) 865-0040",
            barId: "LSO-64109",
            title: "Senior Counsel",
          });
        }
      }
    }
  }, [caseObj]);

  // UPDATE LAWYER ROSTER SELECTION WHEN P1 FIRM CHANGES
  const handleP1FirmSelect = (firmName: string) => {
    setSelectedP1Firm(firmName);
    const firmObj = FIRM_DIRECTORY.find((f) => f.firmName === firmName);
    if (firmObj && firmObj.lawyers.length > 0) {
      const l = firmObj.lawyers[0];
      setSelectedP1Lawyer(l.name);
      setP1LawyerDetails({
        email: l.email,
        phone: l.phone,
        barId: l.barId,
        title: l.title,
      });
    } else {
      setSelectedP1Lawyer("");
      setP1LawyerDetails({ email: "", phone: "", barId: "", title: "" });
    }
  };

  const handleP1LawyerSelect = (lawyerName: string) => {
    setSelectedP1Lawyer(lawyerName);
    const firmObj = FIRM_DIRECTORY.find((f) => f.firmName === selectedP1Firm);
    const l = firmObj?.lawyers.find((lawyer) => lawyer.name === lawyerName);
    if (l) {
      setP1LawyerDetails({
        email: l.email,
        phone: l.phone,
        barId: l.barId,
        title: l.title,
      });
    }
  };

  // UPDATE LAWYER ROSTER SELECTION WHEN P2 FIRM CHANGES
  const handleP2FirmSelect = (firmName: string) => {
    setSelectedP2Firm(firmName);
    const firmObj = FIRM_DIRECTORY.find((f) => f.firmName === firmName);
    if (firmObj && firmObj.lawyers.length > 0) {
      const l = firmObj.lawyers[0];
      setSelectedP2Lawyer(l.name);
      setP2LawyerDetails({
        email: l.email,
        phone: l.phone,
        barId: l.barId,
        title: l.title,
      });
    } else {
      setSelectedP2Lawyer("");
      setP2LawyerDetails({ email: "", phone: "", barId: "", title: "" });
    }
  };

  const handleP2LawyerSelect = (lawyerName: string) => {
    setSelectedP2Lawyer(lawyerName);
    const firmObj = FIRM_DIRECTORY.find((f) => f.firmName === selectedP2Firm);
    const l = firmObj?.lawyers.find((lawyer) => lawyer.name === lawyerName);
    if (l) {
      setP2LawyerDetails({
        email: l.email,
        phone: l.phone,
        barId: l.barId,
        title: l.title,
      });
    }
  };

  if (!isOpen || !caseObj) return null;

  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    setNotesList((prev) => [
      {
        category: noteCategory,
        author: "Sarah Jenkins",
        text: noteInput.trim(),
        time: "Just Now",
      },
      ...prev,
    ]);
    onSaveNote(`[${noteCategory}] ${noteInput.trim()}`);
    setNoteInput("");
  };

  // SAVE FORMS REVIEW & TRANSITION WORKFLOW
  const handleSaveFormsReview = () => {
    const updatedP1Name =
      `${p1FormData.firstName} ${p1FormData.lastName}`.trim() || caseObj.p1;
    const updatedP2Name =
      `${p2FormData.firstName} ${p2FormData.lastName}`.trim() || caseObj.p2;

    if (onUpdateCase && caseObj) {
      onUpdateCase({
        ...caseObj,
        p1: updatedP1Name,
        p2: updatedP2Name,
        backendState: "CM_REVIEW",
        cmView: "Review Completed",
        actionLabel: "Assign Lawyers",
      });
    }
    setIsCmEditing(false);
    onSaveNote(
      `Case Manager Sarah Jenkins completed questionnaire review for ${caseObj.id}. Form disclosures verified.`,
    );
  };

  // SAVE LAWYER ASSIGNMENT & TRIGGER CONFLICT ENGINE
  const handleConfirmLawyerAssignment = () => {
    if (
      !selectedP1Firm ||
      !selectedP1Lawyer ||
      !selectedP2Firm ||
      !selectedP2Lawyer
    ) {
      alert(
        "Please select both a Law Firm and a Lawyer for Partner 1 and Partner 2 before saving.",
      );
      return;
    }

    const isConflict = selectedP1Firm === selectedP2Firm;

    if (onUpdateCase && caseObj) {
      onUpdateCase({
        ...caseObj,
        p1Firm: selectedP1Firm,
        p1Lawyer: selectedP1Lawyer,
        p2Firm: selectedP2Firm,
        p2Lawyer: selectedP2Lawyer,
        backendState: "LAWYER_REVIEW",
        cmView: "Legal Review",
        actionLabel: isConflict ? "Conflict Warning" : "Legal Review",
        health: isConflict ? "ESCALATED" : caseObj.health,
        priority: isConflict ? "CRITICAL" : caseObj.priority,
      });
    }

    onSaveNote(
      `Assigned Counsel: Party 1 (${selectedP1Lawyer} - ${selectedP1Firm}) & Party 2 (${selectedP2Lawyer} - ${selectedP2Firm}). Conflict Engine Check executed.`,
    );
  };

  const isDualFirmConflict =
    selectedP1Firm !== "" && selectedP1Firm === selectedP2Firm;

  const tabs: { id: DrawerTabId; label: string }[] = [
    { id: "overview", label: "1. Overview" },
    { id: "forms", label: "2. Forms & Disclosures" },
    { id: "agreement", label: "3. Agreement" },
    { id: "lawyers", label: "4. CM Actions" },
    { id: "timeline", label: "5. Timeline" },
    { id: "audit", label: "7. Audit Logs" },
    { id: "notes", label: "8. CM Notes" },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex justify-end font-sans">
      <div className="w-full max-w-[960px] h-full bg-white border-l border-slate-300 flex flex-col shadow-2xl animate-in slide-in-from-right duration-250">
        {/* Drawer Header */}
        <div className="px-7 py-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-base font-bold text-slate-200">
              {caseObj.id}
            </span>
            <div className="text-sm font-bold text-white">
              {caseObj.p1} &amp; {caseObj.p2}
            </div>
            <span className="badge-rose-pill border-rose-400 bg-rose-950/80 text-rose-200 font-bold">
              {caseObj.cmView}
            </span>
            {caseObj.actionLabel && caseObj.actionLabel !== caseObj.cmView && (
              <span className="text-[10px] font-bold text-rose-300 bg-rose-900/60 border border-rose-500/50 px-2 py-0.5 rounded">
                {caseObj.actionLabel}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/90 border border-emerald-500/50 px-2.5 py-1 rounded-md flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" /> Read-Only Legal
              Guard (Section 21)
            </span>

            {onOpenPaymentModal && (
              <button
                onClick={onOpenPaymentModal}
                className="px-3 py-1 rounded-md bg-[#C5A880] text-[#0F172A] text-xs font-bold hover:bg-white transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                title="View Secure Fixed Fee Payment Details (€499)"
              >
                <span>💳</span>
                <span>Fixed Fee (€499)</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex bg-slate-100 border-b border-slate-300 px-6 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                activeTab === t.id
                  ? "text-slate-900 border-slate-900 bg-white"
                  : "text-slate-500 border-transparent hover:text-slate-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Drawer Body Content */}
        <div className="p-7 overflow-y-auto flex-1 flex flex-col gap-6 bg-slate-50/50">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <OverViewTab caseObj={caseObj} />
          )}

          {/* TAB 2: FORMS & QUESTIONNAIRES MODULE (100% COMPLETE QUESTIONS FROM ALL 9 HTML FILES) */}
          {activeTab === "forms" && (
            <div className="flex flex-col gap-6 font-sans">
              {/* Submission State Banner */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Lock className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>
                    Client Submission State: Questionnaires SUBMITTED &amp;
                    FROZEN for Partner 1 &amp; Partner 2.
                  </span>
                </div>

                {/* CM Edit Mode Toggle */}
                <button
                  onClick={() => setIsCmEditing(!isCmEditing)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isCmEditing
                      ? "bg-amber-600 text-white shadow-xs"
                      : "bg-white text-slate-800 border border-amber-300 hover:bg-amber-100"
                  }`}
                >
                  {isCmEditing ? (
                    <Unlock className="w-3.5 h-3.5" />
                  ) : (
                    <Edit3 className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {isCmEditing
                      ? "CM Edit Mode (Active)"
                      : "Enable CM Edit Mode"}
                  </span>
                </button>
              </div>

              {/* THREE QUESTIONNAIRE CARDS LAYOUT */}
              <div className="grid grid-cols-3 gap-4">
                {/* Card 1: Partner 1 Questionnaire */}
                <div
                  onClick={() => setFormSubTab("p1")}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-3 shadow-xs ${
                    formSubTab === "p1"
                      ? "bg-slate-900 text-white border-slate-900 ring-2 ring-slate-700"
                      : "bg-white text-slate-900 border-slate-300 hover:border-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between border-b pb-2 border-slate-700/40">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      CARD 1
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${formSubTab === "p1" ? "bg-emerald-950 text-emerald-300 border-emerald-600" : "bg-emerald-50 text-emerald-800 border-emerald-200"}`}
                    >
                      Submitted &amp; Frozen
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold tracking-tight">
                      {caseObj.p1} Questionnaire
                    </h4>
                    <p
                      className={`text-xs mt-1 ${formSubTab === "p1" ? "text-slate-300" : "text-slate-500"}`}
                    >
                      Personal Info, Legal Declarations, Assets, Income &amp;
                      Liabilities
                    </p>
                  </div>
                  <div className="text-[11px] font-semibold flex items-center justify-between pt-1 border-t border-slate-700/40">
                    <span>All Questions Included</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Card 2: Partner 2 Questionnaire */}
                <div
                  onClick={() => setFormSubTab("p2")}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-3 shadow-xs ${
                    formSubTab === "p2"
                      ? "bg-slate-900 text-white border-slate-900 ring-2 ring-slate-700"
                      : "bg-white text-slate-900 border-slate-300 hover:border-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between border-b pb-2 border-slate-700/40">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      CARD 2
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${formSubTab === "p2" ? "bg-emerald-950 text-emerald-300 border-emerald-600" : "bg-emerald-50 text-emerald-800 border-emerald-200"}`}
                    >
                      Submitted &amp; Frozen
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold tracking-tight">
                      {caseObj.p2} Questionnaire
                    </h4>
                    <p
                      className={`text-xs mt-1 ${formSubTab === "p2" ? "text-slate-300" : "text-slate-500"}`}
                    >
                      Personal Info, Legal Declarations, Assets, Income &amp;
                      Liabilities
                    </p>
                  </div>
                  <div className="text-[11px] font-semibold flex items-center justify-between pt-1 border-t border-slate-700/40">
                    <span>All Questions Included</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Card 3: Joint Questionnaire */}
                <div
                  onClick={() => setFormSubTab("joint")}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-3 shadow-xs ${
                    formSubTab === "joint"
                      ? "bg-slate-900 text-white border-slate-900 ring-2 ring-slate-700"
                      : "bg-white text-slate-900 border-slate-300 hover:border-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between border-b pb-2 border-slate-700/40">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      CARD 3
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${formSubTab === "joint" ? "bg-emerald-950 text-emerald-300 border-emerald-600" : "bg-emerald-50 text-emerald-800 border-emerald-200"}`}
                    >
                      Submitted &amp; Frozen
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold tracking-tight">
                      Joint &amp; Shared Questionnaire
                    </h4>
                    <p
                      className={`text-xs mt-1 ${formSubTab === "joint" ? "text-slate-300" : "text-slate-500"}`}
                    >
                      Shared Assets, Shared Income/Debts, Matrimony &amp;
                      Dependants
                    </p>
                  </div>
                  <div className="text-[11px] font-semibold flex items-center justify-between pt-1 border-t border-slate-700/40">
                    <span>All Joint Fields</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* DETAILED QUESTIONNAIRE FORM SECTIONS */}
              <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-xs flex flex-col gap-6">
                {/* SUB TAB 1: P1 COMPLETE FORM */}
                {formSubTab === "p1" && (
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b pb-3">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-700" />
                        Partner 1 ({caseObj.p1}) Complete Questionnaire &bull;
                        All Questions Included
                      </h4>
                      <span className="text-xs font-bold text-slate-500 font-mono">
                        P1 Form Key: {caseObj.id}-P1
                      </span>
                    </div>

                    {/* Section 1: Personal Information */}
                    <div className="flex flex-col gap-3">
                      <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1">
                        1. Personal Information &amp; Identity (From 1.personal
                        info (1).html)
                      </h5>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1 text-xs">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">
                            First Name
                          </label>
                          <input
                            type="text"
                            disabled={!isCmEditing}
                            value={p1FormData.firstName}
                            onChange={(e) =>
                              setP1FormData({
                                ...p1FormData,
                                firstName: e.target.value,
                              })
                            }
                            className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 disabled:opacity-75"
                          />
                        </div>
                        <div className="flex flex-col gap-1 text-xs">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">
                            Middle Name(s)
                          </label>
                          <input
                            type="text"
                            disabled={!isCmEditing}
                            value={p1FormData.middleName}
                            onChange={(e) =>
                              setP1FormData({
                                ...p1FormData,
                                middleName: e.target.value,
                              })
                            }
                            className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 disabled:opacity-75"
                          />
                        </div>
                        <div className="flex flex-col gap-1 text-xs">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">
                            Last Name
                          </label>
                          <input
                            type="text"
                            disabled={!isCmEditing}
                            value={p1FormData.lastName}
                            onChange={(e) =>
                              setP1FormData({
                                ...p1FormData,
                                lastName: e.target.value,
                              })
                            }
                            className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 disabled:opacity-75"
                          />
                        </div>
                        <div className="flex flex-col gap-1 text-xs">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            disabled={!isCmEditing}
                            value={p1FormData.dob}
                            onChange={(e) =>
                              setP1FormData({
                                ...p1FormData,
                                dob: e.target.value,
                              })
                            }
                            className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 disabled:opacity-75"
                          />
                        </div>
                        <div className="flex flex-col gap-1 text-xs">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">
                            English Language Fluency
                          </label>
                          <select
                            disabled={!isCmEditing}
                            value={p1FormData.englishFluency}
                            onChange={(e) =>
                              setP1FormData({
                                ...p1FormData,
                                englishFluency: e.target.value,
                              })
                            }
                            className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 disabled:opacity-75"
                          >
                            <option value="Yes">
                              Yes, fully fluent in English
                            </option>
                            <option value="No">
                              No, language assistance needed
                            </option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1 text-xs">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">
                            Nationality
                          </label>
                          <input
                            type="text"
                            disabled={!isCmEditing}
                            value={p1FormData.nationality}
                            onChange={(e) =>
                              setP1FormData({
                                ...p1FormData,
                                nationality: e.target.value,
                              })
                            }
                            className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 disabled:opacity-75"
                          />
                        </div>
                        <div className="flex flex-col gap-1 text-xs col-span-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">
                            Domicile &amp; Residency
                          </label>
                          <input
                            type="text"
                            disabled={!isCmEditing}
                            value={p1FormData.domicile}
                            onChange={(e) =>
                              setP1FormData({
                                ...p1FormData,
                                domicile: e.target.value,
                              })
                            }
                            className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 disabled:opacity-75"
                          />
                        </div>
                        <div className="flex flex-col gap-1 text-xs">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">
                            Profession / Occupation
                          </label>
                          <input
                            type="text"
                            disabled={!isCmEditing}
                            value={p1FormData.profession}
                            onChange={(e) =>
                              setP1FormData({
                                ...p1FormData,
                                profession: e.target.value,
                              })
                            }
                            className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 disabled:opacity-75"
                          />
                        </div>
                        <div className="flex flex-col gap-1 text-xs col-span-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">
                            Current Home Address (Street, City, Postcode)
                          </label>
                          <input
                            type="text"
                            disabled={!isCmEditing}
                            value={`${p1FormData.street}, ${p1FormData.city}, ${p1FormData.postcode}`}
                            onChange={(e) =>
                              setP1FormData({
                                ...p1FormData,
                                street: e.target.value,
                              })
                            }
                            className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 disabled:opacity-75"
                          />
                        </div>
                        <div className="flex flex-col gap-1 text-xs">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">
                            Planned Wedding Date
                          </label>
                          <input
                            type="date"
                            disabled={!isCmEditing}
                            value={p1FormData.weddingDate}
                            onChange={(e) =>
                              setP1FormData({
                                ...p1FormData,
                                weddingDate: e.target.value,
                              })
                            }
                            className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 disabled:opacity-75"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 1a: Legal Declarations */}
                    <div className="flex flex-col gap-3 border-t pt-4">
                      <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1">
                        1a. Legal Declarations &amp; Objectives (From 1a.Legal
                        declaration.html)
                      </h5>
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1 text-xs">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">
                            Agreement Objectives
                          </label>
                          <textarea
                            rows={2}
                            disabled={!isCmEditing}
                            value={p1FormData.agreementObjectives}
                            onChange={(e) =>
                              setP1FormData({
                                ...p1FormData,
                                agreementObjectives: e.target.value,
                              })
                            }
                            className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 disabled:opacity-75"
                          />
                        </div>
                        <div className="flex flex-col gap-1 text-xs">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">
                            Living Arrangements &amp; Future Plans
                          </label>
                          <textarea
                            rows={2}
                            disabled={!isCmEditing}
                            value={p1FormData.livingSituationFuture}
                            onChange={(e) =>
                              setP1FormData({
                                ...p1FormData,
                                livingSituationFuture: e.target.value,
                              })
                            }
                            className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 disabled:opacity-75"
                          />
                        </div>

                        {/* Declarations Checkbox Grid */}
                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                          <label className="flex items-center gap-2 p-2 bg-slate-50 border rounded-lg">
                            <input
                              type="checkbox"
                              checked={p1FormData.declPersonalEffects}
                              disabled={!isCmEditing}
                              onChange={(e) =>
                                setP1FormData({
                                  ...p1FormData,
                                  declPersonalEffects: e.target.checked,
                                })
                              }
                            />
                            <span>
                              1. Personal Possessions (Separate Ownership)
                            </span>
                          </label>
                          <label className="flex items-center gap-2 p-2 bg-slate-50 border rounded-lg">
                            <input
                              type="checkbox"
                              checked={p1FormData.declHouseholdContents}
                              disabled={!isCmEditing}
                              onChange={(e) =>
                                setP1FormData({
                                  ...p1FormData,
                                  declHouseholdContents: e.target.checked,
                                })
                              }
                            />
                            <span>2. Division of Household Items</span>
                          </label>
                          <label className="flex items-center gap-2 p-2 bg-slate-50 border rounded-lg">
                            <input
                              type="checkbox"
                              checked={p1FormData.declCourtChildren}
                              disabled={!isCmEditing}
                              onChange={(e) =>
                                setP1FormData({
                                  ...p1FormData,
                                  declCourtChildren: e.target.checked,
                                })
                              }
                            />
                            <span>3. Children's Welfare Acknowledgment</span>
                          </label>
                          <label className="flex items-center gap-2 p-2 bg-slate-50 border rounded-lg">
                            <input
                              type="checkbox"
                              checked={p1FormData.declCostSharing}
                              disabled={!isCmEditing}
                              onChange={(e) =>
                                setP1FormData({
                                  ...p1FormData,
                                  declCostSharing: e.target.checked,
                                })
                              }
                            />
                            <span>4. Agreement Costs Sharing</span>
                          </label>
                          <label className="flex items-center gap-2 p-2 bg-slate-50 border rounded-lg">
                            <input
                              type="checkbox"
                              checked={p1FormData.declUndueInfluence}
                              disabled={!isCmEditing}
                              onChange={(e) =>
                                setP1FormData({
                                  ...p1FormData,
                                  declUndueInfluence: e.target.checked,
                                })
                              }
                            />
                            <span>5. No Undue Influence Declaration</span>
                          </label>
                          <label className="flex items-center gap-2 p-2 bg-slate-50 border rounded-lg">
                            <input
                              type="checkbox"
                              checked={p1FormData.declIla}
                              disabled={!isCmEditing}
                              onChange={(e) =>
                                setP1FormData({
                                  ...p1FormData,
                                  declIla: e.target.checked,
                                })
                              }
                            />
                            <span>
                              6. Independent Legal Advice Acknowledgment
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Section 3a: Individual Assets */}
                    <div className="flex flex-col gap-3 border-t pt-4">
                      <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1">
                        3a. Individual Assets &amp; Property (From
                        3a_individual_assets (1).html)
                      </h5>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex flex-col gap-1 p-3 bg-slate-50 border rounded-lg">
                          <span className="font-bold text-slate-900">
                            Real Estate Property
                          </span>
                          <label className="text-[10px] text-slate-500 uppercase">
                            Address / Details
                          </label>
                          <input
                            type="text"
                            disabled={!isCmEditing}
                            value={p1FormData.realEstateAddress}
                            onChange={(e) =>
                              setP1FormData({
                                ...p1FormData,
                                realEstateAddress: e.target.value,
                              })
                            }
                            className="p-1.5 border rounded font-semibold text-slate-900"
                          />
                          <label className="text-[10px] text-slate-500 uppercase mt-1">
                            Market Value ($)
                          </label>
                          <input
                            type="text"
                            disabled={!isCmEditing}
                            value={p1FormData.realEstateValue}
                            onChange={(e) =>
                              setP1FormData({
                                ...p1FormData,
                                realEstateValue: e.target.value,
                              })
                            }
                            className="p-1.5 border rounded font-semibold text-slate-900"
                          />
                          <label className="text-[10px] text-slate-500 uppercase mt-1">
                            Treatment Rule
                          </label>
                          <select
                            disabled={!isCmEditing}
                            value={p1FormData.realEstateTreatment}
                            onChange={(e) =>
                              setP1FormData({
                                ...p1FormData,
                                realEstateTreatment: e.target.value,
                              })
                            }
                            className="p-1.5 border rounded font-semibold text-slate-900"
                          >
                            <option value="KeepSeparate">
                              Keep it Separate
                            </option>
                            <option value="ShareEqually">
                              Share Equally (50/50)
                            </option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1 p-3 bg-slate-50 border rounded-lg">
                          <span className="font-bold text-slate-900">
                            Bank Accounts &amp; Cash
                          </span>
                          <label className="text-[10px] text-slate-500 uppercase">
                            Bank / Account Details
                          </label>
                          <input
                            type="text"
                            disabled={!isCmEditing}
                            value={p1FormData.bankAccountDetails}
                            onChange={(e) =>
                              setP1FormData({
                                ...p1FormData,
                                bankAccountDetails: e.target.value,
                              })
                            }
                            className="p-1.5 border rounded font-semibold text-slate-900"
                          />
                          <label className="text-[10px] text-slate-500 uppercase mt-1">
                            Balance ($)
                          </label>
                          <input
                            type="text"
                            disabled={!isCmEditing}
                            value={p1FormData.bankAccountBalance}
                            onChange={(e) =>
                              setP1FormData({
                                ...p1FormData,
                                bankAccountBalance: e.target.value,
                              })
                            }
                            className="p-1.5 border rounded font-semibold text-slate-900"
                          />
                          <label className="text-[10px] text-slate-500 uppercase mt-1">
                            Treatment Rule
                          </label>
                          <select
                            disabled={!isCmEditing}
                            value={p1FormData.bankAccountTreatment}
                            onChange={(e) =>
                              setP1FormData({
                                ...p1FormData,
                                bankAccountTreatment: e.target.value,
                              })
                            }
                            className="p-1.5 border rounded font-semibold text-slate-900"
                          >
                            <option value="KeepSeparate">
                              Keep it Separate
                            </option>
                            <option value="ShareEqually">
                              Share Equally (50/50)
                            </option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1 p-3 bg-slate-50 border rounded-lg">
                          <span className="font-bold text-slate-900">
                            Stocks &amp; Investments
                          </span>
                          <input
                            type="text"
                            disabled={!isCmEditing}
                            value={p1FormData.investmentsBrokerage}
                            onChange={(e) =>
                              setP1FormData({
                                ...p1FormData,
                                investmentsBrokerage: e.target.value,
                              })
                            }
                            className="p-1.5 border rounded font-semibold text-slate-900"
                          />
                          <label className="text-[10px] text-slate-500 uppercase mt-1">
                            Value ($)
                          </label>
                          <input
                            type="text"
                            disabled={!isCmEditing}
                            value={p1FormData.investmentsValue}
                            onChange={(e) =>
                              setP1FormData({
                                ...p1FormData,
                                investmentsValue: e.target.value,
                              })
                            }
                            className="p-1.5 border rounded font-semibold text-slate-900"
                          />
                        </div>

                        <div className="flex flex-col gap-1 p-3 bg-slate-50 border rounded-lg">
                          <span className="font-bold text-slate-900">
                            Business Equity &amp; IP
                          </span>
                          <input
                            type="text"
                            disabled={!isCmEditing}
                            value={p1FormData.businessName}
                            onChange={(e) =>
                              setP1FormData({
                                ...p1FormData,
                                businessName: e.target.value,
                              })
                            }
                            className="p-1.5 border rounded font-semibold text-slate-900"
                          />
                          <label className="text-[10px] text-slate-500 uppercase mt-1">
                            Value ($)
                          </label>
                          <input
                            type="text"
                            disabled={!isCmEditing}
                            value={p1FormData.businessValue}
                            onChange={(e) =>
                              setP1FormData({
                                ...p1FormData,
                                businessValue: e.target.value,
                              })
                            }
                            className="p-1.5 border rounded font-semibold text-slate-900"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 3b & 3c: Income & Liabilities */}
                    <div className="grid grid-cols-2 gap-4 border-t pt-4">
                      <div className="flex flex-col gap-3">
                        <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1">
                          3b. Income &amp; Revenue (From 3b_income_revenue.html)
                        </h5>
                        <div className="flex flex-col gap-2 text-xs">
                          <div>
                            <label className="text-[10px] text-slate-500 uppercase">
                              Annual Salary ($)
                            </label>
                            <input
                              type="text"
                              disabled={!isCmEditing}
                              value={p1FormData.annualSalary}
                              onChange={(e) =>
                                setP1FormData({
                                  ...p1FormData,
                                  annualSalary: e.target.value,
                                })
                              }
                              className="w-full p-1.5 border rounded font-semibold text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 uppercase">
                              Bonuses ($)
                            </label>
                            <input
                              type="text"
                              disabled={!isCmEditing}
                              value={p1FormData.bonusesCommissions}
                              onChange={(e) =>
                                setP1FormData({
                                  ...p1FormData,
                                  bonusesCommissions: e.target.value,
                                })
                              }
                              className="w-full p-1.5 border rounded font-semibold text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 uppercase">
                              Business Dividends ($)
                            </label>
                            <input
                              type="text"
                              disabled={!isCmEditing}
                              value={p1FormData.businessDividends}
                              onChange={(e) =>
                                setP1FormData({
                                  ...p1FormData,
                                  businessDividends: e.target.value,
                                })
                              }
                              className="w-full p-1.5 border rounded font-semibold text-slate-900"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1">
                          3c. Liabilities &amp; Debts (From
                          3c_liabilities_debts.html)
                        </h5>
                        <div className="flex flex-col gap-2 text-xs">
                          <div>
                            <label className="text-[10px] text-slate-500 uppercase">
                              Mortgage Principal ($)
                            </label>
                            <input
                              type="text"
                              disabled={!isCmEditing}
                              value={p1FormData.mortgagesDebt}
                              onChange={(e) =>
                                setP1FormData({
                                  ...p1FormData,
                                  mortgagesDebt: e.target.value,
                                })
                              }
                              className="w-full p-1.5 border rounded font-semibold text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 uppercase">
                              Credit Cards Balance ($)
                            </label>
                            <input
                              type="text"
                              disabled={!isCmEditing}
                              value={p1FormData.creditCardsDebt}
                              onChange={(e) =>
                                setP1FormData({
                                  ...p1FormData,
                                  creditCardsDebt: e.target.value,
                                })
                              }
                              className="w-full p-1.5 border rounded font-semibold text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 uppercase">
                              Tax Obligations ($)
                            </label>
                            <input
                              type="text"
                              disabled={!isCmEditing}
                              value={p1FormData.taxObligations}
                              onChange={(e) =>
                                setP1FormData({
                                  ...p1FormData,
                                  taxObligations: e.target.value,
                                })
                              }
                              className="w-full p-1.5 border rounded font-semibold text-slate-900"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB TAB 2: P2 COMPLETE FORM */}
                {formSubTab === "p2" && (
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b pb-3">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-700" />
                        Partner 2 ({caseObj.p2}) Complete Questionnaire &bull;
                        All Questions Included
                      </h4>
                      <span className="text-xs font-bold text-slate-500 font-mono">
                        P2 Form Key: {caseObj.id}-P2
                      </span>
                    </div>

                    {/* Section 1: Personal Information */}
                    <div className="flex flex-col gap-3">
                      <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1">
                        1. Personal Information &amp; Identity (From 1.personal
                        info (1).html)
                      </h5>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1 text-xs">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">
                            First Name
                          </label>
                          <input
                            type="text"
                            disabled={!isCmEditing}
                            value={p2FormData.firstName}
                            onChange={(e) =>
                              setP2FormData({
                                ...p2FormData,
                                firstName: e.target.value,
                              })
                            }
                            className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 disabled:opacity-75"
                          />
                        </div>
                        <div className="flex flex-col gap-1 text-xs">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">
                            Middle Name(s)
                          </label>
                          <input
                            type="text"
                            disabled={!isCmEditing}
                            value={p2FormData.middleName}
                            onChange={(e) =>
                              setP2FormData({
                                ...p2FormData,
                                middleName: e.target.value,
                              })
                            }
                            className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 disabled:opacity-75"
                          />
                        </div>
                        <div className="flex flex-col gap-1 text-xs">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">
                            Last Name
                          </label>
                          <input
                            type="text"
                            disabled={!isCmEditing}
                            value={p2FormData.lastName}
                            onChange={(e) =>
                              setP2FormData({
                                ...p2FormData,
                                lastName: e.target.value,
                              })
                            }
                            className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 disabled:opacity-75"
                          />
                        </div>
                        <div className="flex flex-col gap-1 text-xs">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            disabled={!isCmEditing}
                            value={p2FormData.dob}
                            onChange={(e) =>
                              setP2FormData({
                                ...p2FormData,
                                dob: e.target.value,
                              })
                            }
                            className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 disabled:opacity-75"
                          />
                        </div>
                        <div className="flex flex-col gap-1 text-xs">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">
                            English Language Fluency
                          </label>
                          <select
                            disabled={!isCmEditing}
                            value={p2FormData.englishFluency}
                            onChange={(e) =>
                              setP2FormData({
                                ...p2FormData,
                                englishFluency: e.target.value,
                              })
                            }
                            className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 disabled:opacity-75"
                          >
                            <option value="Yes">
                              Yes, fully fluent in English
                            </option>
                            <option value="No">
                              No, language assistance needed
                            </option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1 text-xs">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">
                            Nationality
                          </label>
                          <input
                            type="text"
                            disabled={!isCmEditing}
                            value={p2FormData.nationality}
                            onChange={(e) =>
                              setP2FormData({
                                ...p2FormData,
                                nationality: e.target.value,
                              })
                            }
                            className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 disabled:opacity-75"
                          />
                        </div>
                        <div className="flex flex-col gap-1 text-xs col-span-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">
                            Domicile &amp; Residency
                          </label>
                          <input
                            type="text"
                            disabled={!isCmEditing}
                            value={p2FormData.domicile}
                            onChange={(e) =>
                              setP2FormData({
                                ...p2FormData,
                                domicile: e.target.value,
                              })
                            }
                            className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 disabled:opacity-75"
                          />
                        </div>
                        <div className="flex flex-col gap-1 text-xs">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">
                            Profession / Occupation
                          </label>
                          <input
                            type="text"
                            disabled={!isCmEditing}
                            value={p2FormData.profession}
                            onChange={(e) =>
                              setP2FormData({
                                ...p2FormData,
                                profession: e.target.value,
                              })
                            }
                            className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 disabled:opacity-75"
                          />
                        </div>
                        <div className="flex flex-col gap-1 text-xs col-span-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">
                            Current Home Address (Street, City, Postcode)
                          </label>
                          <input
                            type="text"
                            disabled={!isCmEditing}
                            value={`${p2FormData.street}, ${p2FormData.city}, ${p2FormData.postcode}`}
                            onChange={(e) =>
                              setP2FormData({
                                ...p2FormData,
                                street: e.target.value,
                              })
                            }
                            className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 disabled:opacity-75"
                          />
                        </div>
                        <div className="flex flex-col gap-1 text-xs">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">
                            Planned Wedding Date
                          </label>
                          <input
                            type="date"
                            disabled={!isCmEditing}
                            value={p2FormData.weddingDate}
                            onChange={(e) =>
                              setP2FormData({
                                ...p2FormData,
                                weddingDate: e.target.value,
                              })
                            }
                            className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 disabled:opacity-75"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 1a: Legal Declarations */}
                    <div className="flex flex-col gap-3 border-t pt-4">
                      <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1">
                        1a. Legal Declarations &amp; Objectives (From 1a.Legal
                        declaration.html)
                      </h5>
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1 text-xs">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">
                            Agreement Objectives
                          </label>
                          <textarea
                            rows={2}
                            disabled={!isCmEditing}
                            value={p2FormData.agreementObjectives}
                            onChange={(e) =>
                              setP2FormData({
                                ...p2FormData,
                                agreementObjectives: e.target.value,
                              })
                            }
                            className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 disabled:opacity-75"
                          />
                        </div>
                        <div className="flex flex-col gap-1 text-xs">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">
                            Living Arrangements &amp; Future Plans
                          </label>
                          <textarea
                            rows={2}
                            disabled={!isCmEditing}
                            value={p2FormData.livingSituationFuture}
                            onChange={(e) =>
                              setP2FormData({
                                ...p2FormData,
                                livingSituationFuture: e.target.value,
                              })
                            }
                            className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 disabled:opacity-75"
                          />
                        </div>

                        {/* Declarations Checkbox Grid */}
                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                          <label className="flex items-center gap-2 p-2 bg-slate-50 border rounded-lg">
                            <input
                              type="checkbox"
                              checked={p2FormData.declPersonalEffects}
                              disabled={!isCmEditing}
                              onChange={(e) =>
                                setP2FormData({
                                  ...p2FormData,
                                  declPersonalEffects: e.target.checked,
                                })
                              }
                            />
                            <span>
                              1. Personal Possessions (Separate Ownership)
                            </span>
                          </label>
                          <label className="flex items-center gap-2 p-2 bg-slate-50 border rounded-lg">
                            <input
                              type="checkbox"
                              checked={p2FormData.declHouseholdContents}
                              disabled={!isCmEditing}
                              onChange={(e) =>
                                setP2FormData({
                                  ...p2FormData,
                                  declHouseholdContents: e.target.checked,
                                })
                              }
                            />
                            <span>2. Division of Household Items</span>
                          </label>
                          <label className="flex items-center gap-2 p-2 bg-slate-50 border rounded-lg">
                            <input
                              type="checkbox"
                              checked={p2FormData.declCourtChildren}
                              disabled={!isCmEditing}
                              onChange={(e) =>
                                setP2FormData({
                                  ...p2FormData,
                                  declCourtChildren: e.target.checked,
                                })
                              }
                            />
                            <span>3. Children's Welfare Acknowledgment</span>
                          </label>
                          <label className="flex items-center gap-2 p-2 bg-slate-50 border rounded-lg">
                            <input
                              type="checkbox"
                              checked={p2FormData.declCostSharing}
                              disabled={!isCmEditing}
                              onChange={(e) =>
                                setP2FormData({
                                  ...p2FormData,
                                  declCostSharing: e.target.checked,
                                })
                              }
                            />
                            <span>4. Agreement Costs Sharing</span>
                          </label>
                          <label className="flex items-center gap-2 p-2 bg-slate-50 border rounded-lg">
                            <input
                              type="checkbox"
                              checked={p2FormData.declUndueInfluence}
                              disabled={!isCmEditing}
                              onChange={(e) =>
                                setP2FormData({
                                  ...p2FormData,
                                  declUndueInfluence: e.target.checked,
                                })
                              }
                            />
                            <span>5. No Undue Influence Declaration</span>
                          </label>
                          <label className="flex items-center gap-2 p-2 bg-slate-50 border rounded-lg">
                            <input
                              type="checkbox"
                              checked={p2FormData.declIla}
                              disabled={!isCmEditing}
                              onChange={(e) =>
                                setP2FormData({
                                  ...p2FormData,
                                  declIla: e.target.checked,
                                })
                              }
                            />
                            <span>
                              6. Independent Legal Advice Acknowledgment
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Section 3a: Individual Assets */}
                    <div className="flex flex-col gap-3 border-t pt-4">
                      <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1">
                        3a. Individual Assets &amp; Property (From
                        3a_individual_assets (1).html)
                      </h5>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex flex-col gap-1 p-3 bg-slate-50 border rounded-lg">
                          <span className="font-bold text-slate-900">
                            Real Estate Property
                          </span>
                          <label className="text-[10px] text-slate-500 uppercase">
                            Address / Details
                          </label>
                          <input
                            type="text"
                            disabled={!isCmEditing}
                            value={p2FormData.realEstateAddress}
                            onChange={(e) =>
                              setP2FormData({
                                ...p2FormData,
                                realEstateAddress: e.target.value,
                              })
                            }
                            className="p-1.5 border rounded font-semibold text-slate-900"
                          />
                          <label className="text-[10px] text-slate-500 uppercase mt-1">
                            Market Value ($)
                          </label>
                          <input
                            type="text"
                            disabled={!isCmEditing}
                            value={p2FormData.realEstateValue}
                            onChange={(e) =>
                              setP2FormData({
                                ...p2FormData,
                                realEstateValue: e.target.value,
                              })
                            }
                            className="p-1.5 border rounded font-semibold text-slate-900"
                          />
                          <label className="text-[10px] text-slate-500 uppercase mt-1">
                            Treatment Rule
                          </label>
                          <select
                            disabled={!isCmEditing}
                            value={p2FormData.realEstateTreatment}
                            onChange={(e) =>
                              setP2FormData({
                                ...p2FormData,
                                realEstateTreatment: e.target.value,
                              })
                            }
                            className="p-1.5 border rounded font-semibold text-slate-900"
                          >
                            <option value="KeepSeparate">
                              Keep it Separate
                            </option>
                            <option value="ShareEqually">
                              Share Equally (50/50)
                            </option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1 p-3 bg-slate-50 border rounded-lg">
                          <span className="font-bold text-slate-900">
                            Bank Accounts &amp; Cash
                          </span>
                          <label className="text-[10px] text-slate-500 uppercase">
                            Bank / Account Details
                          </label>
                          <input
                            type="text"
                            disabled={!isCmEditing}
                            value={p2FormData.bankAccountDetails}
                            onChange={(e) =>
                              setP2FormData({
                                ...p2FormData,
                                bankAccountDetails: e.target.value,
                              })
                            }
                            className="p-1.5 border rounded font-semibold text-slate-900"
                          />
                          <label className="text-[10px] text-slate-500 uppercase mt-1">
                            Balance ($)
                          </label>
                          <input
                            type="text"
                            disabled={!isCmEditing}
                            value={p2FormData.bankAccountBalance}
                            onChange={(e) =>
                              setP2FormData({
                                ...p2FormData,
                                bankAccountBalance: e.target.value,
                              })
                            }
                            className="p-1.5 border rounded font-semibold text-slate-900"
                          />
                          <label className="text-[10px] text-slate-500 uppercase mt-1">
                            Treatment Rule
                          </label>
                          <select
                            disabled={!isCmEditing}
                            value={p2FormData.bankAccountTreatment}
                            onChange={(e) =>
                              setP2FormData({
                                ...p2FormData,
                                bankAccountTreatment: e.target.value,
                              })
                            }
                            className="p-1.5 border rounded font-semibold text-slate-900"
                          >
                            <option value="KeepSeparate">
                              Keep it Separate
                            </option>
                            <option value="ShareEqually">
                              Share Equally (50/50)
                            </option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1 p-3 bg-slate-50 border rounded-lg">
                          <span className="font-bold text-slate-900">
                            Stocks &amp; Investments
                          </span>
                          <input
                            type="text"
                            disabled={!isCmEditing}
                            value={p2FormData.investmentsBrokerage}
                            onChange={(e) =>
                              setP2FormData({
                                ...p2FormData,
                                investmentsBrokerage: e.target.value,
                              })
                            }
                            className="p-1.5 border rounded font-semibold text-slate-900"
                          />
                          <label className="text-[10px] text-slate-500 uppercase mt-1">
                            Value ($)
                          </label>
                          <input
                            type="text"
                            disabled={!isCmEditing}
                            value={p2FormData.investmentsValue}
                            onChange={(e) =>
                              setP2FormData({
                                ...p2FormData,
                                investmentsValue: e.target.value,
                              })
                            }
                            className="p-1.5 border rounded font-semibold text-slate-900"
                          />
                        </div>

                        <div className="flex flex-col gap-1 p-3 bg-slate-50 border rounded-lg">
                          <span className="font-bold text-slate-900">
                            Personal Belongings &amp; Vehicles
                          </span>
                          <input
                            type="text"
                            disabled={!isCmEditing}
                            value={p2FormData.chattelsDescription}
                            onChange={(e) =>
                              setP2FormData({
                                ...p2FormData,
                                chattelsDescription: e.target.value,
                              })
                            }
                            className="p-1.5 border rounded font-semibold text-slate-900"
                          />
                          <label className="text-[10px] text-slate-500 uppercase mt-1">
                            Value ($)
                          </label>
                          <input
                            type="text"
                            disabled={!isCmEditing}
                            value={p2FormData.chattelsValue}
                            onChange={(e) =>
                              setP2FormData({
                                ...p2FormData,
                                chattelsValue: e.target.value,
                              })
                            }
                            className="p-1.5 border rounded font-semibold text-slate-900"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 3b & 3c: Income & Liabilities */}
                    <div className="grid grid-cols-2 gap-4 border-t pt-4">
                      <div className="flex flex-col gap-3">
                        <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1">
                          3b. Income &amp; Revenue (From 3b_income_revenue.html)
                        </h5>
                        <div className="flex flex-col gap-2 text-xs">
                          <div>
                            <label className="text-[10px] text-slate-500 uppercase">
                              Annual Salary ($)
                            </label>
                            <input
                              type="text"
                              disabled={!isCmEditing}
                              value={p2FormData.annualSalary}
                              onChange={(e) =>
                                setP2FormData({
                                  ...p2FormData,
                                  annualSalary: e.target.value,
                                })
                              }
                              className="w-full p-1.5 border rounded font-semibold text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 uppercase">
                              Bonuses ($)
                            </label>
                            <input
                              type="text"
                              disabled={!isCmEditing}
                              value={p2FormData.bonusesCommissions}
                              onChange={(e) =>
                                setP2FormData({
                                  ...p2FormData,
                                  bonusesCommissions: e.target.value,
                                })
                              }
                              className="w-full p-1.5 border rounded font-semibold text-slate-900"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1">
                          3c. Liabilities &amp; Debts (From
                          3c_liabilities_debts.html)
                        </h5>
                        <div className="flex flex-col gap-2 text-xs">
                          <div>
                            <label className="text-[10px] text-slate-500 uppercase">
                              Mortgage Principal ($)
                            </label>
                            <input
                              type="text"
                              disabled={!isCmEditing}
                              value={p2FormData.mortgagesDebt}
                              onChange={(e) =>
                                setP2FormData({
                                  ...p2FormData,
                                  mortgagesDebt: e.target.value,
                                })
                              }
                              className="w-full p-1.5 border rounded font-semibold text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 uppercase">
                              Credit Cards Balance ($)
                            </label>
                            <input
                              type="text"
                              disabled={!isCmEditing}
                              value={p2FormData.creditCardsDebt}
                              onChange={(e) =>
                                setP2FormData({
                                  ...p2FormData,
                                  creditCardsDebt: e.target.value,
                                })
                              }
                              className="w-full p-1.5 border rounded font-semibold text-slate-900"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB TAB 3: JOINT QUESTIONNAIRE COMPLETE FORM */}
                {formSubTab === "joint" && (
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b pb-3">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-700" />
                        Joint Questionnaire &amp; Shared Disclosures (From 4a,
                        4b, 4c &amp; 4d Matrimony HTML Files)
                      </h4>
                      <span className="text-xs font-bold text-slate-500 font-mono">
                        Joint Key: {caseObj.id}-JOINT
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Section 4a & 4b: Shared Assets & Revenue */}
                      <div className="flex flex-col gap-3">
                        <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1">
                          4a &amp; 4b. Shared Assets &amp; Revenue
                        </h5>
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-col gap-1 text-xs">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">
                              Co-owned Real Estate
                            </label>
                            <input
                              type="text"
                              disabled={!isCmEditing}
                              value={jointFormData.sharedRealEstateAddress}
                              onChange={(e) =>
                                setJointFormData({
                                  ...jointFormData,
                                  sharedRealEstateAddress: e.target.value,
                                })
                              }
                              className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 disabled:opacity-75"
                            />
                          </div>
                          <div className="flex flex-col gap-1 text-xs">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">
                              Joint Bank Accounts
                            </label>
                            <input
                              type="text"
                              disabled={!isCmEditing}
                              value={jointFormData.sharedBankAccounts}
                              onChange={(e) =>
                                setJointFormData({
                                  ...jointFormData,
                                  sharedBankAccounts: e.target.value,
                                })
                              }
                              className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 disabled:opacity-75"
                            />
                          </div>
                          <div className="flex flex-col gap-1 text-xs">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">
                              Joint Rental Income ($/yr)
                            </label>
                            <input
                              type="text"
                              disabled={!isCmEditing}
                              value={jointFormData.sharedRentalIncome}
                              onChange={(e) =>
                                setJointFormData({
                                  ...jointFormData,
                                  sharedRentalIncome: e.target.value,
                                })
                              }
                              className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 disabled:opacity-75"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 4c & 4d: Shared Liabilities & Matrimony */}
                      <div className="flex flex-col gap-3">
                        <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1">
                          4c &amp; 4d. Matrimony, Dependants &amp; Support
                        </h5>
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-col gap-1 text-xs">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">
                              Prior Marriages History (P1 / P2)
                            </label>
                            <input
                              type="text"
                              disabled={!isCmEditing}
                              value={`${jointFormData.priorMarriagesP1} & ${jointFormData.priorMarriagesP2}`}
                              onChange={(e) =>
                                setJointFormData({
                                  ...jointFormData,
                                  priorMarriagesP1: e.target.value,
                                })
                              }
                              className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 disabled:opacity-75"
                            />
                          </div>
                          <div className="flex flex-col gap-1 text-xs">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">
                              Dependants &amp; Children Count
                            </label>
                            <input
                              type="text"
                              disabled={!isCmEditing}
                              value={jointFormData.dependantsCount}
                              onChange={(e) =>
                                setJointFormData({
                                  ...jointFormData,
                                  dependantsCount: e.target.value,
                                })
                              }
                              className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 disabled:opacity-75"
                            />
                          </div>
                          <div className="flex flex-col gap-1 text-xs">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">
                              Spousal / Child Support Obligations
                            </label>
                            <input
                              type="text"
                              disabled={!isCmEditing}
                              value={jointFormData.spousalSupportObligations}
                              onChange={(e) =>
                                setJointFormData({
                                  ...jointFormData,
                                  spousalSupportObligations: e.target.value,
                                })
                              }
                              className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 disabled:opacity-75"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Case Manager Review Notes & Save Action Footer */}
                <div className="pt-4 border-t flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">
                      Case Manager Review Notes
                    </label>
                    <input
                      type="text"
                      value={jointFormData.cmReviewNotes}
                      onChange={(e) =>
                        setJointFormData({
                          ...jointFormData,
                          cmReviewNotes: e.target.value,
                        })
                      }
                      placeholder="Add reviewer notes before marking review complete..."
                      className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-medium"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500 font-sans italic">
                      Saving completes CM Review and enables{" "}
                      <strong>Lawyer Assignment Stage</strong>.
                    </span>

                    <button
                      onClick={handleSaveFormsReview}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                      <span>Save Changes &amp; Complete CM Review</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AGREEMENT */}
          {activeTab === "agreement" && (
            <AgreementTab />
          )}

          {/* TAB 4: CM Actions MODULE (ALWAYS DIRECTLY SHOWS LAW FIRM & LAWYER DROPDOWNS FOR P1 AND P2) */}
          {activeTab === "lawyers" && (
            <div className="flex flex-col gap-6 font-sans">
              {/* Module Header */}
              <div className="p-4 rounded-xl bg-white border border-slate-300 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Briefcase className="w-4 h-4 text-slate-700" />
                  <span>
                    Independent Legal Advice (ILA) Law Firm &amp; Lawyer
                    Assignment Control
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-300 px-2.5 py-0.5 rounded">
                  Rule 1 Conflict Guard Active
                </span>
              </div>

              <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs flex flex-col gap-4">
                <button
                  type="button"
                  onClick={() => setIsTicked((t) => !t)}
                  className="flex items-center gap-2.5 text-left cursor-pointer w-fit"
                >
                  {isTicked ? (
                    <CheckSquare className="w-4.5 h-4.5 text-slate-900" />
                  ) : (
                    <Square className="w-4.5 h-4.5 text-slate-400" />
                  )}
                  <span className="text-xs font-semibold text-slate-700">
                    I have reviewed the Master Document and confirm it is
                    correct
                  </span>
                </button>

                <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                  <span className="text-[11px] text-slate-500 italic">
                    Tick the box, then Approve or Disapprove to trigger the
                    confirmation message and status update.
                  </span>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => {}}
                      className="bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 text-xs px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer active:scale-95"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Disapprove</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {}}
                      disabled={!isTicked}
                      className={`text-xs px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-xs active:scale-95 ${
                        isTicked
                          ? "bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Approve</span>
                    </button>
                  </div>
                </div>
              </div>

              {caseStatus === "DRAFT" && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-xs text-rose-900 flex flex-col gap-2">
                  <div className="font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-700 flex-shrink-0" />
                    <span>Case disapproved. Status set to DRAFT.</span>
                  </div>
                  <span className="font-normal text-rose-800">
                    An email has been sent to both p1 and p2 asking them to make
                    changes to the form again.
                  </span>
                </div>
              )}

              {caseStatus === "PRE_LAWYER_PENDING" && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex flex-col gap-2">
                  <div className="font-bold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                    <span>
                      Master Document approved. Status set to
                      PRE_LAWYER_PENDING.
                    </span>
                  </div>
                  <span className="font-normal text-emerald-800">
                    An email has been sent to both P1 and P2: "Congratulations,
                    CM has approved your case and you will soon get an email
                    after the lawyer has been assigned to you."
                  </span>
                </div>
              )}

              {/* Conflict Status Alert Banner */}
              {isDualFirmConflict ? (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-xs text-rose-900 font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-700 flex-shrink-0" />
                  <span>
                    CONFLICT ALERT: P1 and P2 cannot select the same Law Firm (
                    {selectedP1Firm}). Dual-firm separation is required by Rule
                    1.
                  </span>
                </div>
              ) : selectedP1Firm && selectedP2Firm ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <span>
                    RULE 1 PASSED: Independent Legal Advice (ILA) dual-firm
                    separation verified between {selectedP1Firm} and{" "}
                    {selectedP2Firm}.
                  </span>
                </div>
              ) : null}

              {/* DIRECT ASSIGNMENT DROPDOWNS FOR BOTH PARTIES */}
              <div className="grid grid-cols-2 gap-5">
                {/* Party 1 Counsel Selector & Details Card */}
                <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs flex flex-col gap-4">
                  <div className="border-b pb-2 flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-900 uppercase">
                      Party 1 Legal Representation ({caseObj.p1})
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${selectedP1Firm && selectedP1Lawyer ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-800 border-amber-200"}`}
                    >
                      {selectedP1Firm && selectedP1Lawyer
                        ? "Assigned"
                        : "Unassigned"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3.5 text-xs">
                    {/* Step 1: Select Law Firm Dropdown */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Select Law Firm for Partner 1{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={selectedP1Firm}
                        onChange={(e) => handleP1FirmSelect(e.target.value)}
                        className="bg-slate-50 border border-slate-300 text-slate-900 font-bold px-3 py-2.5 rounded-lg text-xs outline-none focus:border-slate-500 cursor-pointer"
                      >
                        <option value="">
                          -- Choose Law Firm for Partner 1 --
                        </option>
                        {FIRM_DIRECTORY.map((f) => (
                          <option key={f.firmName} value={f.firmName}>
                            {f.firmName} ({f.city})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Step 2: Select Lawyer Dropdown */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Select Attorney from Firm Roster{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      {selectedP1Firm ? (
                        <select
                          value={selectedP1Lawyer}
                          onChange={(e) => handleP1LawyerSelect(e.target.value)}
                          className="bg-slate-50 border border-slate-300 text-slate-900 font-semibold px-3 py-2.5 rounded-lg text-xs outline-none focus:border-slate-500 cursor-pointer"
                        >
                          <option value="">-- Choose Attorney --</option>
                          {FIRM_DIRECTORY.find(
                            (f) => f.firmName === selectedP1Firm,
                          )?.lawyers.map((l) => (
                            <option key={l.name} value={l.name}>
                              {l.name} - {l.title}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="p-2.5 bg-slate-100 rounded-lg text-[11px] text-slate-400 italic">
                          Select a law firm above to load available attorneys.
                        </div>
                      )}
                    </div>

                    {/* Display P1 Assigned Lawyer Details Card */}
                    {selectedP1Lawyer && p1LawyerDetails.email && (
                      <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex flex-col gap-1.5 text-xs font-sans">
                        <div className="font-bold text-slate-900 border-b pb-1 text-[11px] flex items-center justify-between">
                          <span>Assigned Lawyer Details</span>
                          <span className="text-emerald-700 font-mono text-[10px]">
                            VERIFIED
                          </span>
                        </div>
                        <div>
                          <strong className="text-slate-500">
                            Attorney Title:
                          </strong>{" "}
                          {p1LawyerDetails.title}
                        </div>
                        <div>
                          <strong className="text-slate-500">Email:</strong>{" "}
                          <span className="font-mono">
                            {p1LawyerDetails.email}
                          </span>
                        </div>
                        <div>
                          <strong className="text-slate-500">Phone:</strong>{" "}
                          {p1LawyerDetails.phone}
                        </div>
                        <div>
                          <strong className="text-slate-500">Bar ID:</strong>{" "}
                          <span className="font-mono font-bold">
                            {p1LawyerDetails.barId}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Party 2 Counsel Selector & Details Card */}
                <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs flex flex-col gap-4">
                  <div className="border-b pb-2 flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-900 uppercase">
                      Party 2 Legal Representation ({caseObj.p2})
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${selectedP2Firm && selectedP2Lawyer ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-800 border-amber-200"}`}
                    >
                      {selectedP2Firm && selectedP2Lawyer
                        ? "Assigned"
                        : "Unassigned"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3.5 text-xs">
                    {/* Step 1: Select Law Firm Dropdown */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Select Law Firm for Partner 2{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={selectedP2Firm}
                        onChange={(e) => handleP2FirmSelect(e.target.value)}
                        className="bg-slate-50 border border-slate-300 text-slate-900 font-bold px-3 py-2.5 rounded-lg text-xs outline-none focus:border-slate-500 cursor-pointer"
                      >
                        <option value="">
                          -- Choose Law Firm for Partner 2 --
                        </option>
                        {FIRM_DIRECTORY.map((f) => (
                          <option key={f.firmName} value={f.firmName}>
                            {f.firmName} ({f.city})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Step 2: Select Lawyer Dropdown */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Select Attorney from Firm Roster{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      {selectedP2Firm ? (
                        <select
                          value={selectedP2Lawyer}
                          onChange={(e) => handleP2LawyerSelect(e.target.value)}
                          className="bg-slate-50 border border-slate-300 text-slate-900 font-semibold px-3 py-2.5 rounded-lg text-xs outline-none focus:border-slate-500 cursor-pointer"
                        >
                          <option value="">-- Choose Attorney --</option>
                          {FIRM_DIRECTORY.find(
                            (f) => f.firmName === selectedP2Firm,
                          )?.lawyers.map((l) => (
                            <option key={l.name} value={l.name}>
                              {l.name} - {l.title}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="p-2.5 bg-slate-100 rounded-lg text-[11px] text-slate-400 italic">
                          Select a law firm above to load available attorneys.
                        </div>
                      )}
                    </div>

                    {/* Display P2 Assigned Lawyer Details Card */}
                    {selectedP2Lawyer && p2LawyerDetails.email && (
                      <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex flex-col gap-1.5 text-xs font-sans">
                        <div className="font-bold text-slate-900 border-b pb-1 text-[11px] flex items-center justify-between">
                          <span>Assigned Lawyer Details</span>
                          <span className="text-emerald-700 font-mono text-[10px]">
                            VERIFIED
                          </span>
                        </div>
                        <div>
                          <strong className="text-slate-500">
                            Attorney Title:
                          </strong>{" "}
                          {p2LawyerDetails.title}
                        </div>
                        <div>
                          <strong className="text-slate-500">Email:</strong>{" "}
                          <span className="font-mono">
                            {p2LawyerDetails.email}
                          </span>
                        </div>
                        <div>
                          <strong className="text-slate-500">Phone:</strong>{" "}
                          {p2LawyerDetails.phone}
                        </div>
                        <div>
                          <strong className="text-slate-500">Bar ID:</strong>{" "}
                          <span className="font-mono font-bold">
                            {p2LawyerDetails.barId}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Save Counsel Assignment Primary Action Bar */}
              <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-xs flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-sans italic">
                  Case Manager selects law firms and lawyers using the dropdowns
                  above. Click Save to assign counsel and trigger Rule 1
                  Conflict check.
                </span>

                <button
                  onClick={handleConfirmLawyerAssignment}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>
                    Save Counsel Assignment &amp; Conflict Verification
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: TIMELINE */}
          {activeTab === "timeline" && (
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-xs text-slate-900 uppercase">
                Chronological Lifecycle Timeline (Section 13)
              </h4>
              <div className="p-4 rounded-xl bg-white border border-slate-300 flex flex-col gap-3 shadow-xs text-xs font-mono">
                {[
                  { time: "10:00", event: "P1 Registered (Arthur Vance)" },
                  { time: "10:10", event: "P2 Registered (Sophia Lin)" },
                  {
                    time: "10:20",
                    event: "Payment Completed ($1,850 Premier Tier)",
                  },
                  {
                    time: "10:30",
                    event: "Forms Submitted & Questionnaire Locked (Rule 2)",
                  },
                  { time: "11:00", event: "CM Approved (Sarah Jenkins)" },
                  {
                    time: "11:05",
                    event: "Lawyers Assigned (Rule 1 Conflict Pass)",
                  },
                  { time: "12:00", event: "v1.1 Uploaded by Counsel" },
                  { time: "13:00", event: "v1.2 Uploaded by Counsel" },
                  { time: "14:00", event: "Clean Master Uploaded" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 border-b pb-2 last:border-0 last:pb-0"
                  >
                    <span className="text-slate-400 text-[10px] w-12">
                      {item.time}
                    </span>
                    <span className="text-slate-800 font-medium">
                      {item.event}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: AUDIT LOGS */}
          {activeTab === "audit" && (
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-xs text-slate-900 uppercase">
                Immutable System Audit Logs (Section 15)
              </h4>
              <div className="p-4 rounded-xl bg-white border border-slate-300 flex flex-col gap-2 shadow-xs text-xs font-mono">
                {auditLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-slate-900">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        By: {log.actor} ({log.ipAddress})
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {log.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: CM NOTES */}
          {activeTab === "notes" && (
            <div className="flex flex-col gap-4">
              <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-xs flex flex-col gap-3">
                <h4 className="font-bold text-xs text-slate-900 uppercase">
                  Add Internal Case Manager Note (Section 16)
                </h4>

                <div className="flex gap-2">
                  {(
                    [
                      "Internal",
                      "Escalation",
                      "Risk",
                      "Complaint",
                      "Operational",
                    ] as const
                  ).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setNoteCategory(cat)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded border transition-all cursor-pointer ${
                        noteCategory === cat
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <textarea
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Enter staff note details..."
                  className="w-full h-20 bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900 outline-none focus:border-slate-500"
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleAddNote}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Save Internal Note
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {notesList.map((n, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs flex flex-col gap-1 text-xs"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span className="text-[10px] bg-slate-100 text-slate-800 border px-2 py-0.5 rounded font-mono">
                        [{n.category}] {n.author}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {n.time}
                      </span>
                    </div>
                    <p className="text-slate-700 mt-1">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
