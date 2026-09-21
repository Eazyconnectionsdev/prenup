import React from "react";
import { LawyerSidebar } from "@/components/lawyer/LawyerSidebar";
import { LawyerTopBar } from "@/components/lawyer/LawyerTopBar";

export const metadata = {
  title: "Lawyer Portal",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7f4ee]">
      <LawyerSidebar />

      <div className="ml-[220px] flex flex-col min-h-screen">
        <LawyerTopBar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}