"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

import OverviewTab from "./components/OverviewTab";
import AgreementTab from "./components/AgreementTab";
import LawyerActionsTab from "./components/LawyerActionTabs";
import CaseHeader from "@/components/caseShared/CaseHeader";
import { isMe } from "@/components/caseShared/LawyerDetails";
import { caseLawyers } from "@/lib/caseStages";

import Axios from "@/lib/ApiConfig";

// The lawyer's case page: the same header and Overview as the case manager's,
// with the lawyer's own menu (Overview, Agreement, Lawyer Action).
const TABS = [
  { id: "overview", label: "Overview" },
  { id: "agreement", label: "Agreement" },
  { id: "lawyers", label: "Lawyer Action" },
];

const personName = (u: any) =>
  u && typeof u === "object"
    ? [u.firstName, u.middleName, u.lastName].filter(Boolean).join(" ").trim() || u.email || ""
    : "";

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = params?.id as string;
  const me = useSelector((state: RootState) => state.auth.user);

  const [activeTab, setActiveTab] = useState("overview");
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!caseId) return;
    (async () => {
      try {
        setLoading(true);
        const { data } = await Axios.get(`/lawyer/${caseId}`);
        setCaseData(data);
      } catch (err) {
        console.error("Case loading failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [caseId]);

  if (loading) {
    return <div className="p-10 font-sans text-slate-600">Loading case...</div>;
  }

  if (!caseData) {
    return <div className="p-10 text-red-600 font-sans">Case not found</div>;
  }

  const lawyers = caseLawyers(caseData);
  const actingFor = isMe(lawyers.p1, me)
    ? { side: "Partner 1", name: personName(caseData.owner) }
    : isMe(lawyers.p2, me)
    ? { side: "Partner 2", name: personName(caseData.invitedUser) || caseData.invitedEmail }
    : null;

  const archived = ["COMPLETED", "ARCHIVED"].includes(caseData.workflowStatus);

  return (
    <div className="p-6">
      <CaseHeader
        caseData={caseData}
        backHref={archived ? "/lawyer/archived" : "/lawyer/assigned-cases"}
        backLabel={archived ? "Back to Archived Cases" : "Back to Active Cases"}
        extra={
          actingFor && (
            <div className="mt-1 pt-3 border-t border-slate-100 text-xs text-slate-600">
              You act for <strong className="text-slate-900">{actingFor.name || actingFor.side}</strong>{" "}
              ({actingFor.side}).
            </div>
          )
        }
      />

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="flex overflow-auto border-b">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-semibold whitespace-nowrap ${
                activeTab === tab.id ? "border-b-2 border-black bg-slate-50" : ""
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "overview" && <OverviewTab caseData={caseData} />}
          {activeTab === "agreement" && <AgreementTab />}
          {activeTab === "lawyers" && <LawyerActionsTab />}
        </div>
      </div>
    </div>
  );
}
