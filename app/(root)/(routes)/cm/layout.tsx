import React from "react";
import { CaseManagerSidebar } from "@/components/caseManager/CaseManagerSidebar";
import { CaseManagerTopBar } from "@/components/caseManager/CaseManagerTopBar";

export const metadata = {
  title: "Case Manager",
};

export default function CaseManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7f4ee]">
      <CaseManagerSidebar />

      <div className="ml-[240px] flex flex-col min-h-screen min-w-0">
        <CaseManagerTopBar />

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
