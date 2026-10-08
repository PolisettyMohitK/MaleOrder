import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Preloader } from "@/components/layout/Preloader";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { fullName, placeLine, store } from "@/data/store.config";
import { GENERAL_ENQUIRY } from "@/lib/whatsapp";

/* Serif for headlines, sans for everything else. Both self-hosted by
   next/font, so there is no render-blocking request to Google. */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(store.siteUrl),
  title: {
    default: `${fullName} — Menswear in ${placeLine}`,
    template: `%s — ${fullName}`,
  },
  description:
    "Office casuals and kurta pajama sets, made properly and sold from our shop in Ahmedabad. Browse the collection and order easily on WhatsApp.",
  keywords: [
    "menswear Ahmedabad",
    "Office Casuals",
    "Kurta Pajama",
    "Erise",
    "clothing store Ahmedabad",
  ],
  openGraph: {
    title: `${fullName} — Menswear in ${placeLine}`,
    description: store.promise,
    type: "website",
    locale: "en_IN",
    siteName: fullName,
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-paper">
        {/* Without JS the reveal start states would never be undone, so make
            sure nothing on the page can end up stuck invisible. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;clip-path:none !important}`}</style>
        </noscript>

        {/* Ordering keyboard shortcuts. */}
        <a
          href="#main"
          className="label sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-bone"
        >
          Skip to content
        </a>

        <SmoothScroll />
        <MotionRoot />
        <Preloader />

        <div className="fixed inset-x-0 top-0 z-[70]">
          <AnnouncementBar />
          <Header />
        </div>

        <main id="main" className="flex-1">
          {children}
        </main>

        <Footer />
        <FloatingWhatsApp message={GENERAL_ENQUIRY} />
      </body>
    </html>
  );
}