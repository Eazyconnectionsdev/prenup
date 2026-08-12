'use client';

import React, { useState } from 'react';
import { AgreementOption } from '@/types/onboarding';

interface Step2PaymentProps {
  selectedOption: AgreementOption;
  onBack: () => void;
  onPaymentSuccess: () => void;
}

export const Step2Payment: React.FC<Step2PaymentProps> = ({
  selectedOption,
  onBack,
  onPaymentSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  // Price formatting: default to €499
  const displayPrice = '€499';

  const handlePay = () => {
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
          <div className="text-[0.65rem] font-bold tracking-[0.2em] text-[#C5A880] uppercase border-b border-[#1E293B] pb-3 text-center">
            {selectedOption.badge ? selectedOption.badge.toUpperCase() : 'POPULAR'}
          </div>

          {/* Pricing Row */}
          <div className="flex justify-between items-center pt-1">
            <span className="text-xs font-semibold text-[#CBD5E1]">Fixed Total Fee</span>
            <span className="text-3xl md:text-4xl font-bold text-[#FAF8F5] tracking-tight">
              {displayPrice}
            </span>
          </div>

          {/* Pay Button: Default White (bg-white), Hover Warm Gold (#C5A880) */}
          <button
            onClick={handlePay}
            disabled={isProcessing || paymentDone}
            className="w-full py-4 px-6 rounded-xl bg-white text-[#0F172A] text-xs md:text-sm font-extrabold tracking-widest uppercase hover:bg-[#C5A880] hover:border-[#C5A880] hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-80 cursor-pointer border border-white"
          >
            {isProcessing ? (
              <span>Processing Payment...</span>
            ) : paymentDone ? (
              <span>✓ Payment Complete</span>
            ) : (
              <span>PAY {displayPrice}</span>
            )}
          </button>

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
