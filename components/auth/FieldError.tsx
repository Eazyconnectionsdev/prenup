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

/** Red, inline validation message shown directly under a field. */
export default function FieldError({ error, id, className = "" }: Props) {
  const message = getFieldErrorMessage(error);
  if (!message) return null;

  return (
    <p
      id={id}
      role="alert"
      className={`mt-1.5 flex items-start gap-1 text-[12px] leading-snug text-red-600 ${className}`}
    >
      <span aria-hidden className="mt-[1px] select-none">
        &#9888;
      </span>
      <span>{message}</span>
    </p>
  );
}
