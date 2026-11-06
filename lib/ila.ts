import type { CaseApproval } from "@/types/store/cases-slice";
import type { LawyerOption, PreQuestionnaireSlot } from "@/types/dashboard/lawyer-selection";
import { resolvePartyInformation } from "@/lib/caseSections";

/**
 * The independent-legal-advice stage opens once both partners have confirmed
 * the agreement (the handshake) and the case manager has approved the case --
 * the same point at which the backend moves the case to LAWYERS_ASSIGNED.
 * Mirrors `assertPreLawyerStageOpen` in cases.service.ts.
 */
export function getIlaGate(approval?: CaseApproval | null) {
  const handshakeDone = Boolean(
    approval?.user1Approved && approval?.user2Approved,
  );
  const caseManagerApproved = Boolean(approval?.caseManagerApproved);

  return {
    handshakeDone,
    caseManagerApproved,
    unlocked: handshakeDone && caseManagerApproved,
    reason: !handshakeDone
      ? "Both you and your partner need to confirm the agreement in Final Review before this step opens."
      : !caseManagerApproved
        ? "Your case manager is reviewing the agreement. This step opens as soon as they approve it."
        : null,
  };
}

/** Pick the viewer's own slot, or their partner's, from the case. */
export function pickPreQuestionnaire(
  endUserType: string | null | undefined,
  user1?: unknown,
  user2?: unknown,
  which: "mine" | "partner" = "mine",
): PreQuestionnaireSlot {
  const { mine, theirs } = resolvePartyInformation<PreQuestionnaireSlot>(
    endUserType,
    user1 as PreQuestionnaireSlot | undefined,
    user2 as PreQuestionnaireSlot | undefined,
  );
  return which === "mine" ? mine : theirs;
}

/** The populated lawyer object, or null when nothing has been chosen. */
export function asLawyer(
  selected: PreQuestionnaireSlot["selectedLawyer"],
): LawyerOption | null {
  if (!selected || typeof selected === "string") return null;
  return selected;
}

export function lawyerFirmName(lawyer?: LawyerOption | null): string {
  const company = lawyer?.company;
  if (!company || typeof company === "string") return "";
  return company.name ?? "";
}

export function lawyerInitials(name?: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = [parts[0]?.[0], parts[parts.length - 1]?.[0]]
    .filter(Boolean)
    .join("");
  return (letters || name[0]).toUpperCase();
}

/**
 * Human-readable labels for the pre-lawyer questionnaire, in the order the
 * form asks them. Drives the read-only partner view.
 */
export const PRE_LAWYER_SECTIONS: {
  title: string;
  fields: { key: string; label: string }[];
}[] = [
  {
    title: "Part 1 — Participation & Free Will",
    fields: [
      { key: "complianceParticipation", label: "Participating voluntarily" },
      { key: "compliancePurpose", label: "Understands the agreement's purpose" },
      { key: "complianceFreeWill", label: "Entering of their own free will" },
      {
        key: "complianceLegalOpportunity",
        label: "Had the opportunity to take legal advice",
      },
      {
        key: "weddingTimingAssessment",
        label: "Timing relative to the wedding",
      },
    ],
  },
  {
    title: "Part 2 — Legal Understanding",
    fields: [
      {
        key: "complianceRadmacherUnderstanding",
        label: "Understands the Radmacher principles",
      },
      {
        key: "complianceCourtDiscretion",
        label: "Understands the court retains discretion",
      },
      {
        key: "complianceFinancialImpact",
        label: "Understands the financial impact",
      },
      { key: "compliancePodeUtilization", label: "Use of PODE" },
    ],
  },
  {
    title: "Part 3 — Circumstances & Needs",
    fields: [
      { key: "userAge", label: "Their age" },
      { key: "partnerAge", label: "Their partner's age" },
      { key: "relationshipDuration", label: "Length of the relationship" },
      { key: "medicalExists", label: "Medical considerations" },
      { key: "medicalDetails", label: "Medical details" },
      { key: "housingNeeds", label: "Housing needs" },
      { key: "incomeNeeds", label: "Income needs" },
      { key: "pensionNeeds", label: "Pension needs" },
    ],
  },
  {
    title: "Part 4 — Disclosure",
    fields: [
      { key: "complianceDisclosureScope", label: "Scope of disclosure" },
      { key: "complianceDigitalAssets", label: "Digital assets" },
      {
        key: "complianceDigitalAssetsDetails",
        label: "Digital asset details",
      },
      {
        key: "complianceCorporateRestrictions",
        label: "Corporate restrictions",
      },
      {
        key: "complianceCorporateRestrictionsDetails",
        label: "Corporate restriction details",
      },
      { key: "complianceWorldwideScope", label: "Worldwide scope" },
      { key: "complianceDataAccuracy", label: "Confirms the data is accurate" },
      {
        key: "finalDeclarationSignature",
        label: "Signed the final declaration",
      },
    ],
  },
];

/** Render one stored answer for the read-only view. */
export function formatAnswer(value: unknown): string {
  if (value === true) return "Yes";
  if (value === false) return "No";
  if (value === null || value === undefined) return "";
  const text = String(value).trim();
  if (!text) return "";
  // Stored values look like "Confirmed", "Flagged_Time", "LessThan14", "60-90"
  return text
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Za-z])(\d)/g, "$1 $2")
    .trim();
}
