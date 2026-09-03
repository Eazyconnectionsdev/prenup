"use client";

import { useEffect, useRef, useState } from "react";
import { BellIcon, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { logOutUser } from "@/store/asyncThunk/authThunk";

interface TopBarProps {
  caseId?: string;
}

const TopBar = ({ caseId }: TopBarProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogOut = async () => {
    const result = await dispatch(logOutUser());

    if (logOutUser.fulfilled.match(result)) {
      window.location.assign("/login");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-end gap-4 border-b border-[#E7E7F2] bg-white px-8 py-[18px]">
      <span className="text-sm font-semibold text-[#1E1B3C]">
        Case ID:{" "}
        <span className="font-mono font-normal text-[#5B5B75]">
          {caseId || user?.inviteCaseId}
        </span>
      </span>
      <button
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#E7E7F2] text-[#5B5B75] hover:bg-[#F4F4FA]"
      >
        <BellIcon />
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#EF4444] text-[9px] font-semibold text-white">
          1
        </span>
      </button>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Account menu"
          aria-expanded={isMenuOpen}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EDE9FE] text-xs font-semibold text-[#5B21B6] transition hover:ring-2 hover:ring-[#DDD6FE]"
        >
          {user.firstName?.charAt(0).toUpperCase()}
          {user.lastName?.charAt(0).toUpperCase()}
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-52 overflow-hidden rounded-[10px] border border-[#E7E7F2] bg-white py-1.5 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.12)]">
            <div className="border-b border-[#F1F1F6] px-4 py-3">
              <div className="text-sm font-semibold text-[#1E1B3C]">
                {user.firstName} {user.lastName}
              </div>
              <div className="truncate text-xs text-[#8A8AA0]">
                {user.email}
              </div>
            </div>

            <button
              onClick={() => {
                setIsMenuOpen(false);
                router.push("/dashboard/profile-settings");
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-[#3D3D52] hover:bg-[#F4F4FA]"
            >
              <Settings className="h-4 w-4 text-[#5B5B75]" />
              Profile settings
            </button>

            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleLogOut();
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-red-500 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
