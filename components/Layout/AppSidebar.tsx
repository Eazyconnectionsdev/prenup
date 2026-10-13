"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Home,
  FileText,
  CreditCard,
  ChevronRight,
  Check,
  Lock,
  UserRound,
  Scale,
  UsersRound,
  Landmark,
  TrendingUp,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";
import { AppDispatch, RootState } from "@/store/store";
import { getCasesDetails } from "@/store/asyncThunk/casesThunk";

type SectionKey = "" | "section1" | "section2" | "section3" | "section4";
type LeafDef = { id: string; icon: LucideIcon; label: string };


const LEAF_TO_KEY: Record<string, string> = {
  "personal-info": "personalInformation",
  "legal-declaration": "legalDeclaration",
  "family": "familyAndDependents",
  "individual_assets": "individualAssets",
  "income_revenue": "incomeAndRevenue",
  "liabilities_debts": "liabilitiesAndDebts",
  "joint-assets": "jointAssets",
  "joint-income-revenue": "jointIncomeAndRevenue",
  "joint-liabilities-debts": "jointLiabilitiesAndDebts",
  "matrimonial-agreement": "matrimonialAgreement",
};

const PERSONAL_LEAFS: LeafDef[] = [
  { id: "personal-info", icon: UserRound, label: "Personal Information" },
  { id: "legal-declaration", icon: Scale, label: "Legal Declaration" },
  { id: "family", icon: UsersRound, label: "Family & Dependents" },
];

const FINANCIAL_LEAFS: LeafDef[] = [
  { id: "individual_assets", icon: Landmark, label: "Assets" },
  { id: "income_revenue", icon: TrendingUp, label: "Income & Revenue" },
  { id: "liabilities_debts", icon: CreditCard, label: "Liabilities & Debts" },
];

const JOINT_FINANCIAL_LEAFS: LeafDef[] = [
  { id: "joint-assets", icon: Landmark, label: "Joint Assets" },
  { id: "joint-income-revenue", icon: TrendingUp, label: "Joint Income & Revenue" },
  { id: "joint-liabilities-debts", icon: CreditCard, label: "Joint Liabilities & Debts" },
];

const MATRIMONIAL_LEAF: LeafDef = {
  id: "matrimonial-agreement",
  icon: HeartHandshake,
  label: "Matrimonial Agreement & Review",
};

const JOINT_LEAFS = [...JOINT_FINANCIAL_LEAFS, MATRIMONIAL_LEAF];
const MY_LEAF_IDS = [...PERSONAL_LEAFS, ...FINANCIAL_LEAFS].map((l) => l.id);
const JOINT_LEAF_IDS = JOINT_LEAFS.map((l) => l.id);

function locateSection(activeLeaf: string): SectionKey | null {
  const isPartner = activeLeaf.startsWith("partner-");
  const id = (isPartner ? activeLeaf.slice("partner-".length) : activeLeaf).split("/")[0];

  if (!isPartner && JOINT_LEAF_IDS.includes(id)) return "section3";
  if (MY_LEAF_IDS.includes(id)) return isPartner ? "section2" : "section1";
  return null;
}

