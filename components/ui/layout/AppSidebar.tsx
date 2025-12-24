"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRoutes } from "@/hooks/useRoutes"; // <-- adjust path
import { ChevronLeft, ChevronRight, LogOut, Check } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { logOutUser } from "@/store/asyncThunk/authThunk";

export default function AppSidebar() {
  const dispatch = useDispatch<AppDispatch>();

  const [isExpanded, setIsExpanded] = useState(true);
  const { routes, bottomRoutes } = useRoutes();

  const handleLogOut = async () => {
    const result = await dispatch(logOutUser());

    if (logOutUser.fulfilled.match(result)) {
      window.location.assign("/login");
    }
  };

  return (
    <aside
      className={cn(
        "h-screen relative bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
        isExpanded ? "w-[270px]" : "w-[72px]"
      )}
    >
      {/* Toggle */}
      <button
        onClick={() => setIsExpanded((v) => !v)}
        className="absolute -right-3 top-8 z-10 flex h-6 w-6 items-center justify-center rounded-full border bg-sidebar shadow-sm"
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
          <span className="text-lg font-bold whitespace-nowrap">
            LET&apos;S PRENUP
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-auto px-3">
        <ul className="space-y-2">
          {routes.map((route) => {
            const Icon = route.icon;

            return (
              <li key={route.href}>
                {/* Parent */}
                <Link
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 transition-all",
                    route.isActive
                      ? "bg-gradient-to-br from-secondary to-secondary-foreground text-foreground"
                      : "text-muted-foreground hover:bg-gradient-to-br from-secondary to-primary-foreground hover:text-text-color",
                    !isExpanded && "justify-center px-0"
                  )}
                >
                  {Icon && <Icon className="h-5 w-5 shrink-0" />}
                  {isExpanded && (
                    <span className="text-base font-normal">{route.label}</span>
                  )}
                </Link>

                {/* Sub Menu */}
                {route.subMenu && (
                  <ul className="mt-2 ml-4 space-y-1">
                    {route.subMenu.map((sub) => (
                      <li key={sub.href}>
                        <Link
                          href={sub.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-2 py-2 text-[15px] transition-all",
                            sub.isActive
                              ? "text-primary font-normal"
                              : "text-muted-foreground hover:text-text-color",
                            !isExpanded && "justify-center px-0"
                          )}
                        >
                          <span className="h-4 w-4 rounded-full shrink-0 bg-gray-300 flex items-center justify-center">
                            <Check className="h-3 w-3" />
                          </span>

                          {isExpanded && sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Divider */}
      <div className="my-3 border-t border-sidebar-border" />

      {/* Bottom Navigation */}
      <nav className="overflow-auto px-3">
        <ul className="space-y-2">
          {bottomRoutes.map((route) => {
            const Icon = route.icon;

            return (
              <li key={route.href}>
                {/* Parent */}
                <Link
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 transition-all",
                    route.isActive
                      ? "bg-gradient-to-br from-secondary to-primary-foreground text-foreground"
                      : "text-muted-foreground hover:bg-gradient-to-br from-secondary to-primary-foreground hover:text-text-color",
                    !isExpanded && "justify-center px-0"
                  )}
                >
                  {Icon && <Icon className="h-5 w-5 shrink-0" />}
                  {isExpanded && (
                    <span className="text-sm font-normal">{route.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sign out */}
      <div className="p-3">
        <button
          onClick={handleLogOut}
          className={cn(
            "flex w-full items-center justify-center gap-3 rounded-full border py-3 transition-all hover:bg-secondary",
            !isExpanded && "px-0"
          )}
        >
          <LogOut className="h-4 w-4" />
          {isExpanded && <span className="text-sm">Sign out</span>}
        </button>
      </div>
    </aside>
  );
}
