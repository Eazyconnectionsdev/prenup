"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CaseHeader from "@/components/caseShared/CaseHeader";

import OverviewTab from "./components/OverviewTab";
import FormsTab from "./components/FormsTab";
import AgreementTab from "./components/AgreementTab";
import CMActionsTab from "./components/CMActionsTabs";
import TimelineTab from "./components/TimelineTab";
import AuditTab from "./components/AuditTab";
import PartnerLinkPanel from "@/components/caseManager/PartnerLinkPanel";

import Axios from "@/lib/ApiConfig";

export default function CaseDetailPage() {
  const params = useParams();

  const caseId = params?.id as string;

  const [activeTab, setActiveTab] = useState("overview");
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCmEditing, setIsCmEditing] = useState(false);

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
      label: "Overview",
    },
    {
      id: "forms",
      label: "Forms & Disclosures",
    },
    {
      id: "agreement",
      label: "Agreement",
    },
    {
      id: "lawyers",
      label: "CM Actions",
    },
    {
      id: "timeline",
      label: "Timeline",
    },
    {
      id: "audit",
      label: "Audit Logs",
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

  return (
    <div className="p-6">
      <CaseHeader caseData={caseData} backHref="/cm/cases" backLabel="Back to Active Cases" />

      <PartnerLinkPanel caseId={caseId} caseData={caseData} onChanged={loadCase} />

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
