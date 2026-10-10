'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { AgreementCardProps } from "@/types/onboarding/agreement-card";

export const AgreementCard: React.FC<AgreementCardProps> = ({
  serviceKey,
  title,
  badge,
  serviceTag,
  subtitle,
  subOptionCountText,
  isSelected: explicitIsSelected,
  onSelect,
  // Alternative prop styles
  service,
  selectedId,
  option,
}) => {
  // Resolve values whether passed directly or via service/option
  const actualKey = serviceKey || service?.key || (option ? (option.id.startsWith('prenup') ? 'prenup' : option.id.startsWith('postnup') ? 'postnup' : 'cohabitation') : 'prenup');
  const actualTitle = title || service?.title || option?.title || 'Agreement';
  const actualBadge = badge || service?.badge || option?.badge;
  const actualTag = serviceTag || service?.serviceTag || option?.serviceTag;
  const actualSubtitle = subtitle || service?.subtitle || option?.subtitle;
  const actualCountText = subOptionCountText || service?.subOptionCountText || (actualKey === 'cohabitation' ? '1 option' : '2 options');

  const isSelected = explicitIsSelected !== undefined
    ? explicitIsSelected
    : selectedId
      ? (selectedId.startsWith(actualKey) || (actualKey === 'cohabitation' && selectedId === 'cohabitation'))
      : false;

  const handleClick = () => {
    if (onSelect) {
      onSelect(actualKey);
    }
  };

  return (
    <div
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className={`p-4 md:p-5 rounded-2xl cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] relative flex items-start space-x-3.5 ${
        isSelected
          ? 'bg-[#FAF8F5] border-2 border-[#8B3A3A] text-primary shadow-[0_8px_24px_rgba(139,58,58,0.14)] ring-1 ring-[#8B3A3A]/20'
          : 'bg-[#0F172A] border border-[#1E293B] text-white shadow-[0_2px_8px_rgba(15,23,42,0.12)] hover:border-[#C5A880]/60 hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(15,23,42,0.25)]'
      }`}
    >
      {/* Radio Circle */}
      <div
        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
          isSelected
            ? 'border-[#8B3A3A] bg-white'
            : 'border-[#475569] bg-[#1E293B]'
        }`}
      >
        <div
          className={`w-2.5 h-2.5 rounded-full bg-[#8B3A3A] transition-all duration-200 ${
            isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h3
            className={`font-serif-legal font-bold text-sm md:text-base leading-snug tracking-wide ${
              isSelected ? 'text-primary' : 'text-white'
            }`}
          >
            {actualTitle}
          </h3>

          <div className="flex items-center gap-1.5 flex-wrap">
            {actualBadge && (
              <span
                className={`text-[0.6rem] tracking-[0.08em] font-extrabold px-2 py-0.5 rounded uppercase ${
                  isSelected
                    ? 'bg-[#8B3A3A] text-white'
                    : 'bg-[#E26D6D] text-white'
                }`}
              >
                {actualBadge}
              </span>
            )}
            {actualTag && (
              <span
                className={`text-[0.6rem] font-bold tracking-wider px-2 py-0.5 rounded uppercase border transition-colors ${
                  isSelected
                    ? 'bg-[#8B3A3A]/10 text-[#8B3A3A] border-[#8B3A3A]/30'
                    : 'bg-white/10 text-[#C5A880] border-white/20'
                }`}
              >
                {actualTag}
              </span>
            )}
          </div>
        </div>

        {actualSubtitle && (
          <p
            className={`text-[11px] md:text-xs leading-relaxed ${
              isSelected ? 'text-primary/70' : 'text-primary-foreground/60'
            }`}
          >
            {actualSubtitle}
          </p>
        )}

        <div className="flex items-center justify-between pt-1">
          <span
            className={`text-[0.62rem] font-bold tracking-wider uppercase ${
              isSelected ? 'text-[#8B3A3A]' : 'text-[#94A3B8]'
            }`}
          >
            {actualCountText}
          </span>

          <div
            className={`flex items-center text-xs font-semibold ${
              isSelected ? 'text-[#8B3A3A]' : 'text-[#64748B]'
            }`}
          >
            <span className="hidden sm:inline text-[0.65rem] mr-1">Configure</span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-0.5' : ''}`} />
          </div>
        </div>
      </div>
    </div>
  );
};