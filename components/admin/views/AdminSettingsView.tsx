"use client";

import React, { useState, useEffect, useCallback } from "react";
import Axios from "@/lib/ApiConfig";
import {
  ChevronDown,
  ChevronUp,
  Paperclip,
  Plus,
  Eye,
  Building2,
  User,
  Settings,
  RefreshCw,
  Check,
  AlertCircle,
  ShieldCheck,
  Archive,
  Phone,
  Mail,
  Globe,
  Pencil,
} from "lucide-react";
import { CompanyDocumentList, CompanyForm, CompanyRecord } from "./CompanyForm";
import {
  CompanyOption,
  LawyerAvatar,
  LawyerDocumentList,
  LawyerForm,
  LawyerRecord,
  invitationInfo,
} from "./LawyerForm";
import { createdByLabel, formatDate } from "./AdminFormKit";

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface CompanyItem {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  verified?: boolean;
  createdAt?: string;
  /** The full record as returned by the API (every field of the company form). */
  record: CompanyRecord;
}

interface LawyerItem {
  id: string;
  name: string;
  companyName: string;
  verified?: boolean;
  status?: string;
  createdAt?: string;
  /** The full record as returned by the API (every field of the lawyer form). */
  record: LawyerRecord;
}

// ─── Section 1: TopBar Settings ───────────────────────────────────────────────

