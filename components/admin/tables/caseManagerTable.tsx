"use client"

import React, { useMemo, useState } from 'react'
import { MoreHorizontal, Search, ChevronDown } from 'lucide-react'

function getInitials(name = '') {
  const parts = name.split(' ')
  return (parts[0]?.[0] || '') + (parts[1]?.[0] || '')
}

function getRandomColor(index = 0) {
  const palette = ['#6ee7b7', '#60a5fa', '#fca5a5', '#fde68a', '#c7d2fe', '#cfe8ff']
  return palette[index % palette.length]
}

function statusClasses(status: string) {
  switch (status?.toLowerCase()) {
    case 'open':
      return 'bg-amber-50 text-amber-700'
    case 'in progress':
    case 'active':
      return 'bg-indigo-50 text-indigo-700'
    case 'closed':
      return 'bg-green-50 text-green-700'
    case 'pending':
      return 'bg-yellow-50 text-yellow-800'
    case 'rejected':
      return 'bg-red-50 text-red-700'
    default:
      return 'bg-slate-50 text-slate-700'
  }
}

const mockCases = [
  { id: 'C-1001', category: 'Prenup', type: 'Prenup', title: 'Prenuptial Agreement Draft', description: 'Drafting prenuptial agreement covering assets, liabilities and future inheritance.', client: 'Alice Johnson', clientEmail: 'alice.johnson@example.com', lawyer: 'Sarah Lim', lawyerFirm: 'Lim & Partners', status: 'Open', priority: 'High', created: '2025-11-01', updated: '2025-11-05' },
  { id: 'C-1002', category: 'Postnup', type: 'Mediation', title: 'Dispute Mediation - Property', description: 'Mediation for property division between spouses.', client: 'Benjamin Tan', clientEmail: 'ben.tan@example.com', lawyer: 'David Ong', lawyerFirm: 'Ong & Co', status: 'In Progress', priority: 'Medium', created: '2025-10-20', updated: '2025-11-10' },
  { id: 'C-1003', category: 'Contractual Update', type: 'Contract Review', title: 'Review of Cohabitation Agreement', description: 'Review terms and suggest amendments for cohabitation agreement.', client: 'Clara Smith', clientEmail: 'clara.smith@example.com', lawyer: 'Lawyer 3', lawyerFirm: 'Smith Legal', status: 'Closed', priority: 'Low', created: '2025-09-15', updated: '2025-09-20' },
  { id: 'C-1004', category: 'Prenup', type: 'Legal Advice', title: 'Legal Advice - Asset Protection', description: 'Advice on shielding personal assets during marriage.', client: 'Daniel Lee', clientEmail: 'dan.lee@example.com', lawyer: 'Amira Hassan', lawyerFirm: 'Hassan & Partners', status: 'Open', priority: 'High', created: '2025-11-12', updated: '2025-11-12' },
  { id: 'C-1005', category: 'Postnup', type: 'Draft Amendment', title: 'Amendment to Prenup - Children Clause', description: 'Add and clarify clauses related to future children and guardianship.', client: 'Evelyn Wright', clientEmail: 'evelyn.w@example.com', lawyer: 'Lawyer 2', lawyerFirm: 'Wright & Co', status: 'Pending', priority: 'Medium', created: '2025-11-02', updated: '2025-11-08' },
  { id: 'C-1006', category: 'Contractual Update', type: 'Case Followup', title: 'Follow-up - Signed Agreement', description: 'Confirm signatures and finalise registration.', client: 'Frank Gomez', clientEmail: 'frank.g@example.com', lawyer: 'Lawyer 4', lawyerFirm: 'Gomez Legal', status: 'Closed', priority: 'Low', created: '2025-10-01', updated: '2025-10-05' },
  { id: 'C-1007', category: 'Prenup', type: 'Consultation', title: 'Initial Consultation - Prenup Options', description: 'Discuss different prenuptial structures and tax implications.', client: 'Grace Park', clientEmail: 'grace.park@example.com', lawyer: 'Sarah Lim', lawyerFirm: 'Lim & Partners', status: 'In Progress', priority: 'Medium', created: '2025-11-09', updated: '2025-11-11' },
  { id: 'C-1008', category: 'Contractual Update', type: 'Drafting', title: 'Drafting - Custom Prenup', description: 'Create a custom prenuptial agreement for high-net-worth individuals.', client: 'Henry Zhao', clientEmail: 'henry.z@example.com', lawyer: 'Amira Hassan', lawyerFirm: 'Hassan & Partners', status: 'Open', priority: 'High', created: '2025-11-14', updated: '2025-11-14' }
]

