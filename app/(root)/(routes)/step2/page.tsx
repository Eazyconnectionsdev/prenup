// file: app/questions/Page.tsx
"use client";

import React, { useState } from "react";

/** Info box (NOT a question) */
const INFO =
  "Any assets listed on this page will be treated as a separate asset in the event of a divorce, including any increase in value of these assets.";

/** Questions (8 actual questions) */
const QUESTIONS: string[] = [
  `Do you have any earnings you’d like to keep separate from your partner?`,
  `Do you have any properties you’d like to keep separate from your partner?`,
  `Do you have any savings you’d like to keep separate from your partner?`,
  `Do you have any pensions you’d like to keep separate from your partner?`,
  `Do you have any debts you’d like to keep separate from your partner? This includes current credit card balances, loans, etc.`,
  `Do you have any businesses you’d like to keep separate from your partner?`,
  `Do you have any chattels you’d like to keep separate from your partner?`,
  `Do you have any other assets you’d like to keep separate from your partner?`,
];

/** Field descriptor for dynamic forms */
type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "number" | "textarea" | "select";
  options?: string[]; // for select
  placeholder?: string;
};

/**
 * Fields for each question (index-aligned with QUESTIONS)
 * 0 => earnings, 1 => properties, etc.
 */
const QUESTION_FIELDS: FieldDef[][] = [
  // 0: earnings
  [
    { key: "source", label: "Source of income", type: "select", options: ["Salary", "Self-employed", "Rental", "Investment", "Other"] },
    { key: "company", label: "Name of company", type: "text", placeholder: "Company / Employer name" },
    { key: "amount", label: "Amount (GBP)", type: "number", placeholder: "£" },
  ],
  // 1: properties (previous property fields)
  [
    { key: "line1", label: "Address Line 1", type: "text" },
    { key: "line2", label: "Address Line 2", type: "text" },
    { key: "town", label: "Town or City", type: "text" },
    { key: "postcode", label: "Postcode", type: "text" },
    { key: "value", label: "Property Value (GBP)", type: "number", placeholder: "£" },
    { key: "extra", label: "Mortgage / Outstanding / Notes", type: "text" },
  ],
  // 2: savings
  [
    { key: "savingsName", label: "Savings name", type: "text" },
    { key: "amount", label: "Amount (GBP)", type: "number", placeholder: "£" },
  ],
  // 3: pensions
  [
    { key: "pensionName", label: "Name of pension", type: "text" },
    { key: "amount", label: "Amount (GBP)", type: "number", placeholder: "£" },
  ],
  // 4: debts
  [
    { key: "lender", label: "Account / Lender", type: "text" },
    { key: "description", label: "Description", type: "text" },
    { key: "value", label: "Value (GBP)", type: "number", placeholder: "£" },
  ],
  // 5: businesses
  [
    { key: "businessName", label: "Business name", type: "text" },
    { key: "businessDescription", label: "Business description", type: "text" },
    { key: "businessValue", label: "Business value (GBP)", type: "number", placeholder: "£" },
    { key: "sharePercentage", label: "Share percentage", type: "number", placeholder: "%" },
    { key: "shareValue", label: "Value of share holding (GBP)", type: "number", placeholder: "£" },
    { key: "turnover", label: "Turnover", type: "number", placeholder: "£" },
    { key: "profits", label: "Profits", type: "number", placeholder: "£" },
    { key: "explanation", label: "Explanation of business", type: "textarea" },
  ],
  // 6: chattels (car example)
  [
    { key: "registration", label: "Car registration number", type: "text" },
    { key: "amount", label: "Amount (GBP)", type: "number", placeholder: "£" },
  ],
  // 7: other assets
  [
    { key: "provider", label: "Account provider", type: "text" },
    { key: "description", label: "Description of assets", type: "text" },
    { key: "value", label: "Assets value (GBP)", type: "number", placeholder: "£" },
  ],
];

type Entry = {
  id: string;
  values: Record<string, string | number>;
};

