"use client";

import Link from "next/link";
import BrandLogo from "@/components/brand/BrandLogo";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState, type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Home,
  FileText,
  ChevronRight,
  Check,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { AppDispatch, RootState } from "@/store/store";
import { getCasesDetails } from "@/store/asyncThunk/casesThunk";
import { resolvePartyInformation } from "@/lib/caseSections";
import { useJointSectionStatus } from "@/hooks/useJointSectionStatus";
import { isCaseManagerApproved } from "@/lib/caseStage";
import { isCasePaid } from "@/lib/casePayment";
import {
  activeLeafFromPath,
  FINANCIAL_LEAFS,
  groupRow,
  ILA_LEAF_IDS,
  ILA_LEAFS,
  isLeafActive,
  JOINT_FINANCIAL_LEAFS,
  JOINT_LEAF_IDS,
  leafRow,
  LEAF_TO_KEY,
  locateSection,
  MATRIMONIAL_LEAF,
  MY_LEAF_IDS,
  PERSONAL_LEAFS,
  type LeafDef,
  type SectionKey,
  type StepDef,
  type StepGroup,
} from "./sidebar-routes";


function ActiveRail() {
  return (
    <span className="absolute -left-3 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r-full bg-[#8B87FF] shadow-[0_0_10px_rgba(139,135,255,0.75)]" />
  );
}

function Collapse({
  open,
  children,
  bleed,
}: {
  open: boolean;
  children: ReactNode;
  bleed?: boolean;
}) {
  return (
    <div
      aria-hidden={!open}
      inert={!open}
      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className={`min-h-0 overflow-hidden ${bleed ? "-ml-6 pl-6" : ""}`}>
        {children}
      </div>
    </div>
  );
}

function StatusDot({ done, locked }: { done?: boolean; locked?: boolean }) {
  if (locked) return <Lock className="h-3.5 w-3.5 flex-shrink-0" />;
  if (done)
    return (
      <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.15)]">
        <Check className="h-2.5 w-2.5 text-white" strokeWidth={3.5} />
      </span>
    );
  return (
    <span className="h-4 w-4 flex-shrink-0 rounded-full border-[1.5px] border-white/20" />
  );
}

function StepHeader({
  number,
  title,
  subtitle,
  progress,
  open,
  active,
  onClick,
  href,
  locked,
  lockReason,
}: {
  number: number;
  title: string;
  subtitle?: string;
  progress?: { done: number; total: number };
  open?: boolean;
  active?: boolean;
  onClick?: () => void;
  href?: string;
  locked?: boolean;
  lockReason?: string;
}) {
  const highlighted = active || open;
  const percent =
    progress && progress.total > 0
      ? Math.round((progress.done / progress.total) * 100)
      : 0;

  const inner = (
    <>
      {active && <ActiveRail />}

      <span className="mt-[1px] flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full bg-[#5B55F6] text-[11px] font-semibold text-white shadow-[0_0_0_3px_rgba(91,85,246,0.22)]">
        {number}
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={`block truncate text-[14px] font-medium transition-colors duration-200 ${
            highlighted ? "text-white" : "text-[#D6D8F2] group-hover:text-white"
          }`}
        >
          {title}
        </span>

        {subtitle && (
          <span className="mt-0.5 block truncate text-[11px] text-[#7F82B5]">
            {subtitle}
          </span>
        )}

        {/* {progress && (
          <span className="mt-2 block h-[5px] overflow-hidden rounded-full bg-white/[0.09]">
            <span
              className="block h-full rounded-full bg-gradient-to-r from-[#8B87FF] to-[#5B55F6] transition-[width] duration-500"
              style={{ width: `${percent}%` }}
            />
          </span>
        )} */}
      </span>

      {locked ? (
        <Lock className="mt-[3px] h-4 w-4 flex-shrink-0" />
      ) : (
        <ChevronRight
          className={`mt-[3px] h-4 w-4 flex-shrink-0 text-[#8A8DC0] transition-transform duration-300 ${
            !href && open ? "rotate-90" : ""
          }`}
        />
      )}
    </>
  );

  // Every step sits on its own card, open or not
  const cls = `group relative flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 ${
    locked
      ? "bg-white/[0.03]"
      : active
        ? "bg-[#2B2E6F] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
        : open
          ? "bg-white/[0.06]"
          : "bg-white/[0.03] hover:bg-white/[0.06]"
  }`;

  // A locked step is neither a button nor a link, so it cannot be opened.
  if (locked)
    return (
      <div aria-disabled="true" title={lockReason} className={cls}>
        {inner}
      </div>
    );

  if (href)
    return (
      <Link
        href={href}
        className={cls}
        aria-current={active ? "page" : undefined}
      >
        {inner}
      </Link>
    );

  return (
    <button
      type="button"
      onClick={onClick}
      className={cls}
      aria-expanded={open}
    >
      {inner}
    </button>
  );
}

