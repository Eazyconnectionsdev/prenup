"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Axios from "@/lib/ApiConfig";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "react-toastify";

export default function LawyerProfiles() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { caseId } = useSelector((state: RootState) => state.auth);
  const [lawyersDetail, setLawyersDetail] = useState<any>({});

  const handleConnect = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();

    try {
      const { data } = await Axios.post(`/cases/${caseId}/select-lawyer`, { lawyerId: id });
    } catch (error) {
      console.error("Error while connecting to lawyer", error);
      toast.error("Failed to connect to lawyer. Please try again.");
    }
  };

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const { data } = await Axios.get(`/cases/${caseId}/lawyers`);
        setLawyersDetail(data);
      } catch (error: any) {
        console.error("ErrorWhile fetching lawyers", error);
        if (error && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message || error.message);
        }
      }
    };

    fetchLawyers();
  }, []);

  return (
    <section className="py-12 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <header className="mb-4">
          <h1 className="text-3xl font-normal text-text-color">
            Lawyer Profiles
          </h1>
          <p className="mt-2 text-[15px] font-light text-text-color">
            Please select a lawyer.
          </p>
        </header>

        <div className="mt-20">
          {/* Added vertical row space using gap-y-10 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-6">
            {lawyersDetail?.lawyers?.filter((lawyer : any) => lawyer.id !== lawyersDetail.partnerSelected)?.map((lawyer: any) => {
              const isSelected = lawyersDetail?.yourSelected === lawyer.id;

              return (
                <article
                  key={lawyer.id}
                  className={`relative bg-white border rounded-md p-6 pt-14 shadow-sm transition-shadow duration-200
                    ${
                      isSelected
                        ? "border-slate-200 bg-slate-50 opacity-70 pointer-events-none"
                        : "border-blue-200 hover:shadow-md"
                    }`}
                  aria-disabled={isSelected}
                >
                  {/* Avatar */}
                  <div
                    className={`absolute -top-10 left-1/2 transform -translate-x-1/2 ${
                      isSelected ? "filter grayscale" : ""
                    }`}
                  >
                    <div className="w-24 h-24 rounded-full bg-white p-1 shadow-sm border-4 border-white">
                      <img
                        src={lawyer.avatarUrl}
                        alt={lawyer.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <h3
                      className={`text-lg font-semibold text-slate-900 ${
                        isSelected ? "line-through" : ""
                      }`}
                    >
                      {lawyer.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2">
                      {lawyer.priceText}
                    </p>

                    <button
                      className={`mt-3 text-sm inline-block underline ${
                        isSelected ? "text-slate-400" : "text-sky-600"
                      }`}
                      onClick={(e) =>
                        !isSelected && console.log("view profile", lawyer.id)
                      }
                      aria-disabled={isSelected}
                      tabIndex={isSelected ? -1 : 0}
                    >
                      View Profile
                    </button>

                    <div className="mt-4">
                      <Button
                        onClick={(e) => handleConnect(e, lawyer.id)}
                        disabled={isSelected}
                        className={`mt-2 w-full px-4 cursor-pointer py-2 rounded-full font-medium text-base tracking-wide
                          ${
                            isSelected
                              ? "bg-slate-300 text-slate-600 pointer-events-none"
                              : "bg-gradient-to-r from-[#1E3A8A] to-[#76E0FF] text-white"
                          }`}
                        aria-pressed={isSelected}
                        aria-label={
                          isSelected
                            ? `${lawyer.name} connected`
                            : `Connect with ${lawyer.name}`
                        }
                      >
                        {isSelected ? "Connected" : "CONNECT"}
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-8 text-center text-slate-600">
            Showing {lawyersDetail?.lawyers?.length} lawyers
          </div>
        </div>
      </div>
    </section>
  );
}
