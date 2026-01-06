"use client"

import React, { useMemo, useState } from "react"
import { Search, ChevronDown } from "lucide-react"

function getInitials(name = "") {
  const parts = name.split(" ")
  return (parts[0]?.[0] || "") + (parts[1]?.[0] || "")
}

function getRandomColor(index = 0) {
  const palette = ["#6ee7b7", "#60a5fa", "#fca5a5", "#fde68a", "#c7d2fe", "#cfe8ff"]
  return palette[index % palette.length]
}

function statusClasses(status: string) {
  switch (status?.toLowerCase()) {
    case "open":
      return "bg-amber-50 text-amber-700"
    case "in progress":
    case "active":
      return "bg-indigo-50 text-indigo-700"
    case "closed":
      return "bg-green-50 text-green-700"
    case "pending":
      return "bg-yellow-50 text-yellow-800"
    case "rejected":
      return "bg-red-50 text-red-700"
    default:
      return "bg-slate-50 text-slate-700"
  }
}

const mockCases = [
  {
    id: "C-1001",
    category: "Prenup",
    type: "Prenup",
    title: "Prenuptial Agreement Draft",
    description: "Drafting prenuptial agreement covering assets.",
    client: "Alice Johnson",
    clientEmail: "alice.johnson@example.com",
    lawyer: "Sarah Lim",
    lawyerFirm: "Lim & Partners",
    status: "Open",
    priority: "High",
    created: "2025-11-01",
    updated: "2025-11-05",
  },
  {
    id: "C-1002",
    category: "Postnup",
    type: "Mediation",
    title: "Dispute Mediation - Property",
    description: "Mediation for property division.",
    client: "Benjamin Tan",
    clientEmail: "ben.tan@example.com",
    lawyer: "David Ong",
    lawyerFirm: "Ong & Co",
    status: "In Progress",
    priority: "Medium",
    created: "2025-10-20",
    updated: "2025-11-10",
  },
]

export default function CasesTable({ cases = mockCases }: { cases?: any[] }) {
  const [filter, setFilter] = useState<"All" | "Prenup" | "Postnup" | "Contractual Update">("All")
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    return cases.filter((c) => {
      if (filter !== "All" && c.category !== filter) return false
      if (!search) return true
      const q = search.toLowerCase()
      return (
        c.title?.toLowerCase().includes(q) ||
        c.client?.toLowerCase().includes(q) ||
        c.lawyer?.toLowerCase().includes(q) ||
        c.id?.toLowerCase().includes(q)
      )
    })
  }, [cases, filter, search])

  return (
    <div className="w-full bg-white rounded-lg shadow p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Cases Manager</h2>
          <p className="text-sm text-slate-500">Search and manage cases</p>
        </div>

        <div className="flex gap-3">
          <label className="flex items-center bg-slate-50 rounded-md px-3 py-2 gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search case, client or lawyer"
              className="bg-transparent outline-none text-sm"
            />
          </label>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        {["All", "Prenup", "Postnup", "Contractual Update"].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t as any)}
            className={`text-sm px-3 py-1 rounded-md ${
              filter === t ? "bg-indigo-600 text-white" : "bg-slate-100"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[1100px]">
          <div className="grid grid-cols-[160px_360px_220px_220px_140px_120px_140px_140px_120px] bg-slate-50 text-xs font-semibold uppercase text-slate-600">
            {["Case ID", "Title", "Client", "Lawyer", "Status", "Priority", "Created", "Updated", "Actions"].map(
              (h) => (
                <div key={h} className="px-3 py-3">
                  {h}
                </div>
              )
            )}
          </div>

          <div className="divide-y">
            {filtered.map((c, idx) => (
              <div key={c.id} className="relative">
                {/* ROW — NO HOVER EFFECT */}
                <div className="grid grid-cols-[160px_360px_220px_220px_140px_120px_140px_140px_120px] items-center px-3 py-4">
                  <div>
                    <div className="font-medium">{c.id}</div>
                    <div className="text-xs text-slate-400">{c.type}</div>
                  </div>

                  <div>
                    <div className="font-semibold truncate">{c.title}</div>
                    <div className="text-xs text-slate-400 truncate">{c.description}</div>
                  </div>

                  <div className="flex gap-3">
                    <div
                      className="w-9 h-9 rounded flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: getRandomColor(idx) }}
                    >
                      {getInitials(c.client)}
                    </div>
                    <div>
                      <div>{c.client}</div>
                      <div className="text-xs text-slate-400">{c.clientEmail}</div>
                    </div>
                  </div>

                  <div>
                    <div>{c.lawyer}</div>
                    <div className="text-xs text-slate-400">{c.lawyerFirm}</div>
                  </div>

                  <div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${statusClasses(c.status)}`}>
                      {c.status}
                    </span>
                  </div>

                  <div>
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-slate-100">
                      {c.priority}
                    </span>
                  </div>

                  <div className="text-center">{c.created}</div>
                  <div className="text-center">{c.updated}</div>

                  {/* Actions */}
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === c.id ? null : c.id)}
                      className="px-3 py-1 border rounded-md text-sm bg-white hover:bg-slate-50"
                    >
                      Actions <ChevronDown className="inline w-4 h-4 ml-1" />
                    </button>

                    {openMenu === c.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md z-50">
                        <button className="block w-full px-3 py-2 text-left hover:bg-slate-50">
                          View details
                        </button>
                        <button className="block w-full px-3 py-2 text-left hover:bg-slate-50">
                          Edit case
                        </button>
                        <div className="border-t" />
                        <button className="block w-full px-3 py-2 text-left text-red-600 hover:bg-slate-50">
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="p-6 text-center text-slate-500">No cases found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
