import { Estrela } from "@/components/ornaments/Estrela";
import type { Conteudo } from "@/lib/validation/conteudo";
import styles from "./Citacoes.module.scss";

type Props = { citacoes: Conteudo["citacoes"] };

// O campo vermelho do sol se pondo: o único "descanso" de cor cheia da página.
export function Citacoes({ citacoes }: Props) {
  if (citacoes.itens.length === 0) return null;

  return (
    <section id="citacoes" data-phase="solar" className={styles.secao} aria-labelledby="citacoes-titulo">
      <div className="grade">
        <h2 id="citacoes-titulo" className={styles.titulo}>
          {citacoes.titulo}
        </h2>
        <div className={styles.lista}>
          {citacoes.itens.map((c) => (
            <figure key={c.texto} className={styles.citacao}>
              <blockquote>
                <p>{c.texto}</p>
              </blockquote>
              <figcaption>{c.autoria}</figcaption>
            </figure>
          ))}
        </div>
      </div>
      <span className={styles.estrelas} aria-hidden="true">
        <Estrela />
        <Estrela />
        <Estrela />
      </span>
    </section>
  );
}
