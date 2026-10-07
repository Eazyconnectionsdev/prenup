"use client";

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { LogOut } from "lucide-react";
import { RootState, AppDispatch } from "@/store/store";
import Axios from "@/lib/ApiConfig";
import { logOutUser } from "@/store/asyncThunk/authThunk";
import { CaseManagerAccountModal } from "@/components/caseManager/modals/CaseManagerAccountModal";

const MENU_ITEMS = [
  { path: "/cm/dashboard", label: "Dashboard" },
  { path: "/cm/cases", label: "Cases", countKey: "cases" as const },
  { path: "/cm/archived", label: "Archived", countKey: "archived" as const },
  { path: "/cm/reports", label: "Reports" },
];

export const CaseManagerSidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [counts, setCounts] = useState({ cases: 0, archived: 0 });

  const fullName =
    [user?.firstName, user?.middleName, user?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() || "Unknown User";

  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  const roleLabel = user?.role ? user.role.replace(/_/g, " ") : "";

  useEffect(() => {
    let cancelled = false;
    const loadCounts = async () => {
      try {
        const response = await Axios.get("/case-manager/cases");
        if (cancelled) return;
        const list: any[] = Array.isArray(response.data) ? response.data : [];
        const archived = list.filter((c) => c.workflowStatus === "ARCHIVED").length;
        setCounts({ cases: list.length - archived, archived });
      } catch (err) {
        console.log("Failed to load sidebar counts", err);
      }
    };
    loadCounts();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = () => {
    dispatch(logOutUser());
    router.push("/login");
  };

  return (
    <aside className="w-[240px] bg-[#0d1527] border-r border-[#1e293b] fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between p-5 text-slate-200">
      <div>
        {/* Logo & Header */}
        <div className="flex items-center gap-3 mb-8 pt-2">
          <div className="w-9 h-9 rounded-full border border-rose-400 bg-[#0a101f] text-rose-300 font-serif font-bold text-sm flex items-center justify-center shadow-xs">
            LP
          </div>
          <div className="flex flex-col">
            <h1 className="font-serif text-lg font-bold text-white tracking-wide leading-none">
              LetsPrenup
            </h1>
            <span className="text-[9px] uppercase tracking-wider text-rose-300 font-bold mt-1">
              CASE MANAGER PORTAL V1.0
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          {MENU_ITEMS.map((item) => {
            const count = item.countKey ? counts[item.countKey] : undefined;
            const isActive =
              pathname === item.path || pathname.startsWith(`${item.path}/`);
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all text-left w-full cursor-pointer ${
                  isActive
                    ? 'bg-[#1b2947] text-white shadow-xs border border-slate-700/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#131e36]'
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
          onClick={() => setIsAccountModalOpen(true)}
          className="flex items-center gap-3 p-2 rounded-xl transition-all hover:bg-slate-800/50 text-left cursor-pointer"
          title="View Account Details"
        >
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full bg-rose-950 border border-rose-400/50 text-rose-200 font-bold text-xs flex items-center justify-center shadow-xs font-sans">
              {initials}
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0d1527] absolute bottom-0 right-0" />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="text-xs font-bold text-white truncate font-sans">
              {fullName}
            </div>
            <div className="text-[10px] text-slate-400 font-sans truncate capitalize">
              {roleLabel.toLowerCase()}
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
      <CaseManagerAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onShowToast={() => {}}
      />
    </aside>
  );
};
