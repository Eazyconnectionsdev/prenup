'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Home,
  BarChart2,
  Inbox,
  Search,
  UserPlus,
  Briefcase,
  FileText,
  AlertTriangle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  User
} from 'lucide-react'

interface NavItem {
  icon: React.ElementType
  label: string
  number?: number
  href: string
}

const mainNavItems: NavItem[] = [
  { icon: Home, label: 'Dashboard', href: '/admin' }
]


const coreNavItems: NavItem[] = [
  { icon: Home, label: 'Case Manager', href: '/admin/case-manager' },
  { icon: BarChart2, label: 'User Reports', href: '/admin/reports' },
  { icon: Inbox, label: 'Enquiry Dashboard', href: '/admin/enquiry-dashboard' },
  { icon: UserPlus, label: 'Lawyer & Company Creation', href: '/admin/lawyer-company-creation' },
  { icon: FileText, label: 'Audit Logs', href: '/admin/audit-logs' },
  { icon: AlertTriangle, label: 'Internal Errors', href: '/admin/internal-errors' }
]

const bottomNavItems: NavItem[] = [
  { icon: HelpCircle, label: 'Help', href: '/help' },
  { icon: User, label: 'Account', href: '/account' }
]

interface SidebarProps {
  activeItem?: string
}

export default function Sidebar({ activeItem = '/management/admin' }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const toggleSidebar = () => setIsExpanded(v => !v)

  return (
    <aside
      className={cn(
        'h-screen bg-white border-r flex flex-col transition-all duration-200 relative',
        isExpanded ? 'w-[270px]' : 'w-[72px]'
      )}
    >
      {/* Logo / title */}
      <div className="flex items-center gap-3 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-50">
          <svg viewBox="0 0 40 40" className="h-8 w-8">
            <circle cx="14" cy="20" r="10" fill="none" stroke="#6366f1" strokeWidth="2" />
            <circle cx="26" cy="20" r="10" fill="none" stroke="#06b6d4" strokeWidth="2" />
          </svg>
        </div>

        {isExpanded && (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-800">Hello Prenup</span>
            <span className="text-xs text-slate-500">Admin</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      {/* Note: added extra bottom padding so the scrollable nav content won't be hidden behind the sticky logout area */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 pb-20">
        <ul className="space-y-1">
          {mainNavItems.map(item => (
            <NavEntry key={item.href} item={item} isExpanded={isExpanded} isActive={activeItem === item.href} />
          ))}
        </ul>

        <div className="my-3 border-t" />

        <ul className="mt-2 space-y-1">
          {coreNavItems.map(item => (
            <NavEntry key={item.href} item={item} isExpanded={isExpanded} isActive={activeItem === item.href} />
          ))}
        </ul>

        <div className="my-3 border-t" />

        <ul className="space-y-1 mt-2">
          {bottomNavItems.map(item => (
            <NavEntry key={item.href} item={item} isExpanded={isExpanded} isActive={activeItem === item.href} />
          ))}
        </ul>
      </nav>

      {/* Sign out - moved to a sticky bottom area so it's always visible without extra scrolling */}
      <div className="sticky bottom-0 bg-white border-t p-3">
        <button
          className={cn(
            'flex w-full items-center justify-center gap-3 rounded-full border py-2 text-sm transition-colors',
            !isExpanded && 'px-0'
          )}
        >
          <LogOut className="h-4 w-4" />
          {isExpanded && <span className="font-medium">Sign out</span>}
        </button>
      </div>
    </aside>
  )
}

function NavEntry({ item, isExpanded, isActive }: { item: NavItem; isExpanded: boolean; isActive: boolean }) {
  const Icon = item.icon
  return (
    <li>
      <a
        href={item.href}
        className={cn(
          'flex items-center gap-3 rounded-2xl px-3 py-2 transition-colors text-sm',
          isActive ? 'bg-gradient-to-r from-indigo-100 to-indigo-50 text-slate-900 font-medium' : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900',
          !isExpanded && 'justify-center px-0'
        )}
      >
        <Icon className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-indigo-600' : 'text-slate-400')} />
        {isExpanded && <span className="truncate">{item.label}</span>}
      </a>
    </li>
  )
}
