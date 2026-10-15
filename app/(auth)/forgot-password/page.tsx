"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AppDispatch } from "@/store/store";
import { requestPasswordReset } from "@/store/asyncThunk/authThunk";
import AuthInput from "@/components/auth/AuthInput";
import AuthHeader from "@/components/auth/AuthHeader";
import FormAlert from "@/components/auth/FormAlert";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/validations/auth";
import { getErrorMessage } from "@/lib/getErrorMessage";

// The backend ignores a second request within a minute, so match it here.
const RESEND_COOLDOWN_SECONDS = 60;

export default function ForgotPasswordPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onTouched",
    defaultValues: { email: "" },
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const sendLink = async (email: string) => {
    clearErrors("root");
    try {
      await dispatch(requestPasswordReset(email)).unwrap();
      setSentTo(email);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Unable to send the reset link. Please try again.",
      );
      if (/email/i.test(message)) {
        setError("email", { type: "server", message });
        setFocus("email");
        return;
      }
      setError("root", { type: "server", message });
    }
  };

  const onSubmit = ({ email }: ForgotPasswordFormValues) =>
    sendLink(email.trim().toLowerCase());

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <AuthHeader />

      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8">
        <div className="w-full max-w-[420px]">
          {sentTo ? (
            /* ---------------- Link sent ---------------- */
            <div className="rounded-xl border border-[#e6e6f5] bg-white p-7 text-center shadow-[0_8px_30px_rgba(106,105,255,0.08)]">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#f2f2ff] text-[22px]">
                <span aria-hidden>&#9993;</span>
              </div>

              <h3 className="text-[22px] font-medium text-[#495060]">
                Check your inbox
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed text-[#6b7280]">
                If an account exists for{" "}
                <span className="font-medium text-[#495060]">{sentTo}</span>,
                we&rsquo;ve sent a link to reset your password. The link expires
                in a couple of hours and can only be used once.
              </p>

              <FormAlert message={errors.root?.message} />

              <p className="mt-6 text-[12px] text-[#6b7280]">
                Didn&rsquo;t get it? Check your spam folder, or{" "}
                <button
                  type="button"
                  onClick={() => sendLink(sentTo)}
                  disabled={isSubmitting || cooldown > 0}
                  className="font-medium text-[#6a69ff] hover:underline disabled:no-underline disabled:opacity-50"
                >
                  {isSubmitting
                    ? "sending..."
                    : cooldown > 0
                      ? `resend in ${cooldown}s`
                      : "send it again"}
                </button>
                .
              </p>

              <div className="mt-6 border-t border-[#f0f0f5] pt-5">
                <button
                  type="button"
                  onClick={() => {
                    setSentTo(null);
                    clearErrors();
                  }}
                  className="text-[12px] text-[#6a69ff] hover:underline"
                >
                  Use a different email
                </button>
              </div>
            </div>
          ) : (
            /* ---------------- Request form ---------------- */
            <>
              <h3 className="mb-2 text-center text-[24px] font-medium text-[#495060] sm:text-[28px]">
                Forgot your password?
              </h3>
              <p className="mb-8 text-center text-[13px] leading-relaxed text-[#6b7280]">
                Enter the email you signed up with and we&rsquo;ll send you a
                link to choose a new password.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <FormAlert message={errors.root?.message} />

                <div className="mt-4">
                  <AuthInput
                    label="Email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    placeholder="Enter your work email"
                    error={errors.email}
                    {...register("email")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 w-full rounded bg-[#6a69ff] px-6 py-2 text-[14px] text-white transition-colors hover:bg-[#5958e6] disabled:bg-[#6a69ff]/50"
                >
                  {isSubmitting ? "Please wait..." : "Send Reset Link"}
                </button>
              </form>

              <div className="mt-5 text-center text-[12px] text-[#495060]">
                Remembered it?{" "}
                <Link className="text-[#6a69ff] hover:underline" href="/login">
                  Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
