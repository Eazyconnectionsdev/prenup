export default function Process() {
  const steps = [
    {
      num: "1",
      title: "Choose & Invite",
      desc: "Pick your agreement type. Send your partner a secure invite. The entire setup takes under three minutes. No payment, no commitment yet.",
    },
    {
      num: "2",
      title: "Share Your Details",
      desc: "Guided questionnaires walk you through financial disclosure. No spreadsheets, no jargon. Both partners complete independently.",
    },
    {
      num: "3",
      title: "Independent Legal Advice",
      desc: "Each partner is matched with their own solicitor from a separate regulated firm. Up to one hour consultation included. This is what makes it enforceable.",
    },
    {
      num: "4",
      title: "Sign & Complete",
      desc: "Review your final agreement together. Sign digitally. Download the completed document. Your agreement, done properly.",
    },
  ];

  return (
    <section id="process" className="bg-midnight text-white py-28 lg:py-40">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="rv grid lg:grid-cols-12 gap-8 mb-24">
          <div className="lg:col-span-6">
            <p className="label-sm text-rose-glow font-semibold mb-5">Process</p>
            <h2 className="display text-[clamp(34px,4.8vw,60px)] text-white">
              Four conversations.
              <br />
              One signed agreement.
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 flex items-end">
            <p className="text-white/90 text-[18px] lg:text-[20px] font-medium leading-relaxed">
              No paperwork. No office visits. Each step happens online, on your schedule.
            </p>
          </div>
        </div>

        <div className="space-y-0">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className={`rv grid lg:grid-cols-12 gap-8 border-t border-white/15 py-16 lg:py-20 group ${
                idx === steps.length - 1 ? "border-b border-b-white/15" : ""
              }`}
            >
              <div className="lg:col-span-1">
                <span className="display text-[48px] lg:text-[64px] text-rose-glow font-normal leading-none">
                  {step.num}
                </span>
              </div>
              <div className="lg:col-span-4">
                <h3 className="text-[22px] lg:text-[26px] font-semibold text-white mb-2.5">
                  {step.title}
                </h3>
              </div>
              <div className="lg:col-span-5 lg:col-start-7">
                <p className="text-white/90 text-[16px] lg:text-[18px] leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
