// file: app/questions/Page.tsx
"use client";

import React, { useState } from "react";

/**
 * Questions (the ones you listed).
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
 * Change labels/keys later as you wish.
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

  // entries per question (only when answer === 'yes')
  const [entries, setEntries] = useState<Entry[][]>(() =>
    Array(QUESTIONS.length).fill([]).map(() => [])
  );

  const setAnswer = (qIndex: number, val: "yes" | "no") => {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = val;
      return next;
    });

    if (val === "yes") {
      setEntries((prev) => {
        const copy = prev.map((e) => [...e]);
        if (!copy[qIndex] || copy[qIndex].length === 0) {
          copy[qIndex] = [makeEmptyEntry()];
        }
        return copy;
      });
    }
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
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <header className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-serif text-slate-900">Your separate assets</h1>
          <p className="mt-2 text-sm text-slate-500">Please fill in each of the sections below to complete your agreement.</p>
        </header>

        <section className="bg-white rounded-2xl shadow-2xl ring-1 ring-slate-100 p-8 md:p-10">
          {/* Top-to-bottom questions */}
          <div className="space-y-8">
            {QUESTIONS.map((q, qi) => (
              <div key={qi}>
                <div className="mb-3 text-slate-800">
                  <p className="text-base md:text-lg leading-relaxed">{q}</p>
                </div>

                {/* Yes / No buttons centered below the question */}
                <div className="flex items-center gap-4 mb-4 justify-center">
                  <button
                    onClick={() => setAnswer(qi, "yes")}
                    aria-pressed={answers[qi] === "yes"}
                    aria-label={`Answer yes to q${qi + 1}`}
                    className={`px-6 py-2 rounded-full font-medium shadow-sm border-2 ${
                      answers[qi] === "yes"
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-slate-700 border-slate-200 hover:shadow"
                    }`}
                  >
                    Yes
                  </button>

                  <button
                    onClick={() => setAnswer(qi, "no")}
                    aria-pressed={answers[qi] === "no"}
                    aria-label={`Answer no to q${qi + 1}`}
                    className={`px-6 py-2 rounded-full font-medium shadow-sm border-2 ${
                      answers[qi] === "no"
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-white text-slate-700 border-slate-200 hover:shadow"
                    }`}
                  >
                    No
                  </button>
                </div>

                {/* When answered yes — show entries list */}
                {answers[qi] === "yes" && (
                  <div className="bg-white/40 p-4 rounded-lg border border-slate-100">
                    {/* Entries */}
                    <div className="space-y-4">
                      {(entries[qi] || []).map((entry) => (
                        <div key={entry.id} className="relative grid grid-cols-1 md:grid-cols-2 gap-3 bg-white rounded-md p-4 shadow-sm">
                          {/* Remove button on right (matches your screenshot) */}
                          <button
                            onClick={() => removeEntry(qi, entry.id)}
                            aria-label="Remove entry"
                            className="absolute -right-3 -top-3 w-8 h-8 rounded-full bg-white border shadow flex items-center justify-center text-slate-700"
                          >
                            ×
                          </button>

                          {/* Left column fields */}
                          <div className="space-y-3">
                            {FIELDS.slice(0, Math.ceil(FIELDS.length / 2)).map((f) => (
                              <label key={f.key} className="block">
                                <input
                                  value={entry.values[f.key]}
                                  onChange={(e) => updateEntryField(qi, entry.id, f.key, e.target.value)}
                                  placeholder={f.label}
                                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                                />
                              </label>
                            ))}
                          </div>

                          {/* Right column fields */}
                          <div className="space-y-3">
                            {FIELDS.slice(Math.ceil(FIELDS.length / 2)).map((f) => (
                              <label key={f.key} className="block">
                                <input
                                  value={entry.values[f.key]}
                                  onChange={(e) => updateEntryField(qi, entry.id, f.key, e.target.value)}
                                  placeholder={f.label}
                                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                                />
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add New Entry button (matches original style) */}
                    <div className="mt-4 ">
                      <button
                        onClick={() => addEntry(qi)}
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-md bg-white text-slate-700 font-medium shadow border"
                      >
                        <span className="w-6 h-6 rounded-full flex items-center justify-center bg-red-500 text-white text-sm font-bold">+</span>
                        Add New Entry
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-6 text-xs text-slate-400 text-center">
          These input labels are placeholders — change `FIELDS` in the component to your exact field names later.
        </footer>
      </div>
    </main>
  );
}
