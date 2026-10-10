"use client";

import Image from "next/image";
import Link from "next/link";
import Google from "@/images/icons/google.png";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { LoginUser, resendOtp } from "@/store/asyncThunk/authThunk";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthInput from "@/components/auth/AuthInput";
import AuthHeader from "@/components/auth/AuthHeader";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { setUserProfileData } from "@/store/slices/authSlice";

export default function LoginPageStatic() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Validation problems are shown as a toast (first error only).
  const onInvalid = (errs: FieldErrors<LoginFormValues>) => {
    const first = Object.values(errs)[0];
    toast.error(first?.message ?? "Please check the form and try again");
  };

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await dispatch(LoginUser(values)).unwrap();
      toast.success("Signed in successfully");
      router.refresh();
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Unable to sign in. Please try again.",
      );
      if (/not verified/i.test(message)) {
        dispatch(
          setUserProfileData({ email: values.email.trim().toLowerCase() }),
        );
        dispatch(resendOtp(values.email.trim().toLowerCase()));
        toast.info("Please verify your email. We've sent you a new code.");
        router.push("/email-verification");
        return;
      }
      toast.error(message);
      setFocus("password");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <AuthHeader />

      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8">
        <div className="w-full max-w-[420px]">
          <h3 className="text-[24px] sm:text-[28px] text-[#495060] font-medium text-center mb-5">
            Welcome Back!
          </h3>

          <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
            {/* Social buttons */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => toast.info("Google sign-in is coming soon")}
                className="flex-1 py-2 flex items-center cursor-pointer justify-center gap-2 font-medium border border-[#888f97] text-[#414c58] hover:bg-[#e7e9ea] text-[14px] rounded"
              >
                <Image src={Google} height={20} width={20} alt="" />
                Google
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center px-3 my-8">
              <span className="flex-1 border-b border-[#b8bcc0]" />
              <span className="mx-5 text-[10px] text-gray-500">
                Or use your work email
              </span>
              <span className="flex-1 border-b border-[#b8bcc0]" />
            </div>

            {/* Email */}
            <div className="mt-4">
              <AuthInput
                type="email"
                autoComplete="email"
                placeholder="Enter your Work email"
                error={errors.email}
                {...register("email")}
              />
            </div>

            {/* Password */}
            <div className="mt-4">
              <AuthInput
                password
                autoComplete="current-password"
                placeholder="Password"
                error={errors.password}
                {...register("password")}
              />
            </div>

            {/* Forgot password */}
            <div className="flex justify-end my-4">
              <Link
                href="/forgot-password"
                className="text-[12px] text-[#6a69ff]"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-2 mt-4 disabled:bg-[#6a69ff]/50 bg-[#6a69ff] text-white text-[14px] rounded"
            >
              {isLoading ? <span>Please wait...</span> : "Sign In"}
            </button>

            {/* Sign up link */}
            <div className="mt-5 text-[12px] text-[#495060]">
              Need an account?{" "}
              <Link className="text-[#6a69ff]" href="/register">
                Create an account for free
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}