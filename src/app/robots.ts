import type { MetadataRoute } from "next";
import { sitePublico } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Até o lançamento, nenhum buscador entra (o sitemap chega na F10).
  return sitePublico
    ? { rules: { userAgent: "*", allow: "/" } }
    : { rules: { userAgent: "*", disallow: "/" } };
}
