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
  UserCheck,
  ShieldAlert,
} from "lucide-react";
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

  // 3. Notes
  const [notes, setNotes] = useState<any[]>([]);
  const [noteCategory, setNoteCategory] = useState("");
  const [noteText, setNoteText] = useState("");

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

  // ── 3. Notes ──────────────────────────────────────────────────────────────────
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

      {/* ── 3. Case Manager Notes ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold">3. Case Manager Notes</CardTitle>
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
