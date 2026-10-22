import { Cormorant_Garamond, Jost } from "next/font/google";

// Baixadas no build e servidas pelo próprio site: nenhuma chamada ao Google
// no navegador do visitante (LGPD e desempenho).
export const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const jost = Jost({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-jost",
  display: "swap",
});
