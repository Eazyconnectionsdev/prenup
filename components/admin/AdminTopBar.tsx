"use client";

import React from "react";
import { usePathname } from "next/navigation";

const PATH_TITLES: [string, string][] = [
  ["/admin/dashboard", "Dashboard Ledger"],
  ["/admin/cases", "Cases Master List"],
  ["/admin/admin-settings", "Admin Settings"],
  ["/admin/reports", "Operational Reports"],
  ["/admin", "Dashboard Ledger"],
];

export const AdminTopBar: React.FC = () => {
  const pathname = usePathname();

  const pageTitle =
    PATH_TITLES.find(
      ([path]) => pathname === path || pathname.startsWith(`${path}/`),
    )?.[1] ?? "Admin Portal";

  return (
    <header className="sticky top-0 z-40 h-[76px] bg-[#f7f4ee] flex items-center justify-between px-8 pt-4 pb-2">
      <h1 className="text-2xl font-bold font-sans text-slate-900 tracking-tight">
        {pageTitle}
      </h1>
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-200 px-3 py-1 rounded-full">
          ADMIN
        </span>
      </div>
    </header>
  );
};
