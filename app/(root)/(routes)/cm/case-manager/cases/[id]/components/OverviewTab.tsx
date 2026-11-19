"use client";

import type { Props } from "@/types/case-detail/tabs/overview-tab";
import CaseOverview from "@/components/caseShared/CaseOverview";

export default function OverviewTab({ caseData }: Props) {
  return <CaseOverview caseData={caseData} portal="cm" />;
}