export default function QuestionsPage() {
  // answers for each question: "yes" | "no" | null
  const [answers, setAnswers] = useState<("yes" | "no" | null)[]>(() => Array(QUESTIONS.length).fill(null));

  // entries per question (only when answer === 'yes')
  const [entries, setEntries] = useState<Entry[][]>(() => Array(QUESTIONS.length).fill([]).map(() => []));

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
          copy[qIndex] = [makeEmptyEntry(qIndex)];
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

  function makeEmptyEntry(qIndex: number): Entry {
    const values: Record<string, string | number> = {};
    const defs = QUESTION_FIELDS[qIndex] || [];
    for (const f of defs) values[f.key] = "";
    return { id: String(Date.now()) + Math.random().toString(36).slice(2), values };
  }

  const addEntry = (qIndex: number) => {
    setEntries((prev) => {
      const copy = prev.map((e) => [...e]);
      copy[qIndex] = copy[qIndex] || [];
      copy[qIndex].push(makeEmptyEntry(qIndex));
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

  const updateEntryField = (qIndex: number, entryId: string, fieldKey: string, value: string | number) => {
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
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-start justify-center p-6">
      <div className="w-full max-w-3xl">
        <header className="mb-4 text-center">
          <h1 className="text-3xl md:text-4xl font-serif text-slate-900">Your separate assets</h1>
          <p className="mt-2 text-sm text-slate-500">Please fill in each of the sections below to complete your agreement.</p>
        </header>

        <section className="bg-white rounded-2xl shadow-2xl ring-1 ring-slate-100 p-6 md:p-8">
          {/* Information box (not a question) */}
          <div className="mb-8 rounded-md bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-slate-700">
            {INFO}
          </div>

          {/* Questions list */}
          <div className="space-y-6">
            {QUESTIONS.map((q, qi) => {
              const defs = QUESTION_FIELDS[qi] || [];
              return (
                <div key={qi} className="pb-4 border-b border-slate-100">
                  <div className="mb-3 text-slate-800">
                    <p className="text-base md:text-lg leading-relaxed text-left">{q}</p>
                  </div>

                  {/* Yes / No buttons centered below the question */}
                  <div className="flex items-center gap-4 mb-4 justify-center">
                    <button
                      onClick={() => setAnswer(qi, "yes")}
                      aria-pressed={answers[qi] === "yes"}
                      aria-label={`Answer yes to q${qi + 1}`}
                      className={`px-6 py-2 rounded-full font-medium shadow-sm border-2 ${
                        answers[qi] === "yes" ? "bg-green-600 text-white border-green-600" : "bg-white text-slate-700 border-slate-200 hover:shadow"
                      }`}
                    >
                      Yes
                    </button>

                    <button
                      onClick={() => setAnswer(qi, "no")}
                      aria-pressed={answers[qi] === "no"}
                      aria-label={`Answer no to q${qi + 1}`}
                      className={`px-6 py-2 rounded-full font-medium shadow-sm border-2 ${
                        answers[qi] === "no" ? "bg-red-600 text-white border-red-600" : "bg-white text-slate-700 border-slate-200 hover:shadow"
                      }`}
                    >
                      No
                    </button>
                  </div>

                  {/* When answered yes — show entries list */}
                  {answers[qi] === "yes" && (
                    <div className="bg-white/40 p-4 rounded-lg border border-slate-100">
                      <div className="space-y-4">
                        {(entries[qi] || []).map((entry) => (
                          <div key={entry.id} className="relative grid grid-cols-1 md:grid-cols-2 gap-3 bg-white rounded-md p-4 shadow-sm">
                            {/* Remove button on right */}
                            <button
                              onClick={() => removeEntry(qi, entry.id)}
                              aria-label="Remove entry"
                              className="absolute -right-3 -top-3 w-8 h-8 rounded-full bg-white border shadow flex items-center justify-center text-slate-700"
                            >
                              ×
                            </button>

                            {/* Render fields in two columns when possible */}
                            <div className="space-y-3">
                              {defs.slice(0, Math.ceil(defs.length / 2)).map((f) => {
                                const val = entry.values[f.key] ?? "";
                                if (f.type === "select") {
                                  return (
                                    <label key={f.key} className="block">
                                      <select
                                        value={String(val)}
                                        onChange={(e) => updateEntryField(qi, entry.id, f.key, e.target.value)}
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm bg-white"
                                      >
                                        <option value="">Select {f.label}</option>
                                        {f.options?.map((opt) => (
                                          <option key={opt} value={opt}>
                                            {opt}
                                          </option>
                                        ))}
                                      </select>
                                    </label>
                                  );
                                }
                                if (f.type === "textarea") {
                                  return (
                                    <label key={f.key} className="block">
                                      <textarea
                                        value={String(val)}
                                        onChange={(e) => updateEntryField(qi, entry.id, f.key, e.target.value)}
                                        placeholder={f.label}
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                                        rows={4}
                                      />
                                    </label>
                                  );
                                }
                                return (
                                  <label key={f.key} className="block">
                                    <input
                                      type={f.type === "number" ? "number" : "text"}
                                      step={f.type === "number" ? "any" : undefined}
                                      value={String(val)}
                                      onChange={(e) =>
                                        updateEntryField(qi, entry.id, f.key, f.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)
                                      }
                                      placeholder={f.placeholder ?? f.label}
                                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                                    />
                                  </label>
                                );
                              })}
                            </div>

                            <div className="space-y-3">
                              {defs.slice(Math.ceil(defs.length / 2)).map((f) => {
                                const val = entry.values[f.key] ?? "";
                                if (f.type === "select") {
                                  return (
                                    <label key={f.key} className="block">
                                      <select
                                        value={String(val)}
                                        onChange={(e) => updateEntryField(qi, entry.id, f.key, e.target.value)}
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm bg-white"
                                      >
                                        <option value="">Select {f.label}</option>
                                        {f.options?.map((opt) => (
                                          <option key={opt} value={opt}>
                                            {opt}
                                          </option>
                                        ))}
                                      </select>
                                    </label>
                                  );
                                }
                                if (f.type === "textarea") {
                                  return (
                                    <label key={f.key} className="block">
                                      <textarea
                                        value={String(val)}
                                        onChange={(e) => updateEntryField(qi, entry.id, f.key, e.target.value)}
                                        placeholder={f.label}
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                                        rows={4}
                                      />
                                    </label>
                                  );
                                }
                                return (
                                  <label key={f.key} className="block">
                                    <input
                                      type={f.type === "number" ? "number" : "text"}
                                      step={f.type === "number" ? "any" : undefined}
                                      value={String(val)}
                                      onChange={(e) =>
                                        updateEntryField(qi, entry.id, f.key, f.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)
                                      }
                                      placeholder={f.placeholder ?? f.label}
                                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                                    />
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add New Entry button centered */}
                      <div className="mt-4 flex justify-center">
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
              );
            })}
          </div>
        </section>

        <footer className="mt-6 text-xs text-slate-400 text-center">
          These input labels are set per question — update QUESTION_FIELDS if you want different names or types.
        </footer>
      </div>
    </main>
  );
}
