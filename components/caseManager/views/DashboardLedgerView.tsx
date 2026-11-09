"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Axios from "@/lib/ApiConfig";
import {
  toStageFacts,
  countByStageFilter,
  matchesStageFilter,
  STAGE_FILTERS,
  type CaseStageFacts,
} from "@/lib/caseStages";
import {
  FileText,
  CreditCard,
  Edit3,
  Users,
  Scale,
  Flag,
  ChevronRight,
} from "lucide-react";

const ALL_FILTERS = STAGE_FILTERS.map((f) => f.value);

export const DashboardLedgerView: React.FC = () => {
  const router = useRouter();

  const [cases, setCases] = useState<CaseStageFacts[]>([]);
  const [loading, setLoading] = useState(true);

  // Counts come from the same case list and the same rules as the Cases page,
  // so clicking a tile always shows exactly that many cases.
  const getDashboard = async () => {
    try {
      setLoading(true);
      const { data } = await Axios.get("/case-manager/cases");
      setCases((Array.isArray(data) ? data : []).map(toStageFacts));
    } catch (error) {
      console.error("Dashboard fetch error", error);
      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboard();
  }, []);

  const counts = useMemo(
    () => countByStageFilter(cases, ALL_FILTERS),
    [cases]
  );

  const handleNavigate = (filter: string) => {
    router.push(`/cm/cases?status=${encodeURIComponent(filter)}`);
  };

  if (loading) {
    return (
      <div className="p-8 text-slate-500 font-sans text-sm">
        Loading dashboard...
      </div>
    );
  }

  const totalCases = cases.length;
  const notPaidCount = counts.NOT_PAID;
  const applicantDraftingCount = counts.APPLICANT_DRAFTING;
  const cmReviewCount = counts.MY_ACTIVE_REVIEWS;
  const legalReviewCount = counts.LEGAL_REVIEW;
  const completedCount = counts.COMPLETED;

  const label = (value: string) =>
    STAGE_FILTERS.find((f) => f.value === value)?.label ?? value;

  const item = (filter: string, subtitle: string, color: string) => ({
    title: label(filter),
    subtitle,
    filter,
    count: counts[filter] ?? 0,
    color: (counts[filter] ?? 0) > 0 ? color : "text-slate-400",
  });

  // Each tile is one Workflow Stage filter option; clicking it opens Cases
  // with that stage selected.
  const col1Items = [
    item("NOT_PAID", "Payment not completed", "text-amber-500"),
    item("PARTNER_NOT_JOINED", "P2 invitation not accepted", "text-amber-500"),
    item("APPLICANT_DRAFTING", "P1/P2 forms incomplete", "text-amber-500"),
    item("PARTNER_REVIEW", "Awaiting partner review or approval", "text-amber-500"),
  ];

  const col2Items = [
    item("CM_NOT_ASSIGNED", "Open cases with no case manager", "text-blue-600"),
    item("MY_ACTIVE_REVIEWS", "Submitted by couple; awaiting case manager review", "text-blue-600"),
    item("PRE_LAWYER_PENDING", "CM approved; waiting for applicant questionnaires", "text-blue-600"),
    item("LAWYER_ASSIGNMENT_PENDING", "Questionnaires done; waiting to assign lawyers", "text-blue-600"),
  ];

  const col3Items = [
    item("LEGAL_REVIEW", "Lawyers assigned and reviewing", "text-purple-600"),
    item("LAWYER_ILA_PENDING", "Waiting for P1/P2 ILA and lawyer sign-off", "text-purple-600"),
  ];

  const col4Items = [
    item("COMPLETED", "Signed off; final confirmations and completion", "text-emerald-600"),
    item("READY_FOR_ARCHIVE", "Completed; ready to archive", "text-emerald-600"),
    item("ARCHIVED", "Archived cases", "text-emerald-600"),
  ];

  // Column total = distinct cases in any of its tiles (a case can match two
  // tiles, e.g. Not Paid and Partner Not Joined, but is counted once here).
  const colTotal = (items: { filter: string }[]) =>
    cases.filter((c) =>
      items.some((i) => matchesStageFilter(c, i.filter))
    ).length;

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Case Manager Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track cases across every stage.
          </p>
        </div>
        <div className="text-xs font-mono text-slate-400">
          {new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
          ,{" "}
          {new Date().toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      {/* ── Top Summary Metric Cards (6 cards) ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Cases */}
        <div
          onClick={() => handleNavigate("ALL")}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              TOTAL CASES
            </span>
            <span className="text-xl font-extrabold text-slate-900 leading-none">
              {totalCases}
            </span>
          </div>
        </div>

        {/* Not Paid */}
        <div
          onClick={() => handleNavigate("NOT_PAID")}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              NOT PAID
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold text-slate-900 leading-none">
                {notPaidCount}
              </span>
              <span className="text-[9px] font-bold uppercase bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">
                Action Req.
              </span>
            </div>
          </div>
        </div>

        {/* Applicant Drafting */}
        <div
          onClick={() => handleNavigate("APPLICANT_DRAFTING")}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <Edit3 className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              APPLICANT DRAFTING
            </span>
            <span className="text-xl font-extrabold text-slate-900 leading-none">
              {applicantDraftingCount}
            </span>
          </div>
        </div>

        {/* Case Manager Review */}
        <div
          onClick={() => handleNavigate("MY_ACTIVE_REVIEWS")}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              CASE MANAGER REVIEW
            </span>
            <span className="text-xl font-extrabold text-slate-900 leading-none">
              {cmReviewCount}
            </span>
          </div>
        </div>

        {/* Legal Review */}
        <div
          onClick={() => handleNavigate("LEGAL_REVIEW")}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              LEGAL REVIEW
            </span>
            <span className="text-xl font-extrabold text-slate-900 leading-none">
              {legalReviewCount}
            </span>
          </div>
        </div>

        {/* Completed */}
        <div
          onClick={() => handleNavigate("COMPLETED")}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <Flag className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              COMPLETED
            </span>
            <span className="text-xl font-extrabold text-slate-900 leading-none">
              {completedCount}
            </span>
          </div>
        </div>
      </div>

      {/* ── 4 Main Stage Columns ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {/* ── Column 1: Applicant Drafting ── */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="pb-3 border-b-2 border-amber-400 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center shrink-0">
                1
              </span>
              <h3 className="font-bold text-sm text-slate-900">
                Applicant Drafting
              </h3>
            </div>
            <span className="w-6 h-6 rounded-full bg-amber-50 text-amber-600 text-xs font-bold flex items-center justify-center">
              {colTotal(col1Items)}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed -mt-2">
            Cases where applicants are completing forms and awaiting mutual approval.
          </p>

          <div className="space-y-2.5 pt-1">
            {col1Items.map((item) => (
              <div
                key={item.title}
                onClick={() => handleNavigate(item.filter)}
                className="p-3 rounded-xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-100 transition-all flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`text-xs font-extrabold ${item.color}`}>
                    {item.count}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Column 2: Case Manager Review ── */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="pb-3 border-b-2 border-blue-500 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                2
              </span>
              <h3 className="font-bold text-sm text-slate-900">
                Case Manager Review
              </h3>
            </div>
            <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center">
              {colTotal(col2Items)}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed -mt-2">
            Cases submitted by applicants and awaiting case manager action.
          </p>

          <div className="space-y-2.5 pt-1">
            {col2Items.map((item) => (
              <div
                key={item.title}
                onClick={() => handleNavigate(item.filter)}
                className="p-3 rounded-xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-100 transition-all flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`text-xs font-extrabold ${item.color}`}>
                    {item.count}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Column 3: Legal Review ── */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="pb-3 border-b-2 border-purple-500 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0">
                3
              </span>
              <h3 className="font-bold text-sm text-slate-900">
                Legal Review
              </h3>
            </div>
            <span className="w-6 h-6 rounded-full bg-purple-50 text-purple-600 text-xs font-bold flex items-center justify-center">
              {colTotal(col3Items)}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed -mt-2">
            Cases with lawyers assigned and in legal review.
          </p>

          <div className="space-y-2.5 pt-1">
            {col3Items.map((item) => (
              <div
                key={item.title}
                onClick={() => handleNavigate(item.filter)}
                className="p-3 rounded-xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-100 transition-all flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`text-xs font-extrabold ${item.color}`}>
                    {item.count}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Column 4: Completed ── */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="pb-3 border-b-2 border-emerald-500 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
                4
              </span>
              <h3 className="font-bold text-sm text-slate-900">
                Completed
              </h3>
            </div>
            <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center justify-center">
              {colTotal(col4Items)}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed -mt-2">
            Cases with executed agreements and ready for archive.
          </p>

          <div className="space-y-2.5 pt-1">
            {col4Items.map((item) => (
              <div
                key={item.title}
                onClick={() => handleNavigate(item.filter)}
                className="p-3 rounded-xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-100 transition-all flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`text-xs font-extrabold ${item.color}`}>
                    {item.count}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLedgerView;