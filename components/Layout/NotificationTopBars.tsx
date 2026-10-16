"use client";

import React, { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Axios from "@/lib/ApiConfig";

interface TopBarSettings {
  topBar1Enabled: boolean;
  topBar1Text: string;
  topBar2Enabled: boolean;
  topBar2Text: string;
}

export const NotificationTopBars: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const [settings, setSettings] = useState<TopBarSettings | null>(null);
  const [dismissed1, setDismissed1] = useState(true);
  const [dismissed2, setDismissed2] = useState(true);

  // Helper to construct a unique dismissal key based on bar index and content
  const getStorageKey = useCallback((barNum: 1 | 2, text: string) => {
    return `prenup_topbar_${barNum}_${encodeURIComponent(text.trim().slice(0, 80))}`;
  }, []);

  // Fetch topbar settings from backend
  useEffect(() => {
    let isMounted = true;

    const fetchSettings = async () => {
      try {
        let res;
        try {
          res = await Axios.get("/settings/topbar");
        } catch {
          res = await Axios.get("/admin/settings/topbar");
        }

        if (isMounted && res?.data) {
          const s: TopBarSettings = {
            topBar1Enabled: Boolean(res.data.topBar1Enabled),
            topBar1Text: (res.data.topBar1Text || "").trim(),
            topBar2Enabled: Boolean(res.data.topBar2Enabled),
            topBar2Text: (res.data.topBar2Text || "").trim(),
          };

          setSettings(s);

          // Check dismissal states
          if (s.topBar1Text) {
            try {
              const d1 = localStorage.getItem(getStorageKey(1, s.topBar1Text)) === "true";
              setDismissed1(d1);
            } catch {
              setDismissed1(false);
            }
          } else {
            setDismissed1(true);
          }

          if (s.topBar2Text) {
            try {
              const d2 = localStorage.getItem(getStorageKey(2, s.topBar2Text)) === "true";
              setDismissed2(d2);
            } catch {
              setDismissed2(false);
            }
          } else {
            setDismissed2(true);
          }
        }
      } catch (err) {
        // Silently catch error if backend endpoint is unavailable
        console.debug("Could not load topbar notification settings:", err);
      }
    };

    fetchSettings();

    return () => {
      isMounted = false;
    };
  }, [getStorageKey]);

  // Restrict to user 1 and user 2 portals only (hide for admin, lawyer, case manager)
  const isPrivilegedRole =
    user?.role === "admin" ||
    user?.role === "superadmin" ||
    user?.role === "lawyer" ||
    user?.role === "case_manager";

  if (isPrivilegedRole) {
    return null;
  }

  const showBar1 =
    Boolean(settings?.topBar1Enabled) &&
    Boolean(settings?.topBar1Text) &&
    !dismissed1;

  const showBar2 =
    Boolean(settings?.topBar2Enabled) &&
    Boolean(settings?.topBar2Text) &&
    !dismissed2;

  if (!showBar1 && !showBar2) {
    return null;
  }

  const handleCloseBar1 = () => {
    if (settings?.topBar1Text) {
      try {
        localStorage.setItem(getStorageKey(1, settings.topBar1Text), "true");
      } catch {}
    }
    setDismissed1(true);
  };

  const handleCloseBar2 = () => {
    if (settings?.topBar2Text) {
      try {
        localStorage.setItem(getStorageKey(2, settings.topBar2Text), "true");
      } catch {}
    }
    setDismissed2(true);
  };

  return (
    <div className="w-full flex flex-col z-50">
      {/* TopBar-1 Strip (Theme: Indigo / Brand Violet / Purple Gradient) */}
      {showBar1 && (
        <aside
          role="region"
          aria-label="Announcement notification"
          className="relative w-full bg-gradient-to-r from-[#3730A3] via-[#5B55F6] to-[#7C3AED] text-white border-b border-white/15 px-3 sm:px-6 py-1 sm:py-1.5 shadow-xs transition-all duration-200"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="w-5 shrink-0" aria-hidden="true" /> {/* Spacer to balance close button */}
            <div className="flex-1 min-w-0 text-center">
              <div className="inline-flex items-center justify-center gap-2 max-w-full">
                <span className="w-1.5 h-1.5 rounded-full bg-white/90 shadow-[0_0_6px_rgba(255,255,255,0.9)] shrink-0 hidden sm:inline-block" />
                <p className="text-[11px] sm:text-xs font-medium tracking-wide text-white drop-shadow-xs truncate">
                  {settings?.topBar1Text}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCloseBar1}
              aria-label="Close TopBar-1 announcement"
              title="Close"
              className="w-5 h-5 flex items-center justify-center rounded-full text-white/75 hover:text-white hover:bg-white/20 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <X className="w-3 h-3 stroke-[2.2]" />
            </button>
          </div>
        </aside>
      )}

      {/* TopBar-2 Strip (Theme: Berry Rose / Brand Magenta / Purple Gradient) */}
      {showBar2 && (
        <aside
          role="region"
          aria-label="Special notification"
          className="relative w-full bg-gradient-to-r from-[#9D174D] via-[#E02693] to-[#8B23E3] text-white border-b border-white/15 px-3 sm:px-6 py-1 sm:py-1.5 shadow-xs transition-all duration-200"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="w-5 shrink-0" aria-hidden="true" /> {/* Spacer to balance close button */}
            <div className="flex-1 min-w-0 text-center">
              <div className="inline-flex items-center justify-center gap-2 max-w-full">
                <span className="w-1.5 h-1.5 rounded-full bg-white/90 shadow-[0_0_6px_rgba(255,255,255,0.9)] shrink-0 hidden sm:inline-block" />
                <p className="text-[11px] sm:text-xs font-medium tracking-wide text-white drop-shadow-xs truncate">
                  {settings?.topBar2Text}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCloseBar2}
              aria-label="Close TopBar-2 notification"
              title="Close"
              className="w-5 h-5 flex items-center justify-center rounded-full text-white/75 hover:text-white hover:bg-white/20 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <X className="w-3 h-3 stroke-[2.2]" />
            </button>
          </div>
        </aside>
      )}
    </div>
  );
};

export default NotificationTopBars;

