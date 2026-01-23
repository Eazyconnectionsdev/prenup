"use client";

import { useEffect, useState } from "react";
import CasesTable from "@/components/admin/tables/caseManagerTable";
import Pagination from "@/components/admin/common/pagination";
import Axios from "@/lib/ApiConfig";

export default function Page() {
  const [page, setPage] = useState(1);
  const [cases, setCases] = useState<any[]>([]);
  const [filteredCount, setFilteredCount] = useState(0);

  const pageSize = 10;

  useEffect(() => {
    async function fetchCases() {
      try {
        const { data } = await Axios.get("/cases");
        setCases(data);
      } catch (error) {
        console.log("Error while fetching cases in case manager");
      }
    }

    fetchCases();
  }, []);

  return (
    <div className="w-full">
      <div className="w-full min-w-[1000px]">
        <div className="p-4 bg-white rounded shadow-sm mb-4">
          <h1 className="text-xl font-bold">Case Manager</h1>
          <p className="text-sm text-slate-600">
            View and manage registered cases
          </p>
        </div>

        <div className="bg-white rounded shadow-sm">
          <CasesTable
            cases={cases}
            page={page}
            pageSize={pageSize}
            onFilteredCount={setFilteredCount}
          />
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-slate-600">
            {filteredCount} Results Found
          </div>

          <Pagination
            page={page}
            setPage={setPage}
            totalPages={Math.ceil(filteredCount / pageSize)}
          />
        </div>
      </div>
    </div>
  );
}
