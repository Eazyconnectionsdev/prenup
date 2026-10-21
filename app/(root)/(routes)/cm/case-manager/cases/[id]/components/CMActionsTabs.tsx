"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { CheckCircle2, UserCheck, ShieldAlert, ArrowLeft } from "lucide-react";
import type { Props } from "@/types/case-detail/tabs/cm-actions-tabs";

const NOTE_CATEGORIES = [
  { label: "Operational Note", value: "OPERATIONAL" },
  { label: "Clarification Note", value: "CLARIFICATION" },
  { label: "Escalation Note", value: "ESCALATION" },
  { label: "Risk Note", value: "RISK" },
  { label: "Complaint Note", value: "COMPLAINT" },
];

export default function CMActionsTab({ caseData }: Props) {
  const caseId = caseData?._id;
  const [loading, setLoading] = useState(false);

  // 1. Case Details / Priority
  const [priority, setPriority] = useState<string>(caseData?.priority || "LOW");
  const [savingPriority, setSavingPriority] = useState(false);

  // 2. Case Assignment
  const [caseManagers, setCaseManagers] = useState<any[]>([]);
  const [selectedCm, setSelectedCm] = useState<string>("");
  const [assigningCm, setAssigningCm] = useState(false);
  const alreadyAssigned = Boolean(caseData?.assignedCaseManager);

  // 3. Return To Draft
  const [draftReason, setDraftReason] = useState("");
  const [draftFile, setDraftFile] = useState<File | null>(null);

  // 3. Approval
  const [p1File, setP1File] = useState<File | null>(null);
  const [p2File, setP2File] = useState<File | null>(null);
  const [p1Notes, setP1Notes] = useState("");
  const [p2Notes, setP2Notes] = useState("");
  const isApproved = Boolean(caseData?.cmApproved);

  // 4. Lawyers
  const [availableLawyers, setAvailableLawyers] = useState<any[]>([]);
  const [p1Lawyer, setP1Lawyer] = useState("");
  const [p2Lawyer, setP2Lawyer] = useState("");

  // 5. Notes
  const [notes, setNotes] = useState<any[]>([]);
  const [noteCategory, setNoteCategory] = useState("");
  const [noteText, setNoteText] = useState("");

  const p1Name = caseData?.owner
    ? `${caseData.owner.firstName || ""} ${caseData.owner.lastName || ""}`.trim() || "Primary Applicant"
    : "Primary Applicant";

  const p2Name = caseData?.invitedUser
    ? `${caseData.invitedUser.firstName || ""} ${caseData.invitedUser.lastName || ""}`.trim() || "Secondary Applicant"
    : "Secondary Applicant";

  useEffect(() => {
    if (!caseId) return;
    loadAvailableLawyers();
    loadNotes();
    loadCaseManagers();
  }, [caseId]);

  const loadCaseManagers = async () => {
    try {
      const { data } = await Axios.get("/admin/case-managers");
      setCaseManagers(Array.isArray(data) ? data : []);
    } catch {
      // ignore
    }
  };

  const loadAvailableLawyers = async () => {
    try {
      const { data } = await Axios.get(`/case-manager/${caseId}/available-lawyers`);
      setAvailableLawyers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
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
    try {
      setAssigningCm(true);
      await Axios.post(`/cases/${caseId}/assign-case-manager`, { managerId: selectedCm });
      toast.success("Case assigned to Case Manager successfully.");
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
      alert("Case returned to draft successfully");
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, "Failed to return draft"));
    } finally {
      setLoading(false);
    }
  };

  // ── 3. Approve Case ───────────────────────────────────────────────────────────
  const uploadP1Confirmation = async () => {
    if (!p1File) return;
    const data = new FormData();
    data.append("file", p1File);
    await Axios.post(`/case-manager/${caseId}/p1-confirmation`, data);
  };

  const uploadP2Confirmation = async () => {
    if (!p2File) return;
    const data = new FormData();
    data.append("file", p2File);
    await Axios.post(`/case-manager/${caseId}/p2-confirmation`, data);
  };

  const handleApproveCase = async () => {
    try {
      setLoading(true);
      if (p1File) await uploadP1Confirmation();
      if (p2File) await uploadP2Confirmation();
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

  // ── 4. Assign Lawyers ─────────────────────────────────────────────────────────
  const handleAssignLawyers = async () => {
    if (!p1Lawyer || !p2Lawyer) {
      alert("Please select both lawyers");
      return;
    }
    try {
      setLoading(true);
      await Axios.post(`/case-manager/${caseId}/assign-lawyers`, {
        p1LawyerId: p1Lawyer,
        p2LawyerId: p2Lawyer,
      });
      toast.success("Lawyers assigned. The agreement is now ready for lawyer review.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't assign lawyers."));
    } finally {
      setLoading(false);
    }
  };

  // ── 5. Notes ──────────────────────────────────────────────────────────────────
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

  const handleDeleteNote = async (noteId: string) => {
    try {
      await Axios.delete(`/case-manager/${caseId}/notes/${noteId}`);
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
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low (Default · Green)</SelectItem>
                  <SelectItem value="MEDIUM">Medium (Orange)</SelectItem>
                  <SelectItem value="HIGH">High (Red)</SelectItem>
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
              Only assign once. Re-assignment requires Admin privileges.
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alreadyAssigned ? (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Case is currently assigned to{" "}
                  {caseData?.assignedCaseManager?.firstName || "a Case Manager"}
                </p>
                <p className="text-[11px] text-slate-500">
                  To re-assign this case, please contact an Administrator.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Select value={selectedCm} onValueChange={setSelectedCm}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Case Manager to assign" />
                  </SelectTrigger>
                  <SelectContent>
                    {caseManagers.map((cm: any) => (
                      <SelectItem key={cm._id} value={cm._id}>
                        {cm.firstName} {cm.lastName} ({cm.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleAssignCaseManager}
                disabled={assigningCm}
                size="sm"
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold"
              >
                {assigningCm ? "Assigning..." : "Assign Case"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── 3. Case Review & Decision ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold">
            3. Case Review &amp; Decision
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Approval Section with two attachments & notes */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase text-slate-800 tracking-wider">
                A. Approve Case
              </h4>
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
            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
              <Label className="text-xs font-bold text-slate-900">
                Primary Applicant ({p1Name}) Confirmation Document
              </Label>
              <Input
                type="file"
                onChange={(e) => setP1File(e.target.files?.[0] || null)}
                className="text-xs"
              />
              <Textarea
                value={p1Notes}
                onChange={(e) => setP1Notes(e.target.value)}
                placeholder="Notes for Primary Applicant confirmation..."
                className="text-xs h-16"
              />
            </div>

            {/* Row 2: Secondary Applicant Confirmation */}
            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
              <Label className="text-xs font-bold text-slate-900">
                Secondary Applicant ({p2Name}) Confirmation Document
              </Label>
              <Input
                type="file"
                onChange={(e) => setP2File(e.target.files?.[0] || null)}
                className="text-xs"
              />
              <Textarea
                value={p2Notes}
                onChange={(e) => setP2Notes(e.target.value)}
                placeholder="Notes for Secondary Applicant confirmation..."
                className="text-xs h-16"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={handleApproveCase}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                {loading ? "Processing..." : "Approve Case"}
              </Button>
            </div>
          </div>

          {/* Full Row: Return To Draft */}
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-3">
            <h4 className="text-xs font-bold uppercase text-rose-900 tracking-wider flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4 text-rose-600" />
              <span>B. Return to Draft</span>
            </h4>
            <p className="text-xs text-rose-800">
              Provide a clear reason. The case will be unlocked and returned to the couple for corrections.
            </p>

            <Textarea
              value={draftReason}
              onChange={(e) => setDraftReason(e.target.value)}
              placeholder="State exact reasons and instructions for the couple..."
              className="bg-white text-xs"
            />

            <div>
              <Label className="text-xs mb-1 block">Supporting Attachment (Optional)</Label>
              <Input
                type="file"
                onChange={(e) => setDraftFile(e.target.files?.[0] || null)}
                className="bg-white text-xs"
              />
            </div>

            <div className="flex justify-end">
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

      {/* ── 4. Assign Lawyers (Showing applicant names, not p1/p2) ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center justify-between">
            <span>4. Assign Lawyers</span>
            <span className="text-[11px] font-normal text-slate-500">
              Lawyers must be from different law firms
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-bold text-slate-800 mb-1 block">
              Lawyer for {p1Name} (Primary Applicant)
            </Label>
            <Select value={p1Lawyer} onValueChange={setP1Lawyer}>
              <SelectTrigger>
                <SelectValue placeholder="Select lawyer for Primary Applicant" />
              </SelectTrigger>
              <SelectContent>
                {availableLawyers
                  .filter((l) => l._id !== p2Lawyer)
                  .map((lawyer) => (
                    <SelectItem key={lawyer._id} value={lawyer._id}>
                      {lawyer.name} ({lawyer.companyName || "Independent"})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-bold text-slate-800 mb-1 block">
              Lawyer for {p2Name} (Secondary Applicant)
            </Label>
            <Select value={p2Lawyer} onValueChange={setP2Lawyer}>
              <SelectTrigger>
                <SelectValue placeholder="Select lawyer for Secondary Applicant" />
              </SelectTrigger>
              <SelectContent>
                {availableLawyers
                  .filter((l) => l._id !== p1Lawyer)
                  .map((lawyer) => (
                    <SelectItem key={lawyer._id} value={lawyer._id}>
                      {lawyer.name} ({lawyer.companyName || "Independent"})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2 flex justify-end pt-2">
            <Button
              onClick={handleAssignLawyers}
              disabled={loading}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold"
            >
              Assign Lawyers
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── 5. Case Manager Notes ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold">5. Case Manager Notes</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Select value={noteCategory} onValueChange={setNoteCategory}>
            <SelectTrigger>
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
            className="text-xs"
          />

          <Button onClick={handleAddNote} size="sm" className="font-bold">
            Save Note
          </Button>

          {/* Notes List */}
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
                  className="border rounded-lg p-3 bg-slate-50 text-xs flex items-start justify-between gap-4"
                >
                  <div>
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

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteNote(note.id || note._id)}
                    className="text-xs h-7 px-2"
                  >
                    Delete
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}