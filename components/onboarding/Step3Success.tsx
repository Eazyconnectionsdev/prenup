'use client';

import React, { useEffect, useState } from 'react';

interface Step3SuccessProps {
  userName: string;
  serviceTitle: string;
}

export const Step3Success: React.FC<Step3SuccessProps> = ({
  userName,
  serviceTitle,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(5);

  useEffect(() => {
    if (secondsLeft <= 0) {
      window.location.href = '/dashboard';
      return;
    }

    const timer = setTimeout(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [secondsLeft]);

  return (
    <main className="w-full max-w-xl mx-auto px-5 py-10 flex-1 text-center space-y-4">
      <div className="w-14 h-14 rounded-full bg-[#FAF8F5] border-2 border-primary text-primary mx-auto flex items-center justify-center text-xl font-bold shadow-md">
        ✓
      </div>
      <h1 className="text-2xl font-serif-legal font-semibold text-primary">
        Application Received
      </h1>
      <p className="text-xs text-primary/70 max-w-sm mx-auto leading-relaxed">
        Thank you <span className="text-primary font-semibold">{userName}</span>. Your onboarding registration for{' '}
        <span className="text-[#8B3A3A] font-semibold">{serviceTitle}</span> has been saved. A panel solicitor guide has been sent to your email.
      </p>
      <div className="pt-1">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-white border border-[#E6E3DC] shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B3A3A] animate-pulse" />
          <p className="text-[11px] font-semibold text-primary/80 tracking-wide">
            You will be redirected to your dashboard in {secondsLeft} second{secondsLeft !== 1 ? 's' : ''}...
          </p>
        </div>
      </div>
    </main>
  );
};