import type { NextConfig } from "next";
import { buildSecurityHeaders } from "./src/lib/security/headers";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  images: { formats: ["image/avif", "image/webp"] },
  sassOptions: {
    // Bootstrap 5.3 ainda usa @import e funções globais do Sass.
    quietDeps: true,
    silenceDeprecations: ["import", "global-builtin", "color-functions", "if-function"],
  },
  async headers() {
    return [{ source: "/(.*)", headers: buildSecurityHeaders({ isDev }) }];
  },
};

export default nextConfig;
