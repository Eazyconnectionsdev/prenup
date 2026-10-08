"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import type { PartnerDetailsFormProps } from "@/types/invite-partner/partner-details-form";

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white border-2 border-[#E7E7F2] text-sm font-normal text-[#0F172A] placeholder-[#64748B] focus:outline-none shadow-sm transition-all";
const labelClass = "block text-xs md:text-sm font-extrabold text-[#0F172A]";

export const PartnerDetailsForm: React.FC<PartnerDetailsFormProps> = ({
  partnerData,
  onChange,
  onSendInvitation,
  isSent = false,
  locked = false,
}) => {
  const [isSending, setIsSending] = useState(false);
  const [confirmInput, setConfirmInput] = useState<string | null>(null);
  const confirmEmail = confirmInput ?? (isSent ? partnerData.email : "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (locked) return;

    const email = partnerData.email.trim().toLowerCase();
    if (!partnerData.firstName.trim() || !partnerData.lastName.trim()) {
      toast.error("Enter your partner's first and last name");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Enter a valid email address for your partner");
      return;
    }
    if (email !== confirmEmail.trim().toLowerCase()) {
      toast.error("The email addresses do not match");
      return;
    }

    setIsSending(true);
    Promise.resolve(onSendInvitation()).finally(() => setIsSending(false));
  };

  return (
    <div className="bg-[#ffffff] border-2 border-[#E7E7F2] rounded-2xl p-6 md:p-8 space-y-6 shadow-md">
      <div className="border-b-2 border-[#35343228] pb-4">
        <h2 className="text-sm font-extrabold tracking-[0.18em] text-[#0F172A] uppercase">
          PARTNER DETAILS
        </h2>
      </div>

      {locked && (
        <p className="text-xs font-semibold text-[#64748B]">
          Your partner has joined, so these details can no longer be edited. See
          the status panel for what they registered with.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <fieldset disabled={locked} className="space-y-5 min-w-0">
          {/* First Name */}
          <div className="space-y-2">
            <label htmlFor="partner-firstname" className={labelClass}>
              Legal First Name *
            </label>
            <input
              id="partner-firstname"
              type="text"
              autoComplete="off"
              value={partnerData.firstName}
              onChange={(e) => onChange({ firstName: e.target.value })}
              placeholder="First name"
              className={inputClass}
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label htmlFor="partner-lastname" className={labelClass}>
              Last Name *
            </label>
            <input
              id="partner-lastname"
              type="text"
              autoComplete="off"
              value={partnerData.lastName}
              onChange={(e) => onChange({ lastName: e.target.value })}
              placeholder="Enter your Partner's last name"
              className={inputClass}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="partner-email" className={labelClass}>
              Email *
            </label>
            <input
              id="partner-email"
              type="email"
              autoComplete="off"
              value={partnerData.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="Enter your Partner's email"
              className={inputClass}
            />
          </div>

          {/* Confirm Email */}
          <div className="space-y-2">
            <label htmlFor="partner-confirm-email" className={labelClass}>
              Confirm Email *
            </label>
            <input
              id="partner-confirm-email"
              type="email"
              autoComplete="off"
              value={confirmEmail}
              onChange={(e) => setConfirmInput(e.target.value)}
              onPaste={(e) => e.preventDefault()}
              placeholder="Confirm your Partner's email"
              className={inputClass}
            />
          </div>
        </fieldset>

        {!locked && (
          <div className="flex items-center justify-end space-x-4 pt-2">
            <button
              type="submit"
              disabled={isSending || locked}
              className="px-6 py-3.5 rounded-xl bg-white text-[#0F172A] border border-[#CBD5E1] text-xs md:text-sm font-extrabold uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md flex items-center space-x-2 disabled:opacity-70 cursor-pointer"
            >
              <span>
                {isSending
                  ? "Sending..."
                  : isSent
                    ? "Update & Resend Invitation"
                    : "Send Invitation"}
              </span>
              {!isSending && <span>&rarr;</span>}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
