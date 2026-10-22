import Image from "next/image";
import { gravuras } from "@/content/gravuras";
import type { Conteudo } from "@/lib/validation/conteudo";
import styles from "./Consulta.module.scss";

type Props = { consulta: Conteudo["consulta"] };

// Blueprint "Title, note, facts row": título à esquerda, nota à direita,
// e os fatos da consulta numa linha, como os horários de um programa impresso.
export function Consulta({ consulta }: Props) {
  return (
    <section id="consulta" data-phase="lunar" className={styles.secao} aria-labelledby="consulta-titulo">
      <div className="grade">
        <h2 id="consulta-titulo" className={styles.titulo} data-revelar>
          {consulta.titulo}
        </h2>
        <div className={styles.nota} data-revelar>
          {consulta.paragrafos.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <dl className={styles.fatos} data-revelar-grupo>
          {consulta.fatos.map((f) => (
            <div key={f.valor} className={styles.fato}>
              <dt>{f.valor}</dt>
              <dd>{f.explicacao}</dd>
            </div>
          ))}
        </dl>

        <div className={styles.luas} data-revelar-grupo>
          {[gravuras.luaCrescente, gravuras.luaMinguante].map((g) => (
            <figure key={g.titulo} className={styles.lua}>
              <Image src={g.imagem} alt={g.alt} sizes="(min-width: 900px) 14rem, 45vw" />
              <figcaption>
                {g.titulo}, {g.autoria} ({g.data})
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
