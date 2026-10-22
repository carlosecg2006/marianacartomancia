import type { Metadata } from "next";
import { sitePublico } from "@/lib/site";
import { cormorant, jost } from "./fonts";
import "lenis/dist/lenis.css";
import "@/styles/main.scss";

export const metadata: Metadata = {
  title: "Mariana Dayrell",
  description: "Tiragens de tarô online com acolhimento e respiração do Kundalini Yoga.",
  robots: sitePublico ? undefined : { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${jost.variable}`}>
      <body>{children}</body>
    </html>
  );
}
