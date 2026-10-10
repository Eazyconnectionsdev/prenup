import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";

export const metadata = {
  title: "Admin Portal",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7f4ee]">
      <AdminSidebar />

      <div className="ml-[240px] flex flex-col min-h-screen min-w-0">
        <AdminTopBar />

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
