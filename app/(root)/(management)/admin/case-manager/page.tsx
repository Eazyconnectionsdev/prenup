'use client'

import React, { useMemo, useState } from 'react'
import UserReportFilter from '@/components/admin/UserReportFilter'
import UserTable from '@/components/admin/tables/caseManagerTable'
import Pagination from '@/components/admin/common/pagination'

const makeUser = (i: number) => ({
  id: i,
  firstName: `User${i}`,
  lastName: `Last${i}`,
  email: `user${i}@example.com`,
  team: { title: `Team ${i}`, plan: { title: i % 3 === 0 ? 'Free' : i % 3 === 1 ? 'Starter' : 'Pro' } },
  type: i % 2 === 0 ? 'teamOwner' : 'teamMember',
  creditUsage: Math.floor(Math.random() * 10),
  registerCount: 1,
  registrationDate: '2025-11-25',
  ipLocation: { city: 'London', region: 'Greater London', country: 'UK' },
  ipAddress: `185.1.1.${i}`
})

const mockUsers = new Array(12).fill(0).map((_, i) => makeUser(i + 1))

export default function Page() {
  const [reportType, setReportType] = useState<'user' | 'registration' | 'credit' | 'thirdparty' | 'unregistration'>('user')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const filtered = useMemo(() => {
    let list = mockUsers
    if (query) list = list.filter(u => `${u.firstName} ${u.lastName}`.toLowerCase().includes(query.toLowerCase()) || u.email.includes(query))
    return list
  }, [query, reportType])

  return (
    <div className="w-full">
      <div className="max-w-[1400px] mx-auto">
        <div className="p-4 bg-white rounded shadow-sm mb-4 flex items-start justify-between gap-6">
          <div>
            <h1 className="text-xl font-bold">Case Manager</h1>
            <p className="text-sm text-slate-600">View and manage registered cases</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input type="radio" name="rt" checked={reportType === 'user'} onChange={() => setReportType('user')} className="h-4 w-4 text-indigo-600" />
                <span className="ml-2 text-sm">User Report</span>
              </label>
              <label className="inline-flex items-center">
                <input type="radio" name="rt" checked={reportType === 'registration'} onChange={() => setReportType('registration')} className="h-4 w-4 text-indigo-600" />
                <span className="ml-2 text-sm">Registration</span>
              </label>
              <label className="inline-flex items-center">
                <input type="radio" name="rt" checked={reportType === 'credit'} onChange={() => setReportType('credit')} className="h-4 w-4 text-indigo-600" />
                <span className="ml-2 text-sm">Credit</span>
              </label>
            </div>
          </div>
        </div>

        <UserReportFilter setQuery={setQuery} />

        <div className="mt-4 bg-white rounded shadow-sm overflow-hidden">
          <UserTable />
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-slate-600">{filtered.length} Results Found</div>
          <Pagination page={page} setPage={setPage} totalPages={Math.ceil(filtered.length / pageSize)} />
        </div>
      </div>
    </div>
  )
}