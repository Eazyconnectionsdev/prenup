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
import { UserCheck, MapPin, Check, ShieldAlert } from "lucide-react";
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

  const [loading, setLoading] = useState(false);

  // Return To Draft
  const [draftReason, setDraftReason] =
    useState("");
  const [draftFile, setDraftFile] =
    useState<File | null>(null);

  // Approval
  const [p1File, setP1File] =
    useState<File | null>(null);
  const [p2File, setP2File] =
    useState<File | null>(null);

  // Lawyers
  const [lawyers, setLawyers] = useState<any[]>(
    [],
  );
  const [p1Lawyer, setP1Lawyer] =
    useState("");
  const [p2Lawyer, setP2Lawyer] =
    useState("");

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

  // Action 2: Configure CM jurisdiction
  const [selectedConfigCmId, setSelectedConfigCmId] = useState<string>("");
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>("England & Wales");
  const [savingJurisdiction, setSavingJurisdiction] = useState(false);

  useEffect(() => {
    if (!caseId) return;

    loadAvailableLawyers();
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
        setSelectedConfigCmId(assigned);
        const match = list.find((m: any) => m._id === assigned);
        if (match) {
          setSelectedJurisdiction(match.primaryJurisdiction || match.jurisdiction || "England & Wales");
        }
      } else if (list.length > 0) {
        setSelectedConfigCmId(list[0]._id);
        setSelectedJurisdiction(list[0].primaryJurisdiction || list[0].jurisdiction || "England & Wales");
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

  const handleSaveJurisdiction = async () => {
    if (!selectedConfigCmId) {
      toast.error("Please select a Case Manager first");
      return;
    }
    try {
      setSavingJurisdiction(true);
      await Axios.patch(`/admin/case-managers/${selectedConfigCmId}/jurisdiction`, {
        jurisdiction: selectedJurisdiction,
        primaryJurisdiction: selectedJurisdiction,
      });
      const selectedCm = caseManagers.find((m) => m._id === selectedConfigCmId);
      const cmName = selectedCm ? `${selectedCm.firstName} ${selectedCm.lastName}`.trim() : "Case Manager";
      toast.success(`Assigned jurisdiction "${selectedJurisdiction}" to ${cmName}`);

      setCaseManagers((prev) =>
        prev.map((m) =>
          m._id === selectedConfigCmId
            ? { ...m, jurisdiction: selectedJurisdiction, primaryJurisdiction: selectedJurisdiction }
            : m
        )
      );

      onCaseUpdated?.();
    } catch (err: any) {
      console.error("Failed to save jurisdiction", err);
      toast.error(getErrorMessage(err, "Failed to update jurisdiction"));
    } finally {
      setSavingJurisdiction(false);
    }
  };

  const [availableLawyers, setAvailableLawyers] =
    useState<any[]>([]);

  const loadAvailableLawyers = async () => {
    try {
      const { data } = await Axios.get(
        `/case-manager/${caseId}/available-lawyers`
      );

      setAvailableLawyers(data || []);
    } catch (error) {
      console.error(error);
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

  const handleReturnToDraft =
    async () => {
      try {
        if (!draftReason.trim()) {
          alert("Reason is required");
          return;
        }

        setLoading(true);

        const formData = new FormData();

        formData.append(
          "reason",
          draftReason,
        );

        if (draftFile) {
          formData.append(
            "file",
            draftFile,
          );
        }

        await Axios.post(
          `/case-manager/${caseId}/return-draft`,
          formData,
        );

        setDraftReason("");
        setDraftFile(null);

        alert(
          "Case returned to draft successfully",
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  const uploadP1Confirmation =
    async () => {
      if (!p1File) return;

      const data = new FormData();

      data.append("file", p1File);

      await Axios.post(
        `/case-manager/${caseId}/p1-confirmation`,
        data,
      );
    };

  const uploadP2Confirmation =
    async () => {
      if (!p2File) return;

      const data = new FormData();

      data.append("file", p2File);

      await Axios.post(
        `/case-manager/${caseId}/p2-confirmation`,
        data,
      );
    };

  const handleApproveCase =
    async () => {
      try {
        setLoading(true);

        if (p1File) {
          await uploadP1Confirmation();
        }

        if (p2File) {
          await uploadP2Confirmation();
        }

        await Axios.post(
          `/case-manager/${caseId}/approve`,
          {},
        );
        
        await Axios.post(`/agreement/${caseId}/document/cm/generate`); 

        alert(
          "Case approved successfully",
        );

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  const handleAssignLawyers =
    async () => {
      try {
        if (!p1Lawyer || !p2Lawyer) {
          alert(
            "Please select both lawyers",
          );
          return;
        }

        setLoading(true);

        await Axios.post(
          `/case-manager/${caseId}/assign-lawyers`,
          {
            p1LawyerId: p1Lawyer,
            p2LawyerId: p2Lawyer,
          }
        );

        // The backend also initializes the lawyer stage document
        toast.success("Lawyers assigned. The agreement is now ready for lawyer review.");
      } catch (error) {
        toast.error(getErrorMessage(error, "Couldn't assign lawyers."));
      } finally {
        setLoading(false);
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

  const configCm = caseManagers.find((m) => m._id === selectedConfigCmId);

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

      {/* ── 2. Case Manager Jurisdiction Management ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-600" />
              2. Case Manager Jurisdiction Management
            </span>
            <span className="text-[11px] font-normal text-slate-500">
              Select any Case Manager to configure or update their designated legal jurisdiction
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Case Manager Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Select Case Manager</Label>
              <Select
                value={selectedConfigCmId}
                onValueChange={(val) => {
                  setSelectedConfigCmId(val);
                  const cm = caseManagers.find((m) => m._id === val);
                  if (cm) {
                    setSelectedJurisdiction(cm.primaryJurisdiction || cm.jurisdiction || "England & Wales");
                  }
                }}
              >
                <SelectTrigger className="w-full bg-white text-xs">
                  <SelectValue placeholder="Select a Case Manager..." />
                </SelectTrigger>
                <SelectContent>
                  {caseManagers.map((cm) => (
                    <SelectItem key={cm._id} value={cm._id} className="text-xs">
                      {cm.firstName} {cm.lastName} ({cm.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {configCm && (
                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                  <span>Current Jurisdiction:</span>
                  <span className="font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                    {configCm.primaryJurisdiction || configCm.jurisdiction || "Not Assigned"}
                  </span>
                </div>
              )}
            </div>

            {/* Jurisdiction Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Assign New Jurisdiction</Label>
              <Select
                value={selectedJurisdiction}
                onValueChange={setSelectedJurisdiction}
              >
                <SelectTrigger className="w-full bg-white text-xs">
                  <SelectValue placeholder="Select Jurisdiction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="England & Wales">England &amp; Wales</SelectItem>
                  <SelectItem value="England">England</SelectItem>
                  <SelectItem value="Wales">Wales</SelectItem>
                  <SelectItem value="Scotland">Scotland</SelectItem>
                  <SelectItem value="Northern Ireland">Northern Ireland</SelectItem>
                  <SelectItem value="Scotland, Wales and England">Scotland, Wales and England (UK-Wide)</SelectItem>
                </SelectContent>
              </Select>

              {/* Quick preset buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["England & Wales", "Scotland", "Northern Ireland", "UK-Wide"].map((preset) => {
                  const val = preset === "UK-Wide" ? "Scotland, Wales and England" : preset;
                  const active = selectedJurisdiction === val;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setSelectedJurisdiction(val)}
                      className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer font-medium ${
                        active
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <Button
              type="button"
              size="sm"
              onClick={handleSaveJurisdiction}
              disabled={savingJurisdiction || !selectedConfigCmId}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
            >
              {savingJurisdiction ? "Saving..." : "Save Jurisdiction"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold">
            3. Return To Draft
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label>
              Reason (Required)
            </Label>

            <Textarea
              value={draftReason}
              onChange={(e) =>
                setDraftReason(
                  e.target.value,
                )
              }
              placeholder="Provide reason for returning the case to draft..."
            />
          </div>

          <div>
            <Label>
              Supporting Attachment
            </Label>

            <Input
              type="file"
              onChange={(e) =>
                setDraftFile(
                  e.target.files?.[0] ||
                  null,
                )
              }
            />
          </div>

          <Button
            variant="destructive"
            onClick={
              handleReturnToDraft
            }
            disabled={loading}
          >
            Return To Draft
          </Button>
        </CardContent>
      </Card>

      {/* Approve Case */}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold">
            4. Case Review &amp; Approval
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label>
              P1 Confirmation
            </Label>

            <Input
              type="file"
              onChange={(e) =>
                setP1File(
                  e.target.files?.[0] ||
                  null,
                )
              }
            />
          </div>

          <div>
            <Label>
              P2 Confirmation
            </Label>

            <Input
              type="file"
              onChange={(e) =>
                setP2File(
                  e.target.files?.[0] ||
                  null,
                )
              }
            />
          </div>

          <Button
            onClick={
              handleApproveCase
            }
            disabled={loading}
          >
            Approve Case
          </Button>
        </CardContent>
      </Card>

      {/* Assign Lawyers */}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold">
            5. Lawyer Assignment
          </CardTitle>
        </CardHeader>

        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>
              User 1 Lawyer
            </Label>

            <Select
              value={p1Lawyer}
              onValueChange={setP1Lawyer}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select P1 Lawyer" />
              </SelectTrigger>

              <SelectContent>
                {availableLawyers
                  .filter((l) => l._id !== p2Lawyer)
                  .map((lawyer) => (
                    <SelectItem
                      key={lawyer._id}
                      value={lawyer._id}
                    >
                      {lawyer.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>
              User 2 Lawyer
            </Label>

            <Select
              value={p2Lawyer}
              onValueChange={setP2Lawyer}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select P2 Lawyer" />
              </SelectTrigger>

              <SelectContent>
                {availableLawyers
                  .filter((l) => l._id !== p1Lawyer)
                  .map((lawyer) => (
                    <SelectItem
                      key={lawyer._id}
                      value={lawyer._id}
                    >
                      {lawyer.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Button
              onClick={
                handleAssignLawyers
              }
              disabled={loading}
            >
              Assign Lawyers
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Note */}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold">
            6. Add Admin Note
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

