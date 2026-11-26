"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Lock,
  Mail,
  MessageCircleQuestion,
  Sparkles,
} from "lucide-react";
import { paymentHref } from "@/lib/casePayment";
import { isAgreementType } from "@/lib/agreementTypes";
import { formatPounds, LEGAL_ADVICE_FEE_GBP } from "@/lib/servicePricing";
import { QUESTIONNAIRE_STEPS } from "@/components/questionnaire/steps";
import { SERVICE_SELECTOR_HREF } from "@/components/ServiceStatus";
import { CONTACT_TEAM_EMAIL } from "@/components/questionnaire/CeremonyBlockedModal";

// What opens up once the case is paid for, in the order the couple meets it.
const JOURNEY = [
  "Invite your partner to join",
  "Complete your questionnaires",
  "Review and agree on your agreement",
  "Choose your independent lawyers",
  "Finalise, download and sign your agreement",
];

// The shared sections worked through together after the individual ones.
const JOINT_TOPICS = [
  "Joint assets",
  "Joint income and revenue",
  "Joint liabilities and debts",
  "Matrimonial agreement terms",
];

const primaryButton =
  "group inline-flex items-center justify-center gap-2 rounded-full bg-[#6D4AFF] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#6D4AFF]/25 transition hover:bg-[#5B3AE8] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#6D4AFF]/30";
const outlineButton =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[#DDD6FE] bg-white px-5 py-2.5 text-sm font-semibold text-[#5B3AE8] transition hover:bg-[#FAF9FF] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#6D4AFF]/20";

/**
 * Shown on the dashboard in place of the progress cards and the journey until
 * the case is paid for: what to buy, and what buying it unlocks.
 */
export default function PurchasePrompt({
  agreementType,
}: {
  agreementType?: string | null;
}) {
  const [showTopics, setShowTopics] = useState(false);

  // Once a service has been saved the selector only shows it read-only, so a
  // couple who chose already goes straight on to pay for it.
  const purchaseHref =
    isAgreementType(agreementType) && agreementType !== "help-choose"
      ? paymentHref(agreementType)
      : SERVICE_SELECTOR_HREF;

  return (
    <div className="mt-6 space-y-5">
      {/* Purchase */}
      <section className="flex flex-col overflow-hidden rounded-2xl border border-[#EDEDF5] bg-white shadow-sm sm:flex-row">
        <div className="relative h-44 w-full shrink-0 bg-[#F3F0FF] sm:h-auto sm:w-64">
          <Image
            src="/hero-couple.png"
            alt=""
            fill
            sizes="(min-width: 640px) 16rem, 100vw"
            className="object-cover"
            preload
          />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-3 p-6">
          <h2 className="text-xl font-bold tracking-tight text-[#1E1B3C]">
            Purchase your UK prenuptial agreement
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-[#6B6B80]">
            Includes your professionally prepared agreement, with independent
            legal advice arranged separately at{" "}
            {formatPounds(LEGAL_ADVICE_FEE_GBP)} per person, payable directly
            to each lawyer.
          </p>
          <div className="pt-1">
            <Link href={purchaseHref} className={primaryButton}>
              Purchase your prenup
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* What checkout unlocks */}
      <section className="rounded-2xl border border-[#EDEDF5] bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EDE9FE] text-[#6D28D9]">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#1E1B3C]">
              Unlock your agreement journey
            </h2>
            <p className="mt-1 text-sm text-[#6B6B80]">
              After checkout, you&apos;ll get a personalised space to complete
              your agreement, step by step.
            </p>
          </div>
        </div>

        <ol className="mt-5 space-y-0 pl-1">
          {JOURNEY.map((step, i) => (
            <li key={step} className="relative flex items-start gap-3 pb-4 last:pb-0">
              {i < JOURNEY.length - 1 && (
                <span
                  className="absolute left-[9px] top-5 h-full w-px bg-[#E4E0F5]"
                  aria-hidden="true"
                />
              )}
              <span className="relative z-10 flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full border-2 border-[#C4B5FD] bg-white text-[10px] font-bold text-[#6D28D9]">
                {i + 1}
              </span>
              <span className="text-sm font-medium text-[#1E1B3C]">{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#FAF9FF] p-4 ring-1 ring-[#EDE9FE]">
          <Sparkles
            className="mt-0.5 h-5 w-5 shrink-0 text-[#6D4AFF]"
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-semibold text-[#1E1B3C]">
              New to prenups?
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[#6B6B80]">
              Don&apos;t worry — we&apos;ll guide you through each step with
              clear instructions and helpful resources, so you can make
              confident decisions together.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowTopics((open) => !open)}
          aria-expanded={showTopics}
          aria-controls="purchase-prompt-topics"
          className={`${outlineButton} mt-5 w-full`}
        >
          Preview what you&apos;ll cover
          <ChevronDown
            className={`h-4 w-4 transition-transform ${showTopics ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>

        {showTopics && (
          <div
            id="purchase-prompt-topics"
            className="mt-4 grid gap-4 rounded-xl border border-[#EDEDF5] p-4 sm:grid-cols-2"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8A8AA0]">
                Each of you
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-[#1E1B3C]">
                {QUESTIONNAIRE_STEPS.map((step) => (
                  <li key={step.slug} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#6D4AFF]" />
                    {step.title}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8A8AA0]">
                Together
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-[#1E1B3C]">
                {JOINT_TOPICS.map((topic) => (
                  <li key={topic} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#6D4AFF]" />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* Support */}
      <section className="flex flex-col gap-4 rounded-2xl border border-[#EDEDF5] bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EDE9FE] text-[#6D28D9]">
          <MessageCircleQuestion className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="flex-1">
          <h2 className="text-base font-bold text-[#1E1B3C]">Any questions?</h2>
          <p className="mt-0.5 text-sm text-[#6B6B80]">
            Speak with our friendly team for support.
          </p>
        </div>
        <a href={`mailto:${CONTACT_TEAM_EMAIL}`} className={outlineButton}>
          <Mail className="h-4 w-4" aria-hidden="true" />
          Contact our team
        </a>
      </section>
    </div>
  );
}
