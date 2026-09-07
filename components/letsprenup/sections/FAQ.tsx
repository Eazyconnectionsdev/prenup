"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { faqs } from "@/data/letsprenup/faq";

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-28 lg:py-40 bg-ivory">
      <div className="max-w-[900px] mx-auto px-6 lg:px-16">
        <div className="rv mb-16">
          <p className="label-sm text-rose font-semibold mb-5">FAQ</p>
          <h2 className="display text-[clamp(32px,4.5vw,52px)] text-midnight">
            Common questions.
          </h2>
        </div>

        <div className="space-y-0">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`faq-row border-t border-pearl py-7 ${
                idx === faqs.length - 1 ? "border-b" : ""
              }`}
            >
              <div
                onClick={() => toggle(idx)}
                className="flex items-start justify-between gap-6 cursor-pointer group"
              >
                <h3 className="text-[18px] lg:text-[20px] font-semibold text-midnight group-hover:text-rose transition-colors">
                  {faq.q}
                </h3>
                <span className="text-rose flex-shrink-0 mt-1">
                  {openIdx === idx ? (
                    <Minus className="w-5 h-5" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                </span>
              </div>
              {openIdx === idx && (
                <div className="mt-3 pt-1">
                  <p className="text-slate text-[15px] lg:text-[16px] leading-relaxed font-normal">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
