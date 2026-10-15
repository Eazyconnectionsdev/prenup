import Image from "next/image";
import LogoOnDark from "@/images/prenup-logo-on-dark.png";
import LogoOnLight from "@/images/prenup-logo-on-light.png";
import MarkOnDark from "@/images/prenup-mark-on-dark.png";
import MarkOnLight from "@/images/prenup-mark-on-light.png";

/**
 * The Lets Prenup lockup.
 *
 * The artwork paints "Lets" in white and "Prenup" in pink, so the full
 * wordmark only reads on a dark background. `surface` picks the matching
 * artwork: "dark" keeps the white word, "light" swaps it for deep plum.
 * Always pass the colour of the surface the logo sits ON.
 */
type Props = {
  /** Background the logo sits on. */
  surface: "light" | "dark";
  /** "full" is the heart plus wordmark; "mark" is the heart alone. */
  variant?: "full" | "mark";
  /** Rendered height in px; width follows the artwork's aspect ratio. */
  height?: number;
  className?: string;
  priority?: boolean;
};

const ART = {
  full: { light: LogoOnLight, dark: LogoOnDark, ratio: 900 / 183 },
  mark: { light: MarkOnLight, dark: MarkOnDark, ratio: 1 },
} as const;

export default function BrandLogo({
  surface,
  variant = "full",
  height = 32,
  className = "",
  priority = false,
}: Props) {
  const art = ART[variant];

  return (
    <Image
      src={art[surface]}
      alt="Lets Prenup"
      height={height}
      width={Math.round(height * art.ratio)}
      priority={priority}
      // Height is the control; width follows so the lockup never distorts.
      className={`h-auto w-auto select-none ${className}`}
      style={{ height }}
    />
  );
}
