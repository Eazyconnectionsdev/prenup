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
import PartnerLinkPanel from "@/components/caseManager/PartnerLinkPanel";

import Axios from "@/lib/ApiConfig";

function formatAgreementType(type?: string | null): string {
  if (!type) return "Prenuptial Agreement";
  const normalized = type.toLowerCase().trim();
  const map: Record<string, string> = {
    "prenup-marriage": "Prenuptial Agreement",
    "prenup-civil": "Prenuptial Agreement",
    "postnup-marriage": "Postnuptial Agreement",
    "postnup-civil": "Postnuptial Agreement",
    cohabitation: "Cohabitation Agreement",
    "help-choose": "Prenuptial Agreement",
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

/** Returns the sub-category label (e.g. Marriage or Civil Partnership) */
function formatAgreementSubType(type?: string | null, caseData?: any): string {
  // Check explicit relationship/ceremony details on case if present
  const rel = String(
    caseData?.partnerInviteDetails?.relationshipStatus ||
    caseData?.relationshipStatus ||
    caseData?.ceremonyType ||
    ""
  ).toLowerCase();

  if (rel.includes("civil")) return "Civil Partnership";
  if (rel.includes("marri")) return "Marriage";

  if (!type) {
    // Default throughout the platform for standard prenuptial cases is Marriage (prenup-marriage)
    return "Marriage";
  }

  const normalized = type.toLowerCase().trim();

  if (normalized.includes("civil")) {
    return "Civil Partnership";
  }
  if (normalized.includes("cohabit")) {
    return "Living Together";
  }
  if (normalized.includes("help-choose") || normalized.includes("custom")) {
    return "Custom";
  }
  if (normalized.includes("marriage") || normalized.includes("married")) {
    return "Marriage";
  }

  // Fallback for standard prenup / postnup is Marriage
  return "Marriage";
}

/** Human-readable display label for priority values. */
function formatPriority(priority?: string | null): string {
  if (!priority) return "";
  const map: Record<string, string> = {
    LOW: "Default",
    MEDIUM: "Medium",
    HIGH: "High",
    URGENT: "Urgent",
    CRITICAL: "Critical",
  };
  return map[priority.toUpperCase()] ?? priority;
}

/** Human-readable display label for workflow status. */
function formatWorkflowStatus(status?: string | null): string {
  if (!status) return "Draft";
  const map: Record<string, string> = {
    NOT_PAID: "Not Paid",
    DRAFT: "Draft",
    COUPLE_SUBMITTED: "Couple Submitted",
    CM_APPROVED: "CM Approved",
    CM_RETURNED: "CM Returned",
    LAWYER_REVIEW: "Lawyer Review",
    COMPLETED: "Completed",
    ARCHIVED: "Archived",
  };
  return (
    map[status.toUpperCase()] ||
    status
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
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
  const planSubType = formatAgreementSubType(caseData?.agreementType, caseData);

  return (
    <div className="p-6">
      {/* Topbar on Case Detail */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-xs space-y-4">
        {/* Top Sub-Row: Back Navigation & Case Status / Priority */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <Link
            href="/cm/cases"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            title="Back to Cases Master List"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Cases
          </Link>

          <div className="flex items-center gap-2">
            {/* Workflow Status */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  caseData.workflowStatus === "CM_APPROVED" || caseData.workflowStatus === "COMPLETED"
                    ? "bg-emerald-500"
                    : caseData.workflowStatus === "NOT_PAID"
                    ? "bg-amber-500"
                    : "bg-blue-500"
                }`}
              />
              {formatWorkflowStatus(caseData.workflowStatus)}
            </span>

            {/* Priority */}
            {caseData.priority && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    caseData.priority === "URGENT" || caseData.priority === "CRITICAL"
                      ? "bg-rose-500"
                      : caseData.priority === "HIGH"
                      ? "bg-orange-500"
                      : caseData.priority === "MEDIUM"
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                />
                {formatPriority(caseData.priority)} Priority
              </span>
            )}
          </div>
        </div>

        {/* Bottom Sub-Row: Case Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Primary Applicant */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Primary Applicant
            </span>
            <span className="text-sm font-semibold text-slate-900 truncate" title={p1Name}>
              {p1Name}
            </span>
          </div>

          {/* Secondary Applicant */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Secondary Applicant
            </span>
            {p2Name ? (
              <span className="text-sm font-semibold text-slate-900 truncate" title={p2Name}>
                {p2Name}
              </span>
            ) : caseData?.partnerInvited || caseData?.invitedEmail ? (
              <span className="text-xs text-slate-600 truncate" title={caseData.invitedEmail || undefined}>
                Invited <span className="text-slate-400 font-normal">({caseData.invitedEmail || "Awaiting Acceptance"})</span>
              </span>
            ) : (
              <span className="text-xs text-slate-400 italic">
                Not Yet Invited
              </span>
            )}
          </div>

          {/* Case ID */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Case ID
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-sm font-bold text-slate-900">
                {caseIdDisplay}
              </span>
              <button
                type="button"
                onClick={() => copyCaseId(caseIdDisplay)}
                title="Click to copy Case ID"
                className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 rounded cursor-pointer"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Plan Selected */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Plan Selected
            </span>
            <div className="text-sm font-semibold text-slate-900 truncate">
              {planSelected}
              {planSubType && (
                <span className="ml-1.5 text-xs font-normal text-slate-500">
                  ({planSubType})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

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
