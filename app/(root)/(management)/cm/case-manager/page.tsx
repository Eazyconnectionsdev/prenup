"use client"

import React, { useMemo, useState } from "react"
import CasesTable from "@/components/admin/tables/caseManagerTable"
import Pagination from "@/components/admin/common/pagination"

const mockUsers = new Array(12).fill(0).map((_, i) => ({
  id: i + 1,
  firstName: `User${i + 1}`,
  lastName: `Last${i + 1}`,
  email: `user${i + 1}@example.com`,
}))

export default function Page() {
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 10

  const filtered = useMemo(() => {
    if (!query) return mockUsers
    return mockUsers.filter(
      (u) =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase())
    )
  }, [query])

  return (
    <div className="w-full">
      <div className="max-w-[1400px] mx-auto">
        <div className="p-4 bg-white rounded shadow-sm mb-4">
          <h1 className="text-xl font-bold">Case Manager</h1>
          <p className="text-sm text-slate-600">View and manage registered cases</p>
        </div>

        <div className="bg-white rounded shadow-sm">
          <CasesTable />
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-slate-600">{filtered.length} Results Found</div>
          <Pagination
            page={page}
            setPage={setPage}
            totalPages={Math.ceil(filtered.length / pageSize)}
          />
        </div>
      </div>
    </div>
  )
}
