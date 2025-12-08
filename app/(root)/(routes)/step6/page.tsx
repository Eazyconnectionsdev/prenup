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
  const [answers, setAnswers] = useState<("yes" | "no" | null)[]>(() => Array(QUESTIONS.length).fill(null));
  const [willsHelp, setWillsHelp] = useState<"yes" | "no" | null>(null);

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
    <div className="h-full">
      <div className="w-full max-w-5xl mx-auto pl-16 py-2 pr-26">
        <header className="mb-4">
          <h1 className="text-3xl font-normal text-text-color">{HEADING}</h1>
          <p className="mt-2 text-[15px] font-light text-text-color">{SUBTEXT}</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Single gradient box containing everything; set base text color to black */}
          <div className="space-y-8 bg-gradient-to-br from-secondary to-primary-foreground py-10 px-6 rounded-lg my-6 text-text-color">
            {/* Top questions */}
            {QUESTIONS.map((q, qi) => (
              <div key={qi} className="flex flex-col items-center text-center pb-6 border-b border-white/20">
                <span className="text-base font-normal max-w-3xl">
                  <span className="font-medium mr-2">{qi + 1}.</span>
                  {q}
                </span>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setAnswer(qi, "yes")}
                    className={`px-14 shadow-md hover:bg-white/95 py-1.5 rounded-full font-medium cursor-pointer ${
                      answers[qi] === "yes" ? "bg-white text-text-color" : "bg-white text-text-color/90"
                    }`}
                  >
                    Yes
                  </button>

                  <button
                    type="button"
                    onClick={() => setAnswer(qi, "no")}
                    className={`px-14 shadow-md py-1.5 rounded-full font-medium cursor-pointer ${
                      answers[qi] === "no" ? "bg-primary text-white" : "bg-primary text-white/90"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            ))}

            {/* Wills offer — inside same gradient */}
            <div className="flex flex-col items-center text-center pb-6 border-b border-white/20">
              <span className="text-base font-normal max-w-3xl">
                You are both entitled to a Discount on our Wills Product as a Wenup Customer, would you like us to help you with your will?
              </span>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setWillsHelp("yes")}
                  className={`px-14 shadow-md hover:bg-white/95 py-1.5 rounded-full font-medium cursor-pointer ${
                    willsHelp === "yes" ? "bg-white text-text-color" : "bg-white text-text-color/90"
                  }`}
                >
                  Yes
                </button>

                <button
                  type="button"
                  onClick={() => setWillsHelp("no")}
                  className={`px-14 shadow-md py-1.5 rounded-full font-medium cursor-pointer ${
                    willsHelp === "no" ? "bg-primary text-white" : "bg-primary text-white/90"
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Inheritance A — inputs stay white but label and helper text use small black font */}
            <div className="w-full max-w-4xl text-left py-4">
              <h2 className="text-lg font-medium mb-1">Please provide details on the approximate value and composition of Sooriya Kumar Coimbatore Rajendran's Future Inheritance.</h2>
              <p className="text-[13px] opacity-80 mb-4">All figures must be in Pounds Sterling (GBP). If converting from another currency include both the original amount and the GBP equivalent.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label>
                  <div className="text-sm mb-1">Original amount</div>
                  <input
                    type="number"
                    step="any"
                    value={inheritanceA.originalAmount}
                    onChange={(e) => setInheritanceA({ ...inheritanceA, originalAmount: e.target.value })}
                    placeholder="Original amount"
                    className="w-full rounded-md border border-white/20 px-3 py-2 bg-white text-slate-900"
                  />
                </label>

                <label>
                  <div className="text-sm mb-1">Original currency</div>
                  <input
                    value={inheritanceA.originalCurrency}
                    onChange={(e) => setInheritanceA({ ...inheritanceA, originalCurrency: e.target.value })}
                    placeholder="e.g. INR, USD"
                    className="w-full rounded-md border border-white/20 px-3 py-2 bg-white text-slate-900"
                  />
                </label>

                <label>
                  <div className="text-sm mb-1">GBP equivalent</div>
                  <input
                    type="number"
                    step="any"
                    value={inheritanceA.gbpEquivalent}
                    onChange={(e) => setInheritanceA({ ...inheritanceA, gbpEquivalent: e.target.value })}
                    placeholder="£"
                    className="w-full rounded-md border border-white/20 px-3 py-2 bg-white text-slate-900"
                  />
                </label>
              </div>

              <div className="mt-3">
                <div className="text-sm mb-1">Basis of estimate</div>
                <textarea
                  rows={5}
                  value={inheritanceA.basisOfEstimate}
                  onChange={(e) => setInheritanceA({ ...inheritanceA, basisOfEstimate: e.target.value })}
                  className="w-full rounded-md border border-white/20 px-3 py-2 bg-white text-slate-900"
                  placeholder="Explain how this estimate was reached (assets, valuations, valuation dates, sources...)"
                />
              </div>
            </div>

            {/* Inheritance B */}
            <div className="w-full max-w-4xl text-left py-4">
              <h2 className="text-lg font-medium mb-1">Please provide details on the approximate value and composition of Gomathi Chandran's Future Inheritance.</h2>
              <p className="text-[13px] opacity-80 mb-4">All figures must be in Pounds Sterling (GBP). If converting from another currency include both the original amount and the GBP equivalent.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label>
                  <div className="text-sm mb-1">Original amount</div>
                  <input
                    type="number"
                    step="any"
                    value={inheritanceB.originalAmount}
                    onChange={(e) => setInheritanceB({ ...inheritanceB, originalAmount: e.target.value })}
                    placeholder="Original amount"
                    className="w-full rounded-md border border-white/20 px-3 py-2 bg-white text-slate-900"
                  />
                </label>

                <label>
                  <div className="text-sm mb-1">Original currency</div>
                  <input
                    value={inheritanceB.originalCurrency}
                    onChange={(e) => setInheritanceB({ ...inheritanceB, originalCurrency: e.target.value })}
                    placeholder="e.g. INR, USD"
                    className="w-full rounded-md border border-white/20 px-3 py-2 bg-white text-slate-900"
                  />
                </label>

                <label>
                  <div className="text-sm mb-1">GBP equivalent</div>
                  <input
                    type="number"
                    step="any"
                    value={inheritanceB.gbpEquivalent}
                    onChange={(e) => setInheritanceB({ ...inheritanceB, gbpEquivalent: e.target.value })}
                    placeholder="£"
                    className="w-full rounded-md border border-white/20 px-3 py-2 bg-white text-slate-900"
                  />
                </label>
              </div>

              <div className="mt-3">
                <div className="text-sm mb-1">Basis of estimate</div>
                <textarea
                  rows={5}
                  value={inheritanceB.basisOfEstimate}
                  onChange={(e) => setInheritanceB({ ...inheritanceB, basisOfEstimate: e.target.value })}
                  className="w-full rounded-md border border-white/20 px-3 py-2 bg-white text-slate-900"
                  placeholder="Explain how this estimate was reached (assets, valuations, valuation dates, sources...)"
                />
              </div>
            </div>

            {/* Save button inside the gradient box */}
            <div className="flex items-center justify-center pt-2">
              <button type="submit" className="px-6 py-3 rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#76E0FF] text-white font-medium shadow">
                Save / Continue
              </button>
            </div>

            <div className="text-[13px] opacity-80 text-center mt-2">
              All financial figures should be entered in GBP.
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
