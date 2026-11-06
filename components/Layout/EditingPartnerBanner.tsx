"use client";

import { usePathname } from "next/navigation";
import { useJointSectionStatus } from "@/hooks/useJointSectionStatus";

// The partner's questionnaire pages: for the partner who sent the case back
// for changes, these open as the editable forms on the other partner's answers.
const PARTNER_FORM_PAGES = [
  "partner-personal-info",
  "partner-legal-declaration",
  "partner-family",
  "partner-individual_assets",
  "partner-income_revenue",
  "partner-liabilities_debts",
];

export default function EditingPartnerBanner() {
  const pathname = usePathname();
  const { iDisapproved } = useJointSectionStatus();

  const page = pathname.replace(/^\/dashboard\//, "").split("/")[0];
  if (!iDisapproved || !PARTNER_FORM_PAGES.includes(page)) return null;

  return (
    <div className="mx-auto mt-4 max-w-5xl rounded-lg bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
      You are editing your partner&apos;s information. Changes are saved to their answers.
    </div>
  );
}
