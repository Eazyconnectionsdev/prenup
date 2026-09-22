
"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { RootState, AppDispatch } from "@/store/store";
import { logOutUser } from "@/store/asyncThunk/authThunk";
import {
  NavView,
  LawyerPersona,
} from "../../types/lawyer-portal";

interface LawyerSidebarProps {
  currentView: NavView;
  onViewChange: (view: NavView) => void;
  assignedCount: number;
  completedCount: number;
  activePersona: LawyerPersona;
  onOpenProfile: () => void;
  onLogout: () => void;
}

interface MenuItem {
  view: NavView;
  label: string;
  countKey?: "assigned" | "completed";
}

const MENU_ITEMS: MenuItem[] = [
  {
    view: "dashboard",
    label: "Dashboard",
  },
  {
    view: "assigned_cases",
    label: "Assigned Cases",
    countKey: "assigned",
  },
  {
    view: "completed",
    label: "Completed Cases",
    countKey: "completed",
  },
  {
    view: "settings",
    label: "Settings",
  },
];

export const LawyerSidebar: React.FC<LawyerSidebarProps> = ({
  currentView,
  onViewChange,
  assignedCount,
  completedCount,
  activePersona,
  onOpenProfile,
  onLogout,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const user = useSelector((state: RootState) => state.auth.user);

  const fullName =
    [user?.firstName, user?.middleName, user?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() || "Unknown Lawyer";

  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  const title = user?.role
    ? user.role
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c: string) => c.toUpperCase())
    : "Lawyer";

  const counts: Record<string, number> = {
    assigned: assignedCount,
    completed: completedCount,
  };

  const handleLogout = () => {
    dispatch(logOutUser());
    onLogout();
    router.push("/login");
  };

  const handleMenuClick = (view: NavView) => {
    onViewChange(view);
  };

  return (
    <aside className="w-[220px] bg-[#0d1527] border-r border-[#1e293b] fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between p-5 text-slate-200">
      {/* =========================================================
          TOP SECTION
      ========================================================= */}
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 pt-2">
          <div className="w-9 h-9 rounded-full border border-emerald-400 bg-[#0a101f] text-emerald-300 font-serif font-bold text-sm flex items-center justify-center shadow-xs">
            LP
          </div>

          <div className="flex flex-col">
            <h1 className="font-serif text-lg font-bold text-white tracking-wide leading-none">
              LetsPrenup
            </h1>

            <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold mt-1">
              LAWYER PORTAL
            </span>
          </div>
        </div>

        {/* =========================================================
            NAVIGATION
        ========================================================= */}
        <nav className="flex flex-col gap-1.5">
          {MENU_ITEMS.map((item) => {
            const isActive = currentView === item.view;

            const count =
              item.countKey !== undefined
                ? counts[item.countKey]
                : undefined;

            return (
              <button
                key={item.view}
                type="button"
                onClick={() => handleMenuClick(item.view)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all text-left w-full cursor-pointer ${
                  isActive
                    ? "bg-[#1b2947] text-white shadow-xs border border-slate-700/50"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#131e36]"
                }`}
              >
                <span>{item.label}</span>

                {count !== undefined && (
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      isActive
                        ? "bg-[#243657] text-white border-slate-600"
                        : "bg-[#131e36] text-slate-300 border-slate-700/60"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* =========================================================
          BOTTOM SECTION
      ========================================================= */}
      <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-3">
        {/* Profile */}
        <button
          type="button"
          onClick={onOpenProfile}
          className={`flex items-center gap-3 p-2 rounded-xl transition-all text-left ${
            currentView === "profile"
              ? "bg-[#1b2947]"
              : "hover:bg-slate-800/50"
          }`}
          title="View Profile"
        >
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full bg-emerald-950 border border-emerald-400/50 text-emerald-200 font-bold text-xs flex items-center justify-center shadow-xs font-sans">
              {initials}
            </div>

            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0d1527] absolute bottom-0 right-0" />
          </div>

          {/* User information */}
          <div className="flex flex-col min-w-0">
            <div className="text-xs font-bold text-white truncate font-sans">
              {fullName}
            </div>

            <div className="text-[10px] text-slate-400 font-sans truncate">
              {title}
            </div>

            {/* Persona indicator */}
            <div className="text-[9px] text-emerald-400 font-semibold mt-0.5">
              {activePersona === "L1"
                ? "L1 Lawyer"
                : activePersona === "L2"
                  ? "L2 Lawyer"
                  : "L3 Lawyer"}
            </div>
          </div>
        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-[#131e36] hover:bg-red-950/40 text-slate-300 hover:text-red-400 border border-slate-800 hover:border-red-900/50 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs"
        >
          <LogOut className="w-3.5 h-3.5" />

          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
