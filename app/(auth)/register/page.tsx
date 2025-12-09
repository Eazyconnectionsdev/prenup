"use client"

import Image from "next/image";
import Link from "next/link";
import Logo from "@/images/logo.png";
import LinkedIn from "@/images/icons/linkedin.png";
import Microsoft from "@/images/icons/microsoft.png";
import Google from "@/images/icons/google.png";
import EyeOff from "@/images/icons/eye.png";
import Eye from "@/images/icons/eye-off.png";
import Tick from "@/images/icons/tick.svg";
import People from "@/images/people.svg";

const Points = [
  "Get 50 free credits every month",
  "Real time email and phone verification",
  "Native integrations to popular CRMs",
];

export default function SignUpPageStatic() {
  return (
    <section
      className={`bg-white overflow-hidden min-h-[100vh] 2xl:h-[100vh] flex max-2xl:flex-col`}
    >
      {/* Logo */}
      <div className="absolute max-2xl:p-8 flex top-[40px] left-[40px] items-center">
        <Image src={Logo} width={50} height={50} alt="ez-logo" className="mr-2" />
        <p className="text-[23px] font-medium">
          <strong>Lets</strong>Prenup
        </p>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center flex-1 max-2xl:pb-16">
        <div className="w-[480px]">
          <h3 className="text-[32px] text-[#495060] font-medium text-center mb-5">
            Create your free account
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
              <span className="flex-1 border-b border-[#b8bcc0]"></span>
              <span className="mx-5 text-xs text-gray-500">Or use your work email</span>
              <span className="flex-1 border-b border-[#b8bcc0]"></span>
            </div>

            {/* Name fields */}
            <div className="flex gap-4 mt-4">
              <input type="text" placeholder="First Name" className="w-full px-4 py-2 border border-[#414c58] rounded focus:outline-[#6a69ff] placeholder:text-[12px]" />
              <input type="text" placeholder="Last Name" className="w-full px-4 py-2 border border-[#414c58] rounded focus:outline-[#6a69ff] placeholder:text-[12px]" />
            </div>

            {/* Email */}
            <div className="mt-4">
              <input type="email" placeholder="Enter your work email" className="w-full px-4 py-2 mt-2 border border-[#414c58] rounded focus:outline-[#6a69ff] placeholder:text-[12px]" />
            </div>

            {/* Phone */}
            <div className="mt-4">
              <input type="phone" placeholder="Enter your phone" className="w-full px-4 py-2 mt-2 border border-[#414c58] rounded focus:outline-[#6a69ff] placeholder:text-[12px]" />
            </div>

            {/* Password */}
            <div className="relative mt-4">
              <input type="password" placeholder="Password" className="w-full px-4 py-2 mt-2 border border-[#414c58] rounded focus:outline-[#6a69ff] placeholder:text-[12px]" />
              <Image src={EyeOff} height={20} width={20} alt="Show/Hide" className="absolute mt-1 -translate-y-1/2 cursor-pointer right-3 top-1/2" />
            </div>

            <div className="relative mt-4">
              <input type="password" placeholder="Confirm Password" className="w-full px-4 py-2 mt-2 border border-[#414c58] rounded focus:outline-[#6a69ff] placeholder:text-[12px]" />
              <Image src={EyeOff} height={20} width={20} alt="Show/Hide" className="absolute mt-1 -translate-y-1/2 cursor-pointer right-3 top-1/2" />
            </div>

            {/* Checkboxes */}
            <div className="flex flex-col my-4">
              <div className="flex items-center gap-2 text-[14px] text-[#495060]">
                <input type="checkbox" name="newsletter" />
                I agree to receive occasional news and updates.
              </div>
              <div className="flex items-center text-[14px] text-[#495060] mt-3">
                <input type="checkbox" name="terms" required className="mr-2" />
                I accept the <span className="text-[#6a69ff] mx-1">Terms & Conditions</span> and <span className="text-[#6a69ff] ml-1">Privacy Policy</span>.
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="w-full px-6 py-2 mt-4 text-white text-[14px] bg-[#6a69ff] rounded">
              Create Account
            </button>

            {/* Sign in */}
            <div className="mt-5 text-[14px] text-[#495060]">
              Already have an account?{" "}
              <Link className="text-[#6a69ff]" href="/auth/login">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right side points */}
      <div className="w-[540px] bg-[#f2f2ff] pt-[10%] hidden 2xl:block overflow-y-hidden min-h-[100vh]">
        <div className="px-[60px]">
          <p className="text-[32px] text-[#414c58] font-bold text-center">
            Close More Deals <br /> Grow Faster
          </p>
          <p className="text-[#414766] text-[13px] my-6">
            SalesQL can enhance any LinkedIn profile with emails and phone numbers – even if you haven’t connected with them.
          </p>
          {Points.map((each, idx) => (
            <div className={`flex gap-3 ${idx === 1 ? "my-3" : ""}`} key={idx}>
              <Image src={Tick} width={24} height={24} alt="tick icon" />
              <span className="text-[#414766] text-[13px] font-bold">{each}</span>
            </div>
          ))}
        </div>
        <Image src={People} width={0} height={0} alt="people illustration" />
      </div>
    </section>
  );
}
