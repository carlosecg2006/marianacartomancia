import type { StaticImageData } from "next/image";
import brasil from "@/assets/gravuras/brasil-carta-1838.webp";
import sol from "@/assets/gravuras/bonasone-sol.webp";
import durer from "@/assets/gravuras/durer-mapa-celeste.webp";
import luaCheia from "@/assets/gravuras/mellan-lua-cheia.webp";
import luaCrescente from "@/assets/gravuras/mellan-lua-crescente.webp";
import luaMinguante from "@/assets/gravuras/mellan-lua-minguante.webp";

// Gravuras de domínio público do The Metropolitan Museum of Art (Open Access, CC0).
// Convertidas por scripts/preparar-gravuras.mjs; créditos também em docs/creditos-imagens.md.

export type Gravura = {
  imagem: StaticImageData;
  alt: string;
  titulo: string;
  autoria: string;
  data: string;
  pagina: string;
};

const MET = "https://www.metmuseum.org/art/collection/search/";

export const gravuras = {
  mapaCeleste: {
    imagem: durer,
    alt: "Mapa celeste do hemisfério norte, com as constelações desenhadas como figuras e os doze signos do zodíaco",
    titulo: "Mapa celeste do hemisfério norte",
    autoria: "Albrecht Dürer",
    data: "1515",
    pagina: `${MET}358366`,
  },
  sol: {
    imagem: sol,
    alt: "Gravura do Sol personificado: um homem com raios na cabeça aponta para o céu, sobre nuvens, ao lado de um leão",
    titulo: "Sol, da série dos Planetas",
    autoria: "Giulio Bonasone",
    data: "1530–70",
    pagina: `${MET}632379`,
  },
  luaCrescente: {
    imagem: luaCrescente,
    alt: "Gravura da lua no quarto crescente, com crateras e mares desenhados em linhas finas",
    titulo: "A lua no quarto crescente",
    autoria: "Claude Mellan",
    data: "1635",
    pagina: `${MET}393278`,
  },
  luaCheia: {
    imagem: luaCheia,
    alt: "Gravura da lua cheia, com crateras e mares desenhados em linhas finas",
    titulo: "Lua cheia",
    autoria: "Claude Mellan",
    data: "1635",
    pagina: `${MET}393543`,
  },
  luaMinguante: {
    imagem: luaMinguante,
    alt: "Gravura da lua no quarto minguante, com crateras e mares desenhados em linhas finas",
    titulo: "A lua no quarto minguante",
    autoria: "Claude Mellan",
    data: "1635",
    pagina: `${MET}359769`,
  },
  brasil: {
    imagem: brasil,
    alt: "Carta de baralho antiga com o mapa do Brasil e quatro naipes de espadas",
    titulo: "Brasil, do jogo de cartas “Court Game of Geography”",
    autoria: "William e Henry Rock",
    data: "1838–55",
    pagina: `${MET}719663`,
  },
} satisfies Record<string, Gravura>;

export const CREDITO_GRAVURAS =
  "Gravuras de domínio público do The Metropolitan Museum of Art (Open Access): Albrecht Dürer (1515), Giulio Bonasone (1530–70), Claude Mellan (1635) e William e Henry Rock (1838–55).";
