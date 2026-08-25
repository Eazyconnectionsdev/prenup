'use client';

import React, { useState } from 'react';

interface SecurePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: () => void;
  serviceTitle?: string;
}

export const SecurePaymentModal: React.FC<SecurePaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  serviceTitle = 'Premier Bespoke Matrimonial Agreement',
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  if (!isOpen) return null;

  const displayPrice = '€499';

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentDone(true);
      setTimeout(() => {
        if (onPaymentSuccess) onPaymentSuccess();
        onClose();
      }, 1000);
    }, 1200);
  };

  const steps = [
    { number: 'STEP 01', title: 'Complete payment' },
    { number: 'STEP 02', title: 'Complete your questionnaires' },
    { number: 'STEP 03', title: 'Meet your independent lawyers' },
    { number: 'STEP 04', title: 'Sign your agreement' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#FAF8F5] border border-[#E2D9CC] rounded-3xl p-6 md:p-10 shadow-2xl space-y-8 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#0F172A] text-white hover:bg-[#C5A880] hover:text-[#0F172A] transition-all flex items-center justify-center font-bold text-lg cursor-pointer shadow-md"
          title="Close Modal"
        >
          ✕
        </button>

        {/* Clean Header Text */}
        <div className="text-center space-y-3 max-w-3xl mx-auto py-2 pr-8">
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
              POPULAR SERVICE
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

            {/* Professional SVG Lock & Clean Lawyer Text */}
            <div className="pt-2 space-y-2 text-center">
              <div className="text-[0.7rem] text-[#CBD5E1] font-semibold flex items-center justify-center space-x-1.5">
                <svg className="w-3.5 h-3.5 text-[#C5A880] inline-block" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Protected by Stripe • 256-bit SSL Encryption</span>
              </div>

              <div className="text-[0.68rem] text-[#C5A880] font-extrabold tracking-wider uppercase text-center pt-0.5">
                SRA &amp; BSB Regulated Panel Lawyers
              </div>
            </div>
          </div>
        </div>

        {/* WHAT HAPPENS NEXT? Section */}
        <div className="pt-4 space-y-6 text-center">
          <h2 className="text-xl md:text-2xl font-serif-legal font-bold tracking-widest text-[#0F172A] uppercase">
            WHAT HAPPENS NEXT?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {steps.map((stepItem) => (
              <div
                key={stepItem.number}
                className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 text-left space-y-2 shadow-md hover:border-[#C5A880] transition-colors"
              >
                <span className="text-[0.65rem] font-bold tracking-widest text-[#C5A880] block uppercase">
                  {stepItem.number}
                </span>
                <span className="text-xs font-bold text-white block leading-snug">
                  {stepItem.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
