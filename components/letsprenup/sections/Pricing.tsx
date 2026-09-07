import ComparisonTable from "./ComparisonTable";

export default function Pricing() {
  return (
    <section id="pricing" className="py-28 lg:py-40 bg-pearl">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Left: Complete Couple Pricing Card in v12 styling */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 rv">
            <div className="relative bg-midnight text-white rounded-3xl p-8 lg:p-10 border border-rose/30 shadow-2xl overflow-hidden">
              {/* Most Popular Badge */}
              <div className="absolute top-4 right-6">
                <span className="bg-rose text-white text-[11px] font-bold tracking-[0.16em] uppercase px-3.5 py-1.5 rounded-full shadow-md">
                  Most Popular
                </span>
              </div>

              <h3 className="display text-[32px] lg:text-[40px] text-white mb-2 pt-2">
                Complete Couple
              </h3>
              <p className="text-white/90 text-[15px] leading-relaxed mb-6 font-normal">
                Built for couples who want clarity, independence, and peace of mind.
              </p>

              <div className="border-b border-white/10 pb-6 mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="display text-[54px] lg:text-[64px] text-rose-glow leading-none font-normal">
                    £499
                  </span>
                  <span className="text-white/80 text-[16px] font-semibold">due today</span>
                </div>
                <p className="text-white/90 text-[14px] font-bold mt-2">
                  £999 Total cost per couple
                </p>
              </div>

              {/* Checkmark list */}
              <ul className="space-y-4 mb-8 text-[15px] text-white font-medium">
                <li className="flex items-start gap-3">
                  <span className="text-rose-glow font-extrabold text-base mt-0.5">✓</span>
                  <span>Agreement drafting and online workspace</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-glow font-extrabold text-base mt-0.5">✓</span>
                  <span>Independent lawyer for each partner</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-glow font-extrabold text-base mt-0.5">✓</span>
                  <span>Lawyers appointed from separate regulated law firms</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-glow font-extrabold text-base mt-0.5">✓</span>
                  <span>Up to 1 hour legal consultation per partner</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-glow font-extrabold text-base mt-0.5">✓</span>
                  <span>Dedicated case manager from start to signature</span>
                </li>
              </ul>

              {/* CTA Button */}
              <a
                href="#pricing"
                className="btn-fill bg-rose hover:bg-rose-deep text-white w-full py-4 rounded-full text-[13px] font-bold tracking-wider uppercase text-center inline-flex items-center justify-center gap-2 shadow-lg transition-all duration-300"
              >
                Start Your Agreement — £499 →
              </a>

              <p className="text-[12px] text-white/70 mt-4 leading-relaxed text-center font-normal">
                Independent legal advice is arranged through separate law firms and paid directly when required.
              </p>
            </div>
          </div>

          {/* Right: breakdown + comparison */}
          <div className="lg:col-span-6 lg:col-start-7">
            {/* Breakdown */}
            <div className="rv mb-20">
              <h3 className="label-sm text-slate font-semibold mb-8">
                What you're paying for
              </h3>
              <div className="space-y-0">
                <div className="flex items-baseline justify-between border-b border-linen py-6">
                  <div>
                    <p className="text-midnight font-semibold text-[16px]">
                      Platform, drafting & case management
                    </p>
                    <p className="text-slate text-[14px] font-medium mt-1">
                      Paid to LetsPrenup at signup
                    </p>
                  </div>
                  <span className="display text-[30px] text-midnight">£499</span>
                </div>
                <div className="flex items-baseline justify-between border-b border-linen py-6">
                  <div>
                    <p className="text-midnight font-semibold text-[16px]">
                      Your independent solicitor
                    </p>
                    <p className="text-slate text-[14px] font-medium mt-1">
                      Separate regulated firm, up to 1hr
                    </p>
                  </div>
                  <span className="display text-[30px] text-midnight">£250</span>
                </div>
                <div className="flex items-baseline justify-between py-6">
                  <div>
                    <p className="text-midnight font-semibold text-[16px]">
                      Partner's independent solicitor
                    </p>
                    <p className="text-slate text-[14px] font-medium mt-1">
                      Different firm entirely, up to 1hr
                    </p>
                  </div>
                  <span className="display text-[30px] text-midnight">£250</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* vs. Traditional Comparison Table (v8 content + v12 design) */}
        <ComparisonTable />
      </div>
    </section>
  );
}
