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
        className="w-3.5 h-3.5 flex-shrink-0 text-[#E17A84]"
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0-10.25a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4.75zm0 6.75a.875.875 0 1 0 0-1.75.875.875 0 0 0 0 1.75z"
          clipRule="evenodd"
        />
      </svg>
      <span className="whitespace-nowrap">{message}</span>
    </p>
  );
}
