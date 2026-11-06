"use client";

import { useRouter } from "next/navigation";
import {
  CreditCard,
  FileSignature,
  Scale,
  UserRoundCheck,
  Users,
} from "lucide-react";
import { orderedStages, type CaseStage, type CaseStages } from "@/types/dashboard/case-stages";

/** One tile colour per stage, in the order the backend returns them. */
const STAGE_TILES = [
  "from-[#34D399] to-[#059669]",
  "from-[#FBBF24] to-[#F59E0B]",
  "from-[#60A5FA] to-[#2563EB]",
  "from-[#FB7185] to-[#E11D48]",
];

const STAGE_ICONS = [
  <CreditCard key="1" className="h-5 w-5" strokeWidth={1.8} />,
  <FileSignature key="2" className="h-5 w-5" strokeWidth={1.8} />,
  <Users key="3" className="h-5 w-5" strokeWidth={1.8} />,
  <UserRoundCheck key="4" className="h-5 w-5" strokeWidth={1.8} />,
];

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "Completed"
      ? "bg-[#DCFCE7] text-[#16A34A]"
      : status === "In Progress"
        ? "bg-amber-100 text-amber-700"
        : "bg-[#F1F1F6] text-[#9494AA]";

  return (
    <span
      className={`ml-4 flex-shrink-0 rounded-lg px-4 py-2 text-xs font-semibold ${tone}`}
    >
      {status}
    </span>
  );
}

function Row({
  tile,
  icon,
  badge,
  title,
  description,
  trailing,
}: {
  tile: string;
  icon: React.ReactNode;
  badge: React.ReactNode;
  title: string;
  description?: string;
  trailing: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#EDEDF5] bg-white px-4 py-4">
      <div
        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm ${tile}`}
      >
        {icon}
      </div>

      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#EDE9FE] text-xs font-bold text-[#6D28D9]">
        {badge}
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-[#1E1B3C]">{title}</div>
        {description && (
          <div className="mt-0.5 max-w-md text-xs text-[#8A8AA0]">
            {description}
          </div>
        )}
      </div>

      {trailing}
    </div>
  );
}

/**
 * The case's journey once the case manager has approved it: the stages the
 * backend already tracks, each settled, and then the independent legal advice
 * step, which is the only one left for the couple to act on.
 */
export default function PrenupJourneyStages({
  stages,
  ilaStarted,
  ilaComplete,
  ilaHref = "/dashboard/lawyer-questionaries",
}: {
  stages?: CaseStages | null;
  /** Either partner has begun the pre-lawyer questionnaire or picked a lawyer. */
  ilaStarted: boolean;
  /** Both partners have submitted their questionnaire and chosen a lawyer. */
  ilaComplete: boolean;
  ilaHref?: string;
}) {
  const router = useRouter();
  const rows: CaseStage[] = orderedStages(stages);

  return (
    <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold tracking-tight text-[#1E1B3C]">
        Your Prenup Journey
      </h2>
      <p className="mt-1 text-sm text-[#6B6B80]">
        Welcome to your dashboard! This page will help guide you through your
        prenup journey.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        {rows.map((stage, i) => (
          <Row
            key={stage.id}
            tile={STAGE_TILES[i % STAGE_TILES.length]}
            icon={STAGE_ICONS[i % STAGE_ICONS.length]}
            badge={stage.id}
            title={`Stage ${stage.id} ${stage.name}`}
            trailing={<StatusBadge status={String(stage.status)} />}
          />
        ))}

        <Row
          tile="from-[#A78BFA] to-[#7C3AED]"
          icon={<Scale className="h-5 w-5" strokeWidth={1.8} />}
          badge="ILA"
          title="Independent Legal Advice (ILA)"
          description="Each of you now needs your own independent solicitor before the agreement can be signed."
          trailing={
            ilaComplete ? (
              <StatusBadge status="Completed" />
            ) : (
              <button
                type="button"
                onClick={() => router.push(ilaHref)}
                className="ml-4 flex-shrink-0 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-primary/90"
              >
                {ilaStarted ? "Continue ILA Process" : "Start ILA Process"}
              </button>
            )
          }
        />
      </div>

      {rows.length === 0 && (
        <p className="mt-3 text-xs text-[#8A8AA0]">
          Your earlier stages will appear here once the case loads.
        </p>
      )}
    </div>
  );
}
