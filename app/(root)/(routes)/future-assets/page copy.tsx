// file: app/future-assets/Page.tsx
"use client";

import React, { useState } from "react";

const HEADING = "Future Assets";
const SUBTEXT = "Please fill in each of the sections below to complete your agreement.";

const QUESTIONS = [
  `If one of you inherits something, will the inheritance be considered the separate asset (Separate) for the person who inherits it, or a joint asset (Joint) shared between both of you?`,
  `If one of you is gifted something, will the gift be considered a separate asset (Separate) for whichever of you receives it, or a joint asset (Joint) shared between both of you?`,
  `Do you want any future assets or debts acquired in either of your sole names to be treated as Joint or Separate?`,
  `This agreement governs what happens in the event of divorce not death, however it is advisable that you make a new Will once you are married. Do you expect what you leave each other in the event of one of your deaths to be the same as the way your assets will be split in the event of a divorce?`,
];

export default function FutureAssetsPage() {
  // yes/no answers for top questions (null | "yes" | "no")
  const [answers, setAnswers] = useState<( "yes" | "no" | null)[]>(() => Array(QUESTIONS.length).fill(null));

  // Wills offer
  const [willsHelp, setWillsHelp] = useState<"yes" | "no" | null>(null);

  // Inheritance details for two named people
  type Inheritance = {
    originalAmount: string;
    originalCurrency: string;
    gbpEquivalent: string;
    basisOfEstimate: string;
  };

  const [inheritanceA, setInheritanceA] = useState<Inheritance>({
    originalAmount: "",
    originalCurrency: "",
    gbpEquivalent: "",
    basisOfEstimate: "",
  });

  const [inheritanceB, setInheritanceB] = useState<Inheritance>({
    originalAmount: "",
    originalCurrency: "",
    gbpEquivalent: "",
    basisOfEstimate: "",
  });

  const setAnswer = (idx: number, val: "yes" | "no") => {
    setAnswers(prev => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const payload = {
      heading: HEADING,
      questions: QUESTIONS.map((q, i) => ({ question: q, answer: answers[i] })),
      willsHelp,
      inheritance: {
        "Sooriya Kumar Coimbatore Rajendran": inheritanceA,
        "Gomathi Chandran": inheritanceB,
      },
      savedAt: new Date().toISOString(),
    };
    console.log("FUTURE ASSETS SUBMIT", payload);
    alert("Future assets saved locally (check console). Replace handler with API POST to persist.");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-start justify-center p-6">
      <div className="w-full max-w-3xl">
        <header className="mb-4 text-center">
          <h1 className="text-3xl md:text-4xl font-serif text-slate-900">{HEADING}</h1>
          <p className="mt-2 text-sm text-slate-500">{SUBTEXT}</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl ring-1 ring-slate-100 p-6 md:p-8 space-y-6">
          {/* Top yes/no questions */}
          <div className="space-y-6">
            {QUESTIONS.map((q, qi) => (
              <div key={qi} className="pb-4 border-b border-slate-100">
                <div className="mb-3 text-slate-800">
                  <p className="text-base md:text-lg leading-relaxed text-left">{q}</p>
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
              </div>
            ))}
          </div>

          {/* Wills offer question */}
          <div className="pb-4 border-b border-slate-100">
            <div className="mb-3 text-slate-800">
              <p className="text-base md:text-lg leading-relaxed">You are both entitled to a Discount on our Wills Product as a Wenup Customer, would you like us to help you with your will?</p>
            </div>

            <div className="flex items-center gap-4 mb-4 justify-center">
              <button
                type="button"
                onClick={() => setWillsHelp("yes")}
                aria-pressed={willsHelp === "yes"}
                className={`px-6 py-2 rounded-full font-medium shadow-sm border-2 ${
                  willsHelp === "yes" ? "bg-green-600 text-white border-green-600" : "bg-white text-slate-700 border-slate-200 hover:shadow"
                }`}
              >
                Yes
              </button>

              <button
                type="button"
                onClick={() => setWillsHelp("no")}
                aria-pressed={willsHelp === "no"}
                className={`px-6 py-2 rounded-full font-medium shadow-sm border-2 ${
                  willsHelp === "no" ? "bg-red-600 text-white border-red-600" : "bg-white text-slate-700 border-slate-200 hover:shadow"
                }`}
              >
                No
              </button>
            </div>
          </div>

          {/* Inheritance details - Person A */}
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-lg font-medium text-slate-800">Please provide details on the approximate value and composition of Sooriya Kumar Coimbatore Rajendran's Future Inheritance.</h2>
            <p className="text-xs text-slate-400 mt-1">All figures must be in Pounds Sterling (GBP). If converting from another currency include both the original amount and the GBP equivalent.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <label>
                <div className="text-sm text-slate-700 mb-1">Original amount</div>
                <input
                  type="number"
                  step="any"
                  value={inheritanceA.originalAmount}
                  onChange={(e) => setInheritanceA({ ...inheritanceA, originalAmount: e.target.value })}
                  placeholder="Original amount"
                  className="w-full rounded-md border border-slate-200 px-3 py-2"
                />
              </label>

              <label>
                <div className="text-sm text-slate-700 mb-1">Original currency</div>
                <input
                  value={inheritanceA.originalCurrency}
                  onChange={(e) => setInheritanceA({ ...inheritanceA, originalCurrency: e.target.value })}
                  placeholder="e.g. INR, USD"
                  className="w-full rounded-md border border-slate-200 px-3 py-2"
                />
              </label>

              <label>
                <div className="text-sm text-slate-700 mb-1">GBP equivalent</div>
                <input
                  type="number"
                  step="any"
                  value={inheritanceA.gbpEquivalent}
                  onChange={(e) => setInheritanceA({ ...inheritanceA, gbpEquivalent: e.target.value })}
                  placeholder="£"
                  className="w-full rounded-md border border-slate-200 px-3 py-2"
                />
              </label>
            </div>

            <div className="mt-3">
              <div className="text-sm text-slate-700 mb-1">Basis of estimate</div>
              <textarea
                rows={5}
                value={inheritanceA.basisOfEstimate}
                onChange={(e) => setInheritanceA({ ...inheritanceA, basisOfEstimate: e.target.value })}
                className="w-full rounded-md border border-slate-200 px-3 py-2"
                placeholder="Explain how this estimate was reached (assets, valuations, valuations dates, sources...)"
              />
            </div>
          </div>

          {/* Inheritance details - Person B */}
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-lg font-medium text-slate-800">Please provide details on the approximate value and composition of Gomathi Chandran's Future Inheritance.</h2>
            <p className="text-xs text-slate-400 mt-1">All figures must be in Pounds Sterling (GBP). If converting from another currency include both the original amount and the GBP equivalent.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <label>
                <div className="text-sm text-slate-700 mb-1">Original amount</div>
                <input
                  type="number"
                  step="any"
                  value={inheritanceB.originalAmount}
                  onChange={(e) => setInheritanceB({ ...inheritanceB, originalAmount: e.target.value })}
                  placeholder="Original amount"
                  className="w-full rounded-md border border-slate-200 px-3 py-2"
                />
              </label>

              <label>
                <div className="text-sm text-slate-700 mb-1">Original currency</div>
                <input
                  value={inheritanceB.originalCurrency}
                  onChange={(e) => setInheritanceB({ ...inheritanceB, originalCurrency: e.target.value })}
                  placeholder="e.g. INR, USD"
                  className="w-full rounded-md border border-slate-200 px-3 py-2"
                />
              </label>

              <label>
                <div className="text-sm text-slate-700 mb-1">GBP equivalent</div>
                <input
                  type="number"
                  step="any"
                  value={inheritanceB.gbpEquivalent}
                  onChange={(e) => setInheritanceB({ ...inheritanceB, gbpEquivalent: e.target.value })}
                  placeholder="£"
                  className="w-full rounded-md border border-slate-200 px-3 py-2"
                />
              </label>
            </div>

            <div className="mt-3">
              <div className="text-sm text-slate-700 mb-1">Basis of estimate</div>
              <textarea
                rows={5}
                value={inheritanceB.basisOfEstimate}
                onChange={(e) => setInheritanceB({ ...inheritanceB, basisOfEstimate: e.target.value })}
                className="w-full rounded-md border border-slate-200 px-3 py-2"
                placeholder="Explain how this estimate was reached (assets, valuations, valuations dates, sources...)"
              />
            </div>
          </div>

          {/* Save / Continue */}
          <div className="flex items-center justify-center">
            <button type="submit" className="px-6 py-3 rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#76E0FF] text-white font-medium shadow">
              Save / Continue
            </button>
          </div>
        </form>

        <footer className="mt-6 text-xs text-slate-400 text-center">
          All financial figures should be entered in GBP. Replace handleSubmit with your API call to persist data.
        </footer>
      </div>
    </main>
  );
}
