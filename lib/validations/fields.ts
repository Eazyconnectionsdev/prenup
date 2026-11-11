import { z } from "zod";

/**
 * The field-level building blocks the questionnaire schemas are made of, so
 * every form words "this is required" the same way and trims the same way.
 *
 * The forms keep everything as strings (a `<select>` with no choice made is
 * `""`, a money input is the text that was typed), so these all work on
 * strings rather than on numbers or dates.
 */

/** A free-text field that has to be filled in. */
export const requiredText = (label: string, max = 500) =>
  z
    .string({ message: `${label} is required` })
    .trim()
    .min(1, `${label} is required`)
    .max(max, `${label} is too long`);

/** Free text that may be left blank. */
export const optionalText = (max = 500) =>
  z
    .string()
    .trim()
    .max(max, "This answer is too long")
    .optional()
    .default("");

/** A `<select>` or radio group that has to have a choice made. */
export const requiredChoice = (label: string) =>
  z
    .string({ message: `Select ${label.toLowerCase()}` })
    .trim()
    .min(1, `Select ${label.toLowerCase()}`);

/** One of a fixed set of codes, with the blank placeholder rejected. */
export const requiredOneOf = <T extends readonly [string, ...string[]]>(
  values: T,
  label: string,
) => z.enum(values, { message: `Select ${label.toLowerCase()}` });

/** The Yes/No toggles. Both answers are valid; not answering is not. */
export const yesNo = z.enum(["Yes", "No"], { message: "Choose Yes or No" });

/** An `<input type="date">`: a real calendar date, not just any text. */
export const requiredDate = (label: string) =>
  z
    .string({ message: `${label} is required` })
    .trim()
    .min(1, `${label} is required`)
    .refine((v) => !Number.isNaN(new Date(v).getTime()), `Enter a valid ${label.toLowerCase()}`);

export const optionalDate = (label: string) =>
  z
    .string()
    .trim()
    .refine(
      (v) => v === "" || !Number.isNaN(new Date(v).getTime()),
      `Enter a valid ${label.toLowerCase()}`,
    )
    .optional()
    .default("");

/**
 * A money or percentage box. Typed, so it arrives as text: anything that is
 * not a number is rejected, and so is a negative amount.
 */
export const requiredAmount = (label: string) =>
  z
    .string({ message: `${label} is required` })
    .trim()
    .min(1, `${label} is required`)
    .refine((v) => Number.isFinite(Number(v.replace(/[,£$\s]/g, ""))), `${label} must be a number`)
    .refine((v) => Number(v.replace(/[,£$\s]/g, "")) >= 0, `${label} cannot be negative`);

export const optionalAmount = (label: string) =>
  z
    .string()
    .trim()
    .refine(
      (v) => v === "" || Number.isFinite(Number(v.replace(/[,£$\s]/g, ""))),
      `${label} must be a number`,
    )
    .refine(
      (v) => v === "" || Number(v.replace(/[,£$\s]/g, "")) >= 0,
      `${label} cannot be negative`,
    )
    .optional()
    .default("");

/** A checkbox that has to be ticked, e.g. a declaration being confirmed. */
export const mustConfirm = (message = "Please confirm this to continue") =>
  z.boolean().refine((v) => v === true, { message });

/**
 * Rows carry a client-side `id` React uses as a key, and may carry fields a
 * schema does not describe. Rows are checked on the fields that matter and the
 * rest is passed through untouched.
 */
export const rowShape = <T extends z.ZodRawShape>(shape: T) =>
  z.object({ id: z.string().optional(), ...shape }).loose();

/**
 * How an asset or debt is to be treated. Choosing "by contribution",
 * "by percentage" or "custom" asks a follow-up question, so each of those
 * only counts as answered once its own box is filled in.
 */
export const treatmentShape = {
  treatment: requiredChoice("How this should be treated"),
  contributionText: optionalText(1000),
  percentageValue: optionalText(10),
  customText: optionalText(1000),
};

/** The follow-up rules for `treatmentShape`, applied to one row or object. */
export function checkTreatment(
  value: {
    treatment?: string;
    contributionText?: string;
    percentageValue?: string;
    customText?: string;
  },
  ctx: z.RefinementCtx,
) {
  if (value.treatment === "Contribution" && !value.contributionText?.trim()) {
    ctx.addIssue({
      code: "custom",
      path: ["contributionText"],
      message: "Describe how contributions should be split",
    });
  }

  if (value.treatment === "Percentage") {
    const raw = value.percentageValue?.trim() ?? "";
    const share = Number(raw);
    if (!raw) {
      ctx.addIssue({
        code: "custom",
        path: ["percentageValue"],
        message: "Enter the percentage share",
      });
    } else if (!Number.isFinite(share) || share <= 0 || share > 100) {
      ctx.addIssue({
        code: "custom",
        path: ["percentageValue"],
        message: "Enter a percentage between 1 and 100",
      });
    }
  }

  if (value.treatment === "Custom" && !value.customText?.trim()) {
    ctx.addIssue({
      code: "custom",
      path: ["customText"],
      message: "Describe the arrangement you have in mind",
    });
  }
}

/**
 * A list that only has to hold anything when its Yes/No toggle says Yes --
 * answering "Yes" and then adding nothing leaves the question unanswered.
 */
export function checkListAnswered(
  flag: string | undefined,
  rows: unknown[] | undefined,
  listPath: string,
  message: string,
  ctx: z.RefinementCtx,
) {
  if (flag === "Yes" && (!rows || rows.length === 0)) {
    ctx.addIssue({ code: "custom", path: [listPath], message });
  }
}
