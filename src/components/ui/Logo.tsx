import Link from "next/link";
import { LogoMark } from "./LogoMark";

interface LogoProps {
  /** "ink" for light backgrounds, "silver" for dark ones. Open wordmark only. */
  tone?: "ink" | "silver";
  size?: "sm" | "md" | "lg";
  /** The round badge, as in the original logo. The footer uses the open wordmark. */
  badge?: boolean;
  className?: string;
}

const badgeSize = { sm: "size-[72px] md:size-[84px]", md: "size-24", lg: "size-32" } as const;
const wordHeight = { sm: "h-9 md:h-10", md: "h-12", lg: "h-16" } as const;

/** The store logo, linking home. The artwork lives in LogoMark. */
export function Logo({ tone = "ink", size = "md", badge = true, className = "" }: LogoProps) {
  return (
    <Link href="/" aria-label="Male Order Erise, home" className={`inline-flex ${className}`}>
      {badge ? (
        <LogoMark circle className={`${badgeSize[size]} drop-shadow-[0_6px_18px_rgba(0,0,0,0.18)]`} />
      ) : (
        <LogoMark
          tone={tone === "silver" ? "paper" : "ink"}
          className={`${wordHeight[size]} w-auto`}
        />
      )}
    </Link>
  );
}
