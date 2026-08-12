import { ArrowRight, Check } from "lucide-react";

export default function Hero() {
  return (
    <section className="hero-gradient min-h-screen relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 min-h-screen grid lg:grid-cols-12 items-center gap-8 pt-20">
        {/* Left Content Column */}
        <div className="lg:col-span-7 pt-28 pb-16 lg:pt-0 lg:pb-0 relative z-10">
          <p className="rv label-sm text-rose-glow mb-8">
            Prenuptial Agreements for the UK
          </p>

          <h1 className="rv display text-white text-[clamp(40px,6.5vw,82px)] mb-8 max-w-[640px] leading-[1.08]">
            Your marriage deserves a{" "}
            <span className="display-italic text-rose-glow">clear start</span>
          </h1>

          <p className="rv text-mist text-[17px] lg:text-[18px] font-light leading-[1.75] max-w-[460px] mb-12">
            Fixed £999 for both partners. Two independent law firms. Dedicated case manager. Completed in days.
          </p>

          {/* CTA Group */}
          <div className="rv flex flex-wrap items-center gap-5 mb-16">
            <a
              href="#pricing"
              className="bg-rose text-white px-9 py-4 rounded-full text-[13px] font-semibold tracking-wider uppercase inline-flex items-center gap-3 hover:bg-rose-soft transition-colors shadow-lg"
            >
              Begin Your Agreement
              <ArrowRight className="w-4 h-4" />
            </a>
            <span className="text-mist/70 text-[13px]">Takes under 5 minutes</span>
          </div>

          {/* Social Proof Badges */}
          <div className="rv flex items-center gap-6 border-t border-white/10 pt-8">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-slate border-2 border-midnight flex items-center justify-center text-[10px] text-mist font-medium">
                JR
              </div>
              <div className="w-8 h-8 rounded-full bg-midnight-mid border-2 border-midnight flex items-center justify-center text-[10px] text-mist font-medium">
                SK
              </div>
              <div className="w-8 h-8 rounded-full bg-rose-deep border-2 border-midnight flex items-center justify-center text-[10px] text-white font-medium">
                MR
              </div>
              <div className="w-8 h-8 rounded-full bg-steel border-2 border-midnight flex items-center justify-center text-[10px] text-white font-medium">
                +
              </div>
            </div>
            <div>
              <p className="text-white text-[13px] font-semibold">
                Trusted by 500+ UK couples
              </p>
              <p className="text-mist/70 text-[11px]">Average completion: 9 days</p>
            </div>
          </div>
        </div>

        {/* Right Photo Column */}
        <div className="lg:col-span-5 hidden lg:block h-[85vh] relative">
          <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-midnight via-transparent to-transparent z-10 pointer-events-none"></div>
          <img
            src="/hero-couple.png"
            alt="UK Couple Planning Agreement on Tablet"
            className="w-full h-full object-cover rounded-2xl opacity-90"
          />
        </div>
      </div>

      {/* Hero Bottom Dark Blue Trust Bar */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-midnight/80 backdrop-blur-md z-20">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-4 flex flex-wrap items-center justify-center lg:justify-between gap-x-10 gap-y-3 text-[13px] text-white font-semibold tracking-wide uppercase">
          <span className="flex items-center gap-2.5">
            <Check className="w-4 h-4 text-rose-glow" />
            SRA & BSB Regulated Lawyers
          </span>
          <span className="flex items-center gap-2.5">
            <Check className="w-4 h-4 text-rose-glow" />
            100% Separate Law Firms
          </span>
          <span className="flex items-center gap-2.5">
            <Check className="w-4 h-4 text-rose-glow" />
            Dedicated Case Management
          </span>
        </div>
      </div>
    </section>
  );
}
