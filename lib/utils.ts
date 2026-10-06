import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toDateInputValue = (date?: string | Date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

export function formatVersionDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
// Strips spaces, dashes, dots and brackets: "(416) 555-0192" -> "4165550192".
export const normalizePhone = (value: string) =>
  value.trim().replace(/[\s\-().]/g, "");

// Empty is allowed (phone is optional); otherwise 7-15 digits, optional leading +.
export const isValidPhone = (value: string) => {
  const phone = normalizePhone(value);
  return phone === "" || /^\+?[0-9]{7,15}$/.test(phone);
};
