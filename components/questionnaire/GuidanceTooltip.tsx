"use client";

import * as React from "react";
import { Popover } from "radix-ui";
import { Info, X } from "lucide-react";

// Space kept between the note and the edges of the area it has to stay in.
const EDGE_GAP = 12;
// The note's widest size (w-80); keep in step with its className.
const NOTE_MAX_WIDTH = 320;
// A short grace period after the pointer leaves the icon, so it can be moved
// onto the note itself (to scroll a long note or press close).
const HOVER_CLOSE_DELAY_MS = 150;

type Area = { boundary: Element | null; topInset: number };

/**
 * The (i) guidance note beside a question.
 *
 * It is drawn in its own layer rather than inside the card, so it is never cut
 * off and never makes the page scroll sideways. It always stays inside the
 * page's content area -- the scrolling <main>, below the sticky top bar:
 *  - it opens above the icon, or below it when there is not room above;
 *  - it slides sideways to keep clear of the edges, with the arrow still
 *    pointing at the icon;
 *  - a note taller than the space left scrolls inside itself.
 *
 * Hovering or focusing the icon shows the note. Clicking (or tapping) it keeps
 * the note open until it is closed, the icon is clicked again, or the user
 * clicks elsewhere or presses Esc.
 */
export function Tooltip({ text }: { text: string }) {
  const [open, setOpen] = React.useState(false);
  const [pinned, setPinned] = React.useState(false);
  const [area, setArea] = React.useState<Area>({ boundary: null, topInset: 0 });
  const anchorRef = React.useRef<HTMLSpanElement>(null);
  const closeTimer = React.useRef<number | null>(null);

  const cancelClose = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  React.useEffect(() => {
    const timer = closeTimer;
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  const show = () => {
    cancelClose();
    if (open) return;
    // Measured each time it opens: the content area, and how much of its top
    // the sticky bar covers (pages without either just use the window). A
    // content area too narrow for the note -- a phone, where the sidebar
    // leaves little room -- is swapped for the whole window so it stays
    // readable.
    const main = anchorRef.current?.closest("main") ?? null;
    const topBar = main?.querySelector<HTMLElement>("[data-app-topbar]");
    const roomy = !!main && main.clientWidth >= NOTE_MAX_WIDTH + EDGE_GAP * 2;
    setArea({
      boundary: roomy ? main : null,
      topInset: topBar?.offsetHeight ?? 0,
    });
    setOpen(true);
  };

  const close = () => {
    cancelClose();
    setOpen(false);
    setPinned(false);
  };

  const closeSoon = () => {
    if (pinned) return;
    cancelClose();
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = null;
      setOpen(false);
    }, HOVER_CLOSE_DELAY_MS);
  };

  return (
    <Popover.Root open={open} onOpenChange={(next) => !next && close()}>
      <Popover.Anchor asChild>
        <span
          ref={anchorRef}
          className="relative inline-flex items-center align-middle ml-1.5 select-none"
        >
          <button
            type="button"
            aria-label="More information"
            aria-haspopup="dialog"
            aria-expanded={open}
            onMouseEnter={show}
            onMouseLeave={closeSoon}
            onFocus={show}
            onBlur={closeSoon}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (pinned) {
                close();
              } else {
                show();
                setPinned(true);
              }
            }}
            className="group inline-flex items-center justify-center rounded-full text-[#6366F1] hover:text-[#4338CA] hover:bg-indigo-50 active:scale-95 p-1 transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#6366F1]/30"
          >
            <Info className="h-[17px] w-[17px] stroke-[2.2] transition-transform duration-150 group-hover:scale-110" />
          </button>
        </span>
      </Popover.Anchor>

      <Popover.Portal>
        <Popover.Content
          side="top"
          align="center"
          sideOffset={8}
          avoidCollisions
          collisionBoundary={area.boundary ? [area.boundary] : []}
          collisionPadding={{
            top: area.topInset + EDGE_GAP,
            right: EDGE_GAP,
            bottom: EDGE_GAP,
            left: EDGE_GAP,
          }}
          aria-label="Guidance note"
          // A note that opened on hover must not take focus from the icon (its
          // blur would close it again), and closing must not move focus.
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          // Clicking the icon is handled by the icon itself.
          onInteractOutside={(e) => {
            if (anchorRef.current?.contains(e.target as Node)) e.preventDefault();
          }}
          onMouseEnter={cancelClose}
          onMouseLeave={closeSoon}
          // React passes events up through the portal; keep clicks inside the
          // note from reaching whatever the icon sits in (a label, a card).
          onClick={(e) => e.stopPropagation()}
          style={{ maxHeight: "var(--radix-popover-content-available-height)" }}
          className="group z-50 flex w-72 sm:w-80 max-w-[calc(100vw-24px)] flex-col rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-[#0B0F19] p-4 text-left shadow-[0_20px_50px_-10px_rgba(15,23,42,0.7),0_0_0_1px_rgba(99,102,241,0.25)] border border-indigo-500/25 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 focus:outline-none"
        >
          {/* Header row with glowing badge and close button */}
          <div className="mb-2.5 flex shrink-0 items-center justify-between border-b border-slate-800/90 pb-2">
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-300">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 ring-1 ring-indigo-400/30">
                <Info className="h-3 w-3 stroke-[2.4]" />
              </span>
              Guidance Note
            </span>
            <button
              type="button"
              onClick={close}
              className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
              aria-label="Close guidance note"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Line breaks in the text are kept, so longer guidance can be
              written as paragraphs and bullet lists; a note longer than the
              room it has scrolls. */}
          <div className="min-h-0 max-h-[55vh] overflow-y-auto overscroll-contain whitespace-pre-line text-[12.5px] font-normal leading-relaxed text-slate-200 antialiased normal-case tracking-normal">
            {text}
          </div>

          {/* Points at the icon wherever the note ends up */}
          <Popover.Arrow
            width={14}
            height={7}
            className="fill-[#0B0F19] group-data-[side=bottom]:fill-slate-900"
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
