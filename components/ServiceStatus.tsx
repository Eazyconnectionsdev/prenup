import Link from "next/link";
import { Check, Crown } from "lucide-react";
import StatCard, {
  ApprovedPill,
  statCardActionClasses,
  statCardBadgeClasses,
  statCardCaptionClasses,
} from "@/components/dashboard/StatCard";
import {
  agreementTypeLabel,
  agreementTypeServiceLabel,
  agreementTypeSituationLabel,
} from "@/lib/agreementTypes";

export const SERVICE_SELECTOR_HREF = "/dashboard/service-selector";

const CrownIcon = (
  <Crown className="h-5 w-5 text-[#F59E0B]" fill="currentColor" />
);

export function ServiceStatus({
  agreementType,
  upgradeHref = SERVICE_SELECTOR_HREF,
  approved = false,
}: {
  agreementType?: string | null;
  upgradeHref?: string;
  /**
   * The case manager has approved the case, so the service is settled: the
   * card stops inviting a change of plan and reports where the case stands.
   */
  approved?: boolean;
}) {
  const service = agreementTypeServiceLabel(agreementType);

  if (!service) {
    return (
      <StatCard
        label="Agreement type"
        icon={CrownIcon}
        value="Select agreement"
        subtitle="Prenup / Postnup / Cohabitation"
        action={
          <Link href={upgradeHref} className={statCardActionClasses}>
            Choose
          </Link>
        }
      />
    );
  }

  if (approved) {
    return (
      <StatCard
        tooltip={agreementTypeLabel(agreementType) ?? undefined}
        label="Selected service"
        icon={<ApprovedPill />}
        value={service}
        subtitle={agreementTypeSituationLabel(agreementType)}
        action={<span className={statCardCaptionClasses}>Completed</span>}
      />
    );
  }

  return (
    <StatCard
      href={upgradeHref}
      tooltip={agreementTypeLabel(agreementType) ?? undefined}
      label="Selected service"
      icon={CrownIcon}
      value={service}
      subtitle={agreementTypeSituationLabel(agreementType)}
      action={
        <span className={statCardBadgeClasses}>
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
          Selected
        </span>
      }
    />
  );
}
