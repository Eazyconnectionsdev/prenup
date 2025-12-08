// file: app/areas-of-complexity/Page.tsx
"use client";

import React, { useState } from "react";

const HEADING = "Areas of Complexity";
const SUBTEXT = "Please fill in each of the sections below to complete your agreement.";

const QUESTIONS = [
  "Is one of you pregnant?",
  "Does one or both of you own a business that you work in together?",
  "Is one of you out of work, whether with no job or else on leave from work due to sickness or other circumstances, and/or financially dependant on the other person?",
  "Is your family home owned with a 3rd party outside of the relationship?",
  "Are your combined assets worth more than £3m?",
  "Is one of you out of work, whether with no job or else on leave from work due to sickness or other circumstances, and/or financially dependant on the other person?",
  "Is your family home owned with a 3rd party outside of the relationship?",
  "Are your combined assets worth more than £3m?",
  "Do you have a child from either of your current or previous relationships living with you?"
];

export default function AreasOfComplexityPage() {
  // 'yes' | 'no' | null for each question
  const [answers, setAnswers] = useState<( "yes" | "no" | null)[]>(() => Array(QUESTIONS.length).fill(null));

  // Overview text for each question (shown when answer === 'yes')
  const [overviews, setOverviews] = useState<string[]>(() => Array(QUESTIONS.length).fill(""));

  const setAnswer = (idx: number, val: "yes" | "no") => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });

    // If switched to "no", optionally clear the overview (keeps data if user toggles back)
    // setOverviews(prev => { const c = [...prev]; if (val === "no") c[idx] = ""; return c; });
  };

  const setOverview = (idx: number, text: string) => {
    setOverviews((prev) => {
      const copy = [...prev];
      copy[idx] = text;
      return copy;
    });
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const payload = QUESTIONS.map((q, i) => ({
      question: q,
      answer: answers[i],
      overview: answers[i] === "yes" ? overviews[i] : null,
    }));
    console.log("AREAS OF COMPLEXITY SUBMIT", payload);
    alert("Saved (check console). Replace handleSubmit to POST to your API if desired.");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-start justify-center p-6">
      <div className="w-full max-w-3xl">
        <header className="mb-4 text-center">
          <h1 className="text-3xl md:text-4xl font-serif text-slate-900">{HEADING}</h1>
          <p className="mt-2 text-sm text-slate-500">{SUBTEXT}</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl ring-1 ring-slate-100 p-6 md:p-8 space-y-6">
          <div className="space-y-6">
            {QUESTIONS.map((q, qi) => (
              <div key={qi} className="pb-4 border-b border-slate-100">
                <div className="mb-3 text-slate-800">
                  <p className="text-base md:text-lg leading-relaxed text-left">
                    <span className="font-medium mr-2">{qi + 1}.</span>
                    {q}
                  </p>
                </div>

                <div className="flex items-center gap-4 mb-4 justify-center">
                  <button
                    type="button"
                    onClick={() => setAnswer(qi, "yes")}
                    aria-pressed={answers[qi] === "yes"}
                    className={`px-6 py-2 rounded-full font-medium shadow-sm border-2 ${
                      answers[qi] === "yes" ? "bg-green-600 text-white border-green-600" : "bg-white text-slate-700 border-slate-200 hover:shadow"
                    }`}
                  >
                    Yes
                  </button>

                  <button
                    type="button"
                    onClick={() => setAnswer(qi, "no")}
                    aria-pressed={answers[qi] === "no"}
                    className={`px-6 py-2 rounded-full font-medium shadow-sm border-2 ${
                      answers[qi] === "no" ? "bg-red-600 text-white border-red-600" : "bg-white text-slate-700 border-slate-200 hover:shadow"
                    }`}
                  >
                    No
                  </button>
                </div>

                {answers[qi] === "yes" && (
                  <div className="mt-2">
                    <div className="text-sm text-slate-700 mb-2 font-medium">Please provide an overview of it</div>
                    <textarea
                      rows={5}
                      value={overviews[qi]}
                      onChange={(e) => setOverview(qi, e.target.value)}
                      className="w-full rounded-md border border-slate-200 px-3 py-2"
                      placeholder="Please provide a short overview..."
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center">
            <button type="submit" className="px-6 py-3 rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#76E0FF] text-white font-medium shadow">
              Save / Continue
            </button>
          </div>
        </form>

        <footer className="mt-6 text-xs text-slate-400 text-center">
          Answers are saved locally in this demo (check console). I can add localStorage autosave, inline validation, or server integration if you'd like.
        </footer>
      </div>
    </main>
  );
}
