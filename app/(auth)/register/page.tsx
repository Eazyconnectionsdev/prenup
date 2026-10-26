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
    <div className="flex h-screen max-h-screen overflow-hidden flex-col bg-[#FAF0E8] lg:flex-row">
      {/* Left side: Registration Form with responsive scroll support */}
      <div className="flex-1 h-full overflow-y-auto bg-[#FAF0E8] [scrollbar-width:thin] [scrollbar-color:#CBD5E1_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#CBD5E1] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#94A3B8]">
        <div className="flex flex-col justify-between min-h-full px-6 py-4 sm:px-10 lg:px-12 xl:px-14">
          <header className="pt-1 sm:pt-2">
            <Link
              href="/login"
              aria-label="Lets Prenup home"
              className="inline-flex items-center transition-opacity hover:opacity-85"
            >
              <BrandLogo surface="light" height={32} priority />
            </Link>
          </header>

          <main className="flex flex-col justify-center max-w-[500px] w-full mx-auto my-auto py-2">
            <h1 className="text-[25px] sm:text-[27px] font-bold text-[#1A202C] tracking-tight mb-3">
              Create your free account
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-2.5">
              <FormAlert message={errors.root?.message} />

              {/* Legal First Name, Middle Name, Legal Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
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
                    label="Middle Name"
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
                  label="Work Email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your work email"
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
                  placeholder="Enter your phone (optional)"
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
                <label className="flex items-center gap-2.5 text-[12.5px] text-[#4A5568] cursor-pointer select-none">
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
                  <label className="flex items-center gap-2.5 text-[12.5px] text-[#4A5568] cursor-pointer select-none">
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
                      <span className="text-[#1A202C] font-medium underline decoration-slate-400 cursor-pointer hover:text-black">
                        Terms &amp; Conditions
                      </span>{" "}
                      and{" "}
                      <span className="text-[#1A202C] font-medium underline decoration-slate-400 cursor-pointer hover:text-black">
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
                className="w-full mt-3 h-[42px] rounded-lg border border-[#4B5563] bg-[#E8E2D9] hover:bg-[#DDD6CC] active:scale-[0.99] text-[#111827] text-[14px] font-semibold tracking-wide transition-all disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {isLoading ? <span>Please wait...</span> : "Create Account"}
              </button>

              <div className="mt-2 text-[12.5px] text-[#4A5568]">
                Already have an account?{" "}
                <Link
                  className="font-semibold text-[#1A202C] underline hover:text-black ml-1"
                  href="/login"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </main>

          <div className="pb-1 text-transparent select-none text-[10px]">.</div>
        </div>
      </div>

      {/* Right side: Couple Sunset Aesthetic Panel - 32% to 33% width */}
      <aside className="relative hidden w-full lg:flex lg:w-[32%] xl:w-[33%] flex-col justify-between overflow-hidden bg-[#FAF0E8] h-full border-l border-black/5">
        {/* Scenic Background Image - portrait couple sunset */}
        <div
          className="absolute inset-0 bg-cover bg-bottom bg-no-repeat"
          style={{ backgroundImage: `url('/images/auth-couple-bg.jpg')` }}
        />

        {/* Centered Editorial Text - single line heading with +1 font size */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 pt-10 xl:pt-14 max-w-md w-full mx-auto">
          <h2 className="font-serif text-[20px] sm:text-[22px] xl:text-[24px] font-normal tracking-tight text-[#0F172A] leading-tight whitespace-nowrap drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
            Plan together for a brighter tomorrow
          </h2>
          <p className="mt-2 text-[13px] xl:text-[14px] text-[#0F172A] font-semibold tracking-wide leading-relaxed drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
            simple and transparent prenuptial agreement
          </p>
        </div>
      </aside>
    </div>
  );
}
