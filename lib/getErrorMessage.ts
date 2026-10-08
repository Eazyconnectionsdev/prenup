const FALLBACK = "Something went wrong. Please try again.";

export function getErrorMessage(error: unknown, fallback = FALLBACK): string {
  if (!error) return fallback;
  if (typeof error === "string") return error;

  const e = error as { message?: string | string[] };
  if (Array.isArray(e.message)) return e.message[0] ?? fallback;
  if (typeof e.message === "string" && e.message) return e.message;
  return fallback;
}
