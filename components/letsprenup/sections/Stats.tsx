"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Stats() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const counterEls = document.querySelectorAll<HTMLElement>("[data-count]");

    counterEls.forEach((el) => {
      const target = parseInt(el.dataset.count || "0", 10);
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";

      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        toggleActions: "play reverse play reverse",
        onEnter: () => {
          gsap.fromTo(
            { val: 0 },
            { val: 0 },
            {
              val: target,
              duration: 2,
              ease: "power2.out",
              onUpdate: function () {
                el.textContent =
                  prefix + Math.round(this.targets()[0].val) + suffix;
              },
            }
          );
        },
        onEnterBack: () => {
          gsap.fromTo(
            { val: 0 },
            { val: 0 },
            {
              val: target,
              duration: 2,
              ease: "power2.out",
              onUpdate: function () {
                el.textContent =
                  prefix + Math.round(this.targets()[0].val) + suffix;
              },
            }
          );
        },
      });
    });
  }, []);

  return (
    <section className="py-20 lg:py-24 bg-ivory border-b border-pearl">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-pearl">
          <div className="rv text-center lg:px-8">
            <div
              className="stat-num text-[clamp(40px,5vw,64px)] text-midnight leading-none font-normal"
              data-count="999"
              data-prefix="£"
            >
              £0
            </div>
            <p className="text-mist text-[13px] font-medium mt-2">
              Fixed total fee
            </p>
          </div>
          <div className="rv text-center lg:px-8">
            <div
              className="stat-num text-[clamp(40px,5vw,64px)] text-midnight leading-none font-normal"
              data-count="9"
              data-suffix=" days"
            >
              0 days
            </div>
            <p className="text-mist text-[13px] font-medium mt-2">
              Average completion
            </p>
          </div>
          <div className="rv text-center lg:px-8">
            <div
              className="stat-num text-[clamp(40px,5vw,64px)] text-midnight leading-none font-normal"
              data-count="2"
            >
              0
            </div>
            <p className="text-mist text-[13px] font-medium mt-2">
              Independent law firms
            </p>
          </div>
          <div className="rv text-center lg:px-8">
            <div
              className="stat-num text-[clamp(40px,5vw,64px)] text-midnight leading-none font-normal"
              data-count="100"
              data-suffix="%"
            >
              0%
            </div>
            <p className="text-mist text-[13px] font-medium mt-2">
              Online process
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
