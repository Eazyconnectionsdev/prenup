'use client'

import React from 'react'

export default function Pagination({ page, setPage, totalPages }: { page: number; setPage: (p: number) => void; totalPages: number }) {
  const pages = Array.from({ length: Math.max(1, totalPages) }).map((_, i) => i + 1)
  return (
    <div className="flex items-center gap-2">
      <button onClick={() => setPage(Math.max(1, page - 1))} className="px-3 py-1 border rounded">Prev</button>
      {pages.slice(0, 7).map(p => (
        <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 border rounded ${p === page ? 'bg-indigo-600 text-white' : ''}`}>{p}</button>
      ))}
      <button onClick={() => setPage(Math.min(totalPages, page + 1))} className="px-3 py-1 border rounded">Next</button>
    </div>
  )
}