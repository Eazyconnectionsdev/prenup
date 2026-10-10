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
    topBar1Toggle: false,
    topBar2Enabled: true,
    topBar2Toggle: false,
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
          topBar1Toggle: Boolean(res.data.topBar1Toggle ?? false),
          topBar2Enabled: Boolean(res.data.topBar2Enabled ?? true),
          topBar2Toggle: Boolean(res.data.topBar2Toggle ?? false),
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
            <p className="text-xs text-slate-500">Enable/disable and toggle visibility of global TopBar items</p>
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
                <th className="text-left py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  TopBar Element
                </th>
                <th className="text-center py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Enable / Disable
                </th>
                <th className="text-center py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Toggle Visibility
                </th>
              </tr>
            </thead>
            <tbody>
              {/* TopBar-1 */}
              <tr className="border-b border-slate-50">
                <td className="py-3 px-3 font-semibold text-slate-700">TopBar-1 Navigation</td>
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
                <td className="py-3 px-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSettings((s) => ({ ...s, topBar1Toggle: !s.topBar1Toggle }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        settings.topBar1Toggle ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.topBar1Toggle ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span className={`text-xs font-semibold ${settings.topBar1Toggle ? "text-emerald-600" : "text-slate-400"}`}>
                      {settings.topBar1Toggle ? "Visible" : "Hidden"}
                    </span>
                  </div>
                </td>
              </tr>

              {/* TopBar-2 */}
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-700">TopBar-2 Navigation</td>
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
                <td className="py-3 px-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSettings((s) => ({ ...s, topBar2Toggle: !s.topBar2Toggle }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        settings.topBar2Toggle ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.topBar2Toggle ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span className={`text-xs font-semibold ${settings.topBar2Toggle ? "text-emerald-600" : "text-slate-400"}`}>
                      {settings.topBar2Toggle ? "Visible" : "Hidden"}
                    </span>
                  </div>
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
}: {
  company: CompanyItem;
  onRefresh: () => void;
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

function CompanyCreationForm({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
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
      await Axios.post("/admin/companies", form);
      setForm({
        name: "",
        companyNumber: "",
        address: "",
        email: "",
        phone: "",
        website: "",
        notes: "",
      });
      setOpen(false);
      onCreated();
    } catch (err: any) {
      console.error("Failed to create company:", err);
      alert(err?.response?.data?.message || "Failed to create company.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 bg-slate-50/40">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-xs font-bold text-violet-700 hover:text-violet-900 transition-colors cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>{open ? "Cancel Form" : "Add New Law Firm / Company"}</span>
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Company / Firm Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Blake Cassels LLP"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Company Reference Number</label>
              <input
                value={form.companyNumber}
                onChange={(e) => setForm((f) => ({ ...f, companyNumber: e.target.value }))}
                placeholder="e.g. BC-001"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="info@firm.com"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Phone Number</label>
              <input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+44 20 7946 0912"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Website</label>
              <input
                value={form.website}
                onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                placeholder="https://firm.com"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Registered Address</label>
              <input
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                placeholder="199 Bay St, Suite 400"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <RefreshCw className="w-3 h-3 animate-spin" />}
              <span>{saving ? "Saving Company..." : "Save Company"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function LawyerCreationForm({
  companies,
  onCreated,
}: {
  companies: CompanyItem[];
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    externalId: "",
    name: "",
    company: "",
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

      setForm({
        externalId: "",
        name: "",
        company: "",
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
      setOpen(false);
      onCreated();
    } catch (err: any) {
      console.error("Failed to create lawyer:", err);
      alert(err?.response?.data?.message || "Failed to create lawyer.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 bg-slate-50/40">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-xs font-bold text-violet-700 hover:text-violet-900 transition-colors cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>{open ? "Cancel Form" : "Add New Lawyer"}</span>
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Robert Miller, Esq."
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Associated Law Firm <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500 font-medium"
              >
                <option value="" disabled>Select Law Firm</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Bar Registration Number</label>
              <input
                value={form.barNumber}
                onChange={(e) => setForm((f) => ({ ...f, barNumber: e.target.value }))}
                placeholder="e.g. LSO-45123"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Pricing / Rate Text</label>
              <input
                value={form.priceText}
                onChange={(e) => setForm((f) => ({ ...f, priceText: e.target.value }))}
                placeholder="e.g. £350/hour + VAT"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Public Email</label>
              <input
                type="email"
                value={form.publicEmail}
                onChange={(e) => setForm((f) => ({ ...f, publicEmail: e.target.value }))}
                placeholder="rmiller@firm.com"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Public Phone</label>
              <input
                value={form.publicPhone}
                onChange={(e) => setForm((f) => ({ ...f, publicPhone: e.target.value }))}
                placeholder="+44 20 7946 0913"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Direct Email</label>
              <input
                type="email"
                value={form.directEmail}
                onChange={(e) => setForm((f) => ({ ...f, directEmail: e.target.value }))}
                placeholder="direct@firm.com"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Direct Phone</label>
              <input
                value={form.directPhone}
                onChange={(e) => setForm((f) => ({ ...f, directPhone: e.target.value }))}
                placeholder="+44 77 0090 0144"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <RefreshCw className="w-3 h-3 animate-spin" />}
              <span>{saving ? "Saving Lawyer..." : "Save Lawyer"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// ─── Section 2 Wrapper ────────────────────────────────────────────────────────

type Section2View = "view-companies" | "view-lawyers" | "create";

function Section2LawyerManagement() {
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [lawyers, setLawyers] = useState<LawyerItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<Section2View>("view-companies");

  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      const [compRes, lawRes] = await Promise.all([
        Axios.get("/admin/companies?limit=100"),
        Axios.get("/admin/lawyers?limit=100"),
      ]);

      const compDocs = Array.isArray(compRes.data)
        ? compRes.data
        : compRes.data?.docs || [];

      const lawDocs = Array.isArray(lawRes.data)
        ? lawRes.data
        : lawRes.data?.docs || [];

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
    } catch (err) {
      console.error("Failed to load companies & lawyers:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const TABS: { id: Section2View; label: string; count?: number }[] = [
    { id: "view-companies", label: "Law Firms", count: companies.length },
    { id: "view-lawyers", label: "Lawyers", count: lawyers.length },
    { id: "create", label: "Add New" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Section 2 — Lawyer & Law Firm Directory</h2>
            <p className="text-xs text-slate-500">
              {companies.length} legal firms · {lawyers.length} registered lawyers
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 self-start sm:self-auto">
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
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/70 text-slate-700">
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
          {/* TAB: CREATE */}
          {activeTab === "create" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>Create Law Firm / Company</span>
                </h3>
                <CompanyCreationForm onCreated={loadAll} />
              </div>

              <div className="border-t border-slate-100 pt-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Create Lawyer Profile</span>
                </h3>
                <LawyerCreationForm companies={companies} onCreated={loadAll} />
              </div>
            </div>
          )}

          {/* TAB: VIEW COMPANIES */}
          {activeTab === "view-companies" && (
            <div className="space-y-3">
              {companies.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No law firms added yet. Click &quot;Add New&quot; to register your first firm.
                </div>
              ) : (
                companies.map((company) => (
                  <CompanyCard key={company.id} company={company} onRefresh={loadAll} />
                ))
              )}
            </div>
          )}

          {/* TAB: VIEW LAWYERS */}
          {activeTab === "view-lawyers" && (
            <div className="space-y-3">
              {lawyers.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No lawyers added yet. Click &quot;Add New&quot; to register a lawyer profile.
                </div>
              ) : (
                lawyers.map((lawyer) => (
                  <LawyerCard key={lawyer.id} lawyer={lawyer} onRefresh={loadAll} />
                ))
              )}
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

