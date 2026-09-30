"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { LogOut, Search, BarChart3 } from "lucide-react";

import { RootState, AppDispatch } from "@/store/store";
import { logOutUser } from "@/store/asyncThunk/authThunk";

import {
  NavView,
  LawyerPersona,
} from "../../types/lawyer-portal";

interface LawyerTopBarProps {
  currentView: NavView;
  searchQuery: string;
  onSearchChange: React.Dispatch<React.SetStateAction<string>>;
  onOpenScorecard: () => void;
  activePersona: LawyerPersona;
  onPersonaChange: (persona: LawyerPersona) => void;
  onOpenProfile: () => void;
  onLogout: () => void;
}

const VIEW_TITLES: Partial<Record<NavView, string>> = {
  dashboard: "Lawyer Dashboard",
  assigned_cases: "Assigned Matters",
  completed: "Completed Cases",
  profile: "Lawyer Profile",
  settings: "Portal Settings",
  versions: "Agreement Versions",
  notes: "Summary Notes",
  appendices: "Appendices",
  ila: "ILA Certificates",
};

export const LawyerTopBar: React.FC<LawyerTopBarProps> = ({
  currentView,
  searchQuery,
  onSearchChange,
  onOpenScorecard,
  activePersona,
  onPersonaChange,
  onOpenProfile,
  onLogout,
}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

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

  const pageTitle = VIEW_TITLES[currentView] ?? "Lawyer Portal";

  const handleLogout = () => {
    dispatch(logOutUser());
    onLogout();
    router.push("/login");
  };

  const handleProfileClick = () => {
    onOpenProfile();
  };

  return (
    <header className="h-[76px] bg-[#0d1527] border-b border-[#1e293b] flex items-center justify-between px-8 pt-4 pb-2">
      {/* Left side */}
      <div className="flex items-center gap-6 min-w-0">
        <div className="flex flex-col shrink-0">
          <h1 className="text-xl font-bold font-sans text-white tracking-tight leading-tight">
            {pageTitle}
          </h1>

          <span className="text-[10px] text-slate-400 font-mono mt-0.5">
            LAWYER_PORTAL
          </span>
        </div>

        {/* Search */}
        {(currentView === "assigned_cases" ||
          currentView === "completed") && (
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search cases..."
              className="w-[260px] h-9 pl-9 pr-3 rounded-lg bg-[#172238] border border-[#334155] text-xs text-white placeholder:text-slate-500 outline-none focus:border-slate-500 transition-all"
            />
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Scorecard */}
        <button
          type="button"
          onClick={onOpenScorecard}
          className="hidden md:flex items-center gap-2 h-9 px-3 rounded-lg border border-[#334155] bg-[#172238] text-slate-300 hover:text-white hover:border-slate-500 hover:bg-[#1e293b] transition-all"
          title="Open Scorecard"
        >
          <BarChart3 className="w-3.5 h-3.5" />

          <span className="text-[10px] font-bold uppercase tracking-wide">
            Scorecard
          </span>
        </button>

        {/* Persona selector */}
        <div className="hidden lg:flex items-center gap-1 bg-[#172238] border border-[#334155] rounded-lg p-1">
          {(["L1", "L2", "L3"] as LawyerPersona[]).map((persona) => (
            <button
              key={persona}
              type="button"
              onClick={() => onPersonaChange(persona)}
              className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                activePersona === persona
                  ? "bg-white text-[#0d1527]"
                  : "text-slate-400 hover:text-white hover:bg-[#243047]"
              }`}
            >
              {persona}
            </button>
          ))}
        </div>

        {/* Lawyer profile */}
        <button
          type="button"
          onClick={handleProfileClick}
          className="flex items-center gap-3 bg-white border border-slate-200 rounded-full px-3 py-1.5 shadow-sm cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-all"
        >
          <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-[11px] font-sans flex items-center justify-center shrink-0">
            {initials}
          </div>

          <div className="flex flex-col text-left pr-1 min-w-[100px]">
            <span className="text-xs font-bold font-sans text-slate-900 leading-tight truncate max-w-[110px]">
              {fullName}
            </span>

            <span className="text-[10px] font-sans text-slate-500 leading-tight truncate max-w-[110px]">
              {title}
            </span>
          </div>
        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-600 text-slate-400 hover:text-red-400 hover:border-red-400/40 hover:bg-red-500/10 transition-all"
          title="Log Out"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};