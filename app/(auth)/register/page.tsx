"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { registerUser } from "@/store/asyncThunk/authThunk";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { normalizePhone } from "@/lib/utils";
import AuthInput from "@/components/auth/AuthInput";
import FieldError from "@/components/auth/FieldError";
import FormAlert from "@/components/auth/FormAlert";
import BrandLogo from "@/components/brand/BrandLogo";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/lib/validations/auth";
import { getErrorMessage } from "@/lib/getErrorMessage";

export default function SignUpPageStatic() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    clearErrors,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      marketingConsent: false,
      acceptedTerms: false,
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    clearErrors("root");

    const payload = {
      firstName: values.firstName.trim(),
      middleName: values.middleName ? values.middleName.trim() : undefined,
      lastName: values.lastName.trim(),
      email: values.email.trim().toLowerCase(),
      phone: normalizePhone(values.phone) || undefined,
      password: values.password,
      acceptedTerms: values.acceptedTerms,
      marketingConsent: values.marketingConsent,
    };

    try {
      const result = await dispatch(registerUser(payload)).unwrap();
      if (result?.success) {
        toast.success(
          "Account created. Check your email for the verification code.",
        );
        router.push("/email-verification");
      }
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Unable to create your account. Please try again.",
      );

      if (/email/i.test(message)) {
        setError("email", { type: "server", message });
        setFocus("email");
        return;
      }
      if (/password/i.test(message)) {
        setError("password", { type: "server", message });
        setFocus("password");
        return;
      }
      if (/phone/i.test(message)) {
        setError("phone", { type: "server", message });
        setFocus("phone");
        return;
      }
      if (/terms|privacy/i.test(message)) {
        setError("acceptedTerms", { type: "server", message });
        return;
      }
      setError("root", { type: "server", message });
    }
  };

  const inputStyle = "h-[40px]";

  return (
    <div className="flex h-screen max-h-screen overflow-hidden flex-col lg:flex-row bg-[#FFF8F3]">
      {/* Left side: Registration Form with bright animated sunset aurora background, widened form box, and permanent scrollbar */}
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
              {/* Card Header & Title - increased breathing room below heading */}
              <div className="mb-7 sm:mb-8">
                <h1 className="text-[25px] sm:text-[27px] font-bold text-[#16325C] tracking-tight">
                  Create Your Free Account
                </h1>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-2.5 sm:space-y-3">
                <FormAlert message={errors.root?.message} />

                {/* Legal First Name, Middle Name, Legal Last Name - Spacious 3-column layout */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <AuthInput
                      label="Legal First Name"
                      autoComplete="given-name"
                      placeholder="First Name"
                      error={errors.firstName}
                      className={inputStyle}
                      {...register("firstName")}
                    />
                  </div>
                  <div>
                    <AuthInput
                      label="Legal Middle Name"
                      autoComplete="additional-name"
                      placeholder="Middle Name"
                      error={errors.middleName}
                      className={inputStyle}
                      {...register("middleName")}
                    />
                  </div>
                  <div>
                    <AuthInput
                      label="Legal Last Name"
                      autoComplete="family-name"
                      placeholder="Last Name"
                      error={errors.lastName}
                      className={inputStyle}
                      {...register("lastName")}
                    />
                  </div>
                </div>

                <div>
                  <AuthInput
                    label="Email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    error={errors.email}
                    className={inputStyle}
                    {...register("email")}
                  />
                </div>

                <div>
                  <AuthInput
                    label="Phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="Enter your phone"
                    error={errors.phone}
                    className={inputStyle}
                    {...register("phone")}
                  />
                </div>

                <div>
                  <AuthInput
                    label="Password"
                    password
                    autoComplete="new-password"
                    placeholder="Password"
                    error={errors.password}
                    className={inputStyle}
                    {...register("password")}
                  />
                </div>

                <div>
                  <AuthInput
                    label="Confirm Password"
                    password
                    autoComplete="new-password"
                    placeholder="Confirm Password"
                    error={errors.confirmPassword}
                    className={inputStyle}
                    {...register("confirmPassword")}
                  />
                </div>

                <div className="flex flex-col my-2.5 space-y-1.5">
                  <label className="flex items-center gap-2.5 text-[12.5px] text-[#1A202C] cursor-pointer select-none">
                    <div className="relative flex items-center justify-center flex-shrink-0">
                      <input
                        type="checkbox"
                        className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-[#94A3B8] bg-white transition-all checked:border-[#E17A84] checked:bg-[#E17A84] focus:outline-none focus:ring-2 focus:ring-[#E17A84]/20"
                        {...register("marketingConsent")}
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
                          className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-[#94A3B8] bg-white transition-all checked:border-[#E17A84] checked:bg-[#E17A84] focus:outline-none focus:ring-2 focus:ring-[#E17A84]/20"
                          aria-invalid={!!errors.acceptedTerms}
                          aria-describedby={
                            errors.acceptedTerms ? "accepted-terms-error" : undefined
                          }
                          {...register("acceptedTerms")}
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
                        <span className="text-[#1A202C] font-semibold underline decoration-slate-400 cursor-pointer hover:text-black">
                          Terms &amp; Conditions
                        </span>{" "}
                        and{" "}
                        <span className="text-[#1A202C] font-semibold underline decoration-slate-400 cursor-pointer hover:text-black">
                          Privacy Policy
                        </span>
                        .
                      </span>
                    </label>
                    <FieldError
                      error={errors.acceptedTerms}
                      id="accepted-terms-error"
                    />
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

        {/* Centered Editorial Text - lowered ~1 inch down, heading font size increased */}
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
