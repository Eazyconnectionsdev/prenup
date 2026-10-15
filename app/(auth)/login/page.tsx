"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { LoginUser, resendOtp } from "@/store/asyncThunk/authThunk";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthInput from "@/components/auth/AuthInput";
import AuthHeader from "@/components/auth/AuthHeader";
import FormAlert from "@/components/auth/FormAlert";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { setUserProfileData } from "@/store/slices/authSlice";
import Image from "next/image";
import Google from "@/images/icons/google.png";


export default function LoginPageStatic() {
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
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    // Re-validate as the user types so the red message clears itself.
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    clearErrors("root");
    try {
      await dispatch(LoginUser(values)).unwrap();
      toast.success("Signed in successfully");
      router.refresh();
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Unable to sign in. Please try again.",
      );

      // Unverified accounts are sent to the OTP screen with a fresh code.
      if (/not verified/i.test(message)) {
        dispatch(
          setUserProfileData({ email: values.email.trim().toLowerCase() }),
        );
        dispatch(resendOtp(values.email.trim().toLowerCase()));
        toast.info("Please verify your email. We've sent you a new code.");
        router.push("/email-verification");
        return;
      }

      // Attach the server's complaint to the field it is about; anything
      // else becomes a form-level banner.
      if (/credential|password/i.test(message)) {
        setError("password", { type: "server", message });
        setFocus("password");
        return;
      }
      if (/email/i.test(message)) {
        setError("email", { type: "server", message });
        setFocus("email");
        return;
      }
      setError("root", { type: "server", message });
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

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => toast.info("Google sign-in is coming soon")}
                className="flex-1 py-3 flex items-center justify-center gap-2 font-medium border border-[#888f97] text-[#414c58] hover:bg-[#e7e9ea] text-[12px] rounded"
              >
                <Image src={Google} height={20} width={20} alt="" />
                Google
              </button>
            </div> */}

            {/* Divider */}
            {/* <div className="flex items-center px-3 my-8">
              <span className="flex-1 border-b border-[#b8bcc0]" />
              <span className="mx-5 text-[10px] text-gray-500">
                Or use your work email
              </span>
              <span className="flex-1 border-b border-[#b8bcc0]" />
            </div> */}

            <FormAlert message={errors.root?.message} />

            {/* Email */}
            <div className="mt-4">
              <AuthInput
                label="Email"
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
                label="Password"
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
                className="text-[12px] text-[#6a69ff] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-2 mt-4 disabled:bg-[#6a69ff]/50 bg-[#6a69ff] text-white text-[14px] rounded transition-colors hover:bg-[#5958e6]"
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
