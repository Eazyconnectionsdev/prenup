"use client";

import { MessageSquare } from "lucide-react";
import type { ReviewTimelineItem } from "@/types/store/cases-slice";

/**
 * Every message the two partners have sent each other along with a round of
 * changes, oldest first.
 *
 * The messages live on `approval.reviewTimeline`: a request for changes records
 * its reason, and sending the changes back records the note that travels with
 * them. `approval.disapprovalReason` only ever holds the latest one, which is
 * why the history is read from the timeline instead.
 */

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "?";

/** "Primary Applicant — Requested Further Changes" -> "Requested changes" */
const actionLabel = (action: string) =>
  /request/i.test(action) ? "Requested changes" : "Sent changes";

const when = (timestamp: string) => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function PartnerMessageThread({
  timeline,
  fallback = null,
  ownerName,
  partnerName,
  isOwner,
  highlight = false,
}: {
  timeline?: ReviewTimelineItem[] | null;
  /**
   * The one message to show when the timeline carries none: cases that ran
   * before the messages were recorded there still hold the latest on
   * `approval.disapprovalReason`.
   */
  fallback?: ReviewTimelineItem | null;
  /** The primary applicant's name. */
  ownerName: string;
  /** The invited partner's name. */
  partnerName: string;
  /** True when the signed-in user is the primary applicant. */
  isOwner: boolean;
  /** Draws attention to the thread while the latest message is mine to act on. */
  highlight?: boolean;
}) {
  const recorded = (timeline ?? []).filter((entry) => entry.notes?.trim());
  const messages =
    recorded.length > 0 ? recorded : fallback?.notes?.trim() ? [fallback] : [];

  if (messages.length === 0) return null;

  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-sm ${
        highlight ? "border-[#FDE68A] ring-2 ring-[#FEF3C7]" : "border-[#E7E7F2]"
      }`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-[#F1F1F6] pb-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EDE9FE] text-[#6D28D9]">
            <MessageSquare className="h-4 w-4" strokeWidth={2} />
          </span>
          <div>
            <h3 className="text-sm font-bold text-[#1E1B3C]">
              Messages from your partner
            </h3>
            <p className="text-xs text-[#6B6B80]">
              Every note sent with a round of changes, oldest first.
            </p>
          </div>
        </div>
        <span className="flex-shrink-0 rounded-full bg-[#F1F1F6] px-2.5 py-1 text-xs font-semibold text-[#6B6B80]">
          {messages.length}
        </span>
      </div>

      <ol className="mt-4 max-h-96 space-y-3.5 overflow-y-auto pr-1">
        {messages.map((entry, i) => {
          const fromPrimary = entry.actorRole !== "SECONDARY";
          const mine = fromPrimary === isOwner;
          const author = fromPrimary ? ownerName : partnerName;
          const isLatest = i === messages.length - 1;

          return (
            <li
              key={`${entry.timestamp}-${i}`}
              className={`flex items-start gap-3 ${mine ? "flex-row-reverse" : ""}`}
            >
              <span
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  mine
                    ? "bg-[#EDE9FE] text-[#6D28D9]"
                    : "bg-[#FEF3C7] text-[#B45309]"
                }`}
                title={author}
                aria-hidden="true"
              >
                {initialsOf(author)}
              </span>

              <div className={`min-w-0 flex-1 ${mine ? "text-right" : ""}`}>
                <div
                  className={`flex flex-wrap items-center gap-2 ${
                    mine ? "justify-end" : ""
                  }`}
                >
                  <span className="text-xs font-bold text-[#1E1B3C]">
                    {mine ? "You" : author}
                  </span>
                  <span className="rounded-md bg-[#F6F6FB] px-1.5 py-0.5 text-[11px] font-medium text-[#8A8AA0]">
                    {actionLabel(entry.action)}
                  </span>
                  <span className="text-[11px] font-medium text-[#8A8AA0]">
                    {when(entry.timestamp)}
                  </span>
                  {highlight && isLatest && !mine && (
                    <span className="rounded-md bg-[#FEF3C7] px-1.5 py-0.5 text-[11px] font-semibold text-[#B45309]">
                      Needs your review
                    </span>
                  )}
                </div>

                <p
                  className={`mt-1.5 inline-block whitespace-pre-line rounded-xl px-3.5 py-2.5 text-left text-sm leading-relaxed ${
                    mine
                      ? "bg-[#F5F3FF] text-[#1E1B3C]"
                      : "bg-[#FEF9C3]/70 text-[#1E1B3C]"
                  }`}
                >
                  {entry.notes}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
