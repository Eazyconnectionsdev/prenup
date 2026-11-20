"use client";

import React from "react";
import { LawyerProfilePanel } from "@/components/lawyer/LawyerProfilePanel";

// The same profile the sidebar card and the top bar open in a window, for
// anyone who lands here from an old link.
export default function LawyerProfilePage() {
  return (
    <div className="p-8">
      <div className="max-w-[760px] bg-white border border-slate-300 rounded-2xl p-7 shadow-xs">
        <LawyerProfilePanel />
      </div>
    </div>
  );
}
