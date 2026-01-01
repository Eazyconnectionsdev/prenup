"use client";

import { usePathname } from "next/navigation";
import {
  Home,
  CreditCard,
  HelpCircle,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Check,
  ListOrdered,
} from "lucide-react";

type RouteType = {
  label: string;
  href: string;
  icon?: any;
  isActive: boolean;
  subMenu?: Array<{
    label: string;
    href: string;
    isActive: boolean;
  }> | null;
};

export const useRoutes = () => {
  const pathname = usePathname();

  const routes: RouteType[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: Home,
      isActive: pathname === "/dashboard",
      subMenu: null,
    },
    {
      label: "Questionnaire",
      href: "/questionnaire",
      icon: ListOrdered,
      isActive: pathname.includes("/questionnaire"),
      subMenu: [
        {
          label: "Your Details",
          href: "/questionnaire/your-details",
          isActive: pathname === "/questionnaire/your-details",
        },
        {
          label: "Your Finances",
          href: "/questionnaire/your-finances",
          isActive: pathname === "/questionnaire/your-finances",
        },
        {
          label: "Partners Details",
          href: "/questionnaire/partners-details",
          isActive: pathname === "/questionnaire/partners-details",
        },
        {
          label: "Partners Finances",
          href: "/questionnaire/partners-finances",
          isActive: pathname === "/questionnaire/partners-finances",
        },
        {
          label: "Joint Assets",
          href: "/questionnaire/joint-assets",
          isActive: pathname === "/questionnaire/joint-assets",
        },
        {
          label: "Future Assets",
          href: "/questionnaire/future-assets",
          isActive: pathname === "/questionnaire/future-assets",
        },
        {
          label: "Area of Complexity",
          href: "/questionnaire/area-of-complexity",
          isActive: pathname === "/questionnaire/area-of-complexity",
        },
      ],
    },
    {
      label: "Lawyers",
      href: "/lawyers",
      icon: ListOrdered,
      isActive: pathname.includes("/lawyers"),
      subMenu: [
        {
          label: "Your Pre-Lawyer Questioner",
          href: "/lawyers/your-questionnaire",
          isActive: pathname === "/lawyers/your-questionnaire",
        },
        {
          label: "Lawyer Selection",
          href: "/lawyers/selection",
          isActive: pathname === "/lawyers/selection",
        },
      ],
    },
  ];

  const bottomRoutes: RouteType[] = [
    {
      label: "Payment",
      href: "/payment",
      icon: CreditCard,
      isActive: pathname === "/payment",
      subMenu: null,
    },
    {
      label: "Help",
      href: "/help",
      icon: HelpCircle,
      isActive: pathname.includes("/help"),
      subMenu: null,

    },
    {
      label: "Account",
      href: "/account-managment",
      icon: User,
      isActive: pathname.includes("/account-managment"),
      subMenu: null,

    },
  ];

  return {routes, bottomRoutes};
};
