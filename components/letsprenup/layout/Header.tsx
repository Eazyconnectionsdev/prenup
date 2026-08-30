"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-pearl/80 shadow-sm"
            : "bg-midnight/90 backdrop-blur-md border-b border-white/10"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16 flex items-center justify-between h-[72px]">
          <Link href="/" className="flex items-center gap-2.5 transition-colors duration-300">
            <svg
              className={`w-[28px] h-[28px] transition-colors duration-300 ${
                scrolled ? "text-rose" : "text-rose-glow"
              }`}
              viewBox="0 0 28 28"
              fill="none"
            >
              <circle cx="11.5" cy="14" r="6.5" stroke="currentColor" strokeWidth="1.2" />
              <circle
                cx="16.5"
                cy="14"
                r="6.5"
                stroke="currentColor"
                strokeWidth="1.2"
                opacity="0.6"
              />
            </svg>
            <span
              className={`text-[14px] font-bold tracking-[0.16em] uppercase transition-colors duration-300 ${
                scrolled ? "text-midnight" : "text-white"
              }`}
            >
              LetsPrenup
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-9">
            <a
              href="#process"
              className={`text-[13px] font-semibold transition-colors duration-300 ${
                scrolled
                  ? "text-midnight/80 hover:text-rose"
                  : "text-white/90 hover:text-rose-glow"
              }`}
            >
              Process
            </a>
            <a
              href="#agreements"
              className={`text-[13px] font-semibold transition-colors duration-300 ${
                scrolled
                  ? "text-midnight/80 hover:text-rose"
                  : "text-white/90 hover:text-rose-glow"
              }`}
            >
              Agreements
            </a>
            <a
              href="#pricing"
              className={`text-[13px] font-semibold transition-colors duration-300 ${
                scrolled
                  ? "text-midnight/80 hover:text-rose"
                  : "text-white/90 hover:text-rose-glow"
              }`}
            >
              Pricing
            </a>
            <a
              href="#faq"
              className={`text-[13px] font-semibold transition-colors duration-300 ${
                scrolled
                  ? "text-midnight/80 hover:text-rose"
                  : "text-white/90 hover:text-rose-glow"
              }`}
            >
              FAQ
            </a>
          </nav>

          <a
            href="#pricing"
            className={`hidden md:inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[12px] font-semibold tracking-wider uppercase transition-all duration-300 ${
              scrolled
                ? "bg-midnight text-white hover:bg-rose hover:shadow-md border border-transparent"
                : "border border-white/60 bg-transparent text-white hover:bg-white hover:text-midnight"
            }`}
          >
            Start Agreement
          </a>

          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className={`lg:hidden transition-colors duration-300 ${
              scrolled ? "text-midnight hover:text-rose" : "text-white hover:text-rose-glow"
            }`}
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-72 bg-white text-midnight z-[60] p-8 flex flex-col shadow-2xl border-l border-pearl transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => setDrawerOpen(false)}
          className="self-end text-midnight/40 hover:text-rose mb-8"
        >
          <X className="w-5 h-5" />
        </button>
        <nav className="flex flex-col gap-5">
          <a
            href="#process"
            onClick={() => setDrawerOpen(false)}
            className="text-midnight/80 hover:text-rose text-lg font-medium"
          >
            Process
          </a>
          <a
            href="#agreements"
            onClick={() => setDrawerOpen(false)}
            className="text-midnight/80 hover:text-rose text-lg font-medium"
          >
            Agreements
          </a>
          <a
            href="#pricing"
            onClick={() => setDrawerOpen(false)}
            className="text-midnight/80 hover:text-rose text-lg font-medium"
          >
            Pricing
          </a>
          <a
            href="#faq"
            onClick={() => setDrawerOpen(false)}
            className="text-midnight/80 hover:text-rose text-lg font-medium"
          >
            FAQ
          </a>
        </nav>
        <a
          href="#pricing"
          onClick={() => setDrawerOpen(false)}
          className="mt-auto bg-rose text-white py-3 rounded-full text-center text-sm font-semibold tracking-wider uppercase shadow-md"
        >
          Start Agreement
        </a>
      </div>
    </>
  );
}
