"use client";

import { Suspense } from "react";
import { ArchivedVaultView } from "@/components/caseManager/views/ArchivedVaultView";

export default function LawyerArchivedPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-500 text-sm">Loading archived cases...</div>}>
      <ArchivedVaultView portal="lawyer" />
    </Suspense>
  );
}
