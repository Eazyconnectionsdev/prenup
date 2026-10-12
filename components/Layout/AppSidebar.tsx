"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Home,
  FileText,
  Users,
  Database,
  File,
  PenLine,
  CreditCard,
  ChevronRight,
  Check,
  Lock,
  UserRound,
  Scale,
  UsersRound,
  Wallet,
  Landmark,
  TrendingUp,
  HeartHandshake,
  Briefcase,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";
import { AppDispatch, RootState } from "@/store/store";
import { getCasesDetails } from "@/store/asyncThunk/casesThunk";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type SectionKey = "section1" | "section2" | "section3" | "section4";
type LeafDef = { id: string; icon: LucideIcon; label: string };

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const LEAF_TO_KEY: Record<string, string> = {
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

const ILA_LEAFS = ["solicitor-details", "lawyer-questionaries", "review-and-sign"];

// Which step holds the page at this URL, so it opens automatically.
function locateSection(activeLeaf: string): SectionKey | null {
  const isPartner = activeLeaf.startsWith("partner-");
  const id = (isPartner ? activeLeaf.slice("partner-".length) : activeLeaf).split("/")[0];

  if (!isPartner && ILA_LEAFS.includes(id)) return "section4";
  if (!isPartner && JOINT_LEAF_IDS.includes(id)) return "section3";
  if (MY_LEAF_IDS.includes(id)) return isPartner ? "section2" : "section1";
  return null;
}

function LogoMark() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="h-8 w-8" aria-hidden>
      <path
        d="M12 26s-8-5.2-8-11.2A4.8 4.8 0 0112 11.6a4.8 4.8 0 018 3.2C20 20.8 12 26 12 26z"
        stroke="#8B87FF"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path
        d="M20 26s-8-5.2-8-11.2a4.8 4.8 0 018-3.2 4.8 4.8 0 018 3.2C28 20.8 20 26 20 26z"
        stroke="#C4B5FD"
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Collapse({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <div
      aria-hidden={!open}
      inert={!open}
      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
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
  icon: IconC,
  title,
  subtitle,
  badge,
  open,
  active,
  onClick,
  href,
  locked,
  lockReason,
}: {
  number: number;
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  badge?: string;
  open?: boolean;
  active?: boolean;
  onClick?: () => void;
  href?: string;
  locked?: boolean;
  lockReason?: string;
}) {
  const highlighted = active || open;

  const inner = (
    <>
      <span className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full bg-[#5B55F6] text-[11px] font-semibold text-white shadow-[0_0_0_3px_rgba(91,85,246,0.22)]">
        {number}
      </span>

      {/* <IconC
        className={`h-[18px] w-[18px] flex-shrink-0 transition-colors duration-200 ${
          highlighted ? "text-white" : "text-[#A9ACD6] group-hover:text-white"
        }`}
        strokeWidth={1.8}
      /> */}

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span
            className={`truncate text-[14px] font-medium transition-colors duration-200 ${
              highlighted ? "text-white" : "text-[#D6D8F2] group-hover:text-white"
            }`}
          >
            {title}
          </span>
          
        </span>
        {subtitle && (
          <span className="mt-0.5 block truncate text-[11px] text-[#7F82B5]">{subtitle}</span>
        )}
      </span>

      {locked ? (
        <Lock className="h-4 w-4 flex-shrink-0" />
      ) : (
        <ChevronRight
          className={`h-4 w-4 flex-shrink-0 text-[#8A8DC0] transition-transform duration-300 ${
            !href && open ? "rotate-90" : ""
          }`}
        />
      )}
    </>
  );

  const cls = `group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 ${
    locked
      ? ""
      : active
        ? "bg-[#2B2E6F] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
        : open
          ? "bg-white/[0.04]"
          : "hover:bg-white/[0.05]"
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
  nested,
}: LeafDef & {
  done?: boolean;
  activeLeaf: string;
  locked?: boolean;
  lockReason?: string;
  isPartner?: boolean;
  nested?: boolean;
}) {
  const routeId = isPartner ? `partner-${id}` : id;
  const isActive =
    !locked && (activeLeaf === routeId || activeLeaf.startsWith(`${routeId}/`));

  const content = (
    <>
      {isActive && (
        <span
          className={`absolute top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-[#8B87FF] shadow-[0_0_8px_rgba(139,135,255,0.8)] ${
            nested ? "-left-[8px]" : "-left-[12px]"
          }`}
        />
      )}
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
  done,
  children,
}: {
  label: string;
  done?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="my-[2px]">
      <div className="flex items-center gap-2.5 px-[11px] py-[7px]">
        <Wallet className="h-4 w-4 flex-shrink-0 text-[#A9ACD6]" strokeWidth={1.8} />
        <span className="flex-1 truncate text-[13px] font-semibold text-[#E4E5F7]">
          {label}
        </span>
      </div>
      <div className="ml-[19px] pl-1.5">{children}</div>
    </div>
  );
}

function Tree({ children }: { children: ReactNode }) {
  return <div className="ml-[44px]  pb-1 pl-2.5">{children}</div>;
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
    locateSection(activeLeaf) ?? "section1",
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

  const myFinancialDone = FINANCIAL_LEAFS.every((l) => isLeafDone(l.id, myData));
  const partnerFinancialDone = FINANCIAL_LEAFS.every((l) => isLeafDone(l.id, partnerData));
  const jointFinancialDone = JOINT_FINANCIAL_LEAFS.every((l) =>
    isLeafDone(l.id, jointInformation),
  );
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
          className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${
            isDashboardHome
              ? "bg-[#2B2E6F] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
              : "hover:bg-white/[0.05]"
          }`}
        >
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
            icon={FileText}
            title="My Questionnaire"
            subtitle={
              caseLocked ? lockedSubtitle : `${myDoneCount} of ${MY_LEAF_IDS.length} complete`
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
              <SubGroup label="Financial Disclosure" done={myFinancialDone}>
                {FINANCIAL_LEAFS.map((leaf) => (
                  <Leaf
                    key={leaf.id}
                    {...leaf}
                    nested
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
            icon={Users}
            title="Partner Questionnaire"
            subtitle={caseLocked ? lockedSubtitle : "Shared by partner"}
            badge={caseLocked ? "Locked" : "Read-only"}
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
              <SubGroup label="Financial Disclosure" done={partnerFinancialDone}>
                {FINANCIAL_LEAFS.map((leaf) => (
                  <Leaf
                    key={leaf.id}
                    {...leaf}
                    nested
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
            icon={Database}
            title="Joint Questionnaire"
            subtitle={
              caseLocked ? lockedSubtitle : `${jointDoneCount} of ${JOINT_LEAF_IDS.length} complete`
            }
            badge={caseLocked ? "Locked" : undefined}
            open={openSection === "section3"}
            onClick={() => toggleSection("section3")}
            locked={caseLocked}
            lockReason={LOCK_REASON}
          />
          <Collapse open={!caseLocked && openSection === "section3"}>
            <Tree>
              <SubGroup label="Financial Disclosure" done={jointFinancialDone}>
                {JOINT_FINANCIAL_LEAFS.map((leaf) => (
                  <Leaf
                    key={leaf.id}
                    {...leaf}
                    nested
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
          icon={File}
          title="Final Review & Confirmation"
          subtitle={finalSubtitle}
          href="/dashboard/final-review-confirmation"
          active={isFinalReview}
        />

        {/* 5 — Independent Legal Advice */}
        <div>
          <StepHeader
            number={5}
            icon={PenLine}
            title="Independent Legal Advice"
            subtitle="Solicitor review & signing"
            open={openSection === "section4"}
            onClick={() => toggleSection("section4")}
          />
          <Collapse open={openSection === "section4"}>
            <Tree>
              <Leaf
                id="solicitor-details"
                icon={Briefcase}
                label="Solicitor Details"
                done={ilaDone}
                activeLeaf={activeLeaf}
                locked
                lockReason="Not available yet"
              />
              <Leaf
                id="lawyer-questionaries"
                icon={ClipboardList}
                label="Lawyer Questionnaire"
                done={ilaDone}
                activeLeaf={activeLeaf}
              />
              <Leaf
                id="review-and-sign"
                icon={PenLine}
                label="Review and Sign"
                activeLeaf={activeLeaf}
                locked
                lockReason="Not available yet"
              />
            </Tree>
          </Collapse>
        </div>
      </nav>
    </aside>
  );
}