function LogoMark() {
  return (
    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#8B87FF] to-[#5B55F6] shadow-[0_4px_12px_rgba(91,85,246,0.45)]">
      <svg viewBox="0 0 32 32" fill="none" className="h-[22px] w-[22px]" aria-hidden>
        <path
          d="M12 26s-8-5.2-8-11.2A4.8 4.8 0 0112 11.6a4.8 4.8 0 018 3.2C20 20.8 12 26 12 26z"
          stroke="#FFFFFF"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <path
          d="M20 26s-8-5.2-8-11.2a4.8 4.8 0 018-3.2 4.8 4.8 0 018 3.2C28 20.8 20 26 20 26z"
          stroke="#DDD9FF"
          strokeWidth={2}
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

// The violet bar that marks the active item, flush against the sidebar edge
function ActiveRail() {
  return (
    <span className="absolute -left-3 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r-full bg-[#8B87FF] shadow-[0_0_10px_rgba(139,135,255,0.75)]" />
  );
}

function Collapse({
  open,
  children,
  // Widens the clipping box. The rail and its dots hang to the left of the
  // content, and `overflow-hidden` would otherwise cut them off.
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
      <div className={`min-h-0 overflow-hidden ${bleed ? "-ml-6 pl-6" : ""}`}>{children}</div>
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
  return <span className="h-4 w-4 flex-shrink-0 rounded-full border-[1.5px] border-white/20" />;
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
  // Drives the thin completion bar under the subtitle
  progress?: { done: number; total: number };
  open?: boolean;
  active?: boolean;
  onClick?: () => void;
  href?: string;
  locked?: boolean;
  lockReason?: string;
}) {
  const highlighted = active || open;
  const percent = progress && progress.total > 0
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
          <span className="mt-0.5 block truncate text-[11px] text-[#7F82B5]">{subtitle}</span>
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
      <Link href={href} className={cls} aria-current={active ? "page" : undefined}>
        {inner}
      </Link>
    );

  return (
    <button type="button" onClick={onClick} className={cls} aria-expanded={open}>
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
          isActive ? "text-[#B7B4FF]" : "text-[#8A8DC0] group-hover:text-[#C9C7FF]"
        }`}
        strokeWidth={1.8}
      />
      <span
        className={`flex-1 truncate text-[13px] transition-colors duration-200 ${
          isActive ? "font-medium text-white" : "text-[#B4B7DE] group-hover:text-white"
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
        <IconC className="h-4 w-4 flex-shrink-0 text-[#A9ACD6]" strokeWidth={1.8} />
        <span className="flex-1 truncate text-[13px] font-semibold text-[#E4E5F7]">{label}</span>
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


export default function AppSidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    status,
    myInformation,
    partnerInformation,
    jointInformation,
    approval,
    fullyLocked,
  } = useSelector((state: RootState) => state.cases);
  const user = useSelector((state: RootState) => state.auth.user);

  const pathname = usePathname();
  const activeLeaf = pathname.replace(/^\/dashboard\/?/, "").replace(/\/+$/, "");
  const isDashboardHome = /^\/dashboard\/?$/.test(pathname);
  const isFinalReview =
    activeLeaf === "final-review-confirmation" ||
    activeLeaf.startsWith("final-review-confirmation/");

  const [openSection, setOpenSection] = useState<SectionKey | null>(
    locateSection(activeLeaf) ?? "",
  );


  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    const target = locateSection(activeLeaf);
    if (target) setOpenSection(target);
  }

  const isFirstUser = user?.endUserType === "user1";
  const isPaymentDone = true;

  const myData = isFirstUser ? myInformation : partnerInformation;
  const partnerData = isFirstUser ? partnerInformation : myInformation;

  const hasData = (obj?: Record<string, unknown>) => Boolean(obj && Object.keys(obj).length > 0);
  const isLeafDone = (leafId: string, info?: Record<string, any>) =>
    hasData(info?.[LEAF_TO_KEY[leafId]]);

  const myDoneCount = MY_LEAF_IDS.filter((id) => isLeafDone(id, myData)).length;
  const jointDoneCount = JOINT_LEAF_IDS.filter((id) => isLeafDone(id, jointInformation)).length;

  // A Financial Disclosure group stays open while one of its pages is open
  const isLeafActive = (leafId: string, partner?: boolean) => {
    const routeId = partner ? `partner-${leafId}` : leafId;
    return activeLeaf === routeId || activeLeaf.startsWith(`${routeId}/`);
  };
  const myFinancialActive = FINANCIAL_LEAFS.some((l) => isLeafActive(l.id));
  const partnerFinancialActive = FINANCIAL_LEAFS.some((l) => isLeafActive(l.id, true));
  const jointFinancialActive = JOINT_FINANCIAL_LEAFS.some((l) => isLeafActive(l.id));
  const bothApproved = Boolean(approval?.user1Approved && approval?.user2Approved);
  const ilaDone = Boolean(status?.independentLegalAdvice?.submitted);

  const caseLocked = Boolean(
    fullyLocked ||
      bothApproved ||
      status?.myInformation?.locked ||
      status?.partnerInformation?.locked ||
      status?.jointInformation?.locked,
  );
  const LOCK_REASON = "Locked - both partners have confirmed the agreement";
  const lockedSubtitle = "Confirmed and locked";

  const finalSubtitle = bothApproved
    ? "Mutual confirmation complete"
    : status?.jointInformation?.submitted || approval?.user1Approved
      ? "Partner review in progress"
      : "Ready for review";

  const toggleSection = (key: SectionKey) =>
    setOpenSection((prev) => (prev === key ? null : key));

  const isLocked = (leafId: string) =>
    caseLocked || (!isPaymentDone && leafId !== "personal-info");
  const leafLockReason = caseLocked ? LOCK_REASON : undefined;

  const inviteCaseId = user?.inviteCaseId;
  useEffect(() => {
    if (inviteCaseId) dispatch(getCasesDetails(inviteCaseId));
  }, [dispatch, inviteCaseId]);

  return (
    <aside className="flex h-screen w-[315px] flex-shrink-0 flex-col bg-gradient-to-b from-[#1B1E52] via-[#15183F] to-[#101233] font-sans text-white shadow-[8px_0_30px_rgba(10,10,40,0.35)]">
      <div className="flex items-center gap-2.5 px-5 pb-4 pt-6">
        <LogoMark />
        <span className="text-[18px] font-semibold tracking-tight text-white">
          Let&apos;s Prenup
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Dashboard */}
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
              isDashboardHome ? "text-white" : "text-[#A9ACD6] group-hover:text-white"
            }`}
            strokeWidth={1.8}
          />
          <span
            className={`text-[14px] font-medium ${
              isDashboardHome ? "text-white" : "text-[#D6D8F2] group-hover:text-white"
            }`}
          >
            Dashboard
          </span>
        </Link>

        <div className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6E71A3]">
          Agreement steps
        </div>

        {/* 1 — My Questionnaire */}
        <div>
          <StepHeader
            number={1}
            title="My Questionnaire"
            subtitle={
              caseLocked ? lockedSubtitle : `${myDoneCount} of ${MY_LEAF_IDS.length} complete`
            }
            progress={
              caseLocked ? undefined : { done: myDoneCount, total: MY_LEAF_IDS.length }
            }
            open={openSection === "section1"}
            onClick={() => toggleSection("section1")}
            locked={caseLocked}
            lockReason={LOCK_REASON}
          />
          <Collapse open={!caseLocked && openSection === "section1"}>
            <Tree>
              {PERSONAL_LEAFS.map((leaf) => (
                <Leaf
                  key={leaf.id}
                  {...leaf}
                  done={isLeafDone(leaf.id, myData)}
                  activeLeaf={activeLeaf}
                  locked={isLocked(leaf.id)}
                  lockReason={leafLockReason}
                />
              ))}
              <SubGroup label="Financial Disclosure" hasActiveChild={myFinancialActive}>
                {FINANCIAL_LEAFS.map((leaf) => (
                  <Leaf
                    key={leaf.id}
                    {...leaf}
                    done={isLeafDone(leaf.id, myData)}
                    activeLeaf={activeLeaf}
                    locked={isLocked(leaf.id)}
                    lockReason={leafLockReason}
                  />
                ))}
              </SubGroup>
            </Tree>
          </Collapse>
        </div>

        {/* 2 — Partner Questionnaire (read-only) */}
        <div>
          <StepHeader
            number={2}
            title="Partner Questionnaire"
            subtitle={caseLocked ? lockedSubtitle : "Shared by partner"}
            open={openSection === "section2"}
            onClick={() => toggleSection("section2")}
            locked={caseLocked}
            lockReason={LOCK_REASON}
          />
          <Collapse open={!caseLocked && openSection === "section2"}>
            <Tree>
              {PERSONAL_LEAFS.map((leaf) => (
                <Leaf
                  key={leaf.id}
                  {...leaf}
                  done={isLeafDone(leaf.id, partnerData)}
                  activeLeaf={activeLeaf}
                  locked={isLocked(leaf.id)}
                  lockReason={leafLockReason}
                  isPartner
                />
              ))}
              <SubGroup label="Financial Disclosure" hasActiveChild={partnerFinancialActive}>
                {FINANCIAL_LEAFS.map((leaf) => (
                  <Leaf
                    key={leaf.id}
                    {...leaf}
                    done={isLeafDone(leaf.id, partnerData)}
                    activeLeaf={activeLeaf}
                    locked={isLocked(leaf.id)}
                    lockReason={leafLockReason}
                    isPartner
                  />
                ))}
              </SubGroup>
            </Tree>
          </Collapse>
        </div>

        {/* 3 — Joint Questionnaire */}
        <div>
          <StepHeader
            number={3}
            title="Joint Questionnaire"
            subtitle={
              caseLocked ? lockedSubtitle : `${jointDoneCount} of ${JOINT_LEAF_IDS.length} complete`
            }
            progress={
              caseLocked ? undefined : { done: jointDoneCount, total: JOINT_LEAF_IDS.length }
            }
            open={openSection === "section3"}
            onClick={() => toggleSection("section3")}
            locked={caseLocked}
            lockReason={LOCK_REASON}
          />
          <Collapse open={!caseLocked && openSection === "section3"}>
            <Tree>
              <SubGroup label="Financial Disclosure" hasActiveChild={jointFinancialActive}>
                {JOINT_FINANCIAL_LEAFS.map((leaf) => (
                  <Leaf
                    key={leaf.id}
                    {...leaf}
                    done={isLeafDone(leaf.id, jointInformation)}
                    activeLeaf={activeLeaf}
                    locked={isLocked(leaf.id)}
                    lockReason={leafLockReason}
                  />
                ))}
              </SubGroup>
              <Leaf
                {...MATRIMONIAL_LEAF}
                done={isLeafDone(MATRIMONIAL_LEAF.id, jointInformation)}
                activeLeaf={activeLeaf}
                locked={isLocked(MATRIMONIAL_LEAF.id)}
                lockReason={leafLockReason}
              />
            </Tree>
          </Collapse>
        </div>

        {/* 4 — Final Review & Confirmation */}
        <StepHeader
          number={4}
          title="Final Review & Confirmation"
          subtitle={finalSubtitle}
          href="/dashboard/final-review-confirmation"
          active={isFinalReview}
        />

      </nav>
    </aside>
  );
}