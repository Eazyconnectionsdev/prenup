"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { asLawyer, lawyerFirmName, lawyerInitials } from "@/lib/ila";
import type { PreQuestionnaireSlot } from "@/types/dashboard/lawyer-selection";

type Member = {
  key: string;
  /** Whose solicitor this is, for the empty state's wording. */
  whose: string;
  lawyer: ReturnType<typeof asLawyer>;
};

function Avatar({ name, src }: { name: string; src?: string | null }) {
  if (src) {
    return (
      <Image
        src={src}
        alt={`Photo of ${name}`}
        width={44}
        height={44}
        unoptimized
        className="h-11 w-11 flex-shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#EDE9FE] text-sm font-semibold text-[#5B3FD9]"
    >
      {lawyerInitials(name)}
    </div>
  );
}

/**
 * The two independent solicitors on the case -- the one this user chose and
 * the one their partner chose. Each side picks their own, so the card fills
 * in a row at a time and says who is still to choose.
 */
export default function LegalTeamCard({
  myPre,
  partnerPre,
}: {
  myPre?: PreQuestionnaireSlot;
  partnerPre?: PreQuestionnaireSlot;
}) {
  const members: Member[] = [
    { key: "mine", whose: "Your solicitor", lawyer: asLawyer(myPre?.selectedLawyer) },
    {
      key: "partner",
      whose: "Your partner's solicitor",
      lawyer: asLawyer(partnerPre?.selectedLawyer),
    },
  ];

  const chosen = members.filter((m) => m.lawyer);

  return (
    <section
      aria-label="Your legal team"
      className="w-full rounded-2xl border border-[#EDEDF5] bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-bold tracking-tight text-[#1E1B3C]">
          Your Legal Team
        </h3>
        {chosen.length === members.length && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] px-2.5 py-0.5 text-xs font-medium text-[#16A34A]">
            <Check className="h-3 w-3" aria-hidden="true" />
            Complete
          </span>
        )}
      </div>

      {chosen.length === 0 ? (
        <p className="mt-4 text-sm text-[#8A8AA0]">
          Your solicitors will appear here once you and your partner have each
          chosen one in the independent legal advice step.
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          {members.map((member) => {
            const lawyer = member.lawyer;

            if (!lawyer) {
              return (
                <div key={member.key} className="flex items-center gap-3">
                  <div
                    aria-hidden="true"
                    className="h-11 w-11 flex-shrink-0 rounded-full border border-dashed border-[#DDD6FE] bg-[#FAF9FF]"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#1E1B3C]">
                      {member.whose}
                    </p>
                    <p className="truncate text-xs text-[#8A8AA0]">
                      Not chosen yet
                    </p>
                  </div>
                </div>
              );
            }

            const firm = lawyerFirmName(lawyer);

            return (
              <div key={member.key} className="flex items-center gap-3">
                <Avatar name={lawyer.name} src={lawyer.avatarUrl} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#1E1B3C]">
                    {lawyer.name}
                  </p>
                  <p className="truncate text-xs text-[#8A8AA0]">Solicitor</p>
                  <p className="truncate text-xs text-[#8A8AA0]">
                    {firm || member.whose}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