export default function CasesTable({ cases = mockCases }: { cases?: any[] }) {
  const [filter, setFilter] = useState<'All' | 'Prenup' | 'Postnup' | 'Contractual Update'>('All')
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const base = cases ?? []
    return base.filter((c: any) => {
      if (filter !== 'All' && c.category !== filter) return false
      if (!search) return true
      const q = search.toLowerCase()
      return (
        (c.title || '').toLowerCase().includes(q) ||
        (c.client || '').toLowerCase().includes(q) ||
        (c.lawyer || '').toLowerCase().includes(q) ||
        (c.id || '').toLowerCase().includes(q)
      )
    })
  }, [cases, filter, search])

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Cases Manager</h2>
            <p className="text-sm text-slate-500">Filter by category, search and manage cases</p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center bg-slate-50 rounded-md px-3 py-2 gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search case, client or lawyer" className="outline-none text-sm bg-transparent" />
            </label>
            <button className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm">New Case</button>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          {['All', 'Prenup', 'Postnup', 'Contractual Update'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t as any)}
              className={`text-sm px-3 py-1 rounded-md ${filter === t ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-700'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[1100px]">
            {/* table header */}
            <div className="grid grid-cols-[160px_360px_220px_220px_140px_120px_140px_140px_120px] bg-[#f8fafc] text-xs font-semibold text-slate-600 uppercase rounded-t-md">
              <div className="px-3 py-3 border-r">Case ID</div>
              <div className="px-3 py-3 border-r">Title & description</div>
              <div className="px-3 py-3 border-r">Client</div>
              <div className="px-3 py-3 border-r">Lawyer</div>
              <div className="px-3 py-3 border-r">Status</div>
              <div className="px-3 py-3 border-r">Priority</div>
              <div className="px-3 py-3 border-r text-center">Created</div>
              <div className="px-3 py-3 text-center">Updated</div>
              <div className="px-3 py-3 text-center">Actions</div>
            </div>

            <div className="divide-y divide-gray-100 bg-white rounded-b-md">
              {filtered.map((c: any, idx: number) => (
                <div key={c.id || idx} className="relative">
                  <div className="grid grid-cols-[160px_360px_220px_220px_140px_120px_140px_140px] items-center px-3 py-4 hover:bg-slate-50">
                    <div>
                      <div className="text-sm font-medium">{c.id}</div>
                      <div className="text-xs text-slate-400">{c.type}</div>
                    </div>

                    <div className="pr-4">
                      <div className="text-sm font-semibold truncate">{c.title}</div>
                      <div className="text-xs text-slate-400 mt-1 truncate">{c.description}</div>
                      <div className="mt-2 text-xs inline-block px-2 py-0.5 rounded-md text-slate-600 bg-slate-50">{c.category}</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded flex items-center justify-center text-white font-semibold" style={{ backgroundColor: getRandomColor(idx) }}>{getInitials(c.client)}</div>
                      <div>
                        <div className="text-sm font-medium">{c.client}</div>
                        <div className="text-xs text-slate-400">{c.clientEmail}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-sm font-medium">{getInitials(c.lawyer)}</div>
                      <div>
                        <div className="text-sm font-medium">{c.lawyer}</div>
                        <div className="text-xs text-slate-400">{c.lawyerFirm}</div>
                      </div>
                    </div>

                    <div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${statusClasses(c.status)}`}>{c.status}</span>
                    </div>

                    <div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${c.priority === 'High' ? 'bg-red-50 text-red-700' : c.priority === 'Medium' ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'}`}>{c.priority}</span>
                    </div>

                    <div className="text-center">
                      <div className="text-sm">{c.created}</div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm">{c.updated}</div>
                    </div>
                  </div>

                  {/* actions column placed outside the hoverable grid so hovering actions won't toggle row hover */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="inline-block">
                      <button
                        onClick={() => setOpenMenu(openMenu === c.id ? null : c.id)}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-md border text-sm bg-white hover:shadow-sm">
                        Actions <ChevronDown className="w-4 h-4" />
                      </button>

                      {openMenu === c.id && (
                        <div className="absolute right-0 top-full mt-2 w-40 bg-white shadow-lg rounded-md z-50 text-sm text-slate-700 pointer-events-auto">
                          <button className="w-full text-left px-3 py-2 hover:bg-slate-50">View details</button>
                          <button className="w-full text-left px-3 py-2 hover:bg-slate-50">Edit case</button>
                          <div className="border-t" />
                          <button className="w-full text-left px-3 py-2 text-red-600 hover:bg-slate-50">Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="p-6 text-center text-slate-500">No cases found for the selected filter.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
