import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Manrope, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { SkipLink } from "@/components/layout/SkipLink";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { RevealRoot } from "@/components/motion/RevealRoot";
import { ScrollRefresh } from "@/components/motion/ScrollRefresh";
import { addressLine, site } from "@/content/site";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });
// Display serif: closest Google match, by eye, to the app's page titles (spec B3 / G5); swap this one import if the app team names another.
const serif = Source_Serif_4({ variable: "--font-serif", subsets: ["latin"], weight: ["600"], style: ["normal"], display: "swap" });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["500"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "TiVora ERP · One platform. Every business.", template: "%s · TiVora ERP" },
  description:
    "TiVora ERP from HiTech, Kathmandu: sales, buying, stock, production and accounts in one system, with Bikram Sambat dates, VAT and IRD formats built in.",
  openGraph: {
    title: "TiVora ERP · One platform. Every business.",
    description: "Sales, buying, stock, production and accounts in one system, made in Nepal for Nepal.",
    type: "website",
    siteName: "TiVora ERP",
    images: ["/opengraph-image.png"],
  },
};

export const viewport: Viewport = { themeColor: site.themeColor };

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.company,
  url: site.website,
  telephone: site.phones[0].tel,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressCountry: "NP",
  },
  description: `Maker of ${site.name}. ${addressLine}.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} ${serif.variable} ${plexMono.variable}`}>
      <body>
        <SkipLink />
        <SiteHeader />
        <main id="main" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
        <SiteFooter />
        <RevealRoot />
        <ScrollRefresh />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
