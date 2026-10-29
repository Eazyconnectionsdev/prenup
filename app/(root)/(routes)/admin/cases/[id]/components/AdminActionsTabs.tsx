"use client";

import { useEffect, useState } from "react";
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
import { UserCheck, ShieldAlert } from "lucide-react";
import type { Props } from "@/types/case-detail/tabs/cm-actions-tabs";

const NOTE_CATEGORIES = [
  {
    label: "Operational Note",
    value: "OPERATIONAL",
  },
  {
    label: "Clarification Note",
    value: "CLARIFICATION",
  },
  {
    label: "Escalation Note",
    value: "ESCALATION",
  },
  {
    label: "Risk Note",
    value: "RISK",
  },
  {
    label: "Complaint Note",
    value: "COMPLAINT",
  },
];

export default function AdminActionsTab({
  caseData,
  onCaseUpdated,
}: Props) {
  const caseId = caseData?._id;

  // Notes
  const [notes, setNotes] = useState<any[]>([]);
  const [noteCategory, setNoteCategory] =
    useState("");
  const [noteText, setNoteText] =
    useState("");

  // Case Managers
  const [caseManagers, setCaseManagers] = useState<any[]>([]);

  // Action 1: Assign this case
  const initialCmId = caseData?.assignedCaseManager?._id || caseData?.assignedCaseManager || "";
  const [selectedAssignCmId, setSelectedAssignCmId] = useState<string>(
    typeof initialCmId === "string" ? initialCmId : ""
  );
  const [assigningCase, setAssigningCase] = useState(false);

  useEffect(() => {
    if (!caseId) return;

    loadNotes();
    loadCaseManagers();
  }, [caseId]);

  useEffect(() => {
    const assigned = caseData?.assignedCaseManager?._id || caseData?.assignedCaseManager;
    if (assigned && typeof assigned === "string") {
      setSelectedAssignCmId(assigned);
    }
  }, [caseData?.assignedCaseManager]);

  const loadCaseManagers = async () => {
    try {
      const res = await Axios.get("/admin/case-managers");
      const list = res.data?.docs || res.data || [];
      setCaseManagers(list);

      const assigned = caseData?.assignedCaseManager?._id || caseData?.assignedCaseManager;
      if (assigned && typeof assigned === "string") {
        setSelectedAssignCmId(assigned);
      }
    } catch (err) {
      console.error("Failed to load case managers", err);
    }
  };

  const handleAssignCmToCase = async () => {
    if (!selectedAssignCmId) {
      toast.error("Please select a Case Manager to assign");
      return;
    }
    try {
      setAssigningCase(true);
      await Axios.post(`/cases/${caseId}/assign-case-manager`, {
        managerId: selectedAssignCmId,
      });

      if (selectedAssignCmId === "unassign") {
        toast.success("Case has been unassigned.");
      } else {
        const assignedCm = caseManagers.find((m) => m._id === selectedAssignCmId);
        const cmName = assignedCm ? `${assignedCm.firstName} ${assignedCm.lastName}`.trim() : "Case Manager";
        toast.success(`Case assigned to ${cmName} successfully.`);
      }

      onCaseUpdated?.();
    } catch (err: any) {
      console.error("Failed to assign case manager", err);
      toast.error(getErrorMessage(err, "Failed to assign case manager"));
    } finally {
      setAssigningCase(false);
    }
  };

  const loadNotes = async () => {
    try {
      const res = await Axios.get(
        `/case-manager/${caseId}/notes`,
      );

      setNotes(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddNote =
    async () => {
      try {
        if (
          !noteCategory ||
          !noteText.trim()
        ) {
          alert(
            "Category and note are required",
          );
          return;
        }

        await Axios.post(
          `/case-manager/${caseId}/notes`,
          {
            category: noteCategory,
            note: noteText,
          },
        );

        setNoteCategory("");
        setNoteText("");

        loadNotes();
      } catch (error) {
        console.error(error);
      }
    };

  const handleDeleteNote =
    async (noteId: string) => {
      try {
        await Axios.delete(
          `/case-manager/${caseId}/notes/${noteId}`,
        );

        loadNotes();
      } catch (error) {
        console.error(error);
      }
    };

  const currentCm = caseData?.assignedCaseManager;
  const currentCmName =
    typeof currentCm === "object" && currentCm
      ? `${currentCm.firstName || ""} ${currentCm.lastName || ""}`.trim() || currentCm.email
      : typeof currentCm === "string"
      ? currentCm
      : null;
  const currentCmEmail = typeof currentCm === "object" && currentCm ? currentCm.email : "";
  const currentCmJurisdiction =
    typeof currentCm === "object" && currentCm
      ? currentCm.primaryJurisdiction || currentCm.jurisdiction || "England & Wales"
      : "";


  return (
    <div className="space-y-6">
      {/* ── 1. Case Assignment (Assign to Any Case Manager) ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              1. Case Assignment
            </span>
            <span className="text-[11px] font-normal text-slate-500">
              Assign or re-assign this case to any Case Manager (full admin override)
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Current Assignment Status Pill */}
          <div className="p-3.5 rounded-xl border bg-slate-50 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  currentCm ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}
              >
                {currentCm ? (
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                )}
              </div>
              <div>
                <p className="font-bold text-slate-900">
                  {currentCm
                    ? `Currently Assigned: ${currentCmName}`
                    : "Status: Unassigned"}
                </p>
                <p className="text-slate-500 text-[11px]">
                  {currentCm
                    ? `${currentCmEmail} · Jurisdiction: ${currentCmJurisdiction}`
                    : "No Case Manager has been assigned to this matter yet."}
                </p>
              </div>
            </div>

            {currentCm && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
                Active Assignment
              </span>
            )}
          </div>

          {/* Selector & Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 pt-1">
            <div className="flex-1 space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">
                Select Case Manager to Assign
              </Label>
              <Select
                value={selectedAssignCmId}
                onValueChange={setSelectedAssignCmId}
              >
                <SelectTrigger className="w-full bg-white text-xs">
                  <SelectValue placeholder="Choose a Case Manager..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassign" className="text-xs text-amber-700 font-semibold">
                    -- Unassign (Remove Case Manager) --
                  </SelectItem>
                  {caseManagers.map((cm) => (
                    <SelectItem key={cm._id} value={cm._id} className="text-xs">
                      {cm.firstName} {cm.lastName} ({cm.email}) — {cm.primaryJurisdiction || cm.jurisdiction || "England & Wales"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              onClick={handleAssignCmToCase}
              disabled={assigningCase || !selectedAssignCmId}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-9 px-5 shrink-0"
            >
              {assigningCase
                ? "Updating..."
                : selectedAssignCmId === "unassign"
                ? "Unassign Case"
                : currentCm
                ? "Re-assign Case Manager"
                : "Assign Case Manager"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Note */}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold">
            3. Add Admin Note
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Select
            value={noteCategory}
            onValueChange={
              setNoteCategory
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>

            <SelectContent>
              {NOTE_CATEGORIES.map(
                (cat) => (
                  <SelectItem
                    key={cat.value}
                    value={
                      cat.value
                    }
                  >
                    {cat.label}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>

          <Textarea
            value={noteText}
            onChange={(e) =>
              setNoteText(
                e.target.value,
              )
            }
            placeholder="Enter note..."
          />

          <Button
            onClick={
              handleAddNote
            }
          >
            Save Note
          </Button>
        </CardContent>
      </Card>

      {/* Notes History */}

      <Card>
        <CardHeader>
          <CardTitle>
            Notes History
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {notes.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No notes available.
              </p>
            )}

            {notes.map((note) => (
              <div
                key={note.id}
                className="border rounded-lg p-4 flex items-start justify-between gap-4"
              >
                <div>
                  <div className="font-medium">
                    {
                      note.category
                    }
                  </div>

                  <div className="text-sm text-muted-foreground mt-1">
                    {note.note}
                  </div>

                  {note.createdAt && (
                    <div className="text-xs text-muted-foreground mt-2">
                      {new Date(
                        note.createdAt,
                      ).toLocaleString()}
                    </div>
                  )}
                </div>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    handleDeleteNote(
                      note.id,
                    )
                  }
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

