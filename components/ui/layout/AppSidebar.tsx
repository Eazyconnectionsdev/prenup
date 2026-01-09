"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useRoutes } from "@/hooks/useRoutes";
import { logOutUser } from "@/store/asyncThunk/authThunk";
import { ChevronLeft, ChevronRight, LogOut, Check } from "lucide-react";
import { Button } from "../button";
import { getCasesDetails } from "@/store/asyncThunk/casesThunk";
import { toast } from "react-toastify";

export default function AppSidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const { caseId } = useSelector((state: RootState) => state.auth);
  const isPaymentDone = true;

  const [isExpanded, setIsExpanded] = useState(true);
  const { routes, bottomRoutes } = useRoutes();

  const handleLogOut = async () => {
    const result = await dispatch(logOutUser());

    if (logOutUser.fulfilled.match(result)) {
      window.location.assign("/login");
    }
  };

  useEffect(() => {
    dispatch(getCasesDetails(caseId));
  }, []);

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
          {routes.map((route, index) => {
            const Icon = route.icon;

            return (
              <li key={route.href}>
                {/* Parent */}
                {route.href ? (
                  <Link
                    href={route.disbaled ? "#" : route.href}
                    onClick={(e) => {
                      if (route.disbaled) e.preventDefault();
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-3 transition-all",
                      route.isActive
                        ? "bg-gradient-to-br from-secondary to-secondary-foreground text-foreground"
                        : "text-muted-foreground hover:bg-gradient-to-br from-secondary to-primary-foreground hover:text-text-color",
                      !isExpanded && "justify-center px-0",
                      route.disbaled && "opacity-50 hover:text-muted-foreground"
                    )}
                  >
                    {Icon ? (
                      <Icon className="h-6 w-6 shrink-0" />
                    ) : (
                      <span className="h-6 w-6 rounded-full bg-primary font-normal shrink-0 text-sm text-white flex items-center justify-center">
                        {index}
                      </span>
                    )}
                    {isExpanded && (
                      <span className="text-[14px] font-normal">
                        {route.label}
                      </span>
                    )}
                  </Link>
                ) : (
                  <button
                    className={cn(
                      "w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-all",
                      route.isActive
                        ? "bg-gradient-to-br from-secondary to-secondary-foreground text-foreground"
                        : "text-muted-foreground hover:bg-gradient-to-br from-secondary to-primary-foreground hover:text-text-color",
                      !isExpanded && "justify-center px-0"
                    )}
                  >
                    {Icon && <Icon className="h-5 w-5 shrink-0" />}
                    {isExpanded && (
                      <span className="text-sm font-normal">{route.label}</span>
                    )}
                  </button>
                )}

                {/* Sub Menu */}
                {route.subMenu && (
                  <ul className="mt-2 ml-4 space-y-1">
                    {route.subMenu.map((sub) => {
                      const isDisabled = !isPaymentDone;

                      return (
                        <li key={sub.href}>
                          <Link
                            href={isDisabled || sub.disbaled ? "#" : sub.href}
                            onClick={(e) => {
                              if (isDisabled) e.preventDefault();
                            }}
                            aria-disabled={isDisabled || sub.disbaled}
                            className={cn(
                              "flex items-center gap-3 rounded-lg pl-2 pr-4 py-2 text-[13px] transition-all",
                              sub.isActive
                                ? "text-primary font-normal"
                                : "text-muted-foreground hover:text-text-color",
                              !isExpanded && "justify-center px-0",
                              (isDisabled || sub.disbaled) &&
                                "opacity-50 hover:text-muted-foreground"
                            )}
                          >
                            {sub.isCompleted ? (
                              <span className="h-4 w-4 rounded-full shrink-0 bg-green-600 flex items-center justify-center">
                                <Check className="h-3 w-3 text-white" />
                              </span>
                            ) : (
                              <span className="block w-3 h-3 rounded-full border border-gray-400" />
                            )}

                            {isExpanded && (
                              <p className="flex-1">{sub.label}</p>
                            )}
                          </Link>
                        </li>
                      );
                    })}
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
      <nav className="overflow-auto px-3 pb-10">
        <ul className="space-y-2">
          {bottomRoutes.map((route) => {
            const Icon = route.icon;

            return (
              <li key={route.href}>
                {/* Parent */}
                {route.href ? (
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
                      <span className="text-[14px] font-normal">
                        {route.label}
                      </span>
                    )}
                  </Link>
                ) : (
                  <button
                    className={cn(
                      "w-full cursor-pointer flex items-center gap-3 rounded-xl px-4 py-3 transition-all",
                      route.isActive
                        ? "bg-gradient-to-br from-secondary to-secondary-foreground text-foreground"
                        : "text-muted-foreground hover:bg-gradient-to-br from-secondary to-primary-foreground hover:text-text-color",
                      !isExpanded && "justify-center px-0"
                    )}
                    onClick={route.onclick}
                  >
                    {Icon && <Icon className="h-5 w-5 shrink-0" />}
                    {isExpanded && (
                      <span className="text-base font-normal">
                        {route.label}
                      </span>
                    )}
                  </button>
                )}
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
            "flex w-full items-center justify-center gap-3 rounded-full border border-gray-400 py-3 transition-all hover:bg-secondary",
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
