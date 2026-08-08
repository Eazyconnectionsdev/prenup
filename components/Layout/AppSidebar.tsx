"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getCasesDetails } from "@/store/asyncThunk/casesThunk";

type SectionKey = "section1" | "section2" | "section3" | "section4";
type SubgroupKey = "myFinancial" | "partnerFinancial" | "jointFinancial";

type IconName =
  | "workspace"
  | "person"
  | "personalInfo"
  | "legal"
  | "family"
  | "folder"
  | "assets"
  | "income"
  | "liabilities"
  | "joint"
  | "seal";

const iconPaths: Record<IconName, ReactNode> = {
  workspace: <path d="M3 7l9-4 9 4-9 4-9-4z M3 7v10l9 4 9-4V7" />,
  person: (
    <>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" />
    </>
  ),
  personalInfo: (
    <>
      <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z" />
      <path d="M14 3v6h6" />
    </>
  ),
  legal: (
    <>
      <path d="M9 12l2 2 4-4" />
      <circle cx="12" cy="12" r="9" />
    </>
  ),
  family: (
    <>
      <path d="M17 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" />
      <circle cx="10" cy="7" r="3.2" />
      <path d="M20 20v-2a4 4 0 00-3-3.9" />
      <path d="M15.2 3.2A3.2 3.2 0 0117 6.3" />
    </>
  ),
  folder: (
    <>
      <path d="M3 7l4-4h10l4 4v13a1 1 0 01-1 1H4a1 1 0 01-1-1z" />
      <path d="M3 7h18" />
    </>
  ),
  assets: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
    </>
  ),
  income: (
    <>
      <path d="M3 3v18h18" />
      <path d="M7 15l4-5 3 3 5-6" />
    </>
  ),
  liabilities: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M2 10h20" />
    </>
  ),
  joint: (
    <path d="M12 3l2.5 5.2L20 9l-4 3.9.9 5.5L12 15.8 7.1 18.4 8 12.9 4 9l5.5-.8z" />
  ),
  seal: (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M8.5 13.5L7 21l5-2.5L17 21l-1.5-7.5" />
    </>
  ),
};

function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className={className}
    >
      {iconPaths[name]}
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <span className="flex-shrink-0 flex text-[#9494AA]">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className={`w-[13px] h-[13px] transition-transform duration-150 ${open ? "rotate-90" : "rotate-0"}`}
      >
        <path d="M9 6l6 6-6 6" />
      </svg>
    </span>
  );
}

