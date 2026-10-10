"use client";

import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Mail, ShieldCheck, UserRound } from "lucide-react";
import Axios from "@/lib/ApiConfig";
import { getErrorMessage } from "@/lib/api/http-error";
import { AppDispatch, RootState } from "@/store/store";
import { setUserProfileData } from "@/store/slices/authSlice";
import type {
  FormErrors,
  ProfileForm,
} from "@/types/dashboard/profile-settings";

const fieldClasses =
  "w-full rounded-[10px] border bg-slate-50 px-4 py-3 text-[0.95rem] text-slate-900 transition placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60";
const fieldOk =
  "border-slate-300 focus:border-indigo-600 focus:ring-indigo-600/10";
const fieldError = "border-red-400 focus:border-red-500 focus:ring-red-500/10";

const PHONE_PATTERN = /^\+?[0-9\s\-()]{7,20}$/;

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
  if (!form.firstName.trim()) errors.firstName = "First name is required.";
  if (!form.lastName.trim()) errors.lastName = "Last name is required.";
  if (form.dateOfBirth && new Date(form.dateOfBirth) > new Date()) {
    errors.dateOfBirth = "Date of birth can't be in the future.";
  }
  if (form.phone.trim() && !PHONE_PATTERN.test(form.phone.trim())) {
    errors.phone = "Enter a valid phone number.";
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

  const initialForm = useMemo(() => toForm(user), [user]);
  const [form, setForm] = useState<ProfileForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  const isDirty = JSON.stringify(form) !== JSON.stringify(initialForm);
  const today = new Date().toISOString().slice(0, 10);

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "?";
  const partnerLabel =
    user?.endUserType === "user2"
      ? "Partner 2 (invited)"
      : "Partner 1 (case owner)";

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

      // Keep redux in sync so the rest of the portal shows the new details
      dispatch(
        setUserProfileData({
          ...user,
          firstName: data?.firstName ?? payload.firstName,
          middleName: data?.middleName ?? payload.middleName,
          lastName: data?.lastName ?? payload.lastName,
          suffix: data?.suffix ?? payload.suffix,
          dateOfBirth: data?.dateOfBirth ?? payload.dateOfBirth,
          phone: data?.phone ?? payload.phone,
          marketingConsent: data?.marketingConsent ?? payload.marketingConsent,
        }),
      );

      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update your profile."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
      {/* Account summary */}
      <aside className="h-fit rounded-2xl border border-[#E7E7F2] bg-white p-6 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EDE9FE] text-2xl font-bold text-[#6D28D9]">
            {initials}
          </div>
          <p className="mt-4 text-base font-semibold text-[#1E1B3C]">
            {fullName || "Your name"}
          </p>
          <p className="mt-0.5 break-all text-sm text-[#5B5B75]">
            {user?.email}
          </p>
        </div>

        <div className="mt-6 space-y-3 border-t border-[#E7E7F2] pt-5 text-sm">
          <div className="flex items-center gap-2.5 text-[#5B5B75]">
            <UserRound className="h-4 w-4 text-[#6D28D9]" />
            <span>{partnerLabel}</span>
          </div>
          <div className="flex items-center gap-2.5 text-[#5B5B75]">
            <Mail className="h-4 w-4 text-[#6D28D9]" />
            <span>Email verified</span>
          </div>
          {user?.inviteCaseId && (
            <div className="flex items-start gap-2.5 text-[#5B5B75]">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#6D28D9]" />
              <span className="break-all">
                Case{" "}
                <span className="font-mono text-xs">
                  {String(user.inviteCaseId)}
                </span>
              </span>
            </div>
          )}
        </div>
      </aside>

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
            label="First name"
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

          <Field label="Middle name(s)" htmlFor="middleName">
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
            label="Last name"
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

          <Field label="Suffix" htmlFor="suffix" hint="e.g. Jr, Sr, III">
            <input
              id="suffix"
              name="suffix"
              type="text"
              autoComplete="honorific-suffix"
              value={form.suffix}
              onChange={handleChange}
              className={`${fieldClasses} ${fieldOk}`}
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

        <div className="my-8 border-t border-[#E7E7F2]" />

        <SectionTitle>Communication preferences</SectionTitle>

        <label
          htmlFor="marketingConsent"
          className="flex cursor-pointer items-start gap-3 rounded-[10px] border border-slate-300 bg-slate-50 p-4 transition hover:border-indigo-300"
        >
          <input
            id="marketingConsent"
            name="marketingConsent"
            type="checkbox"
            checked={form.marketingConsent}
            onChange={handleChange}
            className="mt-0.5 h-4 w-4 cursor-pointer accent-indigo-600"
          />
          <span>
            <span className="block text-sm font-semibold text-slate-800">
              Product updates and offers
            </span>
            <span className="block text-sm text-slate-500">
              I'd like to receive occasional marketing emails from LetsPrenup.
              You can unsubscribe at any time.
            </span>
          </span>
        </label>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleReset}
            disabled={!isDirty || saving}
            className="rounded-[10px] border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Discard changes
          </button>
          <button
            type="submit"
            disabled={!isDirty || saving}
            className="rounded-[10px] bg-indigo-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ProfileSettingsPage() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="min-h-full bg-slate-100 px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
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
