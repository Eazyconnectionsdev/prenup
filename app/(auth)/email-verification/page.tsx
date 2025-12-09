"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import VerificationInput from "react-verification-input";
import Logo from "@/images/logo.png";

export default function EmailVerification() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("user@example.com"); // Static email example
  const [isCode, setInputCode] = useState(false);

  useEffect(() => {
    // Simulate prefilled code from query
    const queryCode = "123456";
    if (queryCode.length === 6) {
      setCode(queryCode);
      setInputCode(true);
    }
  }, []);

  const handleChange = (value : any) => {
    setCode(value);
  };

  const handleSubmit = (e : any) => {
    e.preventDefault();
    alert(`Verification code submitted: ${code}`);
  };

  return (
    <section>
      {/* Logo */}
      <div className="mt-10 ml-10 md:absolute">
        <Link className="flex items-center" href="/">
          <Image
            src={Logo}
            width={50}
            height={50}
            className="w-[50px] xl:w-[80px] aspect-auto"
            alt="ez-web - logo"
          />
          <p className="ml-2 xl:text-[23px] font-medium">
            <span className="font-bold">Eazy</span>Connections
          </p>
        </Link>
      </div>

      {/* Main content */}
      <div className="container flex flex-col items-center justify-center px-10 mx-auto md:h-screen">
        <h1 className="xl:relative lg:-top-20 py-10 lg:py-4 xl:py-0 px-4 md:px-0 text-center text-[30px] font-semibold">
          Verify your email address
        </h1>

        <div className="flex flex-col text-[12px] gap-3 md:w-[40%] mx-auto">
          <p>
            Please, check your inbox for verification code sent to{" "}
            <span className="font-bold">{email}</span>
          </p>
          <p className="text-[12px]">Enter code below</p>

          <form onSubmit={handleSubmit}>
            <VerificationInput
              {...(isCode ? { value: code } : {})}
              onChange={handleChange}
              validChars="0-9"
              inputProps={{ inputMode: "numeric" }}
              classNames={{
                container: "verification-container",
                character: "verification-character",
              }}
            />

            <button
              type="submit"
              className="text-white bg-[#7B68EE] font-semibold text-[14px] rounded mt-5 mb-2 py-2 w-full transition-all ease-in-out duration-300 hover:bg-[#6857ca]"
            >
              Verify Email
            </button>
          </form>

          <div className="flex items-center gap-1 text-[12px]">
            <p>Didn&apos;t receive it&#63;</p>
            <Link href="/login" className="text-[#7B68EE] text-[12px] font-semibold">
              Resend Code
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
