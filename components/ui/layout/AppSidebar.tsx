// File: components/AppSidebar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  ListOrdered,
  Handshake,
  CreditCard,
  HelpCircle,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";

/**
 * Small local `cn` helper so this file is copy/paste-ready.
 * If you already have a `cn` in your project, remove this and import yours instead:
 * import { cn } from "@/lib/utils";
 */
function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(" ");
}

/* ---------------------------
   Types / Data
   --------------------------- */

type NavItem = {
  label: string;
  href: string;
  icon?: React.ElementType;
  number?: number;
};

type Section = {
  title: string;
  items: Array<{ label: string; href: string }>;
};

/* top-level (single links) */
const mainNavItems: NavItem[] = [{ icon: Home, label: "Dashboard", href: "/" }];

/* grouped sections (what you asked for) */
const sectionedNav: Section[] = [
  {
    title: "Questionnaire",
    items: [
      { label: "Your Details", href: "/questionnaire/background" },
      { label: "Your Assets", href: "/questionnaire/property" },
      { label: "Partners Details", href: "/questionnaire/debts" },
      { label: "Partners Assets", href: "/questionnaire/financial" },
      { label: "Joint Assets", href: "/questionnaire/joint-assets" },
      { label: "Future Assets", href: "/questionnaire/future-assets" },
      {
        label: "Area of Complexity",
        href: "/questionnaire/area-of-complexity",
      },
    ],
  },
  {
    title: "Lawyer",
    items: [
      { label: "Your Pre-Lawyer Questioner", href: "/lawyers/selection" },
      { label: "Lawyer Selection", href: "/questionnaire-1" },
      {
        label: "Partners Pre-Lawyer Questioner",
        href: "/partner-questionnaire",
      },
      { label: "Lawyer Selection", href: "/partner-questionnaire-2" },
    ],
  },
];

const bottomNavItems: NavItem[] = [
  { icon: CreditCard, label: "Payment", href: "/payment" },
  { icon: HelpCircle, label: "Help", href: "/help" },
  { icon: User, label: "Account", href: "/account-managment" },
];

/* ---------------------------
   Components
   --------------------------- */

interface AppSidebarProps {
  activeItem?: string;
}

export default function AppSidebar({ activeItem = "/" }: AppSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <aside
      className={cn(
        "h-screen relative bg-sidebar border-r border-sidebar-border flex flex-col sidebar-transition",
        isExpanded ? "w-[270px]" : "w-[72px]"
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded((v) => !v)}
        aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        className="absolute -right-3 top-8 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm hover:bg-secondary sidebar-transition"
      >
        {isExpanded ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>

      {/* Logo */}
      <div className="flex items-center gap-3 p-6">
        <div className="flex h-10 w-10 items-center justify-center">
          <svg viewBox="0 0 40 40" className="h-10 w-10">
            <circle
              cx="14"
              cy="20"
              r="10"
              fill="none"
              stroke="hsl(45, 90%, 55%)"
              strokeWidth="3"
            />
            <circle
              cx="26"
              cy="20"
              r="10"
              fill="none"
              stroke="hsl(45, 90%, 55%)"
              strokeWidth="3"
            />
          </svg>
        </div>

        {isExpanded && (
          <span className="text-lg font-bold text-primary whitespace-nowrap">
            LET'S PRENUP
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-auto">
        {/* Main nav (Dashboard etc.) */}
        <ul className="space-y-1">
          {mainNavItems.map((item) => (
            <MainNavItem
              key={item.href}
              item={item}
              isExpanded={isExpanded}
              isActive={activeItem === item.href}
            />
          ))}
        </ul>

        {/* Sections (Questionnaire, Lawyer, etc.) */}
        <div className="mt-4">
          {sectionedNav.map((section, index) => (
            <div key={section.title} className="mt-4">
              <SectionHeading title={section.title} number={index+1} isExpanded={isExpanded} />
              <ul className="mt-2 space-y-1">
                {section.items.map((child) => (
                  <SidebarChildItem
                    key={child.href}
                    item={child}
                    isExpanded={isExpanded}
                    isActive={activeItem === child.href}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-3 border-t border-sidebar-border" />

        {/* Bottom nav */}
        <ul className="space-y-1">
          {bottomNavItems.map((item) => (
            <MainNavItem
              key={item.href}
              item={item}
              isExpanded={isExpanded}
              isActive={activeItem === item.href}
            />
          ))}
        </ul>
      </nav>

      {/* Sign out */}
      <div className="p-3">
        <button
          className={cn(
            "flex w-full items-center justify-center gap-3 rounded-full border border-muted-foreground py-3 text-sidebar-foreground hover:bg-secondary sidebar-transition",
            !isExpanded && "px-0"
          )}
        >
          <LogOut className="h-4 w-4" />
          {isExpanded && <span className="text-sm font-medium">Sign out</span>}
        </button>
      </div>
    </aside>
  );
}

/* ---------------------------
   Subcomponents
   --------------------------- */

function MainNavItem({
  item,
  isExpanded,
  isActive,
}: {
  item: NavItem;
  isExpanded: boolean;
  isActive: boolean;
}) {
  const Icon = item.icon;
  return (
    <li>
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-2xl px-4 py-3 sidebar-transition",
          isActive
            ? "bg-gradient-to-r from-secondary to-secondary-foreground"
            : "text-muted-foreground hover:bg-gradient-to-r hover:from-secondary hover:to-secondary-foreground hover:text-foreground",
          !isExpanded && "justify-center px-0"
        )}
      >
        {Icon ? (
          <Icon
            className={cn("h-5 w-5 flex-shrink-0", isActive && "text-black")}
          />
        ) : (
          <div className="h-5 w-5" />
        )}

        {isExpanded && (
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "whitespace-nowrap text-sm font-normal",
                isActive && "text-black"
              )}
            >
              {item.label}
            </span>
          </div>
        )}
      </Link>
    </li>
  );
}

function SectionHeading({
  title,
  number,
  isExpanded,
}: {
  title: string;
  number: any;
  isExpanded: boolean;
}) {
  return (
    <div className="">
      {isExpanded ? (
        <div className="flex items-center gap-2 rounded-2xl px-4 py-2 sidebar-transition text-muted-foreground hover:bg-gradient-to-r hover:from-secondary hover:to-secondary-foreground hover:text-foreground">
          <span className="block h-5 w-5 bg-primary flex items-center justify-center rounded-full text-white text-sm">{number}</span>
          <h3>{title}</h3>
        </div>
      ) : (
        <div className="flex justify-center items-center h-8">
          <span className="sr-only">{title}</span>
          {/* small dot or icon when collapsed */}
          <div className="h-2 w-2 rounded-full bg-muted-foreground" />
        </div>
      )}
    </div>
  );
}

function SidebarChildItem({
  item,
  isExpanded,
  isActive,
}: {
  item: { label: string; href: string };
  isExpanded: boolean;
  isActive: boolean;
}) {
  return (
    <li>
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-xl px-4 py-2 sidebar-transition",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-secondary",
          !isExpanded && "justify-center px-0"
        )}
      >
        <div className=" h-3 flex items-end justify-end">
          <span className="block h-4 w-4 rounded-full shrink-0 mt-[2px] bg-gray-300 p-[2px]">
            <Check className="h-3 w-3 " />
          </span>
        </div>
        <span className={cn("text-sm", isActive && "text-primary font-medium")}>
          {item.label}
        </span>
        
      </Link>
    </li>
  );
}
