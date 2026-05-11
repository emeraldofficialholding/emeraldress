import type { Metadata, Viewport } from "next";
import { Playfair_Display, Alice } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const alice = Alice({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400"],
});

const SITE_URL = "https://www.emeraldress.com";
const SUPABASE_ASSETS = "https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "EMERALDRESS — Lusso Consapevole e Manifattura Italiana",
    template: "%s | EMERALDRESS",
  },
  description:
    "Emeraldress: moda sostenibile e lusso consapevole dal cuore della Costa Smeralda. Manifattura italiana con materiali rigenerati ECONYL®.",
  keywords: [
    "moda sostenibile",
    "abbigliamento lusso",
    "fibra riciclata",
    "ECONYL",
    "manifattura italiana",
    "abiti da sera",
    "pret-a-porter",
    "Costa Smeralda",
    "luxury fashion",
    "moda etica",
  ],
  authors: [{ name: "EMERALDRESS" }],
  alternates: {
    canonical: "/",
    languages: {
      it: SITE_URL,
      "x-default": SITE_URL,
    },
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: SITE_URL,
    siteName: "Emeraldress",
    title: "Emeraldress | Moda Luxury Sostenibile",
    description: "Abiti luxury italiani con tessuti sostenibili ECONYL® riciclati.",
    images: [
      {
        url: `${SUPABASE_ASSETS}/logo/og-image.jpg`,
        width: 1216,
        height: 640,
        alt: "Emeraldress — Sustainable Mediterranean Luxury, Costa Smeralda",
      },
      {
        url: `${SUPABASE_ASSETS}/logo/og-image-square.jpg`,
        width: 1088,
        height: 1088,
        alt: "Emeraldress — Sustainable Mediterranean Luxury",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@emeraldress",
    creator: "@emeraldress",
    title: "Emeraldress | Moda Luxury Sostenibile",
    description: "Abiti luxury italiani con tessuti sostenibili ECONYL® riciclati.",
    images: [`${SUPABASE_ASSETS}/logo/og-image.jpg`],
  },
  icons: {
    icon: [
      { url: `${SUPABASE_ASSETS}/logo/favicon.ico`, sizes: "any" },
      { url: `${SUPABASE_ASSETS}/faviconemeraldress.svg`, type: "image/svg+xml" },
      { url: `${SUPABASE_ASSETS}/logo/favicon-32x32.png`, sizes: "32x32", type: "image/png" },
      { url: `${SUPABASE_ASSETS}/logo/favicon-16x16.png`, sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: `${SUPABASE_ASSETS}/logo/apple-touch-icon.png`, sizes: "180x180" }],
  },
  manifest: "/manifest.json",
  other: {
    "geo.region": "IT",
    "geo.placename": "Italia",
    "format-detection": "telephone=no",
    "apple-mobile-web-app-title": "Emeraldress",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#e4ffec",
  width: "device-width",
  initialScale: 1,
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "EMERALDRESS",
  url: SITE_URL,
  logo: `${SUPABASE_ASSETS}/emeraldress-icon-ed.svg`,
  sameAs: ["https://www.instagram.com/emeraldress/"],
  address: {
    "@type": "PostalAddress",
    addressCountry: "IT",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Emeraldress",
  url: SITE_URL,
  inLanguage: "it-IT",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/collezioni?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it-IT" className={`${playfair.variable} ${alice.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
