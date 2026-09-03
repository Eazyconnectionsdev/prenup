"use client";

import { useState } from "react";
import { testimonials } from "@/data/letsprenup/testimonials";

export default function Testimonials() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section className="bg-midnight text-white py-28 lg:py-40">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="rv mb-6">
          <p className="label-sm text-rose-glow font-semibold mb-5">What Couples Say</p>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activeIdx * 100}%)` }}
          >
            {testimonials.map((q, i) => (
              <div key={i} className="w-full flex-shrink-0">
                <div className="grid lg:grid-cols-12 gap-8 items-end py-12">
                  <div className="lg:col-span-9">
                    <blockquote className="display-italic text-[clamp(28px,4.5vw,56px)] text-white leading-[1.15]">
                      {q.quote}
                    </blockquote>
                  </div>
                  <div className="lg:col-span-2 lg:col-start-11 lg:text-right">
                    <p className="text-white text-[16px] font-bold">{q.names}</p>
                    <p className="text-rose-glow text-[14px] font-semibold">{q.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex items-center gap-3 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`w-8 h-1 rounded-full transition-all ${
                  activeIdx === i ? "bg-rose" : "bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
