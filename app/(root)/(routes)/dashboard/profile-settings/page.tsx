"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Mail, ShieldCheck } from "lucide-react";
import Axios from "@/lib/ApiConfig";
import { getErrorMessage } from "@/lib/api/http-error";
import { AppDispatch, RootState } from "@/store/store";
import { setUserProfileData } from "@/store/slices/authSlice";
import { getFreshProfile } from "@/store/asyncThunk/authThunk";
import type {
  FormErrors,
  ProfileForm,
} from "@/types/dashboard/profile-settings";

const fieldClasses =
  "w-full rounded-[10px] border bg-slate-50 px-4 py-2.5 text-[0.95rem] text-slate-900 transition placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60";
const fieldOk =
  "border-slate-300 focus:border-indigo-600 focus:ring-indigo-600/10";
const fieldError = "border-red-400 focus:border-red-500 focus:ring-red-500/10";

const toForm = (user: Record<string, any>): ProfileForm => ({
  firstName: user?.firstName ?? "",
  middleName: user?.middleName ?? "",
  lastName: user?.lastName ?? "",
  suffix: user?.suffix ?? "",
  dateOfBirth: user?.dateOfBirth ? String(user.dateOfBirth).slice(0, 10) : "",
  phone: user?.phone ?? "",
  marketingConsent: !!user?.marketingConsent,
});

const validate = (form: ProfileForm): FormErrors => {
  const errors: FormErrors = {};
  if (!form.firstName.trim()) errors.firstName = "Legal first name is required.";
  if (!form.lastName.trim()) errors.lastName = "Legal last name is required.";
  if (form.dateOfBirth && new Date(form.dateOfBirth) > new Date()) {
    errors.dateOfBirth = "Date of birth can't be in the future.";
  }
  return errors;
};

function Field({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-[0.875rem] font-semibold text-slate-800"
      >
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
      )}
    </div>
  );
}

function SectionTitle({
  children,
  description,
}: {
  children: React.ReactNode;
  description?: string;
}) {
  return (
    <div className="mb-5">
      <h3 className="text-[1rem] font-bold text-slate-900">{children}</h3>
      {description && (
        <p className="mt-0.5 text-sm text-slate-500">{description}</p>
      )}
    </div>
  );
}

