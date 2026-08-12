'use client';

import React, { useState } from 'react';
import { PartnerData, RelationshipStatus } from '@/types/invite-partner';

interface PartnerDetailsFormProps {
  partnerData: PartnerData;
  onChange: (updated: Partial<PartnerData>) => void;
  onSaveDraft: () => void;
  onSendInvitation: () => void;
}

export const PartnerDetailsForm: React.FC<PartnerDetailsFormProps> = ({
  partnerData,
  onChange,
  onSaveDraft,
  onSendInvitation,
}) => {
  const [draftSaved, setDraftSaved] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const statuses: RelationshipStatus[] = ['Fiancé', 'Fiancée', 'Partner'];

  const handleSaveDraftClick = () => {
    onSaveDraft();
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      onSendInvitation();
      setIsSending(false);
    }, 500);
  };

  return (
    <div className="bg-[#ffffff] border-2 border-[#E7E7F2] rounded-2xl p-6 md:p-8 space-y-6 shadow-md">
      <div className="border-b-2 border-[#35343228] pb-4">
        <h2 className="text-sm font-extrabold tracking-[0.18em] text-[#0F172A] uppercase">
          PARTNER DETAILS
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* First & Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label htmlFor="partner-firstname" className="block text-xs md:text-sm font-extrabold text-[#0F172A]">
              Partner First Name *
            </label>
            <input
              id="partner-firstname"
              type="text"
              required
              value={partnerData.firstName}
              onChange={(e) => onChange({ firstName: e.target.value })}
              placeholder="Emma"
              className="w-full px-4 py-3 rounded-xl bg-[#fffff] border-2 border-[#E7E7F2] text-sm font-normal text-[#0F172A] placeholder-[#64748B] focus:outline-none shadow-sm transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="partner-lastname" className="block text-xs md:text-sm font-extrabold text-[#0F172A]">
              Partner Last Name *
            </label>
            <input
              id="partner-lastname"
              type="text"
              required
              value={partnerData.lastName}
              onChange={(e) => onChange({ lastName: e.target.value })}
              placeholder="Smith"
              className="w-full px-4 py-3 rounded-xl bg-[#fffff] border-2 border-[#E7E7F2] text-sm font-normal text-[#0F172A] placeholder-[#64748B] focus:outline-none shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="space-y-2">
          <label htmlFor="partner-email" className="block text-xs md:text-sm font-extrabold text-[#0F172A]">
            Partner Email Address *
          </label>
          <input
            id="partner-email"
            type="email"
            required
            value={partnerData.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="emma@example.com"
            className="w-full px-4 py-3 rounded-xl bg-[#fffff] border-2 border-[#E7E7F2] text-sm font-normal text-[#0F172A] placeholder-[#64748B] focus:outline-none shadow-sm transition-all"
          />
        </div>

        {/* Mobile Number */}
        <div className="space-y-2">
          <label htmlFor="partner-mobile" className="block text-xs md:text-sm font-extrabold text-[#0F172A]">
            Partner Mobile Number
          </label>
          <input
            id="partner-mobile"
            type="tel"
            value={partnerData.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="+44 7911 123456"
            className="w-full px-4 py-3 rounded-xl bg-[#fffff] border-2 border-[#E7E7F2] text-sm font-normal text-[#0F172A] placeholder-[#64748B] focus:outline-none shadow-sm transition-all"
          />
        </div>

        {/* Relationship Status Segment Selector */}
        <div className="space-y-2">
          <label className="block text-xs md:text-sm font-extrabold text-primary">
            Relationship Status
          </label>
          <div className="grid grid-cols-3 gap-3">
            {statuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => onChange({ relationshipStatus: status })}
                className={`segment-btn py-3 px-3 rounded-xl text-xs md:text-sm font-extrabold text-center border-2 transition-all ${
                  partnerData.relationshipStatus === status ? 'active' : ''
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Target Wedding / Registration Date */}
        <div className="space-y-2">
          <label htmlFor="target-date" className="block text-xs md:text-sm font-extrabold text-[#0F172A]">
            Target Wedding / Registration Date
          </label>
          <input
            id="target-date"
            type="date"
            value={partnerData.targetDate}
            onChange={(e) => onChange({ targetDate: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[#fffff] border-2 border-[#E7E7F2] text-sm font-normal text-[#0F172A] focus:outline-none shadow-sm transition-all"
          />
        </div>

        {/* Personal Message */}
        <div className="space-y-2">
          <label htmlFor="personal-message" className="block text-xs md:text-sm font-extrabold text-[#0F172A]">
            Personal Message (Optional)
          </label>
          <textarea
            id="personal-message"
            rows={3}
            value={partnerData.personalMessage}
            onChange={(e) => onChange({ personalMessage: e.target.value })}
            placeholder="Hey! I've started our prenup application. Please join using the link below so we can complete it together."
            className="w-full px-4 py-3 rounded-xl bg-[#fffff] border-2 border-[#E7E7F2] text-xs md:text-sm font-normal text-[#0F172A] placeholder-[#64748B] focus:outline-none shadow-sm transition-all resize-none"
          />
        </div>

        {/* Deep Midnight Navy Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-2">
          {/* <button
            type="button"
            onClick={handleSaveDraftClick}
            className="px-6 py-3.5 rounded-xl bg-white text-[#0F172A] border border-[#CBD5E1] text-xs md:text-sm font-extrabold uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md cursor-pointer"
          >
            {draftSaved ? '✓ Draft Saved' : 'Save Draft'}
          </button> */}
          <button
            type="submit"
            disabled={isSending}
            className="px-6 py-3.5 rounded-xl bg-white text-[#0F172A] border border-[#CBD5E1] text-xs md:text-sm font-extrabold uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md flex items-center space-x-2 disabled:opacity-70 cursor-pointer"
          >
            <span>{isSending ? 'Sending...' : 'Send Invitation'}</span>
            {!isSending && <span>&rarr;</span>}
          </button>
        </div>
      </form>
    </div>
  );
};
