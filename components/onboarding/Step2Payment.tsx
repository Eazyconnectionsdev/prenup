'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from "@/store/store";
import type { Step2PaymentProps } from "@/types/onboarding/step2-payment";

export const Step2Payment: React.FC<Step2PaymentProps> = ({
  selectedOption,
  onBack,
  onPaymentSuccess,
  onChooseService,
  isPaid: propIsPaid,
}) => {
  const user = useSelector((state: RootState) => state.auth?.user);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  // Price formatting: default to €499
  const displayPrice = '€499';

  const isPaid = Boolean(propIsPaid || user?.paymentDone || paymentDone);
  const hasSelectedService = Boolean(selectedOption && selectedOption.id && selectedOption.id !== 'help-choose');

  const handlePay = () => {
    if (!hasSelectedService) {
      if (onChooseService) onChooseService();
      else onBack();
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentDone(true);
      setTimeout(() => {
        onPaymentSuccess();
      }, 800);
    }, 1200);
  };

  return (
    <main className="w-full max-w-7xl mx-auto px-6 py-8 flex-1 space-y-8 mb-10">
      {/* Sleek Left-Aligned Back Button (Aligned to Step 1 Margin) */}
      <div className="flex justify-start -ml-2">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2.5 px-4 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-extrabold uppercase tracking-wider border border-[#1E293B] hover:bg-[#1E293B] hover:border-[#C5A880] hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md group cursor-pointer"
        >
          <span className="text-[#C5A880] group-hover:text-white transition-colors font-bold text-sm">
            &larr;
          </span>
          <span className="group-hover:text-[#FAF8F5]">Back to Agreement Selection</span>
        </button>
      </div>

      {/* Clean Header Text (Directly on Page Background) */}
      <div className="text-center space-y-3 max-w-3xl mx-auto py-2">
        <h1 className="text-3xl md:text-5xl font-serif-legal font-bold tracking-wide text-[#0F172A]">
          Secure Your Fixed Fee
        </h1>
        <p className="text-xs md:text-sm text-[#5A6578] leading-relaxed max-w-xl mx-auto font-medium">
          One fixed fee covering both partners, two independent lawyers from separate regulated law firms, and everything from start to signature.
        </p>
      </div>

      {/* Centered Payment Box */}
      <div className="max-w-md mx-auto">
        <div className="bg-[#0F172A] border-2 border-[#C5A880] rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl text-white relative overflow-hidden">
          {/* Tag */}
          <div className="text-[0.65rem] font-bold tracking-[0.2em] text-[#C5A880] uppercase border-b border-[#1E293B] pb-3 text-center flex items-center justify-center gap-2">
            {hasSelectedService ? (
              <>
                <span>{selectedOption?.serviceTag || 'PRENUP'}</span>
                {selectedOption?.subTag && (
                  <span className="text-[#94A3B8]">• {selectedOption.subTag}</span>
                )}
              </>
            ) : (
              <span>SERVICE SELECTION REQUIRED</span>
            )}
          </div>

          {/* Pricing Row */}
          <div className="flex justify-between items-center pt-1">
            <span className="text-xs font-semibold text-[#CBD5E1]">Fixed Total Fee</span>
            <span className="text-3xl md:text-4xl font-bold text-[#FAF8F5] tracking-tight">
              {displayPrice}
            </span>
          </div>

          {/* Service Table / Selected Service Row */}
          <div className="bg-[#1E293B]/80 border border-[#334155] rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[0.68rem] font-bold tracking-[0.16em] uppercase text-[#C5A880]">
                Service Selected
              </span>
              {hasSelectedService && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedOption?.serviceTag && (
                    <span className="text-[0.6rem] font-extrabold px-2 py-0.5 rounded bg-[#C5A880] text-[#0F172A] tracking-wider uppercase">
                      {selectedOption.serviceTag}
                    </span>
                  )}
                  {selectedOption?.subTag && (
                    <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded bg-white/10 text-[#CBD5E1] border border-white/15 tracking-wider uppercase">
                      {selectedOption.subTag}
                    </span>
                  )}
                </div>
              )}
            </div>

            {hasSelectedService ? (
              <div className="space-y-1 pt-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm md:text-base font-bold text-[#FAF8F5]">
                    {selectedOption?.serviceName || selectedOption?.title || 'Prenup'}
                  </span>
                  {isPaid && (
                    <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      ✓ Paid
                    </span>
                  )}
                </div>
                <p className="text-[0.72rem] text-[#94A3B8]">
                  {selectedOption?.overviewTitle || selectedOption?.title}
                </p>
                {selectedOption?.tags && selectedOption.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                    {selectedOption.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[0.6rem] font-semibold px-2 py-0.5 rounded bg-[#0F172A] border border-[#334155] text-[#CBD5E1]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="pt-1 pb-0.5 flex items-center justify-between gap-3">
                <span className="text-xs text-[#94A3B8]">No service selected</span>
                <button
                  type="button"
                  onClick={onChooseService || onBack}
                  className="px-3 py-1.5 rounded-lg bg-[#C5A880] text-[#0F172A] text-xs font-extrabold uppercase tracking-wider hover:bg-white transition-all shadow-sm cursor-pointer"
                >
                  Choose a Service
                </button>
              </div>
            )}
          </div>

          {/* Pay Button */}
          {hasSelectedService ? (
            <button
              onClick={handlePay}
              disabled={isProcessing || isPaid}
              className="w-full py-4 px-6 rounded-xl bg-white text-[#0F172A] text-xs md:text-sm font-extrabold tracking-widest uppercase hover:bg-[#C5A880] hover:border-[#C5A880] hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-80 cursor-pointer border border-white"
            >
              {isProcessing ? (
                <span>Processing Payment...</span>
              ) : isPaid ? (
                <span>✓ Payment Complete</span>
              ) : (
                <span>PAY {displayPrice}</span>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={onChooseService || onBack}
              className="w-full py-4 px-6 rounded-xl bg-[#C5A880] text-[#0F172A] text-xs md:text-sm font-extrabold tracking-widest uppercase hover:bg-white hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer border border-[#C5A880]"
            >
              <span>Choose a Service to Continue</span>
            </button>
          )}

          {/* Subtext Note */}
          <div className="bg-[#1E293B]/70 border border-[#334155] rounded-xl p-4 text-center space-y-1">
            <p className="text-xs font-bold text-[#FAF8F5]">No separate payments to lawyers.</p>
            <p className="text-[0.72rem] text-[#94A3B8]">Everything is included in your fixed fee.</p>
          </div>

          {/* Professional SVG Lock & Clean Lawyer Text (Symbol Icon Removed) */}
          <div className="pt-2 space-y-2 text-center">
            <div className="text-[0.7rem] text-[#CBD5E1] font-semibold flex items-center justify-center space-x-1.5">
              <svg className="w-3.5 h-3.5 text-[#C5A880] inline-block" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Protected by Stripe • 256-bit SSL Encryption</span>
            </div>

            {/* Clean Warm Gold Lawyer Text without symbol icon */}
            <div className="text-[0.68rem] text-[#C5A880] font-extrabold tracking-wider uppercase text-center pt-0.5">
              SRA &amp; BSB Regulated Panel Lawyers
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