function StatusCheck({
  done,
  readOnly,
}: {
  done?: boolean;
  readOnly?: boolean;
}) {
  const color = readOnly ? "#9494AA" : done ? "#16A34A" : "#D1D1DC";
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="flex-shrink-0"
    >
      <circle cx="8" cy="8" r="7" fill={color} />
      <path
        d="M5 8.2l2 2 4-4.4"
        stroke="white"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface LeafProps {
  id: string;
  icon: IconName;
  label: string;
  done?: boolean;
  activeLeaf: string;
  onSelect: (id: string) => void;
  readOnly?: boolean;
  lockReason?: string;
}

function Leaf({
  id,
  icon,
  label,
  done,
  activeLeaf,
  onSelect,
  readOnly,
  lockReason,
}: LeafProps) {
  const isActive = !readOnly && activeLeaf === id;

  const content = (
    <>
      {isActive && (
        <span className="absolute -left-[17px] top-2 bottom-2 w-0.5 rounded-full bg-[#6D28D9]" />
      )}
      <span className="flex-shrink-0 text-[#9494AA]">
        <Icon name={icon} className="w-3.5 h-3.5" />
      </span>
      <span
        className={`flex-1 text-[13px] ${
          isActive ? "text-[#1E1B3C] font-medium" : "text-[#6B6B80]"
        } ${readOnly ? "opacity-70" : ""}`}
      >
        {label}
      </span>
      <StatusCheck done={done} readOnly={readOnly} />
    </>
  );

  if (readOnly) {
    return (
      <div
        aria-disabled="true"
        title={lockReason ?? "View only"}
        className="relative flex items-center gap-[9px] rounded-[7px] px-[9px] py-2 my-0.5 cursor-not-allowed select-none"
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={id}
      onClick={() => onSelect(id)}
      className={`relative flex items-center gap-[9px] rounded-[7px] px-[9px] py-2 my-0.5 cursor-pointer hover:bg-[#F4F4FA] ${
        isActive ? "bg-[#EDE9FE]" : ""
      }`}
    >
      {content}
    </Link>
  );
}

const PERSONAL_LEAFS: { id: string; icon: IconName; label: string }[] = [
  { id: "personal-info", icon: "personalInfo", label: "Personal information" },
  { id: "legal-declaration", icon: "legal", label: "Legal declaration" },
  { id: "family", icon: "family", label: "Family and dependents" },
];

const FINANCIAL_LEAFS: { id: string; icon: IconName; label: string }[] = [
  { id: "individual_assets", icon: "assets", label: "Individual Assets" },
  { id: "income_revenue", icon: "income", label: "Income and revenue" },
  {
    id: "liabilities_debts",
    icon: "liabilities",
    label: "Liabilities and debts",
  },
];

const JOINT_ASSETS_LEAFS: { id: string; icon: IconName; label: string }[] = [
  { id: "joint-assets", icon: "assets", label: "Joint Assets" },
  {
    id: "joint-income-revenue",
    icon: "income",
    label: "Joint Income and revenue",
  },
  {
    id: "joint-liabilities-debts",
    icon: "liabilities",
    label: "Joint Liabilities and debts",
  },
];

export default function AgreementSidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const [openSection, setOpenSection] = useState<SectionKey | null>("section1");
  const [openSubgroup, setOpenSubgroup] = useState<SubgroupKey | null>(
    "myFinancial",
  );
  const [activeLeaf, setActiveLeaf] = useState("/");

  const user = useSelector((state: RootState) => state.auth.user);
  const { status, myInformation, partnerInformation, jointInformation } =
    useSelector((state: RootState) => state.cases);

  const isPaymentDone = true;

  const hasData = (obj?: Record<string, unknown>) =>
    Boolean(obj && Object.keys(obj).length > 0);

  const LEAF_TO_KEY: Record<string, string> = {
    "personal-info": "personalInformation",
    "legal-declaration": "legalDeclaration",
    family: "familyAndDependents",
    individual_assets: "individualAssets",
    income_revenue: "incomeAndRevenue",
    liabilities_debts: "liabilitiesAndDebts",
  };

  const isLeafDone = (leafId: string, info?: Record<string, any>) =>
    hasData(info?.[LEAF_TO_KEY[leafId]]);

  const mineCompletedCount = Object.keys(LEAF_TO_KEY).filter((id) =>
    isLeafDone(id, myInformation),
  ).length;

  const partnerCompletedCount = Object.keys(LEAF_TO_KEY).filter((id) =>
    isLeafDone(id, partnerInformation),
  ).length;

  const toggleSection = (key: SectionKey) =>
    setOpenSection((prev) => (prev === key ? null : key));
  const toggleSubgroup = (key: SubgroupKey) =>
    setOpenSubgroup((prev) => (prev === key ? null : key));

  const isLocked = (leafId: string) =>
    !isPaymentDone && leafId !== "personal-info";

  useEffect(() => {
    dispatch(getCasesDetails(user?.inviteCaseId));
  }, []);

  return (
    <div className="w-[340px] h-screen overflow-y-auto no-scrollbar border border-[#E7E7F2] bg-white shadow-[0_20px_50px_rgba(30,27,60,0.10)] font-sans">
      <div className="border-b border-[#E7E7F2] px-[22px] pb-[18px] pt-[22px]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-lg border border-[#DDD6FE] bg-[#EDE9FE] text-[#6D28D9]">
            <Icon name="workspace" className="h-[15px] w-[15px]" />
          </div>
          <div className="text-[15.5px] font-semibold tracking-wide text-[#1E1B3C]">
            Let&apos;s Prenup
          </div>
        </div>
        <div className="ml-10 mt-0.5 text-[11px] uppercase tracking-wider text-[#9494AA]">
          Financial disclosure
        </div>
      </div>

      <div className="px-3 pt-2.5">
        <div className="mt-1">
          <Link href="/">
            <div className="flex cursor-pointer items-center gap-2.5 rounded-[9px] px-2.5 py-[11px] hover:bg-[#F4F4FA]">
              <span className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-[7px] bg-[#EDE9FE] text-[#6D28D9]">
                <Icon name="person" className="h-3.5 w-3.5" />
              </span>
              <span className="min-w-0 flex-1">
                <div className="text-[13.5px] font-semibold text-[#1E1B3C]">
                  Dashboard
                </div>
              </span>
            </div>
          </Link>
        </div>

        <div className="mt-1">
          <div
            onClick={() => toggleSection("section1")}
            className="flex cursor-pointer items-center gap-2.5 rounded-[9px] px-2.5 py-[11px] hover:bg-[#F4F4FA]"
          >
            <span className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-[7px] bg-[#EDE9FE] text-[#6D28D9]">
              <Icon name="person" className="h-3.5 w-3.5" />
            </span>
            <span className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[13.5px] font-semibold text-[#1E1B3C]">
                My information
                {!isPaymentDone && (
                  <span className="rounded bg-[#FEF3C7] px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide text-[#92400E]">
                    Locked
                  </span>
                )}
              </div>
              <div className="mt-px text-[11px] text-[#9494AA]">
                <div className="mt-px text-[11px] text-[#9494AA]">
                  {mineCompletedCount} of {Object.keys(LEAF_TO_KEY).length}{" "}
                  complete
                </div>
              </div>
            </span>
            <Chevron open={openSection === "section1"} />
          </div>

          {openSection === "section1" && (
            <div className="ml-[23px] border-l border-[#E7E7F2] pl-4">
              {PERSONAL_LEAFS.map((leaf) => (
                <Leaf
                  key={leaf.id}
                  {...leaf}
                  done={isLeafDone(leaf.id, myInformation)}
                  activeLeaf={activeLeaf}
                  onSelect={setActiveLeaf}
                  readOnly={isLocked(leaf.id)}
                  lockReason={
                    isLocked(leaf.id) ? "Complete payment to unlock" : undefined
                  }
                />
              ))}

              <div className="mt-0.5">
                <div
                  onClick={() => toggleSubgroup("myFinancial")}
                  className="flex cursor-pointer items-center gap-2.5 rounded-[7px] px-[9px] py-2 hover:bg-[#F4F4FA]"
                >
                  <span className="flex-shrink-0 text-[#9494AA]">
                    <Icon name="folder" className="h-3.5 w-3.5" />
                  </span>
                  <span className="flex-1 text-[13px] text-[#6B6B80]">
                    Financial disclosure
                  </span>
                  <Chevron open={openSubgroup === "myFinancial"} />
                </div>
                {openSubgroup === "myFinancial" && (
                  <div className="ml-[19px] border-l border-[#E7E7F2] pl-3.5">
                    {FINANCIAL_LEAFS.map((leaf) => (
                      <Leaf
                        key={leaf.id}
                        {...leaf}
                        done={isLeafDone(leaf.id, myInformation)}
                        activeLeaf={activeLeaf}
                        onSelect={setActiveLeaf}
                        readOnly={isLocked(leaf.id)}
                        lockReason={
                          isLocked(leaf.id)
                            ? "Complete payment to unlock"
                            : undefined
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mx-1 my-2.5 h-px bg-[#E7E7F2]" />

        {/* SECTION 2 — "partner's information", always read-only */}
        <div className="mt-1">
          <div
            onClick={() => toggleSection("section2")}
            className="flex cursor-pointer items-center gap-2.5 rounded-[9px] px-2.5 py-[11px] hover:bg-[#F4F4FA]"
          >
            <span className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-[7px] bg-[#EDEDF5] text-[#5B5B75]">
              <Icon name="person" className="h-3.5 w-3.5" />
            </span>
            <span className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[13.5px] font-semibold text-[#1E1B3C]">
                Partner&apos;s information
                <span className="rounded bg-[#EDEDF5] px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide text-[#5B5B75]">
                  Read-only
                </span>
              </div>
              <div className="mt-px text-[11px] text-[#9494AA]">
                Shared by partner
              </div>
            </span>
            <Chevron open={openSection === "section2"} />
          </div>

          {openSection === "section2" && (
            <div className="ml-[23px] border-l border-[#E7E7F2] pl-4">
              {PERSONAL_LEAFS.map((leaf) => (
                <Leaf
                  key={leaf.id}
                  {...leaf}
                  done={isLeafDone(leaf.id, partnerInformation)}
                  activeLeaf={activeLeaf}
                  onSelect={setActiveLeaf}
                  readOnly
                  lockReason="View only — belongs to your partner"
                />
              ))}

              <div className="mt-0.5">
                <div
                  onClick={() => toggleSubgroup("partnerFinancial")}
                  className="flex cursor-pointer items-center gap-2.5 rounded-[7px] px-[9px] py-2 hover:bg-[#F4F4FA]"
                >
                  <span className="flex-shrink-0 text-[#9494AA]">
                    <Icon name="folder" className="h-3.5 w-3.5" />
                  </span>
                  <span className="flex-1 text-[13px] text-[#6B6B80]">
                    Financial disclosure
                  </span>
                  <Chevron open={openSubgroup === "partnerFinancial"} />
                </div>
                {openSubgroup === "partnerFinancial" && (
                  <div className="ml-[19px] border-l border-[#E7E7F2] pl-3.5">
                    {FINANCIAL_LEAFS.map((leaf) => (
                      <Leaf
                        key={leaf.id}
                        {...leaf}
                        done={isLeafDone(leaf.id, partnerInformation)}
                        activeLeaf={activeLeaf}
                        onSelect={setActiveLeaf}
                        readOnly
                        lockReason="View only — belongs to your partner"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mx-1 my-2.5 h-px bg-[#E7E7F2]" />

        {/* SECTION 3 — Joint information (unchanged; status keys TBD from backend) */}
        <div className="mt-1">
          <div
            onClick={() => toggleSection("section3")}
            className="flex cursor-pointer items-center gap-2.5 rounded-[9px] px-2.5 py-[11px] hover:bg-[#F4F4FA]"
          >
            <span className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-[7px] bg-[#EDE9FE] text-[#6D28D9]">
              <Icon name="joint" className="h-3.5 w-3.5" />
            </span>
            <span className="min-w-0 flex-1">
              <div className="text-[13.5px] font-semibold text-[#1E1B3C]">
                Joint information
              </div>
              <div className="mt-px text-[11px] text-[#9494AA]">
                Combined disclosure
              </div>
            </span>
            <Chevron open={openSection === "section3"} />
          </div>

          {openSection === "section3" && (
            <div className="ml-[23px] border-l border-[#E7E7F2] pl-4">
              <div className="mt-0.5">
                <div
                  onClick={() => toggleSubgroup("jointFinancial")}
                  className="flex cursor-pointer items-center gap-2.5 rounded-[7px] px-[9px] py-2 hover:bg-[#F4F4FA]"
                >
                  <span className="flex-shrink-0 text-[#9494AA]">
                    <Icon name="folder" className="h-3.5 w-3.5" />
                  </span>
                  <span className="flex-1 text-[13px] text-[#6B6B80]">
                    Joint financial disclosure
                  </span>
                  <Chevron open={openSubgroup === "jointFinancial"} />
                </div>
                {openSubgroup === "jointFinancial" && (
                  <div className="ml-[19px] border-l border-[#E7E7F2] pl-3.5">
                    {JOINT_ASSETS_LEAFS.map((leaf) => (
                      <Leaf
                        key={leaf.id}
                        {...leaf}
                        done={isLeafDone(leaf.id, jointInformation)}
                        activeLeaf={activeLeaf}
                        onSelect={setActiveLeaf}
                        readOnly={false}
                        lockReason="View only — belongs to your partner"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mx-1 my-2.5 h-px bg-[#E7E7F2]" />

        <div className="mt-1">
          <div
            onClick={() => toggleSection("section4")}
            className="flex cursor-pointer items-center gap-2.5 rounded-[9px] px-2.5 py-[11px] hover:bg-[#F4F4FA]"
          >
            <span className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-[7px] bg-[#EDE9FE] text-[#6D28D9]">
              <Icon name="joint" className="h-3.5 w-3.5" />
            </span>
            <span className="min-w-0 flex-1">
              <div className="text-[13.5px] font-semibold text-[#1E1B3C]">
                Independent Legal Advice
              </div>
              <div className="mt-px text-[11px] text-[#9494AA]">
                Combined disclosure
              </div>
            </span>
            <Chevron open={openSection === "section4"} />
          </div>

          {openSection === "section4" && (
            <div className="ml-[23px] border-l border-[#E7E7F2] pl-4">
              <Leaf
                id="solicitor-details"
                icon="personalInfo"
                label="Solicitor Details"
                done={Boolean(status?.independentLegalAdvice?.submitted)}
                activeLeaf={activeLeaf}
                onSelect={setActiveLeaf}
              />
              <Leaf
                id="lawyer-questionaries"
                icon="legal"
                label="Lawyer Questionnaire"
                done={Boolean(status?.independentLegalAdvice?.submitted)}
                activeLeaf={activeLeaf}
                onSelect={setActiveLeaf}
              />
              <Leaf
                id="review-and-sign"
                icon="family"
                label="Review and Sign"
                activeLeaf={activeLeaf}
                onSelect={setActiveLeaf}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
