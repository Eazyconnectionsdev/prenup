export default function Agreements() {
  return (
    <section id="agreements" className="py-28 lg:py-40 bg-ivory">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="rv mb-20 max-w-[520px]">
          <p className="label-sm text-rose font-bold mb-5">Agreements</p>
          <h2 className="display text-[clamp(32px,4.5vw,56px)] text-midnight leading-[1.1]">
            Three agreements. One platform. Your choice.
          </h2>
        </div>

        {/* Uneven: large left, stacked right */}
        <div className="grid lg:grid-cols-12 gap-px bg-pearl rounded-2xl overflow-hidden border border-pearl">
          {/* Prenuptial: large panel */}
          <div className="rv lg:col-span-7 bg-ivory p-10 lg:p-16 flex flex-col justify-between min-h-[420px] group cursor-pointer transition-colors duration-500 hover:bg-rose-mist">
            <div>
              <p className="label-sm text-rose font-bold mb-6">Most Popular</p>
              <h3 className="display text-[clamp(28px,3.5vw,44px)] text-midnight mb-4">
                Prenuptial Agreement
              </h3>
              <p className="text-slate text-[16px] lg:text-[17px] max-w-md leading-relaxed font-normal">
                For couples getting married who want clarity and protection before their wedding. This is the agreement most of our couples choose.
              </p>
            </div>
            <a
              href="#pricing"
              className="self-start mt-10 flex items-center gap-3 text-[13px] font-bold tracking-[0.14em] uppercase text-rose group-hover:text-rose-deep transition-colors"
            >
              Begin Prenup
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>

          {/* Right stack */}
          <div className="lg:col-span-5 flex flex-col gap-px">
            {/* Postnuptial */}
            <div className="rv bg-ivory p-10 lg:p-12 flex-1 group cursor-pointer transition-colors duration-500 hover:bg-rose-mist">
              <h3 className="display text-[24px] lg:text-[28px] text-midnight mb-3">
                Postnuptial Agreement
              </h3>
              <p className="text-slate text-[15px] lg:text-[16px] leading-relaxed mb-6 font-normal">
                For married couples structuring their assets and commitments. Same process, same price.
              </p>
              <a
                href="#pricing"
                className="flex items-center gap-2 text-[13px] font-bold tracking-[0.14em] uppercase text-rose group-hover:text-rose-deep transition-colors"
              >
                Begin Postnup
                <svg
                  className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </div>

            {/* Cohabitation */}
            <div className="rv bg-midnight text-white p-10 lg:p-12 flex-1 group cursor-pointer transition-colors duration-500 hover:bg-midnight-light">
              <h3 className="display text-[24px] lg:text-[28px] text-white mb-3">
                Cohabitation Agreement
              </h3>
              <p className="text-white/90 text-[15px] lg:text-[16px] leading-relaxed mb-6 font-normal">
                For unmarried couples living together or buying property. Protect what you're building.
              </p>
              <a
                href="#pricing"
                className="flex items-center gap-2 text-[13px] font-bold tracking-[0.14em] uppercase text-rose-glow group-hover:text-rose-soft transition-colors"
              >
                Begin Agreement
                <svg
                  className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
