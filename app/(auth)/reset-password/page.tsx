"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AppDispatch } from "@/store/store";
import { resetPassword, validateResetToken } from "@/store/asyncThunk/authThunk";
import AuthInput from "@/components/auth/AuthInput";
import AuthHeader from "@/components/auth/AuthHeader";
import FormAlert from "@/components/auth/FormAlert";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/validations/auth";
import { getErrorMessage } from "@/lib/getErrorMessage";

const INVALID_LINK =
  "This password reset link is invalid or has expired. Request a new one to continue.";

/** Shared card shell so every state of the page looks the same. */
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#e6e6f5] bg-white p-7 shadow-[0_8px_30px_rgba(106,105,255,0.08)]">
      {children}
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#f2f2ff] text-[22px]">
      <span aria-hidden>{children}</span>
    </div>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();

  const token = searchParams.get("token")?.trim() ?? "";
  const email = searchParams.get("email")?.trim().toLowerCase() ?? "";

  // "checking" while the link is verified, so we never show a form the
  // server would reject anyway. A link missing either half of its query
  // is dead on arrival, so start out invalid rather than calling the API.
  const [status, setStatus] = useState<
    "checking" | "ready" | "invalid" | "done"
  >(() => (token && email ? "checking" : "invalid"));
  const [linkError, setLinkError] = useState(INVALID_LINK);

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onTouched",
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (!token || !email) return;

    let active = true;
    dispatch(validateResetToken({ email, token }))
      .unwrap()
      .then(() => {
        if (active) setStatus("ready");
      })
      .catch((error) => {
        if (!active) return;
        setLinkError(getErrorMessage(error, INVALID_LINK));
        setStatus("invalid");
      });

    return () => {
      active = false;
    };
  }, [dispatch, email, token]);

  const onSubmit = async (values: ResetPasswordFormValues) => {
    clearErrors("root");
    try {
      await dispatch(
        resetPassword({ email, token, newPassword: values.password }),
      ).unwrap();
      setStatus("done");
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Unable to reset your password. Please try again.",
      );

      // A dead token can't be fixed by editing the form, so swap the whole
      // card out for the "request a new link" state.
      if (/link|token/i.test(message)) {
        setLinkError(message);
        setStatus("invalid");
        return;
      }
      if (/password/i.test(message)) {
        setError("password", { type: "server", message });
        setFocus("password");
        return;
      }
      setError("root", { type: "server", message });
    }
  };

  if (status === "checking") {
    return (
      <Card>
        <div className="py-6 text-center">
          <span
            aria-hidden
            className="mx-auto mb-4 block h-7 w-7 animate-spin rounded-full border-2 border-[#e6e6f5] border-t-[#6a69ff]"
          />
          <p className="text-[13px] text-[#6b7280]">Checking your link...</p>
        </div>
      </Card>
    );
  }

  if (status === "invalid") {
    return (
      <Card>
        <div className="text-center">
          <Badge>&#9888;</Badge>
          <h3 className="text-[22px] font-medium text-[#495060]">
            Link no longer valid
          </h3>
          <p className="mt-3 text-[13px] leading-relaxed text-[#6b7280]">
            {linkError}
          </p>

          <Link
            href="/forgot-password"
            className="mt-6 block w-full rounded bg-[#6a69ff] px-6 py-2 text-center text-[14px] text-white transition-colors hover:bg-[#5958e6]"
          >
            Request a New Link
          </Link>

          <div className="mt-5 text-[12px] text-[#495060]">
            <Link className="text-[#6a69ff] hover:underline" href="/login">
              Back to sign in
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  if (status === "done") {
    return (
      <Card>
        <div className="text-center">
          <Badge>&#10003;</Badge>
          <h3 className="text-[22px] font-medium text-[#495060]">
            Password updated
          </h3>
          <p className="mt-3 text-[13px] leading-relaxed text-[#6b7280]">
            Your password has been changed. Sign in with your new password to
            pick up where you left off.
          </p>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="mt-6 w-full rounded bg-[#6a69ff] px-6 py-2 text-[14px] text-white transition-colors hover:bg-[#5958e6]"
          >
            Continue to Sign In
          </button>
        </div>
      </Card>
    );
  }

  return (
    <>
      <h3 className="mb-2 text-center text-[24px] font-medium text-[#495060] sm:text-[28px]">
        Set a new password
      </h3>
      <p className="mb-8 text-center text-[13px] leading-relaxed text-[#6b7280]">
        Choose a new password for{" "}
        <span className="font-medium text-[#495060]">{email}</span>. It must be
        at least 8 characters long.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormAlert message={errors.root?.message} />

        <div className="mt-4">
          <AuthInput
            label="New Password"
            password
            autoComplete="new-password"
            autoFocus
            placeholder="New password"
            error={errors.password}
            {...register("password")}
          />
        </div>

        <div className="mt-4">
          <AuthInput
            label="Confirm New Password"
            password
            autoComplete="new-password"
            placeholder="Re-enter new password"
            error={errors.confirmPassword}
            {...register("confirmPassword")}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded bg-[#6a69ff] px-6 py-2 text-[14px] text-white transition-colors hover:bg-[#5958e6] disabled:bg-[#6a69ff]/50"
        >
          {isSubmitting ? "Please wait..." : "Reset Password"}
        </button>
      </form>

      <div className="mt-5 text-center text-[12px] text-[#495060]">
        Changed your mind?{" "}
        <Link className="text-[#6a69ff] hover:underline" href="/login">
          Back to sign in
        </Link>
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <AuthHeader />

      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8">
        <div className="w-full max-w-[420px]">
          {/* useSearchParams needs a boundary while the shell is prerendered. */}
          <Suspense
            fallback={
              <Card>
                <div className="py-6 text-center">
                  <span
                    aria-hidden
                    className="mx-auto mb-4 block h-7 w-7 animate-spin rounded-full border-2 border-[#e6e6f5] border-t-[#6a69ff]"
                  />
                  <p className="text-[13px] text-[#6b7280]">Loading...</p>
                </div>
              </Card>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
