"use client";

import Link from "next/link";
import { Check, Lock } from "lucide-react";

/**
 * Shown on every independent-legal-advice page while the stage is still
 * closed, so the two gate conditions are visible rather than just a lock.
 */
export default function IlaGateNotice({
  title,
  handshakeDone,
  caseManagerApproved,
  reason,
}: {
  title: string;
  handshakeDone: boolean;
  caseManagerApproved: boolean;
  reason: string | null;
}) {
  const steps = [
    { label: "Both partners confirm the agreement", done: handshakeDone },
    { label: "Case manager approves the case", done: caseManagerApproved },
  ];

  return (
    <div className="min-h-full bg-slate-100 px-5 py-6 sm:px-8" style={{ zoom: 0.9 }}>
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-[#E7E7F2] bg-white p-8 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06)] sm:p-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EDE9FE] text-[#6D28D9]">
            <Lock className="h-5 w-5" />
          </div>

          <h2 className="mt-5 text-[1.3rem] font-extrabold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">{reason}</p>

          <ul className="mt-6 space-y-3 border-t border-[#E7E7F2] pt-6">
            {steps.map((step) => (
              <li key={step.label} className="flex items-center gap-3 text-sm">
                <span
                  className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                    step.done
                      ? "bg-emerald-500 text-white"
                      : "border-[1.5px] border-slate-300"
                  }`}
                >
                  {step.done && <Check className="h-3 w-3" strokeWidth={3.5} />}
                </span>
                <span
                  className={
                    step.done ? "font-medium text-slate-800" : "text-slate-500"
                  }
                >
                  {step.label}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/dashboard/final-review-confirmation"
              className="rounded-[10px] bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Go to Final Review
            </Link>
            <Link
              href="/dashboard"
              className="rounded-[10px] border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
