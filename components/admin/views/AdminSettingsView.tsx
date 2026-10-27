"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Axios from "@/lib/ApiConfig";
import {
  ChevronDown,
  ChevronUp,
  Paperclip,
  X,
  Plus,
  Eye,
  Building2,
  User,
  StickyNote,
  Upload,
  Settings,
  RefreshCw,
  Check,
  AlertCircle,
  ShieldCheck,
  Archive,
  Phone,
  Mail,
  Globe,
} from "lucide-react";

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface AttachmentItem {
  id: string;
  name: string;
  size: string;
  type: string;
  url?: string;
  uploadedAt: string;
}

interface NoteItem {
  id: string;
  text: string;
  createdAt: string;
}

interface CompanyItem {
  id: string;
  name: string;
  companyNumber?: string;
  address?: string;
  email?: string;
  phone?: string;
  website?: string;
  notesList: NoteItem[];
  attachmentsList: AttachmentItem[];
  verified?: boolean;
  createdAt?: string;
}

interface LawyerItem {
  id: string;
  externalId?: string;
  name: string;
  companyId: string;
  companyName: string;
  publicEmail?: string;
  publicPhone?: string;
  directEmail?: string;
  directPhone?: string;
  website?: string;
  profileLink?: string;
  address?: string;
  barNumber?: string;
  priceText?: string;
  notesList: NoteItem[];
  attachmentsList: AttachmentItem[];
  verified?: boolean;
  status?: string;
  createdAt?: string;
}

function formatFileSize(bytes: number): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Sub-components: Attachment & Note Panels ─────────────────────────────────

