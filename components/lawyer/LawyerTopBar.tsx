"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { LogOut } from "lucide-react";
import { logOutUser } from "@/store/asyncThunk/authThunk";

const PATH_TITLES: Record<string, string> = {
  "/lawyer": "Lawyer Dashboard",
  "/lawyer/assigned-cases": "Assigned Matters",
  "/lawyer/completed": "Completed Cases",
  "/lawyer/settings": "Portal Settings",
  "/lawyer/lawyer-profile": "Lawyer Profile",
};

export const LawyerTopBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.auth.user);

  const fullName =
    [user?.firstName, user?.middleName, user?.lastName]
      ?.filter(Boolean)
      .join(" ")
      .trim() || "Unknown Lawyer";

  const initials = fullName
      .split(" ")
      ?.filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  const title = user?.role
    ? user.role.replace(/_/g, " ").replace(/\b\w/g, (c: any) => c.toUpperCase())
    : "";

  const handleLogout = () => {
    dispatch(logOutUser());
    router.push("/login");
  };

  const pageTitle = PATH_TITLES[pathname] ?? "Lawyer Portal";

  return (
    <header className="h-[76px] bg-[#0d1527] border-r border-[#1e293b] flex items-center justify-between px-8 pt-4 pb-2 border-b border-slate-200">
      <div className="flex flex-col">
        <h1 className="text-xl font-bold font-sans text-white tracking-tight leading-tight">
          {pageTitle}
        </h1>
        <span className="text-[10px] text-white font-mono">
          LAWYER_PORTAL
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/lawyer/lawyer-profile")}
          className="flex items-center gap-3 bg-white border border-slate-200 rounded-full px-3 py-1.5 shadow-xs cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-all"
        >
          <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-[11px] font-sans flex items-center justify-center">
            {initials}
          </div>
          <div className="flex flex-col text-left pr-1 min-w-[100px]">
            <span className="text-xs font-bold font-sans text-slate-900 leading-tight truncate max-w-[110px]">
              {fullName}
            </span>
            <span className="text-[10px] font-sans text-slate-900 leading-tight truncate">
              {title}
            </span>
          </div>
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
          title="Log Out"
        >
          <LogOut className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
    </header>
  );
};
