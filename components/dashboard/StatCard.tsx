import Link from "next/link";
import { Check } from "lucide-react";
import type { ReactNode } from "react";


const shellClasses = "flex h-full flex-col rounded-2xl border border-[#EDEDF5] bg-white px-5 py-4 shadow-sm";
const interactiveShellClasses ="transition hover:border-[#6D4AFF]/40 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-[#6D4AFF]/30";
const labelClasses = "min-w-0 truncate text-xs font-medium text-[#8A8AA0]";
const valueClasses = "min-w-0 flex-1 truncate text-[1.325rem] font-bold leading-tight tracking-tight text-[#1E1B3C]";
const subtitleClasses = "min-w-0 flex-1 truncate text-xs text-[#8A8AA0]";
const pillClasses = "inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-[#6D4AFF] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-[#6D4AFF]/25";

export const statCardActionClasses = `${pillClasses} transition hover:bg-[#5B3AE8] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#6D4AFF]/30`;

export const statCardBadgeClasses = pillClasses;

export const statCardCaptionClasses = "flex-shrink-0 text-xs text-[#9494AA]";


export function ApprovedPill() {
  return (
    <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-[#DCFCE7] px-2.5 py-1 text-[0.7rem] font-semibold text-[#16A34A]">
      <Check className="h-3 w-3" aria-hidden="true" />
      Approved
    </span>
  );
}

type Props = {
  label: ReactNode;
  icon: ReactNode;
  value: ReactNode;
  valueAside?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  href?: string;
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
