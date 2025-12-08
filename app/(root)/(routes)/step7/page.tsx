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
  const [answers, setAnswers] = useState<("yes" | "no" | null)[]>(
    () => Array(QUESTIONS.length).fill(null)
  );
  const [overviews, setOverviews] = useState<string[]>(
    () => Array(QUESTIONS.length).fill("")
  );

  const setAnswer = (idx: number, val: "yes" | "no") => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
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
    <div className="h-full">
      <div className="w-full max-w-5xl mx-auto pl-16 py-2 pr-26">
        {/* Header: left-aligned and same sizing as your sample */}
        <header className="mb-4">
          <h1 className="text-3xl font-normal text-text-color">{HEADING}</h1>
          <p className="mt-2 text-[15px] font-light text-text-color">{SUBTEXT}</p>
        </header>

        {/* Gradient box holding questions — mirrors your second snippet */}
        <form onSubmit={handleSubmit} className="space-y-0">
          <div className="space-y-10 bg-gradient-to-br from-secondary to-primary-foreground text-white py-10 px-6 rounded-lg my-10">
            {QUESTIONS.map((q, qi) => (
              <div key={qi} className="flex flex-col items-center text-center pb-6 border-b border-white/20">
                <span className="text-base font-normal text-text-color max-w-md">
                  <span className="font-medium mr-2">{qi + 1}.</span>
                  {q}
                </span>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setAnswer(qi, "yes")}
                    className={`px-14 shadow-md hover:bg-white/95 py-1.5 rounded-full font-medium cursor-pointer ${answers[qi] === "yes" ? "bg-white text-text-color" : "bg-white text-text-color/90"
                      }`}
                  >
                    Yes
                  </button>

                  <button
                    type="button"
                    onClick={() => setAnswer(qi, "no")}
                    className={`px-14 shadow-md py-1.5 rounded-full font-medium cursor-pointer ${answers[qi] === "no" ? "bg-primary text-white" : "bg-primary text-white/90"
                      }`}
                  >
                    No
                  </button>
                </div>

                {/* White overview area shown when 'Yes' */}
                {answers[qi] === "yes" && (
                  <div className="mt-6 w-full max-w-3xl text-left">
                    <div className="text-sm text-slate-700 mb-2 font-medium">Please provide an overview of it</div>
                    <textarea
                      rows={5}
                      value={overviews[qi]}
                      onChange={(e) => setOverview(qi, e.target.value)}
                      className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900"
                      placeholder="Please provide a short overview..."
                    />
                  </div>
                )}
              </div>
            ))}

            <div className="flex items-center justify-center">
              <button type="submit" className="px-6 py-3 rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#76E0FF] text-white font-medium shadow">
                Save / Continue
              </button>
            </div>

          </div>

        </form>

        <footer className="mt-6 text-xs text-slate-400 text-center">
          Answers are saved locally in this demo (check console). I can add localStorage autosave, inline validation, or server integration if you'd like.
        </footer>
      </div>
    </div >
  );
}
