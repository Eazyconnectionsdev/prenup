import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-midnight text-white border-t border-midnight-light pt-20 pb-12">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="grid lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2 mb-5">
              <svg className="w-5 h-5 text-rose-glow" viewBox="0 0 28 28" fill="none">
                <circle cx="11.5" cy="14" r="6.5" stroke="currentColor" strokeWidth="1.1" />
                <circle
                  cx="16.5"
                  cy="14"
                  r="6.5"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  opacity="0.5"
                />
              </svg>
              <span className="text-[13px] font-bold tracking-[0.16em] uppercase text-white">
                LetsPrenup
              </span>
            </Link>
            <p className="text-white/90 text-[14px] leading-relaxed max-w-xs font-normal">
              Modern prenuptial agreements for UK couples. Transparent pricing, independent legal advice, fully online.
            </p>
          </div>

          <div className="lg:col-span-2 lg:col-start-7">
            <p className="label-sm text-rose-glow font-semibold mb-5 tracking-widest">
              NAVIGATE
            </p>
            <nav className="flex flex-col gap-3">
              <a
                href="#process"
                className="text-[14px] text-white hover:text-rose-glow transition-colors font-medium"
              >
                Process
              </a>
              <a
                href="#agreements"
                className="text-[14px] text-white hover:text-rose-glow transition-colors font-medium"
              >
                Agreements
              </a>
              <a
                href="#pricing"
                className="text-[14px] text-white hover:text-rose-glow transition-colors font-medium"
              >
                Pricing
              </a>
              <a
                href="#faq"
                className="text-[14px] text-white hover:text-rose-glow transition-colors font-medium"
              >
                FAQ
              </a>
            </nav>
          </div>

          <div className="lg:col-span-2">
            <p className="label-sm text-rose-glow font-semibold mb-5 tracking-widest">
              LEGAL
            </p>
            <nav className="flex flex-col gap-3">
              <a
                href="#"
                className="text-[14px] text-white hover:text-rose-glow transition-colors font-medium"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-[14px] text-white hover:text-rose-glow transition-colors font-medium"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-[14px] text-white hover:text-rose-glow transition-colors font-medium"
              >
                Cookie Policy
              </a>
            </nav>
          </div>

          <div className="lg:col-span-2">
            <p className="label-sm text-rose-glow font-semibold mb-5 tracking-widest">
              CONTACT
            </p>
            <nav className="flex flex-col gap-3">
              <a
                href="mailto:hello@letsprenup.co.uk"
                className="text-[14px] text-white hover:text-rose-glow transition-colors font-medium"
              >
                hello@letsprenup.co.uk
              </a>
              <a
                href="#"
                className="text-[14px] text-white hover:text-rose-glow transition-colors font-medium"
              >
                Instagram
              </a>
              <a
                href="#"
                className="text-[14px] text-white hover:text-rose-glow transition-colors font-medium"
              >
                LinkedIn
              </a>
            </nav>
          </div>
        </div>

        <div className="py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] text-white/80 font-medium">
          <p>&copy; 2026 LetsPrenup Ltd. All rights reserved.</p>
          <p>
            Independent legal advice provided by panel solicitors regulated by the SRA & BSB.
          </p>
        </div>
      </div>
    </footer>
  );
}
