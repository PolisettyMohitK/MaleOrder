import Link from "next/link";
import { categories } from "@/data/products";
import { addressLines, fullName, placeLine, store } from "@/data/store.config";
import { GENERAL_ENQUIRY, waLink } from "@/lib/whatsapp";
import { Logo } from "@/components/ui/Logo";
import {
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  WhatsAppIcon,
} from "@/components/ui/Icons";

const QUICK_LINKS = [
  { href: "/story", label: "Our Story" },
  { href: "/support", label: "Support & Contact" },
];

export function Footer() {
  const year = store.copyrightYear;

  return (
    <footer className="on-dark bg-ink text-bone">
      <div className="shell pt-20 pb-10 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4" data-reveal="up">
            <Logo tone="silver" size="lg" className="items-start" />
            <p className="t-body mt-7 max-w-xs text-neutral-300">
              A menswear shop in {placeLine}, and now the same collection on your
              phone. Message us, we will sort the rest.
            </p>
            <a
              href={waLink(GENERAL_ENQUIRY)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost mt-8"
            >
              <WhatsAppIcon width={15} height={15} />
              Message on WhatsApp
            </a>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer" className="lg:col-span-3" data-reveal="up">
            <h2 className="label text-silver-200">Shop</h2>
            <ul className="mt-6 flex flex-col gap-4">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/collections/${category.slug}`}
                    className="link-draw text-sm text-neutral-300 transition-colors duration-500 hover:text-bone"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-draw text-sm text-neutral-300 transition-colors duration-500 hover:text-bone"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-3" data-reveal="up">
            <h2 className="label text-silver-200">Visit</h2>
            <ul className="mt-6 flex flex-col gap-5 text-sm text-neutral-300">
              <li className="flex gap-3">
                <PinIcon
                  width={17}
                  height={17}
                  className="mt-0.5 shrink-0 text-silver-300"
                />
                <address className="not-italic leading-relaxed">
                  {addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </li>
              <li className="flex gap-3">
                <PhoneIcon
                  width={17}
                  height={17}
                  className="mt-0.5 shrink-0 text-silver-300"
                />
                <a
                  href={`tel:${store.phone.replace(/\s/g, "")}`}
                  className="link-draw hover:text-bone"
                >
                  {store.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <MailIcon
                  width={17}
                  height={17}
                  className="mt-0.5 shrink-0 text-silver-300"
                />
                <a
                  href={`mailto:${store.email}`}
                  className="link-draw break-all hover:text-bone"
                >
                  {store.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="lg:col-span-2" data-reveal="up">
            <h2 className="label text-silver-200">Open</h2>
            <ul className="mt-6 flex flex-col gap-4 text-sm">
              {store.hours.map((slot) => (
                <li key={slot.days} className="leading-relaxed">
                  <span className="block text-neutral-400">{slot.days}</span>
                  <span className="block text-neutral-300">{slot.time}</span>
                </li>
              ))}
            </ul>
            <ul className="mt-7 flex items-center gap-5">
              {store.social.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${fullName} on ${social.label}`}
                    className="tap flex items-center text-silver-300 transition-colors duration-500 hover:text-bone"
                  >
                    {social.label === "Instagram" ? (
                      <InstagramIcon width={18} height={18} />
                    ) : (
                      <FacebookIcon width={18} height={18} />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="silver-rule mt-16 opacity-40" />

        <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="label text-neutral-400">
            © {year} {fullName}. All rights reserved.
          </p>
          <p className="label text-neutral-400">
            {placeLine} · <span className="text-silver-300">WhatsApp ordering</span>
          </p>
        </div>
      </div>
    </footer>
  );
}