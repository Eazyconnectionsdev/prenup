"use client"

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Home,
  ListOrdered,
  Eye,
  Handshake,
  CreditCard,
  HelpCircle,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  number?: number;
  href: string;
}

const mainNavItems: NavItem[] = [
  { icon: Home, label: "Dashboard", href: "/" },
];

const numberedNavItems: NavItem[] = [
  { icon: ListOrdered, label: "Questionnaire", number: 1, href: "/questionnaire" },
  { icon: Eye, label: "Financial Disclosure", number: 2, href: "/financial" },
  { icon: Handshake, label: "Alignment", number: 3, href: "/alignment" },
  { icon: Handshake, label: "step1", number: 3, href: "/step1" },
  { icon: Handshake, label: "step2", number: 3, href: "/step2" },
  { icon: Handshake, label: "step5", number: 3, href: "/step5" },
  { icon: Handshake, label: "step6", number: 3, href: "/step6" },
  { icon: Handshake, label: "step7", number: 3, href: "/step7" },
  { icon: Handshake, label: "lawyer selection", number: 3, href: "/lawyers" },
];

const bottomNavItems: NavItem[] = [
  { icon: CreditCard, label: "Payment", href: "/payment" },
  { icon: HelpCircle, label: "Help", href: "/help" },
  { icon: User, label: "Account", href: "/account" },
];

interface AppSidebarProps {
  activeItem?: string;
}

export function AppSidebar({ activeItem = "/" }: AppSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col sidebar-transition relative",
        isExpanded ? "w-[270px]" : "w-[72px]"
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-8 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm hover:bg-secondary sidebar-transition"
      >
        {isExpanded ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>

      {/* Logo Section */}
      <div className="flex items-center gap-3 p-6">
        <div className="flex h-10 w-10 items-center justify-center">
          <svg viewBox="0 0 40 40" className="h-10 w-10">
            <circle cx="14" cy="20" r="10" fill="none" stroke="hsl(45, 90%, 55%)" strokeWidth="3" />
            <circle cx="26" cy="20" r="10" fill="none" stroke="hsl(45, 90%, 55%)" strokeWidth="3" />
          </svg>
        </div>
        {isExpanded && (
          <span className="text-lg font-bold text-primary whitespace-nowrap sidebar-transition">
            LET'S PRENUP
          </span>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-2">
        {/* Dashboard */}
        <ul className="space-y-1">
          {mainNavItems.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isExpanded={isExpanded}
              isActive={activeItem === item.href}
            />
          ))}
        </ul>

        {/* Numbered Items */}
        <ul className="mt-4 space-y-1">
          {numberedNavItems.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isExpanded={isExpanded}
              isActive={activeItem === item.href}
            />
          ))}
        </ul>

        {/* Divider */}
        <div className="my-3 border-t border-sidebar-border" />

        {/* Bottom Navigation Items */}
        <ul className="space-y-1">
          {bottomNavItems.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isExpanded={isExpanded}
              isActive={activeItem === item.href}
            />
          ))}
        </ul>
      </nav>

      {/* Sign Out Button */}
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

      {/* Footer */}
      {/* {isExpanded && (
        <div className="px-6 pb-6 text-center text-xs text-muted-foreground">
          <p>
            Made with <span className="text-accent">♥</span> in Boston© Hello Prenup, Inc. 2025.
          </p>
        </div>
      )} */}
    </aside>
  );
}

interface NavItemProps {
  item: NavItem;
  isExpanded: boolean;
  isActive: boolean;
}

function NavItem({ item, isExpanded, isActive }: NavItemProps) {
  const Icon = item.icon;

  return (
    <li>
      <a
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-2xl px-4 py-3 sidebar-transition",
            isActive ? "bg-gradient-to-r from-secondary to-secondary-foreground"
            : "text-muted-foreground hover:bg-gradient-to-r hover:from-secondary hover:to-secondary-foreground hover:text-foreground",
          !isExpanded && "justify-center px-0 "
        )}
      >
        {item.number && !isActive ? (
          <span
            className={cn(
              "flex h-6 w-6 items-center justify-center text-sm font-medium",
              isActive ? "text-white" : "text-muted-foreground"
            )}
          >
            {item.number}
          </span>
        ) : (
          <Icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-black")} />
        )}
        {isExpanded && (
          <span className={cn("whitespace-nowrap text-sm font-normal", isActive && "text-black")}>
            {item.label}
          </span>
        )}
      </a>
    </li>
  );
}
