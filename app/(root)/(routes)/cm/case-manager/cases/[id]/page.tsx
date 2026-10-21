"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Copy, Check, ArrowLeft } from "lucide-react";

import OverviewTab from "./components/OverviewTab";
import FormsTab from "./components/FormsTab";
import AgreementTab from "./components/AgreementTab";
import CMActionsTab from "./components/CMActionsTabs";
import TimelineTab from "./components/TimelineTab";
import AuditTab from "./components/AuditTab";

import Axios from "@/lib/ApiConfig";

function formatAgreementType(type?: string | null): string {
  if (!type) return "Prenuptial Agreement";
  const normalized = type.toLowerCase().trim();
  const map: Record<string, string> = {
    "prenup-marriage": "Prenup — Marriage",
    "prenup-civil": "Prenup — Civil Partnership",
    "postnup-marriage": "Postnup — Marriage",
    "postnup-civil": "Postnup — Civil Partnership",
    cohabitation: "Cohabitation Agreement",
    "help-choose": "Custom Prenuptial Agreement",
    prenup: "Prenuptial Agreement",
    prenuptial: "Prenuptial Agreement",
    postnup: "Postnuptial Agreement",
    postnuptial: "Postnuptial Agreement",
  };
  return (
    map[normalized] ||
    type.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export default function CaseDetailPage() {
  const params = useParams();

  const caseId = params?.id as string;

  const [activeTab, setActiveTab] = useState("overview");
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCmEditing, setIsCmEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyCaseId = async (idToCopy: string) => {
    if (!idToCopy) return;
    try {
      await navigator.clipboard.writeText(String(idToCopy));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (caseId) {
      loadCase();
    }
  }, [caseId]);

  const loadCase = async () => {
    try {
      setLoading(true);

      const { data } = await Axios.get(
        `/case-manager/${caseId}`
      );
      console.log("case full data", data);
      setCaseData(data);
    } catch (err) {
      console.error("Case loading failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormsSave = async (updatedData?: any) => {
    try {
      if (updatedData) {
        await Axios.put(
          `/case-manager/${caseId}`,
          updatedData
        );
      }

      await loadCase();
      setIsCmEditing(false);
    } catch (err) {
      console.error("Forms save failed:", err);
      throw err;
    }
  };

  const tabs = [
    {
      id: "overview",
      label: "1. Overview",
    },
    {
      id: "forms",
      label: "2. Forms & Disclosures",
    },
    {
      id: "agreement",
      label: "3. Agreement",
    },
    {
      id: "lawyers",
      label: "4. CM Actions",
    },
    {
      id: "timeline",
      label: "5. Timeline",
    },
    {
      id: "audit",
      label: "6. Audit Logs",
    },
  ];

  if (loading) {
    return (
      <div className="p-10 font-sans text-slate-600">
        Loading case...
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="p-10 text-red-600 font-sans">
        Case not found
      </div>
    );
  }

  // 1) Partner A and Partner B names (if only one, then only one comes)
  const p1First = caseData?.owner?.firstName || caseData?.primaryApplicant?.firstName || "";
  const p1Middle = caseData?.owner?.middleName ? ` ${caseData.owner.middleName} ` : " ";
  const p1Last = caseData?.owner?.lastName || caseData?.primaryApplicant?.lastName || "";
  const p1Name = `${p1First}${p1Middle}${p1Last}`.replace(/\s+/g, " ").trim() || (caseData?.owner?.email ? caseData.owner.email : "Partner A");

  const p2First = caseData?.invitedUser?.firstName || "";
  const p2Middle = caseData?.invitedUser?.middleName ? ` ${caseData.invitedUser.middleName} ` : " ";
  const p2Last = caseData?.invitedUser?.lastName || "";
  const p2Name = `${p2First}${p2Middle}${p2Last}`.replace(/\s+/g, " ").trim();

  // If only one partner exists, only that one must be shown
  const partnerTitle = p2Name ? `${p1Name} & ${p2Name}` : p1Name;

  // 2) Case ID
  const caseIdDisplay = caseData?.caseNumber || caseData?._id || "—";

  // 3) Plan selected
  const planSelected = formatAgreementType(caseData?.agreementType);

  return (
    <div className="p-6">
      {/* Topbar on Case Detail */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Link
                href="/cm/cases"
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mr-2 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200"
                title="Back to Cases Master List"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Cases
              </Link>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {partnerTitle}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              {/* Partner Names */}
              <span className="inline-flex items-center gap-1 text-slate-600">
                <span className="text-slate-400 font-medium">Partner A:</span>
                <span className="font-semibold text-slate-800">{p1Name}</span>
              </span>

              {p2Name && (
                <>
                  <span className="text-slate-300">·</span>
                  <span className="inline-flex items-center gap-1 text-slate-600">
                    <span className="text-slate-400 font-medium">Partner B:</span>
                    <span className="font-semibold text-slate-800">{p2Name}</span>
                  </span>
                </>
              )}

              <span className="text-slate-300">·</span>

              {/* Case ID */}
              <button
                type="button"
                onClick={() => copyCaseId(caseIdDisplay)}
                title="Click to copy Case ID"
                className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                <span className="text-slate-400 font-medium">Case ID:</span>
                <span className="font-mono font-semibold text-slate-900">{caseIdDisplay}</span>
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                )}
              </button>

              <span className="text-slate-300">·</span>

              {/* Plan Selected */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50/80 border border-amber-200 text-amber-900 font-medium">
                <span className="text-amber-700">Plan Selected:</span>
                <span className="font-bold">{planSelected}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
              {caseData.workflowStatus || "Draft"}
            </span>
            {caseData.priority && (
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                  caseData.priority === "HIGH" || caseData.priority === "CRITICAL"
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : caseData.priority === "MEDIUM"
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}
              >
                {caseData.priority}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="flex overflow-auto border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-semibold whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-b-2 border-black bg-slate-50"
                  : ""
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <OverviewTab caseData={caseData} />
          )}

          {activeTab === "forms" && (
            <FormsTab
              caseData={caseData}
              isCmEditing={isCmEditing}
              setIsCmEditing={setIsCmEditing}
            />
          )}

          {activeTab === "agreement" && (
            <AgreementTab />
          )}

          {activeTab === "lawyers" && (
            <CMActionsTab caseData={caseData} />
          )}

          {activeTab === "timeline" && (
            <TimelineTab caseData={caseData} />
          )}

          {activeTab === "audit" && (
            <AuditTab caseData={caseData} />
          )}
        </div>
      </div>
    </div>
  );
}
