// file: app/joint-assets/Page.tsx
"use client";

import Axios from "@/lib/ApiConfig";
import { RootState } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const HEADING = "Joint assets";
const SUBTEXT =
  "Unless you specify otherwise below, it will be assumed that each of these joint assets are split equally with your partner.";

const QUESTIONS = [
  `Do you have any shared earnings or earnings you'd like to share in the event of a divorce or separation?`,
  `Do you currently (or will you once married) live in a property that is rented or owned by one or both of you?`,
  `Do you have any shared savings or savings you'd like to share in the event of a divorce or separation?`,
  `Do you have any shared pensions or pensions you'd like to share in the event of a divorce or separation?`,
];

const FOLLOW_UPS = [
  `Do you have any shared debts or debts you'd like to share in the event of a divorce or separation? This includes current credit card balances, loans, etc.`,
  `Do you have any shared businesses or businesses you'd like to share in the event of a divorce or separation?`,
  `Do you have any shared chattels or chattels you'd like to share in the event of a divorce or separation?`,
  `Do you have any other shared assets or any other assets you'd like to share in the event of a divorce or separation?`,
];

export default function JointAssetsPage() {
  const { caseId } = useSelector((state: RootState) => state.auth);

  const [answers, setAnswers] = useState<(boolean | null)[]>(() =>
    Array(QUESTIONS.length).fill(null)
  );

  const [firstQuestion, setFirstQuestion] = useState<boolean | null>(null);

  const [followUps, setFollowUps] = useState<(boolean | null)[]>(() =>
    Array(FOLLOW_UPS.length).fill(null)
  );

  const setMainAnswer = (idx: number, val: "yes" | "no") => {
    const boolVal = val === "yes";

    setAnswers((prev) => {
      const copy = [...prev];
      copy[idx] = boolVal;
      return copy;
    });

    if (idx === 0) {
      setFirstQuestion(boolVal);
      if (!boolVal) {
        setFollowUps(Array(FOLLOW_UPS.length).fill(null));
      }
    }
  };

  const setFollowUpAnswer = (idx: number, val: "yes" | "no") => {
    const boolVal = val === "yes";

    setFollowUps((prev) => {
      const copy = [...prev];
      copy[idx] = boolVal;
      return copy;
    });
  };

  const boolToYesNo = (v: boolean | null): "yes" | "no" | null =>
    v === true ? "yes" : v === false ? "no" : null;

  const yesNoToBool = (v: any): boolean | null =>
    v === "yes" ? true : v === "no" ? false : null;

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const payload = {
      heading: HEADING,
      questions: QUESTIONS.map((q, i) => ({
        question: q,
        answer: boolToYesNo(answers[i]),
      })),
      followUpsShown: firstQuestion === true,
      followUps: FOLLOW_UPS.map((q, i) => ({
        question: q,
        answer: boolToYesNo(followUps[i]),
      })),
    };

    try {
      const { data } = await Axios.post(`/cases/${caseId}/steps/5`, payload);
      toast.success("Submitted Successfully");
    } catch (error: any) {
      console.error("Error submitting questionnaire:", error);
      if (error && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message || error.message);
      }
    }
  };

  // ---------------- Fetch existing ----------------

  useEffect(() => {
  if (!caseId) return;

  const fetchData = async () => {
    try {
      const { data } = await Axios.get(`/cases/${caseId}/steps/5`);
      const d = data?.data;
      if (!d) return;

      /* Main questions */
      const mainAns = QUESTIONS.map((q) => {
        const qa = d.questions?.find((item: any) => item.question === q);
        return yesNoToBool(qa?.answer);
      });

      setAnswers(mainAns);

      /* First question controls follow-ups */
      const first = mainAns[0];
      setFirstQuestion(first);

      /* Follow-ups */
      if (Array.isArray(d.followUps)) {
        const follow = FOLLOW_UPS.map((q) => {
          const qa = d.followUps.find((item: any) => item.question === q);
          return yesNoToBool(qa?.answer);
        });
        setFollowUps(follow);
      } else {
        setFollowUps(Array(FOLLOW_UPS.length).fill(null));
      }
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  fetchData();
}, [caseId]);


  return (
    <div className="h-full">
      <div className="w-full max-w-5xl mx-auto pl-16 py-2 pr-26">
        <header className="mb-4">
          <h1 className="text-3xl font-normal text-text-color">{HEADING}</h1>
          <p className="mt-2 text-[15px] font-light text-text-color">
            {SUBTEXT}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-0">
          <div className="space-y-10 bg-gradient-to-br from-secondary to-primary-foreground text-white py-10 px-6 rounded-lg my-10">
            {QUESTIONS.map((q, qi) => (
              <div
                key={qi}
                className="flex flex-col items-center text-center pb-6 border-b border-white/20"
              >
                <span className="text-base font-normal text-text-color max-w-3xl">
                  <span className="font-medium mr-2">{qi + 1}.</span>
                  {q}
                </span>

                <div
                  className="flex gap-3 mt-6"
                  role="group"
                  aria-label={`Question ${qi + 1} answer`}
                >
                  <button
                    type="button"
                    onClick={() => setMainAnswer(qi, "yes")}
                    aria-pressed={answers[qi] === true}
                    className={`px-14 shadow-md hover:bg-gray-100 py-1.5 rounded-full font-medium cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300 ${
                      answers[qi] === true
                        ? "bg-green-600 text-white"
                        : "bg-white text-text-color"
                    }`}
                  >
                    Yes
                  </button>

                  <button
                    type="button"
                    onClick={() => setMainAnswer(qi, "no")}
                    aria-pressed={answers[qi] === true}
                    className={`px-14 shadow-md hover:bg-gray-100 py-1.5 rounded-full font-medium cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300 ${
                      answers[qi] === false
                        ? "bg-red-600 text-white"
                        : "bg-white text-text-color"
                    }`}
                  >
                    No
                  </button>
                </div>

                {qi === 0 && firstQuestion === true && (
                  <div className="mt-6 w-full max-w-3xl text-left bg-white/90 rounded-md p-4">
                    <div className="text-sm text-slate-700 mb-3 font-medium">
                      Please answer the follow-up questions about other shared
                      assets
                    </div>
                    <div className="space-y-4">
                      {FOLLOW_UPS.map((fq, fidx) => (
                        <div
                          key={fidx}
                          className="flex flex-col items-center text-center pb-4 border-b last:border-b-0 border-slate-200"
                        >
                          <p className="text-sm text-slate-800 max-w-3xl">
                            {fq}
                          </p>
                          <div
                            className="flex gap-3 mt-3"
                            role="group"
                            aria-label={`Follow up ${fidx + 1}`}
                          >
                            <button
                              type="button"
                              onClick={() => setFollowUpAnswer(fidx, "yes")}
                              aria-pressed={followUps[fidx] === true}
                              className={`px-12 shadow-md hover:bg-gray-100 py-1.5 rounded-full font-medium cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300 ${
                                followUps[fidx] === true
                                  ? "bg-green-600 text-white"
                                  : "bg-white text-text-color"
                              }`}
                            >
                              Yes
                            </button>

                            <button
                              type="button"
                              onClick={() => setFollowUpAnswer(fidx, "no")}
                              aria-pressed={followUps[fidx] === false}
                              className={`px-12 shadow-md hover:bg-gray-100 py-1.5 rounded-full font-medium cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300 ${
                                followUps[fidx] === false
                                  ? "bg-red-600 text-white"
                                  : "bg-white text-text-color"
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

            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#76E0FF] text-white font-medium shadow"
              >
                Save / Continue
              </button>
            </div>

            <footer className="mt-6 text-xs text-slate-200 text-center">
              Answers are saved locally in this demo (check console). I can add
              localStorage autosave or API integration if you&apos;d like.
            </footer>
          </div>
        </form>
      </div>
    </div>
  );
}
