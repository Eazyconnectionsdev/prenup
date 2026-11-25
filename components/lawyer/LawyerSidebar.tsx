"use client";

import React, { useEffect, useState } from "react";
import BrandLogo from "@/components/brand/BrandLogo";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import Axios from "@/lib/ApiConfig";
import { LogOut } from "lucide-react";
import { logOutUser } from "@/store/asyncThunk/authThunk";
import { LawyerAccountModal } from "@/components/lawyer/LawyerProfilePanel";

const MENU_ITEMS = [
  { path: "/lawyer", label: "Dashboard" },
  { path: "/lawyer/assigned-cases", label: "Active Cases", countKey: "assigned" as const },
  { path: "/lawyer/archived", label: "Archived Cases", countKey: "completed" as const },
];

export const LawyerSidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.auth.user);

  const [assignedCount, setAssignedCount] = useState(0);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  const fullName = [user?.firstName, user?.middleName, user?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim() || "Unknown Lawyer";

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

  const title = user?.role
    ? user.role.replace(/_/g, " ").replace(/\b\w/g, (c : any) => c.toUpperCase())
    : "";

  const handleLogout = () => {
    dispatch(logOutUser());
    router.push("/login");
  };

  useEffect(() => {
    let cancelled = false;
    const loadCounts = async () => {
      try {
        // Same lists as the Active Cases and Archived Cases pages.
        const [active, archived] = await Promise.all([
          Axios.get("/lawyer/assignments", { params: { scope: "active" } }),
          Axios.get("/lawyer/assignments", { params: { scope: "archived" } }),
        ]);
        if (cancelled) return;
        setAssignedCount(Array.isArray(active.data) ? active.data.length : 0);
        setCompletedCount(Array.isArray(archived.data) ? archived.data.length : 0);
      } catch (err) {
        console.error("Failed to load sidebar counts", err);
      }
    };
    loadCounts();
    return () => {
      cancelled = true;
    };
  }, []);

  const counts: Record<string, number> = {
    assigned: assignedCount,
    completed: completedCount,
  };

  return (
    <aside className="w-[220px] bg-[#0d1527] border-r border-[#1e293b] fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between p-5 text-slate-200">
      <div>
        <div className="mb-8 pt-2">
          <BrandLogo surface="dark" height={26} priority />
          <span className="mt-2 block text-[9px] uppercase tracking-wider text-emerald-400 font-bold">
            LAWYER PORTAL
          </span>
        </div>

        <nav className="flex flex-col gap-1.5">
          {MENU_ITEMS.map((item) => {
            const isActive =
              item.path === "/lawyer"
                ? pathname === item.path
                : pathname === item.path || pathname.startsWith(`${item.path}/`);
            const count = item.countKey ? counts[item.countKey] : undefined;

            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all text-left w-full cursor-pointer ${
                  isActive
                    ? "bg-[#1b2947] text-white shadow-xs border border-slate-700/50"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#131e36]"
                }`}
              >
                <span>{item.label}</span>
                {count !== undefined && (
                  <span className="text-[10px] font-mono font-bold bg-[#131e36] text-slate-300 px-2 py-0.5 rounded-full border border-slate-700/60">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom user card, as in the case manager portal: opens the profile window */}
      <div className="pt-4 border-t border-white/[0.08]">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsAccountModalOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setIsAccountModalOpen(true);
          }}
          title="View and edit your profile"
          className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8B87FF] to-[#5B55F6] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate leading-tight">{fullName}</p>
              <span className="text-[10px] text-[#A9ACD6] block truncate uppercase tracking-wider font-semibold">
                {title || "Lawyer"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleLogout();
            }}
            title="Sign Out"
            className="p-1.5 rounded-lg text-[#A9ACD6] hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <LawyerAccountModal isOpen={isAccountModalOpen} onClose={() => setIsAccountModalOpen(false)} />
    </aside>
  );
};