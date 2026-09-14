"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, RotateCcw, Filter } from "lucide-react";
import Axios from "@/lib/ApiConfig";
import { FilterState } from "@/types/case-manager";
import { useRouter } from "next/navigation";

interface CasesMasterViewProps {
  filters: FilterState;
  onFilterChange: (
    key: keyof FilterState,
    val: string
  ) => void;
  onResetFilters: () => void;
  onSelectCase: (caseId: string) => void;
}

interface RowCase {
  id: string;
  p1: string;
  p2: string;
  cmView: string;
  owner: string;
  priority: string;
  daysInStatus: number;
}

export const CasesMasterView: React.FC<CasesMasterViewProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  onSelectCase,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [cases, setCases] = useState<RowCase[]>([]);
  const [loading, setLoading] = useState(false);

  const status = searchParams.get("status");

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);

        let response;

        if (status && status !== "ALL") {
          response = await Axios.get(
            `/case-manager/dashboard/stages/${status}/cases`
          );
        } else {
          response = await Axios.get("/case-manager/cases");
        }

        const formattedCases: RowCase[] = response.data.map(
          (item: any) => ({
            id: item._id,

            p1: item.owner
              ? `${item.owner.firstName ?? ""} ${
                  item.owner.lastName ?? ""
                }`.trim()
              : "Unknown",

            p2: item.invitedUser
              ? `${item.invitedUser.firstName ?? ""} ${
                  item.invitedUser.lastName ?? ""
                }`.trim() || item.invitedUser.email
              : "Not Invited",

            cmView: item.workflowStatus ?? "UNKNOWN",

            owner: item.assignedCaseManager
              ? `${item.assignedCaseManager.firstName ?? ""} ${
                  item.assignedCaseManager.lastName ?? ""
                }`.trim()
              : "UNASSIGNED",

            priority: item.priority ?? "MEDIUM",

            daysInStatus: 0,
          })
        );

        setCases(formattedCases);
      } catch (error) {
        console.error("Failed to fetch cases", error);
        setCases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [status]);

 const handleCaseClick = (caseId: string) => {
  console.log("Opening case:", caseId);

  router.push(`/cm/case-manager/cases/${caseId}`);
};

  if (loading) {
    return (
      <div className="p-6 text-slate-500">
        Loading cases...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1280px]">
      <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
          <Filter className="w-4 h-4" />
          <span>Cases Filters</span>
        </div>

        <button
          type="button"
          onClick={onResetFilters}
          className="bg-slate-100 border border-slate-300 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Filters
        </button>
      </div>

      <div className="bg-white border border-slate-300 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-bold text-slate-900">
            Master Cases Ledger ({cases.length}{" "}
            {cases.length === 1 ? "Matter" : "Matters"})
          </h3>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 uppercase text-[10px]">
              <th className="p-4 pl-6">Case ID</th>
              <th className="p-4">Primary User</th>
              <th className="p-4">Partner</th>
              <th className="p-4">Status</th>
              <th className="p-4">Case Manager</th>
              <th className="p-4">Priority</th>
              <th className="p-4 pr-6">Action</th>
            </tr>
          </thead>

          <tbody>
            {cases.length > 0 ? (
              cases.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => handleCaseClick(c.id)}
                  className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                >
                  <td className="p-4 pl-6 font-mono">
                    {c.id}
                  </td>

                  <td className="p-4 font-semibold">
                    {c.p1}
                  </td>

                  <td className="p-4">
                    {c.p2}
                  </td>

                  <td className="p-4">
                    <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">
                      {c.cmView}
                    </span>
                  </td>

                  <td className="p-4">
                    {c.owner}
                  </td>

                  <td className="p-4">
                    <span className="px-2 py-1 rounded bg-slate-100">
                      {c.priority}
                    </span>
                  </td>

                  <td className="p-4 pr-6">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCaseClick(c.id);
                      }}
                      className="bg-slate-100 hover:bg-slate-200 p-1.5 rounded-lg border border-slate-300"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="p-8 text-center text-slate-400"
                >
                  No cases found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};