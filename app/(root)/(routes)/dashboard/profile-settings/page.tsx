"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Mail, MailWarning, ShieldCheck, UserPlus } from "lucide-react";
import Axios from "@/lib/ApiConfig";
import { getErrorMessage } from "@/lib/api/http-error";
import { AppDispatch, RootState } from "@/store/store";
import { setUserProfileData } from "@/store/slices/authSlice";
import { getFreshProfile } from "@/store/asyncThunk/authThunk";
import type {
  FormErrors,
  PartnerForm,
  PartnerFormErrors,
  PartnerProfile,
  ProfileForm,
} from "@/types/dashboard/profile-settings";

const fieldClasses =
  "w-full rounded-[10px] border bg-slate-50 px-4 py-2.5 text-[0.95rem] text-slate-900 transition placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60";
const fieldOk =
  "border-slate-300 focus:border-indigo-600 focus:ring-indigo-600/10";
const fieldError = "border-red-400 focus:border-red-500 focus:ring-red-500/10";

// Shared shells so the user card and the partner card are pixel-identical
const cardClasses =
  "rounded-2xl border border-[#E7E7F2] bg-white p-6 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06)] sm:p-8";
const asideClasses =
  "h-fit rounded-2xl border border-[#E7E7F2] bg-white p-6 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06)]";

const toForm = (user: Record<string, any>): ProfileForm => ({
  firstName: user?.firstName ?? "",
  middleName: user?.middleName ?? "",
  lastName: user?.lastName ?? "",
  suffix: user?.suffix ?? "",
  dateOfBirth: user?.dateOfBirth ? String(user.dateOfBirth).slice(0, 10) : "",
  phone: user?.phone ?? "",
  marketingConsent: !!user?.marketingConsent,
});

const toPartnerForm = (partner?: PartnerProfile | null): PartnerForm => ({
  firstName: partner?.firstName ?? "",
  middleName: partner?.middleName ?? "",
  lastName: partner?.lastName ?? "",
  suffix: partner?.suffix ?? "",
  dateOfBirth: partner?.dateOfBirth
    ? String(partner.dateOfBirth).slice(0, 10)
    : "",
  phone: partner?.phone ?? "",
});

// One validator for both sections, so the two forms behave identically
const validateNames = (
  form: PartnerForm,
  who: "own" | "partner"
): PartnerFormErrors => {
  const errors: PartnerFormErrors = {};
  const subject = who === "own" ? "Legal" : "Your partner's legal";
  if (!form.firstName.trim())
    errors.firstName = `${subject} first name is required.`;
  if (!form.lastName.trim())
    errors.lastName = `${subject} last name is required.`;
  if (form.dateOfBirth && new Date(form.dateOfBirth) > new Date()) {
    errors.dateOfBirth = "Date of birth can't be in the future.";
  }
  return errors;
};

const validate = (form: ProfileForm): FormErrors =>
  validateNames(form, "own") as FormErrors;

const formatCapitalize = (str?: string) => {
  if (!str) return "";
  return str
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
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

// Full-width heading that labels each of the two identical rows
function RowHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="lg:col-span-2">
      <h3 className="text-[1.05rem] font-extrabold tracking-tight text-slate-900">
        {title}
      </h3>
      <p className="mt-0.5 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function FormActions({
  isDirty,
  saving,
  onReset,
}: {
  isDirty: boolean;
  saving: boolean;
  onReset: () => void;
}) {
  return (
    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onReset}
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
  );
}

