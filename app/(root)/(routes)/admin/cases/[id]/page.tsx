"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";

import OverviewTab from "./components/OverviewTab";
import FormsTab from "./components/FormsTab";
import AgreementTab from "./components/AgreementTab";
import AdminActionsTab from "./components/AdminActionsTabs";
import TimelineTab from "./components/TimelineTab";
import EmailsTab from "./components/EmailsTab";
import AuditTab from "./components/AuditTab";

import PartnerLinkPanel from "@/components/caseManager/PartnerLinkPanel";
import Axios from "@/lib/ApiConfig";

export default function AdminCaseDetailPage() {
  const params = useParams();
  const router = useRouter();

  const caseId = params?.id as string;

  const [activeTab, setActiveTab] = useState("overview");
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCmEditing, setIsCmEditing] = useState(false);

  useEffect(() => {
    if (caseId) {
      loadCase();
    }
  }, [caseId]);

  const loadCase = async () => {
    try {
      setLoading(true);
      setError(null);

      let data: any = null;
      try {
        const res = await Axios.get(`/case-manager/${caseId}`);
        data = res.data;
      } catch (firstErr) {
        console.warn("Primary /case-manager/" + caseId + " failed, attempting /cases/" + caseId, firstErr);
        const fallbackRes = await Axios.get(`/cases/${caseId}`);
        data = fallbackRes.data;
      }

      setCaseData(data);
    } catch (err: any) {
      console.error("Case loading failed:", err);
      setError(err?.response?.data?.message || "Failed to load case details.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormsSave = async (updatedData?: any) => {
    try {
      if (updatedData) {
        await Axios.put(`/case-manager/${caseId}`, updatedData);
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
      label: "4. Admin Actions",
    },
    {
      id: "timeline",
      label: "5. Timeline",
    },
    {
      id: "emails",
      label: "6. Emails",
    },
    {
      id: "audit",
      label: "7. Audit Logs",
    },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-20 gap-3 text-slate-500">
          <RefreshCw className="w-5 h-5 animate-spin text-violet-600" />
          <span className="text-sm font-semibold">Loading case details...</span>
        </div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="p-8 max-w-xl">
        <button
          type="button"
          onClick={() => router.push("/admin/cases")}
          className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cases Ledger</span>
        </button>

        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-red-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error || "Case not found."}</span>
          </div>
          <button
            onClick={loadCase}
            className="underline font-semibold hover:text-red-900 ml-4 cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Back button */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => router.push("/admin/cases")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cases Ledger</span>
        </button>
      </div>

      {/* Case Header Card */}
      <div className="bg-white border rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              {caseData.title || `Case ${caseData.caseNumber || caseData._id}`}
            </h1>

            <p className="text-sm text-slate-500">
              {caseData.caseNumber || caseData._id}
            </p>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
            {caseData.workflowStatus || "DRAFT"}
          </span>
        </div>
      </div>

      <PartnerLinkPanel caseId={caseId} caseData={caseData} onChanged={loadCase} />

      {/* Tabs Container */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="flex overflow-auto border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-black bg-slate-50 text-slate-900"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/50"
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
            <AdminActionsTab caseData={caseData} onCaseUpdated={loadCase} />
          )}

          {activeTab === "timeline" && (
            <TimelineTab caseData={caseData} />
          )}

          {activeTab === "emails" && (
            <EmailsTab caseData={caseData} />
          )}

          {activeTab === "audit" && (
            <AuditTab caseData={caseData} />
          )}
        </div>
      </div>
    </div>
  );
}

