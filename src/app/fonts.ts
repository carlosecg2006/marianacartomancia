import { Cormorant_Garamond, Jost } from "next/font/google";

// Baixadas no build e servidas pelo próprio site: nenhuma chamada ao Google
// no navegador do visitante (LGPD e desempenho).
// Só o necessário: subconjunto latino (cobre o português) e um peso por família
// de títulos, para não disputar banda com o CSS no celular.
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: "500",
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jost",
  display: "swap",
});
