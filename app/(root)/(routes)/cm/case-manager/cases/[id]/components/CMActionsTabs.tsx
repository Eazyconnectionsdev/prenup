"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Axios from "@/lib/ApiConfig";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/lib/api/http-error";
import {
  CheckCircle2,
  UserCheck,
  ShieldAlert,
  ArrowLeft,
  Upload,
  FileText,
  X,
  FileCheck2,
  AlertCircle,
} from "lucide-react";
import type { Props } from "@/types/case-detail/tabs/cm-actions-tabs";

const NOTE_CATEGORIES = [
  { label: "Operational Note", value: "OPERATIONAL" },
  { label: "Clarification Note", value: "CLARIFICATION" },
  { label: "Escalation Note", value: "ESCALATION" },
  { label: "Risk Note", value: "RISK" },
  { label: "Complaint Note", value: "COMPLAINT" },
];

interface FileUploadProps {
  id: string;
  files: File[];
  onChange: (files: File[]) => void;
  multiple?: boolean;
}

function FancyFileUpload({ id, files, onChange, multiple = true }: FileUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    if (multiple) {
      onChange([...files, ...selected]);
    } else {
      onChange(selected.slice(0, 1));
    }
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        id={id}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor={id}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer shadow-xs transition-colors hover:border-slate-400 shrink-0"
        >
          <Upload className="w-3.5 h-3.5 text-sky-600" />
          <span>{multiple ? "Choose Files" : "Choose File"}</span>
        </label>
        <span className="text-[11px] text-slate-400">
          {files.length === 0
            ? multiple
              ? "Multiple files supported (PDF, DOCX, PNG, JPG up to 10MB each)"
              : "Supported formats: PDF, DOCX, PNG, JPG up to 10MB"
            : `${files.length} file${files.length > 1 ? "s" : ""} selected`}
        </span>
      </div>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-xs text-slate-700 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span className="truncate max-w-[200px] font-medium" title={file.name}>
                {file.name}
              </span>
              <span className="text-[10px] text-slate-400">
                ({(file.size / 1024).toFixed(0)} KB)
              </span>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="text-slate-400 hover:text-rose-600 ml-1 p-0.5 cursor-pointer"
                title="Remove file"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CMActionsTab({ caseData }: Props) {
  const caseId = caseData?._id;
  const [loading, setLoading] = useState(false);

  // Redux user role check (Admin check for re-assignment)
  const currentUser = useSelector((state: RootState) => state.auth?.user);
  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "superadmin";

  // 1. Case Details / Priority
  const [priority, setPriority] = useState<string>(caseData?.priority || "LOW");
  const [savingPriority, setSavingPriority] = useState(false);

  // 2. Case Assignment
  const [caseManagers, setCaseManagers] = useState<any[]>([]);
  const [selectedCm, setSelectedCm] = useState<string>("");
  const [assigningCm, setAssigningCm] = useState(false);
  const alreadyAssigned = Boolean(caseData?.assignedCaseManager);
  const canAssign = !alreadyAssigned || isAdmin;

  // 3. Return To Draft
  const [draftReason, setDraftReason] = useState("");
  const [draftFiles, setDraftFiles] = useState<File[]>([]);

  // 3. Approval
  const [p1Files, setP1Files] = useState<File[]>([]);
  const [p2Files, setP2Files] = useState<File[]>([]);
  const [p1Notes, setP1Notes] = useState("");
  const [p2Notes, setP2Notes] = useState("");
  const isApproved = Boolean(caseData?.cmApproved);

  // 4. Notes
  const [notes, setNotes] = useState<any[]>([]);
  const [noteCategory, setNoteCategory] = useState("");
  const [noteText, setNoteText] = useState("");

  const p1Name = caseData?.owner
    ? `${caseData.owner.firstName || ""} ${caseData.owner.lastName || ""}`.trim() || "Primary Applicant"
    : "Primary Applicant";

  const p2Name = caseData?.invitedUser
    ? `${caseData.invitedUser.firstName || ""} ${caseData.invitedUser.lastName || ""}`.trim() || "Secondary Applicant"
    : "Secondary Applicant";

  const loadCaseManagers = async () => {
    try {
      const { data } = await Axios.get("/admin/case-managers");
      const list = Array.isArray(data) ? data : Array.isArray(data?.docs) ? data.docs : [];
      setCaseManagers(list);
    } catch (err) {
      console.error("Failed to load case managers", err);
    }
  };

  const loadNotes = async () => {
    try {
      const { data } = await Axios.get(`/case-manager/${caseId}/notes`);
      setNotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!caseId) return;
    loadNotes();
    loadCaseManagers();
  }, [caseId]);

  // ── 1. Save Priority ──────────────────────────────────────────────────────────
  const handleSavePriority = async () => {
    try {
      setSavingPriority(true);
      await Axios.put(`/cases/${caseId}`, { priority });
      toast.success("Case priority updated successfully");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update priority"));
    } finally {
      setSavingPriority(false);
    }
  };

  // ── 2. Assign Case Manager ────────────────────────────────────────────────────
  const handleAssignCaseManager = async () => {
    if (!selectedCm) {
      alert("Please select a Case Manager.");
      return;
    }
    if (!canAssign) {
      alert("Only an Administrator can re-assign this case.");
      return;
    }
    try {
      setAssigningCm(true);
      await Axios.post(`/cases/${caseId}/assign-case-manager`, { managerId: selectedCm });
      const label = alreadyAssigned ? "Case re-assigned successfully." : "Case assigned to Case Manager successfully.";
      toast.success(label);
      setSelectedCm("");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to assign Case Manager"));
    } finally {
      setAssigningCm(false);
    }
  };

  // ── 3. Return to Draft ────────────────────────────────────────────────────────
  const handleReturnToDraft = async () => {
    if (!draftReason.trim()) {
      alert("Reason is required to return to draft");
      return;
    }
    try {
      setLoading(true);
      await Axios.post(`/case-manager/${caseId}/return-draft`, {
        reason: draftReason,
      });

      // Upload supporting attachments
      for (const file of draftFiles) {
        const docData = new FormData();
        docData.append("file", file);
        await Axios.post(`/case-manager/${caseId}/documents`, docData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success("Case returned to draft successfully");
      setDraftReason("");
      setDraftFiles([]);
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, "Failed to return draft"));
    } finally {
      setLoading(false);
    }
  };

  // ── 3. Approve Case ───────────────────────────────────────────────────────────
  const handleApproveCase = async () => {
    try {
      setLoading(true);

      // Upload P1 confirmation files
      if (p1Files.length > 0) {
        const data1 = new FormData();
        data1.append("file", p1Files[0]);
        await Axios.post(`/case-manager/${caseId}/p1-confirmation`, data1, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        for (let i = 1; i < p1Files.length; i++) {
          const docData = new FormData();
          docData.append("file", p1Files[i]);
          await Axios.post(`/case-manager/${caseId}/documents`, docData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      }

      // Upload P2 confirmation files
      if (p2Files.length > 0) {
        const data2 = new FormData();
        data2.append("file", p2Files[0]);
        await Axios.post(`/case-manager/${caseId}/p2-confirmation`, data2, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        for (let i = 1; i < p2Files.length; i++) {
          const docData = new FormData();
          docData.append("file", p2Files[i]);
          await Axios.post(`/case-manager/${caseId}/documents`, docData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      }

      // Record notes if provided
      if (p1Notes.trim()) {
        await Axios.post(`/case-manager/${caseId}/notes`, {
          category: "OPERATIONAL",
          note: `[Primary Applicant Confirmation Note]: ${p1Notes}`,
        });
      }
      if (p2Notes.trim()) {
        await Axios.post(`/case-manager/${caseId}/notes`, {
          category: "OPERATIONAL",
          note: `[Secondary Applicant Confirmation Note]: ${p2Notes}`,
        });
      }

      await Axios.post(`/case-manager/${caseId}/approve`, {});
      await Axios.post(`/agreement/${caseId}/document/cm/generate`);
      toast.success("Case approved successfully");
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, "Approval failed"));
    } finally {
      setLoading(false);
    }
  };

  // ── 4. Notes ──────────────────────────────────────────────────────────────────
  const handleAddNote = async () => {
    if (!noteCategory || !noteText.trim()) {
      alert("Category and note are required");
      return;
    }
    try {
      await Axios.post(`/case-manager/${caseId}/notes`, {
        category: noteCategory,
        note: noteText,
      });
      setNoteCategory("");
      setNoteText("");
      loadNotes();
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <div className="space-y-6">
      {/* ── 1. Case Details (Priority Selector & Save) ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center justify-between">
            <span>1. Case Details &amp; Priority</span>
            <span className="text-[11px] font-normal text-slate-500">
              Set priority level for tracking and SLA alerts
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-full sm:w-64">
              <Label className="text-xs mb-1 block">Case Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Default</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:mt-5">
              <Button
                onClick={handleSavePriority}
                disabled={savingPriority}
                size="sm"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold"
              >
                {savingPriority ? "Saving..." : "Save Priority"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── 2. Case Assignment ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center justify-between">
            <span>2. Case Assignment</span>
            <span className="text-[11px] font-normal text-slate-500">
              {alreadyAssigned
                ? "Initial assignment completed"
                : "Assign to yourself or any other Case Manager"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alreadyAssigned && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    Currently Assigned To:{" "}
                    <span className="font-bold text-slate-900">
                      {caseData?.assignedCaseManager?.firstName}{" "}
                      {caseData?.assignedCaseManager?.lastName}
                    </span>
                  </p>
                  {!isAdmin && (
                    <p className="text-[11px] text-amber-700 font-medium flex items-center gap-1 mt-0.5">
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        Initial assignment is completed. Re-assignment is restricted to Administrators only.
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Select
                value={selectedCm}
                onValueChange={setSelectedCm}
                disabled={!canAssign}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue
                    placeholder={
                      !canAssign
                        ? "Re-assignment restricted to Admin"
                        : "Select Case Manager to assign"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {caseManagers.length === 0 ? (
                    <SelectItem value="__loading__" disabled>
                      {caseManagers.length === 0 ? "Loading..." : "No case managers found"}
                    </SelectItem>
                  ) : (
                    caseManagers.map((cm: any) => (
                      <SelectItem key={cm._id} value={cm._id}>
                        {cm.firstName} {cm.lastName} ({cm.email})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleAssignCaseManager}
              disabled={assigningCm || !selectedCm || !canAssign}
              size="sm"
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold"
            >
              {assigningCm ? "Assigning..." : alreadyAssigned ? "Re-assign Case" : "Assign Case"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── 3. Case Review & Decision ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center justify-between">
            <span>3. Case Review &amp; Decision</span>
            <span className="text-[11px] font-normal text-slate-500">
              Approve case with confirmation attachments or return to draft
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Section A: Approve Case */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold uppercase text-slate-800 tracking-wider">
                  A. Approve Case
                </h4>
              </div>
              {isApproved && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Approved at{" "}
                  {caseData?.cmApprovedAt
                    ? new Date(caseData.cmApprovedAt).toLocaleTimeString()
                    : "—"}
                </span>
              )}
            </div>

            {/* Row 1: Primary Applicant Confirmation */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <Label className="text-xs font-bold text-slate-900 block">
                Primary Applicant ({p1Name}) Confirmation Documents
              </Label>
              <FancyFileUpload
                id="p1-confirm-files"
                files={p1Files}
                onChange={setP1Files}
                multiple={true}
              />
              <div>
                <Label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Confirmation Notes
                </Label>
                <Textarea
                  value={p1Notes}
                  onChange={(e) => setP1Notes(e.target.value)}
                  placeholder="Notes for Primary Applicant confirmation..."
                  className="text-xs min-h-[120px] bg-white resize-y"
                />
              </div>
            </div>

            {/* Row 2: Secondary Applicant Confirmation */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <Label className="text-xs font-bold text-slate-900 block">
                Secondary Applicant ({p2Name}) Confirmation Documents
              </Label>
              <FancyFileUpload
                id="p2-confirm-files"
                files={p2Files}
                onChange={setP2Files}
                multiple={true}
              />
              <div>
                <Label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Confirmation Notes
                </Label>
                <Textarea
                  value={p2Notes}
                  onChange={(e) => setP2Notes(e.target.value)}
                  placeholder="Notes for Secondary Applicant confirmation..."
                  className="text-xs min-h-[120px] bg-white resize-y"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Button
                onClick={handleApproveCase}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                {loading ? "Processing..." : "Approve Case"}
              </Button>
            </div>
          </div>

          {/* Section B: Return To Draft */}
          <div className="p-5 rounded-xl border border-rose-200 bg-rose-50/40 space-y-4">
            <div className="flex items-center gap-2 border-b border-rose-200 pb-3">
              <ArrowLeft className="w-4 h-4 text-rose-600" />
              <h4 className="text-xs font-bold uppercase text-rose-900 tracking-wider">
                B. Return to Draft
              </h4>
            </div>
            <p className="text-xs text-rose-800">
              Provide a clear reason. The case will be unlocked and returned to the couple for corrections.
            </p>

            <div>
              <Label className="text-xs font-bold text-slate-900 block mb-1">
                Reason for Returning to Draft
              </Label>
              <Textarea
                value={draftReason}
                onChange={(e) => setDraftReason(e.target.value)}
                placeholder="State exact reasons and instructions for the couple..."
                className="bg-white text-xs min-h-[130px] resize-y"
              />
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
              <Label className="text-xs font-bold text-slate-900 block">
                Supporting Attachments (Optional)
              </Label>
              <FancyFileUpload
                id="draft-support-files"
                files={draftFiles}
                onChange={setDraftFiles}
                multiple={true}
              />
            </div>

            <div className="flex justify-end pt-1">
              <Button
                variant="destructive"
                onClick={handleReturnToDraft}
                disabled={loading}
                className="font-bold text-xs"
              >
                Return To Draft
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── 4. Case Manager Notes ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold">4. Case Manager Notes</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Select value={noteCategory} onValueChange={setNoteCategory}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select note category" />
            </SelectTrigger>
            <SelectContent>
              {NOTE_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Enter internal operational or clarification note..."
            className="text-xs min-h-[100px] bg-white resize-y"
          />

          <Button onClick={handleAddNote} size="sm" className="font-bold">
            Save Note
          </Button>

          {/* Notes History */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Notes History
            </h5>
            {notes.length === 0 ? (
              <p className="text-xs text-slate-400">No notes recorded yet.</p>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id || note._id}
                  className="border rounded-lg p-3 bg-slate-50 text-xs"
                >
                  <span className="font-bold text-sky-900 bg-sky-100 px-2 py-0.5 rounded text-[10px]">
                    {note.category}
                  </span>
                  <p className="text-slate-700 mt-1.5 whitespace-pre-wrap">{note.note}</p>
                  {note.createdAt && (
                    <span className="text-[10px] text-slate-400 block mt-1">
                      {new Date(note.createdAt).toLocaleString()}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}