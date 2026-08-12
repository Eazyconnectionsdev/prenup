import React from "react";
import Sidebar from "@/components/admin/SidebarCaseManager";

export const metadata = {
  title: "Case Manager",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full">
      <Sidebar />
      <main className="h-screen overflow-y-auto flex-1 p-8">{children}</main>
    </div>
  );
}
