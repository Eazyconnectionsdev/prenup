"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import BrandLogo from "@/components/brand/BrandLogo";
import AuthInput from "@/components/auth/AuthInput";

import { AppDispatch, RootState } from "@/store/store";
import { acceptInvite, getInviteInfo } from "@/store/asyncThunk/authThunk";
import { setUserProfileData } from "@/store/slices/authSlice";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { isValidPhone, normalizePhone } from "@/lib/utils";
import type { FormState, InviteData } from "@/types/auth/register-partner";

export default function RegisterPartnerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const dispatch = useDispatch<AppDispatch>();

  const { isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  const [inviteData, setInviteData] = useState<InviteData>({
    token: "",
    caseId: "",
  });

  // The invited address already has an account: they sign in and accept
  // instead of registering a second one.
  const [accountExists, setAccountExists] = useState<boolean>(false);

  const [form, setForm] = useState<FormState>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    marketingConsent: false,
    acceptedTerms: false,
  });

  useEffect(() => {
    const token = searchParams.get("token") ?? "";
    const caseId = searchParams.get("caseId") ?? "";
    setInviteData({ token, caseId });

    // Query params are only a fallback; the server is the source of truth and
    // also records that the link was opened.
    setForm((prev) => ({
      ...prev,
      firstName: searchParams.get("firstName") ?? "",
      middleName: searchParams.get("middleName") ?? "",
      lastName: searchParams.get("lastName") ?? "",
      email: searchParams.get("email") ?? "",
      phone: searchParams.get("mobileNumber") ?? "",
    }));

    if (!token || !caseId) return;
    dispatch(getInviteInfo({ caseId, token }))
      .unwrap()
      .then((info: any) => {
        setForm((prev) => ({
          ...prev,
          firstName: info.firstName ?? prev.firstName,
          middleName: info.middleName ?? prev.middleName,
          lastName: info.lastName ?? prev.lastName,
          email: info.email ?? prev.email,
          phone: info.mobileNumber ?? prev.phone,
        }));
        setAccountExists(Boolean(info.accountExists));
      })
      .catch((error) => {
        toast.error(getErrorMessage(error, "This invite link is not valid"));
      });
  }, [searchParams, dispatch]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, checked, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!inviteData.token || !inviteData.caseId) {
      toast.error("Invalid invite link");
      return;
    }

    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error("First and last name are required");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      toast.error("Enter a valid email address");
      return;
    }

    if (!isValidPhone(form.phone)) {
      toast.error("Enter a valid phone number, e.g. +14165550192");
      return;
    }

    if (!form.password.trim()) {
      toast.error("Password is required");
      return;
    }

    if (form.password.length < 8) {
      toast.error(
        "Password must be at least 8 characters"
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!form.acceptedTerms) {
      toast.error(
        "Please accept Terms & Conditions"
      );
      return;
    }

    try {
      const result = await dispatch(
        acceptInvite({
          token: inviteData.token,
          caseId: inviteData.caseId,
          password: form.password,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim().toLowerCase(),
          phone: normalizePhone(form.phone) || undefined,
        })
      ).unwrap();

      if (result?.requiresEmailVerification) {
        // Registered with a different email than invited: verify it first.
        dispatch(setUserProfileData({ email: result.email }));
        toast.success("Account created. Check your email for the verification code.");
        router.push("/email-verification");
      } else {
        toast.success("Account created successfully");
        router.push("/login");
      }
    } catch (error: unknown) {
      console.error(error);

      // They registered separately in the meantime: hand over to sign-in.
      if ((error as { code?: string } | null)?.code === "ACCOUNT_EXISTS") {
        setAccountExists(true);
        return;
      }

      toast.error(getErrorMessage(error, "Failed to create account"));
    }
  };

  const goToSignIn = () => {
    const target = `/accept-invite?${new URLSearchParams({
      caseId: inviteData.caseId,
      token: inviteData.token,
    }).toString()}`;
    router.push(`/login?callbackUrl=${encodeURIComponent(target)}`);
  };

  const inputStyle = "h-[40px]";

  if (accountExists) {
    return (
      <div className="flex h-screen max-h-screen overflow-hidden flex-col lg:flex-row bg-[#FFF8F3]">
        <div className="relative flex-1 h-full overflow-y-auto bg-[#FFF8F3] animate-sunset-aurora bg-gradient-to-br from-[#FFF9F5] via-[#FFF1EB] via-[#FFEBE3] to-[#FFF5EE]">
          <div className="animate-sunset-orb-1 pointer-events-none absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full bg-gradient-to-br from-[#FF927A]/55 via-[#FFB38A]/40 to-transparent blur-3xl opacity-85" />
          <div className="animate-sunset-orb-2 pointer-events-none absolute top-1/4 -right-20 w-[450px] h-[450px] rounded-full bg-gradient-to-l from-[#FFAF6E]/60 via-[#FFD0A6]/45 to-transparent blur-3xl opacity-85" />
          <div className="animate-sunset-orb-3 pointer-events-none absolute -bottom-24 -left-20 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#FB7185]/45 via-[#F472B6]/35 to-transparent blur-3xl opacity-80" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />

          <div className="relative z-10 flex flex-col justify-between min-h-full px-6 py-4 sm:px-10 lg:px-12 xl:px-14">
            <header className="pt-2">
              <Link
                href="/login"
                aria-label="Lets Prenup home"
                className="inline-flex items-center transition-opacity hover:opacity-85"
              >
                <BrandLogo surface="light" height={34} priority />
              </Link>
            </header>

            <main className="relative z-10 flex flex-col justify-center max-w-[560px] w-full mx-auto my-auto py-4">
              <div className="relative rounded-2xl sm:rounded-3xl bg-white/85 backdrop-blur-xl border border-white/95 shadow-[0_20px_50px_-15px_rgba(255,160,130,0.22),0_1px_3px_rgba(0,0,0,0.03)] px-6 sm:px-8 py-6 sm:py-8 text-center">
                <h1 className="text-[25px] sm:text-[27px] font-bold text-[#16325C] tracking-tight mb-3">
                  You already have an account
                </h1>
                <p className="text-[14px] text-[#4B5563] mb-6 leading-relaxed">
                  There is already an account for{" "}
                  <span className="font-semibold text-[#16325C]">{form.email || "this email"}</span>, so there is nothing to register. Sign in and accept the invitation to join your partner. You will not need to create a new account or delete anything.
                </p>
                <button
                  type="button"
                  onClick={goToSignIn}
                  className="w-full h-[44px] rounded-xl border border-[#2A3752] bg-[#2A3752] hover:bg-[#1B2436] hover:shadow-[0_6px_22px_rgba(27,36,54,0.35)] text-white text-[14.5px] font-semibold tracking-wide transition-all shadow-sm cursor-pointer flex items-center justify-center"
                >
                  Sign in to accept the invitation
                </button>
              </div>
            </main>
          </div>
        </div>

        {/* Right side: Couple Sunset Aesthetic Panel */}
        <aside className="relative hidden w-full lg:flex lg:w-[32%] xl:w-[33%] flex-col justify-between overflow-hidden bg-[#D4A6B0] h-full">
          <div
            className="absolute inset-0 bg-cover bg-bottom bg-no-repeat"
            style={{ backgroundImage: `url('/images/auth-couple-bg.jpg')` }}
          />
          <div className="pointer-events-none absolute top-0 left-0 w-16 h-[45%] bg-gradient-to-r from-[#F6DDD1]/10 via-[#F6DDD1]/5 to-transparent" />
          <div className="relative z-10 flex flex-col items-center text-center px-4 pt-20 xl:pt-24 max-w-lg w-full mx-auto">
            <h2 className="font-serif text-[24px] lg:text-[25.5px] xl:text-[29px] font-medium tracking-tight text-[#0F172A] leading-tight whitespace-nowrap drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
              Plan Together for a Brighter Tomorrow
            </h2>
            <p className="mt-2.5 text-[14.5px] xl:text-[15.5px] text-[#0F172A] font-semibold tracking-wide leading-relaxed drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
              simple and transparent prenuptial agreement
            </p>
          </div>
        </aside>
      </div>
    );
  }

  return (
    <div className="flex h-screen max-h-screen overflow-hidden flex-col lg:flex-row bg-[#FFF8F3]">
      {/* Left side: Partner Registration Form with bright animated sunset aurora background, widened form box, and permanent scrollbar */}
      <div className="relative flex-1 h-full overflow-y-scroll [scrollbar-width:thin] [scrollbar-color:#7E93A8_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#7E93A8] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#5A738E] bg-[#FFF8F3] animate-sunset-aurora bg-gradient-to-br from-[#FFF9F5] via-[#FFF1EB] via-[#FFEBE3] to-[#FFF5EE]">
        {/* Bright, attractive animated sunset glowing orbs */}
        <div className="animate-sunset-orb-1 pointer-events-none absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full bg-gradient-to-br from-[#FF927A]/55 via-[#FFB38A]/40 to-transparent blur-3xl opacity-85" />
        <div className="animate-sunset-orb-2 pointer-events-none absolute top-1/4 -right-20 w-[450px] h-[450px] rounded-full bg-gradient-to-l from-[#FFAF6E]/60 via-[#FFD0A6]/45 to-transparent blur-3xl opacity-85" />
        <div className="animate-sunset-orb-3 pointer-events-none absolute -bottom-24 -left-20 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#FB7185]/45 via-[#F472B6]/35 to-transparent blur-3xl opacity-80" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />

        <div className="relative z-10 flex flex-col justify-between min-h-full px-6 py-2.5 sm:py-3.5 sm:px-10 lg:px-12 xl:px-14">
          <header className="pt-0.5 sm:pt-1">
            <Link
              href="/login"
              aria-label="Lets Prenup home"
              className="inline-flex items-center transition-opacity hover:opacity-85"
            >
              <BrandLogo surface="light" height={34} priority />
            </Link>
          </header>

          <main className="relative z-10 flex flex-col justify-center max-w-[660px] xl:max-w-[720px] w-full mx-auto my-auto py-1 sm:py-2">
            {/* Widened Frosted Glass Form Box */}
            <div className="relative rounded-2xl sm:rounded-3xl bg-white/85 backdrop-blur-xl border border-white/95 shadow-[0_20px_50px_-15px_rgba(255,160,130,0.22),0_1px_3px_rgba(0,0,0,0.03)] px-6 sm:px-8 py-5 sm:py-6 transition-all">
              {/* Card Header & Title */}
              <div className="mb-5 sm:mb-6">
                <h1 className="text-[25px] sm:text-[27px] font-bold text-[#16325C] tracking-tight">
                  Complete Your Registration
                </h1>
                <p className="mt-1 text-[13px] sm:text-[13.5px] text-[#64748B]">
                  Confirm your details and create a password to accept the invitation. You can use a different email if you prefer; we will verify it.
                </p>
              </div>

              <form onSubmit={onSubmit} noValidate className="space-y-2.5 sm:space-y-3">
                {/* Legal First Name, Legal Middle Name, Legal Last Name - Spacious 3-column layout */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <AuthInput
                      label="Legal First Name"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      autoComplete="given-name"
                      placeholder="First Name"
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <AuthInput
                      label="Legal Middle Name"
                      name="middleName"
                      value={form.middleName || ""}
                      onChange={handleChange}
                      autoComplete="additional-name"
                      placeholder="Middle Name"
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <AuthInput
                      label="Legal Last Name"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      autoComplete="family-name"
                      placeholder="Last Name"
                      className={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <AuthInput
                    label="Email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    placeholder="Enter your email"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <AuthInput
                    label="Phone"
                    type="tel"
                    inputMode="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    placeholder="Enter your phone"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <AuthInput
                    label="Password"
                    password
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    placeholder="Password"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <AuthInput
                    label="Confirm Password"
                    password
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    placeholder="Confirm Password"
                    className={inputStyle}
                  />
                </div>

                <div className="flex flex-col my-2.5 space-y-1.5">
                  <label className="flex items-center gap-2.5 text-[12.5px] text-[#1A202C] cursor-pointer select-none">
                    <div className="relative flex items-center justify-center flex-shrink-0">
                      <input
                        type="checkbox"
                        name="marketingConsent"
                        checked={form.marketingConsent}
                        onChange={handleChange}
                        className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-[#94A3B8] bg-white transition-all checked:border-[#E17A84] checked:bg-[#E17A84] focus:outline-none focus:ring-2 focus:ring-[#E17A84]/20"
                      />
                      <svg
                        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-2.5 w-2.5 stroke-white stroke-[2.5] opacity-0 transition-opacity peer-checked:opacity-100"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path d="M2.5 6L5 8.5L9.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span>I agree to receive occasional news and updates.</span>
                  </label>

                  <div>
                    <label className="flex items-center gap-2.5 text-[12.5px] text-[#1A202C] cursor-pointer select-none">
                      <div className="relative flex items-center justify-center flex-shrink-0">
                        <input
                          type="checkbox"
                          name="acceptedTerms"
                          checked={form.acceptedTerms}
                          onChange={handleChange}
                          className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-[#94A3B8] bg-white transition-all checked:border-[#E17A84] checked:bg-[#E17A84] focus:outline-none focus:ring-2 focus:ring-[#E17A84]/20"
                        />
                        <svg
                          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-2.5 w-2.5 stroke-white stroke-[2.5] opacity-0 transition-opacity peer-checked:opacity-100"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path d="M2.5 6L5 8.5L9.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span>
                        I accept the{" "}
                        <Link
                          href="/terms"
                          className="text-[#1A202C] font-semibold underline decoration-slate-400 cursor-pointer hover:text-black"
                        >
                          Terms &amp; Conditions
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy-policy"
                          className="text-[#1A202C] font-semibold underline decoration-slate-400 cursor-pointer hover:text-black"
                        >
                          Privacy Policy
                        </Link>
                        .
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-3 sm:mt-3.5 h-[42px] sm:h-[44px] rounded-xl border border-[#2A3752] bg-[#2A3752] hover:bg-[#1B2436] hover:border-[#1B2436] hover:shadow-[0_6px_22px_rgba(27,36,54,0.35)] active:bg-[#0F1522] active:border-[#0F1522] active:scale-[0.98] text-white text-[14.5px] font-semibold tracking-wide transition-all duration-200 shadow-sm cursor-pointer flex items-center justify-center disabled:opacity-50"
                >
                  {isLoading ? <span>Please wait...</span> : "Create Account"}
                </button>

                <div className="mt-2.5 text-[13px] text-center text-[#1A202C]">
                  Already have an account?{" "}
                  <Link
                    className="font-semibold text-[#16325C] underline hover:text-black ml-1 transition-colors"
                    href="/login"
                  >
                    Sign in
                  </Link>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>

      {/* Right side: Couple Sunset Aesthetic Panel - 32% to 33% width in full crisp color */}
      <aside className="relative hidden w-full lg:flex lg:w-[32%] xl:w-[33%] flex-col justify-between overflow-hidden bg-[#D4A6B0] h-full">
        {/* Scenic Background Image - portrait couple sunset */}
        <div
          className="absolute inset-0 bg-cover bg-bottom bg-no-repeat"
          style={{ backgroundImage: `url('/images/auth-couple-bg.jpg')` }}
        />

        {/* Soft edge transition strictly on the upper sky portion (top ~45%) - couples at the bottom remain 100% untouched and natural */}
        <div className="pointer-events-none absolute top-0 left-0 w-16 h-[45%] bg-gradient-to-r from-[#F6DDD1]/10 via-[#F6DDD1]/5 to-transparent" />

        {/* Centered Editorial Text */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 pt-20 xl:pt-24 max-w-lg w-full mx-auto">
          <h2 className="font-serif text-[24px] lg:text-[25.5px] xl:text-[29px] font-medium tracking-tight text-[#0F172A] leading-tight whitespace-nowrap drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
            Plan Together for a Brighter Tomorrow
          </h2>
          <p className="mt-2.5 text-[14.5px] xl:text-[15.5px] text-[#0F172A] font-semibold tracking-wide leading-relaxed drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
            simple and transparent prenuptial agreement
          </p>
        </div>
      </aside>
    </div>
  );
}
