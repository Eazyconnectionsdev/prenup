"use client";

import { useState } from "react";

export default function NotesTab() {
  const [note, setNote] = useState("");

  const [notes, setNotes] = useState<string[]>(
    []
  );

  const saveNote = () => {
    if (!note.trim()) return;

    setNotes((prev) => [note, ...prev]);
    setNote("");
  };

  return (
    <div className="space-y-4">
      <textarea
        value={note}
        onChange={(e) =>
          setNote(e.target.value)
        }
        placeholder="Write case manager note..."
        className="w-full border rounded-xl p-4 h-32"
      />

      <button
        onClick={saveNote}
        className="px-4 py-2 bg-slate-900 text-white rounded-lg"
      >
        Save Note
      </button>

      {notes.map((item, index) => (
        <div
          key={index}
          className="border rounded-xl p-4"
        >
          {item}
        </div>
      ))}
    </div>
  );
}