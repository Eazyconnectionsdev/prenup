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
  labelClassName?: string;
};

const base =
  "w-full rounded-lg border text-[13.5px] text-[#1E293B] px-3.5 py-2 placeholder:text-[13px] placeholder:text-[#9CA3AF] transition-all duration-200 ease-in-out shadow-xs focus:outline-none";

const AuthInput = forwardRef<HTMLInputElement, Props>(function AuthInput(
  {
    error,
    password,
    label,
    labelClassName = "",
    className = "",
    type = "text",
    id,
    ...rest
  },
  ref,
) {
  const [visible, setVisible] = useState(false);
  const generatedId = useId();
  const inputId = id ?? `auth-input-${generatedId}`;
  const errorId = `${inputId}-error`;
  const message = getFieldErrorMessage(error);
  const invalid = !!error;

  const stateClasses = invalid
    ? "border-[#64748B] bg-white focus:border-[#1E293B] focus:ring-2 focus:ring-black/10"
    : "border-[#94A3B8] bg-white hover:border-[#475569] hover:shadow-xs focus:border-[#1E293B] focus:ring-2 focus:ring-black/10 focus:bg-white";

  return (
    <div>
      {label && (
        <label
          htmlFor={inputId}
          className={`mb-1.5 block text-[12.5px] font-semibold text-[#374151] tracking-normal ${labelClassName}`}
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
          className={`${base} ${stateClasses} ${password ? "pr-10" : ""} ${className}`}
          {...rest}
        />
        {password && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute -translate-y-1/2 right-2.5 top-1/2 p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100/70 active:scale-95 transition-all cursor-pointer"
          >
            <Image src={visible ? Eye : EyeOff} height={17} width={17} alt="" className="opacity-75 hover:opacity-100 transition-opacity" />
          </button>
        )}
      </div>

      <FieldError error={error} id={errorId} />
    </div>
  );
});

export default AuthInput;
