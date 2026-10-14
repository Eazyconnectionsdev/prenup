import Link from "next/link";
import { Crown } from "lucide-react";

// Where the service is chosen and where it can be looked at again
export const SERVICE_SELECTOR_HREF = "/dashboard/service-selector";

const cardClasses =
  "flex h-full items-center gap-3 rounded-2xl border border-[#E7E7F2] bg-white p-4";

function CrownTile() {
  return (
    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#FEF3C7] text-[#D97706]">
      <Crown className="h-5 w-5" />
    </span>
  );
}

function SelectedServiceCard({
  value,
  title,
  href,
}: {
  value: string;
  title?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      title={title}
      className={`${cardClasses} transition hover:border-[#6D4AFF]/40 hover:shadow-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-[#6D4AFF]/30`}
    >
      <CrownTile />
      <div className="min-w-0">
        <div className="text-sm font-bold text-[#1E1B3C]">Selected service</div>
        <div className="truncate text-xs text-[#8A8AA0]">{value}</div>
      </div>
    </Link>
  );
}

function UpgradeCard({ href = SERVICE_SELECTOR_HREF }: { href?: string }) {
  return (
    <div className={cardClasses}>
      <CrownTile />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-bold text-[#1E1B3C]">Select Agreement</div>
        <div className="truncate text-xs leading-tight text-[#8A8AA0]">
          Prenup / Postnup /Cohab
        </div>
      </div>
      <Link
        href={href}
        className="flex-shrink-0 rounded-lg bg-[#6D4AFF] px-3 py-2 text-xs font-semibold text-white shadow-sm shadow-[#6D4AFF]/30 transition hover:bg-[#5B3AE8] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#6D4AFF]/30"
      >
        Choose Agreement
      </Link>
    </div>
  );
}

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
    <SelectedServiceCard
      value={service}
      title={serviceTitle ?? service}
      href={upgradeHref}
    />
  ) : (
    <UpgradeCard href={upgradeHref} />
  );
}
