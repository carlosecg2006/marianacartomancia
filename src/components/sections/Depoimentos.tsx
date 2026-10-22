import type { Conteudo } from "@/lib/validation/conteudo";
import styles from "./Depoimentos.module.scss";

type Props = { depoimentos: Conteudo["depoimentos"] };

// Blueprint "One long letter". A seção só aparece quando a Mari publicar depoimentos.
export function Depoimentos({ depoimentos }: Props) {
  if (depoimentos.itens.length === 0) return null;

  return (
    <section
      id="depoimentos"
      data-phase="lunar"
      className={styles.secao}
      aria-labelledby="depoimentos-titulo"
    >
      <div className={styles.coluna}>
        <h2 id="depoimentos-titulo" className={styles.titulo}>
          {depoimentos.titulo}
        </h2>
        {depoimentos.itens.map((d) => (
          <figure key={d.nome + d.texto.slice(0, 20)} className={styles.carta}>
            <blockquote>
              {d.texto.split("\n\n").map((p) => (
                <p key={p}>{p}</p>
              ))}
            </blockquote>
            <figcaption>{d.nome}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
