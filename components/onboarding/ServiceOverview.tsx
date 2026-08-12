'use client';

import React from 'react';
import { AgreementOption } from '@/types/onboarding';

interface ServiceOverviewProps {
  selectedOption: AgreementOption;
  resideChecked: boolean;
  understandChecked: boolean;
  onResideChange: (checked: boolean) => void;
  onUnderstandChange: (checked: boolean) => void;
  onContinue: () => void;
}

export const ServiceOverview: React.FC<ServiceOverviewProps> = ({
  selectedOption,
  resideChecked,
  understandChecked,
  onResideChange,
  onUnderstandChange,
  onContinue,
}) => {
  const isReady = resideChecked && understandChecked;

  return (
    <aside className="lg:col-span-5 sticky top-24">
      <div className="bg-primary border border-primary/80 rounded-xl p-4 md:p-6 space-y-4 shadow-2xl text-white">
        {/* Category Tag */}
        <div className="inline-block px-2.5 py-0.5 rounded bg-[#8B3A3A] text-white text-[0.6rem] font-bold tracking-[0.18em] uppercase">
          Service Overview
        </div>

        {/* Title */}
        <h2 className="text-lg font-serif-legal font-semibold text-white leading-snug">
          {selectedOption.overviewTitle}
        </h2>

        {/* Description & Legal Note */}
        <div className="space-y-3 text-[11px] md:text-xs text-primary-foreground/70 leading-relaxed">
          <p>{selectedOption.overviewDescription}</p>
          <div className="bg-[#FAF8F5] border border-[#E6E3DC] rounded-lg p-3 shadow-sm">
            <p className="text-primary text-[11px] leading-relaxed font-semibold">
              {selectedOption.legalNote}
            </p>
          </div>
        </div>

        <hr className="border-primary/70" />

        {/* Required Confirmations */}
        <div className="space-y-3">
          <div className="text-[0.62rem] font-bold tracking-[0.16em] text-primary-foreground/50 uppercase">
            Required Confirmations
          </div>

          <div className="space-y-2.5">
            <label
              htmlFor="check-reside"
              className="flex items-start space-x-2.5 cursor-pointer group text-[11px] text-primary-foreground/90 font-medium"
            >
              <input
                type="checkbox"
                id="check-reside"
                checked={resideChecked}
                onChange={(e) => onResideChange(e.target.checked)}
                className="mt-0.5 appearance-none w-[15px] h-[15px] rounded border border-primary-foreground/40 bg-primary/60 flex-shrink-0 cursor-pointer transition-all duration-200 checked:bg-[#8B3A3A] checked:border-[#8B3A3A] relative checked:after:content-[''] checked:after:absolute checked:after:left-[4px] checked:after:top-[1px] checked:after:w-[4px] checked:after:h-[8px] checked:after:border-white checked:after:border-r-2 checked:after:border-b-2 checked:after:rotate-45"
              />
              <span className="group-hover:text-[#E26D6D] transition-colors">
                I reside in England or Wales.
              </span>
            </label>

            <label
              htmlFor="check-understand"
              className="flex items-start space-x-2.5 cursor-pointer group text-[11px] text-primary-foreground/90 font-medium"
            >
              <input
                type="checkbox"
                id="check-understand"
                checked={understandChecked}
                onChange={(e) => onUnderstandChange(e.target.checked)}
                className="mt-0.5 appearance-none w-[15px] h-[15px] rounded border border-primary-foreground/40 bg-primary/60 flex-shrink-0 cursor-pointer transition-all duration-200 checked:bg-[#8B3A3A] checked:border-[#8B3A3A] relative checked:after:content-[''] checked:after:absolute checked:after:left-[4px] checked:after:top-[1px] checked:after:w-[4px] checked:after:h-[8px] checked:after:border-white checked:after:border-r-2 checked:after:border-b-2 checked:after:rotate-45"
              />
              <span className="group-hover:text-[#E26D6D] transition-colors">
                I understand I cannot change my service once submitted.
              </span>
            </label>
          </div>
        </div>

        {/* Continue Button */}
        <button
          disabled={!isReady}
          onClick={onContinue}
          className={`w-full py-2.5 px-5 rounded-lg text-[11px] md:text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center space-x-2 ${
            isReady
              ? 'bg-[#FAF8F5] hover:bg-white text-primary shadow-lg cursor-pointer border border-[#FAF8F5]'
              : 'bg-primary/80 text-primary-foreground/40 cursor-not-allowed border border-primary/60'
          }`}
        >
          <span>Continue &rarr;</span>
        </button>
      </div>
    </aside>
  );
};