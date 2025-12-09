"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const lawyers = [
  { id: 1, name: "Flavia Lamia", price: "£300 including VAT/VAT exempt", img: "https://i.pravatar.cc/200?img=32" },
  { id: 2, name: "Lisa Smith", price: "£300 including VAT/VAT exempt", img: "https://i.pravatar.cc/200?img=12" },
  { id: 3, name: "Karen Weiner", price: "£300 including VAT/VAT exempt", img: "https://i.pravatar.cc/200?img=56" },
  { id: 4, name: "Kye Herbert", price: "£300 including VAT/VAT exempt", img: "https://i.pravatar.cc/200?img=14" },
  { id: 5, name: "Carol Wright", price: "£300 including VAT/VAT exempt", img: "https://i.pravatar.cc/200?img=24" },
  { id: 6, name: "Corinne Parke", price: "£300 + VAT", img: "https://i.pravatar.cc/200?img=6" },
  { id: 7, name: "Richard Buxton", price: "£300 + VAT", img: "https://i.pravatar.cc/200?img=18" },
  { id: 9, name: "Bethan Hill-Howells", price: "£300 + VAT", img: "https://i.pravatar.cc/200?img=10" },
  { id: 10, name: "Helen Boynton", price: "£300 + VAT", img: "https://i.pravatar.cc/200?img=52" }
];

export default function LawyerProfiles() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleConnect = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setSelectedId(id);
  };

  return (
    <section className="py-12 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <p className="text-sm text-slate-500 uppercase text-center tracking-wider">Your agreement</p>

        {/* Heading moved slightly up */}
        <h2 className="mt-4 text-4xl text-center font-serif text-slate-900">Lawyer Profiles</h2>

        <div className="mt-10">
          {/* Added vertical row space using gap-y-10 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-6">
            {lawyers.map((lawyer) => {
              const isSelected = selectedId === lawyer.id;

              return (
                <article
                  key={lawyer.id}
                  className={`relative bg-white border rounded-md p-6 pt-14 shadow-sm transition-shadow duration-200
                    ${isSelected ? "border-slate-200 bg-slate-50 opacity-70 pointer-events-none" : "border-blue-200 hover:shadow-md"}`}
                  aria-disabled={isSelected}
                >
                  {/* Avatar */}
                  <div className={`absolute -top-10 left-1/2 transform -translate-x-1/2 ${isSelected ? "filter grayscale" : ""}`}>
                    <div className="w-24 h-24 rounded-full bg-white p-1 shadow-sm border-4 border-white">
                      <img
                        src={lawyer.img}
                        alt={lawyer.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <h3 className={`text-lg font-semibold text-slate-900 ${isSelected ? "line-through" : ""}`}>
                      {lawyer.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2">{lawyer.price}</p>

                    <button
                      className={`mt-3 text-sm inline-block underline ${isSelected ? "text-slate-400" : "text-sky-600"}`}
                      onClick={(e) => !isSelected && console.log("view profile", lawyer.id)}
                      aria-disabled={isSelected}
                      tabIndex={isSelected ? -1 : 0}
                    >
                      View Profile
                    </button>

                    <div className="mt-4">
                      <Button
                        onClick={(e) => handleConnect(e, lawyer.id)}
                        disabled={isSelected}
                        className={`mt-2 w-full px-4 py-2 rounded-full font-medium text-base tracking-wide
                          ${isSelected ? "bg-slate-300 text-slate-600 pointer-events-none" : "bg-gradient-to-r from-[#1E3A8A] to-[#76E0FF] text-white"}`}
                        aria-pressed={isSelected}
                        aria-label={isSelected ? `${lawyer.name} connected` : `Connect with ${lawyer.name}`}
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
            Showing {lawyers.length} lawyers
          </div>
        </div>
      </div>
    </section>
  );
}