// The same summary card renders for the user and for the partner
function SummaryCard({
  fullName,
  fallbackName,
  email,
  initials,
  emailVerified,
  caseNumber,
}: {
  fullName: string;
  fallbackName: string;
  email?: string | null;
  initials: string;
  emailVerified: boolean;
  caseNumber?: string | null;
}) {
  return (
    <aside className={asideClasses}>
      <div className="flex items-center gap-3.5">
        <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#E02693] to-[#8B23E3] text-lg font-bold text-white shadow-sm">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="whitespace-nowrap truncate text-[1.125rem] font-bold capitalize text-[#1E1B3C]">
            {fullName || fallbackName}
          </p>
          <p
            className="whitespace-nowrap truncate text-[0.875rem] text-[#5B5B75] mt-0.5"
            title={email ?? undefined}
          >
            {email}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3 border-t border-[#E7E7F2] pt-5 text-sm">
        <div className="flex items-center gap-2.5 text-[#5B5B75]">
          {emailVerified ? (
            <>
              <Mail className="h-4 w-4 text-[#6D28D9]" />
              <span>Email verified</span>
            </>
          ) : (
            <>
              <MailWarning className="h-4 w-4 text-amber-500" />
              <span>Email not verified yet</span>
            </>
          )}
        </div>
        {caseNumber && (
          <div className="flex items-start gap-2.5 text-[#5B5B75]">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#6D28D9]" />
            <span className="break-all">
              Case{" "}
              <span className="font-mono text-xs">{String(caseNumber)}</span>
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}

/* ───────────────────────────── Your details ───────────────────────────── */

function UserDetailsSection({
  user,
  caseNumber,
}: {
  user: Record<string, any>;
  caseNumber?: string | null;
}) {
  const dispatch = useDispatch<AppDispatch>();

  const initialForm = useMemo(() => toForm(user), [user]);
  const [form, setForm] = useState<ProfileForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  // Sync form state when user prop updates (e.g. fresh data or saved changes)
  useEffect(() => {
    setForm(toForm(user));
  }, [user]);

  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(initialForm),
    [form, initialForm]
  );

  const today = new Date().toISOString().slice(0, 10);

  // Live interactive preview on the right card while editing or when discarding!
  const liveRawName = [form.firstName, form.lastName].filter(Boolean).join(" ");
  const savedRawName = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(" ");
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    <>
      <form onSubmit={handleSubmit} noValidate className={cardClasses}>
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

        <FormActions isDirty={isDirty} saving={saving} onReset={handleReset} />
      </form>

      <SummaryCard
        fullName={fullName}
        fallbackName="Your name"
        email={user?.email}
        initials={initials}
        emailVerified={user?.emailVerified !== false}
        caseNumber={caseNumber}
      />
    </>
  );
}

/* ──────────────────────────── Partner details ──────────────────────────── */

function PartnerDetailsSection({ caseNumber }: { caseNumber?: string | null }) {
  const [partner, setPartner] = useState<PartnerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<PartnerForm>(toPartnerForm(null));
  const [errors, setErrors] = useState<PartnerFormErrors>({});
  const [saving, setSaving] = useState(false);

  const initialForm = useMemo(() => toPartnerForm(partner), [partner]);

  useEffect(() => {
    let cancelled = false;

    const loadPartner = async () => {
      try {
        const { data } = await Axios.get("/users/partner");
        if (cancelled) return;
        const next: PartnerProfile | null = data?.partner ?? null;
        setPartner(next);
        setForm(toPartnerForm(next));
        setErrors({});
      } catch (error) {
        if (cancelled) return;
        toast.error(
          getErrorMessage(error, "Failed to load your partner's details.")
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadPartner();
    return () => {
      cancelled = true;
    };
  }, []);

  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(initialForm),
    [form, initialForm]
  );

  const today = new Date().toISOString().slice(0, 10);

  const liveRawName = [form.firstName, form.lastName].filter(Boolean).join(" ");
  const savedRawName = [partner?.firstName, partner?.lastName]
    .filter(Boolean)
    .join(" ");
  const fullName = formatCapitalize(liveRawName || savedRawName);

  const initials =
    `${(form.firstName || partner?.firstName)?.[0] ?? ""}${(form.lastName || partner?.lastName)?.[0] ?? ""}`.toUpperCase() ||
    partner?.email?.[0]?.toUpperCase() ||
    "?";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof PartnerForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setErrors({});
    toast.info("Changes discarded.");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextErrors = validateNames(form, "partner");
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = {
      firstName: form.firstName.trim(),
      middleName: form.middleName.trim(),
      lastName: form.lastName.trim(),
      suffix: form.suffix.trim(),
      dateOfBirth: form.dateOfBirth || null,
      phone: form.phone.trim(),
    };

    try {
      setSaving(true);
      const { data } = await Axios.patch("/users/partner/profile", payload);

      const updated: PartnerProfile = {
        ...(partner as PartnerProfile),
        ...payload,
        ...(data?.partner ?? {}),
      };
      setPartner(updated);
      setForm(toPartnerForm(updated));
      setErrors({});

      toast.success("Partner details updated successfully.");
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Failed to update your partner's details.")
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className={`${cardClasses} animate-pulse`}>
          <div className="h-5 w-48 rounded bg-slate-200" />
          <div className="mt-3 h-4 w-72 max-w-full rounded bg-slate-100" />
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="mb-2 h-3.5 w-28 rounded bg-slate-200" />
                <div className="h-11 rounded-[10px] bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
        <aside className={`${asideClasses} animate-pulse`}>
          <div className="flex items-center gap-3.5">
            <div className="h-[52px] w-[52px] shrink-0 rounded-[14px] bg-slate-200" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-32 rounded bg-slate-200" />
              <div className="h-3 w-40 rounded bg-slate-100" />
            </div>
          </div>
          <div className="mt-6 space-y-3 border-t border-[#E7E7F2] pt-5">
            <div className="h-3.5 w-28 rounded bg-slate-100" />
            <div className="h-3.5 w-36 rounded bg-slate-100" />
          </div>
        </aside>
      </>
    );
  }

  // No second party on the case yet — same card shell, with a nudge to invite.
  if (!partner) {
    return (
      <div className={`${cardClasses} lg:col-span-2`}>
        <SectionTitle description="Your partner's details appear here once they accept your invitation and create their account.">
          Partner information
        </SectionTitle>
        <div className="flex flex-col items-start gap-4 rounded-[10px] border border-dashed border-slate-300 bg-slate-50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <UserPlus className="mt-0.5 h-5 w-5 shrink-0 text-[#6D28D9]" />
            <div>
              <p className="text-sm font-semibold text-slate-800">
                No partner linked yet
              </p>
              <p className="mt-0.5 text-sm text-slate-500">
                Invite your partner so both sets of legal details can be
                completed.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/invite-partner"
            className="shrink-0 rounded-[10px] bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Invite partner
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className={cardClasses}>
        <SectionTitle description="Use your partner's full legal name as it should appear on the agreement.">
          Partner information
        </SectionTitle>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field
            label="Legal First name"
            htmlFor="partnerFirstName"
            required
            error={errors.firstName}
          >
            <input
              id="partnerFirstName"
              name="firstName"
              type="text"
              value={form.firstName}
              onChange={handleChange}
              className={`${fieldClasses} ${errors.firstName ? fieldError : fieldOk}`}
            />
          </Field>

          <Field label="Legal Middle name(s)" htmlFor="partnerMiddleName">
            <input
              id="partnerMiddleName"
              name="middleName"
              type="text"
              value={form.middleName}
              onChange={handleChange}
              className={`${fieldClasses} ${fieldOk}`}
            />
          </Field>

          <Field
            label="Legal Last name"
            htmlFor="partnerLastName"
            required
            error={errors.lastName}
          >
            <input
              id="partnerLastName"
              name="lastName"
              type="text"
              value={form.lastName}
              onChange={handleChange}
              className={`${fieldClasses} ${errors.lastName ? fieldError : fieldOk}`}
            />
          </Field>

          <Field
            label="Date of birth"
            htmlFor="partnerDateOfBirth"
            error={errors.dateOfBirth}
          >
            <input
              id="partnerDateOfBirth"
              name="dateOfBirth"
              type="date"
              max={today}
              value={form.dateOfBirth}
              onChange={handleChange}
              className={`${fieldClasses} ${errors.dateOfBirth ? fieldError : fieldOk}`}
            />
          </Field>
        </div>

        <div className="my-6 border-t border-[#E7E7F2]" />

        <SectionTitle>Contact details</SectionTitle>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field
            label="Email address"
            htmlFor="partnerEmail"
            hint="Your partner signs in with this address, so only they can change it."
          >
            <input
              id="partnerEmail"
              type="email"
              value={partner?.email ?? ""}
              disabled
              readOnly
              className={`${fieldClasses} ${fieldOk}`}
            />
          </Field>

          <Field label="Phone number" htmlFor="partnerPhone">
            <input
              id="partnerPhone"
              name="phone"
              type="tel"
              placeholder="+44 7700 900123"
              value={form.phone}
              onChange={handleChange}
              className={`${fieldClasses} ${fieldOk}`}
            />
          </Field>
        </div>

        <FormActions isDirty={isDirty} saving={saving} onReset={handleReset} />
      </form>

      <SummaryCard
        fullName={fullName}
        fallbackName="Partner's name"
        email={partner?.email}
        initials={initials}
        emailVerified={partner?.emailVerified !== false}
        caseNumber={caseNumber}
      />
    </>
  );
}

export default function ProfileSettingsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const cases = useSelector((state: RootState) => state.cases);

  useEffect(() => {
    if (!user?._id) {
      dispatch(getFreshProfile());
    }
  }, [dispatch, user?._id]);

  const rawCaseNumber =
    cases?.caseNumber || user?.caseNumber || user?.inviteCaseId;
  const caseNumber = rawCaseNumber ? String(rawCaseNumber) : null;

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
            Review and update both parties' personal details.
          </p>
        </div>

        {user?._id ? (
          // key resets the forms if a different user's data is loaded
          <div
            key={user._id}
            className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_350px]"
          >
            <RowHeading
              title="Your details"
              description="The first party to the agreement."
            />
            <UserDetailsSection user={user} caseNumber={caseNumber} />

            {/* extra breathing room between the two identical rows */}
            <div className="mt-2 lg:col-span-2" />

            <RowHeading
              title="Partner details"
              description="The second party to the agreement."
            />
            <PartnerDetailsSection caseNumber={caseNumber} />
          </div>
        ) : (
          <div className="rounded-2xl border border-[#E7E7F2] bg-white p-10 text-center text-sm text-slate-500">
            We couldn't load your profile. Please sign in again.
          </div>
        )}
      </div>
    </div>
  );
}
