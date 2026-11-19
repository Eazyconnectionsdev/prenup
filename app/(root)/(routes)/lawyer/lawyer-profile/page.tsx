"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Shield, Building, Award, CheckCircle, LogOut, Briefcase } from "lucide-react";
import Axios from "@/lib/ApiConfig";
import type { AppDispatch } from "@/store/store";
import { logOutUser } from "@/store/asyncThunk/authThunk";
import { fetchAssignments } from "@/lib/lawyerStages";
import { formatDate } from "@/lib/caseStages";

// The signed-in lawyer's own profile, from GET /lawyer/me/profile. Details are
// maintained by the admin team (Admin → Lawyers); this page is read-only.

const full = (o: any) =>
  o ? [o.firstName, o.middleName, o.lastName].filter(Boolean).join(" ").trim() || o.name || "" : "";

function Row({ label, value, mono }: { label: string; value?: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-400 shrink-0">{label}:</span>
      <span className={`text-right text-slate-800 ${mono ? "font-mono font-bold" : "font-semibold"}`}>
        {value || "—"}
      </span>
    </div>
  );
}

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [profile, setProfile] = useState<{ lawyer: any; user: any } | null>(null);
  const [counts, setCounts] = useState<{ active: number; archived: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [{ data }, active, archived] = await Promise.all([
          Axios.get("/lawyer/me/profile"),
          fetchAssignments("active"),
          fetchAssignments("archived"),
        ]);
        setProfile(data);
        setCounts({
          active: active.filter((a) => a.stage !== "COMPLETED").length,
          archived: archived.length,
        });
      } catch (err: any) {
        console.error("Failed to load profile", err);
        setError(
          err?.response?.status === 404
            ? "No lawyer profile is linked to this account. Please contact the admin team."
            : "Couldn't load your profile right now."
        );
      }
    })();
  }, []);

  const logout = () => {
    dispatch(logOutUser());
    router.push("/login");
  };

  if (error) return <div className="p-8 text-sm text-red-600">{error}</div>;
  if (!profile) return <div className="p-8 text-sm text-slate-500">Loading profile...</div>;

  const { lawyer, user } = profile;
  const name = full(lawyer) || full(user) || "Lawyer";
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .map((p: string) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "L";
  const email = lawyer.workEmail || lawyer.directEmail || user?.email;
  const phone = lawyer.workPhone || lawyer.directPhone || lawyer.mobilePhone || user?.phone;
  const company = lawyer.company && typeof lawyer.company === "object" ? lawyer.company : null;

  return (
    <div className="flex flex-col gap-6 max-w-[960px] p-8">
      <div className="bg-white border border-slate-300 rounded-xl p-8 shadow-xs flex items-center justify-between gap-6">
        <div className="flex gap-6 items-center">
          <div className="w-20 h-20 rounded-full bg-[#0d1527] text-white border-2 border-emerald-400 font-bold text-2xl flex items-center justify-center">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900">{name}</h2>
              {lawyer.verified && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              )}
            </div>
            <p className="text-slate-500 text-sm mt-1">{lawyer.jobTitle || "Lawyer"}</p>
            <p className="text-slate-400 text-xs mt-0.5">
              {[company?.name, lawyer.officeBranch].filter(Boolean).join(" · ") || "—"}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-300 hover:border-red-200 text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-xs flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Professional Details</span>
          </h3>
          <div className="flex flex-col gap-2.5 text-xs text-slate-700">
            <Row label="Regulatory Body" value={lawyer.regulatoryBody} />
            <Row label="Registration No." value={lawyer.registrationNumber || lawyer.barNumber} mono />
            <Row label="Practising Status" value={lawyer.practisingStatus} />
            <Row label="Jurisdiction" value={lawyer.jurisdiction} />
            <Row label="Qualifications" value={lawyer.qualifications} />
          </div>
        </div>

        <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-xs flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-600" />
            <span>Contact</span>
          </h3>
          <div className="flex flex-col gap-2.5 text-xs text-slate-700">
            <Row label="Work Email" value={email} />
            <Row label="Telephone" value={phone} mono />
            <Row label="Firm" value={company?.name} />
            <Row label="Firm Website" value={company?.website || lawyer.website} />
          </div>
        </div>

        <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-xs flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-emerald-600" />
            <span>Caseload</span>
          </h3>
          <div className="flex flex-col gap-2.5 text-xs text-slate-700">
            <Row label="Pending Assignments" value={counts ? String(counts.active) : "…"} />
            <Row label="Archived / Recently Completed" value={counts ? String(counts.archived) : "…"} />
          </div>
        </div>

        <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-xs flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Account</span>
          </h3>
          <div className="flex flex-col gap-2.5 text-xs text-slate-700">
            <Row label="Sign-in Email" value={user?.email} />
            <Row label="Account Created" value={formatDate(user?.createdAt)} />
            <Row label="Last Sign-in" value={formatDate(user?.lastLoginAt)} />
          </div>
          <p className="text-[11px] text-slate-400">
            To change these details, contact the admin team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
