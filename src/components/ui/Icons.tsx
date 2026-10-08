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
 * The real WhatsApp mark, on the standard 24x24 grid: a speech bubble with a
 * telephone handset cut out of it, filled solid in `currentColor`.
 *
 * Drawn rather than imported so it inherits the black-and-white palette exactly
 * like every other icon here — an official brand-colour asset would have been a
 * green square in the middle of a monochrome site. Because it is filled and
 * single-colour, `currentColor` covers the light, dark and hover states with no
 * extra work.
 */
export function WhatsAppIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={20}
      height={20}
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a1.03 1.03 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347Z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.09.547 4.142 1.588 5.945L2 22l5.25-1.652a9.9 9.9 0 0 0 5.048 1.36h.004c5.455 0 9.89-5.335 9.89-11.892 0-3.18-1.24-6.165-3.495-8.41A11.82 11.82 0 0 0 12.04 2Zm0 18.63h-.003a9.79 9.79 0 0 1-4.99-1.37l-.36-.214-3.74.98.998-3.647-.235-.374a9.79 9.79 0 0 1-1.5-5.26c0-5.4 4.4-9.8 9.82-9.8 2.62 0 5.09 1.03 6.94 2.88a9.75 9.75 0 0 1 2.88 6.91c0 5.4-4.4 9.8-9.82 9.8Z" />
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