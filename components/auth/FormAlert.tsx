"use client";

type Props = {
  message?: string | null;
  tone?: "error" | "success";
};

const tones = {
  error: "border-red-200 bg-red-50 text-red-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

/**
 * Form-level banner for messages that don't belong to a single field,
 * e.g. "Invalid credentials" or an unreachable server.
 */
export default function FormAlert({ message, tone = "error" }: Props) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`rounded border px-3 py-2 text-[12px] leading-snug ${tones[tone]}`}
    >
      {message}
    </div>
  );
}
