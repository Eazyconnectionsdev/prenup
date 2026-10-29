"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import BrandLogo from "@/components/brand/BrandLogo";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  Home,
  Briefcase,
  Archive,
  BarChart3,
  LogOut,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { RootState, AppDispatch } from "@/store/store";
import Axios from "@/lib/ApiConfig";
import { logOutUser } from "@/store/asyncThunk/authThunk";
import { CaseManagerAccountModal } from "@/components/caseManager/modals/CaseManagerAccountModal";

interface MenuItem {
  path: string;
  label: string;
  icon: LucideIcon;
  countKey?: "cases" | "archived";
}

const MENU_ITEMS: MenuItem[] = [
  { path: "/cm/dashboard", label: "Dashboard", icon: Home },
  { path: "/cm/cases", label: "Cases", icon: Briefcase, countKey: "cases" },
  { path: "/cm/archived", label: "Archived", icon: Archive, countKey: "archived" },
  { path: "/cm/reports", label: "Reports", icon: BarChart3 },
];

// The violet rail bar that marks the active item (same as user1/user2)
function ActiveRail() {
  return (
    <span className="absolute -left-3 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r-full bg-[#8B87FF] shadow-[0_0_10px_rgba(139,135,255,0.75)]" />
  );
}

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
      .trim() || "Case Manager";

  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "CM";

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
    <>
      <aside className="fixed top-0 bottom-0 left-0 z-50 flex h-screen w-[280px] flex-shrink-0 flex-col bg-gradient-to-b from-[#1B1E52] via-[#15183F] to-[#101233] font-sans text-white shadow-[8px_0_30px_rgba(10,10,40,0.35)] justify-between">
        {/* Top Brand Logo */}
        <div>
          <div className="flex items-center px-5 pb-5 pt-6">
            <Link href="/cm/dashboard" aria-label="Lets Prenup Case Manager">
              <BrandLogo surface="dark" height={30} priority />
            </Link>
          </div>

          {/* Section Heading */}
          <div className="px-5 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6E71A3]">
            Case Management
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-1.5 px-3">
            {MENU_ITEMS.map((item) => {
              const count = item.countKey ? counts[item.countKey] : undefined;
              const isActive =
                pathname === item.path ||
                (item.path !== "/cm/dashboard" && pathname.startsWith(`${item.path}/`)) ||
                (item.path === "/cm/dashboard" && pathname === "/cm");

              const Icon = item.icon;

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => router.push(item.path)}
                  className={`group relative flex w-full items-center justify-between rounded-xl px-3.5 py-3 transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#2B2E6F] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                      : "hover:bg-white/[0.05]"
                  }`}
                >
                  {isActive && <ActiveRail />}

                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-[18px] w-[18px] transition-colors ${
                        isActive
                          ? "text-white"
                          : "text-[#A9ACD6] group-hover:text-white"
                      }`}
                      strokeWidth={1.8}
                    />
                    <span
                      className={`text-[13px] font-medium tracking-wide transition-colors ${
                        isActive
                          ? "text-white font-semibold"
                          : "text-[#D6D8F2] group-hover:text-white"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>

                  {count !== undefined && (
                    <span
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full transition-all ${
                        isActive
                          ? "bg-[#8B87FF] text-white shadow-xs"
                          : "bg-white/[0.08] text-[#A9ACD6] group-hover:text-white group-hover:bg-white/[0.12]"
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

        {/* Bottom User Card (Matching User1/User2 sidebar profile aesthetics) */}
        <div className="p-4 border-t border-white/[0.08]">
          <div
            onClick={() => setIsAccountModalOpen(true)}
            className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8B87FF] to-[#5B55F6] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate leading-tight">
                  {fullName}
                </p>
                <span className="text-[10px] text-[#A9ACD6] block truncate uppercase tracking-wider font-semibold">
                  Case Manager
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
              className="p-1.5 rounded-lg text-[#A9ACD6] hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Account Profile Modal */}
      <CaseManagerAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onShowToast={() => {}}
      />
    </>
  );
};

export default CaseManagerSidebar;