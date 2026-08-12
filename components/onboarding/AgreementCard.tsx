'use client';

import React from 'react';
import { AgreementOption } from '@/types/onboarding';

interface AgreementCardProps {
  option: AgreementOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const AgreementCard: React.FC<AgreementCardProps> = ({
  option,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onClick={() => onSelect(option.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(option.id);
        }
      }}
      className={`p-3 md:p-4 rounded-xl cursor-pointer flex items-start space-x-3 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isSelected
          ? 'bg-[#FAF8F5] border-2 border-[#8B3A3A] text-primary shadow-[0_6px_20px_rgba(139,58,58,0.14)]'
          : 'bg-primary border border-primary/80 text-white shadow-[0_2px_8px_rgba(15,23,42,0.12)] hover:border-primary/60 hover:-translate-y-px hover:shadow-[0_4px_14px_rgba(15,23,42,0.25)]'
      }`}
    >
      {/* Custom radio */}
      <div
        className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
          isSelected
            ? 'border-[#8B3A3A] bg-white'
            : 'border-primary/60 bg-primary/80'
        }`}
      >
        <div
          className={`w-2 h-2 rounded-full bg-[#8B3A3A] transition-all duration-200 ${
            isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}
        />
      </div>

      <div className="flex-1 space-y-0.5">
        <div className="flex items-center space-x-2">
          <span
            className={`font-bold text-xs md:text-sm leading-snug ${
              isSelected ? 'text-primary' : 'text-white'
            }`}
          >
            {option.title}
          </span>
          {option.badge && (
            <span
              className={`text-[0.6rem] tracking-[0.08em] font-bold px-1.5 py-0.5 rounded uppercase text-white ${
                isSelected ? 'bg-[#8B3A3A]' : 'bg-[#E26D6D]'
              }`}
            >
              {option.badge}
            </span>
          )}
        </div>
        <p
          className={`text-[11px] md:text-xs leading-relaxed ${
            isSelected ? 'text-primary/70' : 'text-primary-foreground/60'
          }`}
        >
          {option.subtitle}
        </p>
      </div>
    </div>
  );
};