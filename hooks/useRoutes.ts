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
  UserPlus,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { openInvitePartnerModel } from "@/store/slices/modelSlice";
import { MouseEventHandler } from "react";
import { GoHomeFill } from "react-icons/go";
import { RootState } from "@/store/store";

type RouteType = {
  label: string;
  href: string | null;
  icon?: any;
  isActive ?: boolean;
  onclick?: MouseEventHandler<HTMLButtonElement>;
  subMenu?: Array<{
    label: string;
    isCompleted?: boolean;
    href: string;
    isActive: boolean;
  }> | null;
};

export const useRoutes = () => {
  const dispatch = useDispatch()
  const pathname = usePathname();
  const {status} = useSelector((state: RootState) => state.cases);

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
          href: "/questionnaire/your-details",
          isCompleted: status?.step1?.submitted,
          isActive: pathname === "/questionnaire/your-details",
        },
        {
          label: "Your Finances",
          href: "/questionnaire/your-finances",
          isCompleted: status?.step2?.submitted,
          isActive: pathname === "/questionnaire/your-finances",
        },
        {
          label: "Partners Details",
          href: "/questionnaire/partners-details",
          isCompleted: status?.step3?.submitted,
          isActive: pathname === "/questionnaire/partners-details",
        },
        {
          label: "Partners Finances",
          href: "/questionnaire/partners-finances",
          isCompleted: status?.step4?.submitted,
          isActive: pathname === "/questionnaire/partners-finances",
        },
        {
          label: "Joint Assets",
          href: "/questionnaire/joint-assets",
          isCompleted: status?.step5?.submitted,
          isActive: pathname === "/questionnaire/joint-assets",
        },
        {
          label: "Future Assets",
          href: "/questionnaire/future-assets",
          isCompleted: status?.step6?.submitted,
          isActive: pathname === "/questionnaire/future-assets",
        },
        {
          label: "Area of Complexity",
          href: "/questionnaire/area-of-complexity",
          isCompleted: status?.step7?.submitted,
          isActive: pathname === "/questionnaire/area-of-complexity",
        },
      ],
    },
    {
      label: "Lawyers",
      href: "/lawyers",
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
      label: "Invite Partner",
      href: null,
      icon: UserPlus,
      subMenu: null,
      onclick: () => dispatch(openInvitePartnerModel("invite-partner"))

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
