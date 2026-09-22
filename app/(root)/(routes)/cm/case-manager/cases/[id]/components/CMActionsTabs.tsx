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

interface Props {
  caseData: any;
}

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

export default function CMActionsTab({
  caseData,
}: Props) {
  console.log("caseData", caseData);
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

  useEffect(() => {
    if (!caseId) return;

    loadAvailableLawyers();
    loadNotes();
  }, [caseId]);


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


        alert(
          "Lawyers assigned successfully",
        );
      } catch (error) {
        console.error(error);
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

  return (
    <div className="space-y-6">


      <Card>
        <CardHeader>
          <CardTitle>
            Return To Draft
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
          <CardTitle>
            Approve Case
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
          <CardTitle>
            Assign Lawyers
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
          <CardTitle>
            Add CM Note
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