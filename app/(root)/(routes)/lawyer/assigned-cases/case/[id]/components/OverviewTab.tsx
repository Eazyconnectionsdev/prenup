"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { Props } from "@/types/case-detail/tabs/overview-tab";
import CaseOverview from "@/components/caseShared/CaseOverview";

// Same Overview as the case manager's, with Phase 2 of the workflow only.
export default function OverviewTab({ caseData }: Props) {
  const me = useSelector((state: RootState) => state.auth.user);
  return <CaseOverview caseData={caseData} portal="lawyer" me={me} />;
}