function Leaf({
  id,
  icon: IconC,
  label,
  done,
  activeLeaf,
  locked,
  lockReason,
  isPartner,
}: LeafDef & {
  done?: boolean;
  activeLeaf: string;
  locked?: boolean;
  lockReason?: string;
  isPartner?: boolean;
}) {
  const routeId = isPartner ? `partner-${id}` : id;
  const isActive =
    !locked && (activeLeaf === routeId || activeLeaf.startsWith(`${routeId}/`));

  const content = (
    <>
      {/* Each row draws its own slice of the rail, so the line breaks naturally
          wherever a row (the sub-group heading) sits on the rail instead */}
      <span className="absolute -bottom-0.5 -left-4 -top-0.5 w-px -translate-x-1/2 bg-white/[0.18]" />
      <span
        className={`absolute -left-4 top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-200 ${
          isActive
            ? "bg-[#8B87FF] shadow-[0_0_8px_rgba(139,135,255,0.9)]"
            : "bg-[#55599B] group-hover:bg-[#8B87FF]"
        }`}
      />
      <IconC
        className={`h-4 w-4 flex-shrink-0 transition-colors duration-200 ${
          isActive
            ? "text-[#B7B4FF]"
            : "text-[#8A8DC0] group-hover:text-[#C9C7FF]"
        }`}
        strokeWidth={1.8}
      />
      <span
        className={`flex-1 truncate text-[13px] transition-colors duration-200 ${
          isActive
            ? "font-medium text-white"
            : "text-[#B4B7DE] group-hover:text-white"
        }`}
      >
        {label}
      </span>
      <StatusDot done={done} locked={locked} />
    </>
  );

  const base =
    "group relative my-[2px] flex items-center gap-2.5 rounded-lg px-[11px] py-[7px] transition-all duration-200";

  if (locked) {
    return (
      <div
        aria-disabled="true"
        title={lockReason ?? "Complete payment to unlock"}
        className={`${base} cursor-not-allowed select-none opacity-50`}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={`/dashboard/${routeId}`}
      className={`${base} ${isActive ? "bg-white/[0.09]" : "hover:bg-white/[0.04]"}`}
    >
      {content}
    </Link>
  );
}

function SubGroup({
  label,
  icon: IconC = FileText,
  hasActiveChild,
  children,
}: {
  label: string;
  icon?: LucideIcon;
  // Keeps the group open while one of its pages is the one being viewed
  hasActiveChild?: boolean;
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(true);
  const open = hasActiveChild || expanded;

  return (
    <div className="my-[2px]">
      {/* Pulled out so the heading icon lands on the rail, in place of a dot */}
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={open}
        className="group -ml-[35px] flex w-[calc(100%+35px)] items-center gap-2.5 rounded-lg px-[11px] py-[7px] text-left transition-colors duration-200 hover:bg-white/[0.04]"
      >
        <IconC
          className="h-4 w-4 flex-shrink-0 text-[#A9ACD6]"
          strokeWidth={1.8}
        />
        <span className="flex-1 truncate text-[13px] font-semibold text-[#E4E5F7]">
          {label}
        </span>
        <ChevronRight
          className={`h-3.5 w-3.5 flex-shrink-0 text-[#8A8DC0] transition-transform duration-300 ${
            open ? "rotate-90" : ""
          }`}
        />
      </button>
      {/* Children stay at the same depth as the rest of the tree */}
      <Collapse open={open} bleed>
        {children}
      </Collapse>
    </div>
  );
}

// Holds the rail's column; each leaf draws its own segment of the line
function Tree({ children }: { children: ReactNode }) {
  return <div className="ml-[26px] pb-0.5 pl-4">{children}</div>;
}

/* ------------------------------------------------------------------ */
/* Turning one step's data into rows                                   */
/* ------------------------------------------------------------------ */

// A leaf takes its done / locked state from the step that owns it, so a row
// in the step array needs to say nothing about either.
function StepLeaf({
  step,
  leaf,
  activeLeaf,
}: {
  step: StepDef;
  leaf: LeafDef;
  activeLeaf: string;
}) {
  return (
    <Leaf
      {...leaf}
      done={step.isLeafDone?.(leaf.id)}
      activeLeaf={activeLeaf}
      locked={step.isLeafLocked?.(leaf.id)}
      lockReason={step.leafLockReason}
      isPartner={step.isPartner}
    />
  );
}

function SidebarStep({
  step,
  open,
  onToggle,
  activeLeaf,
}: {
  step: StepDef;
  open: boolean;
  onToggle: () => void;
  activeLeaf: string;
}) {
  const header = (
    <StepHeader
      number={step.number}
      title={step.title}
      subtitle={step.subtitle}
      progress={step.progress}
      href={step.href}
      active={step.active}
      // A step with no rows is a plain link, so it neither opens nor toggles.
      open={step.rows ? open : undefined}
      onClick={step.rows ? onToggle : undefined}
      locked={step.locked}
      lockReason={step.lockReason}
    />
  );

  if (!step.rows) return header;

  return (
    <div>
      {header}
      {/* A locked step stays shut whatever was open before it locked. */}
      <Collapse open={!step.locked && open}>
        <Tree>
          {step.rows.map((row) =>
            row.kind === "leaf" ? (
              <StepLeaf
                key={row.leaf.id}
                step={step}
                leaf={row.leaf}
                activeLeaf={activeLeaf}
              />
            ) : (
              <SubGroup
                key={row.label}
                label={row.label}
                hasActiveChild={row.hasActiveChild}
              >
                {row.leaves.map((leaf) => (
                  <StepLeaf
                    key={leaf.id}
                    step={step}
                    leaf={leaf}
                    activeLeaf={activeLeaf}
                  />
                ))}
              </SubGroup>
            ),
          )}
        </Tree>
      </Collapse>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The sidebar                                                         */
/* ------------------------------------------------------------------ */

export default function AppSidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    status,
    myInformation,
    partnerInformation,
    jointInformation,
    preQuestionnaireUser1,
    preQuestionnaireUser2,
    approval,
    fullyLocked,
    workflowStatus,
    paymentCompleted,
    paymentStatus,
  } = useSelector((state: RootState) => state.cases);

  const user = useSelector((state: RootState) => state.auth.user);
  const { lockedOut } = useJointSectionStatus();

  const pathname = usePathname();
  const activeLeaf = activeLeafFromPath(pathname);
  const isDashboardHome = /^\/dashboard\/?$/.test(pathname);
  const isFinalReview =
    activeLeaf === "final-review-confirmation" ||
    activeLeaf.startsWith("final-review-confirmation/");

  const [openSection, setOpenSection] = useState<SectionKey | null>(
    locateSection(activeLeaf) ?? null,
  );

  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    const target = locateSection(activeLeaf);
    // Open the step that owns the page being viewed. The dashboard home owns
    // no step, so arriving there closes every step -- the sidebar then looks
    // the same whether you navigated back to it or loaded it fresh.
    if (target) setOpenSection(target);
    else if (isDashboardHome) setOpenSection(null);
  }

  const toggleSection = (key: SectionKey) =>
    setOpenSection((prev) => (prev === key ? null : key));

  const inviteCaseId = user?.inviteCaseId;
  useEffect(() => {
    if (inviteCaseId) dispatch(getCasesDetails(inviteCaseId));
  }, [dispatch, inviteCaseId]);

  /* ---- Whose answers are whose ---- */

  const { mine: myData, theirs: partnerData } = resolvePartyInformation(
    user?.endUserType,
    myInformation,
    partnerInformation,
  );
  const { mine: myPre, theirs: partnerPre } = resolvePartyInformation<
    Record<string, any>
  >(user?.endUserType, preQuestionnaireUser1, preQuestionnaireUser2);

  /* ---- Which routes are complete ---- */

  const hasData = (obj?: Record<string, unknown>) =>
    Boolean(obj && Object.keys(obj).length > 0);
  const isLeafDone = (leafId: string, info?: Record<string, any>) =>
    hasData(info?.[LEAF_TO_KEY[leafId]]);

  const myDoneCount = MY_LEAF_IDS.filter((id) => isLeafDone(id, myData)).length;
  const jointDoneCount = JOINT_LEAF_IDS.filter((id) =>
    isLeafDone(id, jointInformation),
  ).length;

  // A leaf of the legal-advice steps is done when its own piece of the
  // pre-questionnaire record is in: the form submitted, the lawyer chosen.
  const isIlaLeafDone = (leafId: string, pre?: Record<string, any>) =>
    leafId === "lawyer-selection"
      ? Boolean(pre?.selectedLawyer)
      : Boolean(pre?.submitted);

  const myIlaDoneCount = ILA_LEAF_IDS.filter((id) =>
    isIlaLeafDone(id, myPre),
  ).length;

  /* ---- What is locked, and why ---- */

  const isPaymentDone = isCasePaid({ paymentCompleted, paymentStatus });

  const bothApproved = Boolean(
    approval?.user1Approved && approval?.user2Approved,
  );

  const caseLocked = Boolean(
    fullyLocked ||
    bothApproved ||
    status?.myInformation?.locked ||
    status?.partnerInformation?.locked ||
    status?.jointInformation?.locked,
  );
  // The partner who sent the request (or whose partner is editing it) waits:
  // all four agreement steps are locked until it comes back.
  const senderLocked = lockedOut && !bothApproved;
  const LOCK_REASON = senderLocked
    ? "Locked while your partner reviews"
    : "Locked - both partners have confirmed the agreement";
  const lockedSubtitle = "Confirmed and locked";

  const agreementStepLocked = caseLocked || senderLocked;

  const isLeafLocked = (leafId: string) =>
    caseLocked || (!isPaymentDone && leafId !== "personal-info");
  const leafLockReason = caseLocked ? LOCK_REASON : undefined;

  // Independent legal advice opens on the handshake (both partners confirmed)
  // plus the case manager's approval -- the same point at which the backend
  // moves the case to LAWYERS_ASSIGNED and emails the four ILA tasks. The
  // whole group stays out of the sidebar until then -- nothing greyed out,
  // nothing to click, as if the stage did not exist yet.
  const ilaUnlocked =
    bothApproved && isCaseManagerApproved(approval, workflowStatus);

  // A party's legal advice is finished once their questionnaire is in and
  // their solicitor is chosen -- or once the backend locks their slot. From
  // then on their step closes, the same way steps 1-4 close on confirmation.
  const ilaPartyLocked = (pre?: Record<string, any>) =>
    Boolean(pre?.locked) || ILA_LEAF_IDS.every((id) => isIlaLeafDone(id, pre));

  const myIlaLocked = ilaPartyLocked(myPre);
  const partnerIlaLocked = ilaPartyLocked(partnerPre);

  /* ---- Which sub-groups hold the page being viewed ---- */

  const myFinancialActive = FINANCIAL_LEAFS.some((leaf) =>
    isLeafActive(activeLeaf, leaf.id),
  );
  const partnerFinancialActive = FINANCIAL_LEAFS.some((leaf) =>
    isLeafActive(activeLeaf, leaf.id, true),
  );
  const jointFinancialActive = JOINT_FINANCIAL_LEAFS.some((leaf) =>
    isLeafActive(activeLeaf, leaf.id),
  );

  const finalSubtitle = bothApproved
    ? "Mutual confirmation complete"
    : status?.jointInformation?.submitted || approval?.user1Approved
      ? "Partner review in progress"
      : "Ready for review";

  /* ---- The sidebar, as the array that gets rendered ---- */

  const stepGroups: StepGroup[] = [
    // Steps 1-4 leave the sidebar once the case manager has approved the case:
    // they are confirmed and locked, and the legal advice steps are all that
    // is left to do.
    ...(ilaUnlocked
      ? []
      : [
          {
            label: "Agreement steps",
            steps: [
              {
                section: "section1" as const,
                number: 1,
                title: "My Questionnaire",
                subtitle: caseLocked
                  ? lockedSubtitle
                  : `${myDoneCount} of ${MY_LEAF_IDS.length} complete`,
                progress: caseLocked
                  ? undefined
                  : { done: myDoneCount, total: MY_LEAF_IDS.length },
                locked: agreementStepLocked,
                lockReason: LOCK_REASON,
                isLeafDone: (id: string) => isLeafDone(id, myData),
                isLeafLocked,
                leafLockReason,
                rows: [
                  ...PERSONAL_LEAFS.map(leafRow),
                  groupRow(
                    "Financial Disclosure",
                    FINANCIAL_LEAFS,
                    myFinancialActive,
                  ),
                ],
              },
              {
                section: "section2" as const,
                number: 2,
                title: "Partner Questionnaire",
                subtitle: caseLocked ? lockedSubtitle : "Shared by partner",
                locked: agreementStepLocked,
                lockReason: LOCK_REASON,
                isPartner: true,
                isLeafDone: (id: string) => isLeafDone(id, partnerData),
                isLeafLocked,
                leafLockReason,
                rows: [
                  ...PERSONAL_LEAFS.map(leafRow),
                  groupRow(
                    "Financial Disclosure",
                    FINANCIAL_LEAFS,
                    partnerFinancialActive,
                  ),
                ],
              },
              {
                section: "section3" as const,
                number: 3,
                title: "Joint Questionnaire",
                subtitle: caseLocked
                  ? lockedSubtitle
                  : `${jointDoneCount} of ${JOINT_LEAF_IDS.length} complete`,
                progress: caseLocked
                  ? undefined
                  : { done: jointDoneCount, total: JOINT_LEAF_IDS.length },
                locked: agreementStepLocked,
                lockReason: LOCK_REASON,
                isLeafDone: (id: string) => isLeafDone(id, jointInformation),
                isLeafLocked,
                leafLockReason,
                rows: [
                  groupRow(
                    "Financial Disclosure",
                    JOINT_FINANCIAL_LEAFS,
                    jointFinancialActive,
                  ),
                  groupRow(
                    "Matrimonial",
                    [MATRIMONIAL_LEAF],
                    jointFinancialActive,
                  ),
                ],
              },
              {
                section: "section4" as const,
                number: 4,
                title: "Final Review & Confirmation",
                subtitle: finalSubtitle,
                href: "/dashboard/final-review-confirmation",
                active: isFinalReview,
                locked: senderLocked,
                lockReason: LOCK_REASON,
              },
            ],
          },
        ]),

    // 5-6 — Independent legal advice, once the case manager has approved.
    ...(ilaUnlocked
      ? [
          {
            label: "Independent legal advice",
            steps: [
              {
                section: "section5" as const,
                number: 5,
                title: "My Legal Advice",
                subtitle: myIlaLocked
                  ? lockedSubtitle
                  : `${myIlaDoneCount} of ${ILA_LEAF_IDS.length} complete`,
                progress: myIlaLocked
                  ? undefined
                  : { done: myIlaDoneCount, total: ILA_LEAF_IDS.length },
                locked: myIlaLocked,
                lockReason:
                  "Locked - your independent legal advice is complete",
                isLeafDone: (id: string) => isIlaLeafDone(id, myPre),
                rows: ILA_LEAFS.map(leafRow),
              },
              {
                section: "section6" as const,
                number: 6,
                title: "Partner's Legal Advice",
                subtitle: partnerIlaLocked
                  ? lockedSubtitle
                  : "Shared by partner",
                locked: partnerIlaLocked,
                lockReason: "Locked - your partner's legal advice is complete",
                isPartner: true,
                isLeafDone: (id: string) => isIlaLeafDone(id, partnerPre),
                rows: ILA_LEAFS.map(leafRow),
              },
            ],
          },
        ]
      : []),
  ];

  return (
    <aside className="flex h-screen w-[315px] flex-shrink-0 flex-col bg-gradient-to-b from-[#1B1E52] via-[#15183F] to-[#101233] font-sans text-white shadow-[8px_0_30px_rgba(10,10,40,0.35)]">
      <div className="flex items-center px-5 pb-5 pt-6">
        <Link href="/dashboard" aria-label="Lets Prenup dashboard">
          <BrandLogo surface="dark" height={30} priority />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Link
          href="/dashboard"
          aria-current={isDashboardHome ? "page" : undefined}
          className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${
            isDashboardHome
              ? "bg-[#2B2E6F] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
              : "hover:bg-white/[0.05]"
          }`}
        >
          {isDashboardHome && <ActiveRail />}
          <Home
            className={`h-[18px] w-[18px] ${
              isDashboardHome
                ? "text-white"
                : "text-[#A9ACD6] group-hover:text-white"
            }`}
            strokeWidth={1.8}
          />
          <span
            className={`text-[14px] font-medium ${
              isDashboardHome
                ? "text-white"
                : "text-[#D6D8F2] group-hover:text-white"
            }`}
          >
            Dashboard
          </span>
        </Link>

        {stepGroups.map((group) => (
          <Fragment key={group.label}>
            <div className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6E71A3]">
              {group.label}
            </div>

            {group.steps.map((step) => (
              <SidebarStep
                key={step.section}
                step={step}
                open={openSection === step.section}
                onToggle={() => toggleSection(step.section)}
                activeLeaf={activeLeaf}
              />
            ))}
          </Fragment>
        ))}
      </nav>
    </aside>
  );
}
