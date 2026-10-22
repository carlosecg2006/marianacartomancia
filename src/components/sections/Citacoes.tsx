import Image from "next/image";
import { Estrela } from "@/components/ornaments/Estrela";
import { gravuras } from "@/content/gravuras";
import type { Conteudo } from "@/lib/validation/conteudo";
import styles from "./Citacoes.module.scss";

type Props = { citacoes: Conteudo["citacoes"] };

// O campo vermelho do sol se pondo: o único "descanso" de cor cheia da página.
export function Citacoes({ citacoes }: Props) {
  if (citacoes.itens.length === 0) return null;

  return (
    <section id="citacoes" data-phase="solar" className={styles.secao} aria-labelledby="citacoes-titulo">
      <div className="grade">
        <h2 id="citacoes-titulo" className={styles.titulo} data-revelar>
          {citacoes.titulo}
        </h2>
        <figure className={styles.prancha} data-revelar>
          <Image src={gravuras.sol.imagem} alt={gravuras.sol.alt} sizes="(min-width: 900px) 18rem, 60vw" />
          <figcaption>
            {gravuras.sol.titulo}, {gravuras.sol.autoria} ({gravuras.sol.data})
          </figcaption>
        </figure>
        <div className={styles.lista} data-revelar-grupo>
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
      <span className={styles.estrelas} aria-hidden="true" data-estrelas>
        <Estrela />
        <Estrela />
        <Estrela />
      </span>
    </section>
  );
}
