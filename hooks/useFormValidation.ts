"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { z } from "zod";
import {
  errorCount,
  errorSummary,
  flattenIssues,
  withoutError,
  type FormErrors,
} from "@/lib/validations/formErrors";

/**
 * Checks a form against a zod schema on submit and keeps the messages.
 *
 * The questionnaire forms hold their answers in `useState` rather than in
 * react-hook-form, so this does the one thing they are missing: it turns a
 * schema into a field-path-keyed set of messages, refuses the submit while any
 * remain, and takes the person to the first field that needs them. A message
 * clears as soon as its own field is edited, so nothing stays red once it has
 * been fixed.
 *
 * ```tsx
 * const { errors, validate, clearError } = useFormValidation(personalInfoSchema);
 *
 * const handleSubmit = async (e) => {
 *   e.preventDefault();
 *   const payload = { ...formData };
 *   if (!validate(payload)) return;   // nothing is sent
 *   await save(payload);
 * };
 * ```
 */
export function useFormValidation<Schema extends z.ZodType>(schema: Schema) {
  const [errors, setErrors] = useState<FormErrors>({});

  // Set by validate(), read by the effect below: the message has to be in the
  // DOM before anything can be scrolled to it, which is one render later.
  const scrollTo = useRef<string | null>(null);

  useEffect(() => {
    const path = scrollTo.current;
    if (!path) return;
    scrollTo.current = null;
    focusField(path);
  }, [errors]);

  const validate = useCallback(
    (value: unknown): boolean => {
      const result = schema.safeParse(value);
      if (result.success) {
        setErrors({});
        return true;
      }
      const next = flattenIssues(result.error);
      scrollTo.current = Object.keys(next)[0] ?? null;
      setErrors(next);
      return false;
    },
    [schema],
  );

  const clearError = useCallback((path: string) => {
    setErrors((prev) => withoutError(prev, path));
  }, []);

  const clearAll = useCallback(() => setErrors({}), []);

  return {
    errors,
    validate,
    clearError,
    clearAll,
    count: errorCount(errors),
    summary: errorSummary(errors),
    hasErrors: errorCount(errors) > 0,
  };
}

/**
 * Brings the first field that failed into view and puts the cursor in it.
 *
 * A field is found by its `name` or `id` (the scalar inputs), or failing that
 * by the `data-error-path` on its message, which every row field carries --
 * the row inputs are generated, so they have no stable id of their own.
 */
function focusField(path: string) {
  if (typeof document === "undefined") return;

  const escaped = cssEscape(path);
  const target =
    document.querySelector<HTMLElement>(`[name="${escaped}"]`) ??
    document.getElementById(path) ??
    document.querySelector<HTMLElement>(`[data-error-path="${escaped}"]`);

  if (!target) return;

  target.scrollIntoView({ behavior: "smooth", block: "center" });
  // Only a real control can take focus; a message cannot, and asking it to
  // would pull focus out of the form.
  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLSelectElement ||
    target instanceof HTMLTextAreaElement
  ) {
    target.focus({ preventScroll: true });
  }
}

/** Paths hold dots and digits, so they need escaping before use as a selector. */
function cssEscape(value: string) {
  const native = (globalThis as { CSS?: { escape?: (v: string) => string } }).CSS?.escape;
  return native ? native(value) : value.replace(/["\\]/g, "\\$&");
}
