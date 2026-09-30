"use client";

import React, { useEffect, useMemo, useState } from "react";
import { LawyerSidebar } from "@/components/lawyer/LawyerSidebar";
import { LawyerTopBar } from "@/components/lawyer/LawyerTopBar";
import { LawyerCase } from "@/types/lawyer-portal";
import Axios from "@/lib/ApiConfig";

const LawyerPage = () => {
  const [cases, setCases] = useState<LawyerCase[]>([]);
  const [isOnboardedExpanded, setIsOnboardedExpanded] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const isExpiringSoon = (expiryDate?: string | null) => {
    if (!expiryDate) return false;
    const diffDays = Math.ceil(
      (new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    return diffDays > 0 && diffDays < 30;
  };

  const isCompleted = (status: string) =>
    status === "CLOSED" || status === "ARCHIVED";

  const counts = useMemo(() => {
    return {
      total: cases.length,
      onboardingPending: cases.filter((c) => c.status === "FORMS_LOCKED")
        .length,
      onboarded: cases.filter(
        (c) => !isCompleted(c.status) && c.status !== "FORMS_LOCKED",
      ).length,
      completed: cases.filter((c) => isCompleted(c.status)).length,
      reviewPending: cases.filter((c) => c.status === "LAWYER_REVIEW").length,
      awaitingCounterparty: cases.filter(
        (c) => c.status === "AWAITING_COUNTERPARTY_LAWYER_APPROVAL",
      ).length,
      signOffAndIla: cases.filter((c) =>
        [
          "READY_FOR_SIGNING",
          "CLIENT_APPROVED",
          "ILA_P1_COMPLETE",
          "ILA_P2_COMPLETE",
        ].includes(c.status),
      ).length,
      expiringCertificates: cases.filter((c) =>
        isExpiringSoon(c.certificateExpiryDate),
      ).length,
    };
  }, [cases]);

  const cardClass = (filterKey: string, variant: "dark" | "light") => {
    const isActive = statusFilter === filterKey;
    if (variant === "dark") {
      return `bg-[#131e36] border rounded-xl p-6 flex flex-col justify-between h-[112px] shadow-xs cursor-pointer transition-all ${
        isActive
          ? "border-emerald-400"
          : "border-[#1b2a47] hover:border-slate-500 hover:bg-[#1b2947]"
      }`;
    }
    return `bg-white border rounded-xl p-6 flex flex-col justify-between h-[112px] shadow-xs cursor-pointer transition-all ${
      isActive
        ? "border-emerald-400 ring-1 ring-emerald-200"
        : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
    }`;
  };

  const assignedCount = useMemo(
    () => cases.filter((c) => !isCompleted(c.status)).length,
    [cases],
  );

  const completedCount = useMemo(
    () => cases.filter((c) => isCompleted(c.status)).length,
    [cases],
  );

  return (
    <main className="flex-1 p-8">
      <div className="flex flex-col gap-6 max-w-[1280px]">
        <div className="flex flex-col gap-4">
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans">
            LAWYER DASHBOARD STATUS
          </h2>

          <div className="grid grid-cols-4 gap-5">
            <div
              onClick={() => setStatusFilter("ALL")}
              className={cardClass("ALL", "dark")}
            >
              <span className="text-[10px] font-bold font-sans uppercase tracking-wider text-slate-300">
                Total Cases
              </span>
              <div className="text-3xl font-bold font-sans text-white tracking-tight leading-none">
                {counts.total}
              </div>
            </div>

            <div
              onClick={() => setStatusFilter("ONBOARDING_PENDING")}
              className={cardClass("ONBOARDING_PENDING", "light")}
            >
              <span className="text-[10px] font-bold font-sans uppercase tracking-wider text-slate-400">
                Onboarding Pending
              </span>
              <div className="text-3xl font-bold font-sans text-slate-800 tracking-tight leading-none">
                {counts.onboardingPending}
              </div>
            </div>

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
                {counts.onboarded}
              </div>
            </div>

            <div
              onClick={() => setStatusFilter("COMPLETED")}
              className={cardClass("COMPLETED", "light")}
            >
              <span className="text-[10px] font-bold font-sans uppercase tracking-wider text-slate-400">
                Completed
              </span>
              <div className="text-3xl font-bold font-sans text-slate-800 tracking-tight leading-none">
                {counts.completed}
              </div>
            </div>
          </div>

          {isOnboardedExpanded && (
            <div className="flex justify-center gap-5 mt-4 transition-all duration-300 ease-in-out">
              <div
                onClick={() => setStatusFilter("REVIEW_PENDING")}
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between h-[104px] flex-1 max-w-[305px] w-full shadow-2xs hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
              >
                <span className="text-[10px] font-bold font-sans uppercase tracking-wider text-slate-400 leading-snug">
                  Review Pending
                </span>
                <div className="text-2xl font-bold font-sans text-slate-800 tracking-tight leading-none">
                  {counts.reviewPending}
                </div>
              </div>

              <div
                onClick={() =>
                  setStatusFilter("AWAITING_COUNTERPARTY_LAWYER_APPROVAL")
                }
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between h-[104px] flex-1 max-w-[305px] w-full shadow-2xs hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
              >
                <span className="text-[10px] font-bold font-sans uppercase tracking-wider text-slate-400 leading-snug">
                  Awaiting Counterparty
                </span>
                <div className="text-2xl font-bold font-sans text-slate-800 tracking-tight leading-none">
                  {counts.awaitingCounterparty}
                </div>
              </div>

              <div
                onClick={() => setStatusFilter("SIGN_OFF_ILA_PENDING")}
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between h-[104px] flex-1 max-w-[305px] w-full shadow-2xs hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
              >
                <span className="text-[10px] font-bold font-sans uppercase tracking-wider text-slate-400 leading-snug">
                  Sign-Off & ILA Pending
                </span>
                <div className="text-2xl font-bold font-sans text-slate-800 tracking-tight leading-none">
                  {counts.signOffAndIla}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default LawyerPage;
