import Link from "next/link";
import type { ReactNode } from "react";

/**
 * A card in the dashboard's top row.
 *
 * Layout: the card's name and its icon on the first line, then the one figure
 * or state the card exists to show, then a caption and the card's action along
 * the bottom. That last line is pushed down, so it sits level across the row
 * however tall the cards grow.
 */
const shellClasses =
  "flex h-full flex-col rounded-2xl border border-[#EDEDF5] bg-white px-5 py-4 shadow-sm";

const interactiveShellClasses =
  "transition hover:border-[#6D4AFF]/40 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-[#6D4AFF]/30";

const labelClasses = "min-w-0 truncate text-xs font-medium text-[#8A8AA0]";

const valueClasses =
  "min-w-0 flex-1 truncate text-[1.325rem] font-bold leading-tight tracking-tight text-[#1E1B3C]";

const subtitleClasses = "min-w-0 flex-1 truncate text-xs text-[#8A8AA0]";

// A filled pill, in the purple the rest of the app uses for its buttons.
const pillClasses =
  "inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-[#6D4AFF] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-[#6D4AFF]/25";

/** The move on a card. */
export const statCardActionClasses = `${pillClasses} transition hover:bg-[#5B3AE8] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#6D4AFF]/30`;

/** A settled state rather than something to click. */
export const statCardBadgeClasses = pillClasses;

/** Plain words in the action's place, on a card with nothing to click. */
export const statCardCaptionClasses = "flex-shrink-0 text-xs text-[#9494AA]";

type Props = {
  /** What the card is about, in the top line. */
  label: ReactNode;
  /** Top right, carrying its own colour. */
  icon: ReactNode;
  /** The figure or state the card is for, set large. */
  value: ReactNode;
  /** End of the value's line, for a count or other small figure. */
  valueAside?: ReactNode;
  /** Bottom left: a caption, or something as wide as the line, like a bar. */
  subtitle?: ReactNode;
  /** Bottom right. */
  action?: ReactNode;
  /** Makes the whole card a link. Use instead of a clickable `action`. */
  href?: string;
  /** Native tooltip, for text that may be truncated. */
  tooltip?: string;
  subtitleTooltip?: string;
};

export default function StatCard({
  label,
  icon,
  value,
  valueAside,
  subtitle,
  action,
  href,
  tooltip,
  subtitleTooltip,
}: Props) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className={labelClasses}>{label}</span>
        <span className="flex-shrink-0">{icon}</span>
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <div className={valueClasses}>{value}</div>
        {valueAside}
      </div>

      {subtitle || action ? (
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <div className={subtitleClasses} title={subtitleTooltip}>
            {subtitle}
          </div>
          {action}
        </div>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        title={tooltip}
        className={`${shellClasses} ${interactiveShellClasses}`}
      >
        {body}
      </Link>
    );
  }

  return (
    <div className={shellClasses} title={tooltip}>
      {body}
    </div>
  );
}
