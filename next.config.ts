import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

/** Static media in /public never changes name, so browsers can keep it for 30 days. */
const mediaCache = [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Render metadata in <head> for every client (not streamed), for consistent SEO tooling results.
  htmlLimitedBots: /.*/,
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },
  experimental: { optimizePackageImports: ["lucide-react"] },
  serverExternalPackages: ["pg"],
  async redirects() {
    return [
      { source: "/refund-estimator", destination: "/get-started", permanent: true },
      // The old Vercel address (and links in emails already sent) → the real domain.
      // Only this production alias; preview deployments keep their own URLs.
      {
        source: "/:path*",
        has: [{ type: "host", value: "elite-website-eta.vercel.app" }],
        destination: "https://elitebtax.com/:path*",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/videos/:path*", headers: mediaCache },
      { source: "/brand/:path*", headers: mediaCache },
      { source: "/downloads/:path*", headers: mediaCache },
      // Temporary *.vercel.app addresses must not compete with the real domain in Google.
      {
        source: "/:path*",
        has: [{ type: "host", value: "(?<sub>.*)\\.vercel\\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
