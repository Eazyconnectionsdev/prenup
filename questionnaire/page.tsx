"use client";

import React, { useState } from "react";
import SepratePropertyModal from "@/components/modals/questionnaries/SepratePropertyModal";
import { Button } from "@/components/ui/button";
import IncomeModal from "@/components/modals/questionnaries/IncomeModal";
import SavingsModal from "@/components/modals/questionnaries/SavingsModal";
import PensionModal from "@/components/modals/questionnaries/PensionModal";

const questions = [
  {
    id: "earnings",
    text: "Do you have any earnings you'd like to keep separate from your partner?",
  },
  {
    id: "properties",
    text: "Do you have any properties you'd like to keep separate from your partner?",
  },
  {
    id: "savings",
    text: "Do you have any savings you'd like to keep separate from your partner?",
  },
  {
    id: "pensions",
    text: "Do you have any pensions you'd like to keep separate from your partner?",
  },
  {
    id: "debts",
    text: "Do you have any debts you'd like to keep separate from your partner?",
  },
];

const Questionnaries = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const closeModal = () => setActiveModal(null);

  return (
    <div className="max-w-5xl mx-auto pl-16 py-2 pr-26">
      <div className="space-y-2">
        <h1 className="text-3xl font-normal text-text-color">
          Your separate assets
        </h1>
        <p className="text-[15px] font-light text-text-color">
          Please fill in each of the sections below to complete your agreement.
          Any assets listed on this page will be treated as a separate asset in
          the event of a divorce, including any increase of value of those
          assets.
        </p>
      </div>

      <div className="space-y-10 bg-gradient-to-br from-secondary to-primary-foreground text-white py-10 px-6 rounded-lg my-10">
        {questions.map((q) => (
          <div key={q.id} className="flex flex-col items-center text-center">
            <span className="text-base font-normal text-text-color max-w-md">
              {q.text}
            </span>

            <div className="flex gap-3 mt-4">
              <Button
                onClick={() => setActiveModal(q.id)}
                className="bg-white  text-text-color px-14 shadow-md hover:bg-white py-1.5 rounded-full font-medium cursor-pointer"
              >
                Yes
              </Button>

              <button className="bg-primary text-white px-14 shadow-md py-1.5 rounded-full font-medium cursor-pointer">
                No
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Modals rendered conditionally */}

      {activeModal === "earnings" && (
        <IncomeModal open={true} onClose={closeModal} />
      )}

      {activeModal === "properties" && (
        <SepratePropertyModal open={true} onClose={closeModal} />
      )}

      {activeModal === "savings" && (
        <SavingsModal open={true} onClose={closeModal} />
      )}

      {activeModal === "pensions" && (
      <PensionModal open={true} onClose={closeModal} />
      )}

      {activeModal === "debts" && (
        <div>{/* Your Debts Modal Component Here */}</div>
      )}
    </div>
  );
};

export default Questionnaries;
