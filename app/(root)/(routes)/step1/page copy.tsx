// file: app/questions/Page.tsx   (or wherever you want)
// "use client" required for stateful client component
"use client";

import React, { useState } from "react";

/**
 * Questions (the ones you listed).
 * Modify later if you want.
 */
const QUESTIONS: string[] = [
  `Any assets listed on this page will be treated as a separate asset in the event of a divorce, including any increase in value of these assets.`,
  `Do you have any earnings you’d like to keep separate from your partner?`,
  `Do you have any properties you’d like to keep separate from your partner?`,
  `Do you have any savings you’d like to keep separate from your partner?`,
  `Do you have any pensions you’d like to keep separate from your partner?`,
  `Do you have any debts you’d like to keep separate from your partner? This includes current credit card balances, loans, etc.`,
  `Do you have any businesses you’d like to keep separate from your partner?`,
  `Do you have any chattels you’d like to keep separate from your partner?`,
  `Do you have any other assets you’d like to keep separate from your partner?`,
];

/**
 * Generic fields shown when user clicks "Yes".
 * Change the labels/keys later as you wish.
 */
const FIELDS = [
  { key: "line1", label: "Address Line 1" },
  { key: "line2", label: "Address Line 2" },
  { key: "town", label: "Town or City" },
  { key: "postcode", label: "Postcode" },
  { key: "value", label: "Property / Asset Value" },
  { key: "extra", label: "Mortgage / Outstanding / Notes" },
];

type Entry = {
  id: string;
  values: Record<string, string>;
};

export default function QuestionsPage() {
  // answers for each question: "yes" | "no" | null
  const [answers, setAnswers] = useState<("yes" | "no" | null)[]>(
    () => Array(QUESTIONS.length).fill(null)
  );

  // entries per question (only used when answer === 'yes')
  const [entries, setEntries] = useState<Entry[][]>(() =>
    Array(QUESTIONS.length).fill([]).map(() => [])
  );

  const setAnswer = (qIndex: number, val: "yes" | "no") => {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = val;
      return next;
    });

    // when user picks "yes" ensure there's at least one empty entry
    if (val === "yes") {
      setEntries((prev) => {
        const copy = prev.map((e) => [...e]);
        if (!copy[qIndex] || copy[qIndex].length === 0) {
          copy[qIndex] = [makeEmptyEntry()];
        }
        return copy;
      });
    }
    // when user picks "no", clear entries (optional)
    if (val === "no") {
      setEntries((prev) => {
        const copy = prev.map((e) => [...e]);
        copy[qIndex] = [];
        return copy;
      });
    }
  };

  function makeEmptyEntry(): Entry {
    const values: Record<string, string> = {};
    for (const f of FIELDS) values[f.key] = "";
    return { id: String(Date.now()) + Math.random().toString(36).slice(2), values };
  }

  const addEntry = (qIndex: number) => {
    setEntries((prev) => {
      const copy = prev.map((e) => [...e]);
      copy[qIndex] = copy[qIndex] || [];
      copy[qIndex].push(makeEmptyEntry());
      return copy;
    });
  };

  const removeEntry = (qIndex: number, entryId: string) => {
    setEntries((prev) => {
      const copy = prev.map((e) => [...e]);
      copy[qIndex] = copy[qIndex].filter((ent) => ent.id !== entryId);
      return copy;
    });
  };

  const updateEntryField = (
    qIndex: number,
    entryId: string,
    fieldKey: string,
    value: string
  ) => {
    setEntries((prev) => {
      const copy = prev.map((e) => e.map((x) => ({ ...x })));
      const list = copy[qIndex];
      if (!list) return prev;
      const ent = list.find((x) => x.id === entryId);
      if (!ent) return prev;
      ent.values[fieldKey] = value;
      return copy;
    });
  };

  return (
    <main className="min-h-screen bg-[#075fa5] p-8">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-serif text-white font-semibold">Assets & Separation</h1>
          <p className="mt-2 text-sm text-blue-100/80">
            Click "Yes" under any question to list items. Use "Add New Entry" to add more entries and the × button to remove.
          </p>
        </header>

        <section className="bg-[#075fa5] rounded-lg p-6">
          {/* Each question top-to-bottom */}
          {QUESTIONS.map((q, qi) => (
            <div key={qi} className="mb-8">
              <div className="text-white mb-3 prose-sm">
                <p>{q}</p>
              </div>

              {/* Yes / No buttons */}
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setAnswer(qi, "yes")}
                  aria-pressed={answers[qi] === "yes"}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium shadow-sm border-2 ${
                    answers[qi] === "yes"
                      ? "bg-white text-[#075fa5] border-white"
                      : "bg-white/90 text-slate-700 border-white/50 hover:shadow"
                  }`}
                >
                  {/* check icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15 4.293 10.88a1 1 0 011.414-1.414L8.414 12.172l7.879-7.879a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Yes
                </button>

                <button
                  onClick={() => setAnswer(qi, "no")}
                  aria-pressed={answers[qi] === "no"}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium shadow-sm border-2 ${
                    answers[qi] === "no"
                      ? "bg-white text-[#075fa5] border-white"
                      : "bg-white/90 text-slate-700 border-white/50 hover:shadow"
                  }`}
                >
                  No
                </button>
              </div>

              {/* When answered yes — show entries list */}
              {answers[qi] === "yes" && (
                <div className="bg-[#0b74bb] p-4 rounded-lg shadow-inner border border-white/10">
                  {/* Entries */}
                  <div className="space-y-4">
                    {(entries[qi] || []).map((entry) => (
                      <div
                        key={entry.id}
                        className="relative bg-white rounded-md p-4 grid grid-cols-1 md:grid-cols-2 gap-3 items-start"
                      >
                        {/* Remove button top-right */}
                        <button
                          onClick={() => removeEntry(qi, entry.id)}
                          aria-label="Remove entry"
                          className="absolute -right-3 -top-3 w-8 h-8 rounded-full bg-white border shadow flex items-center justify-center text-slate-700"
                        >
                          ×
                        </button>

                        {/* Left column fields (first half of fields) */}
                        <div className="space-y-3">
                          {FIELDS.slice(0, Math.ceil(FIELDS.length / 2)).map((f) => (
                            <label key={f.key} className="block">
                              <input
                                value={entry.values[f.key]}
                                onChange={(e) => updateEntryField(qi, entry.id, f.key, e.target.value)}
                                placeholder={f.label}
                                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm"
                              />
                            </label>
                          ))}
                        </div>

                        {/* Right column fields (second half) */}
                        <div className="space-y-3">
                          {FIELDS.slice(Math.ceil(FIELDS.length / 2)).map((f) => (
                            <label key={f.key} className="block">
                              <input
                                value={entry.values[f.key]}
                                onChange={(e) => updateEntryField(qi, entry.id, f.key, e.target.value)}
                                placeholder={f.label}
                                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm"
                              />
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Entry button */}
                  <div className="mt-4">
                    <button
                      onClick={() => addEntry(qi)}
                      className="inline-flex items-center gap-3 px-4 py-2 rounded-md bg-white text-[#075fa5] font-medium shadow border"
                    >
                      {/* plus in red circle to mimic screenshot */}
                      <span className="w-6 h-6 rounded-full flex items-center justify-center bg-red-500 text-white text-sm font-bold">+</span>
                      Add New Entry
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* (Optional) a small footer note */}
        <footer className="mt-8 text-blue-100/70 text-sm text-center">
          These fields are draft placeholders — change the field labels/inputs in the component as required.
        </footer>
      </div>
    </main>
  );
}
