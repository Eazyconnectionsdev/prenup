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
  const dispatch = useDispatch();
  const pathname = usePathname();
  const {
    auth: { user },
    cases: { status },
  } = useSelector((state: RootState) => state);

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
          isCompleted:
            user?.endUserType === "user1"
              ? status?.step1?.submitted
              : status?.step3?.submitted,
          isActive: pathname === "/questionnaire/your-details",
        },
        {
          label: "Your Finances",
          href: "/questionnaire/your-finances",
          isCompleted:
            user?.endUserType === "user1"
              ? status?.step2?.submitted
              : status?.step4?.submitted,
          isActive: pathname === "/questionnaire/your-finances",
          disbaled : !status?.step1?.submitted
        },
        {
          label: "Partners Details",
          href: "/questionnaire/partners-details",
          isCompleted:
            user?.endUserType === "user1"
              ? status?.step3?.submitted
              : status?.step1?.submitted,
          isActive: pathname === "/questionnaire/partners-details",
          disbaled: true,
        },
        {
          label: "Partners Finances",
          href: "/questionnaire/partners-finances",
          isCompleted:
            user?.endUserType === "user1"
              ? status?.step4?.submitted
              : status?.step2?.submitted,
          isActive: pathname === "/questionnaire/partners-finances",
          disbaled: true,
        },
        {
          label: "Joint Assets",
          href: "/questionnaire/joint-assets",
          isCompleted: status?.step5?.submitted,
          isActive: pathname === "/questionnaire/joint-assets",
          disbaled: user?.endUserType === "user2" ||!status?.step2?.submitted
        },
        {
          label: "Future Assets",
          href: "/questionnaire/future-assets",
          isCompleted: status?.step6?.submitted,
          isActive: pathname === "/questionnaire/future-assets",
          disbaled: user?.endUserType === "user2" || !status?.step5?.submitted
        },
        {
          label: "Area of Complexity",
          href: "/questionnaire/area-of-complexity",
          isCompleted: status?.step7?.submitted,
          isActive: pathname === "/questionnaire/area-of-complexity",
          disbaled: user?.endUserType === "user2" || !status?.step6?.submitted
        },
      ],
    },
    {
      label: "Lawyers",
      href: "/lawyers/your-questionnaire",
      disbaled: status.step7?.submitted ? false : true,
      isActive: pathname.includes("/lawyers"),
      subMenu: [
        {
          label: "Your Pre-Lawyer Questioner",
          href: "/lawyers/your-questionnaire",
          disbaled: status.step7?.submitted ? false : true,
          isActive: pathname === "/lawyers/your-questionnaire",
        },
        {
          label: "Lawyer Selection",
          href: "/lawyers/selection",
          disbaled: status.step7?.submitted ? false : true,
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
    ...((user?.invitedUser|| user?.invitedBy)
      ? []
      : [
          {
            label: "Invite Partner",
            href: null,
            icon: UserPlus,
            subMenu: null,
            onclick: () => dispatch(openInvitePartnerModel("invite-partner")),
          },
        ]),
    {
      label: "Account",
      href: "/account-managment",
      icon: User,
      isActive: pathname.includes("/account-managment"),
      subMenu: null,
    },
  ];

  return { routes, bottomRoutes };
};
