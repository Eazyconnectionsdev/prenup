"use client";

import React, { useState } from "react";
import type { PartnerData } from "@/types/invite-partner";
import type { InvitationStatusCardProps } from "@/types/invite-partner/invitation-status-card";

export const InvitationStatusCard: React.FC<InvitationStatusCardProps> = ({
  partnerData,
  onResend,
  onEdit,
  showSuccess = false,
}) => {
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const isSent = partnerData.status !== "DRAFT";
  const accepted = partnerData.inviteStatus === "ACCEPTED";
  const registered = partnerData.registered;
  const label = partnerData.inviteStatus ?? partnerData.status;
  const fmt = (d?: string | null) =>
    d
      ? new Date(d).toLocaleString("en-GB", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : null;
  const fullName = (f?: string | null, l?: string | null) =>
    [f, l].filter(Boolean).join(" ") || "-";

  const handleResendClick = async () => {
    setResendStatus("Resending...");
    try {
      await onResend();
      setResendStatus("✓ Resent!");
    } catch {
      setResendStatus(null);
      return;
    }
    setTimeout(() => setResendStatus(null), 2500);
  };

  return (
    <aside className="bg-[#ffffff] border-2 border-[#E7E7F2] rounded-3xl p-6 md:p-8 space-y-6 shadow-md sticky top-6">
      <div className="border-b border-[#E2D9CC] pb-4">
        <h2 className="text-sm font-extrabold tracking-[0.18em] text-[#0F172A] uppercase">
          INVITATION STATUS
        </h2>
      </div>

      {isSent ? (
        <div className="space-y-6">
          {/* Styled Green Success Banner (shown once, right after inviting) */}
          {showSuccess && !accepted && (
            <div className="bg-[#ECFDF5] border-2 border-[#A7F3D0] text-[#065F46] rounded-xl p-4 flex items-center space-x-3 text-xs md:text-sm font-bold shadow-sm transition-all">
              <div className="w-6 h-6 rounded-full border-2 border-[#059669] flex items-center justify-center text-xs font-bold text-[#059669] flex-shrink-0 bg-white">
                ✓
              </div>
              <span>Invitation Successfully Sent</span>
            </div>
          )}

          {/* Inner Details Box in Deep Midnight Navy (Matching Screenshot 100%) */}
          <div className="bg-[#0F172A] border-2 border-[#1E293B] rounded-2xl p-5 space-y-4 text-xs md:text-sm text-white shadow-md">
            <div className="flex justify-between items-center">
              <span className="text-[#CBD5E1] font-extrabold">Name:</span>
              <span className="font-extrabold text-white text-sm">
                {accepted && registered
                  ? fullName(registered.firstName, registered.lastName)
                  : fullName(partnerData.firstName, partnerData.lastName)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#CBD5E1] font-extrabold">Email:</span>
              <span className="font-extrabold text-[#C5A880] text-sm">
                {accepted && registered
                  ? `${registered.email}${registered.emailVerified ? "" : " (unverified)"}`
                  : partnerData.email || "-"}
              </span>
            </div>

            {accepted && registered?.phone && (
              <div className="flex justify-between items-center">
                <span className="text-[#CBD5E1] font-extrabold">Phone:</span>
                <span className="font-extrabold text-white text-sm">
                  {registered.phone}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-[#CBD5E1] font-extrabold">Sent:</span>
              <span className="font-extrabold text-white text-sm">
                {partnerData.sentTimestamp || "-"}
              </span>
            </div>

            {accepted && partnerData.acceptedAt && (
              <div className="flex justify-between items-center">
                <span className="text-[#CBD5E1] font-extrabold">Joined:</span>
                <span className="font-extrabold text-white text-sm">
                  {fmt(partnerData.acceptedAt)}
                </span>
              </div>
            )}

            {/* Only ONE single horizontal line right above status */}
            <div className="flex justify-between items-center pt-3.5 border-t border-[#334155]">
              <span className="text-[#CBD5E1] font-extrabold">Status:</span>
              <span className="px-3.5 py-1 rounded-full border border-[#C5A880] text-[#0F172A] text-xs font-extrabold tracking-wider uppercase bg-[#C5A880] shadow-xs">
                {label}
              </span>
            </div>

            {accepted &&
              (partnerData.emailDiffers || partnerData.nameDiffers) && (
                <p className="text-[11px] text-[#94A3B8] leading-snug">
                  Registered with different details than you invited:{" "}
                  {fullName(partnerData.firstName, partnerData.lastName)} (
                  {partnerData.email}).
                </p>
              )}

            {partnerData.openedAt && !accepted && (
              <div className="flex justify-between items-center">
                <span className="text-[#CBD5E1] font-extrabold">
                  Link opened:
                </span>
                <span className="font-extrabold text-white text-sm">
                  {fmt(partnerData.openedAt)}
                </span>
              </div>
            )}
            {!!partnerData.resendCount && (
              <div className="flex justify-between items-center">
                <span className="text-[#CBD5E1] font-extrabold">Resent:</span>
                <span className="font-extrabold text-white text-sm">
                  {partnerData.resendCount}x
                </span>
              </div>
            )}
          </div>

          {/* Pure White Action Buttons with Warm Gold Hover (Matching Screenshot 100%) */}

          {!accepted && !partnerData.acceptedAt && (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleResendClick}
                disabled={accepted}
                className="py-3.5 px-3 rounded-xl bg-white text-[#0F172A] border border-[#CBD5E1] text-xs md:text-sm font-extrabold uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm text-center flex items-center justify-center cursor-pointer"
              >
                {accepted
                  ? "Partner Joined"
                  : resendStatus || "Resend Invitation"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#0F172A] border-2 border-[#1E293B] rounded-2xl p-6 text-center space-y-3 shadow-md text-white">
          <div className="w-12 h-12 rounded-full border border-[#C5A880] text-[#0F172A] mx-auto flex items-center justify-center text-xl font-serif-legal font-bold bg-[#C5A880]">
            ✉
          </div>
          <h3 className="text-base font-extrabold text-white">
            No Invitation Sent Yet
          </h3>
          <p className="text-xs font-semibold text-[#CBD5E1] leading-relaxed">
            Fill out your partner&apos;s details on the left and click{" "}
            <strong>Send Invitation</strong> to unlock your shared workspace.
          </p>
        </div>
      )}
    </aside>
  );
};
