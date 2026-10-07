import Image from "next/image";
import Link from "next/link";
import Logo from "@/images/logo.png";

export default function AuthHeader() {
  return (
    <header className="sticky top-0 z-30 w-full  bg-white/95 backdrop-blur">
      <div className="flex items-center px-4 py-5 sm:px-8">
        <Link href="/login" className="flex items-center gap-2">
          <Image
            src={Logo}
            width={52}
            height={52}
            alt="LetsPrenup logo"
            priority
          />
          <span className="text-[16px] sm:text-[18px] font-medium">
            <strong>Lets</strong>Prenup
          </span>
        </Link>
      </div>
    </header>
  );
}
