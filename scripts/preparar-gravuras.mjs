// Converte os originais das gravuras (baixados do Met Open Access) para WebP
// leve em src/assets/gravuras. Uso: node scripts/preparar-gravuras.mjs <pasta-dos-originais>
// Origem, autoria e licença de cada uma: docs/creditos-imagens.md.
import { mkdirSync, statSync } from "node:fs";
import sharp from "sharp";

const origem = process.argv[2];
if (!origem) throw new Error("Informe a pasta dos originais.");

const SAIDA = "src/assets/gravuras";
const LIMITE = 300 * 1024; // CLAUDE.md: imagens com menos de 300 KB

const GRAVURAS = [
  // Textura de fundo do baralho: em cinza e mais leve (as linhas da xilogravura são densas).
  { id: 358366, nome: "durer-mapa-celeste", largura: 1100, cinza: true, qualidade: 50 },
  {
    id: 632379,
    nome: "bonasone-sol",
    largura: 900,
    recorte: { left: 724, top: 1020, width: 372, height: 606 },
  },
  { id: 393278, nome: "mellan-lua-crescente", largura: 640 },
  { id: 393543, nome: "mellan-lua-cheia", largura: 800 },
  { id: 359769, nome: "mellan-lua-minguante", largura: 640 },
  { id: 719663, nome: "brasil-carta-1838", largura: 480 },
];

mkdirSync(SAIDA, { recursive: true });

for (const g of GRAVURAS) {
  let img = sharp(`${origem}/${g.id}.jpg`);
  if (g.recorte) img = img.extract(g.recorte);
  if (g.cinza) img = img.grayscale();
  const destino = `${SAIDA}/${g.nome}.webp`;
  await img
    .resize({ width: g.largura, withoutEnlargement: true })
    .webp({ quality: g.qualidade ?? 72 })
    .toFile(destino);
  const tamanho = statSync(destino).size;
  if (tamanho > LIMITE) throw new Error(`${destino} tem ${tamanho} bytes (limite ${LIMITE}).`);
  console.log(`${destino}  ${(tamanho / 1024).toFixed(0)} KB`);
}
