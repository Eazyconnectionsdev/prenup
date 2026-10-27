"use client";

/**
 * Pulls the human-readable text out of whatever react-hook-form put in
 * `errors.<field>` (a FieldError, a nested error object, or a plain string).
 */
export function getFieldErrorMessage(error: unknown): string | null {
  if (!error) return null;
  if (typeof error === "string") return error;
  const message = (error as { message?: unknown }).message;
  return typeof message === "string" && message ? message : null;
}

type Props = {
  error?: unknown;
  /** Links the message to its input via aria-describedby. */
  id?: string;
  className?: string;
};

/** Refined, elegant inline validation message shown directly under a field. */
export default function FieldError({ error, id, className = "" }: Props) {
  const message = getFieldErrorMessage(error);
  if (!message) return null;

  return (
    <p
      id={id}
      role="alert"
      className={`mt-1.5 flex items-center gap-1.5 text-[11px] leading-tight text-[#4B5563] font-medium whitespace-nowrap overflow-visible ${className}`}
    >
      <svg
        className="w-4 h-4 flex-shrink-0"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="7" fill="#E17A84" />
        <path
          d="M8 4.2V8.8"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="8" cy="11.8" r="1.1" fill="white" />
      </svg>
      <span className="whitespace-nowrap">{message}</span>
    </p>
  );
}
