import type React from "react";

export interface NavItem {
  icon: React.ElementType
  label: string
  number?: number
  href: string
}

export interface SidebarProps {
  activeItem?: string
}
