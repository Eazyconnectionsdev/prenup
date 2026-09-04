"use client";

import React, { useState } from "react";
import { CaseItem } from "@/types/case-manager";
import {
  YesNo,
  TreatmentFields,
  emptyTreatment,
  makeId,
  inputClasses,
  textareaClasses,
  PartHeader,
  YesNoToggle,
  MatrixBox,
  RowItem,
  ValueWithUnsure,
  TreatmentSelect,
  Treatment,
} from "@/components/Formprimitives";
import {
  User,
  Lock,
  Edit3,
  Unlock,
  ChevronRight,
  Save,
  Shield,
  FileText,
  Home,
  DollarSign,
  CreditCard,
  Heart,
  Users,
} from "lucide-react";

interface FormsDisclosuresTabProps {
  caseObj: CaseItem;
  isCmEditing: boolean;
  setIsCmEditing: (v: boolean) => void;
  onSave: () => void;
}

export default function FormsDisclosuresTab({
  caseObj,
  isCmEditing,
  setIsCmEditing,
  onSave,
}: FormsDisclosuresTabProps) {
  const [activeParty, setActiveParty] = useState<"p1" | "p2" | "joint">("p1");

  // Sub-section state for P1 and P2
  const [individualSection, setIndividualSection] = useState<
    "personal" | "legal" | "family" | "assets" | "income" | "liabilities"
  >("assets");

  // Sub-section state for Joint (Card 3) - exactly matches Shahmir's 3 joint forms
  const [jointSection, setJointSection] = useState<
    "joint-assets" | "joint-income" | "joint-liabilities"
  >("joint-income");

  // Shahmir's EXACT 8 Declaration Cards
  const declarations = [
    {
      id: "confirm_personal_effects",
      name: "confirmPersonalEffects",
      title: "Personal Possessions",
      description:
        "Do you agree that each person's clothing, jewellery, personal belongings, and other personal possessions should remain their own separate property unless you both agree otherwise?",
    },
    {
      id: "confirm_household_division",
      name: "confirmHouseholdDivision",
      title: "Division of Household Items",
      description:
        "Do you agree that household items and shared possessions (excluding separately owned property) should be dealt with fairly and reasonably, or otherwise in accordance with the terms of this agreement?",
    },
    {
      id: "acknowledge_court_children",
      name: "acknowledgeCourtChildren",
      title: "Children's Welfare",
      description:
        "We understand that no agreement can restrict the power of a court to make decisions that are in the best interests of any children.",
    },
    {
      id: "confirm_cost_sharing",
      name: "confirmCostSharing",
      title: "Agreement Costs",
      description:
        "Do you agree that the costs associated with preparing this agreement will normally be shared equally unless otherwise agreed between you?",
    },
    {
      id: "confirm_undue_influence",
      name: "confirmUndueInfluence",
      title: "Undue Influence",
      description:
        "Do you understand that one person contributing more towards the costs of preparing this agreement does not, by itself, indicate pressure, coercion, or undue influence?",
    },
    {
      id: "confirm_ila",
      name: "confirmIla",
      title: "Independent Legal Advice",
      description:
        "We understand that each party is strongly encouraged to obtain independent legal advice before signing any agreement and that failure to do so may affect its enforceability.",
    },
    {
      id: "confirm_platform_disclaimer",
      name: "confirmPlatformDisclaimer",
      title: "Platform Disclaimer",
      description:
        "We understand that Let's Prenup assists in preparing an initial draft of our agreement and does not provide legal advice. We acknowledge that independent legal advice should be obtained before signing any agreement.",
    },
    {
      id: "confirm_accuracy",
      name: "confirmAccuracy",
      title: "Final Confirmation",
      description:
        "I confirm that I have read and understood the declarations above and that the information provided throughout this section is true, complete, and accurate to the best of my knowledge.",
    },
  ];

  // Helper row creators matching Shahmir's exact schemas
  function makeRealEstateRow(): any {
    return {
      id: makeId("re"),
      addressLine1: "",
      addressLine2: "",
      postcode: "",
      propertyType: "",
      value: "",
      valueUnknown: false,
      mortgageBalance: "",
      earlyPenalty: "",
      ownershipShare: "",
      ownershipMode: "",
      coOwnerDetails: "",
      thirdPartyInterest: "No",
      thirdPartyDetail: "",
      ...emptyTreatment,
    };
  }

  function makeSavingsRow(): any {
    return {
      id: makeId("sav"),
      institution: "",
      accountType: "",
      balance: "",
      ...emptyTreatment,
    };
  }

  function makePensionRow(): any {
    return {
      id: makeId("pen"),
      provider: "",
      value: "",
      valueUnknown: false,
      ...emptyTreatment,
    };
  }

  function makeBusinessRow(): any {
    return {
      id: makeId("biz"),
      name: "",
      entityType: "",
      turnover: "",
      netProfit: "",
      ownershipPercent: "",
      valueOfStake: "",
      valueUnknown: false,
      justification: "",
      ...emptyTreatment,
    };
  }

  function makeDebtRow(): any {
    return {
      id: makeId("debt"),
      lenderName: "",
      debtType: "",
      outstandingBalance: "",
      ...emptyTreatment,
    };
  }

  function makeIPRow(): any {
    return {
      id: makeId("ip"),
      name: "",
      ipType: "",
      value: "",
      valueUnknown: false,
      registrationNumber: "",
      description: "",
      ...emptyTreatment,
    };
  }

  function makeChattelRow(): any {
    return {
      id: makeId("chat"),
      description: "",
      category: "",
      value: "",
      valueUnknown: false,
      ...emptyTreatment,
    };
  }

  function makeOtherAssetRow(): any {
    return {
      id: makeId("oth"),
      description: "",
      value: "",
      valueUnknown: false,
      ...emptyTreatment,
    };
  }

  function makeAltIncomeRow(): any {
    return {
      id: makeId("alt"),
      description: "",
      amount: "",
      ...emptyTreatment,
    };
  }

  function makeMaintenanceRow(): any {
    return {
      id: makeId("maint"),
      dependentLink: "",
      monthlyPayment: "",
      projectedEndDate: "",
      ...emptyTreatment,
    };
  }

  const sharedTreatmentOptions: { value: Treatment; label: string }[] = [
    { value: "ShareEqually", label: "Share Equally (50/50)" },
    { value: "Contribution", label: "Split by Contribution" },
    { value: "Percentage", label: "Share by Percentage" },
    { value: "Custom", label: "Custom Arrangement" },
  ];

  function makeSharedRealEstateRow(): any {
    return {
      id: makeId("sre"),
      addressLine1: "",
      addressLine2: "",
      postcode: "",
      propertyType: "",
      value: "",
      valueUnknown: false,
      mortgageBalance: "",
      earlyPenalty: "",
      ownershipPercentage: "50",
      ...emptyTreatment,
    };
  }

  function makeSharedSavingsRow(): any {
    return {
      id: makeId("ssav"),
      institution: "",
      accountType: "",
      balance: "",
      ...emptyTreatment,
    };
  }

  function makeSharedIncomeRow(): any {
    return {
      id: makeId("sinc"),
      description: "",
      source: "",
      annualIncome: "",
      ...emptyTreatment,
    };
  }

  function makeSharedDebtRow(): any {
    return {
      id: makeId("sdeb"),
      lenderName: "",
      liabilityType: "",
      outstandingBalance: "",
      ...emptyTreatment,
    };
  }

  function makeSharedBusinessRow(): any {
    return {
      id: makeId("sbiz"),
      name: "",
      entityType: "",
      turnover: "",
      netProfit: "",
      ownershipPercent: "",
      valueOfStake: "",
      valueUnknown: false,
      justification: "",
      directorLoanBalance: "",
      ...emptyTreatment,
    };
  }

  function makeSharedIPRow(): any {
    return {
      id: makeId("sip"),
      name: "",
      ipType: "",
      value: "",
      valueUnknown: false,
      registrationNumber: "",
      description: "",
      ...emptyTreatment,
    };
  }

  function makeSharedChattelRow(): any {
    return {
      id: makeId("schat"),
      description: "",
      category: "",
      value: "",
      valueUnknown: false,
      ...emptyTreatment,
    };
  }

  function makeSharedOtherAssetRow(): any {
    return {
      id: makeId("sother"),
      description: "",
      value: "",
      valueUnknown: false,
      ...emptyTreatment,
    };
  }

  // Partner 1 Form Data
  const [p1Data, setP1Data] = useState<any>({
    firstName: "Arthur",
    middleName: "",
    lastName: "Vance",
    dateOfBirth: "1988-04-12",
    languageFluency: "Yes",
    nationality: "CA",
    domicileStatus: "Canada (Ontario Resident)",
    currentProfession: "Senior Software Architect",
    street1: "140 King St W, Suite 2400",
    city: "Toronto",
    county: "York",
    postcode: "M5H 3Y2",
    marriageDate: "2026-10-15",

    // Legal Declarations
    agreementObjectives:
      "To clarify separate pre-marital property holdings, protect individual business equity, and establish a clear financial framework prior to marriage.",
    livingSituationFuture:
      "Currently residing in Toronto. Plan to acquire a joint property in 2027 while maintaining separate investment portfolios.",
    confirmPersonalEffects: true,
    confirmHouseholdDivision: true,
    acknowledgeCourtChildren: true,
    confirmCostSharing: true,
    confirmUndueInfluence: true,
    confirmIla: true,
    confirmPlatformDisclaimer: true,
    confirmAccuracy: true,

    // Family & Dependents
    priorMarriageStatus: "No, never married",
    isLegallySeparated: false,
    hasLivingChildren: "No",
    children: [] as any[],
    futureParentalIntentions: "Yes",
    hasFamilyPets: "Yes",

    // Assets (Shahmir's exact Matrix rows)
    hasRealEstate: "Yes",
    realEstate: [
      {
        id: "re_1",
        addressLine1: "140 King St W",
        addressLine2: "Suite 2400",
        postcode: "M5H 3Y2",
        propertyType: "Flat",
        value: "1850000",
        valueUnknown: false,
        mortgageBalance: "80000",
        earlyPenalty: "0",
        ownershipShare: "100",
        ownershipMode: "Solely",
        coOwnerDetails: "",
        thirdPartyInterest: "No",
        thirdPartyDetail: "",
        treatment: "KeepSeparate",
        contributionText: "",
        percentageValue: "",
        customText: "",
      },
    ],

    hasSavings: "Yes",
    savings: [
      {
        id: "sav_1",
        institution: "RBC & TD Bank",
        accountType: "Savings / Deposit",
        balance: "320000",
        treatment: "KeepSeparate",
        contributionText: "",
        percentageValue: "",
        customText: "",
      },
    ],

    hasPensions: "Yes",
    pensions: [
      {
        id: "pen_1",
        provider: "Ontario Teachers Pension / Private RRSP",
        value: "450000",
        valueUnknown: false,
        treatment: "KeepSeparate",
        contributionText: "",
        percentageValue: "",
        customText: "",
      },
    ],

    hasBusinesses: "Yes",
    businesses: [
      {
        id: "biz_1",
        name: "Vance Tech Solutions Inc.",
        entityType: "Limited Company (Ltd)",
        turnover: "850000",
        netProfit: "320000",
        ownershipPercent: "100",
        valueOfStake: "1200000",
        valueUnknown: false,
        justification: "Calculated based on 3.5x EBITDA",
        treatment: "KeepSeparate",
        contributionText: "",
        percentageValue: "",
        customText: "",
      },
    ],

    // Income
    grossAnnualIncome: "240000",
    salaryTreatment: { treatment: "KeepSeparate", contributionText: "", percentageValue: "", customText: "" },
    hasPrimaryBonus: "Yes",
    primaryIncomeRows: [
      { id: "bon_1", description: "Annual Performance Bonus", amount: "45000", treatment: "KeepSeparate", contributionText: "", percentageValue: "", customText: "" },
    ],
    hasAlternativeIncome: "No",
    altIncomeRows: [],

    // Liabilities
    hasDebts: "Yes",
    debts: [
      { id: "deb_1", lenderName: "TD Canada Trust", debtType: "Personal Loan", outstandingBalance: "15000", treatment: "KeepSeparate", contributionText: "", percentageValue: "", customText: "" },
    ],
  });

  // Partner 2 Form Data
  const [p2Data, setP2Data] = useState<any>({
    firstName: "Sophia",
    middleName: "",
    lastName: "Lin",
    dateOfBirth: "1991-09-25",
    languageFluency: "Yes",
    nationality: "CA",
    domicileStatus: "Canada (Ontario Resident)",
    currentProfession: "Financial Risk Manager",
    street1: "88 Queens Quay E, Suite 1205",
    city: "Toronto",
    county: "York",
    postcode: "M5E 1Z7",
    marriageDate: "2026-10-15",

    // Legal Declarations
    agreementObjectives:
      "To ensure mutual financial transparency, protect pre-existing wealth, and outline spousal support expectations clearly.",
    livingSituationFuture:
      "Residing in Toronto. Future plans include joint investments and co-ownership of real estate.",
    confirmPersonalEffects: true,
    confirmHouseholdDivision: true,
    acknowledgeCourtChildren: true,
    confirmCostSharing: true,
    confirmUndueInfluence: true,
    confirmIla: true,
    confirmPlatformDisclaimer: true,
    confirmAccuracy: true,

    // Family & Dependents
    priorMarriageStatus: "No, never married",
    isLegallySeparated: false,
    hasLivingChildren: "No",
    children: [] as any[],
    futureParentalIntentions: "Yes",
    hasFamilyPets: "Yes",

    // Assets
    hasRealEstate: "Yes",
    realEstate: [
      {
        id: "re_2",
        addressLine1: "88 Queens Quay E",
        addressLine2: "Suite 1205",
        postcode: "M5E 1Z7",
        propertyType: "Flat",
        value: "950000",
        valueUnknown: false,
        mortgageBalance: "40000",
        earlyPenalty: "0",
        ownershipShare: "100",
        ownershipMode: "Solely",
        coOwnerDetails: "",
        thirdPartyInterest: "No",
        thirdPartyDetail: "",
        treatment: "KeepSeparate",
        contributionText: "",
        percentageValue: "",
        customText: "",
      },
    ],

    hasSavings: "Yes",
    savings: [
      {
        id: "sav_2",
        institution: "Scotiabank & BMO",
        accountType: "Savings / Deposit",
        balance: "180000",
        treatment: "KeepSeparate",
        contributionText: "",
        percentageValue: "",
        customText: "",
      },
    ],

    hasPensions: "Yes",
    pensions: [
      {
        id: "pen_2",
        provider: "HOOPP Defined Benefit Pension Plan",
        value: "180000",
        valueUnknown: false,
        treatment: "KeepSeparate",
        contributionText: "",
        percentageValue: "",
        customText: "",
      },
    ],

    hasBusinesses: "No",
    businesses: [],

    // Income
    grossAnnualIncome: "165000",
    salaryTreatment: { treatment: "KeepSeparate", contributionText: "", percentageValue: "", customText: "" },
    hasPrimaryBonus: "Yes",
    primaryIncomeRows: [
      { id: "bon_2", description: "Risk Incentive Award", amount: "25000", treatment: "KeepSeparate", contributionText: "", percentageValue: "", customText: "" },
    ],
    hasAlternativeIncome: "No",
    altIncomeRows: [],

    // Liabilities
    hasDebts: "No",
    debts: [],
  });

  // Joint Form Data
  const [jointData, setJointData] = useState<any>({
    livingArrangement: "Joint",
    livingArrangementDetail: "140 King St W, Suite 2400, Toronto ON (50/50 Equity)",

    hasSharedRealEstate: "Yes",
    sharedRealEstate: [
      {
        id: "sre_1",
        addressLine1: "88 Queens Quay E",
        addressLine2: "Suite 1205",
        postcode: "M5E 1Z7",
        propertyType: "Flat",
        value: "950000",
        valueUnknown: false,
        mortgageBalance: "480000",
        earlyPenalty: "0",
        ownershipShare: "50",
        ownershipMode: "Jointly",
        treatment: "ShareEqually",
        contributionText: "",
        percentageValue: "50",
        customText: "",
      },
    ],

    hasSharedSavings: "Yes",
    sharedSavings: [
      {
        id: "ssav_1",
        institution: "RBC Joint High-Interest Account",
        accountType: "Savings / Deposit",
        balance: "120000",
        treatment: "ShareEqually",
        contributionText: "",
        percentageValue: "50",
        customText: "",
      },
    ],

    hasSharedIncome: "Yes",
    sharedIncome: [
      { id: "sinc_1", description: "Shared Residential Rental Stream", annualIncome: "24000", treatment: "ShareEqually", contributionText: "", percentageValue: "50", customText: "" },
    ],

    hasSharedDebts: "Yes",
    sharedDebts: [
      { id: "sdeb_1", lenderName: "Scotiabank", liabilityType: "Joint Mortgage", outstandingBalance: "480000", treatment: "ShareEqually", contributionText: "", percentageValue: "50", customText: "" },
    ],

    priorMarriagesNote: "Neither party has prior marriage or civil partnership obligations.",
    dependantsSupportNote: "No existing child maintenance or spousal support orders.",
  });

  const currentIndividualData = activeParty === "p1" ? p1Data : p2Data;
  const setCurrentIndividualData = activeParty === "p1" ? setP1Data : setP2Data;

  const handleIndividualChange = (field: string, value: any) => {
    setCurrentIndividualData((prev: any) => ({ ...prev, [field]: value }));
  };

  const updateIndividualRow = (category: string, id: string, patch: any) => {
    setCurrentIndividualData((prev: any) => ({
      ...prev,
      [category]: prev[category].map((r: any) => (r.id === id ? { ...r, ...patch } : r)),
    }));
  };

  const addIndividualRow = (category: string, makeRowFn: () => any) => {
    setCurrentIndividualData((prev: any) => ({
      ...prev,
      [category]: [...prev[category], makeRowFn()],
    }));
  };

  const removeIndividualRow = (category: string, id: string) => {
    setCurrentIndividualData((prev: any) => ({
      ...prev,
      [category]: prev[category].filter((r: any) => r.id !== id),
    }));
  };

  const handleJointChange = (field: string, value: any) => {
    setJointData((prev: any) => ({ ...prev, [field]: value }));
  };

  const updateJointRow = (category: string, id: string, patch: any) => {
    setJointData((prev: any) => ({
      ...prev,
      [category]: prev[category].map((r: any) => (r.id === id ? { ...r, ...patch } : r)),
    }));
  };

  const addJointRow = (category: string, makeRowFn: () => any) => {
    setJointData((prev: any) => ({
      ...prev,
      [category]: [...(prev[category] || []), makeRowFn()],
    }));
  };

  const removeJointRow = (category: string, id: string) => {
    setJointData((prev: any) => ({
      ...prev,
      [category]: prev[category].filter((r: any) => r.id !== id),
    }));
  };

  const livingArrangementOptions = [
    { value: "Separate", label: "We currently live separately" },
    { value: "Rent", label: "We rent a home together" },
    { value: "OneOwner", label: "We live in a home owned by one of us" },
    { value: "Joint", label: "We live in a home we jointly own" },
    { value: "ThirdParty", label: "We live with family or third parties" },
    { value: "Other", label: "Other (please specify)" },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans max-w-5xl mx-auto w-full pb-12">
      {/* Top Banner: Submission Lock & CM Edit Mode */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-xs font-bold">
          <Lock className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <span>
            Client Submission State: Questionnaires SUBMITTED &amp; FROZEN for {caseObj.p1} &amp; {caseObj.p2}.
          </span>
        </div>

        <button
          onClick={() => setIsCmEditing(!isCmEditing)}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            isCmEditing
              ? "bg-amber-600 text-white shadow-md ring-2 ring-amber-400"
              : "bg-white text-slate-800 border border-amber-300 hover:bg-amber-100"
          }`}
        >
          {isCmEditing ? <Unlock className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
          <span>{isCmEditing ? "CM Edit Mode (Active)" : "Enable CM Edit Mode"}</span>
        </button>
      </div>

      {/* 3 QUESTIONNAIRE SELECTION CARDS (Shahmir's Layout) */}
      <div className="grid grid-cols-3 gap-4">
        {/* Card 1: Partner 1 */}
        <div
          onClick={() => setActiveParty("p1")}
          className={`p-4.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-3 shadow-xs ${
            activeParty === "p1"
              ? "bg-slate-900 text-white border-slate-900 ring-2 ring-slate-700 shadow-lg"
              : "bg-white text-slate-900 border-slate-300 hover:border-indigo-600"
          }`}
        >
          <div className="flex items-center justify-between border-b pb-2 border-slate-700/40">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              CARD 1
            </span>
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                activeParty === "p1"
                  ? "bg-emerald-950 text-emerald-300 border-emerald-600"
                  : "bg-emerald-50 text-emerald-800 border-emerald-200"
              }`}
            >
              Submitted &amp; Frozen
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-tight">{caseObj.p1} Questionnaire</h4>
            <p className={`text-xs mt-1 ${activeParty === "p1" ? "text-slate-300" : "text-slate-500"}`}>
              Personal Info, Declarations, Assets, Income &amp; Liabilities
            </p>
          </div>
          <div className="text-[11px] font-semibold flex items-center justify-between pt-1 border-t border-slate-700/40">
            <span>All Questions Included</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 2: Partner 2 */}
        <div
          onClick={() => setActiveParty("p2")}
          className={`p-4.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-3 shadow-xs ${
            activeParty === "p2"
              ? "bg-slate-900 text-white border-slate-900 ring-2 ring-slate-700 shadow-lg"
              : "bg-white text-slate-900 border-slate-300 hover:border-indigo-600"
          }`}
        >
          <div className="flex items-center justify-between border-b pb-2 border-slate-700/40">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              CARD 2
            </span>
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                activeParty === "p2"
                  ? "bg-emerald-950 text-emerald-300 border-emerald-600"
                  : "bg-emerald-50 text-emerald-800 border-emerald-200"
              }`}
            >
              Submitted &amp; Frozen
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-tight">{caseObj.p2} Questionnaire</h4>
            <p className={`text-xs mt-1 ${activeParty === "p2" ? "text-slate-300" : "text-slate-500"}`}>
              Personal Info, Declarations, Assets, Income &amp; Liabilities
            </p>
          </div>
          <div className="text-[11px] font-semibold flex items-center justify-between pt-1 border-t border-slate-700/40">
            <span>All Questions Included</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 3: Joint Questionnaire */}
        <div
          onClick={() => setActiveParty("joint")}
          className={`p-4.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-3 shadow-xs ${
            activeParty === "joint"
              ? "bg-slate-900 text-white border-slate-900 ring-2 ring-slate-700 shadow-lg"
              : "bg-white text-slate-900 border-slate-300 hover:border-indigo-600"
          }`}
        >
          <div className="flex items-center justify-between border-b pb-2 border-slate-700/40">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              CARD 3
            </span>
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                activeParty === "joint"
                  ? "bg-emerald-950 text-emerald-300 border-emerald-600"
                  : "bg-emerald-50 text-emerald-800 border-emerald-200"
              }`}
            >
              Submitted &amp; Frozen
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-tight">Joint &amp; Shared Questionnaire</h4>
            <p className={`text-xs mt-1 ${activeParty === "joint" ? "text-slate-300" : "text-slate-500"}`}>
              Shared Assets, Shared Income/Debts, Matrimony &amp; Dependants
            </p>
          </div>
          <div className="text-[11px] font-semibold flex items-center justify-between pt-1 border-t border-slate-700/40">
            <span>All Joint Fields Included</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* SUB-NAVIGATION BAR FOR INDIVIDUAL (CARD 1 / CARD 2) */}
      {activeParty !== "joint" && (
        <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-300 pb-2">
          <button
            onClick={() => setIndividualSection("personal")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              individualSection === "personal"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Personal Information</span>
          </button>

          <button
            onClick={() => setIndividualSection("legal")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              individualSection === "legal"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Legal Declaration</span>
          </button>

          <button
            onClick={() => setIndividualSection("family")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              individualSection === "family"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Family &amp; Dependents</span>
          </button>

          <button
            onClick={() => setIndividualSection("assets")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              individualSection === "assets"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Individual Assets</span>
          </button>

          <button
            onClick={() => setIndividualSection("income")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              individualSection === "income"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Income &amp; Revenue</span>
          </button>

          <button
            onClick={() => setIndividualSection("liabilities")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              individualSection === "liabilities"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Liabilities &amp; Debts</span>
          </button>
        </div>
      )}

      {/* SUB-NAVIGATION BAR FOR JOINT (CARD 3) - EXACT 3 FORMS MATCHING SHAHMIR */}
      {activeParty === "joint" && (
        <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-300 pb-2">
          <button
            onClick={() => setJointSection("joint-assets")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              jointSection === "joint-assets"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Joint Assets</span>
          </button>

          <button
            onClick={() => setJointSection("joint-income")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              jointSection === "joint-income"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Joint Income and revenue</span>
          </button>

          <button
            onClick={() => setJointSection("joint-liabilities")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              jointSection === "joint-liabilities"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Joint Liabilities and debts</span>
          </button>
        </div>
      )}

      {/* FORM CONTENT CONTAINER (Shahmir's exact UI design system, compact & centered) */}
      <div className="rounded-2xl bg-white p-5 sm:p-7 shadow-sm flex flex-col gap-4 border border-slate-200/80">
        {/* ========================================================================= */}
        {/* PARTNER 1 & PARTNER 2 SECTIONS */}
        {/* ========================================================================= */}
        {activeParty !== "joint" && (
          <>
            {/* 1. PERSONAL INFORMATION */}
            {individualSection === "personal" && (
              <div>
                <h2 className="mb-2 text-[1.2rem] font-bold tracking-tight text-slate-900">
                  Personal Information
                </h2>
                <label className="mb-6 block text-sm text-slate-500">
                  Complete this section using your own personal and financial information only. Your partner will complete a separate questionnaire using their own information.
                </label>

                {/* Full Legal Name */}
                <div className="mb-7">
                  <label className="mb-2 block text-[0.925rem] font-semibold text-slate-800">
                    Full Legal Name
                  </label>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-[2fr_1.5fr_2fr]">
                    <input
                      type="text"
                      placeholder="First Name"
                      disabled={!isCmEditing}
                      value={currentIndividualData.firstName}
                      onChange={(e) => handleIndividualChange("firstName", e.target.value)}
                      className={inputClasses}
                    />
                    <input
                      type="text"
                      placeholder="Middle Name(s)"
                      disabled={!isCmEditing}
                      value={currentIndividualData.middleName}
                      onChange={(e) => handleIndividualChange("middleName", e.target.value)}
                      className={inputClasses}
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      disabled={!isCmEditing}
                      value={currentIndividualData.lastName}
                      onChange={(e) => handleIndividualChange("lastName", e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                </div>

                {/* DOB & Language */}
                <div className="mb-7 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[0.925rem] font-semibold text-slate-800">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      disabled={!isCmEditing}
                      value={currentIndividualData.dateOfBirth}
                      onChange={(e) => handleIndividualChange("dateOfBirth", e.target.value)}
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[0.925rem] font-semibold text-slate-800">
                      English Language Proficiency
                    </label>
                    <select
                      disabled={!isCmEditing}
                      value={currentIndividualData.languageFluency}
                      onChange={(e) => handleIndividualChange("languageFluency", e.target.value)}
                      className={inputClasses}
                    >
                      <option value="">Select Option</option>
                      <option value="Yes">Yes, fully fluent in English</option>
                      <option value="No">No, language assistance needed</option>
                    </select>
                  </div>
                </div>

                {/* Nationality & Domicile */}
                <div className="mb-7 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[0.925rem] font-semibold text-slate-800">
                      Nationality
                    </label>
                    <select
                      disabled={!isCmEditing}
                      value={currentIndividualData.nationality}
                      onChange={(e) => handleIndividualChange("nationality", e.target.value)}
                      className={inputClasses}
                    >
                      <option value="">Select Country</option>
                      <option value="GB">United Kingdom</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="IE">Ireland</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-[0.925rem] font-semibold text-slate-800">
                      Domicile &amp; Residency
                    </label>
                    <input
                      type="text"
                      placeholder="Country of domicile and current country of residence."
                      maxLength={100}
                      disabled={!isCmEditing}
                      value={currentIndividualData.domicileStatus}
                      onChange={(e) => handleIndividualChange("domicileStatus", e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                </div>

                {/* Profession */}
                <div className="mb-7 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[0.925rem] font-semibold text-slate-800">
                      Current Profession / Occupation
                    </label>
                    <input
                      type="text"
                      placeholder="Primary Job Title"
                      disabled={!isCmEditing}
                      value={currentIndividualData.currentProfession}
                      onChange={(e) => handleIndividualChange("currentProfession", e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="mb-7">
                  <label className="mb-2 block text-[0.925rem] font-semibold text-slate-800">
                    Current Home Address
                  </label>
                  <input
                    type="text"
                    placeholder="Street Address Line 1"
                    disabled={!isCmEditing}
                    value={currentIndividualData.street1}
                    onChange={(e) => handleIndividualChange("street1", e.target.value)}
                    className={inputClasses + " mb-3.5"}
                  />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-[2fr_1fr_1fr]">
                    <input
                      type="text"
                      placeholder="City"
                      disabled={!isCmEditing}
                      value={currentIndividualData.city}
                      onChange={(e) => handleIndividualChange("city", e.target.value)}
                      className={inputClasses}
                    />
                    <input
                      type="text"
                      placeholder="County"
                      disabled={!isCmEditing}
                      value={currentIndividualData.county}
                      onChange={(e) => handleIndividualChange("county", e.target.value)}
                      className={inputClasses}
                    />
                    <input
                      type="text"
                      placeholder="Postcode"
                      disabled={!isCmEditing}
                      value={currentIndividualData.postcode}
                      onChange={(e) => handleIndividualChange("postcode", e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                </div>

                {/* Wedding Date */}
                <div className="mb-7">
                  <label className="mb-2 block text-[0.925rem] font-semibold text-slate-800">
                    Planned Wedding Date
                  </label>
                  <input
                    type="date"
                    disabled={!isCmEditing}
                    value={currentIndividualData.marriageDate}
                    onChange={(e) => handleIndividualChange("marriageDate", e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>
            )}

            {/* 2. LEGAL DECLARATIONS (EXACT SHAHMIR DESIGN & WORDING) */}
            {individualSection === "legal" && (
              <div>
                <h2 className="mb-2 text-[1.2rem] font-bold tracking-tight text-slate-900">
                  Legal Declarations
                </h2>
                <p className="mb-6 text-[0.9rem] leading-relaxed text-slate-500">
                  Please review and confirm your understanding of the following foundational principles regarding your relationship agreement workspace.
                </p>

                {/* Objectives */}
                <div className="mb-7">
                  <label className="mb-2 block text-[0.925rem] font-semibold text-slate-800">
                    Please provide a brief overview of what you are both aiming to achieve with this agreement and your primary reasons for putting it in place.
                  </label>
                  <textarea
                    rows={4}
                    maxLength={1500}
                    placeholder="Describe what you both aim to achieve with this agreement..."
                    disabled={!isCmEditing}
                    value={currentIndividualData.agreementObjectives}
                    onChange={(e) => handleIndividualChange("agreementObjectives", e.target.value)}
                    className={textareaClasses}
                  />
                </div>

                {/* Living situation */}
                <div className="mb-7">
                  <label className="mb-2 block text-[0.925rem] font-semibold text-slate-800">
                    Please provide a summary of your current living arrangements and any significant future plans (e.g., upcoming property purchases, relocating abroad, or major career changes).
                  </label>
                  <textarea
                    rows={4}
                    maxLength={1500}
                    placeholder="Summarize your current living framework and any future plans..."
                    disabled={!isCmEditing}
                    value={currentIndividualData.livingSituationFuture}
                    onChange={(e) => handleIndividualChange("livingSituationFuture", e.target.value)}
                    className={textareaClasses}
                  />
                </div>

                {/* Declarations of Understanding */}
                <div className="mb-7">
                  <h3 className="mb-4 text-[1.1rem] font-bold text-slate-900">
                    Declarations of Understanding
                  </h3>

                  {declarations.map((decl) => {
                    const checked = !!currentIndividualData[decl.name];
                    return (
                      <label
                        key={decl.id}
                        htmlFor={decl.id}
                        className={`relative mb-4 flex cursor-pointer items-start gap-4 rounded-[10px] border px-5 py-5 transition ${
                          checked
                            ? "border-indigo-600 bg-slate-50"
                            : "border-slate-300 bg-slate-50 hover:border-indigo-600 hover:bg-white"
                        }`}
                      >
                        <input
                          type="checkbox"
                          id={decl.id}
                          name={decl.name}
                          checked={checked}
                          disabled={!isCmEditing}
                          onChange={(e) => handleIndividualChange(decl.name, e.target.checked)}
                          className="sr-only"
                        />
                        <span
                          className={`mt-0.5 flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-[6px] border-2 transition ${
                            checked
                              ? "border-indigo-600 bg-indigo-600"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {checked && (
                            <svg
                              viewBox="0 0 10 10"
                              className="h-[10px] w-[7px]"
                              fill="none"
                              stroke="white"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M1 5l2.5 3L9 1" />
                            </svg>
                          )}
                        </span>
                        <div>
                          <div
                            className={`mb-1 text-[0.95rem] font-semibold transition ${
                              checked ? "text-indigo-600" : "text-slate-900"
                            }`}
                          >
                            {decl.title}
                          </div>
                          <div className="text-[0.85rem] text-slate-500">
                            {decl.description}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. FAMILY & DEPENDENTS (EXACT 1:1 SHAHMIR WORDING & MODULES) */}
            {individualSection === "family" && (
              <div>
                <h2 className="mb-2 text-[1.2rem] font-bold tracking-tight text-slate-900">
                  Family &amp; Dependents
                </h2>
                <p className="mb-6 text-[0.9rem] leading-relaxed text-slate-500">
                  Tell us about your previous marriages or civil partnerships, your children, your future family plans, and any family pets you would like this agreement to cover.
                </p>

                {/* MODULE 1: PRIOR MARITAL HISTORY */}
                <div className="mb-5 border-b-2 border-slate-100 pb-2 text-[1.1rem] font-bold tracking-tight text-slate-900">
                  Prior Marital History
                </div>
                <div className="mb-7">
                  <label className="mb-2.5 block text-[0.95rem] font-semibold text-slate-800">
                    Have you previously been married or in a civil partnership before this relationship?
                  </label>
                  <p className="-mt-1.5 mb-4 text-[0.85rem] italic text-slate-500">
                    Note: If your previous relationship was a civil partnership rather than a marriage, please choose the equivalent option below.
                  </p>

                  <div className="mb-2.5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {["No, never married", "Yes, previously divorced", "Yes, widowed"].map((opt) => {
                      const checked = currentIndividualData.priorMarriageStatus === opt;
                      return (
                        <label
                          key={opt}
                          className={`relative flex cursor-pointer items-center gap-3.5 rounded-[10px] border px-4 py-4 transition ${
                            checked
                              ? "border-indigo-600 bg-slate-50"
                              : "border-slate-300 bg-slate-50 hover:border-indigo-600 hover:bg-white"
                          }`}
                        >
                          <input
                            type="radio"
                            name="priorMarriageStatus"
                            checked={checked}
                            disabled={!isCmEditing}
                            onChange={() => handleIndividualChange("priorMarriageStatus", opt)}
                            className="sr-only"
                          />
                          <span
                            className={`relative h-5 w-5 flex-shrink-0 rounded-full border-2 transition ${
                              checked ? "border-indigo-600 bg-indigo-600" : "border-slate-300 bg-white"
                            }`}
                          >
                            {checked && (
                              <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
                            )}
                          </span>
                          <span className={`text-[0.925rem] font-semibold transition ${checked ? "text-indigo-600" : "text-slate-900"}`}>
                            {opt}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* MODULE 2: CURRENT CHILDREN STATUS */}
                <div className="mb-6 mt-12 border-b-2 border-slate-100 pb-2.5 text-[1.25rem] font-bold tracking-tight text-slate-900">
                  Current Children Status
                </div>
                <div className="mb-7">
                  <label className="mb-2.5 block text-[0.95rem] font-semibold text-slate-800">
                    Do you have any children, including biological, adopted, or stepchildren, from this relationship or a previous relationship?
                  </label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {["Yes", "No"].map((opt) => {
                      const checked = currentIndividualData.hasLivingChildren === opt;
                      return (
                        <label
                          key={opt}
                          className={`relative flex cursor-pointer items-center gap-3.5 rounded-[10px] border px-4 py-4 transition ${
                            checked
                              ? "border-indigo-600 bg-slate-50"
                              : "border-slate-300 bg-slate-50 hover:border-indigo-600 hover:bg-white"
                          }`}
                        >
                          <input
                            type="radio"
                            name="hasLivingChildren"
                            checked={checked}
                            disabled={!isCmEditing}
                            onChange={() => handleIndividualChange("hasLivingChildren", opt)}
                            className="sr-only"
                          />
                          <span
                            className={`relative h-5 w-5 flex-shrink-0 rounded-full border-2 transition ${
                              checked ? "border-indigo-600 bg-indigo-600" : "border-slate-300 bg-white"
                            }`}
                          >
                            {checked && (
                              <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
                            )}
                          </span>
                          <span className={`text-[0.925rem] font-semibold transition ${checked ? "text-indigo-600" : "text-slate-900"}`}>
                            {opt}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* MODULE 3: FUTURE FAMILY PLANS & PETS */}
                <div className="mb-6 mt-12 border-b-2 border-slate-100 pb-2.5 text-[1.25rem] font-bold tracking-tight text-slate-900">
                  Future Family Plans &amp; Pets
                </div>

                <div className="mb-7">
                  <label className="mb-2.5 block text-[0.95rem] font-semibold text-slate-800">
                    Do you and your partner plan, or think you may decide in the future, to have or adopt children together?
                  </label>
                  <select
                    value={currentIndividualData.futureParentalIntentions}
                    disabled={!isCmEditing}
                    onChange={(e) => handleIndividualChange("futureParentalIntentions", e.target.value)}
                    className={inputClasses}
                  >
                    <option value="" disabled>
                      Select an option...
                    </option>
                    <option value="Yes">
                      Yes, we plan to have or adopt children together.
                    </option>
                    <option value="No">
                      No, we do not plan to have children together.
                    </option>
                    <option value="Undecided">
                      We are currently undecided about having children.
                    </option>
                  </select>
                </div>

                <div className="mb-7">
                  <label className="mb-2.5 block text-[0.95rem] font-semibold text-slate-800">
                    Do you currently own, or expect to have, any pets whose ownership or care you would like to include in this agreement?
                  </label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {["Yes", "No"].map((opt) => {
                      const checked = currentIndividualData.hasFamilyPets === opt;
                      return (
                        <label
                          key={opt}
                          className={`relative flex cursor-pointer items-center gap-3.5 rounded-[10px] border px-4 py-4 transition ${
                            checked
                              ? "border-indigo-600 bg-slate-50"
                              : "border-slate-300 bg-slate-50 hover:border-indigo-600 hover:bg-white"
                          }`}
                        >
                          <input
                            type="radio"
                            name="hasFamilyPets"
                            checked={checked}
                            disabled={!isCmEditing}
                            onChange={() => handleIndividualChange("hasFamilyPets", opt)}
                            className="sr-only"
                          />
                          <span
                            className={`relative h-5 w-5 flex-shrink-0 rounded-full border-2 transition ${
                              checked ? "border-indigo-600 bg-indigo-600" : "border-slate-300 bg-white"
                            }`}
                          >
                            {checked && (
                              <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
                            )}
                          </span>
                          <span className={`text-[0.925rem] font-semibold transition ${checked ? "text-indigo-600" : "text-slate-900"}`}>
                            {opt}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 4. INDIVIDUAL ASSETS (SHAHMIR'S EXACT MATRIX BOXES & ROW ITEMS) */}
            {individualSection === "assets" && (
              <div>
                <h2 className="mb-2 text-[1.2rem] font-bold tracking-tight text-slate-900">
                  Your Individual Assets
                </h2>
                <p className="mb-6 text-[0.9rem] leading-relaxed text-slate-500">
                  Please tell us about the assets you personally own or partly own. Include any assets owned with another person, such as a parent, family member, business partner or trust.
                </p>

                {/* PROPERTY & REAL ESTATE */}
                <PartHeader tooltip="List details of any properties you own personally or with third parties that you want to keep separate from your partner.">
                  Property &amp; Real Estate
                </PartHeader>
                <div className="mb-4">
                  <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                    Do you own, partly own, or have a financial interest in any real estate / properties?
                  </label>
                  <YesNoToggle
                    name="has_real_estate"
                    value={currentIndividualData.hasRealEstate}
                    onChange={(v) => handleIndividualChange("hasRealEstate", v)}
                  />
                </div>
                {currentIndividualData.hasRealEstate === "Yes" && (
                  <MatrixBox
                    title="Real Estate Registry Asset Rows"
                    onAdd={() => addIndividualRow("realEstate", makeRealEstateRow)}
                    addLabel="Add Property Asset"
                  >
                    {currentIndividualData.realEstate.map((row: any) => (
                      <RowItem key={row.id} onDelete={() => removeIndividualRow("realEstate", row.id)}>
                        <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                          <input
                            type="text"
                            placeholder="Address Line 1"
                            disabled={!isCmEditing}
                            value={row.addressLine1}
                            onChange={(e) => updateIndividualRow("realEstate", row.id, { addressLine1: e.target.value })}
                            className={inputClasses}
                          />
                          <input
                            type="text"
                            placeholder="Address Line 2 (Optional)"
                            disabled={!isCmEditing}
                            value={row.addressLine2}
                            onChange={(e) => updateIndividualRow("realEstate", row.id, { addressLine2: e.target.value })}
                            className={inputClasses}
                          />
                        </div>
                        <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                          <input
                            type="text"
                            placeholder="Postcode"
                            disabled={!isCmEditing}
                            value={row.postcode}
                            onChange={(e) => updateIndividualRow("realEstate", row.id, { postcode: e.target.value })}
                            className={inputClasses}
                          />
                          <select
                            value={row.propertyType}
                            disabled={!isCmEditing}
                            onChange={(e) => updateIndividualRow("realEstate", row.id, { propertyType: e.target.value })}
                            className={inputClasses}
                          >
                            <option value="">Property Type</option>
                            <option value="House">House</option>
                            <option value="Flat">Flat</option>
                            <option value="Commercial">Commercial</option>
                          </select>
                          <ValueWithUnsure
                            id={`val_${row.id}`}
                            value={row.value}
                            unknown={row.valueUnknown}
                            onValueChange={(v) => updateIndividualRow("realEstate", row.id, { value: v })}
                            onUnknownChange={(v) => updateIndividualRow("realEstate", row.id, { valueUnknown: v })}
                            placeholder="Value (GBP)"
                          />
                        </div>
                        <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                          <input
                            type="number"
                            placeholder="Mortgage Balance"
                            disabled={!isCmEditing}
                            value={row.mortgageBalance}
                            onChange={(e) => updateIndividualRow("realEstate", row.id, { mortgageBalance: e.target.value })}
                            className={inputClasses}
                          />
                          <input
                            type="number"
                            placeholder="Early Penalty Charges (£)"
                            disabled={!isCmEditing}
                            value={row.earlyPenalty}
                            onChange={(e) => updateIndividualRow("realEstate", row.id, { earlyPenalty: e.target.value })}
                            className={inputClasses}
                          />
                          <input
                            type="number"
                            min={0}
                            max={100}
                            placeholder="Ownership Share %"
                            disabled={!isCmEditing}
                            value={row.ownershipShare}
                            onChange={(e) => updateIndividualRow("realEstate", row.id, { ownershipShare: e.target.value })}
                            className={inputClasses}
                          />
                        </div>
                        <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                          <select
                            value={row.ownershipMode}
                            disabled={!isCmEditing}
                            onChange={(e) => updateIndividualRow("realEstate", row.id, { ownershipMode: e.target.value })}
                            className={inputClasses}
                          >
                            <option value="">Ownership Mode</option>
                            <option value="Solely">Solely Owned</option>
                            <option value="Jointly">Jointly Owned (with family, business partners, etc.)</option>
                          </select>
                          <select
                            value={row.thirdPartyInterest}
                            disabled={!isCmEditing}
                            onChange={(e) => updateIndividualRow("realEstate", row.id, { thirdPartyInterest: e.target.value })}
                            className={inputClasses}
                          >
                            <option value="">Third-Party Interest?</option>
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                          </select>
                        </div>
                        <TreatmentSelect
                          id={row.id}
                          fields={row}
                          onChange={(f) => updateIndividualRow("realEstate", row.id, f)}
                        />
                      </RowItem>
                    ))}
                  </MatrixBox>
                )}

                {/* SAVINGS & INVESTMENTS */}
                <PartHeader tooltip="Declare balances in personal bank accounts, savings accounts, cash ISAs, or premium bonds.">
                  Savings &amp; Investments
                </PartHeader>
                <div className="mb-4">
                  <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                    Do you currently hold any personal bank accounts, cash savings, premium bonds, or investment portfolios?
                  </label>
                  <YesNoToggle
                    name="has_separate_savings"
                    value={currentIndividualData.hasSavings}
                    onChange={(v) => handleIndividualChange("hasSavings", v)}
                  />
                </div>
                {currentIndividualData.hasSavings === "Yes" && (
                  <MatrixBox
                    title="Savings &amp; Cash Resource Pools"
                    onAdd={() => addIndividualRow("savings", makeSavingsRow)}
                    addLabel="Add Savings / Portfolio Account"
                  >
                    {currentIndividualData.savings.map((row: any) => (
                      <RowItem key={row.id} onDelete={() => removeIndividualRow("savings", row.id)}>
                        <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                          <input
                            type="text"
                            placeholder="Institution / Bank Name"
                            disabled={!isCmEditing}
                            value={row.institution}
                            onChange={(e) => updateIndividualRow("savings", row.id, { institution: e.target.value })}
                            className={inputClasses + " sm:col-span-1"}
                          />
                          <select
                            value={row.accountType}
                            disabled={!isCmEditing}
                            onChange={(e) => updateIndividualRow("savings", row.id, { accountType: e.target.value })}
                            className={inputClasses}
                          >
                            <option value="">Account Type</option>
                            <option value="Current">Current Account</option>
                            <option value="Savings">Savings Account</option>
                            <option value="ISA">ISA</option>
                            <option value="Investment">Investment Portfolio</option>
                            <option value="Other">Other</option>
                          </select>
                          <input
                            type="number"
                            placeholder="Valuation Balance (GBP)"
                            disabled={!isCmEditing}
                            value={row.balance}
                            onChange={(e) => updateIndividualRow("savings", row.id, { balance: e.target.value })}
                            className={inputClasses}
                          />
                        </div>
                        <TreatmentSelect
                          id={row.id}
                          fields={row}
                          onChange={(f) => updateIndividualRow("savings", row.id, f)}
                        />
                      </RowItem>
                    ))}
                  </MatrixBox>
                )}

                {/* PENSIONS & RETIREMENT FUNDS */}
                <PartHeader tooltip="List your private, corporate, or state pension pots or retirement annuities.">
                  Pensions &amp; Retirement Funds
                </PartHeader>
                <div className="mb-4">
                  <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                    Do you hold any private, corporate, or state pension pots or retirement annuities?
                  </label>
                  <YesNoToggle
                    name="has_separate_pensions"
                    value={currentIndividualData.hasPensions}
                    onChange={(v) => handleIndividualChange("hasPensions", v)}
                  />
                </div>
                {currentIndividualData.hasPensions === "Yes" && (
                  <MatrixBox
                    title="Pension Scheme Registry"
                    onAdd={() => addIndividualRow("pensions", makePensionRow)}
                    addLabel="Add Pension Pot"
                  >
                    {currentIndividualData.pensions.map((row: any) => (
                      <RowItem key={row.id} onDelete={() => removeIndividualRow("pensions", row.id)}>
                        <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                          <input
                            type="text"
                            placeholder="Pension Provider Name"
                            disabled={!isCmEditing}
                            value={row.provider}
                            onChange={(e) => updateIndividualRow("pensions", row.id, { provider: e.target.value })}
                            className={inputClasses}
                          />
                          <ValueWithUnsure
                            id={`pen_val_${row.id}`}
                            value={row.value}
                            unknown={row.valueUnknown}
                            onValueChange={(v) => updateIndividualRow("pensions", row.id, { value: v })}
                            onUnknownChange={(v) => updateIndividualRow("pensions", row.id, { valueUnknown: v })}
                            placeholder="Current CETV Valuation (£)"
                          />
                        </div>
                        <TreatmentSelect
                          id={row.id}
                          fields={row}
                          onChange={(f) => updateIndividualRow("pensions", row.id, f)}
                        />
                      </RowItem>
                    ))}
                  </MatrixBox>
                )}

                {/* BUSINESS INTERESTS */}
                <PartHeader tooltip="Declare entity infrastructure details if you are a director, shareholder, partner, or sole trader.">
                  Business Interests
                </PartHeader>
                <div className="mb-4">
                  <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                    Are you a director, shareholder, partner, or sole trader in any active or dormant business enterprises?
                  </label>
                  <YesNoToggle
                    name="has_businesses"
                    value={currentIndividualData.hasBusinesses}
                    onChange={(v) => handleIndividualChange("hasBusinesses", v)}
                  />
                </div>
                {currentIndividualData.hasBusinesses === "Yes" && (
                  <MatrixBox
                    title="Business Interests"
                    onAdd={() => addIndividualRow("businesses", makeBusinessRow)}
                    addLabel="Add Corporate Entity"
                  >
                    {currentIndividualData.businesses.map((row: any) => (
                      <RowItem key={row.id} onDelete={() => removeIndividualRow("businesses", row.id)}>
                        <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-[2fr_1fr]">
                          <input
                            type="text"
                            placeholder="Registered Business Name"
                            disabled={!isCmEditing}
                            value={row.name}
                            onChange={(e) => updateIndividualRow("businesses", row.id, { name: e.target.value })}
                            className={inputClasses}
                          />
                          <select
                            value={row.entityType}
                            disabled={!isCmEditing}
                            onChange={(e) => updateIndividualRow("businesses", row.id, { entityType: e.target.value })}
                            className={inputClasses}
                          >
                            <option value="">Entity Structure</option>
                            <option value="Ltd">Limited Company (Ltd)</option>
                            <option value="LLP">LLP</option>
                            <option value="Sole">Sole Trader</option>
                          </select>
                        </div>
                        <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                          <input
                            type="number"
                            placeholder="Turnover (£) (Optional)"
                            disabled={!isCmEditing}
                            value={row.turnover}
                            onChange={(e) => updateIndividualRow("businesses", row.id, { turnover: e.target.value })}
                            className={inputClasses}
                          />
                          <input
                            type="number"
                            placeholder="Net Profit (£) (Optional)"
                            disabled={!isCmEditing}
                            value={row.netProfit}
                            onChange={(e) => updateIndividualRow("businesses", row.id, { netProfit: e.target.value })}
                            className={inputClasses}
                          />
                          <input
                            type="number"
                            min={0}
                            max={100}
                            placeholder="Your Ownership %"
                            disabled={!isCmEditing}
                            value={row.ownershipPercent}
                            onChange={(e) => updateIndividualRow("businesses", row.id, { ownershipPercent: e.target.value })}
                            className={inputClasses}
                          />
                        </div>
                        <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                          <ValueWithUnsure
                            id={`val_${row.id}`}
                            value={row.valueOfStake}
                            unknown={row.valueUnknown}
                            onValueChange={(v) => updateIndividualRow("businesses", row.id, { valueOfStake: v })}
                            onUnknownChange={(v) => updateIndividualRow("businesses", row.id, { valueUnknown: v })}
                            placeholder="Value of Stake (£)"
                          />
                          <input
                            type="text"
                            placeholder="Valuation Justification (e.g. Book Value)"
                            disabled={!isCmEditing}
                            value={row.justification}
                            onChange={(e) => updateIndividualRow("businesses", row.id, { justification: e.target.value })}
                            className={inputClasses}
                          />
                        </div>
                        <TreatmentSelect
                          id={row.id}
                          fields={row}
                          onChange={(f) => updateIndividualRow("businesses", row.id, f)}
                        />
                      </RowItem>
                    ))}
                  </MatrixBox>
                )}

                {/* INTELLECTUAL PROPERTY */}
                <PartHeader tooltip="Declare any valuable intellectual property that you personally own, such as patents, trademarks, copyrights or licensing rights.">
                  Intellectual Property
                </PartHeader>
                <div className="mb-4">
                  <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                    Do you personally own any intellectual property or licensing rights that have financial value?
                  </label>
                  <YesNoToggle
                    name="has_ip"
                    value={currentIndividualData.hasIP || "No"}
                    onChange={(v) => handleIndividualChange("hasIP", v)}
                  />
                </div>
                {currentIndividualData.hasIP === "Yes" && (
                  <MatrixBox
                    title="Intellectual Property Register"
                    onAdd={() => addIndividualRow("ipAssets", makeIPRow)}
                    addLabel="Add Intellectual Property Asset"
                  >
                    {currentIndividualData.ipAssets?.map((row: any) => (
                      <RowItem key={row.id} onDelete={() => removeIndividualRow("ipAssets", row.id)}>
                        <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-[1.5fr_1fr]">
                          <input
                            type="text"
                            placeholder="Intellectual Property Name"
                            disabled={!isCmEditing}
                            value={row.name}
                            onChange={(e) => updateIndividualRow("ipAssets", row.id, { name: e.target.value })}
                            className={inputClasses}
                          />
                          <select
                            value={row.ipType}
                            disabled={!isCmEditing}
                            onChange={(e) => updateIndividualRow("ipAssets", row.id, { ipType: e.target.value })}
                            className={inputClasses}
                          >
                            <option value="">IP Type</option>
                            <option value="Patent">Patent</option>
                            <option value="Website">Website / Online Platform</option>
                            <option value="Trademark">Trademark</option>
                            <option value="Copyright">Copyright</option>
                            <option value="Software">Software / Source Code</option>
                            <option value="Domain">Domain Name</option>
                            <option value="Licence">Licence / Royalty Rights</option>
                            <option value="Design">Registered Design</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                          <ValueWithUnsure
                            id={`val_${row.id}`}
                            value={row.value}
                            unknown={row.valueUnknown}
                            onValueChange={(v) => updateIndividualRow("ipAssets", row.id, { value: v })}
                            onUnknownChange={(v) => updateIndividualRow("ipAssets", row.id, { valueUnknown: v })}
                            placeholder="Estimated Value (£)"
                          />
                          <input
                            type="text"
                            placeholder="Registration / Reference Number (Optional)"
                            disabled={!isCmEditing}
                            value={row.registrationNumber}
                            onChange={(e) => updateIndividualRow("ipAssets", row.id, { registrationNumber: e.target.value })}
                            className={inputClasses}
                          />
                        </div>
                        <textarea
                          placeholder="Brief description (optional)"
                          disabled={!isCmEditing}
                          value={row.description}
                          onChange={(e) => updateIndividualRow("ipAssets", row.id, { description: e.target.value })}
                          className={textareaClasses + " mb-3.5"}
                        />
                        <TreatmentSelect
                          id={row.id}
                          fields={row}
                          onChange={(f) => updateIndividualRow("ipAssets", row.id, f)}
                          label="How should this be treated?"
                        />
                      </RowItem>
                    ))}
                  </MatrixBox>
                )}

                {/* HIGH-VALUE PERSONAL BELONGINGS */}
                <PartHeader tooltip="Personal property items valued individually over £5,000.">
                  High-Value Personal Belongings (Chattels)
                </PartHeader>
                <div className="mb-4">
                  <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                    Do you possess any personal belongings valued individually over £5,000 (such as vehicles, jewelry, artwork, or cryptocurrency assets)?
                  </label>
                  <YesNoToggle
                    name="has_chattels"
                    value={currentIndividualData.hasChattels || "No"}
                    onChange={(v) => handleIndividualChange("hasChattels", v)}
                  />
                </div>
                {currentIndividualData.hasChattels === "Yes" && (
                  <MatrixBox
                    title="High-Value Items &amp; Chattels Registry"
                    onAdd={() => addIndividualRow("chattels", makeChattelRow)}
                    addLabel="Add Asset Entry"
                  >
                    {currentIndividualData.chattels?.map((row: any) => (
                      <RowItem key={row.id} onDelete={() => removeIndividualRow("chattels", row.id)}>
                        <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-[2fr_1.5fr_1fr]">
                          <input
                            type="text"
                            placeholder="Asset Description / Name"
                            disabled={!isCmEditing}
                            value={row.description}
                            onChange={(e) => updateIndividualRow("chattels", row.id, { description: e.target.value })}
                            className={inputClasses}
                          />
                          <select
                            value={row.category}
                            disabled={!isCmEditing}
                            onChange={(e) => updateIndividualRow("chattels", row.id, { category: e.target.value })}
                            className={inputClasses}
                          >
                            <option value="">Asset Category</option>
                            <option value="Vehicles">Motor Vehicles (Cars, Motorcycles, Boats)</option>
                            <option value="Luxury">Luxury Items (Jewelry, Watches, Designer Goods)</option>
                            <option value="Art">Fine Art, Antiques &amp; Collectibles</option>
                            <option value="Digital">Digital Assets (Cryptocurrency, NFTs)</option>
                            <option value="Other">Other High-Value Physical Property</option>
                          </select>
                          <ValueWithUnsure
                            id={`val_${row.id}`}
                            value={row.value}
                            unknown={row.valueUnknown}
                            onValueChange={(v) => updateIndividualRow("chattels", row.id, { value: v })}
                            onUnknownChange={(v) => updateIndividualRow("chattels", row.id, { valueUnknown: v })}
                            placeholder="Value (GBP)"
                          />
                        </div>
                        <TreatmentSelect
                          id={row.id}
                          fields={row}
                          onChange={(f) => updateIndividualRow("chattels", row.id, f)}
                        />
                      </RowItem>
                    ))}
                  </MatrixBox>
                )}

                {/* OTHER PERSONAL ASSETS */}
                <PartHeader tooltip="Declare any other assets, inheritances, trust interests, or financial rights not covered above.">
                  Other Personal Assets
                </PartHeader>
                <div className="mb-4">
                  <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                    Have we missed anything? Do you own or expect to receive any other assets, financial interests, inheritances, or property that have not been listed above?
                  </label>
                  <YesNoToggle
                    name="has_other_assets"
                    value={currentIndividualData.hasOtherAssets || "No"}
                    onChange={(v) => handleIndividualChange("hasOtherAssets", v)}
                  />
                </div>
                {currentIndividualData.hasOtherAssets === "Yes" && (
                  <MatrixBox
                    title="Other Assets Registry"
                    onAdd={() => addIndividualRow("otherAssets", makeOtherAssetRow)}
                    addLabel="Add Other Asset"
                  >
                    {currentIndividualData.otherAssets?.map((row: any) => (
                      <RowItem key={row.id} onDelete={() => removeIndividualRow("otherAssets", row.id)}>
                        <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-[2fr_1fr]">
                          <input
                            type="text"
                            placeholder="Asset Name / Description (e.g. Trust Interest, Offshore Account, Safe Deposit Box)"
                            disabled={!isCmEditing}
                            value={row.description}
                            onChange={(e) => updateIndividualRow("otherAssets", row.id, { description: e.target.value })}
                            className={inputClasses}
                          />
                          <ValueWithUnsure
                            id={`val_${row.id}`}
                            value={row.value}
                            unknown={row.valueUnknown}
                            onValueChange={(v) => updateIndividualRow("otherAssets", row.id, { value: v })}
                            onUnknownChange={(v) => updateIndividualRow("otherAssets", row.id, { valueUnknown: v })}
                            placeholder="Estimated Value (GBP)"
                          />
                        </div>
                        <TreatmentSelect
                          id={row.id}
                          fields={row}
                          onChange={(f) => updateIndividualRow("otherAssets", row.id, f)}
                          label="How should this be treated?"
                        />
                      </RowItem>
                    ))}
                  </MatrixBox>
                )}
              </div>
            )}

            {/* 5. INCOME & REVENUE */}
            {individualSection === "income" && (
              <div>
                <h2 className="mb-2 text-[1.2rem] font-bold tracking-tight text-slate-900">
                  Your Income &amp; Revenue
                </h2>
                <p className="mb-6 text-[0.9rem] leading-relaxed text-slate-500">
                  Please tell us about all income you personally receive. This includes employment income, bonuses, investments, rental income and any other regular income sources.
                </p>

                {/* EMPLOYMENT INCOME */}
                <PartHeader tooltip="Include your annual salary or wages before tax.">
                  Employment Income
                </PartHeader>
                <div className="mb-6">
                  <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                    What is your current annual gross employment income (before tax)?
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="£ Amount in GBP"
                    disabled={!isCmEditing}
                    value={currentIndividualData.grossAnnualIncome}
                    onChange={(e) => handleIndividualChange("grossAnnualIncome", e.target.value)}
                    className={inputClasses}
                  />
                </div>

                <div className="mb-6">
                  <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                    How would you like your employment income to be treated under this agreement?
                  </label>
                  <TreatmentSelect
                    id="salary"
                    fields={currentIndividualData.salaryTreatment}
                    onChange={(f) => handleIndividualChange("salaryTreatment", f)}
                    options={[
                      { value: "KeepSeparate", label: "Keep it Separate" },
                      { value: "ShareEqually", label: "Share Equally (50/50)" },
                      { value: "Percentage", label: "Share by Percentage" },
                      { value: "Custom", label: "Custom Arrangement" },
                    ]}
                  />
                </div>

                {/* BONUSES & INCENTIVES */}
                <PartHeader tooltip="Declare variable performance items like bonuses, overtime or share awards.">
                  Bonuses &amp; Employment Incentives
                </PartHeader>
                <div className="mb-4">
                  <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                    Apart from your base salary, do you regularly receive bonuses, commissions, share options, share awards (RSUs), profit-sharing payments, or other employment incentives?
                  </label>
                  <YesNoToggle
                    name="has_primary_bonus"
                    value={currentIndividualData.hasPrimaryBonus}
                    onChange={(v) => handleIndividualChange("hasPrimaryBonus", v)}
                  />
                </div>
                {currentIndividualData.hasPrimaryBonus === "Yes" && (
                  <MatrixBox
                    title="Bonus &amp; Incentive Income"
                    onAdd={() => addIndividualRow("primaryIncomeRows", () => ({ id: makeId("bon"), description: "", amount: "", ...emptyTreatment }))}
                    addLabel="Add Variable Revenue Stream"
                  >
                    {currentIndividualData.primaryIncomeRows.map((row: any) => (
                      <RowItem key={row.id} onDelete={() => removeIndividualRow("primaryIncomeRows", row.id)}>
                        <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                          <input
                            type="text"
                            placeholder="Description (e.g. Annual Bonus)"
                            disabled={!isCmEditing}
                            value={row.description}
                            onChange={(e) => updateIndividualRow("primaryIncomeRows", row.id, { description: e.target.value })}
                            className={inputClasses}
                          />
                          <input
                            type="number"
                            placeholder="Estimated Annual Amount (£)"
                            disabled={!isCmEditing}
                            value={row.amount}
                            onChange={(e) => updateIndividualRow("primaryIncomeRows", row.id, { amount: e.target.value })}
                            className={inputClasses}
                          />
                        </div>
                        <TreatmentSelect
                          id={row.id}
                          fields={row}
                          onChange={(f) => updateIndividualRow("primaryIncomeRows", row.id, f)}
                        />
                      </RowItem>
                    ))}
                  </MatrixBox>
                )}

                {/* ALTERNATIVE INCOME STREAMS */}
                <PartHeader tooltip="List recurring revenue paid to you individually from investments, trust dividends, or property yields.">
                  Alternative Income Streams
                </PartHeader>
                <div className="mb-4">
                  <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                    Do you personally receive income from sources other than your employment, such as rental property income, dividend payments, trust distributions, business income, royalties, maintenance payments (spousal or child), pension income, or other investment income?
                  </label>
                  <YesNoToggle
                    name="has_alternative_income"
                    value={currentIndividualData.hasAlternativeIncome || "No"}
                    onChange={(v) => handleIndividualChange("hasAlternativeIncome", v)}
                  />
                </div>
                {currentIndividualData.hasAlternativeIncome === "Yes" && (
                  <MatrixBox
                    title="Alternative Income Sources"
                    onAdd={() => addIndividualRow("altIncomeRows", makeAltIncomeRow)}
                    addLabel="Add Income Source"
                  >
                    {currentIndividualData.altIncomeRows?.map((row: any) => (
                      <RowItem key={row.id} onDelete={() => removeIndividualRow("altIncomeRows", row.id)}>
                        <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                          <input
                            type="text"
                            placeholder="Source Name (e.g. Dividend, Rental Yield)"
                            disabled={!isCmEditing}
                            value={row.description}
                            onChange={(e) => updateIndividualRow("altIncomeRows", row.id, { description: e.target.value })}
                            className={inputClasses}
                          />
                          <input
                            type="number"
                            placeholder="Annual Income (£)"
                            disabled={!isCmEditing}
                            value={row.amount}
                            onChange={(e) => updateIndividualRow("altIncomeRows", row.id, { amount: e.target.value })}
                            className={inputClasses}
                          />
                        </div>
                        <TreatmentSelect
                          id={row.id}
                          fields={row}
                          onChange={(f) => updateIndividualRow("altIncomeRows", row.id, f)}
                        />
                      </RowItem>
                    ))}
                  </MatrixBox>
                )}
              </div>
            )}

            {/* 6. LIABILITIES & DEBTS */}
            {individualSection === "liabilities" && (
              <div>
                <h2 className="mb-2 text-[1.2rem] font-bold tracking-tight text-slate-900">
                  Your Personal Liabilities
                </h2>
                <p className="mb-6 text-[0.9rem] leading-relaxed text-slate-500">
                  Please tell us about any debts or financial obligations that you are personally responsible for. Include any debts that are jointly signed with another person but remain your responsibility.
                </p>

                {/* PERSONAL DEBTS & LOANS */}
                <PartHeader tooltip="List individual loans, outstanding credit cards, or lines of credit held solely in your name.">
                  Personal Debts &amp; Loans
                </PartHeader>
                <div className="mb-4">
                  <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                    Do you currently have any personal debts or financial obligations, such as loans, credit cards, overdrafts or other money that you owe?
                  </label>
                  <YesNoToggle
                    name="has_debts"
                    value={currentIndividualData.hasDebts}
                    onChange={(v) => handleIndividualChange("hasDebts", v)}
                  />
                </div>
                {currentIndividualData.hasDebts === "Yes" && (
                  <MatrixBox
                    title="Your Debts &amp; Financial Obligations"
                    onAdd={() => addIndividualRow("debts", makeDebtRow)}
                    addLabel="Add Debt"
                  >
                    {currentIndividualData.debts.map((row: any) => (
                      <RowItem key={row.id} onDelete={() => removeIndividualRow("debts", row.id)}>
                        <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-[1.5fr_1fr_1fr]">
                          <input
                            type="text"
                            placeholder="Lender / Creditor Name"
                            disabled={!isCmEditing}
                            value={row.lenderName}
                            onChange={(e) => updateIndividualRow("debts", row.id, { lenderName: e.target.value })}
                            className={inputClasses}
                          />
                          <select
                            value={row.debtType}
                            disabled={!isCmEditing}
                            onChange={(e) => updateIndividualRow("debts", row.id, { debtType: e.target.value })}
                            className={inputClasses}
                          >
                            <option value="">Type of Debt</option>
                            <option value="Credit Card">Credit Card Balance</option>
                            <option value="Personal Loan">Personal Loan</option>
                            <option value="Student Loan">Student Loan</option>
                            <option value="Overdraft">Overdraft</option>
                            <option value="Car Finance">Car Finance / Vehicle Loan</option>
                            <option value="Tax Liability">Tax Liability</option>
                            <option value="Other">Other Liability</option>
                          </select>
                          <input
                            type="number"
                            placeholder="Outstanding Balance (£)"
                            disabled={!isCmEditing}
                            value={row.outstandingBalance}
                            onChange={(e) => updateIndividualRow("debts", row.id, { outstandingBalance: e.target.value })}
                            className={inputClasses}
                          />
                        </div>
                        <TreatmentSelect
                          id={row.id}
                          fields={row}
                          onChange={(f) => updateIndividualRow("debts", row.id, f)}
                          label="How should this be Settled?"
                        />
                      </RowItem>
                    ))}
                  </MatrixBox>
                )}

                {/* MAINTENANCE & SUPPORT PAYMENTS */}
                <PartHeader tooltip="This includes payments required by a court order, the Child Maintenance Service (CMS), or a legally binding agreement.">
                  Maintenance &amp; Support Payments
                </PartHeader>

                <div className="mb-6 rounded-r-[10px] border-l-4 border-indigo-600 bg-indigo-50 p-4 text-[0.9rem] font-medium text-indigo-800">
                  Please include any ongoing child maintenance or spousal maintenance payments. These commitments reduce
                  your available income and should be considered when preparing a fair and accurate prenuptial agreement.
                </div>

                <div className="mb-4">
                  <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                    Are you currently required to make regular child maintenance or spousal maintenance payments?
                  </label>
                  <YesNoToggle
                    name="has_maintenance"
                    value={currentIndividualData.hasMaintenance || "No"}
                    onChange={(v) => handleIndividualChange("hasMaintenance", v)}
                  />
                </div>
                {currentIndividualData.hasMaintenance === "Yes" && (
                  <MatrixBox
                    title="Maintenance &amp; Support Payments"
                    onAdd={() => addIndividualRow("maintenance", makeMaintenanceRow)}
                    addLabel="Add Maintenance Payment"
                  >
                    {currentIndividualData.maintenance?.map((row: any) => (
                      <RowItem key={row.id} onDelete={() => removeIndividualRow("maintenance", row.id)}>
                        <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-[1.5fr_1fr_1fr]">
                          <select
                            value={row.dependentLink}
                            disabled={!isCmEditing}
                            onChange={(e) => updateIndividualRow("maintenance", row.id, { dependentLink: e.target.value })}
                            className={inputClasses}
                          >
                            <option value="">Link to Dependent</option>
                            <option value="Child Support">Child Support Commitment</option>
                            <option value="Spousal Maintenance">Former Spouse Maintenance</option>
                            <option value="Other Dependent">Other Dependent Liability</option>
                          </select>
                          <input
                            type="number"
                            placeholder="Monthly Payment (£)"
                            disabled={!isCmEditing}
                            value={row.monthlyPayment}
                            onChange={(e) => updateIndividualRow("maintenance", row.id, { monthlyPayment: e.target.value })}
                            className={inputClasses}
                          />
                          <input
                            type="text"
                            placeholder="Projected End Date (e.g., Age 18)"
                            disabled={!isCmEditing}
                            value={row.projectedEndDate}
                            onChange={(e) => updateIndividualRow("maintenance", row.id, { projectedEndDate: e.target.value })}
                            className={inputClasses}
                          />
                        </div>
                        <TreatmentSelect
                          id={row.id}
                          fields={row}
                          onChange={(f) => updateIndividualRow("maintenance", row.id, f)}
                          label="How should this be Settled?"
                        />
                      </RowItem>
                    ))}
                  </MatrixBox>
                )}
              </div>
            )}
          </>
        )}

        {/* ========================================================================= */}
        {/* JOINT QUESTIONNAIRE (CARD 3 - COMPLETE SHAHMIR JOINT FORMS) */}
        {/* ========================================================================= */}
        {activeParty === "joint" && (
          <>
            {/* 1. JOINT ASSETS (SHARED ASSETS) */}
            {jointSection === "joint-assets" && (
              <div>
                <h2 className="mb-2 text-[1.2rem] font-bold tracking-tight text-slate-900">
                  Shared Assets
                </h2>
                <p className="mb-6 text-[0.9rem] leading-relaxed text-slate-500">
                  Please tell us about any assets, property, or financial interests that you and your partner currently own or hold together, and how you would like them to be treated under your prenuptial agreement.
                </p>

                {/* CURRENT LIVING ARRANGEMENTS */}
                <PartHeader tooltip="Tell us about your current living arrangements. This helps us understand your current circumstances. Property ownership and how it should be treated under your agreement will be collected separately.">
                  Current Living Arrangements
                </PartHeader>
                <div className="mb-4">
                  <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                    Which of the following best describes your current living arrangements?
                  </label>
                  <div className="mb-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {livingArrangementOptions.map((opt) => {
                      const checked = (jointData.livingArrangement || "Joint") === opt.value;
                      return (
                        <label
                          key={opt.value}
                          className={`relative flex cursor-pointer items-center gap-3 rounded-[10px] border px-4 py-3 transition ${
                            checked
                              ? "border-indigo-600 bg-slate-50"
                              : "border-slate-300 bg-slate-50 hover:border-indigo-600 hover:bg-white"
                          }`}
                        >
                          <input
                            type="radio"
                            name="living_arrangement"
                            value={opt.value}
                            checked={checked}
                            disabled={!isCmEditing}
                            onChange={() => handleJointChange("livingArrangement", opt.value)}
                            className="sr-only"
                          />
                          <span
                            className={`relative h-4 w-4 flex-shrink-0 rounded-full border-2 ${
                              checked ? "border-indigo-600 bg-indigo-600" : "border-slate-300 bg-white"
                            }`}
                          >
                            {checked && (
                              <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
                            )}
                          </span>
                          <span
                            className={`text-[0.9rem] font-semibold ${
                              checked ? "text-indigo-600" : "text-slate-900"
                            }`}
                          >
                            {opt.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  {(jointData.livingArrangement || "Joint") === "Separate" && (
                    <div className="mt-3 rounded-[10px] border border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                      💡 You currently live separately. Any future property arrangements can be outlined in your shared asset registers below.
                    </div>
                  )}
                  {jointData.livingArrangement === "Rent" && (
                    <div className="mt-3 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                      <input
                        type="text"
                        placeholder="How long have you lived here together?"
                        disabled={!isCmEditing}
                        value={jointData.rentDuration || ""}
                        onChange={(e) => handleJointChange("rentDuration", e.target.value)}
                        className={inputClasses}
                      />
                      <input
                        type="number"
                        min={0}
                        placeholder="Monthly Rent (£)"
                        disabled={!isCmEditing}
                        value={jointData.monthlyRent || ""}
                        onChange={(e) => handleJointChange("monthlyRent", e.target.value)}
                        className={inputClasses}
                      />
                    </div>
                  )}
                  {jointData.livingArrangement === "OneOwner" && (
                    <div className="mt-3 rounded-[10px] border border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                      💡 You live in a home owned by one of you. Individual asset parameters are configuration details tracked separately inside Section 3.
                    </div>
                  )}
                  {(jointData.livingArrangement || "Joint") === "Joint" && (
                    <div className="mt-3 rounded-[10px] border border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                      💡 You live in a jointly owned home. Please ensure you document this asset details in the register below.
                    </div>
                  )}
                  {jointData.livingArrangement === "ThirdParty" && (
                    <textarea
                      placeholder="Please briefly describe your current third-party living arrangements (e.g., living with parents, employer-provided accommodation)..."
                      disabled={!isCmEditing}
                      value={jointData.thirdPartyDescription || ""}
                      onChange={(e) => handleJointChange("thirdPartyDescription", e.target.value)}
                      className={textareaClasses + " mt-3"}
                    />
                  )}
                  {jointData.livingArrangement === "Other" && (
                    <textarea
                      placeholder="Please describe your current living arrangements..."
                      disabled={!isCmEditing}
                      value={jointData.otherDescription || ""}
                      onChange={(e) => handleJointChange("otherDescription", e.target.value)}
                      className={textareaClasses + " mt-3"}
                    />
                  )}
                </div>

                {/* SHARED PROPERTY & REAL ESTATE */}
                <PartHeader tooltip="Declare any property or real estate that you and your partner jointly own or have a shared financial interest in.">
                  Shared Property &amp; Real Estate
                </PartHeader>
                <div className="mb-4">
                  <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                    Do you and your partner jointly own, partly own, or have a shared financial interest in any real estate or property?
                  </label>
                  <YesNoToggle
                    name="has_shared_real_estate"
                    value={jointData.hasSharedRealEstate || "Yes"}
                    onChange={(v) => handleJointChange("hasSharedRealEstate", v)}
                  />
                </div>
                {(jointData.hasSharedRealEstate || "Yes") === "Yes" && (
                  <MatrixBox
                    title="Shared Property Register"
                    onAdd={() => addJointRow("sharedRealEstate", makeSharedRealEstateRow)}
                    addLabel="Add Shared Property"
                  >
                    {jointData.sharedRealEstate?.map((row: any) => (
                      <RowItem key={row.id} onDelete={() => removeJointRow("sharedRealEstate", row.id)}>
                        <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                          <input
                            type="text"
                            placeholder="Address Line 1"
                            disabled={!isCmEditing}
                            value={row.addressLine1}
                            onChange={(e) => updateJointRow("sharedRealEstate", row.id, { addressLine1: e.target.value })}
                            className={inputClasses}
                          />
                          <input
                            type="text"
                            placeholder="Address Line 2 (Optional)"
                            disabled={!isCmEditing}
                            value={row.addressLine2}
                            onChange={(e) => updateJointRow("sharedRealEstate", row.id, { addressLine2: e.target.value })}
                            className={inputClasses}
                          />
                        </div>
                        <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                          <input
                            type="text"
                            placeholder="Postcode"
                            disabled={!isCmEditing}
                            value={row.postcode}
                            onChange={(e) => updateJointRow("sharedRealEstate", row.id, { postcode: e.target.value })}
                            className={inputClasses}
                          />
                          <select
                            value={row.propertyType}
                            disabled={!isCmEditing}
                            onChange={(e) => updateJointRow("sharedRealEstate", row.id, { propertyType: e.target.value })}
                            className={inputClasses}
                          >
                            <option value="">Property Type</option>
                            <option value="Residential">Residential Home</option>
                            <option value="BuyToLet">Buy-to-Let / Investment Property</option>
                            <option value="Commercial">Commercial Property</option>
                            <option value="Land">Land / Agricultural</option>
                            <option value="Holiday">Holiday Home / Second Home</option>
                            <option value="Other">Other</option>
                          </select>
                          <ValueWithUnsure
                            id={`val_${row.id}`}
                            value={row.value}
                            unknown={row.valueUnknown}
                            onValueChange={(v) => updateJointRow("sharedRealEstate", row.id, { value: v })}
                            onUnknownChange={(v) => updateJointRow("sharedRealEstate", row.id, { valueUnknown: v })}
                            placeholder="Estimated Value (£)"
                          />
                        </div>
                        <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                          <input
                            type="number"
                            placeholder="Mortgage Balance (£)"
                            disabled={!isCmEditing}
                            value={row.mortgageBalance}
                            onChange={(e) => updateJointRow("sharedRealEstate", row.id, { mortgageBalance: e.target.value })}
                            className={inputClasses}
                          />
                          <input
                            type="text"
                            placeholder="Ownership Share % (e.g. 50%)"
                            disabled={!isCmEditing}
                            value={row.ownershipPercentage}
                            onChange={(e) => updateJointRow("sharedRealEstate", row.id, { ownershipPercentage: e.target.value })}
                            className={inputClasses}
                          />
                        </div>
                        <TreatmentSelect
                          id={row.id}
                          fields={row}
                          onChange={(f) => updateJointRow("sharedRealEstate", row.id, f)}
                          options={sharedTreatmentOptions}
                        />
                      </RowItem>
                    ))}
                  </MatrixBox>
                )}

                {/* SHARED SAVINGS & INVESTMENTS */}
                <PartHeader tooltip="Declare any bank accounts, savings, investments or other financial accounts that you own jointly with your partner.">
                  Shared Savings &amp; Investments
                </PartHeader>
                <div className="mb-4">
                  <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                    Do you jointly hold any bank accounts, savings, investments or other financial accounts together?
                  </label>
                  <YesNoToggle
                    name="has_shared_savings"
                    value={jointData.hasSharedSavings || "No"}
                    onChange={(v) => handleJointChange("hasSharedSavings", v)}
                  />
                </div>
                {jointData.hasSharedSavings === "Yes" && (
                  <MatrixBox
                    title="Shared Savings &amp; Investments"
                    onAdd={() => addJointRow("sharedSavings", makeSharedSavingsRow)}
                    addLabel="Add Savings / Investments"
                  >
                    {jointData.sharedSavings?.map((row: any) => (
                      <RowItem key={row.id} onDelete={() => removeJointRow("sharedSavings", row.id)}>
                        <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-[1fr_1.5fr]">
                          <select
                            value={row.accountHolder || "Joint"}
                            disabled={!isCmEditing}
                            onChange={(e) => updateJointRow("sharedSavings", row.id, { accountHolder: e.target.value })}
                            className={inputClasses}
                          >
                            <option value="">Account Holder</option>
                            <option value="Partner1">Partner 1</option>
                            <option value="Partner2">Partner 2</option>
                            <option value="Joint">Joint</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Institution / Bank Name"
                            disabled={!isCmEditing}
                            value={row.institution}
                            onChange={(e) => updateJointRow("sharedSavings", row.id, { institution: e.target.value })}
                            className={inputClasses}
                          />
                        </div>
                        <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-[1.5fr_1fr]">
                          <select
                            value={row.accountType}
                            disabled={!isCmEditing}
                            onChange={(e) => updateJointRow("sharedSavings", row.id, { accountType: e.target.value })}
                            className={inputClasses}
                          >
                            <option value="">Account Type</option>
                            <option value="Current">Current Account</option>
                            <option value="Savings">Savings Account</option>
                            <option value="ISA">ISA</option>
                            <option value="Investment">Investment Portfolio</option>
                            <option value="Other">Other</option>
                          </select>
                          <input
                            type="number"
                            placeholder="Valuation Balance (GBP)"
                            disabled={!isCmEditing}
                            value={row.balance}
                            onChange={(e) => updateJointRow("sharedSavings", row.id, { balance: e.target.value })}
                            className={inputClasses}
                          />
                        </div>
                        <TreatmentSelect
                          id={row.id}
                          fields={row}
                          onChange={(f) => updateJointRow("sharedSavings", row.id, f)}
                          options={sharedTreatmentOptions}
                        />
                      </RowItem>
                    ))}
                  </MatrixBox>
                )}

                {/* SHARED BUSINESS INTERESTS */}
                <PartHeader tooltip="Declare any businesses, companies or partnerships that you and your partner jointly own or operate.">
                  Shared Business Interests
                </PartHeader>
                <div className="mb-4">
                  <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                    Do you jointly own or operate a business together?
                  </label>
                  <YesNoToggle
                    name="has_shared_businesses"
                    value={jointData.hasSharedBusinesses || "No"}
                    onChange={(v) => handleJointChange("hasSharedBusinesses", v)}
                  />
                </div>
                {jointData.hasSharedBusinesses === "Yes" && (
                  <MatrixBox
                    title="Shared Business Interests"
                    onAdd={() => addJointRow("sharedBusinesses", makeSharedBusinessRow)}
                    addLabel="Add Business"
                  >
                    {jointData.sharedBusinesses?.map((row: any) => (
                      <RowItem key={row.id} onDelete={() => removeJointRow("sharedBusinesses", row.id)}>
                        <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-[2fr_1fr]">
                          <input
                            type="text"
                            placeholder="Registered Business Name"
                            disabled={!isCmEditing}
                            value={row.name}
                            onChange={(e) => updateJointRow("sharedBusinesses", row.id, { name: e.target.value })}
                            className={inputClasses}
                          />
                          <select
                            value={row.entityType}
                            disabled={!isCmEditing}
                            onChange={(e) => updateJointRow("sharedBusinesses", row.id, { entityType: e.target.value })}
                            className={inputClasses}
                          >
                            <option value="">Entity Structure</option>
                            <option value="Ltd">Limited Company (Ltd)</option>
                            <option value="LLP">LLP</option>
                            <option value="Sole">Sole Trader</option>
                            <option value="Partnership">Partnership</option>
                          </select>
                        </div>
                        <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                          <input
                            type="number"
                            placeholder="Last Year Turnover (£)"
                            disabled={!isCmEditing}
                            value={row.turnover}
                            onChange={(e) => updateJointRow("sharedBusinesses", row.id, { turnover: e.target.value })}
                            className={inputClasses}
                          />
                          <input
                            type="number"
                            placeholder="Last Year Net Profit (£)"
                            disabled={!isCmEditing}
                            value={row.netProfit}
                            onChange={(e) => updateJointRow("sharedBusinesses", row.id, { netProfit: e.target.value })}
                            className={inputClasses}
                          />
                          <input
                            type="number"
                            min={0}
                            max={100}
                            placeholder="Your Ownership %"
                            disabled={!isCmEditing}
                            value={row.ownershipPercent}
                            onChange={(e) => updateJointRow("sharedBusinesses", row.id, { ownershipPercent: e.target.value })}
                            className={inputClasses}
                          />
                        </div>
                        <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                          <ValueWithUnsure
                            id={`val_${row.id}`}
                            value={row.valueOfStake}
                            unknown={row.valueUnknown}
                            onValueChange={(v) => updateJointRow("sharedBusinesses", row.id, { valueOfStake: v })}
                            onUnknownChange={(v) => updateJointRow("sharedBusinesses", row.id, { valueUnknown: v })}
                            placeholder="Value of Joint Stake (£)"
                          />
                          <input
                            type="text"
                            placeholder={row.valueUnknown ? "Not required (Value unknown)" : "Valuation Justification"}
                            value={row.valueUnknown ? "" : row.justification}
                            disabled={!isCmEditing || row.valueUnknown}
                            onChange={(e) => updateJointRow("sharedBusinesses", row.id, { justification: e.target.value })}
                            className={inputClasses}
                          />
                        </div>
                        <div className="mb-3.5">
                          <input
                            type="number"
                            placeholder="Director Loan A/C Balance (£)"
                            disabled={!isCmEditing}
                            value={row.directorLoanBalance}
                            onChange={(e) => updateJointRow("sharedBusinesses", row.id, { directorLoanBalance: e.target.value })}
                            className={inputClasses}
                          />
                        </div>
                        <TreatmentSelect
                          id={row.id}
                          fields={row}
                          onChange={(f) => updateJointRow("sharedBusinesses", row.id, f)}
                          options={sharedTreatmentOptions}
                        />
                      </RowItem>
                    ))}
                  </MatrixBox>
                )}

                {/* SHARED INTELLECTUAL PROPERTY */}
                <PartHeader tooltip="Declare any intellectual property that you and your partner jointly own, such as patents, trademarks, copyrights, software, websites or licensing rights.">
                  Shared Intellectual Property
                </PartHeader>
                <div className="mb-4">
                  <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                    Do you jointly own any intellectual property or licensing rights with your partner?
                  </label>
                  <YesNoToggle
                    name="has_shared_ip"
                    value={jointData.hasSharedIP || "No"}
                    onChange={(v) => handleJointChange("hasSharedIP", v)}
                  />
                </div>
                {jointData.hasSharedIP === "Yes" && (
                  <MatrixBox
                    title="Shared Intellectual Property Register"
                    onAdd={() => addJointRow("sharedIP", makeSharedIPRow)}
                    addLabel="Add Intellectual Property Asset"
                  >
                    {jointData.sharedIP?.map((row: any) => (
                      <RowItem key={row.id} onDelete={() => removeJointRow("sharedIP", row.id)}>
                        <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-[1.5fr_1fr]">
                          <input
                            type="text"
                            placeholder="Intellectual Property Name"
                            disabled={!isCmEditing}
                            value={row.name}
                            onChange={(e) => updateJointRow("sharedIP", row.id, { name: e.target.value })}
                            className={inputClasses}
                          />
                          <select
                            value={row.ipType}
                            disabled={!isCmEditing}
                            onChange={(e) => updateJointRow("sharedIP", row.id, { ipType: e.target.value })}
                            className={inputClasses}
                          >
                            <option value="">IP Type</option>
                            <option value="Patent">Patent</option>
                            <option value="Website">Website / Online Platform</option>
                            <option value="Trademark">Trademark</option>
                            <option value="Copyright">Copyright</option>
                            <option value="Software">Software / Source Code</option>
                            <option value="Domain">Domain Name</option>
                            <option value="Licence">Licence / Royalty Rights</option>
                            <option value="Design">Registered Design</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                          <ValueWithUnsure
                            id={`val_${row.id}`}
                            value={row.value}
                            unknown={row.valueUnknown}
                            onValueChange={(v) => updateJointRow("sharedIP", row.id, { value: v })}
                            onUnknownChange={(v) => updateJointRow("sharedIP", row.id, { valueUnknown: v })}
                            placeholder="Estimated Valuation (£)"
                          />
                          <input
                            type="text"
                            placeholder="Registration Number (Optional)"
                            disabled={!isCmEditing}
                            value={row.registrationNumber}
                            onChange={(e) => updateJointRow("sharedIP", row.id, { registrationNumber: e.target.value })}
                            className={inputClasses}
                          />
                        </div>
                        <textarea
                          placeholder="Brief description (optional)"
                          disabled={!isCmEditing}
                          value={row.description}
                          onChange={(e) => updateJointRow("sharedIP", row.id, { description: e.target.value })}
                          className={textareaClasses + " mb-3.5"}
                        />
                        <TreatmentSelect
                          id={row.id}
                          fields={row}
                          onChange={(f) => updateJointRow("sharedIP", row.id, f)}
                          options={sharedTreatmentOptions}
                        />
                      </RowItem>
                    ))}
                  </MatrixBox>
                )}

                {/* SHARED HIGH-VALUE PERSONAL BELONGINGS */}
                <PartHeader tooltip="Personal property items valued individually over £5,000.">
                  Shared High-Value Personal Belongings
                </PartHeader>
                <div className="mb-4">
                  <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                    Do you jointly own any high-value personal belongings valued at more than £5,000, such as vehicles, jewellery, artwork or cryptocurrency?
                  </label>
                  <YesNoToggle
                    name="has_shared_chattels"
                    value={jointData.hasSharedChattels || "No"}
                    onChange={(v) => handleJointChange("hasSharedChattels", v)}
                  />
                </div>
                {jointData.hasSharedChattels === "Yes" && (
                  <MatrixBox
                    title="Shared High-Value Belongings / Chattels"
                    onAdd={() => addJointRow("sharedChattels", makeSharedChattelRow)}
                    addLabel="Add Asset Entry"
                  >
                    {jointData.sharedChattels?.map((row: any) => (
                      <RowItem key={row.id} onDelete={() => removeJointRow("sharedChattels", row.id)}>
                        <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-[2fr_1.5fr_1fr]">
                          <input
                            type="text"
                            placeholder="Asset Description / Name"
                            disabled={!isCmEditing}
                            value={row.description}
                            onChange={(e) => updateJointRow("sharedChattels", row.id, { description: e.target.value })}
                            className={inputClasses}
                          />
                          <select
                            value={row.category}
                            disabled={!isCmEditing}
                            onChange={(e) => updateJointRow("sharedChattels", row.id, { category: e.target.value })}
                            className={inputClasses}
                          >
                            <option value="">Asset Category</option>
                            <option value="Vehicles">Motor Vehicles</option>
                            <option value="Luxury">Luxury Items</option>
                            <option value="Art">Fine Art &amp; Collectibles</option>
                            <option value="Digital">Digital Assets</option>
                            <option value="Other">Other Physical Property</option>
                          </select>
                          <ValueWithUnsure
                            id={`val_${row.id}`}
                            value={row.value}
                            unknown={row.valueUnknown}
                            onValueChange={(v) => updateJointRow("sharedChattels", row.id, { value: v })}
                            onUnknownChange={(v) => updateJointRow("sharedChattels", row.id, { valueUnknown: v })}
                            placeholder="Value (GBP)"
                          />
                        </div>
                        <TreatmentSelect
                          id={row.id}
                          fields={row}
                          onChange={(f) => updateJointRow("sharedChattels", row.id, f)}
                          options={sharedTreatmentOptions}
                        />
                      </RowItem>
                    ))}
                  </MatrixBox>
                )}

                {/* OTHER SHARED ASSETS */}
                <PartHeader tooltip="Declare any other joint assets, inheritances, trust interests, or shared financial rights not covered above.">
                  Other Shared Assets
                </PartHeader>
                <div className="mb-4">
                  <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                    Have we missed anything? Do you and your partner jointly own or expect to receive any other joint assets, financial interests, or shared property that have not been listed above?
                  </label>
                  <YesNoToggle
                    name="has_shared_other_assets"
                    value={jointData.hasSharedOtherAssets || "No"}
                    onChange={(v) => handleJointChange("hasSharedOtherAssets", v)}
                  />
                </div>
                {jointData.hasSharedOtherAssets === "Yes" && (
                  <MatrixBox
                    title="Other Shared Assets Registry"
                    onAdd={() => addJointRow("sharedOtherAssets", makeSharedOtherAssetRow)}
                    addLabel="Add Other Shared Asset"
                  >
                    {jointData.sharedOtherAssets?.map((row: any) => (
                      <RowItem key={row.id} onDelete={() => removeJointRow("sharedOtherAssets", row.id)}>
                        <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-[2fr_1fr]">
                          <input
                            type="text"
                            placeholder="Shared Asset Description (e.g. Joint Art Collection, Joint Foreign Asset)"
                            disabled={!isCmEditing}
                            value={row.description}
                            onChange={(e) => updateJointRow("sharedOtherAssets", row.id, { description: e.target.value })}
                            className={inputClasses}
                          />
                          <ValueWithUnsure
                            id={`val_${row.id}`}
                            value={row.value}
                            unknown={row.valueUnknown}
                            onValueChange={(v) => updateJointRow("sharedOtherAssets", row.id, { value: v })}
                            onUnknownChange={(v) => updateJointRow("sharedOtherAssets", row.id, { valueUnknown: v })}
                            placeholder="Estimated Value (GBP)"
                          />
                        </div>
                        <TreatmentSelect
                          id={row.id}
                          fields={row}
                          onChange={(f) => updateJointRow("sharedOtherAssets", row.id, f)}
                          label="How should this shared asset be treated?"
                          options={sharedTreatmentOptions}
                        />
                      </RowItem>
                    ))}
                  </MatrixBox>
                )}
              </div>
            )}

            {/* 2. JOINT INCOME & REVENUE (SHARED INCOME & REVENUE - EXACT MATCH TO SHAHMIR) */}
            {jointSection === "joint-income" && (
              <div>
                <h2 className="mb-2 text-[1.2rem] font-bold tracking-tight text-slate-900">
                  Shared Income &amp; Revenue
                </h2>
                <p className="mb-6 text-[0.9rem] leading-relaxed text-slate-500">
                  Please declare any income that you and your partner receive jointly and how you would like that income to be treated under your prenuptial agreement.
                </p>

                <PartHeader tooltip="Declare any income that you and your partner receive jointly, such as rental income, business income, dividends, royalties, trust distributions or investment income.">
                  Shared Income
                </PartHeader>
                <div className="mb-4">
                  <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                    Do you and your partner receive any income jointly, such as rental income, business income, dividends, trust distributions, royalties or investment income?
                  </label>
                  <YesNoToggle
                    name="has_shared_income"
                    value={jointData.hasSharedIncome || "No"}
                    onChange={(v) => handleJointChange("hasSharedIncome", v)}
                  />
                </div>

                {jointData.hasSharedIncome === "Yes" && (
                  <MatrixBox
                    title="Shared Income Sources"
                    onAdd={() => addJointRow("sharedIncome", makeSharedIncomeRow)}
                    addLabel="Add Shared Income Source"
                  >
                    {jointData.sharedIncome?.map((row: any) => (
                      <RowItem key={row.id} onDelete={() => removeJointRow("sharedIncome", row.id)}>
                        <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                          <input
                            type="text"
                            placeholder="Income Description (e.g. Rental Income, Dividends, Business Income)"
                            disabled={!isCmEditing}
                            value={row.description}
                            onChange={(e) => updateJointRow("sharedIncome", row.id, { description: e.target.value })}
                            className={inputClasses}
                          />
                          <input
                            type="text"
                            placeholder="Income Source (e.g. Company X, ABC Property Management, XYZ Trust)"
                            disabled={!isCmEditing}
                            value={row.source || ""}
                            onChange={(e) => updateJointRow("sharedIncome", row.id, { source: e.target.value })}
                            className={inputClasses}
                          />
                          <input
                            type="number"
                            placeholder="Annual Income (£)"
                            disabled={!isCmEditing}
                            value={row.annualIncome}
                            onChange={(e) => updateJointRow("sharedIncome", row.id, { annualIncome: e.target.value })}
                            className={inputClasses}
                          />
                        </div>
                        <TreatmentSelect
                          id={row.id}
                          fields={row}
                          onChange={(f) => updateJointRow("sharedIncome", row.id, f)}
                          options={sharedTreatmentOptions}
                        />
                      </RowItem>
                    ))}
                  </MatrixBox>
                )}
              </div>
            )}

            {/* 3. JOINT LIABILITIES & DEBTS (SHARED LIABILITIES & DEBTS - EXACT MATCH TO SHAHMIR) */}
            {jointSection === "joint-liabilities" && (
              <div>
                <h2 className="mb-2 text-[1.2rem] font-bold tracking-tight text-slate-900">
                  Shared Liabilities &amp; Debts
                </h2>
                <p className="mb-6 text-[0.9rem] leading-relaxed text-slate-500">
                  Please tell us about any debts or financial obligations that you and your partner are jointly responsible for.
                </p>

                <PartHeader tooltip="Declare any liabilities that you and your partner hold jointly, including mortgages, loans, credit cards or other shared financial obligations.">
                  Shared Financial Obligations
                </PartHeader>
                <div className="mb-4">
                  <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                    Do you and your partner jointly hold any liabilities, including mortgages, loans, credit cards, finance agreements or other financial obligations?
                  </label>
                  <YesNoToggle
                    name="has_shared_debts"
                    value={jointData.hasSharedDebts || "No"}
                    onChange={(v) => handleJointChange("hasSharedDebts", v)}
                  />
                </div>

                {jointData.hasSharedDebts === "Yes" && (
                  <MatrixBox
                    title="Shared Liabilities Register"
                    onAdd={() => addJointRow("sharedDebts", makeSharedDebtRow)}
                    addLabel="Add Shared Liability"
                  >
                    {jointData.sharedDebts?.map((row: any) => (
                      <RowItem key={row.id} onDelete={() => removeJointRow("sharedDebts", row.id)}>
                        <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                          <input
                            type="text"
                            placeholder="Lender / Creditor Name"
                            disabled={!isCmEditing}
                            value={row.lenderName}
                            onChange={(e) => updateJointRow("sharedDebts", row.id, { lenderName: e.target.value })}
                            className={inputClasses}
                          />
                          <select
                            value={row.liabilityType}
                            disabled={!isCmEditing}
                            onChange={(e) => updateJointRow("sharedDebts", row.id, { liabilityType: e.target.value })}
                            className={inputClasses}
                          >
                            <option value="">Type of Liability</option>
                            <option value="Mortgage">Mortgage</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="Personal Loan">Personal Loan</option>
                            <option value="Car Finance">Car Finance</option>
                            <option value="Business Loan">Business Loan</option>
                            <option value="Student Loan">Student Loan</option>
                            <option value="Overdraft">Bank Overdraft</option>
                            <option value="Tax Liability">Tax Liability</option>
                            <option value="Other">Other</option>
                          </select>
                          <input
                            type="number"
                            placeholder="Outstanding Balance (£)"
                            disabled={!isCmEditing}
                            value={row.outstandingBalance}
                            onChange={(e) => updateJointRow("sharedDebts", row.id, { outstandingBalance: e.target.value })}
                            className={inputClasses}
                          />
                        </div>
                        <TreatmentSelect
                          id={row.id}
                          fields={row}
                          onChange={(f) => updateJointRow("sharedDebts", row.id, f)}
                          options={sharedTreatmentOptions}
                          label="How should this be Settled?"
                        />
                      </RowItem>
                    ))}
                  </MatrixBox>
                )}
              </div>
            )}
          </>
        )}

        {/* Save Button for CM Editing */}
        {isCmEditing && (
          <div className="flex items-center justify-end border-t pt-5">
            <button
              onClick={onSave}
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save Case Manager Edits</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
