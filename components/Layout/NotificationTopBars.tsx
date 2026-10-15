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
      {/* TopBar-1 Strip */}
      {showBar1 && (
        <div className="relative w-full bg-[#0F172A] text-white border-b border-slate-800/80 px-4 py-2 transition-all duration-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="w-6 shrink-0" /> {/* Spacer to balance close button */}
            <div className="flex-1 text-center">
              <p className="text-xs md:text-sm font-medium tracking-wide text-[#FAF8F5] leading-snug">
                {settings?.topBar1Text}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCloseBar1}
              aria-label="Close TopBar-1 notification"
              title="Close"
              className="w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* TopBar-2 Strip */}
      {showBar2 && (
        <div className="relative w-full bg-[#8B3A3A] text-white border-b border-[#702E2E] px-4 py-2 transition-all duration-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="w-6 shrink-0" /> {/* Spacer to balance close button */}
            <div className="flex-1 text-center">
              <p className="text-xs md:text-sm font-medium tracking-wide text-white leading-snug">
                {settings?.topBar2Text}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCloseBar2}
              aria-label="Close TopBar-2 notification"
              title="Close"
              className="w-6 h-6 flex items-center justify-center rounded-md text-white/70 hover:text-white hover:bg-white/15 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationTopBars;

