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

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
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
          <div className="shell relative flex h-full items-center justify-between gap-4">
            {/* Left: desktop nav */}
            <nav aria-label="Primary" className="hidden flex-1 lg:block">
              <ul className="flex items-center gap-7">
                {NAV.map((item) => {
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
            </nav>

            {/* Mobile: floating menu. The panel is fixed and anchored to the
                trigger, so the header sits outside it. */}
            <FloatingMenu
              open={menuOpen}
              onOpenChange={setMenuOpen}
              tone={transparent ? "bone" : "ink"}
              className="flex-1 lg:hidden"
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

            {/* Centre: logo, pinned to the middle at every width. It has to invert when
                the bar is transparent and sitting over the dark hero. */}
            <Logo
              size="sm"
              tone={transparent ? "silver" : "ink"}
              className="absolute left-1/2 -translate-x-1/2"
            />

            {/* Right: search + WhatsApp */}
            <div className="flex flex-1 items-center justify-end gap-1">
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
        </header>

      <AnimatePresence>
        {searchOpen && <SearchOverlay onClose={closeSearch} />}
      </AnimatePresence>
    </>
  );
}