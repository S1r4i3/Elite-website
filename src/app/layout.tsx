import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { RevealObserver } from "@/components/layout/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { site } from "@/lib/site";

// Self-hosted variable fonts (no third-party requests; SIL Open Font License).
const inter = localFont({ src: "./fonts/inter-var.woff2", variable: "--font-inter", display: "swap", weight: "100 900" });
const manrope = localFont({ src: "./fonts/manrope-var.woff2", variable: "--font-manrope", display: "swap", weight: "200 800" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — U.S. Tax Preparation, Business & NRI Tax Services`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "U.S. tax preparation",
    "federal tax filing",
    "state tax filing",
    "FBAR filing",
    "FATCA",
    "ITIN application",
    "IRS representation",
    "LLC tax services",
    "corporate tax filing",
    "NRI tax services",
    "Indian tax services USA",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.legalName,
  category: "Finance",
  alternates: { canonical: site.url },
  openGraph: { type: "website", siteName: site.name, locale: "en_US", url: site.url },
  appleWebApp: { capable: true, title: site.shortName, statusBarStyle: "black-translucent" },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#1B1F24",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" suppressHydrationWarning className={`${inter.variable} ${manrope.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        {children}
        <RevealObserver />
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
      </body>
    </html>
  );
}
