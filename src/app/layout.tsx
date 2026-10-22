import type { Metadata } from "next";
import "@/styles/main.scss";

export const metadata: Metadata = {
  title: "Mariana Dayrell",
  description: "Tiragens de tarô online com acolhimento e respiração do Kundalini Yoga.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
