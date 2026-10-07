"use client";

import { forwardRef, useState } from "react";
import Image from "next/image";
import EyeOff from "@/images/icons/eye.png";
import Eye from "@/images/icons/eye-off.png";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  // Marks the field invalid (red border). Messages are shown as toasts.
  error?: unknown;
  // Adds a show/hide button; the input type is managed internally.
  password?: boolean;
};

const base =
  "w-full px-4 py-2 border rounded focus:outline-[#6a69ff] placeholder:text-[12px]";

const AuthInput = forwardRef<HTMLInputElement, Props>(function AuthInput(
  { error, password, className = "", type = "text", ...rest },
  ref,
) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        ref={ref}
        type={password ? (visible ? "text" : "password") : type}
        aria-invalid={!!error}
        className={`${base} ${error ? "border-red-500" : "border-[#414c58]"} ${password ? "pr-11" : ""} ${className}`}
        {...rest}
      />
      {password && (
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute -translate-y-1/2 right-3 top-[22px] cursor-pointer"
        >
          <Image src={visible ? Eye : EyeOff} height={20} width={20} alt="" />
        </button>
      )}
    </div>
  );
});

export default AuthInput;
