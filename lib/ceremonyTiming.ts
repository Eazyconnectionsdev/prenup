/**
 * How close the planned wedding / civil partnership is.
 *
 *  - more than 35 days away  -> STANDARD              (no warning)
 *  - 29 to 35 days away      -> TIGHT_TIMELINE_ACK    (amber warning + mandatory acknowledgement)
 *  - 28 days or fewer        -> UNDER_28_DAYS_BLOCKED (self-service save blocked, contact the team)
 *
 * Mirrors prenup-backend/src/cases/ceremony-timing.ts, which is what is
 * actually enforced; this copy only drives what the form shows.
 */
export type CeremonyTimingStatus =
  | "STANDARD"
  | "TIGHT_TIMELINE_ACK"
  | "UNDER_28_DAYS_BLOCKED";

export const CEREMONY_BLOCK_DAYS = 28;
export const CEREMONY_WARNING_DAYS = 35;

export const CEREMONY_ACK_TEXT =
  "I understand that English family law guidance recommends signing at least 28 days before a ceremony, and I confirm we will complete our questionnaires promptly so both solicitors have sufficient time to advise.";

export const CEREMONY_DATE_TOOLTIP =
  "Enter the anticipated date of your wedding or civil partnership registration. If the date has not yet been confirmed, please provide your best estimate. This helps establish the timeline for preparing your agreement.";

// Shown next to the ceremony date on the service selector, before checkout.
export const CEREMONY_CHECKOUT_TOOLTIP =
  "Please enter the planned date of your wedding or civil partnership registration. This date helps us assess whether there is sufficient time for both parties to complete financial disclosure, obtain independent legal advice, review and agree the terms, and sign the agreement well in advance of the ceremony. If your date has not yet been confirmed, please enter your best estimate and update it when known.";

function londonDateParts(): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { year: get("year"), month: get("month"), day: get("day") };
}

// Counted on the UK calendar, like the server, so both agree on the day the
// threshold is crossed.
function todayInLondonUtc(): number {
  const { year, month, day } = londonDateParts();
  return Date.UTC(year, month - 1, day);
}

/** Today on the UK calendar as YYYY-MM-DD, e.g. for a date input's `min`. */
export function todayInLondonIso(): string {
  const { year, month, day } = londonDateParts();
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Whole calendar days from today to a YYYY-MM-DD date, or null if not a date. */
export function daysUntilCeremony(value: string | null | undefined): number | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
  if (!match) return null;
  const target = Date.UTC(+match[1], +match[2] - 1, +match[3]);
  if (Number.isNaN(target)) return null;
  return Math.round((target - todayInLondonUtc()) / 86_400_000);
}

export function ceremonyTimingStatus(
  value: string | null | undefined,
): CeremonyTimingStatus | null {
  const days = daysUntilCeremony(value);
  if (days === null) return null;
  // A date already passed falls inside the window too.
  if (days <= CEREMONY_BLOCK_DAYS) return "UNDER_28_DAYS_BLOCKED";
  if (days <= CEREMONY_WARNING_DAYS) return "TIGHT_TIMELINE_ACK";
  return "STANDARD";
}

export const CEREMONY_STATUS_LABELS: Record<CeremonyTimingStatus, string> = {
  STANDARD: "Standard timeline (more than 35 days)",
  TIGHT_TIMELINE_ACK: "Tight timeline (29–35 days) – risk acknowledged",
  UNDER_28_DAYS_BLOCKED: "Within 28 days – standard online process blocked",
};

/** Case priority implied by the timing, for staff views. */
export const CEREMONY_STATUS_PRIORITY: Record<CeremonyTimingStatus, "Low" | "High" | "Urgent"> = {
  STANDARD: "Low",
  TIGHT_TIMELINE_ACK: "High",
  UNDER_28_DAYS_BLOCKED: "Urgent",
};
