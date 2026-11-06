"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import Axios from "@/lib/ApiConfig";
import { toStageFacts, countByStageFilter, type CaseStageFacts } from "@/lib/caseStages";
import {
  FileText,
  CreditCard,
  Edit3,
  Users,
  Scale,
  Flag,
  ChevronRight,
} from "lucide-react";

const ALL_FILTERS = [
  "NOT_PAID",
  "DRAFT",
  "CM_REVIEW",
  "LEGAL_REVIEW",
  "COMPLETED",
  "PARTNER_NOT_JOINED",
  "APPLICANT_DRAFTING",
  "PARTNER_REVIEW",
  "CM_NOT_ASSIGNED",
  "MY_ACTIVE_REVIEWS",
  "PRE_LAWYER_PENDING",
  "LAWYER_ASSIGNMENT_PENDING",
  "P1_CONFIRMATION_PENDING",
  "P2_CONFIRMATION_PENDING",
  "P1_LAWYER_APPROVAL_PENDING",
  "P2_LAWYER_APPROVAL_PENDING",
  "FINAL_CONFIRMATION_PENDING",
  "EXECUTION_PACK_GENERATED",
  "READY_FOR_ARCHIVE",
];

export const DashboardLedgerView: React.FC = () => {
  const router = useRouter();

  const currentUser = useSelector((state: RootState) => state.auth?.user);
  const currentUserId = String(currentUser?._id || currentUser?.id || "");

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
    () => countByStageFilter(cases, ALL_FILTERS, currentUserId),
    [cases, currentUserId]
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
  const applicantDraftingCount = counts.DRAFT;
  const cmReviewCount = counts.CM_REVIEW;
  const legalReviewCount = counts.LEGAL_REVIEW;
  const completedCount = counts.COMPLETED;

  const item = (title: string, subtitle: string, filter: string, color: string) => ({
    title,
    subtitle,
    filter,
    count: counts[filter] ?? 0,
    color: (counts[filter] ?? 0) > 0 ? color : "text-slate-400",
  });

  // Group 1: Applicant Drafting (Column 1) - these three add up to the column total.
  const col1Items = [
    item("Partner Not Joined", "P2 invitation not accepted", "PARTNER_NOT_JOINED", "text-amber-500"),
    item("Applicants Drafting", "P1/P2 forms incomplete", "APPLICANT_DRAFTING", "text-amber-500"),
    item("Partner Review / Mutual Approval", "Awaiting partner review or approval", "PARTNER_REVIEW", "text-amber-500"),
  ];

  // Group 2: Case Manager Review (Column 2)
  const col2Items = [
    item("Case Manager Not Assigned", "Submitted by couple; no case manager yet", "CM_NOT_ASSIGNED", "text-blue-600"),
    item("My Active Reviews", "Submitted and assigned to you", "MY_ACTIVE_REVIEWS", "text-blue-600"),
    item("Pre-Lawyer Questionnaire Pending", "Lawyers assigned; waiting for applicant questionnaires", "PRE_LAWYER_PENDING", "text-blue-600"),
    item("Lawyer Assignment Pending", "CM approved; waiting to assign lawyers", "LAWYER_ASSIGNMENT_PENDING", "text-blue-600"),
  ];

  // Group 3: Legal Review (Column 3)
  const col3Items = [
    item("P1 Confirmation Pending", "Awaiting P1 confirmation", "P1_CONFIRMATION_PENDING", "text-purple-600"),
    item("P2 Confirmation Pending", "Awaiting P2 confirmation", "P2_CONFIRMATION_PENDING", "text-purple-600"),
    item("P1 Lawyer Approval & ILA Pending", "Draft and ILA not yet completed", "P1_LAWYER_APPROVAL_PENDING", "text-purple-600"),
    item("P2 Lawyer Approval & ILA Pending", "Draft and ILA not yet completed", "P2_LAWYER_APPROVAL_PENDING", "text-purple-600"),
    item("Final Client Confirmation Pending", "Both lawyers signed off; awaiting final confirmations", "FINAL_CONFIRMATION_PENDING", "text-purple-600"),
  ];

  // Group 4: Completed (Column 4)
  const col4Items = [
    item("Execution Pack Generated", "Agreement ready for dispatch", "EXECUTION_PACK_GENERATED", "text-emerald-600"),
    item("Ready for Archive", "Done & dusted", "READY_FOR_ARCHIVE", "text-emerald-600"),
  ];

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
          onClick={() => handleNavigate("DRAFT")}
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
          onClick={() => handleNavigate("CM_REVIEW")}
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
              {counts.DRAFT}
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
              {counts.CM_REVIEW}
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
              {counts.LEGAL_REVIEW}
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
              {counts.COMPLETED}
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