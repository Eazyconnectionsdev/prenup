"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/images/logo.png";
import LinkedIn from "@/images/icons/linkedin.png";
import Microsoft from "@/images/icons/microsoft.png";
import Google from "@/images/icons/google.png";
import EyeOff from "@/images/icons/eye.png";
import Eye from "@/images/icons/eye-off.png";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { LoginUser } from "@/store/asyncThunk/authThunk";

export default function LoginPageStatic() {
  const dispatch = useDispatch<AppDispatch>();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      email: form.email,
      password: form.password,
    };

    const result = await dispatch(LoginUser(payload));
    
    if (LoginUser.fulfilled.match(result)) {
      window.location.assign("/dashboard");
    }
  };

  return (
    <section
      className={`relative h-full bg-white min-h-[100vh] flex items-center justify-center`}
    >
      {/* Logo */}
      <div className="absolute p-4 flex top-[20px] left-[20px] items-center">
        <Image
          src={Logo}
          width={40}
          height={40}
          alt="ez-logo"
          className="mr-2"
        />
        <p className="text-[18px] font-medium">
          <strong>Lets</strong>Prenup
        </p>
      </div>

      {/* Form */}
      <div className="w-[420px]">
        <h3 className="text-[28px] text-[#495060] font-medium text-center mb-5">
          Welcome Back!
        </h3>

        <form onSubmit={onSubmit}>
          {/* Social buttons */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              className="flex-1 py-2 flex items-center cursor-pointer justify-center gap-2 font-medium border border-[#888f97] text-[#414c58] hover:bg-[#e7e9ea] text-[14px] rounded"
            >
              <Image src={Google} height={20} width={20} alt="Google" />
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
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Enter your Work email"
              className="w-full px-4 py-1.5 mt-2 border border-[#414c58] rounded focus:outline-[#6a69ff] placeholder:text-[12px]"
              required
            />
          </div>

          {/* Password */}
          <div className="relative mt-4">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              name="password"
              onChange={handleChange}
              className="w-full px-4 py-1.5 mt-2 border border-[#414c58] rounded focus:outline-[#6a69ff] placeholder:text-[12px]"
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
            <a href="#" className="text-[12px] text-[#6a69ff]">
              Forgot Password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full px-6 py-2 mt-4 text-white text-[12px] bg-[#6a69ff] rounded"
          >
            Sign In
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
    </section>
  );
}
