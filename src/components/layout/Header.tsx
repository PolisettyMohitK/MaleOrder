"use client";

import { AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { categories } from "@/data/products";
import { store } from "@/data/store.config";
import { lockScroll } from "@/lib/scroll";
import { GENERAL_ENQUIRY, waLink } from "@/lib/whatsapp";
import { Logo } from "@/components/ui/Logo";
import { FloatingMenu } from "@/components/ui/FloatingMenu";
import { SearchIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { SearchOverlay } from "./SearchOverlay";

const NAV = [
  { href: "/", label: "Home" },
  ...categories.map((c) => ({ href: `/collections/${c.slug}`, label: c.name })),
  { href: "/story", label: "Our Story" },
];

/* Desktop splits the nav into two groups flanking the centred logo.
   The cut falls after Blazers, which keeps the reading order intact — Home,
   Office Casuals, Blazers on the left, Kurta Pajama, Our Story on the right —
   and leaves roughly equal ink either side of the logo once the search and
   WhatsApp buttons are counted on the right. */
const SPLIT = 3;
const LEFT_NAV = NAV.slice(0, SPLIT);
const RIGHT_NAV = NAV.slice(SPLIT);

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/** One nav group. The underline is the shared active indicator. */
function NavLinks({ items, pathname, transparent }: { items: typeof NAV; pathname: string; transparent: boolean }) {
  return (
    <ul className="flex items-center gap-7">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`label relative py-2 transition-colors duration-500 ${
                transparent
                  ? "text-bone/75 hover:text-bone"
                  : "text-neutral-500 hover:text-ink"
              }`}
            >
              {item.label}
              <span
                aria-hidden="true"
                className={`absolute -bottom-0.5 left-0 h-px w-full origin-left silver-underline transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  active ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function Header() {
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);

  /* The floating menu owns its own open state and reports it here, so the
     header can darken underneath and lock the page behind it. */
  const [menuOpen, setMenuOpen] = useState(false);

  /* Overlays remember which page they were opened on, so navigating closes
     them without a setState-in-effect. */
  const [searchOpenedOn, setSearchOpenedOn] = useState<string | null>(null);

  const searchOpen = searchOpenedOn === pathname;

  /* Only ever one modal surface at a time — two aria-modal dialogs open over
     each other is a genuine a11y failure, not a cosmetic one. */
  const openSearch = () => {
    setSearchOpenedOn(pathname);
    setMenuOpen(false);
  };
  const closeSearch = () => setSearchOpenedOn(null);

  const overHero = pathname === "/";
  const transparent = overHero && !scrolled && !menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    lockScroll(menuOpen || searchOpen);
    return () => lockScroll(false);
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    /* Escape belongs to the floating menu now; only search is left here. */
    if (!searchOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  const inkClass = transparent ? "text-bone" : "text-ink";

  return (
    <>
      {/* Header. Transparent over the home hero, white everywhere else. */}
      <header
          className={`h-16 transition-[background-color,box-shadow,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:h-[72px] ${
            transparent
              ? "border-b border-transparent bg-transparent"
              : "border-b border-black/8 bg-white/92 backdrop-blur-md shadow-[0_2px_28px_-18px_rgba(0,0,0,0.35)]"
          }`}
        >
          {/* Three equal tracks, the middle one sized to the logo.

              The logo was absolutely centred instead, and the nav ran under it:
              the left group's "Blazers" crossed the logo's left edge by 28px.
              Equal 1fr tracks put the two nav groups in boxes that cannot
              reach the middle, so the logo is centred by geometry rather than
              by positioning, and it stays centred on mobile too — where the
              tracks hold a 44px trigger and two 44px buttons. */}
          <div className="shell grid h-full grid-cols-[1fr_auto_1fr] items-center gap-4">
            {/* Left: half the nav, pushed right toward the logo. */}
            <div className="flex items-center">
              <nav aria-label="Primary" className="hidden lg:ml-auto lg:flex lg:pr-4">
                <NavLinks
                  items={LEFT_NAV}
                  pathname={pathname}
                  transparent={transparent}
                />
              </nav>

            {/* Mobile: floating menu. The panel is fixed and anchored to the
                trigger, so the header sits outside it. Deliberately still
                `lg:hidden` — the two desktop nav groups cover the links, so
                showing this too would duplicate every one of them. */}
            <FloatingMenu
              open={menuOpen}
              onOpenChange={setMenuOpen}
              tone={transparent ? "bone" : "ink"}
              className="lg:hidden"
              primaryLinks={NAV}
              secondaryLinks={[{ href: "/support", label: "Support" }]}
              socialLinks={[
                ...store.social.map((social) => ({
                  label: social.label,
                  href: social.url,
                  external: true,
                })),
                {
                  label: "WhatsApp",
                  href: waLink(GENERAL_ENQUIRY),
                  external: true,
                },
              ]}
            />
            </div>

            {/* Centre: the logo, centred because it owns its own grid track.
                It has to invert when the bar is transparent over the hero. */}
            <Logo
              size="sm"
              tone={transparent ? "silver" : "ink"}
              className="justify-self-center"
            />

            {/* Right: the other half of the nav, then search and WhatsApp. */}
            <div className="flex items-center justify-end gap-1">
              <nav
                aria-label="Collections"
                className="hidden lg:mr-auto lg:block lg:pl-4"
              >
                <NavLinks
                  items={RIGHT_NAV}
                  pathname={pathname}
                  transparent={transparent}
                />
              </nav>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => openSearch()}
                  aria-label="Search the collection"
                  className={`tap -mr-2 flex items-center transition-colors duration-500 ${inkClass} hover:text-silver-400`}
                >
                  <SearchIcon width={20} height={20} />
                </button>
                <a
                  href={waLink(GENERAL_ENQUIRY)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Order on WhatsApp"
                  className={`tap -mr-2 flex items-center transition-colors duration-500 ${inkClass} hover:text-silver-400`}
                >
                  <WhatsAppIcon width={20} height={20} />
                </a>
              </div>
            </div>
          </div>
        </header>

      <AnimatePresence>
        {searchOpen && <SearchOverlay onClose={closeSearch} />}
      </AnimatePresence>
    </>
  );
}