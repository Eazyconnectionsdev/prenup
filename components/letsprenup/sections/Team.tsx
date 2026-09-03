export default function Team() {
  return (
    <section className="py-28 lg:py-40 bg-ivory overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="rv mb-16 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6">
            <p className="label-sm text-rose font-semibold mb-5">Your Team</p>
            <h2 className="display text-[clamp(32px,4.5vw,56px)] text-midnight leading-[1.1]">
              Three professionals. One goal: protect both of you.
            </h2>
          </div>
        </div>

        <div className="rv lg:flex lg:gap-px lg:bg-pearl">
          <div className="bg-ivory p-10 lg:p-14 lg:flex-1 border-b lg:border-b-0 border-pearl">
            <p className="label-sm text-slate font-semibold mb-5">Operations</p>
            <h3 className="display text-[28px] text-midnight mb-4">Case Manager</h3>
            <p className="text-slate text-[15px] lg:text-[16px] leading-relaxed mb-8 font-normal">
              Your single point of contact. Keeps the timeline on track, verifies disclosures, coordinates between both law firms.
            </p>
            <p className="text-slate text-[13px] font-semibold border-t border-pearl pt-4">
              Assigned at signup
            </p>
          </div>

          <div className="bg-ivory p-10 lg:p-14 lg:flex-1 border-b lg:border-b-0 border-pearl">
            <p className="label-sm text-rose font-semibold mb-5">Independent Solicitor</p>
            <h3 className="display text-[28px] text-midnight mb-4">Your Lawyer</h3>
            <p className="text-slate text-[15px] lg:text-[16px] leading-relaxed mb-8 font-normal">
              Reviews the agreement exclusively from your perspective. Protects your interests. Gives you independent, confidential advice.
            </p>
            <p className="text-slate text-[13px] font-semibold border-t border-pearl pt-4">
              SRA or BSB regulated
            </p>
          </div>

          <div className="bg-ivory p-10 lg:p-14 lg:flex-1">
            <p className="label-sm text-rose font-semibold mb-5">Independent Solicitor</p>
            <h3 className="display text-[28px] text-midnight mb-4">Partner's Lawyer</h3>
            <p className="text-slate text-[15px] lg:text-[16px] leading-relaxed mb-8 font-normal">
              From a completely different firm. Protects their interests independently. This separation is what courts need to see.
            </p>
            <p className="text-slate text-[13px] font-semibold border-t border-pearl pt-4">
              Separate firm guaranteed
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
