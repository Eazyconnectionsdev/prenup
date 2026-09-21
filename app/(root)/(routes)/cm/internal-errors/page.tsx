'use client'

import React, { useState, useMemo } from 'react'
import Pagination from '@/components/admin/common/pagination'

// Mock internal errors data
const mockErrors = [
  {
    id: 1,
    message: 'TypeError: Cannot read property "x" of undefined',
    source: 'portal',
    module: 'user-settings',
    errorStack: 'Error in user-settings.js at line 45',
    user: 'usmanialiq@gmail.com',
    ip: '120.60.218.51',
    createdAt: '09/12/2025, 8:34:13 pm'
  },
  {
    id: 2,
    message: 'ReferenceError: y is not defined',
    source: 'api',
    module: 'auth',
    errorStack: 'Error in auth.js while validating token',
    user: 'john@example.com',
    ip: '120.60.218.52',
    createdAt: '10/12/2025, 10:12:20 am'
  },
  // add more mock errors as needed
]

export default function InternalErrorsPage() {
  const [source, setSource] = useState('')
  const [module, setModule] = useState('')
  const [search, setSearch] = useState('')
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [page, setPage] = useState(1)
  const pageSize = 10

  const filteredErrors = useMemo(() => {
    let list = mockErrors

    if (source) list = list.filter(err => err.source.toLowerCase().includes(source.toLowerCase()))
    if (module) list = list.filter(err => err.module.toLowerCase().includes(module.toLowerCase()))
    if (search)
      list = list.filter(
        err =>
          err.user.toLowerCase().includes(search.toLowerCase()) ||
          err.ip.includes(search) ||
          err.message.toLowerCase().includes(search.toLowerCase()) ||
          err.errorStack.toLowerCase().includes(search.toLowerCase())
      )
    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from)
      const toDate = new Date(dateRange.to)
      list = list.filter(err => {
        const errDate = new Date(err.createdAt)
        return errDate >= fromDate && errDate <= toDate
      })
    }

    return list
  }, [source, module, search, dateRange])

  return (
    <div className="w-full">
      <div className="max-w-[1400px] mx-auto">
        <div className="p-4 bg-white rounded shadow-sm mb-4 flex items-start justify-between gap-6">
          <div>
            <h1 className="text-xl font-bold">Internal Errors</h1>
            <p className="text-sm text-slate-600">View and monitor internal errors across the system</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded shadow-sm mb-4 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm text-slate-700 mb-1">Source</label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Search by source"
              className="w-full rounded-md border border-slate-200 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-1">Module</label>
            <input
              type="text"
              value={module}
              onChange={(e) => setModule(e.target.value)}
              placeholder="Search by module"
              className="w-full rounded-md border border-slate-200 px-3 py-2"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-slate-700 mb-1">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by user, IP, or error"
              className="w-full rounded-md border border-slate-200 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-1">Date Range</label>
            <input
              type="text"
              placeholder="YYYY-MM-DD to YYYY-MM-DD"
              value={dateRange.from && dateRange.to ? `${dateRange.from} to ${dateRange.to}` : ''}
              onChange={(e) => {
                const [from, to] = e.target.value.split(' to ')
                setDateRange({ from: from || '', to: to || '' })
              }}
              className="w-full rounded-md border border-slate-200 px-3 py-2"
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => setPage(1)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-b">Message</th>
                <th className="p-3 border-b">Source</th>
                <th className="p-3 border-b">Module</th>
                <th className="p-3 border-b">Error Stack</th>
                <th className="p-3 border-b">User</th>
                <th className="p-3 border-b">IP</th>
                <th className="p-3 border-b">Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredErrors.slice((page - 1) * pageSize, page * pageSize).map((err) => (
                <tr key={err.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{err.message}</td>
                  <td className="p-3 border-b">{err.source}</td>
                  <td className="p-3 border-b">{err.module}</td>
                  <td className="p-3 border-b">{err.errorStack}</td>
                  <td className="p-3 border-b">{err.user}</td>
                  <td className="p-3 border-b">{err.ip}</td>
                  <td className="p-3 border-b">{err.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-slate-600">{filteredErrors.length} Results Found</div>
          <Pagination page={page} setPage={setPage} totalPages={Math.ceil(filteredErrors.length / pageSize)} />
        </div>
      </div>
    </div>
  )
}
