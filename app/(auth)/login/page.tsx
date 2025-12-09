"use client"

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/images/logo.png";
import LinkedIn from "@/images/icons/linkedin.png";
import Microsoft from "@/images/icons/microsoft.png";
import Google from "@/images/icons/google.png";
import EyeOff from "@/images/icons/eye.png";
import Eye from "@/images/icons/eye-off.png";

export default function LoginPageStatic() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <section
      className={`relative h-full bg-white min-h-[100vh] flex items-center justify-center`}
    >
      {/* Logo */}
      <div className="absolute max-2xl:p-8 flex top-[40px] left-[40px] items-center">
        <Image src={Logo} width={50} height={50} alt="ez-logo" className="mr-2" />
        <p className="text-[23px] font-medium">
          <strong>Lets</strong>Prenup
        </p>
      </div>

      {/* Form */}
      <div className="w-[480px]">
        <h3 className="text-[32px] text-[#495060] font-medium text-center mb-5">
          Welcome Back!
        </h3>

        <form>
          {/* Social buttons */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <button type="button" className="flex-1 py-3 flex items-center justify-center gap-2 font-medium border border-[#888f97] text-[#414c58] hover:bg-[#e7e9ea] text-[12px] rounded">
              <Image src={LinkedIn} height={20} width={20} alt="LinkedIn" />
              LinkedIn
            </button>
            <button type="button" className="flex-1 py-3 flex items-center justify-center gap-2 font-medium border border-[#888f97] text-[#414c58] hover:bg-[#e7e9ea] text-[12px] rounded">
              <Image src={Microsoft} height={20} width={20} alt="Microsoft" />
              Microsoft
            </button>
            <button type="button" className="flex-1 py-3 flex items-center justify-center gap-2 font-medium border border-[#888f97] text-[#414c58] hover:bg-[#e7e9ea] text-[12px] rounded">
              <Image src={Google} height={20} width={20} alt="Google" />
              Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center px-3 my-8">
            <span className="flex-1 border-b border-[#b8bcc0]" />
            <span className="mx-5 text-xs text-gray-500">Or use your work email</span>
            <span className="flex-1 border-b border-[#b8bcc0]" />
          </div>

          {/* Email */}
          <div className="mt-4">
            <input
              type="email"
              placeholder="Enter your Work email"
              className="w-full px-4 py-2 mt-2 border border-[#414c58] rounded focus:outline-[#6a69ff] placeholder:text-[12px]"
              required
            />
          </div>

          {/* Password */}
          <div className="relative mt-4">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-2 mt-2 border border-[#414c58] rounded focus:outline-[#6a69ff] placeholder:text-[12px]"
              required
            />
            <Image
              src={passwordVisible ? Eye : EyeOff}
              height={20}
              width={20}
              alt="Show/Hide"
              className="absolute mt-1 -translate-y-1/2 cursor-pointer right-3 top-1/2"
              onClick={() => setPasswordVisible(!passwordVisible)}
            />
          </div>

          {/* Forgot password */}
          <div className="flex justify-end my-4">
            <a href="#" className="text-[14px] text-[#6a69ff]">
              Forgot Password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full px-6 py-2 mt-4 text-white text-[14px] bg-[#6a69ff] rounded"
          >
            Sign In
          </button>

          {/* Sign up link */}
          <div className="mt-5 text-[14px] text-[#495060]">
            Need an account?{" "}
            <Link className="text-[#6a69ff]" href="/auth/signup">
              Create an account for free
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