function Section1TopBarSettings() {
  const [settings, setSettings] = useState({
    topBar1Enabled: true,
    topBar1Text: "",
    topBar2Enabled: true,
    topBar2Text: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await Axios.get("/admin/settings");
      if (res.data) {
        setSettings({
          topBar1Enabled: Boolean(res.data.topBar1Enabled ?? true),
          topBar1Text: res.data.topBar1Text ?? "",
          topBar2Enabled: Boolean(res.data.topBar2Enabled ?? true),
          topBar2Text: res.data.topBar2Text ?? "",
        });
      }
    } catch (err) {
      console.error("Failed to load TopBar settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);
      await Axios.patch("/admin/settings", settings);
      setMessage("TopBar settings saved successfully!");
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      console.error("Failed to update TopBar settings:", err);
      setMessage(err?.response?.data?.message || "Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
            <Settings className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Section 1 — TopBar Controls</h2>
            <p className="text-xs text-slate-500">Enable/disable and configure text for global TopBar items</p>
          </div>
        </div>

        {message && (
          <span
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 ${
              message.includes("success")
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.includes("success") ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
            {message}
          </span>
        )}
      </div>

      {loading ? (
        <div className="py-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-violet-600" />
          <span>Loading settings...</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-48">
                  TopBar Element
                </th>
                <th className="text-center py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-44">
                  Enable / Disable
                </th>
                <th className="text-left py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Text to show in TopBar
                </th>
              </tr>
            </thead>
            <tbody>
              {/* TopBar-1 */}
              <tr className="border-b border-slate-50">
                <td className="py-3 px-3 font-semibold text-slate-700 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-[#3730A3] via-[#5B55F6] to-[#7C3AED] shadow-xs shrink-0" title="Theme: Indigo / Violet Gradient" />
                    <span>TopBar-1</span>
                    <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-violet-50 text-violet-700 border border-violet-100">
                      Indigo / Violet
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSettings((s) => ({ ...s, topBar1Enabled: !s.topBar1Enabled }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        settings.topBar1Enabled ? "bg-violet-600" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.topBar1Enabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span className={`text-xs font-semibold ${settings.topBar1Enabled ? "text-violet-600" : "text-slate-400"}`}>
                      {settings.topBar1Enabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <input
                    type="text"
                    value={settings.topBar1Text}
                    onChange={(e) => setSettings((s) => ({ ...s, topBar1Text: e.target.value }))}
                    placeholder="Enter text to show in TopBar-1..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-violet-500 bg-white text-slate-800 placeholder:text-slate-400"
                  />
                </td>
              </tr>

              {/* TopBar-2 */}
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-700 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-[#9D174D] via-[#E02693] to-[#8B23E3] shadow-xs shrink-0" title="Theme: Magenta / Rose Gradient" />
                    <span>TopBar-2</span>
                    <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-pink-50 text-pink-700 border border-pink-100">
                      Magenta / Rose
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSettings((s) => ({ ...s, topBar2Enabled: !s.topBar2Enabled }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        settings.topBar2Enabled ? "bg-violet-600" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.topBar2Enabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span className={`text-xs font-semibold ${settings.topBar2Enabled ? "text-violet-600" : "text-slate-400"}`}>
                      {settings.topBar2Enabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <input
                    type="text"
                    value={settings.topBar2Text}
                    onChange={(e) => setSettings((s) => ({ ...s, topBar2Text: e.target.value }))}
                    placeholder="Enter text to show in TopBar-2..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-violet-500 bg-white text-slate-800 placeholder:text-slate-400"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
          <span>{saving ? "Saving Changes..." : "Save TopBar Settings"}</span>
        </button>
      </div>
    </div>
  );
}

// ─── Section 2: Company Card ──────────────────────────────────────────────────

function Detail({
  label,
  children,
  wide,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "md:col-span-2" : undefined}>
      <div className="text-slate-400 font-semibold mb-0.5 uppercase text-[10px]">{label}</div>
      <div className="font-medium text-slate-700 break-words whitespace-pre-line">{children || "—"}</div>
    </div>
  );
}

// Older records store a bare domain ("example.com"); never link a raw value, which could be a javascript: URL.
function websiteHref(website: string): string {
  return /^https?:\/\//i.test(website) ? website : `https://${website}`;
}

function CompanyCard({
  company,
  onRefresh,
  onAddLawyer,
  onEdit,
}: {
  company: CompanyItem;
  onRefresh: () => void;
  onAddLawyer?: (companyId: string) => void;
  onEdit?: (companyId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const record = company.record;
  const documents = record.documents ?? [];
  const inactive = record.status === "inactive";
  const contactName = [record.contactFirstName, record.contactLastName].filter(Boolean).join(" ");
  const address =
    [record.addressLine1, record.addressLine2, record.city, record.county, record.postcode, record.country]
      .filter(Boolean)
      .join(", ") || record.address;

  const handleVerify = async () => {
    try {
      setVerifying(true);
      await Axios.patch(`/admin/companies/${company.id}/verify`);
      onRefresh();
    } catch (err) {
      console.error("Failed to verify company:", err);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-50/70 hover:bg-slate-100/70 transition-colors">
        <Building2 className="w-5 h-5 text-slate-500 shrink-0" />
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpanded((v) => !v)}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-slate-800">{company.name}</span>
            {inactive && (
              <span className="inline-flex items-center text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                Inactive
              </span>
            )}
            {company.verified ? (
              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                <Check className="w-3 h-3" /> Verified
              </span>
            ) : (
              <button
                type="button"
                disabled={verifying}
                onClick={(e) => {
                  e.stopPropagation();
                  handleVerify();
                }}
                className="text-[10px] bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 px-2 py-0.5 rounded-full font-semibold transition-colors cursor-pointer"
              >
                {verifying ? "Verifying..." : "Verify Firm"}
              </button>
            )}
          </div>
          <div className="text-xs text-slate-400 mt-0.5 truncate">
            {company.email || "No email"} · {company.phone || "No phone"}
          </div>
        </div>

        {onEdit && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(company.id);
            }}
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shrink-0"
            title={`Edit ${company.name}`}
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        )}

        {onAddLawyer && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddLawyer(company.id);
            }}
            className="flex items-center gap-1 text-[11px] font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shrink-0"
            title={`Add a lawyer to ${company.name}`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Lawyer</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-700 cursor-pointer p-1"
        >
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            {documents.length} {documents.length === 1 ? "document" : "documents"}
          </span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="p-4 bg-white border-t border-slate-100 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <Detail label="Company Type">{record.companyType}</Detail>
            <Detail label="Status">{inactive ? "Inactive" : "Active"}</Detail>
            <Detail label="Registration Number">{record.companyNumber}</Detail>
            <Detail label="VAT Number">{record.vatNumber}</Detail>
            <Detail label="Regulatory Body">{record.regulatoryBody}</Detail>
            <Detail label="Regulatory Registration Number">{record.regulatoryNumber}</Detail>
            <Detail label="Website">
              {record.website && (
                <a href={websiteHref(record.website)} target="_blank" rel="noreferrer" className="text-violet-600 hover:underline">
                  {record.website}
                </a>
              )}
            </Detail>
            <Detail label="Main Contact">{contactName}</Detail>
            <Detail label="Contact Email">{record.email}</Detail>
            <Detail label="Contact Phone">{record.phone}</Detail>
            <Detail label="Description" wide>{record.description}</Detail>
            <Detail label="Registered Address" wide>{address}</Detail>
            <Detail label="Internal Notes" wide>{record.notes}</Detail>
            <Detail label="Created By">{createdByLabel(record.createdBy)}</Detail>
            <Detail label="Created / Last Updated">
              {record.createdAt ? `${formatDate(record.createdAt)} / ${formatDate(record.updatedAt)}` : ""}
            </Detail>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <Paperclip className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Documents ({documents.length})
              </span>
            </div>
            <CompanyDocumentList companyId={company.id} documents={documents} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Section 2: Lawyer Card ───────────────────────────────────────────────────

function LawyerCard({
  lawyer,
  onRefresh,
  onEdit,
}: {
  lawyer: LawyerItem;
  onRefresh: () => void;
  onEdit?: (lawyerId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [archiving, setArchiving] = useState(false);

  const record = lawyer.record;
  const documents = record.documents ?? [];
  const invitation = invitationInfo(record);
  const workEmail = record.workEmail ?? record.directEmail ?? record.publicEmail;
  const workPhone = record.workPhone ?? record.directPhone;
  const archived = lawyer.status === "archived";
  const inactive = lawyer.status === "unavailable";
  const accountInactive = record.account?.active === false;

  const handleVerify = async () => {
    try {
      setVerifying(true);
      await Axios.patch(`/admin/lawyers/${lawyer.id}/verify`);
      onRefresh();
    } catch (err) {
      console.error("Failed to verify lawyer:", err);
    } finally {
      setVerifying(false);
    }
  };

  const handleArchive = async () => {
    try {
      setArchiving(true);
      await Axios.patch(`/admin/lawyers/${lawyer.id}/archive`);
      onRefresh();
    } catch (err) {
      console.error("Failed to archive lawyer:", err);
    } finally {
      setArchiving(false);
    }
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-50/70 hover:bg-slate-100/70 transition-colors">
        <LawyerAvatar lawyerId={lawyer.id} photoKey={record.photoKey} avatarUrl={record.avatarUrl} name={lawyer.name} />
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpanded((v) => !v)}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-slate-800">{lawyer.name}</span>
            {inactive && (
              <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                Inactive
              </span>
            )}
            {accountInactive && (
              <span className="text-[10px] bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full font-semibold">
                Login disabled
              </span>
            )}
            {lawyer.verified ? (
              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                <Check className="w-3 h-3" /> Verified
              </span>
            ) : (
              <button
                type="button"
                disabled={verifying}
                onClick={(e) => {
                  e.stopPropagation();
                  handleVerify();
                }}
                className="text-[10px] bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 px-2 py-0.5 rounded-full font-semibold transition-colors cursor-pointer"
              >
                {verifying ? "Verifying..." : "Verify Lawyer"}
              </button>
            )}

            {archived ? (
              <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full font-semibold">
                Archived
              </span>
            ) : (
              <button
                type="button"
                disabled={archiving}
                onClick={(e) => {
                  e.stopPropagation();
                  handleArchive();
                }}
                className="text-[10px] bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 px-2 py-0.5 rounded-full font-semibold transition-colors cursor-pointer"
              >
                {archiving ? "Archiving..." : "Archive"}
              </button>
            )}
          </div>
          <div className="text-xs text-slate-400 mt-0.5 truncate">
            {lawyer.companyName}
            {record.jobTitle ? ` · ${record.jobTitle}` : ""} · {workEmail || "No email"}
          </div>
        </div>

        {onEdit && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(lawyer.id);
            }}
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shrink-0"
            title={`Edit ${lawyer.name}`}
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-700 cursor-pointer p-1"
        >
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            {documents.length} {documents.length === 1 ? "document" : "documents"}
          </span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="p-4 bg-white border-t border-slate-100 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <Detail label="Law Firm / Company">{lawyer.companyName}</Detail>
            <Detail label="Office / Branch">{record.officeBranch}</Detail>
            <Detail label="Job Title / Position">{record.jobTitle}</Detail>
            <Detail label="Lawyer Status">{inactive ? "Inactive" : archived ? "Archived" : "Active"}</Detail>
            <Detail label="Regulatory Body">{record.regulatoryBody}</Detail>
            <Detail label="Professional Registration Number">{record.registrationNumber ?? record.barNumber}</Detail>
            <Detail label="Practising Status">{record.practisingStatus}</Detail>
            <Detail label="Jurisdiction / Country of Practice">{record.jurisdiction}</Detail>
            <Detail label="Qualification Details" wide>{record.qualifications}</Detail>
            <Detail label="Work Email">{workEmail}</Detail>
            <Detail label="Work Phone">{workPhone}</Detail>
            <Detail label="Mobile">{record.mobilePhone}</Detail>
            <Detail label="Fee Shown to Clients">{record.priceText || "Standard Rate"}</Detail>
            <Detail label="Login Email">{record.account?.email ?? "No login account yet"}</Detail>
            <Detail label="Account Status">
              {record.account ? (record.account.active ? "Active" : "Inactive (cannot sign in)") : "—"}
            </Detail>
            <Detail label="Invitation Status">{invitation.label}</Detail>
            <Detail label="Internal Notes" wide>{record.internalNotes ?? record.notes}</Detail>
            <Detail label="Created By">{createdByLabel(record.createdById)}</Detail>
            <Detail label="Created / Last Updated">
              {record.createdAt ? `${formatDate(record.createdAt)} / ${formatDate(record.updatedAt)}` : ""}
            </Detail>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <Paperclip className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Documents ({documents.length})
              </span>
            </div>
            <LawyerDocumentList lawyerId={lawyer.id} documents={documents} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Case Manager Creation Form ───────────────────────────────────────────────

function CaseManagerCreationForm({ onCreated }: { onCreated: () => void }) {
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState<{ name: string; email: string } | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    primaryJurisdiction: ["England", "Wales", "Scotland"],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.email.trim() || !form.password) return;

    try {
      setSaving(true);
      await Axios.post("/admin/case-managers", form);
      setCreated({ name: `${form.firstName} ${form.lastName}`.trim(), email: form.email });
      setForm({ firstName: "", lastName: "", email: "", password: "", phone: "", primaryJurisdiction: ["England", "Wales", "Scotland"] });
      onCreated();
    } catch (err: any) {
      console.error("Failed to create case manager:", err);
      alert(err?.response?.data?.message || "Failed to create case manager.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {created && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-emerald-900">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="font-bold text-sm text-emerald-950">
                Case Manager &quot;{created.name}&quot; created successfully!
              </p>
              <p className="text-emerald-700 text-xs mt-0.5">
                Account for {created.email} is active · Pre-verified · No OTP required.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCreated(null)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Add Another
          </button>
        </div>
      )}

      <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-2xs">
        <div className="mb-4 pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <User className="w-4 h-4 text-sky-600" />
            <span>Add Case Manager</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Creates a pre-verified platform account with the <code className="text-sky-700 bg-sky-50 px-1 rounded">case_manager</code> role. No OTP or email confirmation needed.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Login credentials */}
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span className="text-xs font-bold text-sky-950">Login Account Credentials</span>
              <span className="text-[10px] text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full ml-1">
                Pre-verified · No OTP required
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-sky-900 block mb-1">
                  Login Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="manager@prenup.com"
                  className="w-full rounded-lg border border-sky-300 bg-white px-3 py-2 text-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-sky-900 block mb-1">
                  Password <span className="text-red-500">*</span>{" "}
                  <span className="font-normal text-sky-700">(min 8 characters)</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-sky-300 bg-white px-3 py-2 text-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Personal details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                placeholder="e.g. Sarah"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Last Name</label>
              <input
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                placeholder="e.g. Johnson"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Phone Number</label>
              <input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+14165550100"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Primary Jurisdiction (Multi-selectable)
              </label>
              <div className="flex flex-wrap gap-2">
                {["England", "Wales", "Scotland"].map((jurisdiction) => {
                  const isSelected = form.primaryJurisdiction?.includes(jurisdiction);
                  return (
                    <button
                      key={jurisdiction}
                      type="button"
                      onClick={() => {
                        setForm((f) => ({
                          ...f,
                          primaryJurisdiction: isSelected
                            ? f.primaryJurisdiction.filter((j: string) => j !== jurisdiction)
                            : [...(f.primaryJurisdiction || []), jurisdiction],
                        }));
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-sky-600 text-white border-sky-600"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {jurisdiction}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>{saving ? "Creating Account..." : "Create Case Manager"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Case Manager Card ────────────────────────────────────────────────────────

const JURISDICTIONS = ["England", "Wales", "Scotland"] as const;
type Jurisdiction = typeof JURISDICTIONS[number];

function normalizeJurisdictions(raw: any): Jurisdiction[] {
  if (Array.isArray(raw)) {
    return raw.filter((j): j is Jurisdiction => JURISDICTIONS.includes(j as Jurisdiction));
  }
  if (typeof raw === "string" && raw.trim()) {
    // support comma-separated legacy strings like "England, Wales"
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter((s): s is Jurisdiction => JURISDICTIONS.includes(s as Jurisdiction));
  }
  return [];
}

function CaseManagerCard({
  cm,
  onRefresh,
}: {
  cm: any;
  onRefresh: () => void;
}) {
  const [selectedJurisdictions, setSelectedJurisdictions] = useState<Jurisdiction[]>(
    normalizeJurisdictions(cm.primaryJurisdiction || cm.jurisdiction)
  );
  const [saving, setSaving] = useState(false);

  const toggleJurisdiction = (j: Jurisdiction) => {
    setSelectedJurisdictions((prev) =>
      prev.includes(j) ? prev.filter((x) => x !== j) : [...prev, j]
    );
  };

  const handleUpdate = async () => {
    if (selectedJurisdictions.length === 0) {
      alert("Please select at least one jurisdiction.");
      return;
    }
    try {
      setSaving(true);
      const jurisdictionValue = selectedJurisdictions.join(", ");
      await Axios.patch(`/admin/case-managers/${cm._id}/jurisdiction`, {
        jurisdiction: jurisdictionValue,
        primaryJurisdiction: jurisdictionValue,
      });
      alert(`Jurisdiction updated for ${cm.firstName} ${cm.lastName || ""}`);
      onRefresh();
    } catch (err: any) {
      console.error("Failed to update jurisdiction", err);
      alert(err?.response?.data?.message || "Failed to update jurisdiction");
    } finally {
      setSaving(false);
    }
  };

  const displayJurisdiction =
    normalizeJurisdictions(cm.primaryJurisdiction || cm.jurisdiction).join(", ") ||
    cm.primaryJurisdiction ||
    cm.jurisdiction ||
    "Not Assigned";

  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs">
      {/* Top row: avatar + info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center shrink-0">
          {(cm.firstName?.[0] || "C") + (cm.lastName?.[0] || "M")}
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            {cm.firstName} {cm.lastName}
          </h4>
          <p className="text-xs text-slate-500">{cm.email}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-semibold text-slate-500">Current Jurisdiction:</span>
            <span className="text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full">
              {displayJurisdiction}
            </span>
          </div>
        </div>
      </div>

      {/* Jurisdiction multi-select checkboxes */}
      <div className="mb-3">
        <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-2">
          Assign Jurisdictions (select one or more)
        </p>
        <div className="flex flex-wrap gap-2">
          {JURISDICTIONS.map((j) => {
            const checked = selectedJurisdictions.includes(j);
            return (
              <button
                key={j}
                type="button"
                onClick={() => toggleJurisdiction(j)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                  checked
                    ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:border-sky-400 hover:text-sky-700"
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                    checked
                      ? "bg-white/30 border-white/60"
                      : "border-slate-300"
                  }`}
                >
                  {checked && (
                    <svg viewBox="0 0 10 10" className="w-2 h-2 text-white fill-current">
                      <path d="M1.5 5.5 4 8 8.5 2" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                {j}
              </button>
            );
          })}
        </div>
        {selectedJurisdictions.length > 0 && (
          <p className="text-[10px] text-slate-400 mt-1.5">
            Selected: {selectedJurisdictions.join(", ")}
          </p>
        )}
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleUpdate}
          disabled={saving || selectedJurisdictions.length === 0}
          className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Jurisdiction"}
        </button>
      </div>
    </div>
  );
}

// ─── Section 2 Wrapper ────────────────────────────────────────────────────────

type Section2View = "add-company" | "add-lawyer" | "add-case-manager" | "view-companies" | "view-lawyers" | "view-case-managers";

function Section2LawyerManagement() {
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [lawyers, setLawyers] = useState<LawyerItem[]>([]);
  const [caseManagers, setCaseManagers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<Section2View>("add-company");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [editingLawyerId, setEditingLawyerId] = useState<string | null>(null);

  // `silent` refreshes the data without swapping the page for the loading spinner,
  // which would unmount an open form (and lose its state).
  const loadAll = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const [compRes, lawRes, cmRes] = await Promise.all([
        Axios.get("/admin/companies?limit=100"),
        Axios.get("/admin/lawyers?limit=100"),
        Axios.get("/admin/case-managers?limit=100"),
      ]);

      const compDocs = Array.isArray(compRes.data)
        ? compRes.data
        : compRes.data?.docs || [];

      const lawDocs = Array.isArray(lawRes.data)
        ? lawRes.data
        : lawRes.data?.docs || [];

      const cmDocs = Array.isArray(cmRes.data)
        ? cmRes.data
        : cmRes.data?.docs || [];

      const formattedComps: CompanyItem[] = compDocs.map((c: any) => ({
        id: c._id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        verified: c.verified,
        createdAt: c.createdAt,
        record: c as CompanyRecord,
      }));

      const formattedLaws: LawyerItem[] = lawDocs.map((l: any) => ({
        id: l._id,
        name: l.name,
        companyName: typeof l.company === "object" && l.company ? l.company.name : "Independent / Unassigned",
        verified: l.verified,
        status: l.status,
        createdAt: l.createdAt,
        record: l as LawyerRecord,
      }));

      setCompanies(formattedComps);
      setLawyers(formattedLaws);
      setCaseManagers(cmDocs);
    } catch (err) {
      console.error("Failed to load companies & lawyers:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleAddLawyerForCompany = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setActiveTab("add-lawyer");
  };

  const editingCompany = companies.find((c) => c.id === editingCompanyId);
  const editingLawyer = lawyers.find((l) => l.id === editingLawyerId);
  const companyOptions: CompanyOption[] = companies.map((c) => ({
    id: c.id,
    name: c.name,
    reference: c.record.companyNumber,
    inactive: c.record.status === "inactive",
  }));

  const TABS: { id: Section2View; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: "add-company", label: "Add Company", icon: <Building2 className="w-3.5 h-3.5" /> },
    { id: "add-lawyer", label: "Add Lawyer", icon: <User className="w-3.5 h-3.5" /> },
    { id: "add-case-manager", label: "Add Case Manager", icon: <User className="w-3.5 h-3.5" /> },
    { id: "view-case-managers", label: "Browse Case Managers", icon: <User className="w-3.5 h-3.5" />, count: caseManagers.length },
    { id: "view-companies", label: "Browse Companies", icon: <Building2 className="w-3.5 h-3.5" />, count: companies.length },
    { id: "view-lawyers", label: "Browse Lawyers", icon: <User className="w-3.5 h-3.5" />, count: lawyers.length },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Section 2 — Law Firm & Lawyer Management</h2>
            <p className="text-xs text-slate-500">
              Add companies/firms, register accredited lawyers by selecting their company, and manage records.
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 self-start sm:self-auto flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setEditingCompanyId(null);
                setEditingLawyerId(null);
                setActiveTab(tab.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/70 text-slate-700 font-bold">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-violet-600" />
          <span>Loading directory records...</span>
        </div>
      ) : (
        <>
          {/* TAB: ADD COMPANY */}
          {activeTab === "add-company" && (
            <CompanyForm
              mode="create"
              onSaved={() => loadAll(true)}
              onAddLawyerForCompany={handleAddLawyerForCompany}
            />
          )}

          {/* TAB: ADD LAWYER */}
          {activeTab === "add-lawyer" && (
            <LawyerForm
              mode="create"
              companies={companyOptions}
              initialCompanyId={selectedCompanyId}
              onSaved={() => loadAll(true)}
              onSwitchToAddCompany={() => setActiveTab("add-company")}
            />
          )}

          {/* TAB: ADD CASE MANAGER */}
          {activeTab === "add-case-manager" && (
            <CaseManagerCreationForm onCreated={loadAll} />
          )}

          {/* TAB: VIEW CASE MANAGERS */}
          {activeTab === "view-case-managers" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Registered Case Managers ({caseManagers.length})
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab("add-case-manager")}
                  className="flex items-center gap-1.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Case Manager</span>
                </button>
              </div>

              <div className="space-y-3">
                {caseManagers.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
                    <p>No case managers registered yet.</p>
                    <button
                      type="button"
                      onClick={() => setActiveTab("add-case-manager")}
                      className="inline-flex items-center gap-1.5 text-sky-700 font-bold hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add the first case manager
                    </button>
                  </div>
                ) : (
                  caseManagers.map((cm) => (
                    <CaseManagerCard key={cm._id} cm={cm} onRefresh={loadAll} />
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: VIEW COMPANIES */}
          {activeTab === "view-companies" && editingCompany && (
            <CompanyForm
              key={editingCompany.id}
              mode="edit"
              company={editingCompany.record}
              onSaved={() => loadAll(true)}
              onDone={() => setEditingCompanyId(null)}
              onCancel={() => setEditingCompanyId(null)}
            />
          )}

          {activeTab === "view-companies" && !editingCompany && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Registered Law Firms ({companies.length})
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab("add-company")}
                  className="flex items-center gap-1.5 text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Company</span>
                </button>
              </div>

              <div className="space-y-3">
                {companies.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
                    <p>No law firms added yet.</p>
                    <button
                      type="button"
                      onClick={() => setActiveTab("add-company")}
                      className="inline-flex items-center gap-1.5 text-violet-700 font-bold hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add the first company
                    </button>
                  </div>
                ) : (
                  companies.map((company) => (
                    <CompanyCard
                      key={company.id}
                      company={company}
                      onRefresh={loadAll}
                      onAddLawyer={handleAddLawyerForCompany}
                      onEdit={setEditingCompanyId}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: VIEW LAWYERS */}
          {activeTab === "view-lawyers" && editingLawyer && (
            <LawyerForm
              key={editingLawyer.id}
              mode="edit"
              lawyer={editingLawyer.record}
              companies={companyOptions}
              onSaved={() => loadAll(true)}
              onDone={() => setEditingLawyerId(null)}
              onCancel={() => setEditingLawyerId(null)}
              onSwitchToAddCompany={() => {
                setEditingLawyerId(null);
                setActiveTab("add-company");
              }}
            />
          )}

          {activeTab === "view-lawyers" && !editingLawyer && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Registered Lawyers ({lawyers.length})
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab("add-lawyer")}
                  className="flex items-center gap-1.5 text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Lawyer</span>
                </button>
              </div>

              <div className="space-y-3">
                {lawyers.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
                    <p>No lawyers registered yet.</p>
                    <button
                      type="button"
                      onClick={() => setActiveTab("add-lawyer")}
                      className="inline-flex items-center gap-1.5 text-violet-700 font-bold hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add the first lawyer
                    </button>
                  </div>
                ) : (
                  lawyers.map((lawyer) => (
                    <LawyerCard key={lawyer.id} lawyer={lawyer} onRefresh={loadAll} onEdit={setEditingLawyerId} />
                  ))
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Main AdminSettingsView ───────────────────────────────────────────────────

export const AdminSettingsView: React.FC = () => {
  return (
    <div className="max-w-[1340px] space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold font-serif text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-violet-600" />
          <span>System & Directory Settings</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure platform TopBar settings, maintain lawyer company directory, and manage accredited lawyers.
        </p>
      </div>

      {/* Section 1 */}
      <Section1TopBarSettings />

      {/* Section 2 */}
      <Section2LawyerManagement />
    </div>
  );
};

