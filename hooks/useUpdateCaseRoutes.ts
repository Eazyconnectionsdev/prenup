"use client";

import { usePathname, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export const useUpdateCaseRoutes = () => {
  const pathname = usePathname();
  const params = useParams();
  const id = params?.id as string;

  const { status } = useSelector((state: RootState) => state.cases);

  const basePath = `/cm/case-manager/cases/${id}/update-case`;

  return [
    {
      label: "Your Details",
      href: `${basePath}/your-details`,
      isActive: pathname === `${basePath}/your-details`,
      isCompleted: status?.step1?.submitted,
    },
    {
      label: "Your Finances",
      href: `${basePath}/your-finances`,
      isActive: pathname === `${basePath}/your-finances`,
      isCompleted: status?.step2?.submitted,
    },
    {
      label: "Partner Details",
      href: `${basePath}/partners-details`,
      isActive: pathname === `${basePath}/partners-details`,
      isCompleted: status?.step3?.submitted,
    },
    {
      label: "Partner Finances",
      href: `${basePath}/partners-finances`,
      isActive: pathname === `${basePath}/partner-finances`,
      isCompleted: status?.step4?.submitted,
    },
    {
      label: "Joint Assets",
      href: `${basePath}/joint-assets`,
      isActive: pathname === `${basePath}/joint-assets`,
      isCompleted: status?.step5?.submitted,
    },
    {
      label: "Future Assets",
      href: `${basePath}/future-assets`,
      isActive: pathname === `${basePath}/future-assets`,
      isCompleted: status?.step6?.submitted,
    },
    {
      label: "Area of Complexity",
      href: `${basePath}/area-of-complexity`,
      isActive: pathname === `${basePath}/area-of-complexity`,
      isCompleted: status?.step7?.submitted,
    },
  ];
};
