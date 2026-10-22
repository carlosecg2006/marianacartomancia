import type { Metadata } from "next";
import { cormorant, jost } from "./fonts";
import "lenis/dist/lenis.css";
import "@/styles/main.scss";

export const metadata: Metadata = {
  title: "Mariana Dayrell",
  description: "Tiragens de tarô online com acolhimento e respiração do Kundalini Yoga.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${jost.variable}`}>
      <body>{children}</body>
    </html>
  );
}
