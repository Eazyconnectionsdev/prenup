"use client";

import { forwardRef, useId, useState } from "react";
import Image from "next/image";
import EyeOff from "@/images/icons/eye.png";
import Eye from "@/images/icons/eye-off.png";
import FieldError, { getFieldErrorMessage } from "./FieldError";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  // Marks the field invalid and renders its message in red below the input.
  error?: unknown;
  // Adds a show/hide button; the input type is managed internally.
  password?: boolean;
  // Optional visible label above the input.
  label?: string;
};

const base =
  "w-full px-4 py-2 border rounded placeholder:text-[12px] transition-colors";

const AuthInput = forwardRef<HTMLInputElement, Props>(function AuthInput(
  { error, password, label, className = "", type = "text", id, ...rest },
  ref,
) {
  const [visible, setVisible] = useState(false);
  const generatedId = useId();
  const inputId = id ?? `auth-input-${generatedId}`;
  const errorId = `${inputId}-error`;
  const message = getFieldErrorMessage(error);
  const invalid = !!error;

  return (
    <div>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-[12px] font-medium text-[#495060]"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={password ? (visible ? "text" : "password") : type}
          aria-invalid={invalid}
          aria-describedby={message ? errorId : undefined}
          className={`${base} ${
            invalid
              ? "border-red-500 focus:outline-red-500"
              : "border-[#414c58] focus:outline-[#6a69ff]"
          } ${password ? "pr-11" : ""} ${className}`}
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

      <FieldError error={error} id={errorId} />
    </div>
  );
});

export default AuthInput;
