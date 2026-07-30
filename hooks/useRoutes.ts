"use client";

import { usePathname } from "next/navigation";
import {
  UserPlus,
} from "lucide-react";
import { IoIosCard, IoMdHelpCircle } from "react-icons/io";
import { FaCircleUser } from "react-icons/fa6";
import { MouseEventHandler } from "react";
import { GoHomeFill } from "react-icons/go";

type RouteType = {
  label: string;
  href: string | null;
  icon?: any;
  disbaled?: boolean;
  isActive?: boolean;
  onclick?: MouseEventHandler<HTMLButtonElement>;
  subMenu?: Array<{
    label: string;
    isCompleted?: boolean;
    href: string;
    disbaled?: boolean;
    isActive: boolean;
  }> | null;
};

export const useRoutes = () => {
  const pathname = usePathname();


  const routes: RouteType[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: GoHomeFill,
      isActive: pathname === "/dashboard",
      subMenu: null,
    },
    {
      label: "Questionnaire",
      href: "/questionnaire/your-details",
      isActive: pathname.includes("/questionnaire"),
      subMenu: [
        {
          label: "Your Details",
          href: "/questionnaire/your-details-new",
          isActive: pathname === "/questionnaire/your-details-new",
        },
        {
          label: "Your Finances",
          href: "/questionnaire/your-finances-new",
          isActive: pathname === "/questionnaire/your-finances-new",
        },
        {
          label: "Partners Details",
          href: "/questionnaire/partners-details-new",
          isActive: pathname === "/questionnaire/partners-details-new",
          disbaled: true,
        },
        {
          label: "Partners Finances",
          href: "/questionnaire/partners-finances-new",
          isActive: pathname === "/questionnaire/partners-finances-new",
          disbaled: true,
        },
        {
          label: "Joint Assets",
          href: "/questionnaire/joint-assets-new",
          isActive: pathname === "/questionnaire/joint-assets-new",
        },
        {
          label: "Future Assets",
          href: "/questionnaire/future-assets-new",
          isActive: pathname === "/questionnaire/future-assets-new",
        },
        {
          label: "Area of Complexity",
          href: "/questionnaire/area-of-complexity-new",
          isActive: pathname === "/questionnaire/area-of-complexity-new",
        },
      ],
    },
    {
      label: "Lawyer Selection",
      href: "/lawyers/your-questionnaire",
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
    {
      label: "Review and Sign",
      href: "/review-and-sign",
      isActive: pathname.includes("//review-and-sign"),
      subMenu: null
    },
  ];

  const bottomRoutes: RouteType[] = [
    {
      label: "Payment",
      href: "/payment",
      icon: IoIosCard,
      isActive: pathname === "/payment",
      subMenu: null,
    },
    {
      label: "Help",
      href: "/help",
      icon: IoMdHelpCircle,
      isActive: pathname.includes("/help"),
      subMenu: null,
    },
    {
      label: "Account",
      href: "/account-managment",
      icon: FaCircleUser,
      isActive: pathname.includes("/account-managment"),
      subMenu: null,
    },
  ];

  return { routes, bottomRoutes };
};
