"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AdminDashboardView } from "@/components/admin/views/AdminDashboardView";
import { AdminCasesView } from "@/components/admin/views/AdminCasesView";
import { AdminSettingsView } from "@/components/admin/views/AdminSettingsView";
import { AdminReportsView } from "@/components/admin/views/AdminReportsView";
import type { AdminNavView } from "@/types/admin";

function AdminContent({ initialView = "dashboard" }: { initialView?: AdminNavView }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlView = searchParams.get("view") as AdminNavView | null;
  const [currentView, setCurrentView] = useState<AdminNavView>(initialView);

  useEffect(() => {
    if (pathname.includes("/dashboard") || pathname === "/admin") {
      setCurrentView("dashboard");
    } else if (pathname.includes("/admin-settings")) {
      setCurrentView("admin-settings");
    } else if (pathname.includes("/cases")) {
      setCurrentView("cases");
    } else if (pathname.includes("/reports")) {
      setCurrentView("reports");
    } else if (urlView && ["dashboard", "cases", "admin-settings", "reports"].includes(urlView)) {
      setCurrentView(urlView);
    }
  }, [pathname, urlView]);

  return (
    <div className="p-8">
      {currentView === "dashboard" && <AdminDashboardView />}
      {currentView === "cases" && <AdminCasesView />}
      {currentView === "admin-settings" && <AdminSettingsView />}
      {currentView === "reports" && <AdminReportsView />}
    </div>
  );
}

export default function AdminPage({ initialView = "dashboard" }: { initialView?: AdminNavView }) {
  return (
    <Suspense fallback={<div className="p-8 text-center bg-[#f7f4ee] min-h-screen">Loading Admin Portal...</div>}>
      <AdminContent initialView={initialView} />
    </Suspense>
  );
}
