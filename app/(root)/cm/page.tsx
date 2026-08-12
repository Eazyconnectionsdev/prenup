"use client";

import React, { useMemo, useState } from "react";
import {
  Users,
  FileText,
  Briefcase,
  BarChart2,
  TrendingUp,
  Calendar,
  Search,
  MoreHorizontal,
} from "lucide-react";

export default function AdminDashboard() {
  const [query, setQuery] = useState("");
  const [range, setRange] = useState<"7d" | "30d" | "90d">("30d");

  // mock analytics
  const stats = useMemo(
    () => ({
      totalCases: 128,
      openCases: 34,
      closedCases: 90,
      activeLawyers: 24,
      newRegistrations: 12,
      avgResolutionDays: 6,
    }),
    []
  );

  // small sparklines data
  const sparkCases = [3, 5, 8, 6, 7, 9, 8, 10, 9, 12, 11, 10];
  const sparkLawyers = [1, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 6];

  const recentCases = new Array(6).fill(0).map((_, i) => ({
    id: `C-${200 + i}`,
    title: [
      "Prenup Draft",
      "Mediation",
      "Contract Review",
      "Legal Advice",
      "Draft Amendment",
      "Case Followup",
    ][i % 6],
    client: `Client ${i + 1}`,
    lawyer: `Lawyer ${(i % 4) + 1}`,
    status: i % 3 === 0 ? "Open" : i % 3 === 1 ? "In Progress" : "Closed",
    updated: `${i + 1}d ago`,
  }));

  const topLawyers = new Array(4).fill(0).map((_, i) => ({
    id: `L-${100 + i}`,
    name: `Lawyer ${i + 1}`,
    cases: Math.floor(Math.random() * 20) + 5,
    rating: (4 + Math.round(Math.random() * 10) / 10).toFixed(1),
  }));

  const filteredCases = recentCases.filter((c) =>
    (c.title + c.client + c.lawyer).toLowerCase().includes(query.toLowerCase())
  );

  function Sparkline({ data }: { data: number[] }) {
    const max = Math.max(...data);
    const points = data
      .map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d / max) * 90}`)
      .join(" ");
    return (
      <svg viewBox="0 0 100 100" className="w-full h-10">
        <polyline
          fill="none"
          strokeWidth={2}
          stroke="currentColor"
          points={points}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-[1400px] mx-auto">
        <header className="flex items-start justify-between gap-6 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold">CM Dashboard</h1>
            <p className="text-sm text-slate-600">
              Overview of cases, lawyers and recent activity — helloprenup.com
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white rounded-lg shadow px-3 py-2 gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search cases or lawyer"
                className="outline-none text-sm"
              />
            </div>

            <div className="flex items-center gap-2 bg-white shadow rounded-lg px-3 py-2 text-sm">
              <Calendar className="w-4 h-4 text-slate-500" />
              <select
                value={range}
                onChange={(e) => setRange(e.target.value as any)}
                className="bg-transparent outline-none"
              >
                <option value="7d">7d</option>
                <option value="30d">30d</option>
                <option value="90d">90d</option>
              </select>
            </div>
          </div>
        </header>

        {/* stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card
            icon={<FileText className="w-5 h-5" />}
            label="Total Cases"
            value={stats.totalCases}
          />
          <Card
            icon={<Briefcase className="w-5 h-5" />}
            label="Open Cases"
            value={stats.openCases}
            accent="amber"
          />
          <Card
            icon={<Users className="w-5 h-5" />}
            label="Active Lawyers"
            value={stats.activeLawyers}
            accent="teal"
          />
          <Card
            icon={<TrendingUp className="w-5 h-5" />}
            label="Avg Resolution (days)"
            value={stats.avgResolutionDays}
            accent="indigo"
          />
        </section>

        {/* charts & top lists */}
      

       
      </div>
    </div>
  );
}

function Card({
  icon,
  label,
  value,
  accent = "slate",
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-start gap-4">
      <div
        className={`p-2 rounded-md bg-${accent}-50 text-${accent}-600` as any}
      >
        {icon}
      </div>
      <div>
        <div className="text-sm text-slate-500">{label}</div>
        <div className="text-xl font-semibold">{value}</div>
      </div>
    </div>
  );
}
