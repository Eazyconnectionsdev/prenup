"use client";

import React from "react";
import { ReportsView } from "@/components/caseManager/views/ReportsView";
import type { CaseItem } from "@/types/case-manager";

// Shared mock cases (same data as CM for now; swap with API call in production)
const MOCK_CASES: CaseItem[] = [];

/**
 * AdminReportsView – renders the same Reports view as the Case Manager.
 * Admin sees aggregated reports across all entities.
 */
export const AdminReportsView: React.FC = () => {
  return (
    <ReportsView
      cases={MOCK_CASES}
      onLogApiCall={(ep, method, payload) => {
        console.log("Admin report API call:", method, ep, payload);
      }}
    />
  );
};
