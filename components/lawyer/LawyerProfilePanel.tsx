"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Award,
  Briefcase,
  Building2,
  Camera,
  Clock,
  KeyRound,
  Loader2,
  Mail,
  Pencil,
  Phone,
  Shield,
  Trash2,
  X,
} from "lucide-react";
import Axios from "@/lib/ApiConfig";
import { getErrorMessage } from "@/lib/getErrorMessage";
import type { AppDispatch, RootState } from "@/store/store";
import { setUserProfileData } from "@/store/slices/authSlice";
import { fetchAssignments } from "@/lib/lawyerStages";
import {
  JURISDICTIONS,
  PRACTISING_STATUSES,
  REGULATORY_BODIES,
} from "@/components/admin/views/LawyerForm";

/**
 * The signed-in lawyer's own profile, styled like the case manager's account
 * window: a header and summary tiles, and an Edit mode for the whole profile.
 * The firm, availability, account status and verification are managed by the
 * admin team and shown read-only.
 *
 * API: GET/PATCH /lawyer/me/profile, POST /lawyer/me/password,
 *      GET/POST/DELETE /lawyer/me/photo.
 */

type Form = {
  firstName: string;
  middleName: string;
  lastName: string;
  jobTitle: string;
  officeBranch: string;
  regulatoryBody: string;
  registrationNumber: string;
  practisingStatus: string;
  jurisdiction: string;
  qualifications: string;
  priceText: string;
  workEmail: string;
  workPhone: string;
  mobilePhone: string;
};

const toForm = (lawyer: any, user: any): Form => ({
  firstName: lawyer?.firstName ?? user?.firstName ?? "",
  middleName: lawyer?.middleName ?? user?.middleName ?? "",
  lastName: lawyer?.lastName ?? user?.lastName ?? "",
  jobTitle: lawyer?.jobTitle ?? "",
  officeBranch: lawyer?.officeBranch ?? "",
  regulatoryBody: lawyer?.regulatoryBody ?? "",
  registrationNumber: lawyer?.registrationNumber ?? lawyer?.barNumber ?? "",
  practisingStatus: lawyer?.practisingStatus ?? "",
  jurisdiction: lawyer?.jurisdiction ?? "",
  qualifications: lawyer?.qualifications ?? "",
  priceText: lawyer?.priceText ?? "",
  workEmail: lawyer?.workEmail ?? lawyer?.directEmail ?? user?.email ?? "",
  workPhone: lawyer?.workPhone ?? lawyer?.directPhone ?? "",
  mobilePhone: lawyer?.mobilePhone ?? "",
});

const AVAILABILITY: Record<string, string> = {
  available: "Accepting new clients",
  unavailable: "Not accepting new clients",
  archived: "Archived",
};

const inputCls =
  "w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300";

function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-bold text-slate-600">
        {label}
        {required && <span className="text-rose-600"> *</span>}
      </span>
      {children}
      {hint && <span className="text-[10px] text-slate-400">{hint}</span>}
    </label>
  );
}

function Tile({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: React.ReactNode; tone?: string }) {
  return (
    <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col gap-1">
      <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
        {icon} {label}
      </span>
      <span className={`font-bold text-xs ${tone ?? "text-slate-900"}`}>{value || "—"}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1.5">{title}</h4>
      {children}
    </div>
  );
}

