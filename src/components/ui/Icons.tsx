import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  width: 20,
  height: 20,
  "aria-hidden": true,
  focusable: "false" as const,
};

/* -------------------------------------------------- WhatsApp (official mark) */

/**
 * The official WhatsApp mark, on the standard 24x24 grid: a solid speech
 * bubble with the telephone handset knocked out of the middle.
 *
 * The version this replaces was the Simple Icons *outline* variant — a thin
 * bubble ring drawn separately from the handset. Rendered as a ladder from
 * 16px to 96px, that ring breaks up and goes visibly jagged at the two sizes
 * this site actually uses (16px in the order buttons, 20px in the header).
 *
 * A filled shape with one hole holds together at any size, because there is no
 * hairline stroke to alias: at 16px the knocked-out handset still reads as a
 * handset. `fill-rule="evenodd"` is what punches the hole — with the default
 * nonzero winding the handset subpath would just fill back in.
 *
 * Still single-colour `currentColor`, so it stays monochrome across the ink,
 * paper and silver states. The official brand asset is green-on-white, which
 * would have been a coloured square in the middle of a greyscale site.
 */
export function WhatsAppIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      width={20}
      height={20}
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.09.547 4.142 1.588 5.945L2 22l5.25-1.652a9.9 9.9 0 0 0 5.048 1.36h.004c5.455 0 9.89-5.335 9.89-11.892 0-3.18-1.24-6.165-3.495-8.41A11.82 11.82 0 0 0 12.04 2Zm5.52 12.53c-.24.68-1.4 1.3-1.94 1.36-.5.06-1.15.1-1.86-.12-.43-.13-.98-.32-1.69-.63-2.97-1.28-4.9-4.28-5.05-4.48-.15-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.59-.37.79-.37.2 0 .4 0 .57.01.19.01.44-.07.68.52.24.58.81 2 .88 2.15.07.14.12.31.02.5-.1.2-.15.31-.29.48-.15.17-.31.38-.44.51-.15.14-.3.29-.13.57.17.29.75 1.24 1.61 2.01 1.11 1 2.04 1.31 2.33 1.45.29.15.46.12.63-.07.17-.2.72-.84.91-1.13.2-.29.39-.24.65-.14.26.09 1.66.78 1.94.92.29.15.48.22.55.34.07.12.07.7-.17 1.38Z" />
    </svg>
  );
}

/* ------------------------------------------------------------ navigation */

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 8h18M3 16h18" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 17 17 7" />
      <path d="M8.5 7H17v8.5" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6 9.5 6 6 6-6" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 6v12M6 12h12" />
    </svg>
  );
}

export function PauseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9.5 5v14M14.5 5v14" />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 5.5v13l10-6.5-10-6.5Z" />
    </svg>
  );
}

export function MinusIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 12h12" />
    </svg>
  );
}

/* ----------------------------------------------------------- contact info */

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6.5 3.5h3l1.5 4-2 1.4a12 12 0 0 0 6.1 6.1l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s7-5.6 7-10.5A7 7 0 0 0 5 10.5C5 15.4 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.5" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M16.8 7.2h.01" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14.5 8.5V7a1.5 1.5 0 0 1 1.5-1.5h1V3h-2.5A4 4 0 0 0 10.5 7v1.5H8V11h2.5v10H14V11h2.5l.5-2.5H14Z" />
    </svg>
  );
}

/* ------------------------------------------------------------ value props */

/** Thin line icon: a bolt of cloth / bolt of fabric. */
export function FabricIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 3.5 17.5 8 15 20.5 3.5 16 6 3.5Z" />
      <path d="M8.2 8.5 15.8 11M7 13l7.6 2.6" />
    </svg>
  );
}

/** Thin line icon: a tape measure. */
export function FitIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 9.5 9.5 3.5l11 11-6 6-11-11Z" />
      <path d="M7.5 12.5 9 11M10.5 15.5 12 14M13 8.5l1.5-1.5M16.5 12 18 10.5" />
    </svg>
  );
}

/** Thin line icon: a shop front. */
export function StoreIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 9.5h16v11H4z" />
      <path d="M3 9.5 5 4h14l2 5.5" />
      <path d="M9.5 20.5v-6h5v6" />
    </svg>
  );
}