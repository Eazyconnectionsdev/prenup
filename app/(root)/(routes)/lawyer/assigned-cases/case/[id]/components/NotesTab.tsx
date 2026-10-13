"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Axios from "@/lib/ApiConfig";
import { Trash2, Loader2, Send } from "lucide-react";
import { toast } from "react-toastify";

export default function NotesTab({ caseId: propCaseId }: { caseId?: string }) {
  const params = useParams();
  const caseId = propCaseId || (params?.id as string);

  const [noteText, setNoteText] = useState("");
  const [category, setCategory] = useState("OPERATIONAL");
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadNotes = useCallback(async () => {
    if (!caseId) return;

    try {
      setLoading(true);
      const { data } = await Axios.get(`/lawyer/${caseId}/notes`);
      if (Array.isArray(data)) {
        setNotes(data);
      } else if (data?.notes && Array.isArray(data.notes)) {
        setNotes(data.notes);
      } else {
        setNotes([]);
      }
    } catch (err) {
      console.error("Failed to load lawyer notes:", err);
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const saveNote = async () => {
    if (!noteText.trim()) return;
    if (!caseId) return;

    try {
      setSubmitting(true);
      await Axios.post(`/lawyer/${caseId}/notes`, {
        note: noteText.trim(),
        text: noteText.trim(),
        category,
      });

      setNoteText("");
      toast.success("Note added successfully.");
      await loadNotes();
    } catch (err) {
      console.error("Failed to save note:", err);
      toast.error("Failed to save note.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!caseId || !noteId) return;

    try {
      await Axios.delete(`/lawyer/${caseId}/notes/${noteId}`);
      toast.success("Note deleted.");
      await loadNotes();
    } catch (err) {
      console.error("Failed to delete note:", err);
      toast.error("Failed to delete note.");
    }
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="border rounded-xl p-4 bg-white shadow-xs space-y-3">
        <div className="flex gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50"
          >
            <option value="OPERATIONAL">Operational</option>
            <option value="CLARIFICATION">Clarification</option>
            <option value="ESCALATION">Escalation</option>
            <option value="RISK">Risk</option>
            <option value="INTERNAL">Internal</option>
          </select>
        </div>

        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Write lawyer note..."
          className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 min-h-[100px]"
        />

        <div className="flex justify-end">
          <button
            onClick={saveNote}
            disabled={submitting || !noteText.trim()}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold flex items-center gap-2 disabled:opacity-50 hover:bg-slate-800 transition-colors"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Save Note
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-slate-500 py-4 flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading notes...
        </div>
      ) : notes.length === 0 ? (
        <div className="text-sm text-slate-400 py-6 text-center border rounded-xl border-dashed">
          No notes recorded yet.
        </div>
      ) : (
        notes.map((item: any, index: number) => {
          const noteId = item._id || item.id;
          return (
            <div
              key={noteId || index}
              className="border rounded-xl p-4 bg-white shadow-xs flex justify-between items-start gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                    {item.category || "OPERATIONAL"}
                  </span>
                  <span className="text-xs text-slate-400">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : "-"}
                  </span>
                </div>
                <p className="text-sm text-slate-800 whitespace-pre-wrap mt-2">
                  {item.note || item.text || item.content}
                </p>
              </div>

              {noteId && (
                <button
                  onClick={() => deleteNote(noteId)}
                  className="text-slate-400 hover:text-red-600 transition-colors p-1"
                  title="Delete note"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}