"use client"

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Logo from "@/images/logo.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <section>
      <div className="mt-10 ml-10 md:absolute">
        <Link className="flex items-center " href="/">
          <Image
            src={Logo}
            width={50}
            height={50}
            className=""
            alt="ez-web - logo"
            placeholder="blur"
          />
          <p className="ml-2 xl:text-[23px] font-medium ">
            {" "}
            <span className="font-bold">Eazy</span>Connections
          </p>
        </Link>
      </div>
      <div className="container mx-auto md:px-20">
        <div className="flex flex-col items-center justify-center md:h-screen">
          <h1 className="xl:relative lg:-top-20 py-10 lg:py-4 xl:py-0 px-4 md:px-0 text-center text-[30px] md:text-[40px] font-semibold text-gray-700 ">
            Reset Password
          </h1>
          <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-[4rem]">
            <div className="w-full md:w-[300px] text-[12px]">
              <div className="flex flex-col gap-3 ">
                <div className="flex flex-col flex-1">
                  <input
                    type="email"
                    placeholder="Email"
                    id="email"
                    required
                    className="p-4 border border-black focus:border-[#7B68EE] outline-none rounded"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button
                  className="flex items-center justify-center gap-2 my-2 text-white bg-[#7B68EE] font-semibold text-[14px] rounded  py-2 transition-all ease-in-out duration-300 hover:bg-[#6857ca]"
                  disabled={loading || !email}
                >
                 
                  Send Reset Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
