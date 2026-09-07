export default function Premise() {
  return (
    <section className="py-28 lg:py-40 bg-ivory">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left Eyebrow Column */}
          <div className="lg:col-span-4 rv">
            <p className="label-sm text-rose font-semibold mb-4">Why LetsPrenup</p>
            <div className="w-16 h-[2px] bg-rose mb-8"></div>
            <p className="text-slate text-[16px] lg:text-[17px] font-medium leading-relaxed">
              We rebuilt the prenup process from scratch because the old way was broken: too slow, too expensive, too adversarial.
            </p>
          </div>

          {/* Right Main Content Column */}
          <div className="lg:col-span-7 lg:col-start-6">
            <h2 className="rv display text-[clamp(32px,4.5vw,56px)] text-midnight mb-10 leading-[1.1]">
              A prenup isn't about distrust. It's two people choosing to be{" "}
              <span className="display-italic text-rose">deliberately honest</span> before they say yes.
            </h2>
            <div className="rv grid sm:grid-cols-2 gap-x-12 gap-y-10 mt-12">
              <div>
                <h3 className="text-[18px] lg:text-[20px] font-semibold text-midnight mb-2.5">
                  Independent by design
                </h3>
                <p className="text-slate text-[16px] leading-relaxed font-normal">
                  Each partner gets their own solicitor from a completely separate regulated firm. This is what courts require.
                </p>
              </div>
              <div>
                <h3 className="text-[18px] lg:text-[20px] font-semibold text-midnight mb-2.5">
                  No hourly surprises
                </h3>
                <p className="text-slate text-[16px] leading-relaxed font-normal">
                  £999 fixed, for both of you. Covers drafting, case management, and up to one hour of legal consultation each.
                </p>
              </div>
              <div>
                <h3 className="text-[18px] lg:text-[20px] font-semibold text-midnight mb-2.5">
                  Built for your timeline
                </h3>
                <p className="text-slate text-[16px] leading-relaxed font-normal">
                  Most couples complete in 7 to 14 days. No office visits needed. Work through it from your sofa.
                </p>
              </div>
              <div>
                <h3 className="text-[18px] lg:text-[20px] font-semibold text-midnight mb-2.5">
                  Legally sound
                </h3>
                <p className="text-slate text-[16px] leading-relaxed font-normal">
                  Full financial disclosure, independent advice, separate firms. The three things English courts look for.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
