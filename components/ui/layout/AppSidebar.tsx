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
  // Parent questionnaire link
  { icon: ListOrdered, label: "Questionnaire", href: "/questionnaire" },

  // All steps that appear inside the questionnaire
  { icon: Handshake, label: "Invite your Partner", number: 1, href: "/questionnaire/invite" },
  { icon: User, label: "Your Details", number: 1, href: "/your-details" },
  { icon: CreditCard, label: "Your Finances", number: 2, href: "/your-finances" },
  { icon: User, label: "Partner's Details", number: 3, href: "/partners-details" },
  { icon: CreditCard, label: "Partner's Finances", number: 4, href: "/partners-finances" },
  { icon: Handshake, label: "Joint Assets", number: 5, href: "/joint-assets" },
  { icon: ListOrdered, label: "Future Assets", number: 6, href: "/future-assets" },
  { icon: HelpCircle, label: "Area of Complexity", number: 7, href: "/area-of-complexity" },
];

// Second menu: Lawyer Selection (keeps the same look/behaviour as the questionnaire items)
const lawyerNavItems: NavItem[] = [
  { icon: ListOrdered, label: "Lawyer ", href: "#" },
  { icon: ListOrdered, label: "Lawyers Selection",number: 31, href: "/lawyers/selection" },
  { icon: ListOrdered, label: "Your Pre-Lawyer Questioner", number: 32, href: "/questionnaire" },
  { icon: ListOrdered, label: "Partners Pre-Lawyer Questioner", number: 33, href: "/questionnaire" },
  
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

        {/* Lawyer Selection (same look as above) */}
        <ul className="mt-4 space-y-1">
          {lawyerNavItems.map((item) => (
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
