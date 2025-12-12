"use client"

import React from 'react'
import { MoreHorizontal, Search } from 'lucide-react'

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
  {
    id: 'C-1001',
    type: 'Prenup',
    title: 'Prenuptial Agreement Draft',
    description: 'Drafting prenuptial agreement covering assets, liabilities and future inheritance.',
    client: 'Alice Johnson',
    clientEmail: 'alice.johnson@example.com',
    lawyer: 'Sarah Lim',
    lawyerFirm: 'Lim & Partners',
    status: 'Open',
    priority: 'High',
    created: '2025-11-01',
    updated: '2025-11-05'
  },
  {
    id: 'C-1002',
    type: 'Mediation',
    title: 'Dispute Mediation - Property',
    description: 'Mediation for property division between spouses.',
    client: 'Benjamin Tan',
    clientEmail: 'ben.tan@example.com',
    lawyer: 'David Ong',
    lawyerFirm: 'Ong & Co',
    status: 'In Progress',
    priority: 'Medium',
    created: '2025-10-20',
    updated: '2025-11-10'
  },
  {
    id: 'C-1003',
    type: 'Contract Review',
    title: 'Review of Cohabitation Agreement',
    description: 'Review terms and suggest amendments for cohabitation agreement.',
    client: 'Clara Smith',
    clientEmail: 'clara.smith@example.com',
    lawyer: 'Lawyer 3',
    lawyerFirm: 'Smith Legal',
    status: 'Closed',
    priority: 'Low',
    created: '2025-09-15',
    updated: '2025-09-20'
  },
  {
    id: 'C-1004',
    type: 'Legal Advice',
    title: 'Legal Advice - Asset Protection',
    description: 'Advice on shielding personal assets during marriage.',
    client: 'Daniel Lee',
    clientEmail: 'dan.lee@example.com',
    lawyer: 'Amira Hassan',
    lawyerFirm: 'Hassan & Partners',
    status: 'Open',
    priority: 'High',
    created: '2025-11-12',
    updated: '2025-11-12'
  },
  {
    id: 'C-1005',
    type: 'Draft Amendment',
    title: 'Amendment to Prenup - Children Clause',
    description: 'Add and clarify clauses related to future children and guardianship.',
    client: 'Evelyn Wright',
    clientEmail: 'evelyn.w@example.com',
    lawyer: 'Lawyer 2',
    lawyerFirm: 'Wright & Co',
    status: 'Pending',
    priority: 'Medium',
    created: '2025-11-02',
    updated: '2025-11-08'
  },
  {
    id: 'C-1006',
    type: 'Case Followup',
    title: 'Follow-up - Signed Agreement',
    description: 'Confirm signatures and finalise registration.',
    client: 'Frank Gomez',
    clientEmail: 'frank.g@example.com',
    lawyer: 'Lawyer 4',
    lawyerFirm: 'Gomez Legal',
    status: 'Closed',
    priority: 'Low',
    created: '2025-10-01',
    updated: '2025-10-05'
  },
  {
    id: 'C-1007',
    type: 'Consultation',
    title: 'Initial Consultation - Prenup Options',
    description: 'Discuss different prenuptial structures and tax implications.',
    client: 'Grace Park',
    clientEmail: 'grace.park@example.com',
    lawyer: 'Sarah Lim',
    lawyerFirm: 'Lim & Partners',
    status: 'In Progress',
    priority: 'Medium',
    created: '2025-11-09',
    updated: '2025-11-11'
  },
  {
    id: 'C-1008',
    type: 'Drafting',
    title: 'Drafting - Custom Prenup',
    description: 'Create a custom prenuptial agreement for high-net-worth individuals.',
    client: 'Henry Zhao',
    clientEmail: 'henry.z@example.com',
    lawyer: 'Amira Hassan',
    lawyerFirm: 'Hassan & Partners',
    status: 'Open',
    priority: 'High',
    created: '2025-11-14',
    updated: '2025-11-14'
  }
]

