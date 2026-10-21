"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Briefcase,
  MapPin,
  Clock,
  Shield,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Axios from "@/lib/ApiConfig";
import type { AccountModalProps } from "@/types/case-manager/case-manager-account-modal";

export const CaseManagerAccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [activeCasesCount, setActiveCasesCount] = useState<number>(0);

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
    if (!isOpen) return;
    let cancelled = false;
    const fetchActiveCount = async () => {
      try {
        const res = await Axios.get("/case-manager/cases");
        if (cancelled) return;
        const list = Array.isArray(res.data) ? res.data : [];
        const active = list.filter(
          (c: any) => c.workflowStatus !== "ARCHIVED" && c.workflowStatus !== "COMPLETED"
        ).length;
        setActiveCasesCount(active);
      } catch (e) {
        console.error("Failed to load active cases count", e);
      }
    };
    fetchActiveCount();
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-6">
      <div className="w-full max-w-[520px] bg-white border border-slate-300 rounded-2xl p-7 flex flex-col gap-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-bold text-base font-sans flex items-center justify-center shadow-xs">
              {initials}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-sans text-slate-900 tracking-tight">
                  {fullName}
                </h3>
                <span className="badge-rose-pill uppercase text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                  Case Manager
                </span>
              </div>
              <p className="text-xs font-sans text-slate-500">
                {user?.email || "case.manager@letsprenup.com"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Staff Profile Attributes - Dynamic from DB */}
        <div className="grid grid-cols-2 gap-3 font-sans text-xs">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-slate-500" /> Title / Role
            </span>
            <span className="font-bold text-slate-900">
              Case Manager
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-500" /> Primary Jurisdiction
            </span>
            <span className="font-bold text-slate-900">
              England, Wales, Scotland
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Shield className="w-3 h-3 text-slate-500" /> Access Level
            </span>
            <span className="font-bold text-emerald-700">
              Full Case Manager
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" /> Active Matters
            </span>
            <span className="font-bold text-slate-900">
              {activeCasesCount} Active Cases
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end pt-2 border-t border-slate-200">
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold font-sans text-xs py-2 px-5 rounded-lg shadow-xs transition-all cursor-pointer"
          >
            Close Account Profile
          </button>
        </div>
      </div>
    </div>
  );
};