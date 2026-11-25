/**
 * Shared metrics for the journey rows ("Your Prenup Journey", the stage list
 * and "Independent Legal Advice"). Every row's action button and status pill
 * gets the same fixed box whatever its label — "Start", "View (Read Only)",
 * "Partner Making Changes", "Continue ILA Process" — so they line up as one
 * column down the card, and across the cards, instead of stepping in and out
 * with the length of the text. 11rem is the widest label plus its padding; if a
 * longer label is ever added, widen this rather than let it overflow.
 *
 * `inline-flex` is here so the size also holds on the `<span>` status pills,
 * which would otherwise ignore a width.
 */

/** Fixed footprint of a row action: 11rem wide, label centred, never wrapped. */
export const journeyButtonSize =
  "ml-4 w-32 flex-shrink-0 inline-flex items-center justify-center whitespace-nowrap text-center";

/** Base look of a row action button or status pill, including its fixed size. */
export const journeyButtonBase = `${journeyButtonSize} rounded-lg px-3 py-2 text-xs font-semibold`;

/** The status text column that sits to the left of the buttons. */
export const journeyStatusWidth = "w-32";
