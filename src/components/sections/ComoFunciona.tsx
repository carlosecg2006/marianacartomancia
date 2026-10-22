import type { ReactNode } from "react";
import { Estrela } from "@/components/ornaments/Estrela";
import { Hera } from "@/components/ornaments/Hera";
import { Lua } from "@/components/ornaments/Lua";
import { Pentagrama } from "@/components/ornaments/Pentagrama";
import { Carta } from "@/components/ui/Carta";
import type { Conteudo } from "@/lib/validation/conteudo";
import styles from "./ComoFunciona.module.scss";

type Props = { comoFunciona: Conteudo["comoFunciona"] };

const ORNAMENTOS: ReactNode[] = [
  <Estrela key="estrela" />,
  <Lua key="lua" />,
  <Pentagrama key="pentagrama" />,
  <Hera key="hera" />,
];

// Blueprint "Drag row of moments": a ordem está nas palavras, não em números.
export function ComoFunciona({ comoFunciona }: Props) {
  return (
    <section
      id="como-funciona"
      data-phase="lunar"
      className={styles.secao}
      aria-labelledby="como-funciona-titulo"
    >
      <h2 id="como-funciona-titulo" className={styles.titulo}>
        {comoFunciona.titulo}
      </h2>

      {/* Focável: a fileira rola para o lado e precisa responder ao teclado. */}
      <ol className={styles.linha} aria-labelledby="como-funciona-titulo" tabIndex={0}>
        {comoFunciona.passos.map((passo, i) => (
          <li key={passo.titulo} className={styles.momento}>
            <h3 className={styles.legenda}>{passo.titulo}</h3>
            <p className={styles.texto}>{passo.texto}</p>
            <Carta as="div" className={styles.carta} formato="carta">
              <div className={styles.ornamento}>{ORNAMENTOS[i % ORNAMENTOS.length]}</div>
            </Carta>
          </li>
        ))}
      </ol>
    </section>
  );
}