function ProfileSettingsForm({ user }: { user: Record<string, any> }) {
  const dispatch = useDispatch<AppDispatch>();
  const cases = useSelector((state: RootState) => state.cases);

  const displayCaseNumber =
    cases?.caseNumber || user?.caseNumber || user?.inviteCaseId;

  const initialForm = useMemo(() => toForm(user), [user]);
  const [form, setForm] = useState<ProfileForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  // Sync form state when user prop updates (e.g. fresh data or saved changes)
  useEffect(() => {
    setForm(toForm(user));
  }, [user]);

  const isDirty = useMemo(() => {
    return JSON.stringify(form) !== JSON.stringify(initialForm);
  }, [form, initialForm]);

  const today = new Date().toISOString().slice(0, 10);

  const formatCapitalize = (str?: string) => {
    if (!str) return "";
    return str
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  // Live interactive preview on the right card while editing or when discarding!
  const liveRawName = [form.firstName, form.lastName].filter(Boolean).join(" ");
  const savedRawName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const fullName = formatCapitalize(liveRawName || savedRawName);

  const initials =
    `${(form.firstName || user?.firstName)?.[0] ?? ""}${(form.lastName || user?.lastName)?.[0] ?? ""}`.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "?";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name as keyof ProfileForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setErrors({});
    toast.info("Changes discarded.");
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = {
      firstName: form.firstName.trim(),
      middleName: form.middleName.trim(),
      lastName: form.lastName.trim(),
      suffix: form.suffix.trim(),
      dateOfBirth: form.dateOfBirth || null,
      phone: form.phone.trim(),
      marketingConsent: form.marketingConsent,
    };

    try {
      setSaving(true);
      const { data } = await Axios.patch("/users/profile", payload);

      const updatedUser = {
        ...user,
        firstName: data?.firstName ?? payload.firstName,
        middleName: data?.middleName ?? payload.middleName,
        lastName: data?.lastName ?? payload.lastName,
        suffix: data?.suffix ?? payload.suffix,
        dateOfBirth: data?.dateOfBirth ?? payload.dateOfBirth,
        phone: data?.phone ?? payload.phone,
        marketingConsent: data?.marketingConsent ?? payload.marketingConsent,
      };

      // Keep redux in sync so the rest of the portal shows the new details
      dispatch(setUserProfileData(updatedUser));
      setForm(toForm(updatedUser));
      setErrors({});

      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update your profile."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_350px]">
      {/* Edit form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-2xl border border-[#E7E7F2] bg-white p-6 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06)] sm:p-8"
      >
        <SectionTitle description="Use your full legal name as it should appear on the agreement.">
          Personal information
        </SectionTitle>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field
            label="Legal First name"
            htmlFor="firstName"
            required
            error={errors.firstName}
          >
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              value={form.firstName}
              onChange={handleChange}
              className={`${fieldClasses} ${errors.firstName ? fieldError : fieldOk}`}
            />
          </Field>

          <Field label="Legal Middle name(s)" htmlFor="middleName">
            <input
              id="middleName"
              name="middleName"
              type="text"
              autoComplete="additional-name"
              value={form.middleName}
              onChange={handleChange}
              className={`${fieldClasses} ${fieldOk}`}
            />
          </Field>

          <Field
            label="Legal Last name"
            htmlFor="lastName"
            required
            error={errors.lastName}
          >
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              value={form.lastName}
              onChange={handleChange}
              className={`${fieldClasses} ${errors.lastName ? fieldError : fieldOk}`}
            />
          </Field>

          <Field
            label="Date of birth"
            htmlFor="dateOfBirth"
            error={errors.dateOfBirth}
          >
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              max={today}
              autoComplete="bday"
              value={form.dateOfBirth}
              onChange={handleChange}
              className={`${fieldClasses} ${errors.dateOfBirth ? fieldError : fieldOk}`}
            />
          </Field>
        </div>

        <div className="my-6 border-t border-[#E7E7F2]" />

        <SectionTitle>Contact details</SectionTitle>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Email address" htmlFor="email">
            <input
              id="email"
              type="email"
              value={user?.email ?? ""}
              disabled
              readOnly
              className={`${fieldClasses} ${fieldOk}`}
            />
          </Field>

          <Field label="Phone number" htmlFor="phone">
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+44 7700 900123"
              value={form.phone}
              onChange={handleChange}
              className={`${fieldClasses} ${fieldOk}`}
            />
          </Field>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleReset}
            disabled={!isDirty || saving}
            className="rounded-[10px] border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Discard changes
          </button>
          <button
            type="submit"
            disabled={!isDirty || saving}
            className="flex items-center justify-center gap-2 rounded-[10px] bg-indigo-600 px-7 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </form>

      {/* Account summary */}
      <aside className="h-fit rounded-2xl border border-[#E7E7F2] bg-white p-6 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06)]">
        <div className="flex items-center gap-3.5">
          <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#E02693] to-[#8B23E3] text-lg font-bold text-white shadow-sm">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="whitespace-nowrap truncate text-[1.125rem] font-bold capitalize text-[#1E1B3C]">
              {fullName || "Your name"}
            </p>
            <p
              className="whitespace-nowrap truncate text-[0.875rem] text-[#5B5B75] mt-0.5"
              title={user?.email}
            >
              {user?.email}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3 border-t border-[#E7E7F2] pt-5 text-sm">
          <div className="flex items-center gap-2.5 text-[#5B5B75]">
            <Mail className="h-4 w-4 text-[#6D28D9]" />
            <span>Email verified</span>
          </div>
          {displayCaseNumber && (
            <div className="flex items-start gap-2.5 text-[#5B5B75]">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#6D28D9]" />
              <span className="break-all">
                Case{" "}
                <span className="font-mono text-xs">
                  {String(displayCaseNumber)}
                </span>
              </span>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export default function ProfileSettingsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user?._id) {
      dispatch(getFreshProfile());
    }
  }, [dispatch, user?._id]);

  return (
    <div
      className="min-h-full bg-slate-100 px-5 py-6 sm:px-8"
      style={{ zoom: 0.9 }}
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-5">
          <h2 className="text-[1.45rem] font-extrabold tracking-tight text-slate-900">
            Profile settings
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Review and update your personal details.
          </p>
        </div>

        {user?._id ? (
          // key resets the form if a different user's data is loaded
          <ProfileSettingsForm key={user._id} user={user} />
        ) : (
          <div className="rounded-2xl border border-[#E7E7F2] bg-white p-10 text-center text-sm text-slate-500">
            We couldn't load your profile. Please sign in again.
          </div>
        )}
      </div>
    </div>
  );
}
