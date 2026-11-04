"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useJointSectionStatus } from "@/hooks/useJointSectionStatus";

// The four agreement steps and their forms. The partner who is waiting (their
// request is being reviewed, or their partner is editing) cannot open these.
const STEP_PAGES = [
  "personal-info",
  "legal-declaration",
  "family",
  "individual_assets",
  "income_revenue",
  "liabilities_debts",
  "partner-personal-info",
  "partner-legal-declaration",
  "partner-family",
  "partner-individual_assets",
  "partner-income_revenue",
  "partner-liabilities_debts",
  "joint-assets",
  "joint-income-revenue",
  "joint-liabilities-debts",
  "matrimonial-agreement",
  "final-review-confirmation",
];

export default function EditLockRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const { ready, lockedOut, locked } = useJointSectionStatus();

  const page = pathname.replace(/^\/dashboard\//, "").split("/")[0];
  const shouldLeave = ready && lockedOut && !locked && STEP_PAGES.includes(page);

  useEffect(() => {
    if (shouldLeave) router.replace("/dashboard");
  }, [shouldLeave, router]);

  return null;
}
