'use client';

import React from 'react';


export const PartnerHeader = () => {
  return (
    <header className="bg-[#ffffff] border-2 border-[#E7E7F2] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
      <div className="space-y-1.5">
        <h1 className="text-2xl md:text-3xl font-serif-legal font-extrabold tracking-wider text-[#0F172A] uppercase">
          INVITE YOUR PARTNER
        </h1>
        <p className="text-xs md:text-sm font-semibold text-[#475569]">
          Connect your partner's account to unlock the shared matrimonial workspace.
        </p>
      </div>

      {/* <div className="px-4 py-1.5 rounded-full border-2 border-[#DDD6FE] text-[#6D28D9] text-xs font-extrabold tracking-widest uppercase bg-[#EDE9FE] shadow-sm">
        CASE: {caseId}
      </div> */}
    </header>
  );
};
