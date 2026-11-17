"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Axios from "@/lib/ApiConfig";
import {
  countByStageFilter,
  toStageFacts,
  type CaseStageFacts,
} from "@/lib/caseStages";

const TOP_CARDS = [
  { value: "ALL", label: "Total Cases" },
  { value: "LAWYER_ONBOARDING_PENDING", label: "Onboarding Pending" },
  { value: "LAWYER_COMPLETED", label: "Completed" },
];

const ONBOARDED_CARDS = [
  { value: "LAWYER_REVIEW_PENDING", label: "Review Pending" },
  { value: "LAWYER_ILA_SIGNOFF", label: "ILA & Sign-Off Pending" },
  { value: "LAWYER_FINAL_CONFIRMATION", label: "Final Confirmation Pending" },
];

const ALL_FILTERS = [
  ...TOP_CARDS.map((c) => c.value),
  "LAWYER_ONBOARDED",
  ...ONBOARDED_CARDS.map((c) => c.value),
];

const LawyerPage = () => {
  const router = useRouter();

  const [cases, setCases] = useState<CaseStageFacts[]>([]);
  const [isOnboardedExpanded, setIsOnboardedExpanded] = useState(false);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const { data } = await Axios.get("/lawyer/cases");
        setCases((Array.isArray(data) ? data : []).map(toStageFacts));
      } catch (err) {
        console.error("Failed to fetch cases", err);
        setCases([]);
      }
    };
    fetchCases();
  }, []);

  const counts = useMemo(
    () => countByStageFilter(cases, ALL_FILTERS),
    [cases],
  );

  const openStage = (value: string) =>
    router.push(`/lawyer/assigned-cases?status=${value}`);

  return (
    <div className="p-8">
      <div className="flex flex-col gap-6 max-w-[1280px]">
        <div className="flex flex-col gap-4">
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans">
            LAWYER DASHBOARD STATUS
          </h2>

          <div className="grid grid-cols-4 gap-5">
            <div
              onClick={() => openStage("ALL")}
              className="bg-[#131e36] border border-[#1b2a47] hover:border-slate-500 hover:bg-[#1b2947] rounded-xl p-6 flex flex-col justify-between h-[112px] shadow-xs cursor-pointer transition-all"
            >
              <span className="text-[10px] font-bold font-sans uppercase tracking-wider text-slate-300">
                Total Cases
              </span>
              <div className="text-3xl font-bold font-sans text-white tracking-tight leading-none">
                {counts.ALL}
              </div>
            </div>

            {TOP_CARDS.slice(1).map((card) => (
              <div
                key={card.value}
                onClick={() => openStage(card.value)}
                className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between h-[112px] shadow-xs cursor-pointer hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <span className="text-[10px] font-bold font-sans uppercase tracking-wider text-slate-400">
                  {card.label}
                </span>
                <div className="text-3xl font-bold font-sans text-slate-800 tracking-tight leading-none">
                  {counts[card.value]}
                </div>
              </div>
            ))}

            <div
              onClick={() => setIsOnboardedExpanded((prev) => !prev)}
              className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between h-[112px] shadow-xs cursor-pointer hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between text-[10px] font-bold font-sans uppercase tracking-wider text-slate-400">
                <span>Onboarded</span>
                <span className="text-slate-400 text-xs">
                  {isOnboardedExpanded ? "▲" : "▼"}
                </span>
              </div>
              <div className="text-3xl font-bold font-sans text-slate-800 tracking-tight leading-none">
                {counts.LAWYER_ONBOARDED}
              </div>
            </div>
          </div>

          {isOnboardedExpanded && (
            <div className="flex justify-center gap-5 mt-4 transition-all duration-300 ease-in-out">
              {ONBOARDED_CARDS.map((card) => (
                <div
                  key={card.value}
                  onClick={() => openStage(card.value)}
                  className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between h-[104px] flex-1 max-w-[305px] w-full shadow-2xs hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
                >
                  <span className="text-[10px] font-bold font-sans uppercase tracking-wider text-slate-400 leading-snug">
                    {card.label}
                  </span>
                  <div className="text-2xl font-bold font-sans text-slate-800 tracking-tight leading-none">
                    {counts[card.value]}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LawyerPage;
