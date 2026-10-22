import type { ReactNode } from "react";
import { Estrela } from "@/components/ornaments/Estrela";
import { Hera } from "@/components/ornaments/Hera";
import { Lua } from "@/components/ornaments/Lua";
import { Pentagrama } from "@/components/ornaments/Pentagrama";
import { Sol } from "@/components/ornaments/Sol";
import { Carta } from "@/components/ui/Carta";
import type { Conteudo } from "@/lib/validation/conteudo";
import styles from "./Baralho.module.scss";

type Props = { baralho: Conteudo["baralho"] };

// Ornamentos próprios no lugar da arte das cartas, que não é reproduzida.
const ORNAMENTOS: ReactNode[] = [
  <Sol key="sol" />,
  <Lua key="lua" />,
  <Pentagrama key="pentagrama" />,
  <Estrela key="estrela" />,
  <Hera key="hera" />,
];

export function Baralho({ baralho }: Props) {
  return (
    <section id="baralho" data-phase="crepusculo" className={styles.secao} aria-labelledby="baralho-titulo">
      <div className="grade">
        <div className={styles.texto}>
          <h2 id="baralho-titulo" className={styles.titulo}>
            {baralho.titulo}
          </h2>
          {baralho.paragrafos.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>

      {/* Focável: no celular a fileira rola para o lado e precisa responder ao teclado. */}
      <ul className={styles.cartas} aria-label="Algumas cartas do baralho" tabIndex={0}>
        {baralho.cartas.map((carta, i) => (
          <li key={carta.nome} className={styles.item}>
            <Carta numeral={carta.numeral} nome={carta.nome} as="div" className={styles.carta}>
              <div className={styles.ornamento}>{ORNAMENTOS[i % ORNAMENTOS.length]}</div>
            </Carta>
          </li>
        ))}
      </ul>
    </section>
  );
}
