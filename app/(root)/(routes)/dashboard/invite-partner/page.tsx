"use client";

import React, { useState } from "react";
import { PartnerHeader } from "@/components/invite-partner/PartnerHeader";
import { PartnerDetailsForm } from "@/components/invite-partner/PartnerDetailsForm";
import { InvitationStatusCard } from "@/components/invite-partner/InvitationStatusCard";
import { CaseTimeline } from "@/components/invite-partner/CaseTimeline";
import { PartnerData, TimelineEvent } from "@/types/invite-partner";
import Axios from "@/lib/ApiConfig";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function InvitePartnerPage() {
  const { user } = useSelector((state: RootState) => state.auth);

  const [partnerData, setPartnerData] = useState<PartnerData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    relationshipStatus: "Fiancé",
    targetDate: "",
    personalMessage: "",
    status: "DRAFT",
    sentTimestamp: "",
  });

  console.log("partnerData:", partnerData);

  // const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([
  //   {
  //     id: '1',
  //     title: 'Invite Your Partner',
  //     timestamp: '31 Jul 2026 - 01:02',
  //     completed: true,
  //   },
  //   {
  //     id: '2',
  //     title: 'Complete Questionnaires',
  //     timestamp: 'Pending Partner Join',
  //     completed: false,
  //   },
  //   {
  //     id: '3',
  //     title: 'Independent Legal Advice',
  //     timestamp: 'Upcoming',
  //     completed: false,
  //   },
  //   {
  //     id: '4',
  //     title: 'Sign Matrimonial Agreement',
  //     timestamp: 'Upcoming',
  //     completed: false,
  //   },
  // ]);

  const handlePartnerDataChange = (updated: Partial<PartnerData>) => {
    setPartnerData((prev) => ({ ...prev, ...updated }));
  };

  const handleSaveDraft = () => {};

  //   const handleInvite = async () => {
  //   SetLoading(true);
  //   try {
  //     await Axios.post(`cases/${user.inviteCaseId}/invite`, { email });
  //   } catch (error) {
  //     console.log("Error sending invitation:", error);
  //   } finally {
  //     SetLoading(false);
  //     handleModelClose();
  //   }
  // };

  const handleSendInvitation = async () => {
    const now = new Date();
    const formattedDate = `${now.getDate()} ${now.toLocaleString("en", { month: "short" })} ${now.getFullYear()} - ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    await Axios.post(`cases/${user.inviteCaseId}/invite`, { ...partnerData });

    setPartnerData((prev) => ({
      ...prev,
      status: "INVITATION_SENT",
      sentTimestamp: formattedDate,
    }));

    // setTimelineEvents((prev) =>
    //   prev.map((evt) =>
    //     evt.id === '1'
    //       ? { ...evt, timestamp: formattedDate, completed: true }
    //       : evt
    //   )
    // );
  };

  const handleResendInvitation = () => {
    const now = new Date();
    const formattedDate = `${now.getDate()} ${now.toLocaleString("en", { month: "short" })} ${now.getFullYear()} - ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    setPartnerData((prev) => ({
      ...prev,
      sentTimestamp: formattedDate,
    }));
  };

  const handleEditDetails = () => {
    const formElement = document.getElementById("partner-firstname");
    if (formElement) {
      formElement.focus();
      formElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <main className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 mb-12">
      <PartnerHeader />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7">
          <PartnerDetailsForm
            partnerData={partnerData}
            onChange={handlePartnerDataChange}
            onSaveDraft={handleSaveDraft}
            onSendInvitation={handleSendInvitation}
          />
        </div>

        <div className="lg:col-span-5">
          <InvitationStatusCard
            partnerData={partnerData}
            onResend={handleResendInvitation}
            onEdit={handleEditDetails}
          />
        </div>
      </div>

      {/* Full Width Horizontal Case Timeline Below Partner Details */}
      <div className="w-full">
        {/* <CaseTimeline timelineEvents={timelineEvents} /> */}
      </div>
    </main>
  );
}
