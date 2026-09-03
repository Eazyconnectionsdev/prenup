"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import Logo from "@/images/logo.png";
import Eye from "@/images/icons/eye.png";
import EyeOff from "@/images/icons/eye-off.png";

import { AppDispatch, RootState } from "@/store/store";
import { acceptInvite } from "@/store/asyncThunk/authThunk";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
}

interface InviteData {
  token: string;
  caseId: string;
}

export default function RegisterPartnerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const dispatch = useDispatch<AppDispatch>();

  const { isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  const [showPassword, setShowPassword] =
    useState<boolean>(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [inviteData, setInviteData] =
    useState<InviteData>({
      token: "",
      caseId: "",
    });

  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });

  useEffect(() => {
    setInviteData({
      token: searchParams.get("token") ?? "",
      caseId: searchParams.get("caseId") ?? "",
    });

    
setForm((prev) => ({
  ...prev,
  firstName: searchParams.get("firstName") ?? "",
  lastName: searchParams.get("lastName") ?? "",
  email: searchParams.get("email") ?? "",
  phone: searchParams.get("mobileNumber") ?? "",
}));


  }, [searchParams]);

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
  await dispatch(
    acceptInvite({
      token: inviteData.token,
      caseId: inviteData.caseId,
      password: form.password,
    })
  ).unwrap();

  toast.success(
    "Account created successfully"
  );

  router.push("/auth/login");
} catch (error: unknown) {
  console.error(error);

  const errorMessage =
    error instanceof Error
      ? error.message
      : "Failed to create account";

  toast.error(errorMessage);
}

  };

  return (<section className="relative flex min-h-screen overflow-hidden bg-white">
    {/* Logo */} <div className="absolute top-10 left-10 flex items-center gap-3"> <Image
      src={Logo}
      alt="LetsPrenup Logo"
      width={45}
      height={45}
    />


      <p className="text-[23px] font-medium">
        <strong>Lets</strong>Prenup
      </p>
    </div>

    {/* Form */}
    <div className="flex flex-1 items-center justify-center px-6">
      <div className="w-full max-w-[500px]">
        <h1 className="mb-2 text-center text-[32px] font-medium text-[#495060]">
          Complete Your Registration
        </h1>

        <p className="mb-8 text-center text-[#7A7A7A]">
          Create your password to accept the invitation.
        </p>

        <form
          onSubmit={onSubmit}
          className="space-y-4"
        >
          {/* First & Last Name */}
          <div className="flex gap-4">
            <input
              type="text"
              value={form.firstName}
              disabled
              placeholder="First Name"
              className="w-full rounded border border-gray-300 bg-gray-100 px-4 py-3 text-gray-600"
            />

            <input
              type="text"
              value={form.lastName}
              disabled
              placeholder="Last Name"
              className="w-full rounded border border-gray-300 bg-gray-100 px-4 py-3 text-gray-600"
            />
          </div>

          {/* Email */}
          <input
            type="email"
            value={form.email}
            disabled
            placeholder="Email"
            className="w-full rounded border border-gray-300 bg-gray-100 px-4 py-3 text-gray-600"
          />

          {/* Phone */}
          <input
            type="text"
            value={form.phone}
            disabled
            placeholder="Phone Number"
            className="w-full rounded border border-gray-300 bg-gray-100 px-4 py-3 text-gray-600"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full rounded border border-gray-300 px-4 py-3 pr-12 outline-none focus:border-[#6A69FF]"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              <Image
                src={
                  showPassword
                    ? EyeOff
                    : Eye
                }
                alt={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                width={20}
                height={20}
              />
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full rounded border border-gray-300 px-4 py-3 pr-12 outline-none focus:border-[#6A69FF]"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (prev) => !prev
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2"
              aria-label={
                showConfirmPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              <Image
                src={
                  showConfirmPassword
                    ? EyeOff
                    : Eye
                }
                alt={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
                width={20}
                height={20}
              />
            </button>
          </div>

          {/* Terms */}
          <label className="flex items-start text-sm text-[#495060]">
            <input
              type="checkbox"
              name="acceptedTerms"
              checked={form.acceptedTerms}
              onChange={handleChange}
              className="mr-2 mt-1"
            />

            <span>
              I accept the{" "}
              <Link
                href="/terms"
                className="text-[#6A69FF]"
              >
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="text-[#6A69FF]"
              >
                Privacy Policy
              </Link>
            </span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded bg-[#6A69FF] py-3 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading
              ? "Please wait..."
              : "Create Account"}
          </button>

          {/* Login Link */}
          <div className="text-center text-sm text-[#495060]">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-[#6A69FF]"
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  </section>


);
}
