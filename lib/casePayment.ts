/**
 * One definition of "this case has been paid for", shared by every screen that
 * gates on it: the end-user dashboard and sidebar, and the case-manager stage
 * counts.
 *
 * The backend's own test is `paymentCompleted || paymentStatus === COMPLETED`
 * (cases.service.ts), with one addition -- a refund does not clear
 * paymentCompleted, so a refunded case counts as unpaid.
 */
export function isCasePaid(
  item?: {
    paymentCompleted?: boolean | null;
    paymentStatus?: string | null;
  } | null,
): boolean {
  const status = String(item?.paymentStatus ?? "").toUpperCase();
  if (status === "REFUNDED" || status === "PARTIALLY_REFUNDED") return false;
  return Boolean(item?.paymentCompleted) || status === "COMPLETED";
}

/** Where the client pays for a chosen service. */
export function paymentHref(agreementType: string): string {
  return `/payment?service=${encodeURIComponent(agreementType)}`;
}