export default function CasesTable({ cases = mockCases }: { cases?: any[] }) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-full">
        {/* header / toolbar */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="text-lg font-semibold">Cases</div>
            <div className="text-sm text-slate-500">Manage and review case activity</div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center bg-white rounded shadow px-3 py-2 gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input placeholder="Search case, client or lawyer" className="outline-none text-sm" />
            </label>

            <button className="bg-indigo-600 text-white px-3 py-2 rounded text-sm">New Case</button>
          </div>
        </div>

        {/* table header */}
        <div className="flex bg-[#f0f4ff] min-h-12 text-xs font-semibold text-[#4b5c76] uppercase">
          <div className="min-w-[120px] px-3 py-3 border-r">Case ID</div>
          <div className="min-w-[260px] px-3 py-3 border-r">Title</div>
          <div className="min-w-[180px] px-3 py-3 border-r">Client</div>
          <div className="min-w-[180px] px-3 py-3 border-r">Lawyer</div>
          <div className="min-w-[120px] px-3 py-3 border-r">Status</div>
          <div className="min-w-[110px] px-3 py-3 border-r">Priority</div>
          <div className="min-w-[140px] px-3 py-3 border-r text-center">Created</div>
          <div className="min-w-[140px] px-3 py-3 text-center">Updated</div>
          <div className="min-w-[100px] px-3 py-3 text-center">Actions</div>
        </div>

        <div className="divide-y divide-gray-200">
          {cases.map((c: any, idx: number) => (
            <div className="flex items-center hover:bg-[#fafafa]" key={c.id || idx}>
              <div className="min-w-[120px] px-3 py-3">
                <div className="font-medium">{c.id || `C-${1000 + idx}`}</div>
                <div className="text-xs text-slate-400">{c.type || 'Prenup'}</div>
              </div>

              <div className="min-w-[260px] px-3 py-3">
                <div className="font-medium truncate max-w-[220px]">{c.title || 'Untitled case'}</div>
                <div className="text-xs text-slate-400">{c.description ? `${c.description.substring(0, 80)}${c.description.length > 80 ? '...' : ''}` : ''}</div>
              </div>

              <div className="min-w-[180px] px-3 py-3 flex items-center gap-3">
                <div className="w-[36px] h-[36px] rounded flex items-center justify-center text-white font-semibold" style={{ backgroundColor: getRandomColor(idx) }}>{getInitials(c.client || c.clientName || 'Client')}</div>
                <div>
                  <div className="text-sm font-medium">{c.client || c.clientName || '—'}</div>
                  <div className="text-xs text-slate-400">{c.clientEmail || ''}</div>
                </div>
              </div>

              <div className="min-w-[180px] px-3 py-3 flex items-center gap-3">
                <div className="w-[36px] h-[36px] rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-sm font-medium">{getInitials(c.lawyer || 'Lawyer')}</div>
                <div>
                  <div className="text-sm font-medium">{c.lawyer || 'Unassigned'}</div>
                  <div className="text-xs text-slate-400">{c.lawyerFirm || ''}</div>
                </div>
              </div>

              <div className="min-w-[120px] px-3 py-3">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${statusClasses(c.status)}`}>{c.status || 'Open'}</span>
              </div>

              <div className="min-w-[110px] px-3 py-3">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${c.priority === 'High' ? 'bg-red-50 text-red-700' : c.priority === 'Medium' ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'}`}>{c.priority || 'Medium'}</span>
              </div>

              <div className="min-w-[140px] px-3 py-3 text-center">
                <div className="text-sm">{c.createdAt || c.created || '—'}</div>
              </div>

              <div className="min-w-[140px] px-3 py-3 text-center">
                <div className="text-sm">{c.updatedAt || c.updated || '—'}</div>
              </div>

              <div className="min-w-[100px] px-3 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button className="text-xs text-slate-600 hover:text-slate-900">View</button>
                  <button className="text-xs text-indigo-600 font-semibold">Manage</button>
                  <button className="text-slate-400 hover:text-slate-700"><MoreHorizontal className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}

          {cases.length === 0 && (
            <div className="p-6 text-center text-slate-500">No cases found</div>
          )}
        </div>
      </div>
    </div>
  )
}
