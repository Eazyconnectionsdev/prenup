"use client";

import { useEffect } from "react";
import { CalendarX2, X } from "lucide-react";

// Same address the public website lists for getting in touch.
export const CONTACT_TEAM_EMAIL = "hello@letsprenup.co.uk";

/**
 * Hard stop shown when the planned ceremony is 28 days away or fewer. There is
 * no tick box to get past it: the couple cannot save the date themselves and
 * are asked to contact the team instead. It opens again on every attempt to
 * save while the date is inside the window.
 */
export function CeremonyBlockedModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="ceremony-blocked-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-3.5 px-6 pb-5 pt-6 text-[13.5px] leading-relaxed text-slate-700">
          <h2
            id="ceremony-blocked-title"
            className="flex items-center gap-2.5 pr-8 text-[15.5px] font-bold text-slate-900"
          >
            <CalendarX2 className="h-5 w-5 shrink-0 text-orange-500" aria-hidden="true" />
            Your ceremony date is too close
          </h2>
          <p>Your planned wedding or civil partnership date is within 28 days.</p>
          <p>
            To help ensure both parties have sufficient time to complete financial disclosure,
            obtain independent legal advice and properly consider the agreement, we cannot proceed
            with our standard online prenup process for this date.
          </p>
          <p>
            The recommended timeframe is to have the agreement finalised and signed at least 28
            days before the ceremony.
          </p>
          <div>
            <p className="font-bold text-slate-900">What happens next?</p>
            <p className="mt-1">
              Please contact our team to discuss your circumstances and the options available. You
              may need specialist legal advice about alternative arrangements, including a
              postnuptial agreement.
            </p>
          </div>

          <a
            href={`mailto:${CONTACT_TEAM_EMAIL}?subject=${encodeURIComponent(
              "Wedding date within 28 days",
            )}`}
            className="mt-1 flex h-[44px] w-full items-center justify-center rounded-xl bg-slate-950 text-[13.5px] font-semibold text-white transition hover:bg-slate-800"
          >
            Contact our team
          </a>
          <p className="text-[11px] leading-snug text-slate-500">
            This is a precautionary service restriction, not a statement that every prenup signed
            within 28 days is automatically invalid.
          </p>
        </div>
      </div>
    </div>
  );
}
