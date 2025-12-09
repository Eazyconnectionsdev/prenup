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

const QUESTION_FIELDS: FieldDef[][] = [
  [
    { key: "source", label: "Source of income", type: "select", options: ["Salary", "Self-employed", "Rental", "Investment", "Other"] },
    { key: "company", label: "Name of company", type: "text", placeholder: "Company / Employer name" },
    { key: "amount", label: "Amount (GBP)", type: "number", placeholder: "£" },
  ],
  [
    { key: "line1", label: "Address Line 1", type: "text" },
    { key: "line2", label: "Address Line 2", type: "text" },
    { key: "town", label: "Town or City", type: "text" },
    { key: "postcode", label: "Postcode", type: "text" },
    { key: "value", label: "Property Value (GBP)", type: "number", placeholder: "£" },
    { key: "extra", label: "Mortgage / Outstanding / Notes", type: "text" },
  ],
  [
    { key: "savingsName", label: "Savings name", type: "text" },
    { key: "amount", label: "Amount (GBP)", type: "number", placeholder: "£" },
  ],
  [
    { key: "pensionName", label: "Name of pension", type: "text" },
    { key: "amount", label: "Amount (GBP)", type: "number", placeholder: "£" },
  ],
  [
    { key: "lender", label: "Account / Lender", type: "text" },
    { key: "description", label: "Description", type: "text" },
    { key: "value", label: "Value (GBP)", type: "number", placeholder: "£" },
  ],
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
  [
    { key: "registration", label: "Car registration number", type: "text" },
    { key: "amount", label: "Amount (GBP)", type: "number", placeholder: "£" },
  ],
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
  const [answers, setAnswers] = useState<("yes" | "no" | null)[]>(() => Array(QUESTIONS.length).fill(null));
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

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const payload = {
      heading: "Your separate assets",
      questions: QUESTIONS.map((q, i) => ({ question: q, answer: answers[i], entries: entries[i] })),
      savedAt: new Date().toISOString(),
    };
    console.log("QUESTIONS PAGE SUBMIT", payload);
    alert("Your separate assets saved locally (check console). Replace handler with API POST if needed.");
  };

  return (
    <div className="h-full">
      <div className="w-full max-w-5xl mx-auto pl-16 py-2 pr-26">
        <header className="mb-4">
          <h1 className="text-3xl font-normal text-text-color">Your separate assets</h1>
          <p className="mt-2 text-[15px] font-light text-text-color">Please fill in each of the sections below to complete your agreement.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-0">
          <div className="space-y-10 bg-gradient-to-br from-secondary to-primary-foreground text-white py-10 px-6 rounded-lg my-10">
            {/* Info box inside gradient (white card look) */}
            <div className="w-full max-w-4xl text-left mx-auto">
              <div className="rounded-md bg-white text-slate-900 p-4 mb-6 border">
                {INFO}
              </div>
            </div>

            {/* Questions */}
            {QUESTIONS.map((q, qi) => {
              const defs = QUESTION_FIELDS[qi] || [];
              return (
                <div key={qi} className="flex flex-col items-center text-center pb-6 border-b border-white/20">
                  <span className="text-base font-normal text-text-color max-w-3xl">
                    <span className="font-medium mr-2">{qi + 1}.</span>
                    {q}
                  </span>

                  <div className="flex gap-3 mt-6" role="group" aria-label={`Question ${qi + 1} answer`}>
                    <button
                      type="button"
                      onClick={() => setAnswer(qi, "yes")}
                      aria-pressed={answers[qi] === "yes"}
                      className={`px-14 shadow-md hover:bg-gray-100 py-1.5 rounded-full font-medium cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300 ${answers[qi] === "yes" ? "bg-green-600 text-white" : "bg-white text-text-color"}`}
                    >
                      Yes
                    </button>

                    <button
                      type="button"
                      onClick={() => setAnswer(qi, "no")}
                      aria-pressed={answers[qi] === "no"}
                      className={`px-14 shadow-md hover:bg-gray-100 py-1.5 rounded-full font-medium cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300 ${answers[qi] === "no" ? "bg-red-600 text-white" : "bg-white text-text-color"}`}
                    >
                      No
                    </button>
                  </div>

                  {/* Entries when answered yes */}
                  {answers[qi] === "yes" && (
                    <div className="mt-6 w-full max-w-4xl text-left bg-white/90 rounded-md p-4 mx-auto text-slate-900">
                      <div className="space-y-4">
                        {(entries[qi] || []).map((entry) => (
                          <div key={entry.id} className="relative grid grid-cols-1 md:grid-cols-2 gap-3 bg-white text-slate-900 rounded-md p-4 shadow-sm">
                            <button
                              onClick={() => removeEntry(qi, entry.id)}
                              aria-label="Remove entry"
                              className="absolute -right-3 -top-3 w-8 h-8 rounded-full bg-white border shadow flex items-center justify-center text-slate-700"
                            >
                              ×
                            </button>

                            <div className="space-y-3">
                              {defs.slice(0, Math.ceil(defs.length / 2)).map((f) => {
                                const val = entry.values[f.key] ?? "";
                                if (f.type === "select") {
                                  return (
                                    <label key={f.key} className="block text-slate-900">
                                      <select
                                        value={String(val)}
                                        onChange={(e) => updateEntryField(qi, entry.id, f.key, e.target.value)}
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm bg-white text-slate-900"
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
                                    <label key={f.key} className="block text-slate-900">
                                      <textarea
                                        value={String(val)}
                                        onChange={(e) => updateEntryField(qi, entry.id, f.key, e.target.value)}
                                        placeholder={f.label}
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900"
                                        rows={4}
                                      />
                                    </label>
                                  );
                                }
                                return (
                                  <label key={f.key} className="block text-slate-900">
                                    <input
                                      type={f.type === "number" ? "number" : "text"}
                                      step={f.type === "number" ? "any" : undefined}
                                      value={String(val)}
                                      onChange={(e) =>
                                        updateEntryField(qi, entry.id, f.key, f.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)
                                      }
                                      placeholder={f.placeholder ?? f.label}
                                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm bg-white text-slate-900"
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
                                    <label key={f.key} className="block text-slate-900">
                                      <select
                                        value={String(val)}
                                        onChange={(e) => updateEntryField(qi, entry.id, f.key, e.target.value)}
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm bg-white text-slate-900"
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
                                    <label key={f.key} className="block text-slate-900">
                                      <textarea
                                        value={String(val)}
                                        onChange={(e) => updateEntryField(qi, entry.id, f.key, e.target.value)}
                                        placeholder={f.label}
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900"
                                        rows={4}
                                      />
                                    </label>
                                  );
                                }
                                return (
                                  <label key={f.key} className="block text-slate-900">
                                    <input
                                      type={f.type === "number" ? "number" : "text"}
                                      step={f.type === "number" ? "any" : undefined}
                                      value={String(val)}
                                      onChange={(e) =>
                                        updateEntryField(qi, entry.id, f.key, f.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)
                                      }
                                      placeholder={f.placeholder ?? f.label}
                                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm bg-white text-slate-900"
                                    />
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        ))}

                        <div className="mt-4 flex justify-center">
                          <button
                            type="button"
                            onClick={() => addEntry(qi)}
                            className="inline-flex items-center gap-3 px-4 py-2 rounded-md bg-white text-slate-900 font-medium shadow border"
                          >
                            <span className="w-6 h-6 rounded-full flex items-center justify-center bg-red-500 text-white text-sm font-bold">+</span>
                            Add New Entry
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="flex items-center justify-center">
              <button type="submit" className="px-6 py-3 rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#76E0FF] text-white font-medium shadow">
                Save / Continue
              </button>
            </div>

            <footer className="mt-6 text-xs text-slate-200 text-center">
              These input labels are set per question — update QUESTION_FIELDS if you want different names or types.
            </footer>
          </div>
        </form>
      </div>
    </div>
  );
}
