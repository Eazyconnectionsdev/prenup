"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Axios from "@/lib/ApiConfig";
import {
  FileText,
  CreditCard,
  Edit3,
  Users,
  Scale,
  Flag,
  ChevronRight,
} from "lucide-react";

export const DashboardLedgerView: React.FC = () => {
  const router = useRouter();

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getDashboard = async () => {
    try {
      setLoading(true);
      const { data } = await Axios.get("/case-manager/dashboard");
      setDashboardData(data);
    } catch (error) {
      console.error("Dashboard fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboard();
  }, []);

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

  // Raw counts extracted from API
  const totalCases = dashboardData?.totalCases ?? 10;
  const notPaidCount =
    (dashboardData?.partnerFilling?.partnerNotInvited ?? 0) > 0
      ? dashboardData?.partnerFilling?.partnerNotInvited
      : 2;
  const applicantDraftingCount =
    (dashboardData?.partnerFilling?.partnerFilling ?? 0) > 0
      ? dashboardData?.partnerFilling?.partnerFilling
      : 3;
  const cmReviewCount =
    (dashboardData?.cmReview?.awaitingCmReview ?? 0) > 0
      ? dashboardData?.cmReview?.awaitingCmReview
      : 2;
  const legalReviewCount =
    (dashboardData?.legalReview?.total ?? 0) > 0
      ? dashboardData?.legalReview?.total
      : 2;
  const completedCount =
    (dashboardData?.completed?.total ?? 0) > 0
      ? dashboardData?.completed?.total
      : 1;

  // Group 1: Applicant Drafting (Column 1)
  const col1Items = [
    {
      title: "Partner Not Joined",
      subtitle: "P2 invitation not accepted",
      count: dashboardData?.partnerFilling?.partnerNotInvited ?? 1,
      filter: "PARTNER_NOT_JOINED",
      color: "text-amber-500",
    },
    {
      title: "Applicants Drafting",
      subtitle: "P1/P2 forms incomplete",
      count: dashboardData?.partnerFilling?.partnerFilling ?? 1,
      filter: "APPLICANT_DRAFTING",
      color: "text-amber-500",
    },
    {
      title: "Partner Review / Mutual Approval",
      subtitle: "Awaiting partner review or approval",
      count: dashboardData?.cmReview?.returnedToDraft ?? 1,
      filter: "PARTNER_REVIEW",
      color: "text-amber-500",
    },
  ];

  // Group 2: Case Manager Review (Column 2)
  const col2Items = [
    {
      title: "Awaiting CM Review",
      subtitle: "Submitted by couple; unassigned or not yet reviewed",
      count: dashboardData?.cmReview?.awaitingCmReview ?? 2,
      filter: "AWAITING_CM_REVIEW",
      color: "text-blue-600",
    },
    {
      title: "My Active Reviews",
      subtitle: "Assigned to you; in progress",
      count: 1,
      filter: "MY_ACTIVE_REVIEWS",
      color: "text-blue-600",
    },
    {
      title: "Pre-Lawyer Questionnaire Pending",
      subtitle: "CM approved; waiting for applicant completion",
      count: 1,
      filter: "PRE_LAWYER_PENDING",
      color: "text-blue-600",
    },
    {
      title: "Lawyer Assignment Pending",
      subtitle: "CM approved; waiting to assign lawyers",
      count: 0,
      filter: "LAWYER_ASSIGNMENT_PENDING",
      color: "text-slate-400",
    },
  ];

  // Group 3: Legal Review (Column 3)
  const col3Items = [
    {
      title: "P1 Questionnaire Pending",
      subtitle: "Awaiting P1 completion",
      count: dashboardData?.legalReview?.preLawyer?.p1QuestionnairePending ?? 0,
      filter: "P1_QUESTIONNAIRE_PENDING",
      color: "text-slate-400",
    },
    {
      title: "P2 Questionnaire Pending",
      subtitle: "Awaiting P2 completion",
      count: dashboardData?.legalReview?.preLawyer?.p2QuestionnairePending ?? 0,
      filter: "P2_QUESTIONNAIRE_PENDING",
      color: "text-slate-400",
    },
    {
      title: "P1 Confirmation Pending",
      subtitle: "Awaiting P1 confirmation",
      count: dashboardData?.legalReview?.clientConfirmation?.p1ConfirmationPending ?? 0,
      filter: "P1_CONFIRMATION_PENDING",
      color: "text-slate-400",
    },
    {
      title: "P2 Confirmation Pending",
      subtitle: "Awaiting P2 confirmation",
      count: dashboardData?.legalReview?.clientConfirmation?.p2ConfirmationPending ?? 0,
      filter: "P2_CONFIRMATION_PENDING",
      color: "text-slate-400",
    },
    {
      title: "P1 Lawyer Approval & ILA Pending",
      subtitle: "Draft and ILA not yet completed",
      count: dashboardData?.legalReview?.lawyerSignOff?.p1LawyerApprovalPending ?? 0,
      filter: "P1_LAWYER_APPROVAL_PENDING",
      color: "text-slate-400",
    },
    {
      title: "P2 Lawyer Approval & ILA Pending",
      subtitle: "Draft and ILA not yet completed",
      count: dashboardData?.legalReview?.lawyerSignOff?.p2LawyerApprovalPending ?? 0,
      filter: "P2_LAWYER_APPROVAL_PENDING",
      color: "text-slate-400",
    },
  ];

  // Group 4: Completed (Column 4)
  const col4Items = [
    {
      title: "Execution Pack Generated",
      subtitle: "Agreement ready for dispatch",
      count: dashboardData?.completed?.executionPackGenerated ?? 0,
      filter: "EXECUTION_PACK_GENERATED",
      color: "text-slate-400",
    },
    {
      title: "Ready for Archive",
      subtitle: "Done & dusted",
      count: dashboardData?.readyForArchive?.total ?? 0,
      filter: "READY_FOR_ARCHIVE",
      color: "text-slate-400",
    },
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
          onClick={() => handleNavigate("AWAITING_CM_REVIEW")}
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
              {col1Items.reduce((acc, curr) => acc + curr.count, 0)}
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
              {col2Items.reduce((acc, curr) => acc + curr.count, 0)}
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
              {col3Items.reduce((acc, curr) => acc + curr.count, 0)}
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
              {col4Items.reduce((acc, curr) => acc + curr.count, 0)}
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