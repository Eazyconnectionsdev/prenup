'use client'

import React from 'react'

export default function UserReportFilter({ setQuery }: { setQuery: (q: string) => void }) {
  return (
    <div className="mt-2 bg-white p-4 rounded">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <select className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900">
            <option>-- Select Country --</option>
            <option>United Kingdom</option>
            <option>United States</option>
          </select>
        </div>

        <div>
          <select className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900">
            <option>-- Select Time --</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
        </div>

        <div className="md:col-span-2 flex items-center gap-2">
          <input onChange={e => setQuery(e.target.value)} placeholder="Search by name or email" className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900" />
          <button className="px-4 py-2 rounded bg-indigo-600 text-white">Search</button>
        </div>
      </div>
    </div>
  )
}