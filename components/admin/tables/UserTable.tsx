'use client'

import React from 'react'

function getInitials(name = '') {
  const parts = name.split(' ')
  return (parts[0]?.[0] || '') + (parts[1]?.[0] || '')
}

function getRandomColor(index = 0) {
  const palette = ['#6ee7b7', '#60a5fa', '#fca5a5', '#fde68a', '#c7d2fe', '#cfe8ff']
  return palette[index % palette.length]
}

export default function UserTable({ users }: { users: any[] }) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-full">
        {/* header row */}
        <div className="flex bg-[#f0f4ff] min-h-12 text-xs font-semibold text-[#4b5c76] uppercase">
          <div className="min-w-[220px] px-3 py-3 border-r">Name</div>
          <div className="min-w-[260px] px-3 py-3 border-r">Email</div>
          <div className="min-w-[200px] px-3 py-3 border-r">Team Name</div>
          <div className="min-w-[140px] px-3 py-3 border-r">Role</div>
          <div className="min-w-[100px] px-3 py-3 border-r">Plan</div>
          <div className="min-w-[100px] px-3 py-3 border-r">Credit Access</div>
          <div className="min-w-[80px] px-3 py-3 border-r text-center">Credits Used</div>
          <div className="min-w-[140px] px-3 py-3 text-center">Registration Date</div>
        </div>

        <div className="divide-y divide-gray-200">
          {users.map((u, idx) => (
            <div className="flex items-center hover:bg-[#fafafa]" key={u.id}>
              <div className="min-w-[220px] px-3 py-3 flex items-center gap-3">
                <div className="w-[40px] h-[40px] rounded flex items-center justify-center text-white font-semibold" style={{ backgroundColor: getRandomColor(idx) }}>
                  {getInitials(`${u.firstName} ${u.lastName}`)}
                </div>
                <div className="break-words">
                  <div className="font-medium truncate max-w-[170px]">{u.firstName} {u.lastName}</div>
                </div>
              </div>

              <div className="min-w-[260px] px-3 py-3 truncate">{u.email}</div>
              <div className="min-w-[200px] px-3 py-3">{u.team.title}</div>
              <div className="min-w-[140px] px-3 py-3">{u.type === 'teamOwner' ? 'Team Owner' : 'Team Member'}</div>
              <div className="min-w-[100px] px-3 py-3">{u.team.plan.title}</div>

              <div className="min-w-[100px] px-3 py-3">
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="relative w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-4 after:w-4 after:rounded-full after:transition-all peer-checked:after:translate-x-[18px]"></div>
                  <span className="ms-3 text-sm">Enable</span>
                </label>
              </div>

              <div className="min-w-[80px] px-3 py-3 text-center">{u.creditUsage}</div>
              <div className="min-w-[140px] px-3 py-3 text-center">{u.registrationDate}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}