import type { MouseEventHandler } from "react";

export type RouteType = {
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
