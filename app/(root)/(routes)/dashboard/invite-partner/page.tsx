"use client";

import React, { useCallback, useEffect, useState } from "react";
import { PartnerHeader } from "@/components/invite-partner/PartnerHeader";
import { PartnerDetailsForm } from "@/components/invite-partner/PartnerDetailsForm";
import { InvitationStatusCard } from "@/components/invite-partner/InvitationStatusCard";
import { CaseTimeline } from "@/components/invite-partner/CaseTimeline";
import Axios from "@/lib/ApiConfig";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/lib/getErrorMessage";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import type { PartnerData, TimelineEvent } from "@/types/invite-partner";

export default function InvitePartnerPage() {
  const { user } = useSelector((state: RootState) => state.auth);

  const [justSent, setJustSent] = useState(false);

  const [partnerData, setPartnerData] = useState<PartnerData>({
    firstName: "",
    lastName: "",
    email: "",
    targetWeddingDate: "",
    mobileNumber: "",
    relationshipStatus: "Fiancé",
    phone: "",
    targetDate: "",
    personalMessage: "",
    status: "DRAFT",
    sentTimestamp: "",
  });

  const fmtSent = (iso?: string | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    return `${d.getDate()} ${d.toLocaleString("en", { month: "short" })} ${d.getFullYear()} - ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  // Load the saved invite (details, live status, and who registered).
  const loadInvite = useCallback(async () => {
    if (!user?.inviteCaseId) return;
    try {
      const { data } = await Axios.get(`cases/${user.inviteCaseId}/invite`);
      const inv = data?.invite;
      if (!inv) return;
      setPartnerData((prev) => ({
        ...prev,
        firstName: inv.invitee.firstName ?? "",
        lastName: inv.invitee.lastName ?? "",
        email: inv.invitee.email ?? "",
        mobileNumber: inv.invitee.mobileNumber ?? "",
        phone: inv.invitee.mobileNumber ?? "",
        relationshipStatus: inv.invitee.relationshipStatus ?? "Fiancé",
        targetWeddingDate: inv.invitee.targetWeddingDate
          ? String(inv.invitee.targetWeddingDate).slice(0, 10)
          : "",
        targetDate: inv.invitee.targetWeddingDate
          ? String(inv.invitee.targetWeddingDate).slice(0, 10)
          : "",
        personalMessage: inv.invitee.personalMessage ?? "",
        status: "INVITATION_SENT",
        sentTimestamp: fmtSent(inv.lastResentAt ?? inv.sentAt),
        inviteStatus: inv.status,
        openedAt: inv.openedAt,
        acceptedAt: inv.acceptedAt,
        resendCount: inv.resendCount,
        registered: inv.registered,
        emailDiffers: inv.emailDiffers,
        nameDiffers: inv.nameDiffers,
      }));
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to load your invitation"));
    }
  }, [user?.inviteCaseId]);

  useEffect(() => {
    loadInvite();
  }, [loadInvite]);

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
    try {
      await Axios.post(`cases/${user.inviteCaseId}/invite`, {
        firstName: partnerData.firstName.trim(),
        lastName: partnerData.lastName.trim(),
        email: partnerData.email.trim().toLowerCase(),
      });
      if (partnerData.status === "DRAFT") setJustSent(true);
      toast.success(
        partnerData.status === "DRAFT"
          ? "Invitation sent"
          : "Invitation updated and re-sent"
      );
      await loadInvite();
    } catch (error: any) {
      toast.error(getErrorMessage(error?.response?.data, "Unable to send the invitation"));
    }
  };

  const handleResendInvitation = async () => {
    try {
      await handleSendInvitation();
    } catch {
      // handled in handleSendInvitation
    }
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
            isSent={partnerData.status !== "DRAFT"}
            locked={partnerData.inviteStatus === "ACCEPTED"}
          />
        </div>

        <div className="lg:col-span-5">
          <InvitationStatusCard
            partnerData={partnerData}
            onResend={handleResendInvitation}
            onEdit={handleEditDetails}
            showSuccess={justSent}
          />
        </div>
      </div>
    </main>
  );
}
