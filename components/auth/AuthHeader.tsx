import Link from "next/link";
import BrandLogo from "@/components/brand/BrandLogo";

export default function AuthHeader() {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur">
      <div className="flex items-center px-4 py-5 sm:px-8">
        <Link
          href="/login"
          aria-label="Lets Prenup home"
          className="inline-flex items-center transition-opacity hover:opacity-80"
        >
          {/* The artwork carries the wordmark, so no text beside it. */}
          <BrandLogo surface="light" height={34} priority />
        </Link>
      </div>
    </header>
  );
}
