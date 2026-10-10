'use client';

import React from 'react';
import type { ServiceOverviewProps } from "@/types/onboarding/service-overview";

export const ServiceOverview: React.FC<ServiceOverviewProps> = ({
  selectedOption,
  selectedService,
  selectedId,
  onSelectSubOption,
  resideChecked,
  onResideChange,
  onContinue,
  isSubmitting = false,
}) => {
  const isReady = resideChecked && !isSubmitting;

  return (
    <div className="bg-primary border border-primary/80 rounded-2xl p-5 md:p-7 space-y-6 shadow-2xl text-white">
      {/* Category Tag & Service Tags Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="inline-block px-2.5 py-0.5 rounded bg-[#8B3A3A] text-white text-[0.6rem] font-bold tracking-[0.18em] uppercase">
            Service Details
          </div>
          {selectedOption.tags && selectedOption.tags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-block px-2 py-0.5 rounded bg-white/10 text-[#FAF8F5] border border-white/20 text-[0.6rem] font-bold tracking-wider uppercase"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-serif-legal font-semibold text-white leading-snug">
          {selectedOption.overviewTitle}
        </h2>
      </div>

      {/* Sub-Options Section on the Right */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-[0.65rem] font-bold tracking-[0.18em] uppercase text-[#C5A880]">
            {selectedService === 'cohabitation' ? 'Agreement Option' : 'Select Option'}
          </span>
          <span className="text-[0.62rem] text-primary-foreground/60">
            {selectedService === 'cohabitation' ? '1 option' : '2 options available'}
          </span>
        </div>

        {/* Prenup Sub-options (2 options) */}
        {selectedService === 'prenup' && (
          <div className="space-y-2.5">
            {/* Prenup: Marriage */}
            <div
              role="radio"
              aria-checked={selectedId === 'prenup-marriage'}
              tabIndex={0}
              onClick={() => onSelectSubOption('prenup-marriage')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectSubOption('prenup-marriage');
                }
              }}
              className={`p-3.5 md:p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-start space-x-3.5 ${
                selectedId === 'prenup-marriage'
                  ? 'bg-white border-2 border-[#8B3A3A] text-primary shadow-lg ring-1 ring-[#8B3A3A]/20'
                  : 'bg-[#1E293B]/70 border-[#334155] text-white hover:border-[#C5A880]/60 hover:bg-[#1E293B]'
              }`}
            >
              <div
                className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                  selectedId === 'prenup-marriage'
                    ? 'border-[#8B3A3A] bg-white'
                    : 'border-[#64748B] bg-transparent'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full bg-[#8B3A3A] transition-all duration-200 ${
                    selectedId === 'prenup-marriage' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                  }`}
                />
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span
                    className={`font-bold text-xs md:text-sm tracking-wide ${
                      selectedId === 'prenup-marriage' ? 'text-primary' : 'text-white'
                    }`}
                  >
                    Marriage
                  </span>
                  {selectedId === 'prenup-marriage' && (
                    <span className="text-[0.6rem] font-extrabold uppercase tracking-wider text-[#8B3A3A] bg-[#8B3A3A]/10 px-2 py-0.5 rounded">
                      Selected
                    </span>
                  )}
                </div>
                <p
                  className={`text-[11px] md:text-xs leading-relaxed ${
                    selectedId === 'prenup-marriage' ? 'text-primary/75' : 'text-primary-foreground/70'
                  }`}
                >
                  I intend to get married and my wedding is more than 28 days away.
                </p>
              </div>
            </div>

            {/* Prenup: Civil Partnership */}
            <div
              role="radio"
              aria-checked={selectedId === 'prenup-civil'}
              tabIndex={0}
              onClick={() => onSelectSubOption('prenup-civil')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectSubOption('prenup-civil');
                }
              }}
              className={`p-3.5 md:p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-start space-x-3.5 ${
                selectedId === 'prenup-civil'
                  ? 'bg-white border-2 border-[#8B3A3A] text-primary shadow-lg ring-1 ring-[#8B3A3A]/20'
                  : 'bg-[#1E293B]/70 border-[#334155] text-white hover:border-[#C5A880]/60 hover:bg-[#1E293B]'
              }`}
            >
              <div
                className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                  selectedId === 'prenup-civil'
                    ? 'border-[#8B3A3A] bg-white'
                    : 'border-[#64748B] bg-transparent'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full bg-[#8B3A3A] transition-all duration-200 ${
                    selectedId === 'prenup-civil' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                  }`}
                />
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span
                    className={`font-bold text-xs md:text-sm tracking-wide ${
                      selectedId === 'prenup-civil' ? 'text-primary' : 'text-white'
                    }`}
                  >
                    Civil Partnership
                  </span>
                  {selectedId === 'prenup-civil' && (
                    <span className="text-[0.6rem] font-extrabold uppercase tracking-wider text-[#8B3A3A] bg-[#8B3A3A]/10 px-2 py-0.5 rounded">
                      Selected
                    </span>
                  )}
                </div>
                <p
                  className={`text-[11px] md:text-xs leading-relaxed ${
                    selectedId === 'prenup-civil' ? 'text-primary/75' : 'text-primary-foreground/70'
                  }`}
                >
                  I intend to enter a civil partnership and my registration is more than 28 days away.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Postnup Sub-options (2 options) */}
        {selectedService === 'postnup' && (
          <div className="space-y-2.5">
            {/* Postnup: Marriage */}
            <div
              role="radio"
              aria-checked={selectedId === 'postnup-marriage'}
              tabIndex={0}
              onClick={() => onSelectSubOption('postnup-marriage')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectSubOption('postnup-marriage');
                }
              }}
              className={`p-3.5 md:p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-start space-x-3.5 ${
                selectedId === 'postnup-marriage'
                  ? 'bg-white border-2 border-[#8B3A3A] text-primary shadow-lg ring-1 ring-[#8B3A3A]/20'
                  : 'bg-[#1E293B]/70 border-[#334155] text-white hover:border-[#C5A880]/60 hover:bg-[#1E293B]'
              }`}
            >
              <div
                className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                  selectedId === 'postnup-marriage'
                    ? 'border-[#8B3A3A] bg-white'
                    : 'border-[#64748B] bg-transparent'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full bg-[#8B3A3A] transition-all duration-200 ${
                    selectedId === 'postnup-marriage' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                  }`}
                />
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span
                    className={`font-bold text-xs md:text-sm tracking-wide ${
                      selectedId === 'postnup-marriage' ? 'text-primary' : 'text-white'
                    }`}
                  >
                    Marriage
                  </span>
                  {selectedId === 'postnup-marriage' && (
                    <span className="text-[0.6rem] font-extrabold uppercase tracking-wider text-[#8B3A3A] bg-[#8B3A3A]/10 px-2 py-0.5 rounded">
                      Selected
                    </span>
                  )}
                </div>
                <p
                  className={`text-[11px] md:text-xs leading-relaxed ${
                    selectedId === 'postnup-marriage' ? 'text-primary/75' : 'text-primary-foreground/70'
                  }`}
                >
                  I am already married or my wedding is within the next 28 days.
                </p>
              </div>
            </div>

            {/* Postnup: Civil Partnership */}
            <div
              role="radio"
              aria-checked={selectedId === 'postnup-civil'}
              tabIndex={0}
              onClick={() => onSelectSubOption('postnup-civil')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectSubOption('postnup-civil');
                }
              }}
              className={`p-3.5 md:p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-start space-x-3.5 ${
                selectedId === 'postnup-civil'
                  ? 'bg-white border-2 border-[#8B3A3A] text-primary shadow-lg ring-1 ring-[#8B3A3A]/20'
                  : 'bg-[#1E293B]/70 border-[#334155] text-white hover:border-[#C5A880]/60 hover:bg-[#1E293B]'
              }`}
            >
              <div
                className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                  selectedId === 'postnup-civil'
                    ? 'border-[#8B3A3A] bg-white'
                    : 'border-[#64748B] bg-transparent'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full bg-[#8B3A3A] transition-all duration-200 ${
                    selectedId === 'postnup-civil' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                  }`}
                />
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span
                    className={`font-bold text-xs md:text-sm tracking-wide ${
                      selectedId === 'postnup-civil' ? 'text-primary' : 'text-white'
                    }`}
                  >
                    Civil Partnership
                  </span>
                  {selectedId === 'postnup-civil' && (
                    <span className="text-[0.6rem] font-extrabold uppercase tracking-wider text-[#8B3A3A] bg-[#8B3A3A]/10 px-2 py-0.5 rounded">
                      Selected
                    </span>
                  )}
                </div>
                <p
                  className={`text-[11px] md:text-xs leading-relaxed ${
                    selectedId === 'postnup-civil' ? 'text-primary/75' : 'text-primary-foreground/70'
                  }`}
                >
                  I am already in a civil partnership, or my registration is within 28 days.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cohabitation Sub-option (1 option) */}
        {selectedService === 'cohabitation' && (
          <div className="space-y-2.5">
            <div
              role="radio"
              aria-checked={true}
              className="p-3.5 md:p-4 rounded-xl border-2 border-[#8B3A3A] bg-white text-primary shadow-lg ring-1 ring-[#8B3A3A]/20 flex items-start space-x-3.5"
            >
              <div className="mt-0.5 w-4 h-4 rounded-full border-2 border-[#8B3A3A] bg-white flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-[#8B3A3A]" />
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs md:text-sm text-primary tracking-wide">
                    Cohabitation Agreement
                  </span>
                  <span className="text-[0.6rem] font-extrabold uppercase tracking-wider text-[#8B3A3A] bg-[#8B3A3A]/10 px-2 py-0.5 rounded">
                    Selected
                  </span>
                </div>
                <p className="text-[11px] md:text-xs text-primary/75 leading-relaxed">
                  I live with or Plan to live with my partner without marriage or civil partnership.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Description & Legal Note */}
      <div className="space-y-3 text-[11px] md:text-xs text-primary-foreground/75 leading-relaxed pt-1">
        <p>{selectedOption.overviewDescription}</p>
        <div className="bg-[#FAF8F5] border border-[#E6E3DC] rounded-xl p-3.5 shadow-sm">
          <p className="text-primary text-[11px] leading-relaxed font-semibold">
            {selectedOption.legalNote}
          </p>
        </div>
      </div>

      <hr className="border-primary/60" />

      {/* Required Confirmation: I reside in England or Wales */}
      <div className="space-y-3">
        <div className="text-[0.62rem] font-bold tracking-[0.16em] text-primary-foreground/50 uppercase">
          Required Confirmation
        </div>

        <div className="space-y-2.5">
          <label
            htmlFor="check-reside"
            className="flex items-start space-x-2.5 cursor-pointer group text-xs text-primary-foreground/90 font-medium"
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
        </div>
      </div>

      {/* Continue Button */}
      <button
        disabled={!isReady}
        onClick={onContinue}
        className={`w-full py-3 px-5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center space-x-2 ${
          isReady
            ? 'bg-[#FAF8F5] hover:bg-white text-primary shadow-lg cursor-pointer border border-[#FAF8F5] hover:scale-[1.01] active:scale-[0.99]'
            : 'bg-primary/80 text-primary-foreground/40 cursor-not-allowed border border-primary/60'
        }`}
      >
        <span>{isSubmitting ? 'Saving...' : <>Continue &rarr;</>}</span>
      </button>
    </div>
  );
};