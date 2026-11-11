import type { ZodError } from "zod";

/** Field path -> the message to show under that field. */
export type FormErrors = Record<string, string>;

/**
 * Flattens a zod error into one message per field, keyed by a dotted path:
 * `firstName`, `realEstate.0.postcode`, `specialCircumstances.sharedBusiness`.
 *
 * The path is the same string the forms use to look an error up, so a field
 * only has to know where it sits in the payload to find its own message.
 * The first issue on a field wins -- one message per field is what a person
 * can act on.
 */
export function flattenIssues(error: ZodError): FormErrors {
  const errors: FormErrors = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".");
    if (!(path in errors)) errors[path] = issue.message;
  }
  return errors;
}

/** How many fields are wrong -- what the submit bar counts. */
export const errorCount = (errors: FormErrors) => Object.keys(errors).length;

/**
 * The message under the submit button. Naming the count tells someone whether
 * they are one field away or ten, which a bare "check the form" does not.
 */
export function errorSummary(errors: FormErrors): string | null {
  const count = errorCount(errors);
  if (count === 0) return null;
  return count === 1
    ? "One field still needs your attention before you can continue."
    : `${count} fields still need your attention before you can continue.`;
}

/**
 * Drops the error on one field, and on anything nested under it, so a message
 * disappears as soon as the person starts fixing what it pointed at.
 */
export function withoutError(errors: FormErrors, path: string): FormErrors {
  const prefix = `${path}.`;
  let changed = false;
  const next: FormErrors = {};
  for (const [key, message] of Object.entries(errors)) {
    if (key === path || key.startsWith(prefix)) {
      changed = true;
      continue;
    }
    next[key] = message;
  }
  return changed ? next : errors;
}

/** Every error inside `prefix`, re-keyed relative to it (for a row's fields). */
export function errorsUnder(errors: FormErrors, prefix: string): FormErrors {
  const start = `${prefix}.`;
  const scoped: FormErrors = {};
  for (const [key, message] of Object.entries(errors)) {
    if (key.startsWith(start)) scoped[key.slice(start.length)] = message;
  }
  return scoped;
}
