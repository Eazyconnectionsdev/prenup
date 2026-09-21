"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import Axios from "@/lib/ApiConfig";
import { LogOut } from "lucide-react";
import { logOutUser } from "@/store/asyncThunk/authThunk";

const MENU_ITEMS = [
  { path: "/lawyer", label: "Dashboard" },
  { path: "/lawyer/assigned-cases", label: "Assigned Cases", countKey: "assigned" as const },
  { path: "/lawyer/completed-case", label: "Completed Cases", countKey: "completed" as const },
  { path: "/lawyer/settings", label: "Settings" },
];

const isCompleted = (status: string) => status === "CLOSED" || status === "ARCHIVED";

export const LawyerSidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.auth.user);

  const [assignedCount, setAssignedCount] = useState(0);
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

  const counts: Record<string, number> = {
    assigned: assignedCount,
    completed: completedCount,
  };

  return (
    <aside className="w-[220px] bg-[#0d1527] border-r border-[#1e293b] fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between p-5 text-slate-200">
      <div>
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

        <nav className="flex flex-col gap-1.5">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.path;
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

      <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-3">
        <button
          onClick={() => router.push("/lawyer/lawyer-profile")}
          className="flex items-center gap-3 p-2 rounded-xl transition-all hover:bg-slate-800/50 text-left"
          title="View Profile Details"
        >
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full bg-emerald-950 border border-emerald-400/50 text-emerald-200 font-bold text-xs flex items-center justify-center shadow-xs font-sans">
              {initials}
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0d1527] absolute bottom-0 right-0" />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="text-xs font-bold text-white truncate font-sans">
              {fullName}
            </div>
            <div className="text-[10px] text-slate-400 font-sans truncate">
              {title}
            </div>
          </div>
        </button>

        <button
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