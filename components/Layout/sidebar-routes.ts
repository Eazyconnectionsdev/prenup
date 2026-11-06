import {
  CreditCard,
  UserRound,
  Scale,
  UsersRound,
  Landmark,
  TrendingUp,
  HeartHandshake,
  ClipboardList,
  Gavel,
  type LucideIcon,
} from "lucide-react";

/**
 * What the dashboard sidebar is made of, as data.
 *
 * Every row in the sidebar is one of these routes, and every step is a list
 * of them. AppSidebar turns this into the step array it renders, so adding a
 * page means adding an entry here rather than another block of JSX.
 */

/** One collapsible step. `locateSection` maps a URL back to one of these. */
export type SectionKey =
  "section1" | "section2" | "section3" | "section4" | "section5" | "section6";

/** One page in the sidebar: `/dashboard/<id>`, or `/dashboard/partner-<id>`. */
export type LeafDef = { id: string; icon: LucideIcon; label: string };

/**
 * A row inside a step: either a page on its own, or a named sub-group of
 * pages that collapses as a unit ("Financial Disclosure").
 */
export type SidebarRow =
  | { kind: "leaf"; leaf: LeafDef }
  | {
      kind: "group";
      label: string;
      leaves: LeafDef[];
      /** Keeps the group open while one of its pages is the one being viewed */
      hasActiveChild: boolean;
    };

/** One numbered step: its header, and the tree of routes under it. */
export type StepDef = {
  section: SectionKey;
  number: number;
  title: string;
  subtitle?: string;
  /** Drives the thin completion bar under the subtitle */
  progress?: { done: number; total: number };
  locked?: boolean;
  lockReason?: string;
  /** A step that links straight to one page instead of opening a tree. */
  href?: string;
  active?: boolean;
  /** The routes under the header. Omitted for a link step. */
  rows?: SidebarRow[];
  /** Its leaves route to `partner-<id>` and show the partner's answers. */
  isPartner?: boolean;
  isLeafDone?: (leafId: string) => boolean;
  isLeafLocked?: (leafId: string) => boolean;
  leafLockReason?: string;
};

/** A labelled run of steps, e.g. "Agreement steps". */
export type StepGroup = { label: string; steps: StepDef[] };

/** The partner's copy of a page lives at the same id behind this prefix. */
export const PARTNER_PREFIX = "partner-";

/** Which key in myInformation / jointInformation holds a leaf's answers. */
export const LEAF_TO_KEY: Record<string, string> = {
  "personal-info": "personalInformation",
  "legal-declaration": "legalDeclaration",
  family: "familyAndDependents",
  individual_assets: "individualAssets",
  income_revenue: "incomeAndRevenue",
  liabilities_debts: "liabilitiesAndDebts",
  "joint-assets": "jointAssets",
  "joint-income-revenue": "jointIncomeAndRevenue",
  "joint-liabilities-debts": "jointLiabilitiesAndDebts",
  "matrimonial-agreement": "matrimonialAgreement",
};

export const PERSONAL_LEAFS: LeafDef[] = [
  { id: "personal-info", icon: UserRound, label: "Personal Information" },
  { id: "legal-declaration", icon: Scale, label: "Legal Declaration" },
  { id: "family", icon: UsersRound, label: "Family & Dependents" },
];

export const FINANCIAL_LEAFS: LeafDef[] = [
  { id: "individual_assets", icon: Landmark, label: "Assets" },
  { id: "income_revenue", icon: TrendingUp, label: "Income & Revenue" },
  { id: "liabilities_debts", icon: CreditCard, label: "Liabilities & Debts" },
];

export const JOINT_FINANCIAL_LEAFS: LeafDef[] = [
  { id: "joint-assets", icon: Landmark, label: "Joint Assets" },
  {
    id: "joint-income-revenue",
    icon: TrendingUp,
    label: "Joint Income & Revenue",
  },
  {
    id: "joint-liabilities-debts",
    icon: CreditCard,
    label: "Joint Liabilities & Debts",
  },
];

export const MATRIMONIAL_LEAF: LeafDef = {
  id: "matrimonial-agreement",
  icon: HeartHandshake,
  label: "Matrimonial Agreement & Review",
};

/**
 * Independent legal advice -- the same two pages for each partner, reached as
 * `lawyer-*` for me and `partner-lawyer-*` for my partner, exactly like the
 * questionnaire leaves above.
 */
export const ILA_LEAFS: LeafDef[] = [
  {
    id: "lawyer-questionaries",
    icon: ClipboardList,
    label: "Pre-Lawyer Questionnaire",
  },
  { id: "lawyer-selection", icon: Gavel, label: "Lawyer Selection" },
];

export const JOINT_LEAFS = [...JOINT_FINANCIAL_LEAFS, MATRIMONIAL_LEAF];

export const MY_LEAF_IDS = [...PERSONAL_LEAFS, ...FINANCIAL_LEAFS].map(
  (leaf) => leaf.id,
);
export const JOINT_LEAF_IDS = JOINT_LEAFS.map((leaf) => leaf.id);
export const ILA_LEAF_IDS = ILA_LEAFS.map((leaf) => leaf.id);

/** Strips `/dashboard/` and any trailing slash: the leaf id being viewed. */
export function activeLeafFromPath(pathname: string): string {
  return pathname.replace(/^\/dashboard\/?/, "").replace(/\/+$/, "");
}

/** The step that owns the page being viewed, so it can open on arrival. */
export function locateSection(activeLeaf: string): SectionKey | null {
  const isPartner = activeLeaf.startsWith(PARTNER_PREFIX);
  const id = (
    isPartner ? activeLeaf.slice(PARTNER_PREFIX.length) : activeLeaf
  ).split("/")[0];

  if (!isPartner && JOINT_LEAF_IDS.includes(id)) return "section3";
  if (ILA_LEAF_IDS.includes(id)) return isPartner ? "section6" : "section5";
  if (MY_LEAF_IDS.includes(id)) return isPartner ? "section2" : "section1";
  return null;
}

/** Is this leaf (or a page below it) the one being viewed? */
export function isLeafActive(
  activeLeaf: string,
  leafId: string,
  isPartner?: boolean,
): boolean {
  const routeId = isPartner ? `${PARTNER_PREFIX}${leafId}` : leafId;
  return activeLeaf === routeId || activeLeaf.startsWith(`${routeId}/`);
}

/** Shorthand for the two row kinds, so the step list reads as a list. */
export const leafRow = (leaf: LeafDef): SidebarRow => ({ kind: "leaf", leaf });

export const groupRow = (
  label: string,
  leaves: LeafDef[],
  hasActiveChild: boolean,
): SidebarRow => ({ kind: "group", label, leaves, hasActiveChild });
