import type { ServiceId } from "@/lib/agreementTypes";

/**
 * Fees shown before a case has been priced by the server.
 *
 * What is charged always comes from GET /cases/:id/payment, which prices from
 * prenup-backend/src/cases/service-pricing.ts. These copies only let screens
 * that run before that call (the service selector's summary) show the same
 * figure, so keep them in step with the backend table.
 */
export const SERVICE_FEE_GBP: Record<ServiceId, number> = {
  prenup: 499,
  postnup: 549,
  cohabitation: 399,
};

/**
 * Independent legal advice is not part of our fee: each partner pays their own
 * lawyer directly.
 */
export const LEGAL_ADVICE_FEE_GBP = 250;

/** Both partners' independent legal advice together. */
export const LEGAL_ADVICE_FEES_TOTAL_GBP = LEGAL_ADVICE_FEE_GBP * 2;

/** "£499", or "£499.50" when there are pence. */
export function formatPounds(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
