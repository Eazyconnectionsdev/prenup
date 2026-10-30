"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  Settings,
  LogOut,
  Copy,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { logOutUser } from "@/store/asyncThunk/authThunk";
import NotificationTopBars from "./NotificationTopBars";

type TopBarProps = {
  caseId?: string;
  notificationCount?: number;
  onSearchOpen?: () => void;
  onNotifications?: () => void;
};

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[#3D3D52] transition-colors duration-200 hover:bg-[#EEEDFB] hover:text-[#5B55F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C7C3FF]"
    >
      {children}
    </button>
  );
}

const TopBar = ({
  caseId,
  notificationCount = 0,
  onSearchOpen,
  onNotifications,
}: TopBarProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const cases = useSelector((state: RootState) => state.cases);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // The Case ID is the human-readable case number, never a database id: an
  // account has no Case ID until its legal matter is started.
  const displayCaseNumber = cases?.caseNumber || user?.caseNumber;
  const initials =
    `${user?.firstName?.charAt(0) ?? ""}${user?.lastName?.charAt(0) ?? ""}`.toUpperCase() || "U";
  const badge = notificationCount > 99 ? "99+" : String(notificationCount);

  const handleLogOut = async () => {
    const result = await dispatch(logOutUser());
    if (logOutUser.fulfilled.match(result)) {
      window.location.assign("/login");
    }
  };

  const copyCaseId = async () => {
    if (!displayCaseNumber) return;
    try {
      await navigator.clipboard.writeText(String(displayCaseNumber));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onSearchOpen?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onSearchOpen]);

  return (
    <div className="sticky top-0 z-40 w-full">
      <NotificationTopBars />
      <header className="flex h-[56px] items-center justify-between gap-4 border-b border-[#EEEEF6] bg-white px-6 backdrop-blur-md">
      <div className="min-w-0">
        {displayCaseNumber && (
          <button
            type="button"
            onClick={copyCaseId}
            title="Copy case ID"
            className="group flex items-center gap-2 rounded-lg border border-[#EEEEF6] bg-white px-2.5 py-1.5 text-[12px] transition-colors duration-200 hover:border-[#DDD9FF]"
          >
            <span className="font-medium text-[#8A8AA0]">Case ID</span>
            <span className="font-mono font-semibold text-[#1E1B3C]">{displayCaseNumber}</span>
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-[#B0B0C3] transition-colors group-hover:text-[#5B55F6]" />
            )}
          </button>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <IconButton label="Notifications" onClick={onNotifications}>
          <Bell className="h-[19px] w-[19px]" strokeWidth={1.8} />
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 left-[19px] flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#F0287A] px-1 text-[10px] font-semibold leading-none text-white ring-2 ring-[#FAFAFD]">
              {badge}
            </span>
          )}
        </IconButton>

        <div className="relative ml-3" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Account menu"
            aria-expanded={isMenuOpen}
            className="group flex items-center gap-1.5 rounded-lg p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C7C3FF]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#F472B6] to-[#D946EF] text-[11px] font-semibold text-white shadow-[0_4px_10px_-3px_rgba(217,70,239,0.6)] transition-transform duration-200 group-hover:scale-105">
              {initials}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-[#3D3D52] transition-transform duration-200 ${
                isMenuOpen ? "rotate-180" : ""
              }`}
              strokeWidth={2.2}
            />
          </button>

          {/* Dropdown — always mounted so it can animate in/out */}
          <div
            className={`absolute right-0 top-[calc(100%+10px)] z-50 w-60 origin-top-right overflow-hidden rounded-xl border border-[#EEEEF6] bg-white p-1.5 shadow-[0_16px_40px_-8px_rgba(30,27,60,0.18)] transition-all duration-200 ${
              isMenuOpen
                ? "visible translate-y-0 scale-100 opacity-100"
                : "invisible -translate-y-1 scale-95 opacity-0"
            }`}
          >
            <div className="flex items-center gap-3 rounded-lg px-2.5 py-2.5">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#F472B6] to-[#D946EF] text-xs font-semibold text-white">
                {initials}
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-[#1E1B3C]">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="truncate text-xs text-[#8A8AA0]">{user?.email}</div>
              </div>
            </div>

            <div className="my-1 h-px bg-[#F1F1F6]" />

            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                router.push("/dashboard/profile-settings");
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium text-[#3D3D52] transition-colors hover:bg-[#F4F4FA]"
            >
              <Settings className="h-4 w-4 text-[#5B5B75]" />
              Profile settings
            </button>

            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                handleLogOut();
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium text-red-500 transition-colors hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      </div>
    </header>
    </div>
  );
};

export default TopBar;