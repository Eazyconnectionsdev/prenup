"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import Axios from "@/lib/ApiConfig";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

function getInitials(name = "") {
  const parts = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "");
  return parts.join("") || "–";
}

function getRandomColorFromString(key = "", paletteIndex = 0) {
  const palette = [
    "#6ee7b7",
    "#60a5fa",
    "#fca5a5",
    "#fde68a",
    "#c7d2fe",
    "#cfe8ff",
  ];
  if (!key) return palette[paletteIndex % palette.length];
  // simple hash to pick a color deterministically
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h << 5) - h + key.charCodeAt(i);
  const idx = Math.abs(h) % palette.length;
  return palette[idx];
}

function statusClasses(status: string) {
  switch (status?.toLowerCase()) {
    case "open":
      return "bg-amber-50 text-amber-700";
    case "in progress":
    case "active":
      return "bg-indigo-50 text-indigo-700";
    case "closed":
      return "bg-green-50 text-green-700";
    case "pending":
      return "bg-yellow-50 text-yellow-800";
    case "rejected":
      return "bg-red-50 text-red-700";
    default:
      return "bg-slate-50 text-slate-700";
  }
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
  } catch (e) {
    return "-";
  }
}

function deriveStatusFromPayload(c: any) {
  // c.status is an object with step1..stepN submitted flags in your payload example
  const s = c.status;
  if (!s || typeof s !== "object") return c.status || "Open";
  const steps = Object.keys(s).filter((k) => k.startsWith("step"));
  if (steps.length === 0) return "Open";
  const submittedCount = steps.reduce(
    (acc, step) => acc + (s[step]?.submitted ? 1 : 0),
    0
  );
  if (submittedCount === 0) return "Open";
  if (submittedCount < steps.length) return "In Progress";
  return "Closed";
}

export default function CasesTable({
  cases,
  page,
  pageSize,
  onFilteredCount,
}: {
  cases: any[];
  page: number;
  pageSize: number;
  onFilteredCount?: (n: number) => void;
}) {
  const [filter, setFilter] = useState<"All" | "Prenup" | "Postnup" | "Contractual Update">("All");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [search, setSearch] = useState("");


  const handleUnclock = async (id : string) => {
    try{
      await Axios.post(`/cases/${id}/unlock`)
    }catch(error : any){
      console.log("Erorr in unlocking the case")
    }
  }

const normalized = useMemo(() => {
  return (cases || []).map((c: any, idx: number) => {
    const id = c.id || c._id || String(idx);

    const client =
      c.client ||
      [c.step1?.firstName, c.step1?.middleNames, c.step1?.lastName]
        .filter(Boolean)
        .join(" ") ||
      "Unknown";

    return {
      raw: c,
      id,
      title: c.title || "Untitled case",
      description: c.description || c.step1?.overviewAim || "",
      client,
      clientEmail:
        c.clientEmail ||
        c.invitedEmail ||
        c.inviteCredentials?.email ||
        "",
      lawyer:
        c.lawyer ||
        c.selectedLawyer ||
        c.preQuestionnaireUser1?.selectedLawyer ||
        "",
      lawyerFirm: c.lawyerFirm || "",
      status:
        typeof c.status === "string"
          ? c.status
          : deriveStatusFromPayload(c),
      priority: c.priority || "Medium",
      created: formatDate(c.createdAt),
      updated: formatDate(c.updatedAt),
      colorKey: id,
    };
  });
}, [cases]);

const filtered = useMemo(() => {
  return normalized.filter((c : any) => {
    if (filter !== "All" && c.category !== filter) return false;
    if (!search) return true;

    const q = search.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.client.toLowerCase().includes(q) ||
      c.lawyer.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    );
  });
}, [normalized, filter, search]);

const paginated = useMemo(() => {
  const start = (page - 1) * pageSize;
  return filtered.slice(start, start + pageSize);
}, [filtered, page, pageSize]);

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
            {[
              "Case ID",
              "Title",
              "Client",
              "Lawyer",
              "Status",
              "Priority",
              "Created",
              "Updated",
              "Actions",
            ].map((h) => (
              <div key={h} className="px-3 py-3">
                {h}
              </div>
            ))}
          </div>

          <div className="divide-y">
            {paginated?.map((c: any, idx: any) => (
              <div key={c.id} className="relative">
                <div className="grid grid-cols-[160px_360px_220px_220px_140px_120px_140px_140px_120px] items-center px-3 py-4">
                  <div>
                    <div className="font-medium">{idx}</div>
                    <div className="text-xs text-slate-400">
                      {c.raw.type || ""}
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold truncate">{c.title}</div>
                    <div className="text-xs text-slate-400 truncate">
                      {c.description}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div
                      className="w-9 h-9 rounded flex items-center justify-center text-white font-semibold"
                      style={{
                        backgroundColor: getRandomColorFromString(c.colorKey),
                      }}
                    >
                      {getInitials(c.client)}
                    </div>
                    <div>
                      <div>{c.client}</div>
                      <div className="text-xs text-slate-400">
                        {c.clientEmail}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div>{c.lawyer || "-"}</div>
                    <div className="text-xs text-slate-400">
                      {c.lawyerFirm || ""}
                    </div>
                  </div>

                  <div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${statusClasses(
                        c.status
                      )}`}
                    >
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
                      onClick={() =>
                        setOpenMenu(openMenu === c.id ? null : c.id)
                      }
                      className="px-3 py-1 border rounded-md text-sm bg-white hover:bg-slate-50"
                    >
                      Actions <ChevronDown className="inline w-4 h-4 ml-1" />
                    </button>

                    {openMenu === c.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md z-50">
                        <button className="block w-full px-3 py-2 text-left hover:bg-slate-50">
                          View details
                        </button>
                        <button onClick={() => handleUnclock(c.id)} className="block w-full px-3 py-2 text-left hover:bg-slate-50">
                          Unlock case
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
              <div className="p-6 text-center text-slate-500">
                No cases found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
