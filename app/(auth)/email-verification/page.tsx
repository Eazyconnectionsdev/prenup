"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import VerificationInput from "react-verification-input";
import Logo from "@/images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { emailVerification } from "@/store/asyncThunk/authThunk";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function EmailVerification() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const { isLoading, user : {email} } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await dispatch(
        emailVerification({ otp: code, email })
      ).unwrap();

      if (result.success) {
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.log("Error while email verification", error.message);
      if (error.message) {
        toast.error(error.message || "Error while email verification");
      }
    }
  };

  return (
    <section className="min-h-screen flex flex-col">
      {/* Logo */}
      <header className="px-10 py-10">
        <Link href="/" className="flex items-center gap-2">
          <Image src={Logo} width={40} height={40} alt="Logo" />
          <span className="text-lg font-semibold">
            <span className="font-bold">Eazy</span>Connections
          </span>
        </Link>
      </header>

      {/* Main */}
      <main className="mx-auto mt-20 px-6">
        <div className="w-full max-w-lg p-8">
          <h1 className="text-2xl font-semibold text-gray-900 text-center">
            Verify your email
          </h1>

          <p className="mt-3 text-sm text-gray-600 text-center">
            We sent a 6-digit verification code to
          </p>

          <p className="mt-1 text-sm font-medium text-gray-900 text-center">
            {email}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <VerificationInput
              value={code}
              onChange={setCode}
              length={6}
              validChars="0-9"
              inputProps={{ inputMode: "numeric" }}
              classNames={{
                container: "flex justify-between gap-2",
                character:
                  "w-12 h-12 rounded-lg border border-gray-300 text-lg font-medium text-gray-900 flex items-center justify-center focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200",
                characterInactive: "bg-white",
                characterSelected: "border-indigo-500 ring-2 ring-indigo-200",
              }}
            />

            <button
              type="submit"
              disabled={code.length !== 6 || isLoading}
              className="w-full py-3 rounded-lg bg-indigo-600 text-white font-medium transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {
                isLoading ? <span>Please wait...</span> : "Verify Email"
              }
              
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Didn&apos;t receive the code?{" "}
            <Link
              href="/login"
              className="text-indigo-600 font-medium hover:underline"
            >
              Resend
            </Link>
          </div>
        </div>
      </main>
    </section>
  );
}