function AttachmentPanel({
  attachments,
  onUpload,
  onRemove,
  isUploading,
}: {
  attachments: AttachmentItem[];
  onUpload: (file: File) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  isUploading?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2">
        <Paperclip className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          Attachments ({attachments.length})
        </span>
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileRef.current?.click()}
          className="ml-auto flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-full transition-colors cursor-pointer disabled:opacity-50"
        >
          {isUploading ? (
            <RefreshCw className="w-3 h-3 animate-spin text-violet-600" />
          ) : (
            <Upload className="w-3 h-3" />
          )}
          <span>{isUploading ? "Uploading..." : "Upload"}</span>
        </button>
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              await onUpload(file);
              e.target.value = "";
            }
          }}
        />
      </div>

      {attachments.length === 0 && (
        <p className="text-xs text-slate-400 italic px-1">No attachments uploaded.</p>
      )}

      <ul className="space-y-1">
        {attachments.map((att) => (
          <li
            key={att.id}
            className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs"
          >
            <Paperclip className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {att.url ? (
              <a
                href={att.url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 truncate text-violet-700 hover:underline font-medium"
              >
                {att.name}
              </a>
            ) : (
              <span className="flex-1 truncate text-slate-700 font-medium">{att.name}</span>
            )}
            <span className="text-slate-400 text-[11px]">{att.size}</span>
            <button
              type="button"
              onClick={() => onRemove(att.id)}
              className="text-slate-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
              title="Delete Attachment"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NotesPanel({
  notes,
  onAdd,
  onRemove,
  isAdding,
}: {
  notes: NoteItem[];
  onAdd: (text: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  isAdding?: boolean;
}) {
  const [draft, setDraft] = useState("");

  const handleAddNote = async () => {
    if (!draft.trim()) return;
    await onAdd(draft.trim());
    setDraft("");
  };

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2">
        <StickyNote className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          Notes ({notes.length})
        </span>
      </div>

      <ul className="space-y-1 mb-2">
        {notes.length === 0 && (
          <p className="text-xs text-slate-400 italic px-1">No notes recorded.</p>
        )}
        {notes.map((note) => (
          <li
            key={note.id}
            className="flex items-start gap-2 bg-amber-50/70 border border-amber-200/80 rounded-lg px-3 py-2 text-xs"
          >
            <span className="flex-1 text-slate-800 leading-relaxed">{note.text}</span>
            <span className="text-slate-400 text-[10px] whitespace-nowrap ml-2">
              {note.createdAt}
            </span>
            <button
              type="button"
              onClick={() => onRemove(note.id)}
              className="text-slate-400 hover:text-red-500 transition-colors p-0.5 cursor-pointer"
              title="Delete Note"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <textarea
          rows={2}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add an internal note…"
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs resize-none focus:outline-none focus:border-violet-500 bg-white"
        />
        <button
          type="button"
          disabled={isAdding || !draft.trim()}
          onClick={handleAddNote}
          className="self-end flex items-center gap-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer shadow-2xs font-semibold"
        >
          {isAdding ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
          <span>Add</span>
        </button>
      </div>
    </div>
  );
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

function CompanyCard({
  company,
  onRefresh,
  onAddLawyer,
}: {
  company: CompanyItem;
  onRefresh: () => void;
  onAddLawyer?: (companyId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Load detailed notes & attachments when expanded
  const [details, setDetails] = useState<{
    attachments: AttachmentItem[];
    notes: NoteItem[];
  }>({
    attachments: company.attachmentsList,
    notes: company.notesList,
  });

  const loadDetails = useCallback(async () => {
    try {
      const res = await Axios.get(`/admin/companies/${company.id}`);
      if (res.data) {
        const rawAtts = res.data.attachments || [];
        const rawNotes = res.data.notes || [];

        setDetails({
          attachments: rawAtts.map((a: any) => ({
            id: a._id,
            name: a.fileName || "File",
            size: formatFileSize(a.fileSize),
            type: a.mimeType || "application/octet-stream",
            url: a.fileUrl,
            uploadedAt: a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "",
          })),
          notes: rawNotes.map((n: any) => ({
            id: n._id,
            text: n.content,
            createdAt: n.createdAt ? new Date(n.createdAt).toLocaleDateString() : "",
          })),
        });
      }
    } catch (err) {
      console.warn("Could not load company detail:", err);
    }
  }, [company.id]);

  useEffect(() => {
    if (expanded) {
      loadDetails();
    }
  }, [expanded, loadDetails]);

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

  const handleUploadAttachment = async (file: File) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      await Axios.post(`/admin/companies/${company.id}/attachments`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await loadDetails();
      onRefresh();
    } catch (err) {
      console.error("Failed to upload company attachment:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAttachment = async (attId: string) => {
    try {
      await Axios.delete(`/admin/companies/${company.id}/attachments/${attId}`);
      await loadDetails();
      onRefresh();
    } catch (err) {
      console.error("Failed to delete company attachment:", err);
    }
  };

  const handleAddNote = async (text: string) => {
    try {
      setIsAddingNote(true);
      await Axios.post(`/admin/companies/${company.id}/notes`, { content: text });
      await loadDetails();
      onRefresh();
    } catch (err) {
      console.error("Failed to add company note:", err);
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await Axios.delete(`/admin/companies/${company.id}/notes/${noteId}`);
      await loadDetails();
      onRefresh();
    } catch (err) {
      console.error("Failed to delete company note:", err);
    }
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-50/70 hover:bg-slate-100/70 transition-colors">
        <Building2 className="w-5 h-5 text-slate-500 shrink-0" />
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpanded((v) => !v)}>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-800">{company.name}</span>
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
            {details.attachments.length} files · {details.notes.length} notes
          </span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-xs">
            <div>
              <div className="text-slate-400 font-semibold mb-0.5 uppercase text-[10px]">Company Number</div>
              <div className="font-medium text-slate-700">{company.companyNumber || "—"}</div>
            </div>
            <div>
              <div className="text-slate-400 font-semibold mb-0.5 uppercase text-[10px]">Website</div>
              <div className="font-medium text-slate-700">
                {company.website ? (
                  <a href={company.website} target="_blank" rel="noreferrer" className="text-violet-600 hover:underline">
                    {company.website}
                  </a>
                ) : (
                  "—"
                )}
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="text-slate-400 font-semibold mb-0.5 uppercase text-[10px]">Registered Address</div>
              <div className="font-medium text-slate-700">{company.address || "—"}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-3 border-t border-slate-100">
            <AttachmentPanel
              attachments={details.attachments}
              onUpload={handleUploadAttachment}
              onRemove={handleDeleteAttachment}
              isUploading={isUploading}
            />
            <NotesPanel
              notes={details.notes}
              onAdd={handleAddNote}
              onRemove={handleDeleteNote}
              isAdding={isAddingNote}
            />
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
}: {
  lawyer: LawyerItem;
  onRefresh: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [archiving, setArchiving] = useState(false);

  const [details, setDetails] = useState<{
    attachments: AttachmentItem[];
    notes: NoteItem[];
  }>({
    attachments: lawyer.attachmentsList,
    notes: lawyer.notesList,
  });

  const loadDetails = useCallback(async () => {
    try {
      const res = await Axios.get(`/admin/lawyers/${lawyer.id}`);
      if (res.data) {
        const rawAtts = res.data.attachments || [];
        const rawNotes = res.data.notes || [];

        setDetails({
          attachments: rawAtts.map((a: any) => ({
            id: a._id,
            name: a.fileName || "File",
            size: formatFileSize(a.fileSize),
            type: a.mimeType || "application/octet-stream",
            url: a.fileUrl,
            uploadedAt: a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "",
          })),
          notes: rawNotes.map((n: any) => ({
            id: n._id,
            text: n.content,
            createdAt: n.createdAt ? new Date(n.createdAt).toLocaleDateString() : "",
          })),
        });
      }
    } catch (err) {
      console.warn("Could not load lawyer detail:", err);
    }
  }, [lawyer.id]);

  useEffect(() => {
    if (expanded) {
      loadDetails();
    }
  }, [expanded, loadDetails]);

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

  const handleUploadAttachment = async (file: File) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      await Axios.post(`/admin/lawyers/${lawyer.id}/attachments`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await loadDetails();
      onRefresh();
    } catch (err) {
      console.error("Failed to upload lawyer attachment:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAttachment = async (attId: string) => {
    try {
      await Axios.delete(`/admin/lawyers/${lawyer.id}/attachments/${attId}`);
      await loadDetails();
      onRefresh();
    } catch (err) {
      console.error("Failed to delete lawyer attachment:", err);
    }
  };

  const handleAddNote = async (text: string) => {
    try {
      setIsAddingNote(true);
      await Axios.post(`/admin/lawyers/${lawyer.id}/notes`, { content: text });
      await loadDetails();
      onRefresh();
    } catch (err) {
      console.error("Failed to add lawyer note:", err);
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await Axios.delete(`/admin/lawyers/${lawyer.id}/notes/${noteId}`);
      await loadDetails();
      onRefresh();
    } catch (err) {
      console.error("Failed to delete lawyer note:", err);
    }
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-50/70 hover:bg-slate-100/70 transition-colors">
        <User className="w-5 h-5 text-slate-500 shrink-0" />
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpanded((v) => !v)}>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-800">{lawyer.name}</span>
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

            {lawyer.status === "archived" ? (
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
            {lawyer.companyName} · Bar: {lawyer.barNumber || "—"} · {lawyer.publicEmail || "No email"}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-700 cursor-pointer p-1"
        >
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            {details.attachments.length} files · {details.notes.length} notes
          </span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-xs">
            <div>
              <div className="text-slate-400 font-semibold mb-0.5 uppercase text-[10px]">Public Email</div>
              <div className="font-medium text-slate-700">{lawyer.publicEmail || "—"}</div>
            </div>
            <div>
              <div className="text-slate-400 font-semibold mb-0.5 uppercase text-[10px]">Public Phone</div>
              <div className="font-medium text-slate-700">{lawyer.publicPhone || "—"}</div>
            </div>
            <div>
              <div className="text-slate-400 font-semibold mb-0.5 uppercase text-[10px]">Direct Email</div>
              <div className="font-medium text-slate-700">{lawyer.directEmail || "—"}</div>
            </div>
            <div>
              <div className="text-slate-400 font-semibold mb-0.5 uppercase text-[10px]">Direct Phone</div>
              <div className="font-medium text-slate-700">{lawyer.directPhone || "—"}</div>
            </div>
            <div>
              <div className="text-slate-400 font-semibold mb-0.5 uppercase text-[10px]">Bar Number</div>
              <div className="font-medium text-slate-700">{lawyer.barNumber || "—"}</div>
            </div>
            <div>
              <div className="text-slate-400 font-semibold mb-0.5 uppercase text-[10px]">Fee / Rate</div>
              <div className="font-medium text-slate-700">{lawyer.priceText || "Standard Rate"}</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-slate-400 font-semibold mb-0.5 uppercase text-[10px]">Office Address</div>
              <div className="font-medium text-slate-700">{lawyer.address || "—"}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-3 border-t border-slate-100">
            <AttachmentPanel
              attachments={details.attachments}
              onUpload={handleUploadAttachment}
              onRemove={handleDeleteAttachment}
              isUploading={isUploading}
            />
            <NotesPanel
              notes={details.notes}
              onAdd={handleAddNote}
              onRemove={handleDeleteNote}
              isAdding={isAddingNote}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Section 2: Creation Forms ────────────────────────────────────────────────

function CompanyCreationForm({
  onCreated,
  onAddLawyerForCompany,
}: {
  onCreated: () => void;
  onAddLawyerForCompany?: (companyId: string, companyName: string) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [createdCompany, setCreatedCompany] = useState<{ id: string; name: string } | null>(null);
  const [form, setForm] = useState({
    name: "",
    companyNumber: "",
    address: "",
    email: "",
    phone: "",
    website: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    try {
      setSaving(true);
      const res = await Axios.post("/admin/companies", form);
      const newComp = res.data;
      const compId = newComp?._id || newComp?.id;
      const compName = newComp?.name || form.name;

      if (compId) {
        setCreatedCompany({ id: compId, name: compName });
      }

      setForm({
        name: "",
        companyNumber: "",
        address: "",
        email: "",
        phone: "",
        website: "",
        notes: "",
      });
      onCreated();
    } catch (err: any) {
      console.error("Failed to create company:", err);
      alert(err?.response?.data?.message || "Failed to create company.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {createdCompany && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-emerald-900">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="font-bold text-sm text-emerald-950">
                Company &quot;{createdCompany.name}&quot; registered successfully!
              </p>
              <p className="text-emerald-700 text-xs mt-0.5">
                You can now add lawyers and link them directly to this law firm.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {onAddLawyerForCompany && (
              <button
                type="button"
                onClick={() => {
                  onAddLawyerForCompany(createdCompany.id, createdCompany.name);
                  setCreatedCompany(null);
                }}
                className="px-3.5 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Lawyer to {createdCompany.name}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setCreatedCompany(null)}
              className="px-3 py-2 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-medium rounded-lg transition-colors cursor-pointer"
            >
              Add Another Firm
            </button>
          </div>
        </div>
      )}

      <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-2xs">
        <div className="mb-4 pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-violet-600" />
            <span>Add New Law Firm / Company</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Register a company into the directory. After saving, you will be able to select it when adding lawyers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Company / Firm Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Blake, Cassels & Graydon LLP"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Company Reference Number</label>
              <input
                value={form.companyNumber}
                onChange={(e) => setForm((f) => ({ ...f, companyNumber: e.target.value }))}
                placeholder="e.g. BC-10482"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Official Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="contact@blakes.com"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Phone Number</label>
              <input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+1 416 863 2400"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Website URL</label>
              <input
                value={form.website}
                onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                placeholder="https://www.blakes.com"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Registered Office Address</label>
              <input
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                placeholder="199 Bay St., Suite 4000, Toronto, ON"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Internal Notes</label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Initial background information or internal admin notes regarding this law firm..."
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>{saving ? "Saving Company..." : "Save Company"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function LawyerCreationForm({
  companies,
  initialCompanyId,
  onCreated,
  onSwitchToAddCompany,
}: {
  companies: CompanyItem[];
  initialCompanyId?: string;
  onCreated: () => void;
  onSwitchToAddCompany: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [createdLawyer, setCreatedLawyer] = useState<{ name: string; companyName: string } | null>(null);
  const [form, setForm] = useState({
    externalId: "",
    name: "",
    company: initialCompanyId || (companies[0]?.id || ""),
    loginEmail: "",
    password: "",
    publicEmail: "",
    publicPhone: "",
    directEmail: "",
    directPhone: "",
    website: "",
    profileLink: "",
    address: "",
    barNumber: "",
    priceText: "",
    notes: "",
  });

  useEffect(() => {
    if (initialCompanyId) {
      setForm((f) => ({ ...f, company: initialCompanyId }));
    } else if (!form.company && companies.length > 0) {
      setForm((f) => ({ ...f, company: companies[0].id }));
    }
  }, [initialCompanyId, companies]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.company) return;

    try {
      setSaving(true);
      const generatedExternalId =
        form.externalId.trim() || `LAW-${Date.now().toString().slice(-6)}`;

      await Axios.post("/admin/lawyers", {
        ...form,
        externalId: generatedExternalId,
      });

      const assignedCompany = companies.find((c) => c.id === form.company);
      setCreatedLawyer({
        name: form.name,
        companyName: assignedCompany?.name || "Selected Company",
      });

      setForm((prev) => ({
        ...prev,
        externalId: "",
        name: "",
        loginEmail: "",
        password: "",
        publicEmail: "",
        publicPhone: "",
        directEmail: "",
        directPhone: "",
        website: "",
        profileLink: "",
        address: "",
        barNumber: "",
        priceText: "",
        notes: "",
      }));
      onCreated();
    } catch (err: any) {
      console.error("Failed to create lawyer:", err);
      alert(err?.response?.data?.message || "Failed to create lawyer.");
    } finally {
      setSaving(false);
    }
  };

  if (companies.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-amber-600">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-amber-950">No Companies / Law Firms Available</h3>
          <p className="text-xs text-amber-800 max-w-md mx-auto mt-1">
            Lawyers must be associated with a registered company. Please add at least one company first before creating lawyer profiles.
          </p>
        </div>
        <button
          type="button"
          onClick={onSwitchToAddCompany}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Company First</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {createdLawyer && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-emerald-900">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="font-bold text-sm text-emerald-950">
                Lawyer &quot;{createdLawyer.name}&quot; registered successfully!
              </p>
              <p className="text-emerald-700 text-xs mt-0.5">
                Profile is active and linked to {createdLawyer.companyName}.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCreatedLawyer(null)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Add Another Lawyer
          </button>
        </div>
      )}

      <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-2xs">
        <div className="mb-4 pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <User className="w-4 h-4 text-violet-600" />
            <span>Add Lawyer (Select Law Firm / Company)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Select the company to assign this lawyer to and fill in their professional credentials.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Company Selection Header Card */}
          <div className="bg-violet-50/70 border border-violet-200/80 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <label className="text-xs font-bold text-violet-950 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-violet-600" />
                <span>Associated Company / Law Firm <span className="text-red-500">*</span></span>
              </label>
              <button
                type="button"
                onClick={onSwitchToAddCompany}
                className="text-xs text-violet-700 hover:text-violet-900 font-semibold cursor-pointer hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Register Another Company</span>
              </button>
            </div>
            <select
              required
              value={form.company}
              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              className="w-full rounded-lg border border-violet-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-violet-600 shadow-2xs"
            >
              <option value="" disabled>-- Select Company / Law Firm --</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.companyNumber ? `(Ref: ${c.companyNumber})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* ── Login Account Credentials ─────────────────────────────── */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-amber-950">Login Account Credentials</span>
              <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full ml-1">
                Pre-verified · No OTP required
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-amber-900 block mb-1">
                  Login Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.loginEmail}
                  onChange={(e) => setForm((f) => ({ ...f, loginEmail: e.target.value }))}
                  placeholder="lawyer@firm.com"
                  className="w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-amber-900 block mb-1">
                  Password <span className="text-red-500">*</span>{" "}
                  <span className="font-normal text-amber-700">(min 8 characters)</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Lawyer Full Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Robert Miller, KC"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Bar Registration Number</label>
              <input
                value={form.barNumber}
                onChange={(e) => setForm((f) => ({ ...f, barNumber: e.target.value }))}
                placeholder="e.g. LSO-84920"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Pricing / Rate Text</label>
              <input
                value={form.priceText}
                onChange={(e) => setForm((f) => ({ ...f, priceText: e.target.value }))}
                placeholder="e.g. £350/hour + VAT (Fixed fee options available)"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Public Display Email</label>
              <input
                type="email"
                value={form.publicEmail}
                onChange={(e) => setForm((f) => ({ ...f, publicEmail: e.target.value }))}
                placeholder="rmiller@firm.com"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Public Phone</label>
              <input
                value={form.publicPhone}
                onChange={(e) => setForm((f) => ({ ...f, publicPhone: e.target.value }))}
                placeholder="+14165550192"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Direct / Internal Email</label>
              <input
                type="email"
                value={form.directEmail}
                onChange={(e) => setForm((f) => ({ ...f, directEmail: e.target.value }))}
                placeholder="direct-rmiller@firm.com"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Direct Phone</label>
              <input
                value={form.directPhone}
                onChange={(e) => setForm((f) => ({ ...f, directPhone: e.target.value }))}
                placeholder="+14165550193"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Profile / Bio Link</label>
              <input
                value={form.profileLink}
                onChange={(e) => setForm((f) => ({ ...f, profileLink: e.target.value }))}
                placeholder="https://firm.com/lawyers/robert-miller"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Firm Website</label>
              <input
                value={form.website}
                onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                placeholder="https://firm.com"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Office Address</label>
              <input
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                placeholder="Suite 500, 100 King St W, Toronto, ON"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Bio & Experience Notes</label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Professional background, specializations, or internal lawyer notes..."
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>{saving ? "Saving Lawyer..." : "Save Lawyer"}</span>
            </button>
          </div>
        </form>
      </div>
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

function CaseManagerCard({
  cm,
  onRefresh,
}: {
  cm: any;
  onRefresh: () => void;
}) {
  const [jurisdiction, setJurisdiction] = useState(
    cm.primaryJurisdiction || cm.jurisdiction || "England & Wales"
  );
  const [saving, setSaving] = useState(false);

  const handleUpdate = async () => {
    try {
      setSaving(true);
      await Axios.patch(`/admin/case-managers/${cm._id}/jurisdiction`, {
        jurisdiction,
        primaryJurisdiction: jurisdiction,
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

  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center shrink-0">
          {(cm.firstName?.[0] || "C") + (cm.lastName?.[0] || "M")}
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            {cm.firstName} {cm.lastName}
          </h4>
          <p className="text-xs text-slate-500">{cm.email}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-semibold text-slate-500">Jurisdiction:</span>
            <span className="text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full">
              {cm.primaryJurisdiction || cm.jurisdiction || "Not Assigned"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={jurisdiction}
          onChange={(e) => setJurisdiction(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-sky-500"
        >
          <option value="England & Wales">England &amp; Wales</option>
          <option value="England">England</option>
          <option value="Wales">Wales</option>
          <option value="Scotland">Scotland</option>
          <option value="Northern Ireland">Northern Ireland</option>
          <option value="Scotland, Wales and England">Scotland, Wales and England</option>
        </select>

        <button
          type="button"
          onClick={handleUpdate}
          disabled={saving}
          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Update"}
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

  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
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
        companyNumber: c.companyNumber,
        address: c.address,
        email: c.email,
        phone: c.phone,
        website: c.website,
        verified: c.verified,
        notesList: [],
        attachmentsList: [],
        createdAt: c.createdAt,
      }));

      const formattedLaws: LawyerItem[] = lawDocs.map((l: any) => ({
        id: l._id,
        externalId: l.externalId,
        name: l.name,
        companyId: typeof l.company === "object" && l.company ? l.company._id : l.company,
        companyName: typeof l.company === "object" && l.company ? l.company.name : "Independent / Unassigned",
        publicEmail: l.publicEmail,
        publicPhone: l.publicPhone,
        directEmail: l.directEmail,
        directPhone: l.directPhone,
        website: l.website,
        profileLink: l.profileLink,
        address: l.address,
        barNumber: l.barNumber,
        priceText: l.priceText,
        verified: l.verified,
        status: l.status,
        notesList: [],
        attachmentsList: [],
        createdAt: l.createdAt,
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
              onClick={() => setActiveTab(tab.id)}
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
            <CompanyCreationForm
              onCreated={loadAll}
              onAddLawyerForCompany={handleAddLawyerForCompany}
            />
          )}

          {/* TAB: ADD LAWYER */}
          {activeTab === "add-lawyer" && (
            <LawyerCreationForm
              companies={companies}
              initialCompanyId={selectedCompanyId}
              onCreated={loadAll}
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
          {activeTab === "view-companies" && (
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
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: VIEW LAWYERS */}
          {activeTab === "view-lawyers" && (
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
                    <LawyerCard key={lawyer.id} lawyer={lawyer} onRefresh={loadAll} />
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