function SelectWithCurrent({
  value,
  options,
  onChange,
  placeholder,
}: {
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
  placeholder: string;
}) {
  // Keep a value an admin typed that is not in the list.
  const all = value && !options.includes(value) ? [value, ...options] : options;
  return (
    <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {all.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

export function LawyerProfilePanel({ onClose }: { onClose?: () => void }) {
  const dispatch = useDispatch<AppDispatch>();
  const me = useSelector((state: RootState) => state.auth.user);

  const [data, setData] = useState<{ lawyer: any; user: any } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeCount, setActiveCount] = useState<number | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Form | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [savingPw, setSavingPw] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);

  const loadPhoto = useCallback(async (has: boolean) => {
    setPhotoUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return null;
    });
    if (!has) return;
    try {
      const res = await Axios.get("/lawyer/me/photo", { responseType: "blob" });
      setPhotoUrl(URL.createObjectURL(res.data));
    } catch {
      // No photo to show is fine.
    }
  }, []);

  const load = useCallback(async () => {
    try {
      const { data } = await Axios.get("/lawyer/me/profile");
      setData(data);
      setForm(toForm(data.lawyer, data.user));
      setError(null);
      loadPhoto(Boolean(data.lawyer?.hasPhoto));
    } catch (err: any) {
      setError(
        err?.response?.status === 404
          ? "No lawyer profile is linked to this account. Please contact the admin team."
          : "Couldn't load your profile right now.",
      );
    }
  }, [loadPhoto]);

  useEffect(() => {
    load();
    fetchAssignments("active")
      .then((rows) => setActiveCount(rows.filter((r) => r.stage !== "COMPLETED").length))
      .catch(() => setActiveCount(null));
  }, [load]);

  useEffect(() => () => {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
  }, [photoUrl]);

  const lawyer = data?.lawyer;
  const user = data?.user;
  const fullName = useMemo(
    () =>
      [lawyer?.firstName, lawyer?.middleName, lawyer?.lastName].filter(Boolean).join(" ").trim() ||
      lawyer?.name ||
      [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
      "Lawyer",
    [lawyer, user],
  );
  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .map((p: string) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "L";
  const firm = lawyer?.company && typeof lawyer.company === "object" ? lawyer.company : null;
  const emailChanged =
    !!form && !!user && form.workEmail.trim().toLowerCase() !== String(user.email ?? "").toLowerCase();

  const set = (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => (f ? { ...f, [key]: e.target.value } : f));

  const startEdit = () => {
    setForm(toForm(lawyer, user));
    setCurrentPassword("");
    setEditing(true);
  };

  const save = async () => {
    if (!form) return;
    if (!form.firstName.trim() || !form.lastName.trim() || !form.jobTitle.trim() || !form.workEmail.trim()) {
      toast.error("First name, last name, job title and work email are required.");
      return;
    }
    if (emailChanged && !currentPassword) {
      toast.error("Enter your current password to change your sign-in email.");
      return;
    }
    // Empty optional fields are left out (an empty phone would fail validation).
    const body: Record<string, string> = {};
    (Object.keys(form) as (keyof Form)[]).forEach((k) => {
      const v = form[k].trim();
      if (v) body[k] = v;
    });
    if (emailChanged) body.currentPassword = currentPassword;
    setSaving(true);
    try {
      const { data: fresh } = await Axios.patch("/lawyer/me/profile", body);
      setData(fresh);
      setForm(toForm(fresh.lawyer, fresh.user));
      dispatch(
        setUserProfileData({
          ...me,
          firstName: fresh.user?.firstName,
          middleName: fresh.user?.middleName,
          lastName: fresh.user?.lastName,
          email: fresh.user?.email,
          phone: fresh.user?.phone,
        }),
      );
      setEditing(false);
      toast.success("Your profile has been updated.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't save your profile."));
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (pw.next.length < 8) return toast.error("The new password must be at least 8 characters.");
    if (pw.next !== pw.confirm) return toast.error("The new passwords do not match.");
    setSavingPw(true);
    try {
      await Axios.post("/lawyer/me/password", { currentPassword: pw.current, newPassword: pw.next });
      setPw({ current: "", next: "", confirm: "" });
      toast.success("Your password has been changed.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't change your password."));
    } finally {
      setSavingPw(false);
    }
  };

  const uploadPhoto = async (file?: File | null) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("Photo is larger than 5 MB.");
    const fd = new FormData();
    fd.append("photo", file);
    setPhotoBusy(true);
    try {
      await Axios.post("/lawyer/me/photo", fd, { headers: { "Content-Type": "multipart/form-data" } });
      await loadPhoto(true);
      toast.success("Photo updated.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't upload the photo."));
    } finally {
      setPhotoBusy(false);
    }
  };

  const removePhoto = async () => {
    setPhotoBusy(true);
    try {
      await Axios.delete("/lawyer/me/photo");
      await loadPhoto(false);
      toast.success("Photo removed.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't remove the photo."));
    } finally {
      setPhotoBusy(false);
    }
  };

  if (error) return <div className="p-6 text-sm text-red-600">{error}</div>;
  if (!data || !form) return <div className="p-6 text-sm text-slate-500">Loading profile...</div>;

  const avatar = (size: string) =>
    photoUrl ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={photoUrl} alt="" className={`${size} rounded-full object-cover shadow-xs`} />
    ) : (
      <div className={`${size} rounded-full bg-slate-900 text-white font-bold text-base font-sans flex items-center justify-center shadow-xs`}>
        {initials}
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      {/* Header (same layout as the case manager's account window) */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3 min-w-0">
          {avatar("w-12 h-12")}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold font-sans text-slate-900 tracking-tight truncate">{fullName}</h3>
              <span className="uppercase text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                Lawyer
              </span>
              {lawyer?.verified && (
                <span className="uppercase text-[10px] font-bold bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">Verified</span>
              )}
            </div>
            <p className="text-xs font-sans text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!editing && (
            <button
              type="button"
              onClick={startEdit}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" /> Edit profile
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {!editing ? (
        <>
          <div className="grid grid-cols-2 gap-3 font-sans text-xs">
            <Tile icon={<Briefcase className="w-3 h-3 text-slate-500" />} label="Title / Role" value={lawyer?.jobTitle || "Lawyer"} />
            <Tile icon={<Building2 className="w-3 h-3 text-slate-500" />} label="Firm" value={[firm?.name, lawyer?.officeBranch].filter(Boolean).join(" · ")} />
            <Tile
              icon={<Award className="w-3 h-3 text-slate-500" />}
              label="Registration"
              value={[lawyer?.regulatoryBody, lawyer?.registrationNumber || lawyer?.barNumber].filter(Boolean).join(" · ")}
            />
            <Tile icon={<Shield className="w-3 h-3 text-slate-500" />} label="Practising Status" value={lawyer?.practisingStatus} tone="text-emerald-700" />
            <Tile icon={<Mail className="w-3 h-3 text-slate-500" />} label="Work Email" value={lawyer?.workEmail || user?.email} />
            <Tile icon={<Phone className="w-3 h-3 text-slate-500" />} label="Phone" value={lawyer?.workPhone || lawyer?.mobilePhone || user?.phone} />
            <Tile icon={<Shield className="w-3 h-3 text-slate-500" />} label="Availability" value={AVAILABILITY[lawyer?.status] ?? lawyer?.status} />
            <Tile icon={<Clock className="w-3 h-3 text-slate-500" />} label="Active Matters" value={activeCount === null ? "…" : `${activeCount} Active Cases`} />
          </div>
          {(lawyer?.jurisdiction || lawyer?.qualifications || lawyer?.priceText) && (
            <div className="grid grid-cols-1 gap-3 text-xs">
              {lawyer?.jurisdiction && <Tile icon={<Award className="w-3 h-3 text-slate-500" />} label="Jurisdiction" value={lawyer.jurisdiction} />}
              {lawyer?.qualifications && <Tile icon={<Award className="w-3 h-3 text-slate-500" />} label="Qualifications" value={lawyer.qualifications} />}
              {lawyer?.priceText && <Tile icon={<Briefcase className="w-3 h-3 text-slate-500" />} label="Pricing" value={lawyer.priceText} />}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-6 font-sans">
          <Section title="Photo">
            <div className="flex items-center gap-4">
              {avatar("w-16 h-16")}
              <label className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer">
                {photoBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
                {photoUrl ? "Change photo" : "Upload photo"}
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp"
                  className="hidden"
                  disabled={photoBusy}
                  onChange={(e) => uploadPhoto(e.target.files?.[0])}
                />
              </label>
              {photoUrl && (
                <button
                  type="button"
                  onClick={removePhoto}
                  disabled={photoBusy}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              )}
              <span className="text-[10px] text-slate-400">PNG, JPG or WebP, up to 5 MB.</span>
            </div>
          </Section>

          <Section title="Personal details">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="First name" required><input className={inputCls} value={form.firstName} onChange={set("firstName")} maxLength={50} /></Field>
              <Field label="Middle name"><input className={inputCls} value={form.middleName} onChange={set("middleName")} maxLength={100} /></Field>
              <Field label="Last name" required><input className={inputCls} value={form.lastName} onChange={set("lastName")} maxLength={50} /></Field>
            </div>
          </Section>

          <Section title="Professional details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Job title" required><input className={inputCls} value={form.jobTitle} onChange={set("jobTitle")} maxLength={120} /></Field>
              <Field label="Office / branch"><input className={inputCls} value={form.officeBranch} onChange={set("officeBranch")} maxLength={120} /></Field>
              <Field label="Regulatory body">
                <SelectWithCurrent value={form.regulatoryBody} options={REGULATORY_BODIES} onChange={(v) => setForm((f) => (f ? { ...f, regulatoryBody: v } : f))} placeholder="Select regulator" />
              </Field>
              <Field label="Registration number"><input className={inputCls} value={form.registrationNumber} onChange={set("registrationNumber")} maxLength={60} /></Field>
              <Field label="Practising status">
                <SelectWithCurrent value={form.practisingStatus} options={PRACTISING_STATUSES} onChange={(v) => setForm((f) => (f ? { ...f, practisingStatus: v } : f))} placeholder="Select status" />
              </Field>
              <Field label="Jurisdiction">
                <SelectWithCurrent value={form.jurisdiction} options={JURISDICTIONS} onChange={(v) => setForm((f) => (f ? { ...f, jurisdiction: v } : f))} placeholder="Select jurisdiction" />
              </Field>
            </div>
            <Field label="Qualifications"><textarea className={`${inputCls} min-h-[70px]`} value={form.qualifications} onChange={set("qualifications")} maxLength={1000} /></Field>
            <Field label="Pricing" hint="How you describe your fees to clients."><textarea className={`${inputCls} min-h-[60px]`} value={form.priceText} onChange={set("priceText")} maxLength={500} /></Field>
          </Section>

          <Section title="Contact">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Work email" required hint="You also sign in with this address."><input type="email" className={inputCls} value={form.workEmail} onChange={set("workEmail")} maxLength={254} /></Field>
              <Field label="Work phone"><input className={inputCls} value={form.workPhone} onChange={set("workPhone")} placeholder="+44..." /></Field>
              <Field label="Mobile phone"><input className={inputCls} value={form.mobilePhone} onChange={set("mobilePhone")} placeholder="+44..." /></Field>
            </div>
            {emailChanged && (
              <Field label="Current password" required hint="Needed to change the email you sign in with.">
                <input type="password" className={inputCls} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} autoComplete="current-password" />
              </Field>
            )}
          </Section>

          <Section title="Managed by the admin team">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <Tile icon={<Building2 className="w-3 h-3 text-slate-500" />} label="Firm" value={firm?.name} />
              <Tile icon={<Shield className="w-3 h-3 text-slate-500" />} label="Availability" value={AVAILABILITY[lawyer?.status] ?? lawyer?.status} />
            </div>
            <p className="text-[11px] text-slate-400">To change your firm or availability, contact the admin team.</p>
          </Section>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setForm(toForm(lawyer, user));
              }}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-60 cursor-pointer"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save changes
            </button>
          </div>

          <Section title="Change password">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Current password"><input type="password" className={inputCls} value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} autoComplete="current-password" /></Field>
              <Field label="New password" hint="At least 8 characters."><input type="password" className={inputCls} value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} autoComplete="new-password" /></Field>
              <Field label="Confirm new password"><input type="password" className={inputCls} value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} autoComplete="new-password" /></Field>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={changePassword}
                disabled={savingPw || !pw.current || !pw.next}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
              >
                {savingPw ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />} Change password
              </button>
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}

/** The profile in a window, like CaseManagerAccountModal. */
export function LawyerAccountModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[60] flex items-center justify-center p-6" onClick={onClose}>
      <div
        className="w-full max-w-[680px] max-h-[90vh] overflow-y-auto bg-white border border-slate-300 rounded-2xl p-7 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <LawyerProfilePanel onClose={onClose} />
      </div>
    </div>
  );
}
