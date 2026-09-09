"use client";

import { useEffect, useState } from "react";

import OverviewTab from "./components/OverviewTab";
import FormsTab from "./components/FormsTab";
import AgreementTab from "./components/AgreementTab";
import LawyersTab from "./components/LawyersTab";
import TimelineTab from "./components/TimelineTab";
import EmailsTab from "./components/EmailsTab";
import AuditTab from "./components/AuditTab";
import NotesTab from "./components/NotesTab";
import Axios from "@/lib/ApiConfig";
const CASE_ID = "6a705491f3141d864c076602";

export default function CaseDetailPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCase();
  }, []);

  const loadCase = async () => {
    try {
      setLoading(true);
const { data } = await Axios.get( `/cases/${CASE_ID}`);
     
      setCaseData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "1. Overview" },
    { id: "forms", label: "2. Forms & Disclosures" },
    { id: "agreement", label: "3. Agreement" },
    { id: "lawyers", label: "4. Lawyers Assignment" },
    { id: "timeline", label: "5. Timeline" },
    { id: "emails", label: "6. Emails" },
    { id: "audit", label: "7. Audit Logs" },
    { id: "notes", label: "8. CM Notes" },
  ];

  if (loading) {
    return (
      <div className="p-10">
        Loading case...
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="p-10 text-red-600">
        Failed to load case
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* Header */}

      <div className="bg-white border rounded-xl p-6 mb-6">

        <div className="flex justify-between items-center">

          <div>
            <h1 className="text-2xl font-bold">
              {caseData.title}
            </h1>

            <p className="text-sm text-slate-500">
              {caseData._id}
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              caseData.workflowStatus === "DRAFT"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {caseData.workflowStatus}
          </span>

        </div>

      </div>

      {/* Tabs */}

      <div className="bg-white border rounded-xl overflow-hidden">

        <div className="flex overflow-auto border-b">

          {tabs.map((tab) => (
            <button
              key={tab.id}
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
            <FormsTab caseData={caseData} />
          )}

          {activeTab === "agreement" && (
            <AgreementTab  />
          )}

          {activeTab === "lawyers" && (
            <LawyersTab caseData={caseData} />
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

          {activeTab === "notes" && (
            <NotesTab  />
          )}

        </div>

      </div>

    </div>
  );
}