import React from 'react'
import Sidebar from '@/components/admin/SidebarCaseManager'

export const metadata = {
  title: 'Admin'
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#0b233f] text-white py-3 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          
        </div>
        <div className="text-sm opacity-80">CM panel</div>
      </header>

      <div className="flex">
        <aside className="w-64 border-r bg-white">
          <Sidebar />
        </aside>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}