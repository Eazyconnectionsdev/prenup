"use client";

import React from "react";
import { usePathname } from "next/navigation";

// Ordered most-specific first; matched by prefix so nested routes keep a title.
const PATH_TITLES: [string, string][] = [
  ["/cm/dashboard", "Dashboard Ledger"],
  ["/cm/cases", "Cases Master List"],
  ["/cm/case-manager/cases", "Case Details"],
  ["/cm/archived", "Archived Vault Ledger"],
  ["/cm/reports", "Operational Intelligence Reports"],
  ["/cm", "Dashboard Ledger"],
];

export const CaseManagerTopBar: React.FC = () => {
  const pathname = usePathname();

  const pageTitle =
    PATH_TITLES.find(
      ([path]) => pathname === path || pathname.startsWith(`${path}/`),
    )?.[1] ?? "Case Manager";

  return (
    <header className="sticky top-0 z-40 h-[76px] bg-[#f7f4ee] flex items-center justify-between px-8 pt-4 pb-2">
      <h1 className="text-2xl font-bold font-sans text-slate-900 tracking-tight">
        {pageTitle}
      </h1>
    </header>
  );
};
