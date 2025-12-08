import SepratePropertyModal from "@/components/modals/questionnaries/SepratePropertyModal";
import { Button } from "@/components/ui/button";
import React from "react";

const questions = [
  "Do you have any earnings you'd like to keep separate from your partner?",
  "Do you have any properties you'd like to keep separate from your partner?",
  "Do you have any savings you'd like to keep separate from your partner?",
  "Do you have any pensions you'd like to keep separate from your partner?",
  "Do you have any debts you'd like to keep separate from your partner?",
];

const Questionnaries = () => {
  return (
    // <section className="bg-gradient-to-br from-secondary to-primary-foreground text-white py-10 px-6 rounded-lg max-w-5xl mx-auto">
    <div className="max-w-5xl pl-16 py-2 pr-26 ">
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

      {/* Questions */}

      <div className="space-y-10 bg-gradient-to-br from-secondary to-primary-foreground text-white py-10 px-6 rounded-lg my-10">
        {questions.map((q, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            <span className="text-base font-normal text-text-color max-w-md">{q}</span>

            <div className="flex gap-3 mt-4">
              {/* <button className="bg-primary text-white px-14 py-1.5 rounded-full font-medium cursor-pointer">
                Yes
              </button> */}
              <SepratePropertyModal>
                <Button className="bg-transparent text-navy-deep font-semibold hover:bg-transparent cursor-pointer">
                  Yes
                </Button>
              </SepratePropertyModal>
              <button className="bg-primary text-white px-14 py-1.5 rounded-full font-medium cursor-pointer">
                No
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Questionnaries;
