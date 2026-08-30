import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="relative py-36 lg:py-48 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&q=80"
          alt="UK Wedding Dinner Celebration Table"
          className="w-full h-full object-cover"
          id="cta-img"
        />
        <div className="absolute inset-0 bg-midnight/75 pointer-events-none"></div>
      </div>

      <div className="relative z-10 max-w-[720px] mx-auto px-6 text-center">
        <h2 className="rv display text-[clamp(34px,5.5vw,68px)] text-white leading-[1.08] mb-6">
          Your marriage deserves a{" "}
          <span className="display-italic text-rose-glow">clear start</span>.
        </h2>
        <p className="rv text-white/90 text-[17px] mb-12 max-w-md mx-auto font-normal">
          Fixed £999. Two independent firms. Done in days. Start in under five minutes.
        </p>
        <div className="rv">
          <a
            href="#pricing"
            className="btn-fill bg-rose hover:bg-rose-deep text-white px-10 py-4 rounded-full text-[13px] font-bold tracking-wider uppercase inline-flex items-center gap-3 shadow-xl transition-all"
          >
            Begin Your Agreement
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
