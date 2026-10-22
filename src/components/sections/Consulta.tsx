import type { Conteudo } from "@/lib/validation/conteudo";
import styles from "./Consulta.module.scss";

type Props = { consulta: Conteudo["consulta"] };

// Blueprint "Title, note, facts row": título à esquerda, nota à direita,
// e os fatos da consulta numa linha, como os horários de um programa impresso.
export function Consulta({ consulta }: Props) {
  return (
    <section id="consulta" data-phase="lunar" className={styles.secao} aria-labelledby="consulta-titulo">
      <div className="grade">
        <h2 id="consulta-titulo" className={styles.titulo}>
          {consulta.titulo}
        </h2>
        <div className={styles.nota}>
          {consulta.paragrafos.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <dl className={styles.fatos}>
          {consulta.fatos.map((f) => (
            <div key={f.valor} className={styles.fato}>
              <dt>{f.valor}</dt>
              <dd>{f.explicacao}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
