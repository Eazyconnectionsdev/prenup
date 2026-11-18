"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  Settings,
  LogOut,
  Copy,
  Check,
  Crown,
  UserCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { logOutUser } from "@/store/asyncThunk/authThunk";
import { agreementTypeServiceLabel } from "@/lib/agreementTypes";
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

  // Dynamic service & partner details
  const serviceName = agreementTypeServiceLabel(cases?.agreementType);
  const isUser2 =
    user?.endUserType === "user2" ||
    (Boolean(cases?.owner?._id) &&
      String(user?._id) === String((cases as any)?.invitedUser?._id));

  const hasP2Joined = Boolean((cases as any)?.invitedUser?._id);
  const isPartnerInvited =
    Boolean(cases?.partnerInvited) || Boolean(cases?.invitedEmail);
  const isPartnerComplete = isUser2 || hasP2Joined || isPartnerInvited;

  const ownerName =
    [cases?.owner?.firstName, cases?.owner?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    cases?.owner?.email ||
    "Your partner";

  const inviteName = [
    cases?.partnerInviteDetails?.firstName,
    cases?.partnerInviteDetails?.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  const invitedUserName = [
    cases?.invitedUser?.firstName,
    cases?.invitedUser?.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  const partnerName = isUser2
    ? ownerName
    : invitedUserName || inviteName || cases?.invitedEmail || "Your partner";

  const isBothCompleted = Boolean(cases?.agreementType) && isPartnerComplete;

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
      <div className="flex flex-wrap items-center gap-2.5 min-w-0">
        {displayCaseNumber && (
          <button
            type="button"
            onClick={copyCaseId}
            title="Click to copy Case ID"
            className="group flex h-[34px] items-center gap-2 rounded-xl border border-[#E2E4F0] bg-[#F8F9FD] px-3 text-[12px] shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all duration-200 hover:border-[#C7C3FF] hover:bg-white"
          >
            <span className="font-semibold text-[#475569]">Case ID</span>
            <span className="font-mono font-bold text-[#1E1B3C] tracking-tight">{displayCaseNumber}</span>
            {copied ? (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Copied</span>
              </span>
            ) : (
              <Copy className="h-3.5 w-3.5 text-[#9CA3AF] transition-colors group-hover:text-[#5B55F6]" />
            )}
          </button>
        )}

        {isBothCompleted && (
          <>
            {/* Selected Agreement Pill */}
            <div className="flex h-[34px] items-center gap-2 rounded-xl border border-[#E2E4F0] bg-[#F8F9FD] px-3 text-[12px] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#FEF3C7] text-[#D97706]">
                <Crown className="h-3 w-3 fill-current" />
              </span>
              <span className="font-semibold text-[#475569]">Agreement</span>
              <span className="font-bold text-[#1E1B3C]">{serviceName}</span>
            </div>

            {/* Partner Pill */}
            <div className="flex h-[34px] items-center gap-2 rounded-xl border border-[#E2E4F0] bg-[#F8F9FD] px-3 text-[12px] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#EEEDFB] text-[#5B55F6]">
                <UserCheck className="h-3 w-3" />
              </span>
              <span className="font-semibold text-[#475569]">Partner</span>
              <span className="font-bold text-[#1E1B3C] max-w-[140px] truncate" title={partnerName}>
                {partnerName}
              </span>
              <span
                className={`ml-0.5 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                  isUser2 || hasP2Joined
                    ? "bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]"
                    : "bg-[#DBEAFE] text-[#1D4ED8] border-[#93C5FD]"
                }`}
              >
                {isUser2 || hasP2Joined ? "Joined" : "Invited"}
              </span>
            </div>
          </>
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