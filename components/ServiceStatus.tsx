import Link from "next/link";

// Where the service is chosen and where it can be looked at again
export const SERVICE_SELECTOR_HREF = "/dashboard/service-selector";

function ProgressPill({
  label,
  value,
  title,
  href,
}: {
  label: string;
  value: string;
  title?: string;
  href?: string;
}) {
  const body = (
    <>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-[#9494AA]">
        {label}
      </div>
      <div className="mt-0.5 truncate text-sm font-semibold text-[#1E1B3C]">
        {value}
      </div>
    </>
  );

  const className =
    "flex h-[60px] flex-col justify-center rounded-xl border border-[#E7E7F2] bg-white px-4";

  return href ? (
    <Link
      href={href}
      title={title}
      className={`${className} transition hover:border-[#6D4AFF]/40 hover:shadow-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-[#6D4AFF]/30`}
    >
      {body}
    </Link>
  ) : (
    <div className={className} title={title}>
      {body}
    </div>
  );
}

function UpgradeCard({ href = SERVICE_SELECTOR_HREF }: { href?: string }) {
  return (
    <div className="flex h-[60px] items-center gap-4 rounded-xl border border-[#E7E7F2] bg-white py-2 pl-4 pr-2">
      <div className="min-w-0">
        <div className="flex items-center gap-1 text-sm font-semibold text-[#1E1B3C]">
          Free Plan
          <span className="group relative inline-flex">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5 cursor-help text-[#9494AA]">
              <circle cx="10" cy="10" r="7.5" />
              <path d="M10 9v4.5M10 6.5h.01" strokeLinecap="round" />
            </svg>
            <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-48 -translate-x-1/2 rounded-lg bg-[#1E1B3C] px-3 py-2 text-[11px] font-normal leading-snug text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              Select a service to unlock your full agreement workflow.
            </span>
          </span>
        </div>
        <div className="text-[11px] leading-tight text-[#9494AA]">
          Upgrade to unlock
          <br />
          all features.
        </div>
      </div>
      <Link
        href={href}
        className="rounded-lg bg-[#6D4AFF] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#6D4AFF]/30 transition hover:bg-[#5B3AE8] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#6D4AFF]/30"
      >
        Upgrade
      </Link>
    </div>
  );
}

// `service` is the short label of the case's chosen agreement type, and
// `serviceTitle` the full one for the tooltip. Either way this links to the
// service selector: to pick a service, or to look at the one already chosen.
export function ServiceStatus({
  service,
  serviceTitle,
  upgradeHref = SERVICE_SELECTOR_HREF,
}: {
  service?: string | null;
  serviceTitle?: string | null;
  upgradeHref?: string;
}) {
  return service ? (
    <ProgressPill
      label="Selected service"
      value={service}
      title={serviceTitle ?? service}
      href={upgradeHref}
    />
  ) : (
    <UpgradeCard href={upgradeHref} />
  );
}
