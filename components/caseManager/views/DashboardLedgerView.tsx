"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Axios from "@/lib/ApiConfig";

interface DashboardResponse {
  totalCases: number;
  partnerFilling: {
    total: number;
    partnerNotInvited: number;
    partnerFilling: number;
  };
  cmReview: {
    total: number;
    returnedToDraft: number;
    awaitingCmReview: number;
  };
  legalReview: {
    total: number;
    preLawyer: {
      p1QuestionnairePending: number;
      p2QuestionnairePending: number;
    };
    clientConfirmation: {
      p1ConfirmationPending: number;
      p2ConfirmationPending: number;
    };
    lawyerSignOff: {
      p1LawyerApprovalPending: number;
      p2LawyerApprovalPending: number;
    };
  };
  completed: {
    total: number;
    executionPackGenerated: number;
  };
  readyForArchive: {
    total: number;
  };
}

interface StatBox {
  label: string;
  value: number;
  filter: string;
}

const DashboardLedgerView: React.FC = () => {
  const router = useRouter();

  const [dashboardData, setDashboardData] =
    useState<DashboardResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const getDashboard = async () => {
    try {
      setLoading(true);

      const { data } = await Axios.get(
        "/case-manager/dashboard"
      );

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

  const handleCardClick = (filter: string) => {
    router.push(
      `/cm/cases?status=${encodeURIComponent(
        filter
      )}`
    );
  };

  if (loading) {
    return (
      <div className="p-6 text-slate-500">
        Loading dashboard...
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-6 text-red-500">
        Failed to load dashboard.
      </div>
    );
  }

  const sections = [
    {
      title: "PARTNER FILLING",
      boxes: [
        {
          label: "Partner Not Invited",
          value:
            dashboardData.partnerFilling
              .partnerNotInvited,
          filter: "PARTNER_NOT_INVITED",
        },
        {
          label: "Partner Filling",
          value:
            dashboardData.partnerFilling
              .partnerFilling,
          filter: "PARTNER_FILLING",
        },
      ],
    },

    {
      title: "CM REVIEW",
      boxes: [
        {
          label: "Returned To Draft",
          value:
            dashboardData.cmReview
              .returnedToDraft,
          filter: "RETURNED_TO_DRAFT",
        },
        {
          label: "Awaiting CM Review",
          value:
            dashboardData.cmReview
              .awaitingCmReview,
          filter: "AWAITING_CM_REVIEW",
        },
      ],
    },

    {
      title: "LEGAL REVIEW",
      boxes: [
        {
          label: "P1 Questionnaire Pending",
          value:
            dashboardData.legalReview
              .preLawyer
              .p1QuestionnairePending,
          filter:
            "P1_QUESTIONNAIRE_PENDING",
        },
        {
          label: "P2 Questionnaire Pending",
          value:
            dashboardData.legalReview
              .preLawyer
              .p2QuestionnairePending,
          filter:
            "P2_QUESTIONNAIRE_PENDING",
        },
        {
          label: "P1 Confirmation Pending",
          value:
            dashboardData.legalReview
              .clientConfirmation
              .p1ConfirmationPending,
          filter:
            "P1_CONFIRMATION_PENDING",
        },
        {
          label: "P2 Confirmation Pending",
          value:
            dashboardData.legalReview
              .clientConfirmation
              .p2ConfirmationPending,
          filter:
            "P2_CONFIRMATION_PENDING",
        },
        {
          label:
            "P1 Lawyer Approval & ILA Pending",
          value:
            dashboardData.legalReview
              .lawyerSignOff
              .p1LawyerApprovalPending,
          filter:
            "P1_LAWYER_APPROVAL_PENDING",
        },
        {
          label:
            "P2 Lawyer Approval & ILA Pending",
          value:
            dashboardData.legalReview
              .lawyerSignOff
              .p2LawyerApprovalPending,
          filter:
            "P2_LAWYER_APPROVAL_PENDING",
        },
      ],
    },

    {
      title: "COMPLETED",
      boxes: [
        {
          label:
            "Execution Pack Generated",
          value:
            dashboardData.completed
              .executionPackGenerated,
          filter:
            "EXECUTION_PACK_GENERATED",
        },
      ],
    },

    {
      title: "READY FOR ARCHIVE",
      boxes: [
        {
          label: "Ready For Archive",
          value:
            dashboardData.readyForArchive
              .total,
          filter:
            "READY_FOR_ARCHIVE",
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-[1280px]">
      {/* TOTAL CASES */}

      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
          TOTAL CASES
        </div>

        <div
          onClick={() =>
            handleCardClick("ALL")
          }
          className="bg-white border border-slate-300 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-slate-400 active:scale-[0.98] transition-all flex flex-col justify-between h-[96px] w-[220px] group"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Cases
          </span>

          <div className="text-2xl font-bold text-slate-900">
            {dashboardData.totalCases}
          </div>
        </div>
      </div>

      {sections.map((section) => (
        <div key={section.title}>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
            {section.title}
          </div>

          <div className="flex flex-wrap gap-3.5">
            {section.boxes.map(
              (box: StatBox) => (
                <div
                  key={box.filter}
                  onClick={() =>
                    handleCardClick(
                      box.filter
                    )
                  }
                  className="bg-white border border-slate-300 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-slate-400 active:scale-[0.98] transition-all flex flex-col justify-between h-[96px] w-[220px] group"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-700 transition-colors">
                    {box.label}
                  </span>

                  <div className="text-2xl font-bold text-slate-900">
                    {box.value}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardLedgerView;