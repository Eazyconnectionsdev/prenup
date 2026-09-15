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
import FormsDisclosuresTab from "../tabs/FormsDisclosuresTab";

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
  }
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
    <div className="fixed top-0 bottom-0 left-[240px] right-0 z-40 bg-slate-100 flex flex-col font-sans shadow-2xl overflow-hidden animate-in fade-in duration-200">
      <div className="w-full h-full bg-white flex flex-col min-w-0">
        {/* Drawer Header */}
        <div className="px-7 py-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={onClose}
              className="mr-2 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer border border-slate-700"
              title="Return to cases list"
            >
              <span>← Back to Cases</span>
            </button>
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
              title="Close Case Details"
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

          {/* TAB 2: FORMS & QUESTIONNAIRES MODULE (Shahmir's exact UI design system) */}
          {activeTab === "forms" && (
            <FormsDisclosuresTab
              caseObj={caseObj}
              isCmEditing={isCmEditing}
              setIsCmEditing={setIsCmEditing}
              onSave={handleSaveFormsReview}
            />
          )}
       

          {/* TAB 3: AGREEMENT */}
          {activeTab === "agreement" && (
            <AgreementTab />
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
