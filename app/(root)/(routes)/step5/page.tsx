// file: app/joint-assets/Page.tsx
"use client";

import React, { useState } from "react";

const HEADING = "Joint assets";
const SUBTEXT = "Unless you specify otherwise below, it will be assumed that each of these joint assets are split equally with your partner.";

const QUESTIONS = [
  `Do you have any shared earnings or earnings you'd like to share in the event of a divorce or separation?`,
  `Do you currently (or will you once married) live in a property that is rented or owned by one or both of you?`,
  `Do you have any shared savings or savings you'd like to share in the event of a divorce or separation?`,
  `Do you have any shared pensions or pensions you'd like to share in the event of a divorce or separation?`,
];

/** The follow-up questions that appear only when the first question is "yes" */
const FOLLOW_UPS = [
  `Do you have any shared debts or debts you'd like to share in the event of a divorce or separation? This includes current credit card balances, loans, etc.`,
  `Do you have any shared businesses or businesses you'd like to share in the event of a divorce or separation?`,
  `Do you have any shared chattels or chattels you'd like to share in the event of a divorce or separation?`,
  `Do you have any other shared assets or any other assets you'd like to share in the event of a divorce or separation?`,
];

export default function JointAssetsPage() {
  // answers for the main questions: 'yes' | 'no' | null
  const [answers, setAnswers] = useState<("yes" | "no" | null)[]>(
    () => Array(QUESTIONS.length).fill(null)
  );

  // first question toggles the follow ups; store as separate state too for clarity
  const [firstQuestion, setFirstQuestion] = useState<"yes" | "no" | null>(null);

  // follow-up answers (only used when firstQuestion === 'yes')
  const [followUps, setFollowUps] = useState<("yes" | "no" | null)[]>(
    () => Array(FOLLOW_UPS.length).fill(null)
  );

  const setMainAnswer = (idx: number, val: "yes" | "no") => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });

    if (idx === 0) {
      // keep firstQuestion in sync
      setFirstQuestion(val);
      // if answering 'no' clear follow-ups
      if (val === "no") {
        setFollowUps(Array(FOLLOW_UPS.length).fill(null));
      }
    }
  };

  const setFollowUpAnswer = (idx: number, val: "yes" | "no") => {
    setFollowUps((prev) => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const payload = {
      heading: HEADING,
      mainQuestions: QUESTIONS.map((q, i) => ({ question: q, answer: answers[i] })),
      followUpsShown: firstQuestion === "yes",
      followUpQuestions: FOLLOW_UPS.map((q, i) => ({ question: q, answer: followUps[i] })),
      savedAt: new Date().toISOString(),
    };
    console.log("JOINT ASSETS FORM SUBMIT", payload);
    alert("Joint assets answers saved (check console). Replace handleSubmit to POST to your API.");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-start justify-center p-6">
      <div className="w-full max-w-3xl">
        <header className="mb-4 text-center">
          <h1 className="text-3xl md:text-4xl font-serif text-slate-900">{HEADING}</h1>
          <p className="mt-2 text-sm text-slate-500">{SUBTEXT}</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl ring-1 ring-slate-100 p-6 md:p-8 space-y-6">
          {/* Questions top-to-bottom */}
          <div className="space-y-6">
            {QUESTIONS.map((q, qi) => (
              <div key={qi} className="pb-4 border-b border-slate-100">
                <div className="mb-3 text-slate-800">
                  <p className="text-base md:text-lg leading-relaxed text-left">{q}</p>
                </div>

                {/* Only first question has the centered yes/no that toggles follow-ups.
                    For all other questions we show simple centered yes/no as requested. */}
                <div className="flex items-center gap-4 mb-4 justify-center">
                  <button
                    type="button"
                    onClick={() => setMainAnswer(qi, "yes")}
                    aria-pressed={answers[qi] === "yes"}
                    className={`px-6 py-2 rounded-full font-medium shadow-sm border-2 ${
                      answers[qi] === "yes" ? "bg-green-600 text-white border-green-600" : "bg-white text-slate-700 border-slate-200 hover:shadow"
                    }`}
                  >
                    Yes
                  </button>

                  <button
                    type="button"
                    onClick={() => setMainAnswer(qi, "no")}
                    aria-pressed={answers[qi] === "no"}
                    className={`px-6 py-2 rounded-full font-medium shadow-sm border-2 ${
                      answers[qi] === "no" ? "bg-red-600 text-white border-red-600" : "bg-white text-slate-700 border-slate-200 hover:shadow"
                    }`}
                  >
                    No
                  </button>
                </div>

                {/* If this is the first question AND its answer is yes -> show follow-ups */}
                {qi === 0 && firstQuestion === "yes" && (
                  <div className="mt-4 bg-white/40 p-4 rounded-lg border border-slate-100">
                    <div className="space-y-4">
                      {FOLLOW_UPS.map((fq, fidx) => (
                        <div key={fidx} className="pb-4 border-b last:border-b-0 border-slate-100">
                          <div className="mb-3 text-slate-800">
                            <p className="text-sm leading-relaxed">{fq}</p>
                          </div>
                          <div className="flex items-center gap-4 mb-2 justify-center">
                            <button
                              type="button"
                              onClick={() => setFollowUpAnswer(fidx, "yes")}
                              aria-pressed={followUps[fidx] === "yes"}
                              className={`px-5 py-2 rounded-full font-medium shadow-sm border-2 ${
                                followUps[fidx] === "yes" ? "bg-green-600 text-white border-green-600" : "bg-white text-slate-700 border-slate-200"
                              }`}
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() => setFollowUpAnswer(fidx, "no")}
                              aria-pressed={followUps[fidx] === "no"}
                              className={`px-5 py-2 rounded-full font-medium shadow-sm border-2 ${
                                followUps[fidx] === "no" ? "bg-red-600 text-white border-red-600" : "bg-white text-slate-700 border-slate-200"
                              }`}
                            >
                              No
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Save / Submit */}
          <div className="flex items-center justify-center">
            <button type="submit" className="px-6 py-3 rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#76E0FF] text-white font-medium shadow">
              Save / Continue
            </button>
          </div>
        </form>

        <footer className="mt-6 text-xs text-slate-400 text-center">
          Answers are saved locally in this demo (check console). I can add localStorage persistence or per-question entry forms if you want.
        </footer>
      </div>
    </main>
  );
}
